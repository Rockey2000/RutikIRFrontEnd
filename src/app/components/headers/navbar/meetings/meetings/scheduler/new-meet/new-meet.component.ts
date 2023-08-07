import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
import { LoadingSpinnerService } from 'src/app/loading-spinner.service';
import { meetingData } from '../meetData';

interface MeetingType {
  meetingType: string;
}
@Component({
  selector: 'app-new-meet',
  templateUrl: './new-meet.component.html',
  styleUrls: ['./new-meet.component.css'],
  providers: [ConfirmationService, MessageService, DatePipe],
})
export class NewMeetComponent implements OnInit {
  newMeetForm!: FormGroup;
  addEmail!: FormGroup;
  today!: Date;
  meetingTypes!: MeetingType[];
  selectedFiles!: FileList;
  currentFile!: File;
  allUsers: any[] = [];
  emailOfUsers: any[] = [];
  checked!: boolean;
  flagAdding!: boolean;
  get nativeWindow(): Window | undefined {
    return typeof window !== 'undefined' ? window : undefined;
  }
  titlepattern = '^[a-zA-Z0-9 ]{3,155}$';
  agendapattern = '^[a-zA-Z0-9 ]{3,155}$';
  emailPattern = '^[A-Za-z0-9._%+-]+[@]{1}[A-Za-z0-9.-]+[.]{1}[A-Za-z]{2,4}$';
  meetingRecording: boolean = false;
  constructor(
    private router: Router,
    private lodSpinner: LoadingSpinnerService,
    private service: IRServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
    console.log(this.today, 'today date');

    this.meetingTypes = [
      { meetingType: 'Microsoft Teams' },
      { meetingType: 'Google Meet' },
    ];
  }
  isLoading: boolean = false;

  ngOnInit(): void {
    this.lodSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });
    this.lodSpinner.isLoading.next(true);
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
    const timeValidator = (
      control: AbstractControl
    ): { [key: string]: boolean } | null => {
      const startTime = control.get('startTime')?.value;
      const endTime = control.get('endTime')?.value;

      if (startTime && endTime && startTime === endTime) {
        return { timeConflict: true };
      }

      if (startTime && endTime && startTime > endTime) {
        return { invalidTime: true };
      }

      return null;
    };
    if (this.route.snapshot.params['scheduleId']) {
      this.editMeeting(this.route.snapshot.params['scheduleId']);
      this.editMeetForm = true;
    }

    this.newMeetForm = new FormGroup({
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
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
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

  meetingType(event: any) {
    console.log(event, 'event value');

    if (event.value === 'Microsoft Teams') {
      this.meetingRecording = true;
    } else {
      this.meetingRecording = false;
      const record = 'false';

      this.meetingRecording = false;

      const recordValue = this.newMeetForm.get('recordAutomatically');

      recordValue?.setValue(record);
    }
    if (event.value === 'Google Meet') {
      const record = 'false';

      this.meetingRecording = false;

      const recordValue = this.newMeetForm.get('recordAutomatically');

      recordValue?.setValue(record);
    }
    if (event === 'Microsoft Teams') {
      this.meetingRecording = true;
    }
  }
  updateMeetingType(event: any) {
    console.log(event, 'event value');

    if (event === 'Microsoft Teams') {
      this.meetingRecording = true;
    } else {
      this.meetingRecording = false;
      const record = 'false';

      this.meetingRecording = false;

      const recordValue = this.newMeetForm.get('recordAutomatically');

      recordValue?.setValue(record);
    }
    if (event === 'Google Meet') {
      const record = 'false';

      this.meetingRecording = false;

      const recordValue = this.newMeetForm.get('recordAutomatically');

      recordValue?.setValue(record);
    }
  }
  onClickBack() {
    this.router.navigate(['/document/nav/meetings/meetings/scheduler']);
    this.differentValuesAsString = '';
  }

  handleChange(e: any) {
    this.checked = e.checked;
  }

  //
  onClickSave() {
    this.lodSpinner.isLoading.next(true);
    const startTime = this.newMeetForm.get('startTime')?.value;
    const endTime = this.newMeetForm.get('endTime')?.value;

    if (startTime === endTime) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Start time and end time cannot be the same.',
      });
      this.lodSpinner.isLoading.next(false);
      return; // Exit the function if validation fails
    } else if (endTime < startTime) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'End time cannot be less than start time.',
      });
      this.lodSpinner.isLoading.next(false);
      return; // Exit the function if validation fails
    }

    // Continue with saving the form
    console.log('clicked');
    if (this.checked) {
      this.newMeetForm.value.recordAutomatically = 'true';
    } else {
      this.newMeetForm.value.recordAutomatically = 'false';
    }
    console.log(this.newMeetForm.value.meetingType, 'meeting Type');

    console.log(this.newMeetForm.value, 'form data');
    this.service.meetingSchedule(this.newMeetForm.value).subscribe(
      (data: any) => {

        this.lodSpinner.isLoading.next(false);
        console.log(data, 'in method');
        this.ngOnInit();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Meeting Scheduled Successfully..!!',
        });
        setTimeout(() => {
          this.router.navigate(['/document/nav/meetings/meetings/scheduler']);
        }, 1200);
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `${error.error.developerMessage}`,
        });
        this.lodSpinner.isLoading.next(false);
        // alert(error);
        this.ngOnInit();
        this.onClickBack();
      }
    );
  }


  newSelectedDate: any;
  onDateSelect(selectedDate: any) {
    this.newSelectedDate = selectedDate;
    const utcDate = this.datePipe.transform(selectedDate, 'dd/MM/yyyy');
    const dateStringFormControl = this.newMeetForm.get('meetingDate');
    console.log(utcDate, 'converted date');
    dateStringFormControl?.setValue(utcDate);
  }
  onselectStartTime(selectedTime: any) {
    console.log(selectedTime);
    console.log(new Date());

    const startTimeInMiliseconds = selectedTime;

    const currentTimeInMiliseconds = this.newSelectedDate.getHours();
    const currentTimeInMiliseconds1 = this.datePipe.transform(
      this.newSelectedDate,
      'dd/MM/yyyy'
    );
    const currentTimeInMiliseconds2 = this.datePipe.transform(
      new Date(),
      'dd/MM/yyyy'
    );

    const formattedSelectedStartHours = selectedTime.getHours();
    const formattedSelectedStartMinuts = selectedTime.getMinutes();
    const formattedCurrentHours = new Date().getHours();
    const formattedCurrentMinuts = new Date().getMinutes();

    const startDateAndTime = `${formattedSelectedStartHours
      .toString()
      .padStart(2, '0')}:${formattedSelectedStartMinuts
      .toString()
      .padStart(2, '0')}`;
    const currentDateAndTime = `${formattedCurrentHours
      .toString()
      .padStart(2, '0')}:${formattedCurrentMinuts.toString().padStart(2, '0')}`;

    console.log('startTimeInMiliseconds: ', startTimeInMiliseconds);
    console.log('currentTimeInMiliseconds: ', currentTimeInMiliseconds);
    console.log('currentTimeInMiliseconds1: ', currentTimeInMiliseconds1);
    console.log('currentTimeInMiliseconds2: ', currentTimeInMiliseconds2);
    console.log('startDateAndTime: ', startDateAndTime);
    console.log('currentDateAndTime: ', currentDateAndTime);

    if (currentTimeInMiliseconds1 === currentTimeInMiliseconds2) {
      if (startDateAndTime < currentDateAndTime) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Start time can not be less than current time..!!',
        });
      } else {
        const start = new Date(selectedTime);
        const hours = start.getHours();
        const minutes = start.getMinutes();
        const startTime = `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}`;
        const timeString = this.newMeetForm.get('startTime');
        timeString?.setValue(startTime);
        console.log(startTime, 'start time');
      }
    } else {
      const start = new Date(selectedTime);
      const hours = start.getHours();
      const minutes = start.getMinutes();
      const startTime = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`;
      const timeString = this.newMeetForm.get('startTime');
      timeString?.setValue(startTime);
      console.log(startTime, 'start time');
    }
    // Set startTime to the corresponding form control or use it as needed
  }
  onselectEndTime(selectedTime: any) {
    console.log(selectedTime);

    const end = new Date(selectedTime);
    const hours = end.getHours();
    const minutes = end.getMinutes();
    const endTime = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
    const timeString = this.newMeetForm.get('endTime');
    timeString?.setValue(endTime);
    console.log(endTime, 'end time');
    // Set endTime to the corresponding form control or use it as needed
  }
  onClickAddEmail() {
    this.flagAdding = true;
  }
  onClickCancle1() {
    this.addEmail.reset();
  }

  onClickSaveEmail() {
    console.log(this.addEmail.value, 'email added');

    this.emailOfUsers.push(this.addEmail.value);
    console.log(this.emailOfUsers, 'all emails');
    this.flagAdding = false;
    this.onClickCancle1();
  }
  meetData!: meetingData;
  meetDataEmail: any[] = [];
  differentValues: any[] = [];
  differentValuesAsString!: string;
  meetingId: any;
  eventId: any;
  joinUrl: any;
  meetId!: string;
  editMeetForm: boolean = false;
  editMeeting(meetingId: any) {
    console.log(meetingId, 'meetingId');

    this.service.getMeetingDataById(meetingId).subscribe(
      (data: any) => {
        this.meetData = data;
        console.log(this.meetData, 'whole meetingData');

        this.meetId = this.meetData.meetingSheduleId;
        console.log(this.meetId, this.meetData.participant, 'meet id');
        this.meetingId = this.meetData.meetingId;
        this.eventId = this.meetData.eventId;
        this.joinUrl = this.meetData.joinUrl;
        this.newMeetForm.get('title')?.patchValue(this.meetData.title);
        this.newMeetForm.get('agenda')?.patchValue(this.meetData.agenda);

        this.newMeetForm
          .get('participant')
          ?.patchValue(this.meetData.participant);
        this.meetDataEmail.push(this.meetData.participant);
        console.log(this.meetDataEmail, 'external Email');

        this.newMeetForm
          .get('meetingDate')
          ?.patchValue(this.meetData.meetingDate);
        this.newMeetForm
          .get('meetingType')
          ?.patchValue(this.meetData.meetingType);
        this.updateMeetingType(this.meetData.meetingType);
        this.newMeetForm
          .get('recordAutomatically')
          ?.patchValue(this.meetData.recordAutomatically);
        console.log(this.meetData.recordAutomatically, 'recordAutomatically');

        const startTime = new Date(this.meetData.startTime);
        const formattedStartTime = this.formatTime(startTime);
        this.newMeetForm.get('startTime')?.patchValue(formattedStartTime);

        const endTime = new Date(this.meetData.endTime);
        const formattedEndTime = this.formatTime(endTime);
        this.newMeetForm.get('endTime')?.patchValue(formattedEndTime);
        const emails: any[] = Object.values(this.emailOfUsers).map(
          (obj) => obj.email
        );
        console.log(emails);

        // Clear the differentValues array before re-populating it
        this.differentValues = [];

        for (let index = 0; index < this.meetDataEmail.length; index++) {
          this.meetDataEmail[index].forEach((value: any) => {
            if (
              !emails.includes(value) &&
              !this.differentValues.includes(value)
            ) {
              this.differentValues.push(value);
            }
          });
        }

        this.differentValuesAsString = this.differentValues.join(', ');

        console.log(this.differentValuesAsString, 'different string');
        this.cdr.detectChanges();
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'Danger',
          summary: 'Error',
          detail: 'Something went wrong while adding user..!!',
        });
      }
    );
  }

  formatTime(time: Date): string {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  onClickUpdate() {
    const startTime = this.newMeetForm.get('startTime')?.value;
    const endTime = this.newMeetForm.get('endTime')?.value;

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

    console.log(this.newMeetForm.value, 'form update value');
    this.lodSpinner.isLoading.next(true);
    const updatedObject = {
      meetingSheduleId: this.meetId,
      meetingId: this.meetingId,
      eventId: this.eventId,
      joinUrl: this.joinUrl,
      title: this.newMeetForm.value.title,
      agenda: this.newMeetForm.value.agenda,
      participant: this.newMeetForm.value.participant,
      meetingDate: this.newMeetForm.value.meetingDate,
      startTime: this.newMeetForm.value.startTime,
      endTime: this.newMeetForm.value.endTime,
      meetingType: this.newMeetForm.value.meetingType,
      recordAutomatically: this.newMeetForm.value.recordAutomatically,
    };

    this.confirmationService.confirm({
      message: 'Are you sure that you want to update this Meeting?',
      accept: () => {
        this.service
          .updateScheduledMeeting(this.meetId, updatedObject)
          .subscribe(
            (data: any) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Updated',
                detail: 'Meeting updated successfully',
              });

              this.lodSpinner.isLoading.next(false);
              this.ngOnInit();
        setTimeout(() => {
          this.router.navigate([
            '/document/nav/meetings/meetings/scheduler',
          ]);
        }, 1800);
          
            },
            (error: HttpErrorResponse) => {
              this.messageService.add({
                severity: 'danger',
                summary: 'Error',
                detail: 'Something went wrong while updating Meeting..!!',
              });
              this.lodSpinner.isLoading.next(false);
            }
          );
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'Meeting not updating',
        });
        this.lodSpinner.isLoading.next(false);
      },
    });
  }

  onClickDelete() {
    this.lodSpinner.isLoading.next(true);
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Delete this Meeting?',
      accept: () => {
        this.service.deleteScheduledMeeting(this.meetId).subscribe(
          (data: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Meeting deleted successfully',
            });
            this.ngOnInit();
            this.lodSpinner.isLoading.next(false);
            setTimeout(() => {
              this.router.navigate([
                '/document/nav/meetings/meetings/scheduler',
              ]);
            }, 1800);
          },
          (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Something went wrong while deleting Meeting..!!',
            });
            this.lodSpinner.isLoading.next(false);
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
        this.lodSpinner.isLoading.next(false);
      },
    });
  }
}
