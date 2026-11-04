import { useMemo, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { useStore } from '../context/StoreContext';
import './Shop.css';

const categoryInfo = {
  men: { title: 'For him.', subtitle: 'Easy layers. Thoughtful details. Pieces that work as hard as you do.', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1300&q=85', types: ['All','Shirts','T-shirts','Trousers'] },
  women: { title: 'For her.', subtitle: 'Everyday pieces with a little more feeling. Find your own kind of beautiful.', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1300&q=85', types: ['All','Dresses','Tops','Jeans','Co-ord Sets'] },
  kids: { title: 'For little ones.', subtitle: 'Soft things, happy colours and room for every little adventure.', image: 'https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=1300&q=85', types: ['All','Sets','T-shirts','Dresses','Shirts'] },
  all: { title: 'The whole edit.', subtitle: 'A considered collection for everyone, and every day.', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1300&q=85', types: ['All','Shirts','T-shirts','Dresses','Trousers','Jeans','Sets'] },
};
export default function Shop() {
  const { category = 'all' } = useParams();
  const [params] = useSearchParams();
  const { productsList } = useStore();
  const [type, setType] = useState('All');
  const [sort, setSort] = useState('featured');
  const [saleOnly, setSaleOnly] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const query = (params.get('search') || '').toLowerCase();
  const key = category.toLowerCase();
  const info = categoryInfo[key] || categoryInfo.all;
  const filtered = useMemo(() => {
    let list = productsList.filter(p => key === 'all' || p.category.toLowerCase() === key);
    if (type !== 'All') list = list.filter(p => p.type === type);
    if (saleOnly) list = list.filter(p => p.oldPrice);
    if (query) list = list.filter(p => `${p.name} ${p.category} ${p.type}`.toLowerCase().includes(query));
    if (sort === 'price-low') list = [...list].sort((a,b)=>a.price-b.price);
    if (sort === 'price-high') list = [...list].sort((a,b)=>b.price-a.price);
    if (sort === 'name') list = [...list].sort((a,b)=>a.name.localeCompare(b.name));
    return list;
  }, [productsList,key,type,saleOnly,query,sort]);
  return <div className="shop-page">
    <section className="shop-hero" style={{backgroundImage:`linear-gradient(90deg,rgba(28,27,24,.54),rgba(28,27,24,.04)),url(${info.image})`}}><div className="shop-hero-copy"><span className="eyebrow">THE AURELIA COLLECTION</span><h1>{info.title}</h1><p>{info.subtitle}</p></div><span className="shop-hero-index">COLLECTION / {key.toUpperCase()}</span></section>
    <section className="shop-content page-width"><div className="shop-intro"><div><span className="eyebrow">A GOOD PLACE TO START</span><h2>{query ? `Search: “${params.get('search')}”` : info.title}</h2><p>{filtered.length} thoughtful pieces to explore</p></div><div className="sort-control"><label htmlFor="sort-products">SORT BY</label><select id="sort-products" value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name</option></select></div></div>
      <div className="shop-toolbar"><div className="shop-tabs">{info.types.map(item=><button key={item} className={type===item?'selected':''} onClick={()=>setType(item)}>{item}</button>)}</div><button className={`filter-toggle ${saleOnly?'selected':''}`} onClick={()=>setSaleOnly(v=>!v)}>SALE ONLY <span>{saleOnly?'✓':'＋'}</span></button></div>
      <div className="shop-results"><span className="eyebrow">SHOWING {filtered.length} PIECES</span><button className="mobile-filter" onClick={()=>setFilterOpen(v=>!v)}>FILTER & SORT {filterOpen?'−':'＋'}</button></div>
      {filterOpen && <div className="mobile-filter-panel"><label>Sort by <select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label><label><input type="checkbox" checked={saleOnly} onChange={e=>setSaleOnly(e.target.checked)}/> On sale only</label></div>}
      {filtered.length ? <div className="shop-product-grid">{filtered.map((p,i)=><ProductCard key={p.id} product={p} index={i}/>)}</div> : <div className="empty-state"><div className="empty-icon">✳</div><h2>No pieces found.</h2><p>Try another search or clear your filters to see the full edit.</p><button className="button-outline" onClick={()=>{setType('All');setSaleOnly(false);}}>Clear filters</button></div>}
      <div className="shop-bottom-note"><span>✳</span> GOOD STYLE SHOULD FEEL GOOD, TOO.</div>
    </section>
  </div>;
}
