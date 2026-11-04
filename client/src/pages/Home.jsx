import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { collections, products } from '../data/products';
import './Home.css';

const categories = [
  { name: 'For him', label: 'MEN', link: '/shop/men', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85', sub: 'Easy layers, considered details.' },
  { name: 'For her', label: 'WOMEN', link: '/shop/women', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85', sub: 'Everyday pieces, with feeling.' },
  { name: 'For little ones', label: 'KIDS', link: '/shop/kids', image: 'https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=1000&q=85', sub: 'Made for their kind of magic.' },
];
export default function Home() {
  return <div className="home-page">
    <section className="hero-section">
      <div className="hero-copy"><span className="eyebrow">THE NEW SEASON — 2026</span><h1>Style, in<br/><em>your own</em><br/>beautiful way.</h1><p>Thoughtful pieces for the many versions of you. A little more considered, a lot more you.</p><div className="hero-actions"><Link to="/collections" className="button-dark">Explore the edit <span>↗</span></Link><Link to="/shop/women" className="hero-text-link">Discover new arrivals</Link></div><div className="hero-note"><span>✳</span> MADE FOR EVERYDAY, AND EVERY YOU.</div></div>
      <div className="hero-visual"><img className="hero-main-image" src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=90" alt="Friends in effortless everyday fashion"/><div className="hero-image-caption"><span>THE EVERYDAY EDIT</span><span>01 / 03</span></div><div className="hero-sticker">A softer<br/>kind of<br/><em>style</em><span>✳</span></div></div>
      <div className="hero-side-label">DRESSED FOR THE LIFE YOU LIVE — EST. 2026</div>
    </section>

    <section className="category-section page-width"><div className="section-heading"><div><span className="eyebrow">A PLACE FOR EVERYONE</span><h2>Find your kind<br/>of <em>everyday.</em></h2></div><p>Three worlds. One thoughtful point of view.<br/>Find the pieces that feel like you.</p></div><div className="category-grid">{categories.map((item,i)=><Link to={item.link} className={`category-tile category-tile-${i+1}`} key={item.label}><img src={item.image} alt={`${item.label} collection`} loading="lazy"/><div className="category-shade"/><div className="category-tile-copy"><span>{item.label}</span><h3>{item.name}</h3><p>{item.sub}</p><b>EXPLORE COLLECTION ↗</b></div></Link>)}</div></section>

    <section className="new-arrivals-section page-width"><div className="section-heading"><div><span className="eyebrow">FRESH FROM THE STUDIO</span><h2>The new <em>favourites.</em></h2><p>New pieces you'll reach for, again and again.</p></div><Link to="/shop/all" className="text-link">Shop all new arrivals ↗</Link></div><div className="product-grid">{products.slice(0,4).map((product,i)=><ProductCard product={product} index={i} key={product.id}/>)}</div></section>

    <section className="editorial-feature"><div className="editorial-image"><img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1300&q=85" alt="Fashion editorial in soft neutral tones" loading="lazy"/><span className="editorial-image-tag">AURELIA JOURNAL · 001</span></div><div className="editorial-copy"><span className="eyebrow">LESS, BUT MORE MEANINGFUL</span><h2>Good clothes.<br/><em>Good feelings.</em><br/>Great days.</h2><p>We believe getting dressed should feel less like a decision and more like a little joy. That’s why we look for the pieces that work hard, feel good and stay with you.</p><Link to="/collections" className="button-outline">Read our point of view <span>↗</span></Link><div className="editorial-flower">✳</div></div></section>

    <section className="collections-section page-width"><div className="section-heading"><div><span className="eyebrow">A LITTLE INSPIRATION</span><h2>Curated for <em>you.</em></h2></div><Link to="/collections" className="text-link">View all collections ↗</Link></div><div className="collection-grid">{collections.map((item,i)=><Link to="/collections" className="collection-card" key={item.title}><div className="collection-image"><img src={item.image} alt={item.title} loading="lazy"/><span>0{i+1}</span></div><div><h3>{item.title}</h3><p>{item.subtitle}</p><b>EXPLORE ↗</b></div></Link>)}</div></section>

    <section className="offer-strip"><div className="offer-strip-inner"><span className="eyebrow">A LITTLE SOMETHING EXTRA</span><h2>More of what you love.<br/><em>A little less to pay.</em></h2><p>Discover thoughtful finds in our seasonal edit.</p><Link to="/offers" className="button-light">Explore the offers <span>↗</span></Link><span className="offer-sparkle">✳</span></div><div className="offer-strip-photo"><img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85" alt="Neutral fashion pieces" loading="lazy"/></div></section>

    <section className="values-row page-width"><div><span>✳</span><h3>Thoughtfully chosen</h3><p>Pieces with a place in your wardrobe.</p></div><div><span>⌁</span><h3>Comfort comes first</h3><p>Made to move with your everyday.</p></div><div><span>♡</span><h3>For every generation</h3><p>Something lovely for everyone.</p></div><div><span>↗</span><h3>Easy, always</h3><p>A feel-good shopping experience.</p></div></section>
  </div>;
}
