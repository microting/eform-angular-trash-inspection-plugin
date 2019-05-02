export class InstallationPnRequestModel {
  pageIndex: number;
  nameFilter: string;
  pageSize: number;
  sort: string;
  isSortDsc: boolean;
  offset: number;

  constructor() {
    this.sort = 'Id';
    this.isSortDsc = true;
    this.pageSize = 5 ;
    this.pageIndex = 1;
    this.offset = 0;
  }
}
