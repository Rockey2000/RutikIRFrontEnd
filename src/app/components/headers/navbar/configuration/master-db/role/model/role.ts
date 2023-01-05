export interface Role {
noOfUser: any;
  id: string;
  roleName?: string;
  description?: string;

  dashboardAccess: string[];
  status?: string;
  createdOn?: number;
  lastEdit?: number;
}

export interface Access {
  accessLabel: string;
}
