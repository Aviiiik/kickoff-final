import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust the import path as needed
import './Register.css'; // Optional: For styling
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setSuccess('');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUid = userCredential.user.uid;

      // Register the user in the backend
      await axios.post('http://localhost:3001/login', { firebaseUid, email });

      setSuccess('Registration successful!');
      setTimeout(() => {
        navigate('/schedule');
      }, 5);
      setError('');
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  }

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
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
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-register">Sign Up</button>
      </form>
      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Register;