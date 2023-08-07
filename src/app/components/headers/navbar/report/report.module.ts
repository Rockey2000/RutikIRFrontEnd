import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report.component';
import { SharedModule } from 'primeng/api';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [ReportComponent],
  imports: [
    CommonModule,
   SharedModule,
   RouterModule.forChild([
    {
      path: 'report',
      component: ReportComponent,
      data: { breadcrumb: { skip: true } }
    }
   ])
  ]
})
export class ReportModule { }
