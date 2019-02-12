import Page from '../Page';

export class TrashInspectionSegemtnsPage extends Page {
  constructor() {
    super();
  }
  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }
  public trashInspectionDropDown() {
    browser.element(`//*[contains(@class, 'dropdown')]//*[contains(text(), 'Affaldsinspektion')]`).click();
  }
  public get segmentnBtn() {
    return browser.element('#trash-inspection-pn-segments');
  }
  public get createSegmentBtn() {
    return browser.element('#createSegmentBtn');
  }
  public get segmentCreateNameBox() {
    return browser.element('#createSegmentName');
  }
  public get segmentCreateDescriptionBox() {
    return browser.element('#createSegmentDescription');
  }
  public get segmentCreateSDKFolderId() {
    return browser.element('#createSegmentSdkFolderId');
  }
  public get segmentCreateSaveBtn() {
    return browser.element('#segmentCreateSaveBtn');
  }
  public get segmentCreateCancelBtn() {
    return browser.element('#segmentCreateCancelBtn');
  }
  public get editSegmentBtn() {
    return browser.element('#editSegmentBtn');
  }
  public get segmentUpdateNameBox() {
    return browser.element('#updateSegmentName');
  }
  public get segmentUpdateDesciptionBox() {
    return browser.element('#updateSegmentDescription');
  }
  public get segmentUpdateSDKFolderId() {
    return browser.element('#updateSegmentSdkFolderId');
  }
  public get segmentUpdateSaveBtn() {
    return browser.element('#segmentUpdateSaveBtn');
  }
  public get segmentUpdateCancelBtn() {
    return browser.element('#segmentUpdateCancelBtn');
  }
  public get deleteSegmentBtn() {
    return browser.element('#deleteSegmentBtn');
  }
  public get segmentDeleteId() {
    return browser.element('#selectedSegmentId');
  }
  public get segmentDelteCreatedDate() {
    return browser.element('#selectedSegmentCreatedDate');
  }
  public get segmentDeleteName() {
    return browser.element('#selectedSegmentName');
  }
  public get segmentDeleteDeleteBtn() {
    return browser.element('#segmentDeleteDeleteBtn');
  }
  public get segmentDeleteCancelBtn() {
    return browser.element('#segmentDeleteCancelBtn');
  }
  goToSegmentsPage() {
    this.trashInspectionDropDown();
    browser.pause(1000);
    this.segmentnBtn.click();
    browser.pause(8000);
  }
}

const segmentsPage = new TrashInspectionSegemtnsPage();
export default segmentsPage;

export class SegmentsRowObject {
  constructor(rowNum) {
    this.id = $$('#idTableHeader')[rowNum - 1].getText();
    this.name = $$('#nameTableHeader')[rowNum - 1].getText();
    this.description = $$('#descriptionTableHeader')[rowNum - 1].getText();
    this.sdkFolderId = $$('#sdkFolderIdTableHeader')[rowNum - 1].getText();
    this.editBtn = $$('#editSegmentBtn')[rowNum - 1];
    this.deleteBtn = $$('#deleteSegmentBtn')[rowNum - 1];
  }
  id;
  name;
  description;
  sdkFolderId;
  editBtn;
  deleteBtn
}
