@{%

const moo = require("moo")

//------
// Types
//------

const inlineTypes = {
	s: "strong",
	e: "em",
	u: "u",
	d: "del",
	i: "ins",
	c: "code",
}

const spaceElement = {
	type: "space",
	value: " "
}

//-----------
// Formatters
//-----------

const gen = (ast) => {
	let result = ""
	ast.forEach(node => {
		const value = Array.isArray(node.value) ? gen(node.value) : node.value
		switch (node.type) {
			case "p":
			case "h1":
			case "h2":
			case "h3":
			case "h4":
			case "h5":
			case "h6":
			case "strong":
			case "em":
			case "u":
			case "ins":
			case "del":
			case "code":
				result += `<${node.type}>${value}</${node.type}>`
				break
			case "space":
			case "word":
				result += value
				break
			default:
	 			throw `${node.type} is not a valid type`
				break
		}
	})
	return result
}

const fmtHs = ([h,i]) => {
	return {type: h[0].type, value: i?.[2] || ""}
}

const fmtP = ([p]) => {
	return {type: "p", value: p}
}

const fmtLine = ([data, other]) => {
	const hasSpaces = other?.[0].length || other?.[1].length
	const space = hasSpaces ? [spaceElement] : []
	const line = other?.[2] || []
	return [...data, ...space, ...line]
}

const fmtInline = ([os,,,t]) => {
	const modifiers = os.value.slice(1, -1).split("")
	const uniq = [...new Set(modifiers)]
	let value = t
	uniq.reverse().forEach(modifier => {
		value = [{type: inlineTypes[modifier], value}]
	})
	return value[0]
}

const fmtText = ([string, other]) => {
	const space = other?.[0] || other?.[1] || other?.[2] ? [spaceElement] : []
	const text = other?.[3] || []
	return [...string, ...space, ...text]
}

const fmtString = ([w,s]) => {
	return s?.length ? [w, ...s[0], ...s[1]] : [w]
}

const fmtWord = ([w]) => {
	return { type: "word", value: w.value }
}

const fmtBlocks = ([b,bs]) => {
	return bs?.[4] ? [b, ...bs[4]] : [b] 
}

const fmtDoc = ([,b]) => {
	return gen(b?.[0] || [])
}

const fmtSpace = () => {
	return [spaceElement]
}

const fmtMBlock = ([d]) => {
	return d[0]
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
		OI: {match: /\[[sudice]{1,6}:/, push: "inline"},
		comment: {match: "//", push: "comment"},
		word: /(?:(?!\[[sudice]{1,6}:)[^\s])+/,
	},
	inline: {
		word: /[^\s\]]+/,
		CI: {match: "]", pop: 1},
		...spaceTokens,
	},
	comment: {
		word: /[^\r\n]+/,
		lb: { match: /[\n\r]/, lineBreaks: true, pop: 1 },
	},
})

%}

@lexer lexer

doc    -> (ws|lb):* (blocks (ws|lb):*):?                      {% fmtDoc    %}
blocks -> block (ws0n lb (ws0n lb):+ ws0n blocks):?           {% fmtBlocks %}
block  -> mblock                                              {% id        %}
mblock -> (hs|p)                                              {% fmtMBlock %}
hs     -> (%h1|%h2|%h3|%h4|%h5|%h6) (ws0n (lb ws0n):? line):? {% fmtHs     %}
p      -> line                                                {% fmtP      %}
line   -> (word|inline) (ws0n (lb ws0n):? line):?             {% fmtLine   %}
inline -> %OI ws0n (lb ws0n):? text ws0n (lb ws0n):? %CI      {% fmtInline %}
text   -> string (ws0n lb ws0n text):?                        {% fmtText   %} 
string -> word (ws1n string):?                                {% fmtString %}
word   -> %word                                               {% fmtWord   %}

ws     -> %ws   {% fmtSpace %}
ws0n   -> %ws:* {% fmtSpace %}
ws1n   -> %ws:+ {% fmtSpace %}
lb     -> %lb   {% fmtSpace %}
lb01   -> %lb:? {% fmtSpace %}