import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
import { Manager, Role, User } from './model/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class UserComponent implements OnInit {
  addUserDialogBox: boolean = false;
  editUserDialog: boolean = false;
  uploadDialog: boolean = false;
  viewUsers: boolean = false;
  checked!: boolean;

  userForm!: FormGroup;
  allUsers: any[] = [];
  userData!: User;

  roles: Role[] = [];
  roles1: Role[] = [];
  managers: Manager[] = [];
  partners: Manager[] = [];

  selectedFiles?: FileList;
  selectedRole!: string;
  selectedAccess1: string[] = [];
  selectedAccess2: string[] = [];
  selectedAccess3: string[] = [];
  selectedId: string[] = [];

  access1: any[] = [
    { access: 'section 1' },
    { access: 'section 2' },
    { access: 'section 3' },
    { access: 'section 4' },
    { access: 'section 5' },
    { access: 'section 6' },
  ];

  access2: any[] = [
    { access: 'File Import' },
    { access: 'API' },
    { access: 'section 1' },
  ];

  access3: any[] = [
    { access: 'Data Set' },
    { access: 'Line Item Nomenclature' },
    { access: 'Financial Ratios' },
    { access: 'White Labelling' },
  ];

  firstNamePattern = '^[a-zA-Z ]{3,15}$';
  lastNamePattern = '^[a-zA-Z ]{3,15}$';
  emailPattern = "^[A-Za-z0-9._%+-]+[@]{1}[A-Za-z0-9.-]+\[.]{1}[A-Za-z]{2,4}$";
  mobnumPattern = '^((\\+91-?)|0)?[0-9]{1}[0-9]{9}$';
  domainPattern = '^[a-zA-Z. ]{3,15}$';
  assignedNamePattern = '^[a-zA-Z ]{3,15}$';
  userId!: string;

  editUserForm: boolean = false;

  constructor(
    private irService: IRServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.roles = [
      { role: 'Super Admin' },
      { role: 'Admin' },
      { role: 'client' },
      { role: 'Business User' },
    ];
  }

  ngOnInit(): void {
    this.viewUsers = true;
    // this.allUsers=[];
    this.userForm = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern(this.firstNamePattern),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern(this.lastNamePattern),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailPattern),
      ]),
      mobileNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(this.mobnumPattern),
      ]),
      domain: new FormControl('', [
        Validators.required,
        Validators.pattern(this.domainPattern),
      ]),
      assignedName: new FormControl('', [
        Validators.required,
        Validators.pattern(this.assignedNamePattern),
      ]),
      roleName: new FormControl(''),
      createdOn: new FormControl(''),
      status: new FormControl(''),
    });

    // to fetch all roles
    this.irService.getuRole().subscribe(
      (data: any) => {
        console.log(data, ' all th roles');

        this.roles1 = data;
        console.log(this.roles1);
      },
      (error: HttpErrorResponse) => {
        alert(error);
      }
    );

    // to fetch all users
    this.irService.getuUser().subscribe(
      (data: any) => {
        // console.log('alert');

        this.allUsers = data;
        console.log(this.allUsers, '............akkiii.....', data);
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong');
      }
    );
  }

  onClickAddUser() {
    this.checked = true;
    this.addUserDialogBox = true;
    this.viewUsers = false;
    this.userForm.reset();
  }

  handleChange(e: any) {
    this.checked = e.checked;
  }

  onClickSave() {

    if (this.checked === true) {
      this.userForm.value.status = "Active"
    } else {
      this.userForm.value.status = "In-active"
    }
    // this.userForm.value.role = this.selectedRole;
    // this.userForm.value.dashboardAccess = this.selectedAccess1;
    // this.userForm.value.dataInjestionAccess = this.selectedAccess2;
    // this.userForm.value.configurationAccess = this.selectedAccess3;
    // this.userForm.value.createdOn = Date.now();
    // this.userForm.value.status = this.checked;
    console.log(this.userForm.value, ' user data');

    this.irService.addUser(this.userForm.value).subscribe(
      (data: any) => {
        console.log(data);
        this.addUserDialogBox = false;
        this.selectedAccess1 = [];
        this.selectedAccess2 = [];
        this.selectedAccess3 = [];
        this.ngOnInit();
        this.userForm.reset();
        this.messageService.add({
          severity: 'success',
          summary: 'Successfull',
          detail: 'user addedd successfully',
        });
        this.ngOnInit();
      },
      (error: HttpErrorResponse) => {
        if(error.status===406){
        this.messageService.add({
          severity: 'warn',
          summary: 'Error',
          detail: 'Duplicate User Email Id and Mobile No. Not Allowed..!!',
        });
      } 
      else{
        this.messageService.add({
          severity: 'Error',
          summary: 'Error',
          detail: 'Something went wrong while adding Cash Flow Line Items ..!!',
        });
      }
      this.ngOnInit();
      this.addUserDialogBox = false;
      }
    );
  }

  onClickUpdate() {

    if(this.checked){
      this.userForm.value.status="Active"
    }else{
      this.userForm.value.status="Inactive"
    }

    console.log('alert');
    // this.messageServicer();

    this.confirmationService.confirm({
      message: 'Are you sure that you want to edit this user?',
      accept: () => {
        this.irService.updateUser(this.userForm.value, this.userId).subscribe(
          (data: any) => {
            console.log('user edited successfully');
            console.log('User Updated' + data);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'user updated Successfully',
            });
            this.addUserDialogBox = false;
            this.editUserForm=false;
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

  // messageServicer() {
  //   this.confirmationService.confirm({
  //     message: 'Are you sure that you want to edit this user?',
  //     accept: () => {
  //       console.log('akakakak');
  //       this.irService.updateUser(this.userData).subscribe(
  //         (data: any) => {
  //           this.messageService.add({
  //             severity: 'success',
  //             summary: 'Success',
  //             detail: 'user updated Successfully',
  //           });
  //         },
  //         (error: any) => {
  //           console.log('wrong info');
  //         }
  //       );
  //     },

  //     reject: () => {
  //       this.messageService.add({
  //         severity: 'warn',
  //         summary: 'Cancelled',
  //         detail: 'user not updated',
  //       });
  //     },
  //   });
  // }

  value!: string;

  onClickCancle() {
    this.addUserDialogBox = false;
    this.editUserDialog = false;
    this.uploadDialog = false;
    this.editUserForm = false;

    this.userForm.reset();
    this.ngOnInit();
  }

  editUser(id: string) {

    this.irService.getUserById(id).subscribe(
      (data: any) => {
        this.userData = data;
        if (this.userData.status === 'Active') {
          this.checked = true;
        } else {
          this.checked = false;
        }
        console.log(this.userData, 'user that will get edited');
        this.userId = this.userData.userid;
        this.userForm.get("firstName")?.patchValue(this.userData.firstName);
        this.userForm.get("lastName")?.patchValue(this.userData.lastName);
        this.userForm.get("domain")?.patchValue(this.userData.domain);
        this.userForm.get("email")?.patchValue(this.userData.email);
        this.userForm.get("mobileNumber")?.patchValue(this.userData.mobileNumber);
        this.userForm.get("roleName")?.patchValue(this.userData.roleName);
        this.userForm.get("assignedName")?.patchValue(this.userData.assignedName);
        this.userForm.get("status")?.patchValue(this.userData.status);
        this.userForm.get("editedOn")?.patchValue(this.userData.editedOn);

        this.addUserDialogBox = true;
        this.editUserForm = true;
        this.viewUsers = false;

      },
      (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'Danger',
          summary: 'Error',
          detail: 'Something went wrong while adding user..!!',
        });
      }
    );


    // this.userForm.get("status")?.patchValue(this.userData.status);

  }

  deleteUser() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Delete User?',
      accept: () => {
        for (let id of this.selectedId) {
          this.irService.deleteUser(id).subscribe(
            (data: any) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Deleted',
                detail: 'user deleted successfully',
              });
              this.editUserDialog = false;
            },
            (error: HttpErrorResponse) => {
              this.messageService.add({
                severity: 'Danger',
                summary: 'Error',
                detail: 'Something went wrong while deleting user..!!',
              });
            }
          );
        }
        this.selectedId = [];
        this.ngOnInit();
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'user not deleted',
        });
      },
    });
  }

  onClickDelete(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Delete User?',
      accept: () => {
    this.irService.deleteUser(id).subscribe(
      (data: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'user deleted successfully',
        });
        this.addUserDialogBox = false;
        this.viewUsers=true;
        this.ngOnInit();
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'Danger',
          summary: 'Error',
          detail: 'Something went wrong while deleting user..!!',
        });
      }
    );
    this.ngOnInit();
    },
    reject: () => {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cancelled',
        detail: 'user not deleted',
      });
    },
    });
  }

  uploadUsers() {
    this.uploadDialog = true;
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  uploadFile() {
    alert('file uploaded successfully');
    this.uploadDialog = false;
  }

  onSelectRole() {
    console.log(this.userForm.value.role, ' selected role');
  }

  onClickBack() {

    console.log('on click back');
    this.editUserForm = false;
    if (this.addUserDialogBox === true) {
      this.viewUsers = true;
      this.editUserDialog = false;
      this.addUserDialogBox = false;
    } else if (this.editUserDialog === true) {
      this.addUserDialogBox = false;
      this.editUserDialog = false;
      this.viewUsers = true;
    } else if (this.viewUsers === true) {
      this.addUserDialogBox = false;
      this.editUserDialog = false;
    }
    this.ngOnInit();

  }
}
