export module NM {
    // HEADER ////////////////////////////////////////////
    export const HeaderNavMatrix = [
        [ "header-home", "header-user", "header-sett", "header-prod", "header-invo", "header-orde", "header-info", "header-list", "header-serv", "header-shut" ]
    ];
    export const headerInvoSub = [
        ["invoicing-sub-1"],
    ];

    export const SubMapping: { [id: string]: string[][]; } = {};
    SubMapping["header-invo"] = headerInvoSub;
}