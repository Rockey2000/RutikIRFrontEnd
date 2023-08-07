import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
@Component({
  selector: 'app-add-and-map-client-line-item',
  templateUrl: './add-and-map-client-line-item.component.html',
  styleUrls: ['./add-and-map-client-line-item.component.css']
})
export class AddAndMapClientLineItemComponent implements OnInit {
  items!: MenuItem[];
  activeItem!: MenuItem;
  tabmenus:boolean=true;
  outerTabMenu!: string;
  constructor(private service:IRServiceService, private router:Router) { }

  ngOnInit(): void {
    this.service.emitDialogFormData('done');

    this.service.dialogFormDataSubscriber$.subscribe((data: any) => {
      console.log(data,"!!");
      this.tabmenus=!this.tabmenus;
    })
    this.status = false;
    this.outerTabMenu = JSON.stringify(localStorage.getItem('outertabmenu'));
    this.items = [
      {label: 'Add Client Line Item Nomenclature', routerLink: ['/document/nav/config/addAndMapingClientLineItems/addClientLineItem'] },
      {label: 'Map Client Line Item Nomenclature', routerLink: ['/document/nav/config/addAndMapingClientLineItems/mapClientLineItem'] },
      
  ];
  this.activeItem = this.items[0];
  }
  status: boolean = false;
  onClickBack(){
    sessionStorage.setItem('value','Client Line Item Nomenclature')
    this.service.dialogFormDataSubscriber$.subscribe((data: any) => {
      console.log(data,"!!");
      this.tabmenus=!this.tabmenus;
    })
    this.router.navigate(['/document/nav/config/clientSetupDetails/client'])
    this.service.emitDialogFormData("done");
  }
}
