import {
  ServiceContainer,
  createServiceContainer,
} from "@baublet/service-container";

declare global {
  interface Window {
    w8mngrServiceContainer: ServiceContainer;
  }
}

export async function boot() {
  window.w8mngrServiceContainer = createServiceContainer();
}
