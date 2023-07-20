import "https://deno.land/x/dotenv@v3.2.2/load.ts";
import { Bot, Context, session, SessionFlavor, InputFile } from "https://deno.land/x/grammy@v1.15.3/mod.ts";
import { run, sequentialize } from "https://deno.land/x/grammy_runner@v2.0.3/mod.ts";
import { type Conversation, type ConversationFlavor, conversations, createConversation } from "https://deno.land/x/grammy_conversations@v1.1.2/mod.ts";
import { hydrateReply, parseMode } from "https://deno.land/x/grammy_parse_mode@1.7.1/mod.ts";
import { type ParseModeFlavor } from "https://deno.land/x/grammy_parse_mode@1.7.1/mod.ts";
import { I18n, I18nFlavor } from "https://deno.land/x/grammy_i18n@v1.0.1/mod.ts";
import { autoRetry } from "https://esm.sh/@grammyjs/auto-retry@1.1.1";
import { limit } from "https://deno.land/x/grammy_ratelimiter@v1.2.0/mod.ts";
import { FileFlavor, hydrateFiles } from "https://deno.land/x/grammy_files@v1.0.4/mod.ts";
import { FileAdapter } from "https://deno.land/x/grammy_storages@v2.3.0/file/src/mod.ts";
import { new_king } from "./king.ts";
import { GroupData } from "./group_data.ts";
import { getImage } from "./requests.ts";

export type BotContext = Context & SessionFlavor<GroupData> & FileFlavor<Context> & ConversationFlavor & I18nFlavor;
export type BotConversation = Conversation<BotContext>;

function getNextDayTmstmp() {
    const currentDate = new Date();

    currentDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);

    return nextDay.getTime();
}

function checkNextDayAndReset(ctx: BotContext) {
    // Check if it's the next day. If so, reset all emperors.
    const currentDate = new Date();
    if (currentDate.getTime() >= ctx.session.nextDayTmstmp) {
        ctx.session.nextDayTmstmp = getNextDayTmstmp();
        for (const [name] of Object.entries(ctx.session.emperors)) {
            ctx.session.emperors[name]!.takenBy = undefined;
        }
    }
}

function getSessionKey(ctx: Context) {
    return ctx.chat?.id.toString();
}

const setupBot = () => {
    bot.use(hydrateReply);
    bot.api.config.use(hydrateFiles(bot.token));
    bot.api.config.use(autoRetry());
    bot.api.config.use(parseMode("HTML"));
    bot.use(limit());
    bot.use(sequentialize(getSessionKey));
    bot.use(session({
        getSessionKey: getSessionKey,
        initial: (): GroupData => ({ settings: { maxEmperorsPerUser: 2, emperorCooldown: 15 }, emperors: {}, nextDayTmstmp: 0 }),
        storage: new FileAdapter({ dirName: "sessions" }),
    }));
    bot.use(conversations());
    bot.use(new I18n<BotContext>({ defaultLocale: "en", directory: "locales", useSession: true }));
    bot.catch((err) => {
        const ctx = err.ctx;
        const e = err.error;
        console.error(`Error while handling update ${ctx.update.update_id}:`, e);
    });
}

const bot = new Bot<ParseModeFlavor<BotContext>>(Deno.env.get("TOKEN")!);
setupBot();

const groupActions = () => {
    const groupTypes = bot.chatType(["group", "supergroup"]);
    groupTypes.errorBoundary(
        (err) => console.error("Conversation threw an error!", err),
        createConversation(new_king),
    );
    groupTypes.command("newking", async (ctx) => { await ctx.conversation.enter("new_king"); })
    groupTypes.command("removeking", async (ctx) => {
        const text = ctx.message?.text.split(" ")[1];

        for (const [name] of Object.entries(ctx.session.emperors)) {
            if (name === text) {
                delete ctx.session.emperors[name];
                await ctx.reply(ctx.t("king-remove-removed", { name: name }));
                return;
            }
        }
        await ctx.reply(ctx.t("king-remove-does-not-exist", { name: text }));
    })
    groupTypes.command("listkings", async (ctx) => {
        if (Object.keys(ctx.session.emperors).length === 0) {
            await ctx.reply(ctx.t("list-no-emperors"));
            return;
        }
        let text = ctx.t("list-emperors");

        checkNextDayAndReset(ctx);

        text += "\n";
        for (const [name, emperor] of Object.entries(ctx.session.emperors)) {
            text += `${name} ${emperor?.takenBy != undefined ? "(👑)" : ""}\n`;
        }
        await ctx.reply(text);
    })
    groupTypes.on("message", async (ctx) => {
        const emperor = ctx.session.emperors[ctx.message.text!];
        if (emperor !== undefined) {
            
            checkNextDayAndReset(ctx);
            
            const name = ctx.message.text!;
            if (emperor.takenBy === ctx.from?.id) {
                await ctx.reply(ctx.t("already-conquered-by-you", { name: name }));
                return;
            }

            if (emperor.takenBy != undefined) {
                const chatMember = await ctx.getChatMember(emperor.takenBy);
                const firstName = chatMember.user.first_name;
                await ctx.reply(ctx.t("already-conquered", { name: name, conqueror: firstName }));
                return;
            }

            emperor.takenBy = ctx.from?.id;
            const image = await getImage(emperor.picture);
            await ctx.replyWithPhoto(new InputFile(image), { caption: ctx.t("conquered", { name: name, conqueror: ctx.from?.first_name }) });
        }
    })
}

groupActions();
bot.chatType("private").command("start", async (ctx) => {
    await ctx.reply(ctx.t("start"));
})

// Check if folder cache exists. If not, create it. If it does, delete all files in it.
const cacheDir = "cache";
try {
    await Deno.stat(cacheDir);
} catch (_e) {
    await Deno.mkdir(cacheDir);
}
for await (const dirEntry of Deno.readDir(cacheDir)) {
    await Deno.remove(`${cacheDir}/${dirEntry.name}`);
}

console.log("Bot is now running");
run(bot);
