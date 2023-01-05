import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';

@Component({
  selector: 'app-add-and-map-line-items',
  templateUrl: './add-and-map-line-items.component.html',
  styleUrls: ['./add-and-map-line-items.component.css']
})
export class AddAndMapLineItemsComponent implements OnInit {

  items!: MenuItem[];
  activeItem!: MenuItem;

  constructor(private service:IRServiceService, private router:Router) { }

  ngOnInit(): void {
    this.items = [
      {label: 'Add Line Item Nomenclature', routerLink: ['/document/nav/config/analyst/addAndMapingLineItems','addLineItem'] },
      {label: 'Map Line Item Nomenclature', routerLink: ['/document/nav/config/analyst/addAndMapingLineItems','mapLineItem'] },
     
  ];
  this.activeItem = this.items[0];
  }

  onClickBack(){

    this.router.navigate(['/document/nav/config/analyst/nomenclature'])
    this.service.emitDialogFormData("done");
    // this.router.navigate(["/document/nav/config/analyst/addAndMapingLineItems/addLineItem"])
  }
}
