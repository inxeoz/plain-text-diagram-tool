# SPECIFICATION ADDENDUM — PLAIN TEXT DIAGRAM TOOL

**Document number:** PTD-SPEC-001-A1
**Version:** 1.0
**Date:** 2026-10-22
**Base document:** PTD-SPEC-001 version 2.0 (`spec.md`)
**Standard:** This document obeys ASD-STE100 (Simplified Technical English).

Each sentence has one instruction or one fact. Each requirement has an ID. Each requirement is testable.

---

## 1. SCOPE

This document gives the requirements that the Plain Text Diagram Tool adds to PTD-SPEC-001 version 2.0.

The base document gives the requirements for the thirteen types and for the workspace, the selector, the output and
the constraints of the tool. This document does not change the base document.

The tool has four additions:

- the button that shows an example of the selected type,
- the dropdown with the examples of the selected type,
- the line between the two panes that the user can drag,
- the matrix of n rows and n columns.

The tool obeys these rules of the base document for the additions:

- The tool must be one HTML file. The HTML file must contain the CSS and the JavaScript.
- The tool must not use a library. The tool must not use a framework.
- The tool must not use a build step. The user must open the HTML file directly.
- The tool must not use a server.
- The tool must not send data to a network. The tool must not use a cookie.
- The output must use Unicode characters only. The output must not use HTML.

---

## 2. THE TYPE SELECTION FLOW

The tool uses the flow **Type → Select → Render**. The user writes the source text first. The tool draws the
diagram from that source text.

**R-090** — The tool must not change the source text when the user changes the type.

**R-091** — The default option of the selector must be Auto. In Auto mode the tool selects the type with the rules
of R-021 of the base document.

---

## 3. THE BUTTON THAT SHOWS AN EXAMPLE OF THE TYPE

The button is an addition to the workspace. The button teaches the form of the source text of the selected type.

**R-HINT-001** — The tool must have a button that shows an example of the source text of the selected type. The
button must not change the source text.

**R-HINT-002** — The button must show the example of the type in the selector. In Auto mode the tool must use the
type that the tool selected.

**R-HINT-003** — The button must show the example again when the user presses the button a second time. The
second press must hide the example.

---

## 4. THE DROPDOWN WITH THE EXAMPLES OF THE TYPE

The dropdown is an addition to the output. The dropdown holds the examples of the selected type.

**R-EXAMPLE-001** — The tool must have a dropdown next to the output title. The dropdown must hold the examples of
the selected type. The first option of the dropdown must be a neutral option.

**R-EXAMPLE-002** — Every type must have two examples or more. The tool must show the examples of the type that
the tool selected when the selector is Auto.

**R-EXAMPLE-003** — When the user chooses an example, the tool must put the source text of the example in the
workspace. The tool must draw the diagram.

**R-EXAMPLE-004** — When the user changes the type, the tool must change the examples in the dropdown.

**R-EXAMPLE-005** — The tool must not change the source text when the user changes the type and does not choose an
example.

---

## 5. THE LINE BETWEEN THE TWO PANES

The line is an addition to the window. The line changes the width of the workspace and the width of the output.

**R-DRAG-001** — The tool must have a line between the workspace and the output. The line must be a separator. The
line must work with the keyboard.

**R-DRAG-002** — When the user drags the line, the tool must change the width of the workspace and the width of the
output. The width of the output must change in the other direction.

**R-DRAG-003** — The tool must not make a pane smaller than 120 pixels.

**R-DRAG-004** — The left arrow key and the right arrow key must move the line. The Home key and the End key must
move the line to the ends. A double click must put the two panes back at the same width.

**R-DRAG-005** — The two panes must get 50% of the window width before the user moves the line. The line must not
take space from the two panes.

---

## 6. THE MATRIX OF n ROWS AND n COLUMNS

The base document gives the matrix of two rows and two columns. This section gives the matrix of every size.

**R-MATRIX-001** — The matrix must have three rows and three columns when the source text has the cells of a
matrix of three.

**R-MATRIX-002** — The matrix must have four rows and four columns when the source text has the cells of a
matrix of four.

**R-MATRIX-003** — The line `Size: n` must set the size of the matrix. The tool must find the size from the cells
of the source text when the line is not there.

**R-MATRIX-004** — The line `Levels: name, name, name` must set the names of the levels. The names go from Low to
High. The Y axis must use the same names in the other order.

**R-MATRIX-005** — The number of the levels must be the size of the matrix. If the numbers are not the same, the
tool must show `error: bad levels`.

**R-MATRIX-006** — If an item names a cell that does not exist, the tool must show `error: bad item`.

**R-MATRIX-007** — If the size is not a number, the tool must show `error: bad size`.

**R-MATRIX-008** — If a cell is missing, the tool must show `error: missing <cell name>`.

### 6.1 The names of the cells

The name of a cell is the name of its row and the name of its column. The name of a row and the name of a column
are the number of the level of that row or of that column. The Y axis runs from High to Low, so the names of the
rows count down.

| Size | The names of the rows | The names of the columns | The names of the cells |
| :--- | :--- | :--- | :--- |
| 2 | T, B | L, R | TL, TR, BL, BR |
| 3 | T, M, B | L, M, R | TL, TM, TR, ML, MM, MR, BL, BM, BR |
| 4 | T, 3, 2, B | L, 2, 3, R | TL, T2, T3, TR, 3L, 32, 33, 3R, 2L, 22, 23, 2R, BL, B2, B3, BR |

For a matrix of three the middle level has the name M. The number 2 is the same level as M.

### 6.2 The names of the levels

The tool uses these names of the levels when the source text has no line `Levels:`.

| Size | The names of the levels |
| :--- | :--- |
| 2 | Low, High |
| 3 | Low, Medium, High |
| 4 and more | Low, the numbers, High |

### 6.3 Example

Source text:

```
X: Effort
Y: Impact
Levels: Low, Medium, High
TL: Quick wins
TM: Fill in
TR: Big bets
ML: Easy later
MM: Steady
MR: Costly
BL: Avoid
BM: Later
BR: Blocked
Items: Feature A(TL), Feature B(TR), Feature C(MM)
```

Output:

```
                         Effort
          Low              Medium           High
       ┌──────────────┬──────────────┬──────────────┐
High   │ Quick wins   │ Fill in      │ Big bets     │
Impact │ Feature A    │              │ Feature B    │
       ├──────────────┼──────────────┼──────────────┤
Medium │ Easy later   │ Steady       │ Costly       │
Impact │              │ Feature C    │              │
       ├──────────────┼──────────────┼──────────────┤
Low    │ Avoid        │ Later        │ Blocked      │
Impact │              │              │              │
       └──────────────┴──────────────┴──────────────┘
```

### 6.4 The matrix of two rows and two columns

The matrix of two rows and two columns must make the same output as the example under R-116 of the base document.

---

## 7. ACCEPTANCE TESTS

The tool is correct when all these tests agree with the requirements of this document.

| Test | Requirement | Test |
| :--- | :--- | :--- |
| 1 | R-HINT-001 | Press the button. The tool must show an example of the type. The source text must not change. |
| 2 | R-HINT-002 | Change the type. Press the button. The tool must show the example of the new type. |
| 3 | R-HINT-003 | Press the button two times. The tool must show the example and then hide the example. |
| 4 | R-EXAMPLE-001 | Choose a type. The dropdown must hold the examples of that type. |
| 5 | R-EXAMPLE-002 | The dropdown must hold two examples or more for every type. |
| 6 | R-EXAMPLE-003 | Choose an example. The workspace must hold the source text of the example. The tool must draw the diagram. |
| 7 | R-EXAMPLE-004 | Change the type. The examples in the dropdown must change. |
| 8 | R-EXAMPLE-005 | Write the source text and change the type. The source text must not change. |
| 9 | R-DRAG-001 | The line must be between the two panes. |
| 10 | R-DRAG-002 | Drag the line. The widths of the two panes must change. |
| 11 | R-DRAG-003 | Drag the line to the end. A pane must keep 120 pixels or more. |
| 12 | R-DRAG-004 | Press the arrow keys on the line. The line must move. |
| 13 | R-DRAG-005 | The two panes must get 50% of the window width at the start. |
| 14 | R-MATRIX-001 | Put the source text of the example under 6.3 in the workspace. The output must agree with 6.3. |
| 15 | R-MATRIX-002 | Put the source text of a matrix of four in the workspace. The output must have four rows and four columns. |
| 16 | R-MATRIX-003 | Put `Size: 3` in the source text. The matrix must have three rows and three columns. |
| 17 | R-MATRIX-004 | Put `Levels: Low, Medium, High` in the source text. The output must use these names. |
| 18 | R-MATRIX-005 | Put two names in the line `Levels:` of a matrix of three. The tool must show `error: bad levels`. |
| 19 | R-MATRIX-006 | Put an item that names no cell in the source text. The tool must show `error: bad item`. |
| 20 | R-MATRIX-007 | Put a size that is not a number in the source text. The tool must show `error: bad size`. |
| 21 | R-MATRIX-008 | Leave one cell out of the source text. The tool must show `error: missing <cell name>`. |
| 22 | 6.4 | Put the example of R-116 of the base document in the workspace. The output must agree with that example. |

The tests of this document are in `test/acceptance.test.js`. The names of the tests start with the ID of the
requirement.

---

## 8. NOTES

The base document has four places where two parts of the document do not agree. The tool follows these rules.

- **R-056 and the Flow example.** R-056 says that all boxes of a flow diagram use the same width. The example
  under R-056 and acceptance test 3 show a width for each box. The tool follows the example. Every box has a width
  of its own node name plus 2 characters.
- **R-021 and the Heatmap.** The table of rules in R-021 has no rule for the Heatmap, so the heatmap example would
  be detected as a Table. Section 9 of the base document says that every type must have an automatic mode rule, so
  the tool has one rule for the Heatmap: the text is a table and every value is a number from 0 to 3. The rule
  comes before the rule for the Table.
- **R-112 and the Matrix example.** R-112 says that the X label goes below the grid. The example under R-116 puts
  the X label above the grid. The tool follows the example.
- **R-153 and the Gantt example.** The Gantt example output does not match its own source text. The example shows
  the `Test` bar at column 40 and the `Release` bar outside the axis, but the source text says `Test: 25-35` and
  `Release: 35-40`. The example output fits the source text `Test: 30-40` and `Release: 42-47` instead. No rule
  can make the example output from the example source text, so the tool follows R-153 and R-155: the bar of a task
  starts at its start, ends at its end, and the numbers are scaled to an axis of 40 characters. The first two bars
  of the example are the same in both readings.

---

**END OF DOCUMENT**
