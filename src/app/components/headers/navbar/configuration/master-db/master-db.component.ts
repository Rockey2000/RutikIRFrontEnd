import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';

interface TypesOfDoc {
  docName: string;
}

@Component({
  selector: 'app-master-db',
  templateUrl: './master-db.component.html',
  styleUrls: ['./master-db.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class MasterDbComponent implements OnInit {
  docList: TypesOfDoc[] = [];
  selectedTableName:string="Balance Sheet";

  table:boolean=false;
  constructor(
    private service: IRServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router:Router
  ) {
    this.docList = [
      { docName: 'Income Statement' },
      { docName: 'Balance Sheet' },
      { docName: 'Cash Flow' },
      { docName: 'Financial Ratios' },
      { docName: 'Shareholder Data' },
      { docName: 'Shareholder Contact Details' },
      { docName: 'Shareholder Meeting' },
    ];
  }

  ngOnInit(): void {
    localStorage.setItem('tableName',this.selectedTableName)

    this.table=true;
    this.router.navigate(['/document/nav/config/master-db/balance'])
  }


  onSelectTable() {

    localStorage.setItem('tableName',this.selectedTableName)
    
  }
  onClickTable(){
    // this.table=false;
    localStorage.setItem('tableName',this.selectedTableName)

    if(this.selectedTableName==="Balance Sheet")
    {
      this.router.navigate(['/document/nav/config/master-db/balance-sheet'])
    }
    else if(this.selectedTableName==="Income Statement")
    {
      this.router.navigate(['/document/nav/config/master-db/income'])
    }
    else if(this.selectedTableName==="Cash Flow")
    {
      this.router.navigate(['/document/nav/config/master-db/cash-flow'])
    }
    else if(this.selectedTableName==="Shareholder Data")
    {
      this.router.navigate(['/document/nav/config/master-db/shareholder'])
    }
    else if(this.selectedTableName==="Shareholder Contact Details")
    {
      this.router.navigate(['/document/nav/config/master-db/contact'])
    }
    else if(this.selectedTableName==="Shareholder Meeting")
    {
      this.router.navigate(['/document/nav/config/master-db/meeting'])
    }
    else if(this.selectedTableName==="Financial Ratios")
    {
      this.router.navigate(['/document/nav/config/master-db/finacial-ratio'])
    }
  }
}
