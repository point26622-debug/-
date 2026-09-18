import React, { useState } from 'react';
import { X, Phone, Lock, ShieldCheck, CheckCircle2, User, KeyRound } from 'lucide-react';
import { useAuth } from '../services/authContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRedirectToAdmin?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessRedirectToAdmin
}) => {
  const { signInWithGoogle, signInWithPhoneDemo, signInWithKakaoDemo, signInWithNaverDemo, loginAsAdmin } = useAuth();
  
  const [tab, setTab] = useState<'customer' | 'admin'>('customer');
  const [phone, setPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !customerName.trim()) {
      setErrorMsg('성함과 휴대폰 번호를 모두 입력해주세요.');
      return;
    }
    signInWithPhoneDemo(phone.trim(), customerName.trim());
    onClose();
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAsAdmin(adminPass);
    if (success) {
      onClose();
      if (onSuccessRedirectToAdmin) onSuccessRedirectToAdmin();
    } else {
      setErrorMsg('관리자 인증 번호가 일치하지 않습니다. (기본: 2662)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-stone-900 text-white flex items-center justify-between">
          <div>
            <div className="text-xs text-amber-500 font-bold uppercase tracking-wider">
              BARUN HOME MEMBER SYSTEM
            </div>
            <h3 className="text-xl font-bold mt-0.5">
              {tab === 'customer' ? '간편 로그인 및 본인 확인' : '관리자 전용 로그인'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-stone-200 bg-stone-100 text-xs font-bold">
          <button
            onClick={() => { setTab('customer'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-center transition-colors ${
              tab === 'customer'
                ? 'bg-white text-stone-900 border-b-2 border-amber-600'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            일반 고객 (예약 조회)
          </button>
          <button
            onClick={() => { setTab('admin'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-1.5 ${
              tab === 'admin'
                ? 'bg-white text-amber-700 border-b-2 border-amber-600'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>관리자 로그인</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {errorMsg}
            </div>
          )}

          {tab === 'customer' ? (
            <div className="space-y-4">
              {/* Quick Social Buttons */}
              <div className="space-y-2.5">
                {/* Google Sign-in */}
                <button
                  onClick={async () => {
                    await signInWithGoogle();
                    onClose();
                  }}
                  className="w-full py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 font-bold text-xs sm:text-sm text-stone-800 flex items-center justify-center gap-3 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google 계정으로 간편 시작</span>
                </button>

                {/* Kakao Sign-in */}
                <button
                  onClick={() => {
                    signInWithKakaoDemo();
                    onClose();
                  }}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-stone-900 bg-[#FEE500] hover:bg-[#FDD800] flex items-center justify-center gap-3 transition-colors shadow-sm"
                >
                  <span className="font-black text-xs px-1.5 py-0.5 rounded bg-stone-900 text-[#FEE500]">TALK</span>
                  <span>카카오 간편 로그인</span>
                </button>

                {/* Naver Sign-in */}
                <button
                  onClick={() => {
                    signInWithNaverDemo();
                    onClose();
                  }}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#03C75A] hover:bg-[#02b351] flex items-center justify-center gap-3 transition-colors shadow-sm"
                >
                  <span className="font-black text-xs px-1 py-0.5 rounded bg-white text-[#03C75A]">N</span>
                  <span>네이버 아이디로 로그인</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-stone-400 font-semibold">또는 휴대폰 번호로 예약 조회</span>
                </div>
              </div>

              {/* Phone based lookup */}
              <form onSubmit={handlePhoneSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    예약자 성함
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="홍길동"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    휴대폰 번호
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010-1234-5678"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm bg-stone-900 hover:bg-stone-800 text-white transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>내 예약 내역 확인하기</span>
                </button>
              </form>
            </div>
          ) : (
            /* Admin Login Tab */
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <ShieldCheck className="w-4 h-4 inline mr-1 text-amber-600" />
                <strong>관리자 전용 대시보드</strong>: 실시간 예약 접수 현황 확인, 엔지니어 배정, 상태 변경 및 알림 문자 재발송이 가능합니다.
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  관리자 비밀번호 또는 마스터 코드
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="대표번호 끝자리 2662"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  (기본 마스터 비밀번호: <strong className="text-amber-700 font-mono">2662</strong>)
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm bg-amber-600 hover:bg-amber-700 text-white transition-colors flex items-center justify-center gap-2 shadow-md shadow-amber-600/25"
              >
                <Lock className="w-4 h-4" />
                <span>관리자 대시보드 로그인</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAdminPass('2662');
                    loginAsAdmin('2662');
                    onClose();
                    if (onSuccessRedirectToAdmin) onSuccessRedirectToAdmin();
                  }}
                  className="text-xs text-amber-700 underline font-semibold hover:text-amber-800"
                >
                  ⚡ 관리자 빠른 1초 접속 (테스트용)
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
