import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingsComponent } from './meetings/meetings.component';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';
import { RouterModule } from '@angular/router';
import { AnalysisComponent } from './meetings/analysis/analysis.component';
import { SchedulerComponent } from './meetings/scheduler/scheduler.component';
import { MeetingsDataComponent } from './meetings-data/meetings-data.component';
import { MinutesOfMeetingComponent } from './meetings-data/minutes-of-meeting/minutes-of-meeting.component';
import { MeetingRecordingComponent } from './meetings-data/meeting-recording/meeting-recording.component';
import { NewMeetComponent } from './meetings/scheduler/new-meet/new-meet.component';
import { ShMeetingDataComponent } from './meetings/sh-meeting-data/sh-meeting-data.component';
import { SpinnerComponent } from './spinner/spinner.component';




@NgModule({
  declarations: [
    MeetingsComponent,
    AnalysisComponent,
    SchedulerComponent,
    MeetingsDataComponent,
    MinutesOfMeetingComponent,
    MeetingRecordingComponent,
    NewMeetComponent,
    ShMeetingDataComponent,
    SpinnerComponent,


  
  ],
  imports: [
    CommonModule,
    SharedModuleModule,
    RouterModule.forChild([
      {
        path: 'meetings',
        component: MeetingsComponent,
        data: { breadcrumb: 'Meetings' },
        children: [
          {
            path: 'analysis',
            component: AnalysisComponent,
            data: { breadcrumb: 'Analysis' },
            // canActivate: [AnalystGuard],
        },
          {
            path: 'scheduler',
            component: SchedulerComponent,
            data: { breadcrumb: 'Schedular' },
            // canActivate: [AnalystGuard],
      
          },
          {
            path:'shMeetingData',
            component: ShMeetingDataComponent,
            data:{breadcrumb:'Meeting Data'}
          }
        
        ],
      },
      {
        path:'meetingDataMain/:shareHolderId',
        component: MeetingsDataComponent,
        data:{ breadcrumb:'Meeting Data'},
        // children:[
        //   {
        //     path:'minutesOfMeeting',
        //     component:MinutesOfMeetingComponent,
        //     data:{ breadcrumb :'Minutes of Meeting'}
        //   },
        //   {
        //     path:'meetingRecording',
        //     component:MeetingRecordingComponent,
        //     data:{breadcrumb:'Meeting Recording'}
        //   }
        // ]
      },
       {
        path:'newMeet',
        component:NewMeetComponent,
        data:{breadcrumb:'Create New Meet'}
       },
       {
        path:'newMeet/:scheduleId',
        component:NewMeetComponent,
        data:{breadcrumb:'Update Existing Meet'}
       }
    ])
  ]
})
export class MeetingsModule { }
