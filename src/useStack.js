import { useContext } from 'react';
import StacksContext from './StacksContext';

export default function useStack(name) {
  const { push } = useContext(StacksContext);

  return {
    push: (component, config) => push(name, component, config),
  };
}
