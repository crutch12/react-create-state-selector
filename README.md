# react-create-state-selector

[![npm version](https://badge.fury.io/js/react-create-state-selector.svg)](https://badge.fury.io/js/react-create-state-selector)

1) Generate `useSeletector` hook for any react state (`useState`/`useReducer`/etc...)
2) Generate `getState` function for any react state

## Install

```shell
npm install --save react-create-state-selector
```

## Example

```typescript jsx
import React from 'react';
import { render } from 'react-dom';

import { createSelectorHook } from 'react-create-state-selector';

const reducer = (state: { count: number; str: string }, action: { type: 'count' | 'str' }) => {
  if (action.type === 'count') {
    return { ...state, count: state.count + 1 };
  }
  if (action.type === 'str') {
    return { ...state, str: '' + Math.random() };
  }
  return state;
};

function useCounter() {
  let [state, dispatch] = React.useReducer(reducer, { count: 0, str: 'none' });

  const useSelector = createSelectorHook(state);

  return {
    useSelector,
    dispatch,
  };
}

export const CounterDisplay = () => {
  const { useSelector, dispatch } = useCounter();

  const count = useSelector((s) => {
    return { count: s.count };
  });
  const doubleCount = useSelector((s) => s.count * 2);
  const str = useSelector((s) => s.str);

  return (
    <div>
      <div>objectCount: {JSON.stringify(count)}</div>
      <div>count x2: {doubleCount}</div>
      <div>str: {str}</div>
      <button onClick={() => dispatch({ type: 'count' })}>count = count + 1</button>
      <button onClick={() => dispatch({ type: 'str' })}>str = Math.random</button>
    </div>
  );
};

function App() {
  return <CounterDisplay />;
}

render(<App />, document.getElementById('root'));
```

## API

### `createSelectorHook(state, isEqualFn?)`

Allows you to generate `useSelector` hook function, so you won't need to pass the `state` and could subscribe only for selected part of state.

[Just like react-redux useSelector()](https://react-redux.js.org/api/hooks#useselector)

```typescript jsx
import { createSelectorHook } from 'react-create-state-selector'

function useCustomHook() {
  const [state, setState] = React.useState({ count: 0 }); // or use useReducer

  const useSelector = createSelectorHook(state);

  // @NOTE: You may pass this as context value and use as store
  // see: https://github.com/jamiebuilds/unstated-next
  return { useSelector, setState }
}

function Component() {
  const { useSelector, setState } = useCustomHook();

  // @NOTE: Memoized until selector(state) returned value has changed
  const count = useSelector(state => state.count);

  return <div>
    <button onClick={() => setState(state => ({ count: state.count + 1 }))}>
      {count}
    </button>
  </div>
}
```

**Caveats (!)**

Function `createSelectorHook` uses [deepEqual comparison](https://github.com/planttheidea/fast-equals#deepequal) by default. So if you want to use another comparison method (e.g. [react-redux shallowEqual](https://react-redux.js.org/api/hooks#equality-comparisons-and-updates)), then you should pass it as second argument to `createSelectorHook`.

### `createGetStateFunction(state)`

Allows you to generate `getState` function, so you won't need to pass the `state` outside directly and could get previous state before calling your dispatch function.

[Just like Redux getState()](https://redux.js.org/api/store#getstate)

```typescript jsx
import { createGetStateFunction } from 'react-create-state-selector'

const reducer = (state: { count: number; }, action: { type: 'count' }) => {
  if (action.type === 'count') {
    return { ...state, count: action.payload };
  }
  return state;
};

function useCustomHook() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  const getState = createGetStateFunction(state);

  // @NOTE: You may pass this as context value and use as store
  // see: https://github.com/jamiebuilds/unstated-next
  return { getState, dispatch }
}

function Component() {
  const { getState, dispatch } = useCustomHook();

  const doWithState = (callback: (state: ReturnType<typeof getState>) => any) => {
    const state = getState();
    return callback(state);
  }

  return <div>
    <button onClick={() => alert(JSON.stringify(getState(), null, 2))}>
      show current state
    </button>
    <button onClick={() => doWithState(state => dispatch({ type: 'count', payload: state.count + 1 }))}>
      add +1 to state.count using current state
    </button>
  </div>
}
```
