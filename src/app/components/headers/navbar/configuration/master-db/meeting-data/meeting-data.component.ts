import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, Pipe, PipeTransform } from '@angular/core';
import { validateBasis } from '@angular/flex-layout';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
import { LineItem } from './model/tableStructure';
import { DatePipe } from '@angular/common';
import { LoadingSpinnerService } from 'src/app/loading-spinner.service';
import { pipe } from 'rxjs';
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
  providers: [ConfirmationService, MessageService, DatePipe],
})
export class MeetingDataComponent implements OnInit {
  selectedTable!: string;

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

  customDate!: Date;
  today!: Date;
  orgnisationPattern = '^[a-zA-Z0-9. /]{3,50}$';
  subjectPattern = '^[a-zA-Z ]{3,50}$';
  locationPattern = '^[a-zA-Z0-9., /]{3,250}$';
  commentPattern = '^[a-zA-Z ]{3,255}$';
  participantsPattern = '^[a-zA-Z0-9., /]{3,255}$';
  feedbackPattern = '^[a-zA-Z ]{3,255}$';
  timePattern = '^[1-9]|1[0-2]):([0-5][0-9])s(AM|PM)$';
  constructor(
    private lodSpinner: LoadingSpinnerService,
    private service: IRServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private datePipe: DatePipe
  ) {
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
    console.log(this.today, 'today date');

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

  isLoading: boolean = false;
  ngOnInit(): void {
    this.lodSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });

    this.lodSpinner.isLoading.next(true);

    this.selectedTable = JSON.parse(
      JSON.stringify(localStorage.getItem('tableName'))
    );

    this.lineItems = [];
    this.onClickCancle();

    this.service.getMeetingTableStructure().subscribe(
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
      // dateString: new FormControl('03-02-2023') ,
      dateString: new FormControl('', Validators.required),
      organisation: new FormControl('', [
        Validators.required,
        Validators.pattern(this.orgnisationPattern),
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      broker: new FormControl(''),
      subject: new FormControl('', [
        Validators.required,
        Validators.pattern(this.subjectPattern),
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      location: new FormControl('', [
        Validators.required,
        Validators.pattern(this.locationPattern),
        Validators.minLength(3),
        Validators.maxLength(250),
      ]),
      status: new FormControl(''),
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      stakeholderType: new FormControl(''),
      meetingType: new FormControl(''),
      comments: new FormControl('', [
        Validators.required,
        Validators.pattern(this.commentPattern),
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      participants: new FormControl('', [
        Validators.required,
        Validators.pattern(this.participantsPattern),
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      feedback: new FormControl('', [
        Validators.required,
        Validators.pattern(this.feedbackPattern),
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
    });
  }

  addLneItem() {
    this.addLineItem = false;
    this.topButtons = true;
    this.lineItemsTable = false;
  }

  selectedTableName!: string;

  onClickSave() {
    this.lodSpinner.isLoading.next(true);
    this.lineItemForm.value.tableName = this.selectedTable;

    if (this.lineItemForm.value.startTime === this.lineItemForm.value.endTime) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: `Meeting start time and end time should not be same...!!`,
      });
      this.lodSpinner.isLoading.next(false);
    } else {
      this.service.addMeetingData(this.lineItemForm.value).subscribe(
        (data: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'success',
            detail: `Meeting Scheduled successfully`,
          });
          this.lodSpinner.isLoading.next(false);
          this.onClickCancle();
          this.lodSpinner.isLoading.next(false);

          this.ngOnInit();
        },
        (error: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Error while adding meeting details...!!`,
          });
          this.lodSpinner.isLoading.next(false);

          this.onClickCancle();
        }
      );
    }
    console.log(this.lineItemForm.value, ' all data of shareholder');
  }

  onClickCancle() {
    this.lineItemsTable = true;
    this.topButtons = false;
    this.addLineItem = true;
    // this.lineItemForm.reset();
  }
  onClickBack() {
    this.lineItemForm.reset();
    this.lineItemsTable = true;
    this.topButtons = false;
    this.addLineItem = true;
  }

  meetingData() {
    this.service.masterTableName;
    console.log(this.service.masterTableName, 'master table name');

    let AnalystDetails = 'Meeting Data';
    this.service.downloadLineItemSheet(AnalystDetails).subscribe(
      (x: any) => {
        var newBlob = new Blob([x], { type: 'application/vnd.ms-excel' });
        const data = window.URL.createObjectURL(newBlob);

        var link = document.createElement('a');
        link.href = data;
        link.download = 'MeetingData.xlsx';

        link.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Download Successful',
        });
        console.log('file Downloded');
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong');
      }
    );
  }

  onDateSelect(selectedDate: any) {
    const utcDate = new Date(
      this.datePipe.transform(selectedDate, 'yyyy-MM-dd') + 'T00:00:00Z');
    const dateStringFormControl = this.lineItemForm.get('dateString');
    console.log(utcDate, 'converted date');
    dateStringFormControl?.setValue(utcDate);
  }
}
