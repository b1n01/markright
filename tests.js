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
    description: `A ${n}`,
  },
  {
    markright: `   ${s}   foo   bar   `,
    html: `<${t}>foo bar</${t}>`,
    description: `A ${n} with spaces`,
  },
  {
    markright: `\n${s}\nfoo\nbar\n`,
    html: `<${t}>foo bar</${t}>`,
    description: `A ${n} on multiple lines`,
  },
  {
    markright: `   \n   ${s}   \n   foo   \n   bar   \n  `,
    html: `<${t}>foo bar</${t}>`,
    description: `A ${n} on multiple lines with spacing`,
  },
  {
    markright: `${s}foo\n\n${s}bar\n\n\n${s}baz`,
    html: `<${t}>foo</${t}><${t}>bar</${t}><${t}>baz</${t}>`,
    description: `Multiple ${n}s`,
  },
  {
    markright: `   ${s}   foo   \n   \n   ${s}   bar   \n   \n   \n   ${s}   baz`,
    html: `<${t}>foo</${t}><${t}>bar</${t}><${t}>baz</${t}>`,
    description: `Multiple ${n}s with spacing`,
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
    description: `A ${n}`,
  },
  {
    markright: `   ${o}   foo   ${c}   ${o}   bar   ${c}   `,
    html: `<p><${t}>foo</${t}> <${t}>bar</${t}></p>`,
    description: `A ${n} with spacing`,
  },
  {
    markright: `\n${o}\nfoo\nbar\n${c}\n`,
    html: `<p><${t}>foo bar</${t}></p>`,
    description: `A ${n} on multiple lines`,
  },
  {
    markright: `   \n   ${o}   \n   foo   \n   bar   \n   ${c}   \n   `,
    html: `<p><${t}>foo bar</${t}></p>`,
    description: `A ${n} on multiple lines with spacing`,
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
      const html = parser.results[0];

      if (html != test.html) {
        console.log(`[${index + 1}/${tests.length}] ❌ ${test.description}`);
        console.log(`   Expected: "${test.html}"\n   Found:    "${html}"`);
        failed++;
      } else {
        console.log(`[${index + 1}/${tests.length}] ✅`, test.description);
        passed++;
      }
    });

    console.log(
      "\n" + (failed ? "🚨" : "🎉"),
      `${passed}/${passed + failed} tests passed`
    );
  }
});
