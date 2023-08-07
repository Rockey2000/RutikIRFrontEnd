import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
import { LoadingSpinnerService } from 'src/app/loading-spinner.service';
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

  cashFlowForm!: FormGroup;
  sample: boolean = true;
  addlineItemTable: boolean = false;

  lineItemPattern = '^[a-zA-Z ]{3,15}$';
  alternativeNamePattern = '^[a-zA-Z ]{3,15}$';

  uploadDialog: boolean = false;
  selectedFiles!: FileList;
  currentFile!: File;
  selectedTableName!: string;

  UpdateCashFlow: boolean = false;
  id: any;
  updateLineItem!: string;
  updateAlternativeName!: string;
  lineItemCard:boolean=false;
  existingLineItems:any[]=[];
  @ViewChild('fileInputRef') fileInputRef!: ElementRef<HTMLInputElement>;
  constructor(
    private lodSpinner: LoadingSpinnerService,
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
  isLoading: boolean = false;
  ngOnInit(): void {
    localStorage.setItem('tableName', 'Cash Flow');
    this.selectedTableName = JSON.stringify(localStorage.getItem('tableName'));
    console.log(this.selectedTableName, ' this.selectedTableName');
    this.lodSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });

    this.lodSpinner.isLoading.next(true);

    this.addLineItem = true;
    this.lineItemsTable = true;
    this.topButtons = false;

    // this.sample = true;
    // console.log(this.selectedTable);
    this.service.getCashFlowTableStructure().subscribe(
      (data: any) => {
        console.log(data);
        this.lineItems = data.map((item: any) => {
          if (typeof item.alternativeName === 'string') {
            item.alternativeName = item.alternativeName.replace(/\[|\]/g, '');
          }
          return item;
        });
        for(let i=0; i< this.lineItems.length;i++){
          this.lineItems.sort((a:any, b:any)=>{
            if(a.lineItem < b.lineItem) return -1;
            if(a.lineItem > b.lineItem) return 1;
            return 0;
          })
        }
        console.log(data, 'rutik balancesheet ');
        this.lodSpinner.isLoading.next(false);
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

    for (let i = 1; i < this.cashFlowForm.value.cashFlowRow.length; i++) {
      this.removeRow((i = 0));
    }
  }

  onClickSaveAll() {
    this.lodSpinner.isLoading.next(true);
    console.log(this.cashFlowForm, 'ramram');
    // for (let i = 0; i < this.cashFlowForm.value.cashFlowRow.length; i++) {
    this.service
      .addCashFlowTableStructureFullObject(this.cashFlowForm.value.cashFlowRow)
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
          this.lodSpinner.isLoading.next(false);
        },
        (error: HttpErrorResponse) => {
   
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `${error.error.developerMessage}`,
            });
       
          // alert(error);
          this.ngOnInit();
        }
      );
    // this.removeRow(i);
    // }
  }

  onClickCancel() {
    this.addLineItem = true;
    this.lineItemsTable = true;
    this.topButtons = false;
    this.cashFlowForm.reset();

    for (let i = 1; i < this.cashFlowForm.value.cashFlowRow.length; i++) {
      this.removeRow((i = 0));
    }
  }

  get cashFlow(): FormArray {
    return this.cashFlowForm.get('cashFlowRow') as FormArray;
  }

  newRow(): FormGroup {
    return this.fb.group({
      lineItem: '',
      alternativeName: '',
      // type: '',
    });
  }

  addRow() {
    this.cashFlow.push(this.newRow());
  }

  removeRow(i: number) {
    this.cashFlow.removeAt(i);
  }

  onClickUpload() {
    this.uploadDialog = true;
  }

  onClickDownloadCashFlow() {
    let AnalystDetails = 'Master Database';

    this.service.downloadLineItemSheet(AnalystDetails).subscribe(
      (x: any) => {
        var newBlob = new Blob([x], { type: 'application/vnd.ms-excel' });
        const data = window.URL.createObjectURL(newBlob);

        var link = document.createElement('a');
        link.href = data;
        link.download = 'CashFlow.xlsx';

        link.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Download Successful',
        });
        console.log('file Downloded');
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

  selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }
  hideDialog() {
    this.uploadDialog = false;
  }
  // uploadExcel() {
  //   this.lodSpinner.isLoading.next(true);
  //   console.log(this.selectedFiles, 'excel file uploaded');

  //   if (this.selectedFiles) {
  //     const file: File | null = this.selectedFiles.item(0);
  //     console.log(file, 'inside upload method');
  //     if (file) {
  //       this.currentFile = file;
  //       this.service.uploadCashFlowSheet(this.currentFile).subscribe(
  //         (data: any) => {
  //           console.log('data is passing');
  //           this.messageService.add({
  //             severity: 'success',
  //             summary: 'Successfull',
  //             detail: 'Data Uploaded Successfully.',

  //           });
  //           this.lodSpinner.isLoading.next(false);
  //           this.ngOnInit();
  //           this.uploadDialog=false;
  //         },
  //         (error: HttpErrorResponse) => {
  //           this.messageService.add({
  //             severity: 'Error',
  //             summary: 'Error',
  //             detail: 'Something went wrong while Uploading..!!',
  //           });
  //         }
  //       );
  //     }
  //   }
  // }
  uploadExcel() {
    this.lodSpinner.isLoading.next(true);
    console.log(this.selectedFiles, 'excel file uploaded');

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      console.log(file, 'inside upload method');
      if (file) {
        this.currentFile = file;
        this.service.uploadCashFlowSheet(this.currentFile).subscribe(
          (data: any) => {
            console.log('data is passing');
            if (data.status === 200) {
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Data Uploaded Successfully',
              });
              this.clearFileInput();
            }
            this.ngOnInit();
            this.handleUploadComplete();
          },
          (error: HttpErrorResponse) => {
            if(error.status===302){
              console.log(error.error
               ,"error of 302");
               this.existingLineItems=error.error;
               this.lineItemCard=true;
               this.messageService.add({
                 severity: 'warn',
                 summary: 'Warning',
                 detail: `Some Line Items Already Exist In System!!!`,
                 
               });
         }else if(error.error.errorCode===400){
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `${error.error.developerMessage}`,
            
          });
   
        this.ngOnInit();
        this.handleUploadComplete();
      }else{
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Something went wrong...!!`,
          
        });
 
      this.ngOnInit();
      this.handleUploadComplete();
    }
        }
          );
      }
    }
    else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: `Please select file first...!!`,
      });
      this.lodSpinner.isLoading.next(false);
    }
  }
  clearFileInput() {
    // Reset file input value
    if (this.fileInputRef && this.fileInputRef.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }
  }
  handleUploadComplete() {
    this.uploadDialog = false;
    this.lodSpinner.isLoading.next(false);
  }

  onClickBack() {
    this.lineItemsTable = true;
    this.UpdateCashFlow = false;
  }
  editLineItem(data: any) {
    this.lineItemsTable = false;
    this.UpdateCashFlow = true;
    console.log(data, 'data of cash flow');
    this.id = data.cashId;
    //     this.updateLineItem = data.lineItem;
    // this.updateAlternativeName = data.alternativeName;

    this.cashFlowForm.patchValue({
      cashFlowRow: [
        {
          lineItem: data.lineItem,
          alternativeName: data.alternativeName,
        },
      ],
    });
  }

  onClickUpdate() {
    const cashObj = {
      cashId: this.id,
      lineItem: this.cashFlowForm.value.cashFlowRow[0].lineItem,
      alternativeName: this.cashFlowForm.value.cashFlowRow[0].alternativeName,
    };
    console.log(cashObj, 'after click update ');
    console.log(this.id, 'cash id');

    this.service.updateCashFlow(cashObj).subscribe(
      (data: any) => {
        console.log(data);

        this.ngOnInit();
        this.messageService.add({
          severity: 'success',
          summary: 'success',
          detail: 'Cash Flow Line Items Updated..!!',
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

  cancelCard(){
    this.ngOnInit();
    this.handleUploadComplete();
  }
}
