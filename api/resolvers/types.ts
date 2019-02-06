export type ResolverType = (
  parent: Object,
  args: Object,
  context: Object,
  info: Object
) => Promise<any>;
