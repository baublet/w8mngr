export function validateArguments(args: {
  before?: string | null;
  last?: number | null;
  first?: number | null;
  after?: string | null;
  sort?: Record<string, "asc" | "desc">;
  idProp?: string;
}) {
  if (args.last && args.first) {
    throw new InvalidArgumentsError(
      "Invalid argument pair: unable to allow both `last` and `first` arguments",
      args
    );
  }
  if (args.before && args.after) {
    throw new InvalidArgumentsError(
      "Invalid argument pair: unable to allow both `before` and `after` arguments",
      args
    );
  }
}

class InvalidArgumentsError extends Error {
  constructor(message: string, args: any) {
    super(
      `Invalid arguments provided to buildConnectionResolver. ${message}. Arguments: ${JSON.stringify(
        args
      )}`
    );
  }
}
