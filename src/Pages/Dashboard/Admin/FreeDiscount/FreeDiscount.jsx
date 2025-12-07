import React, { useState, useEffect } from 'react';
import { useGet } from '../../../../Hooks/useGet';
import { usePost } from '../../../../Hooks/usePostJson';
import { useTranslation } from 'react-i18next';
import { useAuth } from "../../../../Context/Auth";
import { StaticLoader } from "../../../../Components/Components";
import { 
  FaSave, 
  FaPlus, 
  FaTrashAlt, 
  FaEnvelope, 
  FaPercent, 
  FaShoppingCart, 
  FaClock 
} from 'react-icons/fa';

const FreeDiscount = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { t, i18n } = useTranslation();
    const auth = useAuth();

    // State for form data
    const [formData, setFormData] = useState({
        max_discount_order: '',
        max_discount_shift: '',
        emails: [{id: null, email: ''}, {id: null, email: ''}]
    });

    // State for additional emails
    const [additionalEmails, setAdditionalEmails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch current settings
    const { refetch: fetchSettings, loading: loadingGet, data: settingsData } = useGet({
        url: `${apiUrl}/admin/free_discount`,
    });

    // Post hook for saving
    const { postData: saveSettings, loadingPost: savingPost } = usePost({
        url: `${apiUrl}/admin/free_discount/create_update`,
    });

    // Load initial data
    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    // Process and set data when fetched
    useEffect(() => {
        if (settingsData) {
            const data = settingsData;
            
            console.log("Received data:", data); // For debugging
            
            // Check if emails exist and is an array
            const emailArray = data.emails || [];
            
            // Initialize with at least 2 email objects
            const initialEmails = [];
            if (emailArray.length > 0) {
                // Use existing emails
                initialEmails.push(...emailArray.slice(0, 2));
                
                // Fill remaining slots if less than 2
                while (initialEmails.length < 2) {
                    initialEmails.push({id: null, email: ''});
                }
            } else {
                // No emails yet, use empty objects
                initialEmails.push({id: null, email: ''}, {id: null, email: ''});
            }

            setFormData({
                max_discount_order: data.max_discount_order || '',
                max_discount_shift: data.max_discount_shift || '',
                emails: initialEmails
            });

            // If there are more than 2 emails, set additional ones
            if (emailArray.length > 2) {
                setAdditionalEmails(emailArray.slice(2));
            } else {
                setAdditionalEmails([]);
            }
            
            setIsLoading(false);
        }
    }, [settingsData]);

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle email input changes
    const handleEmailChange = (index, value) => {
        setFormData(prev => {
            const newEmails = [...prev.emails];
            // Preserve the id if it exists
            newEmails[index] = {
                ...newEmails[index],
                email: value
            };
            return { ...prev, emails: newEmails };
        });
    };

    // Handle additional email changes
    const handleAdditionalEmailChange = (index, value) => {
        setAdditionalEmails(prev => {
            const newEmails = [...prev];
            newEmails[index] = {
                ...newEmails[index],
                email: value
            };
            return newEmails;
        });
    };

    // Add new email field
    const addEmailField = () => {
        setAdditionalEmails(prev => [...prev, {id: null, email: ''}]);
    };

    // Remove email field
    const removeEmailField = (index) => {
        setAdditionalEmails(prev => prev.filter((_, i) => i !== index));
    };

    // Prepare form data for submission
    const prepareFormData = () => {
        const formDataToSend = new FormData();
        
        // Add numeric fields
        formDataToSend.append('max_discount_order', formData.max_discount_order);
        formDataToSend.append('max_discount_shift', formData.max_discount_shift);
        
        // Combine all email objects and filter empty ones
        const allEmailObjects = [...formData.emails, ...additionalEmails];
        
        // Add each non-empty email with proper key
        allEmailObjects.forEach((emailObj, index) => {
            if (emailObj.email && emailObj.email.trim() !== '') {
                formDataToSend.append(`emails[${index}]`, emailObj.email.trim());
            }
        });
        
        return formDataToSend;
    };

    // Alternative preparation if backend expects array of objects
    const prepareFormDataAlternative = () => {
        const formDataToSend = new FormData();
        
        // Add numeric fields
        formDataToSend.append('max_discount_order', formData.max_discount_order);
        formDataToSend.append('max_discount_shift', formData.max_discount_shift);
        
        // Combine all email objects and filter empty ones
        const allEmailObjects = [...formData.emails, ...additionalEmails];
        
        // Add each non-empty email
        allEmailObjects.forEach((emailObj, index) => {
            if (emailObj.email && emailObj.email.trim() !== '') {
                // If backend expects email objects with ids
                formDataToSend.append(`emails[${index}][email]`, emailObj.email.trim());
                if (emailObj.id) {
                    formDataToSend.append(`emails[${index}][id]`, emailObj.id);
                }
            }
        });
        
        return formDataToSend;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        // Try both formats if one doesn't work
        const formDataToSend = prepareFormData();
        
        try {
            await saveSettings(formDataToSend, t('settingsUpdatedSuccessfully'));
            fetchSettings(); // Refresh data after successful save
        } catch (error) {
            console.error('Error saving settings:', error);
            // If first method fails, try alternative
            try {
                const altFormData = prepareFormDataAlternative();
                await saveSettings(altFormData, t('settingsUpdatedSuccessfully'));
                fetchSettings();
            } catch (altError) {
                console.error('Alternative method also failed:', altError);
            }
        } finally {
            setIsSaving(false);
        }
    };

    // Loading state
    if (isLoading || loadingGet) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <StaticLoader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-32">
            <div className="container mx-auto px-2 py-4 md:px-4 md:py-6">
                {/* Header */}
                <div className="mb-4 md:mb-6">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                        {t('Free Discount')}
                    </h1>
                </div>

                {/* Settings Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg md:rounded-xl shadow p-3 md:p-4 lg:p-6">
                    {/* Max Discount Order */}
                    <div className="mb-4 md:mb-6 p-3 md:p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center mb-3 md:mb-4">
                            <FaShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-red-600" />
                            <h2 className="text-base md:text-lg font-semibold text-gray-900">
                                {t('Max Discount Per Order')}
                            </h2>
                        </div>
                        <div className="flex items-center">
                            <FaPercent className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-400 flex-shrink-0" />
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.max_discount_order}
                                onChange={(e) => handleInputChange('max_discount_order', e.target.value)}
                                className="w-full min-w-0 p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder={t('Enter Max Discount Amount')}
                            />
                        </div>
                    </div>

                    {/* Max Discount Shift */}
                    <div className="mb-4 md:mb-6 p-3 md:p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center mb-3 md:mb-4">
                            <FaClock className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-red-600" />
                            <h2 className="text-base md:text-lg font-semibold text-gray-900">
                                {t('Max Discount Per Shift')}
                            </h2>
                        </div>
                        <div className="flex items-center">
                            <FaPercent className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-400 flex-shrink-0" />
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.max_discount_shift}
                                onChange={(e) => handleInputChange('max_discount_shift', e.target.value)}
                                className="w-full min-w-0 p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder={t('Enter Max Discount Per Shift')}
                            />
                        </div>
                    </div>

                    {/* Email Notifications */}
                    <div className="mb-4 md:mb-6 p-3 md:p-4 border border-gray-200 rounded-lg">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 md:mb-4 gap-2">
                            <div className="flex items-center">
                                <FaEnvelope className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-red-600 flex-shrink-0" />
                                <h2 className="text-base md:text-lg font-semibold text-gray-900">
                                    {t('Notification Emails')}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={addEmailField}
                                className="flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 w-full sm:w-auto"
                            >
                                <FaPlus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                                {t('Add Email')}
                            </button>
                        </div>

                        {/* Required Email Fields */}
                        <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                            {formData.emails.map((emailObj, index) => (
                                <div key={`email-${index}-${emailObj.id || 'new'}`} className="flex items-center">
                                    <FaEnvelope className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-gray-400 flex-shrink-0" />
                                    <input
                                        type="email"
                                        value={emailObj.email}
                                        onChange={(e) => handleEmailChange(index, e.target.value)}
                                        className="w-full min-w-0 p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder={`${t('Email')} ${index + 1}`}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Additional Email Fields */}
                        {additionalEmails.length > 0 && (
                            <div className="space-y-3 md:space-y-4">
                                <h3 className="text-sm md:text-md font-medium text-gray-700">
                                    {t('Additional Emails')}
                                </h3>
                                {additionalEmails.map((emailObj, index) => (
                                    <div key={`additional-email-${index}-${emailObj.id || 'new'}`} className="flex items-center gap-2">
                                        <FaEnvelope className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0 hidden sm:block" />
                                        <div className="flex-1 flex items-center">
                                            <FaEnvelope className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0 mr-2 md:mr-3 sm:hidden" />
                                            <input
                                                type="email"
                                                value={emailObj.email}
                                                onChange={(e) => handleAdditionalEmailChange(index, e.target.value)}
                                                className="w-full min-w-0 p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                placeholder={`${t('Additional Email')} ${index + 1}`}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeEmailField(index)}
                                            className="p-2 md:p-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg flex-shrink-0"
                                            title={t('Remove Email')}
                                        >
                                            <FaTrashAlt className="w-4 h-4 md:w-5 md:h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4 md:pt-6 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={isSaving || savingPost}
                            className="flex items-center justify-center px-4 py-2 md:px-6 md:py-3 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
                        >
                            {isSaving || savingPost ? (
                                <>
                                    <StaticLoader size="small" className="mr-2" />
                                    <span className="ml-2">{t('saving')}</span>
                                </>
                            ) : (
                                <>
                                    <FaSave className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                                    {t('Save Settings')}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FreeDiscount;