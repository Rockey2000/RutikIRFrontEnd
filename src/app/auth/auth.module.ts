import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { RouterModule } from '@angular/router';
import { AssetComponent } from '../components/headers/navbar/asset/asset.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    SharedModuleModule,
    RouterModule.forChild([
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: '',
        component: LoginComponent,
      },
    ]),
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandler }],
})
export class AuthModule {}
