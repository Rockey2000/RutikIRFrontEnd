import { Component, OnInit } from '@angular/core';
import { IRServiceService } from 'src/app/ir-service.service';

@Component({
  selector: 'app-market-news',
  templateUrl: './market-news.component.html',
  styleUrls: ['./market-news.component.css']
})
export class MarketNewsComponent implements OnInit {
topNewsData:any[]=[];
  constructor(private service :IRServiceService) { }

  ngOnInit(): void {
    this.service.topHeadlines().subscribe(data=>{
      console.log(data,"news data");
      this.topNewsData=data.articles;
      console.log(this.topNewsData,"topNews Data");
      
    })
  }

}
