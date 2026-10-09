const assert = require("node:assert/strict");
const braces = require("braces");

assert.deepEqual(braces("{a,b}", { expand: true }), ["a", "b"]);
assert.equal(braces.compile("{a,b}"), "(a|b)");

const deepBraces = "{".repeat(101) + "a,b" + "}".repeat(101);
assert.throws(() => braces.parse(deepBraces), /Nesting depth exceeds maximum/);
assert.throws(() => braces.compile(deepBraces), /Nesting depth exceeds maximum/);
assert.throws(() => braces.expand(deepBraces), /Nesting depth exceeds maximum/);

const deepParens = "(".repeat(101) + "x" + ")".repeat(101);
assert.throws(() => braces.parse(deepParens), /Nesting depth exceeds maximum/);

console.log("braces security backport tests passed");
