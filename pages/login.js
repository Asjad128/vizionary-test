import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://izhanrahman1.pythonanywhere.com';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginType, setLoginType] = useState('user');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${SERVER_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.role === loginType) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', data.role);
        window.location.href = '/';
      } else if (data.success && data.role !== loginType) {
        setError(`You are a ${data.role}, not a ${loginType}.`);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Failed to connect to the server. Is it running?');
    }
  };

  const handleForgotPassword = () => {
    alert('Please contact the administrator to reset your password.');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #6b21a8, #312e81, #1e3a8a)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <style>{`
        body { margin: 0; padding: 0; }
        input[type="checkbox"] { accent-color: #9333ea; }
        input::placeholder { opacity: 0.7; color: rgba(255, 255, 255, 0.7); }
      `}</style>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          maxWidth: '400px'
        }}
      >
        <h1 style={{
          fontSize: 'clamp(24px, 6vw, 48px)',
          fontWeight: '900',
          color: 'white',
          marginBottom: '32px',
          textAlign: 'center',
          textShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
        }}>
          Career Visualizer <span style={{ color: '#c4b5fd' }}>AI</span>
        </h1>

        <motion.div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px'
          }}
          whileHover={{
            scale: 1.03,
            boxShadow: "0px 20px 40px rgba(0,0,0,0.3)"
          }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '16px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" style={{
              height: '56px',
              width: '56px',
              color: 'white',
              opacity: 0.8
            }} viewBox="0 0 20 20" fill="white">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>

          <div style={{
            display: 'flex',
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '9999px',
            padding: '4px',
            gap: '0'
          }}>
            <button
              onClick={() => setLoginType('user')}
              style={{
                width: '50%',
                padding: '8px 0',
                borderRadius: '9999px',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: loginType === 'user' ? '#9333ea' : 'transparent',
                opacity: loginType === 'user' ? 1 : 0.7,
                fontWeight: '500'
              }}
            >
              User
            </button>
            <button
              onClick={() => setLoginType('admin')}
              style={{
                width: '50%',
                padding: '8px 0',
                borderRadius: '9999px',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: loginType === 'admin' ? '#9333ea' : 'transparent',
                opacity: loginType === 'admin' ? 1 : 0.7,
                fontWeight: '500'
              }}
            >
              Admin
            </button>
          </div>

          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'white',
            opacity: 0.9
          }}>
            {loginType === 'admin' ? 'Admin Login' : 'User Login'}
          </h2>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: '#fca5a5',
                backgroundColor: 'rgba(159, 18, 57, 0.4)',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center',
                width: '100%',
                fontSize: '14px'
              }}
            >
              {error}
            </motion.p>
          )}

          <form onSubmit={handleSubmit} style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease'
            }} onFocus={(e) => e.currentTarget.style.borderColor = '#a78bfa'} onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'}>
              <svg xmlns="http://www.w3.org/2000/svg" style={{
                height: '24px',
                width: '24px',
                color: 'white',
                marginRight: '12px',
                opacity: 0.7,
                flex: '0 0 auto'
              }} fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email ID"
                style={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  color: 'white',
                  padding: '8px 0',
                  border: 'none',
                  outline: 'none',
                  fontSize: '18px'
                }}
              />
            </div>

            <div style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease'
            }} onFocus={(e) => e.currentTarget.style.borderColor = '#a78bfa'} onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'}>
              <svg xmlns="http://www.w3.org/2000/svg" style={{
                height: '24px',
                width: '24px',
                color: 'white',
                marginRight: '12px',
                opacity: 0.7,
                flex: '0 0 auto'
              }} fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                style={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  color: 'white',
                  padding: '8px 0',
                  border: 'none',
                  outline: 'none',
                  fontSize: '18px'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              fontSize: '14px',
              marginTop: '8px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                color: 'white',
                opacity: 0.8,
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  style={{
                    height: '16px',
                    width: '16px',
                    marginRight: '8px',
                    cursor: 'pointer'
                  }}
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                style={{
                  color: '#d8b4fe',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Forgot Password?
              </button>
            </div>

            <motion.button
              type="submit"
              style={{
                width: '100%',
                color: 'white',
                fontSize: '20px',
                fontWeight: '600',
                padding: '12px',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                marginTop: '16px',
                background: 'linear-gradient(to right, #9333ea, #4f46e5)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              LOGIN
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
