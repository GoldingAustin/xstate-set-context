import { ActorRef, createMachine, interpret, send, sendParent, spawn } from 'xstate';
import { setContext } from '../src/set-context';

describe('Update Objects', () => {
  it('update a primitive value', () => {
    const countMachine = createMachine<{ count: number }>({
      initial: 'start',
      context: {
        count: 0,
      },
      states: {
        start: {
          entry: 'increment',
        },
      },
    }, {
      actions: {
        increment: setContext('count', 3),
      },
    });
    const state = countMachine.transition(countMachine.initialState, 'start');
    expect(state.context.count).toEqual(3);
  });

  it('update a nested primitive value', () => {
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
          entry: 'increment',
        },
      },
    }, {
      actions: {
        increment: setContext('sleep', 'count', 'sheep', 3),
      },
    });
    const state = sleepMachine.transition(sleepMachine.initialState, 'start');
    expect(state.context.sleep.count.sheep).toEqual(3);
  });

  it('update a nested primitive value with function', () => {
    const sleepMachine = createMachine<{ sleep: { count: { sheep: number } } }>({
      initial: 'start',
      context: {
        sleep: {
          count: {
            sheep: 3,
          },
        },
      },
      states: {
        start: {
          entry: 'increment',
        },
      },
    }, {
      actions: {
        increment: setContext('sleep', 'count', 'sheep', (value) => value + 3),
      },
    });
    const state = sleepMachine.transition(sleepMachine.initialState, 'start');
    expect(state.context.sleep.count.sheep).toEqual(6);
  });

  it('update a nested boolean with a function', () => {
    const sleepMachine = createMachine<{ sleep: { isSleeping: boolean } }>({
      initial: 'start',
      context: {
        sleep: {
          isSleeping: false,
        },
      },
      states: {
        start: {
          entry: 'fall asleep',
        },
      },
    }, {
      actions: {
        'fall asleep': setContext('sleep', 'isSleeping', (value) => !value),
      },
    });
    const state = sleepMachine.transition(sleepMachine.initialState, 'start');
    expect(state.context.sleep.isSleeping).toEqual(true);
  });

  it('update an array', () => {
    const todoMachine = createMachine<{ todos: { task: string; completed: boolean }[] }>({
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
        'sleep': setContext('todos', (todos) => [...todos, { task: 'Sleep', completed: false }]),
      },
    });
    const state = todoMachine.transition(todoMachine.initialState, 'start');
    expect(state.context.todos.length).toEqual(4);
    expect(state.context.todos[3].task).toEqual('Sleep');
  });

  it('update multiple items in an array', () => {
    const todoMachine = createMachine<{ todos: { task: string; completed: boolean }[] }>({
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
          entry: 'mark done',
        },
      },
    }, {
      actions: {
        'mark done': setContext('todos', (todo) => !todo.completed, 'completed', true),
      },
    });
    const state = todoMachine.transition(todoMachine.initialState, 'start');
    expect(state.context.todos.length).toEqual(3);
    expect(state.context.todos.every(todo => todo.completed)).toEqual(true);
  });

  it('update range of items in an array', () => {
    const todoMachine = createMachine<{ todos: { task: string; completed: boolean }[] }>({
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
          entry: 'mark done',
        },
      },
    }, {
      actions: {
        'mark done': setContext('todos', [0, 1], 'completed', true),
      },
    });
    const state = todoMachine.transition(todoMachine.initialState, 'start');
    expect(state.context.todos.length).toEqual(3);
    expect(state.context.todos.filter(todo => todo.completed).length).toEqual(2);
  });

  it('Add an item with event data', () => {
    const todoMachine = createMachine<
      { todos: { task: string; completed: boolean }[] },
      { type: 'add'; name: string }
    >({
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
          on: {
            add: {
              actions: 'add',
            },
          },
        },
      },
    }, {
      actions: {
        'add': setContext('todos', (todos, event) => [...todos, { task: event.name, completed: false }]),
      },
    });
    const state = todoMachine.transition(todoMachine.initialState, { type: 'add', name: 'go to sleep' });
    expect(state.context.todos.length).toEqual(4);
    expect(state.context.todos[3]).toEqual({ task: 'go to sleep', completed: false });
  });

  it('Reset action', () => {
    const nameMachine = createMachine({
      initial: 'start',
      schema: {} as {
        context: { first: string; last: string; father?: {first: string; last: string; } };
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
            'set father': {
              actions: 'set father',
            },
          },
        },
      },
    }, {
      actions: {
        'set name': setContext((_, event) =>
          event.type === 'set name' ? ({ first: event.first, last: event.last }) : undefined
        ),
        'set father': setContext('father', (_, event) =>
            event.type === 'set father' ? ({ first: event.first, last: event.last }) : undefined
        ),
        'reset name': setContext({ first: '', last: '' }),
      },
    });
    const state = nameMachine.transition(nameMachine.initialState, {
      type: 'set name',
      first: 'Luke',
      last: 'Skywalker',
    });
    expect(state.context).toEqual({ first: 'Luke', last: 'Skywalker', father: undefined });
    const state2 = nameMachine.transition(state, { type: 'reset name' });
    expect(state2.context).toEqual({ first: '', last: '', father: undefined });

    const state3 = nameMachine.transition(state2, { type: 'set father', first: 'Anakin', last: "Skywalker"  });
    expect(state3.context).toEqual({ first: '', last: '', father: {first: 'Anakin', last: "Skywalker"} });
  });

  it('spawn actor', (done) => {
    const remoteMachine = createMachine({
      id: 'remote',
      initial: 'offline',
      states: {
        offline: {
          on: {
            WAKE: 'online',
          },
        },
        online: {
          after: {
            1000: {
              actions: sendParent('REMOTE.ONLINE'),
            },
          },
        },
      },
    });

    const parentMachine = createMachine<{ localOne: null | ActorRef<typeof remoteMachine> }>({
      id: 'parent',
      initial: 'waiting',
      context: {
        localOne: null,
      },
      states: {
        waiting: {
          entry: setContext('localOne', () => spawn(remoteMachine)),
          on: {
            'LOCAL.WAKE': {
              actions: send({ type: 'WAKE' }, { to: (context) => context.localOne! }),
            },
            'REMOTE.ONLINE': { target: 'connected' },
          },
        },
        connected: {},
      },
    });

    const parentService = interpret(parentMachine).start();

    parentService.send({ type: 'LOCAL.WAKE' });
    expect(parentService.state.context.localOne).toBeTruthy();
    setTimeout(() => {
      expect(parentService.state.value).toEqual('connected');
      done();
    }, 1000);
  });
});
