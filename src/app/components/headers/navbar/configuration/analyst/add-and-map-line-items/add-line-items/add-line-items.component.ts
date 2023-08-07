import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
import { LoadingSpinnerService } from 'src/app/loading-spinner.service';

interface AnalystId {
  id: string;
}
interface masterTable {
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
  selectedValue!: masterTable;
  addLineItem: any[] = [];

  // analystLineItemForm:boolean=false;

  // analystLineItemNamePattern = "^[a-zA-Z ]{3,100}$";
  // analystTableHeaderNamePattern= "^[a-zA-Z0-9. /]{3,100}$";
  analystDetails: any;

  uploadDialog: boolean = false;
  selectedFiles!: FileList;
  currentFile!: File;
  lineItemCard:boolean=false;
  existingLineItems:any[]=[];
  constructor(
    private service: IRServiceService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private lodSpinner: LoadingSpinnerService
  ) {
    // this.analystIds = [
    //   { id: '1710' },
    //   { id: '1720' },
    //   { id: '1730' },
    //   { id: '1740' },
    //   { id: '1750' },
    //   { id: '1760' },
    // ];

    this.value = [
      { tableContent: 'Income Statement' },
      { tableContent: 'Balance Sheet' },
      { tableContent: 'Cash Flow' },
    ];

    this.analystLineItemForm = this.fb.group({
      analystLineItemRow: this.fb.array([this.newRow()]),
    });
  }
  tabmenus: boolean = true;
  isLoading: boolean = false;
  ngOnInit(): void {
    this.lodSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });

    this.lodSpinner.isLoading.next(true);

    this.service.dialogFormDataSubscriber$.subscribe((data: any) => {
      console.log(data, '!!');
      this.tabmenus = !this.tabmenus;
    });
    // this.analystLineItemForm = new FormGroup({
    //   analystName: new FormControl(''),
    //   masterTableSource: new FormControl(''),
    //   analystLineItemName: new FormControl('', [Validators.required,
    //   Validators.pattern(this.analystLineItemNamePattern)]),
    //   analystTableHeaderName: new FormControl('',[ Validators.required,
    //   Validators.pattern(this.analystTableHeaderNamePattern)]),
    // });

    this.service.getAnalystDetails().subscribe(
      (data: any) => {
        console.log(data);
        this.analystDetails = data;
        console.log(this.analystDetails, 'data is getting');
        this.lodSpinner.isLoading.next(false);
      },
      (error: HttpErrorResponse) => {
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
    // for (
    //   let i = 0;
    //   i < this.analystLineItemForm.value.analystLineItemRow.length;
    //   i++
    // ) {
      this.service
        .analystLineItemFullObject(this.analystLineItemForm.value.analystLineItemRow)
        .subscribe(
          (data: any) => {
            console.log(data, 'data is getting ');

            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Analyst Nomenclature added successfully',
            });

            this.ngOnInit();
            this.analystLineItemForm.reset();
            setTimeout(() => {
              this.router.navigate([
                '/document/nav/config/analyst/nomenclature',
              ]);
              this.service.emitDialogFormData('done');
            }, 1300);
          },
          (error: HttpErrorResponse) => {
          
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `${error.error.developerMessage}`,
              });
       
            // alert(error);
            //  this.onClickBack();
          }
        );
    // }
    this.ngOnInit();
  }

  onClickBack() {
    this.service.emitDialogFormData('done');
    this.router.navigate(['/document/nav/config/analyst/nomenclature']);

    this.analystLineItemForm.reset();

    for (
      let i = 1;
      i < this.analystLineItemForm.value.analystLineItemRow.length;
      i++
    ) {
      this.removeRow((i = 0));
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

  onClickUpload() {
    this.uploadDialog = true;
  }
  onClickDownloadAnalystLineItem() {
    this.service.analystTableName;
    let Details = this.service.analystTableName;
    console.log(Details, 'details');

    this.service.downloadLineItemSheet(Details).subscribe(
      (x: any) => {
        var newBlob = new Blob([x], { type: 'application/vnd.ms-excel' });
        const data = window.URL.createObjectURL(newBlob);

        var link = document.createElement('a');
        link.href = data;
        link.download = 'AnalystLineItem.xlsx';

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
    this.lodSpinner.isLoading.next(false);
  }
  // uploadExcel() {
  //   console.log(this.selectedFiles, 'excel file uploaded');

  //   if (this.selectedFiles) {
  //     const file: File | null = this.selectedFiles.item(0);
  //     console.log(file, 'inside upload method');
  //     if (file) {
  //       this.currentFile = file;
  //       this.service.uploadAnalystLineItem(this.currentFile).subscribe(
  //         (data: any) => {
  //           console.log('data is passing');
  //           this.messageService.add({
  //             severity: 'success',
  //             summary: 'Successfull',
  //             detail: 'Data Uploaded Successfully.',
  //           });
  //           this.router
  //             .navigate(['/document/nav/config/analyst/nomenclature'])
  //             .then(() => {});
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
        this.service.uploadAnalystLineItem(this.currentFile).subscribe(
          (data: any) => {
            console.log('data is passing');
              if(data.status==200){
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Data Uploaded Successfully',
              });
          
            setTimeout(() => {
              this.router.navigate([
                '/document/nav/config/analyst/nomenclature',
              ]);
              this.service.emitDialogFormData('done');
            }, 1400);
          }
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
                detail: `Some Line Items Already Exist In System`,
                
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
  }

  handleUploadComplete() {
    this.uploadDialog = false;
    this.lodSpinner.isLoading.next(false);
    setTimeout(() => {
      this.router.navigate(['/document/nav/config/analyst/nomenclature']);
      this.service.emitDialogFormData('done');

    }, 1300);
  }
  cancelCard(){
    this.ngOnInit();
    this.handleUploadComplete();
  }
}
