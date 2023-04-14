import { createContext, useContext, useState } from 'react';

const BalanceContext = createContext();

export const useBalance = () => {
    return useContext(BalanceContext);
};

export const BalanceProvider = ({ children }) => {
    const [balance, setBalance] = useState(0);

    const updateBalance = (newBalance) => {
        setBalance(newBalance);
    };

    return (
        <BalanceContext.Provider value={{ balance, setBalance, updateBalance }}>
            {children}
        </BalanceContext.Provider>
    );
};