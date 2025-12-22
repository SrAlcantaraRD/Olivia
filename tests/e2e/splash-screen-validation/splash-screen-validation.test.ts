import { by, device, element, expect } from 'detox';

describe('Splash Screen Parent Validation', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should navigate to private zone when parent data exists', async () => {
    // First, populate the database by running parent setup
    await expect(element(by.id('parent-name-input'))).toBeVisible();
    await element(by.id('parent-name-input')).typeText('John Doe');
    await element(by.id('parent-relationship-parent')).tap();

    await expect(element(by.id('next-button'))).toBeVisible();
    await element(by.id('next-button')).tap();

    // Child Info
    await expect(element(by.id('child-name-input'))).toBeVisible();
    await element(by.id('child-name-input')).typeText('Jane Doe');
    await element(by.id('child-birthdate-input')).typeText('2010-01-01');
    await element(by.id('child-diagnosis-input')).typeText('Spina Bifida');

    await element(by.id('next-button')).tap();

    // Modules
    await expect(element(by.id('module-cic'))).toBeVisible();
    await element(by.id('module-cic')).tap();
    await element(by.id('module-stool')).tap();

    await element(by.id('next-button')).tap();

    // Summary and Save
    await expect(element(by.id('summary-save-button'))).toBeVisible();
    await element(by.id('summary-save-button')).tap();

    // Verify navigation to register tab
    await expect(element(by.id('register-tab'))).toBeVisible();

    // Now, reload to test splash screen validation
    await device.reloadReactNative();

    // Should automatically navigate to register tab again
    await expect(element(by.id('register-tab'))).toBeVisible();
  });

  it('should show continue button when no parent data exists', async () => {
    // Ensure database is empty
    await expect(element(by.id('reset-db-button'))).toBeVisible();
    await element(by.id('reset-db-button')).tap();

    // Wait for continue button to appear
    await expect(element(by.id('continue-button'))).toBeVisible();

    // Tap continue button
    await element(by.id('continue-button')).tap();

    // Should navigate to onboarding
    await expect(element(by.id('onboarding-wizard'))).toBeVisible();
  });
});
