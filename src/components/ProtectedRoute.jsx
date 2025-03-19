// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { ACCESS_TOKEN_KEY } from "../constants";
import { useEffect, useState } from "react";

function ProtectedRoute({ children }) {
  // authState: null means "loading", then true (authenticated) or false.
  const [authState, setAuthState] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      // If no token, user is NOT authenticated
      if (!token) {
        if (isMounted) setAuthState(false);
        return;
      }
      // Otherwise, if a token is found, assume it's valid (for now).
      try {
        if (isMounted) setAuthState(true);
      } catch (err) {
        console.error("Auth error:", err);
        if (isMounted) setAuthState(false);
      }
    };
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  if (authState === null) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login.
  return authState ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
