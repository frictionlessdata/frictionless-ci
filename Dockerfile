FROM python:3

COPY . .

RUN \
  pip install frictionless[excel] \
  curl -fsSL https://deb.nodesource.com/setup_14.x | bash - \
  apt-get install -y nodejs \
  npm install --production

ENTRYPOINT ["node", "/lib/main.js"]
