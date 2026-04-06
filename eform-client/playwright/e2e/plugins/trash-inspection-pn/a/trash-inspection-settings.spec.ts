import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { MyEformsPage } from '../../../Page objects/MyEforms.page';
import { PluginPage } from '../../../Page objects/Plugin.page';

const pluginName = 'Microting Trash Inspection Plugin';
let page;

test.describe('Application settings page - site header section', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });
  test.afterAll(async () => {
    await page.close();
  });

  test('should go to plugin settings page', async () => {
    const loginPage = new LoginPage(page);
    const myEformsPage = new MyEformsPage(page);
    const pluginPage = new PluginPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
    await myEformsPage.Navbar.goToPluginsPage();
    const plugin = await pluginPage.getPluginRowObjByName(pluginName);
    expect(plugin).not.toBeNull();
    expect(plugin!.name.trim()).toBe(pluginName);
    expect(plugin!.status.trim()).toBe('toggle_off');
  });

  test('should activate the plugin', async () => {
    test.setTimeout(240000);
    const pluginPage = new PluginPage(page);
    const plugin = await pluginPage.getPluginRowObjByName(pluginName);
    expect(plugin).not.toBeNull();
    await plugin!.enableOrDisablePlugin();
    const pluginAfter = await pluginPage.getPluginRowObjByName(pluginName);
    expect(pluginAfter).not.toBeNull();
    expect(pluginAfter!.name.trim()).toBe(pluginName);
    expect(pluginAfter!.status.trim()).toBe('toggle_on');
  });
});
