import React, { createContext, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { removeUser, setUser } from '../Store/CreateSlices';
import { useTranslation } from 'react-i18next';

// Create a context
const AuthContext = createContext(null);

export const authSelector = (state) => state.userProject || null;

export const ContextProvider = ({ children }) => {
  const [hideSidebar, setHideSidebar] = useState(() => {
    const savedState = localStorage.getItem('stateSidebar');
    return savedState ? JSON.parse(savedState) : true;
  });

  const dispatch = useDispatch();
  // userStore from Redux will now primarily be used for syncing,
  // but initial state comes from localStorage directly in this context.
  const userStore = useSelector(state => state.userProject);
  const { t } = useTranslation(); // Removed i18n as it's not directly used here

  // Initialize userState by trying to load from localStorage first
  const [userState, setUserState] = useState(() => {
    try {
      const storedUserData = localStorage.getItem('userData'); // Assuming you store user data here
      return storedUserData ? JSON.parse(storedUserData) : null;
    } catch (error) {
      console.error("Failed to parse user data from localStorage:", error);
      return null;
    }
  });

  // Effect to keep Redux state in sync with local userState
  useEffect(() => {
    if (userState) {
      // Only dispatch if Redux state is different to avoid infinite loops
      if (JSON.stringify(userStore) !== JSON.stringify(userState)) {
        dispatch(setUser(userState));
      }
    } else {
      // Only dispatch if Redux state is not null to avoid unnecessary dispatches
      if (userStore !== null) {
        dispatch(removeUser());
      }
    }
  }, [userState, userStore, dispatch]); // Added userStore to dependencies

  const login = (userData) => {
    setUserState(userData);
    localStorage.setItem('userData', JSON.stringify(userData)); // Save to localStorage on login
    toast.success(`${t("Welcome")} ${userData.name}`);
  };

  const logout = () => {
    setUserState(null);
    setHideSidebar(true);
    localStorage.removeItem('userData'); // Remove from localStorage on logout
    dispatch(removeUser());
  };

  const hideSide = (isHidden) => {
    setHideSidebar(isHidden);
    localStorage.setItem('stateSidebar', JSON.stringify(isHidden));
  };

  return (
    <AuthContext.Provider
      value={{
        userState, // This will now be correctly initialized from localStorage
        login,
        logout,
        toastSuccess: (text) => toast.success(text),
        toastError: (text) => toast.error(text),
        hideSide,
        hideSidebar,
        // You might want to add a loading state here if user data fetching is async
        // For now, userState being null indicates not logged in or loading
      }}
    >
      <ToastContainer />
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within a ContextProvider');
  }
  return context;
};