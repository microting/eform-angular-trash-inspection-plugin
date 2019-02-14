import Page from '../Page';
import XMLForEformFractions from '../../Constants/XMLForEformFractions';


export class TrashInspectionFractionPage extends Page {
  constructor() {
    super();
  }
  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }
  public get newEformBtn() {
    return browser.element('#newEFormBtn');
  }
  public get xmlTextArea() {
    return browser.element('#eFormXml');
  }
  public get createEformBtn() {
    return browser.element('#createEformBtn');
  }
  public get createEformTagSelector() {
    return browser.element('#createEFormMultiSelector');
  }
  public get createEformNewTagInput() {
    return browser.element('#addTagInput');
  }
  public trashInspectionDropDown() {
    browser.element(`//*[contains(@class, 'dropdown')]//*[contains(text(), 'Affaldsinspektion')]`).click();
  }
  public get fractionBtn() {
    return browser.element('#trash-inspection-pn-fractions');
  }
  public get fractionCreateBtn() {
    return browser.element('#fractionCreateBtn');
  }
  public get fractionCreateNameBox() {
    return browser.element('#createFractionName');
  }
  public get fractionCreateDescriptionBox() {
    return browser.element('#createFractionDescription');
  }
  public get fractionCreateSelectorBox() {
    return browser.element(`//*[contains(@id, 'createFractionSelector')]//input`);
  }
  public get fractionCreateOption() {
    return browser.element(`//*[contains(@class, 'ng-option-label')]`);
  }
  public get createSaveBtn() {
    return browser.element('#fractionCreateSaveBtn');
  }
  fractionEditBtn() {
    return browser.element('#updateFractionBtn');
  }
  fractionUpdateNameBox() {
    return browser.element('#updateFractionName');
  }
  fractionUpdateDescriptionBox() {
    return browser.element('#editFractionDescription');
  }
  fractionUpdateSelecterBox() {
    return browser.element('#fractionUpdateSelector');
  }
  fractionUpdateSaveBtn() {
    return browser.element('#fractionUpdateSaveBtn');
  }
  fractionUpdateCancelBtn() {
    return browser.element('#fractionUpdateCancelBtn');
  }
  fractionDeleteBtn() {
    return browser.element('#deleteFractionBtn');
  }
  fractionDeleteId() {
    return browser.element('#selectedFractionId');
  }
  fractionDeleteName() {
    return browser.element('#selectedFractionName');
  }
  fractionDeleteDeleteBtn() {
    return browser.element('#fractionDeleteDeleteBtn');
  }
  fractionDelteCancelBtn() {
    return browser.element('#fractionDeleteCancelBtn');
  }
  goToFractionsPage() {
    this.trashInspectionDropDown();
    browser.pause(1000);
    this.fractionBtn.click();
    browser.pause(8000);
  }
  createFraction(name: string, description: string) {
    this.fractionCreateBtn.click();
    browser.pause(8000);
    this.fractionCreateNameBox.addValue(name);
    this.fractionCreateDescriptionBox.addValue(description);
    browser.pause(3000);
    this.fractionCreateSelectorBox.addValue('Number');
    browser.pause(3000);
    this.fractionCreateOption.click();
    browser.pause(1000);
    this.createSaveBtn.click();
  }
  getFirstRowObject(): FractionsRowObject {
    return new FractionsRowObject(1);
  }
  createNewEform(eFormLabel, newTagsList = [], tagAddedNum = 0) {
    this.newEformBtn.click();
    browser.pause(5000);
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
      browser.pause(5000);
    }
    // Add existing tags
    const selectedTags: string[] = [];
    if (tagAddedNum > 0) {
      browser.pause(5000);
      for (let i = 0; i < tagAddedNum; i++) {
        this.createEformTagSelector.click();
        const selectedTag = $('.ng-option:not(.ng-option-selected)');
        selectedTags.push(selectedTag.getText());
        console.log('selectedTags is ' + JSON.stringify(selectedTags));
        selectedTag.click();
        browser.pause(5000);
      }
    }
    this.createEformBtn.click();
    browser.pause(14000);
    return {added: addedTags, selected: selectedTags};
  }
}

const fractionsPage = new TrashInspectionFractionPage();
export default fractionsPage;

export class FractionsRowObject {
  constructor(rowNum) {
  this.id = $$('#fractionId')[rowNum - 1].getText();
  this.name = $$('#fractionName')[rowNum - 1].getText();
  this.description = $$('#fractionDescription')[rowNum - 1].getText();
  this.eForm = $$('#fractionSelectedeForm')[rowNum - 1].getText();
  this.editBtn = $$('#updateFractionBtn')[rowNum - 1];
  this.deleteBtn = $$('#deleteFractionBtn')[rowNum - 1];
  }
  id;
  name;
  description;
  eForm;
  editBtn;
  deleteBtn;

}
