# Markright

## 1. Abstract

This document provides the specifications and the formal grammar definition for the Markright language

## 2. Introduction

Markright is a markdown-inspired markup language. It aims to provide an easy and fast way to write HTML via a simpler and cleaner syntax. Here a simple example:
```
# Markright

This is the [s:Markright] specification

Please read [eu:carefully!]
---
<h1>Markright</h1>
<p>This is the <strong>Markright</strong> specification.</p>
<p>Please read <em><u>carefully!</u></em></p> 
```

## 3. Conventions

Examples in this document represent whitespace characters by a point symbol `‧` and linebreaks by a leftwards symbol `↩`. Each example is divided into two sections by three dashes `---`, the first section is the Markright syntax and the second part is generate HTML

## 4. Syntax

Markright syntax has four types of elements:
 
- Empty
- Block
- Inline
- Fenced

### 4.1 Empty elements

Completely empty lines or lines with only whitespaces or linebreaks are considered empty elements and are not converted into HTML. They are only used to delimit other blocks

### 4.2 Block elements

Block elements are defined by entire lines, delimited by linebreaks

```
foo
---
<p>foo</p>
```

A single linebreak is converted into a whitespace

```
foo↩
bar
---
<p>foo‧bar</p>
```

Two consecutive linebreaks, or an empty element, end the block element

```
foo↩
↩
bar
---
<p>foo</p>
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

### 4.3 Inline elements

Inline elements are elements defined within block elements. Differently from block elements, which are delimited by linebreaks, an inline element requires an opening and a closing notation

```
[s:foo]
---
<p><strong>foo</strong></p>
```

Multiple inline elements can be defined within the same block elements

```
[s:foo]‧[e:baz]
---
<p><strong>foo</strong>‧<em>baz</em></p>
```

Inline elements can be nested within other inline elements

```
s[e:foo]
---
<p><strong><em>foo</em></strong></p>
```

An inline element can span across multiple lines within a block element

```
[s:foo↩
bar]
---
<p><strong>foo‧bar</strong></p>
```

An inline element cannot span across multiple block elements. The block element definition wins over the inline element definition and the two blocks are split

```
[s:foo↩
↩
bar]
---
<p>[s:foo</p>
<p>bar]</p>
```

Initial and final whitespaces are removed

```
[s:‧‧‧foo‧‧‧]
---
<p><strong>foo</strong></p>
```

Multiple spaces are collapsed into one

```
[s:foo‧‧‧bar]
---
<p><strong>foo‧bar</strong></p>
```

### 4.4 Fenced elements

Fenced elements are delimited by an opening and closing symbol

````
```↩
foo↩
```
---
<pre><code>foo</code></pre>
````

They can span across multiple lines

````
```↩
foo↩
↩
bar↩
```
---
<pre><code>foo bar</code></pre>
````

## 5 Reference

### 5.1 Paragraph

The paragraph is the fallback block element, it doesn't require special symbols. Any line that does not match any other block is considered a paragraph

```
foo
---
<p>foo</p>
```

### 5.2 Headings

Headings are block elements identified by the hash `#` symbols, which must be the first non whitespace character in the line. There are six levels of headings. All spaces between the last `#` and the first character of the heading are removed.

```
# foo
## bar
### baz
### foo
#### bar
##### baz
---
<h1>foo</h1>
<h2>bar</h2>
<h3>baz</h3>
<h4>foo</h4>
<h5>bar</h5>
<h6>baz</h6>
```

### 5.3 Strong

```
[s:foo]
---
<strong>foo</strong>
```

### 5.4 Emphasis

```
[e:foo]
---
<em>foo</em>
```

### 5.5 Underline

```
[u:foo]
---
<u>foo</u>
```

### 5.6 Delete

```
[d:foo]
---
<del>foo</del>
```

### 5.7 Insert

```
[i:foo]
---
<ins>foo</ins>
```

### 5.8 Inline code 

```
[c:foo]
---
<code>foo</code>
```

## 6 Markdown comparison

### 6.1 Strong

```
HTML:
<strong>foo</strong>

Markdown:
**foo**
__bar__

Markright:
[s:foo]
```

### 6.2 Emphasis
```
HTML:
<em>foo</em>

Markdown:
*foo*
_bar_

Markright:
[e:foo]
```

### 6.3 Nested inline elements
```
Markdown
**_foo_**

Markright
[se:foo]

HTML
<strong><em>foo</em></strong>

```
```
Markdown
_**foo**_

Markright
[es:foo]

HTML
<em><strong>foo</strong></em>
```
