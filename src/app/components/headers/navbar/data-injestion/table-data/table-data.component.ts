import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';

interface Year {
  year: Number;
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
  providers:[ConfirmationService, MessageService]
})
export class TableDataComponent implements OnInit {
  getDataByTableId: any[] = [];
  tabKay: any = [];
  tabValue: any = [];
  element:any =[];
  year!: Year[];
  selectedYear = [];
  quarter!: Quarter[];
  selectedQuarter = [];
  estimated!: Type[];
  selectedType = [];
  dataForm!: FormGroup;
  required!: boolean;
  parent = [];
  dropDowns: any = [];
  selectedRowIndex: any = [];

  // header!: TableHeader;
  injectionData: dataInjection = {} as dataInjection;
  injectionList: dataInjection[] = [];
  abc: any;
  constructor(
    private service: IRServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {
    this.year = [
      { year: 2020 },
      { year: 2021 },
      { year: 2022 },
      { year: 2023 },
      { year: 2024 },
      { year: 2025 },
      { year: 2026 },
      { year: 2027 },
      { year: 2028 },
      { year: 2029 },
      { year: 2030 },
    ];

    this.quarter = [
      { quarter: 'Q1' },
      { quarter: 'Q2' },
      { quarter: 'Q3' },
      { quarter: 'Q4' },
    ];

    this.estimated = [{ estimated: 'Estimated' }, { estimated: 'Actual' }];
  }

  ngOnInit(): void {
    this.dataForm = new FormGroup({
      year: new FormControl('',[Validators.required]),
      quarter: new FormControl('',[Validators.required]),
      type: new FormControl('',[Validators.required]),
      groupname: new FormControl(''),
    });

    let docData=this.service.DocValues
    console.log(this.service.DocValues,"./././././");
    this.service.getDataByTableId(this.route.snapshot.params['Id']).subscribe(
      (data: any) => {
        console.log(data,"RUTIK SHINDE LOOK HERE");
        
        console.log(this.route.snapshot.params['Id'], 'hello');
        console.log(data, 'in the data attribute');
        this.getDataByTableId = data;
        console.log(this.getDataByTableId,"rutik >?>>?>?>>?>?>");
        
        this.getDataByTableId.forEach((element) => {
          console.log(element, 'first element');
  
          this.tabKay = Object.keys(element);
          console.log(this.tabKay,"Rutik ");
          this.tabValue.push(Object.values(element));
      
          console.log(element, 'element value');
        });

        for (let index = 0; index < this.tabKay.length; index++) {
          this.dropDowns.push({
            year: '',
            quarter: '',
            type: '',
            index: index,
          });
        }

        console.log('get data by table ID', this.getDataByTableId.length);

        console.log(this.getDataByTableId, 'data is avalible for fetch');
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong...');
        console.log(error);
      }
    );
  }

   setDropValue(value: any, index: any, fieldName: any) {
    this.dropDowns[index][fieldName] = value.value;
    this.dropDowns[index].colIndex=index;
  }

  selectedItems(event: any, index: any) {
    if (event.checked[0]) {
      this.selectedRowIndex.push(index);
    } else {
      this.selectedRowIndex.splice(index, 1);
    }
  }

  onClickBack() {
    this.router.navigate(['/document/nav/dataInjestion/uploadDoc']);
  }

  onClickSaveAll() {
 
    let docData=this.service.DocValues
    console.log(this.service.DocValues,"./././././");
    
    let mappedData: { companyName: any; analyst: any; documentType: any; fieldId: any; lineItemName: any; year: any; quarter: any; type: any; value: any; }[] =[];
    this.dropDowns = this.dropDowns.filter((ele: any) => {
      if (ele.year != '' && ele.quarter != '' && ele.type != '') {
        return ele;
      }
    });

     for( let ind = 0; ind< this.selectedRowIndex.length; ind++) {
    
      let row = this.tabValue[this.selectedRowIndex[ind]];
      let fieldId= row[0];
      let lineItemName= row[1];
      for(let index = 0 ; index < this.dropDowns.length; index++){
        let obj ={
          companyName: docData.clientName,
          analyst: docData.analystName,
          documentType:docData.documentType,
          fieldId: fieldId,
          lineItemName:  lineItemName,
          year: this.dropDowns[index].year,
          quarter: this.dropDowns[index].quarter,
          type:this.dropDowns[index].type,
          value: row[this.dropDowns[index].colIndex]
        };

      
        console.log(this.setValue);
        
        console.log(obj,"object data before push");
        
        mappedData.push(obj);
      }
     }
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
  
  this.confirmationService.confirm({
    message:'Are you sure that you want to map this following data?',
    accept:() =>{
      console.log('data is here =========>',mappedData);
      this.service.dataIngestionMappingtable(mappedData).subscribe(
          (data: any) => {
            console.log('data is passing');
            // alert('data is passing to database');
            this.messageService.add({
              severity: 'success',
              summary: 'Successfull',
              detail: 'Data Mapped successfully',
            });
            this.ngOnInit();
            this.router.navigate(['/document/nav/dataInjestion/uploadDoc']);
          },
          (error: HttpErrorResponse) => {
            console.log(error, 'Rutik Data Getting');
            alert('error');
            this.messageService.add({
              severity: 'Error',
              summary: 'Error',
              detail: 'Something went wrong while adding user..!!',
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
   
  setValue(event: any, colIndex:any, rowIndex:any){
    //  debugger

      this.tabValue[colIndex][rowIndex] = event.target.value;
      // debugger

  }

}
