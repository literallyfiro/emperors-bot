FROM denoland/deno:latest

RUN mkdir -p /app/emperors-bot/bot
WORKDIR /app/emperors-bot/bot

COPY . ./

RUN deno cache src/index.ts

CMD ["run", "--allow-net", "--allow-read", "--allow-env", "--allow-write", "src/index.ts"] 