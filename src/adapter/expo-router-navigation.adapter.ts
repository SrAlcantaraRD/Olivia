import type { Href, Router } from 'expo-router';

import type { INavigationPort } from '@/domain/core/port/navigation.port';

export class ExpoRouterNavigationAdapter implements INavigationPort {
  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.push(route as Href);
  }

  goBack(): void {
    this.router.back();
  }
}
