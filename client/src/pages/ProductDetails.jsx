import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { formatPrice } from '../data/products';
import { useStore } from '../context/StoreContext';
import './ProductDetails.css';
export default function ProductDetails() {
  const { id } = useParams();
  const { productsList, addToCart, wishlist, toggleWishlist } = useStore();
  const product = productsList.find(item => item.id === id);
  const [size,setSize] = useState(product?.sizes?.[0] || 'M');
  const [qty,setQty] = useState(1);
  const [activeImage,setActiveImage] = useState(0);
  const [openInfo,setOpenInfo] = useState('Details');
  if (!product) return <div className="empty-state"><div className="empty-icon">✳</div><h2>We couldn't find that piece.</h2><Link className="button-dark" to="/shop/all">Back to shopping ↗</Link></div>;
  const saved = wishlist.some(item => item.id === product.id);
  const gallery = [product.image, product.image + '&sat=-10', product.image + '&auto=format&fit=crop&w=950&q=80'];
  const related = productsList.filter(p => p.category === product.category && p.id !== product.id).slice(0,4);
  return <div className="product-detail-page page-width">
    <div className="breadcrumbs"><Link to="/">HOME</Link><span>/</span><Link to={`/shop/${product.category.toLowerCase()}`}>{product.category.toUpperCase()}</Link><span>/</span><span>{product.name.toUpperCase()}</span></div>
    <div className="product-detail-layout"><div className="product-gallery"><div className="product-main-image"><img src={gallery[activeImage]} alt={product.name}/><span className="gallery-count">0{activeImage+1} / 03</span></div><div className="product-thumbnails">{gallery.map((src,i)=><button key={i} className={activeImage===i?'active':''} onClick={()=>setActiveImage(i)}><img src={src} alt={`${product.name} view ${i+1}`}/></button>)}</div></div>
      <div className="product-info"><span className="eyebrow">AURELIA / {product.category.toUpperCase()}</span><h1>{product.name}</h1><div className="detail-price">{formatPrice(product.price)} {product.oldPrice && <><del>{formatPrice(product.oldPrice)}</del><span className="detail-sale">SAVE {Math.round((1-product.price/product.oldPrice)*100)}%</span></>}</div><p className="detail-description">{product.description}</p><div className="detail-divider"/><div className="selection-row"><span>COLOUR</span><b>{product.color}</b></div><div className="color-swatch"><button aria-label={product.color} className="swatch selected"/></div><div className="size-heading"><span>SELECT SIZE</span><button onClick={()=>setOpenInfo(openInfo==='Size guide'?'':'Size guide')}>SIZE GUIDE ↗</button></div><div className="size-options">{product.sizes.map(s=><button key={s} className={size===s?'active':''} onClick={()=>setSize(s)}>{s}</button>)}</div><div className="quantity-row"><span>QUANTITY</span><div><button onClick={()=>setQty(Math.max(1,qty-1))}>−</button><b>{qty}</b><button onClick={()=>setQty(Math.min(10,qty+1))}>＋</button></div></div><button className="add-detail-button" onClick={()=>addToCart(product,size,qty)}>ADD TO BAG <span>↗</span></button><button className={`save-detail-button ${saved?'saved':''}`} onClick={()=>toggleWishlist(product)}>{saved?'♥ SAVED TO WISHLIST':'♡ ADD TO WISHLIST'}</button><div className="product-info-accordions">{['Details','Delivery & returns','Size guide'].map(title=><div className="info-accordion" key={title}><button onClick={()=>setOpenInfo(openInfo===title?'':title)}><span>{title}</span><b>{openInfo===title?'−':'＋'}</b></button>{openInfo===title && <p>{title==='Details'?'Designed for comfort and everyday ease. Material and care details are included with each product in this demo catalogue.':title==='Delivery & returns'?'Complimentary delivery on orders over ₹1,999. Easy returns within 7 days of delivery, subject to product condition.':'Choose your usual size for a regular fit. Between sizes? We recommend sizing up for a more relaxed feel.'}</p>}</div>)}</div><div className="detail-delivery-note"><span>✳</span> Complimentary delivery on orders over ₹1,999</div></div></div>
    <section className="related-products"><div className="section-heading"><div><span className="eyebrow">A LITTLE MORE TO LOVE</span><h2>You may also <em>like.</em></h2></div><Link to={`/shop/${product.category.toLowerCase()}`} className="text-link">Explore more ↗</Link></div><div className="product-grid">{related.map((p,i)=><ProductCard product={p} key={p.id} index={i}/>)}</div></section>
  </div>;
}
