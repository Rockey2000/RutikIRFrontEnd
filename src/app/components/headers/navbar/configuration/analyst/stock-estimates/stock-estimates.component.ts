import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

interface stockType {
  type: string;
}

@Component({
  selector: 'app-stock-estimates',
  templateUrl: './stock-estimates.component.html',
  styleUrls: ['./stock-estimates.component.css']
})
export class StockEstimatesComponent implements OnInit {
  stockTable:boolean=true;
  stockItems:any;
  stockEstimateForm:boolean=false;
  stockEstimatedForm!:FormGroup;
  lineItemTypes: stockType[] = [];
  constructor(  private fb: FormBuilder,) {
    this.lineItemTypes = [
      {type: 'Date'},
      {type:'Decimal'},
      { type: 'String' },
      { type: 'Number' },
      { type: 'Boolean' },
    ];

    this.stockEstimatedForm = this.fb.group({
      stockRow: this.fb.array([]),
    });
   }

  ngOnInit(): void {
    this.stockEstimate.push(this.newRow());
  }


  addStockEstimate(){
this.stockTable=false;
this.stockEstimateForm=true;

  }

  onClickBack(){
    this.stockTable=true;
    this.stockEstimateForm=false;
    this.stockEstimatedForm.reset();
    for (
      let i = 1;
      i < this.stockEstimatedForm.value.stockRow.length;
      i++
    ) {
      this.removeRow((i = 0));
    }
  }

 get stockEstimate(): FormArray {
    return this.stockEstimatedForm.get('stockRow') as FormArray;
  }

  newRow(): FormGroup {
    return this.fb.group({
      reportHeader: '',
      description: '',
      type: 'String',
      constraints:''
    });
  }

  addField() {
    this.stockEstimate.push(this.newRow());
  }

  removeRow(i: number) {
    this.stockEstimate.removeAt(i);
  }

  onClickSaveAll(){
    console.log(this.stockEstimatedForm.value.stockRow, 'ramram');
  }
}
