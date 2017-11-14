const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const config = require('../config/defaultConfig.js');
const mine = require('./mine.js');
const compress = require('./compress.js');
const range = require('./range.js');
const isFresh = require('./cache.js');

const tplPath = path.join(__dirname, '../templates/dir.tpl');
const source = fs.readFileSync(tplPath);
const template = Handlebars.compile(source.toString());

module.exports = async function (req, res, filePath) {
  try{
    const stats = await stat(filePath);
    if (stats.isFile()) {
      const contentType = mine(filePath);
      res.setHeader('Content-Type', contentType);

      if (isFresh(stats, req, res)) {
        res.statusCode = 304;
        res.end();
        return;
      }

      let rs;
      const {code, start, end} = range(stats.size, req, res);
      if (code === 200) {
        res.statusCode = 200;
        rs = fs.createReadStream(filePath);
      } else {
        res.statusCode = 206;
        rs = fs.createReadStream(filePath, {start, end});
      }
      if (filePath.match(config.compress)) {
        rs = compress(rs, req, res);
      }
      rs.pipe(res);
    } else if (stats.isDirectory()) {
      const files = await readdir(filePath);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      const dir = path.relative(config.root, filePath)
      const data = {
        title: path.basename(filePath),
        dir: dir ? `/${dir}` : '',
        files: files.map(file => {
          return {
            file,
            icon: mine(file)
          }
        })
      }
      res.end(template(data));
    }
  } catch (ex) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${ex}`);
  }
}