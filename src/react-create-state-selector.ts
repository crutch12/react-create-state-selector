import { useRef, Dispatch, SetStateAction, useEffect, useCallback, useState } from 'react';
import { deepEqual } from 'fast-equals';

export type IsEqualFn<T = any> = (left: T, right: T) => boolean;

export function createSelectorHook<State = any>(state: State, isEqualFn: IsEqualFn = deepEqual) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const listeners = useRef(
    new Set<{
      selected: any;
      selector: (s: State) => any;
      setSelected: Dispatch<SetStateAction<any>>;
    }>(),
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    listeners.current.forEach((listener) => {
      const selected = listener.selector(state);

      if (!isEqualFn(selected, listener.selected)) {
        listener.selected = selected;
        listener.setSelected(selected);
      }
    });
  }, [state]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useCallback(<V = any>(selector: (s: State) => V) => {
    const [selected, setSelected] = useState(() => selector(state));

    useEffect(() => {
      const listener = { selector, selected, setSelected };
      listeners.current.add(listener);

      return () => {
        listeners.current.delete(listener);
      };
    }, []);

    return selected;
  }, []);
}
