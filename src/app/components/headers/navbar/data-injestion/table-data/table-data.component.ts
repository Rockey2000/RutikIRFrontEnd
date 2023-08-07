import { AnimateTimings } from '@angular/animations';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AbstractType,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
import { LoadingSpinnerService } from 'src/app/loading-spinner.service';
import { Table, TableModule } from 'primeng/table';
import { FiledData, TableForMerge } from './deleteFieldId';
import { PaginatorModule } from 'primeng/paginator';
import { filter } from 'rxjs';
import { FilterBuilder } from 'FilterBuilders/filterBuilder';
interface Year {
  year: string;
}
interface Quarter {
  quarter: string;
}
interface Type {
  estimated: string;
}
// interface TableHeader{
//   year : Number,
//   quarter: string,
//   type: string,
// }
interface dataInjection {
  fieldId: Number;
  lineItemName: string;
  value: string;
  // header: TableHeader[]
  year: Number;
  quarter: string;
  type: string;
}
@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class TableDataComponent implements OnInit {
  getDataByTableId: any[] = [];
  tabKay: any = [];
  tabValue: any = [];
  element: any = [];
  year!: Year[];
  selectedYear: any;
  quarter!: Quarter[];
  selectedQuarter = [];
  estimated!: Type[];
  selectedType = [];
  dataForm!: FormGroup;
  required!: boolean;
  parent = [];
  dropDowns: any = [];
  selectedRowIndex: any = [];

  selectedProducts: any[] = [];

  count: number = 0;
  // header!: TableHeader;
  injectionData: dataInjection = {} as dataInjection;
  injectionList: dataInjection[] = [];
  abc: any;
  fieldIds: any = [];
  tableId!: string;
  getTableData: any[] = [];

  downloadedData: any = File;
  selectedTableId!: string;
  uploadDialog: boolean = false;
  selectedFiles!: FileList;
  currentFile!: File;

  rowValue: any = [];
  rowObj: any = [];
  selectedRowValues: any[] = [];
  isChecked!: boolean[];
  // isChecked = Array(this.getDataByTableId.length).fill(false);
  isevent = false;
  selectedRows: any[] = [];
  fileId: any;
  fileData: any;
  analystName: any;
  clientName: any;
  tableListData: any;
  extractedTableData: any;
  mappedData: any[] = [];
  previewData:any[]=[]
  previewDialog: boolean = false;
  masterLineItem = 0;
  isDropdownValueSelected = false;
  text!: string;

  results!: string[];
  selectedValues: any;

  constructor(
    private lodSpinner: LoadingSpinnerService,
    private service: IRServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private location: Location,
  ) {

    const currentYear = new Date().getFullYear();
    // this.year = [
    //   { year: 2010 },
    //   { year: 2011 },
    //   { year: 2012 },
    //   { year: 2013 },
    //   { year: 2014 },
    //   { year: 2015 },
    //   { year: 2016 },
    //   { year: 2017 },
    //   { year: 2018 },
    //   { year: 2019 },
    //   { year: 2020 },
    //   { year: 2021 },
    //   { year: 2022 },
    //   { year: 2023 },
    //   { year: 2024 },
    //   { year: 2025 },
    //   { year: 2026 },
    //   { year: 2027 },
    //   { year: 2028 },
    //   { year: 2029 },
    //   { year: 2030 },
    // ];
    this.year = [];
    for (let i = 2000; i <= currentYear+1; i++) {
        this.year.push({ year: i.toString() });
    }
    this.quarter = [
      { quarter: 'Q1' },
      { quarter: 'Q2' },
      { quarter: 'Q3' },
      { quarter: 'Q4' },
      { quarter: 'Half Yearly' },
      { quarter: 'Annual' },
    ];
    // this.tableDataToMerge.tableId=''
    this.estimated = [{ estimated: 'Estimated' }, { estimated: 'Actual' }];
  }
  isLoading: boolean = false;
  
  ngOnInit(): void {
    this.lodSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });
    this.extractedTableData = this.service.tableData;
    console.log(this.extractedTableData);

    this.lodSpinner.isLoading.next(true);
    // this.dataForm = new FormGroup({
    //   year: new FormControl('', [Validators.required]),
    //   quarter: new FormControl('', [Validators.required]),
    //   type: new FormControl('', [Validators.required]),
    //   groupname: new FormControl(''),
    // });

    // get file id from table id API

    this.service.getFileIdByTableId(this.route.snapshot.params['Id']).subscribe(
      (data: any) => {
        console.log(data, 'get data by file id whole data');

        this.fileId = data.fileId;
        console.log(this.fileId, '!!!!!!file id by table id !!!!RUTIK');
        this.service.getFileDataByFileId(this.fileId).subscribe(
          (data: any) => {
            this.fileData = data;
            this.analystName = data.analystName;
            this.clientName = data.client;
            console.log(
              this.analystName,
              this.clientName,
              '333333!!!!!!--------->get data by file ID'
            );
            console.log(
              this.fileData,
              'data is avalible for fetch from fileId'
            );
            this.lodSpinner.isLoading.next(false);
            // for client Data API
            if (
              this.fileData.documentType === 'Balance Sheet' ||
              this.fileData.documentType === 'Income Statement' ||
              this.fileData.documentType === 'Cash Flow Statement'||
              this.fileData.documentType ==='Peer Balance Sheet'||
              this.fileData.documentType ==='Peer Income Statement'||
              this.fileData.documentType ==='Peer Cash Flow Statement'
            ) {
              console.log(
                'in client data service %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
                this.clientName
              );
              console.log(
                this.route.snapshot.params['Id'],
                'hello Rutik %%%%%'
              );
              this.service
                .getDataByClientTableId(
                  this.clientName,
                  this.route.snapshot.params['Id']
                )
                .subscribe(
                  (data: any) => {
                    console.log(data, 'RUTIK SHINDE LOOK HERE');

                    console.log(this.route.snapshot.params['Id'], 'hello');
                    console.log(data, 'in the data attribute');
                    this.getDataByTableId = data;
                    console.log(this.getDataByTableId, 'rutik >?>>?>?>>?>?>');

                    this.getDataByTableId.forEach((RowElement) => {
                      console.log(RowElement, 'first element');

                      this.tabKay = Object.keys(RowElement);
                      console.log(this.tabKay, 'Rutik ');
                      this.tabValue.push(Object.values(RowElement));

                      console.log(RowElement, 'element value');

                      this.rowValue.push(RowElement);
                    });
                    data;
                    console.log(this.rowValue, '/////Rutik');

                    for (let index = 0; index < this.tabKay.length; index++) {
                      this.dropDowns.push({
                        year: '',
                        quarter: '',
                        type: '',
                        index: index,
                      });
                    }

                    console.log(
                      'get data by table ID',
                      this.getDataByTableId.length
                    );

                    console.log(
                      this.getDataByTableId,
                      'data is avalible for fetch'
                    );

                    var countList: any = [];

                    this.getDataByTableId.forEach((ele) => {
                      const result = Object.keys(ele).length;
                      countList.push(result);

                      this.count = Math.max(...countList);
                      let obj = this.getDataByTableId.find(
                        (x: any) => Object.keys(x).length == this.count
                      );
                      this.tabKay = Object.keys(obj);
                      console.log(this.count);
                    });

                    this.getDataByTableId.forEach((ele) => {
                      const result = Object.keys(ele).length;
                      if (ele.hasOwnProperty('masterLineItem')) {
                        if (ele.masterLineItem !== 'NA') {
                          this.masterLineItem++;
                        }
                      }
                    });

                    console.log(
                      'The number of masterline items is:',
                      this.masterLineItem
                    );
                  },
                  (error: HttpErrorResponse) => {
                    alert('something went wrong...');
                    this.lodSpinner.isLoading.next(false);

                    console.log(error);
                  }
                );
            } else {
              // get data by table id and analyst name
              this.service
                .getDataByTableId(
                  this.analystName,
                  this.route.snapshot.params['Id']
                )
                .subscribe(
                  (data: any) => {
                    console.log(data, 'RUTIK SHINDE LOOK HERE');

                    console.log(this.route.snapshot.params['Id'], 'hello');
                    console.log(data, 'in the data attribute');
                    this.getDataByTableId = data;
                    console.log(this.getDataByTableId, 'rutik >?>>?>?>>?>?>');

                    this.getDataByTableId.forEach((RowElement) => {
                      console.log(RowElement, 'first element');

                      this.tabKay = Object.keys(RowElement);
                      console.log(this.tabKay, 'Rutik ');
                      this.tabValue.push(Object.values(RowElement));

                      console.log(RowElement, 'element value');

                      this.rowValue.push(RowElement);
                    });
                    data;
                    console.log(this.rowValue, '/////Rutik');

                    for (let index = 0; index < this.tabKay.length; index++) {
                      this.dropDowns.push({
                        year: '',
                        quarter: '',
                        type: '',
                        index: index,
                      });
                    }

                    console.log(
                      'get data by table ID',
                      this.getDataByTableId.length
                    );

                    console.log(
                      this.getDataByTableId,
                      'data is avalible for fetch'
                    );

                    var countList: any = [];

                    this.getDataByTableId.forEach((ele) => {
                      const result = Object.keys(ele).length;
                      countList.push(result);

                      this.count = Math.max(...countList);
                      let obj = this.getDataByTableId.find(
                        (x: any) => Object.keys(x).length == this.count
                      );
                      this.tabKay = Object.keys(obj);
                      console.log(this.count);
                    });

                    this.getDataByTableId.forEach((ele) => {
                      const result = Object.keys(ele).length;
                      if (ele.hasOwnProperty('masterLineItem')) {
                        if (ele.masterLineItem !== 'NA') {
                          this.masterLineItem++;
                        }
                      }
                    });

                    console.log(
                      'The number of masterline items is:',
                      this.masterLineItem
                    );
                  },
                  (error: HttpErrorResponse) => {
                    alert('something went wrong...');
                    this.lodSpinner.isLoading.next(false);

                    console.log(error);
                  }
                );
            }
          },

          (error: HttpErrorResponse) => {
            alert('something went wrong...');
            console.log(error);
            this.lodSpinner.isLoading.next(false);
          }
        );
        this.service.getDataByFileId(this.fileId).subscribe(
          (data: any) => {
            this.getTableData = data;
            console.log('get data by file ID');

            console.log(
              this.getTableData,
              'data is avalible for fetch from getTableData'
            );
          },
          (error: HttpErrorResponse) => {
            alert('something went wrong...');
            console.log(error);
          }
        );
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong...');
        console.log(error);
      }
    );
    // get file id from table id API ENDS

    //get data of table by table id
    this.service
      .getTableListDataByTableId(this.route.snapshot.params['Id'])
      .subscribe(
        (data: any) => {
          this.tableListData = data.tableName;
          console.log(
            this.tableListData,
            '!!!!!!data is avalible for fetch from tableID'
          );
        },
        (error: HttpErrorResponse) => {
          alert('something went wrong...');
          console.log(error);
        }
      );

    //end get data of table by table id

    // let fileIds = this.service.fileIdData;
    let docData = this.service.DocValues;
    console.log(this.service.DocValues, './././././');

    // console.log(fileIds, 'file Id got');
    console.log(this.fileData.analystName, 'hello file data in component');
    console.log(this.analystName, 'hello data');

    //merge table get table name or table id service
    console.log(this.fileId, '!!!!!!fileid for merge!!!!!!!');

    // this.service.getDataByFileId(this.fileId).subscribe(
    //   (data: any) => {
    //     this.getTableData = data;
    //     console.log('get data by file ID');

    //     console.log(
    //       this.getTableData,
    //       'data is avalible for fetch from fileId'
    //     );
    //   },
    //   (error: HttpErrorResponse) => {
    //     alert('something went wrong...');
    //     console.log(error);

    //   }
    // );
    console.log(this.service.DocValues, './././././ =====> RUTIK LOOK HERE');
  }

  // setDropValue(value: any, index: any, fieldName: any) {
  //   this.dropDowns[index][fieldName] = value.value;
  //   this.dropDowns[index].colIndex = index;
  // }

  setDropValue(value: any, index: any, fieldName: any) {
    console.log('Setting value:', value, 'for field:', fieldName, 'at index:', index);
    if (!this.dropDowns[index]) {
      this.dropDowns[index] = {};
    }
    // console.log(value,"value in");

    this.dropDowns[index][fieldName] = value.value;
    console.log(this.dropDowns, 'dropdowns');

    this.dropDowns[index].colIndex = index;
    this.isDropdownValueSelected = true;

  }
  AutoSetDropdownValues: any[] = [];
  onSetDropDowns() {
    this.service
      .autoSetDropDowns(this.route.snapshot.params['Id'])
      .subscribe((data: any) => {
        this.AutoSetDropdownValues = data;
        console.log(this.AutoSetDropdownValues, 'Auto OBject');

        for (
          let index = 0;
          index < this.AutoSetDropdownValues.length;
          index++
        ) {
          let Year = { value: this.AutoSetDropdownValues[index].Year };
          let Quarter = { value: this.AutoSetDropdownValues[index].Quarter };
          let Type = { value: this.AutoSetDropdownValues[index].Type };

          console.log(Year, 'year', Quarter, 'quartr', Type, 'type');

          this.setDropValue(Year, index + 3, 'year');
          this.setDropValue(Quarter, index + 3, 'quarter');
          this.setDropValue(Type, index + 3, 'type');
        }
      });
  }
  checks = false;
  selectAll(ev: any) {
    if (ev.target.checked == true) {
      this.checks = true;
      this.rowValue.forEach((row: any, index: number) => {
        this.selectedRowIndex.push(index);
        this.selectedProducts.push(row);
      });
      console.log(this.selectedRowIndex, 'select all');
      console.log(this.selectedProducts, 'select all');
    } else {
      this.checks = false;

      this.selectedRowIndex = [];
      this.selectedProducts = [];
      console.log(this.selectedRowIndex, 'after deselect');
      console.log(this.selectedProducts, 'after deselect all');
    }
  }

  selectedItems(event: any, index: any) {
    if (event.target.checked == true) {
      this.selectedRowIndex.push(index);
    } else {
      const indexToRemove = this.selectedRowIndex.indexOf(index);
      if (indexToRemove !== -1) {
        this.selectedRowIndex.splice(indexToRemove, 1);
      }
    }
    this.selectedRowValues = this.rowValue.filter((item: any, i: any) =>
      this.selectedRowIndex.includes(i)
    );
    console.log(this.selectedRowValues, 'selected row element');
    console.log(this.selectedRowIndex, '<<<Rutik');
  }
  //   selectedItems(event:any, index: any) {
  //  console.log(event," event");
  //     if (event.target.ariaChecked) {
  //       this.selectedRowIndex.push(index);
  //     } else {
  //       const indexToRemove = this.selectedRowIndex.indexOf(index);
  //       if (indexToRemove !== -1) {
  //         this.selectedRowIndex.splice(indexToRemove, 1);
  //       }
  //     }

  //     this.selectedRowValues = this.rowValue.filter((item: any, i: any) =>
  //       this.selectedRowIndex.includes(i)
  //     );
  // // console.log(this.selectedProducts);

  // //     this.selectedRowValues.push(event);
  //     console.log(this.selectedRowValues, 'selected row element');
  //     console.log(this.selectedRowIndex, '<<<Rutik');

  //   }

  onClickBack() {
    this.location.back();
  }

  onClickSaveAll() {
    
    // this.lodSpinner.isLoading.next(true);
    let docData = this.service.DocValues;
    console.log(this.service.DocValues, './././././');

    this.dropDowns = this.dropDowns.filter((ele: any) => {
      if (ele.year != '' && ele.quarter != '' && ele.type != '') {
        return ele;
      }
    });
    console.log(this.selectedRowIndex, 'selectedRowIndex');

    for (let ind = 0; ind < this.selectedRowIndex.length; ind++) {
      let row = this.tabValue[this.selectedRowIndex[ind]];
      let fieldId = row[0];
      let masterLineItem = row[1];
      let lineItemName = row[2];
      for (let index = 0; index < this.dropDowns.length; index++) {
        let obj = {
          companyName: this.fileData.client,
          analyst: this.fileData.analystName,
          peerName: this.fileData.peerName,
          documentType: this.fileData.documentType,
          reportType: this.fileData.reportType,
          reportDate: this.fileData.reportDate,
          units: this.fileData.units,
          currency: this.fileData.currency,
          denomination:this.fileData.denomination,
          fieldId: fieldId,
          masterLineItem: masterLineItem,
          lineItemName: lineItemName,
          year: this.dropDowns[index].year,
          quarter: this.dropDowns[index].quarter,
          type: this.dropDowns[index].type,
          value: row[this.dropDowns[index].colIndex],
          tableName: this.tableListData,
        };

        // console.log(this.setValue);

        console.log(obj, 'object data before push');

        this.mappedData.push(obj);
      }
    }
    console.log(this.mappedData, 'mapped data');

    this.service.dataIngestionPreview(this.mappedData).subscribe(
      (data: any) => {
        this.previewData=data;
        console.log(this.previewData,"preview of data");
        
        console.log(data,'data is passing');
        
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Data previewed successfully',
        });
        this.previewDialog = true;
        this.lodSpinner.isLoading.next(false);
        this.mappedData=[];
      },
      (error: HttpErrorResponse) => {
        console.log(error, 'Rutik Data Getting');
       
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `${error.error.developerMessage}`,
        });
      }
    );    
    // this.selectedRowIndex.forEach((item: any) => {
    //   this.dropDowns.forEach((option: any) => {
    //     let selectedRow = this.tabValue[item];
    //     this.injectionData.fieldId = selectedRow[0];
    //     this.injectionData.lineItemName = selectedRow[1];
    //     this.injectionData.value = selectedRow[option.index];
    //     delete option.index;
    //     this.injectionData.year = option.year;
    //     this.injectionData.quarter = option.quarter;
    //     this.injectionData.type = option.type;
    //     console.log(option, 'option value');

    //     this.injectionList.push(this.injectionData);
    //   });
    // });

    //******this is main code of mapping data to final table*****

    // this.confirmationService.confirm({
    //   message: 'Are you sure that you want to save this following data?',
    //   accept: () => {
    //     console.log('data is here =========>', this.mappedData);
    //     this.service.dataIngestionMappingtable(this.mappedData).subscribe(
    //       (data: any) => {
    //         console.log('data is passing');
    //         // alert('data is passing to database');
    //         this.messageService.add({
    //           severity: 'success',
    //           summary: 'Successfull',
    //           detail: 'Data Mapped successfully',
    //         });
    //         this.lodSpinner.isLoading.next(false);
    //           setTimeout(() => {
    //              this.location.back();
    //             }, 1300);

    //         this.ngOnInit();
    //       },
    //       (error: HttpErrorResponse) => {
    //         console.log(error, 'Rutik Data Getting');
    //         alert('error');
    //         this.messageService.add({
    //           severity: 'Error',
    //           summary: 'Error',
    //           detail: 'Something went wrong while adding data..!!',
    //         });
    //       }
    //     );
    //   },
    //   reject: () => {
    //     this.messageService.add({
    //       severity: 'warn',
    //       summary: 'Cancelled',
    //       detail: 'Data not Mapped',
    //     });
    //   },
    // });
    //******this is main code of mapping data to final table*****
  }

  saveData() {
    console.log(this.previewData, 'mapped data');

    this.confirmationService.confirm({
      message: 'Are you sure that you want to save this following data?',
      accept: () => {
        console.log('data is here =========>', this.previewData);
        this.service.dataIngestionMappingtable(this.previewData).subscribe(
          (data: any) => {
            console.log('data is passing');
            // alert('data is passing to database');
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Data Mapped successfully',
            });
            this.lodSpinner.isLoading.next(false);
            setTimeout(() => {
              this.location.back();
            }, 1300);

            this.ngOnInit();
          },
          (error: HttpErrorResponse) => {
            console.log(error, 'Rutik Data Getting');
            alert('error');
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `${error.error.developerMessage}`,
            });
          }
        );
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'Data not Mapped',
        });
      },
    });
  }
  // onClickSaveAll() {
  //   console.log(this.selectedProducts);
  // }

  setValue(event: any, colIndex: any, rowIndex: any) {
    this.tabValue[colIndex][rowIndex] = event.target.value;
  }

  onClickDeleteRow() {
    this.lodSpinner.isLoading.next(true);
    for (let ind = 0; ind < this.selectedRowIndex.length; ind++) {
      let row = this.tabValue[this.selectedRowIndex[ind]];

      let fieldId = row[0];

      this.fieldIds.push(fieldId);
    }

    console.log(this.fieldIds, 'field ids array for delete');

    //    console.log(this.tabValue[this.selectedRowIndex][0],"data is for delete");
    // this.service
    // .deleteTableDataByFieldId(this.tabValue[this.selectedRowIndex][0])
    // .subscribe(
    //   (data: any) => {
    //     console.log('data deleted successfulay');
    //   },
    //   (error: HttpErrorResponse) => {
    //     alert('something went wrong');
    //   }
    // );
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete following data?',
      accept: () => {
        for (let i = 0; i < this.fieldIds.length; i++) {
          this.service.deleteTableDataByFieldId(this.fieldIds[i]).subscribe(
            (data: any) => {
              console.log('data deleted successfully');
              // this.location.back();
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Data Deleted successfully',
              });
              this.lodSpinner.isLoading.next(false);
              // this.ngOnInit();
              // this.onClickBack();
              setTimeout(() => {
                window.location.reload();
              }, 1300);
            },

            (error: HttpErrorResponse) => {
              alert('Something went wrong');
              this.lodSpinner.isLoading.next(false);
            }
          );
        }
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'Data not Mapped',
        });
      },
    });

    // for (let i = 0; i < this.fieldIds.length; i++) {
    //   this.service.deleteTableDataByFieldId(this.fieldIds[i]).subscribe(
    //     (data: any) => {
    //       console.log('data deleted successfully');
    //       // this.location.back();
    //       this.onClickBack();

    //     },

    //     (error: HttpErrorResponse) => {
    //       // alert('something went wrong');
    //       this.messageService.add({
    //         severity: 'Error',
    //         summary: 'Error',
    //         detail: 'Something went wrong while deleting..!!',
    //       });
    //     }
    //   );
    // }
    // this.ngOnInit();
    // this.confirmationService.confirm({
    //   message: 'Are you sure that you want to delete following data?',
    //   accept: () => {

    //     console.log(this.tableIdForDelete,"interface delete attribute");
    //     console.log({filed_idlist: this.tableIdForDelete.filed_idlist},"======>Rutik====>");

    //     this.service.deleteTableDataByFieldId(this.tableIdForDelete).subscribe(
    //       (data: any) => {
    //         console.log('data is passing');

    //         this.messageService.add({
    //           severity: 'success',
    //           summary: 'Successfull',
    //           detail: 'Data Deleted successfully',
    //         });
    //      this.ngOnInit();
    //       },
    //       (error: HttpErrorResponse) => {
    //         console.log(error, 'Rutik Data Getting');
    //         alert('error');
    //         this.messageService.add({
    //           severity: 'Error',
    //           summary: 'Error',
    //           detail: 'Something went wrong while deleting..!!',
    //         });
    //       }
    //     );
    //   },
    //   reject: () => {
    //     this.messageService.add({
    //       severity: 'warn',
    //       summary: 'Cancelled',
    //       detail: 'Data not Mapped',
    //     });
    //   },
    // });
  }
  tablefile = this.route.snapshot.params['Id'];

  onClickDownloadtable() {
    console.log(this.tablefile, 'tablefile');

    this.service.downloadTableData(this.tablefile).subscribe(
      (x: any) => {
        var newBlob = new Blob([x], { type: 'application/vnd.ms-excel' });
        const data = window.URL.createObjectURL(newBlob);

        var link = document.createElement('a');
        link.href = data;
        link.download = 'tableData.xlsx';

        link.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
        console.log('file Downloded');
      },
      (error: HttpErrorResponse) => {
        alert('Something went wrong');
      }
    );
  }
  selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }
  onClickUpload() {
    this.uploadDialog = true;
  }
  hideDialog() {
    this.uploadDialog = false;
  }
  uploadExcel() {
    this.lodSpinner.isLoading.next(true);
    console.log(this.selectedFiles, 'excel file uploaded');

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      console.log(file, 'inside upload method');
      if (file) {
        this.currentFile = file;
        this.service
          .uploadExtractedTable(
            this.currentFile,
            this.route.snapshot.params['Id']
          )
          .subscribe(
            (data: any) => {
              console.log('data is passing');
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Data Uploaded Successfully',
              });
              this.lodSpinner.isLoading.next(false);
              this.uploadDialog = false;
              window.location.reload();
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
    }
  }

  tableDataToMerge: TableForMerge = {
    tableId: '',
    tableName: '',
    score: '',
    tableMapName: '',
  };

  onClickMerge() {
    this.lodSpinner.isLoading.next(true);
    console.log(this.selectedTableId, 'table id for merge');
    console.log(this.route.snapshot.params['Id'], 'tbale to marge with');
    this.tableDataToMerge.tableId = this.route.snapshot.params['Id'];

    console.log(this.tableDataToMerge, 'tableDataToMerge');

    // tableId:string;
    // tableName:string;
    // score:any;
    // tableMapName:string;

    this.service
      .mergeTableById(this.selectedTableId, this.tableDataToMerge)
      .subscribe((data: any) => {
        console.log('data is merge');
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Table Merge successfully',
        });
        this.lodSpinner.isLoading.next(false);
        window.location.reload();
        this.service.DocValues;
        // this.onClickBack();
        // this.ngOnInit();
      });
  }

  shiftRight() {
    this.lodSpinner.isLoading.next(true);
    console.log(this.selectedRowValues, 'hello1');
    this.service
      .onClickShiftRight(this.selectedRowValues)
      .subscribe((data: any) => {
        console.log('data is shifted');
        console.log('data is shifted');

        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Row shifted right successfully',
        });
        this.lodSpinner.isLoading.next(false);
        window.location.reload();
        this.service.DocValues;
        // this.ngOnInit();
      });
  }
  shiftLeft() {
    this.lodSpinner.isLoading.next(true);
    console.log(this.selectedRowValues, 'hello 2');
    this.service
      .onClickShiftLeft(this.selectedRowValues)
      .subscribe((data: any) => {
        console.log('data is shifted');

        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Row shifted left successfully',
        });
        this.lodSpinner.isLoading.next(false);
        window.location.reload();
        this.service.DocValues;

        // this.ngOnInit();
      });
  }

  onClickSplitTable() {
    this.lodSpinner.isLoading.next(true);
    this.confirmationService.confirm({
      message: 'Are you sure that you want to split following table data?',
      accept: () => {
        console.log(this.selectedRowValues, 'selected table id');
        console.log(this.fileId);
        this.service.splitTable(this.fileId, this.selectedRowValues).subscribe(
          (data: any) => {
            alert('data Splited Successfully');
            console.log(data, 'data is splited');
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Table Splited successfully',
            });
            setTimeout(() => {
              this.router.navigate(['/document/nav/dataInjestion/uploadDoc']);
            }, 600);

            this.lodSpinner.isLoading.next(false);
          },
          (error: HttpErrorResponse) => {
            alert('something went wrong');
          }
        );
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'Table Spliting Cancelled',
        });
      },
    });
  }

  cancelPreview() {
    this.mappedData = [];
    this.previewDialog = false;
  }

  filterYear(event: any) {
    let yearCount: any[] = [];
    let quary = event.query;
    for (let i = 0; i < this.estimated.length; i++) {
      let yr = this.estimated[i];
      if (yr.estimated.toLowerCase().indexOf(quary.toLowerCase()) == 0) {
        yearCount.push(yr);
      }
    }
    this.results = yearCount;
  }





  onClickCancel(){
    
  }
}
