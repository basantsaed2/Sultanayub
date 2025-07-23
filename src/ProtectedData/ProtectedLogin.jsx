import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/Auth';

const ProtectedLogin = () => {
 const auth = useAuth();
 const navigate = useNavigate();
 const location = useLocation();

 useEffect(() => {
 const currentPath = location.pathname.split('?')[0];
 const isAuthRoute = currentPath === '/' || currentPath === '/forget_password';
 
 // قراءة الـ role من localStorage (استخدم هذا الدور لتحديد الوجهة الافتراضية بعد تسجيل الدخول)
 const role = localStorage.getItem("role");
 
 console.log('currentPath:', currentPath);
 console.log('isAuthRoute:', isAuthRoute);
 console.log('auth.userState:', auth?.userState);
 console.log('role:', role);

 if (auth?.userState) {
// If user is logged in
if (isAuthRoute) {
 // If they are on a login/forget password page, redirect to their respective dashboard
 if (role === "admin") {
 navigate('/dashboard', { replace: true });
 } else {
 navigate('/branch', { replace: true });
 }
}
// ELSE: If auth?.userState is true and not an auth route,
// let them proceed to the requested route. No redirect needed here.
 } else {
// If user is NOT logged in
if (!isAuthRoute) {
 // If they are trying to access a protected route, redirect to login
 navigate('/', { state: { from: location }, replace: true });
}
// ELSE: If !auth?.userState and it IS an auth route (/, /forget_password),
// let them stay on the login/forget password page. No redirect needed here.
 }
 }, [auth, location, navigate]);

 return <Outlet />;
};

export default ProtectedLogin;