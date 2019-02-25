# MarkdownIt Grid Tables

[![Build Status](https://travis-ci.org/basverweij/markdown-it-gridtables.svg?branch=develop)](https://travis-ci.org/basverweij/markdown-it-gridtables)
[![Coverage Status](https://coveralls.io/repos/github/basverweij/markdown-it-gridtables/badge.svg?branch=develop)](https://coveralls.io/github/basverweij/markdown-it-gridtables?branch=develop)

[MarkdownIt](https://github.com/markdown-it/markdown-it) plugin for [Pandoc Grid Tables](https://pandoc.org/MANUAL.html#tables).

## Usage

Install:

```sh
npm install --save markdown-it-gridtables
```

Use as a MarkdownIt plugin:

```typescript
import * as MarkdownIt from "markdown-it";
import gridTableRulePlugin from "markdown-it-gridtables";

const md = MarkdownIt();
md.use(gridTableRulePlugin);

const html = md.render("...");
console.log(html);
```

## Development

Checkout:

```sh
git clone https://github.com/basverweij/markdown-it-gridtables.git
```

Clean:

```sh
npm run clean
```

Build:

```sh
npm run build
```

Test:

```sh
npm run test
```
