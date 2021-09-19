import React, { useState } from 'react';
import PropTypes from 'prop-types';
import StacksContext from './StacksContext';
import Timer from './Timer';

const propTypes = {
  autoDismiss: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  stacks: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

let incrementalId = 0;

function Provider({ autoDismiss, stacks: stacksConfig, children }) {
  const initialState = {};
  Object.keys(stacksConfig).forEach((name) => {
    initialState[name] = {};
  });

  const [stacks, setStacks] = useState(initialState);

  const destroy = (name, id) => {
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
  };

  const push = (name, component, config) => {
    if (!stacks[name]) {
      throw new Error(`Unknown stack "${name}"`);
    }

    setStacks((prevStacks) => {
      const stack = { ...prevStacks[name] };
      const item = { component, config };

      // increment identifier
      incrementalId += 1;

      const id = incrementalId;

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
  };

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
      <StacksContext.Provider value={{ push }}>
        {children}
      </StacksContext.Provider>
    </>
  );
}

Provider.propTypes = propTypes;

export default Provider;
