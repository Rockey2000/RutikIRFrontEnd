import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
import { LoadingSpinnerService } from 'src/app/loading-spinner.service';
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
  // formula: any = [];
  // MyArray =this.formula.split(',');
  ratios: any[] = [];
  dataTypes: DataType[] = [];
  formula: { item: string }[] = [];
  FormulaFor!: string;
  formulaType!: string;

  financialRatioForm!: FormGroup;

  lineItemPattern = "^[a-zA-Z ]{3,20}$";
  selectedValue!: any;
  balanceSheetTableValues: boolean = false;
  CashFlowTableValues: boolean = false;
  incomeStatmentTableValues: boolean = false;
  operationDrop:boolean=false
  incomeStatementLineItem: any;
  balanceSheetLineItem: any;
  cashFlowLineItem: any;
  constructor(
    private lodSpinner : LoadingSpinnerService,
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
      { name: 'Gross profit' },
      { name: 'Net interest' },
      { name: 'Total liabilities' },
      { name: 'Reserves & surplus' },
    ];

    this.dataTypes = [
      { type: 'Income Statement' },
      { type: 'Balance Sheet' },
      { type: 'Cash Flow' },
    ];

  }
  isLoading: boolean = false;
  ngOnInit(): void {
    this.lodSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });

    this.lodSpinner.isLoading.next(true);

    
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
        this.lodSpinner.isLoading.next(false);
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong...');
        console.log(error);
      }
    );

      // this.service.getTableStructures().subscribe(
      //   (data: any) => {
      //     this.cashFlowData = data;

      //     this.service
      //       .getIncomeStatementTableStructures()
      //       .subscribe((data1: any) => {
      //         for (let i = 0; i < data1.length; i++) {
      //           this.cashFlowData.push(data1[i]);
      //         }
      //         this.service.getTableStructures().subscribe((data2: any) => {
      //           for (let i = 0; i < data2.length; i++) {
      //             this.cashFlowData.push(data2[i]);
      //           }
      //           console.log(this.cashFlowData);
      //           this.allLineItems = this.cashFlowData;
      //         });
      //       });
      //   },
      //   (error: any) => {
      //     alert();
      //   }
      // );

    this.financialRatioForm = new FormGroup({
      lineItem: new FormControl('', [Validators.required,
      Validators.pattern(this.lineItemPattern),
      Validators.minLength(3),
      Validators.maxLength(15)]),
      lineItemSource: new FormControl('',[Validators.required]),
      formula: new FormControl(''),
    });

  }

  // onClickLineItem(value: any) {
  //   // this.formula.concat(this.selectedLineItem);
  //   // console.log(this.selectedLineItem,"aksksk");
  //   // this.formula = this.formula + this.selectedLineItem;

  //   if (value) {
  //     this.formula.push({ item: value });
  //   }
  //   // console.log(value);

  //   console.log(this.formula);

  //   //  console.log('onChange event called');
  //   // console.log(this.MyArray);
  // }

  // onClickSymbol(value: any) {
  //   // this.formula.concat(this.selectedSymbol);
  //   // this.formula = this.formula + this.selectedSymbol;
  //   // console.log(this.formula);
  //   // console.log(this.MyArray);

  //   if (value) {
  //     this.formula.push({ item: value });
  //   }
  //   console.log(this.formula);
  //    this.selectedLineItem ='';


  // }
  onClickLineItem(selectedLineItem: string) {
    this.formula.push({ item: selectedLineItem });
  }
  
  onClickSymbol(selectedSymbol: string) {
    this.formula.push({ item: selectedSymbol });
  }
  


  newFormula: string = '';

  onClickSave() {
    this.lodSpinner.isLoading.next(true);
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
        this.balanceSheetTableValues= false;
        this.CashFlowTableValues=false;
        this.incomeStatmentTableValues= false;
        this.operationDrop=false;
        this.ngOnInit();
        this.messageService.add({
          severity:'success',
          summary:'success',
          detail:'Added..!!',
        });
        this.lodSpinner.isLoading.next(false);
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
            severity:'error',
            summary:'Error',
            detail: 'Something went wrong while adding Financial ratios..!!',
          });
        }
        this.ngOnInit();
        this.lineItemsTable = true;
      }
    );
    this.financialRatioForm.reset();
    this.formula=[];
    this.selectedSymbol ='';
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
    this.formula = [];
  }
 
  deleteFormula(id:any){
console.log(id);
this.confirmationService.confirm({
  message: 'Are you sure that you want to Delete Financial ratio formula ?',
  accept: () => {
    this.service.deleteFormula(id).subscribe(
      (data: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Financial ratio formula deleted successfully',
        });
 
        this.ngOnInit();
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong while deleting financial ratio formula..!!',
        });
        this.ngOnInit();
      }
    );

    this.ngOnInit();
  },
  reject: () => {
    this.messageService.add({
      severity: 'warn',
      summary: 'Cancelled',
      detail: 'Financial ratio formula not deleted',
    });
  },
});
  }

  onSelectLineItemSource(){
    console.log(this.selectedValue,"selected Value");
    this.balanceSheetTableValues=false;
    if (this.selectedValue === 'Balance Sheet') {
      console.log('rutik');
      this.service.getTableStructures().subscribe(
        (data: any) => {
          this.balanceSheetLineItem = data;
          console.log(this.balanceSheetLineItem);
          this.balanceSheetTableValues = true;
          this.operationDrop=true;
      for(let i=0; i< this.balanceSheetLineItem.length;i++){
        this.balanceSheetLineItem.sort((a:any, b:any)=>{
          if(a.lineItem < b.lineItem) return -1;
          if(a.lineItem > b.lineItem) return 1;
          return 0;
        })
  
        console.log(this.balanceSheetLineItem,"sorted line item of balance sheet");
 
        
      }
        },
        (error: HttpErrorResponse) => {
          alert('something went wrong');
          console.log(error);
        }
      );
      this.balanceSheetTableValues = true;
    } else {
      this.balanceSheetTableValues = false;
      this.operationDrop=false;
    }
    this.CashFlowTableValues=false;
    if (this.selectedValue === 'Cash Flow') {
          this.service.getCashFlowTableStructure().subscribe(
        (data: any) => {
          this.cashFlowLineItem = data;
          console.log(this.cashFlowLineItem);
          this.CashFlowTableValues = true;
          this.operationDrop=true;
          for(let i=0; i< this.cashFlowLineItem.length;i++){
            this.cashFlowLineItem.sort((a:any, b:any)=>{
              if(a.lineItem < b.lineItem) return -1;
              if(a.lineItem > b.lineItem) return 1;
              return 0;
            })
          }
        },
        (error: HttpErrorResponse) => {
          alert('something went wrong');
          console.log(error);
        }
      );
    } else {
      this.CashFlowTableValues = false;
      this.operationDrop=false;
    }
    this.incomeStatmentTableValues=false;
    if (this.selectedValue === 'Income Statement') {
     
      this.service.getIncomeStatementTableStructures().subscribe(
        (data: any) => {
          this.incomeStatementLineItem = data;
          console.log(this.incomeStatementLineItem);
          this.incomeStatmentTableValues = true;
          this.operationDrop=true;
          for(let i=0; i< this.incomeStatementLineItem.length;i++){
            this.incomeStatementLineItem.sort((a:any, b:any)=>{
              if(a.lineItem < b.lineItem) return -1;
              if(a.lineItem > b.lineItem) return 1;
              return 0;
            })
            console.log(this.incomeStatementLineItem,"income lineitem sorted");
            
          }
        },
        (error: HttpErrorResponse) => {
          alert('something went wrong');
          console.log(error);
        }
      );
    } else {
      this.incomeStatmentTableValues = false;
      this.operationDrop=false
    }
  }
}
