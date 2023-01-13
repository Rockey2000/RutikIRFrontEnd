import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import {  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators, } from '@angular/forms';
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
  selector: 'app-cash-flow',
  templateUrl: './cash-flow.component.html',
  styleUrls: ['./cash-flow.component.css'],
  providers: [ConfirmationService, MessageService],

})
export class CashFlowComponent implements OnInit {
  selectedTable!:string;
  docList: TypesOfDoc[] = [];
  lineItemTypes: LineItemType[] = [];
  selectedDoc!: string;
  selectedLineItemType!: string;
  topButtons: boolean = false;
  lineItemsTable: boolean = false;
  createLineItemTable = false;
  addLineItem: boolean = false;
  lineItem!: LineItem;
  lineItems: LineItem[] = [];

  cashFlowForm!: FormGroup;
  sample: boolean = true;
  addlineItemTable: boolean = false;

  lineItemPattern = '^[a-zA-Z ]{3,15}$';
  alternativeNamePattern = '^[a-zA-Z ]{3,15}$';
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
    this.cashFlowForm = this.fb.group({
      cashFlowRow: this.fb.array([this.newRow()]),
    });
  }

  ngOnInit(): void {
  

    this.addLineItem = true;
    this.lineItemsTable = true;
    this.topButtons = false;

    // this.sample = true;
    // console.log(this.selectedTable);

    this.service.getCashFlowTableStructure().subscribe(
      (data: any) => {
        console.log(data);
        this.lineItems = data;
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong...');
        console.log(error);
      }
    );

  }


 
  addLneItem() {
    this.addLineItem = false;
    this.topButtons = true;
    this.lineItemsTable = false;
    this.cashFlowForm.reset();

    for (
      let i = 1;
      i < this.cashFlowForm.value.cashFlowRow.length;
      i++
    ) {
      this.removeRow(i=0);
    }
  }

  selectedTableName!: string;

  onClickSaveAll() {
    console.log(this.cashFlowForm, 'ramram');
    for (
      let i = 0;
      i < this.cashFlowForm.value.cashFlowRow.length;
      i++
    ) {
      this.service
        . addCashFlowTableStructure(this.cashFlowForm.value.cashFlowRow[i])
        .subscribe(
          (data: any) => {
            console.log(data);
            this.cashFlowForm.reset();
            this.lineItemsTable = true;
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
                summary: 'Warning',
                detail: 'Duplicate Cash Flow Values Not Allowed..!!',
              });
            }else{
            this.messageService.add({
              severity: 'Error',
              summary: 'Error',
              detail: 'Something went wrong while adding Cash Flow Line Items ..!!',
            });
          }
            // alert(error);
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
    this.cashFlowForm.reset();

    for (
      let i = 1;
      i < this.cashFlowForm.value.cashFlowRow.length;
      i++
    ) {
      this.removeRow(i=0);
    }
  }


  get cashFlow(): FormArray {
    return this.cashFlowForm.get('cashFlowRow') as FormArray;
  }

  newRow(): FormGroup {
    return this.fb.group({
      lineItem: '',
      alternativeName: '',
      type: '',
    });
  }

  addRow() {
    this.cashFlow.push(this.newRow());
  }

  removeRow(i: number) {
    this.cashFlow.removeAt(i);
  }
}
