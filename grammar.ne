@{%

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
		...spaces,
		OS: {match: /\[[sudice]{1,6}:/, push: 'inline'},
		word: /(?:(?!\[[sudice]{1,6}:)[^\s])+/,
	},
	inline: {
		word: /[^\s\]]+/,
		CS: {match: "]", pop: 1},
		...spaces,
	},
})

%}

@lexer lexer

doc -> (ws|lb):* blocks (ws|lb):*  {% ([,b]) => gen(b) %}
     | (ws|lb):*                   {% ()     => [] %}

blocks -> block ws0n lb (ws0n lb):+ ws0n blocks {% ([b,,,,,bs]) => [b, ...bs] %}
	    | block                                 {% ([b])        => [b]        %}
 
block -> mblock {% id %}

mblock -> headings  {% id %}
        | p         {% id %}

headings -> (%h1|%h2|%h3|%h4|%h5|%h6) (ws0n lbws01 inline):?
{% ([h,i]) => {
	console.log(h[0].type)
	return {type: h[0].type, value: i?.[2] || ''}
} %}


p -> inline {% ([p]) => ({type: 'p', value: p})  %}

inline -> (word|strong) (ws0n lbws01 inline):? 
{% ([data, other]) => {
	const hasSpaces = other?.[0].length || other?.[1].length
	const space = hasSpaces ? [typeSpace] : []
	const inline = other?.[2] || []
	return [...data, ...space, ...inline]
} %}

strong -> %OS ws0n lbws01 text ws0n lbws01 %CS 
{% ([os,ws,l,t]) => {
	const modifiers = os.value.slice(1, -1).split('')
	const uniq = [...new Set(modifiers)];
	let value = t
	uniq.reverse().forEach(modifier => {
		value = [{type: inlineTypes[modifier], value}]
	})
	return value[0]
} %}

text -> string (ws0n lb ws0n text):? 
{% ([string, other]) => {
	const space = other?.[0] || other?.[1] || other?.[2] ? [typeSpace] : []
	const inline = other?.[3] || []
	return [...string, ...space, ...inline]
} %} 

string -> word ws1n string {% ([w,ws,s]) => [w, ...ws, ...s] %}
	    | word             {% ([w])      => [w]              %}

word -> %word {% ([w]) => ({ type: 'word', value: w.value }) %}

ws     -> %ws         {% ()    => [typeSpace]                  %}
ws0n   -> %ws:*       {% ([s]) => s.length ? [typeSpace] : []  %}
ws1n   -> %ws:+       {% ()    => [typeSpace]                  %}
lb     -> %lb         {% ()    => [typeSpace]                  %}
lb01   -> %lb:?       {% ()    => [typeSpace]                  %}
lbws01 -> (lb ws0n):? {% ([d]) => d?.length ? [typeSpace] : [] %}