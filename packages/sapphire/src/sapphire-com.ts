import {IForm} from "./form";
import {IList} from "./list";
import {TmpFile} from "@affinity-lab/util";
import {Comet, type CometState} from "@affinity-lab/comet";


export abstract class SapphireCom {
	protected constructor(
		protected readonly formAdapter: IForm<any>,
		protected readonly listAdapter: IList,
		protected readonly tmpFile: (...args: any) => TmpFile,
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
		await this.formAdapter.delete(args.id);
		return true;
	}

	// -----------------------------------------------------------------

	// @Command()
	// async file(args: {id: string, collectionName: string}, req: Request, {files}: Files) {
	// 	if(!(await this.authResolver.hasRole(req, this.getRole("update")))) throw new ExtendedError("UNAUTHORIZED to upload file", "FORBIDDEN", undefined, 403);
	// 	return this.formAdapter.file(parseInt(args.id), args.collectionName, files.map(f=>this.tmpFile(f)))
	// }
	//
	// @Command()
	// async collection(args: {id: string}, req: Request): Promise<any[]> {
	// 	if(!(await this.authResolver.hasRole(req, this.getRole("read")))) throw new ExtendedError("UNAUTHORIZED to read collection info", "FORBIDDEN", undefined, 403);
	// 	return this.formAdapter.collection(parseInt(args.id));
	// }
	//
	// @Command()
	// async changeFileData(args: {id: string, collectionName: string, fileName: string, newMetaData?: Record<string, any>, newName?: string}, req: Request) {
	// 	if(!(await this.authResolver.hasRole(req, this.getRole("update")))) throw new ExtendedError("UNAUTHORIZED to change file data", "FORBIDDEN", undefined, 403);
	// 	return this.formAdapter.changeFileData(parseInt(args.id), args.collectionName, args.fileName, args.newMetaData, args.newName);
	// }
	//
	// @Command()
	// async deleteFile(args: {id: string, collectionName: string, fileName: string}, req: Request) {
	// 	if(!(await this.authResolver.hasRole(req, this.getRole("delete")))) throw new ExtendedError("UNAUTHORIZED to delete file", "FORBIDDEN", undefined, 403);
	// 	return this.formAdapter.deleteFile(parseInt(args.id), args.collectionName, args.fileName);
	// }
	//
	// @Command()
	// async changeFileOrder(args: {id: string, collectionName: string, fileName: string, position: string}, req: Request) {
	// 	if(!(await this.authResolver.hasRole(req, this.getRole("update")))) throw new ExtendedError("UNAUTHORIZED to change file order", "FORBIDDEN", undefined, 403);
	// 	return this.formAdapter.changeFileOrder(parseInt(args.id), args.collectionName, args.fileName, parseInt(args.position));
	// }
}