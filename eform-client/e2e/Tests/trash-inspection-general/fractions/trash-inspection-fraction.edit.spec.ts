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
  it('should create eForm nr. 2', function () {
    myEformsPage.createNewEform('Number 2');
  });
  it('should check if menupoint is there', function () {
    expect(fractionsPage.trashInspectionDropdownName.getText()).equal('Affaldsinspektion');
    fractionsPage.trashInspectionDropDown();
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    // $('#trash-inspection-pn-fractions').waitForDisplayed({timeout: 10000});
    expect(fractionsPage.fractionBtn.getText()).equal('Fraktioner');
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    fractionsPage.trashInspectionDropDown();
  });
  it('should get btn text', function () {
    // $('#plugin-id').waitForDisplayed({timeout: 10000});
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    fractionsPage.goToFractionsPage();
    fractionsPage.getBtnTxt('Ny Fraktion');
  });
  it('should create fraction', function () {
    const name = Guid.create().toString();
    const description = Guid.create().toString();
    fractionsPage.createFraction(name, description);
    const fraction = fractionsPage.getFirstRowObject();
    expect(fraction.name).equal(name);
    expect(fraction.description).equal(description);
  });
  it('should edit Fraction', function () {
    const newName = Guid.create().toString();
    const newDescription = Guid.create().toString();
    fractionsPage.editFraction(newName, newDescription);
    const fraction = fractionsPage.getFirstRowObject();
    expect(fraction.name).equal(newName);
    expect(fraction.description).equal(newDescription);
    expect(fraction.eForm).equal('Number 2');
  });
  it('should not edit fraction', function () {
    const fraction = fractionsPage.getFirstRowObject();
    const newName = Guid.create().toString();
    const newDescription = Guid.create().toString();
    const oldName = fraction.name;
    const oldDescription = fraction.description;
    fractionsPage.cancelEditFraction(newName, newDescription);
    const fractionAfterCancelEdit = fractionsPage.getFirstRowObject();
    expect(fractionAfterCancelEdit.name).equal(oldName);
    expect(fractionAfterCancelEdit.description).equal(oldDescription);
    expect(fractionAfterCancelEdit.eForm).equal('Number 2');
  });
  it('should clean up', function () {
    const fraction = fractionsPage.getFirstRowObject();
    fraction.deleteBtn.click();
    $('#fractionDeleteDeleteBtn').waitForDisplayed({timeout: 20000});
    fractionsPage.fractionDeleteDeleteBtn.click();
    expect(fractionsPage.rowNum).equal(0);
  });
});
