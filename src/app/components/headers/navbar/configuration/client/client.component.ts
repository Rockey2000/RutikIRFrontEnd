import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
interface AnalystId {
  id: string;
}
interface masterTable {
  tableContent: string;
}
interface Client {
  totalClient: string;
}
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class ClientComponent implements OnInit {
  clientLineItemForm!: FormGroup;
  lineItemTable: boolean = true;
  lineItemForm: boolean = false;

  analystIds: AnalystId[] = [];

  incomeStatementLineItem: any[] = [];
  balanceSheetLineItem: any[] = [];
  cashFlowLineItem: any[] = [];

  allMasterHeaderLineItems: any[] = [];

  analystLineItemForm!: FormGroup;
  addLineItem: any[] = [];

  value!: masterTable[];
  selectedValue!: masterTable;
  client: Client[] = [];
  analystLineItemNamePattern = '^[a-zA-Z ]{3,15}$';
  analystTableHeaderNamePattern = '^[a-zA-Z0-9. /]{3,50}$';
  id: any;
  updateClientLineItem!: string;
  updateClientTableHeaderName!: string;
  masterTableSource!:string;
  ClientName!:string;
  constructor(
    private service: IRServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private fb: FormBuilder
  ) {

    this.value = [
      { tableContent: 'Income Statement' },
      { tableContent: 'Balance Sheet' },
      { tableContent: 'Cash Flow' },
    ];
    this.client = [
      { totalClient: 'Trio' },
      { totalClient: 'Minda' },
      { totalClient: 'TechSoft' },
      { totalClient: 'MindScript' },
      { totalClient: 'Roxiller' },
      { totalClient: 'Idea' },
      { totalClient: 'Voot' },
      { totalClient: 'Trello' },
    ];

    this.clientLineItemForm = this.fb.group({
      clientLineItemRow: this.fb.array([this.newRow()]),
    });

  }
  tabmenus: boolean = true;
  ngOnInit(): void {
    // this.service.emitDialogFormData('done');

    localStorage.removeItem('tableName');
    this.service.dialogFormClientSubscriber$.subscribe((data: any) => {
      console.log(data, '!!');
      this.tabmenus = !this.tabmenus;
    });
    console.log(this.tabmenus, 'hello tabmenus');

    this.service.getClientLineItems().subscribe(
      (data: any) => {
        this.addLineItem = data;
        console.log(this.addLineItem);
        this.tabmenus = true;
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong...!!');
      }
    );
  }
  get analystLineItem(): FormArray {
    return this.clientLineItemForm.get('clientLineItemRow') as FormArray;
  }

  newRow(): FormGroup {
    return this.fb.group({
      clientName: '',
      masterTableSource: '',
      clientLineItemName: '',
      clientTableHeaderName: '',
    });
  }
  onClickAdd() {
    // this.lineItemTable = false;
    // this.lineItemForm = true;
    // localStorage.setItem('outertabmenu','true');
    //  this.service.emitDialogFormData("done");
    this.router.navigate([
      '/document/nav/config/addAndMapingClientLineItems/addClientLineItem',
    ]);
  }

  onClickAddClient(){
    console.log("clicked");
    
    this.router.navigate([
      '/document/nav/config/clientSetup',
    ]);
  }
  onClickBack() {
    this.lineItemTable=true;
    this.lineItemForm=false;

    // this.service.emitDialogFormData('true');
  }

  editProduct(data:any){
  console.log(data,"after click table values ");
  this.lineItemTable=false;
  this.lineItemForm=true;
 
  this.id=data.clientLineId;
  this.updateClientLineItem=data.clientLineItemName;
  this.updateClientTableHeaderName=data.clientTableHeaderName;
  this.masterTableSource=data.masterTableSource;
  this.ClientName=data.clientName;

  this.clientLineItemForm.patchValue({
    clientLineItemRow : [{
      clientName: this.ClientName,
      masterTableSource: this.masterTableSource,
      clientLineItemName: this.updateClientLineItem,
      clientTableHeaderName: this.updateClientTableHeaderName
    }]
  });

  }

  onClickSaveAll(){
    const updatedData = {
      clientLineId: this.id,
      clientName: this.clientLineItemForm.value.clientLineItemRow[0].clientName,
      masterTableSource: this.clientLineItemForm.value.clientLineItemRow[0].masterTableSource,
      clientLineItemName: this.clientLineItemForm.value.clientLineItemRow[0].clientLineItemName,
      clientTableHeaderName: this.clientLineItemForm.value.clientLineItemRow[0].clientTableHeaderName
    };

    console.log(updatedData,"on click save updated data");
    this.service.updateClientLineItem(updatedData).subscribe(
      (data: any) => {
        console.log(data);
        this.ngOnInit();
        this.messageService.add({
          severity: 'success',
          summary: 'success',
          detail: 'Client Line Item Updated..!!',
        });

        this.onClickBack();
      },
      (error: HttpErrorResponse) => {
       
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `${error.error.developerMessage}`,
          });
 
        // alert(error);
        this.ngOnInit();
        this.onClickBack();
      }
    );
  }
}
