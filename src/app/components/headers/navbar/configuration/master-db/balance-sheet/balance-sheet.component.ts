import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, Pipe, ViewChild, ElementRef } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TabMenu } from 'primeng/tabmenu';
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

  uploadDialog: boolean = false;
  selectedFiles!: FileList;
  currentFile!: File;
  selectedTableName: any;
  updateBalanceSheet: boolean = false;
  id: any;
  updateLineItem!: string;
  updateAlternativeName!: string;
  lineItemCard:boolean=false;
  existingLineItems: any[] = [];
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

    this.balanceSheetForm = this.fb.group({
      balanceSheetRow: this.fb.array([]),
    });
  }
  isLoading: boolean = false;
  ngOnInit(): void {
    localStorage.setItem('tableName', 'Balance Sheet');
    this.selectedTableName = JSON.stringify(localStorage.getItem('tableName'));
    console.log(this.selectedTableName, ' this.selectedTableName');

    this.lodSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });

    this.lodSpinner.isLoading.next(true);

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
    
          console.log(this.lineItems,"sorted line item of balance sheet");
          
        }
        this.lodSpinner.isLoading.next(false);
        console.log(data, 'rutik balancesheet ');
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong...');
        this.lodSpinner.isLoading.next(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `${error.error.developerMessage}`,
        });
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
      this.removeRow((i = 0));
    }
  }

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
    this.lodSpinner.isLoading.next(true);
    console.log(this.balanceSheetForm.value.balanceSheetRow, 'ramram');
    // for (
    //   let i = 0;
    //   i < this.balanceSheetForm.value.balanceSheetRow.length;
    //   i++
    // ) {
    this.service
      .addBalanceSheetTableFullObject(
        this.balanceSheetForm.value.balanceSheetRow
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          this.balanceSheetForm.reset();
          this.lineItemsTable = true;
          this.removeRow;
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
    this.balanceSheetForm.reset();
    for (
      let i = 1;
      i < this.balanceSheetForm.value.balanceSheetRow.length;
      i++
    ) {
      this.removeRow((i = 0));
    }
  }

  get balanceSheet(): FormArray {
    return this.balanceSheetForm.get('balanceSheetRow') as FormArray;
  }

  newRow(): FormGroup {
    return this.fb.group({
      lineItem: '',
      alternativeName: '',
      // type: 'String',
    });
  }

  addRow() {
    this.balanceSheet.push(this.newRow());
  }

  removeRow(i: number) {
    this.balanceSheet.removeAt(i);
  }

  onClickUpload() {
    this.uploadDialog = true;
  }

  onClickDownloadBalanceSheet() {
    this.service.masterTableName;
    let AnalystDetails = 'Master Database';
    this.service.downloadLineItemSheet(AnalystDetails).subscribe(
      (x: any) => {
        var newBlob = new Blob([x], { type: 'application/vnd.ms-excel' });
        const data = window.URL.createObjectURL(newBlob);

        var link = document.createElement('a');
        link.href = data;
        link.download = 'balanceSheet.xlsx';

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
          detail: 'Download Successfull',
        });
        console.log('file Downloded');
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong');
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
  //       this.service.uploadBalanceSheet(this.currentFile).subscribe(
  //         (data: any) => {
  //           console.log('data is passing');
  //          this.messageService.add({
  //             severity: 'success',
  //             summary: 'Successfull',
  //             detail: 'Data Uploaded Successfully',
  //           });
  //           this.ngOnInit();
  //           this.uploadDialog = false;
  //           this.lodSpinner.isLoading.next(true);
  //         },
  //         (error: HttpErrorResponse) => {
  //           this.messageService.add({
  //             severity: 'Error',
  //             summary: 'Error',
  //             detail: 'Something went wrong while uploading!!!!',
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
        this.service.uploadBalanceSheet(this.currentFile).subscribe(
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

  editLineItem(data: any) {
    for (
      let i = 1;
      i < this.balanceSheetForm.value.balanceSheetRow.length;
      i++
    ) {
      this.removeRow((i = 0));
    }

    this.lineItemsTable = false;
    this.updateBalanceSheet = true;
    this.id = data.balanceid;
    this.updateLineItem = data.lineItem;
    this.updateAlternativeName = data.alternativeName;

    this.balanceSheetForm.patchValue({
      balanceSheetRow: [
        {
          lineItem: this.updateLineItem,
          alternativeName: this.updateAlternativeName,
        },
      ],
    });
  }

  onClickUpdate() {
    const BalanceObj = {
      balanceid: this.id,
      lineItem: this.balanceSheetForm.value.balanceSheetRow[0].lineItem,
      alternativeName:
        this.balanceSheetForm.value.balanceSheetRow[0].alternativeName,
    };
    console.log(BalanceObj, 'after update click');
    console.log(this.id, 'balance id');

    this.service.updateBalanceSheet(BalanceObj).subscribe(
      (data: any) => {
        console.log(data);
        this.ngOnInit();
        this.messageService.add({
          severity: 'success',
          summary: 'success',
          detail: 'Balance Sheet Line Item Updated..!!',
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

  onClickBack() {
    this.lineItemsTable = true;
    this.updateBalanceSheet = false;
  }

  cancelCard(){
    this.ngOnInit();
    this.handleUploadComplete();
  }

  onClickCancelAll(){

  }
}
