# Markright
Specification for a markdown-inspired markup language, called markright. This document provides the language specifications which can be expressed by a formal grammar notation.

As for markdown, markright aims to provide an easy and fast way to write HTML via a simpler and cleaner syntax.

## Conventions
Examples in this document represent whitespace characters by a point character "‧" and linebreaks by a negation character "¬". Markright syntax and HTML syntax are divided by three dashes "---".

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
foo¬
bar
---
<p>foo¬
bar</p>
```

One or more empty lines between two blocks of the same type split them into two separate blocks.
```
foo¬
¬
bar
---
<p>foo</p>
<p>bar</p>
```

Two consecutive lines with a different types of block elements are considered different blocks.
```
# foo¬
bar
---
<h1>foo</h1>
<p>bar</p>
```

Initial and final spaces are removed
```
‧‧‧foo‧bar‧‧‧
---
<p>foo‧bar</p>
```

Multiple spaces are collapsed into one
```
foo‧‧‧bar
---
<p>foo‧bar</p>
```

Spaces before or after linebreaks are removed
```
foo‧‧‧¬
‧‧‧bar
---
<p>foo¬
bar</p>
```

#### Types of block elements
- Paragraph
- Headings

### Inline elements
Inline elements are elements defined within block elements. Differently from block elements, which are delimited by linebreaks, an inline element requires an opening and a closing notation. 

```
**foo**
---
<p><strong>foo</strong></p>
```

Multiple inline elements can be defined within the same block elements.
```
**foo**__bar__
---
<p><strong>foo</strong><em>bar</em></p>
```

Some inline elements can be nested within other inline elements
```
**__foo__**
---
<p><strong><em>foo</em></strong></p>
```

Initial and final Whitespaces are removed
```
**‧‧‧foo‧‧‧**
---
<p><strong>foo</strong></p>
```

Multiple spaces are collapsed into one
```
**foo‧‧‧bar**
---
<p><strong>foo‧bar</strong></p>
```

An inline element can span across multiple fragments of the same block element.
```
**foo¬
bar**
---
<p><strong>foo¬
bar</strong></p>
```
An inline element cannot span across multiple block elements. The block element definition wins over the inline element definition and the two blocks are split.

```
**foo¬
¬
bar**
---
<p>**foo</p>
<p>bar**</p>
```

#### Types of inline elements
- Strong
- Italic
- Strike

## Paragraph
The paragraph is the "fallback" block element, it doesn't require special characters. Any line that does not match any other block is considered a paragraph. 

```
foo
---
<p>foo</p>
```

## Proposal

### Strong
```
HTML:
<strong>foo</strong>

Markdown:
**foo**
__bar__

Markright:
[s foo]
[s:foo]
[strong foo]
[strong:foo]
s[foo]
s:(foo)
```

### Emphasis
```
HTML:
<em>foo</em>

Markdown:
*foo*
_bar_

Markright:
[e foo]
```

### Deletion
```
HTML:
<del>foo</del>

Markdown:
Missing feature

Markright:
[d foo]
```

### Nested inline elemets
```
HTML:
<strong><em>foo</em></strong>

Markdown:
**_foo_**

Markright:
[se foo]
[s[d foo]]
```

