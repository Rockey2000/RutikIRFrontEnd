import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IRServiceService } from 'src/app/ir-service.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LoadingSpinnerService } from 'src/app/loading-spinner.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { meetingData } from './meetData';
import { NgModel } from '@angular/forms';
import { ay } from '@fullcalendar/core/internal-common';

interface MeetingType {
  meetingType: string;
}
@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css'],
  providers: [ConfirmationService, MessageService, DatePipe, NgModel],
})
export class SchedulerComponent implements OnInit {
  tabmenus: boolean = true;
  SearchOptions!: any[];
  SelectedValue: any;
  meetingData: any[] = [];
  selectedButton: string = '';
  scheduleTable: boolean = false;
  completeTable: boolean = false;
  newRequest: boolean = false;

  selectedEvent: any;
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    weekends: true,
    events: [],
    eventClick: this.handleEventClick.bind(this),
  };
  meetingDataTable: boolean = true;
  meetingDialog: boolean = false;
  meetingUpdate: boolean = false;
  allUsers: any[] = [];
  meetingTypes!: MeetingType[];
  emailOfUsers: any[] = [];
  updateMeetForm!: FormGroup;
  addEmail!: FormGroup;
  checked!: boolean;
  flagAdding!: boolean;
  meetData!: meetingData;
  meetId!: string;
  selectedParticipants: any[] = [];
  meetingRecording: boolean = false;

  titlepattern = '^[a-zA-Z ]{3,155}$';
  agendapattern = '^[a-zA-Z ]{3,155}$';
  emailPattern = '^[A-Za-z0-9._%+-]+[@]{1}[A-Za-z0-9.-]+[.]{1}[A-Za-z]{2,4}$';

  scheduledMeetings: any[] = [];
  completedMeetings: any[] = [];
  constructor(
    private irService: IRServiceService,
    private router: Router,
    private datePipe: DatePipe,
    private lodSpinner: LoadingSpinnerService,
    private service: IRServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private ngModel: NgModel
  ) {
    this.SearchOptions = [
      { name: 'Scheduled', value: 1 },
      { name: 'Completed', value: 2 },
      { name: 'New Request', value: 3 },
    ];

    this.meetingTypes = [
      { meetingType: 'Microsoft Teams' },
      { meetingType: 'Google Meet' },
    ];
  }
  isLoading: boolean = false;
  ngOnInit() {
    this.lodSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });

    this.irService.dialogFormDataSubscriber$.subscribe((data: any) => {
      console.log(data, '!!');
      this.tabmenus = !this.tabmenus;
    });
    this.lodSpinner.isLoading.next(true);
    this.selectedButton = 'scheduled';
    this.scheduleTable = true;

    this.irService.getScheduledMeetingData().subscribe(
      (data: any) => {
        console.log(data, 'data');
        this.meetingData = data;
        this.lodSpinner.isLoading.next(false);
        console.log(this.meetingData, 'hello meeting');
        this.meetingData.map((item: any) => {
          if (Array.isArray(item.participant)) {
            item.participant = item.participant
              .map((email: string) => email.replace(/^\[|\]$/g, ''))
              .join(', ');
          }
          return item;
        });
        this.meetingData.forEach((meeting: any) => {
          if (meeting.status === 'schedule') {
            this.scheduledMeetings.push(meeting);
          } else if (meeting.status === 'completed') {
            this.completedMeetings.push(meeting);
          }

          // console.log(this.scheduledMeetings.push(meeting),"schedule meeting");
          // console.log(this.completedMeetings,"completedMeetings");
          
        });
        // Transform the meeting data into the format required by FullCalendar
        const events = this.meetingData.map((meeting: any) => ({
          title: meeting.title,
          start: meeting.startTime,
          end: meeting.endTime,
          // url:meeting.joinUrl,
          participant: meeting.participant,
          agenda: meeting.agenda,
          meetingUrl: meeting.joinUrl,
          // Assuming the meeting start date is provided
          // You can also specify other properties like 'end', 'url', 'backgroundColor', etc.
        }));
        console.log(events, 'events');

        // Update the events property with the transformed meeting data
        this.calendarOptions.events = events;
      },
      (error: HttpErrorResponse) => {
        console.log(error.error, 'hello error');
      }
    );
    this.service.getuUser().subscribe(
      (data: any) => {
        // console.log('alert');
        this.allUsers = data;
        console.log(this.allUsers, '............akkiii.....');
        this.lodSpinner.isLoading.next(false);
        const uniqueData = new Set(this.allUsers);
        this.emailOfUsers = Array.from(uniqueData); // Convert the Set back to an array
        console.log(this.emailOfUsers, 'Data for dropdown without duplicates');
        const uniqueEmail = new Set(
          this.emailOfUsers.map((item) => item.email)
        );
        this.emailOfUsers = Array.from(uniqueEmail).map((email) => ({
          email,
        }));
        console.log(this.emailOfUsers, 'emailofusera');
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong');
      }
    );

    this.updateMeetForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.pattern(this.titlepattern),
        Validators.minLength(3),
        Validators.maxLength(155),
      ]),
      meetingDate: new FormControl('', [Validators.required]),
      agenda: new FormControl('', [
        Validators.required,
        Validators.pattern(this.agendapattern),
        Validators.minLength(3),
        Validators.maxLength(155),
      ]),
      startTime: new FormControl(''),
      endTime: new FormControl(''),
      meetingType: new FormControl('', [Validators.required]),
      participant: new FormControl('', [Validators.required]),
      recordAutomatically: new FormControl(''),
    });

    this.addEmail = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailPattern),
      ]),
    });
  }

  handleEventClick(clickedEvent: any) {
    this.meetingDialog = true;
    console.log(clickedEvent, 'clicked event');
    const customEventData = clickedEvent.event.extendedProps;
    // Store the clicked event details in the selectedEvent variable
    this.selectedEvent = {
      title: clickedEvent.event.title,
      start: clickedEvent.event.start,
      // Add more properties as needed
      ...customEventData,
    };

    // You can perform additional actions here, such as opening a modal dialog, etc.

    // For example, to log the selected event details:
    console.log(this.selectedEvent);
  }

  gotoMeet(data: any) {
    console.log(data, 'of Meeting');

    window.open(data);
  }
  selectButton(button: string) {
    this.selectedButton = button;
    console.log(this.selectedButton, 'selected button');

    if (this.selectedButton === 'scheduled') {
      this.scheduleTable = true;
    } else {
      this.scheduleTable = false;
    }

    if (this.selectedButton === 'completed') {
      this.completeTable = true;
    } else {
      this.completeTable = false;
    }

    if (this.selectedButton === 'newRequest') {
      this.newRequest = true;
    } else {
      this.newRequest = false;
    }
  }

  createNewMeet() {
    console.log('clicked');
    this.router.navigate(['/document/nav/meetings/newMeet']);
  }
  onClickCancel() {}

  onClickBack() {
    this.meetingUpdate = false;
    this.meetingDataTable = true;
  }

  // editMeeting(product: any) {
  //   console.log(product, 'hello meeting data');
  //   this.meetingDataTable=false;
  //   this.meetingUpdate=true;
  //   this.meetData=product;
  //   console.log(this.meetData,"meet data for edit");

  //   this.updateMeetForm.get('title')?.patchValue(
  //     this.meetData.title
  //   );
  //   this.updateMeetForm.get('meetingDate')?.patchValue(
  //     this.meetData.meetingDate
  //   );
  //   this.updateMeetForm.get('agenda')?.patchValue(
  //     this.meetData.agenda
  //   );
  //   this.updateMeetForm.get('startTime')?.patchValue(
  //     this.meetData.startTime
  //   );
  //   this.updateMeetForm.get('endTime')?.patchValue(
  //   this.meetData.endTime
  //   );
  //   this.updateMeetForm.get('meetingType')?.patchValue(
  //     this.meetData.meetingType
  //   );
  //   this.updateMeetForm.get('participant')?.patchValue(
  //     this.meetData.participant

  //   );
  //   this.updateMeetForm.get('recordAutomatically')?.patchValue(
  //     this.meetData.recordAutomatically
  //   );
  // }

  //   editMeeting(meetingId: any) {
  // console.log(meetingId,"meetingId");

  // this.irService.getMeetingDataById(meetingId).subscribe(
  //   (data: any) => {
  //     this.meetData= data;
  //     console.log(this.meetData,"whole meetingData");

  //     if (this.meetData.recordAutomatically === 'true') {
  //       this.checked = true;
  //     } else {
  //       this.checked = false;
  //     }

  //     console.log(this.meetData, 'user that will get edited');
  //     this.meetId = this.meetData.meetingSheduleId;
  //     console.log(this.meetId,this.meetData.participant,"meet id");
  //     this.updateMeetForm.get("title")?.patchValue(this.meetData.title);
  //     this.updateMeetForm.get("agenda")?.patchValue(this.meetData.agenda);
  //     this.updateMeetForm.get("participant")?.patchValue(this.meetData.participant);
  //     this.updateMeetForm.get("meetingDate")?.patchValue(this.meetData.meetingDate);
  //     this.updateMeetForm.get("startTime")?.patchValue(this.meetData.startTime);
  //     this.updateMeetForm.get("endTime")?.patchValue(this.meetData.endTime);
  //     this.updateMeetForm.get("meetingType")?.patchValue(this.meetData.meetingType);
  //     this.updateMeetForm.get("recordAutomatically")?.patchValue(this.meetData.recordAutomatically);

  //     this.meetingUpdate=true;
  //     this.meetingDataTable=false;

  //   },
  //   (error: HttpErrorResponse) => {
  //     this.messageService.add({
  //       severity: 'Danger',
  //       summary: 'Error',
  //       detail: 'Something went wrong while adding user..!!',
  //     });
  //   }
  // );
  //   }
  meetDataEmail: any[] = [];
  differentValues: any[] = [];
  differentValuesAsString!: string;
  meetingId: any;
  eventId: any;
  joinUrl: any;
  editMeeting(meetingId: any) {
    console.log(meetingId, 'meetingId');
    this.router.navigate(['/document/nav/meetings/newMeet/'+meetingId]);
    // this.irService.getMeetingDataById(meetingId).subscribe(
    //   (data: any) => {
    //     this.meetData = data;
    //     console.log(this.meetData, 'whole meetingData');

   
    //     this.meetId = this.meetData.meetingSheduleId;
    //     console.log(this.meetId, this.meetData.participant, 'meet id');
    //     this.meetingId = this.meetData.meetingId;
    //     this.eventId = this.meetData.eventId;
    //     this.joinUrl = this.meetData.joinUrl;
    //     this.updateMeetForm.get('title')?.patchValue(this.meetData.title);
    //     this.updateMeetForm.get('agenda')?.patchValue(this.meetData.agenda);
    
    //     this.updateMeetForm
    //       .get('participant')
    //       ?.patchValue(this.meetData.participant);
    //     this.meetDataEmail.push(this.meetData.participant);
    //     console.log(this.meetDataEmail, 'external Email');

    //     this.updateMeetForm
    //       .get('meetingDate')
    //       ?.patchValue(this.meetData.meetingDate);
    //     this.updateMeetForm
    //       .get('meetingType')
    //       ?.patchValue(this.meetData.meetingType);
    //       this.meetingType(this.meetData.meetingType);
    //     this.updateMeetForm
    //       .get('recordAutomatically')
    //       ?.patchValue(this.meetData.recordAutomatically);


    //     const startTime = new Date(this.meetData.startTime);
    //     const formattedStartTime = this.formatTime(startTime);
    //     this.updateMeetForm.get('startTime')?.patchValue(formattedStartTime);

    //     const endTime = new Date(this.meetData.endTime);
    //     const formattedEndTime = this.formatTime(endTime);
    //     this.updateMeetForm.get('endTime')?.patchValue(formattedEndTime);
    //     const emails: any[] = Object.values(this.emailOfUsers).map(
    //       (obj) => obj.email
    //     );
    //     console.log(emails);

    //     //
    //     for (let index = 0; index < this.meetDataEmail.length; index++) {
    //       this.meetDataEmail[index].forEach((value: any) => {
    //         if (!emails.includes(value)) {
    //           this.differentValues.push(value);
    //         }
    //       });
    //     }


    //     this.differentValuesAsString = this.differentValues.join(', ');

    //     console.log(this.differentValuesAsString, 'different string');

    //     this.meetingUpdate = true;
    //     this.meetingDataTable = false;
    //   },
    //   (error: HttpErrorResponse) => {
    //     this.messageService.add({
    //       severity: 'Danger',
    //       summary: 'Error',
    //       detail: 'Something went wrong while adding user..!!',
    //     });
    //   }
    // );

  }

  formatTime(time: Date): string {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  onselectStartTime(selectedTime: any) {
    const start = new Date(selectedTime);
    const startTime = this.formatTime(start);
    const timeString = this.updateMeetForm.get('startTime');
    timeString?.setValue(startTime);
    console.log(startTime, 'start time');
    // Set startTime to the corresponding form control or use it as needed
  }

  onselectEndTime(selectedTime: any) {
    const end = new Date(selectedTime);
    const endTime = this.formatTime(end);
    const timeString = this.updateMeetForm.get('endTime');
    timeString?.setValue(endTime);
    console.log(endTime, 'end time');
    // Set endTime to the corresponding form control or use it as needed
  }

  onDateSelect(selectedDate: any) {
    const utcDate = this.datePipe.transform(selectedDate, 'dd/MM/yyyy');
    const dateStringFormControl = this.updateMeetForm.get('meetingDate');
    console.log(utcDate, 'converted date');
    dateStringFormControl?.setValue(utcDate);
  }
  // onselectStartTime(selectedTime: any) {
  //   const start = new Date(selectedTime);
  //   const hours = start.getHours();
  //   const minutes = start.getMinutes();
  //   const startTime = `${hours.toString().padStart(2, '0')}:${minutes
  //     .toString()
  //     .padStart(2, '0')}`;
  //   const timeString = this.updateMeetForm.get('startTime');
  //   timeString?.setValue(startTime);
  //   console.log(startTime, 'start time');
  //   // Set startTime to the corresponding form control or use it as needed
  // }
  // onselectEndTime(selectedTime: any) {
  //   const end = new Date(selectedTime);
  //   const hours = end.getHours();
  //   const minutes = end.getMinutes();
  //   const endTime = `${hours.toString().padStart(2, '0')}:${minutes
  //     .toString()
  //     .padStart(2, '0')}`;
  //   const timeString = this.updateMeetForm.get('endTime');
  //   timeString?.setValue(endTime);
  //   console.log(endTime, 'end time');
  //   // Set endTime to the corresponding form control or use it as needed
  // }

  handleChange(e: any) {
    this.checked = e.checked;
  }
  onClickAddEmail() {
    this.flagAdding = true;
  }
  onClickCancle1() {
    this.addEmail.reset();
  }
  options: { email: string }[] = [];
  onClickSaveEmail() {
    console.log(this.addEmail.value, 'email added');

    this.emailOfUsers.push(this.addEmail.value);
    console.log(this.emailOfUsers, 'all emails');
    this.flagAdding = false;
    this.onClickCancle1();
  }
  onClickDelete() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Delete this Meeting?',
      accept: () => {
        this.irService.deleteScheduledMeeting(this.meetId).subscribe(
          (data: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Meeting deleted successfully',
            });
            this.ngOnInit();
            window.location.reload();
          },
          (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'danger',
              summary: 'Error',
              detail: 'Something went wrong while deleting Meeting..!!',
            });

            this.ngOnInit();
          }
        );

        this.ngOnInit();
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'Meeting not deleted',
        });
      },
    });
  }

  meetingType(data:any) {
    console.log(data, 'event value');

    if (data === 'Microsoft Teams') {
      this.meetingRecording = true;
    } else {
      this.meetingRecording = false;
    }
    if (data === 'Google Meet') {
      const record = 'false';

      this.meetingRecording = false;

      const recordValue = this.updateMeetForm.get('recordAutomatically');

      recordValue?.setValue(record);
    }
  }

  onClickUpdate() {
    const startTime = this.updateMeetForm.get('startTime')?.value;
    const endTime = this.updateMeetForm.get('endTime')?.value;

    if (startTime === endTime) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Start time and end time cannot be the same.',
      });
      return; // Exit the function if validation fails
    } else if (endTime < startTime) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'End time cannot be less than start time.',
      });
      return; // Exit the function if validation fails
    }

    console.log(this.updateMeetForm.value, 'form update value');
    this.lodSpinner.isLoading.next(true);
    const updatedObject = {
      meetingSheduleId: this.meetId,
      meetingId: this.meetingId,
      eventId: this.eventId,
      joinUrl: this.joinUrl,
      title: this.updateMeetForm.value.title,
      agenda: this.updateMeetForm.value.agenda,
      participant: this.updateMeetForm.value.participant,
      meetingDate: this.updateMeetForm.value.meetingDate,
      startTime: this.updateMeetForm.value.startTime,
      endTime: this.updateMeetForm.value.endTime,
      meetingType: this.updateMeetForm.value.meetingType,
      recordAutomatically: this.updateMeetForm.value.recordAutomatically,
    };

    this.confirmationService.confirm({
      message: 'Are you sure that you want to update this Meeting?',
      accept: () => {
        this.irService
          .updateScheduledMeeting(this.meetId, updatedObject)
          .subscribe(
            (data: any) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Updated',
                detail: 'Meeting updated successfully',
              });
              this.meetingUpdate = false;
              this.meetingDataTable = true;
              this.lodSpinner.isLoading.next(false);
              this.ngOnInit();

              window.location.reload()
            },
            (error: HttpErrorResponse) => {
              this.messageService.add({
                severity: 'danger',
                summary: 'Error',
                detail: 'Something went wrong while updating Meeting..!!',
              });
              // this.lodSpinner.isLoading.next(false);
            }
          );
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'Meeting not updating',
        });
      },
    });
  }
}
