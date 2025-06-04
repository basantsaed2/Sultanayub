import React, { useEffect, useRef, useState } from 'react'
import { EmailInput, NumberInput, PasswordInput, StaticButton, StaticLoader, SubmitButton, Switch, TextInput, UploadInput } from '../../../../../Components/Components'
import { usePost } from '../../../../../Hooks/usePostJson';
import { useAuth } from '../../../../../Context/Auth';
import { Dropdown } from 'primereact/dropdown';

const AddAdminSection = ({ update, setUpdate, dataPositions }) => {
       const apiUrl = import.meta.env.VITE_API_BASE_URL;
       const { postData, loadingPost, response } = usePost({
              url: `${apiUrl}/admin/admin/add`
       });

       const auth = useAuth();
       const ImageRef = useRef();
       const IdentityImageRef = useRef();

       const [adminName, setAdminName] = useState('');
       const [adminPhone, setAdminPhone] = useState('');
       const [adminEmail, setAdminEmail] = useState('');
       const [adminPassword, setAdminPassword] = useState('');

       const [adminPositions, setAdminPositions] = useState([]);
       const [adminPositionSelected, setAdminPositionSelected] = useState(null);

       const [identityTypes, setIdentityTypes] = useState([{ name: 'Identity Card' }, { name: 'Passport' }]);
       const [identityTypeSelected, setIdentityTypeSelected] = useState(null);

       const [identityNumber, setIdentityNumber] = useState('');

       const [identityImage, setIdentityImage] = useState('');
       const [identityImageFile, setIdentityImageFile] = useState(null);

       const [adminImage, setAdminImage] = useState('');
       const [adminImageFile, setAdminImageFile] = useState(null);

       const [adminStatus, setAdminStatus] = useState(0)

       useEffect(() => { setAdminPositions(dataPositions) }, [dataPositions])

       const handleAdminImageChange = (e) => {
              const file = e.target.files[0];
              if (file) {
                     setAdminImageFile(file);
                     setAdminImage(file.name);
              }
       };
       const handleAdminImageClick = (ref) => {
              if (ref.current) {
                     ref.current.click();
              }
       };

       const handleIdentityImageChange = (e) => {
              const file = e.target.files[0];
              if (file) {
                     setIdentityImageFile(file);
                     setIdentityImage(file.name);
              }
       };
       const handleIdentityImageClick = (ref) => {
              if (ref.current) {
                     ref.current.click();
              }
       };
       const handleAdminStatus = () => {
              const currentActive = adminStatus;
              { currentActive === 0 ? setAdminStatus(1) : setAdminStatus(0) }
       }

       const handleReset = () => {
              setAdminName('');
              setAdminPhone('');
              setAdminEmail('');
              setAdminPassword('');

              // setAdminPositionState('');
              setAdminPositionSelected(null);

              setAdminImage('');
              setAdminImageFile(null);

              setAdminStatus(0)
       }

       useEffect(() => {
              if (!loadingPost) {
                     handleReset()
                     setUpdate(!update)
              }
       }, [response])

       const handleAdminAdd = async (e) => {
              e.preventDefault();

              const formData = new FormData();

              formData.append('name', adminName)
              formData.append('phone', adminPhone)
              formData.append('email', adminEmail)
              formData.append('password', adminPassword)

              formData.append('image', adminImageFile)

              formData.append('user_position_id', adminPositionSelected.id)
              formData.append('status', adminStatus)

              postData(formData, 'Admin Added Success');
       }


       return (
              <>
                     {loadingPost ? (
                            <div className="w-full h-56 flex justify-center items-center">
                                   <StaticLoader />
                            </div>
                     ) : (
                            <>
                                   <form
                                          className="w-full flex sm:flex-col lg:flex-row flex-wrap items-start justify-start gap-4"
                                          onSubmit={handleAdminAdd}
                                   >
                                          {/* First Name */}
                                          <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                                 <span className="text-xl font-TextFontRegular text-thirdColor">Name:</span>
                                                 <TextInput
                                                        value={adminName}
                                                        onChange={(e) => setAdminName(e.target.value)}
                                                        placeholder="Name"
                                                 />
                                          </div>
                                          {/* admin Phone */}
                                          <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                                 <span className="text-xl font-TextFontRegular text-thirdColor">Phone:</span>
                                                 <NumberInput
                                                        value={adminPhone}
                                                        onChange={(e) => setAdminPhone(e.target.value)}
                                                        placeholder="Phone"
                                                 />
                                          </div>
                                          {/* Admin Image */}
                                          <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                                 <span className="text-xl font-TextFontRegular text-thirdColor">Image:</span>
                                                 <UploadInput
                                                        value={adminImage}
                                                        uploadFileRef={ImageRef}
                                                        placeholder="Image"
                                                        handleFileChange={handleAdminImageChange}
                                                        onChange={(e) => setAdminImage(e.target.value)}
                                                        onClick={() => handleAdminImageClick(ImageRef)}
                                                 />
                                          </div>
                                          {/* Email */}
                                          <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                                 <span className="text-xl font-TextFontRegular text-thirdColor">Email:</span>
                                                 <EmailInput
                                                        backgound='white'
                                                        value={adminEmail}
                                                        onChange={(e) => setAdminEmail(e.target.value)}
                                                        placeholder="Email"
                                                 />
                                          </div>
                                          {/* Password */}
                                          <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                                 <span className="text-xl font-TextFontRegular text-thirdColor">Password:</span>
                                                 <PasswordInput
                                                        backgound='white'
                                                        value={adminPassword}
                                                        onChange={(e) => setAdminPassword(e.target.value)}
                                                        placeholder="Password"
                                                 />
                                          </div>
                                          {/* Admin Positions */}
                                          <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                                 <span className="text-xl font-TextFontRegular text-thirdColor">Roles:</span>
                                                 <Dropdown
                                                        value={adminPositionSelected}
                                                        onChange={(e) => setAdminPositionSelected(e.value)}
                                                        options={adminPositions}
                                                        optionLabel="name"
                                                        placeholder='Select Role'
                                                        className="w-full text-xl text-secoundColor font-TextFontMedium"
                                                 />
                                          </div>
                                          
                                          {/* admin Status */}
                                          <div className="xl:w-[30%] flex items-center justify-start mt-4 gap-x-4 ">
                                                 <span className="text-xl font-TextFontRegular text-thirdColor">Active:</span>
                                                 <Switch handleClick={handleAdminStatus} checked={adminStatus} />
                                          </div>

                                          {/* Buttons */}
                                          <div className="w-full flex items-center justify-end gap-x-4">
                                                 <div className="">
                                                        <StaticButton text={'Reset'} handleClick={handleReset} bgColor='bg-transparent' Color='text-mainColor' border={'border-2'} borderColor={'border-mainColor'} rounded='rounded-full' />
                                                 </div>
                                                 <div className="">
                                                        <SubmitButton
                                                               text={'Add'}
                                                               rounded='rounded-full'
                                                               handleClick={handleAdminAdd}
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

export default AddAdminSection;