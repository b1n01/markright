const tests = require('./tests.json')
const nearley = require("nearley")
const { exec } = require('child_process')

exec('node_modules/nearley/bin/nearleyc.js grammar.ne -o grammar.js', (err) => {
  if (err) {
    console.error(err)
  } else {
    const grammar = require("./grammar.js")
    tests.forEach(test => {
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
        parser.feed(test.markright)
        const html = parser.results[0]
        html != test.html 
            ? console.error('❌ Expected:', test.html, ', found: ', html)
            : console.log('👍', test.description)
    })
  }
})