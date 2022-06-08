# XState Set Context

A simple but powerful method to update context in XState. This library is modifier version of [store updates in SolidJS](https://www.solidjs.com/docs/latest/api#updating-stores).

[![NPM](https://nodei.co/npm/xstate-set-context.png)](https://www.npmjs.com/package/xstate-set-context)

Installation:
- yarn: ``` yarn add xstate-set-context ```
- npm: ``` npm i xstate-set-context ```
- yarn: ``` pnpm add xstate-set-context ```

Current size: [~764B](https://bundlephobia.com/package/xstate-set-context@1.0.1)

Required peer dependencies: [xstate](https://www.npmjs.com/package/xstate)

## Examples

Update patterns follow what's shown in the [SolidJS docs](https://www.solidjs.com/docs/latest/api#updating-stores)

Here are a few examples in machines (other examples can be found in the [test file](./test/set-context.test.ts):

#### Simple nested value
```typescript
    const sleepMachine = createMachine<{ sleep: { count: { sheep: number } } }>({
    initial: 'start',
    context: {
        sleep: {
            count: {
                sheep: 0,
            },
        },
    },
    states: {
        start: {
            entry: 'set value',
        },
    },
}, {
    actions: {
        // Set a nested value
        'set value': setContext('sleep', 'count', 'sheep', 3),
        // Update a value by accessing its current value
        'increment': setContext('sleep', 'count', 'sheep', (value) => value + 1),
    },
});
```

#### Array of objects
```typescript
    const todoMachine = createMachine<{ todos: { task: string; completed: boolean }[]; }>({
      initial: 'start',
      context: {
        todos: [
          { task: 'Finish work', completed: false },
          { task: 'Go grocery shopping', completed: false },
          { task: 'Make dinner', completed: false },
        ],
      },
      states: {
        start: {
          entry: 'sleep',
        },
      },
    }, {
      actions: {
          // Add an item to the todos array
        'sleep': setContext('todos', (todos) => [...todos, { task: 'Sleep', completed: false }]),
          // Mark the first two items in todos as complete
        'mark done': setContext('todos', [0, 1], 'completed', true),
          // Filters to only the not completed todos and marks them as completed
        'mark all not done as done': setContext('todos', (todo) => !todo.completed, 'completed', true)
      },
    });
```

#### Accessing event data
```typescript
    const nameMachine = createMachine({
      initial: 'start',
      schema: {} as {
        context: { first: string; last: string; father?: {first: string; last: string; }  };
        events: { type: 'set name'; first: string; last: string } | { type: 'set father'; first: string; last: string } | { type: 'reset name' };
      },
      context: {
        first: '',
        last: '',
        father: undefined
      },
      states: {
        start: {
          on: {
            'set name': {
              actions: 'set name',
            },
            'reset name': {
              actions: 'reset name',
            },
          },
        },
      },
    }, {
      actions: {
          // Access the event in the second argument and set the name
        'set name': setContext((_, event) => ({ first: event.first, last: event.last })),
          // Update a nested undefined value with an event
        'set father': setContext('father', (_, event) =>({ first: event.first, last: event.last })),
          // Simply provide a object to replace the context
        'reset name': setContext({ first: '', last: '' }),
      },
    });
```

