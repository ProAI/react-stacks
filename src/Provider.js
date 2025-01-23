import React, { useRef, useState, useMemo, useCallback } from 'react';
import StacksContext from './StacksContext';
import Timer from './Timer';

// eslint-disable-next-line react/prop-types
function Provider({ autoDismiss, stacks: stacksConfig, children }) {
  const incrementalId = useRef(0);

  const initialState = useMemo(() => {
    const state = {};

    Object.keys(stacksConfig).forEach((name) => {
      state[name] = {};
    });

    return state;
  }, []);

  const [stacks, setStacks] = useState(initialState);

  const destroy = useCallback((name, id) => {
    setStacks((prevStacks) => {
      const stack = { ...prevStacks[name] };
      const item = stack[id];

      if (item.timer) {
        item.timer.clear();
      }

      delete stack[id];

      return {
        ...prevStacks,
        [name]: stack,
      };
    });
  }, []);

  const context = useMemo(
    () => ({
      push: (name, component, config) => {
        if (!stacks[name]) {
          throw new Error(`Unknown stack "${name}"`);
        }

        setStacks((prevStacks) => {
          const stack = { ...prevStacks[name] };
          const item = { component, config };

          // increment identifier
          incrementalId.current += 1;

          const id = incrementalId.current;

          stack[id] = item;

          if (autoDismiss) {
            stack[id].timer = new Timer(() => {
              destroy(name, id);
            }, autoDismiss);
          }

          return {
            ...prevStacks,
            [name]: stack,
          };
        });
      },
    }),
    [],
  );

  return (
    <>
      {Object.keys(stacks).map((name) => {
        const Stacks = stacksConfig[name];

        return (
          <Stacks key={`stacks-${name}`}>
            {Object.entries(stacks[name]).map(([key, item]) => {
              const Item = item.component;

              return (
                <Item
                  {...item.config}
                  dismiss={() => destroy(name, key)}
                  pauseTimeout={() => {
                    if (item.timer) {
                      item.timer.pause();
                    }
                  }}
                  resumeTimeout={() => {
                    if (item.timer) {
                      item.timer.resume();
                    }
                  }}
                  key={`stacks-${name}-${key}`}
                />
              );
            })}
          </Stacks>
        );
      })}
      <StacksContext.Provider value={context}>
        {children}
      </StacksContext.Provider>
    </>
  );
}

export default Provider;
