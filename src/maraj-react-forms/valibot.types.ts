
/**
 * A Valibot error with useful information.
 */
export declare class ValiError extends Error {
   issues: Issues;
   constructor(issues: Issues);
}

type Issues = [Issue, ...Issue[]];

type Issue = {
   reason: IssueReason;
   validation: string;
   origin: IssueOrigin;
   message: string;
   input: unknown;
   requirement?: unknown;
   path?: PathItem[];
   issues?: Issues;
   abortEarly?: boolean;
   abortPipeEarly?: boolean;
   skipPipe?: boolean;
   _full_input?: unknown;
};

type IssueOrigin = 'key' | 'value';
type IssueReason = 'any' | 'array' | 'bigint' | 'blob' | 'boolean' | 'date' | 'function' | 'instance' | 'map' | 'number' | 'object' | 'record' | 'set' | 'special' | 'string' | 'symbol' | 'tuple' | 'undefined' | 'unknown' | 'type';

type PathItem = ObjectPathItem | RecordPathItem | TuplePathItem | MapPathItem | SetPathItem | ArrayPathItem;


type ObjectPathItem = {
   type: 'object';
   input: Record<string, unknown>;
   key: string;
   value: unknown;
};

type RecordPathItem = {
   type: 'record';
   input: Record<string | number | symbol, unknown>;
   key: string | number | symbol;
   value: unknown;
};

type TuplePathItem = {
   type: 'tuple';
   input: [unknown, ...unknown[]];
   key: number;
   value: unknown;
};

type MapPathItem = {
   type: 'map';
   input: Map<unknown, unknown>;
   key: unknown;
   value: unknown;
};

type SetPathItem = {
   type: 'set';
   input: Set<unknown>;
   key: number;
   value: unknown;
};

type ArrayPathItem = {
   type: 'array';
   input: unknown[];
   key: number;
   value: unknown;
};