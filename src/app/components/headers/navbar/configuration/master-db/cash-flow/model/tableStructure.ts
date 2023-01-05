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
    lineItem?:string,
    alternativeName?:string,
    type?:string,
    // tableName?:string;
}