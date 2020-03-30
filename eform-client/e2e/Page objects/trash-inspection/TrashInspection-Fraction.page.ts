import Page from '../Page';
import XMLForEformFractions from '../../Constants/XMLForEformFractions';
import loginPage from '../../Page objects/Login.page';

export class TrashInspectionFractionPage extends Page {
  constructor() {
    super();
  }
  public get rowNum(): number {
    browser.pause(500);
    return $$('#tableBody > tr').length;
  }
  public get newEformBtn() {
    $('#newEFormBtn').waitForDisplayed(20000);
    $('#newEFormBtn').waitForClickable({timeout: 20000});
    return $('#newEFormBtn');
  }
  public get xmlTextArea() {
    $('#eFormXml').waitForDisplayed(20000);
    $('#eFormXml').waitForClickable({timeout: 20000});
    return $('#eFormXml');
  }
  public get createEformBtn() {
    $('#createEformBtn').waitForDisplayed(20000);
    $('#createEformBtn').waitForClickable({timeout: 20000});
    return $('#createEformBtn');
  }
  public get createEformTagSelector() {
    $('#createEFormMultiSelector').waitForDisplayed(20000);
    $('#createEFormMultiSelector').waitForClickable({timeout: 20000});
    return $('#createEFormMultiSelector');
  }
  public get createEformNewTagInput() {
    $('#addTagInput').waitForDisplayed(20000);
    $('#addTagInput').waitForClickable({timeout: 20000});
    return $('#addTagInput');
  }
  public trashInspectionDropDown() {
    $(`//*[contains(@class, 'dropdown')]//*[contains(text(), 'Affaldsinspektion')]`).click();
  }
  public get trashInspectionDropdownName() {
    return $(`//*[contains(@class, 'dropdown')]//*[contains(text(), 'Affaldsinspektion')]`).$('..');
  }
  public get trashInspectionDropdownItemName() {
    return $(`//*[contains(text(), 'Fraktioner')]`);
  }
  public get fractionBtn() {
    const ele = $(`//*[contains(text(), 'Fraktioner')]`);
    ele.waitForDisplayed(20000);
    ele.waitForClickable({timeout: 20000});
    return ele;
  }
  public  fractionCreateBtn() {
    $('#fractionCreateBtn').click();
  }
  public getBtnTxt(text: string) {
    return $(`//*[contains(@class, 'p-3')]//*[text()="${text}"]`);
  }
  public get fractionCreateNameBox() {
    $('#createFractionName').waitForDisplayed(20000);
    $('#createFractionName').waitForClickable({timeout: 20000});
    return $('#createFractionName');
  }
  public get fractionCreateDescriptionBox() {
    $('#createFractionDescription').waitForDisplayed(20000);
    $('#createFractionDescription').waitForClickable({timeout: 20000});
    return $('#createFractionDescription');
  }
  public get fractionCreateSelectorBox() {
    return $(`//*[contains(@id, 'createFractionSelector')]//input`);
  }
  public get fractionCreateOption() {
    return $(`//*[contains(@class, 'ng-option-label')]`);
  }
  public get createSaveBtn() {
    $('#fractionCreateSaveBtn').waitForDisplayed(20000);
    $('#fractionCreateSaveBtn').waitForClickable({timeout: 20000});
    return $('#fractionCreateSaveBtn');
  }
  public get fractionCreateCancelBtn() {
    $('#fractionCreateCancelBtn').waitForDisplayed(20000);
    $('#fractionCreateCancelBtn').waitForClickable({timeout: 20000});
    return $('#fractionCreateCancelBtn');
  }
  public get fractionEditBtn() {
    $('#updateFractionBtn').waitForDisplayed(20000);
    $('#updateFractionBtn').waitForClickable({timeout: 20000});
    return $('#updateFractionBtn');
  }
  public get fractionUpdateNameBox() {
    $('#updateFractionName').waitForDisplayed(20000);
    $('#updateFractionName').waitForClickable({timeout: 20000});
    return $('#updateFractionName');
  }
  public get fractionUpdateDescriptionBox() {
    $('#editFractionDescription').waitForDisplayed(20000);
    $('#editFractionDescription').waitForClickable({timeout: 20000});
    return $('#editFractionDescription');
  }
  public get fractionUpdateSelecterBox() {
    return $(`//*[contains(@id, 'fractionUpdateSelector')]//input`);
  }
  public get fractionUpdateOption() {
    return $(`//*[contains(@class, 'ng-option-label')]`);
  }
  public get fractionUpdateSaveBtn() {
    $('#fractionUpdateSaveBtn').waitForDisplayed(20000);
    $('#fractionUpdateSaveBtn').waitForClickable({timeout: 20000});
    return $('#fractionUpdateSaveBtn');
  }
  public get fractionUpdateCancelBtn() {
    $('#fractionUpdateCancelBtn').waitForDisplayed(20000);
    $('#fractionUpdateCancelBtn').waitForClickable({timeout: 20000});
    return $('#fractionUpdateCancelBtn');
  }
  public get fractionDeleteBtn() {
    $('#deleteFractionBtn').waitForDisplayed(20000);
    $('#deleteFractionBtn').waitForClickable({timeout: 20000});
    return $('#deleteFractionBtn');
  }
  public get fractionDeleteId() {
    $('#selectedFractionId').waitForDisplayed(20000);
    $('#selectedFractionId').waitForClickable({timeout: 20000});
    return $('#selectedFractionId');
  }
  public get fractionDeleteName() {
    $('#selectedFractionName').waitForDisplayed(20000);
    $('#selectedFractionName').waitForClickable({timeout: 20000});
    return $('#selectedFractionName');
  }
  public get fractionDeleteDeleteBtn() {
    $('#fractionDeleteDeleteBtn').waitForDisplayed(20000);
    $('#fractionDeleteDeleteBtn').waitForClickable({timeout: 20000});
    return $('#fractionDeleteDeleteBtn');
  }
  public get fractionDelteCancelBtn() {
    $('#fractionDeleteCancelBtn').waitForDisplayed(20000);
    $('#fractionDeleteCancelBtn').waitForClickable({timeout: 20000});
    return $('#fractionDeleteCancelBtn');
  }
  goToFractionsPage() {
    this.trashInspectionDropDown();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.fractionBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
  }
  createFraction(name: string, description: string) {
    this.fractionCreateBtn();
    $('#createFractionName').waitForDisplayed(20000);
    this.fractionCreateNameBox.addValue(name);
    this.fractionCreateDescriptionBox.addValue(description);
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.fractionCreateSelectorBox.addValue('Number 1');
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.fractionCreateOption.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.createSaveBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    $('#fractionCreateBtn').waitForDisplayed(20000);
  }
  cancelCreateFraction(name: string, description: string) {
    this.fractionCreateBtn();
    // $('#spinner-animation').waitForDisplayed(20000, true);
    $('#createFractionName').waitForDisplayed(20000);
    this.fractionCreateNameBox.addValue(name);
    this.fractionCreateDescriptionBox.addValue(description);
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.fractionCreateSelectorBox.addValue('Number 1');
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.fractionCreateOption.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.fractionCreateCancelBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    $('#fractionCreateBtn').waitForDisplayed(20000);
  }
  editFraction(newName: string, newDescription: string) {
    this.fractionEditBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.fractionUpdateNameBox.clearValue();
    this.fractionUpdateNameBox.addValue(newName);
    this.fractionUpdateDescriptionBox.clearValue();
    this.fractionUpdateDescriptionBox.addValue(newDescription);
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.fractionUpdateSelecterBox.addValue('Number 2');
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.fractionUpdateOption.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.fractionUpdateSaveBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
  }
  cancelEditFraction(newName: string, newDescription: string) {
    this.fractionEditBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.fractionUpdateNameBox.clearValue();
    this.fractionUpdateNameBox.addValue(newName);
    this.fractionUpdateDescriptionBox.clearValue();
    this.fractionUpdateDescriptionBox.addValue(newDescription);
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.fractionUpdateSelecterBox.addValue('Number 2');
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.fractionUpdateOption.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.fractionUpdateCancelBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
  }
  deleteFraction() {
    const fractionForDelete = this.getFirstRowObject();
    fractionForDelete.deleteBtn.click();
    // browser.pause(4000);
    $('#fractionDeleteDeleteBtn').waitForDisplayed(10000);
    this.fractionDeleteDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
  }
  cancelDeleteFraction() {
    const fractionForDelete = this.getFirstRowObject();
    fractionForDelete.deleteBtn.click();
    // browser.pause(4000);
    $('#fractionDeleteDeleteBtn').waitForDisplayed(10000);
    this.fractionDelteCancelBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
  }
  getFirstRowObject(): FractionsRowObject {
    browser.pause(500);
    return new FractionsRowObject(1);
  }
  createNewEform(eFormLabel, newTagsList = [], tagAddedNum = 0) {
    this.newEformBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    // Create replaced xml and insert it in textarea
    const xml = XMLForEformFractions.XML.replace('TEST_LABEL', eFormLabel);
    browser.execute(function (xmlText) {
      (<HTMLInputElement>document.getElementById('eFormXml')).value = xmlText;
    }, xml);
    this.xmlTextArea.addValue(' ');
    // Create new tags
    const addedTags: string[] = newTagsList;
    if (newTagsList.length > 0) {
      this.createEformNewTagInput.setValue(newTagsList.join(','));
      $('#spinner-animation').waitForDisplayed(20000, true);
    }
    // Add existing tags
    const selectedTags: string[] = [];
    if (tagAddedNum > 0) {
      $('#spinner-animation').waitForDisplayed(20000, true);
      for (let i = 0; i < tagAddedNum; i++) {
        this.createEformTagSelector.click();
        const selectedTag = $('.ng-option:not(.ng-option-selected)');
        selectedTags.push(selectedTag.getText());
        console.log('selectedTags is ' + JSON.stringify(selectedTags));
        selectedTag.click();
        $('#spinner-animation').waitForDisplayed(20000, true);
      }
    }
    this.createEformBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    return {added: addedTags, selected: selectedTags};
  }
}

const fractionsPage = new TrashInspectionFractionPage();
export default fractionsPage;

export class FractionsRowObject {
  constructor(rowNum) {
    if ($$('#fractionId')[rowNum - 1]) {
      this.id = +$$('#fractionId')[rowNum - 1];
      try {
        this.name = $$('#fractionName')[rowNum - 1].getText();
      } catch (e) {}
      try {
        this.description = $$('#fractionDescription')[rowNum - 1].getText();
      } catch (e) {}
      try {
        this.eForm = $$('#fractionSelectedeForm')[rowNum - 1].getText();
      } catch (e) {}
      this.editBtn = $$('#updateFractionBtn')[rowNum - 1];
      this.deleteBtn = $$('#deleteFractionBtn')[rowNum - 1];
    }
  }
  id;
  name;
  description;
  eForm;
  editBtn;
  deleteBtn;
}
