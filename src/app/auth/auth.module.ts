import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    SharedModuleModule,
    RouterModule.forChild(
      [
        {
          path:"",
          component:LoginComponent
        }
    ]
    )
  ]
})
export class AuthModule { }
