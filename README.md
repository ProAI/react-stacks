# 📥 React Stacks

Component based stack system for positioning alerts, notifications, toasts and more.

## Problem

UI frameworks often offer components like alerts or toasts, but mostly these frameworks are not responsible for positioning them.

## Solution

`react-stacks` lets you define stacks on custom positions. Then you can use the `useStack()` hook to push a React.js component to the stack, which might be an alert or a toast. If you push multiple components these components will be stacked.

## Installation

```shell
npm install react-stacks
# or
yarn add react-stacks
```

## Example

Define the stacks in your main application component:

```jsx
import React from 'react';
import { Provider } from 'react-stacks';

const stacks = {
  main: ({ children }) => (
    <div style={{ position: 'fixed', top: 0 }}>{children}</div>
  ),
  bottom: ({ children }) => (
    <div style={{ position: 'fixed', bottom: 0, right: 0 }}>{children}</div>
  ),
};

function App() {
  return (
    <Provider stacks={stacks} autoDismiss={5000}>
      test
    </Provider>
  );
}
```

Use a defined stack in a child component:

```jsx
import React from 'react';
import { useStack } from 'react-stacks';

function Child() {
  const stack = useStack('main');

  return (
    <React.Fragment>
      <button
        onClick={() => {
          stack.push(<div>Error!</div>);
        }}
      >
        Test A
      </button>
      <button
        onClick={() => {
          stack.push(<div>Success!</div>, { autoDismiss: 3000 });
        }}
      >
        Test B
      </button>
    </React.Fragment>
  );
}
```

`autoDismiss` can be either set as a prop of `<Provider />` component for all stacks or as an option of the push method for an individual item. If `autoDismiss` is set to `0`, there will be no auto dismiss.

## License

This package is released under the [MIT License](LICENSE).
