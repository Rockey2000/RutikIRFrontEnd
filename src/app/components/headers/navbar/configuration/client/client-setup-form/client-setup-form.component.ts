import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-client-setup-form',
  templateUrl: './client-setup-form.component.html',
  styleUrls: ['./client-setup-form.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class ClientSetupFormComponent implements OnInit {
  items!: MenuItem[];
  activeIndex: number = 1;
  constructor(private router: Router) { }

  ngOnInit(): void {

    this.items = [{
      label: 'Client Details',
      routerLink: '/document/nav/config/clientSetupDetails/clientSetup/clientDetails'
  },
  {
      label: 'Whitelabelling',
      routerLink: '/document/nav/config/clientSetupDetails/clientSetup/clientLabel'
  },
  {
      label: 'Financial Ratios',
      routerLink: '/document/nav/config/clientSetupDetails/clientSetup/clientFinancialRatio'
  },
  {
      label: 'Data Visualisation Setup',
      routerLink: 'confirmation'
  }
];
  }
  onClickBack(){
    console.log("clicked");
    this.router.navigate(['/document/nav/config/clientSetupDetails/clientSetup/clientDetails'])
    
  }
}
