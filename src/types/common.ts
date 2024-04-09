export interface ApiResponse<T> {
  status: number;
  statusText: string;
  headers: Headers;
  config: Config;
  request: Request;
  data: T;
}

export interface Headers {
  [key: string]: string;
}

export interface Config {
  transitional: Transitional
  adapter: string
  timeout: number
  xsrfCookieName: string
  xsrfHeaderName: string
  maxContentLength: number
  maxBodyLength: number
  env: Env
  headers: Headers2
  baseURL: string
  method: string
  url: string
  data: string
}

export interface Transitional {
  silentJSONParsing: boolean
  forcedJSONParsing: boolean
  clarifyTimeoutError: boolean
}

export interface Env { }

export interface Headers2 {
  Accept: string
  "Content-Type": string
}

export interface Request { }