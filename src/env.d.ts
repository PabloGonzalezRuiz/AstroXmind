/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    documentNavigation?: import('./lib/navigation/types').NavigationContext;
  }
}
declare module 'virtual:astroxmind/navigation' {
  export function getNavigationIndex(): import('./lib/navigation/types').NavigationIndex;
}
