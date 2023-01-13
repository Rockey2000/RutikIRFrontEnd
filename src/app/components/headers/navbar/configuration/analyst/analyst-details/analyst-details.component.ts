import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IRServiceService } from 'src/app/ir-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { analyst } from './analyst';

@Component({
  selector: 'app-analyst-details',
  templateUrl: './analyst-details.component.html',
  styleUrls: ['./analyst-details.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class AnalystDetailsComponent implements OnInit {
  analystDetailsTable: boolean = true;
  AnalystForm:boolean=false;
  analystDetails:any[]=[];
   analystData!:analyst;
   analystId!: string;
   editAnalystDetails: boolean = false;
  analystNamePattern = '^[a-zA-Z ]{3,50}$';
  pocNamePattern = '^[a-zA-Z ]{3,50}$';
  emailPattern = "^[A-Za-z0-9._%+-]+[@]{1}[A-Za-z0-9.-]+\[.]{1}[A-Za-z]{2,4}$";
  AnalystDetailsForm!:FormGroup;
  constructor( private service: IRServiceService,  
   private messageService: MessageService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    
    this.AnalystDetailsForm =new FormGroup({
      analystName: new FormControl('', [
        Validators.required,
        Validators.pattern(this.analystNamePattern),
      ]),
      pocName: new FormControl('',[
        Validators.required,
        Validators.pattern(this.pocNamePattern)
      ]),
      pocEmailId: new FormControl('',[
        Validators.required,
        Validators.pattern(this.emailPattern)
      ])

    })

    this.service.getAnalystDetails().subscribe(
      (data: any) => {
        console.log(data);
        this.analystDetails = data;
       console.log(this.analystDetails, 'Analyst data');
      },
      (error: HttpErrorResponse) => {
      console.log(error);
      }
    );
  }
  onClickAdd() {
    this.analystDetailsTable=false;
    this.AnalystForm=true;
    this.editAnalystDetails=false;
  }
  onClickBack(){
 if(this.AnalystForm===true){
  this.editAnalystDetails=false;
  this.analystDetailsTable=true;
  this.AnalystForm=false;
 }
 else if(this.editAnalystDetails===true){
   this.AnalystForm=false;
   this.analystDetailsTable=true;
   this.editAnalystDetails=false;
 }
  this.ngOnInit();
  }
  editAnalyst(analyst: any){
    this.editAnalystDetails=true;
    this.analystDetailsTable=false;
    this.AnalystForm=true;
    this.analystData= analyst;
    console.log(this.analystData);
   
    this.analystId = this.analystData.analystId;
    console.log(this.analystId,"....id");
    
    this.AnalystDetailsForm.get("analystName")?.patchValue(this.analystData.analystName);
    this.AnalystDetailsForm.get("pocName")?.patchValue(this.analystData.pocName);
    this.AnalystDetailsForm.get("pocEmailId")?.patchValue(this.analystData.pocEmailId);
  

    this.AnalystForm= true;

    this.service.getAnalystDetails().subscribe(
      (data: any) => {
        console.log(data);
        this.analystDetails = data;
        console.log(this.analystDetails, 'Analyst Details data');
      },
      (error: HttpErrorResponse) => {
        // this.messageService.add({
        //   severity: 'Danger',
        //   summary: 'Error',
        //   detail: 'Something went wrong while adding user..!!',
        // });
        console.log(error);
      }
    );
  }
  onClickSave(){

    console.log(this.AnalystDetailsForm.value, ' analyst data');


    this.service.addAnalyst(this.AnalystDetailsForm.value).subscribe(
      (data: any) => {
        console.log(data);
        console.log(this.AnalystDetailsForm,"data reveived");
        this.AnalystDetailsForm.reset();
        this.AnalystForm=false;
        this.analystDetailsTable=true;
        this.messageService.add({
          severity: 'success',
          summary: 'success',
          detail: 'Analyst addedd successfully',
        });
        this.ngOnInit();
        this.AnalystDetailsForm.reset();
        
        },
        (error: HttpErrorResponse) => {
          if(error.status===406){
           this.messageService.add({
             severity: 'warn',
             summary: 'Warning',
             detail: 'Duplicate Analyst Details Values Not Allowed..!!',
           });
         }else{
         this.messageService.add({
           severity: 'Error',
           summary: 'Error',
           detail: 'Something went wrong while adding Analyst Details ..!!',
         });
       }
         // alert(error);
         this.ngOnInit();
       }
    );
    }
  
  onClickUpdate(){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to edit this user?',
      accept: () => {
        this.service.updateAnalyst(this.AnalystDetailsForm.value,this.analystId).subscribe(
          (data: any) => {
            // alert('user edited successfully');
            console.log('analyst Updated' + data);
            this.messageService.add({
              severity: 'success',
              summary: 'updated',
              detail: 'analyst updated successfully',
            });
            this.analystDetailsTable = true;
            this.AnalystForm=false;
            this.ngOnInit();
          },
          (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'cancel',
              summary: 'Cancelled',
              detail: `${error}`,
            });
          }
        );
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'user not updated',
        });
      },
     });
      }
      onClickDelete(id: string){
        this.confirmationService.confirm({
          message: 'Are you sure that you want to Delete Role?',
          accept: () => {
            this.service.deleteAnalyst(id).subscribe(
              (data: any) => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Deleted',
                  detail: 'Role deleted successfully',
                });
                this.editAnalystDetails = false;
                this.analystDetailsTable=true;
                this.AnalystForm=false;
                this.ngOnInit();
              },
              (error: HttpErrorResponse) => {
                this.messageService.add({
                  severity: 'danger',
                  summary: 'Error',
                  detail: 'Something went wrong while deleting role..!!',
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
              detail: 'role not deleted',
            });
          },
        });
      }
      }
      

