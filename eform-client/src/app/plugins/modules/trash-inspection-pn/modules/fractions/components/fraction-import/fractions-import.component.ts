import { Component, OnInit, inject } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Papa } from 'ngx-papaparse';
import { TrashInspectionPnFractionsService } from '../../../../services';
import { FractionPnImportModel, FractionPnHeadersModel} from '../../../../models';
import {MtxGridColumn} from '@ng-matero/extensions/grid';

const URL = '';
@Component({
  selector: 'app-trash-inspection-pn-fraction-import',
  templateUrl: './fractions-import.component.html',
  styleUrls: ['./fractions-import.component.scss'],
  standalone: false
})
export class FractionsImportComponent implements OnInit {
  private fractionsService = inject(TrashInspectionPnFractionsService);

  public data: any = [];
  uploader: FileUploader;
  fractionsImportModel: FractionPnImportModel;
  fractionHeaderModel: FractionPnHeadersModel;
  fileName: string;
  totalColumns: number;
  totalRows: number;
  myFile: any;
  chboxNames = [
    'Exclude the first row',
    'Ignore all unselected fields',
    'Manage matching records',
  ];
  papa: Papa = new Papa();
  tableData: any[] = [];
  options = [
    { value: 0, label: 'Number', disabled: false },
    { value: 1, label: 'Name', disabled: false },
    { value: 2, label: 'Location Nr', disabled: false },
    { value: 3, label: 'eForm nr', disabled: false },
    { value: 4, label: 'Statutory eForm', disabled: false },
    { value: 5, label: 'Description', disabled: false },
  ];

  columns: MtxGridColumn[] = [];
  

  ngOnInit() {
    this.fractionsImportModel = new FractionPnImportModel();
    this.options.forEach((option) => {
      this.fractionsImportModel.headerList = [
        ...this.fractionsImportModel.headerList,
        {headerValue: null, headerLabel: option.label},
      ]
    });
    this.uploader = new FileUploader({
      url: URL,
      autoUpload: true,
      isHTML5: true,
      removeAfterUpload: true,
    });
    this.uploader.onAfterAddingFile = (fileItem) => {
      fileItem.withCredentials = false;
      // console.log(fileItem._file);
      this.myFile = fileItem.file.rawFile;
    };
    this.fileName = 'DummyCustomerData.csv';
    this.totalColumns = 4;
    this.totalRows = 100;
  }

  csv2Array(fileInput) {
    const files = fileInput.target.files;
    this.papa.parse(files[files.length - 1], {
      skipEmptyLines: true,
      header: false,
      complete: (results) => {
        this.tableData = results.data;
        this.changeTable();
        console.debug(this.tableData);
        this.fractionsImportModel.importList = JSON.stringify(this.tableData);
      },
    });
    return this.tableData;
  }

  importFraction() {
    // this.customerImportModel.importList = this.tableData;
    // debugger;
    this.fractionsImportModel.headers = JSON.stringify(
      this.fractionsImportModel.headerList
    );
    return this.fractionsService
      .importFraction(this.fractionsImportModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.fractionsImportModel = new FractionPnImportModel();
        }
      });
  }

  onSelectedChanged(e: any, columnIndex: any) {
    const i = this.fractionsImportModel.headerList.findIndex(x => x.headerValue === columnIndex);
    if(i !== -1) {
      this.fractionsImportModel.headerList[i].headerValue = null;
    }
    if(e) {
      this.fractionsImportModel.headerList.find(x => x.headerLabel === e.label).headerValue = columnIndex;
    }
    // this.transporterImportModel.headerList[e.value].headerValue = columnIndex;
    this.options = this.options
      .map(x => ({...x, disabled: this.fractionsImportModel.headerList.some(y => y.headerLabel === x.label && y.headerValue !== null)}))
  }

  onSelectedClear(columnIndex: any) {
    const i = this.fractionsImportModel.headerList.findIndex(x => x.headerValue === columnIndex);
    if(i !== -1) {
      this.fractionsImportModel.headerList[i].headerValue = null;
    }
    this.options = this.options
      .map(x => ({...x, disabled: this.fractionsImportModel.headerList.some(y => y.headerLabel === x.label && y.headerValue !== null)}))
  }

  changeTable() {
    this.columns = this.options.map((x, i) => ({
      field: i.toString(),
      formatter: rowData => rowData[i],
    }))
  }
}
