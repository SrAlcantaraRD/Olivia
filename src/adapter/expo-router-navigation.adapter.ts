import type { Href, ImperativeRouter } from 'expo-router';

import type { INavigationPort } from '@/domain/core/port/navigation.port';

export class ExpoRouterNavigationAdapter implements INavigationPort {
  constructor(private router: ImperativeRouter) {}

  navigateTo(route: string): void {
    this.router.push(route as Href);
  }

  goBack(): void {
    this.router.back();
  }

  replaceTo(route: string): void {
    this.router.replace(route as Href);
  }
}
