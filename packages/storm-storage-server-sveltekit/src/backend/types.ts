import {NamedImageDimensions} from "../frontend/types";

export type ImgServerFactoryOptions = {
	namedImageDimensions?: NamedImageDimensions,
	allowFree?: boolean,
	fileNameParam?: string
}