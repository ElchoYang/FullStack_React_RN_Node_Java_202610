import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthContextProvider } from './contexts/AuthContextProvider';
import { ErrorBoundary } from './components/boundary/ErrorBoundary';

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
