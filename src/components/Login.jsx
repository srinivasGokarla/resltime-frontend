import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Login = () => {
  const navigation = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      navigation('/dashboard');
    }
  }, [navigation]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    socket.emit('addUser', formData.email);

    try {
      const response = await fetch('https://real-time-chat-d84s.onrender.com/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      const { token, userId, username } = data;
      socket.emit('login', { userId });
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId);
      alert('Login successfully');
      navigation(`/dashboard/${userId}`);
    } catch (error) {
      console.error('Error:', error.message);
      alert(error.message || 'Invalid credentials');
    }
  };

  return (
    <>
      <h2>User Login</h2>
      <div className="login">
        <form className="container" onSubmit={handleSubmit}>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <button type="submit">Login</button>
          <p>
            Don't have an account? <a href="/signup">Sign up here</a>.
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;