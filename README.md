oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Examples](#examples)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g strap
$ strap COMMAND
running command...
$ strap (--version)
strap/0.0.1 linux-x64 node-v20.5.0
$ strap --help [COMMAND]
USAGE
  $ strap COMMAND
...
```
<!-- usagestop -->
# Examples
See the examples folder
# Commands
<!-- commands -->
* [`strap create [NAME]`](#strap-create-name)
* [`strap edit NAME`](#strap-edit-name)
* [`strap install [NAME]`](#strap-install-name)
* [`strap list`](#strap-list)

## `strap create [NAME]`

Create a new strap

```
USAGE
  $ strap create [NAME]

ARGUMENTS
  NAME  name of the new strap

DESCRIPTION
  Create a new strap

EXAMPLES
  $ strap create some-strap
```

_See code: [dist/commands/create.ts](https://github.com/mortenscheel/strap/blob/v0.0.1/dist/commands/create.ts)_

## `strap edit NAME`

edit a strap file

```
USAGE
  $ strap edit NAME

ARGUMENTS
  NAME  strap name

DESCRIPTION
  edit a strap file

EXAMPLES
  $ strap edit some-strap
```

_See code: [dist/commands/edit.ts](https://github.com/mortenscheel/strap/blob/v0.0.1/dist/commands/edit.ts)_

## `strap install [NAME]`

install a strap

```
USAGE
  $ strap install [NAME]

ARGUMENTS
  NAME  Name of the strap to install

DESCRIPTION
  install a strap

EXAMPLES
  $ strap install some-strap
```

_See code: [dist/commands/install.ts](https://github.com/mortenscheel/strap/blob/v0.0.1/dist/commands/install.ts)_

## `strap list`

List all snaps

```
USAGE
  $ strap list [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  List all snaps

EXAMPLES
  $ strap list
```

_See code: [dist/commands/list.ts](https://github.com/mortenscheel/strap/blob/v0.0.1/dist/commands/list.ts)_
<!-- commandsstop -->
