/*
 * Acceptance and requirement tests for the Plain Text Diagram Tool.
 * Specification: PTD-SPEC-001, version 2.0.
 *
 * Run: node test/acceptance.test.js
 *
 * The test has no dependency and needs no browser. It reads index.html,
 * runs the page script in a small DOM stub, and checks the output text.
 */

"use strict";

const fs = require("fs");
const path = require("path");

const HTML_PATH = path.join(__dirname, "..", "index.html");
const html = fs.readFileSync(HTML_PATH, "utf8");

/* ---------- load the tool in a small DOM stub ---------- */

function loadTool() {
  const match = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!match) { throw new Error("the tool has no script element"); }
  const listeners = {};
  function make(tag) {
    return {
      tagName: tag, value: "", textContent: "", selected: false, children: [], options: [], style: {},
      addEventListener: (name, fn) => { listeners[tag + ":" + name] = fn; },
      appendChild(child) { this.children.push(child); if (this.options) { this.options.push(child); } return child; }
    };
  }
  const elements = {
    source: make("source"), output: make("output"), type: make("type"),
    copy: make("copy"), typeNote: make("typeNote"), hint: make("hint"), hintNote: make("hintNote")
  };
  elements.type.value = "auto";
  const document = {
    getElementById: (id) => elements[id],
    createElement: (tag) => make(tag),
    createRange: () => ({ selectNodeContents: () => {} }),
    execCommand: () => true
  };
  const window = { getSelection: () => ({ removeAllRanges: () => {}, addRange: () => {} }) };
  const navigator = { clipboard: null };
  new Function("document", "window", "navigator", match[1])(document, window, navigator);
  return { elements, listeners };
}

function draw(source, type) {
  const tool = loadTool();
  tool.elements.source.value = source;
  tool.elements.type.value = type || "auto";
  tool.listeners["source:input"]();
  return tool.elements.output.textContent;
}

/* ---------- the examples from the specification ---------- */

const TREE_SOURCE = "project/\n  src/\n    main.js\n  README.md";
const TREE_OUTPUT = "project/\n├── src/\n│   └── main.js\n└── README.md";
const TABLE_SOURCE = "Task|Owner|Due\nSpec|Ana|Mon\nBuild|Chen|Wed";
const TABLE_OUTPUT = "┌───────┬───────┬─────┐\n│ Task  │ Owner │ Due │\n├───────┼───────┼─────┤\n│ Spec  │ Ana   │ Mon │\n│ Build │ Chen  │ Wed │\n└───────┴───────┴─────┘";
const FLOW_SOURCE = "Draft -> Review -> Approved";
const FLOW_OUTPUT = "┌───────┐   ┌────────┐   ┌──────────┐\n│ Draft │──▶│ Review │──▶│ Approved │\n└───────┘   └────────┘   └──────────┘";
const CHECKLIST_SOURCE = "[x] Tests pass\n[ ] Security scan\n[x] Changelog\n[ ] Deploy";
const CHECKLIST_OUTPUT = "☑ Tests pass\n☐ Security scan\n☑ Changelog\n☐ Deploy";
const BAR_SOURCE = "Apples: 50\nBananas: 30\nCherries: 75\nDates: 10";
const BAR_OUTPUT = "Apples   ████████████████████ 50\nBananas  ████████████ 30\nCherries ██████████████████████████████ 75\nDates    ████ 10";
const STATE_SOURCE = "Draft --submit--> Review\nReview --approve--> Approved\nApproved --publish--> Published";
const STATE_OUTPUT = "┌───────┐ submit  ┌────────┐ approve ┌──────────┐ publish ┌───────────┐\n│ Draft │────────▶│ Review │────────▶│ Approved │────────▶│ Published │\n└───────┘         └────────┘         └──────────┘         └───────────┘";
const TIMELINE_SOURCE = "Q1: Research, Spec\nQ2: Build, MVP\nQ3: Beta, Feedback\nQ4: Launch, Retro";
const TIMELINE_OUTPUT = "Q1 ├─ Research\n   └─ Spec\nQ2 ├─ Build\n   └─ MVP\nQ3 ├─ Beta\n   └─ Feedback\nQ4 ├─ Launch\n   └─ Retro";
const KANBAN_SOURCE = "[Backlog]\nA\nB\n\n[In Progress]\nC\nD\n\n[Done]\nG";
const KANBAN_OUTPUT = "┌─────────┐ ┌─────────────┐ ┌────────┐\n│ Backlog │ │ In Progress │ │  Done  │\n├─────────┤ ├─────────────┤ ├────────┤\n│ A       │ │ C           │ │ G      │\n│ B       │ │ D           │ │        │\n└─────────┘ └─────────────┘ └────────┘";
const MATRIX_SOURCE = "X: Effort\nY: Impact\nTL: Quick wins\nTR: Big bets\nBL: Fill-ins\nBR: Avoid\nItems: Feature A(TL), Feature B(TR)";
const MATRIX_OUTPUT = "                 Effort\n          Low              High\n       ┌──────────────┬──────────────┐\nHigh   │ Quick wins   │ Big bets     │\nImpact │ Feature A    │ Feature B    │\n       ├──────────────┼──────────────┤\nLow    │ Fill-ins     │ Avoid        │\nImpact │              │              │\n       └──────────────┴──────────────┘";
const HEATMAP_SOURCE = "|   | Mon | Tue | Wed | Thu |\n|AM | 1   | 3   | 2   | 0   |\n|PM | 2   | 1   | 3   | 2   |";
const HEATMAP_OUTPUT = "      Mon Tue Wed Thu\nAM     ░   ▓   ▒\nPM     ▒   ░   ▓   ▒";
const SEQUENCE_SOURCE = "User -> Web: login\nWeb -> API: auth\nAPI -> DB: query\nDB -> API: data\nAPI -> Web: token\nWeb -> User: OK";
const SEQUENCE_OUTPUT = "User          Web           API           DB\n │──login──▶  │             │             │\n │            │──auth─────▶ │             │\n │            │             │──query────▶ │\n │            │             │ ◀──data──── │\n │            │ ◀──token─── │             │\n │ ◀──OK───── │             │             │";
const SWIMLANE_SOURCE = "Customer: Submit -> Receive\nSupport: Triage -> Resolve\nEngineering: Fix -> Verify";
const SWIMLANE_OUTPUT = "Customer    ┌────────┐   ┌─────────┐\n            │ Submit │──▶│ Receive │\n            └────────┘   └─────────┘\nSupport     ┌────────┐   ┌─────────┐\n            │ Triage │──▶│ Resolve │\n            └────────┘   └─────────┘\nEngineering ┌─────┐      ┌────────┐\n            │ Fix │──▶   │ Verify │\n            └─────┘      └────────┘";
const GANTT_SOURCE = "Plan: 0-10\nBuild: 10-25\nTest: 25-35\nRelease: 35-40";
const GANTT_OUTPUT = "Task      0         10        20        30        40\n          │─────────│─────────│─────────│─────────│\nPlan      ██████████\nBuild               ███████████████\nTest                               ██████████\nRelease                                      █████";

/* ---------- the test list ---------- */

const tests = [];
function test(name, fn) { tests.push({ name: name, fn: fn }); }

function same(actual, expected, name) {
  if (actual !== expected) {
    throw new Error(
      name + "\n  actual:   " + JSON.stringify(actual) +
      "\n  expected: " + JSON.stringify(expected)
    );
  }
}

function has(text, part, name) {
  if (text.indexOf(part) < 0) {
    throw new Error(name + "\n  missing: " + JSON.stringify(part) + "\n  in: " + JSON.stringify(text));
  }
}

/* Section 8 - acceptance tests */

test("Test 1 - Tree", function () {
  same(draw(TREE_SOURCE, "auto"), TREE_OUTPUT, "the tree output must equal the example");
});

test("Test 2 - Table", function () {
  same(draw(TABLE_SOURCE, "auto"), TABLE_OUTPUT, "the table output must equal the example");
});

test("Test 3 - Flow", function () {
  same(draw(FLOW_SOURCE, "auto"), FLOW_OUTPUT, "the flow output must equal the example");
});

test("Test 4 - Checklist", function () {
  same(draw(CHECKLIST_SOURCE, "auto"), CHECKLIST_OUTPUT, "the checklist output must equal the example");
});

test("Test 5 - Bar", function () {
  same(draw(BAR_SOURCE, "auto"), BAR_OUTPUT, "the bar output must equal the example");
});

test("Test 6 - State", function () {
  same(draw(STATE_SOURCE, "auto"), STATE_OUTPUT, "the state output must equal the example");
});

test("Test 7 - Timeline", function () {
  same(draw(TIMELINE_SOURCE, "auto"), TIMELINE_OUTPUT, "the timeline output must equal the example");
});

test("Test 8 - Kanban", function () {
  same(draw(KANBAN_SOURCE, "auto"), KANBAN_OUTPUT, "the kanban output must equal the example");
});

test("Test 9 - Matrix", function () {
  same(draw(MATRIX_SOURCE, "auto"), MATRIX_OUTPUT, "the matrix output must equal the example");
});

test("Test 10 - Heatmap", function () {
  same(draw(HEATMAP_SOURCE, "auto"), HEATMAP_OUTPUT, "the heatmap output must equal the example");
});

test("Test 11 - Sequence", function () {
  same(draw(SEQUENCE_SOURCE, "auto"), SEQUENCE_OUTPUT, "the sequence output must equal the example");
});

test("Test 12 - Swimlane", function () {
  same(draw(SWIMLANE_SOURCE, "auto"), SWIMLANE_OUTPUT, "the swimlane output must equal the example");
});

test("Test 13 - Gantt", function () {
  same(draw(GANTT_SOURCE, "auto"), GANTT_OUTPUT, "the gantt output must equal the example");
});

test("Test 14 - Type Override", function () {
  same(draw(TREE_SOURCE, "flow"), "error: no arrow", "a tree source in flow mode must show an error");
  same(draw(TREE_SOURCE, "tree"), TREE_OUTPUT, "the tree output must come back");
  const tool = loadTool();
  tool.elements.source.value = TREE_SOURCE;
  tool.elements.type.value = "flow";
  tool.listeners["type:change"]();
  const after = tool.elements.source.value;
  tool.elements.type.value = "tree";
  tool.listeners["type:change"]();
  if (after !== TREE_SOURCE) { throw new Error("the source text must not change"); }
});

test("Test 15 - No Network", function () {
  if (/https?:\/\//.test(html)) { throw new Error("the tool must not use a network address"); }
  if (/<(script|img|link)[^>]+(src|href)=/.test(html)) { throw new Error("the tool must not load a file"); }
});

test("Test 16 - Update Time", function () {
  let source = "";
  for (let i = 0; i < 50; i++) { source += "node" + i + "\n" + "  ".repeat(i % 5) + "child" + i + "\n"; }
  const tool = loadTool();
  tool.elements.source.value = source;
  const start = process.hrtime.bigint();
  tool.listeners["source:input"]();
  const ms = Number(process.hrtime.bigint() - start) / 1e6;
  if (ms > 50) { throw new Error("100 lines took " + ms.toFixed(2) + " ms, the limit is 50 ms"); }
});

test("Test 17 - Copy", function () {
  const tool = loadTool();
  tool.elements.source.value = TREE_SOURCE;
  tool.listeners["source:input"]();
  const text = tool.elements.output.textContent;
  if (text.indexOf("<") >= 0 || text.indexOf(">") >= 0) { throw new Error("the output must be plain text"); }
  tool.listeners["copy:click"]();
});

/* R-011, R-012 - the type selector */

test("R-011 - the selector has Auto and the thirteen types", function () {
  const tool = loadTool();
  const names = tool.elements.type.options.map((o) => o.text);
  const wanted = ["Auto", "Tree", "Table", "Flow", "Checklist", "Bar", "State", "Timeline", "Kanban", "Matrix", "Heatmap", "Sequence", "Swimlane", "Gantt"];
  same(names.join(","), wanted.join(","), "the selector must have the fourteen options in order");
});

test("R-012 - Auto is the default option", function () {
  const tool = loadTool();
  const auto = tool.elements.type.options[0];
  if (auto.value !== "auto" || !auto.selected) { throw new Error("Auto must be the default option"); }
});

/* R-020, R-021, R-022, R-024 - automatic type detection */

test("R-021 - the rules agree in the order of the table", function () {
  const cases = [
    [CHECKLIST_SOURCE, "checklist"], [KANBAN_SOURCE, "kanban"], [STATE_SOURCE, "state"],
    [SEQUENCE_SOURCE, "sequence"], [MATRIX_SOURCE, "matrix"], [GANTT_SOURCE, "gantt"],
    [BAR_SOURCE, "bar"], [TIMELINE_SOURCE, "timeline"], [SWIMLANE_SOURCE, "swimlane"],
    [HEATMAP_SOURCE, "heatmap"], [FLOW_SOURCE, "flow"], [TABLE_SOURCE, "table"], [TREE_SOURCE, "tree"]
  ];
  cases.forEach((item) => {
    const tool = loadTool();
    tool.elements.source.value = item[0];
    tool.listeners["source:input"]();
    const note = tool.elements.typeNote.textContent;
    const id = note.replace("Type: ", "").toLowerCase();
    if (id !== item[1]) { throw new Error("the source of " + item[1] + " was detected as " + id); }
  });
});

test("R-021 rule 1 - a checkbox line makes a checklist", function () {
  has(draw("[x] one", "auto"), "☑", "a checkbox line must give a checklist");
});

test("R-021 rule 2 - a line that is exactly [Name] makes a kanban", function () {
  has(draw("[Work]", "auto"), "┌", "a name line must give a kanban");
});

test("R-021 rule 3 - a labeled arrow makes a state", function () {
  has(draw("A --go--> B", "auto"), "go", "a labeled arrow must give a state");
});

test("R-021 rule 4 - an arrow and then a colon makes a sequence", function () {
  has(draw("A -> B: hi", "auto"), "hi", "an arrow with a message must give a sequence");
});

test("R-021 rule 5 - X: and Y: make a matrix", function () {
  has(draw("X: a\nY: b\nTL: c\nTR: d\nBL: e\nBR: f\nItems: g(TL)", "auto"), "Low", "X: and Y: must give a matrix");
});

test("R-021 rule 6 - a number range makes a gantt", function () {
  has(draw("Task: 1-5", "auto"), "█", "a number range must give a gantt");
});

test("R-021 rule 7 - every line with a number makes a bar", function () {
  has(draw("a: 1\nb: 2", "auto"), "█", "number lines must give a bar");
});

test("R-021 rule 8 - a line with two words makes a timeline", function () {
  has(draw("P: one, two", "auto"), "├─", "two words must give a timeline");
});

test("R-021 rule 9 - a name and then an arrow makes a swimlane", function () {
  has(draw("Lane: one -> two", "auto"), "Lane", "a lane must give a swimlane");
});

test("R-021 rule 10 - an arrow makes a flow", function () {
  has(draw("a -> b", "auto"), "──▶", "an arrow must give a flow");
});

test("R-021 rule 11 - two bars make a table", function () {
  has(draw("a|b|c", "auto"), "┌", "two bars must give a table");
});

test("R-021 rule 12 - a space at the start of a line makes a tree", function () {
  same(draw("a\n  b", "auto"), "a\n└── b", "a leading space must give a tree");
});

test("R-021 rule 13 - no rule agrees gives a tree", function () {
  same(draw("hello", "auto"), "hello", "plain text must give a tree");
});

test("R-022 - the tool tests all the lines, not only the first", function () {
  has(draw("plain line\nA -> B", "auto"), "──▶", "an arrow on the second line must still agree");
  has(draw("plain line\nA -> B", "auto"), "──▶", "the rule must agree on the second line");
  has(draw("plain line\n[Work]", "auto"), "┌", "the rule must agree on the second line");
  has(draw("[x] one\n[x] two", "auto"), "☑ one", "a checklist must still agree");
});

test("R-024 - a rule that agrees but fails to parse shows an error", function () {
  same(draw("[x] good\nnot a checkbox", "auto"), "error: no checkbox", "the tool must not try the next rule");
  same(draw("[x] good\n[ ] also good", "auto"), "☑ good\n☐ also good", "a good checklist must draw");
});

/* R-007 - the tool removes the spaces at the start and at the end of the lines */

test("R-007 - the tool removes the spaces at the end of the lines", function () {
  same(draw("[x] Tests pass   ", "auto"), "☑ Tests pass", "the tool must remove the trailing spaces");
  same(draw(BAR_SOURCE + "   ", "auto"), BAR_OUTPUT, "the tool must remove the trailing spaces");
});

test("R-003 - the tree keeps the spaces at the start of the lines", function () {
  same(draw("a\n  b", "auto"), "a\n└── b", "the tree must use the spaces for the depth");
});

/* R-060 .. R-065 - checklist */

test("R-062 - a done item shows the done box", function () {
  has(draw("[x] done", "checklist"), "☑ done", "a done item must show the done box");
});

test("R-063 - an open item shows the open box", function () {
  has(draw("[ ] open", "checklist"), "☐ open", "an open item must show the open box");
});

test("R-064 - one space between the box and the text", function () {
  same(draw("[x] done", "checklist"), "☑ done", "there must be one space");
});

test("R-065 - a line without a box shows an error", function () {
  same(draw("plain", "checklist"), "error: no checkbox", "the tool must show an error");
});

/* R-070 .. R-076 - bar */

test("R-072 - the labels are aligned to the left edge", function () {
  const out = draw(BAR_SOURCE, "bar");
  const starts = out.split("\n").map((line) => line.search(/\S/));
  starts.forEach((start) => {
    if (start !== 0) { throw new Error("the labels must start at the left edge"); }
  });
});

test("R-074 - the longest bar is 30 characters", function () {
  const out = draw(BAR_SOURCE, "bar");
  const lengths = out.split("\n").map((line) => (line.match(/█/g) || []).length);
  same(Math.max.apply(null, lengths), 30, "the longest bar must be 30 characters");
});

test("R-075 - the number is at the right of the bar", function () {
  const out = draw(BAR_SOURCE, "bar");
  if (out.indexOf("█ 75") < 0) { throw new Error("the number must be at the right of the bar"); }
});

test("R-076 - a line without a number shows an error", function () {
  same(draw("Apples", "bar"), "error: no number", "the tool must show an error");
});

/* R-080 .. R-085 - state */

test("R-083 - the label is centred above the arrow", function () {
  const out = draw(STATE_SOURCE, "state");
  const top = out.split("\n")[0];
  if (top.indexOf(" submit ") < 0) { throw new Error("the label must be above the arrow"); }
});

test("R-084 - the states keep the order of the source text", function () {
  const out = draw(STATE_SOURCE, "state");
  if (out.indexOf("Draft") > out.indexOf("Review")) { throw new Error("the order must be kept"); }
  if (out.indexOf("Review") > out.indexOf("Approved")) { throw new Error("the order must be kept"); }
});

test("R-085 - a line without a labeled arrow shows an error", function () {
  same(draw("a -> b", "state"), "error: no labeled arrow", "the tool must show an error");
});

/* R-090 .. R-095 - timeline */

test("R-094 - the first and the middle events use the tee mark", function () {
  const out = draw(TIMELINE_SOURCE, "timeline");
  has(out, "├─ Research", "the first event must use the tee mark");
  has(out, "├─ Build", "the first event must use the tee mark");
});

test("R-094 - the last event uses the corner mark", function () {
  const out = draw(TIMELINE_SOURCE, "timeline");
  has(out, "└─ Spec", "the last event must use the corner mark");
});

test("R-095 - one space between the period and the marker", function () {
  const out = draw(TIMELINE_SOURCE, "timeline");
  if (out.indexOf("Q1 ├─") < 0) { throw new Error("there must be one space"); }
});

/* R-100 .. R-107 - kanban */

test("R-105 - the column width is the longest card or the header, with 6 as the minimum", function () {
  const out = draw(KANBAN_SOURCE, "kanban");
  if (out.indexOf("┌────────┐") < 0) { throw new Error("the Done column must have the minimum width of 6"); }
});

test("R-106 - all the columns have the same height", function () {
  const out = draw(KANBAN_SOURCE, "kanban");
  const rows = out.split("\n");
  same(rows.length, 6, "the diagram must have six rows");
  same(rows[4].indexOf("│        │") > 0, true, "the short column must get an empty row");
});

test("R-107 - a source without a name line shows an error", function () {
  same(draw("A\nB", "kanban"), "error: no column", "the tool must show an error");
});

/* R-110 .. R-116 - matrix */

test("R-114 - the item goes into the quadrant that it names", function () {
  const out = draw(MATRIX_SOURCE, "matrix");
  if (out.indexOf("Quick wins") > out.indexOf("Feature A")) { throw new Error("the item must be under its quadrant"); }
});

test("R-115 - the tool accepts one item or more items", function () {
  const out = draw("X: Effort\nY: Impact\nTL: a\nTR: b\nBL: c\nBR: d\nItems: one(TL), two(BL)", "matrix");
  has(out, "one", "the items must be in the diagram");
  has(out, "two", "the items must be in the diagram");
});

test("R-116 - a missing line shows an error", function () {
  same(draw("X: Effort\nY: Impact\nTL: a\nTR: b\nBL: c\nItems: one(TL)", "matrix"), "error: missing BR", "the tool must show an error");
  same(draw("X: Effort\nY: Impact\nTL: a\nTR: b\nBL: c\nBR: d", "matrix"), "error: missing Items", "the tool must use the name of the line");
});

/* R-120 .. R-126 - heatmap */

test("R-124 - the numbers change to the shading characters", function () {
  const out = draw(HEATMAP_SOURCE, "heatmap");
  has(out, "░", "the value 1 must show the light shading");
  has(out, "▒", "the value 2 must show the medium shading");
  has(out, "▓", "the value 3 must show the dark shading");
});

test("R-126 - a cell without a number from 0 to 3 shows an error", function () {
  same(draw("|   | Mon |\n|AM | 9   |", "heatmap"), "error: bad value", "the tool must show an error");
});

/* R-130 .. R-136 - sequence */

test("R-132 - the participants keep the order of the first appearance", function () {
  const out = draw(SEQUENCE_SOURCE, "sequence");
  const head = out.split("\n")[0];
  if (head.indexOf("User") > head.indexOf("Web")) { throw new Error("the order must be kept"); }
  if (head.indexOf("Web") > head.indexOf("API")) { throw new Error("the order must be kept"); }
  if (head.indexOf("API") > head.indexOf("DB")) { throw new Error("the order must be kept"); }
});

test("R-135 - the arrow points to the receiver", function () {
  const out = draw(SEQUENCE_SOURCE, "sequence");
  has(out, "──▶", "an arrow to the right must use the right mark");
  has(out, "◀──", "an arrow to the left must use the left mark");
});

test("R-136 - a line without a colon shows an error", function () {
  same(draw("a -> b", "sequence"), "error: no message", "the tool must show an error");
});

/* R-140 .. R-146 - swimlane */

test("R-142 - the lane name is at the left", function () {
  const out = draw(SWIMLANE_SOURCE, "swimlane");
  if (out.indexOf("Customer") !== 0) { throw new Error("the lane name must be at the left"); }
});

test("R-145 - all the lanes start at the same column", function () {
  const out = draw(SWIMLANE_SOURCE, "swimlane");
  const starts = out.split("\n").filter((line) => line.indexOf("│") >= 0).map((line) => line.indexOf("│"));
  starts.forEach((start) => {
    if (start !== 12) { throw new Error("the lanes must be aligned at column 12"); }
  });
});

test("R-146 - a line without a colon shows an error", function () {
  same(draw("no colon here", "swimlane"), "error: no lane", "the tool must show an error");
});

/* R-150 .. R-156 - gantt */

test("R-153 - the bar starts at the start and ends at the end", function () {
  const out = draw(GANTT_SOURCE, "gantt");
  const rows = out.split("\n");
  const test = rows[4];
  if (test.indexOf("█") !== 35) { throw new Error("the Test bar must start at column 35"); }
  if ((test.match(/█/g) || []).length !== 10) { throw new Error("the Test bar must be 10 characters long"); }
});

test("R-155 - the axis is 40 characters wide", function () {
  const out = draw(GANTT_SOURCE, "gantt");
  const axis = out.split("\n")[1];
  if (axis.indexOf("│") !== 10) { throw new Error("the axis must start at column 10"); }
  if ((axis.match(/│/g) || []).length !== 5) { throw new Error("the axis must have five ticks"); }
  if (axis.length - 10 !== 41) { throw new Error("the axis must be 40 characters wide"); }
});

test("R-156 - a range that does not increase shows an error", function () {
  same(draw("Task: 10-5", "gantt"), "error: bad range", "the tool must show an error");
});

/* The hint button - an addition to the specification of version 2.0 */

/* R-HINT-001 - the tool can show an example for the type on request */
test("R-HINT-001 - the hint button shows an example for the type", function () {
  const tool = loadTool();
  tool.elements.source.value = TREE_SOURCE;
  tool.listeners["source:input"]();
  tool.elements.type.value = "flow";
  tool.listeners["type:change"]();
  tool.listeners["hint:click"]();
  const hint = tool.elements.hintNote.textContent;
  if (hint.indexOf("Draft -> Review -> Approved") < 0) { throw new Error("the hint must show the example of the type"); }
  if (tool.elements.source.value !== TREE_SOURCE) { throw new Error("the hint must not change the source text"); }
});

test("R-HINT-002 - the hint follows the type", function () {
  const tool = loadTool();
  tool.elements.type.value = "tree";
  tool.listeners["type:change"]();
  tool.listeners["hint:click"]();
  if (tool.elements.hintNote.textContent.indexOf("project/") < 0) { throw new Error("the hint must show the tree example"); }
  tool.elements.type.value = "checklist";
  tool.listeners["type:change"]();
  if (tool.elements.hintNote.textContent.indexOf("[x]") < 0) { throw new Error("the hint must show the checklist example"); }
});

test("R-HINT-003 - the hint button hides the hint again", function () {
  const tool = loadTool();
  tool.listeners["hint:click"]();
  if (tool.elements.hintNote.textContent === "") { throw new Error("the hint must show an example"); }
  tool.listeners["hint:click"]();
  if (tool.elements.hintNote.textContent !== "") { throw new Error("the hint must hide the example"); }
});

/* R-030 .. R-046 - the types of version 1.0 */

test("R-031 - one line becomes one node", function () {
  same(draw("a\nb\nc", "tree"), "a\nb\nc", "three lines must give three nodes");
});

test("R-032 - two spaces make one depth level", function () {
  same(draw("a\n  b\n    c", "tree"), "a\n└── b\n    └── c", "the depth must follow the spaces");
});

test("R-033 - the tool uses the tree characters", function () {
  const out = draw("a\n  b\n    c\n  d", "tree");
  has(out, "├──", "the tool must use the tree characters");
  has(out, "└──", "the tool must use the tree characters");
  has(out, "│", "the tool must use the tree characters");
});

test("R-034 - the last child uses the corner mark", function () {
  same(draw("a\n  b\n  c", "tree"), "a\n├── b\n└── c", "the last child must use the last mark");
});

test("R-037 - the root node has no prefix", function () {
  const out = draw(TREE_SOURCE, "tree");
  if (out.indexOf("project/") !== 0) { throw new Error("the root node must not have a prefix"); }
});

test("R-041 - one line becomes one row", function () {
  const out = draw("a|b|c\nd|e|f", "table");
  same(out.split("\n").length, 5, "two rows must give five lines");
});

test("R-043 - the first row is the header row", function () {
  const out = draw("H1|H2\nv1|v2", "table");
  if (out.indexOf("H1") > out.indexOf("v1")) { throw new Error("the header row must come first"); }
});

test("R-044 - the tool uses the table characters", function () {
  const out = draw("a|b\nc|d", "table");
  "┌┬┐├┼┤└┴┘│─".split("").forEach(function (ch) {
    if (out.indexOf(ch) < 0) { throw new Error("the table must use " + ch); }
  });
});

test("R-045 - the column width is the longest cell, with 3 as the minimum", function () {
  same(draw("A|B|C", "table"), "┌─────┬─────┬─────┐\n│ A   │ B   │ C   │\n└─────┴─────┴─────┘", "the minimum content width is 3");
});

test("R-046 - a short row gets empty cells", function () {
  same(draw("A|B|C\n1", "table"), "┌─────┬─────┬─────┐\n│ A   │ B   │ C   │\n├─────┼─────┼─────┤\n│ 1   │     │     │\n└─────┴─────┴─────┘", "the short row must get empty cells");
});

test("R-051 - all three arrow signs work", function () {
  same(draw("A -> B", "flow"), draw("A => B", "flow"), "the signs must have the same effect");
  same(draw("A -> B", "flow"), draw("A → B", "flow"), "the signs must have the same effect");
});

test("R-054 - the boxes have the arrow between them", function () {
  has(draw("A -> B", "flow"), "──▶", "the tool must put the arrow between the boxes");
});

test("R-056 - the box width is the name length plus 2", function () {
  const out = draw("A -> BB", "flow");
  same(out.split("\n")[0].split("┌")[1].indexOf("┐"), 3, "the box width must be the name length plus 2");
});

test("R-057 - a source without an arrow shows an error", function () {
  same(draw("a\nb", "flow"), "error: no arrow", "the tool must show the error text");
});

/* R-160 .. R-165 - output */

test("R-162 - the output is not HTML and not an image", function () {
  if (/<img|<svg/.test(html)) { throw new Error("the output must not use an image"); }
});

test("R-165 - a draw error shows error: and a cause", function () {
  const out = draw("", "auto");
  if (out.indexOf("error:") !== 0) { throw new Error("the error must start with error:"); }
  if (out.length < 9) { throw new Error("the error must have a cause"); }
});

test("R-014 - the source text does not change when the type changes", function () {
  const tool = loadTool();
  tool.elements.source.value = TABLE_SOURCE;
  tool.listeners["source:input"]();
  tool.elements.type.value = "flow";
  tool.listeners["type:change"]();
  if (tool.elements.source.value !== TABLE_SOURCE) { throw new Error("the source text must not change"); }
});

/* R-170 .. R-176 - user interface */

test("R-170 - the workspace is on the left and the output is on the right", function () {
  if (html.indexOf('id="source"') > html.indexOf('id="output"')) {
    throw new Error("the workspace must come before the output");
  }
});

test("R-172 - the two panes get 50% of the width", function () {
  if (!/width:\s*50%/.test(html)) { throw new Error("the panes must get 50% of the width"); }
});

test("R-173 - the tool uses a monospace font", function () {
  if (!/font-family:[^;]*monospace/.test(html)) { throw new Error("the tool must use a monospace font"); }
});

test("R-174 - the font size is 13 px or more", function () {
  const sizes = (html.match(/font-size:\s*(\d+)px/g) || []).map(function (m) { return Number(m.match(/\d+/)[0]); });
  if (!sizes.length || Math.min.apply(null, sizes) < 13) { throw new Error("the font size must be 13 px or more"); }
  const pane = html.match(/textarea, pre \{[^}]*\}/)[0];
  const size = Number((pane.match(/font-size:\s*(\d+)px/) || [])[1]);
  if (!(size >= 13)) { throw new Error("the workspace and the output must use 13 px or more"); }
});

test("R-175 - the page does not scroll and the panes do", function () {
  if (!/overflow:\s*hidden/.test(html)) { throw new Error("the page must not scroll"); }
  if (!/textarea, pre \{[^}]*overflow:\s*auto/s.test(html)) { throw new Error("the panes must scroll"); }
});

test("R-176 - the workspace shows an example on the first load", function () {
  const tool = loadTool();
  if (tool.elements.source.value.trim() === "") { throw new Error("the tool must show an example text"); }
});

/* R-190 .. R-196 - constraints */

test("R-190 - the tool is one HTML file with the CSS and the JavaScript", function () {
  if ((html.match(/<style/g) || []).length !== 1) { throw new Error("the tool must have one style element"); }
  if ((html.match(/<script/g) || []).length !== 1) { throw new Error("the tool must have one script element"); }
});

test("R-191 - the tool uses no library and no framework", function () {
  if (/<script[^>]+src=/.test(html)) { throw new Error("the tool must not load a library"); }
  if (/react|vue|angular|jquery|svelte/i.test(html)) { throw new Error("the tool must not use a framework"); }
});

test("R-194 - the tool uses no TypeScript and no JSX", function () {
  if (/\.tsx?["']/.test(html) || /<[A-Z][A-Za-z]+\s*\/>/.test(html)) {
    throw new Error("the tool must not use TypeScript or JSX");
  }
});

test("R-195 - the tool sends no data to a network and uses no cookie", function () {
  if (/fetch\(|XMLHttpRequest|document\.cookie|localStorage|sessionStorage/.test(html)) {
    throw new Error("the tool must not send data or store data");
  }
});

test("Section 10 - the tool does not use a banned word", function () {
  const visible = html
    .replace(/<script>[\s\S]*?<\/script>/g, "")
    .replace(/<style>[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ");
  const banned = ["editor", "preview", "render", "chart", "graph", "figure", "mode", "format", "kind", "display", "visualize", "generate", "produce", "text area", "input box"];
  banned.forEach(function (word) {
    if (new RegExp("\\b" + word + "\\b", "i").test(visible)) {
      throw new Error("the user interface must not use the word " + word);
    }
  });
});

/* ---------- run the tests ---------- */

let failed = 0;
tests.forEach(function (item) {
  try {
    item.fn();
    console.log("ok   " + item.name);
  } catch (error) {
    failed++;
    console.log("FAIL " + item.name);
    console.log("     " + error.message.split("\n").join("\n     "));
  }
});

console.log("");
console.log(tests.length - failed + " of " + tests.length + " tests passed.");
process.exit(failed === 0 ? 0 : 1);
