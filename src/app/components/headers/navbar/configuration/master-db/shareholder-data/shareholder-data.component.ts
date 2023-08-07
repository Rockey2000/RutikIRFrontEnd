import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
import { LineItem } from './model/tableStructure';
import { DatePipe } from '@angular/common';
import { LoadingSpinnerService } from 'src/app/loading-spinner.service';
interface TypesOfDoc {
  docName: string;
}
interface LineItemType {
  type: string;
}

// interface ClientID {
//   clientID: string;
// }
interface ShareHolder {
  name: string;
}
interface Minorcode {
  minorcode: string;
}

@Component({
  selector: 'app-shareholder-data',
  templateUrl: './shareholder-data.component.html',
  styleUrls: ['./shareholder-data.component.css'],
  providers: [ConfirmationService, MessageService, DatePipe],
})
export class ShareholderDataComponent implements OnInit {
  selectedTable!: string;
  topButtons: boolean = false;
  lineItemsTable: boolean = false;
  createLineItemTable = false;
  addLineItem: boolean = false;
  lineItem!: LineItem;
  lineItems: LineItem[] = [];

  lineItemForm!: FormGroup;
  @HostListener('document:keydown.enter', ['$event'])
  onEnterKey(event: KeyboardEvent): void {
    event.preventDefault();
  }
  // clientIds!: ClientID[];
  shareholdersContactArr:any=[];
  shareHolderDataArr:any=[];
  minorcodes!: Minorcode[];

  selectedClientId!: string;
  selectedMinoreCode!: string;
  selectedShareholderName!: string;
  selectedDate!: string;
  shareHolderCard:boolean=false;
  existingShareData:any[]=[];
  today!: Date;
  uploadDialog: boolean = false;
  portfolioIdPattern = '^[a-zA-Z0-9 ]{3,15}$';
  // folioPattern = '^[a-zA-Z0-9]*$';
  folioPattern = '^[a-zA-Z0-9 ]{3,15}$';
  holdingValuePattern = '^[0-9 ]{1,9}$';
  fundgroupPattern = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{}|\\:;"'<>,.?\/\s]+$/
  holdingCostPattern = '^[A-Za-z0-9]+(\.[0-9]{1,2})?$'
  selectedFiles!: FileList;
  currentFile!: File;
  // holdingPercentagePattern = "^(^100(\.0{1,9})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,9}){0,10}?$)";
  // holdingPercentagePattern =
  //   '^((100(.0{1,9})?)|([1-9]([0-9])?|0)(.[0-9]{1,9})?)%?$';
  holdingPercentagePattern ='^(\[0-9]{1,2})+(\.[0-9]{1,4})?$';
    @ViewChild('fileInputRef') fileInputRef!: ElementRef<HTMLInputElement>;
  constructor(
    private lodSpinner: LoadingSpinnerService,
    private service: IRServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private datePipe: DatePipe
  ) {
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
    console.log(this.today, 'today date');

    // this.clientIds = [
    //   { clientID: 'a123' },
    //   { clientID: 'a324' },
    //   { clientID: 'a432' },
    //   { clientID: 'a126' },
    //   { clientID: 'a653' },
    //   { clientID: 'a877' },
    // ];

    // this.shareholders = [
    //   { name: 'Akshay' },
    //   { name: 'Khirod' },
    //   { name: 'Rahul' },
    //   { name: 'Mahesh' },
    // ];
    this.minorcodes = [
      { minorcode: 'PRO' },
      { minorcode: 'AIF' },
      { minorcode: 'CBO' },
      { minorcode: 'CMM' },
      { minorcode: 'FIC' },
      { minorcode: 'HUF' },
      { minorcode: 'INS' },
      { minorcode: 'MF' },
      { minorcode: 'NB' },
      { minorcode: 'NRI' },
      { minorcode: 'NRN' },
      { minorcode: 'PL' },
    ];
  }
  isLoading: boolean = false;
  ngOnInit(): void {
    this.lodSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });

    this.lodSpinner.isLoading.next(true);
    this.selectedTable = JSON.parse(
      JSON.stringify(localStorage.getItem('tableName'))
    );

    this.lineItems = [];
    this.onClickCancle();

    console.log(this.selectedTable);

    this.service.getShareholderTableStructure().subscribe(
      (data: any) => {
        this.lineItems = data;
        this.lodSpinner.isLoading.next(false);
        console.log(this.lineItems, ' data...!!');
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong...');
        console.log(error);
      }
    );

    this.lineItemForm = new FormGroup({
      clientName: new FormControl('',[Validators.required]),
      portfolioId: new FormControl('', [
        Validators.required,
        Validators.pattern(this.portfolioIdPattern),
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
      folio: new FormControl('', [
        Validators.required,
        Validators.pattern(this.folioPattern),
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
      shareholderName: new FormControl(''),
      holdingValue: new FormControl('', [
        Validators.required,
        Validators.pattern(this.holdingValuePattern),
      ]),
      holdingPercentage: new FormControl('', [
        Validators.required,
        Validators.pattern(this.holdingPercentagePattern),this.holdingPercentageValidator
      ]),
      holdingCost: new FormControl('', [
        Validators.required,

      ]),
      fundGroup: new FormControl('', [
        Validators.required,
     
      ]),
      minorCode: new FormControl(''),
      // tableName: new FormControl(''),
      date: new FormControl(''),
    });

    // *********************************************************************************

    // ******************************ShareholderContactDetail****************

    this.service.getshareHolderContactTableData().subscribe(
      (data: any) => {
        // console.log(data);

        this.shareholdersContactArr = data

        for(let i=0; i<this.shareholdersContactArr.length; i++)
        {
          this.shareHolderDataArr.push({
            name:this.shareholdersContactArr[i].name,
          })
          console.log("shareHolderDataArr",this.shareHolderDataArr);
          
        }
      }
    );

    // ************************************************************************************
    // ********************************ClientDetails****************************************************

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

  holdingPercentageValidator(control: FormControl): { [key: string]: any } | null {
    const value = control.value;
    console.log(value,"compare value");
    
    if (value !== null && (isNaN(value) || value < 0 || value > 100)) {
      return { 'invalidPercentage': true };
    }
    return null;
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
// *******************************************************************************************
  addLneItem() {
    this.addLineItem = false;
    this.topButtons = true;
    this.lineItemsTable = false;
  }

  onClickSave() {
    // this.lineItemForm.value.tableName = this.selectedTable;
    // this.lineItemForm.value.date = this.selectedDate;
    this.lodSpinner.isLoading.next(true);
    console.log(this.lineItemForm.value, ' all data of shareholder');

    this.service.addShareholderData(this.lineItemForm.value).subscribe(
      (data: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: `Shareholder data added successfully`,
        });
        this.lodSpinner.isLoading.next(false);
        this.selectedDate = '';
        this.lineItemForm.reset();
        this.onClickCancle();
        this.ngOnInit();
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong while adding Shareholder data..!!',
        });
        this.onClickCancle();
        this.ngOnInit();
      }
    );
  }

  holderData() {
    this.service.masterTableName;
    console.log(this.service.masterTableName, 'master table name');

    let AnalystDetails = 'Shareholder Data';
    this.service.downloadLineItemSheet(AnalystDetails).subscribe(
      (x: any) => {
        var newBlob = new Blob([x], { type: 'application/vnd.ms-excel' });
        const data = window.URL.createObjectURL(newBlob);

        var link = document.createElement('a');
        link.href = data;
        link.download = 'shareholderData.xlsx';

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

  onClickCancle() {
    this.lineItemsTable = true;
    this.topButtons = false;
    this.addLineItem = true;
  }
  onClickBack() {
    this.lineItemsTable = true;
    this.topButtons = false;
    this.addLineItem = true;
    this.lineItemForm.reset();
  }

  onDateSelect(selectedDate: any) {
    const utcDate = new Date(
      this.datePipe.transform(selectedDate, 'yyyy-MM-dd') + 'T00:00:00Z'
    );
    const dateStringFormControl = this.lineItemForm.get('date');
    console.log(utcDate, 'converted date');
    dateStringFormControl?.setValue(utcDate);
    console.log(dateStringFormControl,"date string");
    
  }

  onClickUpload(){
    this.uploadDialog=true

  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }
  hideDialog(){
    this.uploadDialog = false;
  }
  handleUploadComplete() {
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
        this.service.uploadShareholderData(this.currentFile).subscribe(
          (data: any) => {
            console.log('data is passing');
            if (data.status === 200) {
              this.messageService.add({
                severity: 'success',
                summary: 'Successful' ,
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
               this.existingShareData=error.error;
               this.shareHolderCard=true;
               this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: `Some shareholder's data already exist in system`,
                
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


  cancelCard(){
    this.ngOnInit();
    this.handleUploadComplete();
  }
}

// validators values
// ,
//   ,
//     ,[Validators.required,
//  Validators.pattern(this.holdingValuePattern)]
//       , [Validators.required,
//         Validators.pattern(this.holdingPercentagePattern)],
//         , Validators.required
