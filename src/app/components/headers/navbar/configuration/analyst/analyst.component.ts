import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IRServiceService } from 'src/app/ir-service.service';
import { LineItemNomenclatureComponent } from './line-item-nomenclature/line-item-nomenclature.component';

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

  tabmenus:boolean=true;

  constructor(private service: IRServiceService, private router: Router,private irSrvice:IRServiceService ) {
    this.analystSetupOptions = [
      { name: 'Details' },
      { name: 'Line Item Nomenclature' },
      { name: 'Report Table Header' },
      { name: 'Stock Estimates' },
    ];
  }
  ngOnInit(): void {
    this.irSrvice.dialogFormDataSubscriber$.subscribe((data: any) => {
      console.log(data,"!!");
      this.tabmenus=!this.tabmenus;
    })
    // this.dropdown=this.lineItem.lineItemForm;
    this.router.navigate(['/document/nav/config/analyst/nomenclature']);
  }
  onSelectOption() {
    if (this.SelectedOption === 'Line Item Nomenclature') {
      this.router.navigate(['/document/nav/config/analyst/nomenclature']);
    }
    if(this.SelectedOption === 'Details') {
      this.router.navigate(['/document/nav/config/analyst/analystDetails'])
    }
  }
}
