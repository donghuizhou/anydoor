const http = require('http');
const chalk = require('chalk');
const path = require('path');
const config = require('./config/defaultConfig.js');
const route = require('./helper/route.js');

const server = http.createServer((req, res) => {
  const filePath = path.join(config.root, req.url);
  route(req, res, filePath);
});

server.listen(config.post, config.hostname, () => {
  const addr = `http://${config.hostname}:${config.post}/`;
  console.info(`Server running at ${chalk.green(addr)}`);
});