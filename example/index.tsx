import { useReducer } from 'react';
import { createRoot } from 'react-dom/client';

import { createGetStateFunction, createSelectorHook } from '../src/react-create-state-selector';

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
  const [state, dispatch] = useReducer(reducer, { count: 0, str: 'none' });

  const useSelector = createSelectorHook(state);

  const getState = createGetStateFunction(state);

  return {
    useSelector,
    dispatch,
    getState,
  };
}

export const CounterDisplay = () => {
  const { useSelector, dispatch, getState } = useCounter();

  const count = useSelector((s) => {
    return { count: s.count };
  });
  const doubleCount = useSelector((s) => s.count * 2);
  const str = useSelector((s) => s.str);

  return (
    <div>
      <div>x1: {JSON.stringify(count)}</div>
      <div>x2: {doubleCount}</div>
      <div>str: {str}</div>
      <button onClick={() => dispatch({ type: 'count' })}>count = count + 1</button>
      <button onClick={() => dispatch({ type: 'str' })}>str = Math.random</button>
      <button onClick={() => alert(JSON.stringify(getState(), null, 2))}>get state</button>
    </div>
  );
};

function App() {
  return <CounterDisplay />;
}

const root = createRoot(document.getElementById('root')!); // createRoot(container!) if you use TypeScript

root.render(<App />);
