import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import pluginPage from '../../Page objects/Plugin.page';

import {expect} from 'chai';
import pluginsPage from './application-settings.plugins.page';

describe('Application settings page - site header section', function () {
    before(function () {
        loginPage.open('/auth');
    });
    it('should go to plugin settings page', function () {
        loginPage.login();
        myEformsPage.Navbar.advancedDropdown();
        myEformsPage.Navbar.clickonSubMenuItem('Plugins');
        browser.waitForExist('#plugin-name', 50000);
        browser.pause(10000);

        const plugin = pluginsPage.getFirstPluginRowObj();
        expect(plugin.id).equal(1);
        expect(plugin.name).equal('Microting Trash Inspection Plugin');
        expect(plugin.version).equal('1.0.0.0');
        expect(plugin.status).equal('Deaktiveret');

    });

    it('should activate the plugin', function () {
        pluginPage.pluginSettingsBtn.click();
        browser.waitForVisible('#PluginDropDown', 40000);
        pluginPage.selectValue('PluginDropDown', 'PluginDropDown', 'Aktiveret');
        pluginPage.saveBtn.click();
        browser.pause(50000); // We need to wait 50 seconds for the plugin to create db etc.
        browser.refresh();

        // Start - This block is here because of the new plugin permission loading, requires a re-login.
        loginPage.login();
        myEformsPage.Navbar.advancedDropdown();
        myEformsPage.Navbar.clickonSubMenuItem('Plugins');
        browser.waitForExist('#plugin-name', 50000);
        browser.pause(10000);
        // End - This block is here because of the new plugin permission loading, requires a re-login.

        const plugin = pluginsPage.getFirstPluginRowObj();
        expect(plugin.id).equal(1);
        expect(plugin.name).equal('Microting Trash Inspection Plugin');
        expect(plugin.version).equal('1.0.0.0');
        expect(plugin.status).equal('Aktiveret');
        expect(browser.element(`//*[contains(@class, 'dropdown')]//*[contains(text(), 'Affaldsinspektion')]`).isExisting()).equal(true);
    });
});
