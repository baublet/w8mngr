import { testCleanup, testSetup } from "./api/config/test";

jest.mock("./api/config/log");
jest.useFakeTimers();

beforeAll(testSetup);
afterAll(testCleanup);
