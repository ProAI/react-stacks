import { useContext } from 'react';
import StacksContext from './StacksContext';

export default function useStack(name) {
  const context = useContext(StacksContext);

  return {
    push: (component) => context.push(name, component),
  };
}
