FROM python:3

COPY . .

RUN \
  curl -fsSL https://deb.nodesource.com/setup_14.x | bash - && \
  apt-get install -y nodejs && \
  npm install --production && \
  pip install frictionless[excel]

ENTRYPOINT ["node", "/lib/main.js"]
