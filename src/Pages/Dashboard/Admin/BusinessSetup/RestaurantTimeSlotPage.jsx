// import React, { useEffect, useState } from 'react';
// import { LoaderLogin, NumberInput, StaticButton, SubmitButton, TimeInput, TitleSection } from '../../../../Components/Components';
// import { useGet } from '../../../../Hooks/useGet';
// import { usePost } from '../../../../Hooks/usePostJson';
// import { MultiSelect } from 'primereact/multiselect';

// const RestaurantTimeSlotPage = ({ refetch }) => {
//     const apiUrl = import.meta.env.VITE_API_BASE_URL;
//     const [timeData, setTimeData] = useState({
//         from: '',
//         hours: ''
//     });
//     const { refetch: refetchTimeSlot, loading: loadingTime, data: dataSlot } = useGet({
//         url: `${apiUrl}/admin/settings/business_setup/time_slot`
//     });
//     const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/admin/settings/business_setup/time_slot/add` });


//     // const { refetch: refetchTimeSlot, loading: loadingTime, data: dataSlot } = useGet({url: `${apiUrl}/admin/settings/business_setup/time_slot`});
//     // const { postData:postCustom, loadingPost:loadingCustom, response:responseCustom } = usePost({ url: `${apiUrl}/admin/settings/business_setup/time_slot/add_custom` });
//     // const { postData:postTimeSlot, loadingPost:loadingTimeSlot, response:responseTimeSlot } = usePost({ url: `${apiUrl}/admin/settings/business_setup/time_slot/add_times` });

//     const [optionName, setOptionName] = useState('daily');
//     const [selectedDays, setSelectedDays] = useState([]);
//     const [days, setDays] = useState([]);

//     useEffect(() => {
//         refetchTimeSlot();
//     }, [refetchTimeSlot]);

// useEffect(() => {
//     if (dataSlot) {
//         // Transform days array of strings into array of objects
//         const formattedDays = dataSlot.days?.map(day => ({ name: day })) || [];
//         setDays(formattedDays);
        
//         // Set the default time data if available
//         if (dataSlot.resturant_time?.resturant_time) {
//             setTimeData({
//                 from: dataSlot.resturant_time.resturant_time.from,
//                 hours: dataSlot.resturant_time.resturant_time.hours
//             });
//         }

//         // Set the selected custom days if they exist
//         if (dataSlot.resturant_time?.custom?.length > 0) {
//             const customDays = dataSlot.resturant_time.custom.map(day => ({ name: day }));
//             setSelectedDays(customDays);
//             // If there are custom days, switch to customize mode
//             setOptionName('customize');
//         }
        
//         console.log("Formatted days:", formattedDays);
//         console.log("Restaurant time data:", {
//             openingTime: dataSlot.resturant_time?.resturant_time?.from,
//             workingHours: dataSlot.resturant_time?.resturant_time?.hours,
//             customDays: dataSlot.resturant_time?.custom || []
//         });
//     }
// }, [dataSlot]);

//     // Function to format time to HH:MM:SS
//     const formatTimeToHHMMSS = (time) => {
//         if (!time) return '';
//         // If time is in HH:MM format, append :00
//         if (/^\d{2}:\d{2}$/.test(time)) {
//             return `${time}:00`;
//         }
//         // If already in HH:MM:SS format, return as is
//         if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
//             return time;
//         }
//         // Handle other cases (invalid formats)
//         return time;
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // Format the time before sending
//         const formattedTime = formatTimeToHHMMSS(timeData.from);

//         let postDataObj;

//         if (optionName === 'daily') {
//             postDataObj = {
//                 resturant_time: {
//                     from: formattedTime,
//                     hours: timeData.hours
//                 }
//             };
//         } else {
//             postDataObj = {
//                 custom: selectedDays.map(day => day.name),
//                 resturant_time: {
//                     from: formattedTime,
//                     hours: timeData.hours
//                 }
//             };
//         }

//         console.log('Submitting Data:', postDataObj);
//         postData(postDataObj, 'Time Slot Added Successfully');
//     };

//     const handleReset = () => {
//         setTimeData({ from: '', hours: '' });
//         setOptionName('daily');
//         setSelectedDays([]);
//     };

//     return (
//         <>
//             {loadingTime || loadingPost ? (
//                 <div className="w-full h-56 flex justify-center items-center">
//                     <LoaderLogin />
//                 </div>
//             ) : (
//                 <form className="w-full flex sm:flex-col lg:flex-row flex-wrap items-start justify-start gap-4" onSubmit={handleSubmit}>
//                     <TitleSection text={'Restaurant Operating Hours'} />

//                     <div className="w-full flex gap-8 mt-4">
//                         <span
//                             className={`text-xl font-TextFontRegular cursor-pointer ${optionName === 'daily' ? 'text-mainColor' : 'text-thirdColor'}`}
//                             onClick={() => setOptionName('daily')}
//                         >
//                             Daily
//                         </span>
//                         <span
//                             className={`text-xl font-TextFontRegular cursor-pointer ${optionName === 'customize' ? 'text-mainColor' : 'text-thirdColor'}`}
//                             onClick={() => setOptionName('customize')}
//                         >
//                             Customize
//                         </span>
//                     </div>

//                     <div className="w-full flex flex-wrap items-center gap-8 mt-3">
//                         <div className="sm:w-full lg:w-[35%] flex sm:flex-col xl:flex-row items-center gap-2">
//                             <span className="w-9/12 text-xl text-thirdColor">Opening Time:</span>
//                             <TimeInput
//                                 value={timeData.from}
//                                 onChange={(e) => {
//                                     setTimeData({
//                                         ...timeData,
//                                         from: e.target.value
//                                     });
//                                 }}
//                             />
//                         </div>
//                         <div className="sm:w-full lg:w-[35%] flex sm:flex-col xl:flex-row items-center gap-2">
//                             <span className="w-9/12 text-xl text-thirdColor">Number Of Hours:</span>
//                             <NumberInput
//                                 value={timeData.hours}
//                                 onChange={(e) => {
//                                     setTimeData({
//                                         ...timeData,
//                                         hours: e.target.value
//                                     });
//                                 }}
//                                 placeholder={"Enter number of hours"}
//                             />
//                         </div>
//                     </div>

//                     {optionName === 'customize' && (
//                         <div className="sm:w-full lg:w-[60%] flex flex-col items-start gap-y-1 mt-3">
//                             <span className="text-xl text-thirdColor">Select Days:</span>
//                             <MultiSelect
//                                 value={selectedDays}
//                                 onChange={(e) => setSelectedDays(e.value)}
//                                 options={days}
//                                 optionLabel="name"
//                                 placeholder="Select Days"
//                                 filter
//                                 className="w-full"
//                             />
//                         </div>
//                     )}

//                     <div className="w-full flex items-center justify-end gap-x-4 mt-6">
//                         <StaticButton
//                             text={'Reset'}
//                             handleClick={handleReset}
//                             bgColor="bg-transparent"
//                             Color="text-mainColor"
//                             border="border-2"
//                             borderColor="border-mainColor"
//                             rounded="rounded-full"
//                         />
//                         <SubmitButton text={'Submit'} rounded="rounded-full" handleClick={handleSubmit} />
//                     </div>
//                 </form>
//             )}
//         </>
//     );
// };

// export default RestaurantTimeSlotPage;
import React, { useEffect, useState, useRef } from 'react';
import { LoaderLogin, NumberInput, StaticButton, SubmitButton, TimeInput, TitleSection } from '../../../../Components/Components';
import { useGet } from '../../../../Hooks/useGet';
import { usePost } from '../../../../Hooks/usePostJson';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useAuth } from '../../../../Context/Auth';
const RestaurantTimeSlotPage = ({ refetch }) => {
    const auth=useAuth();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const toast = useRef(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const [newTimeSlot, setNewTimeSlot] = useState({
        from: '',
        hours: '',
        branch_id: null
    });
    const [editingSlot, setEditingSlot] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedTime, setSelectedTime] = useState('');
    
    const { refetch: refetchTimeSlot, loading: loadingTime, data: dataSlot } = useGet({
        url: `${apiUrl}/admin/settings/business_setup/time_slot`
    });
    
    const { postData: postCustom, loadingPost: loadingCustom } = usePost({ 
        url: `${apiUrl}/admin/settings/business_setup/time_slot/add_custom` 
    });
    
    const { postData: postTimeSlot, loadingPost: loadingTimeSlot } = usePost({ 
        url: `${apiUrl}/admin/settings/business_setup/time_slot/add_times` 
    });
    
    const { postData: postUpdateTimeSlot, loadingPost: loadingUpdateTimeSlot } = usePost({
        url: `${apiUrl}/admin/settings/business_setup/time_slot/update_times/${selectedTime}`
    });

    const [optionName, setOptionName] = useState('daily');
    const [selectedDays, setSelectedDays] = useState([]);
    const [days, setDays] = useState([
        { name: 'Sunday' },
        { name: 'Monday' },
        { name: 'Tuesday' },
        { name: 'Wednesday' },
        { name: 'Thursday' },
        { name: 'Friday' },
        { name: 'Saturday' }
    ]);
    const [branches, setBranches] = useState([]);
    const [isSubmittingCustom, setIsSubmittingCustom] = useState(false);
    const [isSubmittingTimeSlots, setIsSubmittingTimeSlots] = useState(false);

    useEffect(() => {
        refetchTimeSlot();
    }, [refetchTimeSlot]);

    useEffect(() => {
        if (dataSlot) {
            setBranches(dataSlot.branches || []);
            
            if (dataSlot.days?.length > 0) {
                const customDays = dataSlot.days.map(day => ({ name: day }));
                setSelectedDays(customDays);
                setOptionName('customize');
            }

            if (dataSlot.time_setting?.length > 0) {
                const slotsWithBranches = dataSlot.time_setting.map(slot => ({
                    ...slot,
                    branch: dataSlot.branches?.find(b => b.id === slot.branch_id) || null
                }));
                setTimeSlots(slotsWithBranches);
            }
        }
    }, [dataSlot]);

      useEffect(() => {
        if(!loadingUpdateTimeSlot && !loadingTimeSlot && !loadingCustom){
            refetchTimeSlot();
            handleReset();
        }
    }, [loadingUpdateTimeSlot,loadingTimeSlot,loadingCustom]);

    const formatTimeToHHMMSS = (time) => {
        if (!time) return '';
        if (/^\d{2}:\d{2}$/.test(time)) return `${time}:00`;
        if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time;
        return time;
    };

    const validateTimeSlot = (slot) => {
        if (!slot.from) return 'Opening time is required';
        if (!slot.hours || isNaN(parseInt(slot.hours, 10))) return 'Valid number of hours is required';
        if (!slot.branch_id || isNaN(slot.branch_id)) return 'Branch selection is required';
        return null;
    };

    const handleAddTimeSlot = async () => {
        const error = validateTimeSlot(newTimeSlot);
        if (error) {
            auth.toastError('error', 'Validation Error', error);
            return;
        }

        const formattedTime = formatTimeToHHMMSS(newTimeSlot.from);
        const branch = branches.find(b => b.id === newTimeSlot.branch_id);
        const tempId = Date.now();

        const payload = {
            from: formattedTime,
            hours: parseInt(newTimeSlot.hours, 10),
            branch_id: parseInt(newTimeSlot.branch_id, 10)
        };

        console.log('Adding new slot with payload:', payload); // Debug: Log payload

            const response = await postTimeSlot(payload);
            console.log('Post response:', response); // Debug: Log response

            if (response?.id) {
                setTimeSlots([...timeSlots, {
                    ...newTimeSlot,
                    from: formattedTime,
                    branch,
                    id: response.id // Use server-generated ID
                }]);
                auth.toastSuccess('Time slot added and saved to server');
            } else {
                throw new Error('No ID returned from server');
            }
        setNewTimeSlot({ from: '', hours: '', branch_id: null });
    };

    const handleEditSlot = (slot) => {
        setEditingSlot({ ...slot });
        setSelectedTime(slot.id ? slot.id.toString() : slot.tempId.toString());
        setShowEditDialog(true);
    };

    const handleUpdateSlot = async () => {
        const error = validateTimeSlot(editingSlot);
        if (error) {
            auth.toastError('error', 'Validation Error', error);
            return;
        }
            const formattedTime = formatTimeToHHMMSS(editingSlot.from);
            const updatedSlot = {
                ...editingSlot,
                from: formattedTime,
                branch: branches.find(b => b.id === editingSlot.branch_id)
            };

            if (editingSlot.id && typeof editingSlot.id === 'number') {
                const response = await postUpdateTimeSlot({
                    from: formattedTime,
                    hours: parseInt(editingSlot.hours, 10),
                    branch_id: editingSlot.branch_id
                });

                if (response) {
                    setTimeSlots(timeSlots.map(slot => 
                        slot.id === editingSlot.id ? updatedSlot : slot
                    ));
                    auth.toastSuccess('Time slot updated successfully');
                }
            } 
            setShowEditDialog(false);
            setEditingSlot(null);
            setSelectedTime('');
    
    };

    const handleSubmitTimeSlots = async (e) => {
        e.preventDefault();
        if (timeSlots.length === 0) {
            auth.toastError('Please add at least one time slot');
            return;
        }

        setIsSubmittingTimeSlots(true);
            console.log('Time slots to submit:', timeSlots); // Debug: Log all slots
            const results = await Promise.allSettled(
                timeSlots
                    .filter(slot => !slot.id) // Only process slots without server ID (i.e., failed local adds)
                    .map(async (slot) => {
                        const error = validateTimeSlot(slot);
                        if (error) {
                            throw new Error(`Invalid slot: ${error}`);
                        }

                        const payload = {
                            from: formatTimeToHHMMSS(slot.from),
                            hours: parseInt(slot.hours, 10),
                            branch_id: parseInt(slot.branch_id, 10)
                        };

                        console.log('Submitting slot:', { payload, isUpdate: !!slot.id }); // Debug: Log payload

                        console.log('Adding new slot with tempId:', slot.tempId);
                        const response = await postTimeSlot(payload);
                        console.log('Add response:', response); // Debug: Log response
                        return { slot, response };
                    })
            );

            const updatedSlots = timeSlots.map((slot, index) => {
                if (slot.id) return slot; // Skip slots already posted
                const result = results.find((r, i) => timeSlots[i].tempId === slot.tempId);
                if (result?.status === 'fulfilled' && result.value.response?.id) {
                    const { response } = result.value;
                    console.log('Processing response for slot:', response); // Debug: Log response
                    return {
                        ...slot,
                        id: response.id,
                        tempId: undefined,
                        branch: branches.find(b => b.id === slot.branch_id) || slot.branch
                    };
                }
                console.error('Failed to process slot:', result?.reason); // Debug: Log error
                auth.toastError(`Failed to process slot: ${result?.reason?.message || 'Unknown error'}`);
                return slot;
            });

            console.log('Updated slots:', updatedSlots); // Debug: Log final slots
            setTimeSlots(updatedSlots);
    };

    const handleSubmitCustomDays = async (e) => {
        e.preventDefault();
        if (optionName !== 'customize' || selectedDays.length === 0) {
            auth.toastError('Please select at least one day in customize mode');
            return;
        }

        setIsSubmittingCustom(true);
        try {
            await postCustom({
                custom: selectedDays.map(day => day.name)
            });
             auth.toastSuccess('Custom days saved successfully');
            refetchTimeSlot();
        } catch (error) {
            console.error('Submit custom days error:', error);
             auth.toastError(`Failed to save custom days: ${error.message}`);
        } finally {
            setIsSubmittingCustom(false);
        }
    };

    const handleReset = () => {
        setTimeSlots([]);
        setNewTimeSlot({ from: '', hours: '', branch_id: null });
        setOptionName('daily');
        setSelectedDays([]);
        setSelectedTime('');
    };

    return (
        <>
            <Toast ref={toast} />
            {loadingTime || loadingTimeSlot || loadingCustom ? (
                <div className="w-full h-56 flex justify-center items-center">
                    <LoaderLogin />
                </div>
            ) : (
                <div className="w-full flex flex-col items-start gap-4">
                    <TitleSection text={'Restaurant Operating Hours'} />

                    <div className="w-full flex gap-8 mt-4">
                        <span
                            className={`text-xl font-TextFontRegular cursor-pointer ${optionName === 'daily' ? 'text-mainColor' : 'text-thirdColor'}`}
                            onClick={() => setOptionName('daily')}
                        >
                            Daily
                        </span>
                        <span
                            className={`text-xl font-TextFontRegular cursor-pointer ${optionName === 'customize' ? 'text-mainColor' : 'text-thirdColor'}`}
                            onClick={() => setOptionName('customize')}
                        >
                            Customize
                        </span>
                    </div>

                    {optionName === 'customize' && (
                        <div className="w-full flex flex-col items-start gap-y-1 mt-3">
                            <span className="text-xl text-thirdColor">Select Days:</span>
                            <MultiSelect
                                value={selectedDays}
                                onChange={(e) => setSelectedDays(e.value)}
                                options={days}
                                optionLabel="name"
                                placeholder="Select Days"
                                filter
                                className="w-full md:w-1/2"
                                disabled={isSubmittingCustom}
                            />
                            <div className="mt-4">
                                <SubmitButton 
                                    text={isSubmittingCustom ? 'Saving Days...' : 'Save Custom Days'} 
                                    rounded="rounded-full" 
                                    handleClick={handleSubmitCustomDays}
                                    disabled={isSubmittingCustom || loadingTimeSlot}
                                />
                            </div>
                        </div>
                    )}

                    <div className="w-full mt-6">
                        <h3 className="text-xl font-semibold mb-4">Time Slots</h3>
                        
                        {timeSlots.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">
                                No time slots configured yet
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                {timeSlots.map((slot, index) => (
                                    <div key={slot.id || slot.tempId} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold">{slot.branch?.name || 'Branch Not Selected'}</p>
                                                <p>From: {slot.from}</p>
                                                <p>Hours: {slot.hours}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleEditSlot(slot)}
                                                    className="text-red-500 hover:text-red-700"
                                                    disabled={isSubmittingTimeSlots || loadingTimeSlot}
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="w-full bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-lg font-medium mb-3">Add New Time Slot</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
                                    <Dropdown
                                        value={newTimeSlot.branch_id}
                                        options={branches.map(branch => ({
                                            label: branch.name,
                                            value: branch.id
                                        }))}
                                        onChange={(e) => setNewTimeSlot({
                                            ...newTimeSlot,
                                            branch_id: e.value
                                        })}
                                        placeholder="Select Branch"
                                        className="w-full"
                                        disabled={isSubmittingTimeSlots || loadingTimeSlot}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Opening Time *</label>
                                    <TimeInput
                                        value={newTimeSlot.from}
                                        onChange={(e) => setNewTimeSlot({
                                            ...newTimeSlot,
                                            from: e.target.value
                                        })}
                                        className="w-full"
                                        disabled={isSubmittingTimeSlots || loadingTimeSlot}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hours *</label>
                                    <NumberInput
                                        value={newTimeSlot.hours}
                                        onChange={(e) => setNewTimeSlot({
                                            ...newTimeSlot,
                                            hours: e.target.value
                                        })}
                                        placeholder="Enter number of hours"
                                        className="w-full"
                                        disabled={isSubmittingTimeSlots || loadingTimeSlot}
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddTimeSlot}
                                className="mt-4 px-4 py-2 bg-mainColor text-white rounded hover:bg-red-700 disabled:bg-gray-400"
                                disabled={isSubmittingTimeSlots || loadingTimeSlot}
                            >
                                {loadingTimeSlot ? 'Saving...' : 'Add Time Slot'}
                            </button>
                        </div>
                    </div>

                    <div className="w-full flex items-center justify-end gap-x-4 mt-6">
                        <StaticButton
                            text={'Reset'}
                            handleClick={handleReset}
                            bgColor="bg-transparent"
                            Color="text-mainColor"
                            border="border-2"
                            borderColor="border-mainColor"
                            rounded="rounded-full"
                            disabled={isSubmittingCustom || isSubmittingTimeSlots || loadingTimeSlot}
                        />
                        <SubmitButton 
                            text={isSubmittingTimeSlots ? 'Saving Time Slots...' : 'Save Time Slots'} 
                            rounded="rounded-full" 
                            handleClick={handleSubmitTimeSlots}
                            disabled={isSubmittingCustom || isSubmittingTimeSlots || loadingTimeSlot}
                        />
                    </div>

                    <Dialog 
                        visible={showEditDialog} 
                        onHide={() => !isSubmittingTimeSlots && setShowEditDialog(false)}
                        header="Edit Time Slot"
                        className="w-full md:w-1/2"
                    >
                        {editingSlot && (
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
                                    <Dropdown
                                        value={editingSlot.branch_id}
                                        options={branches.map(branch => ({
                                            label: branch.name,
                                            value: branch.id
                                        }))}
                                        onChange={(e) => setEditingSlot({
                                            ...editingSlot,
                                            branch_id: e.value
                                        })}
                                        className="w-full"
                                        disabled={isSubmittingTimeSlots || loadingTimeSlot}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Opening Time *</label>
                                    <TimeInput
                                        value={editingSlot.from}
                                        onChange={(e) => setEditingSlot({
                                            ...editingSlot,
                                            from: e.target.value
                                        })}
                                        className="w-full"
                                        disabled={isSubmittingTimeSlots || loadingTimeSlot}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hours *</label>
                                    <NumberInput
                                        value={editingSlot.hours}
                                        onChange={(e) => setEditingSlot({
                                            ...editingSlot,
                                            hours: e.target.value
                                        })}
                                        placeholder="Enter number of hours"
                                        className="w-full"
                                        disabled={isSubmittingTimeSlots || loadingTimeSlot}
                                    />
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEditDialog(false);
                                            setSelectedTime('');
                                        }}
                                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200"
                                        disabled={isSubmittingTimeSlots || loadingTimeSlot}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleUpdateSlot}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
                                        disabled={isSubmittingTimeSlots || loadingTimeSlot}
                                    >
                                        {isSubmittingTimeSlots || loadingTimeSlot ? 'Updating...' : 'Update'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </Dialog>
                </div>
            )}
        </>
    );
};

export default RestaurantTimeSlotPage;