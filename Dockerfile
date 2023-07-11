FROM python:3

WORKDIR /repository

COPY . .

RUN \
  curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
  apt-get install -y nodejs npm && \
  npm install --production && \
  pip install --upgrade -r requirements.txt

ENTRYPOINT ["node", "/repository/lib/main.js"]
