import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import segmentPage from '../../../Page objects/trash-inspection/TrashInspection-Segment.page';
import {Guid} from 'guid-typescript';

describe('Trash Inspection Plugin - Segment', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
  });
  it('Should edit segment.', async () => {
    const name = Guid.create().toString();
    const newName = Guid.create().toString();
    const description = Guid.create().toString();
    const newDescription = Guid.create().toString();
    const sdkFolderId = Math.floor((Math.random() * 10) + 1);
    const newSDKFolderId = Math.floor((Math.random() * 20) + 1);
    await segmentPage.goToSegmentsPage();
    await segmentPage.createSegment(name, description, sdkFolderId);
    await segmentPage.editSegment(newName, newDescription, newSDKFolderId);
    const segment = await segmentPage.getFirstRowObject();
    expect(segment.name).equal(newName);
    expect(segment.description).equal(newDescription);
    expect(segment.sdkFolderId).equal(`${newSDKFolderId}`);
    await segmentPage.deleteSegment();
  });
  it('Should edit segment with only Name.', async () => {
    const name = Guid.create().toString();
    const newName = Guid.create().toString();
    await segmentPage.createSegment(name);
    await segmentPage.editSegment(newName);
    const segment = await segmentPage.getFirstRowObject();
    expect(segment.name).equal(newName);
    await segmentPage.deleteSegment();
  });
  it('Should edit segment with name and description.', async () => {
    const name = Guid.create().toString();
    const newName = Guid.create().toString();
    const description = Guid.create().toString();
    const newDescription = Guid.create().toString();
    await segmentPage.createSegment(name, description);
    await segmentPage.editSegment(newName, newDescription);
    const segment = await segmentPage.getFirstRowObject();
    expect(segment.name).equal(newName);
    expect(segment.description).equal(newDescription);
    await segmentPage.deleteSegment();
  });
  it('Should edit segment with name and sdkFolderId.', async () => {
    const name = Guid.create().toString();
    const newName = Guid.create().toString();
    const sdkFolderId = Math.floor((Math.random() * 10) + 1);
    const newSDKFolderId = Math.floor((Math.random() * 10) + 1);
    await segmentPage.createSegment(name, '', sdkFolderId);
    await segmentPage.editSegment(newName, '', newSDKFolderId);
    const segment = await segmentPage.getFirstRowObject();
    expect(segment.name).equal(newName);
    expect(segment.sdkFolderId).equal(`${newSDKFolderId}`);
    await segmentPage.deleteSegment();
  });
});
