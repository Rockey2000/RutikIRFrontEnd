import { HttpErrorResponse } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
import { LoadingSpinnerService } from 'src/app/loading-spinner.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-meetings-data',
  templateUrl: './meetings-data.component.html',
  styleUrls: ['./meetings-data.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class MeetingsDataComponent implements OnInit {
  items!: MenuItem[];
  activeItem!: MenuItem;
  status: boolean = false;
  iframeUrl: any;
  iframeUrl2: any;
  meetingData: any;
  isLoading: boolean = false;
  mediaKey: any;
  formattedParticipants: any[] = [];

  constructor(
    private router: Router,
    private irService: IRServiceService,
    private lodSpinner: LoadingSpinnerService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,

  ) {}

  ngOnInit(): void {
    this.lodSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });
    // this.items = [
    //   { label: 'Minutes Of Meeting', routerLink: ['/document/nav/meetings/meetingDataMain/minutesOfMeeting'] },
    //   { label: 'Meeting Recording', routerLink: ['/document/nav/meetings/meetingDataMain/meetingRecording'] },
    // ];
    this.lodSpinner.isLoading.next(true);
    this.irService
      .getSHmeetingDataById(this.route.snapshot.params['shareHolderId'])
      .subscribe(
        (data: any) => {
          console.log(data, 'data of meeting');
          this.meetingData = data;
          console.log(this.meetingData, 'meeting Data');
          this.previewMom(this.meetingData.shareholderid);
          this.mediaKey = this.meetingData.mediakey;
          this.iframeUrl2 = `${environment.url1}/investor/shareholdermeeting/playAudioVideoFile/${this.mediaKey}`;
          console.log(this.mediaKey, 'media Key ');

          const emailIds: string[] = this.meetingData.participants
            .split(',')
            .map((email: string) => email.trim());

          this.formattedParticipants = emailIds.map((email: string) => {
            return `${email}`;
          });

          console.log(this.formattedParticipants, 'this.formattedParticipants');

          this.lodSpinner.isLoading.next(false);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          this.lodSpinner.isLoading.next(false);
        }
      );
  }

  onClickBack() {
    console.log('clicked');
    this.router.navigate(['/document/nav/meetings/meetings/analysis']);
  }

  previewMom(previewId: any) {
    this.lodSpinner.isLoading.next(false);
    this.irService.previewMomData(previewId).subscribe(
      (response) => {
        if (response.body !== null) {
          const blob = new Blob([response.body], { type: 'application/pdf' });
          const blobUrl = URL.createObjectURL(blob);
          this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            blobUrl
          ) as SafeResourceUrl;
          this.lodSpinner.isLoading.next(false);
        } else {
          console.log('Response body is null');
          this.lodSpinner.isLoading.next(false);
        }
        this.lodSpinner.isLoading.next(false);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong while adding data..!!',
        });
        this.lodSpinner.isLoading.next(false);
      }
    );
  }

  videoUrl: any;
  meetingRecording() {
    this.lodSpinner.isLoading.next(true);
    this.iframeUrl2 = `${environment.url1}/investor/shareholdermeeting/playAudioVideoFile/${this.mediaKey}`;
    this.irService.playMeetingRecording(this.mediaKey).subscribe(
      (data: any) => {
        console.log(data, 'data for video preview');
        this.videoUrl = data;
        console.log(this.videoUrl, 'videoUrl');
        this.lodSpinner.isLoading.next(false);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        this.lodSpinner.isLoading.next(false);
      }
    );
  }

  onClickDownloadMom() {
    this.irService.downloadMom(this.meetingData.shareholderid).subscribe(
      (x: any) => {
        var newBlob = new Blob([x], { type: 'application/vnd.ms-excel' });
        const data = window.URL.createObjectURL(newBlob);

        var link = document.createElement('a');
        link.href = data;
        link.download = 'Mom.docx';

        link.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
        console.log('file Downloded');
      },
      (error: HttpErrorResponse) => {
        alert('Something went wrong');
      }
    );
  }
}
