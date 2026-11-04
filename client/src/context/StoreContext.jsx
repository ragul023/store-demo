import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { products } from '../data/products';
import { apiRequest } from '../services';

const StoreContext = createContext(null);
const read = (key, fallback) => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
};

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => read('aurelia-cart', []));
  const [wishlist, setWishlist] = useState(() => read('aurelia-wishlist', []));
  const [orders, setOrders] = useState(() => read('aurelia-orders', []));
  const [notice, setNotice] = useState('');
  const [productsList, setProductsList] = useState(products);

  useEffect(() => {
    let active = true;
    apiRequest('/api/products').then(({ products: remoteProducts }) => {
      if (active && Array.isArray(remoteProducts) && remoteProducts.length) setProductsList(remoteProducts);
    }).catch(() => { /* Keep the built-in demo catalogue when the API is unavailable. */ });
    return () => { active = false; };
  }, []);

  useEffect(() => localStorage.setItem('aurelia-cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('aurelia-wishlist', JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem('aurelia-orders', JSON.stringify(orders)), [orders]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 2600);
    return () => clearTimeout(timer);
  }, [notice]);

  const addToCart = (product, size = product.sizes?.[0], quantity = 1) => {
    setCart(current => {
      const key = `${product.id}-${size}`;
      const existing = current.find(item => item.key === key);
      return existing
        ? current.map(item => item.key === key ? { ...item, quantity: item.quantity + quantity } : item)
        : [...current, { ...product, key, size, quantity }];
    });
    setNotice(`${product.name} added to your bag`);
  };
  const updateQuantity = (key, quantity) => setCart(current => quantity < 1 ? current.filter(item => item.key !== key) : current.map(item => item.key === key ? { ...item, quantity } : item));
  const removeFromCart = key => setCart(current => current.filter(item => item.key !== key));
  const toggleWishlist = product => {
    const exists = wishlist.some(item => item.id === product.id);
    setWishlist(current => exists ? current.filter(item => item.id !== product.id) : [...current, product]);
    setNotice(exists ? 'Removed from your wishlist' : 'Saved to your wishlist');
  };
  const placeOrder = (details) => {
    const order = { id: `AUR${Date.now().toString().slice(-8)}`, createdAt: new Date().toISOString(), status: 'Confirmed', items: cart, total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0), ...details };
    setOrders(current => [order, ...current]);
    setCart([]);
    return order;
  };

  const value = useMemo(() => ({ cart, wishlist, orders, productsList, setProductsList, notice, setNotice, addToCart, updateQuantity, removeFromCart, toggleWishlist, placeOrder }), [cart, wishlist, orders, productsList, notice]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export const useStore = () => useContext(StoreContext);
