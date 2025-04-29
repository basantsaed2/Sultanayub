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
import { FiUsers } from "react-icons/fi";
import {
  MdOutlineDeliveryDining,
  MdDiscount,
  MdOutlinePayments,
  MdOutlineSettingsInputComposite,
} from "react-icons/md";
import { PiFlagBanner } from "react-icons/pi";
import { IoLanguage } from "react-icons/io5";
import { BiSolidDiscount, BiSolidOffer, BiSolidCoupon, BiSolidEnvelope } from "react-icons/bi";
import { HiReceiptTax } from "react-icons/hi";
import { TbBorderAll, TbReportSearch } from "react-icons/tb";
import { IoMdGitBranch } from "react-icons/io";

// Route configuration
const routes = [
  {
    name: "Home",
    path: "/dashboard",
    permission: "Home",
    icon: HomeIcon,
  },
  {
    name: "Orders",
    path: "/dashboard/orders",
    permission: "Order",
    icon: OrderIcon,
    subRoutes: [
      { name: "All", path: "/dashboard/orders/all", countKey: "ordersAll" },
      { name: "Pending", path: "/dashboard/orders/pending", countKey: "ordersPending" },
      { name: "Confirmed", path: "/dashboard/orders/confirmed", countKey: "ordersConfirmed" },
      { name: "Processing", path: "/dashboard/orders/processing", countKey: "ordersProcessing" },
      { name: "OutForDelivery", path: "/dashboard/orders/out_for_delivery", countKey: "ordersOutForDelivery" },
      { name: "Delivered", path: "/dashboard/orders/delivered", countKey: "ordersDelivered" },
      { name: "Returned", path: "/dashboard/orders/returned", countKey: "ordersReturned" },
      { name: "Failed", path: "/dashboard/orders/failed", countKey: "ordersFailed" },
      { name: "Canceled", path: "/dashboard/orders/canceled", countKey: "ordersCanceled" },
      { name: "Schedule", path: "/dashboard/orders/schedule", countKey: "ordersSchedule" },
      { name: "Log", path: "/dashboard/orders/log" },
    ],
    redirectTo: "/dashboard/orders/all",
  },
  {
    name: "Category Setup",
    path: "/dashboard/category",
    permission: "Category",
    icon: CategoryIcon,
  },
  {
    name: "Product Setup",
    path: "/dashboard/setup_product",
    permission: "Product",
    icon: ProductIcon,
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
  {
    name: "Users",
    path: "/dashboard/users",
    permission: "User",
    icon: FiUsers,
    subRoutes: [
      { name: "Admins", path: "/dashboard/users/admins", permission: "Admin" },
      { name: "Customers", path: "/dashboard/users/customers", permission: "Customer" },
    ],
    redirectTo: "/dashboard/users/admins",
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
    permission: "Setting",
    icon: CiSettings,
    subRoutes: [
      { name: "Admin Roles", path: "/dashboard/setting/roles" },
      { name: "Payment Method", path: "/dashboard/setting/payment_method" },
      { name: "Automatic Payment", path: "/dashboard/setting/automatic_payment" },
      { name: "Cities", path: "/dashboard/setting/cities" },
      { name: "Zones", path: "/dashboard/setting/zones" },
      { name: "Order Type", path: "/dashboard/setting/order_type" },
      { name: "Restaurant Time", path: "/dashboard/setting/resturant_time" },
      { name: "Cancel Time", path: "/dashboard/setting/cancel_time" },
      { name: "Delivery Time", path: "/dashboard/setting/delivery_time" },
      { name: "Sound", path: "/dashboard/setting/sound" },
      { name: "Menu", path: "/dashboard/setting/menu" },
    ],
    redirectTo: "/dashboard/setting/roles",
  },
  {
    name: "Business Setup",
    path: "/dashboard/business_setup",
    permission: "Settings",
    icon: MdOutlineSettingsInputComposite,
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
    name: "Emails",
    path: "/dashboard/emails",
    permission: "OrderDelay",
    icon: BiSolidEnvelope,
  },
];

const LinksSidebar = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;
  const hideSide = auth.hideSidebar;

  // Orders count from Redux
  const ordersAllCount = useSelector((state) => state.ordersAll.data);
  const ordersPendingCount = useSelector((state) => state.ordersPending.data);
  const ordersConfirmedCount = useSelector((state) => state.ordersConfirmed.data);
  const ordersProcessingCount = useSelector((state) => state.ordersProcessing.data);
  const ordersOutForDeliveryCount = useSelector((state) => state.ordersOutForDelivery.data);
  const ordersDeliveredCount = useSelector((state) => state.ordersDelivered.data);
  const ordersReturnedCount = useSelector((state) => state.ordersReturned?.data || 0);
  const ordersFailedCount = useSelector((state) => state.ordersFailed?.data || 0);
  const ordersCanceledCount = useSelector((state) => state.ordersCanceled?.data || 0);
  const ordersScheduleCount = useSelector((state) => state.ordersSchedule?.data || 0);

  const lengths = useMemo(
    () => ({
      ordersAll: ordersAllCount.length,
      ordersPending: ordersPendingCount.length,
      ordersConfirmed: ordersConfirmedCount.length,
      ordersProcessing: ordersProcessingCount.length,
      ordersOutForDelivery: ordersOutForDeliveryCount.length,
      ordersDelivered: ordersDeliveredCount.length,
      ordersReturned: ordersReturnedCount.length,
      ordersFailed: ordersFailedCount.length,
      ordersCanceled: ordersCanceledCount.length,
      ordersSchedule: ordersScheduleCount.length,
    }),
    [
      ordersAllCount,
      ordersPendingCount,
      ordersConfirmedCount,
      ordersProcessingCount,
      ordersOutForDeliveryCount,
      ordersDeliveredCount,
      ordersReturnedCount,
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
    console.log("Permissions:", computedPermissions);
  }, [auth?.userState?.user_positions?.roles]);

  // Active link state
  const [activeLink, setActiveLink] = useState({ name: "", subRoute: "" });
  const [hoveredLink, setHoveredLink] = useState("");

  // Handle route changes
  useEffect(() => {
    const currentRoute = routes.find((route) => {
      if (route.subRoutes) {
        return (
          route.subRoutes.some((sub) => pathName.startsWith(sub.path)) ||
          pathName === route.path ||
          pathName.startsWith(`${route.path}/details`) ||
          pathName.startsWith(`${route.path}/invoice`)
        );
      }
      return pathName === route.path;
    });

    if (currentRoute) {
      const activeSubRoute = currentRoute.subRoutes?.find((sub) =>
        pathName.startsWith(sub.path)
      )?.name;

      setActiveLink({
        name: currentRoute.name,
        subRoute: activeSubRoute || "",
      });

      // Redirect to default sub-route if needed
      if (
        currentRoute.subRoutes &&
        pathName === currentRoute.path &&
        currentRoute.redirectTo
      ) {
        navigate(currentRoute.redirectTo);
      }
    } else {
      setActiveLink({ name: "Home", subRoute: "" });
      if (pathName === "/dashboard") {
        navigate("/dashboard");
      }
    }
  }, [pathName, navigate]);

  // Handle link click
  const handleClick = useCallback(
    (routeName, subRouteName = "") => {
      setActiveLink({ name: routeName, subRoute: subRouteName });
    },
    []
  );

  // Filter routes based on permissions
  const filteredRoutes = useMemo(() => {
    const isSuperAdmin = auth?.userState?.user_positions?.name === "Super Admin";
    return routes.filter((route) => {
      if (isSuperAdmin) return true;
      if (!route.permission) return true;
      return permissions.includes(route.permission);
    });
  }, [permissions, auth?.userState?.user_positions?.name]);

  // Render link
  const renderLink = (route) => {
    const isActive = activeLink.name === route.name;
    const isHovered = hoveredLink === route.name;
    const Icon = route.icon;

    return (
      <Link
        key={route.name}
        to={route.path}
        onMouseMove={() => setHoveredLink(route.name)}
        onMouseOut={() => setHoveredLink("")}
        onClick={() => handleClick(route.name)}
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
            className={`${
              isActive || isHovered ? "text-[#9E090F]" : "text-[#fff]"
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
            {route.name}
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
  const renderSubRoutes = (route) => {
    const isActive = activeLink.name === route.name;
    return (
      <div
        className={`
          ${isActive && hideSide ? "max-h-[100rem]" : "max-h-0"}
          overflow-hidden flex items-start justify-end w-full
          transition-all duration-700 mt-2
        `}
      >
        <ul className="list-disc w-full pl-2 flex flex-col gap-y-2">
          {route.subRoutes.map((sub) => {
            // Skip sub-routes that require permissions the user doesn't have
            if (sub.permission && !permissions.includes(sub.permission)) {
              return null;
            }
            const isSubActive = activeLink.subRoute === sub.name;
            return (
              <Link
                key={sub.name}
                to={sub.path}
                onClick={() => handleClick(route.name, sub.name)}
              >
                <li
                  className={`
                    ${isSubActive ? "rounded-xl bg-white text-mainColor" : "text-white"}
                    text-xl font-TextFontLight rounded-xl pl-3 pr-2 py-1
                    flex items-center justify-between
                    hover:bg-white transition-all duration-300 hover:text-mainColor
                  `}
                >
                  <span>{sub.name}</span>
                  {sub.countKey && (
                    <span className="bg-cyan-300 text-cyan-700 px-1 text-sm font-TextFontMedium rounded-2xl">
                      {lengths[sub.countKey] || 0}
                    </span>
                  )}
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="LinksSidebar w-full flex flex-col items-center justify-start gap-y-3">
      {filteredRoutes.map((route) => (
        <div key={route.name} className="w-full flex flex-col">
          {renderLink(route)}
          {route.subRoutes && renderSubRoutes(route)}
        </div>
      ))}
    </div>
  );
};

export default LinksSidebar;