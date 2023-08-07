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
  spinner: boolean = false;
  incomeStatementForm!: FormGroup;
  sample: boolean = true;
  addlineItemTable: boolean = false;

  lineItemPattern = '^[a-zA-Z ]{3,50}$';
  alternativeNamePattern = '^[a-zA-Z ]{3,15}$';
  formBuilder: any;
  selectedTableName!: string;
  uploadDialog: boolean = false;
  selectedFiles!: FileList;
  currentFile!: File;

  updateIncomeStatement: boolean = false;
  updateLineItem!: string;
  updateAlternativeName!: string;
  id: any;
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
    this.incomeStatementForm = this.fb.group({
      incomeStatementRow: this.fb.array([]),
    });
  }
  isLoading: boolean = false;
  ngOnInit(): void {
    localStorage.setItem('tableName', 'Income Statement');
    this.selectedTableName = JSON.stringify(localStorage.getItem('tableName'));
    console.log(this.selectedTableName, ' this.selectedTableName');

    this.lodSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });

    this.lodSpinner.isLoading.next(true);
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
          console.log(this.lineItems,"income lineitem sorted");
          
        }
        console.log(data, 'rutik balancesheet ');
        this.lodSpinner.isLoading.next(false);
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
    this.incomeStatementForm.reset();
    for (
      let i = 1;
      i < this.incomeStatementForm.value.incomeStatementRow.length;
      i++
    ) {
      this.removeRow((i = 0));
    }
  }

  onClickSaveAll() {
    this.lodSpinner.isLoading.next(true);
    console.log(this.incomeStatementForm, 'ramram');
    // for (
    //   let i = 0;
    //   i < this.incomeStatementForm.value.incomeStatementRow.length;
    //   i++
    // ) {
    this.service
      .addIncomeStatementTableFullObject(
        this.incomeStatementForm.value.incomeStatementRow
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          this.incomeStatementForm.reset();
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
    this.incomeStatementForm.reset();
    for (
      let i = 1;
      i < this.incomeStatementForm.value.incomeStatementRow.length;
      i++
    ) {
      this.removeRow((i = 0));
    }
  }

  get incomeStatement(): FormArray {
    return this.incomeStatementForm.get('incomeStatementRow') as FormArray;
  }

  newRow(): FormGroup {
    return this.fb.group({
      lineItem: '',
      alternativeName: '',
      // type: '',
    });
  }
  addRow() {
    this.incomeStatement.push(this.newRow());
  }

  removeRow(i: number) {
    this.incomeStatement.removeAt(i);
  }

  onClickUpload() {
    this.uploadDialog = true;
  }
  onClickDownloadIncomeStatement() {
    let AnalystDetails = 'Master Database';

    this.service.downloadLineItemSheet(AnalystDetails).subscribe(
      (x: any) => {
        var newBlob = new Blob([x], { type: 'application/vnd.ms-excel' });
        const data = window.URL.createObjectURL(newBlob);

        var link = document.createElement('a');
        link.href = data;
        link.download = 'IncomeStatement.xlsx';

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
        alert('something went wrong');
      }
    );
  }
  selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }
  hideDialog() {
    this.uploadDialog = false;

  }
  // uploadExcel(){
  //   console.log(this.selectedFiles, 'excel file uploaded');
  //   this.lodSpinner.isLoading.next(true);
  //   if (this.selectedFiles) {
  //     const file: File | null = this.selectedFiles.item(0);
  //     console.log(file, 'inside upload method');
  //     if (file) {
  //       this.currentFile = file;
  //       this.service
  //         .uploadIncomeStatementSheet(
  //           this.currentFile
  //           )
  //         .subscribe(
  //           (data: any) => {
  //             console.log('data is passing');
  //             this.messageService.add({
  //               severity: 'success',
  //               summary: 'Successfull',
  //               detail: 'Data Uploaded Successfully.',

  //             });
  //             this.lodSpinner.isLoading.next(false);
  //             this.ngOnInit();
  //             this.uploadDialog=false;
  //           },
  //           (error: HttpErrorResponse) => {
  //             this.messageService.add({
  //               severity: 'Error',
  //               summary: 'Error',
  //               detail: 'Something went wrong while Uploading..!!',
  //             });
  //           }
  //         );
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
        this.service.uploadIncomeStatementSheet(this.currentFile).subscribe(
          (data: any) => {
            console.log('data is passing');
            if (data.status === 200) {
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Data Uploaded Successfully',
              });
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
      i < this.incomeStatementForm.value.incomeStatementRow.length;
      i++
    ) {
      this.removeRow((i = 0));
    }
    console.log(data, 'product data');
    this.incomeStatementForm.reset();
    this.updateIncomeStatement = true;
    this.lineItemsTable = false;
    this.id = data.incomeid;
    // this.updateLineItem = data.lineItem;
    // this.updateAlternativeName = data.alternativeName;

    this.incomeStatementForm.patchValue({
      incomeStatementRow: [
        {
          lineItem: data.lineItem,
          alternativeName: data.alternativeName,
        },
      ],
    });
  }
  onClickBack() {
    this.updateIncomeStatement = false;
    this.lineItemsTable = true;
  }

  onClickUpdate() {
    const incomeObj = {
      incomeid: this.id,
      lineItem: this.incomeStatementForm.value.incomeStatementRow[0].lineItem,
      alternativeName:
        this.incomeStatementForm.value.incomeStatementRow[0].alternativeName,
    };
    console.log(incomeObj, 'after update button');
    console.log(this.id, 'income id');

    this.service.updateIncomeStatement(incomeObj).subscribe(
      (data: any) => {
        console.log(data);

        this.incomeStatementForm.reset();
        this.messageService.add({
          severity: 'success',
          summary: 'success',
          detail: 'Income Statement Line Item Updated..!!',
        });
      
        this.ngOnInit();
        this.onClickBack();
      },
      (error: HttpErrorResponse) => {

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `${error.error.developerMessage}`,
          });
   
        // alert(error);
        // this.ngOnInit();
        // this.onClickBack();
      }
    );
  }
  cancelCard(){
    this.ngOnInit();
    this.handleUploadComplete();
  }
}
