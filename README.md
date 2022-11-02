# Markright
Specification for the markright language. This document provides the language specifications and the formal grammar definition.

## Abstract
Markright is a markdown-inspired markup language. It aims to provide an easy and fast way to write HTML via a simpler and cleaner syntax. Here a simple example:
```
# Markright
This is the s[markright] specification.

Please read eu[carefully!]
---
<h1>Markright</h1>
<p>This is the <strong>markright</strong> specification.</p>
<p>Please read <em><u>carefully!</u></em></p> 
```

## Conventions
Examples in this document represent whitespace characters by a point symbol `‧` and linebreaks by a leftwards symbol `↩`. Each example is divided into two sections by three dashes `---`, the first section is the markright syntax and the second part is generate HTML.

## Elements
Markright is composed by three types of elements: block, inline and empty. Block elements can be further divided into: single line, multi line or fenced.

### Empty elements
Completely empty lines or lines with only whitespaces or linebreaks are considered empty elements and are not converted into HTML elements. They are only used to end block elements.

### Block elements
Block elements are defined by entire lines, delimited by linebreaks. There are three types of block elements: single line block elements, multi line block elements and fended block elements.

The difference between them is the way they end: single line block elements end with at least one linebreak, multi line block elements end with at least two linebreaks, fenced block elements end with a dedicated closing symbol.

#### Single line block elements
Single line block elements are defined within a single line.
```
#‧foo
---
<h1>foo</h1>
```

A single linebreak ends an element.
```
#‧foo↩
#‧bar
---
<h1>foo</h1>
<h1>bar</h1>
```

#### Multi line block elements
Multi line block elements are defined across multiple contiguous lines. Linebreaks are preserved.
```
foo↩
bar
---
<p>foo↩
bar</p>
```

Two consecutive linebreaks, or an empty line, end the element.
```
foo↩
↩
bar
---
<p>foo</p>
<p>bar</p>
```

#### Fenced block elements
Fenced block elements are delimited by an opening and closing symbol.
````
```↩
foo↩
```
---
<pre><code>foo</code></pre>
````

They can span across multiple lines.
````
```↩
foo↩
↩
bar↩
```
---
<pre><code>foo bar</code></pre>
````

### Spaces in block elements 
Initial and final spaces are removed
```
‧‧‧foo‧‧‧
---
<p>foo</p>
```

Multiple spaces are collapsed into one
```
foo‧‧‧bar
---
<p>foo‧bar</p>
```

Spaces before or after linebreaks are removed
```
foo‧‧‧↩
‧‧‧bar
---
<p>foo↩
bar</p>
```

#### Types of block elements
- Single line block:
    - Headings
- Multi line blocks
    - Paragraph
- Fenced blocks:
    - Fenced code

### Inline elements
Inline elements are elements defined within block elements. Differently from block elements, which are delimited by linebreaks, an inline element requires an opening and a closing notation. 

```
s[foo]
---
<p><strong>foo</strong></p>
```

Multiple inline elements can be defined within the same block elements.
```
s[foo]e[baz]
---
<p><strong>foo</strong>‧bar‧<em>baz</em></p>
```

Inline elements can be nested within other inline elements
```
se[foo]
---
<p><strong><em>foo</em></strong></p>
```

An inline element can span across multiple lines in a multi line block element. Linebreaks are preserved. 
```
s[foo↩
bar]
---
<p><strong>foo↩
bar</strong></p>
```

An inline element cannot span across multiple block elements. The block element definition wins over the inline element definition and the two blocks are split.
```
s[foo↩
↩
bar]
---
<p>s[foo</p>
<p>bar]</p>
```

#### Spaces in inline elements
Initial and final whitespaces are removed
```
s[‧‧‧foo‧‧‧]
---
<p><strong>foo</strong></p>
```

Multiple spaces are collapsed into one
```
s[foo‧‧‧bar]
---
<p><strong>foo‧bar</strong></p>
```

#### Types of inline elements
- Strong
- Emphasis
- Underline
- Delete
- Insert
- Inline code

## Paragraph
The paragraph is the fallback block element, it doesn't require special symbols. Any line that does not match any other block is considered a paragraph. 

```
foo
---
<p>foo</p>
```

## Headings
Headings are block elements identified by the hash `#` symbols, which must be the first non whitespace character in the line. There are six levels of headings.

```
# foo
## bar
### baz
#### foo
##### bar
###### baz
---
<h1>foo</h1>
<h2>bar</h2>
<h3>baz</h3>
<h4>foo</h4>
<h5>bar</h5>
<h6>baz</h6>
```

## Strong
```
s[foo]
---
<strong>foo</strong>
```

## Emphasis
```
e[foo]
---
<em>foo</em>
```

## Underline
```
u[foo]
---
<u>foo</u>
```

## Delete
```
d[foo]
---
<del>foo</del>
```

## Insert
```
i[foo]
---
<ins>foo</ins>
```

## Inline code 
```
c[foo]
---
<code>foo</code>
```

## Markdown comparison

### Strong
```
HTML:
<strong>foo</strong>

Markdown:
**foo**
__bar__

Markright:
s[foo]
```

### Emphasis
```
HTML:
<em>foo</em>

Markdown:
*foo*
_bar_

Markright:
e[foo]
```

### Nested inline elements
```
HTML:
<strong><em>foo</em></strong>

Markdown:
**_foo_**

Markright:
se[foo]
```
```
HTML:
<em><strong>foo</strong></em>

Markdown:
_**foo**_

Markright:
es[foo]
```