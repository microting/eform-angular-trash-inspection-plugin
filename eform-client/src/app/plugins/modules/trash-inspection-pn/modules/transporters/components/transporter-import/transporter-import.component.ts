import { Component, OnInit, inject } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Papa } from 'ngx-papaparse';
import { TrashInspectionPnTransporterService } from '../../../../services';
import {
  TransporterPnHeadersModel,
  TransporterPnImportModel,
  ProducerPnImportModel,
  FractionPnImportModel,
} from '../../../../models';
import {Router} from '@angular/router';
import {MtxGridColumn} from '@ng-matero/extensions/grid';

const URL = '';

@Component({
  selector: 'app-transporter-import',
  templateUrl: './transporter-import.component.html',
  styleUrls: ['./transporter-import.component.scss'],
  standalone: false
})
export class TransporterImportComponent implements OnInit {
  private transporterService = inject(TrashInspectionPnTransporterService);
  private router = inject(Router);

  public data: any = [];
  uploader: FileUploader;
  transporterImportModel: TransporterPnImportModel;
  transporterHeadersModel: TransporterPnHeadersModel;
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
  tableData: [] = [];
  options = [
    { value: 0, label: 'Name', disabled: false },
    { value: 1, label: 'Description', disabled: false },
    { value: 2, label: 'ForeignId', disabled: false },
    { value: 3, label: 'Address', disabled: false },
    { value: 4, label: 'City', disabled: false },
    { value: 5, label: 'ZipCode', disabled: false },
    { value: 6, label: 'Phone', disabled: false },
    { value: 7, label: 'Contact Person', disabled: false },
  ];

  columns: MtxGridColumn[] = [];

  

  ngOnInit() {
    this.transporterImportModel = new TransporterPnImportModel();
    this.options.forEach((option) => {
      this.transporterImportModel.headerList = [
        ...this.transporterImportModel.headerList,
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
  }

  csv2Array(fileInput) {
    const files = fileInput.target.files;
    this.papa.parse(files[files.length - 1], {
      skipEmptyLines: true,
      header: false,
      complete: (results) => {
        this.tableData = results.data;
        console.debug(this.tableData);
        this.changeTable();
        this.transporterImportModel.importList = JSON.stringify(this.tableData);
      },
    });
    return this.tableData;
  }

  importTransporter() {
    // this.customerImportModel.importList = this.tableData;
    // debugger;
    this.transporterImportModel.headers = JSON.stringify(
      this.transporterImportModel.headerList
    );
    return this.transporterService
      .importTransporter(this.transporterImportModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.transporterImportModel = new FractionPnImportModel();
          this.router.navigate([`./..`]).then()
        }
      });
  }
  onSelectedChanged(e: any, columnIndex: any) {
    // this.selectedOptions = this.selectedOptions.filter(x => x.value === e.value);
    const i = this.transporterImportModel.headerList.findIndex(x => x.headerValue === columnIndex);
    if(i !== -1) {
      this.transporterImportModel.headerList[i].headerValue = null;
    }
    if(e) {
      this.transporterImportModel.headerList.find(x => x.headerLabel === e.label).headerValue = columnIndex;
    }
    // this.transporterImportModel.headerList[e.value].headerValue = columnIndex;
    this.options = this.options
      .map(x => ({...x, disabled: this.transporterImportModel.headerList.some(y => y.headerLabel === x.label && y.headerValue !== null)}))
  }

  onSelectedClear(columnIndex: any) {
    const i = this.transporterImportModel.headerList.findIndex(x => x.headerValue === columnIndex);
    if(i !== -1) {
      this.transporterImportModel.headerList[i].headerValue = null;
    }
    this.options = this.options
      .map(x => ({...x, disabled: this.transporterImportModel.headerList.some(y => y.headerLabel === x.label && y.headerValue !== null)}))
  }

  changeTable() {
    this.columns = this.options.map((x, i) => ({
      field: i.toString(),
      formatter: rowData => rowData[i],
    }))
  }
}
