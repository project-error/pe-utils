export interface LogLevels {
  0: "silly";
  1: "trace";
  2: "debug";
  3: "info";
  4: "warn";
  5: "error";
  6: "fatal";
}

export type LogLevelId = keyof LogLevels;

export type LogLevelName = LogLevels[LogLevelId];
