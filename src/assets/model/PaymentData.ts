/**
 * Fizetési mód, Teljesítési időpont...stb modellje.
 */
export interface PaymentData {
    /**
     * Fizetési mód
     */
    PaymentMethod: string;
    /**
     * Teljesítési időpont
     */
    FinishTimeStamp: Date;
    /**
     * Számla keltezése
     */
    InvoiceCreateTimeStamp: Date;
    /**
     * Fizetési határidő
     */
    PaymentDeadline: Date;
    /**
     * Számla sorszáma
     */
    InvoiceNumber: string;
    /**
     * Egyéb adatok
     */
    Misc: string;
}
