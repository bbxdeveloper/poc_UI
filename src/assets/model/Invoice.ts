import { Company } from "./Company";
import { InvoiceProduct } from "./InvoiceProduct";
import { PaymentData } from "./PaymentData";

export interface Invoice {
    [x: string]: any;
    Sender: Company;
    Buyer: Company;
    Payment: PaymentData;
    Products: InvoiceProduct[];
}
