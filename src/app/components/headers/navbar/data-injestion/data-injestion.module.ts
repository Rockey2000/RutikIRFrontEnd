import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocUploadComponent } from './doc-upload/doc-upload.component';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';
import { RouterModule } from '@angular/router';
import { NewDocUploadComponent } from './new-doc-upload/new-doc-upload.component';
import { TableDataComponent } from './table-data/table-data.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { TableModule } from 'primeng/table';
import { TableHeaderCheckbox } from 'primeng/table';
import { TableListComponent } from './table-list/table-list.component';
import { PaginatorModule } from 'primeng/paginator';
import { FilesDataComponent } from './files-data/files-data.component';
import { DataIngestionMenuComponent } from './data-ingestion-menu/data-ingestion-menu.component';
import { NonProcessingTableComponent } from './non-processing-table/non-processing-table.component';
@NgModule({
  declarations: [
    DocUploadComponent,
    NewDocUploadComponent,
    TableDataComponent,
    SpinnerComponent,
    TableListComponent,
    FilesDataComponent,
    DataIngestionMenuComponent,
    DataIngestionMenuComponent,
    NonProcessingTableComponent
  ],
  imports: [
    CommonModule,
    SharedModuleModule,
    TableModule,
    PaginatorModule,
    RouterModule.forChild([
      {
        path: 'uploadDoc/:fileData',
        component: NewDocUploadComponent,
        data: { breadcrumb: 'Upload New Data' },
      },
      {
        path: 'uploadDoc',
        component: NewDocUploadComponent,
        data: { breadcrumb: 'Upload New Data' },
      },
      {
        path: 'tableData/:Id',
        component: TableDataComponent,
        data: { breadcrumb: 'Table Data' },
      },
      {
        path: 'tableList/:fileId',
        component: TableListComponent,
        data: { breadcrumb: 'Extracted Table List' },
      },
      {
        path: 'setFilesData/:clientName/:clientId',
        component: FilesDataComponent,
        data: { breadcrumb: 'Set Data For Files' },
      },

      {
        path: 'dataIngestionMenu',
        component: DataIngestionMenuComponent,
        data: { breadcrumb: 'Data Ingestion' },
        children: [
          {
            path: 'docUpload',
            component: DocUploadComponent,
            data: { breadcrumb: 'Upload New Data' },
          },
          {
            path:'nonProcessingTable',
            component:NonProcessingTableComponent,
            data:{breadcrumb:'Pending For Configuration'}
          }
        ],
      },
    ]),
  ],
})
export class DataInjestionModule {}
