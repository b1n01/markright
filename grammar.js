// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


const inlineTypes = {
	s: 'strong',
	e: 'em',
	u: 'u',
	d: 'del',
	i: 'ins',
	c: 'code',
}

const typeSpace = { type: 'space', value: ' ' }

const gen = (ast) => {
	let result = ''
	ast.forEach(node => {
		const value = Array.isArray(node.value) ? gen(node.value) : node.value
		switch (node.type) {
			case 'p':
			case 'h1':
			case 'h2':
			case 'h3':
			case 'h4':
			case 'h5':
			case 'h6':
			case 'strong':
			case 'em':
			case 'u':
			case 'ins':
			case 'del':
			case 'code':
				result += `<${node.type}>${value}</${node.type}>`
				break;
			case 'space':
			case 'word':
				result += value
				break;
			default:
	 			throw `${node.type} is not a valid type`
				break;
		}
	})
	return result
}

const moo = require("moo");

const spaces = {
	ws: /[^\S\r\n]/,
	lb: { match: /[\n\r]/, lineBreaks: true }
}

const lexer = moo.states({
	main:{
    	h6: /^[^\S\r\n]*#{6}/,
		h5: /^[^\S\r\n]*#{5}/,
		h4: /^[^\S\r\n]*#{4}/,
		h3: /^[^\S\r\n]*#{3}/,
		h2: /^[^\S\r\n]*#{2}/,
    	h1: /^[^\S\r\n]*#/,
		OS: {match: /\[[seduci]{1,6}:/, push: 'inline'},
		word: /(?:(?!\[[seduci]{1,6}:)[^\s])+/,
		...spaces,
	},
	inline: {
		word: /[^\s\]]+/,
		CS: {match: "]", pop: 1},
		...spaces,
	},
})

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "doc$ebnf$1", "symbols": []},
    {"name": "doc$ebnf$1$subexpression$1", "symbols": ["ws"]},
    {"name": "doc$ebnf$1$subexpression$1", "symbols": ["lb"]},
    {"name": "doc$ebnf$1", "symbols": ["doc$ebnf$1", "doc$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "doc$ebnf$2", "symbols": []},
    {"name": "doc$ebnf$2$subexpression$1", "symbols": ["ws"]},
    {"name": "doc$ebnf$2$subexpression$1", "symbols": ["lb"]},
    {"name": "doc$ebnf$2", "symbols": ["doc$ebnf$2", "doc$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "doc", "symbols": ["doc$ebnf$1", "blocks", "doc$ebnf$2"], "postprocess": ([,b]) => gen(b)},
    {"name": "doc$ebnf$3", "symbols": []},
    {"name": "doc$ebnf$3$subexpression$1", "symbols": ["ws"]},
    {"name": "doc$ebnf$3$subexpression$1", "symbols": ["lb"]},
    {"name": "doc$ebnf$3", "symbols": ["doc$ebnf$3", "doc$ebnf$3$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "doc", "symbols": ["doc$ebnf$3"], "postprocess": ()     => []},
    {"name": "blocks$ebnf$1$subexpression$1", "symbols": ["ws0n", "lb"]},
    {"name": "blocks$ebnf$1", "symbols": ["blocks$ebnf$1$subexpression$1"]},
    {"name": "blocks$ebnf$1$subexpression$2", "symbols": ["ws0n", "lb"]},
    {"name": "blocks$ebnf$1", "symbols": ["blocks$ebnf$1", "blocks$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "blocks", "symbols": ["block", "ws0n", "lb", "blocks$ebnf$1", "ws0n", "blocks"], "postprocess": ([b,,,,,bs]) => [b, ...bs]},
    {"name": "blocks", "symbols": ["block"], "postprocess": ([b])        => [b]},
    {"name": "block", "symbols": ["mblock"], "postprocess": id},
    {"name": "mblock", "symbols": ["h1"], "postprocess": ([h]) => ({type: 'h1', value: h})},
    {"name": "mblock", "symbols": ["h2"], "postprocess": ([h]) => ({type: 'h2', value: h})},
    {"name": "mblock", "symbols": ["h3"], "postprocess": ([h]) => ({type: 'h3', value: h})},
    {"name": "mblock", "symbols": ["h4"], "postprocess": ([h]) => ({type: 'h4', value: h})},
    {"name": "mblock", "symbols": ["h5"], "postprocess": ([h]) => ({type: 'h5', value: h})},
    {"name": "mblock", "symbols": ["h6"], "postprocess": ([h]) => ({type: 'h6', value: h})},
    {"name": "mblock", "symbols": ["p"], "postprocess": ([p]) => ({type: 'p', value: p})},
    {"name": "h1$ebnf$1$subexpression$1", "symbols": ["ws0n", "lbws01", "inline"]},
    {"name": "h1$ebnf$1", "symbols": ["h1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "h1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h1", "symbols": [(lexer.has("h1") ? {type: "h1"} : h1), "h1$ebnf$1"], "postprocess": ([,i]) => i?.[2] || ''},
    {"name": "h2$ebnf$1$subexpression$1", "symbols": ["ws0n", "lbws01", "inline"]},
    {"name": "h2$ebnf$1", "symbols": ["h2$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "h2$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h2", "symbols": [(lexer.has("h2") ? {type: "h2"} : h2), "h2$ebnf$1"], "postprocess": ([,i]) => i?.[2] || ''},
    {"name": "h3$ebnf$1$subexpression$1", "symbols": ["ws0n", "lbws01", "inline"]},
    {"name": "h3$ebnf$1", "symbols": ["h3$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "h3$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h3", "symbols": [(lexer.has("h3") ? {type: "h3"} : h3), "h3$ebnf$1"], "postprocess": ([,i]) => i?.[2] || ''},
    {"name": "h4$ebnf$1$subexpression$1", "symbols": ["ws0n", "lbws01", "inline"]},
    {"name": "h4$ebnf$1", "symbols": ["h4$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "h4$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h4", "symbols": [(lexer.has("h4") ? {type: "h4"} : h4), "h4$ebnf$1"], "postprocess": ([,i]) => i?.[2] || ''},
    {"name": "h5$ebnf$1$subexpression$1", "symbols": ["ws0n", "lbws01", "inline"]},
    {"name": "h5$ebnf$1", "symbols": ["h5$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "h5$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h5", "symbols": [(lexer.has("h5") ? {type: "h5"} : h5), "h5$ebnf$1"], "postprocess": ([,i]) => i?.[2] || ''},
    {"name": "h6$ebnf$1$subexpression$1", "symbols": ["ws0n", "lbws01", "inline"]},
    {"name": "h6$ebnf$1", "symbols": ["h6$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "h6$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h6", "symbols": [(lexer.has("h6") ? {type: "h6"} : h6), "h6$ebnf$1"], "postprocess": ([,i]) => i?.[2] || ''},
    {"name": "p", "symbols": ["inline"], "postprocess": id},
    {"name": "inline$subexpression$1", "symbols": ["word"]},
    {"name": "inline$subexpression$1", "symbols": ["strong"]},
    {"name": "inline$ebnf$1$subexpression$1", "symbols": ["ws0n", "lbws01", "inline"]},
    {"name": "inline$ebnf$1", "symbols": ["inline$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "inline$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "inline", "symbols": ["inline$subexpression$1", "inline$ebnf$1"], "postprocess":  ([data, other]) => {
        	const hasSpaces = other?.[0].length || other?.[1].length
        	const space = hasSpaces ? [typeSpace] : []
        	const inline = other?.[2] || []
        	return [...data, ...space, ...inline]
        } },
    {"name": "strong", "symbols": [(lexer.has("OS") ? {type: "OS"} : OS), "ws0n", "lbws01", "text", "ws0n", "lbws01", (lexer.has("CS") ? {type: "CS"} : CS)], "postprocess":  ([os,ws,l,t]) => {
        	const modifiers = os.value.slice(1, -1).split('')
        	const uniq = [...new Set(modifiers)];
        	let value = t
        	uniq.reverse().forEach(modifier => {
        		value = [{type: inlineTypes[modifier], value}]
        	})
        	return value[0]
        } },
    {"name": "text$ebnf$1$subexpression$1", "symbols": ["ws0n", "lb", "ws0n", "text"]},
    {"name": "text$ebnf$1", "symbols": ["text$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "text$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "text", "symbols": ["string", "text$ebnf$1"], "postprocess":  ([string, other]) => {
        	const space = other?.[0] || other?.[1] || other?.[2] ? [typeSpace] : []
        	const inline = other?.[3] || []
        	return [...string, ...space, ...inline]
        } },
    {"name": "string", "symbols": ["word", "ws1n", "string"], "postprocess": ([w,ws,s]) => [w, ...ws, ...s]},
    {"name": "string", "symbols": ["word"], "postprocess": ([w])      => [w]},
    {"name": "word", "symbols": [(lexer.has("word") ? {type: "word"} : word)], "postprocess": ([w]) => ({ type: 'word', value: w.value })},
    {"name": "ws", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": ()    => [typeSpace]},
    {"name": "ws0n$ebnf$1", "symbols": []},
    {"name": "ws0n$ebnf$1", "symbols": ["ws0n$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ws0n", "symbols": ["ws0n$ebnf$1"], "postprocess": ([s]) => s.length ? [typeSpace] : []},
    {"name": "ws1n$ebnf$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "ws1n$ebnf$1", "symbols": ["ws1n$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ws1n", "symbols": ["ws1n$ebnf$1"], "postprocess": ()    => [typeSpace]},
    {"name": "lb", "symbols": [(lexer.has("lb") ? {type: "lb"} : lb)], "postprocess": ()    => [typeSpace]},
    {"name": "lb01$ebnf$1", "symbols": [(lexer.has("lb") ? {type: "lb"} : lb)], "postprocess": id},
    {"name": "lb01$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "lb01", "symbols": ["lb01$ebnf$1"], "postprocess": ()    => [typeSpace]},
    {"name": "lbws01$ebnf$1$subexpression$1", "symbols": ["lb", "ws0n"]},
    {"name": "lbws01$ebnf$1", "symbols": ["lbws01$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "lbws01$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "lbws01", "symbols": ["lbws01$ebnf$1"], "postprocess": ([d]) => d?.length ? [typeSpace] : []}
]
  , ParserStart: "doc"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
