import muscleGroups from "../../../shared/data/activity/muscleGroups";

// Returns the LIKE column search string for querying the database based on
// muscle groups targeted. For instance, if you want to search for only activities
// that target biceps:
//
// muscle_groups_like {biceps: 1} => "1____________%"
//
// We then use this to query the column for muscle_groups LIKE "1____________%"

export default function muscleGroupsToQuery(groups: Array<string>) {
  let muscleGroupsSearchTerm = "";
  muscleGroups.forEach((group: string) => {
    muscleGroupsSearchTerm += groups.includes(group) ? "1" : "_";
  });
  return `${muscleGroupsSearchTerm}%`;
}
