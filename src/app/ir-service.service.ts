import { HttpClient ,HttpRequest} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class IRServiceService {

  analystNomenclature = new Subject();
  public dialogFormDataSubscriber$ = this.analystNomenclature.asObservable();
 
  tableId!:string;
  constructor(private http: HttpClient) {}


  emitDialogFormData(data: any) {
    this.analystNomenclature.next(data);
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

  updateUser(data: any,userId:string) {
    // console.log("alert1");
    
    return this.http.patch(`${environment.url1}/investor/${userId}`, data);
  }

  // services for role management
  addRole(userData: any) {
    return this.http.post(`${environment.url1}/investor/rolemodel/add`, userData);
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

  updateRole(data: any, roleId:string) {
    return this.http.patch(`${environment.url1}/investor/rolemodel/${roleId}`, data);
  }

  getRoles() {
    return this.http.get(`${environment.url1}/getRoleByStatus`);
  }

  getAnalystLineItems(){
    return this.http.get(`${environment.url1}/investor/analyst/list`)
  }



  // master data api
  addTable(data: any) {
    return this.http.post(`${environment.url1}/investor/balanceSheet/add`, data);
  }

  addIncomeStatementTable(data: any) {
    return this.http.post(`${environment.url1}/investor/incomestatement/add`, data);
  }

  addCashFlowTableStructure(data: any) {
    return this.http.post(`${environment.url1}/investor/cashFlow/add`, data);
  }

  addShareholderData(data: any) {
    return this.http.post(`${environment.url1}/investor/shareholderdataform/add`, data);
  }

  addMeetingData(data: any) {
    return this.http.post(`${environment.url1}/investor/shareholdermeeting/add`, data);
  }

  addShareholderContactData(data: any) {
    return this.http.post(`${environment.url1}/investor/shareholderContact/add`, data);
  }

  createNewFormula(data: any) {
    return this.http.post(`${environment.url1}/investor/financialratio/add`,data);
  }

  analystLineItem(data:any){
    return this.http.post(`${environment.url1}/investor/analyst/add`,data);
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
    return this.http.get(`${environment.url1}/investor/shareholderdataform/list`);
  }

  getMeetingTableStructure() {
    return this.http.get(`${environment.url1}/investor/shareholdermeeting/list`);
  }

  getshareHolderContactTableData() {
    return this.http.get(`${environment.url1}/investor/shareholderContact/list`);
  }

  getFinancialRatios() {
    return this.http.get(`${environment.url1}/investor/financialratio/list`);
  }



  getTableStructureById(tableName: string) {
    console.log(tableName);
    
    return this.http.get(`${environment.url}/masterData?tableName=${tableName}`);
  }

  getLineItemsByTableName(tableName:string){
    return this.http.get(`${environment.url1}/investor/balanceSheet/list/${tableName}`)
  }
  
  getCashFlowLineItem(){
    return this.http.get(`${environment.url1}/investor/cashFlow/list`)
  }

  getIncomeStatmentLineItem(){
    return this.http.get(`${environment.url1}/investor/incomestatement/list`)
  }

  // getLineItemNom(){
  //   return this.http.get(`${environment.url1}/investor/analyst/list`)
  // }

  getLineItemAnalyst(analystName:string,analystTableHeaderName:string){
    return this.http.get(`${environment.url1}/investor/analyst/${analystName}/${analystTableHeaderName}`)
  }


  getAnalystDetails(){
    return this.http.get(`${environment.url1}/investor/analystDetails/list`)
  }


  getLineItemByAnalystName(analystName:string,tableName:string){
    return this.http.get(`${environment.url1}/investor/analyst/${analystName}/${tableName}`)
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

    return this.http.get(`${environment.url1}/investor/rolemodel/getByRole/${role}`);
  }

  getUploadedTables(){
    return this.http.get(`${environment.url}/masterData`)
  }


  // api's for line item

  addLineItem(lineItem:any){
    return this.http.post(`${environment.url}/analystLineItem`,lineItem)
  }

  getLineItems(){
    return this.http.get(`${environment.url}/analystLineItem`)
  }

  updateMappingStructure(lineItemName:any, analystName:any, analystLineItemName:any){
   return this.http.patch(`${environment.url1}/investor/analyst/${lineItemName}/${analystName}/${analystLineItemName}`,null)
   console.log("hello data passed", this.updateMappingStructure, this.getLineItems);
   }

   addAnalyst(analystData: any){
    return this.http.post(`${environment.url1}/investor/analystDetails/add`,analystData)
   }
  
   updateAnalyst(data:any,id:any){
    console.log(data," editttt");
    
    return this.http.patch(`${environment.url1}/investor/analystDetails/${id}`,data)
   }

   deleteAnalyst(id: string) {
    return this.http.delete(`${environment.url1}/investor/analystDetails/${id}`);
  }


  uploadDataInjestion(file:File,data:any){
    const formdata: any = new FormData();
    formdata.append("client", data.client);
    formdata.append("documentType", data.documentType);
    formdata.append("analystName", data.analystName);
    formdata.append("reportFrom", data.reportFrom);
    formdata.append("reportTo", data.reportTo);
    formdata.append("file", file);


    // const req=this.http.post(`${environment.url1}/vendor/file/uploadDoc`,)

    const req = new HttpRequest(
      "POST",
      `${environment.url1}/investor/dataIngestion/addDataIngestion`,
      formdata,
      {}
    );
    return this.http.request(req);
  }

getDataByFileId(id:any){
  console.log(id,"rutik data is from file id")
  return this.http.get(`${environment.url1}/investor/dataIngestion/file/${id}`)
}

getDataByTableId(Id:any){
  console.log(Id)
  return this.http.get(`${environment.url1}/investor/dataIngestion/table/${Id}`)
  console.log(Id,"data after getting")
}

getTableValueFromDataIngestion(){
  return this.http.get(`${environment.url1}/investor/dataIngestion/getDataIngestionDetails`)
}

setTableId(data:any){
  this.tableId=data;
  
}

getTableId(){
  return this.tableId; 
}

updateValuesFromDataIngestion(data:any){
  return this.http.patch(`${environment.url1}/investor/dataIngestion/update/{tableId}`,data)
}
}
