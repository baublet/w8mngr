import { log } from "../config";

const taskIntervals: Map<string, number> = new Map();

if (process.env.NODE_ENV !== "test") {
  const killTasks = () => {
    log("debug", "Stopping recurring tasks");
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
  if (process.env.NODE_ENV === "test") {
    log("debug", "Skipping recurring task registration in test environment");
    return;
  }

  if (taskIntervals.has(taskKey)) {
    throw new Error(`Attempted to register duplicate cache key: ${taskKey}`);
  }

  const interval: any = setInterval(task, intervalMs);
  taskIntervals.set(taskKey, interval);
}
