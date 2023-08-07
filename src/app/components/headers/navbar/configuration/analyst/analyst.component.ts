import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IRServiceService } from 'src/app/ir-service.service';
import { LineItemNomenclatureComponent } from './line-item-nomenclature/line-item-nomenclature.component';
import { MenuItem } from 'primeng/api';
interface AnalystSetupOption {
  name: string;
}

@Component({
  selector: 'app-analyst',
  templateUrl: './analyst.component.html',
  styleUrls: ['./analyst.component.css'],
})
export class AnalystComponent implements OnInit {
  analystSetupOptions: AnalystSetupOption[] = [];
  SelectedOption: string="Line Item Nomenclature";

  items!: MenuItem[];
  activeItem!: MenuItem;
  tabmenus:boolean=true;
  outerTabMenu!: string;
  constructor(private service: IRServiceService, private router: Router,private irSrvice:IRServiceService ) {
    this.analystSetupOptions = [
      { name: 'Details' },
      { name: 'Line Item Nomenclature' },
      // { name: 'Report Table Header' },
      // { name: 'Stock Estimates' },
    ];
  }
  ngOnInit(): void {
    this.irSrvice.dialogFormDataSubscriber$.subscribe((data: any) => {
      console.log(data,"!!");
      this.tabmenus=!this.tabmenus;
    })
    this.outerTabMenu = JSON.stringify(localStorage.getItem('outertabmenu'));
    // this.dropdown=this.lineItem.lineItemForm;
    this.router.navigate(['/document/nav/config/analyst/nomenclature']);
    console.log(this.SelectedOption,"selected option");
    this.service.analystTableName=this.SelectedOption;
  }


  onSelectOption() {
    if (this.SelectedOption === 'Line Item Nomenclature') {
      this.router.navigate(['/document/nav/config/analyst/nomenclature']);
      this.irSrvice.dialogFormDataSubscriber$.subscribe((data: any) => {
        console.log(data,"!!");
        this.tabmenus=!this.tabmenus;
      })
    }
    if(this.SelectedOption === 'Details') {
      this.router.navigate(['/document/nav/config/analyst/analystDetails'])
      this.irSrvice.dialogFormDataSubscriber$.subscribe((data: any) => {
        console.log(data,"!!");
        this.tabmenus=!this.tabmenus;
      })
    }
    if(this.SelectedOption==='Report Table Header'){
     this.router.navigate(['/document/nav/config/analyst/tableheader']);
     this.irSrvice.dialogFormDataSubscriber$.subscribe((data: any) => {
      console.log(data,"!!");
      this.tabmenus=!this.tabmenus;
    })
    }
    if(this.SelectedOption==='Stock Estimates'){
      this.router.navigate(['/document/nav/config/analyst/stockEstimates']);
      this.irSrvice.dialogFormDataSubscriber$.subscribe((data: any) => {
       console.log(data,"!!");
       this.tabmenus=!this.tabmenus;
     })
     }
    this.service.analystTableName=this.SelectedOption;
    console.log(this.service.analystTableName,"analyst table name");
    
  }
}
