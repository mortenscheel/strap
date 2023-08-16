oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g strap
$ strap COMMAND
running command...
$ strap (--version)
strap/0.0.1 darwin-arm64 node-v20.1.0
$ strap --help [COMMAND]
USAGE
  $ strap COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`strap help [COMMANDS]`](#strap-help-commands)
* [`strap install NAME`](#strap-install-name)
* [`strap list`](#strap-list)
* [`strap plugins`](#strap-plugins)
* [`strap plugins:install PLUGIN...`](#strap-pluginsinstall-plugin)
* [`strap plugins:inspect PLUGIN...`](#strap-pluginsinspect-plugin)
* [`strap plugins:install PLUGIN...`](#strap-pluginsinstall-plugin-1)
* [`strap plugins:link PLUGIN`](#strap-pluginslink-plugin)
* [`strap plugins:uninstall PLUGIN...`](#strap-pluginsuninstall-plugin)
* [`strap plugins:uninstall PLUGIN...`](#strap-pluginsuninstall-plugin-1)
* [`strap plugins:uninstall PLUGIN...`](#strap-pluginsuninstall-plugin-2)
* [`strap plugins:update`](#strap-pluginsupdate)

## `strap help [COMMANDS]`

Display help for strap.

```
USAGE
  $ strap help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for strap.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.17/src/commands/help.ts)_

## `strap install NAME`

Install a strap

```
USAGE
  $ strap install NAME

ARGUMENTS
  NAME  Name of the strap to install

DESCRIPTION
  Install a strap

EXAMPLES
  $ strap install
```

_See code: [dist/commands/install.ts](https://github.com/mortenscheel/strap/blob/v0.0.1/dist/commands/install.ts)_

## `strap list`

List all snaps

```
USAGE
  $ strap list

DESCRIPTION
  List all snaps

EXAMPLES
  $ strap list
```

_See code: [dist/commands/list.ts](https://github.com/mortenscheel/strap/blob/v0.0.1/dist/commands/list.ts)_

## `strap plugins`

List installed plugins.

```
USAGE
  $ strap plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ strap plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.2.6/src/commands/plugins/index.ts)_

## `strap plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ strap plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ strap plugins:add

EXAMPLES
  $ strap plugins:install myplugin 

  $ strap plugins:install https://github.com/someuser/someplugin

  $ strap plugins:install someuser/someplugin
```

## `strap plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ strap plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ strap plugins:inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.2.6/src/commands/plugins/inspect.ts)_

## `strap plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ strap plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ strap plugins:add

EXAMPLES
  $ strap plugins:install myplugin 

  $ strap plugins:install https://github.com/someuser/someplugin

  $ strap plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.2.6/src/commands/plugins/install.ts)_

## `strap plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ strap plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ strap plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.2.6/src/commands/plugins/link.ts)_

## `strap plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ strap plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ strap plugins:unlink
  $ strap plugins:remove
```

## `strap plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ strap plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ strap plugins:unlink
  $ strap plugins:remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.2.6/src/commands/plugins/uninstall.ts)_

## `strap plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ strap plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ strap plugins:unlink
  $ strap plugins:remove
```

## `strap plugins:update`

Update installed plugins.

```
USAGE
  $ strap plugins:update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.2.6/src/commands/plugins/update.ts)_
<!-- commandsstop -->
