import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '../contexts/AuthContext';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth 必须在 <AuthContextProvider> 内部使用！');
  }
  return context;
}

export default useAuth;
