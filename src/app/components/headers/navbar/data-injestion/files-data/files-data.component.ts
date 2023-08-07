import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IRServiceService } from 'src/app/ir-service.service';
import { LoadingSpinnerService } from 'src/app/loading-spinner.service';
import { LAYOUT_CONFIG } from '@angular/flex-layout';
import { dA } from '@fullcalendar/core/internal-common';

interface Units {
  totalUnits: string;
}
interface Currency {
  totalCurrency: string;
}
interface Denomination {
  totalDenomination: string;
}
@Component({
  selector: 'app-files-data',
  templateUrl: './files-data.component.html',
  styleUrls: ['./files-data.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class FilesDataComponent implements OnInit {
  dataIngestionData: any;
  documents: any[];
  analystDetails: any[] = [];
  units: Units[] = [];
  Currency: Currency[] = [];
  selectedUnit: any;
  selectedCurrency: any;
  currencyValue: Denomination[] = [];
  reportType: any[];
  // Component code
  analystReadOnly!: boolean;
  peerReadOnly!: boolean;
  previewCard: boolean = false;
  fileNames: any;
  previewData: any;
  iframeUrl: any;
  isLoading: boolean = false;
  clientName: any;
  public showValidationMessage = false;
  clientPeerData: any[] = [];
  constructor(
    private lodSpinner: LoadingSpinnerService,
    private service: IRServiceService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder
  ) {
    this.documents = [
      {
        name: 'Client Data',
        Doctype: [
          { dname: 'Balance Sheet' },
          { dname: 'Income Statement' },
          { dname: 'Cash Flow Statement' },
        ],
      },
      {
        name: 'Peer Data',
        Doctype: [
          { dname: 'Peer Balance Sheet' },
          { dname: 'Peer Income Statement' },
          { dname: 'Peer Cash Flow Statement' },
        ],
      },
      {
        name: 'Analyst Data',
        Doctype: [{ dname: 'Pre Earnings' }, { dname: 'Post Earnings' }],
      },
    ];

    this.Currency = [
      { totalCurrency: 'INR' },
      { totalCurrency: 'USD' },
      { totalCurrency: 'EUR' },
      { totalCurrency: 'JPY' },
      { totalCurrency: 'GBP' },
    ];

    this.units = [{ totalUnits: 'Indian' }, { totalUnits: 'International' }];
    this.currencyValue = [
      { totalDenomination: 'Thousand' },
      { totalDenomination: 'Lakhs' },
      { totalDenomination: 'Crore' },
      { totalDenomination: 'Million' },
      { totalDenomination: 'Billion' },
    ];

    this.reportType = [
      {
        name: 'Quarter',
        reportData: [
          { rType: 'Q1' },
          { rType: 'Q2' },
          { rType: 'Q3' },
          { rType: 'Q4' },
        ],
      },
      {
        name: 'Half Year',
        reportData: [{ rType: 'First Half' }, { rType: 'Second Half' }],
      },
      {
        name: 'Year',
        reportData: [{ rType: 'Annual' }],
      },
    ];
  }

  ngOnInit(): void {
    this.lodSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });
    console.log(
      this.route.snapshot.params['clientId'],
      "this.route.snapshot.params['clientId']"
    );

    this.lodSpinner.isLoading.next(true);
    this.getDataByclientName();
    this.getClientDetailsByClientId();
    this.service.getAnalystDetails().subscribe(
      (data: any) => {
        console.log(data, 'get data');
        this.analystDetails = data;

        this.lodSpinner.isLoading.next(false);
        console.log(this.analystDetails, 'Analyst data');
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );

  }

  getDataByclientName() {
    this.service
      .getFileDataByClientName(this.route.snapshot.params['clientName'])
      .subscribe(
        (data: any) => {
          console.log(data, 'data of files names');
          this.dataIngestionData = data;
          if (this.dataIngestionData.length === 0) {
   
            this.router.navigate([
              '/document/nav/dataInjestion/dataIngestionMenu/docUpload',
            ]);
        
          }
          this.lodSpinner.isLoading.next(false);
          this.clientName = this.route.snapshot.params['clientName'];
          console.log(this.dataIngestionData, 'dataingestion data');
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      );
  }

  getClientDetailsByClientId() {
    this.service
      .getClientDataById(this.route.snapshot.params['clientId'])
      .subscribe(
        (data: any) => {
          console.log(data, 'client Data by client ID');
          this.clientPeerData = data.suggestedPeers;
          this.lodSpinner.isLoading.next(false);
          console.log(this.clientPeerData, 'client peer data');
        },
        (error: HttpErrorResponse) => {
          console.log(error, 'error');
        }
      );
  }

  // getDataByclientName() {
  //   this.service
  //     .getFileDataByClientName(this.route.snapshot.params['clientId'])
  //     .subscribe(
  //       (data: any) => {
  //         console.log(data, 'data of files names');
  //         this.dataIngestionData = data;
  //         this.lodSpinner.isLoading.next(false);
  //         this.clientName = this.route.snapshot.params['clientId'];
  //         console.log(this.dataIngestionData, 'dataingestion data');
  //       },
  //       (error: HttpErrorResponse) => {
  //         console.log(error);
  //       }
  //     );

  // }

  onClickBack() {
    this.router.navigate([
      '/document/nav/dataInjestion/dataIngestionMenu/docUpload',
    ]);
  }

  onDocumentTypeChange(documentType: string, data: any) {
    if (
      documentType === 'Balance Sheet' ||
      documentType === 'Income Statement' ||
      documentType === 'Cash Flow Statement' ||
      documentType === 'Peer Balance Sheet' ||
      documentType === 'Peer Income Statement' ||
      documentType === 'Peer Cash Flow Statement'
    ) {
      data.analystName = null; // Clear the analystName value
      data.peerName = null; // Clear the peerName value
    } else if (
      documentType === 'Pre Earnings' ||
      documentType === 'Post Earnings'
    ) {
      data.peerName = null; // Clear the peerName value
    } else {
      data.analystName = null; // Clear the analystName value
    }
  }

  isAnalystNameReadOnly(documentType: string): boolean {
    if (
      documentType === 'Balance Sheet' ||
      documentType === 'Income Statement' ||
      documentType === 'Cash Flow Statement' ||
      documentType === 'Peer Balance Sheet' ||
      documentType === 'Peer Income Statement' ||
      documentType === 'Peer Cash Flow Statement'
    ) {
      return true; // Not readonly
    } else {
      return false; // Readonly
    }
  }

  isPeerNameReadOnly(documentType: string): boolean {
    if (
      documentType === 'Balance Sheet' ||
      documentType === 'Income Statement' ||
      documentType === 'Cash Flow Statement' ||
      documentType === 'Pre Earnings' ||
      documentType === 'Post Earnings'
    ) {
      return true; // Readonly
    } else {
      return false; // Not readonly
    }
  }

  filteredCurrencies = [...this.Currency];
  filterCurrencies(data: any) {
    console.log(data, 'units');

    if (data === 'Indian') {
      this.filteredCurrencies = this.Currency.filter(
        (currency) => currency.totalCurrency === 'INR'
      );
      data.currency = 'INR'; // Set the selected currency to INR
    } else {
      this.filteredCurrencies = this.Currency.filter((currency) =>
        ['USD', 'EUR', 'JPY', 'GBP'].includes(currency.totalCurrency)
      );
      data.currency = 'USD'; // Set the selected currency to USD (you can choose any default currency here)
    }
  }

  formIsValid(data: any): boolean {
    return (
      data.documentType &&
      data.units &&
      data.currency &&
      data.denomination &&
      data.reportType &&
      data.date &&
      data.pageNo
    );
  }
  onDataSave(data: any) {
    this.lodSpinner.isLoading.next(true);
    console.log(data, 'afterClick check');
    let obj = {
      client: data.client,
      documentType: data.documentType,
      analystName: data.analystName,
      peerName: data.clientPeerData,
      reportType: data.reportType,
      reportDate: data.date,
      currency: data.currency,
      units: data.units,
      denomination: data.denomination,
      pagenumbers: data.pageNo,
    };

    this.service.saveFileData(data, obj).subscribe(
      (data: any) => {
        console.log(data, 'get data');
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Data and file configured successfully',
        });
       
        this.ngOnInit();
        this.lodSpinner.isLoading.next(false);
        this.previewCard = false;
       
   
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        this.previewCard = false;
        this.lodSpinner.isLoading.next(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `${error.error.developerMessage}`,
        });
      }
    );
  }

  dataPreview: any;
  onClickPreviewData(data: any) {
    console.log(data, 'afterClick check');
    this.dataPreview = data;
    console.log(this.dataPreview, 'hello');

    const obj = {
      client: data.client,
      documentType: data.documentType,
      analystName: data.analystName,
      peerName: data.clientPeerData,
      reportType: data.reportType,
      reportDate: data.date,
      currency: data.currency,
      units: data.units,
      denomination: data.denomination,
      pagenumbers: data.pageNo,
    };

    this.service.previewFileData(data, obj).subscribe(
      (response) => {
        if (response.body !== null) {
          const blob = new Blob([response.body], { type: 'application/pdf' });
          const blobUrl = URL.createObjectURL(blob);
          this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            blobUrl
          ) as SafeResourceUrl;
          this.previewCard = true;
          console.log(this.iframeUrl, 'iframeurl');
        } else {
          console.log('Response body is null');
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong while adding data..!!',
        });
      }
    );
  }
  onClickCancelData() {
    this.previewCard = false;
  }

  // onClientSelected() {
  //   const selectedData = this.dataIngestionData.filter((item: any) => item.client === this.selectedClient);
  //   this.peerNames = selectedData.map((item: any) => item.peerName);
  // }
}
