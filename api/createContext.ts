import {
  ServiceContainer,
  createServiceContainer,
} from "@baublet/service-container";

import { UserEntity } from "./dataServices/user";

export interface Context {
  currentUser?: UserEntity;
  services: ServiceContainer;
}

export function createContext({
  user,
}: {
  user?: UserEntity;
} = {}): Context {
  return {
    currentUser: user,
    services: createServiceContainer(),
  };
}
