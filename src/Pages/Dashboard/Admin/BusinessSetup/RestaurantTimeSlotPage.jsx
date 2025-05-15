import React, { useEffect, useState } from 'react';
import { LoaderLogin, NumberInput, StaticButton, SubmitButton, TimeInput, TitleSection } from '../../../../Components/Components';
import { useGet } from '../../../../Hooks/useGet';
import { usePost } from '../../../../Hooks/usePostJson';
import { MultiSelect } from 'primereact/multiselect';

const RestaurantTimeSlotPage = ({ refetch }) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [timeData, setTimeData] = useState({
        from: '',
        hours: ''
    });
    const { refetch: refetchTimeSlot, loading: loadingTime, data: dataSlot } = useGet({
        url: `${apiUrl}/admin/settings/business_setup/time_slot`
    });
    const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/admin/settings/business_setup/time_slot/add` });

    const [optionName, setOptionName] = useState('daily');
    const [selectedDays, setSelectedDays] = useState([]);
    const [days, setDays] = useState([]);

    useEffect(() => {
        refetchTimeSlot();
    }, [refetchTimeSlot]);

useEffect(() => {
    if (dataSlot) {
        // Transform days array of strings into array of objects
        const formattedDays = dataSlot.days?.map(day => ({ name: day })) || [];
        setDays(formattedDays);
        
        // Set the default time data if available
        if (dataSlot.resturant_time?.resturant_time) {
            setTimeData({
                from: dataSlot.resturant_time.resturant_time.from,
                hours: dataSlot.resturant_time.resturant_time.hours
            });
        }

        // Set the selected custom days if they exist
        if (dataSlot.resturant_time?.custom?.length > 0) {
            const customDays = dataSlot.resturant_time.custom.map(day => ({ name: day }));
            setSelectedDays(customDays);
            // If there are custom days, switch to customize mode
            setOptionName('customize');
        }
        
        console.log("Formatted days:", formattedDays);
        console.log("Restaurant time data:", {
            openingTime: dataSlot.resturant_time?.resturant_time?.from,
            workingHours: dataSlot.resturant_time?.resturant_time?.hours,
            customDays: dataSlot.resturant_time?.custom || []
        });
    }
}, [dataSlot]);

    // Function to format time to HH:MM:SS
    const formatTimeToHHMMSS = (time) => {
        if (!time) return '';
        // If time is in HH:MM format, append :00
        if (/^\d{2}:\d{2}$/.test(time)) {
            return `${time}:00`;
        }
        // If already in HH:MM:SS format, return as is
        if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
            return time;
        }
        // Handle other cases (invalid formats)
        return time;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Format the time before sending
        const formattedTime = formatTimeToHHMMSS(timeData.from);

        let postDataObj;

        if (optionName === 'daily') {
            postDataObj = {
                resturant_time: {
                    from: formattedTime,
                    hours: timeData.hours
                }
            };
        } else {
            postDataObj = {
                custom: selectedDays.map(day => day.name),
                resturant_time: {
                    from: formattedTime,
                    hours: timeData.hours
                }
            };
        }

        console.log('Submitting Data:', postDataObj);
        postData(postDataObj, 'Time Slot Added Successfully');
    };

    const handleReset = () => {
        setTimeData({ from: '', hours: '' });
        setOptionName('daily');
        setSelectedDays([]);
    };

    return (
        <>
            {loadingTime || loadingPost ? (
                <div className="w-full h-56 flex justify-center items-center">
                    <LoaderLogin />
                </div>
            ) : (
                <form className="w-full flex sm:flex-col lg:flex-row flex-wrap items-start justify-start gap-4" onSubmit={handleSubmit}>
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

                    <div className="w-full flex flex-wrap items-center gap-8 mt-3">
                        <div className="sm:w-full lg:w-[35%] flex sm:flex-col xl:flex-row items-center gap-2">
                            <span className="w-9/12 text-xl text-thirdColor">Opening Time:</span>
                            <TimeInput
                                value={timeData.from}
                                onChange={(e) => {
                                    setTimeData({
                                        ...timeData,
                                        from: e.target.value
                                    });
                                }}
                            />
                        </div>
                        <div className="sm:w-full lg:w-[35%] flex sm:flex-col xl:flex-row items-center gap-2">
                            <span className="w-9/12 text-xl text-thirdColor">Number Of Hours:</span>
                            <NumberInput
                                value={timeData.hours}
                                onChange={(e) => {
                                    setTimeData({
                                        ...timeData,
                                        hours: e.target.value
                                    });
                                }}
                                placeholder={"Enter number of hours"}
                            />
                        </div>
                    </div>

                    {optionName === 'customize' && (
                        <div className="sm:w-full lg:w-[60%] flex flex-col items-start gap-y-1 mt-3">
                            <span className="text-xl text-thirdColor">Select Days:</span>
                            <MultiSelect
                                value={selectedDays}
                                onChange={(e) => setSelectedDays(e.value)}
                                options={days}
                                optionLabel="name"
                                placeholder="Select Days"
                                filter
                                className="w-full"
                            />
                        </div>
                    )}

                    <div className="w-full flex items-center justify-end gap-x-4 mt-6">
                        <StaticButton
                            text={'Reset'}
                            handleClick={handleReset}
                            bgColor="bg-transparent"
                            Color="text-mainColor"
                            border="border-2"
                            borderColor="border-mainColor"
                            rounded="rounded-full"
                        />
                        <SubmitButton text={'Submit'} rounded="rounded-full" handleClick={handleSubmit} />
                    </div>
                </form>
            )}
        </>
    );
};

export default RestaurantTimeSlotPage;