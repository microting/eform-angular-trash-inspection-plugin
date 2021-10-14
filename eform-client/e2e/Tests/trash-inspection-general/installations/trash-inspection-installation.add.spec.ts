import { expect } from 'chai';
import loginPage from '../../../Page objects/Login.page';
import installationPage from '../../../Page objects/trash-inspection/TrashInspection-Installation.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

describe('Trash Inspection Plugin - Installation', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
  });
  it('Should create installation without site.', async () => {
    const rowNumBeforeCreate = await installationPage.rowNum();
    const name = generateRandmString();
    await installationPage.goToInstallationsPage();
    await installationPage.createInstallation(name);
    expect(await installationPage.rowNum(), 'installation is not created').equal(
      rowNumBeforeCreate + 1
    );
    const installation = await installationPage.getFirstRowObject();
    expect(installation.name).equal(name);
    await installation.delete();
  });
  it('should not create installation', async () => {
    const rowNumBeforeCreate = await installationPage.rowNum();
    const name = generateRandmString();
    await installationPage.createInstallation(name, true);
    expect(await installationPage.rowNum()).equal(rowNumBeforeCreate);
  });
  after(async () => {
    await installationPage.clearTable();
  });
});
