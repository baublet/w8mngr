export default function parseBody(body) {
  try {
    return JSON.parse(body);
  } catch (e) {
    return false;
  }
}
