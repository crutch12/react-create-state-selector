# react-create-state-selector
Generate useSeletector hook for any react state (useState/useReducer/etc...)

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

  // @NOTE: Memoized until selector(state) returned value change
  const count = useSelector(state => state.count);

  return <div>
    <button onClick={() => setState(state => state.count + 1)}>
      {count}
    </button>
  </div>
}
```
