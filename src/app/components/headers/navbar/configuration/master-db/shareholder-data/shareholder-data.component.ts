import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
import { LineItem } from './model/tableStructure';

interface TypesOfDoc {
  docName: string;
}
interface LineItemType {
  type: string;
}

interface ClientID {
  clientID: string;
}
interface ShareHolder {
  name: string;
}
interface Minorcode {
  minorcode: string;
}

@Component({
  selector: 'app-shareholder-data',
  templateUrl: './shareholder-data.component.html',
  styleUrls: ['./shareholder-data.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class ShareholderDataComponent implements OnInit {
  selectedTable!: string;
  topButtons: boolean = false;
  lineItemsTable: boolean = false;
  createLineItemTable = false;
  addLineItem: boolean = false;
  lineItem!: LineItem;
  lineItems: LineItem[] = [];

  lineItemForm!: FormGroup;

  clientIds!: ClientID[];
  shareholders!: ShareHolder[];
  minorcodes!: Minorcode[];

  selectedClientId!: string;
  selectedMinoreCode!: string;
  selectedShareholderName!: string;
  selectedDate!: string;


  portfolioIdPattern = "^[a-zA-Z0-9 ]{3,15}$";
  folioPattern = "^[a-zA-Z0-9 ]{3,15}$";
  holdingValuePattern = "^[0-9 ]{1,9}$";
  holdingPercentagePattern = "^(^100(\.0{1,9})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,9}).{0,15}?$)";

  constructor(
    private service: IRServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.clientIds = [
      { clientID: 'a123' },
      { clientID: 'a324' },
      { clientID: 'a432' },
      { clientID: 'a126' },
      { clientID: 'a653' },
      { clientID: 'a877' },
    ];

    this.shareholders = [
      { name: 'Akshay' },
      { name: 'Khirod' },
      { name: 'Rahul' },
      { name: 'Mahesh' },
    ];
    this.minorcodes = [
      { minorcode: 'PRO' },
      { minorcode: 'AIF' },
      { minorcode: 'CBO' },
      { minorcode: 'CMM' },
      { minorcode: 'FIC' },
      { minorcode: 'HUF' },
      { minorcode: 'INS' },
      { minorcode: 'MF' },
      { minorcode: 'NB' },
      { minorcode: 'NRI' },
      { minorcode: 'NRN' },
      { minorcode: 'PL' },
    ];
  }

  ngOnInit(): void {
    this.selectedTable = JSON.parse(JSON.stringify(localStorage.getItem('tableName')));

    this.lineItems = [];
    this.onClickCancle();

    console.log(this.selectedTable);

    this.service.getShareholderTableStructure().subscribe(
      (data: any) => {
        this.lineItems = data;
        console.log(this.lineItems, ' data...!!');
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong...');
        console.log(error);
      }
    );



    this.lineItemForm = new FormGroup({
      clientId: new FormControl(''),
      portfolioId: new FormControl('', [Validators.required,
      Validators.pattern(this.portfolioIdPattern)]),
      folio: new FormControl('', [Validators.required,
      Validators.pattern(this.folioPattern)]),
      shareholderName: new FormControl(''),
      holdingValue: new FormControl('', [Validators.required,
      Validators.pattern(this.holdingValuePattern)]),
      holdingPercentage: new FormControl('', [Validators.required,
      Validators.pattern(this.holdingPercentagePattern)]),
      minorCode: new FormControl(''),
      // tableName: new FormControl(''),
      date: new FormControl(''),
    });
  }

  addLneItem() {
    this.addLineItem = false;
    this.topButtons = true;
    this.lineItemsTable = false;
  }

  onClickSave() {
    // this.lineItemForm.value.tableName = this.selectedTable;
    // this.lineItemForm.value.date = this.selectedDate;

    console.log(this.lineItemForm.value, ' all data of shareholder');

    this.service.addShareholderData(this.lineItemForm.value).subscribe(
      (data: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'success',
          detail: `Shareholder data addedd successfully`,
        });
        this.selectedDate="";
        this.lineItemForm.reset();
        this.onClickCancle();
        this.ngOnInit();
      },
      (error: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'success',
          detail: `Shareholder data addedd successfully`,
        });
        this.onClickCancle();
        this.ngOnInit();

      }
    );

  }


  onClickCancle() {
    this.lineItemsTable = true;
    this.topButtons = false;
    this.addLineItem = true;
    
  }
  onClickBack(){
    this.lineItemsTable = true;
    this.topButtons = false;
    this.addLineItem = true;
    this.lineItemForm.reset();
  }
}

// validators values
// ,
//   ,
//     ,[Validators.required,
      //  Validators.pattern(this.holdingValuePattern)]
//       , [Validators.required,
//         Validators.pattern(this.holdingPercentagePattern)],
//         , Validators.required
