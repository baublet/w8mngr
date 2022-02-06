import { config } from "../config/config";
import { log } from "../config/log";

const taskIntervals: Map<string, number> = new Map();

if (config.get("RECURRING_TASKS") === "true") {
  const killTasks = () => {
    process.stdout.write("Stopping recurring tasks");
    for (const task of Array.from(taskIntervals.keys())) {
      clearInterval(taskIntervals.get(task));
    }
  };
  process.on("SIGINT", killTasks);
  process.on("SIGABRT", killTasks);
  process.on("SIGTERM", killTasks);
  process.on("exit", killTasks);
}

export function registerRecurringTask({
  intervalMs,
  task,
  taskKey,
}: {
  taskKey: string;
  task: () => Promise<void>;
  intervalMs: number;
}) {
  if (config.get("RECURRING_TASKS") !== "true") {
    log("debug", "Skipping recurring task registration in test environment");
    return;
  }

  if (taskIntervals.has(taskKey)) {
    throw new Error(
      `Attempted to register duplicate recurring task key: ${taskKey}`
    );
  }

  log("debug", "Registering recurring task " + taskKey);

  const interval: any = setInterval(task, intervalMs);
  taskIntervals.set(taskKey, interval);
}
