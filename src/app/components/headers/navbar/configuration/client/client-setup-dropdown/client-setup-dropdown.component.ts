import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { ConfigurationModule } from '../../configuration.module';
import { Router, RouterModule } from '@angular/router';
import { IRServiceService } from 'src/app/ir-service.service';
interface clientSetupOption {
  name: string;
}
@Component({
  selector: 'app-client-setup-dropdown',
  templateUrl: './client-setup-dropdown.component.html',
  styleUrls: ['./client-setup-dropdown.component.css'],
})
export class ClientSetupDropdownComponent implements OnInit {
  clientSetupOptions: clientSetupOption[] = [];
  SelectedOption!: any;
  SelectedOption1='Client Details';
  tabmenus:boolean=true;
  constructor(private service: IRServiceService, private router: Router,private irSrvice:IRServiceService ) {
    this.clientSetupOptions = [
      { name: 'Client Details' },
      { name: 'Client Line Item Nomenclature' },
    ];

   }

  ngOnInit(): void {

    this.SelectedOption=sessionStorage.getItem('value');
    // this.SelectedOption=this.SelectedOption1;

    
  }
  // onSelectOption() {
  //   if (this.SelectedOption === 'Client Details') {
  //     this.tabmenus = true;
  //     this.router.navigate(['/document/nav/config/clientSetup/clientDetails']);
  //   }
  //   if (this.SelectedOption === 'Client Line Item Nomenclature') {
  //     this.tabmenus = true; // Hide the dropdown when this option is selected
  //     this.router.navigate(['/document/nav/config/addAndMapingClientLineItems']);
  //   }
  // }
  onSelectOption() {
    if (this.SelectedOption === 'Client Details') {
      this.router.navigate([
        '/document/nav/config/clientSetupDetails/clientSetup/clientDetails',
      ]);
  
    }
    if(this.SelectedOption === 'Client Line Item Nomenclature') {
      this.router.navigate(['/document/nav/config/clientSetupDetails/client'])

    }
  }
   
    
  }

