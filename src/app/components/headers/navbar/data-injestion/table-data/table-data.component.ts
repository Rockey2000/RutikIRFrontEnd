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
  selectedYear='';
  quarter!:Quarter[];
  selectedQuarter='';
  estimated!:Type[];
  selectedType='';
  dataForm!:FormGroup;
  required!: boolean
  parent: any;
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
      selectedYear: new FormControl(''),
      selectedQuarter: new FormControl(''),
      selectedType: new FormControl('')
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
        console.log('get data by table ID',this.getDataByTableId.length);
        
        console.log(this.getDataByTableId, 'data is avalible for fetch');
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong...');
        console.log(error);
      }
    );
  }

  onClickBack() {
    this.router.navigate(['/document/nav/dataInjestion/uploadDoc'])
  }

  onClickSaveAll(){
    console.log(this.getDataByTableId, 'after table updation data');
    this.service.updateValuesFromDataIngestion(this.getDataByTableId).subscribe(
      (data: any) => {
        console.log('Table Values edited successfully');
        console.log('Table Values Updated' + data);
        console.log(data);
      },
      (error: HttpErrorResponse) => {
        alert(error);
        console.log('something went wrong');
      }
    );
   }
}
