import axios from "axios";
import { useState } from "react";
import { useAuth } from "../Context/Auth";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';

export const usePost = ({ url, login = false, type = false }) => {
  const auth = useAuth();
  const user = useSelector(state => state.userProject); // Assuming this is used elsewhere if not directly in postData
  const [loadingPost, setLoadingPost] = useState(false);
  const [response, setResponse] = useState(null); // This will hold the raw axios response
  const { t} = useTranslation();

  const postData = async (data, name) => {
    setLoadingPost(true);
    setResponse(null); // Clear previous response
    let result = { success: false, message: t("An unknown error occurred") }; // Default failure result

    try {
      const token = auth?.userState?.token || '';
      const contentType = type ? 'application/json' : 'multipart/form-data';
      const config = !login && token
        ? {
            headers: {
              'Content-Type': contentType,
              'Authorization': `Bearer ${token || ''}`,
            },
          }
        : {
            headers: { 'Content-Type': contentType },
          };

      const axiosResponse = await axios.post(url, data, config); // Renamed to axiosResponse to avoid conflict

      if (axiosResponse.status >= 200 && axiosResponse.status < 300) { // Check for 2xx status codes
        setResponse(axiosResponse); // Store the full axios response
        if (name) {
          auth.toastSuccess(name); // Display success toast if a name is provided
        }
        // Return a standardized success object
        result = {
          success: true,
          data: axiosResponse.data, // The actual data from the backend
          message: axiosResponse.data?.message || t("Operation successful") // Use backend message or default
        };
      } else {
        // This block might be less likely to hit if axios throws for non-2xx,
        // but good for explicit handling if it doesn't always throw.
        const errorMessage = axiosResponse.data?.message || axiosResponse.statusText || t("Failed to add customers");
        auth.toastError(errorMessage);
        result = {
          success: false,
          data: axiosResponse.data,
          message: errorMessage
        };
      }
    } catch (error) {
      console.error('Error post JSON:', error);
      // Handle Axios errors (e.g., network issues, 4xx/5xx responses)
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const responseData = error.response.data;
        if (responseData?.errors) {
          if (typeof responseData.errors === 'object') {
            Object.entries(responseData.errors).forEach(([field, messages]) => {
              if (Array.isArray(messages)) {
                messages.forEach(message => {
                  auth.toastError(message);
                });
              } else {
                auth.toastError(messages);
              }
            });
          } else {
            auth.toastError(responseData.errors);
          }
        } else if (responseData?.message) {
          auth.toastError(responseData.message);
        } else {
          auth.toastError(responseData.message);
        }
        result = {
          success: false,
          data: responseData,
          message: responseData.message || t("Failed to add customers")
        };
      } else if (error.request) {
        // The request was made but no response was received
        auth.toastError(t("No response from server. Please check your network."));
        result = { success: false, message: t("Network error") };
      } else {
        // Something happened in setting up the request that triggered an Error
        auth.toastError(error.message || t("An unknown error occurred"));
        result = { success: false, message: error.message || t("An unknown error occurred") };
      }
    } finally {
      setLoadingPost(false);
    }
    return result; // Always return the result object
  };

  return { postData, loadingPost, response };
};