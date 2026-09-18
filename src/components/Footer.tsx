import React from 'react';
import { Phone, MapPin, Clock, Wrench, ShieldCheck, Lock } from 'lucide-react';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenAuth: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onOpenAuth }) => {
  return (
    <footer className="bg-stone-950 text-stone-400 text-xs border-t border-stone-800 pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-stone-800">
          
          {/* Col 1: Brand & Promise */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white font-bold">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                바른집인테리어 <span className="text-amber-500">집수리</span>
              </span>
            </div>
            
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-md">
              우리 집 문제, 어디에 맡길지 고민되셨죠? 정직함과 기술력을 갖춘 ‘바른집인테리어 집수리’가 직접 찾아갑니다.
              거품 없는 정찰제, 꼼꼼한 마감, 확실한 1년 무상 A/S까지 보증합니다.
            </p>

            <div className="flex flex-wrap gap-2 text-[11px] text-amber-400">
              <span className="bg-stone-900 border border-stone-800 px-2.5 py-1 rounded">100% 한국인 기사</span>
              <span className="bg-stone-900 border border-stone-800 px-2.5 py-1 rounded">사전 정찰제 견적</span>
              <span className="bg-stone-900 border border-stone-800 px-2.5 py-1 rounded">1년 무상 A/S</span>
              <span className="bg-stone-900 border border-stone-800 px-2.5 py-1 rounded">마감 청소 수거</span>
            </div>
          </div>

          {/* Col 2: Contact & Hours */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-white font-bold text-sm">고객센터 &amp; 출장 안내</h4>
            
            <div className="space-y-2 text-stone-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500" />
                <span className="text-stone-400">대표전화:</span>
                <a href="tel:010-2752-2662" className="text-white font-extrabold text-base hover:text-amber-400">
                  010-2752-2662
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>출장 예약 및 유선 상담: <strong>08:00 ~ 21:00</strong> (연중무휴)</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>출장 가능 지역:</strong> 서울 전지역 / 경기 전지역(분당, 판교, 일산, 수원, 용인 등) / 인천 전지역</span>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-sm">빠른 메뉴</h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button onClick={onOpenBooking} className="hover:text-amber-400 transition-colors font-medium">
                  → 원하는 시간 방문 예약
                </button>
              </li>
              <li>
                <a href="#before-after" className="hover:text-amber-400 transition-colors">
                  → 시공 전후 (Before &amp; After)
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-400 transition-colors">
                  → 4대 핵심 집수리 서비스
                </a>
              </li>
              <li>
                <button onClick={onOpenAuth} className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>관리자 대시보드 로그인</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <div>
            <p>상호명: 바른집인테리어 집수리 | 대표자: 마스터 엔지니어 | 사업장소재지: 서울특별시 마포구 공덕동</p>
            <p className="mt-1">고객센터 직통: 010-2752-2662 | 이메일: point26622@gmail.com</p>
            <p className="mt-1">© 2026 바른집인테리어 집수리. All rights reserved.</p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onOpenAuth} className="text-stone-400 hover:text-stone-300 underline">
              관리자 모드
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
