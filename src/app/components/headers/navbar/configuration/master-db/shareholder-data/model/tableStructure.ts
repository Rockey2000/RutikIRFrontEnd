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
    clientId?:string,
    portfolioId?:string,
    folio?:string,
    shareholderName?:string;
    holdingValue?:string;
    holdingPercentage?:string;
    minorcode?:string;
    date?:string;
}