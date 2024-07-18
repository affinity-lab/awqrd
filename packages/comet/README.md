# Comet

Comet is a simple and fast api framework for Node.js.

## Update history

### 1.0.179

***Breaking Change!***

`Clients::readCommands` now don't accept a path to read commands from. Commands should be loaded manually.

`Example`

```ts
import FastGlob from "fast-glob";

const files = FastGlob.globSync(path.resolve(process.cwd(), 'src', 'commands', '**', '*.ts').replaceAll('\\', "/"));
await Promise.all(files.map(async (filename: string) => await import(filename)));
clients.readCommands();
clients.describe();
```

***Breaking Change!***

`ValidateMiddleware` has been removed. Use `preprocess` instead.