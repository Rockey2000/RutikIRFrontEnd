import { NgIf } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ConfirmationService, MenuItem, SelectItemGroup } from 'primeng/api';
import { MessageService } from 'primeng/api/messageservice';
import { IRServiceService } from 'src/app/ir-service.service';
import { LoadingSpinnerService } from 'src/app/loading-spinner.service';
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

  allClient!: any[];
  actionDailogBox: boolean = false;
  dataIngestionData: any[] = [];
  uploadNewDataDialog: boolean = false;

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
  analyst1: Analyst[] = [];
  analyst: Analyst[] = [];
  analystDropdown: boolean = true;
  users: any[] = [];
  public data!: object[];
  actionForm!: FormGroup;
  document!: FormGroup;
  getDataByFileId: any[] = [];
  getDataByTableId: any[] = [];
  selectTableValue: any;
  FormTableBox!: boolean;
  dataTableBox: boolean = false;
  dataValueTable: boolean = false;
  tableId!: string;
  cols!: any[];
  spinner: boolean = false;
  dataBox: boolean = false;
  updatedTableName!: string;
  labelDialog: boolean = false;
  analystName: boolean = false;
  product: any;
  selectedTableData: any;
  selectedType!: string;
  selectedType1!: string;

  fileid1: any;
  dropdownOptions: { label: string; value: string }[] = [];
  items!: MenuItem[];
  activeItem!: MenuItem;
  status: boolean = false;
  constructor(
    private lodSpinner: LoadingSpinnerService,
    private router: Router,
    private service: IRServiceService
  ) {
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

    this.analyst1 = [
      { accessAnalyst: 'ICICI Direct' },
      { accessAnalyst: 'Emkay' },
      { accessAnalyst: 'Spark' },
      { accessAnalyst: 'Axis Capital' },
      { accessAnalyst: 'HSBC' },
    ];

    // dialog box Data
    this.industry = [
      {
        name: 'industry1',
        companies: [{ cname: 'Trio' }, { cname: 'Minda' }, { cname: 'Dell' }],
      },
      {
        name: 'industry2',
        companies: [
          { cname: 'TechSoft' },
          { cname: 'MindScript' },
          { cname: 'Roxiller' },
        ],
      },
      {
        name: 'industry3',
        companies: [{ cname: 'Idea' }, { cname: 'Voot' }, { cname: 'Trello' }],
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

    // this.analyst = [
    //   { Analyst: 'ICICI Direct' },
    //   { Analyst: 'Emkay' },
    //   { Analyst: 'Spark' },
    //   { Analyst: 'Axis Capital' },
    //   { Analyst: 'HSBC' },
    // ];
  }
  isLoading: boolean = false;
  DataForDropdown: any[] = [];
  DataForDropdown1: any[] = [];

  ngOnInit(): void {
    this.items = [{ label: 'Analysis' }, { label: 'Scheduler' }];

    this.actionForm = new FormGroup({
      reportDate: new FormControl('', [Validators.required]),
      // pageNo : new FormControl('',[Validators.required])
    });

    localStorage.removeItem('tableName');

    this.lodSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });

    this.lodSpinner.isLoading.next(true);

    this.service.getTableValueFromDataIngestion().subscribe(
      (data: any) => {
        this.dataIngestionData = data;
        console.log(this.dataIngestionData, 'data is ready for table');
        this.lodSpinner.isLoading.next(false);

        // this.DataForDropdown=this.dataIngestionData;
        // console.log(this.DataForDropdown,"!!!!@@@ Data for dropdown");
        const uniqueData = new Set(this.dataIngestionData);
        this.DataForDropdown = Array.from(uniqueData); // Convert the Set back to an array
        console.log(
          this.DataForDropdown,
          'Data for dropdown without duplicates'
        );
        const uniqueClients = new Set(
          this.DataForDropdown.map((item) => item.client)
        );
        this.DataForDropdown = Array.from(uniqueClients).map((client) => ({
          client,
        }));
        this.DataForDropdown1 = Array.from(uniqueData); // Convert the Set back to an array
        console.log(
          this.DataForDropdown1,
          'Data for dropdown without duplicates'
        );
        const uniqueAnalyst = new Set(
          this.DataForDropdown1.map((item) => item.analystName)
        );
        this.DataForDropdown1 = Array.from(uniqueAnalyst).map(
          (analystName) => ({ analystName })
        );
        console.log(this.DataForDropdown1, 'dataforDropdoen1');
        this.DataForDropdown1 = Array.from(uniqueAnalyst)
          .filter((analystName) => analystName) // Only keep non-empty values
          .map((analystName) => ({ analystName }));
      },
      (error: HttpErrorResponse) => {
        alert(error);
      }
    );

    this.industry = [
      {
        name: 'industry1',
        companies: [{ cname: 'Trio' }, { cname: 'Minda' }, { cname: 'Dell' }],
      },
      {
        name: 'industry2',
        companies: [
          { cname: 'TechSoft' },
          { cname: 'MindScript' },
          { cname: 'Roxiller' },
        ],
      },
      {
        name: 'industry3',
        companies: [{ cname: 'Idea' }, { cname: 'Voot' }, { cname: 'Trello' }],
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
      { accessAnalyst: 'ICICI Direct' },
      { accessAnalyst: 'Emkay' },
      { accessAnalyst: 'Spark' },
      { accessAnalyst: 'Axis Capital' },
      { accessAnalyst: 'HSBC' },
    ];
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();

    this.dataInjectionBox = true;

    this.minDateValue = new Date();

    this.document = new FormGroup({
      client: new FormControl('', [Validators.required]),
      documentType: new FormControl('', [Validators.required]),
      analystName: new FormControl(''),
      reportFrom: new FormControl('', [Validators.required]),
      reportTo: new FormControl('', [Validators.required]),
    });

    this.DataForDropdown = this.dataIngestionData;
    console.log(this.DataForDropdown, '!!!!@@@ Data for dropdown');

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

  // transformClientData(inputData: any) {
  //   // const industries
  //   const clientData:any[]=[];
  //   const allData:any[]=[];
  //   inputData.filter((data: any) => {
  //       inputData
  //         .filter((data1: any) => {
  //           if (data.industry == data1.industry){

  //               allData.push({
  //                  name: data.industry,
  //                  states:data1.clientName
  //                });
  //           }
  //           return allData

  //         })
  //     //     .map((data1: any) => {
  //     //       clientData.push({clientName:data1.clientName});
  //     //     });
  //     //   console.log('clientData==> ', clientData);
  //     // })
  //     // .map((data: any) => {
  //     //  allData.push({
  //     //     name: data.industry,
  //     //     states:clientData
  //     //   });

  //     });

  //   console.log('industries of allData: ', allData);
  // }
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

  menuSelected: any;
  onClickMenu(Data: any) {
    console.log(Data, 'selected Data');
  }

  uploadNewData() {
    console.log('button clicked');
    // this.uploadNewDataDialog = true;
    this.router.navigate(['/document/nav/dataInjestion/uploadDoc']);
    // this.allData = [];
     // this.ngOnInit();
  }

  onClickBack() {
    this.dataInjectionBox = true;
    this.uploadDataDialogBox = false;
  }
  selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }
  onClickUpload() {
    this.uploadNewDataDialog = false;

    this.spinner = true;
    // let docData = {
    //  clientName:this.document.value.client,
    //  documentType:this.document.value.documentType,
    //  analystName:this.document.value.analystName
    // }

    // this.service.DocValues=docData;

    //  console.log('file uploded',this.service.DocValues);
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

              console.log(data.body.fileId, 'doc uploaded2');
              // this.fileid1 =data.body.fileId

              //  this.getTablesByTableId(data.body.fileId);
              //  this.FormTableBox = false;
              //  console.log(this.FormTableBox, 'inside onclick upload');
              this.spinner = false;
              this.ngOnInit();
            },
            (error: HttpErrorResponse) => {
              console.log(error, 'Rutik Data Not Getting');
              console.log('error');
            }
          );

        console.log(this.document.value, ' Document Data....!!!');
      }
    }
  }
  //  getTablesByTableId(tableId: string) {
  //   this.service.getDataByFileId(tableId).subscribe(
  //     (data: any) => {
  //       this.getDataByFileId = data;
  //       console.log('get data by file ID');
  //       this.FormTableBox = false;
  //       this.dataBox = true;
  //       console.log(this.getDataByFileId, 'data is avalible for fetch');
  //     }
  //     // (error: HttpErrorResponse) => {
  //     //   alert('something went wrong...');
  //     //   console.log(error);

  //     // }
  //   );
  // }
  editTableValue(data: any) {
    console.log(data, ' on click table name');
    this.lodSpinner.isLoading.next(true);
    // this.router.navigate(["/document/nav/dataInjestion/uploadDoc"])
    let docData = {
      clientName: data.client,
      documentType: data.documentType,
      analystName: data.analystName,
      peerName: data.peerName,
      units: data.units,
      currency: data.currency,
    };
    let fileId = data.fileId;
    // let fileIds = {
    //   fileId: data.fileId,
    // };
    this.service.DocValues = docData;
    // this.service.fileIdData = fileIds;
    console.log(this.service.fileIdData, 'file id stored');
    console.log(data, '.../././...../../.');
    this.service.setTableId(data.fileId);
    this.service.getDataByFileId(data.fileId).subscribe(
      (data: any) => {
        this.getDataByFileId = data;
        console.log(this.getDataByFileId, 'get data by file ID');
        console.log(fileId, 'fileid');
        console.log(this.getDataByFileId, 'data is avalible for fetch');
        this.router.navigate([
          `/document/nav/dataInjestion/tableList/${fileId}`,
        ]);
        this.lodSpinner.isLoading.next(false);
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong...');
        console.log(error);
      }
    );
  }
  actionDialogBox(data: any) {
    console.log(data, 'id...../..');
    this.fileid1 = data.fileId;
    console.log(this.fileid1, 'fileid   ;;..  ');

    this.actionDailogBox = true;
  }

  extractFile() {
    console.log(this.fileid1, 'file id');

    if (this.actionForm.valid) {
      console.log(this.actionForm.value, 'action form');
      this.service
        .addextractFile(this.fileid1, this.actionForm.value)
        .subscribe((data: any) => {
          console.log(data, 'extract data');
          this.router.navigate([
            `/document/nav/dataInjestion/tableList/${this.fileid1}`,
          ]);
        });
    }
    this.actionDailogBox = false;
  }
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
}
