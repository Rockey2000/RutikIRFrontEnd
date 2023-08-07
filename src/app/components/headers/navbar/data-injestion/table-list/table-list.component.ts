import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
import { LoadingSpinnerService } from 'src/app/loading-spinner.service';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class TableListComponent implements OnInit {
  getDataByFileId: any[] = [];
  labelDialog:boolean=false
  updatedTableName!: string;
  tableId!: string;
  dataValueTable: boolean = false;
  selectedTableData: any;
  constructor(  private lodSpinner: LoadingSpinnerService,
    private service: IRServiceService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    

    this.service.getDataByFileId(this.route.snapshot.params['fileId']).subscribe(
      (data: any) => {
        this.getDataByFileId = data;
        console.log('get data by file ID');
          console.log(
          this.getDataByFileId,
          '*********data is avalible for fetch');

      },
      (error: HttpErrorResponse) => {
       
        console.log(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:'Something Went Wrong !',
        });
      }
    );
  }

  onClickBack(){
    console.log("back");
    this.router.navigate(['/document/nav/dataInjestion/dataIngestionMenu/docUpload']);
    this.ngOnInit();
  }
  selectedTableValue(tableData: any){
    console.log(tableData, 'table data');
    this.dataValueTable = true;
    this.service.tableData = tableData;

    // this.columnData();
    console.log(tableData.tableId + 'tableData.tableId    =====>');

    this.router.navigate([
      '/document/nav/dataInjestion/tableData/' + tableData.tableId,
    ]);
  }
  deleteTable(id: any){
    this.lodSpinner.isLoading.next(true);
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this table',
      accept: () => {
        this.service.deleteTableValue(id).subscribe(
          (data: any) => {
            console.log('table deleted successfully');
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Table deleted successfully',
            });
            this.ngOnInit();
            this.lodSpinner.isLoading.next(false);
          },
          (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'Danger',
              summary: 'Error',
              detail: 'Something went wrong while deleting table..!!',
            });
          }
        );
        this.ngOnInit();
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'Table not deleted',
        });
      },
    });
  }


  editTableName(TableName: any){
    console.log(TableName, 'table data');
    this.updatedTableName = TableName.tableName;
    this.selectedTableData = TableName;

    this.labelDialog = true;
  }

  hideDialog(){
    this.labelDialog = false;
  }
  saveDialog(id: any){
    this.selectedTableData.tableName = this.updatedTableName;

    this.service.editTableName(this.selectedTableData).subscribe(
      (data: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Table name updated successfully..!!',
        });
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while updating table name, please try again later..!!',
        });
      }
    );
    this.labelDialog = false;
  }
}
