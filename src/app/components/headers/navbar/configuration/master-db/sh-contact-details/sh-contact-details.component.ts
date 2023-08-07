 import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
import { LoadingSpinnerService } from 'src/app/loading-spinner.service';
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

  namePattern =  "^[a-zA-Z0-9 ]{3,255}$"
  // addressPattern = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{}|\\:;"'<>,.?\/\s]+$/
  addressPattern = "^[a-zA-Z0-9\s#@$&* .,'&()/\\-]+$"
  // emailPattern = '^[A-Za-z0-9._%+-]+@[A-Za-z]+[.]{1}[A-Za-z]{2,4}$';
  emailPattern = '^[A-Za-z0-9._%+-]+[@]{1}[A-Za-z0-9.-]+[.]{1}[A-Za-z]{2,4}$';
  contactPattern = '^((\\+91-?)|0)?[5,6,7,8,9]{1}[0-9]{9}$';
  pocPattern = "^[a-zA-Z0-9 ]{3,255}$";



  constructor(
    private lodSpinner : LoadingSpinnerService,
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
  isLoading: boolean = false;
  ngOnInit(): void {

    this.lodSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });

    this.lodSpinner.isLoading.next(true);
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
        this.lodSpinner.isLoading.next(false);
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong...');
        console.log(error);
      }
    );

    this.lineItemForm = new FormGroup({
      name: new FormControl('', [Validators.required,
      Validators.pattern(this.namePattern),
      Validators.minLength(3),
      Validators.maxLength(255)],
      ),
      poc: new FormControl('', [Validators.required,
      Validators.pattern(this.pocPattern),
      Validators.minLength(3),
      Validators.maxLength(255)]),
      address: new FormControl('', [Validators.required,
      Validators.pattern(this.addressPattern),
      Validators.minLength(3),
      Validators.maxLength(255)]),
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

    this.lodSpinner.isLoading.next(true);
    this.lineItemForm.value.tableName = this.selectedTable;
    console.log(this.lineItemForm.value, ' all data of shareholder');

    this.service.addShareholderContactData(this.lineItemForm.value).subscribe(
      (data: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Contact details Added`,
        });
        this.lodSpinner.isLoading.next(false); 
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
          severity: 'error',
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
