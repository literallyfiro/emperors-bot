# Emperors
Introducing Emperors - Reignite Your Group's Spirit!

Emperors is here to breathe new life into your group! With this simple yet engaging concept, you can create unlimited emperors using photos of your choice.


## Running with Docker (recommended)
1. Clone the repository with `git clone https://github.com/ImOnlyFire/emperors-bot/`
2. Rename the `bot/.env.example` file to `.env` and insert your bot token
3. If you want to, you can modify the messages by editing `bot/locales/<your-language>.ftl`
4. Run `docker compose up`
5. Done

## Running manually
1. Install `python3`, [`deno`](https://deno.land/manual@v1.35.2/getting_started/installation) and `screen` to simplify your work
2. Clone the repository with `git clone https://github.com/ImOnlyFire/emperors-bot/`
3. Rename the `bot/.env.example` file to `.env` and insert your bot token
4. If you want to, you can modify the messages by editing `bot/locales/<your-language>.ftl`
5. Inside the `bot` directory, create a screen with `screen -S <screen-name>`, then run `deno cache src/index.ts` and `deno start src/index.ts`
6. Exit the current screen with `CTRL+A`, then `d`
7. Inside the `image_server` directory, create a screen with `screen -S <screen-name>`, run `pip install -r requirements.txt` and `python server.py`
