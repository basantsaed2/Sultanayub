// import { useEffect, useRef, useState } from 'react'
// import { DateInput, DropDown, StaticButton, StaticLoader, SubmitButton, TitleSection } from '../../../../Components/Components'
// import { usePost } from '../../../../Hooks/usePostJson';
// import { useDispatch } from 'react-redux';
// import {  setOrdersAll, setOrdersCanceled, setOrdersConfirmed, setOrdersDelivered, setOrdersFailed, setOrdersOutForDelivery, setOrdersPending, setOrdersProcessing, setOrdersReturned, setOrdersSchedule } from '../../../../Store/CreateSlices';
// import { useAuth } from '../../../../Context/Auth';

// const SelectDateRangeSection = ({ typPage, branchsData }) => {
//        const dispatch = useDispatch()
//        const auth = useAuth()

//        const apiUrl = import.meta.env.VITE_API_BASE_URL;

//        // const { postData, loadingPost, response } = usePost({
//        //        url: `${apiUrl}/admin/order/filter`
//        // });
//          const { postData, loadingPost, response } = usePost({
//               url: `${apiUrl}/admin/order_filter_date`
//        });

//        const dropDownBranch = useRef();
//        const [isOpenBranch, setIsOpenBranch] = useState(false)

//        const [branchs, setBranchs] = useState([])
//        const [startDate, setStartDate] = useState('')
//        const [endDate, setEndDate] = useState('')

//        const [stateBranch, setStateBranch] = useState('Select Branch')
//        const [branchId, setBranchId] = useState('')

//        const handleOpenDropdown = () => {
//               setIsOpenBranch(!isOpenBranch);
//        }
//        const handleOpenOptionBranch = () => { setIsOpenBranch(false) }
//        const handleSelectBranch = (option) => {
//               setBranchId(option.id);
//               setStateBranch(option.name);
//        }
//        useEffect(() => {
//               if (branchsData?.branches) {
//                      setBranchs(branchsData.branches);
//               }
//        }, [branchsData]);

//        useEffect(() => {
//               if (response !== null) {
//                      switch (typPage) {
//                             case 'all':
//                                    dispatch(setOrdersAll(response.data.orders));
//                                    break;
//                             case 'pending':
//                                    dispatch(setOrdersPending(response.data.orders));
//                                    break;
//                             case 'confirmed':
//                                    dispatch(setOrdersConfirmed(response.data.orders));
//                                    break;
//                             case 'processing':
//                                    dispatch(setOrdersProcessing(response.data.orders));
//                                    break;
//                             case 'out_for_delivery':
//                                    dispatch(setOrdersOutForDelivery(response.data.orders));
//                                    break;
//                             case 'delivered':
//                                    dispatch(setOrdersDelivered(response.data.orders));
//                                    break;
//                             case 're-turned':
//                                    dispatch(setOrdersReturned(response.data.orders));
//                                    break;
//                             case 'faild_to_deliver':
//                                    dispatch(setOrdersFailed(response.data.orders));
//                                    break;
//                             case 'canceled':
//                                    dispatch(setOrdersCanceled(response.data.orders));
//                                    break;
//                             case 'scheduled':
//                                    dispatch(setOrdersSchedule(response.data.orders));
//                                    break;
//                             default:
//                                    console.error('Invalid typPage:', typPage);
//                      }
//               } else {
//                      console.log('No response received yet.');
//               }
//               console.log('response', response);
//        }, [response, typPage, dispatch]);

//        useEffect(() => {
//               console.log('Full API Response:', response);

//               if (response && response.data && Array.isArray(response.data.orders)) {
//                   console.log('Orders Count:', response.data.orders.length);
//                   console.log('First Order (if any):', response.data.orders[0]);
//               }
//           }, [response]);

//        useEffect(() => {
//               const handleClickOutside = (event) => {
//                      // Close dropdown if clicked outside
//                      if (
//                             dropDownBranch.current && !dropDownBranch.current.contains(event.target)
//                      ) {
//                             setIsOpenBranch(false);
//                      }
//               };

//               document.addEventListener('mousedown', handleClickOutside);
//               return () => {
//                      document.removeEventListener('mousedown', handleClickOutside);
//               };
//        }, []);

//        const handleReset = () => {
//               setStateBranch('Select Branch')
//               setBranchId('')
//               setStartDate('')
//               setEndDate('')
//        }
//        const handleData = (e) => {
//               e.preventDefault();

//               // تحقق من أن تاريخ النهاية ليس قبل تاريخ البداية
//               if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
//                 auth.toastError("End date cannot be before start date.");
//                 return;
//               }

//               const formData = new FormData();

//               if (branchId) {
//                 formData.set('branch_id', branchId);
//               }

//               if (startDate) {
//                 formData.set('date', startDate);
//               }

//               if (endDate) {
//                 formData.set('date_to', endDate);
//               }

//               console.log('FormData being sent:');
//               for (let [key, value] of formData.entries()) {
//                 console.log(`${key}: ${value}`);
//               }

//               postData(formData);
//             };

//        return (
//               <>
//                      <TitleSection text={'Select Date Range'} />
//                      {loadingPost ? (
//                             <>
//                                    <div className="flex items-center justify-center w-full h-56">
//                                           <StaticLoader />
//                                    </div>
//                             </>
//                      ) : (
//                             <form onSubmit={handleData} className="flex flex-wrap items-center justify-start w-full gap-4 px-3 py-3 pt-0 shadow-md sm:flex-col lg:flex-row rounded-xl">
//                                    <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
//                                           <span className="text-xl font-TextFontRegular text-thirdColor">Select Branch:</span>
//                                           <DropDown
//                                                  ref={dropDownBranch}
//                                                  handleOpen={handleOpenDropdown}
//                                                  stateoption={stateBranch}
//                                                  openMenu={isOpenBranch}
//                                                  handleOpenOption={handleOpenOptionBranch}
//                                                  options={branchs}
//                                                  onSelectOption={handleSelectBranch}
//                                                  border={false}
//                                           />
//                                    </div>
//                                    <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
//                                           <span className="text-xl font-TextFontRegular text-thirdColor">Start Date:</span>
//                                           <DateInput
//                                                  value={startDate}
//                                                  minDate={false}
//                                                  onChange={(e) => setStartDate(e.target.value)}
//                                           />
//                                    </div>
//                                    <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
//                                           <span className="text-xl font-TextFontRegular text-thirdColor">End Date:</span>
//                                           <DateInput
//                                                  value={endDate}
//                                                  minDate={false}
//                                                  onChange={(e) => setEndDate(e.target.value)}
//                                           />
//                                    </div>

//                                    {/* Buttons*/}
//                                    <div className="flex items-center justify-end w-full gap-x-4">
//                                           <div className="">
//                                                  <StaticButton text={'Reset'} handleClick={handleReset} bgColor='bg-transparent' Color='text-mainColor' border={'border-2'} borderColor={'border-mainColor'} rounded='rounded-full' />
//                                           </div>
//                                           <div className="">
//                                                  <SubmitButton
//                                                         text={'Show Data'}
//                                                         rounded='rounded-full'
//                                                         handleClick={handleData}
//                                                  />
//                                           </div>

//                                    </div>
//                             </form>
//                      )}
//               </>
//        )
// }

// export default SelectDateRangeSection

import { useEffect, useRef, useState } from "react";
import {
  DateInput,
  DropDown,
  StaticButton,
  StaticLoader,
  SubmitButton,
  TitleSection,
} from "../../../../Components/Components";
import { usePost } from "../../../../Hooks/usePostJson";
import { useDispatch } from "react-redux";
import {
  setOrdersAll,
  setOrdersCanceled,
  setOrdersConfirmed,
  setOrdersDelivered,
  setOrdersFailed,
  setOrdersOutForDelivery,
  setOrdersPending,
  setOrdersProcessing,
  setOrdersReturned,
  setOrdersRefund,
  setOrdersSchedule,
} from "../../../../Store/CreateSlices";
import { useAuth } from "../../../../Context/Auth";
import { useTranslation } from "react-i18next";

const SelectDateRangeSection = ({ typPage, branchsData }) => {
  const dispatch = useDispatch();
  const auth = useAuth();
  const { t, i18n } = useTranslation();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const { postData, loadingPost, response } = usePost({
    url: `${apiUrl}/admin/order/order_filter_date`,
  });

  const dropDownBranch = useRef();
  const dropDownType = useRef();
  const [isOpenBranch, setIsOpenBranch] = useState(false);
  const [isOpenType, setIsOpenType] = useState(false);

  const [branchs, setBranchs] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [stateBranch, setStateBranch] = useState(t("SelectBranch"));
  const [branchId, setBranchId] = useState("");

  const [stateType, setStateType] = useState(t("All Types"));
  const [selectedType, setSelectedType] = useState(t("all"));

  const orderTypes = [
    { id: "all", name: t("all") },
    { id: "pending", name: t("pending") },
    { id: "confirmed", name: t("confirmed") },
    { id: "processing", name: t("processing") },
    { id: "out_for_delivery", name: t("out_for_delivery") },
    { id: "delivered", name: t("delivered") },
    { id: "returned", name: t("returned") },
    { id: "refund", name: t("refund") },
    { id: "faild_to_deliver", name: t("failed_to_deliver") },
    { id: "canceled", name: t("canceled") },
    { id: "scheduled", name: t("scheduled") },
  ];

  const handleOpenDropdown = (type) => {
    if (type === "branch") {
      setIsOpenBranch(!isOpenBranch);
      setIsOpenType(false);
    } else {
      setIsOpenType(!isOpenType);
      setIsOpenBranch(false);
    }
  };

  const handleOpenOptionBranch = () => {
    setIsOpenBranch(false);
  };
  const handleOpenOptionType = () => {
    setIsOpenType(false);
  };

  const handleSelectBranch = (option) => {
    setBranchId(option.id);
    setStateBranch(option.name);
  };

  const handleSelectType = (option) => {
    setSelectedType(option.id);
    setStateType(option.name);
  };

  useEffect(() => {
    if (branchsData?.branches) {
      setBranchs(branchsData.branches);
    }
  }, [branchsData]);

  useEffect(() => {
    if (response !== null) {
      switch (typPage) {
        case "all":
          dispatch(setOrdersAll(response.data.orders));
          break;
        case "pending":
          dispatch(setOrdersPending(response.data.orders));
          break;
        case "confirmed":
          dispatch(setOrdersConfirmed(response.data.orders));
          break;
        case "processing":
          dispatch(setOrdersProcessing(response.data.orders));
          break;
        case "out_for_delivery":
          dispatch(setOrdersOutForDelivery(response.data.orders));
          break;
        case "delivered":
          dispatch(setOrdersDelivered(response.data.orders));
          break;
        case "re-turned":
          dispatch(setOrdersReturned(response.data.orders));
          break;
        case "refund":
          dispatch(setOrdersRefund(response.data.orders));
          break;
        case "faild_to_deliver":
          dispatch(setOrdersFailed(response.data.orders));
          break;
        case "canceled":
          dispatch(setOrdersCanceled(response.data.orders));
          break;
        case "scheduled":
          dispatch(setOrdersSchedule(response.data.orders));
          break;
        default:
          console.error("Invalid typPage:", typPage);
      }
    } else {
      console.log("No response received yet.");
    }
    console.log("response", response);
  }, [response, typPage, dispatch]);

  useEffect(() => {
    console.log("Full API Response:", response);

    if (response && response.data && Array.isArray(response.data.orders)) {
      console.log("Orders Count:", response.data.orders.length);
      console.log("First Order (if any):", response.data.orders[0]);
    }
  }, [response]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdowns if clicked outside
      if (
        dropDownBranch.current &&
        !dropDownBranch.current.contains(event.target)
      ) {
        setIsOpenBranch(false);
      }
      if (
        dropDownType.current &&
        !dropDownType.current.contains(event.target)
      ) {
        setIsOpenType(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleReset = () => {
    setStateBranch(t("Select Branch"));
    setBranchId("");
    setStartDate("");
    setEndDate("");
    setStateType(t("All Types"));
    setSelectedType("all");
  };

  const handleData = (e) => {
    e.preventDefault();

    // Check if end date is before start date
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      auth.toastError("End date cannot be before start date.");
      return;
    }

    const formData = new FormData();

    if (branchId) {
      formData.set("branch_id", branchId);
    }

    if (startDate) {
      formData.set("date", startDate);
    }

    if (endDate) {
      formData.set("date_to", endDate);
    }

    if (selectedType) {
      formData.set("type", selectedType);
    }

    console.log("FormData being sent:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    postData(formData);
  };

  return (
    <>
      <TitleSection text={t("SelectDateRange")} />
      {loadingPost ? (
        <>
          <div className="flex items-center justify-center w-full h-56">
            <StaticLoader />
          </div>
        </>
      ) : (
        <form
          onSubmit={handleData}
          className="flex flex-wrap items-center justify-start w-full gap-4 px-3 py-3 pt-0 shadow-md sm:flex-col lg:flex-row rounded-xl"
        >
          <div className="sm:w-full lg:w-[23%] flex flex-col items-start justify-center gap-y-1">
            <span className="text-xl font-TextFontRegular text-thirdColor">
              {t("SelectBranch")}:
            </span>
            <DropDown
              ref={dropDownBranch}
              handleOpen={() => handleOpenDropdown("branch")}
              stateoption={stateBranch}
              openMenu={isOpenBranch}
              handleOpenOption={handleOpenOptionBranch}
              options={branchs}
              onSelectOption={handleSelectBranch}
              border={false}
            />
          </div>

          <div className="sm:w-full lg:w-[23%] flex flex-col items-start justify-center gap-y-1">
            <span className="text-xl font-TextFontRegular text-thirdColor">
             {t("Order Type")}:
            </span>
            <DropDown
              ref={dropDownType}
              handleOpen={() => handleOpenDropdown("type")}
              stateoption={stateType}
              openMenu={isOpenType}
              handleOpenOption={handleOpenOptionType}
              options={orderTypes}
              onSelectOption={handleSelectType}
              border={false}
            />
          </div>

          <div className="sm:w-full lg:w-[23%] flex flex-col items-start justify-center gap-y-1">
            <span className="text-xl font-TextFontRegular text-thirdColor">
              {t("StartDate")}:
            </span>
            <DateInput
              value={startDate}
              minDate={false}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="sm:w-full lg:w-[23%] flex flex-col items-start justify-center gap-y-1">
            <span className="text-xl font-TextFontRegular text-thirdColor">
              {t("EndDate")}:
            </span>
            <DateInput
              value={endDate}
              minDate={false}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Buttons*/}
          <div className="flex items-center justify-end w-full gap-x-4">
            <div className="">
              <StaticButton
                text={t("Reset")}
                handleClick={handleReset}
                bgColor="bg-transparent"
                Color="text-mainColor"
                border={"border-2"}
                borderColor={"border-mainColor"}
                rounded="rounded-full"
              />
            </div>
            <div className="">
              <SubmitButton
                text={t("ShowData")}
                rounded="rounded-full"
                handleClick={handleData}
              />
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default SelectDateRangeSection;
