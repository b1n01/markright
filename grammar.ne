@{%
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

%}

@lexer lexer

doc -> (%ws|%lb):* blocks (%ws|%lb):*  {% ([,b]) => b %}
     | (%ws|%lb):* {% () => [] %}

blocks -> block %ws:* %lb (%ws:* %lb):+ %ws:* blocks {% ([b,,,,,bs]) => [b, ...bs] %}
	    | block                          {% ([b]) => [b] %}
 
block -> mblock               {% ([b]) => b %}

mblock -> h1                              {% ([h]) => ({type: 'h1', value: h}) %}
		| h2                              {% ([h]) => ({type: 'h2', value: h}) %}
        | p                               {% ([p]) => ({type: 'p', value: p}) %}

h1 -> %h1 (%ws:* inline):? {% ([,i]) => i?.[1] ? " " + i[1] : '' %}

h2 -> %h2 (%ws:* inline):? {% ([,i]) => i?.[1] ? " " + i[1] : '' %}

p -> inline {% ([i]) => i || '' %}

inline -> strong (%ws:* (%lb %ws:*):? inline):? {% ([s,i]) => [s, ...i?.[2] || ''] %}
		| %word  (%ws:* (%lb %ws:*):? inline):? {% ([s,i]) => [{type: 'word', value: s.value}, ...i?.[2] || ''] %}

strong -> %OS %ws:* (%lb %ws:*):? text %ws:* (%lb %ws:*):? %CS {% ([,,,t]) => ({type: 'strong', value: t}) %}

text -> string (%ws:* %lb %ws:* text):? {% ([t,p]) => t + (p?.[3] ? " " + p[3] : '') %}

string -> %word %ws:+ string {% ([w,,t]) => w.value + " " + t %}
	    | %word {% ([w]) => w.value %}