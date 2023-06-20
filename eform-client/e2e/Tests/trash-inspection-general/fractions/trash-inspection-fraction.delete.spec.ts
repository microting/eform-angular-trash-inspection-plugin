import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import fractionsPage from '../../../Page objects/trash-inspection/TrashInspection-Fraction.page';
import {generateRandmString} from '../../../Helpers/helper-functions';

const createModel = {
  name: generateRandmString(),
  description: generateRandmString(),
  locationCode: generateRandmString(),
  eForm: 'Number 1',
  itemNumber: '',
};
describe('Trash Inspection Plugin - Fraction Delete', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await fractionsPage.goToFractionsPage();
    await fractionsPage.createFraction(createModel);
  });
  it('should not delete fraction', async () => {
    const rowNumBeforeDelete = await fractionsPage.rowNum();
    const fraction = await fractionsPage.getFirstRowObject();
    await fraction.openDeleteModal();
    expect(+await (await fractionsPage.fractionDeleteId() as WebdriverIO.Element).getText()).eq(fraction.id);
    expect(await (await fractionsPage.fractionDeleteName() as WebdriverIO.Element).getText()).eq(fraction.name);
    await fraction.closeDeleteModal(true);
    expect(await fractionsPage.rowNum(), 'fraction is deleted').equal(
      rowNumBeforeDelete
    );
  });
  it('should delete Fraction', async () => {
    const rowNumBeforeDelete = await fractionsPage.rowNum();
    const fraction = await fractionsPage.getFractionsRowObjectByName(
      createModel.name
    );
    await fraction.delete();
    expect(await fractionsPage.rowNum(), 'fraction is not deleted').equal(
      rowNumBeforeDelete - 1
    );
  });
  after(async () => {
    await fractionsPage.clearTable();
  });
});
