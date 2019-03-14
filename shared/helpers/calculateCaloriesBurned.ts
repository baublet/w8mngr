interface CaloriesBurnedArguments {
  workWeightInGrams?: number;
  workTimeInMs?: number;
  workDistanceInMm?: number;
  reps?: number;
  userWeightInGrams: number;
  intensity: number;
}

export default function calculateCaloriesBurned({
  workWeightInGrams,
  workTimeInMs,
  workDistanceInMm,
  reps,
  userWeightInGrams,
  intensity
}: CaloriesBurnedArguments): number {
  intensity = 1 + intensity / 10;

  if (workWeightInGrams) {
    // Basic work weight to joules calculation
    const joules = (workWeightInGrams / 1000) * 9.81 * 0.75,
      // Times 5 here because 5 * 20 = 100; Muscles are roughly 20% efficient
      perRep = joules * 0.000239006 * 5,
      multiplier =
        userWeightInGrams == 0
          ? 1.5
          : 3.5 * (workWeightInGrams / userWeightInGrams);
    // All together now
    return perRep * reps * multiplier * intensity;
  }

  // Altering our intensity to work in the formula at
  // http://ask.metafilter.com/48652/Walking-formula
  if (workTimeInMs) {
    intensity = (intensity < 0.015 ? 0.015 : intensity) - 1;
    const userWeightInLbs = userWeightInGrams * 0.00220462;
    const max = workTimeInMs / 100,
      calculated =
        intensity * (userWeightInLbs * 0.5) * (workTimeInMs / 100 / 60);
    return calculated > max ? max : calculated;
  }

  // Credit: NET calories burned per miles as listed at
  // https://www.checkyourmath.com/convert/length/miles_mm.php
  if (workDistanceInMm) {
    intensity = intensity - 1;
    intensity = intensity < 0.2 ? 0.2 : intensity;
    intensity = intensity > 0.8 ? 0.8 : intensity;
    const userWeightInLbs = userWeightInGrams * 0.00220462,
      // Convert the unit of work from mm to miles
      workDistanceInMiles = workDistanceInMm * 0.00000062;
    return intensity * userWeightInLbs * workDistanceInMiles;
  }

  // A VERY simple and dirty calculation here. Basically, any of these reps
  // are going to be bodyweight, ranging from ridiculously easy for even the
  // most out of shape people (like a simple crunch), to something difficult
  // for even professional athletes (dragon flags). So we'll have a baseline
  // of 1 calorie, and range up to 6 per repetition depending on the exercise's
  // intensity
  if (reps) {
    intensity = intensity / 2;
    intensity = intensity < 1 ? 1 : intensity;
    return intensity * reps;
  }

  return 0;
}
