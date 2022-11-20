// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


const moo = require("moo")

//------
// Types
//------

const inlineTypes = {
	s: 'strong',
	e: 'em',
	u: 'u',
	d: 'del',
	i: 'ins',
	c: 'code',
}

const spaceElement = {
	type: 'space',
	value: ' ',
}

//-----------
// Formatters
//-----------

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
			case 'comment':
			case 'spaceRemoved':
				break;
			default:
	 			throw `${node.type} is not a valid type`
				break;
		}
	})
	return result
}

const fmtDoc = ([,b]) => {
	return gen(b?.[0] || [])
	//return b?.[0] || []
}

const fmtSections = ([b,bs]) => {
	return bs?.[4] ? [b, ...bs[4]] : [b] 
}

const fmtSection = ([d]) => {
	return d[0]
}

const fmtBlock = ([d]) => {
	return d[0]
}

const fmtHs = ([h,i]) => {
	const removedSpace = i?.[2].pop()
	return { type: h[0].type, value: i?.[2] || '' }
}

const fmtP = ([p]) => {
	const removedSpace = p[0].pop()
	const onlyCmts = p[0].reduce((acc, i) => {
		return acc && ["comment", "space", "spaceRemoved"].includes(i.type)
	}, true)
	//return { type: 'p', value: p[0] }
	return onlyCmts ? fmtCmt([,p[0][0]]) : { type: 'p', value: p[0] }
}

const fmtLine = ([data, other]) => {
	const line = other?.at(-1) || []
	const lastSpaceRemoved = line.pop()
	const endsWithCmt = line.length === 1 && line[0].type === 'comment'
	const startsWithCmt = data[0].type === 'comment'
	const hasSpaces = other?.[0]?.length || other?.[1]?.length
	const space = hasSpaces && !endsWithCmt && !startsWithCmt ? [spaceElement] : []
	const removedSpace = { type:'spaceRemoved', value: startsWithCmt && hasSpaces }
	
	if(lastSpaceRemoved?.value) {
		line.splice(1, 0, spaceElement)
	}

	return [...data, ...space, ...line, removedSpace]
}

const fmtInline = ([os,,,t]) => {
	const modifiers = os.value.slice(1, -1).split('')
	const uniq = [...new Set(modifiers)]
	let value = t || ''
	uniq.reverse().forEach(modifier => {
		value = [{type: inlineTypes[modifier], value}]
	})
	return value[0]
}

const fmtText = ([data, other]) => {
	const hasSpaces = other?.[0]?.length || other?.[1]?.length
	const space = hasSpaces ? [spaceElement] : []
	const line = other?.[2] || []
	return [...data, ...space, ...line]
}

const fmtWord = ([w]) => {
	return { type: 'word', value: w.value }
}

const fmtCmt = ([,c]) => {
	return { type: 'comment', value: c?.value || '' }
}
	
const fmtInlineCmt = ([,c,lb]) => {
	const last = lb?.[0].type === "EOL" ? lb?.[0].value : ''
	return { type: 'comment', value: c?.value + last || '' }
}

const fmtSpace = ([d]) => {
	return d.type || d.length ? [spaceElement] : []
}

//------
// Lexer
//------

const spaceTokens = {
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
		...spaceTokens,
		OI: {match: /\[[sudice]{1,6}:/, push: 'inline'},
		OBC: {match: "/*", push: 'blockCmt'},
		OIC: {match: "//", push: 'inlineCmt'},
		word: /(?:(?!\[[sudice]{1,6}:|\/\*|\/\/)[^\s])+/,
	},
	inline: {
		OBC: {match: "/*", push: 'blockCmt'},
		OIC: {match: "//", push: 'inlineCmt'},
		word: /(?:(?!\[[sudice]{1,6}:|\/\*|\/\/)[^\s\]])+/,
		CI: {match: "]", pop: 1},
		...spaceTokens,
	},
	blockCmt: {
		cmt: { match: /(?:(?!\*\/)[\S\s])+/, lineBreaks: true },
		CBC: {match: "*/", pop: 1},
		...spaceTokens,
	},
	inlineCmt: {
		lb: {match: /[\n\r]/, lineBreaks: true, pop: 1},
		EOL: {match: /[\S\s]$/, lineBreaks: true },
		cmt: { match: /[^\n\r]+(?=[^\n\r]$)/ },
	},
})

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "doc$ebnf$1", "symbols": []},
    {"name": "doc$ebnf$1$subexpression$1", "symbols": ["ws"]},
    {"name": "doc$ebnf$1$subexpression$1", "symbols": ["lb"]},
    {"name": "doc$ebnf$1", "symbols": ["doc$ebnf$1", "doc$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "doc$ebnf$2$subexpression$1$ebnf$1", "symbols": []},
    {"name": "doc$ebnf$2$subexpression$1$ebnf$1$subexpression$1", "symbols": ["ws"]},
    {"name": "doc$ebnf$2$subexpression$1$ebnf$1$subexpression$1", "symbols": ["lb"]},
    {"name": "doc$ebnf$2$subexpression$1$ebnf$1", "symbols": ["doc$ebnf$2$subexpression$1$ebnf$1", "doc$ebnf$2$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "doc$ebnf$2$subexpression$1", "symbols": ["sections", "doc$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "doc$ebnf$2", "symbols": ["doc$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "doc$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "doc", "symbols": ["doc$ebnf$1", "doc$ebnf$2"], "postprocess": fmtDoc},
    {"name": "sections$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["ws0n", "lb"]},
    {"name": "sections$ebnf$1$subexpression$1$ebnf$1", "symbols": ["sections$ebnf$1$subexpression$1$ebnf$1$subexpression$1"]},
    {"name": "sections$ebnf$1$subexpression$1$ebnf$1$subexpression$2", "symbols": ["ws0n", "lb"]},
    {"name": "sections$ebnf$1$subexpression$1$ebnf$1", "symbols": ["sections$ebnf$1$subexpression$1$ebnf$1", "sections$ebnf$1$subexpression$1$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "sections$ebnf$1$subexpression$1", "symbols": ["ws0n", "lb", "sections$ebnf$1$subexpression$1$ebnf$1", "ws0n", "sections"]},
    {"name": "sections$ebnf$1", "symbols": ["sections$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "sections$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "sections", "symbols": ["section", "sections$ebnf$1"], "postprocess": fmtSections},
    {"name": "section$subexpression$1", "symbols": ["block"]},
    {"name": "section", "symbols": ["section$subexpression$1"], "postprocess": fmtSection},
    {"name": "block$subexpression$1", "symbols": ["hs"]},
    {"name": "block$subexpression$1", "symbols": ["p"]},
    {"name": "block", "symbols": ["block$subexpression$1"], "postprocess": fmtBlock},
    {"name": "hs$subexpression$1", "symbols": [(lexer.has("h1") ? {type: "h1"} : h1)]},
    {"name": "hs$subexpression$1", "symbols": [(lexer.has("h2") ? {type: "h2"} : h2)]},
    {"name": "hs$subexpression$1", "symbols": [(lexer.has("h3") ? {type: "h3"} : h3)]},
    {"name": "hs$subexpression$1", "symbols": [(lexer.has("h4") ? {type: "h4"} : h4)]},
    {"name": "hs$subexpression$1", "symbols": [(lexer.has("h5") ? {type: "h5"} : h5)]},
    {"name": "hs$subexpression$1", "symbols": [(lexer.has("h6") ? {type: "h6"} : h6)]},
    {"name": "hs$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["lb", "ws0n"]},
    {"name": "hs$ebnf$1$subexpression$1$ebnf$1", "symbols": ["hs$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "hs$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "hs$ebnf$1$subexpression$1", "symbols": ["ws0n", "hs$ebnf$1$subexpression$1$ebnf$1", "line"]},
    {"name": "hs$ebnf$1", "symbols": ["hs$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "hs$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "hs", "symbols": ["hs$subexpression$1", "hs$ebnf$1"], "postprocess": fmtHs},
    {"name": "p$subexpression$1", "symbols": ["line"]},
    {"name": "p", "symbols": ["p$subexpression$1"], "postprocess": fmtP},
    {"name": "line$subexpression$1", "symbols": ["word"]},
    {"name": "line$subexpression$1", "symbols": ["inline"]},
    {"name": "line$subexpression$1", "symbols": ["blockCmt"]},
    {"name": "line$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["lb", "ws0n"]},
    {"name": "line$ebnf$1$subexpression$1$ebnf$1", "symbols": ["line$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "line$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "line$ebnf$1$subexpression$1", "symbols": ["ws0n", "line$ebnf$1$subexpression$1$ebnf$1", "line"]},
    {"name": "line$ebnf$1", "symbols": ["line$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "line$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "line", "symbols": ["line$subexpression$1", "line$ebnf$1"], "postprocess": fmtLine},
    {"name": "line$subexpression$2", "symbols": ["inlineCmt"]},
    {"name": "line$ebnf$2$subexpression$1", "symbols": ["ws0n", "line"]},
    {"name": "line$ebnf$2", "symbols": ["line$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "line$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "line", "symbols": ["line$subexpression$2", "line$ebnf$2"], "postprocess": fmtLine},
    {"name": "inline$ebnf$1$subexpression$1", "symbols": ["lb", "ws0n"]},
    {"name": "inline$ebnf$1", "symbols": ["inline$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "inline$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "inline$ebnf$2", "symbols": ["text"], "postprocess": id},
    {"name": "inline$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "inline$ebnf$3$subexpression$1", "symbols": ["lb", "ws0n"]},
    {"name": "inline$ebnf$3", "symbols": ["inline$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "inline$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "inline", "symbols": [(lexer.has("OI") ? {type: "OI"} : OI), "ws0n", "inline$ebnf$1", "inline$ebnf$2", "ws0n", "inline$ebnf$3", (lexer.has("CI") ? {type: "CI"} : CI)], "postprocess": fmtInline},
    {"name": "text$subexpression$1", "symbols": ["word"]},
    {"name": "text$subexpression$1", "symbols": ["inlineCmt"]},
    {"name": "text$subexpression$1", "symbols": ["blockCmt"]},
    {"name": "text$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["lb", "ws0n"]},
    {"name": "text$ebnf$1$subexpression$1$ebnf$1", "symbols": ["text$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "text$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "text$ebnf$1$subexpression$1", "symbols": ["ws0n", "text$ebnf$1$subexpression$1$ebnf$1", "text"]},
    {"name": "text$ebnf$1", "symbols": ["text$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "text$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "text", "symbols": ["text$subexpression$1", "text$ebnf$1"], "postprocess": fmtText},
    {"name": "word", "symbols": [(lexer.has("word") ? {type: "word"} : word)], "postprocess": fmtWord},
    {"name": "blockCmt$ebnf$1", "symbols": [(lexer.has("cmt") ? {type: "cmt"} : cmt)], "postprocess": id},
    {"name": "blockCmt$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "blockCmt", "symbols": [(lexer.has("OBC") ? {type: "OBC"} : OBC), "blockCmt$ebnf$1", (lexer.has("CBC") ? {type: "CBC"} : CBC)], "postprocess": fmtCmt},
    {"name": "inlineCmt$ebnf$1", "symbols": [(lexer.has("cmt") ? {type: "cmt"} : cmt)], "postprocess": id},
    {"name": "inlineCmt$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "inlineCmt$subexpression$1", "symbols": ["lb"]},
    {"name": "inlineCmt$subexpression$1", "symbols": [(lexer.has("EOL") ? {type: "EOL"} : EOL)]},
    {"name": "inlineCmt", "symbols": [(lexer.has("OIC") ? {type: "OIC"} : OIC), "inlineCmt$ebnf$1", "inlineCmt$subexpression$1"], "postprocess": fmtInlineCmt},
    {"name": "ws", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": fmtSpace},
    {"name": "ws0n$ebnf$1", "symbols": []},
    {"name": "ws0n$ebnf$1", "symbols": ["ws0n$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ws0n", "symbols": ["ws0n$ebnf$1"], "postprocess": fmtSpace},
    {"name": "ws1n$ebnf$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "ws1n$ebnf$1", "symbols": ["ws1n$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ws1n", "symbols": ["ws1n$ebnf$1"], "postprocess": fmtSpace},
    {"name": "lb", "symbols": [(lexer.has("lb") ? {type: "lb"} : lb)], "postprocess": fmtSpace},
    {"name": "lb01$ebnf$1", "symbols": [(lexer.has("lb") ? {type: "lb"} : lb)], "postprocess": id},
    {"name": "lb01$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "lb01", "symbols": ["lb01$ebnf$1"], "postprocess": fmtSpace}
]
  , ParserStart: "doc"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
