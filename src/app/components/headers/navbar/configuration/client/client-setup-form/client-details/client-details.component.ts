import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
import { Client } from './model/clientmodel';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingSpinnerService } from 'src/app/loading-spinner.service';

interface IndustryType {
  industryType: string;
}
interface User {
  roleName: string;
  email: string;
}

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css'],
})
export class ClientDetailsComponent implements OnInit {
  IndustryTypes!: IndustryType[];
  newClientForm!: FormGroup;
  ClientDetailsTable: boolean = true;
  selectedpeer: any[] = [];
  analystnameArr: any = [];
  analystnameClientArr: any = [];
  DataForDropdown: any = [];
  selectedType1: any;
  clientDetails: any[] = [];
  clientDetailsForm: boolean = false;
  editClientDialog: boolean = false;
  editlable: boolean = false;
  editclientdetails: boolean = false;
  clientData!: Client;
  enableSaveAndCreate: boolean = false;
  userArray: any = [];
  usernameArray: any = [];
  usernameArrayEdit: any = [];
  editClientForm: boolean = false;
  selectedClient: any;
  clientdetailsformAdd: boolean = false;
  clientdetailsform2: boolean = false;
  clientid!: string;
  isLoading: boolean = false;
  user!: User;
  IsProjectCode: boolean = false;
  filteredEmail: any = [];
  alreadyExistEmailid: any = [];
  userMailIds: any = [];
  allFilterMailIds: any = [];
  allFinalMailIds: any = [];
  verifyButtonDisabled: boolean = true;
  IsEditmode: boolean = false;

  clientNamePattern = /^[a-zA-Z0-9]*$/;
  emaildomaipattern = '^[a-zA-Z.]{3,155}$';

  constructor(
    private service: IRServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private lodSpinner: LoadingSpinnerService
  ) {
    this.IndustryTypes = [
      { industryType: 'Information Technology' },
      { industryType: 'Mechanical' },
      { industryType: 'Education' },
      { industryType: 'Aviation' },
      { industryType: 'Finance' },
      { industryType: 'Marketing' },
      { industryType: 'Textile' },
    ];
  }

  ngOnInit(): void {
    this.lodSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });

    this.lodSpinner.isLoading.next(true);

    this.newClientForm = new FormGroup({
      projectCode: new FormControl('', [Validators.required]),
      taskCode: new FormControl('', [Validators.required]),
      clientName: new FormControl('', [Validators.required]),
      emailDomain: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emaildomaipattern),
        Validators.minLength(3),
        Validators.maxLength(155),
      ]),
      industry: new FormControl('', [Validators.required]),
      clientAddress: new FormControl('', [Validators.required]),
      emailId: new FormControl('', [Validators.required]),
      suggestedPeers: new FormControl(''),
      assignAA: new FormControl('', [Validators.required]),
    });

    // ****************Get all the client name from clientdetails array**************************************************************

    this.service.getClientDetails().subscribe((data: any) => {

      this.clientDetails = data;
      console.log("all clients data: ",data);
      
      // Unique Data for the ClientName in ClientDetails**************************************

      const uniqueData = new Set(this.clientDetails);
      this.DataForDropdown = Array.from(uniqueData);


      const uniqueClient = new Set(
        this.DataForDropdown.map((item: any) => item.clientName)
      );


      this.DataForDropdown = Array.from(uniqueClient).map((clientName) => ({
        clientName,
      }));
    });

    //------------------------------------------Get All the Analyst Name------------------------------------------------------------------

    this.service.getAnalystDetails().subscribe((analystname) => {

      this.analystnameArr = analystname;


      // to initialize object to null
      this.analystnameClientArr = [];
      for (let i = 0; i < this.analystnameArr.length; i++) {
        this.analystnameClientArr.push({
          name: this.analystnameArr[i].analystName,
        });
      }
    });
    // *****************************Get Mail id from user table mail id will be show that role is only client user**************************************
    this.service.getuUser().subscribe((username) => {

      this.userArray = username;


      // this.usernameArray = this.userArray
      //   .filter((user: User) => user.roleName === 'Client User')
      //   .map((user: User) => ({ email: user.email }));

      // console.log(this.usernameArray, 'this is new data');

      this.userMailIds = this.userArray
        .filter((user: User) => user.email)
        .map((user: User) => ({ email: user.email }));


      // for (let i = 0; i < this.userArray.length; i++) {
      //   if (this.userArray[i].roleName === 'Client User') {

      //     console.log(this.userArray[i].roleName,"this is role");

      //     this.usernameArray.push({
      //       email: this.userArray[i].email,
      //     });
      //   }
      // }

      this.lodSpinner.isLoading.next(false);
    });

    //****************************Filter and Map emailIds *************************************************************************************//

    // to get all client
    this.service.getClientDetails().subscribe((data) => {
      this.allFinalMailIds=[];
      this.filteredEmail = data;

      // to get all email ids from clients data
      for (let i = 0; i < this.filteredEmail.length; i++) {
        for (let j = 0; j < this.filteredEmail[i].emailId.length; j++) {
          let obj = {
            email: this.filteredEmail[i].emailId[j],
          };
          this.alreadyExistEmailid.push(obj);
        }
      }

      // to get all mail ids present in userMailIds but not in alreadyExistEmailid
      for (let k = 0; k < this.userMailIds.length; k++) {
        let exists = false;

        for (let l = 0; l < this.alreadyExistEmailid.length; l++) {
          if (this.userMailIds[k].email === this.alreadyExistEmailid[l].email) {
            exists = true;
            break;
          }
        }

        if (!exists) {
          this.allFinalMailIds.push(this.userMailIds[k]);
        }
      }
    });
  }
  // ********************************************************************************************************************************************
  onClickBack() {
    this.service.emitDialogFormData("done");
     this.ReadonlyIndustry=false;
    if (this.clientDetailsForm == true) {
      this.editClientForm = false;
      this.ClientDetailsTable = true;
      this.clientDetailsForm = false;
    } else if (this.editClientForm == true) {
      this.editClientForm = false;
      this.ClientDetailsTable = true;
      this.clientDetailsForm = false;
    }
    this.ngOnInit();
    // this.clientdetailsform2.reset();
  }
  onClickCancel() {
    this.clientDetailsForm = false;
    this.ClientDetailsTable = true;
    this.editClientForm = false;
    this.verifyButtonDisabled = true;
  }

  onClickSave() {

    console.log("client data befor saving: ",this.newClientForm.value);
    
    this.lodSpinner.isLoading.next(true);
    this.confirmationService.confirm({
      message:
        'Client Name is not Editable!', // Display confirmation message
      accept: () => {
        this.service.addClientDetails(this.newClientForm.value).subscribe(
          (data) => {

            this.newClientForm.reset();

            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Data saved successfully',
            });
            this.clientDetailsForm = false;
            this.ClientDetailsTable = true;
            this.lodSpinner.isLoading.next(false);
            this.allFinalMailIds = [];
            this.selectedpeer = [];
            this.ngOnInit();
            this.service.emitDialogFormData("done");    
          },

          (error) => {
            console.error(error);
            this.lodSpinner.isLoading.next(false);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.developerMessage,
            });
          }
        );
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'Client Onboarding Cancelled',
        });
        this.lodSpinner.isLoading.next(false);
      },
    });
  }

  onClickAddClient() {
    this.service.emitDialogFormData("done");

    this.IsEditmode = false;
    this.ClientDetailsTable = false;
    this.clientDetailsForm = true;
    this.clientdetailsformAdd = false;
    this.verifyButtonDisabled = true;
    this.newClientForm.reset();
  }

  VerifyData1() {
    this.lodSpinner.isLoading.next(true);

    const projectCode = this.newClientForm.get('projectCode')?.value;
    const taskCode = this.newClientForm.get('taskCode')?.value;

    
    

    this.service.getProjectcodeData(projectCode, taskCode).subscribe(
      (data: any) => {
        if (data && data.clientName && data.clientAddress) {
          // Check if the client name is already configured
          const isClientConfigured = this.clientDetails.some(
            (client) => client.clientName === data.clientName
          );
  
          if (isClientConfigured) {
            // Client name is already configured, show toast message
            this.messageService.add({
              severity: 'warn',
              summary: 'Client Already Configured',
              detail: 'The client name is already configured in the system.',
            });
          } else {
            // Valid project code and task code, open the form and populate the fields
            this.clientdetailsformAdd = true;
            this.newClientForm.patchValue({
              clientName: data.clientName,
              clientAddress: data.clientAddress,
            });
          }
          this.lodSpinner.isLoading.next(false);
        }
      },

      (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error Retrieving Project code and Task code data',
        });
        this.lodSpinner.isLoading.next(false);
      }
    );
  }

  ClientDetailsUpdate() {
    console.log("Client data for  saveapi: ",this.newClientForm.value);

    this.confirmationService.confirm({
      message: 'Are you sure you want to edit this client?', // Display confirmation message
      accept: () => {
        // If the user accepts, proceed with the client update
        
        this.service
          .UpdateClient(this.clientid, this.newClientForm.value)
          .subscribe(
            (updatedData) => {

              console.log("updatedData: ",updatedData);
              

              // Update the corresponding item in clientDetails array with the updatedData
              const index = this.clientDetails.findIndex(
                (clientDetails) => clientDetails.clientId === this.clientid
              );
              if (index !== -1) {
                this.clientDetails[index] = updatedData;
              }

              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Data Updated successfully',
              });
              this.ngOnInit();
            },
            (error) => {
              console.error(error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to Update data',
              });
            }
          );

        this.clientDetailsForm = false;
        this.ClientDetailsTable = true;
        this.editClientForm = false;
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'Client not updated',
        });
      },
    });
  }
  clientName:any;
  ReadonlyIndustry:boolean=false;
  editClient(id: string) {
    this.lodSpinner.isLoading.next(true);

    // this.editClientDialog = true;

    this.service.getClientDataById(id).subscribe((data: any) => {
      this.clientData = data;

      console.log("get client data by ID: ",data);
      

      this.clientid = this.clientData.clientId;
      this.clientName=this.clientData.clientName
     
      this.verifyButtonDisabled = false;
      this.IsEditmode = true;
     
      this.newClientForm
        .get('clientName')
        ?.patchValue(this.clientData.clientName),
        this.newClientForm
          .get('emailDomain')
          ?.patchValue(this.clientData.emailDomain),
        this.newClientForm
          .get('industry')
          ?.patchValue(this.clientData.industry),
          this.onIndustryChange();

        this.newClientForm
          .get('clientAddress')
          ?.patchValue(this.clientData.clientAddress),
        this.newClientForm.get('emailId')?.patchValue(this.clientData.emailId);
      // To filter a data in key value pair
      this.filterMailIdsForEdit(this.clientData.emailId);

      // this.allFinalMailIds=this.clientData.emailId;
      // console.log("this.clientData.suggestedPeers.length: ",this.clientData.suggestedPeers.length);
      
      if (this.clientData.suggestedPeers !== undefined && this.clientData.suggestedPeers[0] !== '') {
        console.log("this.clientData.suggestedPeers: ",this.clientData.suggestedPeers);
        
        this.newClientForm
          .get('suggestedPeers')
          ?.patchValue(this.clientData.suggestedPeers);

        // filter suggested peers
        this.ReadonlyIndustry = true;
        this.filterSuggestedPeersForEdit(this.clientData.suggestedPeers);
        this.onIndustryChange();

       
      }else{
        console.log("this.clientData.suggestedPeers1: ",this.clientData.suggestedPeers);
        
      }
      this.newClientForm.get('assignAA')?.patchValue(this.clientData.assignAA),
        this.newClientForm
          .get('projectCode')
          ?.patchValue(this.clientData.projectCode),
        this.newClientForm
          .get('taskCode')
          ?.patchValue(this.clientData.taskCode);

      this.clientdetailsformAdd = true;
      this.IsProjectCode = false;
      this.ClientDetailsTable = false;
      this.editClientForm = true;
      this.clientDetailsForm = true;

      this.lodSpinner.isLoading.next(false);
    });
  }

  filterMailIdsForEdit(inputdata: any) {
    this.allFinalMailIds = [];
    let data = inputdata.filter((user: any) => {
      if(user!=''){
      let newData = {
        email: user,
      };
    
      this.allFinalMailIds.push(newData);
    }
    });
  }
  // filterSuggestedPeersForEdit(inputdata1: any) {
  //   console.log('selectedpeer: ', this.selectedpeer);

  //   this.selectedpeer = inputdata1
  //     .filter((client: any) => client.trim() !== '') // Filter out empty strings
  //     .map((client: any) => {
  //       return {
  //         clientName: client.trim()
  //       };
  //     });
  // }
  filterSuggestedPeersForEdit(inputdata1: any) {
  
    const filteredPeers:any[]=[];

    inputdata1.filter((data:any)=>{
      if(data!=''){
        filteredPeers.push(data)
      }
    })
      // Filter out empty strings
      .filter((client: any) => 
      {
        client.trim() !== ''
      })
      .map((client: any) =>{ client.trim()
      });

    const joinedPeers = filteredPeers.join(' , ');

    this.selectedpeer = [{ clientName: joinedPeers }];
console.log("filtered selected peers: ",this.selectedpeer);

const selectedPeersArray = filteredPeers.map((peer:any)=>({
  clientName:peer
  }))
  this.selectedpeer = selectedPeersArray

    return this.selectedpeer
  }




  onClickDeleteData(clientid: string) {
    // Show confirmation dialog before deleting the client data
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this client?', // Display confirmation message
      accept: () => {
        // If user confirms (clicks "Yes")
        this.lodSpinner.isLoading.next(true);

        this.service.DeleteClientData(clientid).subscribe(
          (data) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'User deleted successfully',
            });
            this.editClientDialog = false;
            this.clientDetailsForm = true;
            this.ngOnInit();

            this.lodSpinner.isLoading.next(false);
            this.ClientDetailsTable = true;
            this.editClientForm = false;
            this.clientDetailsForm = false;
          },

          (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Something went wrong while deleting user..!!',
            });
          }
        );
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'Client not Deleted',
        });
      },
    });
  }



  onIndustryChange() {
    let filterPeers: any[] = [];
    const selectedIndustry = this.newClientForm.get('industry')?.value;

    filterPeers = this.clientDetails
      .filter((client: any) => {
        if ((client.industry === selectedIndustry)&&(client.clientName!=this.clientName) ) {
          return client.clientName;
        }
      })
      .map((client: any) => {

        return { clientName: client.clientName };
      });

    this.selectedpeer = filterPeers;
    // filterPeers?=this.selectedpeer;
  }



 
}
