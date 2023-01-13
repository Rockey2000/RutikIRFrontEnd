import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
import { LineItem } from './model/tableStructure';

interface TypesOfDoc {
  docName: string;
}
interface LineItemType {
  type: string;
}

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class BalanceSheetComponent implements OnInit {
  selectedTable!: string;
  lineItemTypes: LineItemType[] = [];
  selectedLineItemType!: string;
  topButtons: boolean = false;
  lineItemsTable: boolean = false;
  addLineItem: boolean = false;
  lineItem!: LineItem;
  lineItems: LineItem[] = [];

  addlineItemTable: boolean = false;
  balanceSheetForm!: FormGroup;

  lineItemPattern = '^[a-zA-Z ]{3,50}$';
  alternativeNamePattern = '^[a-zA-Z ]{3,50}$';

  constructor(
    private fb: FormBuilder,
    private service: IRServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.lineItemTypes = [
      { type: 'String' },
      { type: 'Number' },
      { type: 'Boolean' },
    ];

    this.balanceSheetForm = this.fb.group({
      balanceSheetRow: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.addLineItem = true;
    this.lineItemsTable = true;
    this.topButtons = false;

    // this.balanceSheetForm = new FormGroup({
    //   lineItem: new FormControl('',[Validators.required]),
    //   alternativeName: new FormControl('',[Validators.required]),
    //   type: new FormControl('',[Validators.required]),
    //  });

    this.service.getTableStructures().subscribe(
      (data: any) => {
        console.log(data);
        this.lineItems = data;
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong...');
        console.log(error);
      }
    );
    this.balanceSheet.push(this.newRow());
    
  }

  addLneItem() {
    this.addLineItem = false;
    this.topButtons = true;
    this.lineItemsTable = false;
    this.balanceSheetForm.reset();

    for (
      let i = 1;
      i < this.balanceSheetForm.value.balanceSheetRow.length;
      i++
    ) {
      this.removeRow(i=0);
    }
  }

  selectedTableName!: string;
  // onClickSaveAll() {
  //   console.log(this.balanceSheetForm, 'ramram');
  //   for (
  //     let i = 0;
  //     i < this.balanceSheetForm.value.balanceSheetRow.length;
  //     i++
  //   ) {
  //     this.service
  //       . addTable(this.balanceSheetForm.value.balanceSheetRow[i])
  //       .subscribe(
  //         (data: any) => {
  //           console.log(data);
  //           this.balanceSheetForm.reset();
  //           this.lineItemsTable = true;
  //           this.removeRow(i);
  //           this.ngOnInit();
  //         },
  //         (error: HttpErrorResponse) => {
  //            if(error.status===406){
  //             this.messageService.add({
  //               severity: 'warn',
  //               summary: 'Error',
  //               detail: 'Duplicate  Values Not Allowed..!!',
  //             });
  //           }else{
  //           this.messageService.add({
  //             severity: 'Error',
  //             summary: 'Error',
  //             detail: 'Something went wrong while adding Balance sheet Lineitem..!!',
  //           });
  //         }
  //           // alert(error);
  //           this.ngOnInit();
  //         }
  //       );
  //   }
  // }




  onClickSaveAll() {
    console.log(this.balanceSheetForm, 'ramram');
    for (
      let i = 0;
      i < this.balanceSheetForm.value.balanceSheetRow.length;
      i++
    ) {
      this.service
        . addTable(this.balanceSheetForm.value.balanceSheetRow[i])
        .subscribe(
          (data: any) => {
            console.log(data);
            this.balanceSheetForm.reset();
            this.lineItemsTable = true;
            this.removeRow(i);
             this.ngOnInit();

             this.messageService.add({
              severity: 'success',
              summary: 'success',
              detail: 'Added..!!',
            });
          
          },
          (error: HttpErrorResponse) => {
            if(error.status===406){
              this.messageService.add({
                severity: 'warn',
                summary: 'Error',
                detail: 'Duplicate Balance Sheet Values Not Allowed..!!',
              });
            }else{
            this.messageService.add({
              severity: 'Error',
              summary: 'Error',
              detail: 'Something went wrong while adding Balance Sheet Line Items..!!',
            });
          }
     
            this.ngOnInit();
          }
        );
        // this.removeRow(i);

    } 
  }


  
  onClickCancel() {
    this.addLineItem = true;
    this.lineItemsTable = true;
    this.topButtons = false;
    this.balanceSheetForm.reset();
    for (
      let i = 1;
      i < this.balanceSheetForm.value.balanceSheetRow.length;
      i++
    ) {
      this.removeRow(i=0);
    }
  }

  get balanceSheet(): FormArray {
    return this.balanceSheetForm.get('balanceSheetRow') as FormArray;
  }

  newRow(): FormGroup {
    return this.fb.group({
      lineItem: '',
      alternativeName: '',
      type: '',
    });
    
  }

  addRow() {
    this.balanceSheet.push(this.newRow());

  }

  removeRow(i: number) {
    this.balanceSheet.removeAt(i);
  }
}
