export interface INavigationPort {
  navigateTo(route: string): void;
  goBack(): void;
}
