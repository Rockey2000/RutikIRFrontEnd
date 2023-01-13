import { Component, OnInit, ViewChild } from '@angular/core';
import { Location, NgIf } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectItemGroup } from 'primeng/api';
// import { SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';
import { dataSource } from '../dataSource';
import { IRServiceService } from 'src/app/ir-service.service';
import { Router } from '@angular/router';
import { DocUploadComponent } from '../doc-upload/doc-upload.component';
interface Analyst {
  accessAnalyst: string;
}

@Component({
  selector: 'app-new-doc-upload',
  templateUrl: './new-doc-upload.component.html',
  styleUrls: ['./new-doc-upload.component.css'],
})
export class NewDocUploadComponent implements OnInit {
  uploadedFiles: any[] = [];
  value!: Date;
  minDateValue!: Date;
  industry: any[];
  selectedIndustry: any;
  currentDate!: number;

  selectedFiles!: FileList;
  currentFile!: File;
  selectedDocument: any;
  documents: any[];
  analyst: Analyst[] = [];
  analystDropdown: boolean = true;
  users: any[] = [];
  public data!: object[];

  document!: FormGroup;
  getDataByFileId: any[] = [];
  getDataByTableId: any[] = [];
  selectTableValue: any;
  FormTableBox!: boolean;
  dataTableBox: boolean = false;
  dataValueTable: boolean = false;
  tableId!: string;
  cols!: any[];

  dataBox:boolean=false;
  constructor(
    private service: IRServiceService,
    private router: Router,
    private location: Location
  ) {
    this.industry = [
      {
        name: 'industry1',
        companies: [{ cname: 'hp' }, { cname: 'epson' }, { cname: 'dell' }],
      },
      {
        name: 'industry2',
        companies: [
          { cname: 'tech' },
          { cname: 'status' },
          { cname: 'branch' },
        ],
      },
      {
        name: 'industry3',
        companies: [{ cname: 'idea' }, { cname: 'voot' }, { cname: 'trello' }],
      },
    ];

    this.documents = [
      {
        name: 'Client Data',
        Doctype: [
          { dname: 'Balance Sheet' },
          { dname: 'Income Statment' },
          { dname: 'Cash Flow Statment' },
          { dname: 'Shareholder Data' },
          { dname: 'Meeting Data' },
        ],
      },
      {
        name: 'Peer Data',
        Doctype: [
          { dname: 'Balance Sheet' },
          { dname: 'Income Statment' },
          { dname: 'Cash Flow Statment' },
        ],
      },
      {
        name: 'Analyst Data',
        Doctype: [{ dname: 'Pre Earnings' }, { dname: 'Post Earnings' }],
      },
    ];

    this.analyst = [
      { accessAnalyst: 'Analyst Name' },
      { accessAnalyst: '1 Name' },
      { accessAnalyst: '2 Name' },
      { accessAnalyst: 'Analyst Name' },
      { accessAnalyst: 'Analyst Name' },
    ];


  }

  // @ViewChild('spreadsheet')
  // public spreadsheetObj!: SpreadsheetComponent;
  ngOnInit(): void {
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
        this.users = data;
      },
      (error: HttpErrorResponse) => {
        alert(error);
      }
    );

    this.document = new FormGroup({
      client: new FormControl('', [Validators.required]),
      documentType: new FormControl('', [Validators.required]),
      analystName: new FormControl('undefined', [Validators.required]),
      reportFrom: new FormControl('', [Validators.required]),
      reportTo: new FormControl('', [Validators.required]),
    });

    this.tableId = this.service.getTableId();
    this.getTablesByTableId(this.tableId);
    console.log(this.tableId, 'in new doc upload component');
  }

  onClickBack() {
   this.FormTableBox = true;
    // this.dataBox=false;
     this.tableId='';
    console.log(this.FormTableBox, 'inside onclickback');

    console.log('on click back');
  
    this.router.navigate(['/document/nav/dataInjestion/docUpload'])
  }
  selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }

  onClickUpload() {

   let docData = {
    clientName:this.document.value.client,
    documentType:this.document.value.documentType,
    analystName:this.document.value.analystName
   }

   this.service.DocValues=docData;
   

    console.log('file uploded',this.service.DocValues);
    console.log(this.document.value, 'Document Data....!!!');

    console.log(this.selectedFiles);
    // this.selectFile(FileList)= this.onClickUpload();
    // console.log(this.selectFile);

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      console.log(file, 'inside upload method');

      if (file) {
        this.currentFile = file;
        this.service
          .uploadDataInjestion(this.currentFile, this.document.value)
          .subscribe(
            (data: any) => {
              console.log('data is passing');
              // console.log(data, "doc uploaded");
              // console.log(data.fileId, "doc uploaded1");
              console.log(data.body.fileId, 'doc uploaded2');

              this.getTablesByTableId(data.body.fileId);
              this.FormTableBox = false;
              console.log(this.FormTableBox, 'inside onclick upload');

              // this.ngOnInit();
              // console.log(data, "doc uploaded");
            },
            (error: HttpErrorResponse) => {
              console.log(error, 'Rutik Data Getting');
              console.log('error');
            }
          );

        console.log(this.document.value, ' Document Data....!!!');
      }
    }
    // this.FormTableBox=false;
    // this.dataTableBox=true;
  }
  getTablesByTableId(tableId: string) {
    this.service.getDataByFileId(tableId).subscribe(
      (data: any) => {
        this.getDataByFileId = data;
        console.log('get data by file ID');
        this.FormTableBox = false;
        this.dataBox = true;
        console.log(this.getDataByFileId, 'data is avalible for fetch');
      }
      // (error: HttpErrorResponse) => {
      //   alert('something went wrong...');
      //   console.log(error);

      // }
    );
  }

  selectedTableValue(Id: any) {
    console.log(Id);
    this.dataValueTable = true;
    
    // this.columnData();
    this.router.navigate(['/document/nav/dataInjestion/tableData/' + Id]);
  }
  // columnData(){
  //   this.getDataByTableId.forEach((element:any) =>{
  //     this.tabKay = Object.keys(element);
  //     this.tabValue.push(Object.values(element));
  //   });
  // }
  analystName: boolean = false;
  onSelectDocument() {
    console.log(this.selectedDocument);

    if (
      this.document.value.documentType === 'Pre Earnings' ||
      this.document.value.documentType === 'Post Earnings'
    ) {
      this.analystName = true;
    } else {
      this.analystName = false;
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
}
