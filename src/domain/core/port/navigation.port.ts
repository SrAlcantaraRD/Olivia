export interface INavigationPort {
  navigateTo(route: string): void;
  goBack(): void;
  replaceTo(route: string): void;
}
