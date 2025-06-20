import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../Context/Auth";
import { useSelector } from "react-redux";

export const useGet = ({ url }) => {
    const auth = useAuth();
    const user = useSelector(state => state.userProject);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${auth?.userState?.token || ''}`,
                },
            });
            if (response.status === 200) {
                setData(response.data);
            }
        } catch (error) {
            console.error('errorGet', error);
        } finally {
            setLoading(false);
        }
    }, [url, auth?.userState?.token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { refetch: fetchData, loading, data };
};

