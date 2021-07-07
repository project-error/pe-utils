import { LogLevelName } from "../types";

interface ClientLoggerSettings {
  minLevel: LogLevelName;
  prefix: string | undefined;
  colorizeAll: boolean;
}

type ColorCodeString = `^${number}`

type ColorToCodeMap = {
  [key in LogLevelName]: ColorCodeString
}

class ClientLogger {
  private readonly _settings: ClientLoggerSettings = {
    minLevel: "debug",
    prefix: undefined,
    colorizeAll: true,
  };

  private readonly _defaultColorMap: ColorToCodeMap = {
    error: '^1',
    trace: '^9',
    info: '^4',
    debug: '^2',
    warn: '^8',
    fatal: '^6',
    silly: '^5'
  }

  private readonly _logLevels: LogLevelName[] = [
    "silly",
    "trace",
    "debug",
    "info",
    "warn",
    "error",
    "fatal"
  ]


  public constructor(settings?: Partial<ClientLoggerSettings>) {
    this._settings = { ...this._settings, ...settings };
  }

  private getPrefix(): string {
    return (this._settings.prefix || '')
  }

  public info(...args: unknown[]): void {
    this._handleLogOut('info', args)
  }

  public error(...args: unknown[]): void {
    this._handleLogOut('error', args)
  }

  public debug(...args: unknown[]): void {
    this._handleLogOut('debug', args)
  }

  public silly(...args: unknown[]): void {
    this._handleLogOut('silly', args)
  }

  public warn(...args: unknown[]): void {
    this._handleLogOut('warn', args)
  }

  public fatal(...args: unknown[]): void {
    this._handleLogOut('fatal', args)
  }

  private _handleLogOut(logLvl: LogLevelName, logArguments: unknown[]) {
    const outputLogLvl = this._logLevels.indexOf(logLvl)
    // if this level is not high enough to go to console, just return
    if (!(outputLogLvl >= this._logLevels.indexOf(this._settings.minLevel))) return;
    this._buildAndWriteOutLog(logLvl, logArguments)

  }

  private _buildAndWriteOutLog(logLvl: LogLevelName, logArguments: unknown[]): void {
    let logOutString = this._settings.prefix ? `[${this.getPrefix()}]` : ''
    const logLevelColor = this._defaultColorMap[logLvl]
    logOutString += `${logLevelColor}[${logLvl.toUpperCase()}]`
    const colorRizeAll = this._settings.colorizeAll
    if (!colorRizeAll) logOutString += '^0'

   console.log(logOutString, ...logArguments)
  }
}

export default ClientLogger
