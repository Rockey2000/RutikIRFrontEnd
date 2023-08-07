import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
import { LoadingSpinnerService } from 'src/app/loading-spinner.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
interface AnalystId {
  id: string;
}
interface masterTable {
  tableContent: string;
}
interface Client {
  totalClient: string;
}

@Component({
  selector: 'app-add-client-line-item',
  templateUrl: './add-client-line-item.component.html',
  styleUrls: ['./add-client-line-item.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class AddClientLineItemComponent implements OnInit {
  clientLineItemForm!: FormGroup;
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

  client: Client[] = [];
  lineItemCard:boolean=false;
  existingLineItems:any[]=[];
  constructor(
    private service: IRServiceService,
    private irSrvice: IRServiceService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private lodSpinner: LoadingSpinnerService
  ) {
    this.value = [
      { tableContent: 'Income Statement' },
      { tableContent: 'Balance Sheet' },
      { tableContent: 'Cash Flow' },
    ];

    this.clientLineItemForm = this.fb.group({
      clientLineItemRow: this.fb.array([this.newRow()]),
    });

    this.client = [
      { totalClient: 'Trio' },
      { totalClient: 'Minda' },
      { totalClient: 'Flipkart' },
      { totalClient: 'TechSoft' },
      { totalClient: 'MindScript' },
      { totalClient: 'Dell' },
      { totalClient: 'Roxiller' },
      { totalClient: 'Idea' },
      { totalClient: 'Voot' },
      { totalClient: 'Trello' },
    ];
  }

  tabmenus: boolean = true;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.lodSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });

    this.lodSpinner.isLoading.next(false);

    this.service.dialogFormDataSubscriber$.subscribe((data: any) => {
      console.log(data, '!!');
      this.tabmenus = !this.tabmenus;
    });

    // **********************************************\

    this.service.getClientDetails().subscribe(
      (data: any) => {
        console.log('All clients: ', data);
        this.transformClientData(data);
      },
      (error: HttpErrorResponse) => {
        alert(error);
      }
    );

    // ***************************************************
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

  selectedTableName!: string;
  onClickSaveAll() {
    console.log(this.clientLineItemForm, 'ramram');
    // for (
    //   let i = 0;
    //   i < this.clientLineItemForm.value.clientLineItemRow.length;
    //   i++
    // ) {
    this.service
      .ClientLineItemFullObject(this.clientLineItemForm.value.clientLineItemRow)
      .subscribe(
        (data: any) => {
          console.log(data, 'data is getting ');

          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Client Nomenclature added successfully',
          });

          this.ngOnInit();
          this.clientLineItemForm.reset();
          setTimeout(() => {
            this.router.navigate(['/document/nav/config/client']);
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

    this.clientLineItemForm.reset();

    for (
      let i = 1;
      i < this.clientLineItemForm.value.clientLineItemRow.length;
      i++
    ) {
      this.removeRow((i = 0));
    }
  }
  get analystLineItem(): FormArray {
    return this.clientLineItemForm.get('clientLineItemRow') as FormArray;
  }

  newRow(): FormGroup {
    return this.fb.group({
      clientName: '',
      masterTableSource: '',
      clientLineItemName: '',
      clientTableHeaderName: '',
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
    let Details = 'Client Line Item Nomenclature';
    console.log(Details, 'details');

    this.service.downloadLineItemSheet(Details).subscribe(
      (x: any) => {
        var newBlob = new Blob([x], { type: 'application/vnd.ms-excel' });
        const data = window.URL.createObjectURL(newBlob);

        var link = document.createElement('a');
        link.href = data;
        link.download = 'ClientLineItem.xlsx';

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
  uploadExcel() {
    this.lodSpinner.isLoading.next(true);
    console.log(this.selectedFiles, 'excel file uploaded');

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      console.log(file, 'inside upload method');
      if (file) {
        this.currentFile = file;
        this.service.uploadClientLineItem(this.currentFile).subscribe(
          (data: any) => {
            console.log('data is passing');
            if (data.status == 200) {
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Data Uploaded Successfully',
              });
              setTimeout(() => {
                this.router.navigate(['/document/nav/config/client']);
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
         }
          else if(error.error.errorCode===400){
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `${error.error.developerMessage}`,
              
            });
     
            this.uploadDialog = false;
            this.lodSpinner.isLoading.next(false);
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
      this.router.navigate(['/document/nav/config/client']);
      this.ngOnInit();
    }, 1300);
  }
  cancelCard(){
    this.uploadDialog = false;
    this.lodSpinner.isLoading.next(false);
    setTimeout(() => {
      this.router.navigate(['/document/nav/config/client']);
      this.service.emitDialogFormData('done');
    }, 1400);
  }
}
