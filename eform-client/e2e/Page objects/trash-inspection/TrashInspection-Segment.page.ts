import Page from '../Page';

export class TrashInspectionSegemtnsPage extends Page {
  constructor() {
    super();
  }
  public get rowNum(): number {
    browser.pause(500);
    return $$('#tableBody > tr').length;
  }
  public trashInspectionDropDown() {
    $(`//*[contains(@class, 'dropdown')]//*[contains(text(), 'Affaldsinspektion')]`).click();
  }
  public get segmentnBtn() {
    $('#trash-inspection-pn-segments').waitForDisplayed({timeout: 20000});
    $('#trash-inspection-pn-segments').waitForClickable({timeout: 20000});
    return $('#trash-inspection-pn-segments');
  }
  public get createSegmentBtn() {
    $('#createSegmentBtn').waitForDisplayed({timeout: 20000});
    $('#createSegmentBtn').waitForClickable({timeout: 20000});
    return $('#createSegmentBtn');
  }
  public get segmentCreateNameBox() {
    $('#createSegmentName').waitForDisplayed({timeout: 20000});
    $('#createSegmentName').waitForClickable({timeout: 20000});
    return $('#createSegmentName');
  }
  public get segmentCreateDescriptionBox() {
    $('#createSegmentDescription').waitForDisplayed({timeout: 20000});
    $('#createSegmentDescription').waitForClickable({timeout: 20000});
    return $('#createSegmentDescription');
  }
  public get segmentCreateSDKFolderId() {
    $('#createSegmentSdkFolderId').waitForDisplayed({timeout: 20000});
    $('#createSegmentSdkFolderId').waitForClickable({timeout: 20000});
    return $('#createSegmentSdkFolderId');
  }
  public get segmentCreateSaveBtn() {
    $('#segmentCreateSaveBtn').waitForDisplayed({timeout: 20000});
    $('#segmentCreateSaveBtn').waitForClickable({timeout: 20000});
    return $('#segmentCreateSaveBtn');
  }
  public get segmentCreateCancelBtn() {
    $('#segmentCreateCancelBtn').waitForDisplayed({timeout: 20000});
    $('#segmentCreateCancelBtn').waitForClickable({timeout: 20000});
    return $('#segmentCreateCancelBtn');
  }
  public get editSegmentBtn() {
    $('#editSegmentBtn').waitForDisplayed({timeout: 20000});
    $('#editSegmentBtn').waitForClickable({timeout: 20000});
    return $('#editSegmentBtn');
  }
  public get segmentUpdateNameBox() {
    $('#updateSegmentName').waitForDisplayed({timeout: 20000});
    $('#updateSegmentName').waitForClickable({timeout: 20000});
    return $('#updateSegmentName');
  }
  public get segmentUpdateDesciptionBox() {
    $('#updateSegmentDescription').waitForDisplayed({timeout: 20000});
    $('#updateSegmentDescription').waitForClickable({timeout: 20000});
    return $('#updateSegmentDescription');
  }
  public get segmentUpdateSDKFolderId() {
    $('#updateSegmentSdkFolderId').waitForDisplayed({timeout: 20000});
    $('#updateSegmentSdkFolderId').waitForClickable({timeout: 20000});
    return $('#updateSegmentSdkFolderId');
  }
  public get segmentUpdateSaveBtn() {
    $('#segmentUpdateSaveBtn').waitForDisplayed({timeout: 20000});
    $('#segmentUpdateSaveBtn').waitForClickable({timeout: 20000});
    return $('#segmentUpdateSaveBtn');
  }
  public get segmentUpdateCancelBtn() {
    $('#segmentUpdateCancelBtn').waitForDisplayed({timeout: 20000});
    $('#segmentUpdateCancelBtn').waitForClickable({timeout: 20000});
    return $('#segmentUpdateCancelBtn');
  }
  public get deleteSegmentBtn() {
    $('#deleteSegmentBtn').waitForDisplayed({timeout: 20000});
    $('#deleteSegmentBtn').waitForClickable({timeout: 20000});
    return $('#deleteSegmentBtn');
  }
  public get segmentDeleteId() {
    $('#selectedSegmentId').waitForDisplayed({timeout: 20000});
    $('#selectedSegmentId').waitForClickable({timeout: 20000});
    return $('#selectedSegmentId');
  }
  public get segmentDelteCreatedDate() {
    $('#selectedSegmentCreatedDate').waitForDisplayed({timeout: 20000});
    $('#selectedSegmentCreatedDate').waitForClickable({timeout: 20000});
    return $('#selectedSegmentCreatedDate');
  }
  public get segmentDeleteName() {
    $('#selectedSegmentName').waitForDisplayed({timeout: 20000});
    $('#selectedSegmentName').waitForClickable({timeout: 20000});
    return $('#selectedSegmentName');
  }
  public get segmentDeleteDeleteBtn() {
    $('#segmentDeleteDeleteBtn').waitForDisplayed({timeout: 20000});
    $('#segmentDeleteDeleteBtn').waitForClickable({timeout: 20000});
    return $('#segmentDeleteDeleteBtn');
  }
  public get segmentDeleteCancelBtn() {
    $('#segmentDeleteCancelBtn').waitForDisplayed({timeout: 20000});
    $('#segmentDeleteCancelBtn').waitForClickable({timeout: 20000});
    return $('#segmentDeleteCancelBtn');
  }
  goToSegmentsPage() {
    this.trashInspectionDropDown();
    $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
    this.segmentnBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
  }
  createSegment(name: string, description?: any, sdkFolderId?: any) {
    this.createSegmentBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
    this.segmentCreateNameBox.addValue(name);
    $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
    if (description != null) {
      this.segmentCreateDescriptionBox.addValue(description);
    }
    $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
    if (sdkFolderId != null) {
      this.segmentCreateSDKFolderId.addValue(sdkFolderId);
    }
    $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
    this.segmentCreateSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
  }
  createSegment_cancel(name: string, description?: string, sdkFolderId?: any) {
    this.createSegmentBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
    this.segmentCreateNameBox.addValue(name);
    $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
    if (description != null) {
      this.segmentCreateDescriptionBox.addValue(description);
    }
    $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
    if (sdkFolderId != null) {
      this.segmentCreateSDKFolderId.addValue(sdkFolderId);
    }
    $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
    this.segmentCreateCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
  }
  editSegment(newName: string, newDescription?: string, newSDKFolderId?: any) {
    this.editSegmentBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
    this.segmentUpdateNameBox.clearValue();
    this.segmentUpdateNameBox.addValue(newName);
    $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
    if (newDescription != null) {
      this.segmentUpdateDesciptionBox.clearValue();
      this.segmentUpdateDesciptionBox.addValue(newDescription);
    }
    $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
    if (newSDKFolderId != null) {
      this.segmentUpdateSDKFolderId.clearValue();
      this.segmentUpdateSDKFolderId.addValue(newSDKFolderId);
    }
    $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
    this.segmentUpdateSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
  }
  deleteSegment() {
    const segmentForDelete = this.getFirstRowObject();
    segmentForDelete.deleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 40000, reverse: true});
    this.segmentDeleteDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 40000, reverse: true});
  }
  deleteSegmentCancel() {
    const segmentForDelete = this.getFirstRowObject();
    segmentForDelete.deleteBtn.click();
    $('#segmentDeleteDeleteBtn').waitForDisplayed({timeout: 20000});
  }
  getFirstRowObject(): SegmentsRowObject {
    browser.pause(500);
    return new SegmentsRowObject(1);
  }
  getRowObject(rowNum): SegmentsRowObject {
    browser.pause(500);
    return new SegmentsRowObject(rowNum);
  }
}

const segmentsPage = new TrashInspectionSegemtnsPage();
export default segmentsPage;

export class SegmentsRowObject {
  constructor(rowNum) {
    if ($$('#segmentId')[rowNum - 1]) {
      this.id = +$$('#segmentId')[rowNum - 1];
      try {
        this.name = $$('#segmentName')[rowNum - 1].getText();
      } catch (e) {}
      try {
        this.description = $$('#segmentDescription')[rowNum - 1].getText();
      } catch (e) {}
      try {
        this.sdkFolderId = $$('#segmentSDKFolderID')[rowNum - 1].getText();
      } catch (e) {}
      this.editBtn = $$('#editSegmentBtn')[rowNum - 1];
      this.deleteBtn = $$('#deleteSegmentBtn')[rowNum - 1];
    }
  }
  id;
  name;
  description;
  sdkFolderId;
  editBtn;
  deleteBtn;
}
