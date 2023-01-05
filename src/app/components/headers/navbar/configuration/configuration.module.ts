import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAndMapLineItemsComponent } from './analyst/add-and-map-line-items/add-and-map-line-items.component';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';
import { AddLineItemsComponent } from './analyst/add-and-map-line-items/add-line-items/add-line-items.component';
import { MapLineItemsComponent } from './analyst/add-and-map-line-items/map-line-items/map-line-items.component';




@NgModule({
  declarations: [
    // AddAndMapLineItemsComponent
  
    // AddLineItemsComponent,
    // MapLineItemsComponent
  
   
  
  ],
  imports: [
    CommonModule,
    SharedModuleModule
  ]
})
export class ConfigurationModule { }
