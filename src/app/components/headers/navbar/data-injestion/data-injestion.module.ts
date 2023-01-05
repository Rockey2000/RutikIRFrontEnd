import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocUploadComponent } from './doc-upload/doc-upload.component';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';
import { RouterModule } from '@angular/router';
import { NewDocUploadComponent } from './new-doc-upload/new-doc-upload.component';
import { TableDataComponent } from './table-data/table-data.component';

@NgModule({
  declarations: [DocUploadComponent, NewDocUploadComponent, TableDataComponent],
  imports: [
    CommonModule,
    SharedModuleModule,
    RouterModule.forChild([
      {
        path: 'docUpload',
        component: DocUploadComponent,
        data: { breadcrumb: 'Upload New Data' },
      },
      {
        path: 'uploadDoc',
        component: NewDocUploadComponent,
      },
      {
        path: 'tableData/:Id',
        component:TableDataComponent,
      }
    ]),
  ],
})
export class DataInjestionModule {}
