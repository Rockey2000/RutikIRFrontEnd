import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IRServiceService } from 'src/app/ir-service.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { LoadingSpinnerService } from 'src/app/loading-spinner.service';
import { flatMap } from 'rxjs';
// import { analyst, pocEmailValidator } from './analyst';
// import { pocNameValidator } from './analyst';

@Component({
  selector: 'app-analyst-details',
  templateUrl: './analyst-details.component.html',
  styleUrls: ['./analyst-details.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class AnalystDetailsComponent implements OnInit {
  analystDetailsTable: boolean = true;
  AnalystForm: boolean = false;
  analystDetails: any[] = [];
 
  // analystData!: analyst;
  analystId!: string;
  editAnalystDetails: boolean = false;
  analystNamePattern =  /^[a-zA-Z!@#$%^&*()_+\-=[\]{}|\\:;"'<>,.?\/\s]+$/;
  pocNamePattern = '^[a-zA-Z ]{3,50}$';
  emailPattern = '^[A-Za-z0-9._%+-]+[@]{1}[A-Za-z0-9.-]+[.]{1}[A-Za-z]{2,4}$';

  AnalystDetailsForm!: FormGroup;
  pocNameInvalidPattern: boolean = false;
  balanceSheetForm!: FormGroup;
  uploadDialog: boolean = false;
  selectedFiles!: FileList;
  currentFile!: File;
  AnalystForm1!: FormGroup;
  skillsForm!: FormGroup;
  searchText: string = '';
  analystDetailsCard:boolean=false;
  existingAnalyst:any[]=[];
  constructor(
    private service: IRServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private lodSpinner: LoadingSpinnerService
  ) {
    this.skillsForm = this.fb.group({
      skills: this.fb.array([this.newSkill()]),
    });
  }
  isLoading: boolean = false;
  ngOnInit(): void {
    localStorage.removeItem('tableName');
    // this.AnalystDetailsForm = new FormGroup({
    //   analystName: new FormControl('', [
    //     Validators.required,
    //     Validators.pattern(this.analystNamePattern),
    //     Validators.minLength(3),
    //     Validators.maxLength(15)
    //   ]),
    //   pocName: new FormControl([], [
    //     Validators.required,
    //     pocNameValidator
    //   ]),
    //   pocEmailId: new FormControl('', [
    //     Validators.required,
    //     pocEmailValidator
    //   ]),
    // });
    //  this.skills.push(this.newSkill())

    this.lodSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });

    this.lodSpinner.isLoading.next(true);
    this.AnalystForm1 = new FormGroup({
      analystName: new FormControl('', [
            Validators.required,
            Validators.pattern(this.analystNamePattern),
            Validators.minLength(3),
            Validators.maxLength(155)
          ]),
      analystContactDetails: new FormControl(''),
    });

    this.service.getAnalystDetails().subscribe(
      (data: any) => {
        console.log(data);
        this.analystDetails = data;
        console.log(this.analystDetails, 'Analyst data');
        this.lodSpinner.isLoading.next(false);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );

    this.skills.push(this.newSkill());
  }
 


  // skill form for form Array

  get skills(): FormArray {
    return this.skillsForm.get('skills') as FormArray;
  }

  newSkill(): FormGroup {
    return this.fb.group({
      pocName: new FormControl('', [
        Validators.required,
        Validators.pattern(this.pocNamePattern),
      ]),
      pocEmailId: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailPattern),
      ]),
      analystcontactid:new FormControl('')
    });
  }
  removeSkill(i: any) {
    console.log(i, 'value of skill');
    this.skills.removeAt(i);
  }
  
  analystContactId: any[] = [];
  removeSkill1(i: any, skill:any) {
    this.analystContactId.push(skill.analystcontactid);
    console.log(i, skill.analystcontactid,'value of skill');
    this.skills.removeAt(i);

  }

  disableEnterKey(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  deleteAnalystContact() {
  
    for (let i = 0; i < this.analystContactId.length; i++) {
      this.service.deleteAnalystContact(this.analystId,this.analystContactId[i]).subscribe(
        (data: any) => {
          // console.log(this.businessOwnerId[i], ' Deleted...........!!!');
          // this.messageService.add({
          //   severity: 'success',
          //   summary: 'Success',
          //   detail: 'Business User deleted successfully..!! ',
          // });
        },
        (error: HttpErrorResponse) => {
          // console.log('error...........!!!');
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error While Deleting Poc Details, please try again...!!',
          });
        }
      );
    }
  }

  addSkills() {
    this.skills.push(this.newSkill());
  }
  onClickAdd() {
    this.analystDetailsTable = false;
    this.AnalystForm = true;
    this.editAnalystDetails = false;
    this.skillsForm.reset();

    for (
      let i = 1;
      i < this.skillsForm.value.skills.length;
      i++
    ) {
      this.removeSkill((i = 0));
    }
  }
  onClickBack() {
    if (this.AnalystForm === true) {
      this.editAnalystDetails = false;
      this.analystDetailsTable = true;
      this.AnalystForm = false;
    } else if (this.editAnalystDetails === true) {
      this.AnalystForm = false;
      this.analystDetailsTable = true;
      this.editAnalystDetails = false;
    }
    this.ngOnInit();
    this.AnalystForm1.reset();
    this.skillsForm.reset();

    for (let i = 0; i < this.skillsForm.value.skills.length; i++) {
      this.removeSkill((i = 0));
    }
  }

  editAnalyst(analystData: any) {
    console.log(analystData, 'for Edit');
    this.analystId=analystData.analystId;
    this.AnalystForm1.get('analystName')?.patchValue(analystData.analystName);
    this.AnalystForm1.get('analystContactDetails')?.patchValue(
      analystData.analystContactDetails
    );
    let controls: any = new FormArray([]);

    analystData.analystContactDetails.forEach(
      (projectOwnerControl: any, index: number) => {
        controls.push(
          new FormGroup({
            pocName: new FormControl(projectOwnerControl.pocName),

            pocEmailId: new FormControl(projectOwnerControl.pocEmailId),
            analystcontactid: new FormControl(projectOwnerControl.analystcontactid)
          })
        );
      }
    );

    this.skillsForm = new FormGroup({ skills: controls });
    // JSON.parse(analystData.analystContactDetails)
    this.editAnalystDetails = true;
    this.analystDetailsTable = false;
    this.AnalystForm = true;
  }
  // editAnalyst(analyst: any) {
  //   this.editAnalystDetails = true;
  //   this.analystDetailsTable = false;
  //   this.AnalystForm = true;
  //   this.analystData = analyst;
  //   console.log(this.analystData);

  //   this.analystId = this.analystData.analystId;
  //   console.log(this.analystId, '....id');

  //   this.AnalystDetailsForm.get('pocName')?.patchValue(
  //     this.analystData.pocName
  //   );
  //   this.AnalystDetailsForm.get('pocEmailId')?.patchValue(
  //     this.analystData.pocEmailId
  //   );

  //   this.AnalystForm = true;

  //   this.service.getAnalystDetails().subscribe(
  //     (data: any) => {
  //       console.log(data);
  //       this.analystDetails = data;
  //       console.log(this.analystDetails, 'Analyst Details data');
  //     },
  //     (error: HttpErrorResponse) => {
  //       // this.messageService.add({
  //       //   severity: 'Danger',
  //       //   summary: 'Error',
  //       //   detail: 'Something went wrong while adding user..!!',
  //       // });
  //       console.log(error);
  //     }
  //   );
  // }

  onClickSave() {
    this.lodSpinner.isLoading.next(true);
    this.AnalystForm1.value.analystContactDetails =
      this.skillsForm.value.skills;

    console.log(this.AnalystForm1.value, 'analyst Data for save');
    const jsonData = this.AnalystForm1.value;

    console.log(JSON.stringify(jsonData), 'json data');
    this.service.addAnalyst(this.AnalystForm1.value).subscribe(
      (data: any) => {
        console.log(data);
        console.log(this.AnalystForm1, 'data reveived');
        this.AnalystForm1.reset();
        this.AnalystForm = false;
        this.analystDetailsTable = true;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Analyst added successfully',
        });
     
        this.lodSpinner.isLoading.next(false);
        this.AnalystForm1.reset();
        this.skillsForm.reset();

        this.ngOnInit();
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
      }
    );
  }
  // onClickSave() {
  //   console.log(this.AnalystDetailsForm.value, ' analyst data');

  //   this.service.addAnalyst(this.AnalystDetailsForm.value).subscribe(
  //     (data: any) => {
  //       console.log(data);
  //       console.log(this.AnalystDetailsForm, 'data reveived');
  //       this.AnalystDetailsForm.reset();
  //       this.AnalystForm = false;
  //       this.analystDetailsTable = true;
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Successful',
  //         detail: 'Analyst added successfully',
  //       });
  //       this.ngOnInit();
  //       this.AnalystDetailsForm.reset();
  //     },
  //     (error: HttpErrorResponse) => {
  //       this.messageService.add({
  //         severity: 'Error',
  //         summary: 'Error',
  //         detail: `${error.error.developerMessage}`,
  //       });

  //       // alert(error);
  //       this.ngOnInit();
  //     }
  //   );
  // }

  onClickUpdate() {
    this.lodSpinner.isLoading.next(true);
    this.AnalystForm1.value.analystContactDetails = this.skillsForm.value.skills
    this.confirmationService.confirm({
      message: 'Are you sure that you want to edit this Analyst?',
      accept: () => {
        this.service
          .updateAnalyst(this.AnalystForm1.value, this.analystId)
          .subscribe(
            (data: any) => {
              // alert('user edited successfully');
              console.log('analyst Updated' + data);
              this.messageService.add({
                severity: 'success',
                summary: 'updated',
                detail: 'analyst updated successfully',
              });
              this.lodSpinner.isLoading.next(false);
              if(this.analystContactId.length > 0){
              this.deleteAnalystContact();
            }
              this.analystDetailsTable = true;
              this.AnalystForm = false;
              this.ngOnInit();
            },
            (error: HttpErrorResponse) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `${error.error.developerMessage}`,
              });
              this.lodSpinner.isLoading.next(false);
            }
          );
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'Analyst not updated',
        });
      },
    });
  }
  onClickDelete() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Delete Analyst ?',
      accept: () => {
        this.service.deleteAnalyst(this.analystId).subscribe(
          (data: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Analyst deleted successfully',
            });
            this.editAnalystDetails = false;
            this.analystDetailsTable = true;
            this.AnalystForm = false;
            this.ngOnInit();
          },
          (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Something went wrong while deleting Analyst..!!',
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
          detail: 'analyst not deleted',
        });
      },
    });
  }
  onClickUpload() {
    this.uploadDialog = true;
  }
  onClickDownloadAnalystDetails() {
    this.service.analystTableName;
    let Details = this.service.analystTableName;
    console.log(Details, 'details');

    this.service.downloadLineItemSheet(Details).subscribe(
      (x: any) => {
        var newBlob = new Blob([x], { type: 'application/vnd.ms-excel' });
        const data = window.URL.createObjectURL(newBlob);

        var link = document.createElement('a');
        link.href = data;
        link.download = 'AnalystDetails.xlsx';

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
  selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }
  hideDialog() {
    this.uploadDialog = false;

  }
  //   uploadExcel(){
  //     console.log(this.selectedFiles, 'excel file uploaded');

  // if (this.selectedFiles) {
  //   const file: File | null = this.selectedFiles.item(0);
  //   console.log(file, 'inside upload method');
  //   if (file) {
  //     this.currentFile = file;
  //     this.service
  //       .uploadAnalystDetails(
  //         this.currentFile

  //       )
  //       .subscribe(
  //         (data: any) => {
  //           console.log('data is passing');
  //         },
  //         (error: HttpErrorResponse) => {
  //           alert('something went wrong');
  //         }
  //       );
  //   }
  // }
  //   }

  uploadExcel() {
    console.log(this.selectedFiles, 'excel file uploaded');

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      console.log(file, 'inside upload method');
      if (file) {
        this.currentFile = file;
        this.service.uploadAnalystDetails(this.currentFile).subscribe(
          (data: any) => {
            if (data.status == 200) {
              console.log('data is passing');
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Data Uploaded Successfully',
              });
            }
            this.ngOnInit();
            this.uploadDialog = false;
            this.AnalystForm = false;
            this.analystDetailsTable = true;
          },
          (error: HttpErrorResponse) => {
            if(error.status===302){
              console.log(error.error
               ,"error of 302");
               this.existingAnalyst=error.error;
               this.analystDetailsCard=true;
               this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: `Some Analyst's Are Already Exist In System`,
                
              });
     
         }else if(error.error.errorCode===400){
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `${error.error.developerMessage}`,
            
          });
   
        this.ngOnInit();

      }else{
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Something went wrong...!!`,
          
        });
 
      this.ngOnInit();
   
    }
        }
        );
      }
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: `Please select file first...!!`,
      });
    }
  }

  cancelCard(){
    this.ngOnInit();
    this.uploadDialog = false;
  }
}
