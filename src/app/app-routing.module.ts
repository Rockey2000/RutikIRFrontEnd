import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { HeadersModule } from './components/headers/headers.module';
import { AssetComponent } from './components/headers/navbar/asset/asset.component';
import { AnalystGuard } from './shared-module/analyst.guard';
import { AuthGuard } from './shared-module/auth.guard';
import { ClientGuard } from './shared-module/client.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    // loadChildren:()=> AuthModule,
    // data: {breadcrumb: { skip: true }}
  },
  {
    path: 'login',
    pathMatch: 'full',
    loadChildren: () => AuthModule,
    data: { breadcrumb: { skip: true } },
  },
  {
    path: 'document',
    loadChildren: () => HeadersModule,
    data: { breadcrumb: { skip: true } },
  },
  {
    path: 'asset',
    component:AssetComponent,
    canActivate:[ClientGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
