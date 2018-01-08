let fs = require("fs")
let path = require("path")
let util = require("util")
let assert = require("assert")

let scanSyncRecursive = (dir, fileList) => {
  let files = fs.readdirSync(dir)
  fileList = fileList || []
  files.forEach(file => {
    let filePath = path.join(dir, file)
    if (isFileIgnored(file)) { return }
    if (isDirectory(filePath)) { scanSyncRecursive(filePath, fileList) }
                          else { fileList.push({ fileName: file, path: filePath }) }
  })
  return fileList
}

let isFileIgnored = (file) => file.charAt(0) === "." || file === "node_modules"

let isDirectory = (path) => fs.statSync(path).isDirectory()

let isNodeModule = (name) => name.slice(0, 5) === "node_"

let isExternalModule = (name) => name.slice(0, 4) === "ext_"

let getNodeModuleName = (name) => name.slice(5)

let getExternalModuleName = (name) => name.slice(4)

let err = (text) => `[importr] ${text}`

assert.notEmptyArray = (array, message) => assert.notEqual(array.length, 0, message)

let validateAlias = (alias) => {
  assert.ok(util.isString(alias), err(`'${alias}' is not a valid alias`))
  assert.notEqual(alias, "", err("empty string is not a valid alias"))
}

let sourceFiles = scanSyncRecursive(__dirname)
  

let getOne = (importName) => {
  assert.ok(util.isString(importName), err(`'${importName}' is not a valid module name`))
  if (isNodeModule(importName)) { return require(getNodeModuleName(importName)) }
  if (isExternalModule(importName)) { return require(getExternalModuleName(importName)) }
  let file = loadFile(importName)
  return require(file.path)
}

let getAll = (importList, aliasList) => {
  assert.notEmptyArray(importList, err("the module list should contain at least one module name"))
  return importList.reduce((importObject, name, index) => {
    if (aliasList) {
      assert.equal(importList.length, aliasList.length, err("module list and alias list should be the same length"))
      let alias = aliasList[index]
      validateAlias(alias)
      importObject[alias] = getOne(name)
    } else { importObject[name] = getOne(name) }
    return importObject
  }, {})
}

let loadFile = (name) => {
  let matchingFiles = sourceFiles.filter(file => file.fileName.includes(name))
  assert.notEmptyArray(matchingFiles, err(`no file exists with the given name '${name}'`))
  assert.ok(matchingFiles.length < 2, err(`found multiple matches for the given name '${name}'`))
  return matchingFiles[0]
}


module.exports = (importList, aliasList) => {
  if (Array.isArray(importList)) { return getAll(importList, aliasList) }
                            else { return getOne(importList) }
}
