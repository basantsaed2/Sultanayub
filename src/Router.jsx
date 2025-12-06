import { createBrowserRouter, Outlet } from "react-router-dom";
import {
  AddonsLayout,
  AddProductLayout,
  AllOrdersLayout,
  BannersLayout,
  BranchesLayout,
  CanceledOrdersLayout,
  CancelTimeLayout,
  CategoryLayout,
  CitiesLayout,
  ConfirmedOrdersLayout,
  DashboardLayout,
  DealOrderLayout,
  DeliveredOrdersLayout,
  DeliveryManLayout,
  DeliveryTimeLayout,
  DetailsOrderLayout,
  DiscountLayout,
  EditAddonsLayout,
  EditBannerLayout,
  EditBranchLayout,
  EditCategoryLayout,
  EditCityLayout,
  EditDeliveryManLayout,
  EditDiscountLayout,
  EditOfferLayout,
  EditPaymentMethodLayout,
  EditProductLayout,
  EditTaxLayout,
  EditZoneLayout,
  FailedOrdersLayout,
  ForgetPassLayout,
  InvoiceOrderLayout,
  LanguagesLayout,
  LoginLayout,
  OffersLayout,
  OrdersPaymentLayout,
  OrderTypeLayout,
  OutForDeliveryOrdersLayout,
  PaymentMethodLayout,
  PendingOrdersLayout,
  ProcessingOrdersLayout,
  ProductLayout,
  ResturantTimeLayout,
  ReturnedOrdersLayout,
  ScheduleOrdersLayout,
  SongLayout,
  TaxesLayout,
  TaxTypeLayout,
  ZonesLayout,
  CouponLayout,
  EditCouponLayout,
  BuyOfferLayout,
  DealsLayout,
  EditDealLayout,
  AutomaticPaymentLayout,
  CustomersLayout,
  EditCustomersLayout,
  BusinessSetupLayout,
  EditRoleLayout,
  RolesLayout,
  AdminsLayout,
  EditAdminLayout,
  MenuLayout,
  BranchCategoryLayout,
  CategoryProductLayout,
  ProductVariationLayout,
  VariationOptionLayout,
  EmailLayout,
  AddRoleLayout,
  ScheduleTimeLayout,
  EditScheduleTimeLayout,
  RefundOrdersLayout,
  CancelationNotificationLayout,
  PolicySupportLayout,
  CaptianOrderLayout,
  AddCaptianOrderLayout,
  EditCaptianOrderLayout,
  WaiterLayout,
  AddWaiterLayout,
  EditWaiterLayout,
  VoidReasonLayout,
  EditVoidReasonLayout,
  AddHallLocationsLayout,
} from "./layouts/Layouts";
import ProtectedLogin from "./ProtectedData/ProtectedLogin";
import NotFoundPage from "./Pages/NotFoundPage/NotFoundPage";
import App from "./App";
import { AddBranchSection, AddFinacialAccountPage, AddHallLocations, AddWaiter, BusinessSettingsPage, CustomerLoginPage, EditFinacialAccountPage, EditHallLocations, EditRolePage, FinacialAccountPage, HallLocations, MainBranchSetupPage, OrdersPage, OrdersPaymentHistoryPage, OrdersPaymentPendingPage, RestaurantTimeSlotPage } from "./Pages/Pages";
import LogOrders from "./Pages/Dashboard/Admin/Orders/LogOrders/LogOrders";
import EditEmailPage from "./Pages/Dashboard/Admin/Setting/Email/EditEmail";
import GroupLayout from "./layouts/Dashboard/Setting/Group/GroupLayout";
import EditGroupLayout from "./layouts/Dashboard/Setting/Group/EditGroupLayout";
import ExtraLayout from "./layouts/Dashboard/Setting/Extra/ExtraLayout";
import EditExtraLayout from "./layouts/Dashboard/Setting/Extra/EditExtraLayout";
import AppSetupLayout from "./layouts/Dashboard/Setting/AppSetup/AppSetupLayout";
//import ToggleItems from "./Pages/Dashboard/Admin/ProductSetup/ToggleItems";
import BranchList from "./DashboardBranches/BranchList";
import BranchCustomer from "./DashboardBranches/BranchCustomer/BranchCustomer";
import BranchCustomerAdd from "./DashboardBranches/BranchCustomer/BranchCustomerAdd";
import BranchAddressAdd from "./DashboardBranches/BranchCustomer/BranchAddressAdd";
import BranchOffer from "./DashboardBranches/BranchOffer";
import KitchenType from "./Pages/Dashboard/Admin/Setting/Branches/KitchenType/KitchenType";
import AddKitchenType from "./Pages/Dashboard/Admin/Setting/Branches/KitchenType/AddKitchenType";
import EditKitchenType from "./Pages/Dashboard/Admin/Setting/Branches/KitchenType/EditKitchenType";
import HallLocationsLayout from "./layouts/Dashboard/Setting/HallLocations/HallLocationsLayout";
import TablesLayout from "./layouts/Dashboard/Setting/Tables/TablesLayout";
import EditTablesLayout from "./layouts/Dashboard/Setting/Tables/EditTablesLayout";
import EditHallLocationLayout from "./layouts/Dashboard/Setting/HallLocations/EditHallLocationLayout";
import CaptianOrder from "./Pages/Dashboard/Admin/CapitanOrder/CapitanOrder";
import AddCaptianOrder from "./Pages/Dashboard/Admin/CapitanOrder/AddCapitanOrder";
import EditCaptianOrder from "./Pages/Dashboard/Admin/CapitanOrder/EditCapitanOrder";
import LandingPage from "./LandingPage/LandingPage";
import Cashier from "./Pages/Dashboard/Admin/Cashier/Cashier";
import AddCashier from "./Pages/Dashboard/Admin/Cashier/AddCashier";
import EditCashier from "./Pages/Dashboard/Admin/Cashier/EditCashier";
import CashierMan from "./Pages/Dashboard/Admin/CashierMan/CashierMan";
import AddCashierMan from "./Pages/Dashboard/Admin/CashierMan/AddCashierMan";
import EditCashierMan from "./Pages/Dashboard/Admin/CashierMan/EditCashierMan";
import CustomersDue from "./Pages/Dashboard/Admin/Users/CustomersDue/CustomersDue";
import Upselling from "./Pages/Dashboard/Admin/Upselling/Upselling";
import AddUpselling from "./Pages/Dashboard/Admin/Upselling/AddUpselling";
import EditUpselling from "./Pages/Dashboard/Admin/Upselling/EditUpselling";
import GroupModules from "./Pages/Dashboard/Admin/GroupModules/GroupModules";
import GroupModuleProducts from "./Pages/Dashboard/Admin/GroupModules/GroupModuleProduct";
import AddGroupModules from "./Pages/Dashboard/Admin/GroupModules/AddGroupModules";
import EditGroupModules from "./Pages/Dashboard/Admin/GroupModules/EditGroupModules";
import OrderPercentage from "./Pages/Dashboard/Admin/Setting/OrderPercentage/OrderPercentage";
import Recipes from "./Pages/Dashboard/Admin/ProductSetup/Recipes/Recipes";
import AddRecipes from "./Pages/Dashboard/Admin/ProductSetup/Recipes/AddRecipes";
import EditRecipes from "./Pages/Dashboard/Admin/ProductSetup/Recipes/EditRecipes";
import DiscountModule from "./Pages/Dashboard/Admin/Setting/DiscountModule/DiscountModule";
import AddDiscountModule from "./Pages/Dashboard/Admin/Setting/DiscountModule/AddDiscountModule";
import EditDiscountModule from "./Pages/Dashboard/Admin/Setting/DiscountModule/EditDiscountModule";
import DiscountCode from "./Pages/Dashboard/Admin/Setting/DiscountCode/DiscountCode";
import AddDiscountCode from "./Pages/Dashboard/Admin/Setting/DiscountCode/AddDiscountCode";
import EditDiscountCode from "./Pages/Dashboard/Admin/Setting/DiscountCode/EditDiscountCode";
import SinglePageDetails from "./Pages/Dashboard/Admin/Users/Customers/SinglePageDetails";
import ExpensesCategory from "./Pages/Dashboard/Admin/Expenses/ExpensesCategory/ExpensesCategory";
import AddExpensesCategory from "./Pages/Dashboard/Admin/Expenses/ExpensesCategory/AddExpensesCategory";
import EditExpensesCategory from "./Pages/Dashboard/Admin/Expenses/ExpensesCategory/EditExpensesCategory";
import OrdersReports from "./Pages/Dashboard/Admin/Reports/OrdersReports/OrdersReports";
import CashierShiftReport from "./Pages/Dashboard/Admin/Reports/CashierShiftReport/CashierShiftReport";
import FinacialReports from "./Pages/Dashboard/Admin/Reports/FinacialReports/FinacialReports";
import ExpensesList from "./Pages/Dashboard/Admin/Expenses/ExpensesList/ExpensesList";
import AddExpensesList from "./Pages/Dashboard/Admin/Expenses/ExpensesList/AddExpensesList";
import EditExpensesList from "./Pages/Dashboard/Admin/Expenses/ExpensesList/EditExpensesList";
import ExpensesPayment from "./Pages/Dashboard/Admin/Expenses/ExpensesPayment/ExpensesPayment";
import ServiceFees from "./Pages/Dashboard/Admin/ServiceFees/ServiceFees";
import AddServiceFees from "./Pages/Dashboard/Admin/ServiceFees/AddServiceFees";
import EditServiceFees from "./Pages/Dashboard/Admin/ServiceFees/EditServiceFees";
import MaterialCategory from "./Pages/Dashboard/Admin/MaterialModule/MaterialCategory/MaterialCategory";
import AddMaterialCategory from "./Pages/Dashboard/Admin/MaterialModule/MaterialCategory/AddMaterialCategory";
import EditMaterialCategory from "./Pages/Dashboard/Admin/MaterialModule/MaterialCategory/EditMaterialCategory";
import MaterialList from "./Pages/Dashboard/Admin/MaterialModule/MaterialList/MaterialList";
import AddMaterialList from "./Pages/Dashboard/Admin/MaterialModule/MaterialList/AddMaterialList";
import EditMaterialList from "./Pages/Dashboard/Admin/MaterialModule/MaterialList/EditMaterialList";
import ManufacturingHistory from "./Pages/Dashboard/Admin/Manufacturing/ManufacturingHistory";
import AddManufacturing from "./Pages/Dashboard/Admin/Manufacturing/AddManufacturing";
import PurchaseCategory from "./Pages/Dashboard/Admin/Purchase/PurchaseCategory/PurchaseCategory";
import AddPurchaseCategory from "./Pages/Dashboard/Admin/Purchase/PurchaseCategory/AddPurchaseCategory";
import EditPurchaseCategory from "./Pages/Dashboard/Admin/Purchase/PurchaseCategory/EditPurchaseCategory";
import PurchaseProduct from "./Pages/Dashboard/Admin/Purchase/PurchaseProduct/PurchaseProduct";
import AddPurchaseProduct from "./Pages/Dashboard/Admin/Purchase/PurchaseProduct/AddPurchaseProduct";
import EditPurchaseProduct from "./Pages/Dashboard/Admin/Purchase/PurchaseProduct/EditPurchaseProduct";
import PurchaseConsumersion from "./Pages/Dashboard/Admin/Purchase/PurchaseConsumersion/PurchaseConsumersion";
import AddPurchaseConsumersion from "./Pages/Dashboard/Admin/Purchase/PurchaseConsumersion/AddPurchaseConsumersion";
import EditPurchaseConsumersion from "./Pages/Dashboard/Admin/Purchase/PurchaseConsumersion/EditPurchaseConsumersion";
import PurchaseWasted from "./Pages/Dashboard/Admin/Purchase/PurchaseWasted/PurchaseWasted";
import AddPurchaseWasted from "./Pages/Dashboard/Admin/Purchase/PurchaseWasted/AddPurchaseWasted";
import EditPurchaseWasted from "./Pages/Dashboard/Admin/Purchase/PurchaseWasted/EditPurchaseWasted";
import PurchaseList from "./Pages/Dashboard/Admin/Purchase/PurchaseList/PurchaseList";
import AddPurchaseList from "./Pages/Dashboard/Admin/Purchase/PurchaseList/AddPurchaseList";
import EditPurchaseList from "./Pages/Dashboard/Admin/Purchase/PurchaseList/EditPurchaseList";
import PurchaseTransfer from "./Pages/Dashboard/Admin/Purchase/PurchaseTransfer/PurchaseTransfer";
import PreparationMan from "./Pages/Dashboard/Admin/Setting/Branches/PreparationMan/PreparationMan";
import AddPreparationMan from "./Pages/Dashboard/Admin/Setting/Branches/PreparationMan/AddPreparationMan";
import EditPreparationMan from "./Pages/Dashboard/Admin/Setting/Branches/PreparationMan/EditPreparationMan";
import DeliveryManOrdersParent from "./Pages/Dashboard/Admin/DeliveryMan/DeliveryManOrder/DeliveryManOrdersParent";
import ReceiptLanguage from "./Pages/Dashboard/Admin/Setting/ReceiptLanguage/ReceiptLanguage";
import OrdersDeliveryParent from "./Pages/Dashboard/Admin/OrdersDelivery/OrdersDeliveryParent";
import DeletedCustomer from "./Pages/Dashboard/Admin/Users/DeletedCustomer/DeletedCustomer";
import DueGroupModule from "./Pages/Dashboard/Admin/GroupModules/DueGroupModule";
import LanguageSystem from "./Pages/Dashboard/Admin/Setting/LanguageSystem/LanguageSystem";
import Store from "./Pages/Dashboard/Admin/Store/Store";
import AddStore from "./Pages/Dashboard/Admin/Store/AddStore";
import EditStore from "./Pages/Dashboard/Admin/Store/EditStore";
import StoreMan from "./Pages/Dashboard/Admin/StoreMan/StoreMan";
import AddStoreMan from "./Pages/Dashboard/Admin/StoreMan/AddStoreMan";
import EditStoreMan from "./Pages/Dashboard/Admin/StoreMan/EditStoreMan";
// import ReceiptLanguage from "./Pages/Dashboard/Admin/Setting/ReceiptLanguage/ReceiptLanguage";

const ProductSetupLayout = () => {
  return <Outlet />;
}
const SettingLayout = () => {
  return <Outlet />;
}
const OrderLayout = () => {
  return (
    <Outlet />
  );
};
const AppBranchCategoryLayout = () => {
  return (
    <Outlet />
  );
};

export const router = createBrowserRouter([

  // {
  //   patgh: "/",
  //   element: <ProtectedLogin />,
  //   children: [
  //     {
  //       path: '',
  //       element: <LandingPage />,
  //     }
  //   ] 
  // },
  /* Login Admin */
  {
    path: "/",
    element: <ProtectedLogin />,
    children: [
      {
        path: '',
        element: <LoginLayout />,
      }
    ]
  },

  /* Forget Password User */
  {
    path: "/forget_password",
    element: <ProtectedLogin />,
    children: [
      {
        path: '',
        element: <ForgetPassLayout />,
      }
    ]
  },
  {/** 
    {
    path: "/product/:id",
    element: <ToggleItems />
  },
  */},

  /* Dashboard Branch or main app routes after login */
  {
    path: "/branch",
    element: <ProtectedLogin />,
    children: [
      {
        path: "",
        element: <App />,
        children: [
          {
            path: '',
            element: <DashboardLayout />
          },
          {
            path: "deals",
            element: <BranchList />,
          },
          {
            path: "customer",
            children: [
              {
                path: "",
                index: true,
                element: <BranchCustomer />,
              },
              {
                path: "add",
                element: <BranchCustomerAdd />

              },
              {
                path: "address-add",
                element: <BranchAddressAdd />,
              },
              {
                path: "edit-address/:id",
                element: <BranchAddressAdd />
              },
            ],
          },
          {
            path: "order-offers",
            children: [
              {
                path: "",
                index: true,
                element: <BranchOffer />,
              },
              {
                path: "add",
                element: <BranchCustomerAdd />

              },
              {
                path: "address-add",
                element: <BranchAddressAdd />,
              },
              {
                path: "edit-address/:id",
                element: <BranchAddressAdd />
              },
            ],

          },
          {
            path: "orders",
            element: <OrderLayout />,
            children: [
              /* All orders */
              {
                path: "all",
                element: <AllOrdersLayout />,
              },
              {
                path: "pending",
                element: <PendingOrdersLayout />,
              },
              {
                path: "confirmed",
                element: <ConfirmedOrdersLayout />,
              },
              {
                path: "processing",
                element: <ProcessingOrdersLayout />,
              },
              {
                path: "out_for_delivery",
                element: <OutForDeliveryOrdersLayout />,
              },
              {
                path: "delivered",
                element: <DeliveredOrdersLayout />,
              },
              {
                path: "returned",
                element: <ReturnedOrdersLayout />,
              },
              {
                path: "refund",
                element: <RefundOrdersLayout />,
              },
              {
                path: "failed",
                element: <FailedOrdersLayout />,
              },
              {
                path: "canceled",
                element: <CanceledOrdersLayout />,
              },
              {
                path: "schedule",
                element: <ScheduleOrdersLayout />,
              },
              {
                path: "log",
                element: <LogOrders />,
              },

              /* Details Order */
              {
                path: "details/:orderId",
                element: <DetailsOrderLayout />,
              },
              /* Invoice Order */
              {
                path: "invoice/:orderId",
                element: <InvoiceOrderLayout />,
              },
            ],
          },

        ],
      },
    ],
  },

  /* Dashboard or main app routes after login */
  {
    path: "/dashboard",
    element: <ProtectedLogin />,
    children: [
      {
        path: '',
        element: <App />,
        children: [
          {
            path: '',
            element: <DashboardLayout />
          },
          {
            path: 'addons',
            children: [
              {
                path: '',
                element: <AddonsLayout />,
              },
              {
                path: 'edit/:addonId',
                element: <EditAddonsLayout />,
              }
            ]
          },
          {
            path: 'category',
            children: [
              {
                path: '',
                element: <CategoryLayout />,
              },
              {
                path: 'edit/:categoryId',
                element: <EditCategoryLayout />,
              }
            ]
          },
          {
            path: 'banners',
            children: [
              {
                path: '',
                element: <BannersLayout />,
              },
              {
                path: 'edit/:bannerId',
                element: <EditBannerLayout />,
              }
            ]
          },

          {
            path: 'setup_product',
            element: <ProductSetupLayout />,
            children: [
              {
                path: 'product',
                element: <Outlet />,
                children: [
                  {
                    path: '',
                    element: <ProductLayout />,
                  },
                  {
                    path: 'recipes/:productId',
                    element: <Outlet />,
                    children: [
                      {
                        path: '',
                        element: <Recipes />,
                      },
                      {
                        path: 'add',
                        element: <AddRecipes />,
                      },
                      {
                        path: 'edit/:recipeId',
                        element: <EditRecipes />,
                      }
                    ]
                  }
                ]
              },
              {
                path: 'product/add',
                element: <AddProductLayout />,
              },
              {
                path: 'product/edit/:productId',
                element: <EditProductLayout />,
              }
            ]
          },
          {
            path: 'branches',
            children: [
              {
                path: '',
                element: <BranchesLayout />,
              },
              {
                path: 'add',
                element: <AddBranchSection />,
              },
              {
                path: 'edit/:branchId',
                element: <EditBranchLayout />,
              },
              {
                path: 'branch_kitchen/:branchId',
                element: <Outlet />,
                children: [
                  {
                    path: '',
                    element: <KitchenType />,
                  },
                  {
                    path: 'add',
                    element: <AddKitchenType />,
                  },
                  {
                    path: 'edit/:kitchenId',
                    element: <EditKitchenType />,
                  },
                ]
              },
              {
                path: 'branch_birsta/:branchId',
                element: <Outlet />,
                children: [
                  {
                    path: '',
                    element: <KitchenType />,
                  },
                  {
                    path: 'add',
                    element: <AddKitchenType />,
                  },
                  {
                    path: 'edit/:birstaId',
                    element: <EditKitchenType />,
                  },
                ]
              },
              {
                path: 'branch_category/:branchId',
                element: <AppBranchCategoryLayout />,
                children: [
                  {
                    path: '',
                    element: <BranchCategoryLayout />,
                  },
                  {
                    path: 'category_product/:productId',
                    element: <CategoryProductLayout />,
                  },
                  {
                    path: 'product_variation/:variationId',
                    element: <ProductVariationLayout />,
                  },
                  {
                    path: 'variation_option/:optionId',
                    element: <VariationOptionLayout />,
                  }
                ]
              },
              {
                path: "preparation_man/:branchId",
                element: <Outlet />,
                children: [
                  {
                    path: '',
                    element: <PreparationMan />
                  },
                  {
                    path: 'add',
                    element: <AddPreparationMan />
                  },
                  {
                    path: 'edit/:preparationManId',
                    element: <EditPreparationMan />
                  }
                ]
              },
            ]
          },
          {
            path: 'setting',
            element: <SettingLayout />,
            children: [
              {
                path: 'roles',
                children: [
                  {
                    path: '',
                    element: <RolesLayout />,
                  },
                  {
                    path: 'add',
                    element: <AddRoleLayout />
                  },
                  {
                    path: "edit/:roleId",
                    element: <EditRolePage />
                  }]
              },
              {
                path: 'payment_method',
                children: [
                  {
                    path: '',
                    children: [
                      {
                        index: true,
                        element: <PaymentMethodLayout />,
                      },
                      {
                        path: 'edit/:paymentMethodId',
                        element: <EditPaymentMethodLayout />
                      }
                    ]
                  },
                ]
              },
              {
                path: 'financial_account',
                children: [
                  {
                    path: '',
                    children: [
                      {
                        index: true,
                        element: <FinacialAccountPage />,
                      },
                      {
                        path: 'add',
                        element: <AddFinacialAccountPage />
                      },
                      {
                        path: 'edit/:financialId',
                        element: <EditFinacialAccountPage />
                      }
                    ]
                  },
                ]
              },
              {
                path: 'menu',
                children: [
                  {
                    path: '',
                    children: [
                      {
                        index: true,
                        element: <MenuLayout />,
                      },
                    ]
                  },
                ]
              },
              {
                path: 'automatic_payment',
                children: [
                  {
                    path: '',
                    element: <AutomaticPaymentLayout />,
                  },
                  // {
                  //   path: 'edit/:cityId',
                  //   element: <EditCityLayout />,
                  // }
                ]
              },
              {
                path: 'cities',
                children: [
                  {
                    path: '',
                    element: <CitiesLayout />,
                  },
                  {
                    path: 'edit/:cityId',
                    element: <EditCityLayout />,
                  }
                ]
              },
              {
                path: 'schedule_time',
                children: [
                  {
                    path: '',
                    element: <ScheduleTimeLayout />,
                  },
                  {
                    path: 'edit/:scheduleId',
                    element: <EditScheduleTimeLayout />,
                  }
                ]
              },
              // {
              //   path: 'branches',
              //   children: [
              //     {
              //       path: '',
              //       element: <BranchesLayout />,
              //     },
              //     {
              //       path: 'edit/:branchId',
              //       element: <EditBranchLayout />,
              //     },
              //     {
              //       path: 'branch_category/:branchId',
              //       element: <AppBranchCategoryLayout />,
              //       children:[
              //         {
              //           path: '',
              //           element: <BranchCategoryLayout />,
              //         },
              //         {
              //           path: 'category_product/:productId',
              //           element: <CategoryProductLayout />,
              //         },
              //         {
              //           path: 'product_variation/:variationId',
              //           element: <ProductVariationLayout />,
              //         },
              //         {
              //           path: 'variation_option/:optionId',
              //           element: <VariationOptionLayout />,
              //         }
              //       ]
              //     }
              //   ]
              // },
              {
                path: 'hall_locations',
                children: [
                  {
                    path: '',
                    children: [
                      {
                        index: true,
                        element: <HallLocationsLayout />,
                      },
                      {
                        path: 'add',
                        element: <AddHallLocationsLayout />,
                      },
                      {
                        path: 'edit/:hallId',
                        element: <EditHallLocationLayout />
                      }
                    ]
                  },
                ]
              },
              {
                path: 'hall_tables',
                children: [
                  {
                    path: '',
                    children: [
                      {
                        index: true,
                        element: <TablesLayout />,
                      },
                      {
                        path: 'edit/:tableId',
                        element: <EditTablesLayout />
                      }
                    ]
                  },
                ]
              },
              {
                path: 'zones',
                children: [
                  {
                    path: '',
                    element: <ZonesLayout />,
                  },
                  {
                    path: 'edit/:zoneId',
                    element: <EditZoneLayout />,
                  }
                ]
              },
              {
                path: 'groups',
                children: [
                  {
                    path: '',
                    element: <GroupLayout />,
                  },
                  {
                    path: 'edit/:groupId',
                    element: <EditGroupLayout />,
                  },
                  {
                    path: 'view/:groupExtraId',
                    element: <Outlet />,
                    children: [
                      {
                        path: "",
                        element: <ExtraLayout />
                      },
                      {
                        path: 'edit/:groupEditExtraId',
                        element: <EditExtraLayout />,
                      },
                    ]
                  }
                ]
              },
              {
                path: 'order_type',
                element: <OrderTypeLayout />,
              },
              {
                path: 'resturant_time',
                element: <ResturantTimeLayout />,
              },
              {
                path: 'cancel_time',
                element: <CancelTimeLayout />,
              },
              {
                path: 'delivery_time',
                element: <DeliveryTimeLayout />,
              },
              {
                path: 'sound',
                element: <SongLayout />,
              },
              {
                path: 'cancelation_notification',
                element: <CancelationNotificationLayout />,
              },
              {
                path: 'policy_support',
                element: <PolicySupportLayout />,
              },
              {
                path: 'receipt_language',
                element: <ReceiptLanguage />,
              },
              {
                path: 'app_setup',
                element: <AppSetupLayout />,
              },
              {
                path: 'void_reason',
                children: [
                  {
                    path: '',
                    children: [
                      {
                        index: true,
                        element: <VoidReasonLayout />,
                      },
                      {
                        path: 'edit/:voidReasonId',
                        element: <EditVoidReasonLayout />
                      }
                    ]
                  },
                ]
              },
              {
                path: 'order_percentage',
                children: [
                  {
                    path: '',
                    children: [
                      {
                        index: true,
                        element: <OrderPercentage />,
                      },
                    ]
                  },
                ]
              },
              {
                path: 'discount_code',
                children: [
                  {
                    path: '',
                    children: [
                      {
                        index: true,
                        element: <DiscountCode />,
                      },
                      {
                        path: 'add',
                        element: <AddDiscountCode />,
                      },
                      {
                        path: 'edit/:codeId',
                        element: <EditDiscountCode />
                      }
                    ]
                  },
                ]
              },
              {
                path: 'language_system',
                element: <LanguageSystem />
              }
            ]
          },
          {
            path: 'taxes',
            children: [
              {
                path: 'all_taxes',
                children: [
                  {
                    path: '',
                    element: <TaxesLayout />,
                  },
                  {
                    path: 'edit/:taxId',
                    element: <EditTaxLayout />,
                  }
                ]
              },
              {
                path: 'tax_type',
                element: <TaxTypeLayout />,
              },
            ]
          },
          {
            path: 'orders_payment',
            element: <OrdersPaymentLayout />,

            children: [
              {
                path: 'payment_pending',
                element: <OrdersPaymentPendingPage />,
              },
              {
                path: 'payment_history',
                element: <OrdersPaymentHistoryPage />,
              },
            ]
          },
          {
            path: 'delivery_man',
            children: [
              {
                path: '',
                element: <DeliveryManLayout />,
              },
              {
                path: 'edit/:deliveryManId',
                element: <EditDeliveryManLayout />,
              },
              {
                path: 'delivery-man-orders/:id',
                element: <DeliveryManOrdersParent />
              }
            ]
          },
          {
            path: 'users',
            children: [
              {
                path: 'admins',
                children: [
                  {
                    path: '',
                    element: <AdminsLayout />,
                  },
                  {
                    path: 'edit/:adminId',
                    element: <EditAdminLayout />,
                  }
                ]
              },
              {
                path: 'customers',
                children: [
                  {
                    path: '',
                    element: <CustomersLayout />,
                  },
                  {
                    path: 'edit/:customerId',
                    element: <EditCustomersLayout />,
                  },
                  {
                    path: 'customer/:userId',
                    element: <SinglePageDetails />,
                  }
                ]
              },
              {
                path: "due_customers",
                element: <CustomersDue />,
              },
              {
                path: "deleted_customers",
                element: <DeletedCustomer />,
              }
            ]
          },
          {
            path: 'business_setup',
            element: <BusinessSetupLayout />,

            children: [
              {
                path: 'business_settings',
                element: <BusinessSettingsPage />,
              },
              {
                path: 'main_branch_setup',
                element: <MainBranchSetupPage />,
              },
              {
                path: 'restaurant_time_slot',
                element: <RestaurantTimeSlotPage />,
              },
              {
                path: 'customer_login',
                element: <CustomerLoginPage />,
              },
              {
                path: 'orders',
                element: <OrdersPage />,
              },
            ]
          },
          {
            path: 'deals',
            children: [
              {
                path: '',
                element: <DealsLayout />,
              },
              {
                path: 'edit/:dealId',
                element: <EditDealLayout />,
              }
            ]
          },
          {
            path: 'offers',
            children: [
              {
                path: '',
                element: <OffersLayout />,
              },
              {
                path: 'edit/:offerId',
                element: <EditOfferLayout />,
              }
            ]
          },
          {
            path: 'coupon',
            children: [
              {
                path: '',
                element: <CouponLayout />,
              },
              {
                path: 'edit/:couponId',
                element: <EditCouponLayout />,
              }
            ]
          },
          {
            path: 'languages',
            children: [
              {
                path: '',
                element: <LanguagesLayout />,
              },
            ]
          },
          {
            path: 'discount',
            children: [
              {
                path: '',
                element: <DiscountLayout />,
              },
              {
                path: 'edit/:discountId',
                element: <EditDiscountLayout />,
              }
            ]
          },
          {
            path: 'deal_order',
            element: <DealOrderLayout />,
          },
          {
            path: 'buy_offer',
            element: <BuyOfferLayout />,
          },


          {
            path: 'emails',
            children: [
              {
                path: '',
                element: <EmailLayout />,
              },
              {
                path: "edit/:emailId",
                element: <EditEmailPage />
              }]
          },

          {
            path: 'orders',
            element: <OrderLayout />,
            children: [
              /* All orders */
              {
                path: 'all',
                element: <AllOrdersLayout />
              },
              {
                path: 'pending',
                element: <PendingOrdersLayout />
              },
              {
                path: 'confirmed',
                element: <ConfirmedOrdersLayout />
              },
              {
                path: 'processing',
                element: <ProcessingOrdersLayout />
              },
              {
                path: 'out_for_delivery',
                element: <OutForDeliveryOrdersLayout />
              },
              {
                path: 'delivered',
                element: <DeliveredOrdersLayout />
              },
              {
                path: 'returned',
                element: <ReturnedOrdersLayout />
              },
              {
                path: 'refund',
                element: <RefundOrdersLayout />
              },
              {
                path: 'failed',
                element: <FailedOrdersLayout />
              },
              {
                path: 'canceled',
                element: <CanceledOrdersLayout />
              },
              {
                path: 'schedule',
                element: <ScheduleOrdersLayout />
              },
              {
                path: 'log',
                element: <LogOrders />
              },

              /* Details Order */
              {
                path: 'details/:orderId',
                element: <DetailsOrderLayout />
              },
              /* Invoice Order */
              {
                path: 'invoice/:orderId',
                element: <InvoiceOrderLayout />
              },
            ]
          },

          {
            path: "all_orders_delivery",
            element: <OrdersDeliveryParent />
          },

          {
            path: "captain_order",
            element: <Outlet />,
            children: [
              {
                path: "",
                element: <CaptianOrderLayout />
              },
              {
                path: "add",
                element: <AddCaptianOrderLayout />
              },
              {
                path: "edit/:captainId",
                element: <EditCaptianOrderLayout />
              }
            ]
          },

          {
            path: "waiter",
            element: <Outlet />,
            children: [
              {
                path: "",
                element: <WaiterLayout />
              },
              {
                path: "add",
                element: <AddWaiterLayout />
              },
              {
                path: "edit/:waiterId",
                element: <EditWaiterLayout />
              }
            ]
          },
          {
            path: "cashier",
            element: <Outlet />,
            children: [
              {
                path: '',
                element: <Cashier />
              },
              {
                path: 'add',
                element: <AddCashier />
              },
              {
                path: 'edit/:cashierId',
                element: <EditCashier />
              }
            ]
          },
          {
            path: "cashier_man",
            element: <Outlet />,
            children: [
              {
                path: '',
                element: <CashierMan />
              },
              {
                path: 'add',
                element: <AddCashierMan />
              },
              {
                path: 'edit/:cashierManId',
                element: <EditCashierMan />
              }
            ]
          },
          {
            path: "upselling",
            element: <Outlet />,
            children: [
              {
                path: '',
                element: <Upselling />
              },
              {
                path: 'add',
                element: <AddUpselling />
              },
              {
                path: 'edit/:upsellingId',
                element: <EditUpselling />
              }
            ]
          },
          {
            path: 'discount_module',
            children: [
              {
                path: '',
                children: [
                  {
                    index: true,
                    element: <DiscountModule />,
                  },
                  {
                    path: 'add',
                    element: <AddDiscountModule />,
                  },
                  {
                    path: 'edit/:moduleId',
                    element: <EditDiscountModule />
                  }
                ]
              },
            ]
          },
          {
            path: "service_fees",
            element: <Outlet />,
            children: [
              {
                path: '',
                element: <ServiceFees />
              },
              {
                path: 'add',
                element: <AddServiceFees />
              },
              {
                path: 'edit/:serviceFeeId',
                element: <EditServiceFees />
              }
            ]
          },
          {
            path: 'purchase',
            element: <Outlet />,
            children: [
              {
                path: 'purchase_list',
                children: [
                  {
                    path: '',
                    children: [
                      {
                        index: true,
                        element: <PurchaseList />,
                      },
                      {
                        path: 'add',
                        element: <AddPurchaseList />,
                      },
                      {
                        path: 'edit/:purchaseListId',
                        element: <EditPurchaseList />
                      }
                    ]
                  },
                ]
              },
              {
                path: 'purchase_category',
                children: [
                  {
                    path: '',
                    children: [
                      {
                        index: true,
                        element: <PurchaseCategory />,
                      },
                      {
                        path: 'add',
                        element: <AddPurchaseCategory />,
                      },
                      {
                        path: 'edit/:purchaseCategoryId',
                        element: <EditPurchaseCategory />
                      }
                    ]
                  },
                ]
              },
              {
                path: 'purchase_product',
                children: [
                  {
                    path: '',
                    children: [
                      {
                        index: true,
                        element: <PurchaseProduct />,
                      },
                      {
                        path: 'add',
                        element: <AddPurchaseProduct />,
                      },
                      {
                        path: 'edit/:purchaseProductId',
                        element: <EditPurchaseProduct />
                      }
                    ]
                  },
                ]
              },
              {
                path: "purchase_consumption",
                children: [
                  {
                    path: '',
                    children: [
                      {
                        index: true,
                        element: <PurchaseConsumersion />,
                      },
                      {
                        path: 'add',
                        element: <AddPurchaseConsumersion />,
                      },
                      {
                        path: 'edit/:purchaseConsumersionId',
                        element: <EditPurchaseConsumersion />
                      }
                    ]
                  },
                ]
              },
              {
                path: "purchase_wasted",
                children: [
                  {
                    path: '',
                    children: [
                      {
                        index: true,
                        element: <PurchaseWasted />,
                      },
                      {
                        path: 'add',
                        element: <AddPurchaseWasted />,
                      },
                      {
                        path: 'edit/:purchaseWastedId',
                        element: <EditPurchaseWasted />
                      }
                    ]
                  },
                ]
              },
              {
                path: "purchase_transfer",
                element: <PurchaseTransfer />
              }
            ]
          },

          {
            path: 'material',
            element: <Outlet />,
            children: [
              {
                path: 'material_category',
                children: [
                  {
                    path: '',
                    children: [
                      {
                        index: true,
                        element: <MaterialCategory />,
                      },
                      {
                        path: 'add',
                        element: <AddMaterialCategory />,
                      },
                      {
                        path: 'edit/:materialCategoryId',
                        element: <EditMaterialCategory />
                      }
                    ]
                  },
                ]
              },
              {
                path: 'material_products',
                children: [
                  {
                    path: '',
                    children: [
                      {
                        index: true,
                        element: <MaterialList />,
                      },
                      {
                        path: 'add',
                        element: <AddMaterialList />,
                      },
                      {
                        path: 'edit/:materialId',
                        element: <EditMaterialList />
                      }
                    ]
                  },
                ]
              },
            ]
          },

          {
            path: 'manufacturing',
            children: [
              {
                path: '',
                children: [
                  {
                    index: true,
                    element: <ManufacturingHistory />,
                  },
                  {
                    path: 'add',
                    element: <AddManufacturing />,
                  },
                ]
              },
            ]
          },

          {
            path: 'store',
            element: <Outlet />,
            children: [
              {
                path: '',
                children: [
                  {
                    path: 'store_list',
                    children: [
                      {
                        index: true,
                        element: <Store />,
                      },
                      {
                        path: 'add',
                        element: <AddStore />,
                      },
                      {
                        path: 'edit/:storeId',
                        element: <EditStore />
                      }
                    ]
                  },
                ]
              },
              {
                path: 'store_man',
                children: [
                  {
                    path: '',
                    children: [
                      {
                        index: true,
                        element: <StoreMan />,
                      },
                      {
                        path: 'add',
                        element: <AddStoreMan />,
                      },
                      {
                        path: 'edit/:storeManId',
                        element: <EditStoreMan />
                      }
                    ]
                  },
                ]
              },
            ]
          },

          {
            path: 'expenses',
            element: <Outlet />,
            children: [
              {
                path: 'expenses_category',
                children: [
                  {
                    path: '',
                    children: [
                      {
                        index: true,
                        element: <ExpensesCategory />,
                      },
                      {
                        path: 'add',
                        element: <AddExpensesCategory />,
                      },
                      {
                        path: 'edit/:expensesCategoryId',
                        element: <EditExpensesCategory />
                      }
                    ]
                  },
                ]
              },
              // {
              //   path: 'expenses_list',
              //   children: [
              //     {
              //       path: '',
              //       children: [
              //         {
              //           index: true,
              //           element: <ExpensesList />,
              //         },
              //         {
              //           path: 'add',
              //           element: <AddExpensesList />,
              //         },
              //         {
              //           path: 'edit/:expensesId',
              //           element: <EditExpensesList />
              //         }
              //       ]
              //     },
              //   ]
              // },
              {
                path: 'expenses_payment',
                element: <ExpensesPayment />,
              }
            ]
          },

          {
            path: 'reports',
            element: <Outlet />,
            children: [
              {
                path: 'cashier_report',
                element: <CashierShiftReport />
              },
              {
                path: 'orders_reports',
                element: <OrdersReports />,
              },
              {
                path: 'financial_reports',
                element: <FinacialReports />,
              }
            ]
          },

          {
            path: 'group_modules',
            children: [
              {
                path: '',
                children: [
                  {
                    index: true,
                    element: <GroupModules />,
                  },
                  {
                    path: 'products/:groupId',
                    element: <GroupModuleProducts />,
                  },
                  {
                    path: 'add',
                    element: <AddGroupModules />
                  },
                  {
                    path: 'edit/:groupId',
                    element: <EditGroupModules />
                  },
                  {
                    path: 'due/:groupId',
                    element: <DueGroupModule />
                  }
                ]
              },
            ]
          },
        ]
      },
    ],
  },

  /* Catch-all for 404 */
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
