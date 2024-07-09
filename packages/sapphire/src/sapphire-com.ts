import {IForm} from "./form";
import {IList} from "./list";
import {MaybePromise, MaybeUnset, TmpFile} from "@affinity-lab/util";
import {Comet, type CometState} from "@affinity-lab/comet";
import {sapphireError} from "./error";
import {Dto} from "@affinity-lab/storm";


export abstract class SapphireCom {
	protected constructor(
		protected readonly formAdapter?: IForm<any, any> | undefined,
		protected readonly listAdapter?: IList,
		protected readonly tmpFile?: (...args: any) => Promise<TmpFile>,
	) {
		if(formAdapter === undefined && tmpFile !== undefined) throw Error(`form adapter is a requirement to handle files ${this.constructor.name}`);
	}

	protected preprocesses(state: CometState): MaybePromise<void> {}

	@Comet.Command({preprocess: (state:CometState)=>state.cmd.instance.preprocesses(state)})
	async list(@Comet.Args args: {reqPageIndex: number, pageSize: number, search?: string, order?: string, filter?: Record<string, any>}, @Comet.Env env: any): Promise<{ count: number; page: number; items: any[] }> | never {
		if(!this.listAdapter) throw sapphireError.forbidden();
		return this.listAdapter.page(args.reqPageIndex, args.pageSize, args.search, args.order, args.filter, env);
	}

	@Comet.Command({preprocess: (state:CometState)=>state.cmd.instance.preprocesses(state)})
	async form(@Comet.Args args: {id: string | null, values?: Record<string, any>}, @Comet.Env env: any): Promise<{ data: Partial<Dto<any>> | undefined; type: any }> | never {
		if(!this.formAdapter) throw sapphireError.forbidden();
		return this.formAdapter.getItem(args.id ? parseInt(args.id): null, args.values);
	}

	@Comet.Command({preprocess: (state:CometState)=>state.cmd.instance.preprocesses(state)})
	async save(@Comet.Args args: {id: number | null, values: Record<string, any>}, @Comet.Env env: any): Promise<MaybeUnset<number>> | never {
		if(!this.formAdapter) throw sapphireError.forbidden();
		return this.formAdapter.save(args.id, args.values);
	}

	@Comet.Command({preprocess: (state:CometState)=>state.cmd.instance.preprocesses(state)})
	async delete(@Comet.Args args: {id: number}, @Comet.Env env: any): Promise<boolean> | never {
		if(!this.formAdapter) throw sapphireError.forbidden();
		return await this.formAdapter.delete(args.id);
	}

	// -----------------------------------------------------------------

	@Comet.Command({preprocess: (state:CometState)=>state.cmd.instance.preprocesses(state)})
	async file(@Comet.Args args: {id: string, collectionName: string}, @Comet.Files {files}: {files: Array<File>}, @Comet.Env env: any): Promise<boolean> | never {
		if(!this.formAdapter) throw sapphireError.forbidden();
		if(!this.tmpFile) throw Error("NINCS MEGADVA TMP FILE!!!")
		if(!files) throw sapphireError.fileNotProvided();
		return this.formAdapter.file(parseInt(args.id), args.collectionName, await Promise.all(files.map(f=>this.tmpFile!(f))));
	}

	@Comet.Command({preprocess: (state:CometState)=>state.cmd.instance.preprocesses(state)})
	async collection(@Comet.Args args: {id: string}, @Comet.Env env: any): Promise<any[]> | never {
		if(!this.formAdapter) throw sapphireError.forbidden();
		return this.formAdapter.collection(parseInt(args.id));
	}

	@Comet.Command({preprocess: (state:CometState)=>state.cmd.instance.preprocesses(state)})
	async changeFileData(@Comet.Args args: {id: string, collectionName: string, fileName: string, newMetaData?: Record<string, any>, newName?: string}, @Comet.Env env: any): Promise<boolean> | never {
		if(!this.formAdapter) throw sapphireError.forbidden();
		return this.formAdapter.changeFileData(parseInt(args.id), args.collectionName, args.fileName, args.newMetaData, args.newName);
	}

	@Comet.Command({preprocess: (state:CometState)=>state.cmd.instance.preprocesses(state)})
	async deleteFile(@Comet.Args args: {id: string, collectionName: string, fileName: string}, @Comet.Env env: any): Promise<boolean> | never {
		if(!this.formAdapter) throw sapphireError.forbidden();
		return this.formAdapter.deleteFile(parseInt(args.id), args.collectionName, args.fileName);
	}

	@Comet.Command({preprocess: (state:CometState)=>state.cmd.instance.preprocesses(state)})
	async changeFileOrder(@Comet.Args args: {id: string, collectionName: string, fileName: string, position: string}, @Comet.Env env: any): Promise<boolean> | never {
		if(!this.formAdapter) throw sapphireError.forbidden();
		return this.formAdapter.changeFileOrder(parseInt(args.id), args.collectionName, args.fileName, parseInt(args.position));
	}
}