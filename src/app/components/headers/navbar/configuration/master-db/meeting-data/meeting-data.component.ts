import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { validateBasis } from '@angular/flex-layout';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
import { LineItem } from './model/tableStructure';

interface MeetingWith {
  meetingWith: string;
}
interface Status {
  status: string;
}

interface StakeholderType {
  stakeholderType: string;
}
interface MeetingType {
  meetingType: string;
}

@Component({
  selector: 'app-meeting-data',
  templateUrl: './meeting-data.component.html',
  styleUrls: ['./meeting-data.component.css'],
  providers: [ConfirmationService, MessageService],

})
export class MeetingDataComponent implements OnInit {
  selectedTable!:string;

  meetingsWith: MeetingWith[] = [];
  stakeholders: StakeholderType[] = [];

  topButtons: boolean = false;
  lineItemsTable: boolean = false;
  createLineItemTable = false;
  addLineItem: boolean = false;
  lineItem!: LineItem;
  lineItems: LineItem[] = [];

  lineItemForm!: FormGroup;
  addlineItemTable: boolean = false;

  status!: Status[];
  meetingTypes!: MeetingType[];

  selectedMeetingWith!: string;
  selectedStatus!: string;
  selectedStakeholderType!: string;
  selectedMeetingType!: string;

  orgnisationPattern = "^[a-zA-Z0-9. /]{3,15}$";
  subjectPattern = "^[a-zA-Z ]{3,100}$";
  locationPattern = "^[a-zA-Z0-9., /]{3,250}$";
  commentPattern = "^[a-zA-Z ]{3,155}$";
  participantsPattern = "^[a-zA-Z0-9., /]{3,100}$";
  feedbackPattern = "^[a-zA-Z ]{3,15}$";

  constructor(
    private service: IRServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.meetingsWith = [{ meetingWith: 'Direct' }, { meetingWith: 'IIFL' }];

    this.meetingTypes = [
      { meetingType: 'Conference call' },
      { meetingType: '1-on-1' },
      { meetingType: 'Group Meeting' },
    ];

    this.status = [
      { status: 'Done' },
      { status: 'Cancelled' },
      { status: 'Scheduled' },
    ];
    this.stakeholders = [
      { stakeholderType: 'BUY' },
      { stakeholderType: 'SELL' },
    ];
  }

  ngOnInit(): void {
    this.selectedTable=JSON.parse(JSON.stringify(localStorage.getItem('tableName')));

    this.lineItems = [];
    this.onClickCancle ();


    this.service.getMeetingTableStructure().subscribe(
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
      date: new FormControl(''),
      organisation: new FormControl('', [Validators.required,
      Validators.pattern(this.orgnisationPattern)]),  
      broker: new FormControl(''),
      subject: new FormControl('', [Validators.required,
      Validators.pattern(this.subjectPattern)]),
      location: new FormControl('', [Validators.required,
      Validators.pattern(this.locationPattern)]),
      status: new FormControl(''),
      startTime: new FormControl(''),
      endTime: new FormControl(''),
      stakeholderType: new FormControl(''),
      meetingType: new FormControl(''),
      comments: new FormControl('', [Validators.required,
      Validators.pattern(this.commentPattern)]),
      participants: new FormControl('', [Validators.required,
      Validators.pattern(this.participantsPattern)]),
      feedback: new FormControl('', [Validators.required,
      Validators.pattern(this.feedbackPattern)]),
    });
  }

  addLneItem() {
    this.addLineItem = false;
    this.topButtons = true;
    this.lineItemsTable = false;
  }

  selectedTableName!: string;

  onClickSave() {
    this.lineItemForm.value.tableName = this.selectedTable;

    console.log(this.lineItemForm.value, ' all data of shareholder');

    this.service.addMeetingData(this.lineItemForm.value).subscribe(
      (data: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'success',
          detail: `Meeting data addedd successfully`,
        });
        this.onClickCancle();
        this.ngOnInit();
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'success',
          summary: 'success',
          detail: `Meeting data addedd successfully`,
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
    // this.lineItemForm.reset();
    
  }
  onClickBack(){
    this.lineItemForm.reset();
    this.lineItemsTable = true;
    this.topButtons = false;
    this.addLineItem = true;
  }
}
