let test = require("ava")

let importr = require("..")

test("imports user-defined modules", t => {
  let m = importr("module-b")
  t.is(m.behavior(), "hey")
})

test("imports external modules", t => importr("ext_ava"))

test("imports node modules", t => {
  let util = importr("node_util")
  t.true(util.isNull(null))
})
