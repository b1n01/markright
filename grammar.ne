@{%

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
	})
	
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

%}

@lexer lexer

doc -> (ws|lb):* blocks (ws|lb):*  {% ([,b]) => gen(b) %}
     | (ws|lb):*                   {% ()     => [] %}

blocks -> block ws0n lb (ws0n lb):+ ws0n blocks {% ([b,,,,,bs]) => [b, ...bs] %}
	    | block                                 {% ([b])        => [b]        %}
 
block -> mblock {% id %}

mblock -> h1                              {% ([h]) => ({type: 'h1', value: h}) %}
		| h2                              {% ([h]) => ({type: 'h2', value: h}) %}
        | p                               {% ([p]) => ({type: 'p', value: p})  %}

h1 -> %h1 (ws0n lbws01 inline):? {% ([,i]) => i?.[2] || '' %}
h2 -> %h2 (ws0n lbws01 inline):? {% ([,i]) => i?.[2] || '' %}

p -> inline {% id %}

inline -> (word|strong) (ws0n lbws01 inline):? 
{% ([data, other]) => {
	const isWord = data[0].type === 'word'
	const hasSpaces = other?.[0] || other?.[1]
	const space = isWord && hasSpaces ? [{ type: 'space' }] : []
	const inline = other?.[2] || []
	return [...data, ...space, ...inline]
} %}

strong -> %OS ws0n lbws01 text ws0n lbws01 %CS {% ([,ws,l,t]) => ({type: 'strong', value: t}) %}

text -> string (ws0n lb ws0n text):? 
{% ([string, other]) => {
	const space = other?.[0] || other?.[1] || other?.[2] ? [{ type: 'space' }] : []
	const inline = other?.[3] || []
	return [...string, ...space, ...inline]
} %} 

string -> word ws1n string {% ([w,ws,s]) => [w, ...ws, ...s] %}
	    | word             {% ([w])      => [w]              %}

word -> %word {% ([w]) => ({ type: 'word', value: w.value }) %}

ws     -> %ws         {% ()    => [{ type: 'space' }]                  %}
ws0n   -> %ws:*       {% ([s]) => s.length ? [{ type: 'space' }] : []  %}
ws1n   -> %ws:+       {% ()    => [{ type: 'space' }]                  %}
lb     -> %lb         {% ()    => [{ type: 'space' }]                  %}
lb01   -> %lb:?       {% ()    => [{ type: 'space' }]                  %}
lbws01 -> (lb ws0n):? {% ([d]) => d?.length ? [{ type: 'space' }] : [] %}