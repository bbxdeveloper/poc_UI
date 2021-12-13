import { InvoiceProduct } from "./InvoiceProduct";

export interface InvoiceProductResponse {
    result: InvoiceProduct[];
    id?: number;
    exception?: any;
    status?: number;
    isCanceled?: boolean;
    isCompleted?: boolean;
    isCompletedSuccessfully?: boolean;
    creationOptions?: number;
    asyncState?: any;
    isFaulted?: boolean;
}


/*
{
    "result": [
        {
            "id": 1,
            "productCode": "AAA-A",
            "name": "Valami",
            "measure": "db",
            "amount": 123,
            "price": 421.23,
            "value": 5324.23
        },
        {
            "id": 2,
            "productCode": "BFS-A",
            "name": "Valami2",
            "measure": "kg",
            "amount": 23,
            "price": 123.12,
            "value": 6346.43
        }
    ],
        "id": 20,
            "exception": null,
                "status": 5,
                    "isCanceled": false,
                        "isCompleted": true,
                            "isCompletedSuccessfully": true,
                                "creationOptions": 0,
                                    "asyncState": null,
                                        "isFaulted": false
}
*/