import { readAll } from "https://deno.land/std@0.192.0/streams/read_all.ts";
import { encode } from "https://deno.land/std@0.193.0/encoding/base64.ts";
import { BotConversation, BotContext } from "./index.ts"
import { uploadImage } from "./requests.ts";

export async function new_king(conversation: BotConversation, ctx: BotContext) {
    await ctx.reply("Send me a file with the emperor's name...");
    const document = await conversation.waitFor(":photo");
    const emperor_name = document.msg.caption;

    if (emperor_name === undefined) {
        await ctx.reply(ctx.t("emperors-add-no-name"));
        return;
    }

    // check if emperor already exists
    if (conversation.session.emperors[emperor_name] !== undefined) {
        await ctx.reply(ctx.t("emperors-add-already-exists", { name: emperor_name }));
        return;
    }

    const file_info = await document.getFile();
    const path = await file_info.download(`cache/${file_info.file_unique_id}-${Date.now()}.jpg`);

    let response;
    await conversation.external(async () => {
        const downloaded_file = await Deno.open(path);
        // check if file is too big
        const size = await downloaded_file.stat().then((stat) => stat.size);
        if (size > 2 * 1024 * 1024) {
            await ctx.reply(ctx.t("emperors-add-file-too-big"));
            return;
        }

        // encode image to base64
        const base64 = encode(await readAll(downloaded_file));
        
        // upload image to the web and retrieve the image id
        response = await uploadImage(base64);
       
        // remove the file from the cache as it is no longer needed
        await Deno.remove(path);

        downloaded_file.close();
    }).catch(async (e) => {
        await ctx.reply(ctx.t("failed-to-add-emperor", { name: emperor_name }));~
        conversation.error("Failed to upload image", e);
        return;
    });

    if (response === undefined) {
        conversation.error("Failed to upload image");
        return;
    }

    conversation.session.emperors[emperor_name] = {
        picture: response["image_id"],
        takenBy: undefined
    }
    await ctx.reply(ctx.t("emperors-add-success", { name: emperor_name, id: response["image_id"] }));
}
