export interface tableStructure{
    id?:string;
    tableName?:string;
    currencyIn?:string;
    stateOfMatrics?:string;
    alternateTableName?:string[];
    file?:File;
    createdOn?:Date;
    financialDocName?:string;
}


export interface LineItem{
    id?:string,
    lineItemName?:string,
    alternativeName?:string,
    lineItemtype?:string,
    tableName?:string;
}