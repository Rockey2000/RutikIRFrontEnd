import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormArray,
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
  selector: 'app-income-statement',
  templateUrl: './income-statement.component.html',
  styleUrls: ['./income-statement.component.css'],
  providers: [ConfirmationService, MessageService],

})
export class IncomeStatementComponent implements OnInit {
  selectedTable!: string;

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

  incomeStatementForm!: FormGroup;
  sample: boolean = true;
  addlineItemTable: boolean = false;
 
  lineItemPattern = '^[a-zA-Z ]{3,50}$';
  alternativeNamePattern = '^[a-zA-Z ]{3,15}$';
  formBuilder: any;

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
    this.incomeStatementForm = this.fb.group({
      incomeStatementRow: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    // this.incomeStatementForm = new FormGroup({
    //   lineItem: new FormControl(''),
    //   alternativeName: new FormControl(''),
    //   type: new FormControl(''),
    //  });



 

    this.addLineItem = true;
    this.lineItemsTable = true;
    this.topButtons = false;

    // this.sample = true;
    // console.log(this.selectedTable);

    this.service.getIncomeStatementTableStructures().subscribe(
      (data: any) => {
        console.log(data);
        this.lineItems = data;
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong...');
        console.log(error);
      }
    );
    this.incomeStatement.push(this.newRow());
  }

  addLneItem() {
    this.addLineItem = false;
    this.topButtons = true;
    this.lineItemsTable = false;
    
  }
  selectedTableName!: string;
  onClickSaveAll() {
    console.log(this.incomeStatementForm, 'ramram');
    for (
      let i = 0;
      i < this.incomeStatementForm.value.incomeStatementRow.length;
      i++
    ) {
      this.service
        . addIncomeStatementTable(this.incomeStatementForm.value.incomeStatementRow[i])
        .subscribe(
          (data: any) => {
            console.log(data);
            this.incomeStatementForm.reset();
            this.lineItemsTable = true;
            this.removeRow(i);
            this.ngOnInit();
          },
          (error: HttpErrorResponse) => {
            if(error.status===406){
              this.messageService.add({
                severity: 'warn',
                summary: 'Error',
                detail: 'Duplicate Income Statement Values Not Allowed..!!',
              });
            }else{
            this.messageService.add({
              severity: 'Error',
              summary: 'Error',
              detail: 'Something went wrong while adding Income Statement Line Items..!!',
            });
          }
            // alert(error);
            this.ngOnInit();
          }
        );
        this.removeRow(i=0);

    } 
  }
  onClickCancel() {
    this.addLineItem = true;
    this.lineItemsTable = true;
    this.topButtons = false;
    this.incomeStatementForm.reset();
    for (
      let i = 1;
      i < this.incomeStatementForm.value.incomeStatementRow.length;
      i++
    ) {
      this.removeRow(i=0);
      }
  }


  get incomeStatement(): FormArray {
    return this.incomeStatementForm.get('incomeStatementRow') as FormArray;
  }

  newRow(): FormGroup {
    return this.fb.group({
      
      lineItem: '',
      alternativeName: '',
      type: '',
    });
    
  }
  addRow() {
   this.incomeStatement.push(this.newRow());
    
  }
 
  
  removeRow(i: number) {
    this.incomeStatement.removeAt(i);
  }
  
 
}
