import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import {Guid} from 'guid-typescript';
import fractionsPage from '../../../Page objects/trash-inspection/TrashInspection-Fraction.page';
import pluginsPage from '../../trash-inspections-settings/application-settings.plugins.page';
import myEformsPage from '../../../Page objects/MyEforms.page';

describe('Trash Inspection Plugin - Fraction', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
  });
  it('Should create eForm', function () {
    const newEformLabel = 'Number 1';
    fractionsPage.createNewEform(newEformLabel);

  });
  it('should check if menupoint is there', function () {
    expect(fractionsPage.trashInspectionDropdownName.getText()).equal('Affaldsinspektion');
    fractionsPage.trashInspectionDropDown();

    $('#spinner-animation').waitForDisplayed(50000, true);
    // browser.pause(2000);
    // browser.waitForVisible(`//*[contains(text(), 'Fraktioner')]`, 10000);
    expect(fractionsPage.fractionBtn.getText()).equal('Fraktioner');

    $('#spinner-animation').waitForDisplayed(50000, true);
    fractionsPage.trashInspectionDropDown();
  });
  it('should get btn text', function () {
    // $('#plugin-id').waitForDisplayed(10000);
    //browser.pause(10000);
    $('#spinner-animation').waitForDisplayed(50000, true);
    fractionsPage.goToFractionsPage();
    fractionsPage.getBtnTxt('Ny Fraktion');
  });
  it('should create Fraction', function () {
    console.log('should create Fraction');
    const name = Guid.create().toString();
    const description = Guid.create().toString();
    fractionsPage.createFraction(name, description);
    const fraction = fractionsPage.getFirstRowObject();
    expect(fraction.name).equal(name);
    expect(fraction.description).equal(description);
    expect(fraction.eForm).equal('Number 1');
  });
  it('should clean up', function () {
    const fraction = fractionsPage.getFirstRowObject();
    fraction.deleteBtn.click();
    $('#fractionDeleteDeleteBtn').waitForDisplayed(20000);
    fractionsPage.fractionDeleteDeleteBtn.click();
    expect(fraction.id === null);
  });
  it('should not create fraction', function () {
    const name = Guid.create().toString();
    const description = Guid.create().toString();
    fractionsPage.cancelCreateFraction(name, description);
    const fraction = fractionsPage.getFirstRowObject();
    expect(fractionsPage.rowNum).equal(0);
  });
});
