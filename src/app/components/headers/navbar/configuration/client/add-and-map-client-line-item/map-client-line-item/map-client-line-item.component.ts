import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
import { Location } from '@angular/common';

interface masterData {
  tableName: string;
}
interface analystDetails {
  analystTableHeaderName: string;
}
interface Client {
  totalClient: string;
}
@Component({
  selector: 'app-map-client-line-item',
  templateUrl: './map-client-line-item.component.html',
  styleUrls: ['./map-client-line-item.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class MapClientLineItemComponent implements OnInit {
  analysts: analystDetails[] = [];
  masterTableHeaders: masterData[] = [];
  selectedValue!: string;
  incomeStatementLineItem: any;
  balanceSheetLineItem: any;
  cashFlowLineItem: any;
  allMasterHeaderLineItems: any[] = [];
  LineItemByClientName: any[] = [];
  selectedClientName!: any;
  balanceSheetLineItems: any[] = [];
  selectedLineItem!: string;
  selectedClientLineItem: string = '';
  lineItemsArr: any[] = [];
  analystLineItemArr: any[] = [];
  mappedLineItem: any;
  mappedLineItems: any = [];

  mapping: any = [];
  tabmenus: boolean = true;
  MappingForm!: FormGroup;
  client: Client[] = [];
  constructor(
    private irService: IRServiceService,
    private router: Router,
    private location: Location,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private service: IRServiceService,

  ) {
    this.masterTableHeaders = [
      { tableName: 'Balance Sheet' },
      { tableName: 'Income Statement' },
      { tableName: 'Cash Flow' },
      { tableName: 'Financial Ratio' },
    ];

    this.client = [
      { totalClient: 'Trio' },
      { totalClient: 'Minda' },
      { totalClient: 'TechSoft' },
      { totalClient: 'MindScript' },
      { totalClient: 'Roxiller' },
      { totalClient: 'Idea' },
      { totalClient: 'Voot' },
      { totalClient: 'Trello' },
    ];
  }

  ngOnInit(): void {
    // this.service.emitDialogFormData('done');

    this.irService.dialogFormDataSubscriber$.subscribe((data: any) => {
      console.log(data, '!!');
      this.tabmenus = !this.tabmenus;
    });

    console.log(this.tabmenus, 'hello tabmenus');

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
  onSaveBack() {
    this.router.navigate(['/document/nav/config/analyst/nomenclature']);
  }
  // *************MASTER DATABASE LINE ITEM**************
  mappingCard: boolean = false;
  balanceSheetTableValues: boolean = false;
  CashFlowTableValues: boolean = false;
  incomeStatmentTableValues: boolean = false;

  onSelectAnalystName(event:any) {
     this.selectedClientName=event.value;
     console.log(this.selectedClientName,"selectedClient");
     
    
    if (this.selectedClientName === this.selectedClientName) {
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

        for (let i = 0; i < this.balanceSheetLineItem.length; i++) {
          this.balanceSheetLineItem.sort((a: any, b: any) => {
            if (a.lineItem < b.lineItem) return -1;
            if (a.lineItem > b.lineItem) return 1;
            return 0;
          });

          console.log(
            this.balanceSheetLineItem,
            'sorted line item of balance sheet'
          );
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

        for (let i = 0; i < this.incomeStatementLineItem.length; i++) {
          this.incomeStatementLineItem.sort((a: any, b: any) => {
            if (a.lineItem < b.lineItem) return -1;
            if (a.lineItem > b.lineItem) return 1;
            return 0;
          });
          console.log(this.incomeStatementLineItem, 'income lineitem sorted');
        }
      },
      (error: HttpErrorResponse) => {
        alert('Something went wrong');
        console.log(error);
      }
    );

    this.irService.getCashFlowTableStructure().subscribe(
      (data: any) => {
        this.cashFlowLineItem = data;
        console.log(this.cashFlowLineItem);

        for (let i = 0; i < this.cashFlowLineItem.length; i++) {
          this.cashFlowLineItem.sort((a: any, b: any) => {
            if (a.lineItem < b.lineItem) return -1;
            if (a.lineItem > b.lineItem) return 1;
            return 0;
          });
        }
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong');
        console.log(error);
      }
    );

    this.irService
      .getLineItemByClientName(this.selectedClientName, this.selectedValue)
      .subscribe(
        (data: any) => {
          console.log(
            'analyst name= ',
            this.selectedClientName,
            'table name= ',
            this.selectedValue
          );

          this.LineItemByClientName = data;
          console.log(this.LineItemByClientName, ' hello Client LINE ITEM');

          for (let i = 0; i < this.LineItemByClientName.length; i++) {
            this.LineItemByClientName.sort((a: any, b: any) => {
              if (a.clientLineItemName < b.clientLineItemName) return -1;
              if (a.clientLineItemName > b.clientLineItemName) return 1;
              return 0;
            });
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
  onClickMasterDbLineItem(value: string) {
    console.log(value, ' selected value....!!!!');

    if (value != null) {
      console.log(value, ' selected value', this.lineItemsArr.length);
      if (this.checkIfExist(value)) this.lineItemsArr.push(value);
    }
  }
  finalArray: any[] = [];
  checkIfExist(value: String) {
    console.log(
      this.lineItemsArr.indexOf(value),
      ' this.lineItemsArr.indexOf(value)'
    );

    if (this.lineItemsArr.indexOf(value) == -1) return true;
    else return false;
  }

  checkIfExist1(value: String) {
    console.log(
      this.lineItemsArr.indexOf(value),
      ' this.lineItemsArr.indexOf(value)'
    );

    if (this.analystLineItemArr.indexOf(value) == -1) return true;
    else return false;
  }

  onClickAnalystLineItem(value: any) {
    if (value) {
      if (this.checkIfExist1(value)) this.analystLineItemArr.push(value);
    }
    console.log(this.analystLineItemArr, 'Array2');

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

  onClickSave() {
    for (let i = 0; i < this.lineItemsArr.length; i++) {
      let data = {
        lineItemName: this.lineItemsArr[i],
        clientName: this.selectedClientName,
        clientLineItemName: this.analystLineItemArr[i],
      };

      this.irService.updateClientMappingStructure(data).subscribe(
        (data: any) => {
          console.log(data, 'data is mapped');
          this.mappedLineItem = data;
          console.log(this.mappedLineItem, 'data is passing Rutik');
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'All mappings were successful',
          });
          setTimeout(() => {
            this.router.navigate(['/document/nav/config/clientSetupDetails/client'])
            this.service.emitDialogFormData("done");
          }, 1300);
          // this.router.navigate([
          //   '/document/nav/config/clientSetupDetails',
          // ]);
        },
        (error: HttpErrorResponse) => {
        
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `${error.error.developerMessage}`,
              
            });
          
        }
      );
    }
  }

  onClickBack() {
    this.location.back();
  }

  onClickMappedLineItem(i: any, j: any) {
    console.log(i, ' & ', j, ': onClickMappedLineItem(item)');
    this.popMappedLineItem(i, j);
    this.selectedLineItem = '';
    this.selectedClientLineItem = '';
  }

  popMappedLineItem(i: any, j: any) {
    console.log(this.lineItemsArr.indexOf(i));
    console.log(this.analystLineItemArr.indexOf(j));
    this.lineItemsArr.splice(this.lineItemsArr.indexOf(i), 1);
    this.analystLineItemArr.splice(this.analystLineItemArr.indexOf(j), 1);
  }

  
}
