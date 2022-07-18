import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

function renderWithRouter(ui: React.ReactElement, { route = '/', history = createMemoryHistory({ initialEntries: ['/'] }) } = {}) {
  return {
    ...rtlRender(
      <Router location={route} navigator={history}>
        {ui}
      </Router>
    ),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history,
  };
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { renderWithRouter };
