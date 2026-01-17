import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ADMIN_MENU_CATEGORIES, adminRoutes } from '../../../../Utils/menuStructure';
import { useAuth } from '../../../../Context/Auth';

const AdminLandingPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const auth = useAuth();
    const roles = auth?.userState?.user_positions?.roles?.map((role) => role.role) || [];
    const filteredCategories = useMemo(() => {
        let categories = ADMIN_MENU_CATEGORIES;

        // Role-based filtering
        const restrictedRoles = ["Home", "PosReports"];
        const userRestrictedRoles = roles.filter(role => restrictedRoles.includes(role));

        const userPosition = auth?.userState?.user_positions;
        const isSuperAdmin = userPosition?.name === "Super Admin";

        if (!isSuperAdmin) {
            if (userRestrictedRoles.length > 0) {
                const allowedIds = [];
                if (roles.includes("Home")) allowedIds.push('dashboard');
                if (roles.includes("PosReports")) allowedIds.push('reports');

                categories = categories.filter(c => allowedIds.includes(c.id));
            } else {
                categories = categories.filter(category => {
                    if (!category.routes || category.routes.length === 0) return false;

                    return category.routes.some(routeName => {
                        const routeConfig = adminRoutes.find(r => r.name === routeName);
                        if (!routeConfig) return false;
                        if (!routeConfig.permission) return true;
                        return roles.includes(routeConfig.permission);
                    });
                });
            }
        }

        const query = searchQuery.toLowerCase().trim();
        if (!query) return categories;

        return categories.filter(category => {
            // Search Category Name & Description (Translated and Original)
            const catNameEn = (category.name || '').toLowerCase();
            const catNameLocal = t(category.name).toLowerCase();
            const catDescEn = (category.description || '').toLowerCase();
            const catDescLocal = t(category.description).toLowerCase();

            if (catNameEn.includes(query) || catNameLocal.includes(query) ||
                catDescEn.includes(query) || catDescLocal.includes(query)) {
                return true;
            }

            // Search in Routes and their SubRoutes
            return category.routes?.some(routeName => {
                // Check route name
                const routeNameEn = routeName.toLowerCase();
                const routeNameLocal = t(routeName).toLowerCase();
                if (routeNameEn.includes(query) || routeNameLocal.includes(query)) return true;

                // Deep check adminRoutes for subRoutes
                const routeConfig = adminRoutes.find(r => r.name === routeName);
                if (routeConfig?.subRoutes) {
                    return routeConfig.subRoutes.some(sub => {
                        const subNameEn = (sub.name || '').toLowerCase();
                        const subNameLocal = t(sub.name).toLowerCase();
                        return subNameEn.includes(query) || subNameLocal.includes(query);
                    });
                }
                return false;
            });
        });
    }, [searchQuery, t, roles]);

    const handleCategoryClick = (category) => {
        if (category.id === 'home' || category.id === 'dashboard') {
            navigate(`/dashboard/home-overview?category=${category.id}`);
            return;
        }

        // Find the first route in this category to get its path
        const firstRouteName = category.routes[0];
        const routeConfig = adminRoutes.find(r => r.name === firstRouteName);

        if (routeConfig) {
            const targetPath = routeConfig.redirectTo || routeConfig.path;
            navigate(`${targetPath}?category=${category.id}`);
        } else {
            // Fallback if no route config found
            navigate(`/dashboard?category=${category.id}`);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="w-full p-2 md:p-6">
                {/* <header className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('Admin Food2go Restructuring')}</h1>
                    <p className="text-gray-600 text-lg">{t('Select a module to manage your restaurant')}</p>
                </header> */}

                <div className="mb-10 max-w-2xl mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={t('Search for modules')}
                            className="w-full p-4 pl-12 rounded-2xl border-none shadow-lg focus:ring-2 focus:ring-mainColor transition-all outline-none text-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-2xl">🔍</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCategories.map((category) => (
                        <div
                            key={category.id}
                            onClick={() => handleCategoryClick(category)}
                            className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all cursor-pointer group border border-gray-100 flex flex-col items-center text-center transform hover:-translate-y-1"
                        >
                            <div className="w-16 h-16 bg-red-50 text-mainColor rounded-2xl flex items-center justify-center mb-6 group-hover:bg-mainColor group-hover:text-white transition-colors">
                                <category.icon className="text-3xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-mainColor transition-colors">
                                {t(category.name)}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {t(category.description)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminLandingPage;
