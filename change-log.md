# Comet

#### latest

> CometResult has been added as common return type for all middlewares.
- Commands can return a `CometResult` or `any`. Anything else than `CometResult` will be converted to `CometResult` with
status `200` automatically.

> `CometState.env` type has been changed from `Record<string, any>` to `{ [key: symbol | string]: any }`.

#### 1.0.179

> `Clients::readCommands` now don't accept a path to read commands from. Commands should be loaded manually.
>
>`Example`
>
>```ts
>import FastGlob from "fast-glob";
>
>const files = FastGlob.globSync(path.resolve(process.cwd(), 'src', 'commands', '**', '*.ts').replaceAll('\\', "/"));
>await Promise.all(files.map(async (filename: string) => await import(filename)));
>clients.readCommands();
>clients.describe();
>```

> `ValidateMiddleware` has been removed. Use `preprocess` instead.

# Comet-SvelteKit

#### latest

> SvelteKit render middleware added.

# Sapphire

#### latest

> Errorhandler returns `CometResult` instead of `any`

# Storm-Storage-Server-SvelteKit

#### latest

> The named image filename and url schema has been changed. The new schema uses `~` instead of `:`.

# Util

#### latest

> JWT now accepts `number|string` as the `exp` claim instead of `string`.

> Interval calculator added.
