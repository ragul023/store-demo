import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../data/products';
import './ProductCard.css';
export default function ProductCard({ product, index = 0 }) {
  const { toggleWishlist, wishlist, addToCart } = useStore();
  const saved = wishlist.some(item => item.id === product.id);
  return <article className="product-card" style={{ '--card-delay': `${index * 65}ms` }}>
    <div className="product-image-wrap"><Link to={`/product/${product.id}`} className="product-image-link"><img src={product.image} alt={product.name} loading="lazy"/><span className="quick-view-label">QUICK VIEW ↗</span></Link>
      {product.badge && <span className="product-badge">{product.badge}</span>}
      <button className={`product-heart ${saved ? 'is-saved' : ''}`} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'} onClick={() => toggleWishlist(product)}>{saved ? '♥' : '♡'}</button>
      <button className="quick-add" onClick={() => addToCart(product)}><span>Quick add</span><b>＋</b></button>
    </div>
    <div className="product-meta"><div><Link to={`/product/${product.id}`} className="product-name">{product.name}</Link><span className="product-color">{product.color}</span></div><div className="product-price">{formatPrice(product.price)}{product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}</div></div>
  </article>;
}
