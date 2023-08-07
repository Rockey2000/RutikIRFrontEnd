import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
import { mapLineItemData } from './addmapline';

interface masterData {
  tableName: string;
}
interface analystDetails {
  analystTableHeaderName: string;
}
@Component({
  selector: 'app-map-line-items',
  templateUrl: './map-line-items.component.html',
  styleUrls: ['./map-line-items.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class MapLineItemsComponent implements OnInit {
  analysts: analystDetails[] = [];
  masterTableHeaders: masterData[] = [];
  selectedValue!: string;
  incomeStatementLineItem: any;
  balanceSheetLineItem: any;
  cashFlowLineItem: any;
  allMasterHeaderLineItems: any[] = [];
  LineItemByAnalystName: any[] = [];
  selectedAnalystName!: string;
  balanceSheetLineItems: any[] = [];
  selectedLineItem!: string;
  selectedAnalystLineItem: string = '';
  lineItemsArr: any []= [];
  analystLineItemArr: any[] = [];
  mappedLineItem:any;
  mappedLineItems: any = [];
  addLineItem:any[]=[];
  mapping: any = [];
  tabmenus:boolean=true;
  existingLineItems: any[] = [];
  filteredLineItems: any[] = [];
  MappingForm!: FormGroup;
  constructor(
    private irService: IRServiceService,
    private router: Router,
    private location: Location,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.masterTableHeaders = [
      { tableName: 'Balance Sheet' },
      { tableName: 'Income Statement' },
      { tableName: 'Cash Flow' },
      { tableName: 'Financial Ratio' },
    ];
  }

  ngOnInit(): void {
    this.irService.getAnalystDetails().subscribe(
      (data: any) => {
        this.analysts = data;
        console.log(this.analysts, 'analyst data');
      },
      (error: HttpErrorResponse) => {
        alert(error);
      }
    );


    this.irService.dialogFormDataSubscriber$.subscribe((data: any) => {
      console.log(data,"!!");
      this.tabmenus=!this.tabmenus;
    })
      
    console.log(this.tabmenus,"hello tabmenus");

    this.irService.getAnalystLineItems().subscribe(
      (data:any)=>{
        this.addLineItem=data;
        console.log(this.addLineItem);
      for(let i=0; i< this.addLineItem.length;i++){
        this.existingLineItems.push(this.addLineItem[i].lineItemName)
      }
      console.log(this.existingLineItems,"lineItemName exist");
      
      },
      (error:HttpErrorResponse)=>{
        alert("something went wrong...!!");
      }
      )
  

   

  }

  onSaveBack() {
    this.router.navigate(['/document/nav/config/analyst/nomenclature']);
  }

  // *************MASTER DATABASE LINE ITEM**************
  mappingCard: boolean = false;
  balanceSheetTableValues: boolean = false;
  CashFlowTableValues: boolean = false;
  incomeStatmentTableValues: boolean = false;

  onSelectAnalystName() {
    if (this.selectedAnalystName === this.selectedAnalystName) {
      console.log('Hello Analyst');
      this.mappingCard = true;
    } else {
      this.mappingCard = false;
    }
  }
  onSelectMasterTableName() {
    console.log(this.selectedValue);
    this.irService.getTableStructures().subscribe(
      (data: any) => {
        this.balanceSheetLineItem = data;
        console.log(this.balanceSheetLineItem);
     
    for(let i=0; i< this.balanceSheetLineItem.length;i++){
      this.balanceSheetLineItem.sort((a:any, b:any)=>{
        if(a.lineItem < b.lineItem) return -1;
        if(a.lineItem > b.lineItem) return 1;
        return 0;
      })

      console.log(this.balanceSheetLineItem,"sorted line item of balance sheet");
      if (this.existingLineItems.indexOf(this.balanceSheetLineItem[i].lineItem) === -1) {
        this.filteredLineItems.push(this.balanceSheetLineItem[i].lineItem);
      }
      console.log(this.filteredLineItems,"this.filteredLineItems");
      
    }
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong');
        console.log(error);
      }
    );
  

 
    this.irService.getIncomeStatementTableStructures().subscribe(
      (data: any) => {
        this.incomeStatementLineItem = data;
        console.log(this.incomeStatementLineItem);

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

    this.irService.getCashFlowTableStructure().subscribe(
      (data: any) => {
        this.cashFlowLineItem = data;
        console.log(this.cashFlowLineItem);

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

    this.irService
      .getLineItemByAnalystName(this.selectedAnalystName, this.selectedValue)
      .subscribe(
        (data: any) => {
          console.log(
            'analyst name= ',
            this.selectedAnalystName,
            'table name= ',
            this.selectedValue
          );

          this.LineItemByAnalystName = data;
          console.log(this.LineItemByAnalystName, ' hello Analyst LINE ITEM');

          for(let i=0; i< this.LineItemByAnalystName.length;i++){
            this.LineItemByAnalystName.sort((a:any, b:any)=>{
              if(a.analystLineItemName < b.analystLineItemName) return -1;
              if(a.analystLineItemName > b.analystLineItemName) return 1;
              return 0;
            })
          }

        },
        (error: HttpErrorResponse) => {
          alert(error);
        }
      );

    if (this.selectedValue === 'Balance Sheet') {
      console.log('rutik');
      this.balanceSheetTableValues = true;
    } else {
      this.balanceSheetTableValues = false;
    }

    if (this.selectedValue === 'Cash Flow') {
      this.CashFlowTableValues = true;
    } else {
      this.CashFlowTableValues = false;
    }

    if (this.selectedValue === 'Income Statement') {
      this.incomeStatmentTableValues = true;
    } else {
      this.incomeStatmentTableValues = false;
    }

   
  }

  //*************MASTER DATABASE LINE ITEM ENDS**************

  // onClickMasterDbLineItem(value: any) {

  //   if (value) {
  //     this.lineItemsArr.push({ item: value });
  //   }
  //   console.log(value)
  // }

  // onClickAnalystLineItem(value: any) {

  //   if (value) {
  //     this.analystLineItemArr.push({ analystLineItem: value });
  //   }
  //   console.log(value)
  // }

  onClickMasterDbLineItem(value: string) {
    console.log(value," selected value....!!!!");
    
    if (value!=null) {

      console.log(value," selected value",this.lineItemsArr.length);
      if(this.checkIfExist(value))
      this.lineItemsArr.push(value);

    

    }
  
  }
  finalArray:any[]=[];
  checkIfExist(value:String){
    console.log(this.lineItemsArr.indexOf(value)," this.lineItemsArr.indexOf(value)");
    
    if(this.lineItemsArr.indexOf(value)==-1)
      return true
    else
    return false;
  }

  checkIfExist1(value:String){
    console.log(this.lineItemsArr.indexOf(value)," this.lineItemsArr.indexOf(value)");
    
    if(this.analystLineItemArr.indexOf(value)==-1)
      return true
    else
    return false;
  }

  // data1:any;

  onClickAnalystLineItem(value: any) {
    if (value) {
      if(this.checkIfExist1(value))
      this.analystLineItemArr.push(value);
    }
    console.log(this.analystLineItemArr,'Array2');

    // for (let i = 0; i < this.lineItemsArr.length; i++) {
    //   this.mappedLineItems[i] = [
    //     this.lineItemsArr[i].item,
    //     this.analystLineItemArr[i].item,
    //   ];
    for (let i = 0; i < this.lineItemsArr.length; i++) {
      this.mappedLineItems[i] = [
        this.lineItemsArr[i],
        this.analystLineItemArr[i],
      ];
      if (this.mappedLineItems == null) {
        alert('something went wrong');
      }
      // console.log(this.mappedLineItems);
    }
    console.log(this.mappedLineItems, '...!!');
     
  }
  // mappedLineItem: mapLineItemData={
  //   lineItemName:'',
  //   analystName:'',
  //   analystLineItemName: ''   
  // }
  // onClickSave() {
  //   // let arraylength = this.mappedLineItems.length;
  //   // for (let i = 0; i < arraylength; i++) {
  //   //   console.log(this.mappedLineItems[i]);

  //   //
  //   // }
  //   // console.log('hello');
  //   // let firstLineItem:string;
  //   // let secondLineItem:string;
  //   //     for(let i=0;i<this.lineItemsArr.length; i++){
  //   //       firstLineItem=this.lineItemsArr[0];
  //   //     }

  //   //     for(let i=0;i<this.analystLineItemArr.length; i++){
  //   //       secondLineItem=this.analystLineItemArr[0];
  //   //     }

  //   for (let i = 0; i < this.lineItemsArr.length; i++) {
  //     let data = {
  //       lineItemName: this.lineItemsArr[i],
  //       analystName: this.selectedAnalystName,
  //       analystLineItemName: this.analystLineItemArr[i],
  //     };
    
  //     this.irService.updateMappingStructure(data).subscribe(
  //       (data: any) => {
  //         console.log('data is mapped');
  //         this.mappedLineItem = data;
          
  //         console.log(this.mappedLineItem, 'data is passing Rutik');
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'Successfull',
  //           detail: 'Data Mapped successfully',
  //         });
  //         this.ngOnInit();
  //         // this.onSaveBack();
  //         //  alert('Mapping Completed');
  //       },
  //       (error: HttpErrorResponse) => {
  //         // if(this.mappedLineItem==null){
  //         //   alert('balnk field not allowed')
  //         // }
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'error',
  //           detail: 'Data Mapped successfully',
  //         });
  //         // alert('Mapping Completed');
  //         // console.log("hello");
  //         // this.location.back();
  //         // this.onSaveBack();
  //       }
  //     );
  //   }

  //   // for(let i=0;i<this.mappedLineItems.length; i++){
  //   //   // this.mappedLineItems[i] = this.mappedLineItems[i]
  //   //   //       .substring(1, this.mappedLineItems[i].length - 1).split(",");
  //   //   this.arr=this.mappedLineItems[i].split(',')
  //   //   console.log(this.arr,"...!!!");

  //   // }
  // }
  // onClickSave() {
  //   let success = true;
  
  //   for (let i = 0; i < this.lineItemsArr.length; i++) {
  //     let data = {
  //       lineItemName: this.lineItemsArr[i],
  //       analystName: this.selectedAnalystName,
  //       analystLineItemName: this.analystLineItemArr[i],
  //     };
    
  //     this.irService.updateMappingStructure(data).subscribe(
  //       (data: any) => {
  //         console.log('data is mapped');
  //         this.mappedLineItem = data;
  //         console.log(this.mappedLineItem, 'data is passing Rutik');
         
  //       },

  //       (error: HttpErrorResponse) => {
  //         if(error.status===406){
  //           this.messageService.add({
  //             severity: 'warn',
  //             summary: 'Error',
  //             detail: 'Duplicate Mapping of Line Items Not Allowed..!!',
  //           });
  //         } 
  //         else{
  //         success = false;
  //         }
  //       }
  //     );
  //   }
  
  //   if (success) {
  //     this.messageService.add({
  //       severity: 'success',
  //       summary: 'Successfull',
  //       detail: 'All mappings were successful',
  //     });
  //     this.ngOnInit();
     
  //     this.lineItemsArr = [];
  //     this.selectedAnalystName = '';
  //     this.analystLineItemArr = [];
  //     this.selectedValue='';
  //     this.selectedLineItem='';
  //     this.selectedAnalystLineItem='';
  //     this.mappingCard=false;
  //   } else {
  //     this.messageService.add({
  //       severity: 'error',
  //       summary: 'Error',
  //       detail: 'Some mappings failed',
  //     });
  //   }
  
  //   this.ngOnInit();
  // }
  // onClickSave() {

  //   let successCount = 0;
  //   let errorCount = 0;
  
  //   for (let i = 0; i < this.lineItemsArr.length; i++) {
  //     let data = {
  //       lineItemName: this.lineItemsArr[i],
  //       analystName: this.selectedAnalystName,
  //       analystLineItemName: this.analystLineItemArr[i],
  //     };
  
  //     this.irService.updateMappingStructure(data).subscribe(
  //       (data: any) => {
  //         console.log('data is mapped');
  //         this.mappedLineItem = data;
  //         console.log(this.mappedLineItem, 'data is passing Rutik');
  //         successCount++;
  //         if (successCount + errorCount === this.lineItemsArr.length) {
  //           if (errorCount === 0) {
  //             this.messageService.add({
  //               severity: 'success',
  //               summary: 'Successful',
  //               detail: 'All mappings were successful',
  //             });
  //             this.ngOnInit();
  //             this.lineItemsArr = [];
  //             this.selectedAnalystName = '';
  //             this.analystLineItemArr = [];
  //             this.selectedValue = '';
  //             this.selectedLineItem = '';
  //             this.selectedAnalystLineItem = '';
  //             this.mappingCard = false;
  //           } else {
  //             this.messageService.add({
  //               severity: 'error',
  //               summary: 'Error',
  //               detail: 'Some mappings failed 1',
  //             });
  //           }
  //         }
  //       },
  //       (error: HttpErrorResponse) => {
  //         if (error.status === 406) {
  //           this.messageService.add({
  //             severity: 'warn',
  //             summary: 'Error',
  //             detail: 'Duplicate Mapping of Line Items Not Allowed..!!',
  //           });
  //         } else {
  //           errorCount++;
  //           if (successCount + errorCount === this.lineItemsArr.length) {
  //             if (errorCount === 0) {
  //               this.messageService.add({
  //                 severity: 'success',
  //                 summary: 'Successful',
  //                 detail: 'All mappings were successful',
  //               });
  //               this.ngOnInit();
  //               this.lineItemsArr = [];
  //               this.selectedAnalystName = '';
  //               this.analystLineItemArr = [];
  //               this.selectedValue = '';
  //               this.selectedLineItem = '';
  //               this.selectedAnalystLineItem = '';
  //               this.mappingCard = false;
  //             } else {
  //               this.messageService.add({
  //                 severity: 'error',
  //                 summary: 'Error',
  //                 detail: 'Some mappings failed 2',
  //               });
  //             }
  //           }
  //         }
  //       }
  //     );
  //   }
  // }

  onClickSave(){
    for (let i = 0; i < this.lineItemsArr.length; i++) {
          let data = {
            lineItemName: this.lineItemsArr[i],
            analystName: this.selectedAnalystName,
            analystLineItemName: this.analystLineItemArr[i],
          };

          this.irService.updateMappingStructure(data).subscribe(
                  (data: any) => {
                    console.log(data,'data is mapped');
                    this.mappedLineItem = data;
                    console.log(this.mappedLineItem, 'data is passing Rutik');
                    this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'All mappings were successful',
                          }); 
                          setTimeout(() => {
                            this.location.back();
                          }, 1300);
                         
                      },
                  (error: HttpErrorResponse) => {
             
                      this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: `${error.error.developerMessage}`,
                      });
                 
                
                  }
          )
        }
  }
  
  onClickBack() {
    this.location.back();

  }
  // onclear() {

  //   this.lineItemsArr.pop();
  //   this.analystLineItemArr.pop();
  //   console.log(this.lineItemsArr);
  //   console.log(this.analystLineItemArr);
  //   this.selectedLineItem='';
  //   this.selectedAnalystLineItem='';
  // }

      onClickMappedLineItem(i:any,j:any){
      console.log(i," & ",j,": onClickMappedLineItem(item)");
      this.popMappedLineItem(i,j);
      this.selectedLineItem='';
      this.selectedAnalystLineItem='';
      }

      popMappedLineItem(i:any,j:any){
        console.log(this.lineItemsArr.indexOf(i));
        console.log(this.analystLineItemArr.indexOf(j));
        this.lineItemsArr.splice(this.lineItemsArr.indexOf(i),1)
        this.analystLineItemArr.splice(this.analystLineItemArr.indexOf(j),1);
      }
}
