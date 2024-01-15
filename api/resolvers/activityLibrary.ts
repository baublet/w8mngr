import { activityLibraryDataService } from "../dataServices/activityLibrary/index.js";
import { QueryResolvers } from "../generated.js";

export const activityLibrary: QueryResolvers["activityLibrary"] = async (
  parent,
  args,
  context,
) => {
  return activityLibraryDataService.getConnection(context, {
    applyCustomConstraint: (q) => {
      const searchString = args.input?.filter?.searchString;
      if (searchString) {
        q = q.where("name", "like", `%${searchString}%`);
      }
      const id = args.input?.filter?.id;
      if (id) {
        q = q.where("id", "=", id);
      }
      return q;
    },
    connectionResolverParameters: {
      after: args?.input?.after,
      before: args?.input?.before,
      first: args?.input?.first,
      last: args?.input?.last,
      sort: {
        name: "asc",
      },
    },
  });
};
