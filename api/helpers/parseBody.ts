export function parseBody(body: any) {
  try {
    return JSON.parse(body);
  } catch (e) {
    return false;
  }
}
