import React from 'react';
import { Phone, Calendar, UserCheck, ShieldCheck, Wrench, LogIn, LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '../services/authContext';

interface HeaderProps {
  onOpenBooking: () => void;
  onOpenMyReservations: () => void;
  onOpenAuth: () => void;
  onToggleAdminView: () => void;
  isAdminView: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBooking,
  onOpenMyReservations,
  onOpenAuth,
  onToggleAdminView,
  isAdminView
}) => {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-shadow">
      {/* Top Banner with phone and emergency note */}
      <div className="bg-stone-900 text-stone-300 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-400 font-semibold px-2 py-0.5 rounded text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% 숙련 한국인 기사 직접 방문
            </span>
            <span className="hidden sm:inline text-stone-400">
              서울·경기·인천 전 지역 당일/예약 출장 방문
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a 
              href="tel:010-2752-2662" 
              className="flex items-center gap-1.5 text-amber-400 font-bold hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>대표전화: 010-2752-2662</span>
            </a>
            <span className="text-stone-600 hidden md:inline">|</span>
            <span className="text-stone-400 hidden md:inline">
              상담시간 08:00 ~ 21:00 (연중무휴)
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-600/20 group-hover:scale-105 transition-transform">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-stone-900">
                바른집인테리어 <span className="text-amber-600">집수리</span>
              </span>
              <span className="hidden lg:inline-block text-[11px] font-semibold text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-full">
                정찰제 출장전문
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium tracking-tight">
              정직함과 기술력으로 찾아가는 프리미엄 홈케어
            </p>
          </div>
        </a>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-700">
          <a href="#services" className="hover:text-amber-600 transition-colors">수리 서비스</a>
          <a href="#before-after" className="hover:text-amber-600 transition-colors">시공 전후 비교</a>
          <a href="#trust" className="hover:text-amber-600 transition-colors">바른집 4대 약속</a>
          <a href="#faq" className="hover:text-amber-600 transition-colors">이용 안내</a>
        </nav>

        {/* Right CTA Area */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Admin Mode Switch (for admin user or toggle) */}
          {(isAdmin || user?.isAdmin) && (
            <button
              onClick={onToggleAdminView}
              className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 ${
                isAdminView
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
              }`}
              title="관리자 대시보드 전환"
            >
              <ShieldAlert className="w-4 h-4" />
              <span className="hidden sm:inline">{isAdminView ? '홈페이지 보기' : '관리자 모드'}</span>
            </button>
          )}

          {/* User Account / Reservation Lookup */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenMyReservations}
                className="text-xs sm:text-sm font-medium px-3 py-2 rounded-lg bg-stone-100 text-stone-800 hover:bg-stone-200 transition-colors flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline">예약내역 ({user.displayName?.split(' ')[0]})</span>
                <span className="sm:hidden">내예약</span>
              </button>
              <button
                onClick={() => signOut()}
                className="text-xs text-stone-500 hover:text-stone-800 p-2"
                title="로그아웃"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={onOpenMyReservations}
                className="text-xs sm:text-sm font-medium px-3 py-2 rounded-lg text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors"
              >
                예약 조회
              </button>
              <button
                onClick={onOpenAuth}
                className="text-xs sm:text-sm font-medium px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors flex items-center gap-1"
              >
                <LogIn className="w-4 h-4 text-stone-500" />
                <span className="hidden sm:inline">로그인</span>
              </button>
            </div>
          )}

          {/* Primary CTA Booking Button */}
          <button
            onClick={onOpenBooking}
            className="px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 shadow-md shadow-amber-600/25 hover:shadow-lg hover:shadow-amber-600/30 transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>방문 예약하기</span>
          </button>
        </div>
      </div>
    </header>
  );
};
