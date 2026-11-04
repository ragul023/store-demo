import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../data/products';
import { useStore } from '../context/StoreContext';
import './Checkout.css';
export default function Checkout() {
  const { cart, placeOrder } = useStore();
  const navigate = useNavigate();
  const [payment,setPayment] = useState('UPI');
  const [form,setForm] = useState({name:'',email:'',phone:'',address:'',city:'',state:'Tamil Nadu',pincode:'',landmark:''});
  const [errors,setErrors] = useState({});
  const [processing,setProcessing] = useState(false);
  const subtotal = cart.reduce((sum,item)=>sum+item.price*item.quantity,0);
  const delivery = subtotal >= 1999 || subtotal===0 ? 0 : 99;
  const set = e => setForm({...form,[e.target.name]:e.target.value});
  const validate = () => {
    const next={};
    ['name','email','phone','address','city','state','pincode'].forEach(key=>{if(!form[key].trim())next[key]='Please fill in this field.';});
    if(form.email && !/^\S+@\S+\.\S+$/.test(form.email))next.email='Enter a valid email address.';
    if(form.phone && !/^\d{10}$/.test(form.phone.replace(/\D/g,'')))next.phone='Enter a 10-digit mobile number.';
    if(form.pincode && !/^\d{6}$/.test(form.pincode))next.pincode='Enter a 6-digit PIN code.';
    setErrors(next);return Object.keys(next).length===0;
  };
  const submit = e => {e.preventDefault();if(!validate())return;if(!cart.length)return;setProcessing(true);setTimeout(()=>{const order=placeOrder({...form,payment,paymentStatus:payment==='COD'?'Pay on delivery':'Demo payment successful'});navigate(`/order-success/${order.id}`);},850);};
  if(!cart.length)return <div className="empty-state page-width"><div className="empty-icon">♡</div><h2>Your bag is empty.</h2><Link className="button-dark" to="/shop/all">Find something lovely ↗</Link></div>;
  const field=(label,name,placeholder,type='text')=><div className="form-field" key={name}><label htmlFor={name}>{label}</label><input id={name} name={name} type={type} placeholder={placeholder} value={form[name]} onChange={set}/>{errors[name]&&<small className="field-error">{errors[name]}</small>}</div>;
  return <div className="checkout-page page-width"><div className="checkout-heading"><span className="eyebrow">JUST A FEW MORE DETAILS</span><h1>Let's make it<br/><em>official.</em></h1><p>Your new favourites are almost on their way.</p></div><form className="checkout-layout" onSubmit={submit} noValidate><div className="checkout-form"><section className="checkout-section"><div className="checkout-section-title"><span>01</span><div><h2>Your details</h2><p>So we know who to send the good things to.</p></div></div><div className="form-grid">{field('Full name','name','Your full name')}{field('Email address','email','you@example.com','email')}{field('Mobile number','phone','10-digit mobile number','tel')}</div></section><section className="checkout-section"><div className="checkout-section-title"><span>02</span><div><h2>Delivery address</h2><p>Where should we send your order?</p></div></div><div className="form-grid">{field('Street address','address','House no., street, area')}{field('Landmark (optional)','landmark','Nearby landmark')}<div className="form-field"><label htmlFor="city">City</label><input id="city" name="city" placeholder="Your city" value={form.city} onChange={set}/>{errors.city&&<small className="field-error">{errors.city}</small>}</div><div className="form-field"><label htmlFor="state">State</label><select id="state" name="state" value={form.state} onChange={set}>{['Tamil Nadu','Karnataka','Kerala','Andhra Pradesh','Telangana','Maharashtra','Delhi','Other'].map(s=><option key={s}>{s}</option>)}</select></div>{field('PIN code','pincode','6-digit PIN code')}</div></section><section className="checkout-section"><div className="checkout-section-title"><span>03</span><div><h2>Payment method</h2><p>Choose how you'd like to complete your demo order.</p></div></div><div className="payment-options">{[{id:'UPI',title:'UPI',desc:'Simulated UPI payment',icon:'⌁'},{id:'CARD',title:'Credit / Debit card',desc:'Demo only — no card details',icon:'▤'},{id:'COD',title:'Cash on delivery',desc:'Pay when your order arrives',icon:'₹'}].map(option=><button type="button" key={option.id} className={`payment-option ${payment===option.id?'chosen':''}`} onClick={()=>setPayment(option.id)}><span className="payment-icon">{option.icon}</span><span><b>{option.title}</b><small>{option.desc}</small></span><i>{payment===option.id?'●':'○'}</i></button>)}</div><div className="demo-warning"><b>DEMO CHECKOUT</b><span>This is a simulated payment experience. No real money will be charged and no payment credentials are collected.</span></div></section><button className="button-dark place-order-button" type="submit" disabled={processing}>{processing?'CONFIRMING YOUR ORDER…':`PLACE DEMO ORDER · ${formatPrice(subtotal+delivery)}`} <span>↗</span></button></div>
      <aside className="checkout-summary"><span className="eyebrow">YOUR ORDER</span><h2>A lovely little lineup.</h2>{cart.map(item=><div className="checkout-item" key={item.key}><img src={item.image} alt={item.name}/><div><b>{item.name}</b><small>{item.color} · {item.size} · Qty {item.quantity}</small></div><strong>{formatPrice(item.price*item.quantity)}</strong></div>)}<div className="summary-line"><span>Subtotal</span><b>{formatPrice(subtotal)}</b></div><div className="summary-line"><span>Delivery</span><b>{delivery===0?'Free':formatPrice(delivery)}</b></div><div className="summary-total"><span>Total</span><strong>{formatPrice(subtotal+delivery)}</strong></div><p className="checkout-safe">✳ Your details stay in this demo browser session.</p><Link to="/cart" className="edit-bag">← EDIT YOUR BAG</Link></aside></form></div>;
}
