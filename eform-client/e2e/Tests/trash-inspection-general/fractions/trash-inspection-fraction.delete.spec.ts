import { expect } from 'chai';
import loginPage from '../../../Page objects/Login.page';
import fractionsPage from '../../../Page objects/trash-inspection/TrashInspection-Fraction.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

const createModel = {
  name: generateRandmString(),
  description: generateRandmString(),
  locationCode: generateRandmString(),
  eForm: 'Number 1',
  itemNumber: '',
};
describe('Trash Inspection Plugin - Fraction Delete', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
    fractionsPage.goToFractionsPage();
    fractionsPage.createFraction(createModel);
  });
  it('should not delete fraction', function () {
    const rowNumBeforeDelete = fractionsPage.rowNum;
    const fraction = fractionsPage.getFirstRowObject();
    fraction.openDeleteModal();
    expect(+fractionsPage.fractionDeleteId.getText()).eq(fraction.id);
    expect(fractionsPage.fractionDeleteName.getText()).eq(fraction.name);
    fraction.closeDeleteModal(true);
    expect(fractionsPage.rowNum, 'fraction is deleted').equal(
      rowNumBeforeDelete
    );
  });
  it('should delete Fraction', function () {
    const rowNumBeforeDelete = fractionsPage.rowNum;
    const fraction = fractionsPage.getFractionsRowObjectByName(
      createModel.name
    );
    fraction.delete();
    expect(fractionsPage.rowNum, 'fraction is not deleted').equal(
      rowNumBeforeDelete - 1
    );
  });
  after(function () {
    fractionsPage.clearTable();
  });
});
