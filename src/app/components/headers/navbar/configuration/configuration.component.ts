import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { iif } from 'rxjs';
import { AppModuleConstants } from 'src/app/app-constants';
import { IRServiceService } from 'src/app/ir-service.service';

interface TypesOfDoc {
  docName: string;
}

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css'],
})
export class ConfigurationComponent implements OnInit {
  items!: MenuItem[];
  activeItem!: MenuItem;
  docList: TypesOfDoc[] = [];
  selectedTableName!: any;
  outerTabMenu!: string;

  tabmenus: boolean = true;
  userRole!: string;
  userName!: string;

  masterDatabaseDropdown: boolean = false;

  constructor(
    private irSrvice: IRServiceService,
    private router: Router,
    private service: IRServiceService
  ) {
    this.docList = [
      { docName: 'Income Statement' },
      { docName: 'Balance Sheet' },
      { docName: 'Cash Flow' },
      // { docName: 'Financial Ratios' },
      { docName: 'Shareholder Data' },
      { docName: 'Shareholder Contact Details' },
      // { docName: 'Shareholder Meeting' },
    ];
  }

  ngOnInit(): void {
    // this.service.emitDialogFormData('done');

    if (sessionStorage.getItem('role') === '2') {
      console.log('masterDatabaseDropdown: ', this.masterDatabaseDropdown);

      this.masterDatabaseDropdown = true;
    } else {
      this.masterDatabaseDropdown = false;
      console.log('masterDatabaseDropdown: ', this.masterDatabaseDropdown);
    }

    if (localStorage.getItem('tableName')) {
      this.masterDatabaseDropdown = true;
    } else {
      this.masterDatabaseDropdown = false;
    }
    this.selectedTableName = localStorage.getItem('tableName');
    // console.log(this.selectedTableName, ' this.selectedTableName1');

    this.userRole = sessionStorage.getItem(AppModuleConstants.ROLE)!;
    this.userName = sessionStorage.getItem(AppModuleConstants.USER)!;
    console.log(this.userRole, ' ', this.userName);

    this.irSrvice.dialogFormDataSubscriber$.subscribe((data: any) => {
      console.log(data, '!!');
      this.tabmenus = !this.tabmenus;
    });

    this.status = false;
    this.outerTabMenu = JSON.stringify(localStorage.getItem('outertabmenu'));

    this.items = [
      { label: 'Role', routerLink: ['/document/nav/config', 'role'] },
      { label: 'Users', routerLink: ['/document/nav/config', 'user'] },
      // { label: 'User', routerLink: ['/document/home','masterDb'] },
      {
        label: 'Master Database',
        routerLink: ['/document/nav/config/master-db/balance-sheet'],
      },
      {
        label: 'Analyst Setup',
        routerLink: ['/document/nav/config/analyst', 'nomenclature'],
      },
      {
        label: 'Client Setup',
        routerLink: ['/document/nav/config/clientSetupDetails/clientSetup/clientDetails'],
      },
    ];
    this.activeItem = this.items[0];

    if (this.userRole == '2') {
      this.items = [
        // { label: 'Role', routerLink: ['/document/nav/config', 'role'] },
        // { label: 'Users', routerLink: ['/document/nav/config', 'user'] },
        // { label: 'User', routerLink: ['/document/home','masterDb'] },
        {
          label: 'Master Database',
          routerLink: ['/document/nav/config/master-db/balance-sheet'],
        },
        {
          label: 'Analyst Setup',
          routerLink: ['/document/nav/config/analyst', 'nomenclature'],
        },
        {
          label: 'Client Setup',
          routerLink: [
            '/document/nav/config/clientSetupDetails/clientSetup',
            'clientDetails',
          ]
        },
      ];
      this.activeItem = this.items[0];
    }
  }

  status: boolean = false;
  onClickMenu(e: any) {
    console.log(e);
      sessionStorage.setItem('value','Client Details')
    this.selectedTableName = 'Balance Sheet';
    this.status = true;
    if (e.target.innerText === 'Master Database') {
      this.masterDatabaseDropdown = true;
    } else {
      this.masterDatabaseDropdown = false;
    }
  }

  onClickTable() {
    // this.table=false;
    localStorage.setItem('tableName', this.selectedTableName);

    if (this.selectedTableName === 'Balance Sheet') {
      this.router.navigate(['/document/nav/config/master-db/balance-sheet']);
    } else if (this.selectedTableName === 'Income Statement') {
      this.router.navigate(['/document/nav/config/master-db/income']);
    } else if (this.selectedTableName === 'Cash Flow') {
      this.router.navigate(['/document/nav/config/master-db/cash-flow']);
    } else if (this.selectedTableName === 'Shareholder Data') {
      this.router.navigate(['/document/nav/config/master-db/shareholder']);
    } else if (this.selectedTableName === 'Shareholder Contact Details') {
      this.router.navigate(['/document/nav/config/master-db/contact']);
    } else if (this.selectedTableName === 'Shareholder Meeting') {
      this.router.navigate(['/document/nav/config/master-db/meeting']);
    } else if (this.selectedTableName === 'Financial Ratios') {
      this.router.navigate(['/document/nav/config/master-db/finacial-ratio']);
    }

    this.service.masterTableName = this.selectedTableName;
  }
}
