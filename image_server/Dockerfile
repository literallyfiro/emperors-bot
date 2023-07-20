FROM python:3.9.1-slim

RUN mkdir -p /app/emperors-bot/image_server
WORKDIR /app/emperors-bot/image_server

COPY . ./

# Expose port 8000 for the server
EXPOSE 8000

RUN pip install -r requirements.txt

CMD ["python", "server.py"]
