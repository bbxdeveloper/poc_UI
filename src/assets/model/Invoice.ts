import { Company } from "./Company";
import { InvoiceProduct } from "./InvoiceProduct";

export interface Invoice {
    [x: string]: any;
    Sender: Company;
    Buyer: Company;
    Products: InvoiceProduct[];
}
