type NotWrappable =
  | string
  | number
  | bigint
  | symbol
  | boolean
  | Function
  | null
  | undefined;

type CustomPartial<T> = T extends readonly unknown[]
  ? '0' extends keyof T ? { [K in Extract<keyof T, `${number}`>]?: T[K] }
  : { [x: number]: T[number] }
  : Partial<T>;

type StorePathRange = { from?: number; to?: number; by?: number };

type ArrayFilterFn<T> = (item: T, index: number) => boolean;

export type StoreSetter<T, E, M, U extends PropertyKey[] = []> =
  | ((value: T, event: E, meta: M, traversed: U) => T | CustomPartial<T> | void)
  | T
  | CustomPartial<T>;

export type Part<T, K extends KeyOf<T> = KeyOf<T>> = [K] extends [never] ? never // return never if key is never, else it'll return readonly never[] as well
  : 
    | K
    | readonly K[]
    | ([T] extends [readonly unknown[]] ? ArrayFilterFn<T[number]> | StorePathRange : never);

// shortcut to avoid writing `Exclude<T, NotWrappable>` too many times
export type W<T> = Exclude<T, NotWrappable>;

// specially handle keyof to avoid errors with arrays and any
export type KeyOf<T> = number extends keyof T // have to check this otherwise ts won't allow KeyOf<T> to index T
  ? 0 extends 1 & T // if it's any just return keyof T
    ? keyof T
  : [T] extends [readonly unknown[]] ? number // it's an array or tuple; exclude the non-number properties
  : [T] extends [never] ? never // keyof never is PropertyKey which number extends; return never
  : keyof T // it's something which contains an index signature for strings or numbers
  : keyof T;

export type Rest<T, E, M, U extends PropertyKey[]> =
  | [StoreSetter<T, E, M, U>]
  | (0 extends 1 & T ? [...Part<any>[], StoreSetter<any, E, M, PropertyKey[]>]
    : DistributeRest<W<T>, E, M, KeyOf<W<T>>, U>);

// need a second type to distribute `K`
type DistributeRest<T, E, M, K, U extends PropertyKey[]> = [T] extends [never] ? never
  : K extends KeyOf<T> ? [Part<T, K>, ...Rest<T[K], E, M, [K, ...U]>]
  : never;
