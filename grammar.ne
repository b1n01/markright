@{%

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
		word: /(?:(?!\[[sudice]{1,6}:|\/\*|\/\/)[^\s])+/,
	},
	inline: {
		OBC: {match: "/*", push: 'blockCmt'},
		word: /(?:(?!\[[sudice]{1,6}:|\/\*|\/\/)[^\s\]])+/,
		CI: {match: "]", pop: 1},
		...spaceTokens,
	},
	blockCmt: {
		cmt: { match: /(?:(?!\*\/)[\S\s])+/, lineBreaks: true },
		CBC: {match: "*/", pop: 1},
		...spaceTokens,
	}
})

%}

@lexer lexer

doc       -> (ws|lb):* (sections (ws|lb):*):?                    {% fmtDoc      %}
sections  -> section (ws0n lb (ws0n lb):+ ws0n sections):?       {% fmtSections %}
section   -> (block)                                             {% fmtSection  %}
block     -> (hs|p)                                              {% fmtBlock    %}
hs        -> (%h1|%h2|%h3|%h4|%h5|%h6) (ws0n (lb ws0n):? line):? {% fmtHs       %}
p         -> (line)                                              {% fmtP        %}
line      -> (word|inline|blockCmt) (ws0n (lb ws0n):? line):?    {% fmtLine     %}
inline    -> %OI ws0n (lb ws0n):? text:? ws0n (lb ws0n):? %CI    {% fmtInline   %}
text      -> (word|blockCmt) (ws0n (lb ws0n):? text):?           {% fmtText     %}
word      -> %word                                               {% fmtWord     %}
blockCmt  -> %OBC %cmt:? %CBC                                    {% fmtCmt      %}

ws        -> %ws                                                 {% fmtSpace    %}
ws0n      -> %ws:*                                               {% fmtSpace    %}
ws1n      -> %ws:+                                               {% fmtSpace    %}
lb        -> %lb                                                 {% fmtSpace    %}
lb01      -> %lb:?                                               {% fmtSpace    %}