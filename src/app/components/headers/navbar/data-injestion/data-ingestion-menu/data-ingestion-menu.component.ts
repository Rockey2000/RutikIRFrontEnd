import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-data-ingestion-menu',
  templateUrl: './data-ingestion-menu.component.html',
  styleUrls: ['./data-ingestion-menu.component.css']
})
export class DataIngestionMenuComponent implements OnInit {
  items!: MenuItem[];
  activeItem!: MenuItem;
  status: boolean = false;
  constructor() { }

  ngOnInit(): void {

    this.items = [
      { label: 'Extracted', routerLink: ['/document/nav/dataInjestion/dataIngestionMenu/docUpload'] },
      { label: 'Pending', routerLink: ['/document/nav/dataInjestion/dataIngestionMenu/nonProcessingTable'] },
  
    ];
  }

}
