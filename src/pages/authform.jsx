import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthForm() {
  const [formType, setFormType] = useState('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-600 px-4 py-8">
      <div className="bg-black shadow-lg rounded-lg flex flex-col md:flex-row w-full max-w-4xl overflow-hidden max-h-[90vh] md:max-h-[80vh]">
        {/* Image container with flex and items-stretch to match form height */}
        <div className="hidden md:flex md:w-1/2 items-stretch">
          <img
            src="https://img.freepik.com/free-photo/cinema-light-board-red-background_23-2148457856.jpg"
            alt="Visual"
            className="w-full object-cover"
            style={{ height: '100%' }}
          />
        </div>

        {/* Form container */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 overflow-y-auto flex flex-col justify-center bg-gray-800 rounded-b-lg md:rounded-r-lg md:rounded-bl-none">
          <div className="flex justify-center space-x-6 mb-8">
            <button
              onClick={() => setFormType('login')}
              className={`py-3 px-6 sm:px-8 rounded-full font-semibold transition-colors duration-300 whitespace-nowrap ${
                formType === 'login'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setFormType('register')}
              className={`py-3 px-6 sm:px-8 rounded-full font-semibold transition-colors duration-300 whitespace-nowrap ${
                formType === 'register'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Register
            </button>
          </div>

          {formType === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('https://ticketbooking-backend-sr3r.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('userId', data.user._id || data.user.id);

        if (data.user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/home');
        }
      } else {
        setMessage(data.message || 'Login failed.');
      }
    } catch (err) {
      setMessage('Server error.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
      <h2 className="text-4xl font-bold text-red-600 mb-6 text-center">Login</h2>
      {message && <p className="text-center text-red-400">{message}</p>}
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-600 rounded-md bg-gray-900 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-red-500"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-600 rounded-md bg-gray-900 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-red-500"
        required
      />
      <button
        type="submit"
        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-semibold transition"
      >
        Login
      </button>
    </form>
  );
}

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setMessage('❌ Passwords do not match!');
      return;
    }

    try {
      const res = await fetch('https://ticketbooking-backend-sr3r.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Registration successful! Please check your email for confirmation.');
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'USER',
        });
      } else {
        setMessage(`❌ ${data.message || 'Registration failed.'}`);
      }
    } catch (error) {
      setMessage('❌ Server error.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
      <h2 className="text-4xl font-bold text-red-600 mb-6 text-center">Register</h2>

      {message && (
        <p
          className={`text-center mb-4 ${
            message.startsWith('✅') ? 'text-green-500' : 'text-red-400'
          }`}
        >
          {message}
        </p>
      )}

      <input
        type="text"
        name="name"
        placeholder="Enter your name"
        value={formData.name}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-600 rounded-md bg-gray-900 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-red-500"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-600 rounded-md bg-gray-900 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-red-500"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Create a password"
        value={formData.password}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-600 rounded-md bg-gray-900 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-red-500"
        required
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-600 rounded-md bg-gray-900 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-red-500"
        required
      />

      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-600 rounded-md bg-gray-900 text-gray-200 focus:outline-none focus:border-red-500"
      >
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
      </select>

      <button
        type="submit"
        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-semibold transition"
      >
        Register
      </button>
    </form>
  );
};
