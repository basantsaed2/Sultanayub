import React, { useEffect, useRef, useState } from 'react'
import { DropDown, EmailInput, LoaderLogin, NumberInput, PasswordInput, StaticButton, StaticLoader, SubmitButton, Switch, TextInput, UploadInput } from '../../../../Components/Components'
import { usePost } from '../../../../Hooks/usePostJson';
import { useAuth } from '../../../../Context/Auth';
import { useGet } from '../../../../Hooks/useGet';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const EditDeliveryManPage = () => {
  const { deliveryManId } = useParams();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { refetch: refetchDeliveries, loading: loadingDeliveries, data: dataDeliveries } = useGet({
    url: `${apiUrl}/admin/delivery`
  });

  const { refetch: refetchDeliveryMan, loading: loadingDeliveryMan, data: dataDeliveryMan } = useGet({ url: `${apiUrl}/admin/delivery/item/${deliveryManId}` });
  const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/admin/delivery/update/${deliveryManId}` });
  const { t, i18n } = useTranslation();

  const [branches, setBranches] = useState([]);

  const auth = useAuth();
  const navigate = useNavigate();
  const BranchesRef = useRef();
  const IdentityTypeRef = useRef();
  const DeliveryImageRef = useRef();
  const IdentityImageRef = useRef();

  const [deliveryFname, setDeliveryFname] = useState('');
  const [deliveryLname, setDeliveryLname] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');

  const [deliveryImage, setDeliveryImage] = useState('');
  const [deliveryImageFile, setDeliveryImageFile] = useState(null);

  const [deliveryEmail, setDeliveryEmail] = useState('')
  const [deliveryPassword, setDeliveryPassword] = useState('')
  const [deliveryStatus, setDeliveryStatus] = useState(0)
  const [chatStatus, setChatStatus] = useState(0)
  const [phoneStatus, setPhoneStatus] = useState(0)

  const [deliveryBranchState, setDeliveryBranchState] = useState(t('Select Branche'))
  const [deliveryBranchName, setDeliveryBranchName] = useState('')
  const [deliveryBranchId, setDeliveryBranchId] = useState('')

  const [identityTypes, setIdentityTypes] = useState([{ name: 'Card' }, { name: 'Passport' }])
  const [identityTypeState, setIdentityTypeState] = useState(t('Select Identity Type'))
  const [identityTypeName, setIdentityTypeName] = useState('')

  const [identityNumber, setIdentityNumber] = useState('')

  const [identityImage, setIdentityImage] = useState('');
  const [identityImageFile, setIdentityImageFile] = useState(null);

  const [isOpenBranch, setIsOpenBranch] = useState(false)
  const [isOpenIdentityType, setIsOpenIdentityType] = useState(false)



  // Fetch Deliveries Pending when the component mounts or when refetch is called
  useEffect(() => {
    refetchDeliveryMan();
    refetchDeliveries();
  }, [refetchDeliveryMan, refetchDeliveries]);

  // Update Deliveries when `data` changes
  useEffect(() => {
    if (dataDeliveries && dataDeliveries.branches) {
      // setDeliveries(dataDeliveries.deliveries);
      setBranches([{ id: '', name: t('Select Branche') }, ...dataDeliveries.branches] || []);
    }
    console.log('dataDeliveries', dataDeliveries)
  }, [dataDeliveries]); // Only run this effect when `data` changes

  useEffect(() => {
    if (dataDeliveryMan && dataDeliveryMan.delivery) {
      const delivery = dataDeliveryMan.delivery;
      setDeliveryFname(delivery.f_name || '')
      setDeliveryLname(delivery.l_name || '')
      setDeliveryPhone(delivery.phone || '')
      setDeliveryImage(delivery.image_link || '')
      setDeliveryImageFile(delivery.image_link || null)
      setDeliveryEmail(delivery.email || '')
      // setDeliveryPassword(delivery. ||'')
      setDeliveryStatus(delivery.status || 0)
      setChatStatus(delivery.chat_status || 0)
      setPhoneStatus(delivery.phone_status || 0)
      setDeliveryBranchState(delivery.branch.name || t('Select Branche'))
      setDeliveryBranchName(delivery.branch.name || '')
      setDeliveryBranchId(delivery.branch.id || '')
      setIdentityTypeState(delivery.identity_type || t('Select Identity Type'))
      setIdentityTypeName(delivery.identity_type || '')
      setIdentityNumber(delivery.identity_number || '')
      setIdentityImage(delivery.identity_image_link || '')
      setIdentityImageFile(delivery.identity_image_link || null)
    }
    console.log('dataDeliveryMan', dataDeliveryMan)
  }, [dataDeliveryMan]); // Only run this effect when `data` changes

  const handleOpenBranch = () => {
    setIsOpenBranch(!isOpenBranch);
    setIsOpenIdentityType(false);
  };
  const handleOpenOptionBranch = () => setIsOpenBranch(false);

  const handleSelectBranch = (option) => {
    setDeliveryBranchId(option.id);
    setDeliveryBranchState(option.name);
    setDeliveryBranchName(option.name);
  };

  const handleOpenIdentityType = () => {
    setIsOpenBranch(false);
    setIsOpenIdentityType(!isOpenIdentityType);
  };
  const handleOpenOptionIdentityType = () => setIsOpenIdentityType(false);

  const handleSelectIdentityType = (option) => {
    setIdentityTypeState(option.name);
    setIdentityTypeName(option.name);
  };


  const handleDeliveryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDeliveryImageFile(file);
      setDeliveryImage(file.name);
    }
  };
  const handleIdentityImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIdentityImageFile(file);
      setIdentityImage(file.name);
    }
  };

  const handleDeliveryImageClick = (ref) => {
    if (ref.current) {
      ref.current.click();
    }
  };
  const handleIdentityImageClick = (ref) => {
    if (ref.current) {
      ref.current.click();
    }
  };

  const handleDeliveryStatus = () => {
    const currentActive = deliveryStatus;
    { currentActive === 0 ? setDeliveryStatus(1) : setDeliveryStatus(0) }
  }
  const handleChatStatus = () => {
    const currentActive = chatStatus;
    { currentActive === 0 ? setChatStatus(1) : setChatStatus(0) }
  }
  const handlePhoneStatus = () => {
    const currentActive = phoneStatus;
    { currentActive === 0 ? setPhoneStatus(1) : setPhoneStatus(0) }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdown if clicked outside
      if (
        BranchesRef.current && !BranchesRef.current.contains(event.target)
      ) {
        setIsOpenBranch(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  useEffect(() => {
    console.log('response', response);
    if (!loadingPost && response) {
      handleCancel();
    }
  }, [loadingPost, response]);

  const handleCancel = () => {
    navigate(-1, { replace: true });
  };

  const handleDeliveryEdit = async (e) => {
    e.preventDefault();

    if (!deliveryFname) {
      auth.toastError(t('please Enter First Name'))
      return;
    }
    if (!deliveryLname) {
      auth.toastError(t('please Enter Last Name'))
      return;
    }
    if (!deliveryPhone) {
      auth.toastError(t('please Enter The Phone'))
      return;
    }
    if (!deliveryBranchId) {
      auth.toastError(t('please Select Branch'))
      return;
    }
    if (!deliveryImageFile) {
      auth.toastError(t('please Enter Delivery Photo'))
      return;
    }
    if (!identityTypeName) {
      auth.toastError(t('please Select Identity'))
      return;
    }
    if (!identityImageFile) {
      auth.toastError(t('please Enter Identity Photo'))
      return;
    }
    if (!identityNumber) {
      auth.toastError(t('please Enter Identity Number'))
      return;
    }
    if (!deliveryEmail) {
      auth.toastError(t('please Enter The Email'))
      return;
    }
    if (!deliveryEmail.includes('@')) {
      auth.toastError(t("please Enter '@' After The Email"))
      return;
    }
    // if (!deliveryPassword) {
    //   auth.toastError('please Enter The Password')
    //   return;
    // }

    const formData = new FormData();

    formData.append('f_name', deliveryFname)
    formData.append('l_name', deliveryLname)
    formData.append('phone', deliveryPhone)
    formData.append('image', deliveryImageFile)
    formData.append('email', deliveryEmail)
    formData.append('password', deliveryPassword)
    formData.append('branch_id', deliveryBranchId)
    formData.append('identity_type', identityTypeName)
    formData.append('identity_number', identityNumber)
    formData.append('identity_image', identityImageFile)
    formData.append('chat_status', chatStatus)
    formData.append('phone_status', phoneStatus)
    formData.append('status', deliveryStatus)

    postData(formData, t('Delivery Added Success'));
  }


  return (
    <>
      {loadingDeliveries || loadingPost ? (
        <div className="flex items-center justify-center w-full">
          <LoaderLogin />
        </div>
      ) : (
        <>
          <form
            className="flex flex-wrap items-start justify-start w-full gap-4 sm:flex-col lg:flex-row"
            onSubmit={handleDeliveryEdit}
          >
            {/* First Name */}
            <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
              <span className="text-xl font-TextFontRegular text-thirdColor">{t("FirstName")}:</span>
              <TextInput
                value={deliveryFname}
                onChange={(e) => setDeliveryFname(e.target.value)}
                placeholder={t("FirstName")}
              />
            </div>
            {/* Last Name */}
            <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
              <span className="text-xl font-TextFontRegular text-thirdColor">{t("LastName")}:</span>
              <TextInput
                value={deliveryLname}
                onChange={(e) => setDeliveryLname(e.target.value)}
                placeholder={t("LastName")}
              />
            </div>
            {/* Delivery Phone */}
            <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
              <span className="text-xl font-TextFontRegular text-thirdColor">{t("DeliveryPhone")}:</span>
              <NumberInput
                value={deliveryPhone}
                onChange={(e) => setDeliveryPhone(e.target.value)}
                placeholder={t("DeliveryPhone")}
              />
            </div>
            {/* Branches */}
            <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
              <span className="text-xl font-TextFontRegular text-thirdColor">{t("Branches")}:</span>
              <DropDown
                ref={BranchesRef}
                handleOpen={handleOpenBranch}
                stateoption={deliveryBranchState}
                openMenu={isOpenBranch}
                handleOpenOption={handleOpenOptionBranch}
                options={branches}
                onSelectOption={handleSelectBranch}
                border={false}
              />
            </div>
            {/* Delivery Image */}
            <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
              <span className="text-xl font-TextFontRegular text-thirdColor">{t("DeliveryPhoto")}:</span>
              <UploadInput
                value={deliveryImage}
                uploadFileRef={DeliveryImageRef}
                placeholder={t("DeliveryPhoto")}
                handleFileChange={handleDeliveryImageChange}
                onChange={(e) => setDeliveryImage(e.target.value)}
                onClick={() => handleDeliveryImageClick(DeliveryImageRef)}
              />
            </div>
            {/* Identity Type */}
            <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
              <span className="text-xl font-TextFontRegular text-thirdColor">{t("IdentityType")}:</span>
              <DropDown
                ref={IdentityTypeRef}
                handleOpen={handleOpenIdentityType}
                stateoption={identityTypeState}
                openMenu={isOpenIdentityType}
                handleOpenOption={handleOpenOptionIdentityType}
                options={identityTypes}
                onSelectOption={handleSelectIdentityType}
                border={false}
              />
            </div>
            {/* Identity Image */}
            <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
              <span className="text-xl font-TextFontRegular text-thirdColor">{t("IdentityPhoto")}:</span>
              <UploadInput
                value={identityImage}
                uploadFileRef={IdentityImageRef}
                placeholder={t("IdentityPhoto")}
                handleFileChange={handleIdentityImageChange}
                onChange={(e) => setIdentityImage(e.target.value)}
                onClick={() => handleIdentityImageClick(IdentityImageRef)}
              />
            </div>
            {/* Identity Number */}
            <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
              <span className="text-xl font-TextFontRegular text-thirdColor">{t("IdentityNumber")}:</span>
              <NumberInput
                value={identityNumber}
                onChange={(e) => setIdentityNumber(e.target.value)}
                placeholder={t("IdentityNumber")}
              />
            </div>
            {/* Email */}
            <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
              <span className="text-xl font-TextFontRegular text-thirdColor">{t("Email")}:</span>
              <EmailInput
                backgound='white'
                value={deliveryEmail}
                onChange={(e) => setDeliveryEmail(e.target.value)}
                placeholder={t("Email")}
              />
            </div>
            {/* Password */}
            <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
              <span className="text-xl font-TextFontRegular text-thirdColor">{t('Password')}:</span>
              <PasswordInput
                backgound='white'
                value={deliveryPassword}
                onChange={(e) => setDeliveryPassword(e.target.value)}
                placeholder={t('Password')}
              />
            </div>
            {/* Chat Status */}
            <div className="xl:w-[30%] flex items-center justify-start gap-x-4 lg:pt-10">
              <span className="text-xl font-TextFontRegular text-thirdColor">{t("ChatStatus")}:</span>
              <Switch handleClick={handleChatStatus} checked={chatStatus} />
            </div>
            {/* Phone Status */}
            <div className="xl:w-[30%] flex items-center justify-start gap-x-4 lg:pt-10">
              <span className="text-xl font-TextFontRegular text-thirdColor">{t("PhoneStatus")} :</span>
              <Switch handleClick={handlePhoneStatus} checked={phoneStatus} />
            </div>
            {/* delivery Status */}
            <div className="xl:w-[30%] flex items-center justify-start gap-x-4 lg:pt-10">
              <span className="text-xl font-TextFontRegular text-thirdColor">{t("DeliveryStatus")} :</span>
              <Switch handleClick={handleDeliveryStatus} checked={deliveryStatus} />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end w-full gap-x-4">
              <div className="">
                <StaticButton text={t('Cancel')} handleClick={handleCancel} bgColor='bg-transparent' Color='text-mainColor' border={'border-2'} borderColor={'border-mainColor'} rounded='rounded-full' />
              </div>
              <div className="">
                <SubmitButton
                  text={t('Edit')}
                  rounded='rounded-full'
                  handleClick={handleDeliveryEdit}
                />
              </div>

            </div>
          </form>
        </>
      )
      }
    </>
  )
}

export default EditDeliveryManPage