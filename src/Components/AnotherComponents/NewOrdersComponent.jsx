// import  { useEffect, useRef } from 'react';
// import { useSelector } from 'react-redux';
// import { Dialog } from '@headlessui/react';
// import { Link, useNavigate } from 'react-router-dom';
// import { MdOutlineShoppingCart } from 'react-icons/md';
// const NewOrdersComponent = ({ isOpen, onClose }) => {
//        const popUpRef = useRef();
//        const newOrders = useSelector((state) => state.newOrders);

//        const navigate = useNavigate();

//        const handleClickOutside = (event) => {
//               if (popUpRef.current && !popUpRef.current.contains(event.target)) {
//                      onClose();
//               }
//        };

//        useEffect(() => {
//               document.addEventListener('mousedown', handleClickOutside);
//               return () => {
//                      document.removeEventListener('mousedown', handleClickOutside);
//               };
//        }, []);

//        return (
//               <Dialog open={isOpen} onClose={onClose} className="relative z-10">
//                      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" />
//                      <div className="fixed inset-0 z-10 overflow-y-auto">
//                             <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
//                                    <div className="relative transform overflow-hidden rounded-lg bg-white text-center shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl" ref={popUpRef}>
//                                           {/* Header */}
//                                           <div className="w-full flex items-center justify-center gap-x-4 text-3xl font-TextFontSemiBold text-gray-500 my-5">
//                                                  <MdOutlineShoppingCart className="text-4xl" />
//                                                  You have {newOrders?.count || 0} new orders, Check Please.
//                                           </div>

//                                           {/* Footer */}
//                                           <div className="px-4 py-3 mx-auto border-t-4 sm:px-6">
//                                                  <Link
//                                                         // to="/dashboard/orders/all"
//                                                         to={`/dashboard/orders/details/${newOrders?.id}`}
//                                                         onClick={(e) => {
//                                                                e.preventDefault();
//                                                                onClose();
//                                                                navigate(`/dashboard/orders/details/${newOrders?.id}`); // Navigate to order details page
//                                                         }}
//                                                         className="mt-3 inline-flex w-full justify-center rounded-md bg-mainColor px-6 py-3 text-xl font-TextFontMedium text-white shadow-sm sm:mt-0 sm:w-auto focus:outline-none"
//                                                  >
//                                                         Ok, let me check
//                                                  </Link>
//                                           </div>
//                                    </div>
//                             </div>
//                      </div>
//               </Dialog>
//        );
// };

// export default NewOrdersComponent;


import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Dialog } from '@headlessui/react';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { addCanceledOrder } from '../../Store/CreateSlices';
import { useDispatch } from 'react-redux';

const NewOrdersComponent = ({ isOpen, onClose }) => {
       const popUpRef = useRef();
       const newOrders = useSelector((state) => state.newOrders);
       const navigate = useNavigate();
       const dispatch = useDispatch();

       const handleClickOutside = (event) => {
              if (popUpRef.current && !popUpRef.current.contains(event.target)) {
                     handleCancelOrder(newOrders?.id); // Use newOrders.id from Redux
              }
       };
       useEffect(() => {
              document.addEventListener('mousedown', handleClickOutside);
              return () => {
                     document.removeEventListener('mousedown', handleClickOutside);
              };
       }, []);

       const handleCancelOrder = (orderId) => {
              dispatch(addCanceledOrder(orderId));
              onClose(); // Assuming this closes a modal or notification
       };


       return (
              <Dialog open={isOpen} onClose={onClose} className="relative z-30">
                     <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" />
                     <div className="fixed inset-0 z-10 overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                   <div className="relative transform overflow-hidden rounded-lg bg-white text-center shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl" ref={popUpRef}>
                                          {/* Header */}
                                          <div className="w-full flex items-center justify-center gap-x-4 text-3xl font-TextFontSemiBold text-gray-500 my-5">
                                                 <MdOutlineShoppingCart className="text-4xl" />
                                                 You have {newOrders?.count || 0} new orders, Check Please.
                                          </div>

                                          {/* Footer */}
                                          <div className="px-4 py-3 mx-auto border-t-4 sm:px-6 flex justify-between">
                                                 <button
                                                        onClick={() => handleCancelOrder(newOrders?.id)}
                                                        className="mt-3 inline-flex justify-center rounded-md bg-red-600 px-6 py-3 text-xl font-TextFontMedium text-white shadow-sm hover:bg-red-700 sm:mt-0 sm:w-auto"
                                                 >
                                                        Close
                                                 </button>
                                                 <Link
                                                        to={`/dashboard/orders/details/${newOrders?.id}`}
                                                        onClick={(e) => {
                                                               e.preventDefault();
                                                               onClose();
                                                               navigate(`/dashboard/orders/details/${newOrders?.id}`);
                                                        }}
                                                        className="mt-3 inline-flex justify-center rounded-md bg-mainColor px-6 py-3 text-xl font-TextFontMedium text-white shadow-sm sm:mt-0 sm:w-auto hover:bg-mainColor-dark"
                                                 >
                                                        Ok, let me check
                                                 </Link>
                                          </div>
                                   </div>
                            </div>
                     </div>
              </Dialog>
       );
};

export default NewOrdersComponent;