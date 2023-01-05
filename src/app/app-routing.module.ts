import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { HeadersModule } from './components/headers/headers.module';

const routes: Routes = [
  {
    path:"",
    pathMatch:"full",
    loadChildren:()=> AuthModule,
    data: {breadcrumb: { skip: true }}
    },
  {
    path:"document",
    loadChildren:()=>HeadersModule,
    data: {breadcrumb: { skip: true }}
    
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
