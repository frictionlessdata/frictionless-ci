FROM python:3.10-bullseye

WORKDIR /repository

COPY . .

RUN \
  curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
  apt-get install -y nodejs && \
  npm install --omit dev && \
  pip install -r requirements.txt

ENTRYPOINT ["node", "/repository/lib/main.js"]
