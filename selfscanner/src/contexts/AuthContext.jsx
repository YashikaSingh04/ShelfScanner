import { createContext, useContext } from "react";
import { useAuth } from "react-oidc-context";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const auth = useAuth();

  const signOut = () => {
    const clientId  = process.env.REACT_APP_COGNITO_CLIENT_ID;
    const domain    = process.env.REACT_APP_COGNITO_DOMAIN;
    const logoutUri = process.env.REACT_APP_COGNITO_REDIRECT_URI;
    auth.removeUser();
    window.location.href = `${domain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  const value = {
    user:            auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading:       auth.isLoading,
    error:           auth.error,
    signIn:          () => auth.signinRedirect(),
    signOut,
    email:           auth.user?.profile?.email,
    name:            auth.user?.profile?.name || auth.user?.profile?.email?.split("@")[0],
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAppAuth() {
  return useContext(AuthContext);
}