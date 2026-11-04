import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import './Header.css';

export default function Header() {
  const { cart, wishlist } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const count = cart.reduce((n, item) => n + item.quantity, 0);
  const submitSearch = e => { e.preventDefault(); if (query.trim()) { navigate(`/shop/all?search=${encodeURIComponent(query.trim())}`); setSearchOpen(false); setQuery(''); } };
  const closeMenu = () => setMenuOpen(false);
  return <>
    <div className="announcement"><span>Complimentary delivery on orders over ₹1,999</span><span className="announcement-separator">✳</span><span>A little something for your everyday.</span></div>
    <header className="site-header">
      <button className="icon-button mobile-menu-button" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><span className="menu-glyph">☰</span></button>
      <Link to="/" className="brand-mark" aria-label="Aura home"><span className="brand-name">aura<span>.</span></span><span className="brand-caption">A SOFTER KIND OF STYLE</span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        <NavLink to="/shop/men">Men</NavLink><NavLink to="/shop/women">Women</NavLink><NavLink to="/shop/kids">Kids</NavLink><NavLink to="/collections">Collections</NavLink><NavLink to="/offers" className="nav-offer">Offers</NavLink>
      </nav>
      <div className="header-actions">
        <button className="icon-button search-trigger" aria-label="Search" aria-expanded={searchOpen} onClick={() => setSearchOpen(true)}><span className="search-icon" /></button>
        <Link className="icon-button account-trigger" to="/account" aria-label="Account"><span className="user-icon" /></Link>
        <Link className="icon-button wishlist-trigger" to="/wishlist" aria-label="Wishlist"><span className="heart-icon">♡</span>{wishlist.length > 0 && <i className="action-count">{wishlist.length}</i>}</Link>
        <Link className="icon-button bag-trigger" to="/cart" aria-label="Shopping bag"><span className="bag-icon" />{count > 0 && <i className="action-count">{count}</i>}</Link>
      </div>
    </header>
    {menuOpen && <div className="mobile-menu-backdrop" onClick={closeMenu}><div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Main menu" onClick={e => e.stopPropagation()}><div className="mobile-menu-top"><span className="brand-name">aura<span>.</span></span><button className="icon-button" aria-label="Close menu" onClick={closeMenu}>✕</button></div><span className="eyebrow">DISCOVER</span>{[['Men','/shop/men'],['Women','/shop/women'],['Kids','/shop/kids'],['Collections','/collections'],['Offers','/offers'],['My orders','/orders'],['My account','/account']].map(([label,url]) => <Link key={url} to={url} onClick={closeMenu}>{label}<span>↗</span></Link>)}<p>Find your everyday, a little more beautifully.</p></div></div>}
    {searchOpen && <div className="search-backdrop" onClick={() => setSearchOpen(false)}><div className="search-panel" onClick={e => e.stopPropagation()}><div className="search-panel-head"><span className="eyebrow">WHAT ARE YOU LOOKING FOR?</span><button className="icon-button" onClick={() => setSearchOpen(false)}>✕</button></div><form className="search-form" onSubmit={submitSearch}><span className="search-icon" /><input autoFocus placeholder="Search shirts, dresses, everyday essentials..." value={query} onChange={e => setQuery(e.target.value)} /><button type="submit">Search ↗</button></form><div className="popular-searches"><span>POPULAR:</span>{['Linen shirts','Dresses','Everyday tees','Kids sets'].map(term => <button key={term} onClick={() => { setQuery(term); navigate(`/shop/all?search=${encodeURIComponent(term)}`); setSearchOpen(false); }}>{term}</button>)}</div></div></div>}
  </>;
}
