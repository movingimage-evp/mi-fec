import App from './App';
import { render as rtlRender } from '@testing-library/react';

test('renders App component', () => {
  rtlRender(<App />);
});
