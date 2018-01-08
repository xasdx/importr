# importr

> Microlibrary that simplifies the process of importing NodeJS modules

## Usage

After you have imported the library you must initialize it with a path that points to your project's root (or the directory you want to recursively scan for modules):

```js
let projectRootDir = __dirname
let importr = require("importr")(projectRootDir)
```

### Importing modules

The next step is to actually import modules with _importr_.

You can import a user-defined module:

```js
let myModule = importr("moduleName")
myModule.doThat()
```

Or import built-in NodeJS modules by prefixing their name with `node_`:

```js
let util = importr("node_util")
util.isNull(null)
```

You can also import multiple modules if you pass an array of module names:

```js
let m = importr(["node_util", "stringUtil", "mailService"])
m.node_util.isNull(null)
m.stringUtil.doSomething()
m.mailService.doSomethingElse()
```

### Creating aliases

Don't like the module names? Create aliases for them by passing a second array of strings:

```js
let _ = importr(["node_util", "module_a"], ["util", "a"])
_.util.isNull(null)
_.a.hi()
```
