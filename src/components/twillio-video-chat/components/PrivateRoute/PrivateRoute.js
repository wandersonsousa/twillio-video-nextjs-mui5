import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAppState } from '../../state';

export default function PrivateRoute({ children, ...rest }) {
  const { isAuthReady, user } = useAppState();

  const renderChildren = user || !process.env.NEXT_PUBLIC_APP_SET_AUTH;

  if (!renderChildren && !isAuthReady) {
    return null;
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        renderChildren ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
