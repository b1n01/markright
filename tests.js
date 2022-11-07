const nearley = require("nearley");
const { exec } = require("child_process");

const tests = [
  //----------
  // Paragraph
  //----------

  {
    markright: "foo bar",
    html: "<p>foo bar</p>",
    description: "Paragraph",
  },
  {
    markright: "\nfoo\nbar\n",
    html: "<p>foo bar</p>",
    description: "Paragraph on multiple lines",
  },
  {
    markright: "   foo   bar   ",
    html: "<p>foo bar</p>",
    description: "Paragraph spacing",
  },
  {
    markright: "   \n   foo   \n   bar   \n   ",
    html: "<p>foo bar</p>",
    description: "Paragraph spacing on multiple lines",
  },
  {
    markright: "foo\n\nbar",
    html: "<p>foo</p><p>bar</p>",
    description: "Multiple paragraph",
  },
  {
    markright: "   foo   \n\n   bar   ",
    html: "<p>foo</p><p>bar</p>",
    description: "Spacing on multiple paragraphs",
  },
  {
    markright: "foo\n\n\nbar",
    html: "<p>foo</p><p>bar</p>",
    description: "Multiple line breaks",
  },

  //-------
  // Strong
  //-------

  {
    markright: "[s:foo]",
    html: "<p><strong>foo</strong></p>",
    description: "Strong",
  },
  {
    markright: "[s:foo][s:bar]",
    html: "<p><strong>foo</strong><strong>bar</strong></p>",
    description: "Multiple strong",
  },
  {
    markright: "\n[s:\nfoo\nbar\n]\n",
    html: "<p><strong>foo bar</strong></p>",
    description: "Strong on multiple lines",
  },
  {
    markright: "   [s:   foo   bar   ]   [s:baz]",
    html: "<p><strong>foo bar</strong><strong>baz qux</strong></p>",
    description: "Spacing on multiple strong",
  },
  {
    markright: "[s:foo   bar   ]   [s:baz]",
    html: "<p><strong>foo bar</strong><strong>baz qux</strong></p>",
    description: "Spacing on multiple strong",
  },
];

exec("node_modules/nearley/bin/nearleyc.js grammar.ne -o grammar.js", (err) => {
  if (err) {
    console.error(err);
  } else {
    const grammar = require("./grammar.js");
    let passed = (failed = 0);
    tests.forEach((test) => {
      const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
      parser.feed(test.markright);
      const html = parser.results[0];

      if (html != test.html) {
        console.log("❌", test.description);
        console.log(`   Expected: "${test.html}"\n   Found:    "${html}"`);
        failed++;
      } else {
        console.log("✅", test.description);
        passed++;
      }
    });

    console.log(
      "\n" + (failed ? "🚨" : "🎉"),
      `${passed}/${passed + failed} tests passed`
    );
  }
});
