import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import Orders from './pages/Orders.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Collections from './pages/Collections.jsx';
import Offers from './pages/Offers.jsx';
import Account from './pages/Account.jsx';
import Admin from './pages/Admin.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return <div className="app-shell">
    <Header />
    <main><Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop/:category" element={<Shop />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success/:id" element={<OrderSuccess />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/collections" element={<Collections />} />
      <Route path="/offers" element={<Offers />} />
      <Route path="/account" element={<Account />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/men" element={<Navigate to="/shop/men" replace />} />
      <Route path="/women" element={<Navigate to="/shop/women" replace />} />
      <Route path="/kids" element={<Navigate to="/shop/kids" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes></main>
    <Footer />
    <Toast />
  </div>;
}
