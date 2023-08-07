import { AppModuleConstants } from 'src/app/app-constants';

let userRole: any;
let userName: any;

// userRole = sessionStorage.getItem(AppModuleConstants.ROLE)!;
// userName = sessionStorage.getItem(AppModuleConstants.USER)!;
// console.log(userRole," ",userName);

export class NavbarData {
  configRouteLink: any;
  constructor() {
    userRole = sessionStorage.getItem(AppModuleConstants.ROLE)!;
    userName = sessionStorage.getItem(AppModuleConstants.USER)!;
    console.log(userRole, ' ', userName);
    
  }
}
let configRouteLink = '/document/nav/config/role';
if (userRole === '2') {
  configRouteLink = '/document/nav/config/master-db/balance-sheet';
}
export const AdminNavbarData = [
  {
    routeLink: '/document/nav/report/report',
    icon: 'pi pi-chart-bar',
    label: 'Dashboard',
    image: 'assets/Images/dashboard_icon.png',
    view:true
    // showTo:['1','2','3']
  },
  {
    // routeLink: '#',
    routeLink: '/document/nav/dataInjestion/dataIngestionMenu/docUpload',
    icon: 'pi pi-table',
    label: 'Data Ingestion',
    image: 'assets/Images/data_icon.png',
    view:true

    // showTo:['1','2','3']
  },
  {
    // routeLink: '/document/nav/marketNews/newsApi',
    icon: 'pi pi-chart-line',
    label: 'Analysis',
    image: 'assets/Images/analysis_icon.png',
    view:false
    // showTo:['1','2','3']
  },
  {
    routeLink: '/document/nav/meetings/meetings/scheduler',
    icon: 'pi pi-users',
    label: 'Meetings',
    image: 'assets/Images/meeting_icon.png',
    view:true
    // showTo:['1','2']
  },
  {
    routeLink: '/document/nav/config/role',
    icon: 'pi pi-cog',
    label: 'Configuration',
    image: 'assets/Images/config_icon.png',
    view:true
    // showTo:['1','2']

    // items:[
    //   {
    //     routerLink:'/document/home/role-mng',
    //     label:'Project Management'
    //   },
    //   {
    //     routerLink:'',
    //     label:'Master Database Management'
    //   }
    // ]
  },
];
export const analystNavbarData = [
  {
    routeLink: '/document/nav/report/report',
    icon: 'pi pi-chart-bar',
    label: 'Dashboard',
    image: 'assets/Images/dashboard_icon.png',
    view:true
    // showTo:['1','2','3']
  },
  {
    // routeLink: '#',
    routeLink: '/document/nav/dataInjestion/dataIngestionMenu/docUpload',
    icon: 'pi pi-table',
    label: 'Data Ingestion',
    image: 'assets/Images/data_icon.png',
    view:true
    // showTo:['1','2','3']
  },
  {
    routeLink: 'statistics',
    icon: 'pi pi-chart-line',
    label: 'Analysis',
    image: 'assets/Images/analysis_icon.png',
    view:false
    // showTo:['1','2','3']
  },
  {
    routeLink: 'coupens',
    icon: 'pi pi-users',
    label: 'Meetings',
    image: 'assets/Images/meeting_icon.png',
    view:false
    // showTo:['1','2']
  },
  {
    routeLink: '/document/nav/config/master-db/balance-sheet',
    icon: 'pi pi-cog',
    label: 'Configuration',
    image: 'assets/Images/config_icon.png',
    view:true
    // showTo:['1','2']

    // items:[
    //   {
    //     routerLink:'/document/home/role-mng',
    //     label:'Project Management'
    //   },
    //   {
    //     routerLink:'',
    //     label:'Master Database Management'
    //   }
    // ]
  },
];
export const userNavbarData = [
  {
    routeLink: '/document/nav/report/report',
    icon: 'pi pi-chart-bar',
    label: 'Dashboard',
    image: 'assets/Images/dashboard_icon.png',
    view:true
    // showTo:['1','2','3']
  },
  {
    // routeLink: '#',
    routeLink: '/document/nav/dataInjestion/dataIngestionMenu/docUpload',
    icon: 'pi pi-table',
    label: 'Data',
    image: 'assets/Images/data_icon.png',
    view:true
    // showTo:['1','2','3']
  },
  {
    routeLink: 'statistics',
    icon: 'pi pi-chart-line',
    label: 'Analysis',
    image: 'assets/Images/analysis_icon.png',
    view:false
    // showTo:['1','2','3']
  },
];
// .filter(link => !link.showTo || link.showTo.includes(userRole));
