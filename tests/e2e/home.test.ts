import { expect } from 'detox';

describe('Home Screen', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show home screen text', async () => {
    await expect(element(by.text('PEC I'))).toBeVisible();
  });

  it('should show add button', async () => {
    await expect(element(by.id('floating-add-button'))).toExist();
  });

  it('should show button with text hola', async () => {
    await expect(element(by.text('hola'))).toBeVisible();
  });
});
