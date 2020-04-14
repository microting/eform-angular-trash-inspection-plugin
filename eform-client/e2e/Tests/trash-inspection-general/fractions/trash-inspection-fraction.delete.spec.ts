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
  it('should check if menupoint is there', function () {
    expect(fractionsPage.trashInspectionDropdownName.getText()).equal('Affaldsinspektion');
    fractionsPage.trashInspectionDropDown();
    // $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    $('#trash-inspection-pn-fractions').waitForDisplayed({timeout: 10000});
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
    expect(fraction.eForm).equal('Number 1');
  });
  it('should not delete fraction', function () {
    const fraction = fractionsPage.getFirstRowObject();
    const oldName = fraction.name;
    const oldDescription = fraction.description;
    fractionsPage.cancelDeleteFraction();
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    const fractionAfterCancelDelete = fractionsPage.getFirstRowObject();
    expect(fractionAfterCancelDelete.name).equal(oldName);
    expect(fractionAfterCancelDelete.description).equal(oldDescription);
  });
  it('should delete Fraction', function () {
    fractionsPage.deleteFraction();
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    const fraction = fractionsPage.getFirstRowObject();
    expect(fractionsPage.rowNum).equal(0);
  });

});
