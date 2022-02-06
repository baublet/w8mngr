import { testCleanup, testSetup } from "./api/config/test";

jest.useFakeTimers();

beforeAll(testSetup);
afterAll(testCleanup);
