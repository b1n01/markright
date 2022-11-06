// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const gen = (ast) => {
	let result = ''
	ast.forEach(node => {
		const value = Array.isArray(node.value) ? gen(node.value) : node.value
		switch (node.type) {
			case 'p':
				result += `<p>${value}</p>`
				break;
			case 'h1':
				result += `<h1>${value}</h1>`
				break;
			case 'h2':
				result += `<h2>${value}</h2>`
				break;
			case 'strong':
				result += `<strong>${value}</strong>`
				break;
			case 'space':
				result += ' '
				break;
			default:
				result += value
				break;
		}
	});
	return result
}

const moo = require("moo");
const lexer = moo.compile({
    h2: /^[^\S\r\n]*#{2}/,
    h1: /^[^\S\r\n]*#/,
	OS: "[s:",
	CS: "]",
	word: /[\w#]+/,
	ws: /[^\S\r\n]/,
	lb: { match: /[\n\r]/, lineBreaks: true },
});

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "doc$ebnf$1", "symbols": []},
    {"name": "doc$ebnf$1$subexpression$1", "symbols": ["ws1"]},
    {"name": "doc$ebnf$1$subexpression$1", "symbols": ["lb01"]},
    {"name": "doc$ebnf$1", "symbols": ["doc$ebnf$1", "doc$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "doc$ebnf$2", "symbols": []},
    {"name": "doc$ebnf$2$subexpression$1", "symbols": ["ws1"]},
    {"name": "doc$ebnf$2$subexpression$1", "symbols": ["lb01"]},
    {"name": "doc$ebnf$2", "symbols": ["doc$ebnf$2", "doc$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "doc", "symbols": ["doc$ebnf$1", "blocks", "doc$ebnf$2"], "postprocess": ([,b]) => gen(b)},
    {"name": "doc$ebnf$3", "symbols": []},
    {"name": "doc$ebnf$3$subexpression$1", "symbols": ["ws1"]},
    {"name": "doc$ebnf$3$subexpression$1", "symbols": ["lb01"]},
    {"name": "doc$ebnf$3", "symbols": ["doc$ebnf$3", "doc$ebnf$3$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "doc", "symbols": ["doc$ebnf$3"], "postprocess": () => []},
    {"name": "blocks$ebnf$1$subexpression$1", "symbols": ["ws0+", "lb01"]},
    {"name": "blocks$ebnf$1", "symbols": ["blocks$ebnf$1$subexpression$1"]},
    {"name": "blocks$ebnf$1$subexpression$2", "symbols": ["ws0+", "lb01"]},
    {"name": "blocks$ebnf$1", "symbols": ["blocks$ebnf$1", "blocks$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "blocks", "symbols": ["block", "ws0+", "lb01", "blocks$ebnf$1", "ws0+", "blocks"], "postprocess": ([b,,,,,bs]) => [b, ...bs]},
    {"name": "blocks", "symbols": ["block"], "postprocess": ([b]) => [b]},
    {"name": "block", "symbols": ["mblock"], "postprocess": id},
    {"name": "mblock", "symbols": ["h1"], "postprocess": ([h]) => ({type: 'h1', value: h})},
    {"name": "mblock", "symbols": ["h2"], "postprocess": ([h]) => ({type: 'h2', value: h})},
    {"name": "mblock", "symbols": ["p"], "postprocess": ([p]) => ({type: 'p', value: p})},
    {"name": "h1$ebnf$1$subexpression$1", "symbols": ["ws0+", "inline"]},
    {"name": "h1$ebnf$1", "symbols": ["h1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "h1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h1", "symbols": [(lexer.has("h1") ? {type: "h1"} : h1), "h1$ebnf$1"], "postprocess": ([,i]) => i?.[1] ? " " + i[1] : ''},
    {"name": "h2$ebnf$1$subexpression$1", "symbols": ["ws0+", "inline"]},
    {"name": "h2$ebnf$1", "symbols": ["h2$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "h2$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h2", "symbols": [(lexer.has("h2") ? {type: "h2"} : h2), "h2$ebnf$1"], "postprocess": ([,i]) => i?.[1] ? " " + i[1] : ''},
    {"name": "p", "symbols": ["inline"], "postprocess": id},
    {"name": "inline$subexpression$1", "symbols": ["word"]},
    {"name": "inline$subexpression$1", "symbols": ["strong"]},
    {"name": "inline", "symbols": ["inline$subexpression$1", "ws0+", "lb_ws01", "inline"], "postprocess": ([[d],ws,o,i]) => [d, ...ws, ...o, ...i]},
    {"name": "inline$subexpression$2", "symbols": ["word"]},
    {"name": "inline$subexpression$2", "symbols": ["strong"]},
    {"name": "inline", "symbols": ["inline$subexpression$2"], "postprocess": ([[d],i])     => [d]},
    {"name": "strong", "symbols": [(lexer.has("OS") ? {type: "OS"} : OS), "ws0+", "lb_ws01", "text", "ws0+", "lb_ws01", (lexer.has("CS") ? {type: "CS"} : CS)], "postprocess": ([,ws,l,t]) => ({type: 'strong', value: [...ws, ...l, ...t]})},
    {"name": "text", "symbols": ["string", "ws0+", "lb01", "ws0+", "text"], "postprocess": ([s,ws1,lb,ws2,t]) => [...s, ...ws1, ...lb, ...ws2, ...t]},
    {"name": "text", "symbols": ["string"], "postprocess": ([s])              => [...s]},
    {"name": "string", "symbols": ["word", "ws1+", "string"], "postprocess": ([w,ws,s]) => [w, ...ws, ...s]},
    {"name": "string", "symbols": ["word"], "postprocess": ([w])      => [w]},
    {"name": "word", "symbols": [(lexer.has("word") ? {type: "word"} : word)], "postprocess": ([w]) => ({ type: 'word', value: w.value })},
    {"name": "lb_ws01$ebnf$1$subexpression$1", "symbols": ["lb01", "ws0+"]},
    {"name": "lb_ws01$ebnf$1", "symbols": ["lb_ws01$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "lb_ws01$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "lb_ws01", "symbols": ["lb_ws01$ebnf$1"], "postprocess": ([d]) => d?.length ? [{ type: 'space' }] : []},
    {"name": "ws0+$ebnf$1", "symbols": []},
    {"name": "ws0+$ebnf$1", "symbols": ["ws0+$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ws0+", "symbols": ["ws0+$ebnf$1"], "postprocess": ([s]) => s.length ? [{ type: 'space' }] : []},
    {"name": "ws1+$ebnf$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "ws1+$ebnf$1", "symbols": ["ws1+$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ws1+", "symbols": ["ws1+$ebnf$1"], "postprocess": ()    => [{ type: 'space' }]},
    {"name": "ws1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": ()    => [{ type: 'space' }]},
    {"name": "lb01", "symbols": [(lexer.has("lb") ? {type: "lb"} : lb)], "postprocess": ()    => [{ type: 'space' }]}
]
  , ParserStart: "doc"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
