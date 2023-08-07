import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
import { LoadingSpinnerService } from 'src/app/loading-spinner.service';

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class AssetComponent implements OnInit {
  selectedFiles!: FileList;
  currentFile!: File;
  constructor(    private service: IRServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private lodSpinner: LoadingSpinnerService) { }
    isLoading: boolean = false;
  ngOnInit(): void {

    this.lodSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });

    this.lodSpinner.isLoading.next(false);
  }


  selectFile(event:any){
    this.selectedFiles = event.target.files;
  }

  onClickUpload(){
    console.log(this.selectedFiles, 'excel file uploaded');
    this.lodSpinner.isLoading.next(true);
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      console.log(file, 'inside upload method');
      if (file) {
        this.currentFile = file;
        this.service.ocrData(this.currentFile).subscribe(
          (data1: any) => {
               console.log(data1,"data is here");
               this.service.ocrDownload(data1.body.filename).subscribe(
                (x: any) => {
                  var newBlob = new Blob([x], { type: 'application/vnd.ms-excel' });
                  const data = window.URL.createObjectURL(newBlob);
          
                  var link = document.createElement('a');
                  link.href = data;
                  link.download = `${data1.body.filename}.xlsx`;
          
                  link.dispatchEvent(
                    new MouseEvent('click', {
                      bubbles: true,
                      cancelable: true,
                      view: window,
                    })
                  );
                  this.lodSpinner.isLoading.next(false);
                  console.log('file Downloded');
                },
                (error: HttpErrorResponse) => {
                  alert('something went wrong');
                }
              );
            console.log('data is passing');
                this.messageService.add({
                severity: 'success',
                summary: 'Successfull',
                detail: 'Data Extracted Successfully',
              });
            },
            (error: HttpErrorResponse) => {
              this.lodSpinner.isLoading.next(false);
             this.messageService.add({
                severity: 'warn',
                summary: 'Error',
                detail: '!!!!!!!!',
              });
            } 
         
        )
       
      }
    }
  }

}
