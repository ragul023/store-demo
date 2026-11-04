import { Link } from "react-router-dom";
import "./Footer.css";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/" className="brand-name">
            aura<span>.</span>
          </Link>
          <p>
            Thoughtful pieces for the many versions of you. Made for real life,
            and all the lovely bits in between.
          </p>
          <div className="social-links">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              Instagram ↗
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer">
              Pinterest ↗
            </a>
          </div>
        </div>
        <div className="footer-column">
          <span className="eyebrow">EXPLORE</span>
          <Link to="/shop/men">Men</Link>
          <Link to="/shop/women">Women</Link>
          <Link to="/shop/kids">Kids</Link>
          <Link to="/collections">Collections</Link>
          <Link to="/offers">Offers</Link>
        </div>
        <div className="footer-column">
          <span className="eyebrow">WE'RE HERE</span>
          <Link to="/account">My account</Link>
          <Link to="/orders">Track an order</Link>
          <a href="mailto:hello@aura.store">Contact us</a>
          <a href="mailto:hello@aura.store">Shipping & returns</a>
          <a href="mailto:hello@aura.store">FAQs</a>
        </div>
        <div className="footer-newsletter">
          <span className="eyebrow">A NOTE FROM US</span>
          <h3>
            A little more lovely
            <br />
            in your inbox.
          </h3>
          <p>New arrivals, thoughtful edits and the occasional good thing.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.currentTarget.reset();
              alert("Thank you for subscribing!");
            }}
          >
            <input
              type="email"
              required
              placeholder="Your email address"
              aria-label="Email address"
            />
            <button aria-label="Subscribe">↗</button>
          </form>
          <small>
            By subscribing, you agree to receive occasional emails from us.
          </small>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 AURA. MADE FOR EVERYDAY.</span>
        <div>
          <a href="#top">Privacy</a>
          <a href="#top">Terms</a>
          <span>India · ₹ INR</span>
        </div>
        <span>DESIGNED WITH INTENTION ✳</span>
      </div>
    </footer>
  );
}
