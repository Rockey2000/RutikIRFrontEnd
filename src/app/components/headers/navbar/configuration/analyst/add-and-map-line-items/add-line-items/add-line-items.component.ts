import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';


interface AnalystId {
  id: string;
}
interface masterTable{
  tableContent: string;
}


@Component({
  selector: 'app-add-line-items',
  templateUrl: './add-line-items.component.html',
  styleUrls: ['./add-line-items.component.css'],
  providers: [ConfirmationService, MessageService],

})
export class AddLineItemsComponent implements OnInit {

  analystLineItemForm!: FormGroup;
  analystIds: AnalystId[] = [];
  value!: masterTable[];
  selectedValue!:masterTable;
  addLineItem: any[] =[];

  // analystLineItemForm:boolean=false;

  // analystLineItemNamePattern = "^[a-zA-Z ]{3,100}$";
  // analystTableHeaderNamePattern= "^[a-zA-Z0-9. /]{3,100}$";
  analystDetails:any;
  constructor( private service: IRServiceService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router : Router) {
    // this.analystIds = [
    //   { id: '1710' },
    //   { id: '1720' },
    //   { id: '1730' },
    //   { id: '1740' },
    //   { id: '1750' },
    //   { id: '1760' },
    // ];

    this.value =[
      {tableContent:'Income Statment'},
      {tableContent:'Balance Sheet'},
      {tableContent:'Cash Flow'}
    ];


    this.analystLineItemForm = this.fb.group({
      analystLineItemRow: this.fb.array([this.newRow()]),
    });
   }

  ngOnInit(): void {

    // this.analystLineItemForm = new FormGroup({
    //   analystName: new FormControl(''),
    //   masterTableSource: new FormControl(''),
    //   analystLineItemName: new FormControl('', [Validators.required,
    //   Validators.pattern(this.analystLineItemNamePattern)]),
    //   analystTableHeaderName: new FormControl('',[ Validators.required,
    //   Validators.pattern(this.analystTableHeaderNamePattern)]),
    // });
        
    this.service.getAnalystDetails().subscribe(
      (data:any) => {
          console.log(data);
          this.analystDetails= data;
          console.log(this.analystDetails,"data is getting");
      },
      (error: HttpErrorResponse) =>{
        alert('something went wrong....');
        console.log(error);
      }
    );
   

 
    // this.service.getAnalystLineItems().subscribe(
    //   (data: any) =>{
    //     console.log(data);
    //     this.addLineItem = data;
    //     console.log(this.addLineItem,'Line Item data');
    //    },
    //   (error: HttpErrorResponse) =>{
    //     alert('something went wrong....');
    //     console.log(error);
    //   }
    // );
  }



 

  // selectedTableName!: string;
  // passengerForm = [
  //   {
  //     analystName: '',
  //     masterTableSource: '',
  //     analystLineItemName: '',
  //     analystTableHeaderName: '',
  //   },
  // ];

  // addForm() {
  //   this.passengerForm.push({
  //     analystName: '',
  //     masterTableSource: '',
  //     analystLineItemName: '',
  //     analystTableHeaderName: '',
  //   });
  // }


  selectedTableName!: string;
  onClickSaveAll() {
    
    console.log(this.analystLineItemForm, 'ramram');
    for (
      let i = 0;
      i < this.analystLineItemForm.value.analystLineItemRow.length;
      i++
    ) {
    this.service.analystLineItem(this.analystLineItemForm.value.analystLineItemRow[i]).subscribe(
      (data:any) => {
         console.log(data,"data is getting ");
         this.analystLineItemForm.reset();
       
       
         this.messageService.add({
          severity: 'success',
          summary: 'Successfull',
          detail: 'Analyst Nomenclature addedd successfully',
        });
        this.onClickBack();
        this.ngOnInit();
       
      },
      (error: HttpErrorResponse) =>  {
        if(error.status===406){
         this.messageService.add({
           severity: 'warn',
           summary: 'Warning',
           detail: 'Duplicate Analyst Nomenclature Values Not Allowed..!!',
         });
       }else{
       this.messageService.add({
         severity: 'Error',
         summary: 'Error',
         detail: 'Something went wrong while adding Analyst Nomenclature Line Items ..!!',
       });
     }
       // alert(error);
       this.ngOnInit();
     }
    );
  
  }

}

  onClickBack(){
    this.service.emitDialogFormData("done");
    this.router.navigate(['/document/nav/config/analyst/nomenclature']);
    
    this.analystLineItemForm.reset();

    for (
      let i = 1;
      i < this.analystLineItemForm.value.analystLineItemRow.length;
      i++
    ) {
      this.removeRow(i=0);
    }
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

  addRow() {
  
    this.analystLineItem.push(this.newRow());
  }
  removeRow(i: number) {
    this.analystLineItem.removeAt(i);
  }
}
