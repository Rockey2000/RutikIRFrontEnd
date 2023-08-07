import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  AdminNavbarData,
  analystNavbarData,
  NavbarData,
  userNavbarData,
} from './menus';
import { BreadcrumbService } from 'xng-breadcrumb';
import { AppModuleConstants } from 'src/app/app-constants';
import { IRServiceService } from 'src/app/ir-service.service';
import { BreadcrumbItemDirective } from 'xng-breadcrumb';
import { filter } from 'rxjs';
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {

  sidebar: boolean = false;
  user!: string;
  logUser: boolean = false;
  dropdown: boolean = false;
  isActive: boolean = false;
  isActive1: boolean = false;
  isActive2: boolean = false;
  isActive3: boolean = false;
  isActive4: boolean = false;
  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private service: IRServiceService,
    private route: ActivatedRoute,

  ) {}
  userRole: any;
  userName: any;
  navData: any;
  logoUrl:any;
  ngOnInit(): void {
    // this.service.emitDialogFormData('done');
  this.logoUrl=sessionStorage.getItem(AppModuleConstants.LogoUrl)!;
  console.log(this.logoUrl,"logoUrl");
    localStorage.removeItem('tableName');
    this.userRole = sessionStorage.getItem(AppModuleConstants.ROLE)!;
    this.userName = sessionStorage.getItem(AppModuleConstants.USER)!;
    if (this.userRole === '1') {
      this.navData = AdminNavbarData;
    } else if (this.userRole === '2') {
      this.navData = analystNavbarData;
    } else if (this.userRole === '3') {
      this.navData = userNavbarData;
    }

    console.log(this.userRole, ' ', this.userName);
    console.log(this.breadcrumbService);

    this.screenWidth = window.innerWidth;
    this.breadcrumbService.set('@ChildOne', 'Child One');
    this.user = JSON.stringify(localStorage.getItem('user'));


  }


  sideBar() {
    if (this.sidebar == false) {
      this.sidebar = true;
    } else {
      this.sidebar = false;
    }
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['']);
  }

  dropdownValue() {
    this.dropdown = true;
  }

  onClickHome() {
    if (this.sidebar == false) {
      this.sidebar = true;
    } else {
      this.sidebar = false;
    }
    this.router.navigate(['/document/home/role-mng']);
  }

  onClickData() {}

  onClickAnalysis() {}

  onClickReport() {}

  onClickMeetings() {}

  onClickConfiguration() {
    if (this.sidebar == false) {
      this.sidebar = true;
      localStorage.removeItem('tableName');
    } else {
      this.sidebar = false;
    }
    this.router.navigate(['/document/nav/role']);
    localStorage.removeItem('tableName');
  }

  config: boolean = false;
  onClickConfig() {
    this.config = true;
  }

  onClickAnchor() {
    this.isActive = true;
    this.isActive1 = false;
    this.isActive2 = false;
    this.isActive3 = false;
    this.isActive4 = false;
  }

  onClickAnchor1() {
    this.isActive = false;
    this.isActive1 = true;
    this.isActive2 = false;
    this.isActive3 = false;
    this.isActive4 = false;
  }

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;

  // navData = navbarData;

  // navbar =nav;
  isSideNavCollapsed = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({
        collapsed: this.collapsed,
        screenWidth: this.screenWidth,
      });
    }
  }

  toggleCollapse(): void {
    if (this.collapsed === true) {
      this.collapsed = false;
    } else {
      this.collapsed = true;
    }
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  toggleCollapse1(status: any): void {
    if (this.collapsed === true) {
      this.collapsed = false;
    } else {
      this.collapsed = false;
    }
    console.log(status);

    if (!status) {
      alert('This Option is not in Service');
    }
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  onClickLogout() {
    sessionStorage.clear();
    localStorage.removeItem('user');
    localStorage.clear();

    this.router.navigate(['/login']);
    //  window.location.href = 'https://login-stg.pwc.com/openam/UI/Logout';
  }
}
