export class TransporterYearPnRequestModel {
  pageSize: number;
  nameFilter: string;
  sort: string;
  pageIndex: number;
  isSortDsc: boolean;
  offset: number;
  year: number;

  constructor() {
    this.sort = 'Name';
    this.isSortDsc = true;
    this.pageSize = 10;
    this.pageIndex = 1;
    this.offset = 0;
  }
}
