'use strict';

var fs = require('fs');

var text = fs.readFileSync('test.md', 'utf8')

var md = require('markdown-it')();

var gridTable = require('./index');
md.use(gridTable);

var result = md.render(text);

console.log(result);
