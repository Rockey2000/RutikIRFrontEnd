import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { ConfigurationComponent } from './navbar/configuration/configuration.component';
import { MasterDbComponent } from './navbar/configuration/master-db/master-db.component';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';
import { RouterModule } from '@angular/router';
import { NewrowDirective } from './navbar/configuration/master-db/newrow.directive';
import { BalanceSheetComponent } from './navbar/configuration/master-db/balance-sheet/balance-sheet.component';
import { IncomeStatementComponent } from './navbar/configuration/master-db/income-statement/income-statement.component';
import { CashFlowComponent } from './navbar/configuration/master-db/cash-flow/cash-flow.component';
import { ShareholderDataComponent } from './navbar/configuration/master-db/shareholder-data/shareholder-data.component';
import { ShContactDetailsComponent } from './navbar/configuration/master-db/sh-contact-details/sh-contact-details.component';
import { MeetingDataComponent } from './navbar/configuration/master-db/meeting-data/meeting-data.component';
import { FinancialRatiosComponent } from './navbar/configuration/master-db/financial-ratios/financial-ratios.component';
import { UserComponent } from './navbar/configuration/master-db/user/user.component';
import { RoleComponent } from './navbar/configuration/master-db/role/role.component';
// import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { BreadcrumbService } from 'xng-breadcrumb';
import { AnalystComponent } from './navbar/configuration/analyst/analyst.component';
import { LineItemNomenclatureComponent } from './navbar/configuration/analyst/line-item-nomenclature/line-item-nomenclature.component';
import { DataInjestionModule } from './navbar/data-injestion/data-injestion.module';
import { AddAndMapLineItemsComponent } from './navbar/configuration/analyst/add-and-map-line-items/add-and-map-line-items.component';
import { AddLineItemsComponent } from './navbar/configuration/analyst/add-and-map-line-items/add-line-items/add-line-items.component';
import { MapLineItemsComponent } from './navbar/configuration/analyst/add-and-map-line-items/map-line-items/map-line-items.component';
import { NewDocUploadComponent } from './navbar/data-injestion/new-doc-upload/new-doc-upload.component';
import { AnalystDetailsComponent } from './navbar/configuration/analyst/analyst-details/analyst-details.component';
import { SpinnerComponent } from './navbar/configuration/master-db/spinner/spinner.component';
import { AuthGuard } from 'src/app/shared-module/auth.guard';
import { AnalystGuard } from 'src/app/shared-module/analyst.guard';
import { ClientGuard } from 'src/app/shared-module/client.guard';
import { AssetComponent } from './navbar/asset/asset.component';
import { AppComponent } from 'src/app/app.component';
import { AuthModule } from 'src/app/auth/auth.module';
import { ReportModule } from './navbar/report/report.module';
import { ClientComponent } from './navbar/configuration/client/client.component';
import { AddAndMapClientLineItemComponent } from './navbar/configuration/client/add-and-map-client-line-item/add-and-map-client-line-item.component';
import { AddClientLineItemComponent } from './navbar/configuration/client/add-and-map-client-line-item/add-client-line-item/add-client-line-item.component';
import { MapClientLineItemComponent } from './navbar/configuration/client/add-and-map-client-line-item/map-client-line-item/map-client-line-item.component';
import { MeetingsModule } from './navbar/meetings/meetings.module';
import { StockEstimatesComponent } from './navbar/configuration/analyst/stock-estimates/stock-estimates.component';
import { ClientSetupFormComponent } from './navbar/configuration/client/client-setup-form/client-setup-form.component';
import { ClientDetailsComponent } from './navbar/configuration/client/client-setup-form/client-details/client-details.component';
import { ClientLabelComponent } from './navbar/configuration/client/client-setup-form/client-label/client-label.component';

import { MarketNewsModule } from './navbar/market-intel/market-news/market-news.module';
import { ReportTableHeaderComponent } from './navbar/configuration/analyst/report-table-header/report-table-header.component';
import { ClientFinancialRatioComponent } from './navbar/configuration/client/client-setup-form/client-financial-ratio/client-financial-ratio.component';
import { MarketNewsComponent } from './navbar/market-intel/market-news/market-news.component';
import { ClientSetupDropdownComponent } from './navbar/configuration/client/client-setup-dropdown/client-setup-dropdown.component';
@NgModule({
  declarations: [
    NavbarComponent,
    ConfigurationComponent,
    MasterDbComponent,
    NewrowDirective,
    BalanceSheetComponent,
    IncomeStatementComponent,
    CashFlowComponent,
    ShareholderDataComponent,
    ShContactDetailsComponent,
    MeetingDataComponent,
    FinancialRatiosComponent,
    AnalystDetailsComponent,
    UserComponent,
    RoleComponent,
    AnalystComponent,
    LineItemNomenclatureComponent,
    AddAndMapLineItemsComponent,
    AddLineItemsComponent,
    MapLineItemsComponent,
    SpinnerComponent,
    AssetComponent,
    ClientComponent,
    ClientSetupFormComponent,
    AddAndMapClientLineItemComponent,
    AddClientLineItemComponent,
    MapClientLineItemComponent,
    StockEstimatesComponent,
    ClientDetailsComponent,
    ClientLabelComponent,
    ReportTableHeaderComponent,
    ClientFinancialRatioComponent,
    ClientSetupDropdownComponent,
  ],

  imports: [
    CommonModule,
    SharedModuleModule,
    BreadcrumbModule,
    RouterModule.forChild([
      {
        path: '',
        loadChildren: () => AuthModule,
      },
      {
        path: 'nav',
        component: NavbarComponent,
        data: { breadcrumb: { skip: true } },

        children: [
          {
            path: 'config',
            component: ConfigurationComponent,
            data: { breadcrumb: 'Configuration' },
            canActivate: [AnalystGuard],
            children: [
              {
                path: 'role',
                component: RoleComponent,
                data: { breadcrumb: 'Role' },
                canActivate: [AuthGuard],
              },
              {
                path: 'user',
                component: UserComponent,
                data: { breadcrumb: 'User' },
                canActivate: [AuthGuard],
              },
              {
                path: 'master-db',
                component: MasterDbComponent,
                data: { breadcrumb: 'Master Data' },
                canActivate: [AnalystGuard],
                children: [
                  {
                    path: 'balance-sheet',
                    pathMatch: 'full',
                    component: BalanceSheetComponent,
                    data: { breadcrumb: 'Balance Sheet' },
                    canActivate: [AnalystGuard],
                  },
                  {
                    path: 'income',
                    component: IncomeStatementComponent,
                    data: { breadcrumb: 'Income Statement' },
                    canActivate: [AnalystGuard],
                  },
                  {
                    path: 'cash-flow',
                    component: CashFlowComponent,
                    data: { breadcrumb: 'Cash Flow' },
                    canActivate: [AnalystGuard],
                  },
                  {
                    path: 'finacial-ratio',
                    component: FinancialRatiosComponent,
                    data: { breadcrumb: 'Financial Ratio' },
                    canActivate: [AnalystGuard],
                  },
                  {
                    path: 'shareholder',
                    component: ShareholderDataComponent,
                    data: { breadcrumb: 'Shareholder Data' },
                    canActivate: [AnalystGuard],
                  },
                  {
                    path: 'meeting',
                    component: MeetingDataComponent,
                    data: { breadcrumb: 'Meeting Data' },
                    canActivate: [AnalystGuard],
                  },
                  {
                    path: 'contact',
                    component: ShContactDetailsComponent,

                    data: { breadcrumb: 'Share Holder Contact Details' },
                    canActivate: [AnalystGuard],
                  },
                ],
              },

              {
                path: 'analyst',
                component: AnalystComponent,
                data: { breadcrumb: 'Analyst' },
                canActivate: [AnalystGuard],
                children: [
                  {
                    path: 'nomenclature',
                    component: LineItemNomenclatureComponent,
                    data: { breadcrumb: 'Line Item Nomenclature' },
                    canActivate: [AnalystGuard],
                  },
                  {
                    path: 'analystDetails',
                    component: AnalystDetailsComponent,
                    data: { breadcrumb: 'Analyst Details' },
                    canActivate: [AnalystGuard],
                  },
                  {
                    path: 'addAndMapingLineItems',
                    component: AddAndMapLineItemsComponent,
                    data: { breadcrumb: 'Add And Map Line Items' },
                    canActivate: [AnalystGuard],
                    children: [
                      {
                        path: 'addLineItem',
                        component: AddLineItemsComponent,
                        data: { breadcrumb: 'Add Line Item' },
                        canActivate: [AnalystGuard],
                      },
                      {
                        path: 'mapLineItem',
                        component: MapLineItemsComponent,
                        data: { breadcrumb: 'Map Line Items' },
                        canActivate: [AnalystGuard],
                      },
                    ],
                  },
                  {
                    path: 'stockEstimates',
                    component: StockEstimatesComponent,
                    data: { breadcrumb: 'Stock Estimates' },
                  },
                  {
                    path: 'tableheader',
                    component: ReportTableHeaderComponent,
                    data: { breadcrumb: 'Report Table Header' },
                  },
                ],
              },
              {
                path: 'clientSetupDetails',
                component: ClientSetupDropdownComponent,
                data: { breadcrumb: 'Client Setup' },
                children: [
                  {
                    path: 'client',
                    component: ClientComponent,
                    data: { breadcrumb: 'Client Nomenclature' },
                    // canActivate: [AnalystGuard],
                    children: [
                      {
                        path: 'addAndMapingClientLineItems',
                        component: AddAndMapClientLineItemComponent,
                        data: { breadcrumb: 'Add And Map Client Line Items' },
                        // canActivate: [AnalystGuard],
                      },
                    ],
                  },

                  {
                    path: 'clientSetup',
                    component: ClientSetupFormComponent,
                    data: { breadcrumb: 'Client Setup' },
                    children: [
                      {
                        path: 'clientDetails',
                        component: ClientDetailsComponent,
                        data: { breadcrumb: 'Client Details' },
                      },
                      {
                        path: 'clientLabel',
                        component: ClientLabelComponent,
                        data: { breadcrumb: 'Whitelabelling' },
                      },
                      {
                        path: 'clientFinancialRatio',
                        component: ClientFinancialRatioComponent,
                        data: { breadcrumb: 'Client Financial Ratio' },
                      },
                    ],
                  },
                ],
              },
              {
                path: 'client',
                component: ClientComponent,
                data: { breadcrumb: 'Client' },
                // canActivate: [AnalystGuard],
                children: [
                  {
                    path: 'addAndMapingClientLineItems',
                    component: AddAndMapClientLineItemComponent,
                    data: { breadcrumb: 'Add And Map Client Line Items' },
                    // canActivate: [AnalystGuard],
                  },
                ],
              },

              {
                path: 'addAndMapingClientLineItems',
                component: AddAndMapClientLineItemComponent,
                data: { breadcrumb: 'Add And Map Client Line Items' },
                children: [
                  {
                    path: 'addClientLineItem',
                    component: AddClientLineItemComponent,
                    data: { breadcrumb: 'Add Client Line Item' },
                    // canActivate: [AnalystGuard],
                  },
                  {
                    path: 'mapClientLineItem',
                    component: MapClientLineItemComponent,
                    data: { breadcrumb: 'Map Client Line Items' },
                    // canActivate: [AnalystGuard],
                  },
                ],
              },
              {
                path: 'clientSetup',
                component: ClientSetupFormComponent,
                data: { breadcrumb: 'Client Setup' },
                children: [
                  {
                    path: 'clientDetails',
                    component: ClientDetailsComponent,
                    data: { breadcrumb: 'Client Details' },
                  },
                  {
                    path: 'clientLabel',
                    component: ClientLabelComponent,
                    data: { breadcrumb: 'Whitelabelling' },
                  },
                  {
                    path: 'clientFinancialRatio',
                    component: ClientFinancialRatioComponent,
                    data: { breadcrumb: 'Client Financial Ratio' },
                  },
                ],
              },
            ],
          },
          {
            path: 'dataInjestion',
            loadChildren: () => DataInjestionModule,
            data: { breadcrumb: 'Data' },
            canActivate: [ClientGuard],
          },
          {
            path: 'report',
            loadChildren: () => ReportModule,
            data: { breadcrumb: { skip: true } },
            
            canActivate: [ClientGuard],
          },
          {
            path: 'meetings',
            loadChildren: () => MeetingsModule,
            data: { breadcrumb: 'Meetings' },
            
          },
          {
            path: 'marketNews',
            loadChildren: () => MarketNewsModule,
            data: { breadcrumb: 'News' },
          },
        ],
      },
    ]),
  ],
  exports: [BreadcrumbModule],
  providers: [BreadcrumbService],

  // {
  //   path: '',
  //   component: NavbarComponent,
  //   children: [
  //     {
  //       path: 'home',ng
  //       children: [
  //         {
  //           path: 'role-mng',
  //           component: RoleMngComponent,
  //         },
  //         {
  //           path: 'user-mng',
  //           component: UserMngComponent,
  //         }
  //       ],
  //     },
  //     {
  //       path: 'config',
  //       component: ConfigurationComponent,
  //       children: [
  //         {
  //           path: 'masterDb',
  //           component: MasterDbComponent,
  //           children:[
  //             {path:'balanceSheet', component:BalanceSheetComponent},
  //             {path:'incomeStatement', component:IncomeStatementComponent},
  //             {path:'cashFlow', component:CashFlowComponent},
  //             {path:'financialRatio', component:FinancialRatiosComponent},
  //             {path:'shreholderData', component:ShareholderDataComponent},
  //             {path:'contactDetails', component:ShContactDetailsComponent},
  //             {path:'meetingData', component:MeetingDataComponent},
  //           ]
  //         },
  //         {
  //           path: 'nomenclature',
  //           component: LineItemNomenclatureComponent,
  //         },
  //         {
  //           path: 'role-mng',
  //           component: RoleMngComponent,
  //         },
  //         {
  //           path: 'user-mng',
  //           component: UserMngComponent,
  //         }
  //       ],
  //     },
  //   ],
  // },
})
export class HeadersModule {}
