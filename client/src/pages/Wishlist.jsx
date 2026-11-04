import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { useStore } from '../context/StoreContext';
import './Wishlist.css';
export default function Wishlist(){const {wishlist}=useStore();return <div className="wishlist-page page-width"><div className="wishlist-heading"><span className="eyebrow">SAVED WITH LOVE</span><h1>Your little<br/><em>love list.</em></h1><p>Pieces you've had your eye on.</p></div>{wishlist.length?<div className="product-grid">{wishlist.map((p,i)=><ProductCard product={p} key={p.id} index={i}/>)}</div>:<div className="empty-state"><div className="empty-icon">♡</div><h2>Nothing saved. Yet.</h2><p>When a piece catches your eye, save it here and come back whenever you're ready.</p><Link to="/shop/all" className="button-dark">Find your favourites ↗</Link></div>}</div>}
