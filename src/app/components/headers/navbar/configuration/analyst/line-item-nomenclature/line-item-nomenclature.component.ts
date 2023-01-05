import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
import { LineItem } from './model/lineItem';

interface AnalystId {
  id: string;
}
interface masterTable{
  tableContent: string;
}

@Component({
  selector: 'app-line-item-nomenclature',
  templateUrl: './line-item-nomenclature.component.html',
  styleUrls: ['./line-item-nomenclature.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class LineItemNomenclatureComponent implements OnInit {
  lineItemTable: boolean = true;
  lineItemForm: boolean = false;

  analystIds: AnalystId[] = [];

  incomeStatementLineItem: any[] = [];
  balanceSheetLineItem: any[] = [];
  cashFlowLineItem: any[] = [];

  allMasterHeaderLineItems: any[] = [];

  analystLineItemForm!: FormGroup;
  addLineItem:any[]=[];

  value!: masterTable[];
  selectedValue!:masterTable;
 
  analystLineItemNamePattern = "^[a-zA-Z ]{3,15}$";
  analystTableHeaderNamePattern= "^[a-zA-Z0-9. /]{3,50}$";
 

  

  constructor(
    private service: IRServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router : Router
  ) {
    this.analystIds = [
      { id: '1710' },
      { id: '1720' },
      { id: '1730' },
      { id: '1740' },
      { id: '1750' },
      { id: '1760' },
    ];

    this.value =[
      {tableContent:'Income Statment'},
      {tableContent:'Balance Sheet'},
      {tableContent:'Cash Flow'}
    ];
  }

  ngOnInit(): void {

    this.analystLineItemForm = new FormGroup({
      masterTableSource: new FormControl(''),
      lineItemName:new FormControl(''),
      analystName:new FormControl(''),
      analystLineItemName: new FormControl('', [Validators.required,
      Validators.pattern(this.analystLineItemNamePattern)]),
      analystTableHeaderName: new FormControl('',[ Validators.required,
      Validators.pattern(this.analystTableHeaderNamePattern)]),
    });

    this.service.getTableStructures().subscribe(
      (data: any) => {
        console.log(data);
        this.balanceSheetLineItem = data;
        console.log(this.balanceSheetLineItem, ' balance sheet data');
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong...');
        console.log(error);
      }
    );

    this.service.getIncomeStatementTableStructures().subscribe(
      (data: any) => {
        console.log(data);
        this.incomeStatementLineItem = data;
        console.log(this.incomeStatementLineItem, ' income data');
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong...');
        console.log(error);
      }
    );

    this.service.getCashFlowTableStructure().subscribe(
      (data: any) => {
        console.log(data);
        this.cashFlowLineItem = data;
        this.allMasterHeaderLineItems = [
          ...this.balanceSheetLineItem,
          ...this.incomeStatementLineItem,
          ...this.cashFlowLineItem,
        ];
        console.log(this.allMasterHeaderLineItems, ' all data');
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong...');
        console.log(error);
      }
    );

    this.service.getAnalystLineItems().subscribe(
    (data:any)=>{
      this.addLineItem=data;
      console.log(this.addLineItem);
      
    },
    (error:HttpErrorResponse)=>{
      alert("something went wrong...!!");
    }
    )


  }

  onClickAdd() {
    // this.lineItemTable = false;
    // this.lineItemForm = true;
   // localStorage.setItem('outertabmenu','true');
   this.service.emitDialogFormData("done");
    this.router.navigate(["/document/nav/config/analyst/addAndMapingLineItems/addLineItem"])
  }

  newRow() {
    return this.passengerForm;
  }
  selectedTableName!: string;
  passengerForm = [
    {
      id: '',
      lineItem: '',
      alternativeName: '',
      type: '',
    },
  ];

  addForm() {
    this.passengerForm.push({
      id: '',
      lineItem: '',
      alternativeName: '',
      type: '',
    });
  }

  onClickBack() {
    this.lineItemTable = true;
    this.lineItemForm = false;
    this.service.emitDialogFormData("done");

  }

  saveLineItems() {
    this.service.addLineItem(this.analystLineItemForm.value).subscribe(
      (data) => {
        console.log(data);
        this.messageService.add({
          severity: 'success',
          summary: 'Successfull',
          detail: 'Analyst Nomenclature addedd successfully',
        });
        this.onClickBack();
        this.ngOnInit();
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong');
      }
    );
  }
}
