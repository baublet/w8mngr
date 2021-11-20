interface ObjectType {
  [key: string]: any;
  [key: number]: any;
}

export function objectEmpty(obj: ObjectType): boolean {
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    if (obj[keys[i]]) return false;
  }
  return true;
}
