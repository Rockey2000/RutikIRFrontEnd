import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
import { LoadingSpinnerService } from 'src/app/loading-spinner.service';
import { LineItem } from './tableStructure';
import { HttpErrorResponse } from '@angular/common/http';
import { Ratios } from './model/finmodel';
import { timer } from 'rxjs';
import { Router } from '@angular/router';



interface Attribute {
  name: string;
}

interface DataType {
  type: string;
}


interface Operation {
  symbol: string;
  name: string
}
@Component({
  selector: 'app-client-financial-ratio',
  templateUrl: './client-financial-ratio.component.html',
  styleUrls: ['./client-financial-ratio.component.css']
})
export class ClientFinancialRatioComponent implements OnInit {
  selectedTable!: string;

  selectedDoc!: string;
  selectedLineItemType!: string;
  topButtons: boolean = false;
  lineItemsTable: boolean = false;
  createLineItemTable = false;
  addLineItem: boolean = false;
  lineItem!: LineItem;
  lineItems: LineItem[] = [];
  analystnameArr:any=[];
  analystnameClientArr:any=[];



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
  selectedValue1!: any;
  balanceSheetTableValues: boolean = false;
  CashFlowTableValues: boolean = false;
  incomeStatmentTableValues: boolean = false;
  operationDrop:boolean=false
  incomeStatementLineItem: any;
  balanceSheetLineItem: any;
  cashFlowLineItem: any;

  clientRatioForm:boolean=false;
  ClientRatioTable:boolean=true;
  clientRatios:any[]=[];
  Ratiodata!:Ratios;
  clientDetailsArray:any=[];
  FinantialClientArr:any=[];
  constructor(    private lodSpinner : LoadingSpinnerService,
    private service: IRServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: Router
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
          console.log(data,"this is list of finantial ratio");
          this.ratios = data;
          timer(500).subscribe(() => {
            this.lodSpinner.isLoading.next(false);
          });        },
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
        formulaName: new FormControl('', [Validators.required,
        Validators.pattern(this.lineItemPattern),
        Validators.minLength(3),
        Validators.maxLength(155)]),
        // lineItemSource: new FormControl('',[Validators.required]),
        clientName: new FormControl('',[Validators.required]),
        lineItemSource: new FormControl('',[Validators.required]),
 
      });

      this.service.getClientDetails().subscribe((data: any) => {
        console.log(data, 'Ths is Client Details');
  
        this.clientDetailsArray = data;
        console.log(this.clientDetailsArray, 'this is Whitelable Client data');
  
        for(let i=0; i<this.clientDetailsArray.length; i++)
        {
          this.FinantialClientArr.push({
            clientName:this.clientDetailsArray[i].clientName
          })
          
        }
        console.log(this.FinantialClientArr,"whiteLableArray");
                this.lodSpinner.isLoading.next(false);
  
      });

      // *********************************************
    this.service.getClientDetails().subscribe(
      (data: any) => {
        console.log('All clients: ', data);
        this.transformClientData(data);
      },
      (error: HttpErrorResponse) => {
        alert(error);
      }
    );
  
    }

    allData: any[] = []
  transformClientData(inputData: any) {
    // const allData: any[] = [];

    inputData.forEach((data: any) => {
      const industryExists = this.allData.find(
        (item) => item.name === data.industry
      );

      if (industryExists) {
        industryExists.states.push({name:data.clientName});
      } else {
        this.allData.push({
          name: data.industry,
          states: [{name:data.clientName}],
        });
      }
    });

    console.log('Parent-Child structure:', this.allData);
  }
  
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

          this.clientRatios = data
          console.log(this.clientRatios,"This assign data for clientratios");
          
          this.formula=[];
          this.allData=[];
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
          this.ClientRatioTable=true;
          this.clientRatioForm = false;

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
    // onClickBack()
    // {
    //   this.route.navigate(['/document/nav/config/clientSetup/clientFinancialRatio']);

    // }
  
    onClickBack() {
      this.service.emitDialogFormData("done");
      this.ClientRatioTable=true;
      this.clientRatioForm=false;
    }
    onclear() {
  
      this.formula.pop();
      console.log(this.formula);
       this.selectedLineItem ='';
      this.selectedSymbol ='';
      this.formula = [];
    }
   
  //   deleteFormula(id:any){
  // console.log(id);
  // this.confirmationService.confirm({
  //   message: 'Are you sure that you want to Delete Financial ratio formula ?',
  //   accept: () => {
  //     this.service.DeleteFinantialRatio(id).subscribe(
  //       (data: any) => {
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'Deleted',
  //           detail: 'Financial ratio formula deleted successfully',
  //         });
   
  //         this.ngOnInit();
  //       },
  //       (error: HttpErrorResponse) => {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Error',
  //           detail: 'Something went wrong while deleting financial ratio formula..!!',
  //         });
  //         this.ngOnInit();
  //       }
  //     );
  
  //     this.ngOnInit();
  //   },
  //   reject: () => {
  //     this.messageService.add({
  //       severity: 'warn',
  //       summary: 'Cancelled',
  //       detail: 'Financial ratio formula not deleted',
  //     });
  //   },
  // });
  //   }
  
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

  addClientRatio(){
    this.service.emitDialogFormData("done");
    this.ClientRatioTable=false;
    this.clientRatioForm=true;
  }

  DeleteRatio(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the ratio?',
      accept: () => {
        // User confirmed the deletion, proceed with the delete operation
        this.service.DeleteFinantialRatio(id).subscribe(
          (data) => {
            console.log(data, "deleted data");
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Data Deleted successfully',
            });
            this.allData = [];
            this.ngOnInit();
          },
          (error: any) => {
            // Error occurred while deleting data, handle the error
            console.error('Error deleting data:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Unable To Delete',
            });
          }
        );
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'Ratio not Deleted',
        });
      },
    });
  }
}

//   DeleteRatio(id:string)
//   {
//     // alert("hiii")

//     this.service.DeleteFinantialRatio(id).subscribe((data)=>{
//       console.log(data,"deleted data");

     
//       this.messageService.add({
//         severity: 'success',
//         summary: 'Successful',
//         detail: 'Data Deleted successfully',
//       });
//       this.allData=[];
//       this.ngOnInit();  
//     },
//     (error: any) => {
//       // Error occurred while retrieving data, handle the error
//       console.error('Error retrieving project code data:', error);
//       this.messageService.add({
//         severity: 'error',
//         summary: 'Error',
//         detail: 'Unabled To Delete',
//       });
//     }
//     )
//     this.ngOnInit()
//     // window.location.reload()
//   }
// }
