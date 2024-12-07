import React, { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust the path as needed
import './Login.css'; // Optional: For styling
import { Link, useNavigate } from 'react-router-dom'; // Optional: For navigation
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleEmailLogin(e) {
    e.preventDefault();
    try {
      // Ensure email is used after it's declared by useState
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUid = userCredential.user.uid;

      // Log in the user via backend
      const response = await axios.post('http://localhost:3001/login', { firebaseUid, email });
      const { id, username } = response.data;
      localStorage.setItem('userId', id); // Store userId for future requests
      localStorage.setItem('username', username);

      alert('Login Successful');
      navigate('/schedule');
    } catch (err) {
      setError(err.message);
    }
  }

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUid = userCredential.user.uid;
      const email = userCredential.user.email;

      // Call your backend to register/login the user
      const response = await axios.post('http://localhost:3001/login', { firebaseUid, email });
      const { id, username } = response.data;
      localStorage.setItem('userId', id);
      localStorage.setItem('username', username);

      alert('Login Successful');
      navigate('/schedule');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleEmailLogin}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-login">Login</button>
      </form>
      <p className="signup-prompt">
        Haven't registered?{' '}
        <Link to="/register" className="signup-link">
          Sign Up
        </Link>
      </p>
      <p>Or</p>
      <button onClick={handleGoogleLogin} className="btn-google">
        Sign in with Google
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Login;