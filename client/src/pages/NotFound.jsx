import { Link } from 'react-router-dom';
import './NotFound.css';
export default function NotFound(){return <div className="not-found page-width"><span className="eyebrow">THIS PAGE TOOK A LITTLE DETOUR</span><h1>Well, this is<br/><em>unexpected.</em></h1><p>The page you're looking for isn't here. Let's get you back to the good stuff.</p><Link to="/" className="button-dark">Back to the beginning ↗</Link><span className="not-found-flower">✳</span></div>}
