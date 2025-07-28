import { createSlice } from "@reduxjs/toolkit";
import { useGet } from "../Hooks/useGet";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const apiUrl = import.meta.env.VITE_API_BASE_URL;
// Initial states
const initialUserState = null;
const initialCategoryState = null;

const initialNewOrders = {
       count: 0,
};
const initialSoundNotification = { data: null };

const initialOrdersAllState = {
       data: [],
       loading: false,
};
const initialOrdersPendingState = {
       data: [],
       loading: false,
};
const initialOrdersConfirmedState = {
       data: [],
       loading: false,
};
const initialOrdersProcessingState = {
       data: [],
       loading: false,
};
const initialOrdersOutForDeliveryState = {
       data: [],
       loading: false,
};
const initialOrdersDeliveredState = {
       data: [],
       loading: false,
};
const initialOrdersReturnedState = {
       data: [],
       loading: false,
};
const initialOrdersRefundState = {
       data: [],
       loading: false,
};
const initialOrdersFailedState = {
       data: [],
       loading: false,
};
const initialOrdersCanceledState = {
       data: [],
       loading: false,
};
const initialOrdersScheduleState = {
       data: [],
       loading: false,
};

const initialLanguage = { data: [], selected: 'en', }

// New Orders slice
const newOrdersSlice = createSlice({
       name: "newOrders",
       initialState: initialNewOrders,
       reducers: {
              setNewOrders: (state, action) => {
                     return { ...state, ...action.payload }; // Merges payload into the existing state
              },
       },
});
// Sound Notification slice
const soundNotification = createSlice({
       name: "soundNotification",
       initialState: initialSoundNotification,
       reducers: {
              setSoundNotification: (state, action) => {
                     state.data = action.payload;
              },
       },
});

// User slice
const userSlice = createSlice({
       name: "userProject",
       initialState: initialUserState,
       reducers: {
              setUser: (state, action) => {
                     return { ...state, ...action.payload };
              },
              removeUser: () => {
                     return null;
              },
       },
});

// Category slice
const categorySlice = createSlice({
       name: "category",
       initialState: initialCategoryState,
       reducers: {
              setCategory: (state, action) => {
                     return { ...state, ...action.payload };
              },
              removeCategory: () => {
                     return null;
              },
       },
});

// OrdersAll slice
const ordersAllSlice = createSlice({
       name: "ordersAll",
       initialState: initialOrdersAllState,
       reducers: {
              setOrdersAll: (state, action) => {
                     state.data = action.payload; // Update orders data
                     state.loading = false; // Set loading to false when data is set
              },
              setLoading: (state, action) => {
                     state.loading = action.payload; // Update loading state
              },
       },
});
// OrdersPending slice
const ordersPendingSlice = createSlice({
       name: "ordersPending",
       initialState: initialOrdersPendingState,
       reducers: {
              setOrdersPending: (state, action) => {
                     state.data = action.payload; // Update orders data
                     state.loading = false; // Set loading to false when data is set
              },
              setLoading: (state, action) => {
                     state.loading = action.payload; // Update loading state
              },
       },
});
// ordersConfirmed slice
const ordersConfirmedSlice = createSlice({
       name: "ordersConfirmed",
       initialState: initialOrdersConfirmedState,
       reducers: {
              setOrdersConfirmed: (state, action) => {
                     state.data = action.payload; // Update orders data
                     state.loading = false; // Set loading to false when data is set
              },
              setLoading: (state, action) => {
                     state.loading = action.payload; // Update loading state
              },
       },
});
// ordersProcessing slice
const ordersProcessingSlice = createSlice({
       name: "ordersProcessing",
       initialState: initialOrdersProcessingState,
       reducers: {
              setOrdersProcessing: (state, action) => {
                     state.data = action.payload; // Update orders data
                     state.loading = false; // Set loading to false when data is set
              },
              setLoading: (state, action) => {
                     state.loading = action.payload; // Update loading state
              },
       },
});
// ordersOutForDelivery slice
const ordersOutForDeliverySlice = createSlice({
       name: "ordersOutForDelivery",
       initialState: initialOrdersOutForDeliveryState,
       reducers: {
              setOrdersOutForDelivery: (state, action) => {
                     state.data = action.payload; // Update orders data
                     state.loading = false; // Set loading to false when data is set
              },
              setLoading: (state, action) => {
                     state.loading = action.payload; // Update loading state
              },
       },
});
// ordersDelivered slice
const ordersDeliveredSlice = createSlice({
       name: "ordersDelivered",
       initialState: initialOrdersDeliveredState,
       reducers: {
              setOrdersDelivered: (state, action) => {
                     state.data = action.payload; // Update orders data
                     state.loading = false; // Set loading to false when data is set
              },
              setLoading: (state, action) => {
                     state.loading = action.payload; // Update loading state
              },
       },
});
// ordersReturned slice
const ordersReturnedSlice = createSlice({
       name: "ordersReturned",
       initialState: initialOrdersReturnedState,
       reducers: {
              setOrdersReturned: (state, action) => {
                     state.data = action.payload; // Update orders data
                     state.loading = false; // Set loading to false when data is set
              },
              setLoading: (state, action) => {
                     state.loading = action.payload; // Update loading state
              },
       },
});
// ordersRefund slice
const ordersRefundSlice = createSlice({
       name: "ordersRefund",
       initialState: initialOrdersRefundState,
       reducers: {
              setOrdersRefund: (state, action) => {
                     state.data = action.payload; // Update orders data
                     state.loading = false; // Set loading to false when data is set
              },
              setLoading: (state, action) => {
                     state.loading = action.payload; // Update loading state
              },
       },
});
// ordersFailed slice
const ordersFailedSlice = createSlice({
       name: "ordersFailed",
       initialState: initialOrdersFailedState,
       reducers: {
              setOrdersFailed: (state, action) => {
                     state.data = action.payload; // Update orders data
                     state.loading = false; // Set loading to false when data is set
              },
              setLoading: (state, action) => {
                     state.loading = action.payload; // Update loading state
              },
       },
});
// ordersCanceled slice
const ordersCanceledSlice = createSlice({
       name: "ordersCanceled",
       initialState: initialOrdersCanceledState,
       reducers: {
              setOrdersCanceled: (state, action) => {
                     state.data = action.payload; // Update orders data
                     state.loading = false; // Set loading to false when data is set
              },
              setLoading: (state, action) => {
                     state.loading = action.payload; // Update loading state
              },
       },
});
// ordersSchedule slice
const ordersScheduleSlice = createSlice({
       name: "ordersSchedule",
       initialState: initialOrdersScheduleState,
       reducers: {
              setOrdersSchedule: (state, action) => {
                     state.data = action.payload; // Update orders data
                     state.loading = false; // Set loading to false when data is set
              },
              setLoading: (state, action) => {
                     state.loading = action.payload; // Update loading state
              },
       },
});

// Add this with your other initial states
const initialCanceledOrdersState = {
       orders: [], // Array of order IDs
       count: 0,   // Total count for badge
};

// Add this with your other slices
const canceledOrdersSlice = createSlice({
       name: "canceledOrders",
       initialState: initialCanceledOrdersState,
       reducers: {
              addCanceledOrder: (state, action) => {
                     if (!state.orders.includes(action.payload)) {
                            state.orders.push(action.payload);
                            state.count = state.orders.length;
                     }
              },
              removeCanceledOrder: (state, action) => {
                     state.orders = state.orders.filter(id => id !== action.payload);
                     state.count = state.orders.length;
              },
              clearCanceledOrders: (state) => {
                     state.orders = [];
                     state.count = 0;
              },
       },
});

/* Languages */
const languageSlice = createSlice({
       name: 'language',
       initialState: initialLanguage,
       reducers: {
              setLanguage: (state, action) => {
                state.selected = action.payload;
              },
              setLanguageData: (state, action) => {
                state.data = action.payload;
              }, 
       }
})


// Fetch and dispatch orders
export const OrdersComponent = () => {
       const dispatch = useDispatch();
       const { refetch: refetchOrders, data: dataOrders, loading} = useGet({
              url: `${apiUrl}/admin/order`,
       });

       // Log data to debug
       useEffect(() => {
              refetchOrders();
              dispatch(ordersAllSlice.actions.setLoading(loading));
              dispatch(ordersPendingSlice.actions.setLoading(loading));
              dispatch(ordersConfirmedSlice.actions.setLoading(loading));
              dispatch(ordersProcessingSlice.actions.setLoading(loading));
              dispatch(ordersOutForDeliverySlice.actions.setLoading(loading));
              dispatch(ordersDeliveredSlice.actions.setLoading(loading));
              dispatch(ordersReturnedSlice.actions.setLoading(loading));
              dispatch(ordersRefundSlice.actions.setLoading(loading));
              dispatch(ordersFailedSlice.actions.setLoading(loading));
              dispatch(ordersCanceledSlice.actions.setLoading(loading));
              dispatch(ordersScheduleSlice.actions.setLoading(loading));
       }, [refetchOrders]);




       useEffect(() => {
              if (dataOrders && Array.isArray(dataOrders.orders)) {
                     dispatch(ordersAllSlice.actions.setOrdersAll(dataOrders.orders));
                     dispatch(ordersPendingSlice.actions.setOrdersPending(dataOrders.pending));
                     dispatch(ordersConfirmedSlice.actions.setOrdersConfirmed(dataOrders.confirmed));
                     dispatch(ordersProcessingSlice.actions.setOrdersProcessing(dataOrders.processing));
                     dispatch(ordersOutForDeliverySlice.actions.setOrdersOutForDelivery(dataOrders.out_for_delivery));
                     dispatch(ordersDeliveredSlice.actions.setOrdersDelivered(dataOrders.delivered));
                     dispatch(ordersReturnedSlice.actions.setOrdersReturned(dataOrders.returned));
                     dispatch(ordersRefundSlice.actions.setOrdersRefund(dataOrders.refund));
                     dispatch(ordersFailedSlice.actions.setOrdersFailed(dataOrders.faild_to_deliver));
                     dispatch(ordersCanceledSlice.actions.setOrdersCanceled(dataOrders.canceled));
                     dispatch(ordersScheduleSlice.actions.setOrdersSchedule(dataOrders.scheduled));
              } 
       }, [dataOrders]);



       return null; // No UI returned
};

// Fetch and dispatch orders

// const dispatch = useDispatch();
// const { refetch: refetchOrders, data: dataOrders, loading, error } = useGet({
//        url: `${apiUrl} / admin / order`,
// });

// useEffect(() => {
//        if (dataOrders && Array.isArray(dataOrders.orders)) {
//               dispatch(newOrdersSlice.actions.setNewOrders(dataOrders.orders));
//        }
// }, [dataOrders]);




// Export actions
export const { setNewOrders } = newOrdersSlice.actions;
export const { setSoundNotification } = soundNotification.actions;

export const { setUser, removeUser } = userSlice.actions;
export const { setCategory, removeCategory } = categorySlice.actions;
export const { setOrdersAll } = ordersAllSlice.actions;
export const { setOrdersPending } = ordersPendingSlice.actions;
export const { setOrdersConfirmed } = ordersConfirmedSlice.actions;
export const { setOrdersProcessing } = ordersProcessingSlice.actions;
export const { setOrdersOutForDelivery } = ordersOutForDeliverySlice.actions;
export const { setOrdersDelivered } = ordersDeliveredSlice.actions;
export const { setOrdersReturned } = ordersReturnedSlice.actions;
export const { setOrdersRefund } = ordersRefundSlice.actions;
export const { setOrdersFailed } = ordersFailedSlice.actions;
export const { setOrdersCanceled } = ordersCanceledSlice.actions;
export const { setOrdersSchedule } = ordersScheduleSlice.actions;
export const { setLanguage ,setLanguageData } = languageSlice.actions;

// Export reducers
export const newOrdersReducer = newOrdersSlice.reducer;
export const soundNotificationReducer = soundNotification.reducer;

export const userReducer = userSlice.reducer;
export const categoryReducer = categorySlice.reducer;
export const ordersAllReducer = ordersAllSlice.reducer;
export const ordersPendingReducer = ordersPendingSlice.reducer;
export const ordersConfirmedReducer = ordersConfirmedSlice.reducer;
export const ordersProcessingReducer = ordersProcessingSlice.reducer;
export const ordersOutForDeliveryReducer = ordersOutForDeliverySlice.reducer;
export const ordersDeliveredReducer = ordersDeliveredSlice.reducer;
export const ordersReturnedReducer = ordersReturnedSlice.reducer;
export const ordersRefundReducer = ordersRefundSlice.reducer;
export const ordersFailedReducer = ordersFailedSlice.reducer;
export const ordersCanceledReducer = ordersCanceledSlice.reducer;
export const ordersScheduleReducer = ordersScheduleSlice.reducer;
export const languageReducer = languageSlice.reducer;


// Add to your exports
export const { addCanceledOrder, removeCanceledOrder, clearCanceledOrders } = canceledOrdersSlice.actions;
export const canceledOrdersReducer = canceledOrdersSlice.reducer;