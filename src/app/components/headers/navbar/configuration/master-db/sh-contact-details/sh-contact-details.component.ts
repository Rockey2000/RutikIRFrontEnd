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
  selector: 'app-sh-contact-details',
  templateUrl: './sh-contact-details.component.html',
  styleUrls: ['./sh-contact-details.component.css'],
})
export class ShContactDetailsComponent implements OnInit {
  selectedTable!:string;
  docList: TypesOfDoc[] = [];
  lineItemTypes: LineItemType[] = [];
  selectedDoc!: string;
  selectedLineItemType!: string;
  topButtons: boolean = false;
  lineItemsTable: boolean = false;
  createLineItemTable = false;
  addLineItem: boolean = false;
  lineItem!: LineItem;
  lineItems: LineItem[] = [];

  lineItemForm!: FormGroup;
  sample: boolean = true;
  addlineItemTable: boolean = false;

  clientIds!: ClientID[];
  shareholders!: ShareHolder[];
  minorcodes!: Minorcode[];

  selectedClientId!: string;
  selectedMinoreCode!: string;
  selectedShareholderName!: string;

  namePattern = "^[a-zA-Z ]{3,15}$";
  addressPattern = "^[a-zA-Z0-9._%+-/:, ]{3,50}$";
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  contactPattern = "^((\\+91-?)|0)?[0-9]{1}[0-9]{9}$"; 
  pocPattern = "^[a-zA-Z ]{3,15}$";



  constructor(
    private service: IRServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
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
    this.selectedTable=JSON.parse(JSON.stringify(localStorage.getItem('tableName')));

    this.lineItems = [];
    this.addLineItem = true;
    this.lineItemsTable = true;
    this.topButtons = false;

    this.sample = true;
    console.log(this.selectedTable);

    this.service.getshareHolderContactTableData().subscribe(
      (data: any) => {
        console.log(data);
        this.lineItems = data;
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong...');
        console.log(error);
      }
    );

    this.lineItemForm = new FormGroup({
      name: new FormControl('', [Validators.required,
      Validators.pattern(this.namePattern)]),
      poc: new FormControl('', [Validators.required,
      Validators.pattern(this.pocPattern)]),
      address: new FormControl('', [Validators.required,
      Validators.pattern(this.addressPattern)]),
      email: new FormControl('', [Validators.required,
      Validators.pattern(this.emailPattern)]),
      contact: new FormControl('', [Validators.required,
      Validators.pattern(this.contactPattern)]),
      minorcode: new FormControl(''),
      tableName: new FormControl(''),
    });
  }

  addLneItem() {
    this.addLineItem = false;
    this.topButtons = true;
    this.lineItemsTable = false;
  }

  newRow() {
    this.createLineItemTable = true;
    this.lineItemsTable = false;

    return this.passengerForm;
  }
  selectedTableName!: string;
  passengerForm = [
    {
      id: '',
      lineItemName: '',
      alternativeName: '',
      lineItemType: '',
    },
  ];

  addForm() {
    this.passengerForm.push({
      id: '',
      lineItemName: '',
      alternativeName: '',
      lineItemType: '',
    });
  }

  onClickSave() {
    this.lineItemForm.value.tableName = this.selectedTable;
    console.log(this.lineItemForm.value, ' all data of shareholder');

    this.service.addShareholderContactData(this.lineItemForm.value).subscribe(
      (data: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Contact details Added`,
        });
        this.onClickCancle();
        this.ngOnInit();
      },
      (error: HttpErrorResponse) => {
        if (error.status===406) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Error',
            detail: 'Duplicate Email and Mobile No. Not Allowed..!!',
          });
        } else {
        this.messageService.add({
          severity: 'Error',
          summary: 'Error',
          detail: `Something went wrong while adding user..!!`,
        });
      }
        this.onClickCancle();
        this.ngOnInit();
      }
    );
  }

  onClickCancle() {
    this.lineItemsTable = true;
    this.topButtons = false;
    this.addLineItem = true;
    this.lineItemForm.reset();
  }
}
