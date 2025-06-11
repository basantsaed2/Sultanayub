import React, { useEffect, useRef, useState } from 'react'
import { StaticButton, StaticLoader, SubmitButton, Switch, TextInput, UploadInput } from '../../../../../Components/Components';
import { usePost } from '../../../../../Hooks/usePostJson';
import { useAuth } from '../../../../../Context/Auth';
import { useNavigate, useParams } from 'react-router-dom';
import { useGet } from '../../../../../Hooks/useGet';


const EditGroupPage = () => {
       const { groupId } = useParams();
       const navigate = useNavigate();
       const apiUrl = import.meta.env.VITE_API_BASE_URL;
       const { refetch: refetchGroup, loading: loadingGroup, data: dataGroup } = useGet({ url: `${apiUrl}/admin/group/item/${groupId}` });
       const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/admin/group/update/${groupId}` });

       const auth = useAuth();

       const [GroupName, setGroupName] = useState('');
       const [GroupStatus, setGroupStatus] = useState(0);

       useEffect(() => {
              refetchGroup();
       }, [refetchGroup]);

       useEffect(() => {
              if (dataGroup && dataGroup.group) {
                     setGroupName(dataGroup.group.name);
                     setGroupStatus(dataGroup.group.status);
              }
              console.log('dataGroup', dataGroup)
       }, [dataGroup]); // Only run this effect when `data` changes


       const handleGroupStatus = () => {
              const currentState = GroupStatus;
              { currentState === 0 ? setGroupStatus(1) : setGroupStatus(0) }
       }

       useEffect(() => {
              console.log('response', response)
              if (response) {
                     handleBack()
              }
       }, [response])

       const handleBack = () => {
              navigate(-1, { replace: true });
       }

       const handleGroupEdit = (e) => {
              e.preventDefault();


              if (!GroupName) {
                     auth.toastError('please Enter Group Name')
                     return;
              }
              const formData = new FormData();


              formData.append('name', GroupName);
              formData.append('status', GroupStatus);
              postData(formData, 'Group Edited Success');

       };
       return (
              <>
                     {loadingGroup || loadingPost ? (
                            <>
                                   <div className="w-full h-56 flex justify-center items-center">
                                          <StaticLoader />
                                   </div>
                            </>
                     ) : (
                            <section>
                                   <form onSubmit={handleGroupEdit}>
                                          <div className="sm:py-3 lg:py-6">
                                                 <div
                                                        className="w-full flex sm:flex-col lg:flex-row flex-wrap items-center justify-start gap-4">
                                                        {/* Name Input */}
                                                        <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                                               <span className="text-xl font-TextFontRegular text-thirdColor">Group Name:</span>
                                                               <TextInput
                                                                      value={GroupName}
                                                                      onChange={(e) => setGroupName(e.target.value)}
                                                                      placeholder="Group Name"
                                                               />
                                                        </div>
                                                        <div className="sm:w-full xl:w-[30%] flex items-start justify-start gap-x-1 pt-10">
                                                               <div className='w-2/4 flex items-center justify-start gap-x-1'>
                                                                      <span className="text-xl font-TextFontRegular text-thirdColor">Active:</span>
                                                                      <Switch handleClick={handleGroupStatus} checked={GroupStatus} />
                                                               </div>
                                                        </div>
                                                 </div>
                                          </div>

                                          {/* Buttons*/}
                                          <div className="w-full flex items-center justify-end gap-x-4">
                                                 <div className="">
                                                        <StaticButton text={'Cancel'} handleClick={handleBack} bgColor='bg-transparent' Color='text-mainColor' border={'border-2'} borderColor={'border-mainColor'} rounded='rounded-full' />
                                                 </div>
                                                 <div className="">
                                                        <SubmitButton
                                                               text={'Edit'}
                                                               rounded='rounded-full'
                                                               handleClick={handleGroupEdit}
                                                        />
                                                 </div>

                                          </div>
                                   </form>
                            </section>
                     )}
              </>
       )
}

export default EditGroupPage;