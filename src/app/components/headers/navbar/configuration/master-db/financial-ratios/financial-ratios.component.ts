import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
import { LineItem } from './model/tableStructure';

interface DataType {
  type: string;
}

interface Attribute {
  name: string;
}

interface Operation {
  symbol: string;
  name: string
}

@Component({
  selector: 'app-financial-ratios',
  templateUrl: './financial-ratios.component.html',
  styleUrls: ['./financial-ratios.component.css'],
  providers: [ConfirmationService, MessageService],

})
export class FinancialRatiosComponent implements OnInit {
  selectedTable!: string;

  selectedDoc!: string;
  selectedLineItemType!: string;
  topButtons: boolean = false;
  lineItemsTable: boolean = false;
  createLineItemTable = false;
  addLineItem: boolean = false;
  lineItem!: LineItem;
  lineItems: LineItem[] = [];

  lineItemForm!: FormGroup;
  sample: boolean = true;
  addlineItemTable: boolean = false;

  operations!: Operation[];
  attributes!: Attribute[];

  selectedAttribute!: string;
  selectedShareholderName!: string;

  // new variables
  balanceSheetData!: any[];
  incomeSheet!: any[];
  cashFlowData!: any[];

  allLineItems: any[] = [];
  selectedLineItem: string = '';
  selectedSymbol: any = [];
  formula: any = [];
  // MyArray =this.formula.split(',');
  ratios: any[] = [];
  dataTypes: DataType[] = [];

  FormulaFor!: string;
  formulaType!: string;

  financialRatioForm!: FormGroup;

  lineItemPattern = "^[a-zA-Z ]{3,20}$";

  constructor(
    private service: IRServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.operations = [
      { symbol: '(', name: 'Open Bracket' },
      { symbol: ')', name: 'Close Bracket' },
      { symbol: '+', name: 'Add' },
      { symbol: '-', name: 'Subtract' },
      { symbol: '/', name: 'Divide' },
      { symbol: '*', name: 'Multiply' },
      { symbol: '^', name: 'Exponent' },
      { symbol: '100', name: '' },
    ];
    this.attributes = [
      { name: 'EBITDA Margin' },
      { name: 'Net margin' },
      { name: 'Net Debt ratio' },
      { name: 'Revenue' },
      { name: 'Return on equity' },
      { name: 'Attribute name' },
      { name: 'Attribute name' },
      { name: 'Attribute name' },
      { name: 'Attribute name' },
    ];

    this.dataTypes = [
      { type: 'number' },
      { type: 'string' },
      { type: 'boolean' },
    ];

  }

  ngOnInit(): void {
    this.selectedTable = JSON.parse(JSON.stringify(localStorage.getItem('tableName')));

    this.lineItems = [];
    this.addLineItem = true;
    this.lineItemsTable = true;
    this.topButtons = false;

    this.sample = true;
    console.log(this.selectedTable);

    this.service.getFinancialRatios().subscribe(
      (data: any) => {
        console.log(data);
        this.ratios = data;
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong...');
        console.log(error);
      }
    );

    this.service.getTableStructures().subscribe(
      (data: any) => {
        this.cashFlowData = data;

        this.service
          .getIncomeStatementTableStructures()
          .subscribe((data1: any) => {
            for (let i = 0; i < data1.length; i++) {
              this.cashFlowData.push(data1[i]);
            }
            this.service.getTableStructures().subscribe((data2: any) => {
              for (let i = 0; i < data2.length; i++) {
                this.cashFlowData.push(data2[i]);
              }
              console.log(this.cashFlowData);
              this.allLineItems = this.cashFlowData;
            });
          });
      },
      (error: any) => {
        alert();
      }
    );

    this.financialRatioForm = new FormGroup({
      lineItem: new FormControl('', [Validators.required,
      Validators.pattern(this.lineItemPattern)]),
      formulaType: new FormControl(''),
      formula: new FormControl(''),
    });

  }

  onClickLineItem(value: any) {
    // this.formula.concat(this.selectedLineItem);
    // console.log(this.selectedLineItem,"aksksk");
    // this.formula = this.formula + this.selectedLineItem;

    if (value) {
      this.formula.push({ item: value });
    }
    // console.log(value);

    console.log(this.formula);

    //  console.log('onChange event called');
    // console.log(this.MyArray);
  }

  onClickSymbol(value: any) {
    // this.formula.concat(this.selectedSymbol);
    // this.formula = this.formula + this.selectedSymbol;
    // console.log(this.formula);
    // console.log(this.MyArray);

    if (value) {
      this.formula.push({ item: value });
    }
    console.log(this.formula);
     this.selectedLineItem ='';


  }
  newFormula: string = '';

  onClickSave() {

    console.log(this.formula, " Formula");

    for (let i = 0; i < this.formula.length; i++) {
      console.log(i + this.formula[i].item);

      this.newFormula = this.newFormula + this.formula[i].item;
    }
    this.financialRatioForm.value.formula = this.newFormula;
    console.log(this.financialRatioForm.value.formula, "new Formula");


    this.service.createNewFormula(this.financialRatioForm.value).subscribe(
      (data: any) => {
        console.log(data);
        this.formula=[];
        this.newFormula='';
        this.financialRatioForm.reset();
        this.selectedLineItem='';
        this.lineItemsTable = true;
        this.selectedSymbol='';
        this.ngOnInit();
        this.messageService.add({
          severity:'success',
          summary:'success',
          detail:'Added..!!',
        });
      },
      (error: HttpErrorResponse) => {
        if(error.status===406){
          this.messageService.add({
            severity:'warn',
            summary:'warning',
            detail:'Duplicate values Not Allowed..!!'
          });
        }else{
          this.messageService.add({
            severity:'Error',
            summary:'Error',
            detail: 'Something went wrong while adding Financial ratios..!!',
          });
        }
        this.ngOnInit();
        this.lineItemsTable = true;
      }
    );
  }

  addLneItem() {
    this.topButtons = true;
    this.lineItemsTable = false;
    this.addLineItem = false;
  }

  onClickCancel() {
    this.topButtons = false;
    this.lineItemsTable = true;
    this.addLineItem = true;
    this.formula=[];
    this.financialRatioForm.reset();
    this.selectedLineItem ='';
    this.selectedSymbol ='';
  }
  onclear() {

    this.formula.pop();
    console.log(this.formula);
     this.selectedLineItem ='';
    this.selectedSymbol ='';
  }
 

}
