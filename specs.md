# Markright
Specification for a markdown-inspired markup language, called markright. This document provides the language specifications which can be expressed by a formal grammar notation.

As for markdown, markright aims to provide an easy and fast way to write HTML via a simpler and cleaner syntax.

## Conventions
Examples in this document represent whitespace characters by a point symbol "‧" and linebreaks by a leftwards symbol "↩". Markright syntax and HTML syntax are divided by three dashes "---".

## Elements
There are three types of elements: block, inline and empty.

### Empty elements
Completely empty lines or lines with only whitespaces or linebreaks are considered empty elements and are not converted into HTML elements. They are only used to end block elements.

### Block elements
Block elements are defined by entire lines, delimited by linebreaks.

```
foo
---
<p>foo</p>
```

Consecutive lines with the same type of block element are considered a single block. Each line is sometimes called a "fragment". Linebreaks are preserved.
```
foo↩
bar
---
<p>foo↩
bar</p>
```

One or more empty lines between two blocks of the same type split them into two separate blocks.
```
foo↩
↩
bar
---
<p>foo</p>
<p>bar</p>
```

Two consecutive lines with a different types of block elements are considered different blocks.
```
# foo↩
bar
---
<h1>foo</h1>
<p>bar</p>
```

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
- Paragraph
- Headings

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

An inline element can span across multiple fragments of the same block element.
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

#### Types of inline elements
- Strong
- Emphasis
- Underline
- Delete
- Insert

## Paragraph
The paragraph is the "fallback" block element, it doesn't require special symbols. Any line that does not match any other block is considered a paragraph. 

```
foo
---
<p>foo</p>
```

## Headings
Headings are block elements identified by the hash # symbols, which must be the first non whitespace character in the line. There are six levels of headings.

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

## Full example
```
# Markright
## Documentation 
This is the s[markright] doc.
Please read eu[carefully!]

d[Enjoi!]i[Enjoy!]
---
<h1>Markright</h1>
<h2>Documentation</h2>
<p>This is the <strong>markright</strong> doc. Please read <em><u>carefully!</em></u></p> 
<p><del>Enjoi!</del><ins>Enjoy!</ins></p>
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