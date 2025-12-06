import { useCallback, useEffect, useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/Auth";
import { IoIosArrowForward } from "react-icons/io";
import {
  CategoryIcon,
  HomeIcon,
  OrderIcon,
  ProductIcon,
} from "../../Assets/Icons/AllIcons";
import { RiVipDiamondLine } from "react-icons/ri";
import { CiSettings } from "react-icons/ci";
import { useSelector } from "react-redux";
import { FiUsers, FiPackage } from "react-icons/fi";
import { FaUsersCog, FaCashRegister, FaShoppingBasket } from "react-icons/fa";
import {
  MdOutlineDeliveryDining,
  MdDiscount,
  MdOutlinePayments,
  MdOutlineSettingsInputComposite,
} from "react-icons/md";
import { PiFlagBanner } from "react-icons/pi";
import { IoLanguage } from "react-icons/io5";
import {
  BiSolidDiscount,
  BiSolidOffer,
  BiSolidCoupon,
  BiSolidEnvelope,
} from "react-icons/bi";
import { HiReceiptTax } from "react-icons/hi";
import { TbBorderAll, TbReportSearch } from "react-icons/tb";
import { IoMdGitBranch } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { PiBaseballCap } from "react-icons/pi";
import { PiClockUserFill } from "react-icons/pi";
import { LuBanknote } from "react-icons/lu";
import { SiMaterialformkdocs } from "react-icons/si";
import { GiManualMeatGrinder } from "react-icons/gi";
import { RiHome2Line } from "react-icons/ri";
import { IoBagAddOutline } from "react-icons/io5";
import { TbCategory } from "react-icons/tb";

// Admin routes configuration
const adminRoutes = [
  {
    name: "Home",
    path: "/dashboard",
    permission: "Home",
    icon: RiHome2Line,
  },
  {
    name: "Online Orders",
    path: "/dashboard/orders",
    permission: "Order",
    icon: IoBagAddOutline,
    subRoutes: [
      { name: "All", path: "/dashboard/orders/all", countKey: "ordersAll" },
      {
        name: "Pending",
        path: "/dashboard/orders/pending",
        countKey: "ordersPending",
      },
      {
        name: "Accept",
        path: "/dashboard/orders/confirmed",
        countKey: "ordersConfirmed",
      },
      {
        name: "Processing",
        path: "/dashboard/orders/processing",
        countKey: "ordersProcessing",
      },
      {
        name: "OutForDelivery",
        path: "/dashboard/orders/out_for_delivery",
        countKey: "ordersOutForDelivery",
      },
      {
        name: "Delivered",
        path: "/dashboard/orders/delivered",
        countKey: "ordersDelivered",
      },
      {
        name: "Returned",
        path: "/dashboard/orders/returned",
        countKey: "ordersReturned",
      },
      {
        name: "Refund",
        path: "/dashboard/orders/refund",
        countKey: "ordersRefund",
      },
      {
        name: "Failed",
        path: "/dashboard/orders/failed",
        countKey: "ordersFailed",
      },
      {
        name: "Canceled",
        path: "/dashboard/orders/canceled",
        countKey: "ordersCanceled",
      },
      { name: "Log", path: "/dashboard/orders/log" },
    ],
    redirectTo: "/dashboard/orders/all",
  },
  {
    name: "Delivery Orders",
    path: "/dashboard/all_orders_delivery",
    permission: "Order",
    icon: IoBagAddOutline,
  },
  {
    name: "Category Setup",
    path: "/dashboard/category",
    permission: "Category",
    icon: TbCategory,
  },
  {
    name: "Product Setup",
    path: "/dashboard/setup_product",
    permission: "Product",
    icon: FiPackage,
    subRoutes: [
      { name: "Product", path: "/dashboard/setup_product/product" },
      { name: "Add Product", path: "/dashboard/setup_product/product/add" },
    ],
    redirectTo: "/dashboard/setup_product/product",
  },
  {
    name: "Banners",
    path: "/dashboard/banners",
    permission: "Banner",
    icon: PiFlagBanner,
  },
  {
    name: "Addons",
    path: "/dashboard/addons",
    permission: "Addons",
    icon: RiVipDiamondLine,
  },
  {
    name: "Taxes",
    path: "/dashboard/taxes",
    permission: "Setting",
    icon: HiReceiptTax,
    subRoutes: [
      { name: "All Taxes", path: "/dashboard/taxes/all_taxes" },
      { name: "Tax Type", path: "/dashboard/taxes/tax_type" },
    ],
    redirectTo: "/dashboard/taxes/all_taxes",
  },
  {
    name: "Orders Payment",
    path: "/dashboard/orders_payment",
    permission: "Payments",
    icon: MdOutlinePayments,
  },
  {
    name: "Delivery Man",
    path: "/dashboard/delivery_man",
    permission: "Delivery",
    icon: MdOutlineDeliveryDining,
  },
  // {
  //   name: "Preparation Man",
  //   path: "/dashboard/preparation_man",
  //   permission: "preparation_man",
  //   icon: MdOutlineDeliveryDining,
  // },
  {
    name: "Users",
    path: "/dashboard/users",
    permission: "Customer",
    icon: FiUsers,
    subRoutes: [
      { name: "Admins", path: "/dashboard/users/admins", permission: "Admin" },
      {
        name: "Customers",
        path: "/dashboard/users/customers",
        permission: "Customer",
      },
      { name: "Due Customer", path: "/dashboard/users/due_customers" },
      { name: "Deleted Customer", path: "/dashboard/users/deleted_customers" },
    ],
    redirectTo: "/dashboard/users/admins",
  },
  {
    name: "Captain Order",
    path: "/dashboard/captain_order",
    permission: "captainOrder",
    icon: PiBaseballCap,
  },
  {
    name: "Waiter",
    path: "/dashboard/waiter",
    permission: "Waiter",
    icon: PiClockUserFill,
  },
  {
    name: "Cashier",
    path: "/dashboard/cashier",
    permission: "Cashier",
    icon: FaCashRegister,
  },
  {
    name: "Cashier Man",
    path: "/dashboard/cashier_man",
    permission: "CashierMan",
    icon: FaUsersCog,
  },
  {
    name: "Branches",
    path: "/dashboard/branches",
    permission: "Branch",
    icon: IoMdGitBranch,
  },
  {
    name: "Setting",
    path: "/dashboard/setting",
    icon: CiSettings,
    subRoutes: [
      { name: "Admin Roles", path: "/dashboard/setting/roles", permission: "AdminRoles" },
      { name: "Payment Method", path: "/dashboard/setting/payment_method", permission: "PaymentMethod" },
      { name: "Financial Account", path: "/dashboard/setting/financial_account", permission: "FinancialAccount" },
      { name: "Automatic Payment", path: "/dashboard/setting/automatic_payment", permission: "AutomaticPayment" },
      { name: "Cities", path: "/dashboard/setting/cities", permission: "City" },
      { name: "Zones", path: "/dashboard/setting/zones", permission: "Zone" },
      { name: "Extra Groups", path: "/dashboard/setting/groups", permission: "Extra" },
      { name: "Order Type", path: "/dashboard/setting/order_type", permission: "OrderType" },
      { name: "Restaurant Time", path: "/dashboard/setting/resturant_time", permission: "ResturantTime" },
      { name: "Schedule Time", path: "/dashboard/setting/schedule_time", permission: "ScheduleTime" },
      { name: "Cancel Time", path: "/dashboard/setting/cancel_time", permission: "CancelTime" },
      { name: "Delivery Time", path: "/dashboard/setting/delivery_time", permission: "DeliveryTime" },
      { name: "Sound", path: "/dashboard/setting/sound", permission: "NotificationSound" },
      { name: "Menu", path: "/dashboard/setting/menu", permission: "Menue" },
      { name: "Hall", path: "/dashboard/setting/hall_locations", permission: "Hall" },
      { name: "Tables", path: "/dashboard/setting/hall_tables", permission: "Tables" },
      { name: "Order Percentage", path: "/dashboard/setting/order_percentage", permission: "OrderPercentage" },
      { name: "Discount Code", path: "/dashboard/setting/discount_code", permission: "DiscountCode" },
      { name: "Cancelation Notification", path: "/dashboard/setting/cancelation_notification", permission: "CancelationNotification" },
      { name: "Receipt Language", path: "/dashboard/setting/receipt_language", permission: "receipt_language" },
      { name: "Policy & Support", path: "/dashboard/setting/policy_support", permission: "PolicySupport" },
      { name: "App Setup", path: "/dashboard/setting/app_setup", permission: "AppSetup" },
      { name: "Void Reason", path: "/dashboard/setting/void_reason", permission: "VoidReason" },
      { name: "Language System", path: "/dashboard/setting/language_system", permission: "Settings" },
    ],
    redirectTo: "/dashboard/setting/roles",
  },
  {
    name: "Business Setup",
    path: "/dashboard/business_setup",
    permission: "CustomerLogin",
    icon: MdOutlineSettingsInputComposite,
  },
  {
    name: "Upselling",
    path: "/dashboard/upselling",
    permission: "Upselling",
    icon: TbBorderAll,
  },
  {
    name: "Service Fees",
    path: "/dashboard/service_fees",
    permission: "service_fees",
    icon: TbBorderAll,
  },
  {
    name: "Deals",
    path: "/dashboard/deals",
    permission: "Deal",
    icon: TbBorderAll,
  },
  {
    name: "Offers",
    path: "/dashboard/offers",
    permission: "PointOffers",
    icon: MdDiscount,
  },
  {
    name: "Coupon",
    path: "/dashboard/coupon",
    permission: "Coupon",
    icon: BiSolidCoupon,
  },
  {
    name: "Languages",
    path: "/dashboard/languages",
    permission: "Settings",
    icon: IoLanguage,
  },
  {
    name: "Deal Order",
    path: "/dashboard/deal_order",
    permission: "DealOrder",
    icon: TbReportSearch,
  },
  {
    name: "Buy Offer",
    path: "/dashboard/buy_offer",
    permission: "OfferOrder",
    icon: BiSolidOffer,
  },
  {
    name: "Discount",
    path: "/dashboard/discount",
    permission: "Discount",
    icon: BiSolidDiscount,
  },
  {
    name: "Discount Module",
    path: "/dashboard/discount_module",
    permission: "Discount Module",
    icon: BiSolidDiscount,
  },
  {
    name: "Group Modules",
    path: "/dashboard/group_modules",
    permission: "GroupModules",
    icon: TbBorderAll,
  },
  {
    name: "Emails",
    path: "/dashboard/emails",
    permission: "OrderDelay",
    icon: BiSolidEnvelope,
  },
  {
    name: "Store",
    path: "/dashboard/store",
    permission: "Store",
    icon: FaShoppingBasket,
    subRoutes: [
      { name: "List", path: "/dashboard/store/store_list", permission: "Store", },
      { name: "Store Man", path: "/dashboard/store/store_man", permission: "StoreMan", },
    ],
    redirectTo: "/dashboard/store/store_list",
  },
  {
    name: "Purchase",
    path: "/dashboard/purchase",
    permission: "purchase",
    icon: FaShoppingBasket,
    subRoutes: [
      { name: "List", path: "/dashboard/purchase/purchase_list", permission: "purchase", },
      { name: "Transfer", path: "/dashboard/purchase/purchase_transfer", permission: "purchase", },
      { name: "Category", path: "/dashboard/purchase/purchase_category", permission: "purchase", },
      { name: "Products", path: "/dashboard/purchase/purchase_product", permission: "purchase", },
      { name: "Consumption", path: "/dashboard/purchase/purchase_consumption", permission: "purchase", },
      { name: "Wasted", path: "/dashboard/purchase/purchase_wasted", permission: "purchase", },
    ],
    redirectTo: "/dashboard/purchase/purchase_list",
  },
  {
    name: "Material",
    path: "/dashboard/material",
    permission: "material",
    icon: SiMaterialformkdocs,
    subRoutes: [
      { name: "Category", path: "/dashboard/material/material_category", permission: "material", },
      { name: "Products", path: "/dashboard/material/material_products", permission: "material", },
    ],
    redirectTo: "/dashboard/material/material_category",
  },
  {
    name: "Manufacturing",
    path: "/dashboard/manufacturing",
    permission: "manufacturing",
    icon: GiManualMeatGrinder,
  },
  {
    name: "Expenses",
    path: "/dashboard/expenses",
    permission: "expenses",
    icon: LuBanknote,
    subRoutes: [
      { name: "Category", path: "/dashboard/expenses/expenses_category", permission: "expenses", },
      // { name: "List", path: "/dashboard/expenses/expenses_list", permission: "expenses", },
      { name: "Payment", path: "/dashboard/expenses/expenses_payment", permission: "expenses", },
    ],
    redirectTo: "/dashboard/expenses/expenses_category",
  },
  {
    name: "Inventory",
    path: "/dashboard/inventory",
    permission: "inventory",
    icon: TbReportSearch,
    subRoutes: [
      { name: "Products", path: "/dashboard/inventory/inventory_products", permission: "inventory", },
      { name: "Materials", path: "/dashboard/inventory/inventory_materials", permission: "inventory", },
    ],
    redirectTo: "/dashboard/inventory/inventory_products",
  },
  {
    name: "Reports",
    path: "/dashboard/reports",
    permission: "Reports",
    icon: TbReportSearch,
    subRoutes: [
      { name: "Orders", path: "/dashboard/reports/orders_reports", permission: "Reports", },
      { name: "Financial", path: "/dashboard/reports/financial_reports", permission: "Reports", },
      { name: "Cashier Shift", path: "/dashboard/reports/cashier_report", permission: "Reports", },
    ],
    redirectTo: "/dashboard/reports/orders_reports",
  }
];

// Branch routes configuration
const branchRoutes = [
  {
    name: "Home",
    path: "/branch",
    permission: "Home",
    icon: HomeIcon,
  },
  {
    name: "Branches Deal",
    path: "/branch/deals",
    permission: "Branch",
    icon: TbReportSearch,
  },
  {
    name: "Customers",
    path: "/branch/customer",
    permission: "Customer",
    icon: FiUsers,
  },
  {
    name: "Order Offers",
    path: "/branch/order-offers",
    permission: "OfferOrder",
    icon: BiSolidOffer,
  },
  {
    name: "Online Orders",
    path: "/branch/orders",
    permission: "Order",
    icon: OrderIcon,
    subRoutes: [
      { name: "All", path: "/branch/orders/all", countKey: "ordersAll" },
      {
        name: "Pending",
        path: "/branch/orders/pending",
        countKey: "ordersPending",
      },
      {
        name: "Accept",
        path: "/branch/orders/confirmed",
        countKey: "ordersConfirmed",
      },
      {
        name: "Processing",
        path: "/branch/orders/processing",
        countKey: "ordersProcessing",
      },
      {
        name: "OutForDelivery",
        path: "/branch/orders/out_for_delivery",
        countKey: "ordersOutForDelivery",
      },
      {
        name: "Delivered",
        path: "/branch/orders/delivered",
        countKey: "ordersDelivered",
      },
      {
        name: "Returned",
        path: "/branch/orders/returned",
        countKey: "ordersReturned",
      },
      {
        name: "Refund",
        path: "/branch/orders/refund",
        countKey: "ordersRefund",
      },
      {
        name: "Failed",
        path: "/branch/orders/failed",
        countKey: "ordersFailed",
      },
      {
        name: "Canceled",
        path: "/branch/orders/canceled",
        countKey: "ordersCanceled",
      },
      { name: "Log", path: "/branch/orders/log" },
    ],
    redirectTo: "/branch/orders/all",
  },
];

const LinksSidebar = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;
  const hideSide = auth.hideSidebar;
  const { t } = useTranslation();

  // Orders count from Redux
  const ordersAllCount = useSelector((state) => state.ordersAll.data);
  const ordersPendingCount = useSelector((state) => state.ordersPending.data);
  const ordersConfirmedCount = useSelector(
    (state) => state.ordersConfirmed.data
  );
  const ordersProcessingCount = useSelector(
    (state) => state.ordersProcessing.data
  );
  const ordersOutForDeliveryCount = useSelector(
    (state) => state.ordersOutForDelivery.data
  );
  const ordersDeliveredCount = useSelector(
    (state) => state.ordersDelivered.data
  );
  const ordersReturnedCount = useSelector(
    (state) => state.ordersReturned?.data || 0
  );
  const ordersRefundCount = useSelector(
    (state) => state.ordersRefund?.data || 0
  );
  const ordersFailedCount = useSelector(
    (state) => state.ordersFailed?.data || 0
  );
  const ordersCanceledCount = useSelector(
    (state) => state.ordersCanceled?.data || 0
  );
  const ordersScheduleCount = useSelector(
    (state) => state.ordersSchedule?.data || 0
  );

  const lengths = useMemo(
    () => ({
      ordersAll: ordersAllCount?.length || 0,
      ordersPending: ordersPendingCount?.length || 0,
      ordersConfirmed: ordersProcessingCount?.length || 0,
      ordersProcessing: ordersConfirmedCount?.length || 0,
      ordersOutForDelivery: ordersOutForDeliveryCount?.length || 0,
      ordersDelivered: ordersDeliveredCount?.length || 0,
      ordersReturned: ordersReturnedCount?.length || 0,
      ordersRefund: ordersRefundCount?.length || 0,
      ordersFailed: ordersFailedCount?.length || 0,
      ordersCanceled: ordersCanceledCount?.length || 0,
      ordersSchedule: ordersScheduleCount?.length || 0,
    }),
    [
      ordersAllCount,
      ordersPendingCount,
      ordersConfirmedCount,
      ordersProcessingCount,
      ordersOutForDeliveryCount,
      ordersDeliveredCount,
      ordersReturnedCount,
      ordersRefundCount,
      ordersFailedCount,
      ordersCanceledCount,
      ordersScheduleCount,
    ]
  );

  // Permissions
  const [permissions, setPermissions] = useState([]);
  useEffect(() => {
    const computedPermissions =
      auth?.userState?.user_positions?.roles?.map((role) => role.role) || [];
    setPermissions(computedPermissions);

    console.log("computedPermissions", auth?.userState?.user_positions)
  }, [auth?.userState?.user_positions?.roles]);

  // Active link state
  const [activeLink, setActiveLink] = useState({ name: "", subRoute: "" });
  const [hoveredLink, setHoveredLink] = useState("");

  // Determine the role from localStorage
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin" || role === "Admin";

  // Get current routes based on role
  const currentRoutes = useMemo(() => {
    const routes = isAdmin ? adminRoutes : branchRoutes;
    return routes;
  }, [isAdmin, role]);

  // Active link detection and highlighting
  useEffect(() => {
    const currentRoute = currentRoutes.find((route) => {
      // Check for exact match first
      if (pathName === route.path) return true;

      // Check for subRoutes
      if (route.subRoutes) {
        // Check if path starts with any sub-route path
        if (route.subRoutes.some((sub) => pathName.startsWith(sub.path)))
          return true;
        // Check if path starts with the main route path followed by /details or /invoice
        if (
          pathName.startsWith(`${route.path}/details`) ||
          pathName.startsWith(`${route.path}/invoice`)
        )
          return true;
      }
      return false;
    });

    if (currentRoute) {
      const activeSubRoute = currentRoute.subRoutes?.find((sub) =>
        pathName.startsWith(sub.path)
      )?.name;

      setActiveLink({
        name: currentRoute.name,
        subRoute: activeSubRoute || "",
      });
    } else {
      // Handle home routes explicitly
      if (pathName === "/dashboard" || pathName === "/branch") {
        const homeRoute = currentRoutes.find(route =>
          route.path === pathName ||
          (isAdmin && pathName === "/dashboard") ||
          (!isAdmin && pathName === "/branch")
        );
        if (homeRoute) {
          setActiveLink({ name: homeRoute.name, subRoute: "" });
        }
      } else {
        // If no match, clear active link
        setActiveLink({ name: "", subRoute: "" });
      }
    }
  }, [pathName, currentRoutes, isAdmin]);

  // Navigation handlers
  // Main route click handler
  const handleMainRouteClick = useCallback(
    (e, route) => {
      e.preventDefault(); // Prevent default Link behavior

      const targetPath = route.redirectTo || route.path;

      // Only navigate if the current path is different from the target path
      if (pathName !== targetPath) {
        navigate(targetPath);
      }
    },
    [navigate, pathName]
  );

  // Sub route click handler
  const handleSubRouteClick = useCallback(
    (e, subRoute) => {
      e.preventDefault(); // Prevent default Link behavior
      navigate(subRoute.path);
    },
    [navigate]
  );

  // ✅ Main Filtering Logic
  const filteredRoutes = useMemo(() => {
    const isSuperAdmin = auth?.userState?.user_positions?.name === "Super Admin";

    // Non-admin users (like Branch users) see all routes
    if (!isAdmin) return currentRoutes;

    // Filter routes for Admins
    const filtered = currentRoutes
      .map((route) => {
        if (isSuperAdmin) return route;

        // If the route has subroutes, filter them by permission
        if (route.subRoutes) {
          const allowedSubRoutes = route.subRoutes.filter(
            (sub) => !sub.permission || permissions.includes(sub.permission)
          );

          // ❌ Hide entire route if no allowed subroutes
          if (allowedSubRoutes.length === 0) {
            return null;
          }

          // ✅ Show only the allowed subroutes
          return { ...route, subRoutes: allowedSubRoutes };
        }

        // Normal route (no subRoutes)
        if (!route.permission || permissions.includes(route.permission)) {
          return route;
        }

        return null;
      })
      .filter(Boolean); // Remove null/empty routes

    return filtered;
  }, [permissions, auth?.userState?.user_positions?.name, currentRoutes, isAdmin]);

  // Render link
  const renderLink = (route) => {
    const isActive = activeLink.name === route.name;
    const isHovered = hoveredLink === route.name;
    const Icon = route.icon;

    return (
      <Link
        key={route.name}
        to={route.redirectTo || route.path}
        onMouseEnter={() => setHoveredLink(route.name)}
        onMouseLeave={() => setHoveredLink("")}
        onClick={(e) => handleMainRouteClick(e, route)}
        className={`
          ${isActive ? "active" : ""}
          ${hideSide ? "justify-between" : "justify-center"}
          hover:rounded-xl pl-2 pr-1 hover:py-2 hover:bg-white
          hover:text-mainColor w-full flex items-center
          transition-all duration-300 group
        `}
      >
        <div className="flex items-center gap-x-2">
          <Icon
            className={`${isActive || isHovered ? "text-[#9E090F]" : "text-[#fff]"
              } text-2xl ${route.name === "Delivery Man" ? "text-3xl" : ""}`}
          />
          <span
            className={`
              ${hideSide ? "block" : "hidden"}
              ${isActive ? "text-mainColor" : "text-white"}
              text-lg font-[400] transition-all duration-300
              group-hover:text-mainColor
            `}
          >
            {t(route.name)}
          </span>
        </div>
        {route.subRoutes && hideSide && (
          <IoIosArrowForward
            className={`
              ${isActive ? "text-mainColor rotate-90" : "text-white rotate-0"}
              text-xl transition-all duration-300 group-hover:text-mainColor
            `}
          />
        )}
      </Link>
    );
  };

  // Render sub-routes
  const renderSubRoute = (sub) => {
    const isSubActive = activeLink.subRoute === sub.name;
    return (
      <Link key={sub.name} to={sub.path} onClick={(e) => handleSubRouteClick(e, sub)}>
        <li
          className={`${isSubActive ? "rounded-xl bg-white text-mainColor" : "text-white"
            } text-xl font-TextFontLight rounded-xl pl-3 pr-2 py-1 flex items-center justify-between hover:bg-white transition-all duration-300 hover:text-mainColor`}
        >
          <span>{t(sub.name)}</span>
          {sub.countKey && (
            <span className="px-1 text-sm bg-cyan-300 text-cyan-700 font-TextFontMedium rounded-2xl">
              {lengths[sub.countKey] || 0}
            </span>
          )}
        </li>
      </Link>
    );
  };

  const renderSubRoutes = (route) => {
    const isActive = activeLink.name === route.name;
    const isSuperAdmin = auth?.userState?.user_positions?.name === "Super Admin";

    return (
      <div
        className={`${isActive && hideSide ? "max-h-[100rem]" : "max-h-0"
          } overflow-hidden flex items-start justify-end w-full transition-all duration-700 mt-2`}
      >
        <ul className="flex flex-col w-full pl-2 list-disc gap-y-2">
          {route.subRoutes.map((sub) => {
            if (sub.permission && !permissions.includes(sub.permission) && !isSuperAdmin) {
              return null;
            }
            return renderSubRoute(sub);
          })}
        </ul>
      </div>
    );
  };

  // Render all routes using the same logic
  const renderAllRoutes = () => {
    return filteredRoutes.map((route) => (
      <div key={route.name} className="flex flex-col w-full">
        {renderLink(route)}
        {route.subRoutes && renderSubRoutes(route)}
      </div>
    ));
  };

  return (
    <div className="flex flex-col items-center justify-start w-full LinksSidebar gap-y-3">
      {renderAllRoutes()}
    </div>
  );
};

export default LinksSidebar;