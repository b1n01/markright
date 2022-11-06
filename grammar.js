// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const generate = (ast) => {
	let result = ''
	ast.forEach(node => {
		let value = node.value
		if(Array.isArray(value)) {
			value = generate(node.value)
		} 
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
    {"name": "doc$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "doc$ebnf$1$subexpression$1", "symbols": [(lexer.has("lb") ? {type: "lb"} : lb)]},
    {"name": "doc$ebnf$1", "symbols": ["doc$ebnf$1", "doc$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "doc$ebnf$2", "symbols": []},
    {"name": "doc$ebnf$2$subexpression$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "doc$ebnf$2$subexpression$1", "symbols": [(lexer.has("lb") ? {type: "lb"} : lb)]},
    {"name": "doc$ebnf$2", "symbols": ["doc$ebnf$2", "doc$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "doc", "symbols": ["doc$ebnf$1", "blocks", "doc$ebnf$2"], "postprocess": ([,b]) => b},
    {"name": "doc$ebnf$3", "symbols": []},
    {"name": "doc$ebnf$3$subexpression$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "doc$ebnf$3$subexpression$1", "symbols": [(lexer.has("lb") ? {type: "lb"} : lb)]},
    {"name": "doc$ebnf$3", "symbols": ["doc$ebnf$3", "doc$ebnf$3$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "doc", "symbols": ["doc$ebnf$3"], "postprocess": () => []},
    {"name": "blocks$ebnf$1", "symbols": []},
    {"name": "blocks$ebnf$1", "symbols": ["blocks$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "blocks$ebnf$2$subexpression$1$ebnf$1", "symbols": []},
    {"name": "blocks$ebnf$2$subexpression$1$ebnf$1", "symbols": ["blocks$ebnf$2$subexpression$1$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "blocks$ebnf$2$subexpression$1", "symbols": ["blocks$ebnf$2$subexpression$1$ebnf$1", (lexer.has("lb") ? {type: "lb"} : lb)]},
    {"name": "blocks$ebnf$2", "symbols": ["blocks$ebnf$2$subexpression$1"]},
    {"name": "blocks$ebnf$2$subexpression$2$ebnf$1", "symbols": []},
    {"name": "blocks$ebnf$2$subexpression$2$ebnf$1", "symbols": ["blocks$ebnf$2$subexpression$2$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "blocks$ebnf$2$subexpression$2", "symbols": ["blocks$ebnf$2$subexpression$2$ebnf$1", (lexer.has("lb") ? {type: "lb"} : lb)]},
    {"name": "blocks$ebnf$2", "symbols": ["blocks$ebnf$2", "blocks$ebnf$2$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "blocks$ebnf$3", "symbols": []},
    {"name": "blocks$ebnf$3", "symbols": ["blocks$ebnf$3", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "blocks", "symbols": ["block", "blocks$ebnf$1", (lexer.has("lb") ? {type: "lb"} : lb), "blocks$ebnf$2", "blocks$ebnf$3", "blocks"], "postprocess": ([b,,,,,bs]) => [b, ...bs]},
    {"name": "blocks", "symbols": ["block"], "postprocess": ([b]) => [b]},
    {"name": "block", "symbols": ["mblock"], "postprocess": ([b]) => b},
    {"name": "mblock", "symbols": ["h1"], "postprocess": ([h]) => ({type: 'h1', value: h})},
    {"name": "mblock", "symbols": ["h2"], "postprocess": ([h]) => ({type: 'h2', value: h})},
    {"name": "mblock", "symbols": ["p"], "postprocess": ([p]) => ({type: 'p', value: p})},
    {"name": "h1$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "h1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["h1$ebnf$1$subexpression$1$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "h1$ebnf$1$subexpression$1", "symbols": ["h1$ebnf$1$subexpression$1$ebnf$1", "inline"]},
    {"name": "h1$ebnf$1", "symbols": ["h1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "h1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h1", "symbols": [(lexer.has("h1") ? {type: "h1"} : h1), "h1$ebnf$1"], "postprocess": ([,i]) => i?.[1] ? " " + i[1] : ''},
    {"name": "h2$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "h2$ebnf$1$subexpression$1$ebnf$1", "symbols": ["h2$ebnf$1$subexpression$1$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "h2$ebnf$1$subexpression$1", "symbols": ["h2$ebnf$1$subexpression$1$ebnf$1", "inline"]},
    {"name": "h2$ebnf$1", "symbols": ["h2$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "h2$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h2", "symbols": [(lexer.has("h2") ? {type: "h2"} : h2), "h2$ebnf$1"], "postprocess": ([,i]) => i?.[1] ? " " + i[1] : ''},
    {"name": "p", "symbols": ["inline"], "postprocess": ([i]) => i || ''},
    {"name": "inline$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "inline$ebnf$1$subexpression$1$ebnf$1", "symbols": ["inline$ebnf$1$subexpression$1$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "inline$ebnf$1$subexpression$1$ebnf$2$subexpression$1$ebnf$1", "symbols": []},
    {"name": "inline$ebnf$1$subexpression$1$ebnf$2$subexpression$1$ebnf$1", "symbols": ["inline$ebnf$1$subexpression$1$ebnf$2$subexpression$1$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "inline$ebnf$1$subexpression$1$ebnf$2$subexpression$1", "symbols": [(lexer.has("lb") ? {type: "lb"} : lb), "inline$ebnf$1$subexpression$1$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "inline$ebnf$1$subexpression$1$ebnf$2", "symbols": ["inline$ebnf$1$subexpression$1$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "inline$ebnf$1$subexpression$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "inline$ebnf$1$subexpression$1", "symbols": ["inline$ebnf$1$subexpression$1$ebnf$1", "inline$ebnf$1$subexpression$1$ebnf$2", "inline"]},
    {"name": "inline$ebnf$1", "symbols": ["inline$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "inline$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "inline", "symbols": ["strong", "inline$ebnf$1"], "postprocess": ([s,i]) => [s, ...i?.[2] || '']},
    {"name": "inline$ebnf$2$subexpression$1$ebnf$1", "symbols": []},
    {"name": "inline$ebnf$2$subexpression$1$ebnf$1", "symbols": ["inline$ebnf$2$subexpression$1$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "inline$ebnf$2$subexpression$1$ebnf$2$subexpression$1$ebnf$1", "symbols": []},
    {"name": "inline$ebnf$2$subexpression$1$ebnf$2$subexpression$1$ebnf$1", "symbols": ["inline$ebnf$2$subexpression$1$ebnf$2$subexpression$1$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "inline$ebnf$2$subexpression$1$ebnf$2$subexpression$1", "symbols": [(lexer.has("lb") ? {type: "lb"} : lb), "inline$ebnf$2$subexpression$1$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "inline$ebnf$2$subexpression$1$ebnf$2", "symbols": ["inline$ebnf$2$subexpression$1$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "inline$ebnf$2$subexpression$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "inline$ebnf$2$subexpression$1", "symbols": ["inline$ebnf$2$subexpression$1$ebnf$1", "inline$ebnf$2$subexpression$1$ebnf$2", "inline"]},
    {"name": "inline$ebnf$2", "symbols": ["inline$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "inline$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "inline", "symbols": [(lexer.has("word") ? {type: "word"} : word), "inline$ebnf$2"], "postprocess": ([s,i]) => [{type: 'word', value: s.value}, ...i?.[2] || '']},
    {"name": "strong$ebnf$1", "symbols": []},
    {"name": "strong$ebnf$1", "symbols": ["strong$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "strong$ebnf$2$subexpression$1$ebnf$1", "symbols": []},
    {"name": "strong$ebnf$2$subexpression$1$ebnf$1", "symbols": ["strong$ebnf$2$subexpression$1$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "strong$ebnf$2$subexpression$1", "symbols": [(lexer.has("lb") ? {type: "lb"} : lb), "strong$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "strong$ebnf$2", "symbols": ["strong$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "strong$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "strong$ebnf$3", "symbols": []},
    {"name": "strong$ebnf$3", "symbols": ["strong$ebnf$3", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "strong$ebnf$4$subexpression$1$ebnf$1", "symbols": []},
    {"name": "strong$ebnf$4$subexpression$1$ebnf$1", "symbols": ["strong$ebnf$4$subexpression$1$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "strong$ebnf$4$subexpression$1", "symbols": [(lexer.has("lb") ? {type: "lb"} : lb), "strong$ebnf$4$subexpression$1$ebnf$1"]},
    {"name": "strong$ebnf$4", "symbols": ["strong$ebnf$4$subexpression$1"], "postprocess": id},
    {"name": "strong$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "strong", "symbols": [(lexer.has("OS") ? {type: "OS"} : OS), "strong$ebnf$1", "strong$ebnf$2", "text", "strong$ebnf$3", "strong$ebnf$4", (lexer.has("CS") ? {type: "CS"} : CS)], "postprocess": ([,,,t]) => ({type: 'strong', value: t})},
    {"name": "text$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "text$ebnf$1$subexpression$1$ebnf$1", "symbols": ["text$ebnf$1$subexpression$1$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "text$ebnf$1$subexpression$1$ebnf$2", "symbols": []},
    {"name": "text$ebnf$1$subexpression$1$ebnf$2", "symbols": ["text$ebnf$1$subexpression$1$ebnf$2", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "text$ebnf$1$subexpression$1", "symbols": ["text$ebnf$1$subexpression$1$ebnf$1", (lexer.has("lb") ? {type: "lb"} : lb), "text$ebnf$1$subexpression$1$ebnf$2", "text"]},
    {"name": "text$ebnf$1", "symbols": ["text$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "text$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "text", "symbols": ["string", "text$ebnf$1"], "postprocess": ([t,p]) => t + (p?.[3] ? " " + p[3] : '')},
    {"name": "string$ebnf$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "string$ebnf$1", "symbols": ["string$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "string", "symbols": [(lexer.has("word") ? {type: "word"} : word), "string$ebnf$1", "string"], "postprocess": ([w,,t]) => w.value + " " + t},
    {"name": "string", "symbols": [(lexer.has("word") ? {type: "word"} : word)], "postprocess": ([w]) => w.value}
]
  , ParserStart: "doc"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
