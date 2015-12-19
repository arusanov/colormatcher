'use strict';

var scheme = require('./scheme');
var stdin = process.stdin;
var stdout = process.stdout;
var inputChunks = [];

function getScheme(widgetData) {
  if (Array.isArray(widgetData)) {
    return widgetData.map(getScheme);
  } else {
    widgetData.style = scheme.generate(widgetData.style, widgetData.layout, widgetData.type);
    return widgetData;
  }
}

stdin.setEncoding('utf8');

stdin.on('data', function(chunk) {
  inputChunks.push(chunk);
});

stdin.on('end', function() {
  stdout.write(JSON.stringify(getScheme(JSON.parse(inputChunks.join(''))), null, ' ') + '\n');
});
