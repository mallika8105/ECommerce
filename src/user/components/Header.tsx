import React from "react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js"; // Import Session type-only
import { supabase } from "../../supabaseClient"; // Import supabase client
import "./Header.css";

// Define props for Header component
interface HeaderProps {
  cartItemCount?: number; // Optional prop for cart item count
  session: Session | null; // Add session prop
}

const Header: React.FC<HeaderProps> = ({ cartItemCount = 0, session }) => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
    } else {
      // Optionally redirect to home or login page after logout
      // navigate('/login');
    }
  };

  return (
    <header className="header">
      <div className="header-top">
        <nav className="header-nav-left">
          <ul>
            <li>
              <Link to="/products">Shop</Link>
            </li>{" "}
            {/* Added Shop link */}
            <li>
              <a href="#">Contact</a>
            </li>
            <li>
              <a href="#">Lifetime Buyback Policy</a>
            </li>
            <li>
              <a href="#">More</a>
            </li>
          </ul>
        </nav>
        <div className="header-logo">
          <h1>elfy</h1>
        </div>
        <div className="header-icons">
          <span className="icon">🔍</span> {/* Search icon */}
          {session ? (
            <>
              <Link to="/user-account" className="icon-link">
                <span className="icon">👤</span> {/* User icon */}
              </Link>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="icon-link">
              <span className="icon">👤</span> {/* Login icon */}
            </Link>
          )}
          <Link to="/cart" className="icon-link">
            <span className="icon">
              🛒<sup>{cartItemCount}</sup>
            </span>{" "}
            {/* Cart icon with count */}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
