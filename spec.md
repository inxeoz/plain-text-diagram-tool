# SPECIFICATION — PLAIN TEXT DIAGRAM TOOL

**Document number:** PTD-SPEC-001
**Version:** 2.0
**Date:** 2026-10-22
**Standard:** This document obeys ASD-STE100 (Simplified Technical English).

Each sentence has one instruction or one fact. Each requirement has an ID. Each requirement is testable.

---

## 1. SCOPE

This specification gives the requirements for the Plain Text Diagram Tool.

The tool changes plain text into text diagrams. The diagrams use Unicode characters. The user can put the diagrams directly into a markdown file.

The tool does not use a server. The tool does not use a build step. The tool does not use a library.

Version 2.0 adds ten diagram types to Version 1.0. The tool now has thirteen types.

---

## 2. TERMS AND DEFINITIONS

| Term | Definition |
| :--- | :--- |
| **Tool** | The Plain Text Diagram Tool. |
| **User** | The person who uses the tool. |
| **Workspace** | The text area in the tool. The user puts the source text here. |
| **Source text** | The data in the workspace. The user writes the source text. |
| **Output** | The text diagram. The tool shows the output. |
| **Diagram** | The text art. The diagram uses Unicode characters. |
| **Type** | One of the thirteen types in Section 4.0. |
| **Auto mode** | The tool selects the type. The user does not select the type. |
| **Node** | One item in a Tree diagram. |
| **Edge** | One connection between two nodes. |
| **Lane** | One row in a Swimlane diagram. |
| **Card** | One item in a Kanban diagram. |
| **Cell** | One box in a Table diagram or a Heatmap diagram. |

---

## 3. GENERAL DESCRIPTION

The tool is one HTML file. The HTML file contains the CSS and the JavaScript.

The tool runs in a web browser. The tool uses the browser only.

The user puts the source text in the workspace. The tool examines the source text. The tool selects a type. The tool draws the diagram. The tool shows the diagram on the screen.

The user can copy the diagram. The diagram keeps its shape after the copy.

The tool obeys these design rules:

- The tool makes a result on the first load. The user does not click a "Draw" button.
- The tool shows the source text and the output at the same time.
- The output is stable. The same source text always makes the same output.
- The output is the same in all browsers.
- The source text is one truth. When the user changes the type, the source text does not change.

---

## 4. FUNCTIONAL REQUIREMENTS

### 4.0 Type List and Build Order

The tool has thirteen types. The tool must use these names:

| Number | Type | Phase |
| :--- | :--- | :--- |
| 1 | Tree | 1 |
| 2 | Table | 1 |
| 3 | Flow | 1 |
| 4 | Checklist | 1 |
| 5 | Bar | 1 |
| 6 | State | 2 |
| 7 | Timeline | 2 |
| 8 | Kanban | 2 |
| 9 | Matrix | 2 |
| 10 | Heatmap | 2 |
| 11 | Sequence | 3 |
| 12 | Swimlane | 3 |
| 13 | Gantt | 3 |

**R-000** — The tool must be built in three phases. The tool must pass the test for one type before the next type starts.

**R-000A** — Phase 1 must have these types: Tree, Table, Flow, Checklist, Bar.

**R-000B** — Phase 2 must have these types: State, Timeline, Kanban, Matrix, Heatmap.

**R-000C** — Phase 3 must have these types: Sequence, Swimlane, Gantt.

### 4.1 Workspace

**R-001** — The tool must show one workspace.

**R-002** — The workspace must accept plain text. The workspace must accept new lines.

**R-003** — The workspace must keep the spaces at the start of each line.

**R-004** — The tool must show the output at the same time as the source text. The tool must not use a "Draw" button.

**R-005** — The tool must update the output when the user changes the source text. The update must start in 100 ms or less.

**R-006** — The workspace must accept empty lines. The tool must ignore empty lines.

**R-007** — The tool must remove the spaces at the start and at the end of each line before the tool parses the line. Requirement R-003 applies to Tree only.

### 4.2 Type Selection

**R-010** — The tool must show a type selector.

**R-011** — The type selector must have fourteen options: Auto and the thirteen types in Section 4.0.

**R-012** — The default option must be Auto.

**R-013** — The user must be able to change the type at any time.

**R-014** — When the user changes the type, the source text must not change. The tool must draw the new diagram from the same source text.

### 4.3 Automatic Type Detection

**R-020** — In Auto mode, the tool must examine the source text. The tool must select one type.

**R-021** — The tool must use these rules. The tool must test the rules in this order. The tool must stop at the first rule that agrees.

| Order | Test | Type |
| :--- | :--- | :--- |
| 1 | A line starts with `[x] ` or `[ ] `. | Checklist |
| 2 | A line is exactly `[Name]`. | Kanban |
| 3 | A line matches `--label-->`. | State |
| 4 | A line matches `->` and then `:`. | Sequence |
| 5 | The text has a line that starts with `X:` and a line that starts with `Y:`. | Matrix |
| 6 | A line matches `: number-number`. | Gantt |
| 7 | Every non-empty line matches `: number`. | Bar |
| 8 | A line matches `: word, word`. | Timeline |
| 9 | A line matches `name:` and then `->`. | Swimlane |
| 10 | A line has `->`, `=>`, or `→`. | Flow |
| 11 | A line has two or more `\|` characters. | Table |
| 12 | A line has spaces at the start. | Tree |
| 13 | No rule agrees. | Tree |

**R-022** — The tool must test each rule on the full source text. The tool must not test only one line.

**R-023** — The tool must not ask the user a question in Auto mode.

**R-024** — If a rule agrees but the parse fails, the tool must show `error:` and a short cause. The tool must not try the next rule.

### 4.4 Tree

**R-030** — The tool must make a Tree diagram from the source text.

**R-031** — One line of source text must become one node.

**R-032** — Two spaces at the start of a line must make one depth level.

**R-033** — The tool must use these characters: `├──`, `└──`, `│`.

**R-034** — The tool must mark the last child of a parent with `└──`.

**R-035** — The tool must mark the other children of a parent with `├──`.

**R-036** — The tool must continue the line of the parent with `│`.

**R-037** — The root node must not have a prefix.

**Example**

Source text:

```
project/
  src/
    main.js
  README.md
```

Output:

```
project/
├── src/
│   └── main.js
└── README.md
```

### 4.5 Table

**R-040** — The tool must make a Table diagram from the source text.

**R-041** — One line of source text must become one row.

**R-042** — The `|` character separates the cells.

**R-043** — The first row must be the header row.

**R-044** — The tool must use these characters: `┌ ┬ ┐ ├ ┼ ┤ └ ┴ ┘ │ ─`.

**R-045** — The tool must set the width of each column to the longest cell in that column. The minimum width must be 3 characters.

**R-046** — If a row has fewer cells than the header row, the tool must add empty cells.

**Example**

Source text:

```
Task|Owner|Due
Spec|Ana|Mon
Build|Chen|Wed
```

Output:

```
┌───────┬───────┬─────┐
│ Task  │ Owner │ Due │
├───────┼───────┼─────┤
│ Spec  │ Ana   │ Mon │
│ Build │ Chen  │ Wed │
└───────┴───────┴─────┘
```

### 4.6 Flow

**R-050** — The tool must make a Flow diagram from the source text.

**R-051** — The tool must find all patterns of the form `A -> B`. The signs `->`, `=>`, and `→` must have the same effect.

**R-052** — The tool must make one box for each node.

**R-053** — The tool must put the boxes in one row. The tool must keep the order of the nodes.

**R-054** — The tool must put the arrow `──▶` between two boxes.

**R-055** — The tool must use these characters for the boxes: `┌ ┐ └ ┘ │ ─`.

**R-056** — The tool must use the same width for all boxes. The width must be the longest node name plus 2 characters.

**R-057** — If the source text has no arrow, the tool must show `error: no arrow`.

**Example**

Source text:

```
Draft -> Review -> Approved
```

Output:

```
┌───────┐   ┌────────┐   ┌──────────┐
│ Draft │──▶│ Review │──▶│ Approved │
└───────┘   └────────┘   └──────────┘
```

### 4.7 Checklist

**R-060** — The tool must make a Checklist diagram from the source text.

**R-061** — One line of source text must become one item.

**R-062** — A line that starts with `[x]` must become a done item. The tool must show `☑` for a done item.

**R-063** — A line that starts with `[ ]` must become an open item. The tool must show `☐` for an open item.

**R-064** — The tool must put one space between the box and the item text.

**R-065** — If a line does not start with `[x]` or `[ ]`, the tool must show `error: no checkbox`.

**Example**

Source text:

```
[x] Tests pass
[ ] Security scan
[x] Changelog
[ ] Deploy
```

Output:

```
☑ Tests pass
☐ Security scan
☑ Changelog
☐ Deploy
```

### 4.8 Bar

**R-070** — The tool must make a Bar diagram from the source text.

**R-071** — One line of source text must have the form `Label: number`.

**R-072** — The tool must put the label at the left. The tool must align the labels to the left edge.

**R-073** — The tool must draw the bar with the `█` character. The bar length must be proportional to the number.

**R-074** — The longest bar must be 30 characters. The tool must scale all bars to the largest number.

**R-075** — The tool must put the number at the right of the bar. The tool must put one space between the bar and the number.

**R-076** — If a line has no number, the tool must show `error: no number`.

**Example**

Source text:

```
Apples: 50
Bananas: 30
Cherries: 75
Dates: 10
```

Output:

```
Apples   ████████████████████ 50
Bananas  ████████████ 30
Cherries ██████████████████████████████ 75
Dates    ████ 10
```

### 4.9 State

**R-080** — The tool must make a State diagram from the source text.

**R-081** — One line of source text must have the form `A --label--> B`.

**R-082** — The tool must make one box for each state. The tool must use the same box format as Flow (R-055).

**R-083** — The tool must put the label above the arrow. The tool must center the label on the arrow.

**R-084** — The tool must put the states in the order of the source text. The tool must not make a cycle layout.

**R-085** — If a line has no `--label-->`, the tool must show `error: no labeled arrow`.

**Example**

Source text:

```
Draft --submit--> Review
Review --approve--> Approved
Approved --publish--> Published
```

Output:

```
┌───────┐ submit  ┌────────┐ approve ┌──────────┐ publish ┌───────────┐
│ Draft │────────▶│ Review │────────▶│ Approved │────────▶│ Published │
└───────┘         └────────┘         └──────────┘         └───────────┘
```

### 4.10 Timeline

**R-090** — The tool must make a Timeline diagram from the source text.

**R-091** — One line of source text must have the form `Period: event1, event2, event3`.

**R-092** — The tool must put the periods in the order of the source text.

**R-093** — The tool must put one period on one row. The tool must put the period at the left.

**R-094** — The tool must put `├─` before the first event and `└─` before the last event. The tool must put `├─` before the middle events.

**R-095** — The tool must put one space between the period and the marker.

**Example**

Source text:

```
Q1: Research, Spec
Q2: Build, MVP
Q3: Beta, Feedback
Q4: Launch, Retro
```

Output:

```
Q1 ├─ Research
   └─ Spec
Q2 ├─ Build
   └─ MVP
Q3 ├─ Beta
   └─ Feedback
Q4 ├─ Launch
   └─ Retro
```

### 4.11 Kanban

**R-100** — The tool must make a Kanban diagram from the source text.

**R-101** — A line that is exactly `[Name]` must start a new column. The tool must use `Name` as the column header.

**R-102** — A line after a column header must become one card in that column.

**R-103** — The tool must put the columns side by side.

**R-104** — The tool must use the box characters from R-044 for each column.

**R-105** — The tool must set the width of each column to the longest card or the header. The minimum width must be 6 characters.

**R-106** — The tool must add empty card rows so that all columns have the same height.

**R-107** — If the source text has no `[Name]` line, the tool must show `error: no column`.

**Example**

Source text:

```
[Backlog]
A
B

[In Progress]
C
D

[Done]
G
```

Output:

```
┌─────────┐ ┌─────────────┐ ┌────────┐
│ Backlog │ │ In Progress │ │  Done  │
├─────────┤ ├─────────────┤ ├────────┤
│ A       │ │ C           │ │ G      │
│ B       │ │ D           │ │        │
└─────────┘ └─────────────┘ └────────┘
```

### 4.12 Matrix

**R-110** — The tool must make a Matrix diagram from the source text.

**R-111** — The source text must have these lines: `X: <name>`, `Y: <name>`, `TL: <text>`, `TR: <text>`, `BL: <text>`, `BR: <text>`, `Items: <list>`.

**R-112** — The tool must put the X label below the grid. The tool must put the Y label at the left of the grid.

**R-113** — The tool must use the box characters from R-044 for the four quadrants.

**R-114** — The tool must put each item from the Items list in the quadrant that the item names.

**R-115** — The Items list must have the form `name(TL), name(TR)`. The tool must accept one or more items.

**R-116** — If a required line is missing, the tool must show `error: missing <line name>`.

**Example**

Source text:

```
X: Effort
Y: Impact
TL: Quick wins
TR: Big bets
BL: Fill-ins
BR: Avoid
Items: Feature A(TL), Feature B(TR)
```

Output:

```
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

### 4.13 Heatmap

**R-120** — The tool must make a Heatmap diagram from the source text.

**R-121** — The source text must be a table. The first cell of the first row must be empty.

**R-122** — The first row must be the column headers. The first cell of each row must be the row header.

**R-123** — Each other cell must have a number from 0 to 3.

**R-124** — The tool must change the number to a shading character: 0 → ` `, 1 → `░`, 2 → `▒`, 3 → `▓`.

**R-125** — The tool must align the header cells to the left. The tool must align the shading cells to the center.

**R-126** — If a cell has no number from 0 to 3, the tool must show `error: bad value`.

**Example**

Source text:

```
|   | Mon | Tue | Wed | Thu |
|AM | 1   | 3   | 2   | 0   |
|PM | 2   | 1   | 3   | 2   |
```

Output:

```
      Mon Tue Wed Thu
AM     ░   ▓   ▒
PM     ▒   ░   ▓   ▒
```

### 4.14 Sequence

**R-130** — The tool must make a Sequence diagram from the source text.

**R-131** — One line of source text must have the form `Sender -> Receiver: message`.

**R-132** — The tool must put each unique sender or receiver in a column. The tool must keep the order of the first appearance.

**R-133** — The tool must show one message on one row. The tool must keep the order of the source text.

**R-134** — The tool must draw the message from the sender column to the receiver column. The tool must put the message text above the arrow.

**R-135** — If the sender column is left of the receiver column, the tool must use `──text──▶`. If the sender column is right of the receiver column, the tool must use `◀──text──`.

**R-136** — If a line has no colon, the tool must show `error: no message`.

**Example**

Source text:

```
User -> Web: login
Web -> API: auth
API -> DB: query
DB -> API: data
API -> Web: token
Web -> User: OK
```

Output:

```
User          Web           API           DB
 │──login──▶  │             │             │
 │            │──auth─────▶ │             │
 │            │             │──query────▶ │
 │            │             │ ◀──data──── │
 │            │ ◀──token─── │             │
 │ ◀──OK───── │             │             │
```

### 4.15 Swimlane

**R-140** — The tool must make a Swimlane diagram from the source text.

**R-141** — One line of source text must have the form `Lane: step1 -> step2 -> step3`.

**R-142** — The tool must put one lane on one row. The tool must put the lane name at the left.

**R-143** — The tool must make one box for each step. The tool must use the box characters from R-055.

**R-144** — The tool must put the arrow `──▶` between two steps.

**R-145** — The tool must align all lanes to the left edge of the first step.

**R-146** — If a line has no colon, the tool must show `error: no lane`.

**Example**

Source text:

```
Customer: Submit -> Receive
Support: Triage -> Resolve
Engineering: Fix -> Verify
```

Output:

```
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

### 4.16 Gantt

**R-150** — The tool must make a Gantt diagram from the source text.

**R-151** — One line of source text must have the form `Task: start-end`. Start and end must be numbers.

**R-152** — The tool must draw a time axis at the top. The axis must show the start and the end of the full range.

**R-153** — The tool must draw one bar for each task. The bar must start at `start` and end at `end`.

**R-154** — The tool must use the `█` character for the bar.

**R-155** — The tool must set the width of the axis to 40 characters. The tool must scale the numbers to 40 characters.

**R-156** — If `start` is not less than `end`, the tool must show `error: bad range`.

**Example**

Source text:

```
Plan: 0-10
Build: 10-25
Test: 25-35
Release: 35-40
```

Output:

```
Task      0         10        20        30        40
          │─────────│─────────│─────────│─────────│
Plan      ██████████
Build               ███████████████
Test                                    ██████████
Release                                             █████
```

### 4.17 Output

**R-160** — The tool must show the output in one text block.

**R-161** — The output must use Unicode characters only.

**R-162** — The output must not use HTML. The output must not use an image.

**R-163** — The user must be able to copy the output as plain text. The shape of the diagram must not change after the copy.

**R-164** — The output must be the same in all browsers. The tool must not use a font that changes the width of a character.

**R-165** — If the tool cannot draw the diagram, the tool must show the word `error:` and a short cause.

---

## 5. USER INTERFACE REQUIREMENTS

**R-170** — The workspace must be on the left side. The output must be on the right side.

**R-171** — The type selector must be at the top right of the window.

**R-172** — The workspace and the output must each get 50% of the window width.

**R-173** — The tool must use a monospace font for the workspace and the output.

**R-174** — The font size must be 13 px or more.

**R-175** — The tool must fill the browser window. The tool must not show a scroll bar for the page. The workspace and the output must each have their own scroll bar.

**R-176** — The tool must show a short example text in the workspace on the first load. The user must be able to delete the example text.

---

## 6. PERFORMANCE REQUIREMENTS

**R-180** — The tool must draw a diagram from 100 lines of source text in 50 ms or less on a usual desktop computer.

**R-181** — The tool must work in these browsers: Chrome, Firefox, Edge, Safari. Each browser must be a current version.

**R-182** — The tool must work with no internet connection after the first load.

**R-183** — The tool must start in 1 second or less on a usual desktop computer.

---

## 7. CONSTRAINTS

**R-190** — The tool must be one HTML file. The HTML file must contain the CSS and the JavaScript.

**R-191** — The tool must not use a library. The tool must not use a framework.

**R-192** — The tool must not use a build step. The user must open the HTML file directly.

**R-193** — The tool must not use a server.

**R-194** — The tool must not use TypeScript. The tool must not use JSX.

**R-195** — The tool must send no data to a network. The tool must not use a cookie.

**R-196** — The JavaScript must be in one `<script>` element. The CSS must be in one `<style>` element.

---

## 8. ACCEPTANCE TESTS

The tool is correct when all these tests agree.

### Test 1 — Tree
1. Put the Tree example from R-037 in the workspace.
2. Select Auto. Make sure the output agrees with R-037.

### Test 2 — Table
1. Put the Table example from R-046 in the workspace.
2. Select Auto. Make sure the output agrees with R-046.

### Test 3 — Flow
1. Put the Flow example from R-057 in the workspace.
2. Select Auto. Make sure the output agrees with R-057.

### Test 4 — Checklist
1. Put the Checklist example from R-065 in the workspace.
2. Select Auto. Make sure the output agrees with R-065.

### Test 5 — Bar
1. Put the Bar example from R-076 in the workspace.
2. Select Auto. Make sure the output agrees with R-076.

### Test 6 — State
1. Put the State example from R-085 in the workspace.
2. Select Auto. Make sure the output agrees with R-085.

### Test 7 — Timeline
1. Put the Timeline example from R-095 in the workspace.
2. Select Auto. Make sure the output agrees with R-095.

### Test 8 — Kanban
1. Put the Kanban example from R-107 in the workspace.
2. Select Auto. Make sure the output agrees with R-107.

### Test 9 — Matrix
1. Put the Matrix example from R-116 in the workspace.
2. Select Auto. Make sure the output agrees with R-116.

### Test 10 — Heatmap
1. Put the Heatmap example from R-126 in the workspace.
2. Select Auto. Make sure the output agrees with R-126.

### Test 11 — Sequence
1. Put the Sequence example from R-136 in the workspace.
2. Select Auto. Make sure the output agrees with R-136.

### Test 12 — Swimlane
1. Put the Swimlane example from R-146 in the workspace.
2. Select Auto. Make sure the output agrees with R-146.

### Test 13 — Gantt
1. Put the Gantt example from R-156 in the workspace.
2. Select Auto. Make sure the output agrees with R-156.

### Test 14 — Type Override
1. Put the Tree example in the workspace.
2. Select Flow. Make sure the output shows `error: no arrow`.
3. Select Tree. Make sure the output agrees with R-037.
4. Make sure the source text did not change.

### Test 15 — No Network
1. Load the tool one time.
2. Disconnect the internet.
3. Reload the tool.
4. Make sure the tool works.

### Test 16 — Update Time
1. Put 100 lines of source text in the workspace.
2. Make sure the output appears in 50 ms or less.

### Test 17 — Copy
1. Make a diagram.
2. Copy the output.
3. Put the output in a markdown file.
4. Make sure the shape of the diagram does not change.

---

## 9. FUTURE FUNCTIONS (NOT IN VERSION 2.0)

These functions are not in Version 2.0. The tool must not make these functions in Version 2.0.

- Dependency graph (DAG) diagram.
- Mind map diagram.
- Entity-relationship diagram.
- Class diagram.
- Venn diagram.
- Pie diagram.
- Network diagram.
- Undo and redo.
- Save the diagram to a file.
- Share the diagram with a URL.
- Live edit of the output.

Each new type must obey these rules:

- The new type must have a type selector option.
- The new type must have an Auto mode rule in R-021.
- The new type must have a test in Section 8.
- The new type must use Unicode characters only.
- The new type must use only one file. The new type must not use a library.

---

## 10. WORD RULES FOR THE TOOL

The tool must use the same word for the same thing. The tool must use these words:

| Use | Do not use |
| :--- | :--- |
| workspace | text area, input box, editor |
| source text | input, data, content |
| output | result, render, preview |
| diagram | chart, graph, figure |
| type | kind, mode, format |
| draw | render, generate, produce |
| show | display, present, visualize |

The word "Bar" in the type name is an exception. The tool must use "Bar" only for the Bar type.

The tool must not use a word from the "Do not use" column in the user interface.

---

**END OF DOCUMENT**
