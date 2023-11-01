import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUpForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Customer');
  const [rememberMe, setRememberMe] = useState(false); // Define the rememberMe state
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
  
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    // Create a JSON object to send to the server
    const signUpData = {
      username,
      email,
      password1: password, // Use password1 and password2 as expected by the backend
      password2: confirmPassword,
      user_type: role,
    };
  
    // Send a POST request with the JSON data
    fetch('http://127.0.0.1:5500/sign_up', { // Use the correct endpoint URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signUpData), // Send user object as JSON
    })
      .then((response) => {
        if (response.status === 201) {
          navigate('/login');
        } else {
          setError('An error occurred during signup. Please try again.');
        }
      })
      .catch((error) => {
        setError('An error occurred during signup. Please try again.');
      });
  };
  


  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="exampleInputUsername">Username</label>
          <input
            type="text"
            className="form-control"
            id="exampleInputUsername"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputConfirmPassword">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputConfirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputRole">Role</label>
          <select
            className="form-control"
            id="exampleInputRole"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="passenger">Passenger</option>
            <option value="BusOwner">BusOwner</option>
            
          </select>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="exampleCheck1"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="exampleCheck1">
            Check me out
          </label>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">
          Signup
        </button>
      </form>
    </div>
  );
}

export default SignUpForm;
