var marked = require('marked');
var fs = require('fs');

try {
  fs.rmdirSync('./resource/example-site');
  fs.mkdirSync('./resource/example-site');
} catch(e) {
  // don't care :)
}

var template = fs.readFileSync('./resource/example-site.template.html', {encoding: 'utf-8'});
var readmeText = fs.readFileSync('./README.md', {encoding: 'utf-8'});

var exampleSiteHtml = template
  .replace('<!-- REPLACE -->', marked(readmeText))
  .replace('src="resource', 'src="https://raw.githubusercontent.com/james-proxy/james/master/resource');

fs.writeFileSync('./resource/example-site/index.html', exampleSiteHtml);