import { Component, OnInit, ViewChild } from '@angular/core';
import { Location, NgIf } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  RequiredValidator,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  ConfirmationService,
  MessageService,
  SelectItemGroup,
} from 'primeng/api';
import { DatePipe } from '@angular/common';
// import { SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';
import { dataSource } from '../dataSource';
import { IRServiceService } from 'src/app/ir-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DocUploadComponent } from '../doc-upload/doc-upload.component';
import { LoadingSpinnerService } from 'src/app/loading-spinner.service';
import { timeout } from 'rxjs';
import { click } from '@syncfusion/ej2-angular-spreadsheet';

interface Analyst {
  accessAnalyst: string;
}

interface Units {
  totalUnits: string;
}

interface Currency {
  totalCurrency: string;
}

interface Denomination {
  totalDenomination: string;
}

@Component({
  selector: 'app-new-doc-upload',
  templateUrl: './new-doc-upload.component.html',
  styleUrls: ['./new-doc-upload.component.css'],
  providers: [ConfirmationService, MessageService, DatePipe],
})
export class NewDocUploadComponent implements OnInit {
  uploadedFiles: any[] = [];
  value!: Date;
  minDateValue!: Date;
  industry: any[];
  selectedIndustry: any;
  currentDate!: number;
  fileId1: any;
  selectedFiles!: FileList;
  currentFile!: File;
  selectedDocument: any;
  documents: any[];
  analyst: Analyst[] = [];
  analystDropdown: boolean = true;
  users: any[] = [];
  public data!: object[];
  reportType: any[];
  document!: FormGroup;
  getDataByFileId: any[] = [];
  getDataByTableId: any[] = [];
  selectTableValue: any;
  FormTableBox!: boolean;
  dataTableBox: boolean = false;
  dataValueTable: boolean = false;
  overRideCard: boolean = false;
  tableId!: string;
  cols!: any[];
  spinner: boolean = false;
  dataBox: boolean = false;
  updatedTableName!: string;
  labelDialog: boolean = false;
  analystDetails: any[] = [];
  product: any;
  selectedTableData: any;

  units: Units[] = [];
  Currency: Currency[] = [];
  selectedUnit: any;
  selectedCurrency: any;
  selectedClient: any;
  currencyValue: Denomination[] = [];
  overrideId: any;
  existingFiles: any[] = [];
  constructor(
    private lodSpinner: LoadingSpinnerService,
    private service: IRServiceService,
    private router: Router,
    private location: Location,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.industry = [
      {
        name: '	Commerce',
        companies: [
          { cname: 'Trio' },
          { cname: 'Minda' },
          { cname: 'Flipkart' },
        ],
      },
      {
        name: 'Financial',
        companies: [
          { cname: 'TechSoft' },
          { cname: 'MindScript' },
          { cname: 'Roxiller' },
        ],
      },
      {
        name: 'IT',
        companies: [
          { cname: 'Idea' },
          { cname: 'Voot' },
          { cname: 'Trello' },
          { cname: 'Dell' },
        ],
      },
    ];

    this.documents = [
      {
        name: 'Client Data',
        Doctype: [
          { dname: 'Balance Sheet' },
          { dname: 'Income Statement' },
          { dname: 'Cash Flow Statement' },
          { dname: 'Shareholder Data' },
          { dname: 'Meeting Data' },
        ],
      },
      {
        name: 'Peer Data',
        Doctype: [
          { dname: 'Peer Balance Sheet' },
          { dname: 'Peer Income Statement' },
          { dname: 'Peer Cash Flow Statement' },
        ],
      },
      {
        name: 'Analyst Data',
        Doctype: [{ dname: 'Pre Earnings' }, { dname: 'Post Earnings' }],
      },
    ];

    this.reportType = [
      {
        name: 'Quarter',
        reportData: [
          { rType: 'Q1' },
          { rType: 'Q2' },
          { rType: 'Q3' },
          { rType: 'Q4' },
        ],
      },
      {
        name: 'Half Year',
        reportData: [{ rType: 'First Half' }, { rType: 'Second Half' }],
      },
      {
        name: 'Year',
        reportData: [{ rType: 'Annual' }],
      },
    ];

    this.Currency = [
      { totalCurrency: 'INR' },
      { totalCurrency: 'USD' },
      { totalCurrency: 'EUR' },
      { totalCurrency: 'JPY' },
      { totalCurrency: 'GBP' },
    ];

    this.units = [{ totalUnits: 'Indian' }, { totalUnits: 'International' }];

    this.currencyValue = [
      { totalDenomination: 'Thousand' },
      { totalDenomination: 'Lakhs' },
      { totalDenomination: 'Crore' },
      { totalDenomination: 'Million' },
      { totalDenomination: 'Billion' },
    ];
  }
  isLoading: boolean = false;
  // @ViewChild('spreadsheet')
  // public spreadsheetObj!: SpreadsheetComponent;
  ngOnInit(): void {
    this.lodSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });

    this.lodSpinner.isLoading.next(true);

    this.FormTableBox = true;
    console.log(this.FormTableBox, 'inside oninit');

    this.currentDate = Date.now();
    let today = new Date();
    // let month = today.getMonth();
    // let year = today.getFullYear();
    // let prevMonth = month === 0 ? 11 : month - 1;
    // let prevYear = prevMonth === 11 ? year - 1 : year;
    // let nextMonth = month === 11 ? 0 : month + 1;
    // let nextYear = nextMonth === 0 ? year + 1 : year;

    this.minDateValue = new Date();
    // this.minDateValue.setMonth(prevMonth);
    // this.minDateValue.setFullYear(prevYear);

    this.service.getuUser().subscribe(
      (data: any) => {
        console.log('users:', data);

        this.users = data;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );

    this.document = new FormGroup({
      client: new FormControl('', [Validators.required]),
      documentType: new FormControl('', [Validators.required]),
      peerName: new FormControl(''),
      analystName: new FormControl(''),
      units: new FormControl('', [Validators.required]),
      currency: new FormControl('', [Validators.required]),
      denomination: new FormControl('', [Validators.required]),
      reportType: new FormControl('', [Validators.required]),
      reportDate: new FormControl('', [Validators.required]),
    });

    console.log(this.route.snapshot.params['fileId'], 'router Id');

    // this.tableId = this.service.getTableId();
    if (this.route.snapshot.params['fileId']) {
      this.tableId = this.route.snapshot.params['fileId'];
      this.getTablesByTableId(this.tableId);
    }

    console.log(this.tableId, 'in new doc upload component');

    this.service.getAnalystDetails().subscribe(
      (data: any) => {
        console.log(data, 'get data');
        this.analystDetails = data;

        this.lodSpinner.isLoading.next(false);
        console.log(this.analystDetails, 'Analyst data');
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );

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

  allData: any[] = [];
  transformClientData(inputData: any) {
    this.allData = [];

    inputData.forEach((data: any) => {
      const industryExists = this.allData.find(
        (item) => item.name === data.industry
      );

      if (industryExists) {
        industryExists.states.push({
          name: data.clientName,
          id: data.clientId,
        });
      } else {
        this.allData.push({
          name: data.industry,
          states: [
            {
              name: data.clientName,
              id: data.clientId,
            },
          ],
        });
      }
    });

    // inputData.forEach((data: any) => {
    //   const industryExists = this.allData.find(
    //     (item) => item.name === data.industry
    //   );

    //   if (industryExists) {
    //     industryExists.states.push({
    //       name: data.clientName,
    //       id: data.clientId,
    //     });
    //   } else {
    //     this.allData.push({
    //       name: data.industry,
    //       states: [
    //         {
    //           name: data.clientName,
    //           id: data.clientId,
    //         },
    //       ],
    //     });
    //   }
    // });

    console.log('Parent-Child structure:', this.allData);
  }

  //   this.service.getClientDetails().subscribe(
  //     (data: any) => {
  //       console.log('All clients: ', data);

  //       this.transformClientData(data);
  //     },

  //     (error: HttpErrorResponse) => {
  //       alert(error);
  //     }
  //   );
  // }

  // allData: any[] = [];

  // transformClientData(inputData: any) {
  //   // const allData: any[] = [];

  //   inputData.forEach((data: any) => {
  //     const industryExists = this.allData.find(
  //       (item) => item.name === data.industry
  //     );

  //     if (industryExists) {
  //       industryExists.states.push({ name: data.clientName });
  //     } else {
  //       this.allData.push({
  //         name: data.industry,

  //         states: [{ name: data.clientName }],
  //       });
  //     }
  //   });

  //   console.log('Parent-Child structure:', this.allData);
  // }
  // **************************************************************

  onClickBack() {
    this.FormTableBox = true;
    this.dataBox = false;
    this.tableId = '';
    console.log(this.FormTableBox, 'inside onclickback');

    console.log('on click back');

    this.router.navigate([
      '/document/nav/dataInjestion/dataIngestionMenu/docUpload',
    ]);
    this.ngOnInit();
  }
  selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }

  // onClickUpload() {
  //   this.lodSpinner.isLoading.next(true);
  //   let docData = {
  //     clientName: this.document.value.client,
  //     documentType: this.document.value.documentType,
  //     analystName: this.document.value.analystName,
  //     peerName: this.document.value.peerName,
  //     currency: this.document.value.currency,
  //     units: this.document.value.units,
  //   };

  //   this.service.DocValues = docData;

  //   console.log('file uploded', this.service.DocValues);
  //   console.log(this.document.value, 'Document Data....!!!');

  //   console.log(this.selectedFiles);
  //   // this.selectFile(FileList)= this.onClickUpload();
  //   // console.log(this.selectFile);

  //   if (this.selectedFiles) {
  //     const file: File | null = this.selectedFiles.item(0);
  //     console.log(file, 'inside upload method');

  //     if (file) {
  //       this.currentFile = file;
  //       this.service
  //         .uploadDataInjestion(this.currentFile, this.document.value)
  //         .subscribe(
  //           (data: any) => {
  //             console.log(data, 'data is passing');
  //             console.log(data.body.fileId,'fileid...///');
  //             this.fileId1=data.body.fileId;
  //             // console.log(data.body,'data id ./././/.');
  //             this.overrideId = data.body;
  //             console.log(this.overrideId, 'id ...../././');

  //               // console.log(this.overRideCard,'flag');

  //               this.overRideCard = false;
  //               // console.log(this.overRideCard,'flag1');

  //               // console.log(data, "doc uploaded");
  //               // console.log(data.fileId, "doc uploaded1");
  //               console.log(data, 'doc uploaded2');

  //               console.log('check 1.1');
  //               this.fileId1 = data.body.fileId;

  //               this.getTablesByTableId(data.body.fileId);
  //               console.log(this.getDataByFileId, 'file id/./././//////');

  //               //  this.FormTableBox = false;
  //               if (
  //                 this.document.value.documentType === 'Shareholder Data' ||
  //                 this.document.value.documentType === 'Meeting Data'
  //               ) {
  //                 this.overRideCard = false;
  //                 this.FormTableBox = true;
  //                 this.dataBox = false;
  //                 this.messageService.add({
  //                   severity: 'success',
  //                   summary: 'Successfull',
  //                   detail: 'Data added successfully',
  //                 });
  //                 setTimeout(() => {
  //                   this.document.reset();
  //                   this.router.navigate([
  //                     '/document/nav/dataInjestion/docUpload',
  //                   ]);
  //                 }, 600);
  //               } else {
  //                 this.FormTableBox = true;
  //                 this.messageService.add({
  //                   severity: 'success',
  //                   summary: 'Successfull',
  //                   detail: 'Data added successfully',
  //                 });
  //                 setTimeout(() => {
  //                   this.router.navigate([
  //                     `/document/nav/dataInjestion/docUpload`,
  //                   ]);
  //                 }, 600);
  //               }
  //               console.log(this.FormTableBox, 'inside onclick upload');
  //               // this.messageService.add({
  //               //   severity: 'success',
  //               //   summary: 'Successfull',
  //               //   detail: 'Data addedd successfully',
  //               // });

  //               this.lodSpinner.isLoading.next(false);
  //               // this.ngOnInit();
  //               // console.log(data, "doc uploaded");

  //           },
  //           (error: HttpErrorResponse) => {
  //             console.log("error: ",error);
  //             this.fileId1 =error.error.fileId
  //             if(error.status === 302){
  //               this.overRideCard = true;

  //             }else{
  //               alert('something went wrong ')
  //             }
  //             console.log(error, 'Rutik Data Not Getting');
  //             // console.log('error');

  //             // this.messageService.add({
  //             //   severity: 'error',
  //             //   summary: 'Cancelled',
  //             //   detail: `${error.error.developerMessage}`,
  //             // });
  //             this.lodSpinner.isLoading.next(false);
  //           }
  //         );

  //       console.log(this.document.value, ' Document Data....!!!');
  //     }
  //   } else {
  //     this.messageService.add({
  //       severity: 'warn',
  //       summary: 'Warning',
  //       detail: `Please select file first...!!`,
  //     });
  //     this.lodSpinner.isLoading.next(false);
  //   }
  //   // this.FormTableBox=false;
  //   // this.dataTableBox=true;
  // }

  onClickUploadMultiple() {
    this.lodSpinner.isLoading.next(true);
    console.log(this.lodSpinner.isLoading.next, 'spinner');

    if (this.selectedFiles) {
      const fileData: FileList | null = this.selectedFiles;
      console.log(fileData, 'inside upload method');

      if (fileData) {
        this.lodSpinner.isLoading.next(true);

        const formdata: any = new FormData();
        formdata.append('client', this.document.value.client.name);
        formdata.append('clientId', this.document.value.client.id);

        for (let i = 0; i < fileData.length; i++) {
          formdata.append('data', fileData[i]);
        }

        this.service.uploadMultipleDataInjestion(formdata).subscribe(
          (data: any) => {
            if (data.type != 0) {
              console.log(data.body[0].npFileId, 'data is passing');

              if (data.body[0].npFileId != 0) {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Cancelled',
                  detail: `Existing Files Found!!!!`,
                });
                this.existingFiles = data.body;

                this.overRideCard = true;
              } else {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: 'Data Added Successfully',
                });
                console.log(this.document.value.client.name, 'client name');
                console.log(this.document.value.client.id, 'client id');
                setTimeout(() => {
                  this.router.navigate([
                    '/document/nav/dataInjestion/setFilesData/' +
                      this.document.value.client.name,
                    this.document.value.client.id,
                  ]);
                }, 800);

                this.lodSpinner.isLoading.next(false);
              }
            }
          },
          (error: HttpErrorResponse) => {
            console.log('error: ', error);
            this.overRideCard = true;
            console.log(error, 'Rutik Data Not Getting');
            console.log('error');

            // this.messageService.add({
            //   severity: 'error',
            //   summary: 'Cancelled',
            //   detail: `${error.error.developerMessage}`,
            // });
            this.lodSpinner.isLoading.next(false);
          }
        );

        console.log(this.document.value, 'Document Data....!!!');
      }
    }
  }
  // onClickOverRide() {
  //   let docData = {
  //     clientName: this.document.value.client,
  //     documentType: this.document.value.documentType,
  //     analystName: this.document.value.analystName,
  //     peerName: this.document.value.peerName,
  //     currency: this.document.value.currency,
  //     units: this.document.value.units,
  //   };
  //   this.service.DocValues = docData;

  //   if (this.selectedFiles) {
  //     const file: File | null = this.selectedFiles.item(0);
  //     console.log(file, 'inside upload method');
  //     if (file) {
  //       this.currentFile = file;
  //       this.service
  //         .overrideMethod(this.fileId1, this.currentFile, this.document.value)
  //         .subscribe((data: any) => {
  //           console.log(data, 'after override data');
  //           let fileId = data.body.fileId;
  //           // this.getTablesByTableId(data.body.fileId);
  //           if (
  //             this.document.value.documentType === 'Shareholder Data' ||
  //             this.document.value.documentType === 'Meeting Data'
  //           ) {
  //             this.overRideCard = false;
  //             this.FormTableBox = true;
  //             this.dataBox = false;
  //             this.messageService.add({
  //               severity: 'success',
  //               summary: 'Successfull',
  //               detail: 'Data added successfully',
  //             });
  //             setTimeout(() => {
  //               this.document.reset();
  //               this.router.navigate(['/document/nav/dataInjestion/docUpload']);
  //             }, 600);
  //           } else {
  //             this.FormTableBox = true;
  //             this.messageService.add({
  //               severity: 'success',
  //               summary: 'Successfull',
  //               detail: 'File Override successfully',
  //             });
  //             setTimeout(() => {
  //               this.router.navigate([`/document/nav/dataInjestion/docUpload`]);
  //             }, 600);
  //           }
  //         });
  //     }
  //   }
  //   this.overRideCard = false;
  // }
  onClickOverRide(data: any, i: any) {
    console.log(data, 'data for override');
    this.service.overRideFiles(data).subscribe(
      (data: any) => {
        console.log(data, 'in single override');
        this.existingFiles.splice(i, 1);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'File Overrided Successfully..!!',
        });
        if (this.existingFiles.length === 0) {
          this.ngOnInit();
          this.overRideCard = false;
          this.lodSpinner.isLoading.next(false);
        }
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
  onClickOverRideAll(data: any) {
    console.log(data, 'for override all');
    this.service.overRideAllFiles(data).subscribe(
      (data: any) => {
        console.log(data, 'in single override');

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'All Files Overrided Successfully..!!',
        });
        setTimeout(() => {
          this.router.navigate([
            '/document/nav/dataInjestion/setFilesData/' +
              this.document.value.client.name,
            this.document.value.client.id,
          ]);
        }, 500);
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
  getTablesByTableId(tableId: string) {
    console.log('check 1.1');
    console.log(tableId, 'tableid');

    this.service.getDataByFileId(tableId).subscribe(
      (data: any) => {
        this.getDataByFileId = data;
        console.log('get data by file ID');
        if (
          this.document.value.documentType === 'Shareholder Data' ||
          this.document.value.documentType === 'Meeting Data'
        ) {
          this.FormTableBox = true;
          this.dataBox = false;
          this.document.reset();

          setTimeout(() => {
            this.router.navigate(['/document/nav/dataInjestion/docUpload']);
          }, 600);
        } else {
          this.FormTableBox = false;
          this.dataBox = true;
        }

        // this.dataBox = true;
        console.log(
          this.getDataByFileId,
          '*********data is avalible for fetch'
        );
      }
      // (error: HttpErrorResponse) => {
      //   alert('something went wrong...');
      //   console.log(error);

      // }
    );
  }

  selectedTableValue(tableData: any) {
    console.log(tableData, 'table data');
    this.dataValueTable = true;
    this.service.tableData = tableData;

    // this.columnData();
    console.log(tableData.tableId + 'tableData.tableId    =====>');

    this.router.navigate([
      '/document/nav/dataInjestion/tableData/' + tableData.tableId,
    ]);
  }
  // columnData(){
  //   this.getDataByTableId.forEach((element:any) =>{
  //     this.tabKay = Object.keys(element);
  //     this.tabValue.push(Object.values(element));
  //   });
  // }
  peerName: boolean = false;
  analystName: boolean = false;
  validationMessage = '';
  onSelectDocument() {
    if (
      this.document.value.documentType === 'Peer Balance Sheet' ||
      this.document.value.documentType === 'Peer Income Statement' ||
      this.document.value.documentType === 'Peer Cash Flow Statement'
    ) {
      this.peerName = true;
      this.document.controls['peerName'].setValidators([Validators.required]);
    } else {
      this.peerName = false;
      this.document.controls['peerName'].setValidators(null);
    }
    if (
      this.document.value.documentType === 'Pre Earnings' ||
      this.document.value.documentType === 'Post Earnings'
    ) {
      this.analystName = true;
      this.document.controls['analystName'].setValidators([
        Validators.required,
      ]);
    } else {
      this.analystName = false;
      this.document.controls['analystName'].setValidators(null);
    }
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (
      this.document.value.documentType === 'Shareholder Data' ||
      this.document.value.documentType === 'Meeting Data'
    ) {
      fileInput.setAttribute('accept', '.xlsx, .xls');
    } else {
      fileInput.setAttribute('accept', '.pdf');
    }
  }

  // onClickUpdate() {
  //   console.log(this.getDataByTableId, 'after table updation data');
  //   this.service.updateValuesFromDataIngestion(this.getDataByTableId).subscribe(
  //     (data: any) => {
  //       console.log('Table Values edited successfully');
  //       console.log('Table Values Updated' + data);
  //       console.log(data);
  //     },
  //     (error: HttpErrorResponse) => {
  //       alert(error);
  //       console.log('something went wrong');
  //     }
  //   );
  // }

  editTableName(TableName: any) {
    console.log(TableName, 'table data');
    this.updatedTableName = TableName.tableName;
    this.selectedTableData = TableName;

    this.labelDialog = true;
  }
  hideDialog() {
    this.labelDialog = false;
  }
  saveDialog(id: any) {
    this.selectedTableData.tableName = this.updatedTableName;

    this.service.editTableName(this.selectedTableData).subscribe(
      (data: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Table name updated successfully..!!',
        });
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `${error.error.developerMessage}`,
        });
      }
    );
    this.labelDialog = false;
  }
  deleteTable(id: any) {
    this.lodSpinner.isLoading.next(true);
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this table',
      accept: () => {
        this.service.deleteTableValue(id).subscribe(
          (data: any) => {
            console.log('table deleted successfully');
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Table deleted successfully',
            });
            this.ngOnInit();
            this.lodSpinner.isLoading.next(false);
          },
          (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `${error.error.developerMessage}`,
            });
          }
        );
        this.ngOnInit();
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'Table not deleted',
        });
      },
    });
  }
  filteredCurrencies = [...this.Currency];
  filterCurrencies() {
    if (this.selectedUnit === 'Indian') {
      this.filteredCurrencies = this.Currency.filter(
        (currency) => currency.totalCurrency === 'INR'
      );
      this.selectedCurrency = 'INR'; // Set the selected currency to INR
    } else {
      this.filteredCurrencies = this.Currency.filter(
        (currency) => currency.totalCurrency !== 'INR'
      );
      // Exclude currencies with totalCurrency = 'INR'
      this.selectedCurrency = ''; // Reset the selected currency
    }
  }

  onClickCancel() {
    this.overRideCard = false;
    this.ngOnInit();
  }
  cancelCard(){
    
    this.overRideCard = false;
    this.existingFiles = [];
    this.lodSpinner.isLoading.next(false);

  }

  ClickCancel(i: any) {
    console.log(i);
    console.log(this.existingFiles.length, 'length');

    this.existingFiles.splice(i, 1);

    if (this.existingFiles.length === 0) {
      this.ngOnInit();
      this.overRideCard = false;
      this.lodSpinner.isLoading.next(false);
    }
  }

  onClickCancelAll() {
    this.existingFiles = [];
    this.overRideCard = false;
    this.ngOnInit();
    this.lodSpinner.isLoading.next(false);
  }

  // onSelectedClient(event: any) {
  //   const selectedClient = event.value.client.id; // The selected object
  //   console.log(selectedClient); // Display the whole object in the console or perform any desired actions
  // }
  onSelectedClient(event: any) {
    const selectedClient = this.document.value.client.id; // The selected object
    console.log('selectedClient', selectedClient); // Display the whole object in the console or perform any desired actions
  }
}
