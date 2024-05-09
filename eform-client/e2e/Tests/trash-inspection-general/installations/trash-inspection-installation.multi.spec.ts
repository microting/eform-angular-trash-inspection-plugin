import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import installationPage from '../../../Page objects/trash-inspection/TrashInspection-Installation.page';
import {generateRandmString} from '../../../Helpers/helper-functions';
import { $ } from '@wdio/globals';

describe('Trash Inspection Plugin - Installation', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await installationPage.goToInstallationsPage();
    await installationPage.clearTable();
  });
  it('Should create multiple installations without site.', async () => {
    for (let i = 0; i < 11; i++) {
      await installationPage.createInstallation(generateRandmString());
    }
    expect(await (await installationPage.page2Object()).getText()).equal('Side 1 af 2');
  });
  after(async () => {
    await loginPage.open('/');
    await installationPage.goToInstallationsPage();
    await installationPage.clearTable();
  });
});
