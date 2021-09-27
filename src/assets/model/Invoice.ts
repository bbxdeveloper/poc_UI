import { Company } from "./Company";
import { InvoiceProduct } from "./InvoiceProduct";

export interface Invoice {
    Sender: Company;
    Buyer: Company;
    Products: InvoiceProduct[];
}
