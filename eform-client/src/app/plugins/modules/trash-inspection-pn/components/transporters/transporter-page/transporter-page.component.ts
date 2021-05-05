import { Component, OnInit, ViewChild } from '@angular/core';
import {
  TransporterPnModel,
  TransportersPnModel,
} from '../../../models/transporter';
import { TableHeaderElementModel } from 'src/app/common/models';
import { TransportersStateService } from '../store';

@Component({
  selector: 'app-transporter-page',
  templateUrl: './transporter-page.component.html',
  styleUrls: ['./transporter-page.component.scss'],
})
export class TransporterPageComponent implements OnInit {
  @ViewChild('createTransporterModal') createTransporterModal;
  @ViewChild('editTransporterModal') editTransporterModal;
  @ViewChild('deleteTransporterModal') deleteTransporterModal;
  transportersModel: TransportersPnModel = new TransportersPnModel();

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Id', elementId: 'idTableHeader', sortable: true },
    { name: 'Name', elementId: 'nameTableHeader', sortable: true },
    {
      name: 'Description',
      elementId: 'descriptionTableHeader',
      sortable: true,
    },
    {
      name: 'ForeignId',
      elementId: 'locationCodeTableHeader',
      sortable: true,
      visibleName: 'Foreign ID',
    },
    { name: 'Address', elementId: 'addressTableHeader', sortable: true },
    { name: 'City', elementId: 'cityTableHeader', sortable: true },
    {
      name: 'ZipCode',
      elementId: 'zipCodeTableHeader',
      sortable: true,
      visibleName: 'Zip Code',
    },
    { name: 'Phone', elementId: 'phoneTableHeader', sortable: true },
    {
      name: 'ContactPerson',
      elementId: 'contactPersonTableHeader',
      sortable: true,
      visibleName: 'Contact Person',
    },
    { name: 'Actions', elementId: '', sortable: false },
  ];

  constructor(public transportersStateService: TransportersStateService) {}

  ngOnInit() {
    this.getAllInitialData();
  }

  getAllInitialData() {
    this.getAllTransporters();
  }

  getAllTransporters() {
    this.transportersStateService.getAllTransporters().subscribe((data) => {
      if (data && data.success) {
        this.transportersModel = data.model;
      }
    });
  }

  showCreateTransporterModal() {
    this.createTransporterModal.show();
  }

  showEditTransporterModal(transporter: TransporterPnModel) {
    this.editTransporterModal.show(transporter);
  }

  showDeleteTransporterModal(transporter: TransporterPnModel) {
    this.deleteTransporterModal.show(transporter);
  }

  sortTable(sort: string) {
    this.transportersStateService.onSortTable(sort);
    this.getAllTransporters();
  }

  changePage(offset: any) {
    this.transportersStateService.changePage(offset);
    this.getAllTransporters();
  }

  onPageSizeChanged(pageSize: number) {
    this.transportersStateService.updatePageSize(pageSize);
    this.getAllTransporters();
  }

  onTransporterDeleted() {
    this.transportersStateService.onDelete();
    this.getAllTransporters();
  }
}
