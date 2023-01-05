import { NgIf } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SelectItemGroup } from 'primeng/api';
import { MessageService } from 'primeng/api/messageservice';
import { IRServiceService } from 'src/app/ir-service.service';
import { NewrowDirective } from '../../configuration/master-db/newrow.directive';
import { NewDocUploadComponent } from '../new-doc-upload/new-doc-upload.component';

interface Client {
  accessclient: string;
}
interface Analyst {
  accessAnalyst: string;
}

@Component({
  selector: 'app-doc-upload',
  templateUrl: './doc-upload.component.html',
  styleUrls: ['./doc-upload.component.css'],
})
export class DocUploadComponent implements OnInit {
  dataInjectionBox: boolean = false;
  value3!: string;
  selectedClient!: SelectItemGroup;
  uploadDataDialogBox: boolean = false;
  viewData: boolean = false;
  dataInjectionForm!: FormGroup;
  clientData: boolean = false;
  client: Client[] = [];
  uploadedFiles: any[] = [];
  value!: Date;
  minDateValue!: Date;
  industry!: any[];
  selectedIndustry: any;
  allClient!: any[];
  selectedFiles?: FileList;
  selectedDocument: any;
  documents!: any[];
  analyst: Analyst[] = [];

  analystDropdown: boolean = true;
  dataIngestionData: any[]=[];

  getDataByFileId:any[]=[];
  constructor(private router:Router,
    private service: IRServiceService) {
    this.client = [
      { accessclient: 'Epson' },
      { accessclient: 'Dell' },
      { accessclient: 'HP' },
      { accessclient: 'Lenovo' },
      { accessclient: 'Aser' },
      { accessclient: 'Toshiba' },
      { accessclient: 'Sony' },
      { accessclient: 'Apple' },
    ];

    this.analyst = [
      { accessAnalyst: 'Analyst Name' },
      { accessAnalyst: '1 Name' },
      { accessAnalyst: '2 Name' },
      { accessAnalyst: 'Analyst Name' },
      { accessAnalyst: 'Analyst Name' },
    ];
  }
  //   onUpload(event: { files: any; }) {
  //     for(let file of event.files) {
  //         this.uploadedFiles.push(file);
  //     }

  //     this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  // }

  ngOnInit(): void {
    
    this.service.getTableValueFromDataIngestion().subscribe(
      (data:any) =>{
        this.dataIngestionData=data;
        console.log(this.dataIngestionData,"data is ready for table")
      },
      (error: HttpErrorResponse) => {
        alert(error);
      }
    )


    this.industry = [
      {
        name: 'industry1',
        companies: [
          { cname: 'hp' },
         { cname: 'epson' }, 
         { cname: 'dell' }
        ],
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
        companies: [
          { cname: 'idea' },
           { cname: 'voot' },
            { cname: 'trello' }
          ],
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
        Doctype: [
          { dname: 'Pre Earnings'},
           { dname: 'Post Earnings'}
          ],
      },
    ];
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    // let prevMonth = month === 0 ? 11 : month - 1;
    // let prevYear = prevMonth === 11 ? year - 1 : year;
    // let nextMonth = month === 11 ? 0 : month + 1;
    // let nextYear = nextMonth === 0 ? year + 1 : year;
    this.dataInjectionBox = true;

    this.minDateValue = new Date();
    // this.minDateValue.setMonth(prevMonth);
    // this.minDateValue.setFullYear(prevYear);
  }
  uploadNewData() {
    console.log("button clicked")
    
    this.router.navigate(["/document/nav/dataInjestion/uploadDoc"])
    this.ngOnInit();
    
  }

  onClickBack() {
    this.dataInjectionBox = true;
    this.uploadDataDialogBox = false;
  }
  selectFile(event: any) {
    this.selectFile = event.target.files;
  }
  onClickUpload() {
    
    console.log(this.selectFile);
  }
  editTableValue(fileId:any){
    // this.router.navigate(["/document/nav/dataInjestion/uploadDoc"])

    console.log(fileId.id);


  this.service.getDataByFileId(fileId).subscribe(
    (data: any)=>{
    this.getDataByFileId=data;
      console.log("get data by file ID");
      
      console.log(this.getDataByFileId,"data is avalible for fetch") 
      this.service.setTableId(fileId) 
      this.router.navigate(["/document/nav/dataInjestion/uploadDoc"])
    },
  (error: HttpErrorResponse) => {
    alert('something went wrong...');
    console.log(error);
  }
  );
  }

  analystName:boolean=false;
  onSelectDocument(){
    console.log(this.selectedDocument);
    
    if(this.selectedDocument.dname==='Pre Earnings' || this.selectedDocument.dname==='Post Earnings')
    {
      this.analystName=true;
    }
    else{
      this.analystName=false;
    }
  }
}

