# TXL Component Browser & Docgen

Inspired by [React ToolBox](http://react-toolbox.com/#/components) and [React StyleGuide Generator](https://github.com/pocotan001/react-styleguide-generator) comes the next generation of component sandboxing and collaboration. Currently targeted at [TXL_components][txl]

## Installation

Installing the project through npm, creates a txl-docs cli. Otherwise commands can be executed through `./bin/cli.js `

```shell
npm install txl-docs -D
```

### CLI

usage
```shell
txl-docs [start|generate:dll|deploy] [options]
```

`start [options]` runs server at localhost:[port] for txl docs

| Option | Description | Default |
| --- | --- | --- |
| `--demo-ext [ext]` | Specify demo find extension | .demo.jsx |
| `-p, --port [port]` | Specify port: [port] | 8080 |
| `-l, --log-level` | Specify log level: [level], (debug, info, warn, error, off) | info |

`generate:dll` creates a vendor dll, and is used to force the docs to recreate a dll. This dll should update automatically on start if the package.json has changed since the last run. But if you need to force the update or if the vendor.dll becomes broken run this command.

`deploy [options]` builds the productions version of the docs, and uploads them to S3.

| Option | Description | Default |
| --- | --- | --- |
| `-b, -s3-Bucket` | the name of the current s3 bucket for the docs | tune-frontend |
| `-B, --no-build` | Skip the build step. | false |
| `-U, --no-upload` | Skip the upload step. | false |
| `-i, --key-id [id]` | The Aws access key | `process.env.AWS_ACCESS_KEY_ID` |
| `-s, --secret-key [id]` | The Aws secret access key id | `process.env.AWS_SECRET_ACCESS_KEY` |

> Aws credentials can also be configured through your `~/.aws/credentials` file.

## Documenting components

To create a component demo, create a file `[component].demo.jsx`. Then from that demo file export a valid react component and that will be the rendered demo. Make sure to create a demo file for each component in the demo, for example if both a

> Note: In the legacy demos, a global return is used instead of `export default`.

[txl]: https://gitlab.corp.tune.com/engineering/TXL_components
