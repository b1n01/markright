const nearley = require("nearley");
const { exec } = require("child_process");

const tests = [
  // Paragraph
  {
    markright: "foo bar",
    html: "<p>foo bar</p>",
    description: "A paragraph",
  },
  {
    markright: "   foo   bar   ",
    html: "<p>foo bar</p>",
    description: "A paragraph with spacing",
  },
  {
    markright: "\nfoo\nbar\n",
    html: "<p>foo bar</p>",
    description: "A paragraph on multiple lines",
  },
  {
    markright: "   \n   foo   \n   bar   \n   ",
    html: "<p>foo bar</p>",
    description: "A paragraph on multiple lines with spacing",
  },
  {
    markright: "foo\n\nbar\n\n\nbaz",
    html: "<p>foo</p><p>bar</p><p>baz</p>",
    description: "Multiple paragraphs",
  },
  {
    markright: "   foo   \n   \n   bar   \n   \n   \n   baz",
    html: "<p>foo</p><p>bar</p><p>baz</p>",
    description: "Multiple paragraphs with spacing",
  },

  // H1
  {
    markright: "#foo bar",
    html: "<h1>foo bar</h1>",
    description: "An H1",
  },
  {
    markright: "   #   foo   bar   ",
    html: "<h1>foo bar</h1>",
    description: "An h1 with spacing",
  },
  {
    markright: "\n#\nfoo\nbar\n",
    html: "<h1>foo bar</h1>",
    description: "An H1 on multiple lines",
  },
  {
    markright: "   \n   #   \n   foo   \n   bar   \n   ",
    html: "<h1>foo bar</h1>",
    description: "An H1 on multiple lines with spacing",
  },
  {
    markright: "#foo\n\n#bar\n\n\n#baz",
    html: "<h1>foo</h1><h1>bar</h1><h1>baz</h1>",
    description: "Multiple h1s",
  },
  {
    markright: "   #   foo   \n   \n   #   bar   \n   \n   \n   #   baz", 
    html: "<h1>foo</h1><h1>bar</h1><h1>baz</h1>",
    description: "Multiple h1s with spacing",
  },

  // Strong
  {
    markright: "[s:foo bar]",
    html: "<p><strong>foo bar</strong></p>",
    description: "A strong",
  },
  {
    markright: "   [s:   foo   ]   [s:   bar   ]   ",
    html: "<p><strong>foo</strong><strong>bar</strong></p>",
    description: "A strong  with spacing",
  },
  {
    markright: "\n[s:\nfoo\nbar\n]\n",
    html: "<p><strong>foo bar</strong></p>",
    description: "A strong on multiple lines",
  },
  {
    markright: "   \n   [s:   \n   foo   \n   bar   \n   ]   \n   ",
    html: "<p><strong>foo bar</strong></p>",
    description: "A strong on multiple lines with spacing",
  },
  {
    markright: "[s:foo]\n\n[s:bar]\n\n\n[s:baz]",
    html: "<p><strong>foo</strong></p><p><strong>bar</strong></p><p><strong>baz</strong></p>",
    description: "Multiple strong",
  },
  {
    markright: "   [s:   foo   ]   \n   \n   [s:   bar   ]   \n   \n   \n   [s:   baz  ]   ",
    html: "<p><strong>foo</strong></p><p><strong>bar</strong></p><p><strong>baz</strong></p>",
    description: "Multiple strong with spacing",
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
