import React, { useEffect, useRef, useState } from 'react'

import { useAuth } from '../../Context/Auth.jsx'
import { SearchBar, StaticButton } from '../Components.js';
import { CiGlobe } from 'react-icons/ci';
import { IoBagHandleOutline } from 'react-icons/io5';
import { IoIosArrowDown, IoMdNotificationsOutline } from 'react-icons/io';
import RedLogo from '../../Assets/Images/RedLogo.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeCategory, removeUser } from '../../Store/CreateSlices.jsx';
import { useSelector } from 'react-redux';
import { removeCanceledOrder } from '../../Store/CreateSlices';

const Navbar = () => {
       const auth = useAuth()
       const dispatch = useDispatch()
       const navigate = useNavigate();
       const dropdownRef = useRef(null)

       const [selectedOption, setSelectedOption] = useState('EN');
       const [open, setOpen] = useState(false);

       const [isOnline, setIsOnline] = useState(navigator.onLine);

       useEffect(() => {
              const updateOnlineStatus = () => {
                     setIsOnline(navigator.onLine);
              };

              window.addEventListener('online', updateOnlineStatus);
              window.addEventListener('offline', updateOnlineStatus);

              return () => {
                     window.removeEventListener('online', updateOnlineStatus);
                     window.removeEventListener('offline', updateOnlineStatus);
              };
       }, []);


       const handleOptionClick = (value) => {
              setSelectedOption(value);
              setOpen(false)
       };
       const handleClickOpen = () => {
              setOpen(!open);
       };

       // const handleClickOutside = (event) => {
       //        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
       //               setOpen(false);
       //        }
       // };

       useEffect(() => {
              document.addEventListener('mousedown', handleClickOutside);
              return () => {
                     document.removeEventListener('mousedown', handleClickOutside);
              };
       }, []);

       const handleLogout = () => {
              auth.logout()
              dispatch(removeUser())
              dispatch(removeCategory())
              navigate("/", { replace: true });
              localStorage.removeItem("token"); // تخزين التوكن بعد تسجيل الدخول
       }




       const notificationRef = useRef(null);

       const [notificationOpen, setNotificationOpen] = useState(false);

       const handleClickOutside = (event) => {
              if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                     setOpen(false);
              }
              if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                     setNotificationOpen(false);
              }
       };

       const canceledOrders = useSelector((state) => state.canceledOrders);

       const handleRemoveOrder = (orderId) => {
              dispatch(removeCanceledOrder(orderId));
       };

       return (
              <>
                     <nav className="flex items-center justify-between py-1 px-4 gap-x-4 shadow-md">
                            <div className='sm:w-10/12 lg:w-6/12 xl:w-3/12 flex items-center justify-start sm:gap-x-4'>

                                   <div className="relative z-10 w-14">

                                          {/* image profile */}
                                          {auth?.userState?.image ? (<img src={auth?.userState?.image} className='min-w-14 max-w-14 min-h-14  max-h-14 p-1 bg-white border-2 border-mainColor rounded-full object-cover object-center' alt="Profile" />)
                                                 : (<RedLogo width={60} height={60} />)}
                                          <span
                                                 className={`absolute z-10 sm:right-0 lg:-right-0 ${isOnline ? 'bg-green-400' : 'bg-red-600'
                                                        } rounded-full bottom-1 w-[18px] h-[18px] animate-pulse`}
                                          ></span>
                                   </div>
                                   {/* Name Admin */}
                                   <div className="sm:w-10/12">
                                          <span className='w-full text-2xl text-left text-mainColor font-TextFontSemiBold'>Hello, {auth?.userState?.name || ""}</span>
                                   </div>

                            </div>
                            {/* <div className='sm:hidden lg:flex w-5/12'>
                                   <SearchBar bgColor="bg-mainBgColor" pr='4' />
                            </div> */}

                            <div className="flex gap-5">
                                   <div className='flex w-2/12  items-center justify-center gap-x-10'>
                                          <div className="relative" ref={notificationRef}>
                                                 <div className="relative" ref={notificationRef}>
                                                        <button
                                                               type="button"
                                                               onClick={() => setNotificationOpen(!notificationOpen)}
                                                               className="relative"
                                                        >
                                                               <IoMdNotificationsOutline className="text-mainColor text-3xl" />
                                                               {canceledOrders.count > 0 && (
                                                                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                                             {canceledOrders.count}
                                                                      </span>
                                                               )}
                                                        </button>

                                                        {notificationOpen && (
                                                               <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-40">
                                                                      {canceledOrders.orders.length === 0 ? (
                                                                             <div className="px-4 py-2 text-gray-700">No waiting orders</div>
                                                                      ) : (
                                                                             <>
                                                                                    <div className="px-4 py-2 font-semibold border-b">Waiting Orders</div>
                                                                                    {canceledOrders.orders.map(orderId => (
                                                                                           <div key={orderId} className="px-4 py-2 hover:bg-gray-100 flex justify-between items-center">
                                                                                                  <Link
                                                                                                         to={`/dashboard/orders/details/${orderId}`}
                                                                                                         onClick={() => {
                                                                                                                setNotificationOpen(false); // Close dropdown when clicking
                                                                                                                dispatch(removeCanceledOrder(orderId)); // Remove immediately
                                                                                                         }}
                                                                                                         className="flex-1 text-left"
                                                                                                  >
                                                                                                         Order #{orderId}
                                                                                                  </Link>
                                                                                                  <button
                                                                                                         onClick={(e) => {
                                                                                                                e.stopPropagation();
                                                                                                                handleRemoveOrder(orderId);
                                                                                                         }}
                                                                                                         className="text-red-600 hover:text-red-800 ml-2"
                                                                                                  >
                                                                                                         ×
                                                                                                  </button>
                                                                                           </div>
                                                                                    ))}
                                                                             </>
                                                                      )}
                                                               </div>
                                                        )}
                                                 </div>
                                          </div>
                                   </div>
                                   <StaticButton type='button' text={'Logout'} handleClick={handleLogout} />
                            </div>
                     </nav >
              </>
       )
}

export default Navbar