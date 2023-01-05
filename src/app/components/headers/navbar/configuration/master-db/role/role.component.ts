import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
import { Access, Role } from './model/role';



@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class RoleComponent implements OnInit {
  addRoleDialogBox: boolean = false;
  editRoleDialog: boolean = false;
  uploadDialog: boolean = false;
  viewRoles: boolean = false;
  ViewRoleName!: string;
  checked!: boolean;
  roleForm!: FormGroup;
  allRoles: Role[] = [];
  roleData!: Role;
  roleData1!: Role;
  role!: any;
  userByRoles: string[] = [];
  roles: Role[] = [];
  users: number = 5;
  value!: string;

  selectedFiles?: FileList;
  selectedRole!: string;
  selectedAccess1: string[] = [];
  selectedId: string[] = [];
  selectedNode!: string;

  usersByRole: boolean = false;

  roleNamePattern = '^[a-zA-Z ]{3,15}$';
  desciptionPattern = '^[a-zA-Z0-9@!#$%&*-_ ]{3,255}$';
  editRoleForm: boolean = false;
  access1: Access[] = [];
  roleId!: string;






  constructor(
    private location: Location,
    private irService: IRServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {
    this.access1 = [
      { accessLabel: 'Configuration' },
      { accessLabel: 'User Management' },
      { accessLabel: 'Role Management' },
      { accessLabel: 'Data Injestion' },
      { accessLabel: 'Access Management' },
      { accessLabel: 'Pre Earning Analysis' },
      { accessLabel: 'Post Earning Analysis' },
      { accessLabel: 'Shareholder Data Analysis' },
      { accessLabel: 'MIS Report' },
      { accessLabel: 'Meeting Schedular' },
      { accessLabel: 'ARNM' },
    ];
  }

  vendorData: string[] = [];
  ngOnInit(): void {

    this.allRoles = [];
    this.viewRoles = true;
    this.roleForm = new FormGroup({
      roleName: new FormControl('', [
        Validators.required,
        Validators.pattern(this.roleNamePattern),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.pattern(this.desciptionPattern),
      ]),
      dashboardAccess: new FormControl(''),
      status: new FormControl(''),
      noOfUser: new FormControl(''),
    });

    // to fetch all roles
    this.irService.getuRole().subscribe(
      (data: any) => {
        this.allRoles = data;
        console.log(data);
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong');
      }
    );
  }
  selectedrole!: string;
  onSelect() {
    this.selectedrole = this.role.roleName;
    console.log(this.selectedrole);
    console.table(this.role);
  }

  onSelected() {
    console.log(this.roleForm.value.dashboardAccess, ' Akshay');
  }

  onClickCheckBox() {
    console.log(this.selectedId);
  }

  onClickAddRole() {
    this.checked = true;
    this.addRoleDialogBox = true;
    this.viewRoles = false;
  }

  handleChange(e: any) {
    this.checked = e.checked;
  }

  onSelectedCat() {
    console.log(this.selectedNode);
  }

  onClickSave() {
    // this.roleForm.value.dashboardAccess = this.selectedAccess1;
    // this.roleForm.value.status = this.checked;
    if (this.checked === true) {
      this.roleForm.value.status = "Active"
    } else {
      this.roleForm.value.status = "In-active"
    }
    console.log(this.roleForm.value.dashboardAccess);

    this.irService.addRole(this.roleForm.value).subscribe(
      (data: any) => {
        console.log(data);
        this.addRoleDialogBox = false;
        this.selectedAccess1 = [];

        this.messageService.add({
          severity: 'success',
          summary: 'Successfull',
          detail: 'Role addedd successfully',
        });
        this.ngOnInit();
      },
      (error: HttpErrorResponse) => {
        if (error.status === 406) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Error',
            detail: 'Duplicate Roles Not Allowed..!!',
          });
        } else {
          this.messageService.add({
            severity: 'Error',
            summary: 'Error',
            detail: 'Something went wrong while adding user..!!',
          });
        }
        this.addRoleDialogBox = false;
        this.selectedAccess1 = [];
        this.ngOnInit();
      }
    );
  }

  onClickUpdate() {
    if (this.checked) {
      this.roleForm.value.status = "Active"
    } else {
      this.roleForm.value.status = "In-active"
    }

    console.log('alert');
    this.confirmationService.confirm({
      message: 'Are you sure that you want to edit this Role?',
      accept: () => {
        this.irService.updateRole(this.roleForm.value, this.roleId).subscribe(
          (data: any) => {
            console.log('role updated succesfully');
            console.log('Role Updated' + data);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'role updated Successfully',
            });

            this.addRoleDialogBox = false;
            this.ngOnInit();
          },
          (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Cancelled',
              detail: `${error}`,
            });

            this.editRoleDialog = false;
            this.ngOnInit();
          }
        );
      },

      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'role not updated',
        });
      },

    });
  }

  onClickCancel() {
    this.userCountPerUser = 0;
    this.addRoleDialogBox = false;
    this.editRoleDialog = false;
    this.uploadDialog = false;
    this.usersByRole = false;
    this.viewRoles = true;
    this.roleForm.reset();
    this.ngOnInit();
  }

  allRolesPerUser: any[] = [];
  roleName!: string;
  userCountPerUser!: number;

  editRole(role: any) {
    this.roleData1;
    this.viewRoles = false;
    this.roleData = role;

    console.log(this.roleData);
    console.log(this.roleData.dashboardAccess,"before split");
    
    this.roleData.dashboardAccess = this.roleData.dashboardAccess[0]
      .substring(1, this.roleData.dashboardAccess[0].length - 1)
      .split(',');

    console.log(this.roleData.dashboardAccess);

    this.roleData.dashboardAccess = this.roleData.dashboardAccess.map(
      (element: any) => {
        return element.trim();
      }
    );

    this.roleId = this.roleData.id;
    this.roleForm.get("roleName")?.patchValue(this.roleData.roleName);
    this.roleForm.get("description")?.patchValue(this.roleData.description);
    this.roleForm.get("dashboardAccess")?.patchValue(this.roleData.dashboardAccess);
    this.roleForm.get("status")?.patchValue(this.roleData.status);

    this.editRoleForm = true;

    this.addRoleDialogBox = true;

    this.irService.getUsersByRoleName(role.roleName).subscribe((data: any) => {
      console.log('data!!!', data);
      if (this.roleData.status === 'Active') {
        this.checked = true;
      } else {
        this.checked = false;
      }
      this.allRolesPerUser = data;
      this.roleName = this.allRolesPerUser[0].roleName;
      this.userCountPerUser = this.allRolesPerUser.length;

      console.log('no of user ', this.userCountPerUser, ' ', this.roleName);

    });


    this.irService.getRoleByRolename(role.roleName).subscribe(
      (data: any) => {
        console.log(data, '!!!!!');
        this.roleData1 = data;

        this.roleData1.dashboardAccess = this.roleData1.dashboardAccess[0]
          .substring(1, this.roleData1.dashboardAccess[0].length - 1)
          .split(',');
        console.log(this.roleData1.dashboardAccess);

        this.roleData1.dashboardAccess = this.roleData1.dashboardAccess.map(
          (element: any) => {
            return element.trim();
          }
        );
      },
      (error: any) => {
        console.log(error);
      }
    );
    // for(let i=0;i<this.allRolesPerUser.length;i++){

    // }
  }

  deleteRole() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Delete Role?',
      accept: () => {
        for (let id of this.selectedId) {
          this.irService.deleteRole(id).subscribe(
            (data: any) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Deleted',
                detail: 'Role deleted successfully',
              });
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
        }
        this.selectedId = [];
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

  onClickDelete(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Delete Role?',
      accept: () => {
        this.irService.deleteRole(id).subscribe(
          (data: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Role deleted successfully',
            });
            this.editRoleDialog = false;
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

  uploadRoles() {
    this.uploadDialog = true;
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  uploadFile() {
    alert('file uploaded successfully');
    this.uploadDialog = false;
  }

  text!: string;
  roleDataa: any;
  onClickRow(role: any) {
    console.log(role);
    this.roleDataa = role;
    this.ViewRoleName = role.roleName;
    this.addRoleDialogBox = false;
    this.editRoleDialog = false;
    this.uploadDialog = false;
    this.viewRoles = false;
    this.usersByRole = true;

    console.log(role.id);

    console.log(this.ViewRoleName);
    this.irService.getUsersByRoleName(role.roleName).subscribe(
      (data: any) => {
        this.userByRoles = data;
        console.log(this.userByRoles, ' user by role');

        if (this.userByRoles.length == 0) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'No Users Available for this roles',
          });
          this.text = 'No User available for these roles;';
        }
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'danger',
          summary: 'Error',
          detail: 'Something went wrong...!!',
        });
      }
    );
  }

  onClickBack() {
    this.userCountPerUser = 0;
    this.editRoleForm = false;
    if (this.usersByRole === true) {
      this.usersByRole = false;
      this.viewRoles = true;
    } else if (this.addRoleDialogBox === true) {
      this.addRoleDialogBox = false;
      this.viewRoles = true;
    }
    this.ngOnInit();

    this.irService.getUsersByRoleName(this.roleDataa.roleName).subscribe(
      (data: any) => {
        console.log('data!!!', data);

        this.allRolesPerUser = data;
        this.roleName = this.allRolesPerUser[0].roleName;
        this.userCountPerUser = this.allRolesPerUser.length;
      },
      (error: HttpErrorResponse) => { }
    );
    // this.location.back();
  }





}
