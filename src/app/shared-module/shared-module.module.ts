import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ButtonModule} from 'primeng/button';
import {ToolbarModule} from 'primeng/toolbar';
import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule} from '@angular/common/http';
import {DialogModule} from 'primeng/dialog';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {InputSwitchModule} from 'primeng/inputswitch';
import {TableModule} from 'primeng/table';
import {TabViewModule} from 'primeng/tabview';
import { RouterModule } from '@angular/router';
import {DividerModule} from 'primeng/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CascadeSelectModule} from 'primeng/cascadeselect';
import {DropdownModule} from 'primeng/dropdown';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ToastModule} from 'primeng/toast';
import {EditorModule} from 'primeng/editor';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {DataViewModule} from 'primeng/dataview';
import {KnobModule} from 'primeng/knob';
import {StepsModule} from 'primeng/steps';
import {TabMenuModule} from 'primeng/tabmenu';
import {CheckboxModule} from 'primeng/checkbox';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MultiSelectModule} from 'primeng/multiselect';
import {TreeSelectModule} from 'primeng/treeselect';
import {CalendarModule} from 'primeng/calendar';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { SpreadsheetAllModule } from '@syncfusion/ej2-angular-spreadsheet';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    ToolbarModule,
    FileUploadModule,
    CardModule,
    DialogModule,
    InputTextModule,
    TableModule,
    InputSwitchModule,
    TabViewModule,
    DividerModule,
    FormsModule,
    ReactiveFormsModule,
    CascadeSelectModule,
    DropdownModule,
    ConfirmDialogModule,
    ToastModule,
    EditorModule,
    InputTextareaModule,
    DataViewModule,
    KnobModule,
    StepsModule,
    TabMenuModule,
    CheckboxModule,
    BreadcrumbModule,
    FlexLayoutModule,
    MultiSelectModule,
    TreeSelectModule,
    CalendarModule,
    MessagesModule,
    MessageModule,
    SpreadsheetAllModule
  ],
  exports:[
    RouterModule,
    ButtonModule,
    ToolbarModule,
    FileUploadModule,
    CardModule,
    DialogModule,
    InputTextModule,
    TableModule,
    InputSwitchModule,
    TabViewModule,
    DividerModule,
    FormsModule,
    ReactiveFormsModule,
    CascadeSelectModule,
    DropdownModule,
    ConfirmDialogModule,
    ToastModule,
    EditorModule,
    InputTextareaModule,
    DataViewModule,
    KnobModule,
    StepsModule,
    TabMenuModule,
    CheckboxModule,
    BreadcrumbModule,
    FlexLayoutModule,
    MultiSelectModule,
    TreeSelectModule,
    CalendarModule,
    SpreadsheetAllModule
  ]
})
export class SharedModuleModule { }
