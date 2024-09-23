import { createContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';


export const AuthContext = createContext({
    signed: false,
    user: null,
    loading: true,
    Login: async () => {},
    Logout: () => {},
});

export const AuthProvider = ({ children }) => {
    const { getItem, setItem, removeItem } = useLocalStorage();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData() {
            const storageUser = getItem('user');
            const storageAccessToken = getItem('access');
            const storageRefreshToken = getItem('refresh');

            if (storageUser && storageAccessToken && storageRefreshToken) {
                setUser(JSON.parse(storageUser));
            }
            setLoading(false);
        }

        loadStorageData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const Login = async (user) => {
        try {
            const name = user.name ? user.name : '';
            const tokens = user.tokens;
            const {access, refresh} = tokens;
            const userData = jwtDecode(access.token) || {};
            userData['name'] = name;
            setUser(userData);
            setItem('access', access.token);
            setItem('refresh', refresh.token);
            setItem('user', JSON.stringify(userData));
        } catch (err) {
            return err;
        }
    };

    const Logout = () => {
        setTimeout(() => {
            removeItem('access');
            removeItem('refresh');
            removeItem('user');
            setUser(null);
        }, 1000);
    };

    const RemoveAuth = () => {
        removeItem('access');
        removeItem('refresh');
        removeItem('user');
        setUser(null);
    };

    return <AuthContext.Provider value={{ signed: !!user, user, loading, Login, Logout, RemoveAuth }}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
