import { by, device, element, expect } from 'detox';

describe('Parent Setup Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should complete parent setup and navigate to register tab', async () => {
    // Step 1: Parent Info
    await expect(element(by.id('parent-name-input'))).toBeVisible();
    await element(by.id('parent-name-input')).typeText('John Doe');
    await element(by.id('parent-relationship-parent')).tap();

    await expect(element(by.id('next-button'))).toBeVisible();
    await element(by.id('next-button')).tap();

    // Step 2: Child Info
    await expect(element(by.id('child-name-input'))).toBeVisible();
    await element(by.id('child-name-input')).typeText('Jane Doe');
    await element(by.id('child-birthdate-input')).typeText('2010-01-01');
    await element(by.id('child-diagnosis-input')).typeText('Spina Bifida');

    await element(by.id('next-button')).tap();

    // Step 3: Modules
    await expect(element(by.id('module-cic'))).toBeVisible();
    await element(by.id('module-cic')).tap();
    await element(by.id('module-stool')).tap();

    await element(by.id('next-button')).tap();

    // Step 4: Summary and Save
    await expect(element(by.id('summary-save-button'))).toBeVisible();
    await element(by.id('summary-save-button')).tap();

    // Verify navigation to register tab
    await expect(element(by.id('register-tab'))).toBeVisible();
  });
});
