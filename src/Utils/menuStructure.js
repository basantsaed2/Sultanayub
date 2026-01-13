import {
    RiHome2Line,
    RiVipDiamondLine,
    RiExchange2Fill,
    RiHome2Line as HomeIcon // Alias for branchRoutes
} from "react-icons/ri";
import { IoBagAddOutline, IoReceiptSharp, IoLanguage, IoBagAddOutline as OrderIcon } from "react-icons/io5";
import {
    MdDeliveryDining,
    MdNoFood,
    MdPriceChange,
    MdOutlinePayments,
    MdOutlineSettingsInputComposite,
    MdDynamicFeed,
    MdDiscount,
    MdDeliveryDining as MdDeliveryDiningIcon
} from "react-icons/md";
import { TbCategory, TbReportSearch, TbBasketDiscount, TbBorderAll, TbSocial } from "react-icons/tb";
import { FiPackage, FiUsers } from "react-icons/fi";
import { PiFlagBanner, PiBaseballCap, PiClockUserFill, PiSlideshowFill } from "react-icons/pi";
import { HiReceiptTax } from "react-icons/hi";
import { GiCaptainHatProfile, GiUpgrade, GiTeamIdea, GiManualMeatGrinder } from "react-icons/gi";
import { FaCashRegister, FaUsersCog, FaShoppingBasket } from "react-icons/fa";
import { FaReceipt } from "react-icons/fa6";
import { IoMdGitBranch } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { BiSolidCoupon, BiSolidOffer, BiSolidDiscount, BiSolidEnvelope, BiSolidPurchaseTagAlt } from "react-icons/bi";
import { GrBundle } from "react-icons/gr";
import { SiMaterialformkdocs } from "react-icons/si";
import { LuBanknote } from "react-icons/lu";

// Admin routes configuration
export const adminRoutes = [
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
        icon: MdDeliveryDining,
    },
    {
        name: "Void Orders",
        path: "/dashboard/void_orders",
        permission: "VoidOrders",
        icon: MdNoFood,
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
        name: "Product Pricing",
        path: "/dashboard/setup_product/pricing_product",
        permission: "Product",
        icon: MdPriceChange,
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
        icon: GiCaptainHatProfile,
    },
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
            { name: "Notifications", path: "/dashboard/setting/notification", permission: "notification" },
            { name: "Policy & Support", path: "/dashboard/setting/policy_support", permission: "PolicySupport" },
            { name: "App Setup", path: "/dashboard/setting/app_setup", permission: "AppSetup" },
            { name: "Fake Order", path: "/dashboard/setting/fake_order", permission: "FakeOrder" },
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
        icon: GiUpgrade,
    },
    {
        name: "Service Fees",
        path: "/dashboard/service_fees",
        permission: "service_fees",
        icon: MdDynamicFeed,
    },
    {
        name: "Deals",
        path: "/dashboard/deals",
        permission: "Deal",
        icon: GiTeamIdea,
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
        name: "Popup",
        path: "/dashboard/popup",
        permission: "Popup",
        icon: PiSlideshowFill,
    },
    {
        name: "Receipt Design",
        path: "/dashboard/receipt_design",
        permission: "receipt_design",
        icon: IoReceiptSharp,
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
        icon: TbBasketDiscount,
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
        name: "FreeDiscount",
        path: "/dashboard/free_discount",
        permission: "FreeDiscount",
        icon: MdDiscount,
    },
    {
        name: "Social Media",
        path: "/dashboard/social_media",
        permission: "SocialMedia",
        icon: TbSocial,
    },
    {
        name: "Bundles",
        path: "/dashboard/bundles",
        permission: "Bundles",
        icon: GrBundle,
    },
    {
        name: "Stock",
        path: "/dashboard/stock",
        permission: "Stock",
        icon: FaShoppingBasket,
        subRoutes: [
            { name: "List", path: "/dashboard/stock/stock_list", permission: "Stock", },
            { name: "Stock Man", path: "/dashboard/stock/stock_man", permission: "StockMan", },
            { name: "Stock Count", path: "/dashboard/stock/stock_count", permission: "StockCount", },
        ],
        redirectTo: "/dashboard/stock/stock_list",
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
        name: "Purchase",
        path: "/dashboard/purchase",
        permission: "purchase",
        icon: BiSolidPurchaseTagAlt,
        subRoutes: [
            { name: "List", path: "/dashboard/purchase/purchase_list", permission: "purchase", },
            { name: "Consumption", path: "/dashboard/purchase/purchase_consumption", permission: "purchase", },
            { name: "Wasted", path: "/dashboard/purchase/purchase_wasted", permission: "purchase", },
        ],
        redirectTo: "/dashboard/purchase/purchase_list",
    },
    {
        name: "Stock Transfer",
        path: "/dashboard/stock_transfer",
        permission: "stock_transfer",
        icon: RiExchange2Fill,
    },
    {
        name: "Recipe",
        path: "/dashboard/recipe_products",
        permission: "recipe",
        icon: FaReceipt,
        subRoutes: [
            { name: "Category", path: "/dashboard/recipe_products/category", permission: "recipe", },
            { name: "Products", path: "/dashboard/recipe_products/product", permission: "recipe", },
        ],
        redirectTo: "/dashboard/recipe_products/category",
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
            { name: "Payment", path: "/dashboard/expenses/expenses_payment", permission: "expenses", },
        ],
        redirectTo: "/dashboard/expenses/expenses_category",
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
            { name: "Real Time Sales", path: "/dashboard/reports/real_time_sales_reports", permission: "Reports", },
            { name: "Products", path: "/dashboard/reports/product_reports", permission: "Reports", },
            { name: "Dine In", path: "/dashboard/reports/dine_reports", permission: "Reports", },
            { name: "Invoices", path: "/dashboard/reports/invoices_reports", permission: "Reports", },
            { name: "Cashier Shortage", path: "/dashboard/reports/cashier_shortage", permission: "Reports", },
        ],
        redirectTo: "/dashboard/reports/orders_reports",
    }
];

// Branch routes configuration
export const branchRoutes = [
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

export const ADMIN_MENU_CATEGORIES = [
    {
        id: "home",
        name: "Home",
        description: "Overview and all features",
        icon: RiHome2Line,
        routes: ["Home"], // Special case to show all
    },
    {
        id: "dashboard",
        name: "Dashboard",
        description: "Admin Main Dashboard",
        icon: RiHome2Line,
        routes: ["Home"],
    },
    {
        id: "order_management",
        name: "Order management",
        description: "Manage online, delivery, and void orders",
        icon: IoBagAddOutline,
        routes: [
            "Online Orders",
            "Delivery Orders",
            "Void Orders",
            "Orders Payment",
            "Buy Offer",
            "Deal Order",
        ],
    },
    {
        id: "menu_management",
        name: "Products Management",
        description: "Setup categories, products, pricing, and recipes",
        icon: TbCategory,
        routes: [
            "Category Setup",
            "Product Setup",
            "Product Pricing",
            "Addons",
            "Upselling",
            "Menu",
            "Extra Groups",
            "Group Modules",
            "Recipe",
            "Material",
        ],
    },
    {
        id: "inventory_supply",
        name: "Inventory & Supply chain",
        description: "Manage stock, inventory, and manufacturing",
        icon: FaShoppingBasket,
        routes: ["Stock", "Inventory", "Manufacturing", "Purchase"],
    },
    {
        id: "branches",
        name: "Branches",
        description: "Setup branches, cities, zones, and tables",
        icon: IoMdGitBranch,
        routes: ["Branches", "Cities", "Zones", "Hall", "Tables", "Cashier"],
    },
    {
        id: "staff",
        name: "Staff",
        description: "Manage delivery men, stock men, and admins",
        icon: FiUsers,
        routes: [
            "Delivery Man",
            "Stock Man",
            "Cashier Man",
            "Waiter",
            "Captain Order",
            "Users", // Admins and Admin Roles are under here or separate
        ],
    },
    {
        id: "customers",
        name: "Customers",
        description: "User list and management",
        icon: FiUsers,
        routes: ["Users"], // Customers subRoute
    },
    {
        id: "marketing",
        name: "Marketing & communications",
        description: "Emails, social media, deals, and coupons",
        icon: GiTeamIdea,
        routes: [
            "Emails",
            "Social Media",
            "Deals",
            "Offers",
            "Coupon",
            "Popup",
            "Banners",
            "Discount",
            "Discount Module",
            "Discount Code",
            "FreeDiscount",
            "Bundles",
        ],
    },
    {
        id: "financials",
        name: "Financials",
        description: "Taxes, expenses, and payment methods",
        icon: LuBanknote,
        routes: [
            "Taxes",
            "Expenses",
            "Payment Method",
            "Financial Account",
            "Service Fees",
        ],
    },
    {
        id: "settings",
        name: "Settings",
        description: "App setup, policies, and notifications",
        icon: CiSettings,
        routes: [
            "Setting", // This contains most of the sub-items
            "Business Setup",
            "Languages",
            "Receipt Design",
        ],
    },
    {
        id: "reports",
        name: "Reports",
        description: "Analytical reports and insights",
        icon: TbReportSearch,
        routes: ["Reports"],
    },
];
