import {IForm} from "./form";
import {IList} from "./list";
import {TmpFile} from "@affinity-lab/util";
import {Comet, type CometState} from "@affinity-lab/comet";


export abstract class SapphireCom {
	protected constructor(
		protected readonly formAdapter: IForm<any, any>,
		protected readonly listAdapter: IList,
		protected readonly tmpFile?: (...args: any) => Promise<TmpFile>,
	) {
	}

	protected auth(state:CometState) {}

	@Comet.Command({preprocess: [(state:CometState)=>state.cmd.instance.auth(state)]})
	async list(@Comet.Args args: {reqPageIndex: number, pageSize: number, search?: string, order?: string, filter?: Record<string, any>}, @Comet.Ctx ctx: any, @Comet.Env env: any) {
		return this.listAdapter.page(args.reqPageIndex, args.pageSize, args.search, args.order, args.filter);
	}

	@Comet.Command({preprocess: [(state:CometState)=>state.cmd.instance.auth(state)]})
	async form(@Comet.Args args: {id: string | null, values?: Record<string, any>}, @Comet.Ctx ctx: any, @Comet.Env env: any) {
		return this.formAdapter.getItem(args.id ? parseInt(args.id): null, args.values);
	}

	@Comet.Command({preprocess: [(state:CometState)=>state.cmd.instance.auth(state)]})
	async save(@Comet.Args args: {id: number | null, values: Record<string, any>}, @Comet.Ctx ctx: any, @Comet.Env env: any) {
		return this.formAdapter.save(args.id, args.values);
	}

	@Comet.Command({preprocess: [(state:CometState)=>state.cmd.instance.auth(state)]})
	async delete(@Comet.Args args: {id: number}, @Comet.Ctx ctx: any, @Comet.Env env: any) {
		return await this.formAdapter.delete(args.id);
	}

	// -----------------------------------------------------------------

	@Comet.Command({preprocess: [(state:CometState)=>state.cmd.instance.auth(state)]})
	async file(@Comet.Args args: {id: string, collectionName: string}, @Comet.Files {files}: {files: Array<File>}, @Comet.Env env: any) {
		if(!this.tmpFile) throw Error("NINCS MEGADVA TMP FILE!!!")
		return this.formAdapter.file(parseInt(args.id), args.collectionName, await Promise.all(files.map(f=>this.tmpFile!(f))));
	}

	@Comet.Command({preprocess: [(state:CometState)=>state.cmd.instance.auth(state)]})
	async collection(@Comet.Args args: {id: string}, @Comet.Env env: any): Promise<any[]> {
		return this.formAdapter.collection(parseInt(args.id));
	}

	@Comet.Command({preprocess: [(state:CometState)=>state.cmd.instance.auth(state)]})
	async changeFileData(@Comet.Args args: {id: string, collectionName: string, fileName: string, newMetaData?: Record<string, any>, newName?: string}, @Comet.Env env: any) {
		return this.formAdapter.changeFileData(parseInt(args.id), args.collectionName, args.fileName, args.newMetaData, args.newName);
	}

	@Comet.Command({preprocess: [(state:CometState)=>state.cmd.instance.auth(state)]})
	async deleteFile(@Comet.Args args: {id: string, collectionName: string, fileName: string}, @Comet.Env env: any) {
		return this.formAdapter.deleteFile(parseInt(args.id), args.collectionName, args.fileName);
	}

	@Comet.Command({preprocess: [(state:CometState)=>state.cmd.instance.auth(state)]})
	async changeFileOrder(@Comet.Args args: {id: string, collectionName: string, fileName: string, position: string}, @Comet.Env env: any) {
		return this.formAdapter.changeFileOrder(parseInt(args.id), args.collectionName, args.fileName, parseInt(args.position));
	}
}