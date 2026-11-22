import { createContext, useContext } from 'react';

export const ShellActionsContext = createContext({
  openAsk: () => {},
  closeAsk: () => {},
});

export function useShellActions() {
  return useContext(ShellActionsContext);
}

