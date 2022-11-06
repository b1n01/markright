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

const space = { type: 'space' }

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

doc -> (ws1|lb01):* blocks (ws1|lb01):*  {% ([,b]) => b %}
     | (ws1|lb01):* {% () => [] %}

blocks -> block ws0+ lb01 (ws0+ lb01):+ ws0+ blocks {% ([b,,,,,bs]) => [b, ...bs] %}
	    | block                           {% ([b]) => [b] %}
 
block -> mblock {% id %}

mblock -> h1                              {% ([h]) => ({type: 'h1', value: h}) %}
		| h2                              {% ([h]) => ({type: 'h2', value: h}) %}
        | p                               {% ([p]) => ({type: 'p', value: p}) %}

h1 -> %h1 (ws0+ inline):? {% ([,i]) => i?.[1] ? " " + i[1] : '' %}

h2 -> %h2 (ws0+ inline):? {% ([,i]) => i?.[1] ? " " + i[1] : '' %}

p -> inline {% id %}

inline -> (word|strong) ws0+ lb_ws01 inline {% ([[d],ws,o,i]) => [d, ...ws, ...o, ...i] %}
	    | (word|strong)                     {% ([[d],i])     => [d]           %}

strong -> %OS ws0+ lb_ws01 text ws0+ lb_ws01 %CS {% ([,ws,l,t]) => ({type: 'strong', value: [...ws, ...l, ...t]}) %}

text -> string (ws0+ lb01 ws0+ text):? {% ([s, i]) => {
	let text = [...s]
	if(i) {
		const [ws1, lb, ws2, t] = i
		const ws = [...ws1, ...lb, ...ws2].length ? [space] : []
		text.push(...ws, ...t)
	}
	return text
} %} 

string -> word ws1+ string {% ([w,ws,s]) => [w, ...ws, ...s] %}
	    | word             {% ([w])      => [w]                 %}

word -> %word {% ([w]) => ({ type: 'word', value: w.value }) %}

lb_ws01 -> (lb01 ws0+):? {% ([d]) => d?.length ? [space] : [] %}
ws0+    -> %ws:*         {% ([s]) => s.length ? [space] : []  %}
ws1+    -> %ws:+         {% ()    => [space]                  %}
ws1     -> %ws           {% ()    => [space]                  %}
lb01    -> %lb           {% ()    => [space]                  %}