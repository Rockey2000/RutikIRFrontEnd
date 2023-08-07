import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from './auth/auth.module';
import { NavigationEnd, Router, RouterModule, RouterState, ROUTES } from '@angular/router';




@NgModule({
  declarations: [
    AppComponent,

  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AuthModule,
  RouterModule

     

    // BreadcrumbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private router: Router) {
    // Output the current route to the console
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('Current route:', this.router.url);
      }
    });
  }
 }


