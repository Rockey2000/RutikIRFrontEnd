export interface User{
    id: string;
    userid:string;
    firstName?:string;
    lastName?:string;
    email?:string;
    mobileNumber?:string;
    accessItem?:string;
    noOfUsers?:string;
    roleName?:string;
    domain?:string;
    assigned?:string;
    assignedName?:string;
    dataInjestionAccess?:string;
    dashboardAccess?:string;
    configurationAccess?:string;
    status:string;
    createdOn?:Date;
    editedOn?:Date;
}


export interface  Role{
    role:string;
}

export interface Manager{
    name:string;
}

export interface Partner{
    name:string;
}