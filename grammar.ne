@{%
const moo = require("moo");
const lexer = moo.compile({
	lb: { match: /[\n\r]/, lineBreaks: true },
	ws: /[^\S\r\n]/,
   	word: /\w+/,
	"#": "#",
});
%}

@lexer lexer

mr -> empty {% id %}
	| block {% id %}
 
empty -> %ws:* %lb:? {% ([w]) => [] %}

block -> sblock {% id %}
	| mblock {% id %}

sblock -> h1 %lb:? {% id %}

h1 -> %ws:* "#" %ws:* text:? {% ([,,,w])=>({t: 'h1',v: w}) %}

mblock -> p {% ([p])=>({t: 'p',v: p}) %}

p -> %ws:* text (%lb p):? {% ([,t,p]) => t + (p?.[1] ? " " + p?.[1] : '') %}

text -> %word %ws:+ text {% ([w,,t]) => w.value + " " + t %}
	| %word %ws:* {% ([w]) => w.value %}