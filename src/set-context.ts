import { assign as xstateAssign } from 'xstate';
import type { AssignAction, AssignMeta, EventObject } from 'xstate';
import type { KeyOf, Part, Rest, StoreSetter, W } from './types';
import { updateContext } from './update-context';

/** Overloads  */
export function setContext<
  T,
  TEvent extends EventObject,
  K1 extends KeyOf<W<T>>,
  K2 extends KeyOf<W<W<T>[K1]>>,
  K3 extends KeyOf<W<W<W<T>[K1]>[K2]>>,
  K4 extends KeyOf<W<W<W<W<T>[K1]>[K2]>[K3]>>,
  K5 extends KeyOf<W<W<W<W<W<T>[K1]>[K2]>[K3]>[K4]>>,
  K6 extends KeyOf<W<W<W<W<W<W<T>[K1]>[K2]>[K3]>[K4]>[K5]>>,
  K7 extends KeyOf<W<W<W<W<W<W<W<T>[K1]>[K2]>[K3]>[K4]>[K5]>[K6]>>,
>(
  k1: Part<W<T>, K1>,
  k2: Part<W<W<T>[K1]>, K2>,
  k3: Part<W<W<W<T>[K1]>[K2]>, K3>,
  k4: Part<W<W<W<W<T>[K1]>[K2]>[K3]>, K4>,
  k5: Part<W<W<W<W<W<T>[K1]>[K2]>[K3]>[K4]>, K5>,
  k6: Part<W<W<W<W<W<W<T>[K1]>[K2]>[K3]>[K4]>[K5]>, K6>,
  k7: Part<W<W<W<W<W<W<W<T>[K1]>[K2]>[K3]>[K4]>[K5]>[K6]>, K7>,
  ...rest: Rest<
    W<W<W<W<W<W<W<T>[K1]>[K2]>[K3]>[K4]>[K5]>[K6]>[K7],
    TEvent,
    AssignMeta<T, TEvent>,
    [K7, K6, K5, K4, K3, K2, K1]
  >
): AssignAction<T, TEvent>;
export function setContext<
  T,
  TEvent extends EventObject,
  K1 extends KeyOf<W<T>>,
  K2 extends KeyOf<W<W<T>[K1]>>,
  K3 extends KeyOf<W<W<W<T>[K1]>[K2]>>,
  K4 extends KeyOf<W<W<W<W<T>[K1]>[K2]>[K3]>>,
  K5 extends KeyOf<W<W<W<W<W<T>[K1]>[K2]>[K3]>[K4]>>,
  K6 extends KeyOf<W<W<W<W<W<W<T>[K1]>[K2]>[K3]>[K4]>[K5]>>,
>(
  k1: Part<W<T>, K1>,
  k2: Part<W<W<T>[K1]>, K2>,
  k3: Part<W<W<W<T>[K1]>[K2]>, K3>,
  k4: Part<W<W<W<W<T>[K1]>[K2]>[K3]>, K4>,
  k5: Part<W<W<W<W<W<T>[K1]>[K2]>[K3]>[K4]>, K5>,
  k6: Part<W<W<W<W<W<W<T>[K1]>[K2]>[K3]>[K4]>[K5]>, K6>,
  setter: StoreSetter<
    W<W<W<W<W<W<T>[K1]>[K2]>[K3]>[K4]>[K5]>[K6],
    TEvent,
    AssignMeta<T, TEvent>,
    [K6, K5, K4, K3, K2, K1]
  >,
): AssignAction<T, TEvent>;
export function setContext<
  T,
  TEvent extends EventObject,
  K1 extends KeyOf<W<T>>,
  K2 extends KeyOf<W<W<T>[K1]>>,
  K3 extends KeyOf<W<W<W<T>[K1]>[K2]>>,
  K4 extends KeyOf<W<W<W<W<T>[K1]>[K2]>[K3]>>,
  K5 extends KeyOf<W<W<W<W<W<T>[K1]>[K2]>[K3]>[K4]>>,
>(
  k1: Part<W<T>, K1>,
  k2: Part<W<W<T>[K1]>, K2>,
  k3: Part<W<W<W<T>[K1]>[K2]>, K3>,
  k4: Part<W<W<W<W<T>[K1]>[K2]>[K3]>, K4>,
  k5: Part<W<W<W<W<W<T>[K1]>[K2]>[K3]>[K4]>, K5>,
  setter: StoreSetter<W<W<W<W<W<T>[K1]>[K2]>[K3]>[K4]>[K5], TEvent, AssignMeta<T, TEvent>, [K5, K4, K3, K2, K1]>,
): AssignAction<T, TEvent>;
export function setContext<
  T,
  TEvent extends EventObject,
  K1 extends KeyOf<W<T>>,
  K2 extends KeyOf<W<W<T>[K1]>>,
  K3 extends KeyOf<W<W<W<T>[K1]>[K2]>>,
  K4 extends KeyOf<W<W<W<W<T>[K1]>[K2]>[K3]>>,
>(
  k1: Part<W<T>, K1>,
  k2: Part<W<W<T>[K1]>, K2>,
  k3: Part<W<W<W<T>[K1]>[K2]>, K3>,
  k4: Part<W<W<W<W<T>[K1]>[K2]>[K3]>, K4>,
  setter: StoreSetter<W<W<W<W<T>[K1]>[K2]>[K3]>[K4], TEvent, AssignMeta<T, TEvent>, [K4, K3, K2, K1]>,
): AssignAction<T, TEvent>;
export function setContext<
  T,
  TEvent extends EventObject,
  K1 extends KeyOf<W<T>>,
  K2 extends KeyOf<W<W<T>[K1]>>,
  K3 extends KeyOf<W<W<W<T>[K1]>[K2]>>,
>(
  k1: Part<W<T>, K1>,
  k2: Part<W<W<T>[K1]>, K2>,
  k3: Part<W<W<W<T>[K1]>[K2]>, K3>,
  setter: StoreSetter<W<W<W<T>[K1]>[K2]>[K3], TEvent, AssignMeta<T, TEvent>, [K3, K2, K1]>,
): AssignAction<T, TEvent>;
export function setContext<
  T,
  TEvent extends EventObject,
  K1 extends KeyOf<W<T>>,
  K2 extends KeyOf<W<W<T>[K1]>>,
>(
  k1: Part<W<T>, K1>,
  k2: Part<W<W<T>[K1]>, K2>,
  setter: StoreSetter<W<W<T>[K1]>[K2], TEvent, AssignMeta<T, TEvent>, [K2, K1]>,
): AssignAction<T, TEvent>;
export function setContext<
  T,
  TEvent extends EventObject,
  K1 extends KeyOf<W<T>>,
>(k1: Part<W<T>, K1>, setter: StoreSetter<W<T>[K1], TEvent, AssignMeta<T, TEvent>, [K1]>): AssignAction<T, TEvent>;
export function setContext<
  T,
  TEvent extends EventObject,
>(setter: StoreSetter<T, TEvent, AssignMeta<T, TEvent>, []>): AssignAction<T, TEvent>;

/** Set context action */
export function setContext<TContext, TEvent extends EventObject = EventObject>(
  ...args: any[]
): AssignAction<TContext, TEvent> {
  return xstateAssign((context, event, meta) => {
    return updateContext(context, event, meta, args);
  });
}
