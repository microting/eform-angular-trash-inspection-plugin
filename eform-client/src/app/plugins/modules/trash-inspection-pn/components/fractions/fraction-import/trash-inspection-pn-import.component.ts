import {Component, OnInit} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {Papa} from 'ngx-papaparse';
import {TrashInspectionPnFractionsService} from "../../../services";
import {forEach} from '@angular/router/src/utils/collection';
import {FractionPnImportModel} from "../../../models/fraction";
import {FractionPnHeadersModel} from "../../../models/fraction/fraction-pn-headers.model";

const URL = '';
@Component({
  selector: 'app-customer-pn-import',
  templateUrl: './trash-inspection-pn-import.component.html',
  styleUrls: ['./trash-inspection-pn-import.component.scss']
})
export class TrashInspectionPnImportComponent implements OnInit {
  public data: any = [];
  uploader: FileUploader;
  fractionsImportModel: FractionPnImportModel;
  fractionHeaderModel: FractionPnHeadersModel;
  fileName: string;
  spinnerStatus = false;
  totalColumns: number;
  totalRows: number;
  myFile: any;
  chboxNames = ['Exclude the first row', 'Ignore all unselected fields', 'Manage matching records'];
  papa: Papa = new Papa();
  tableData: any = null;
  options = [
    {value: 0, label: 'Nummer'},
    {value: 1, label: 'Beskrivelse'},
    {value: 2, label: 'Lokations Kode'},
    {value: 3, label: 'eForm nr'},
    {value: 4, label: 'lovpligtig eForm'},


  ];
  constructor(private fracionsService: TrashInspectionPnFractionsService) {
    this.fractionsImportModel = new FractionPnImportModel();
    // forEach(Option in this.options) {
    //   this.customerHeaderModel = new CustomerPnHeadersModel();
    //   this.customerHeaderModel.header = str.label;
    //   this.customerImportModel.headers.add this.customerHeaderModel;
    // }
    // this.customerHeaderModel = new CustomerPnHeadersModel();
   this.options.forEach((option) => {
     this.fractionHeaderModel = new FractionPnHeadersModel();
      this.fractionHeaderModel.headerLabel = option.label;
      this.fractionHeaderModel.headerValue = null;
      this.fractionsImportModel.headerList.push(this.fractionHeaderModel);
      // console.log(label);
   }
  );
    this.uploader = new FileUploader(
      {
        url: URL,
        autoUpload: true,
        isHTML5: true,
        removeAfterUpload: true
      });
    this.uploader.onAfterAddingFile = (fileItem => {
      fileItem.withCredentials = false;
      // console.log(fileItem._file);
      this.myFile = fileItem.file.rawFile;
    });
  }



  ngOnInit() {
    this.fileName = 'DummyCustomerData.csv';
    this.totalColumns = 4;
    this.totalRows = 100;
  }
  csv2Array(fileInput) {
    const file = fileInput;
    this.papa.parse(fileInput.target.files[0], {
      skipEmptyLines: true,
      header: false,
      complete: (results) => {
        this.tableData = results.data;
        console.log(this.tableData);
        this.fractionsImportModel.importList = JSON.stringify(this.tableData);
      }
    });
    return this.tableData;
  }
    importFraction() {
    this.spinnerStatus = true;
    // this.customerImportModel.importList = this.tableData;
    // debugger;
    this.fractionsImportModel.headers = JSON.stringify(this.fractionsImportModel.headerList);
    return this.fracionsService.importFraction(this.fractionsImportModel).subscribe(((data) => {
      if (data && data.success) {
        this.fractionsImportModel = new CustomersPnImportModel();
      } this.spinnerStatus = false;
    }));
  }
  logThings(value) {
    console.log(value);
  }
  onSelectedChanged(e: any, columnIndex: any) {
    this.fractionsImportModel.headerList[e.value].headerValue = columnIndex;
  }
}
