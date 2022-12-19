import React from 'react';
import Button from '@mui/material/Button';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Board from './view/Board';
import { GameProvider } from './service/GameService';
import { UserProvider } from './service/UserService';
import UserPanel from './view/UserPanel';

function App() {

  const FlattenedProviderTree = (providers:any):React.ReactNode => {
    if (providers?.length === 1) {
      return providers[0][0];
    }
    const [A, paramsA] = providers.shift();
    const [B, paramsB] = providers.shift();

    return FlattenedProviderTree([
      [
        ({ children}:any) => (
          <A {...(paramsA || {})}>
            <B {...(paramsB || {})}>{children}</B>
          </A>
        ),
      ],
      ...providers,
    ]);
  }
  const Providers:any = FlattenedProviderTree([[DndProvider, { backend: HTML5Backend }], [GameProvider],[UserProvider]]);
  return (
      <Providers>
         <UserPanel/>
         <Board/>
      </Providers>

  );
}

export default App;
