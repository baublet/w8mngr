import fs from "fs";
import path from "path";
import url from "url";
import type { ActivityType } from "../../api/generated";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const sqlFilePath = path.join(
  __dirname,
  "..",
  "..",
  "migrations",
  "0001_SeedActivities.sql",
);

const exercisesDocumentPath = path.join(
  __dirname,
  "free-exercise-db/dist/exercises.json",
);

const exercisesDocuments = JSON.parse(
  fs.readFileSync(exercisesDocumentPath, "utf8"),
);

type ActivityCategory =
  | "powerlifting"
  | "strength"
  | "stretching"
  | "cardio"
  | "olympic weightlifting"
  | "strongman"
  | "plyometrics";

const BIG_LIFTS: ActivityCategory[] = [
  "powerlifting",
  "strength",
  "olympic weightlifting",
  "strongman",
];

type ActivityMuscles =
  | "abdominals"
  | "abductors"
  | "adductors"
  | "biceps"
  | "calves"
  | "chest"
  | "forearms"
  | "glutes"
  | "hamstrings"
  | "lats"
  | "lower back"
  | "middle back"
  | "neck"
  | "quadriceps"
  | "shoulders"
  | "traps"
  | "triceps";

const BIGGEST_MUSCLES: ActivityMuscles[] = [
  "quadriceps",
  "hamstrings",
  "glutes",
  "lats",
  "chest",
];

function getIntensity(document: {
  category: ActivityCategory;
  level: "beginner" | "intermediate" | "expert";
  mechanic: null | "compound" | "isolation";
  primaryMuscles: ActivityMuscles[];
  secondaryMuscles: ActivityMuscles[];
}): number {
  let score = 1;

  // LOTS of muscles bonus
  const totalMusclesUsed =
    document.primaryMuscles.length + document.secondaryMuscles.length;
  if (totalMusclesUsed > 8) {
    score += 1;
  } else if (totalMusclesUsed < 2) {
    score -= 1;
  }

  const isBigLift = BIG_LIFTS.includes(document.category);
  if (isBigLift) {
    score += 2;
  }

  if (document.level === "beginner") {
    score += 1;
  } else if (document.level === "intermediate") {
    score += 2;
  } else if (document.level === "expert") {
    score += 3;
  }

  const mechanic =
    document.mechanic === "compound" && totalMusclesUsed > 3 // Weeds out things like "bicep curls" which aren't really compounds
      ? "compound"
      : document.mechanic === "compound"
        ? "isolation"
        : document.mechanic;
  if (mechanic === "compound") {
    score += 2;
  } else if (mechanic === "isolation") {
    score += 1;
  }

  // Biggest muscle bonuses
  for (const muscle of document.primaryMuscles) {
    if (BIGGEST_MUSCLES.includes(muscle)) {
      score += 1;
      break;
    }
  }

  return score > 10 ? 10 : score;
}

function getDocumentActivityType(document: {
  category: ActivityCategory;
}): ActivityType {
  switch (document.category) {
    case "powerlifting":
      return "WEIGHT";
    case "strength":
      return "WEIGHT";
    case "stretching":
      return "TIMED";
    case "cardio":
      return "TIMED";
    case "olympic weightlifting":
      return "WEIGHT";
    case "strongman":
      return "WEIGHT";
    case "plyometrics":
      return "REPETITIVE";
  }
}

const lines: string[] = [];

for (const document of exercisesDocuments) {
  lines.push(
    `INSERT INTO "activityLibrary" (
    id,
    name,
    description,
    type,
    intensity
) VALUES (${[
      document.id,
      document.name,
      document.instructions.filter((v) => Boolean(v?.trim())).join("\n\n"),
      getDocumentActivityType(document),
      getIntensity(document),
    ]
      .map(String)
      .map((v) => (v ? `'${v.replace(/'/g, "''")}'` : "null"))
      .join(", ")}
) ON CONFLICT DO UPDATE SET
    name = excluded.name,
    description = excluded.description,
    type = excluded.type,
    intensity = excluded.intensity
;
`.replace(/[\s\n]+/g, " "),
  );

  if (lines.length > 999) {
    break;
  }
}

fs.writeFileSync(sqlFilePath, lines.join("\n"));
