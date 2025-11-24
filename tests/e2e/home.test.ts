describe('Home Screen', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show home screen text', async () => {
    await expect(element(by.text('Home'))).toBeVisible();
  });

  it('should show add button', async () => {
    // Asumiendo que el botón tiene un testID o accessibilityLabel
    // Necesitaré añadir testID al componente FloatingAddButton
    await expect(element(by.id('floating-add-button'))).toBeVisible();
  });
});
