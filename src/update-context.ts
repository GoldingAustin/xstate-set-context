import type {AssignMeta, EventObject} from 'xstate';

function setContextPaths(context: object, value: any, traversed: PropertyKey[] = []) {
  const setNestedKey = (property: any, key: PropertyKey, i: number) => {
    if (key === undefined) return value;
    if (typeof property[key] === 'object' && i !== traversed.length - 1) {
      if (Array.isArray(property[key])) property[key] = setNestedKey([...property[key]], traversed[i + 1], i + 1);
      else property[key] = setNestedKey({ ...property[key] }, traversed[i + 1], i + 1);
    } else {
      if (typeof property === 'object' && !Array.isArray(property)) property = { ...property, [key]: value };
      else property[key] = value;
    }
    return property;
  };

  if (!traversed.length) return value;
  return setNestedKey(Array.isArray(context) ? [...context] : { ...context }, traversed[0], 0);
}

export function updateContext(context: any, event: EventObject, meta: AssignMeta<any, any>, path: any[]) {
  function traverseContextPaths(current: any, path: any[], traversed: PropertyKey[] = []) {
    let part = undefined;
    let prev = current;

    if (path.length > 1) {
      part = path.shift();
      const partType = typeof part;
      const isArray = Array.isArray(current);
      if (Array.isArray(part)) {
        // Ex. update('data', [2, 23], 'label', l => l + ' !!!');
        for (let i = 0; i < part.length; i++) traverseContextPaths(current, [part[i]].concat(path), traversed);
        return;
      } else if (isArray && partType === 'function') {
        // Ex. update('data', i => i.id === 42, 'label', l => l + ' !!!');
        for (let i = 0; i < current.length; i++) {
          if (part(prev, event, meta, i)) traverseContextPaths(current, [i].concat(path), traversed);
        }
        return;
      } else if (isArray && partType === 'object') {
        // Ex. update('data', { from: 3, to: 12, by: 2 }, 'label', l => l + ' !!!');
        const { from = 0, to = current.length - 1, by = 1 } = part;
        for (let i = from; i <= to; i += by) traverseContextPaths(current, [i].concat(path), traversed);
        return;
      } else if (path.length > 1) {
        traverseContextPaths(current[part], path, [part].concat(traversed));
        return;
      }
      prev = current[part];
      traversed = [part].concat(traversed);
    }
    let value = path[0];

    if (typeof value === 'function') {
      value = value(prev, event, meta, traversed);
      if (value === prev) return;
    }

    if (part === undefined && value == undefined) return;
    else context = setContextPaths(context, value, traversed.reverse());
  }

  traverseContextPaths(context, path);
  return context;
}
