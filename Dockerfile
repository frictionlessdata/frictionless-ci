FROM python:3

WORKDIR /repository

COPY . .

RUN \
  curl -fsSL https://deb.nodesource.com/setup_14.x | bash - && \
  apt-get install -y nodejs npm && \
  npm install --production && \
  pip install -r requirements.txt

ENTRYPOINT ["node", "/repository/lib/main.js"]