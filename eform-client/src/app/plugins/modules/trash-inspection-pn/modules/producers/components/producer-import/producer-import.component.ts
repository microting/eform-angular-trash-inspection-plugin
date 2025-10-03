import {Component, OnInit} from '@angular/core';
import {Papa} from 'ngx-papaparse';
import {FileUploader} from 'ng2-file-upload';
import {
  ProducerPnImportModel,
  ProducerPnHeadersModel,
  FractionPnImportModel
} from '../../../../models';
import {TrashInspectionPnProducersService} from '../../../../services';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {Router} from '@angular/router';

const URL = '';

@Component({
  selector: 'app-producer-import',
  templateUrl: './producer-import.component.html',
  styleUrls: ['./producer-import.component.scss'],
  standalone: false
})
export class ProducerImportComponent implements OnInit {
  public data: any = [];
  uploader: FileUploader;
  producerImportModel: ProducerPnImportModel;
  producerHeadersModel: ProducerPnHeadersModel;
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
    {value: 0, label: 'Name', disabled: false},
    {value: 1, label: 'Description', disabled: false},
    {value: 2, label: 'ForeignId', disabled: false},
    {value: 3, label: 'Address', disabled: false},
    {value: 4, label: 'City', disabled: false},
    {value: 5, label: 'ZipCode', disabled: false},
    {value: 6, label: 'Phone', disabled: false},
    {value: 7, label: 'Contact Person', disabled: false},
  ];
  columns: MtxGridColumn[] = [];

  constructor(
    private producerService: TrashInspectionPnProducersService,
    private router: Router,
  ) {
    this.producerImportModel = new ProducerPnImportModel();
    this.producerImportModel.headerList = this.options.map((option) => ({headerValue: null, headerLabel: option.label}));
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

  ngOnInit() {
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
        this.producerImportModel.importList = JSON.stringify(this.tableData);
      },
    });
    return this.tableData;
  }

  importProducer() {
    this.producerImportModel.headers = JSON.stringify(
      this.producerImportModel.headerList
    );
    return this.producerService
      .importProducer(this.producerImportModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.producerImportModel = new FractionPnImportModel();
          this.router.navigate([`./..`]).then();
        }
      });
  }

  onSelectedChanged(e: any, columnIndex: any) {
    // this.selectedOptions = this.selectedOptions.filter(x => x.value === e.value);
    const i = this.producerImportModel.headerList.findIndex(x => x.headerValue === columnIndex);
    if (i !== -1) {
      this.producerImportModel.headerList[i].headerValue = null;
    }
    if (e) {
      this.producerImportModel.headerList.find(x => x.headerLabel === e.label).headerValue = columnIndex;
    }
    // this.transporterImportModel.headerList[e.value].headerValue = columnIndex;
    this.options = this.options
      .map(x => ({...x, disabled: this.producerImportModel.headerList.some(y => y.headerLabel === x.label && y.headerValue !== null)}));
  }

  onSelectedClear(columnIndex: any) {
    const i = this.producerImportModel.headerList.findIndex(x => x.headerValue === columnIndex);
    if (i !== -1) {
      this.producerImportModel.headerList[i].headerValue = null;
    }
    this.options = this.options
      .map(x => ({...x, disabled: this.producerImportModel.headerList.some(y => y.headerLabel === x.label && y.headerValue !== null)}));
  }

  changeTable() {
    this.columns = this.options.map((x, i) => ({
      field: i.toString(),
      formatter: rowData => rowData[i],
    }));
  }
}
