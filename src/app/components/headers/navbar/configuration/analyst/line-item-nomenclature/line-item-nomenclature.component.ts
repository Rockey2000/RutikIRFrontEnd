import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostBinding, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  analystDetails: any;
  selectedType1!:string;
  table:any[]=[]
  id: any;
  updateAnalystLineItem!: string;
  updateAnlystTableHeaderName!: string;
  masterTableSource!:string;
  analystName!:string;
  outerTabMenu!: string;
  DataForDropdown: any[]=[];
  constructor(
    private service: IRServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router : Router,
    private fb: FormBuilder
  ) {
    this.value = [
      { tableContent: 'Income Statement' },
      { tableContent: 'Balance Sheet' },
      { tableContent: 'Cash Flow' },
    ];


    this.analystLineItemForm = this.fb.group({
      analystLineItemRow: this.fb.array([this.newRow()]),
    });
  }
  tabmenus:boolean=true;
  ngOnInit(): void {
    localStorage.removeItem('tableName');
    this.service.dialogFormDataSubscriber$.subscribe((data: any) => {
      console.log(data,"!!");
      this.tabmenus=!this.tabmenus;
     
    })
      
    console.log(this.tabmenus,"hello tabmenus");




    this.service.getAnalystLineItems().subscribe(
    (data:any)=>{
      this.addLineItem=data;
      console.log(this.addLineItem);
      this.tabmenus=true;
      const uniqueData = new Set(this.addLineItem);
      this.DataForDropdown = Array.from(uniqueData); // Convert the Set back to an array
 
 
  console.log(this.DataForDropdown, "Data for dropdown without duplicates");
  const uniqueAnalyst = new Set(this.DataForDropdown.map(item => item.analystName));
  this.DataForDropdown = Array.from(uniqueAnalyst).map(analystName => ({ analystName }));
  console.log(this.DataForDropdown,"dataforDropdoen1");
  this.DataForDropdown = Array.from(uniqueAnalyst)
    .filter(analystName => analystName) // Only keep non-empty values
    .map(analystName => ({ analystName }));
    },
    (error:HttpErrorResponse)=>{
      alert("something went wrong...!!");
    }
    )
    this.service.getAnalystDetails().subscribe(
      (data: any) => {
        console.log(data);
        this.analystDetails = data;
        console.log(this.analystDetails, 'data is getting');
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong....');
        console.log(error);
      }
    );

  }

  get analystLineItem(): FormArray {
    return this.analystLineItemForm.get('analystLineItemRow') as FormArray;
  }
  newRow(): FormGroup {
    return this.fb.group({
      analystName: '',
      masterTableSource: '',
      analystLineItemName: '',
      analystTableHeaderName: '',
    });
  }
  onClickAdd() {
    // this.lineItemTable = false;
    // this.lineItemForm = true;
   // localStorage.setItem('outertabmenu','true');
   this.service.emitDialogFormData("done");
    this.router.navigate(["/document/nav/config/analyst/addAndMapingLineItems/addLineItem"])
  }
  initAnalystLineItemForm(): void {
    this.analystLineItemForm = this.fb.group({
      analystLineItemRow: this.fb.array([
        this.fb.group({
          analystName: [null, Validators.required],
          masterTableSource: [null, Validators.required],
          analystLineItemName: [null, Validators.required],
          analystTableHeaderName: [null, Validators.required]
        })
      ])
    });
  }
 
  onClickBack(){
    this.lineItemTable=true;
this.lineItemForm=false;
  }
  editProduct(data:any){
console.log(data,"hello data in nomenclature");
this.lineItemTable=false;
this.lineItemForm=true;

this.id=data.analystLineId;
this.updateAnalystLineItem=data.analystLineItemName;
this.updateAnlystTableHeaderName=data.analystTableHeaderName;
this.masterTableSource=data.masterTableSource;
this.analystName=data.analystName;

console.log(this.updateAnalystLineItem,this.updateAnlystTableHeaderName,this.masterTableSource,this.analystName);

this.analystLineItemForm.patchValue({
  analystLineItemRow: [{
    analystName: this.analystName,
    masterTableSource: this.masterTableSource,
    analystLineItemName: this.updateAnalystLineItem,
    analystTableHeaderName: this.updateAnlystTableHeaderName
  }]
});
  }

  onClickSaveAll(){
    const updatedData = {
      analystLineId: this.id,
      analystName: this.analystLineItemForm.value.analystLineItemRow[0].analystName,
      masterTableSource: this.analystLineItemForm.value.analystLineItemRow[0].masterTableSource,
      analystLineItemName: this.analystLineItemForm.value.analystLineItemRow[0].analystLineItemName,
      analystTableHeaderName: this.analystLineItemForm.value.analystLineItemRow[0].analystTableHeaderName
    };

    console.log(updatedData,"after save updated data");
    this.service.updateAnalystLineItem(updatedData).subscribe(
      (data: any) => {
        console.log(data);
        this.ngOnInit();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Analyst Line Item Updated..!!',
        });

        this.onClickBack();
      },
      (error: HttpErrorResponse) => {
       
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `${error.error.developerMessage}`,
          });
 
        // alert(error);
        this.ngOnInit();
        this.onClickBack();
      }
    );
  }
}
