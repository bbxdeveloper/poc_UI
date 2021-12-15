import { InvoiceProduct } from "./InvoiceProduct";

export interface InvoiceProductResponse {
    Result: InvoiceProduct[];
    IsError: boolean;
    Message?: string;
}
