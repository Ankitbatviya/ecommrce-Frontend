// Layout.jsx
import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

// Public Pages
import Home from '../Pages/Home'
import About from '../Pages/About'
import Contact from '../Pages/Contact'
import Products from '../Pages/Products'
import Login from '../Pages/Login'
import SignUp from '../Pages/SignUp'
import ProductDetail from '../Pages/ProductDetail'
import ForgotPassword from '../Pages/ForgotPassword'
import ResetPassword from '../Pages/ResetPassword'
import TermsConditions from '../Pages/TermsConditions'

// Protected User Pages
import Cart from '../Pages/Cart'
import Checkout from '../Pages/Checkout'
import OrderConfirmation from '../Pages/OrderConfirmation'
import MyOrders from '../Pages/MyOrders'
import OrderDetail from '../Pages/OrderDetail.jsx'
import UserProfile from '../Pages/UserProfile'

// Admin Pages
import AdminDashboard from '../Pages/admin/AdminDashboard'
import AdminUsers from '../Pages/admin/AdminUsers'
import AdminProducts from '../Pages/admin/AdminProducts'
import AdminOrders from '../Pages/admin/AdminOrders'
import AdminOrderDetail from '../Pages/admin/AdminOrderDetail'

// Components
import ProtectedRoute from './ProtectedRoute'
import Navbar from './global/Navbar'

function Layout() {
  const location = useLocation()

  // Routes where Navbar should NOT appear
  const routesWithoutNav = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/productdetail',
    '/cart',
    '/checkout',
    '/orders',
    '/order/:id',
    '/order-confirmation',
    '/admin'
  ]

  // Handle dynamic routes correctly
  const hideNavbar = routesWithoutNav.some(route => {
    if (route.includes(':')) {
      // Handle dynamic routes like /order/:id
      const routePattern = new RegExp('^' + route.replace(/:\w+/g, '[^/]+') + '$');
      return routePattern.test(location.pathname);
    }
    return location.pathname.startsWith(route);
  })

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* ===================== PUBLIC ROUTES ===================== */}
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/aboutus' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />
        <Route path='/productdetail' element={<ProductDetail />} />
        
        {/* Legal/Policy Pages */}
        <Route path='/terms' element={<TermsConditions />} />
        <Route path='/terms/:type' element={<TermsConditions />} />
        <Route path='/privacy-policy' element={<TermsConditions />} />
        <Route path='/shipping-policy' element={<TermsConditions />} />
        <Route path='/returns-policy' element={<TermsConditions />} />
        
        {/* ===================== PROTECTED USER ROUTES ===================== */}
        <Route path='/cart' element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        
        <Route path='/checkout' element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        
        <Route path='/order-confirmation/:orderId' element={
          <ProtectedRoute>
            <OrderConfirmation />
          </ProtectedRoute>
        }/>
        
        <Route path="/orders" element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        } />
        
        <Route path="/order/:id" element={
          <ProtectedRoute>
            <OrderDetail />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        
        {/* ===================== ADMIN ROUTES ===================== */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/users" element={
          <ProtectedRoute requiredRole="admin">
            <AdminUsers />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/products" element={
          <ProtectedRoute requiredRole="admin">
            <AdminProducts />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/orders" element={
          <ProtectedRoute requiredRole="admin">
            <AdminOrders />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/orders/:id" element={
          <ProtectedRoute requiredRole="admin">
            <AdminOrderDetail />
          </ProtectedRoute>
        } />

        
        {/* ===================== 404 ROUTE ===================== */}
        <Route path="*" element={
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '80vh',
            flexDirection: 'column'
          }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
            <p style={{ fontSize: '1.5rem' }}>Page Not Found</p>
          </div>
        } />
      </Routes>
    </>
  )
}

export default Layout