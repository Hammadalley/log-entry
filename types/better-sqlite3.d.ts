declare module 'better-sqlite3' {
  interface Database {
    prepare: (sql: string) => Statement;
    transaction: (fn: Function) => Function;
    exec: (sql: string) => void;
    pragma: (pragma: string, simplify?: boolean) => any;
    function: (name: string, fn: Function) => void;
    aggregate: (name: string, options: any) => void;
    backup: (filename: string, options?: any) => Promise<void>;
    serialize: (options?: any) => Buffer;
    close: () => void;
    defaultSafeIntegers: (toggleState?: boolean) => Database;
    name: string;
    open: boolean;
    inTransaction: boolean;
    readonly: boolean;
    memory: boolean;
    run: (sql: string, ...params: any[]) => RunResult;
  }

  interface Statement {
    run: (...params: any[]) => RunResult;
    get: (...params: any[]) => any;
    all: (...params: any[]) => any[];
    iterate: (...params: any[]) => Iterable<any>;
    pluck: (toggleState?: boolean) => Statement;
    expand: (toggleState?: boolean) => Statement;
    raw: (toggleState?: boolean) => Statement;
    bind: (...params: any[]) => Statement;
    columns: () => ColumnDefinition[];
    readonly: boolean;
  }

  interface RunResult {
    changes: number;
    lastInsertRowid: number | bigint;
  }

  interface ColumnDefinition {
    name: string;
    column: string | null;
    table: string | null;
    database: string | null;
    type: string | null;
  }

  export default function(filename: string, options?: {
    readonly?: boolean;
    fileMustExist?: boolean;
    timeout?: number;
    verbose?: Function;
  }): Database;
}