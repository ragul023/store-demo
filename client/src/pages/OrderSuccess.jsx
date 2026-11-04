import { Link, useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../data/products';
import './OrderSuccess.css';
export default function OrderSuccess() {
  const { id } = useParams();
  const { orders } = useStore();
  const order = orders.find(item => item.id === id);
  if(!order)return <div className="empty-state page-width"><div className="empty-icon">✳</div><h2>Order not found.</h2><p>This order may have been cleared from this browser.</p><Link className="button-dark" to="/orders">View my orders ↗</Link></div>;
  return <div className="order-success-page page-width"><div className="success-mark"><span>✓</span></div><span className="eyebrow">THAT'S A WRAP — FOR NOW</span><h1>Something lovely<br/><em>is on its way.</em></h1><p className="success-intro">Thank you, {order.name.split(' ')[0]}. Your demo order has been placed successfully.</p><div className="order-confirmation-card"><div className="order-card-head"><div><span className="eyebrow">ORDER NUMBER</span><h2>{order.id}</h2></div><span className="order-status">{order.status}</span></div><div className="order-card-items">{order.items.map(item=><div className="order-card-item" key={item.key}><img src={item.image} alt={item.name}/><div><b>{item.name}</b><small>{item.color} · {item.size} · Qty {item.quantity}</small></div><strong>{formatPrice(item.price*item.quantity)}</strong></div>)}</div><div className="order-card-foot"><div><span>DELIVERING TO</span><p>{order.name}<br/>{order.address}, {order.city}, {order.state} — {order.pincode}</p></div><div><span>PAYMENT</span><p>{order.payment}<br/>{order.paymentStatus}</p></div><div><span>ORDER TOTAL</span><p className="order-total">{formatPrice(order.total + (order.total>=1999?0:99))}</p></div></div></div><div className="success-actions"><Link className="button-dark" to="/orders">TRACK YOUR ORDER ↗</Link><Link className="text-link" to="/shop/all">Continue shopping ↗</Link></div><p className="demo-order-note">DEMO EXPERIENCE · This order is stored locally in your browser. No real payment or shipment was created.</p></div>;
}
