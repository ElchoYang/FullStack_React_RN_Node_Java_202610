import { RouterProvider } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContextProvider';
import { ErrorBoundary } from './components/boundary/ErrorBoundary';
import { router } from './router';

export function App() {
  return (
    <ErrorBoundary>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </ErrorBoundary>
  );
}

export default App;
