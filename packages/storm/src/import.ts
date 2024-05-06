import {ClassMetaData} from "@affinity-lab/util";


export function Import(target: any, name: PropertyKey,): void {
	Import.metadata.get(target.constructor, true).push("import", name);
}

Import.metadata = new ClassMetaData()
