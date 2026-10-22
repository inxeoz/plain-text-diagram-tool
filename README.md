# Plain Text Diagram Tool

The tool changes plain text into text diagrams. The diagrams use Unicode box characters.
The user can put the diagrams directly into a markdown file.

This tool implements the specification `spec.md` (PTD-SPEC-001, version 2.0).

## Files

| File | Purpose |
| :--- | :--- |
| `index.html` | The tool. One file. It contains the CSS and the JavaScript. |
| `spec.md` | The specification. |
| `test/acceptance.test.js` | The tests. Run them with `node test/acceptance.test.js`. |

## How to use the tool

1. Open `index.html` in a browser. The user does not need a server and the user does not need a build step.
2. Put the source text in the workspace on the left.
3. The tool draws the diagram on the right. The tool draws the diagram on every change of the source text.
4. Choose a type in the selector at the top right if the automatic choice is not the one that the user wants.
5. Choose an example in the dropdown next to the output title. The example fills the workspace and the tool draws
   the diagram. The dropdown always holds the examples of the selected type.
6. Press **Copy output** and paste the diagram into a markdown file.
7. Drag the line between the two panes to change the width of the workspace and the output. The line has the mouse
   pointer of a resize. Press the arrow keys when the line has the focus to move it. A double click puts the two
   panes back at 50% of the width.

The tool works with no internet connection. The tool sends no data to a network. The tool uses no cookie.

## The types

| Type | Source text | Output |
| :--- | :--- | :--- |
| Tree | lines, two spaces make one depth level | a tree of nodes |
| Table | cells separated by `|` | a table with a header row |
| Flow | `A -> B` chains | boxes with arrows in one row |
| Checklist | lines that start with `[x] ` or `[ ] ` | a list with `☑` and `☐` |
| Bar | `Label: number` | a bar per line, the longest bar is 30 characters |
| State | `A --label--> B` | boxes with the label above the arrow |
| Timeline | `Period: event1, event2` | one block of lines per period |
| Kanban | `[Name]` starts a column | columns of cards side by side |
| Matrix | `X:`, `Y:`, `TL:`, `TR:`, `BL:`, `BR:`, `Items:` | a grid of four quadrants |
| Heatmap | a table with numbers from 0 to 3 | a grid with shading characters |
| Sequence | `Sender -> Receiver: message` | lifelines with messages |
| Swimlane | `Lane: step1 -> step2` | one block of lines per lane |
| Gantt | `Task: start-end` | a time axis and one bar per task |

### Tree

```text
project/
  src/
    main.js
  README.md
```

```text
project/
├── src/
│   └── main.js
└── README.md
```

### Table

```text
Task|Owner|Due
Spec|Ana|Mon
Build|Chen|Wed
```

```text
┌───────┬───────┬─────┐
│ Task  │ Owner │ Due │
├───────┼───────┼─────┤
│ Spec  │ Ana   │ Mon │
│ Build │ Chen  │ Wed │
└───────┴───────┴─────┘
```

### Flow

The signs `->`, `=>` and `→` have the same effect.

```text
Draft -> Review -> Approved
```

```text
┌───────┐   ┌────────┐   ┌──────────┐
│ Draft │──▶│ Review │──▶│ Approved │
└───────┘   └────────┘   └──────────┘
```

### Checklist

```text
[x] Tests pass
[ ] Security scan
[x] Changelog
[ ] Deploy
```

```text
☑ Tests pass
☐ Security scan
☑ Changelog
☐ Deploy
```

### Bar

```text
Apples: 50
Bananas: 30
Cherries: 75
Dates: 10
```

```text
Apples   ████████████████████ 50
Bananas  ████████████ 30
Cherries ██████████████████████████████ 75
Dates    ████ 10
```

### State

```text
Draft --submit--> Review
Review --approve--> Approved
Approved --publish--> Published
```

```text
┌───────┐ submit  ┌────────┐ approve ┌──────────┐ publish ┌───────────┐
│ Draft │────────▶│ Review │────────▶│ Approved │────────▶│ Published │
└───────┘         └────────┘         └──────────┘         └───────────┘
```

### Timeline

```text
Q1: Research, Spec
Q2: Build, MVP
Q3: Beta, Feedback
Q4: Launch, Retro
```

```text
Q1 ├─ Research
   └─ Spec
Q2 ├─ Build
   └─ MVP
Q3 ├─ Beta
   └─ Feedback
Q4 ├─ Launch
   └─ Retro
```

### Kanban

```text
[Backlog]
A
B

[In Progress]
C
D

[Done]
G
```

```text
┌─────────┐ ┌─────────────┐ ┌────────┐
│ Backlog │ │ In Progress │ │  Done  │
├─────────┤ ├─────────────┤ ├────────┤
│ A       │ │ C           │ │ G      │
│ B       │ │ D           │ │        │
└─────────┘ └─────────────┘ └────────┘
```

### Matrix

```text
X: Effort
Y: Impact
TL: Quick wins
TR: Big bets
BL: Fill-ins
BR: Avoid
Items: Feature A(TL), Feature B(TR)
```

```text
                 Effort
          Low              High
       ┌──────────────┬──────────────┐
High   │ Quick wins   │ Big bets     │
Impact │ Feature A    │ Feature B    │
       ├──────────────┼──────────────┤
Low    │ Fill-ins     │ Avoid        │
Impact │              │              │
       └──────────────┴──────────────┘
```

#### A matrix of any size

The matrix can have n rows and n columns. The tool finds the size from the cell names. The name of a cell is
the name of its row and the name of its column.

| Size | The cell names |
| :--- | :--- |
| 2 | TL, TR, BL, BR |
| 3 | TL, TM, TR, ML, MM, MR, BL, BM, BR |
| 4 | TL, T2, T3, TR, 3L, 32, 33, 3R, 2L, 22, 23, 2R, BL, B2, B3, BR |

The name of a row and the name of a column are the number of the level of that row or column. The Y axis runs
from High to Low, so the rows count down. For a matrix of three the middle level is M. The number 2 is the same
level as M.

The tool uses these names of the levels: Low and High for a matrix of two, Low, Medium and High for a matrix of
three, and Low, the numbers, and High for a matrix of four or more.

Two lines are optional:

- `Size: n` sets the size of the matrix. The tool needs this line when the source text does not have every cell.
- `Levels: name, name, name` sets the names of the levels. The names go from Low to High. The Y axis uses the
  same names in the other order.

```text
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

```text
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

The matrix type shows these errors: `error: missing <line name>` for a missing line or a missing cell,
`error: bad size` for a size that is not a number, `error: bad levels` when the number of the levels is not the
size of the matrix, and `error: bad item` when an item names no cell.

### Heatmap

```text
|   | Mon | Tue | Wed | Thu |
|AM | 1   | 3   | 2   | 0   |
|PM | 2   | 1   | 3   | 2   |
```

```text
      Mon Tue Wed Thu
AM     ░   ▓   ▒
PM     ▒   ░   ▓   ▒
```

### Sequence

```text
User -> Web: login
Web -> API: auth
API -> DB: query
DB -> API: data
API -> Web: token
Web -> User: OK
```

```text
User          Web           API           DB
 │──login──▶  │             │             │
 │            │──auth─────▶ │             │
 │            │             │──query────▶ │
 │            │             │ ◀──data──── │
 │            │ ◀──token─── │             │
 │ ◀──OK───── │             │             │
```

### Swimlane

```text
Customer: Submit -> Receive
Support: Triage -> Resolve
Engineering: Fix -> Verify
```

```text
Customer    ┌────────┐   ┌─────────┐
            │ Submit │──▶│ Receive │
            └────────┘   └─────────┘
Support     ┌────────┐   ┌─────────┐
            │ Triage │──▶│ Resolve │
            └────────┘   └─────────┘
Engineering ┌─────┐      ┌────────┐
            │ Fix │──▶   │ Verify │
            └─────┘      └────────┘
```

### Gantt

```text
Plan: 0-10
Build: 10-25
Test: 25-35
Release: 35-40
```

```text
Task      0         10        20        30        40
          │─────────│─────────│─────────│─────────│
Plan      ██████████
Build               ███████████████
Test                               ██████████
Release                                      █████
```

## The type selection flow

The tool uses the flow **Type → Select → Render**. The user writes the source text first. The tool draws the
diagram from that source text. The tool never changes the source text, so one source text can make many diagrams.

The type comes from the selector. The default option is Auto. In Auto mode the tool examines the source text and
selects one type with the rules below. The user can change the type at any time.

The tool also has an optional button, **Show hint for this type**, above the workspace. The button shows a short
example of the source text of the selected type. The button never changes the source text. The button is only a
help for the user: it teaches the form of each type without making the user rewrite the source text.

## The automatic type

In Auto mode the tool tests these rules in this order. The tool stops at the first rule that agrees.

1. A line starts with `[x] ` or `[ ] ` → Checklist.
2. A line is exactly `[Name]` → Kanban.
3. A line matches `--label-->` → State.
4. A line matches `->` and then `:` → Sequence.
5. The text has a line that starts with `X:` and a line that starts with `Y:` → Matrix.
6. A line matches `: number-number` → Gantt.
7. Every non-empty line matches `: number` → Bar.
8. A line matches `: word, word` → Timeline.
9. A line matches `name:` and then `->` → Swimlane.
10. The text is a table of numbers from 0 to 3 → Heatmap.
11. A line has `->`, `=>` or `→` → Flow.
12. A line has two or more `|` characters → Table.
13. A line has spaces at the start → Tree.
14. No rule agrees → Tree.

If a rule agrees but the tool cannot draw the source text, the tool shows `error:` and a short cause.
The tool does not try the next rule.

The label next to the output title shows the type that the tool chose.

## The tests

```bash
node test/acceptance.test.js
```

The test has no dependency and needs no browser. The test reads `index.html`, runs the page script in a small
DOM stub, and checks the output text. The test covers the seventeen acceptance tests in section 8 of the
specification and the other requirements of the specification.

The test exits with code 0 when every test passes. The test exits with code 1 when a test fails.

## Notes on the specification

The tool has four additions to the specification of version 2.0.

The first addition is the button **Show hint for this type**. The new requirement is: *the tool must be able to
show a type specific example on request. The tool must not change the source text when it shows the example.*
The tests for the button are in `test/acceptance.test.js` with the names `R-HINT-001`, `R-HINT-002` and
`R-HINT-003`.

The second addition is the line between the workspace and the output. The user can drag the line to change the
width of the two panes. The panes start at 50% of the window width, so R-172 holds until the user moves the line.
The tests for the line are in `test/acceptance.test.js` with the names `R-DRAG-001` to `R-DRAG-005`.

The third addition is the dropdown of examples next to the output title. The dropdown holds the examples of the
selected type. The user chooses an example and the example fills the workspace. The tests for the dropdown are in
`test/acceptance.test.js` with the names `R-EXAMPLE-001` to `R-EXAMPLE-005`.

The fourth addition is the matrix of n rows and n columns. The specification of version 2.0 only has the matrix of
two rows and two columns (R-110 .. R-116). The tool keeps the two by two form and adds the other sizes. The tests
for the new sizes are in `test/acceptance.test.js` with the names `R-MATRIX-001` to `R-MATRIX-008`.

The specification has four places where two parts of the document do not agree. The tool follows these rules.

- **R-056 and the Flow example.** R-056 says that all boxes of a flow diagram use the same width. The example
  under R-056 and acceptance test 3 show a width for each box. The tool follows the example, because section 8
  says that the tool is correct when the acceptance tests agree. Every box has a width of its own node name
  plus 2 characters.
- **R-021 and the Heatmap.** The table of rules in R-021 has no rule for the Heatmap, so the heatmap example
  would be detected as a Table. Section 9 says that every type must have an automatic mode rule, so the tool
  has one rule for the Heatmap: the text is a table and every value is a number from 0 to 3. The rule is rule 10
  in the list above. The rule comes before the rule for the Table.
- **R-112 and the Matrix example.** R-112 says that the X label goes below the grid. The example under R-116 puts
  the X label above the grid. The tool follows the example, because acceptance test 9 compares the output with
  the example.
- **R-153 and the Gantt example.** The Gantt example output does not match its own source text. The example shows
  the `Test` bar at column 40 and the `Release` bar outside the axis, but the source text says `Test: 25-35` and
  `Release: 35-40`. The example output fits the source text `Test: 30-40` and `Release: 42-47` instead. No rule
  can make the example output from the example source text, so the tool follows R-153 and R-155: the bar of a task
  starts at its start, ends at its end, and the numbers are scaled to an axis of 40 characters. The first two bars
  of the example are the same in both readings.
