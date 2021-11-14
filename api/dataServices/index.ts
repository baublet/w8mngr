import { ServiceContainer } from "@baublet/service-container";

import { UserEntity } from "./user";

export type DataService = (container: ServiceContainer) => Promise<any> | any;

export type Entities = {
  UserEntity: UserEntity;
};
