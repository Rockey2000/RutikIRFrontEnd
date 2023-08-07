import {
  HttpClient,
  HttpErrorResponse,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IRServiceService {
  topNews =
    'https://newsapi.org/v2/top-headlines?country=in&apiKey=a3cdede97dd04f60b4486aebe749f007';
  DocValues: any;
  fileIdData: any;
  tableData: any;
  masterTableName: any;
  analystTableName: any;
  analystNomenclature = new Subject();
  public dialogFormDataSubscriber$ = this.analystNomenclature.asObservable();

  clientNomenclature = new Subject();
  public dialogFormClientSubscriber$ = this.clientNomenclature.asObservable();
  tableId!: string;
  constructor(private http: HttpClient) {}

  emitDialogFormData(data: any) {
    console.log('inside emitDialogFormData');

    this.analystNomenclature.next(data);
  }

  emitClientFormData(data: any) {
    this.clientNomenclature.next(data);
  }

  addUser(userData: any) {
    return this.http.post(`${environment.url1}/investor/addUser`, userData);
  }

  getuUser() {
    return this.http.get(`${environment.url1}/investor/list`);
  }

  deleteUser(id: string) {
    return this.http.delete(`${environment.url1}/investor/${id}`);
  }

  getUserById(id: string) {
    return this.http.get(`${environment.url1}/investor/${id}`);
  }

  updateUser(data: any, userId: string) {
    // console.log("alert1");

    return this.http.patch(`${environment.url1}/investor/${userId}`, data);
  }

  // services for role management
  addRole(userData: any) {
    return this.http.post(
      `${environment.url1}/investor/rolemodel/add`,
      userData
    );
  }

  getuRole() {
    return this.http.get(`${environment.url1}/investor/rolemodel/list`);
  }

  deleteRole(id: string) {
    return this.http.delete(`${environment.url1}/deleteRoleById/${id}`);
  }

  deleteRoles(id: string) {
    return this.http.delete(`${environment.url}/role/${id}`);
  }

  getRoleById(id: number) {
    return this.http.get(`${environment.url1}/investor/rolemodel/${id}`);
  }

  updateRole(data: any, roleId: string) {
    return this.http.patch(
      `${environment.url1}/investor/rolemodel/${roleId}`,
      data
    );
  }

  getRoles() {
    return this.http.get(`${environment.url1}/getRoleByStatus`);
  }

  getAnalystLineItems() {
    return this.http.get(`${environment.url1}/investor/analyst/list`);
  }

  updateAnalystLineItem(data: any) {
    console.log(data, 'balance in service');

    return this.http.patch(
      `${environment.url1}/investor/analyst/updateAnalystlineItem/${data.analystLineId}`,
      data
    );
  }

  // master data api
  addTable(data: any) {
    return this.http.post(
      `${environment.url1}/investor/balanceSheet/add`,
      data
    );
  }
  addBalanceSheetTableFullObject(data: any) {
    return this.http.post(
      `${environment.url1}/investor/balanceSheet/addobject`,
      data
    );
  }
  updateBalanceSheet(data: any) {
    console.log(data, 'balance in service');

    return this.http.patch(
      `${environment.url1}/investor/balanceSheet/${data.balanceid}`,
      data
    );
  }
  addIncomeStatementTable(data: any) {
    return this.http.post(
      `${environment.url1}/investor/incomestatement/add`,
      data
    );
  }
  addIncomeStatementTableFullObject(data: any) {
    return this.http.post(
      `${environment.url1}/investor/incomestatement/addobject`,
      data
    );
  }
  updateIncomeStatement(data: any) {
    console.log(data, 'data in service');

    return this.http.patch(
      `${environment.url1}/investor/incomestatement/${data.incomeid}`,
      data
    );
  }
  addCashFlowTableStructure(data: any) {
    return this.http.post(`${environment.url1}/investor/cashFlow/add`, data);
  }
  addCashFlowTableStructureFullObject(data: any) {
    return this.http.post(
      `${environment.url1}/investor/cashFlow/addObject`,
      data
    );
  }
  updateCashFlow(data: any) {
    return this.http.patch(
      `${environment.url1}/investor/cashFlow/${data.cashId}`,
      data
    );
  }
  addShareholderData(data: any) {
    return this.http.post(
      `${environment.url1}/investor/shareholderdataform/add`,
      data
    );
  }

  addMeetingData(data: any) {
    console.log(data, 'shareHolder meetting data in service');

    return this.http.post(
      `${environment.url1}/investor/shareholdermeeting/add`,
      data
    );
  }

  addShareholderContactData(data: any) {
    return this.http.post(
      `${environment.url1}/investor/shareholderContact/add`,
      data
    );
  }

  createNewFormula(data: any) {
    return this.http.post(
      `${environment.url1}/investor/financialratio/add`,
      data
    );
  }

  deleteFormula(id: any) {
    return this.http.delete(
      `${environment.url1}/investor/financialratio/${id}`
    );
  }
  analystLineItem(data: any) {
    return this.http.post(`${environment.url1}/investor/analyst/add`, data);
  }
  analystLineItemFullObject(data: any) {
    return this.http.post(
      `${environment.url1}/investor/analyst/addMultipleObject`,
      data
    );
  }

  // delete Api's

  deleteTableStructure(id: string) {
    return this.http.delete(`${environment.url}/cashFlow/${id}`);
  }

  // Get data api's

  getTableStructures() {
    return this.http.get(`${environment.url1}/investor/balanceSheet/list`);
  }

  getIncomeStatementTableStructures() {
    return this.http.get(`${environment.url1}/investor/incomestatement/list`);
  }

  getCashFlowTableStructure() {
    return this.http.get(`${environment.url1}/investor/cashFlow/list`);
  }

  getShareholderTableStructure() {
    return this.http.get(
      `${environment.url1}/investor/shareholderdataform/list`
    );
  }

  getshareHolderContactTableData() {
    return this.http.get(
      `${environment.url1}/investor/shareholderContact/list`
    );
  }

  getFinancialRatios() {
    return this.http.get(`${environment.url1}/investor/financialratio/list`);
  }

  getTableStructureById(tableName: string) {
    console.log(tableName);

    return this.http.get(
      `${environment.url}/masterData?tableName=${tableName}`
    );
  }

  getLineItemsByTableName(tableName: string) {
    return this.http.get(
      `${environment.url1}/investor/balanceSheet/list/${tableName}`
    );
  }

  getCashFlowLineItem() {
    return this.http.get(`${environment.url1}/investor/cashFlow/list`);
  }

  getIncomeStatmentLineItem() {
    return this.http.get(`${environment.url1}/investor/incomestatement/list`);
  }

  // getLineItemNom(){
  //   return this.http.get(`${environment.url1}/investor/analyst/list`)
  // }

  getLineItemAnalyst(analystName: string, analystTableHeaderName: string) {
    return this.http.get(
      `${environment.url1}/investor/analyst/${analystName}/${analystTableHeaderName}`
    );
  }

  getAnalystDetails() {
    return this.http.get(`${environment.url1}/investor/analystDetails/list`);
  }

  getLineItemByAnalystName(analystName: string, tableName: string) {
    return this.http.get(
      `${environment.url1}/investor/analyst/${analystName}/${tableName}`
    );
  }

  // update API's

  UpdateTableStructureById(data: any) {
    return this.http.put(`${environment.url}/masterData/${data.id}`, data);
  }

  getUsersByRoleName(id: string) {
    console.log('inside service ' + id);

    return this.http.get(`${environment.url1}/investor/getbyroleName/${id}`);
  }

  getRoleByRolename(role: string) {
    console.log('inside service ' + role);

    return this.http.get(
      `${environment.url1}/investor/rolemodel/getByRole/${role}`
    );
  }

  getUploadedTables() {
    return this.http.get(`${environment.url}/masterData`);
  }

  // api's for line item

  addLineItem(lineItem: any) {
    return this.http.post(`${environment.url}/analystLineItem`, lineItem);
  }

  getLineItems() {
    return this.http.get(`${environment.url}/analystLineItem`);
  }

  updateMappingStructure(data: any) {
    console.log('inside service for mapping: ', data, { ResponseType: 'json' });

    return this.http.patch(
      `${environment.url1}/investor/analyst/lineitemName`,
      data,
      { responseType: 'text' }
    );
    console.log(
      'hello data passed',
      this.updateMappingStructure,
      this.getLineItems
    );
  }

  addAnalyst(analystData: any) {
    return this.http.post(
      `${environment.url1}/investor/analystDetails/add`,
      analystData
    );
  }

  updateAnalyst(data: any, id: any) {
    console.log(data, ' editttt');

    return this.http.patch(
      `${environment.url1}/investor/analystDetails/${id}`,
      data
    );
  }

  deleteAnalyst(id: string) {
    return this.http.delete(
      `${environment.url1}/investor/analystDetails/${id}`
    );
  }

  deleteAnalystContact(analystId: any, analystContactId: any) {
    return this.http.delete(
      `${environment.url1}/investor/analystDetails/analystContactDetails/${analystId}/${analystContactId}`
    );
  }

  addDocData(data: any) {
    return this.http.post(
      `${environment.url1}/investor/dataIngestion/addDataIngestion`,
      data
    );
  }

  addextractFile(fileId: any, data: any) {
    return this.http.post(
      `${environment.url1}/investor/dataIngestion/extractFile/${fileId}`,
      data
    );
  }

  uploadDataInjestion(file: File, data: any) {
    const formdata: any = new FormData();
    formdata.append('client', data.client);
    formdata.append('documentType', data.documentType);
    formdata.append('analystName', data.analystName);
    formdata.append('peerName', data.peerName);
    formdata.append('units', data.units);
    formdata.append('currency', data.currency);
    formdata.append('denomination', data.denomination);
    formdata.append('reportType', data.reportType);
    formdata.append('reportDate', data.reportDate);
    formdata.append('file', file);

    // const req=this.http.post(`${environment.url1}/vendor/file/uploadDoc`,)

    const req = new HttpRequest(
      'POST',
      `${environment.url1}/investor/dataIngestion/checkFilePresent`,
      formdata,
      {
        responseType: 'json',
      }
    );
    return this.http.request(req);
  }
  uploadMultipleDataInjestion(formdata: FormData) {
    console.log(formdata, 'in service');

    const req = new HttpRequest(
      'POST',
      `${environment.url1}/investor/dataIngestion/addMultipleFiles`,
      formdata
    );
    return this.http.request(req);
  }

  overRideFiles(data: any) {
    console.log(data, 'for single override');
    return this.http.post(
      `${environment.url1}/investor/dataIngestion/overwritefile`,
      data
    );
  }

  overRideAllFiles(data: any) {
    console.log(data, 'for all files ');

    return this.http.post(
      `${environment.url1}/investor/dataIngestion/overWriteMultipleFiles`,
      data
    );
  }
  getFileDataByClientName(data: any) {
    console.log(data, 'data in service');

    return this.http.get(
      `${environment.url1}/investor/dataIngestion/getnpFileidsByClientName/${data}`
    );
  }

  saveFileData(data: any, obj: any) {
    console.log(data, 'hello data in servioce');
    console.log(obj, 'inservice ');

    return this.http.post(
      `${environment.url1}/investor/dataIngestion/savePreviewFileDetails/${data.npFileId}`,
      obj
    );
  }
  previewFileData(data: any, obj: any) {
    console.log(data, 'hello data in servioce');
    console.log(obj, 'inservice ');

    return this.http.post(
      `${environment.url1}/investor/dataIngestion/previewForFiles/${data.npFileId}`,
      obj,
      { responseType: 'blob', observe: 'response' }
    );
  }

  getAllNonProcessedData() {
    return this.http.get(
      `${environment.url1}/investor/dataIngestion/getAllNonProcessingFiles`
    );
  }

  overrideMethod(fileId: any, file: File, data: any) {
    const formdata: any = new FormData();
    formdata.append('client', data.client);
    formdata.append('documentType', data.documentType);
    formdata.append('analystName', data.analystName);
    formdata.append('peerName', data.peerName);
    formdata.append('units', data.units);
    formdata.append('currency', data.currency);
    formdata.append('denomination', data.denomination);
    formdata.append('reportType', data.reportType);
    formdata.append('reportDate', data.reportDate);
    formdata.append('file', file);

    const req = new HttpRequest(
      'POST',
      `${environment.url1}/investor/dataIngestion/overwritefile/${fileId}`,
      formdata,
      {
        responseType: 'json',
      }
    );
    return this.http.request(req);
  }

  getDataByFileId(id: any) {
    console.log(id, 'rutik data is from file id');
    return this.http.get(
      `${environment.url1}/investor/dataIngestion/file/${id}`
    );
  }

  getDataByTableId(data: any, Id: any) {
    console.log(data, 'analyst name in service');

    console.log(Id, 'I DONT KNOW WHICH ID IS This.');
    return this.http.get(
      `${environment.url1}/investor/dataIngestion/table/${data}/${Id}`
    );
    console.log(Id, 'data after getting');
  }

  getDataByClientTableId(data: any, Id: any) {
    console.log(data, 'client name in service');

    console.log(Id, 'I DONT KNOW WHICH ID IS This.');
    return this.http.get(
      `${environment.url1}/investor/dataIngestion/tableDetails/${data}/${Id}`
    );
    console.log(Id, 'data after getting');
  }

  getTableValueFromDataIngestion() {
    return this.http.get(
      `${environment.url1}/investor/dataIngestion/getdataingestionFileData`
    );
  }

  setTableId(data: any) {
    // alert(data);
    this.tableId = data;
  }

  getTableId() {
    return this.tableId;
  }

  updateValuesFromDataIngestion(data: any) {
    console.log(JSON.stringify(data), 'when data is passing updated');

    return this.http.patch(
      `${environment.url1}/investor/dataIngestion/update/{tableId}`,
      data
    );
  }

  dataIngestionMappingtable(data: any) {
    console.log(JSON.stringify(data), 'hello data is here');

    return this.http.post(
      `${environment.url1}/investor/dataIngestion/addDataIngestionMappingTableDetails`,
      data
    );
  }

  dataIngestionPreview(data: any) {
    console.log(JSON.stringify(JSON.stringify(data)), 'hello data is here');

    return this.http.post(
      `${environment.url1}/investor/dataIngestion/getpreviewDataIngestionMappingTableDetails`,
      data
    );
  }

  deleteTableValue(id: string) {
    return this.http.delete(
      `${environment.url1}/investor/dataIngestion/deleteDataByTableId/${id}`
    );
  }

  editTableName(tableData: any) {
    return this.http.patch(
      `${environment.url1}/investor/dataIngestion/updateTableName/${tableData.tableId}`,
      tableData
    );
  }

  // deleteTableDataByFieldId(fieldData: any) {
  //   console.log(fieldData, 'ids to be deleted');

  //   return this.http.delete(`${environment.url1}/investor/dataIngestion/deletemultiplefield_id`, fieldData);
  // }
  deleteTableDataByFieldId(id: any) {
    console.log(id, 'ids to be deleted');

    return this.http.delete(
      `${environment.url1}/investor/dataIngestion/deleteTableDataByfieldId/${id}`
    );
  }

  downloadTableData(id: string) {
    console.log(id, 'ID in service');
    return this.http.get(
      `${environment.url1}/investor/dataIngestion/downloadTableData/${id}`,
      {
        reportProgress: true,
        responseType: 'blob',
      }
    );
  }

  mergeTableById(id: any, tableData: any) {
    return this.http.patch(
      `${environment.url1}/investor/dataIngestion/mergeTable/${id}`,
      tableData
    );
  }

  onClickShiftLeft(rowData: any) {
    console.log(rowData, 'rowdata in service');

    return this.http.patch(
      `${environment.url1}/investor/dataIngestion/leftShift`,
      rowData
    );
  }

  onClickShiftRight(rowData: any) {
    console.log(rowData, 'in service');

    return this.http.patch(
      `${environment.url1}/investor/dataIngestion/rightShift`,
      rowData
    );
  }

  uploadExtractedTable(file: File, id: any) {
    const formdata: any = new FormData();

    formdata.append('file', file);

    const req = new HttpRequest(
      'PATCH',
      `${environment.url1}/investor/dataIngestion/uploadExcelSheet/${id}`,
      formdata,
      {}
    );
    return this.http.request(req);
  }

  downloadLineItemSheet(AnalystDetails: string) {
    return this.http.get(
      `${environment.url1}/media/resource?fileType=` + AnalystDetails,
      {
        reportProgress: true,
        responseType: 'blob',
      }
    );
  }

  uploadBalanceSheet(file: File) {
    const formdata: any = new FormData();

    formdata.append('file', file);

    const req = new HttpRequest(
      'POST',
      `${environment.url1}/investor/balanceSheet/uploadExcelSheet`,
      formdata,
      {}
    );
    return this.http.request(req);
  }

  uploadCashFlowSheet(file: File) {
    const formdata: any = new FormData();

    formdata.append('file', file);

    const req = new HttpRequest(
      'POST',
      `${environment.url1}/investor/cashFlow/uploadCashFlowExcelSheet`,
      formdata,
      {}
    );
    return this.http.request(req);
  }

  uploadIncomeStatementSheet(file: File) {
    const formdata: any = new FormData();

    formdata.append('file', file);

    const req = new HttpRequest(
      'POST',
      `${environment.url1}/investor/incomestatement/uploadExcelSheet`,
      formdata,
      {}
    );
    return this.http.request(req);
  }
  downloadAnalystLineItemSheet(details: any) {
    return this.http.get(
      `${environment.url1}/media/resource?fileType=` + details,
      {
        reportProgress: true,
        responseType: 'blob',
      }
    );
  }

  uploadShareholderData(file: File) {
    const formdata: any = new FormData();

    formdata.append('file', file);

    const req = new HttpRequest(
      'POST',
      `${environment.url1}/investor/shareholderdataform/uploadShareholderDataExcelSheet`,
      formdata,
      {}
    );
    return this.http.request(req);
  }

  uploadAnalystLineItem(file: File) {
    const formdata: any = new FormData();

    formdata.append('file', file);

    const req = new HttpRequest(
      'POST',
      `${environment.url1}/investor/analyst/uploadAnalystLineItemExcelSheet`,
      formdata,
      {}
    );
    return this.http.request(req);
  }

  uploadAnalystDetails(file: any) {
    const formdata: any = new FormData();

    formdata.append('file', file);

    const req = new HttpRequest(
      'POST',
      `${environment.url1}/investor/analystDetails/uploadAnalystDetailsExcelSheet`,
      formdata,
      {}
    );
    return this.http.request(req);
  }

  splitTable(id: any, data: any) {
    console.log(id, 'file id for split');
    console.log(data, 'data for split');
    return this.http.post(
      `${environment.url1}/investor/dataIngestion/splitTable/${id}`,
      data
    );
  }

  getFileIdByTableId(id: any) {
    console.log(id, 'table Id for File ID get');
    return this.http.get(
      `${environment.url1}/investor/dataIngestion/getfileIdBytableId/${id}`
    );
  }

  getFileDataByFileId(fileId: any) {
    console.log(fileId, 'file id for file data');

    return this.http.get(
      `${environment.url1}/investor/dataIngestion/getfileData/${fileId}`
    );
  }

  getTableListDataByTableId(id: any) {
    return this.http.get(
      `${environment.url1}/investor/dataIngestion/getTablelistDataByTableId/${id}`
    );
  }
  getClientLineItems() {
    return this.http.get(`${environment.url1}/investor/client/getlist`);
  }

  ClientLineItem(data: any) {
    return this.http.post(`${environment.url1}/investor/client/add`, data);
  }
  ClientLineItemFullObject(data: any) {
    return this.http.post(
      `${environment.url1}/investor/client/addMultipleObject`,
      data
    );
  }

  getLineItemByClientName(ClientName: string, tableName: string) {
    return this.http.get(
      `${environment.url1}/investor/client/${ClientName}/${tableName}`
    );
  }

  updateClientMappingStructure(data: any) {
    console.log('inside service for mapping: ', data, { ResponseType: 'json' });

    return this.http.patch(
      `${environment.url1}/investor/client/lineitemName`,
      data,
      { responseType: 'text' }
    );
    console.log(
      'hello data passed',
      this.updateMappingStructure,
      this.getLineItems
    );
  }

  updateClientLineItem(data: any) {
    console.log(data, 'balance in service');

    return this.http.patch(
      `${environment.url1}/investor/client/updateClientLineItem/${data.clientLineId}`,
      data
    );
  }

  uploadClientLineItem(file: File) {
    const formdata: any = new FormData();

    formdata.append('file', file);

    const req = new HttpRequest(
      'POST',
      `${environment.url1}/investor/client/uploadClientLineItemExcelSheet`,
      formdata,
      {}
    );
    return this.http.request(req);
  }

  autoSetDropDowns(id: any) {
    return this.http.get(
      `${environment.url1}/investor/dataIngestion/getYearlistBytableId/${id}`
    );
  }

  addReportTableHeaderFullObject(data: any) {
    return this.http.post(
      `${environment.url1}/investor/reportTableHeader/addobject`,
      data
    );
  }
  getAllReportTableHeader() {
    return this.http.get(`${environment.url1}/investor/reportTableHeader/list`);
  }

  ocrData(file: File) {
    const formdata: any = new FormData();

    formdata.append('file', file);

    const req = new HttpRequest(
      'POST',
      `${environment.url2}/ocrapi/upload`,
      formdata,
      {}
    );
    return this.http.request(req);
  }
  ocrDownload(data: any) {
    console.log(data, 'data in service');

    return this.http.get(`${environment.url2}/ocrapi/download/` + data, {
      reportProgress: true,
      responseType: 'blob',
    });
  }

  topHeadlines(): Observable<any> {
    return this.http.get(this.topNews);
  }

  meetingSchedule(data: any) {
    console.log(data, 'meetingDatainServie');

    return this.http.post(
      `${environment.url1}/investor/meetingShedular/scheduleMSTeamMeeting`,
      data
    );
  }

  getScheduledMeetingData() {
    return this.http.get(
      `${environment.url1}/investor/meetingShedular/getmeetingDetails`
    );
  }

  getMeetingDataById(meetingSheduleId: any) {
    return this.http.get(
      `${environment.url1}/investor/meetingShedular/meetingGetById/${meetingSheduleId}`
    );
  }
  // ocrData(file:File){
  // const formdata: any = new FormData();

  //   formdata.append("file", file);

  //   const req = new HttpRequest(
  //     "POST",
  //     `${environment.url2}/ocrapi/upload`,
  //     formdata,
  //     {
  //     }
  //   );
  //   return this.http.request(req);
  // }
  // ocrDownload(data:any){
  //   console.log(data,"data in service");

  //   return this.http.get(`${environment.url2}/ocrapi/download/`+data,{
  //     reportProgress:true,
  //     responseType:"blob"
  //   })
  // }

  // topHeadlines():Observable<any>{
  //   return this.http.get(this.topNews)
  // }
  // addClientDetails(data:any)
  // {
  //   return this.http.post(`${environment.url1}/Investor/ClientDetails/add`,data)
  // }

  // getClientDetails()
  // {
  //   return this.http.get(`${environment.url1}/Investor/ClientDetails/list`)
  // }

  // getProjectcodeData(projectCode: any, taskCode: any)
  //  {
  //   return this.http.get(`${environment.url1}/Investor/ClientDetails/getCode/${projectCode}/${taskCode}`);
  // }

  getClientById(id: any) {
    return this.http.get(`${environment.url1}/Investor/ClientDetails/${id}`);
  }
  DeleteFinantialRatio(id: any) {
    return this.http.delete(
      `${environment.url1}/investor/financialratio/${id}`
    );
  }

  Uploadwhitelable(logoFile: File, cssFile: File, data: any) {
    const formdata: any = new FormData();
    formdata.append('clientName', data.clientName);
    formdata.append('logofile', logoFile);
    formdata.append('cssfile', cssFile);

    const req = new HttpRequest(
      'POST',
      `${environment.url1}/investor/whitelableing/add`,
      formdata,
      {
        responseType: 'json',
      }
    );
    return this.http.request(req);
  }

  UpdateClient(clientId: any, data: any) {
    console.log('In update service');

    return this.http.patch(
      `${environment.url1}/Investor/ClientDetails/updateClientDetails/${clientId}`,
      data
    );
  }
  DeleteClientData(clientId: any) {
    return this.http.delete(
      `${environment.url1}/Investor/ClientDetails/deleteClient/${clientId}`
    );
  }

  getClientDataById(clientId: string) {
    console.log('In clientbyId service');

    return this.http.get(
      `${environment.url1}/Investor/ClientDetails/getClientData/${clientId}`
    );
  }

  deleteScheduledMeeting(meetingId: any) {
    return this.http.delete(
      `${environment.url1}/investor/meetingShedular/deleteMeetingSchedule/${meetingId}`
    );
  }

  updateScheduledMeeting(meetingSheduleId: any, meetingData: any) {
    console.log(meetingData, 'helool in service');

    return this.http.patch(
      `${environment.url1}/investor/meetingShedular/updateMeetingSchedule/${meetingSheduleId}`,
      meetingData
    );
  }
  addClientDetails(data: any) {
    return this.http.post(
      `${environment.url1}/Investor/ClientDetails/add`,
      data
    );
  }

  getClientDetails(): Observable<any> {
    return this.http.get(`${environment.url1}/Investor/ClientDetails/list`);
  }

  getProjectcodeData(projectCode: any, taskCode: any) {
    return this.http.get(
      `${environment.url1}/Investor/ClientDetails/getCode/${projectCode}/${taskCode}`
    );
  }

  uploadShMeetingData(file2: File, data: any) {
    console.log(data, 'in service');

    const formdata: any = new FormData();
    formdata.append('meetingId', data.meetingId);
    formdata.append('date', data.date);
    formdata.append('organisation', data.organisation);
    formdata.append('broker', data.broker);
    formdata.append('subject', data.subject);
    formdata.append('location', data.location);
    formdata.append('status', data.status);
    formdata.append('startTime', data.startTime);
    formdata.append('endTime', data.endTime);
    formdata.append('stakeholderType', data.stakeholderType);
    formdata.append('meetingType', data.meetingType);
    formdata.append('comments', data.comments);
    formdata.append('participants', data.participants);
    formdata.append('feedback', data.feedback);
    formdata.append('uploadedBy', data.uploadedBy);
    formdata.append('mediakey',data.mediakey)
    formdata.append('momfile', file2);
    formdata.append('summary',data.summary);
    formdata.append('actionItem',data.actionItem);
    formdata.append('investorConcerns',data.investorConcerns);
    formdata.append('analysis',data.analysis)

    // const req=this.http.post(`${environment.url1}/vendor/file/uploadDoc`,)

    const req = new HttpRequest(
      'POST',
      `${environment.url1}/investor/shareholdermeeting/add`,
      formdata,
      {
        responseType: 'json',
      }
    );
    return this.http.request(req);
  }

  uploadMediaFile(file: File) {
    const formdata: any = new FormData();

    formdata.append('file', file);

    const req = new HttpRequest(
      'POST',
      `${environment.url1}/investor/shareholdermeeting/uploadmedia`,
      formdata,
      {responseType: 'json'}
    );
    return this.http.request(req);
  }

  getMeetingTableStructure() {
    return this.http.get(
      `${environment.url1}/investor/shareholdermeeting/list`
    );
  }

  extractMom(file: File, data: any) {
    const formdata: any = new FormData();

    formdata.append('momfile', file);
    formdata.append('meetingId', data);
    const req = new HttpRequest(
      'POST',
      `${environment.url1}/investor/shareholdermeeting/extractMOMfile`,
      formdata,
      {}
    );
    return this.http.request(req);
  }

  previewMomData(shareHolderId:any) {
  console.log(shareHolderId,"shreholder ID ");
  

    return this.http.get(
      `${environment.url1}/investor/shareholdermeeting/getPreviewForMOMfile/${shareHolderId}`,
  
      { responseType: 'blob', observe: 'response' }
    );
  }

  getSHmeetingDataById(shareholderid:any) {
    return this.http.get(
      `${environment.url1}/investor/shareholdermeeting/getMeetingdataById/${shareholderid}`
    );
  }

  playMeetingRecording(mediakey:any) {
    console.log(mediakey,"shreholder ID ");
    
  
      return this.http.get(
        `${environment.url1}/investor/shareholdermeeting/playAudioVideoFile/${mediakey}`,
    
        { responseType: 'json'}
      );
    }


    downloadMom(id: string) {
      console.log(id, 'ID in service');
      return this.http.get(
        `${environment.url1}/investor/shareholdermeeting/downloadMOMfile/${id}`,
        {
          reportProgress: true,
          responseType: 'blob',
        }
      );
    }
}
