import React from 'react';
import { supabase } from '../lib/supabase';
import { LogIn } from 'lucide-react';

import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

export const LoginScreen = () => {
  React.useEffect(() => {
    const setupDeepLink = async () => {
      App.addListener('appUrlOpen', async (event) => {
        if (event.url.includes('com.sgtracker.app://')) {
          await Browser.close();
          const url = new URL(event.url);
          const hashParams = new URLSearchParams(url.hash.substring(1));
          const access_token = hashParams.get('access_token');
          const refresh_token = hashParams.get('refresh_token');

          if (access_token && refresh_token) {
            await supabase.auth.setSession({
              access_token,
              refresh_token
            });
          } else {
            // Fallback if URL doesn't have hash params directly
            window.location.href = `/${url.search}${url.hash}`;
          }
        }
      });
    };
    setupDeepLink();
    return () => {
      App.removeAllListeners();
    };
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const isNative = Capacitor.isNativePlatform();

      if (isNative) {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: 'com.sgtracker.app://login-callback',
            skipBrowserRedirect: true
          }
        });
        
        if (error) throw error;
        
        if (data?.url) {
          await Browser.open({ url: data.url });
        }
      } else {
        // Standard web login
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error logging in with Google:', error.message);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'var(--bg-dark)',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
        border: '1px solid rgba(56, 189, 248, 0.3)'
      }}>
        <LogIn size={32} color="#38bdf8" />
      </div>
      
      <h1 className="title-lg" style={{ marginBottom: '8px' }}>SGHash Tracker</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '280px', lineHeight: 1.5 }}>
        Your personal finance tracker. Securely backed by Supabase.
      </p>

      <button 
        onClick={handleGoogleLogin}
        className="btn-primary"
        style={{
          width: '100%',
          maxWidth: '300px',
          padding: '16px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span style={{ fontSize: '1rem', fontWeight: 600 }}>Continue with Google</span>
      </button>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '24px' }}>
        Requires Supabase Google OAuth configuration.
      </p>
    </div>
  );
};
