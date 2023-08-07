import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Validation } from '@syncfusion/ej2-angular-spreadsheet';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
import { LoadingSpinnerService } from 'src/app/loading-spinner.service';
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
  selector: 'app-sh-meeting-data',
  templateUrl: './sh-meeting-data.component.html',
  styleUrls: ['./sh-meeting-data.component.css'],
  providers: [ConfirmationService, MessageService, DatePipe],
})
export class ShMeetingDataComponent implements OnInit {
  meetingDataTable: boolean = true;
  meetingDataForm: boolean = false;
  shMeetingTable: any[] = [];
  shMeetingDataForm!: FormGroup;

  meetingsWith: MeetingWith[] = [];
  stakeholders: StakeholderType[] = [];
  status!: Status[];
  meetingTypes!: MeetingType[];
  customDate!: Date;
  today!: Date;
  orgnisationPattern = '^[a-zA-Z0-9. /]{3,50}$';
  subjectPattern = '^[a-zA-Z ]{3,50}$';
  locationPattern = '^[a-zA-Z0-9., /]{3,250}$';
  commentPattern = '^[a-zA-Z ]{3,255}$';
  participantsPattern = '^[a-zA-Z0-9.,@ /]{3,255}$';
  feedbackPattern = '^[a-zA-Z0-9., ]{3,255}$';
  timePattern = '^[1-9]|1[0-2]):([0-5][0-9])s(AM|PM)$';
  isLoading: boolean = false;
  selectedFiles!: FileList;
  selectedFilesMom!: FileList;
  currentFile!: File;
  momFile!: File;
  meetingData: any[] = [];
  completedMeeting: any[] = [];
  uploadProgress: number = 0;
  constructor(
    private datePipe: DatePipe,
    private lodSpinner: LoadingSpinnerService,
    private service: IRServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private ngZone: NgZone
  ) {
    // this.today = new Date();
    // this.today.setHours(0, 0, 0, 0);
    // console.log(this.today, 'today date');

    this.meetingsWith = [{ meetingWith: 'Direct' }, { meetingWith: 'IIFL' }];

    this.meetingTypes = [
      { meetingType: 'Microsoft Teams' },
      { meetingType: 'Google Meet' },
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
    this.lodSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });

    this.lodSpinner.isLoading.next(true);

    // this.service.getMeetingTableStructure().subscribe(
    //   (data: any) => {
    //     console.log(data);
    //     this.shMeetingTable= data;
    //     this.lodSpinner.isLoading.next(false);
    //   },
    //   (error: HttpErrorResponse) => {
    //     alert('something went wrong...');
    //     console.log(error);
    //   }
    // );

    this.service.getScheduledMeetingData().subscribe(
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
          if (
            meeting.status === 'completed' &&
            meeting.meetingDataStatus === 'No'
          ) {
            this.completedMeeting.push(meeting);
          }
        });
        console.log(this.completedMeeting, 'completed meeting');

        // Transform the meeting data into the format required by FullCalendar
      },
      (error: HttpErrorResponse) => {
        console.log(error.error, 'hello error');
      }
    );

    this.shMeetingDataForm = new FormGroup({
      // dateString: new FormControl('03-02-2023') ,
      date: new FormControl('', Validators.required),
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      subject: new FormControl('', [
        Validators.required,
        Validators.pattern(this.subjectPattern),
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      organisation: new FormControl('', [
        Validators.required,
        Validators.pattern(this.orgnisationPattern),
        Validators.minLength(3),
        Validators.maxLength(255),
      ]),
      broker: new FormControl(''),
      stakeholderType: new FormControl(''),
      meetingType: new FormControl(''),
      location: new FormControl('', [
        Validators.required,
        Validators.pattern(this.locationPattern),
        Validators.minLength(3),
        Validators.maxLength(255),
      ]),
      status: new FormControl(''),
      participants: new FormControl('', [
        Validators.required,
        Validators.pattern(this.participantsPattern),
        Validators.minLength(3),
        Validators.maxLength(250),
      ]),

      Summary: new FormControl(''),
      actionItems: new FormControl(''),
      investorConcerns: new FormControl(''),
      feedback: new FormControl(''),
      analysis: new FormControl(''),
      comments: new FormControl(''),

      uploadedBy: new FormControl('Rutik Shinde'),
    });
  }
  addMeeting() {
    this.meetingDataForm = true;
    this.meetingDataTable = false;
  }

  downloadMeetingTemplate() {}

  onClickBack() {
    this.meetingDataForm = false;
    this.meetingDataTable = true;
  }

  onDateSelect(selectedDate: any) {
    console.log(selectedDate, 'selected Date');

    const utcDate = new Date(
      this.datePipe.transform(selectedDate, 'yyyy-MM-dd') + 'T00:00:00Z'
    );
    const dateStringFormControl = this.shMeetingDataForm.get('dateString');
    console.log(utcDate, 'converted date');
    dateStringFormControl?.setValue(utcDate);
  }
  selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }
  selectFileMom(event: any) {
    this.selectedFilesMom = event.target.files;
  }

  mediaKey: any;
  onClickSave() {
    this.lodSpinner.isLoading.next(true);
    console.log(this.selectedFiles, 'selectedfile');
    if (this.selectedFilesMom) {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      console.log(file, 'inside upload method');
      if (file) {
        this.currentFile = file;
        this.service.uploadMediaFile(this.currentFile).subscribe(
          (data: any) => {
            console.log(data, 'data is passing');
            this.mediaKey = data.body.mediakey;
            console.log(this.mediaKey, 'this.mediaKey');

            setTimeout(() => {
              if (this.mediaKey !== null) {
                const updatedObject = {
                  meetingId: this.meetingId,
                  date: this.shMeetingDataForm.value.date,
                  startTime: this.shMeetingDataForm.value.startTime,
                  endTime: this.shMeetingDataForm.value.endTime,
                  organisation: this.shMeetingDataForm.value.organisation,
                  stakeholderType: this.shMeetingDataForm.value.stakeholderType,
                  meetingType: this.shMeetingDataForm.value.meetingType,
                  subject: this.shMeetingDataForm.value.subject,
                  broker: this.shMeetingDataForm.value.broker,
                  location: this.shMeetingDataForm.value.location,
                  status: this.shMeetingDataForm.value.status,
                  comments: this.shMeetingDataForm.value.comments,
                  participants: this.shMeetingDataForm.value.participants,
                  feedback: this.shMeetingDataForm.value.feedback,
                  uploadedBy: this.shMeetingDataForm.value.uploadedBy,
                  mediakey: this.mediaKey,
                  summary: this.shMeetingDataForm.value.Summary,
                  actionItem: this.shMeetingDataForm.value.actionItems,
                  investorConcerns:
                    this.shMeetingDataForm.value.investorConcerns,
                  analysis: this.shMeetingDataForm.value.analysis,
                };
                console.log(this.selectedFiles, 'selected file');

                if (this.selectedFilesMom) {
                  const file2: File | null = this.selectedFilesMom.item(0);

                  if (file2) {
                    this.momFile = file2;
                    this.service
                      .uploadShMeetingData(this.momFile, updatedObject)
                      .subscribe(
                        (data: any) => {
                          if (data.status === 200) {
                            console.log(data, 'data is uploded');
                            this.messageService.add({
                              severity: 'success',
                              summary: 'Successful',
                              detail: 'Data added successfully',
                            });
                            this.ngOnInit();
                            window.location.reload();
                            this.meetingDataForm = false;
                            this.meetingDataTable = true;
                            this.lodSpinner.isLoading.next(false);
                          }
                        },
                        (error: HttpErrorResponse) => {
                          this.messageService.add({
                            severity: 'error',
                            summary: 'Cancelled',
                            detail: `${error.error.developerMessage}`,
                          });
                          this.lodSpinner.isLoading.next(false);
                        }
                      );
                  }
                } 
             
              }
            }, 1300);
          },
          (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Video/Audio upload failed due to unknown reason'
            });

            this.lodSpinner.isLoading.next(false);
          }
        );
      }
      
    } else {
      const updatedObject = {
        meetingId: this.meetingId,
        date: this.shMeetingDataForm.value.date,
        startTime: this.shMeetingDataForm.value.startTime,
        endTime: this.shMeetingDataForm.value.endTime,
        organisation: this.shMeetingDataForm.value.organisation,
        stakeholderType: this.shMeetingDataForm.value.stakeholderType,
        meetingType: this.shMeetingDataForm.value.meetingType,
        subject: this.shMeetingDataForm.value.subject,
        broker: this.shMeetingDataForm.value.broker,
        location: this.shMeetingDataForm.value.location,
        status: this.shMeetingDataForm.value.status,
        comments: this.shMeetingDataForm.value.comments,
        participants: this.shMeetingDataForm.value.participants,
        feedback: this.shMeetingDataForm.value.feedback,
        uploadedBy: this.shMeetingDataForm.value.uploadedBy,
        summary: this.shMeetingDataForm.value.Summary,
        actionItem: this.shMeetingDataForm.value.actionItems,
        investorConcerns: this.shMeetingDataForm.value.investorConcerns,
        analysis: this.shMeetingDataForm.value.analysis,
        mediakey: null,

      };
      console.log(this.selectedFiles, 'selected file');

      if (this.selectedFilesMom) {
        const file2: File | null = this.selectedFilesMom.item(0);

        if (file2) {
          this.momFile = file2;
          this.service
            .uploadShMeetingData(this.momFile, updatedObject)
            .subscribe(
              (data: any) => {
                if (data.status === 200) {
                  console.log(data, 'data is uploded');
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Data added successfully',
                  });
                  this.ngOnInit();
                  this.lodSpinner.isLoading.next(false);
                  this.meetingDataForm = false;
                  this.meetingDataTable = true;
                }
              },
              (error: HttpErrorResponse) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Cancelled',
                  detail: `${error.error.developerMessage}`,
                });
                this.lodSpinner.isLoading.next(false);
              }
            );
        }
      }
    }
  }
  else {


    alert("Please select MOM")
  }
  }
  extractedData: any;
  onClickExtract() {
    this.lodSpinner.isLoading.next(true);
    if (this.selectedFilesMom) {
      const file: File | null = this.selectedFilesMom.item(0);
      console.log(file, 'inside upload method');
      if (file) {
        this.currentFile = file;
        this.service.extractMom(this.currentFile, this.meetingId).subscribe(
          (data: any) => {
            console.log(data.body, 'data is passing');
            this.extractedData = data.body;
            if (data.status === 200) {
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Data Extracted Successfully',
              });
              this.lodSpinner.isLoading.next(false);
            }
            this.shMeetingDataForm
              .get('actionItems')
              ?.patchValue(this.extractedData.actionItems.join('\n'));
            this.shMeetingDataForm
              .get('investorConcerns')
              ?.patchValue(this.extractedData.investorConcerns.join('\n'));
            this.shMeetingDataForm
              .get('Summary')
              ?.patchValue(
                this.extractedData.summaryoftheDiscussion.join('\n')
              );
            this.shMeetingDataForm
              .get('feedback')
              ?.patchValue(this.extractedData.feedback.join('\n'));
            this.shMeetingDataForm
              .get('organisation')
              ?.patchValue(this.extractedData.organizer);
            this.shMeetingDataForm
              .get('location')
              ?.patchValue(this.extractedData.location);
            this.shMeetingDataForm
              .get('analysis')
              ?.patchValue(this.extractedData.analysis.join('\n'));
            console.log(this.extractedData, 'extracted Data');
          },
          (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `${error.error.developerMessage}`,
            });
            this.lodSpinner.isLoading.next(false);
            this.ngOnInit();
          }
        );
      }
    }
  }
  meetingId: any;
  editMeeting(meetData: any) {
    this.meetingDataForm = true;
    this.meetingDataTable = false;
    console.log(meetData, 'meetData');
    this.meetingId = meetData.meetingId;

    this.shMeetingDataForm.get('subject')?.patchValue(meetData.title);
    this.shMeetingDataForm.get('date')?.patchValue(meetData.meetingDate);
    const startTime = new Date(meetData.startTime);
    const formattedStartTime = this.formatTime(startTime);
    this.shMeetingDataForm.get('startTime')?.patchValue(formattedStartTime);
    const endTime = new Date(meetData.endTime);
    const formattedEndTime = this.formatTime(endTime);
    this.shMeetingDataForm.get('endTime')?.patchValue(formattedEndTime);
    this.shMeetingDataForm
      .get('participants')
      ?.patchValue(meetData.participant);
    this.shMeetingDataForm.get('meetingType')?.patchValue(meetData.meetingType);
  }

  formatTime(time: Date): string {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
