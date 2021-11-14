import {
  ServiceContainer,
  createServiceContainer,
} from "@baublet/service-container";

import { UserEntity } from "./dataServices/user";

export interface Context {
  currentUser?: UserEntity;
  services: ServiceContainer;
}

export function getContext({
  user,
}: {
  user?: UserEntity;
} = {}): Context {
  return {
    currentUser: user,
    services: createServiceContainer(),
  };
}
