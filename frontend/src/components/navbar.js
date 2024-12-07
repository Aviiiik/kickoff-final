import React, { useState, useEffect } from 'react';
import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Firebase authentication
import { signOut } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set user info if logged in
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null); // Clear user after logout
        navigate('/login'); // Redirect to login page after logout
      })
      .catch((error) => {
        console.error("Error signing out:", error.message);
      });
  };

  const handleScheduleRedirect = () => {
    navigate('/schedule');
  };

  // Extract username from email (the part before the '@')
  const getUsername = (email) => {
    return email ? email.split('@')[0] : '';
  };

  return (
    <div className='navbar-container'>
      <div className='left-box'>
        <h1><Link to="/">Donna</Link></h1>
      </div>
      <div className='right-box'>
        <li id="aboutus"><Link to="/aboutus">About Us</Link></li>

        {!user ? (
          <li id="login"><Link to="/login">Login</Link></li> // Show Login link if no user is logged in
        ) : (
          <div className="user-info" onClick={toggleMenu}>
            <span>Hello, {getUsername(user.email)} </span> {/* Display username (part before @) */}
            <span className="arrow">&#x25BC;</span> {/* Down Arrow */}
            {menuOpen && (
              <div className="dropdown-menu">
                <button onClick={handleScheduleRedirect}>Schedule</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
