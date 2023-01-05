import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IRServiceService } from 'src/app/ir-service.service';

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
  selectedLineItem: [] = [];
  selectedAnalystLineItem: [] = [];
  lineItemsArr: any = [];
  analystLineItemArr: any = [];
  mappedLineItems: any = [];
  mapping: any = [];
  mappedLineItem: any;
  MappingForm!: FormGroup;
  constructor(
    private irService: IRServiceService,
    private router: Router,
    private location: Location
  ) {
    this.masterTableHeaders = [
      { tableName: 'Balance Sheet' },
      { tableName: 'Income Statment' },
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
  }

  onSaveBack(){
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
          console.log(this.LineItemByAnalystName, ' hello');
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

    if (this.selectedValue === 'Income Statment') {
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

  onClickMasterDbLineItem(value: any) {
    if (value) {
      this.lineItemsArr.push({ lineItem: value });
    }
    
    console.log(value);
  }

  // data1:any;

  onClickAnalystLineItem(value: any) {
    if (value) {
      this.analystLineItemArr.push({ item: value });
    }
    // for (let i = 0; i < this.lineItemsArr.length; i++) {
    //   this.mappedLineItems[i] = [
    //     this.lineItemsArr[i].item,
    //     this.analystLineItemArr[i].item,
    //   ];
    for (let i = 0; i < this.lineItemsArr.length; i++) {
      this.mappedLineItems[i] = [
        this.lineItemsArr[i].lineItem,
        this.analystLineItemArr[i].item,
      ];
      if(this.mappedLineItems==null){
        alert('something went wrong')
      }
      console.log(this.mappedLineItems);
    }
    console.log(this.mappedLineItems, '...!!');
   
  }


  onClickSave() {
    // let arraylength = this.mappedLineItems.length;
    // for (let i = 0; i < arraylength; i++) {
    //   console.log(this.mappedLineItems[i]);

    //
    // }
    // console.log('hello');
    // let firstLineItem:string;
    // let secondLineItem:string;
    //     for(let i=0;i<this.lineItemsArr.length; i++){
    //       firstLineItem=this.lineItemsArr[0];
    //     }

    //     for(let i=0;i<this.analystLineItemArr.length; i++){
    //       secondLineItem=this.analystLineItemArr[0];
    //     }
    for (let i = 0; i < this.lineItemsArr.length; i++) {
      
      this.irService
        .updateMappingStructure(
          this.lineItemsArr[i].lineItem,
          this.selectedAnalystName,
          this.analystLineItemArr[i].item
        )
        .subscribe(
          (data: any) => {
          console.log("data is mapped")
            this.mappedLineItem = data;
            console.log(this.mappedLineItem,"data is passing Rutik");
            this.onSaveBack();
            //  alert('Mapping Completed');
          },
          (error: HttpErrorResponse) => {
            if(this.mappedLineItem==null){
              alert('balnk field not allowed')
            }
            alert('Mapping Completed');
            console.log("hello");
            // this.location.back();
            this.onSaveBack();
          }
        );
    }

    // for(let i=0;i<this.mappedLineItems.length; i++){
    //   // this.mappedLineItems[i] = this.mappedLineItems[i]
    //   //       .substring(1, this.mappedLineItems[i].length - 1).split(",");
    //   this.arr=this.mappedLineItems[i].split(',')
    //   console.log(this.arr,"...!!!");

    // }
  }
  onClickBack(){
    this.location.back();
  }
}
