export class W8mngrMap<K, V> extends Map<K, V> {
  public getOrSet(key: K, value: () => V): V {
    if (this.has(key)) {
      return this.get(key)!;
    }

    const newValue = value();
    this.set(key, newValue);
    return newValue;
  }
}
