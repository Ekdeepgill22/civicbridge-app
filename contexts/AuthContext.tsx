import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  confirmation: any;
  setConfirmation: (confirmation: any) => void;
}

const AuthContext = createContext<AuthContextType>({
  confirmation: null,
  setConfirmation: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [confirmation, setConfirmation] = useState<any>(null);
  return (
    <AuthContext.Provider value={{ confirmation, setConfirmation }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
