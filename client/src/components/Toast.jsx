import { useStore } from '../context/StoreContext';
import './Toast.css';
export default function Toast() { const { notice } = useStore(); return <div className={`toast-message ${notice ? 'toast-visible' : ''}`} role="status"><span>✓</span>{notice}</div>; }
