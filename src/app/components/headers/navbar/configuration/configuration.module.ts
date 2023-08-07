import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAndMapLineItemsComponent } from './analyst/add-and-map-line-items/add-and-map-line-items.component';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';
import { AddLineItemsComponent } from './analyst/add-and-map-line-items/add-line-items/add-line-items.component';
import { MapLineItemsComponent } from './analyst/add-and-map-line-items/map-line-items/map-line-items.component';
import { ClientComponent } from './client/client.component';
import { AddAndMapClientLineItemComponent } from './client/add-and-map-client-line-item/add-and-map-client-line-item.component';
import { AddClientLineItemComponent } from './client/add-and-map-client-line-item/add-client-line-item/add-client-line-item.component';
import { MapClientLineItemComponent } from './client/add-and-map-client-line-item/map-client-line-item/map-client-line-item.component';
import { StockEstimatesComponent } from './analyst/stock-estimates/stock-estimates.component';
import { ClientSetupFormComponent } from './client/client-setup-form/client-setup-form.component';
import { ClientDetailsComponent } from './client/client-setup-form/client-details/client-details.component';
import { ClientLabelComponent } from './client/client-setup-form/client-label/client-label.component';
import { ReportTableHeaderComponent } from './analyst/report-table-header/report-table-header.component';
import { ClientFinancialRatioComponent } from './client/client-setup-form/client-financial-ratio/client-financial-ratio.component';
import { ClientSetupDropdownComponent } from './client/client-setup-dropdown/client-setup-dropdown.component';
// import { ClientAddMapLineItemsComponent } from './client/client-add-map-line-items/client-add-map-line-items.component';
// import { AddClientLineItemsComponent } from './client/client-add-map-line-items/add-client-line-items/add-client-line-items.component';
// import { MapClientLineItemsComponent } from './client/client-add-map-line-items/map-client-line-items/map-client-line-items.component';
// import { ClientComponent } from './client/client.component';
// import { SpinnerComponent } from './master-db/spinner/spinner.component';

@NgModule({
  declarations: [
    // AddAndMapLineItemsComponent

    // AddLineItemsComponent,
    // MapLineItemsComponent
    // SpinnerComponent

    // ClientComponent,

    // ClientAddMapLineItemsComponent,
    // AddClientLineItemsComponent,
    // MapClientLineItemsComponent
  
    // AddAndMapClientLineItemComponent,
    // AddClientLineItemComponent,
    // MapClientLineItemComponent
  
    // StockEstimatesComponent
  
    // ClientSetupFormComponent
  
    // ClientDetailsComponent
  
    // ClientLabelComponent
  
    // ReportTableHeaderComponent
  
    // ClientFinancialRatioComponent
  

  ],
  imports: [CommonModule, SharedModuleModule],
})
export class ConfigurationModule {}
