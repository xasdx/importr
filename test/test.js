let test = require("ava")

let importr = require("..")()

test("imports user-defined modules", t => {
  let m = importr("module-b")
  t.is(m.behavior(), "hey")
})

test("imports external modules", t => {
  let m = importr("ext_ava")
  t.pass()
})

test("imports node modules", t => {
  let util = importr("node_util")
  t.true(util.isNull(null))
})

test("rejects non-existing node modules", t => t.throws(() => importr("node_non-existing-module")))

test("rejects non-existing user-defined modules", t => {
  let error = t.throws(() => importr("non-existing-module"))
  t.true(error.message.includes("no file exists with the given name"))
})

test("rejects ambiguous module names", t => {
  let error = t.throws(() => importr("module-"))
  t.true(error.message.includes("found multiple matches for the given name"))
})

test("rejects invalid module names", t => {
  let error = t.throws(() => importr(3))
  t.true(error.message.includes("is not a valid module name"))
})

test("imports multiple modules", t => {
  let m = importr(["node_util", "module-a", "module-b"])
  t.true(m.node_util.isNull(null))
  t.is(m["module-a"].data, "hello")
  t.is(m["module-b"].behavior(), "hey")
})

test("rejects empty lists when importing multiple modules", t => {
  let error = t.throws(() => importr([]))
  t.true(error.message.includes("the module list should contain at least one module name"))
})

test("aliases module names", t => {
  let m = importr(["node_util", "module-a"], ["util", "a"])
  t.true(m.util.isNull(null))
  t.is(m.a.data, "hello")
})

test("fails when module list and alias list are different in length", t => {
  let error = t.throws(() => importr(["node_util", "module-a"], ["util"]))
  t.true(error.message.includes("module list and alias list should be the same length"))
})

test("rejects non-string values as aliases", t => {
  let error = t.throws(() => importr(["module-a"], [0]))
  t.true(error.message.includes("is not a valid alias"))
})

test("rejects empty strings as aliases", t => {
  let error = t.throws(() => importr(["module-a"], [""]))
  t.true(error.message.includes("empty string is not a valid alias"))
})
