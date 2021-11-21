import { ProcessStatus } from "../model/ProcessStatus";

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

    export enum PrintProcessPhases { PROC_CMD, GENERATING, PROC_RESP, SEND_TO_PRINTER }
    export const PrintReportStatuses: ProcessStatus[] = [
        { title: 'Riport Nyomtatás', value: 0, msg: '0/4 - Kérés feldolgozása' },
        { title: 'Riport Nyomtatás', value: 33, msg: '1/4 - Generálás'},
        { title: 'Riport Nyomtatás', value: 65, msg: '2/4 - Riport Feldolgozása'},
        { title: 'Riport Nyomtatás', value: 100, msg: '3/4 - Küldés Nyomtatásra'}
    ];

    export const BlankProcessStatus: ProcessStatus = { value: -1 } as ProcessStatus;

    export type Dct = { [id: string]: any; };
}
