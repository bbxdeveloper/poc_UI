export module Constants {
    export const MSG_CONFIRMATION_QUIT = "Biztosan szeretne kiléni az alkalmazásból?";

    export enum FileExtensions {
        PDF = "pdf",
        UNKNOWN = "unknown"
    }

    export enum CommandType {
        PRINT_POC,
        PRINT_POC_GRADES
    }

    export type Dct = { [id: string]: any; };
}
