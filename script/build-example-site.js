var marked = require('marked');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');

var basePath = path.resolve(__dirname, '../') + '/';

try {
  rimraf.sync(basePath + 'resource/example-site');
  fs.mkdirSync(basePath + 'resource/example-site');
} catch(e) {
  console.log(e);
}

var template = fs.readFileSync(basePath + 'resource/example-site.template.html', {encoding: 'utf-8'});
var readmeText = fs.readFileSync(basePath + 'README.md', {encoding: 'utf-8'});

var exampleSiteHtml = template
  .replace('<!-- REPLACE -->', marked(readmeText))
  .replace('src="resource', 'src="https://raw.githubusercontent.com/james-proxy/james/master/resource');

fs.writeFileSync(basePath + 'resource/example-site/index.html', exampleSiteHtml);