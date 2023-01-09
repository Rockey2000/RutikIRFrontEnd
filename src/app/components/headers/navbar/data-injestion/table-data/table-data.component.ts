import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IRServiceService } from 'src/app/ir-service.service';


interface Year{
  year:Number;
}
interface Quarter{
  quarter:string;
}
interface Type{
  estimated: string;
}
// interface TableHeader{
//   year : Number,
//   quarter: string,
//   type: string,
// }
interface dataInjection{
  fieldId: Number,
  lineItemName: string,
  value: string,
  // header: TableHeader[]
  year: Number,
  quarter:string,
  type:string
}
@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.css']
})
export class TableDataComponent implements OnInit {

  getDataByTableId: any[]=[];
  tabKay:any = [];
  tabValue:any = [];
  year!: Year[];
  selectedYear=[];
  quarter!:Quarter[];
  selectedQuarter=[];
  estimated!:Type[];
  selectedType=[];
  dataForm!:FormGroup;
  required!: boolean
  parent=[];
  dropDowns:any=[];
  selectedRowIndex:any=[];
  // header!: TableHeader;
  injectionData: dataInjection= {} as dataInjection;
  injectionList: dataInjection[]=[];
  constructor( private service: IRServiceService,
    private router: Router,
    private route:ActivatedRoute,
   ) { 
    this.year=[
      {year:2020},
      {year:2021},
      {year:2022},
      {year:2023},
      {year:2024},
      {year:2025},
      {year:2026},
      {year:2027},
      {year:2028},
      {year:2029},
      {year:2030}
  ];
    
  this.quarter=[
    {quarter:'Q1'},
    {quarter:'Q2'},
    {quarter:'Q3'},
    {quarter:'Q4'}
  ];

  this.estimated=[
    {estimated:'Estimated'},
    {estimated:'Actual'}
  ]
   }

  ngOnInit(): void {
     this.dataForm = new FormGroup({
      year: new FormControl(''),
      quarter: new FormControl(''),
      type: new FormControl(''),
      groupname:new FormControl('')
     })


    this.service.getDataByTableId(this.route.snapshot.params['Id']).subscribe(
      (data: any) => {
        console.log(this.route.snapshot.params['Id'],"hello");
        console.log(data, 'in the data attribute');
        this.getDataByTableId = data;
   
 
        this.getDataByTableId.forEach((element:any) =>{
          console.log(element,"first element");
          
          this.tabKay = Object.keys(element);
          this.tabValue.push(Object.values(element));
          console.log(element,"element value");
          
        });

        for (let index=0; index< this.tabKay.length; index++) {
            this.dropDowns.push({year:'', quarter:'', type:'', index:index})
        }

      
        console.log('get data by table ID',this.getDataByTableId.length);
        
        console.log(this.getDataByTableId, 'data is avalible for fetch');
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong...');
        console.log(error);
      }
    );
  }

  setDropValue(value: any, index: any, fieldName:any){
      this.dropDowns[index][fieldName] = value.value;
  }

  selectedItems(event: any, index: any){
 
    if(event.checked[0]){
      this.selectedRowIndex.push(index)
    }
    else{
      this.selectedRowIndex.splice(index, 1);
    }

  }

  onClickBack() {
    this.router.navigate(['/document/nav/dataInjestion/uploadDoc'])
  }

  onClickSaveAll(){

    this.dropDowns = this.dropDowns.filter((ele:any)=> {
      if(ele.year !='' && ele.quarter !='' && ele.type !=''){
        return ele;
      }
    }); 
       this.selectedRowIndex.forEach((item:any)=> {
        this.dropDowns.forEach((option:any)=>{

          let selectedRow = this.tabValue[item];
          this.injectionData.fieldId= selectedRow[0];
          this.injectionData.lineItemName= selectedRow[1];
          this.injectionData.value = selectedRow[option.index];
          delete option.index;
          this.injectionData.year = option.year;
          this.injectionData.quarter=option.quarter;
          this.injectionData.type=option.type;
           console.log(option,"option value");
             
          this.injectionList.push(this.injectionData)
        });
        
    });

      console.log("data is here", this.injectionList)
    
      this.service.dataIngestionMappingtable(this.injectionList).subscribe(
        (data:any)=>{
          console.log('data is passing');
          alert('data is passing to database')
        },
        (error: HttpErrorResponse) => {
          console.log(error, 'Rutik Data Getting');
          alert('error');
        }
      )
   }
}
