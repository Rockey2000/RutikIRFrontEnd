import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppModuleConstants } from 'src/app/app-constants';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  project!: FormGroup;
  data: any;
  constructor(private router: Router) {
    this.project = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}

  onSave() {
    this.data = this.project.value;
    // if (this.data.username === 'anemoi' && this.data.password === 'anemoi') {
    //   localStorage.setItem('user', this.data.username);
    //   this.router.navigate(['/document/nav/config/role']);
    // } else {
    //   alert('Incorrect Crediantials....!!');
    //   this.project.reset();
    //   this.router.navigate(['/']);
    // }


    if(this.data.username==="masteradmin@gmail.com" && this.data.password==="master@123"){
      sessionStorage.setItem(AppModuleConstants.USER,this.data.username);
      sessionStorage.setItem(AppModuleConstants.ROLE,'1');
      this.router.navigate(['/document/nav/config/role']);
      this.ngOnInit();
    }

    else if (this.data.username==="analystadmin@gmail.com" && this.data.password==="analyst@123"){
      sessionStorage.setItem(AppModuleConstants.USER,this.data.username);
      sessionStorage.setItem(AppModuleConstants.ROLE,'2');
      this.router.navigate(['/document/nav/config/master-db/balance-sheet']);

    }

    else if(this.data.username==="clientadmin@gmail.com" && this.data.password==="client@123"){
      sessionStorage.setItem(AppModuleConstants.USER,this.data.username);
      sessionStorage.setItem(AppModuleConstants.ROLE,'3');
      sessionStorage.setItem(AppModuleConstants.LogoUrl,'C:/Users/DELL/Downloads/axisLogo.png')
      this.router.navigate(['/document/nav/dataInjestion/dataIngestionMenu/docUpload']);
        this.ngOnInit();
    }

    else{
      alert("Incorrect Crediantials....!!")
      this.project.reset();
        this.router.navigate([''])
    }
  }
 
}
