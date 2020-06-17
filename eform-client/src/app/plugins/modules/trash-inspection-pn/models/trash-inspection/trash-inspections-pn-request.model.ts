export class TrashInspectionsPnRequestModel {
  pageIndex: number;
  pageSize: number;
  sort: string;
  isSortDsc: boolean;
  offset: number;
  nameFilter: string;
  constructor() {
    this.sort = 'Id';
    this.isSortDsc = true;
    this.nameFilter = '';
    this.pageSize = 10;
    this.pageIndex = 1;
    this.offset = 0;
  }
}
