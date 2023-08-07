import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IRServiceService } from 'src/app/ir-service.service';
import { LoadingSpinnerService } from 'src/app/loading-spinner.service';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit {
  tabmenus: boolean = true;
  anythingDemo:any
  shMeetingTable: any[] = [];
  isLoading: boolean = false;
  constructor(private irService: IRServiceService, private router: Router, private lodSpinner: LoadingSpinnerService) { }

  ngOnInit(): void {

    this.lodSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });
    this.irService.dialogFormDataSubscriber$.subscribe((data: any) => {
      console.log(data, '!!');
      this.tabmenus = !this.tabmenus;
    });
    this.lodSpinner.isLoading.next(true);

        this.irService.getMeetingTableStructure().subscribe(
      (data: any) => {
        console.log(data);
        this.shMeetingTable= data;
        this.lodSpinner.isLoading.next(false);
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong...');
        console.log(error);
      }
    );
  }
  onClickGotoMeeting(){

    console.log("clicked");
    this.router.navigate(['/document/nav/meetings/meetingDataMain'])
  }

  goToAnalysis(shareHolderId:any){
      console.log(shareHolderId,"shreholderId");
      this.router.navigate(['/document/nav/meetings/meetingDataMain/' + shareHolderId])
  }
}
