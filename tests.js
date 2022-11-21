const nearley = require("nearley");
const { exec } = require("child_process");

/**
 * Get tests for a block element
 * @param {string} name The name of the block element
 * @param {string} s The opening symbol
 * @param {string} tag The HTML tag
 * @returns array
 */
const blockTests = (n, s, t) => [
  {
    markright: `${s}foo bar`,
    html: `<${t}>foo bar</${t}>`,
    description: `${n}`,
  },
  {
    markright: `   ${s}   foo   bar   `,
    html: `<${t}>foo bar</${t}>`,
    description: `${n} with spaces`,
  },
  {
    markright: `\n${s}\nfoo\nbar\n`,
    html: `<${t}>foo bar</${t}>`,
    description: `${n} on multiple lines`,
  },
  {
    markright: `   \n   ${s}   \n   foo   \n   bar   \n  `,
    html: `<${t}>foo bar</${t}>`,
    description: `${n} on multiple lines with spacing`,
  },
  {
    markright: `${s}foo\n\n${s}bar\n\n\n${s}baz`,
    html: `<${t}>foo</${t}><${t}>bar</${t}><${t}>baz</${t}>`,
    description: `Multiple ${n}`,
  },
  {
    markright: `   ${s}   foo   \n   \n   ${s}   bar   \n   \n   \n   ${s}   baz`,
    html: `<${t}>foo</${t}><${t}>bar</${t}><${t}>baz</${t}>`,
    description: `Multiple ${n} with spacing`,
  },
];

/**
 * Get tests for an inline element
 * @param {string} n The name of the inline element
 * @param {string} o The opening symbol
 * @param {string} c The closing symbol
 * @param {string} t The HTML tah
 * @returns array
 */
const inlineTests = (n, o, c, t) => [
  {
    markright: `${o}foo bar${c}`,
    html: `<p><${t}>foo bar</${t}></p>`,
    description: `${n}`,
  },
  {
    markright: `   ${o}   foo   ${c}   ${o}   bar   ${c}   `,
    html: `<p><${t}>foo</${t}> <${t}>bar</${t}></p>`,
    description: `${n} with spacing`,
  },
  {
    markright: `\n${o}\nfoo\nbar\n${c}\n`,
    html: `<p><${t}>foo bar</${t}></p>`,
    description: `${n} on multiple lines`,
  },
  {
    markright: `   \n   ${o}   \n   foo   \n   bar   \n   ${c}   \n   `,
    html: `<p><${t}>foo bar</${t}></p>`,
    description: `${n} on multiple lines with spacing`,
  },
  {
    markright: `${o}foo${c}\n\n${o}bar${c}\n\n\n${o}baz${c}`,
    html: `<p><${t}>foo</${t}></p><p><${t}>bar</${t}></p><p><${t}>baz</${t}></p>`,
    description: `Multiple ${n}`,
  },
  {
    markright: `   ${o}   foo   ${c}   \n   \n   ${o}   bar   ${c}   \n   \n   \n   ${o}   baz  ${c}   `,
    html: `<p><${t}>foo</${t}></p><p><${t}>bar</${t}></p><p><${t}>baz</${t}></p>`,
    description: `Multiple ${n} with spacing`,
  },
];

/**
 * Get tests for the comment element
 * @returns array
 */
const commentTests = () => [
  {
    markright: `/*foo bar*/`,
    html: ``,
    description: `Comment`,
  },
  {
    markright: `   /*   foo bar   */   `,
    html: ``,
    description: `Comment with spaces`,
  },
  {
    markright: `\n/*\nfoo\nbar*/\n`,
    html: ``,
    description: `Comment on multiple lines`,
  },
  {
    markright: `   \n   /*   \n   foo   \n   bar   \n  */   \n   `,
    html: ``,
    description: `Comment on multiple lines with spacing`,
  },
  {
    markright: `/*foo*/\n\n/*bar*/\n\n\n/*baz*/`,
    html: ``,
    description: `Multiple comments`,
  },
  {
    markright: `   /*   foo   */   \n   \n   /*   bar   */   \n   \n   \n   /*   baz   */   `,
    html: ``,
    description: `Multiple comment with spacing`,
  },
  {
    markright: `foo/*bar*/`,
    html: `<p>foo</p>`,
    description: `Comment after a paragraph`,
  },
  {
    markright: `foo   /*   bar   */   `,
    html: `<p>foo</p>`,
    description: `Comment after a paragraph with spacing`,
  },
  {
    markright: `/*foo*/bar`,
    html: `<p>bar</p>`,
    description: `Comment before a paragraph`,
  },
  {
    markright: `   /*   foo   */   bar`,
    html: `<p>bar</p>`,
    description: `Comment before a paragraph with spacing`,
  },
  {
    markright: `#foo/*bar*/`,
    html: `<h1>foo</h1>`,
    description: `Comment after an H1`,
  },
  {
    markright: `#foo   /*   bar   */   `,
    html: `<h1>foo</h1>`,
    description: `Comment after an H1 with spacing`,
  },
  {
    markright: `/*foo*/#bar`,
    html: `<p>#bar</p>`,
    description: `Comment before an H1`,
  },
  {
    markright: `   /*   foo   */   #bar`,
    html: `<p>#bar</p>`,
    description: `Comment before an H1 with spacing`,
  },
];

const inlineCommentTests = () => [
  {
    markright: `//foo`,
    html: ``,
    description: `Inline comment`,
  }, 
];

const tests = [
  ...blockTests("Paragraph", "", "p"),
  ...blockTests("H1", "#", "h1"),
  ...blockTests("H2", "##", "h2"),
  ...blockTests("H3", "###", "h3"),
  ...blockTests("H4", "####", "h4"),
  ...blockTests("H5", "#####", "h5"),
  ...blockTests("H6", "######", "h6"),
  ...inlineTests("Strong", "[s:", "]", "strong"),
  ...inlineTests("Emphasis", "[e:", "]", "em"),
  ...inlineTests("Underline", "[u:", "]", "u"),
  ...inlineTests("Delete", "[d:", "]", "del"),
  ...inlineTests("Insert", "[i:", "]", "ins"),
  ...inlineTests("Code", "[c:", "]", "code"),
  ...commentTests(),
  ...inlineCommentTests(),
];

exec("node_modules/nearley/bin/nearleyc.js grammar.ne -o grammar.js", (err) => {
  if (err) {
    console.error(err);
  } else {
    const grammar = require("./grammar.js");
    let passed = (failed = 0);
    tests.forEach((test, index) => {
      const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
      parser.feed(test.markright);
      const ok = parser.results.reduce((passed, html) => passed && html === test.html, true)
      const ambiguousAlert = parser.results.length > 1 ? `[grammar is ambiguous, ${parser.results.length} results found]` : '';

      if (!ok) {
        const html = parser.results[0]
        console.log(`❌ ${test.description}`, ambiguousAlert);
        console.log(`   Expected: "${test.html}"\n   Found:    "${html}"`);
        failed++;
      } else {
        console.log(`✅`, test.description, ambiguousAlert);
        passed++;
      }
    });

    if(failed) {
      console.log(`\n 🚨 ${failed} test${failed > 1? 's' : ''} out of ${passed + failed} failed`);
    } else {
      console.log(`\n 🎉${passed + failed > 1 ? 'All' : ''} ${passed + failed} test${passed + failed > 1 ? 's' : ''} passed`);
    }
  }
});
