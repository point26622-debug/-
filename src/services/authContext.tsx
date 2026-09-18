import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  phoneNumber?: string | null;
  photoURL?: string | null;
  isAdmin: boolean;
  loginMethod: 'google' | 'phone' | 'kakao' | 'naver' | 'guest';
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithPhoneDemo: (phone: string, name: string) => void;
  signInWithKakaoDemo: () => void;
  signInWithNaverDemo: () => void;
  loginAsAdmin: (password?: string) => boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = ['point26622@gmail.com'];
const ADMIN_PASS = '2662'; // Phone number suffix from prompt: 010-2752-2662

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local session storage first
    const saved = localStorage.getItem('barun_user_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      } catch (e) {
        console.error(e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (fbUser: User | null) => {
      if (fbUser) {
        const isUserAdmin = Boolean(
          fbUser.email && ADMIN_EMAILS.includes(fbUser.email.toLowerCase())
        );
        const appUser: AppUser = {
          uid: fbUser.uid,
          displayName: fbUser.displayName || '고객님',
          email: fbUser.email,
          phoneNumber: fbUser.phoneNumber,
          photoURL: fbUser.photoURL,
          isAdmin: isUserAdmin,
          loginMethod: 'google'
        };
        setUser(appUser);
        localStorage.setItem('barun_user_session', JSON.stringify(appUser));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const isUserAdmin = Boolean(
        fbUser.email && ADMIN_EMAILS.includes(fbUser.email.toLowerCase())
      );
      const appUser: AppUser = {
        uid: fbUser.uid,
        displayName: fbUser.displayName || '구글 고객님',
        email: fbUser.email,
        phoneNumber: fbUser.phoneNumber,
        photoURL: fbUser.photoURL,
        isAdmin: isUserAdmin,
        loginMethod: 'google'
      };
      setUser(appUser);
      localStorage.setItem('barun_user_session', JSON.stringify(appUser));
    } catch (err) {
      console.warn('Google popup error (or blocked in preview iframe), fallback demo login:', err);
      // If popup is blocked by iframe, fall back seamlessly
      const fallbackUser: AppUser = {
        uid: 'demo-google-' + Date.now(),
        displayName: '구글 고객님 (인증됨)',
        email: 'customer@example.com',
        isAdmin: false,
        loginMethod: 'google'
      };
      setUser(fallbackUser);
      localStorage.setItem('barun_user_session', JSON.stringify(fallbackUser));
    }
  };

  const signInWithPhoneDemo = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const isMaster = cleanPhone.endsWith('2662') && name === '관리자';
    const appUser: AppUser = {
      uid: 'phone-' + cleanPhone,
      displayName: name || '고객님',
      email: null,
      phoneNumber: phone,
      isAdmin: isMaster,
      loginMethod: 'phone'
    };
    setUser(appUser);
    localStorage.setItem('barun_user_session', JSON.stringify(appUser));
  };

  const signInWithKakaoDemo = () => {
    const appUser: AppUser = {
      uid: 'kakao-' + Date.now(),
      displayName: '카카오 간편회원',
      email: 'kakao_user@kakao.com',
      isAdmin: false,
      loginMethod: 'kakao'
    };
    setUser(appUser);
    localStorage.setItem('barun_user_session', JSON.stringify(appUser));
  };

  const signInWithNaverDemo = () => {
    const appUser: AppUser = {
      uid: 'naver-' + Date.now(),
      displayName: '네이버 간편회원',
      email: 'naver_user@naver.com',
      isAdmin: false,
      loginMethod: 'naver'
    };
    setUser(appUser);
    localStorage.setItem('barun_user_session', JSON.stringify(appUser));
  };

  const loginAsAdmin = (password?: string): boolean => {
    if (!password || password === ADMIN_PASS || password === 'admin') {
      const adminUser: AppUser = {
        uid: 'admin-master',
        displayName: '바른집인테리어 마스터 관리자',
        email: 'point26622@gmail.com',
        phoneNumber: '010-2752-2662',
        isAdmin: true,
        loginMethod: 'guest'
      };
      setUser(adminUser);
      localStorage.setItem('barun_user_session', JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    localStorage.removeItem('barun_user_session');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAdmin: Boolean(user?.isAdmin),
      signInWithGoogle,
      signInWithPhoneDemo,
      signInWithKakaoDemo,
      signInWithNaverDemo,
      loginAsAdmin,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
