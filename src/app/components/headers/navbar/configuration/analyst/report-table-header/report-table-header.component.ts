import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';

@Component({
  selector: 'app-report-table-header',
  templateUrl: './report-table-header.component.html',
  styleUrls: ['./report-table-header.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class ReportTableHeaderComponent implements OnInit {
  reportTableDiv:boolean=true;
  reportTableHeaderForm:boolean=false;
  tableHeaders:any[]=[];
  tableHeaderForm!:FormGroup;
  constructor( private fb: FormBuilder,
    private service: IRServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {

    
    this.tableHeaderForm = this.fb.group({
      headerRow: this.fb.array([]),
    });
   }

  ngOnInit(): void {
    this.tableHeader.push(this.newRow());

    this.service.getAllReportTableHeader().subscribe(
      (data:any)=>{
      this.tableHeaders=data
      for(let i=0; i< this.tableHeaders.length;i++){
        this.tableHeaders.sort((a:any, b:any)=>{
          if(a.lineItem < b.lineItem) return -1;
          if(a.lineItem > b.lineItem) return 1;
          return 0;
        })
        console.log(this.tableHeaders,"sorted table Headers");
        
      }
      },
      (error: HttpErrorResponse) =>{
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `${error.error.developerMessage}`,
        });
        console.log(error);
      }
    )
  }

  addTableHeader(){
  this.reportTableDiv=false;
  this.reportTableHeaderForm=true;
  }

  onClickBack(){
    this.reportTableHeaderForm=false;
    this.reportTableDiv=true;
    for (
      let i = 1;
      i < this.tableHeaderForm.value.headerRow.length;
      i++
    ) {
      this.removeRow((i = 0));
    }
  }
  addHeader(){
    this.tableHeader.push(this.newRow());
  }

  get tableHeader(): FormArray {
    return this.tableHeaderForm.get('headerRow') as FormArray;
  }

  
  newRow(): FormGroup {
    return this.fb.group({
      reportTableHeader: '',
      description: '',
       });
  }
  removeRow(i: number){
    this.tableHeader.removeAt(i);
  }

  onClickSaveAll(){
    console.log(this.tableHeaderForm.value.headerRow, 'ramram');
    this.service
      .addReportTableHeaderFullObject(
        this.tableHeaderForm.value.headerRow
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          this.tableHeaderForm.reset();
          this.onClickBack();
          this.removeRow;
          this.ngOnInit();

          this.messageService.add({
            severity: 'success',
            summary: 'success',
            detail: 'Report Table Header Added..!!',
          });
         
        },
        (error: HttpErrorResponse) => {
          
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `${error.error.developerMessage}`,
            });
 

          this.ngOnInit();
        }
      );
  }
}
