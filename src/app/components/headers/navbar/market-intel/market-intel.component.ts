import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-market-intel',
  templateUrl: './market-intel.component.html',
  styleUrls: ['./market-intel.component.css']
})
export class MarketIntelComponent implements OnInit {
  newsData:any
  selectedApi:any
  ApiTable:boolean=true;
  ApiForm:boolean=false;
  newApiForm!: FormGroup;
  checked!: boolean;
  constructor(private router: Router) { }

  ngOnInit(): void {

    
    this.newApiForm = new FormGroup({
      sourceName: new FormControl('',[Validators.required]),
      apiStatus: new FormControl('',[Validators.required]),
      url: new FormControl('',[Validators.required])
 
      });
  }
  onClickAddAPI(){
  this.ApiTable=false;
  this.ApiForm=true;
  }
  onShowApi(){
    this.router.navigate(["/document/nav/marketNews/marketNews"])
  }

  onClickBack(){
    this.ApiTable=true;
    this.ApiForm=false;
    this.ngOnInit();
  }

  handleChange(e: any) {
    this.checked = e.checked;
  }
  onClickCancel(){
   this.ngOnInit(); 
  }

  onClickSave(){
    console.log(this.newApiForm.value,"form Data");
    
  }
}
