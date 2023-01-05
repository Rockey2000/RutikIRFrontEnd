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
    feedback?:string,
    participants?:string,
    comments?:string,
    meetingType?:string,
    date?:string,
    subject?:string,
    organisation?:string,
    broker?:string,
    stakeholderType?:string,
    endTime?:string,
    startTime?:string,
    status?:string,
    location?:string,

}