# Storm Storage Server for SvelteKit

This package will help to resolve the paths of the files stored in the Storage plugin of Storm ORM.
It will automatically generate the URL of the files, and the URL of the images.

## Usage

> Have a project setup with SvelteKit, and Storm ORM with the Storage plugin.

#### Set your Storage paths to the static folder of your SvelteKit project.

`.env`

```dotenv
PATH_FILES="static/file"
PATH_IMG="static/img"
```

#### Add the image resolver to the routes.

`src/routes/img/[image]/+serevr.ts`

```ts
import {namedImgDimensions} from "$lib/named-img";
import {services} from "$lib/services";
import {imgServerFactory} from "@affinity-lab/storm-storage-server-sveltekit/server";
import {keysOfNamedImageDimensions} from "./named-image-dimensions";

export const GET = imgServerFactory(
	services.config.storage.imgPath, // Path to the images
	services.config.storage.filePath, // Path to the files
	{
		namedImageDimensions: namedImageDimensions, // Named image dimensions
		allowFree: false, // Allow free image dimensions for the images
		fileNameParam: "image" // The name of the parameter that will be used to get the image name
	}
);
```

> *You should always set the `allowFree` option to `false` in production to avoid security issues.*

### Create the named image dimensions.

`src/lib/named-img.ts`

```ts
import {keysOfNamedImageDimensions} from "@affinity-lab/storm-storage-server-sveltekit";

export const namedImgDimensions = {
	user: {
		avatar: {
			mini: {width: 48, height: 48},
			big: {width: 192, height: 192}
		}
	}
}

export const namedImg = keysOfNamedImageDimensions(namedImgDimensions); // this will create the named image dimensions map for client side
```

### Configure Collection Handlers in the +layout.ts

`src/routes/+layout.svelte`

```ts
import {ImageHandler} from "@affinity-lab/storm-storage-server-sveltekit";
import {FileHandler} from "@affinity-lab/storm-storage-server-sveltekit";

FileHandler.url = "/file";
ImageHandler.url = "/img";
```

> `/file` and `/img` are the default settings, if you stick to the default settings, you can skip this step.

### Use the handlers in the components.

`Any component or page. eg: src/routes/+page.svelte`

```sveltehtml

<script lang="ts">
	import {namedImg} from "$lib/named-img";
	import {ImageHandler} from "@affinity-lab/storm-storage-server-sveltekit";

	let {data} = $props();
</script>

{#each ImageHandler.create(data.user?.avatar).files as file, i}

	You can use the file URL directly:
	<a href={file.url} target="_blank">{file.name}</a>

	You have access to the metadata of the file:
	{file.metadata.width}

	You can use the img property's size, height, and width methods
	to generate the resized image URL. This is only available when
	the allowFree option is set to true in the imgServerFactory.
	<img src={file.img.size(50,50)} srcset="{file.img(50,50).x2} 2x">

	You can use the named method to generate the named image URL:
	<img src={file.img.named(namedImg.user.avatar.mini)}>

	You can set the format of the image. The default is "webp".
	When the as() function called without any arguments, it will use
	the original format of the image.
	<img src={file.img.named(namedImg.user.avatar.mini).as("png")}>

	You can use the x2, x3, x4 properties to generate the 2x, 3x, 4x sized
	images for high-resolution displays.
	<img src={file.img.named(namedImg.user.avatar.mini)}
	     srcset="{file.img.named(namedImg.user.avatar.mini).x2} 2x">

	You can use the srcset method to generate the srcset attribute for the image
	up to the specified resolution (max 4x, default: 3x).
	<img src={file.img.named(namedImg.user.avatar.mini)}
	     srcset="{file.img.named(namedImg.user.avatar.mini).srcset(2)}">

{/each}
```

### Handle the content of the `static/img` folder.

All images in the `static/img` folder will be generated automatically by the server.
You can delete those images from the folder regularly, to save space, and the server
will generate them again, when the image is requested.

> For example run a cron job to delete the images older than 1 day.
