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
  ],
  imports: [
    CommonModule,
    SharedModuleModule,
    BreadcrumbModule,
    RouterModule.forChild([
      {
        path: 'nav',
        component: NavbarComponent,
        data: { breadcrumb: { skip: true } },

        children: [
          {
            path: 'config',
            component: ConfigurationComponent,
            data: { breadcrumb: 'Configuration' },
            children: [
              {
                path: 'role',
                component: RoleComponent,
                data: { breadcrumb: 'Role' },
              },
              {
                path: 'user',
                component: UserComponent,
                data: { breadcrumb: 'User' },
              },
              {
                path: 'master-db',
                component: MasterDbComponent,
                data: { breadcrumb: 'MasterData' },
                children: [
                  {
                    path: 'balance-sheet',
                    pathMatch:'full',
                    component: BalanceSheetComponent,
                    data: { breadcrumb: 'Balance-Sheet' },
                  },
                  {
                    path: 'income',
                    component: IncomeStatementComponent,
                    data: { breadcrumb: 'Income-Statement' },
                  },
                  {
                    path: 'cash-flow',
                    component: CashFlowComponent,
                    data: { breadcrumb: 'Cash-Flow' },
                  },
                  {
                    path: 'finacial-ratio',
                    component: FinancialRatiosComponent,
                    data: { breadcrumb: 'Financial Ratio' },
                  },
                  {
                    path: 'shareholder',
                    component: ShareholderDataComponent,
                    data: { breadcrumb: 'Shareholder' },
                  },
                  {
                    path: 'meeting',
                    component: MeetingDataComponent,
                    data: { breadcrumb: 'Meeting' },
                  },
                  {
                    path: 'contact',
                    component: ShContactDetailsComponent,
                    data: { breadcrumb: 'Contact' },
                  },
                ],
              },

              {
                path: 'analyst',
                component: AnalystComponent,
                data: { breadcrumb: 'Analyst' },
                children: [
                  {
                    path: 'nomenclature',
                    component: LineItemNomenclatureComponent,
                    data: { breadcrumb: 'Line Item Nomenclature' },
                  },
                  {
                    path:'analystDetails',
                    component:AnalystDetailsComponent
                  },
                  {
                    path: 'addAndMapingLineItems',
                    component: AddAndMapLineItemsComponent,
                    children: [
                      {
                        path: 'addLineItem',
                        component: AddLineItemsComponent,
                        data: { breadcrumb: 'Add Line Item' },
                      },
                      {
                        path: 'mapLineItem',
                        component: MapLineItemsComponent,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            path: 'dataInjestion',
            loadChildren: () => DataInjestionModule,
            data: { breadcrumb: 'Data' },
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
