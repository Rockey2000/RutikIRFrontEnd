import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';
import { LoadingSpinnerService } from 'src/app/loading-spinner.service';
import { SharedModule } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-non-processing-table',
  templateUrl: './non-processing-table.component.html',
  styleUrls: ['./non-processing-table.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class NonProcessingTableComponent implements OnInit {
  DataForDropdown: any[] = [];
  selectedType!: string;
  nonProcessedData: any[] = [];
  filteredData: any[] = [];
  tableVisible: boolean = false;
  constructor(
    private lodSpinner: LoadingSpinnerService,
    private service: IRServiceService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.service.getAllNonProcessedData().subscribe((data: any) => {
      this.nonProcessedData = data;
      
      console.log(this.nonProcessedData, 'nonProcessedData');
      const uniqueData = new Set(this.nonProcessedData);
      this.DataForDropdown = Array.from(uniqueData); // Convert the Set back to an array
      console.log(this.DataForDropdown, 'Data for dropdown without duplicates');
      const uniqueClients = new Set(
        this.DataForDropdown.map((item) => item.client)
      );
      this.DataForDropdown = Array.from(uniqueClients).map((client) => ({
        client,
      }));
    });
    // ******************************
    this.service.getClientDetails().subscribe(
      (data: any) => {
        console.log('All clients: ', data);
        this.transformClientData(data);
      },
      (error: HttpErrorResponse) => {
        alert(error);
      }
    );
  }

  allData: any[] = [];
  transformClientData(inputData: any) {
    // const allData: any[] = [];

    inputData.forEach((data: any) => {
      const industryExists = this.allData.find(
        (item) => item.name === data.industry
      );

      if (industryExists) {
        industryExists.states.push({ name: data.clientName });
      } else {
        this.allData.push({
          name: data.industry,
          states: [{ name: data.clientName }],
        });
      }
    });

    console.log('Parent-Child structure:', this.allData);
  }

  editTableValue(data: any, id:any) {
    console.log(data,id ,":::DATA AND ID");
    
    setTimeout(() => {
      this.router.navigate([
        '/document/nav/dataInjestion/setFilesData/' + data,id
        
      ]);
    }, 500);
  }
  onClientSelectionChange() {
    if (this.selectedType) {
      this.filteredData = this.nonProcessedData.filter(
        (data) => data.client === this.selectedType
      );
      this.tableVisible = true;
      console.log(this.filteredData, 'fileData');
    } else {
      this.tableVisible = false;
    }
  }
}
