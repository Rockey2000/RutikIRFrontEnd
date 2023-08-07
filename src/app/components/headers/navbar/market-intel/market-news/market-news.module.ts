import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { RouterModule } from '@angular/router';
import { MarketIntelComponent } from '../market-intel.component';
import { MarketNewsComponent } from './market-news.component';



@NgModule({
  declarations: [MarketIntelComponent,MarketNewsComponent],
  imports: [
    CommonModule,
    SharedModuleModule,
    BreadcrumbModule,
    RouterModule.forChild([
      {
        path:'newsApi',
        component:MarketIntelComponent,
        data:{breadcrumb:'Market Intel'}
      },
      {
        path:'marketNews',
        component:MarketNewsComponent,
        data: {breadcrumb:'Market News'}
      }
    ])
  ]
})
export class MarketNewsModule { }
