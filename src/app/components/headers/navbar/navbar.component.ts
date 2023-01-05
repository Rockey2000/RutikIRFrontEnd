import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { navbarData } from './menus';
import { BreadcrumbService } from "xng-breadcrumb";


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
  constructor(private breadcrumbService: BreadcrumbService,private router: Router) {}

  ngOnInit(): void {
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
    localStorage.removeItem('user');
    this.router.navigate(['/']);
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
    } else {
      this.sidebar = false;
    }
    this.router.navigate(['/document/nav/role']);
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

  //  dropdown = document.getElementsByClassName("dropdown-btn");
  //  i!:string;

  // for (i = 0; i < dropdown.length; i++) {
  //   dropdown[i].addEventListener("click", function() {
  //     this.classList.toggle("active");
  //     var dropdownContent = this.nextElementSibling;
  //     if (dropdownContent.style.display === "block") {
  //       dropdownContent.style.display = "none";
  //     } else {
  //       dropdownContent.style.display = "block";
  //     }
  //   });
  //}

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;

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

  toggleCollapse1(): void {
    if (this.collapsed === true) {
      this.collapsed = false;
    } else {
      this.collapsed = false;
    }
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }
}
