import { testSetup, testCleanup } from "./api/config/db";

jest.useFakeTimers();

beforeAll(testSetup);
afterAll(testCleanup);
