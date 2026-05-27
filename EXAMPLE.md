# catmd EXAMPLE — formatting showcase

Use this file to eyeball rendering:

```bash
npm run catmd -- EXAMPLE.md
# or, after build:
node dist/cli.js EXAMPLE.md
```

Pipe through a narrow width to stress wrapping:

```bash
catmd --width 40 EXAMPLE.md
```

---

## Headings

# Heading 1 (bold + underline in theme)

## Heading 2 with **bold** and *italic* and `inline code`

This is a long text paragraph of nothing, an elaborate tapestry woven from the finest threads of linguistic flourish and yet utterly devoid of substance, meandering through winding corridors of syntax where ideas dissolve into mist before they can take root, each clause cascading into the next like a river of polished pebbles that sparkle brilliantly under the sun but carry no weight when gathered in the hand, expanding endlessly with ornate descriptions of absence itself, as if the very act of description could conjure meaning from the void, only to reveal again and again the elegant emptiness at its core, a symphony of words arranged with meticulous care to evoke grandeur while signifying precisely zero, drifting onward through layers of hypothetical elaboration that loop back upon themselves in graceful spirals of redundancy, inviting the reader to linger in the luxurious sprawl of inconsequence without ever arriving at a destination, for there is none to be found.

### Heading 3

This is a long text paragraph of nothing, an elaborate tapestry woven from the finest threads of linguistic flourish and yet utterly devoid of substance, meandering through winding corridors of syntax where ideas dissolve into mist before they can take root, each clause cascading into the next like a river of polished pebbles that sparkle brilliantly under the sun but carry no weight when gathered in the hand, expanding endlessly with ornate descriptions of absence itself, as if the very act of description could conjure meaning from the void...

#### Heading 4

This is a long text paragraph of nothing, an elaborate tapestry woven from the finest threads of linguistic flourish and yet utterly devoid of substance, meandering through winding corridors of syntax where ideas dissolve into mist before they can take root, each clause cascading into the next like a river of polished pebbles that sparkle brilliantly under the sun but carry no weight when gathered in the hand, expanding endlessly with ornate descriptions of absence itself, as if the very act of description could conjure meaning from the void...

##### Heading 5

This is a long text paragraph of nothing, an elaborate tapestry woven from the finest threads of linguistic flourish and yet utterly devoid of substance, meandering through winding corridors of syntax where ideas dissolve into mist before they can take root, each clause cascading into the next like a river of polished pebbles that sparkle brilliantly under the sun but carry no weight when gathered in the hand, expanding endlessly with ornate descriptions of absence itself, as if the very act of description could conjure meaning from the void...

###### Heading 6

This is a long text paragraph of nothing, an elaborate tapestry woven from the finest threads of linguistic flourish and yet utterly devoid of substance, meandering through winding corridors of syntax where ideas dissolve into mist before they can take root, each clause cascading into the next like a river of polished pebbles that sparkle brilliantly under the sun but carry no weight when gathered in the hand, expanding endlessly with ornate descriptions of absence itself, as if the very act of description could conjure meaning from the void...

---

## Inline text

Plain paragraph with **bold**, *italic*, ***bold italic***, `inline code`, and ~~strikethrough~~.

Nested styles: **bold with *italic inside* and `code`**.

A link with different text: [catmd on GitHub](https://github.com/example/catmd).

A link where text matches URL: <https://example.com>

Email-style link: [support@example.com](mailto:support@example.com)

Hard line break (two spaces at end of line):  
This line should appear directly below the previous one.

---

## Code blocks

Fenced block with language tag:

```typescript
export function greet(name: string): string {
	return `Hello, ${name}!`;
}

const emoji = "🐱";
```

Fenced block without a language:

```
plain text
  preserved indentation
```

Empty fenced block:

```text

```

---

## Lists

### Unordered

- Alpha
- Beta with **emphasis**
  - Nested one
  - Nested two
    - Deep nested
- Gamma

### Ordered

1. First item
2. Second item with `code`
3. Third item
   1. Nested ordered A
   2. Nested ordered B
4. Fourth item

### Task lists

- [ ] Unchecked task
- [x] Completed task
- [ ] Task with a link to [docs](https://example.com/docs)

### Long item (wrap test)

- This unordered item is intentionally long so that catmd must wrap the continuation lines under the bullet with extra indentation instead of overflowing the terminal.

---

## Tables

Simple table:

| Name  | Role     | Active |
| ----- | -------- | ------ |
| Alice | Admin    | yes    |
| Bob   | Editor   | no     |
| Carol | Viewer   | yes    |

Wide content (cell wrapping):

| Column A | Column B |
| -------- | -------- |
| Short    | This cell has enough text that it should wrap within the column when the terminal is narrow. |
| `code`   | **Bold** and *italic* inline |

---

## Blockquotes

> Simple quote on one line.

> Multi-line blockquote with **bold** and a [link](https://example.com).
>
> Second paragraph inside the same quote.

> Quote containing a list:
>
> - Item A
> - Item B
>
> And a closing sentence.

---

## Horizontal rules

Above the rule.

---

Between rules.

***

Another style.

___

---

## HTML (rendered as plain text)

Block HTML:

<div class="note">Not interpreted — shown as raw markup.</div>

Inline HTML: <kbd>Ctrl</kbd>+<kbd>C</kbd> in a sentence.

---

## Width & typography edge cases

Emoji and CJK (east-asian width): 🐱 日本語 中文 한글

Long unbroken token: `supercalifragilisticexpialidocious`

Long URL: https://example.com/very/long/path/that/should/wrap/or/truncate/gracefully?id=12345&foo=bar

Repeated words for wrap: lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

---

## Mixed document tail

Final paragraph with everything inline: see **README**, run `catmd EXAMPLE.md`, visit [example.com](https://example.com), and ~~delete this line~~.

| Done | ✓ |
| ---- | - |
| Test | Run `catmd --width 60 EXAMPLE.md` |
