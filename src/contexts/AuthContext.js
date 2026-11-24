import { createContext, useEffect, useState } from 'react';

import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '../services/firebase';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
            setUser(authenticatedUser);

            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
