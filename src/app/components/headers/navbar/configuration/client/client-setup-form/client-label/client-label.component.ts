import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingSpinnerService } from 'src/app/loading-spinner.service';
import { timer } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-label',
  templateUrl: './client-label.component.html',
  styleUrls: ['./client-label.component.css'],
})
export class ClientLabelComponent implements OnInit {
  isDragOver = false;
  selectedFile: any;

  selectedFileCss: any;
  isDragOverCss = false;
  file: any;
  @ViewChild('fileUpload')
  fileUpload!: FileUpload;
  @ViewChild('fileUpload2') cssFileUpload!: FileUpload;

  clientLabelForm: boolean = true;
  clienLabelTable: boolean = false;
  clientLabel: any;
  analystnameArr: any = [];
  analystnameClientArr: any = [];
  whitelableform!: FormGroup;
  isLoading: boolean = false;
  clientDetailsArray: any = [];
  whiteLableArray: any = [];

  constructor(
    private service: IRServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private lodSpinner: LoadingSpinnerService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.lodSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });
    this.lodSpinner.isLoading.next(true);

    this.selectedFile = '';
    this.file = '';

    this.whitelableform = new FormGroup({
      clientName: new FormControl('', [Validators.required]),
      logofile:new FormControl('',[Validators.required]),
      cssfile:new FormControl('',[Validators.required]),
    });

    // this.service.getAnalystDetails().subscribe((analystname)=>{
    //   console.log(analystname,"this is analyst name in client Finantial ratio");

    //   this.analystnameArr = analystname

    //   console.log(this.analystnameArr,"this is assign values to array");

    //   for(let i=0; i<this.analystnameArr.length; i++)
    //   {
    //     this.analystnameClientArr.push({
    //       name:this.analystnameArr[i].analystName
    //     })
    //   }
    //   timer(500).subscribe(() => {
    //     this.lodSpinner.isLoading.next(false);
    //   });

    // })

    this.service.getClientDetails().subscribe((data: any) => {
      console.log(data, 'Ths is Client Details');

      this.clientDetailsArray = data;
      console.log(this.clientDetailsArray, 'this is Whitelable Client data');

      for (let i = 0; i < this.clientDetailsArray.length; i++) {
        this.whiteLableArray.push({
          clientName: this.clientDetailsArray[i].clientName,
        });
      }
      console.log(this.whiteLableArray, 'whiteLableArray');
      this.lodSpinner.isLoading.next(false);
    });

    // *********************************************
    this.service.getClientDetails().subscribe(
      (data: any) => {
        console.log('All clients: ', data);
        this.transformClientData(data);
      },
      (error: HttpErrorResponse) => {
        alert(error);
      }
    );
  }
  allData: any[] = [];
  transformClientData(inputData: any) {
    // const allData: any[] = [];

    inputData.forEach((data: any) => {
      const industryExists = this.allData.find(
        (item) => item.name === data.industry
      );

      if (industryExists) {
        industryExists.states.push({ name: data.clientName });
      } else {
        this.allData.push({
          name: data.industry,
          states: [{ name: data.clientName }],
        });
      }
    });

    console.log('Parent-Child structure:', this.allData);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragOverCss(event: DragEvent): void {
    event.preventDefault();
    this.isDragOverCss = true;
  }
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }
  onDragLeaveCss(event: DragEvent): void {
    event.preventDefault();
    this.isDragOverCss = false;
  }
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer && event.dataTransfer.files) {
      const file = event.dataTransfer.files[0];
      this.displayFilePreview(file);
    }
  }
  onDropCss(event: DragEvent): void {
    event.preventDefault();
    this.isDragOverCss = false;
    if (event.dataTransfer && event.dataTransfer.files) {
      const file2 = event.dataTransfer.files[0];
      this.displayFilePreviewCss(file2);
    }
  }

  onFileUpload(event: any): void {
    console.log('event1:', event);

    this.file = event.files[0];
    this.displayFilePreview(this.file);
    console.log(this.file, 'file selected');
  }

  onFileUploadCss(event: any): void {
    console.log('event: ', event);

    const file2 = event.files[0];
    this.displayFilePreviewCss(file2);
    console.log(file2, 'file selected');
  }

  displayFilePreview(file: File): void {
    const reader = new FileReader();

    reader.onload = () => {
      this.selectedFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        dataURL: reader.result,
      };
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }
  displayFilePreviewCss(file2: File): void {
    const reader = new FileReader();

    reader.onload = () => {
      this.selectedFileCss = {
        name: file2.name,
        size: file2.size,
        type: file2.type,
        dataURL: reader.result,
      };
    };

    if (file2) {
      reader.readAsDataURL(file2);
    }
  }
  onClickCancelLogo() {
    this.selectedFile = null;
    this.fileUpload.clear();
    this.ngOnInit();
  }

  onClickCancelCss() {
    this.selectedFileCss = null;
    this.cssFileUpload.clear();
  }

  onClickBack() {
    // this.route.navigate(['/document/nav/config/clientSetup/clientDetails']);
  }

  //   selectedFile: File | null;
  // selectedFileCss: File | null;

  selectFile(event: any) {
    this.selectedFile = event.target.files;
  }
  selectFilecss(event: any) {
    this.selectedFileCss = event.target.files;
  }

  onClickSave() {
    // Display loading spinner
    this.lodSpinner.isLoading.next(true);
  
    if (this.selectedFile && this.selectedFileCss) {
      const logFile: File | null = this.selectedFile.item(0);
      const cssFile: File | null = this.selectedFileCss.item(0);
  
      if (logFile && cssFile) {
        const clientName = this.whitelableform.get('clientName')?.value;
        let isMessageDisplayed = false; // Flag variable to track message display
  
        this.service.Uploadwhitelable(logFile, cssFile, { clientName }).subscribe(
          (data: any) => {
            console.log(data, 'data is uploaded');
  
            if (!isMessageDisplayed) {
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'File saved successfully',
              });
              isMessageDisplayed = true;
            }
  
            timer(500).subscribe(() => {
              this.lodSpinner.isLoading.next(false);
              this.whitelableform.reset();
              this.ngOnInit();
            });
          },
  
          (error: HttpErrorResponse) => {
            if (!isMessageDisplayed) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'An error occurred during file upload',
              });
              isMessageDisplayed = true;
            }
  
            window.location.reload();
            this.lodSpinner.isLoading.next(false);
          }
        );
      }
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Incomplete',
        detail: 'Please select both logo and CSS files',
      });
      this.lodSpinner.isLoading.next(false);
    }
  }
  
  // Other methods and event handlers in your component
}
