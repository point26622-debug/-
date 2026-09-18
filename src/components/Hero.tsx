import React from 'react';
import { Calendar, Phone, CheckCircle2, Shield, Award, Clock, Star, ArrowRight } from 'lucide-react';
import heroEngineerImg from '../assets/images/technician_hero_1789744191843.jpg';

interface HeroProps {
  onOpenBooking: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onSelectCategory }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-100 via-stone-50 to-white pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-stone-200">
      {/* Background Subtle Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Copywriting & CTA */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 border border-amber-300/80 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-tight shadow-sm">
              <Shield className="w-4 h-4 text-amber-600" />
              <span>100% 숙련 한국인 베테랑 기사 직접 방문 보증</span>
            </div>

            {/* Main Head Copy */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-stone-900 leading-[1.28] tracking-tight">
              우리 집 문제, 어디에 맡길지 고민되셨죠?
              <br />
              <span className="text-amber-700 underline decoration-amber-300 decoration-wavy decoration-2">
                정직함과 기술력을 갖춘
              </span>
              <br />
              <span className="text-stone-950">
                &lsquo;바른집인테리어 집수리&rsquo;
              </span>
              가 직접 찾아갑니다.
            </h1>

            {/* Sub Copy */}
            <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-normal max-w-2xl">
              거품 없는 정찰제, 꼼꼼한 마감, 확실한 A/S까지!
              <br className="hidden sm:inline" />
              원하시는 날짜와 시간에 딱 맞춰 방문하는 프리미엄 가정방문 출장 서비스입니다.
            </p>

            {/* Value Checkpoints */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-stone-800 text-xs sm:text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>정찰제 투명 견적</span>
              </div>
              <div className="flex items-center gap-2 text-stone-800 text-xs sm:text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>시공 후 1년 무상 A/S</span>
              </div>
              <div className="flex items-center gap-2 text-stone-800 text-xs sm:text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>현장 완벽 뒷정리</span>
              </div>
            </div>

            {/* CTA Buttons & Representative Phone */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="px-7 py-4 rounded-xl font-extrabold text-base sm:text-lg text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 shadow-xl shadow-amber-600/30 hover:shadow-2xl hover:shadow-amber-600/40 transition-all flex items-center justify-center gap-3 group"
              >
                <Calendar className="w-5 h-5 text-amber-100 group-hover:scale-110 transition-transform" />
                <span>원하는 시간에 방문 예약하기</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="tel:010-2752-2662"
                className="px-6 py-4 rounded-xl font-bold text-base text-stone-800 bg-white hover:bg-stone-50 border-2 border-stone-300 hover:border-amber-500 shadow-sm transition-all flex items-center justify-center gap-2.5"
              >
                <Phone className="w-5 h-5 text-amber-600 animate-pulse" />
                <div className="text-left">
                  <div className="text-[11px] text-stone-500 font-semibold leading-none">빠른 전화 상담</div>
                  <div className="text-base sm:text-lg font-black tracking-tight text-stone-900 leading-tight">010-2752-2662</div>
                </div>
              </a>
            </div>

            {/* Quick Service Category Jump Chips */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-stone-500 mb-2">원하시는 수리 서비스를 바로 선택해 보세요:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'bathroom', label: '🚿 욕실 리모델링' },
                  { id: 'kitchen', label: '🍳 주방/배관 누수' },
                  { id: 'waterproof', label: '💧 방수/결로 설비' },
                  { id: 'general', label: '🔧 종합 가정 집수리' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-200/80 hover:bg-amber-100 hover:text-amber-900 text-stone-700 border border-stone-300/80 transition-all"
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual & Engineer Portrait */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Decorative background glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-amber-400/20 via-orange-300/20 to-transparent rounded-3xl blur-2xl -z-10" />

              {/* Main Image Card */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100">
                <img
                  src={heroEngineerImg}
                  alt="바른집인테리어 전문 엔지니어 출장 방문 모습"
                  className="w-full h-auto object-cover aspect-[4/3] sm:aspect-[4/3] hover:scale-102 transition-transform duration-500"
                />

                {/* Floating Badge 1: Engineer Trust */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-stone-200/80 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-stone-900 leading-none">숙련된 한국인 기사</div>
                    <div className="text-[11px] text-amber-700 font-medium mt-0.5">정밀 점검부터 깔끔한 정리까지</div>
                  </div>
                </div>

                {/* Floating Badge 2: Quick On-time Arrival */}
                <div className="absolute bottom-4 right-4 bg-stone-900/95 text-white backdrop-blur-md px-4 py-2.5 rounded-xl shadow-xl border border-stone-700/80 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-none">희망 시간 100% 엄수</div>
                    <div className="text-[11px] text-stone-300 mt-0.5">원하는 일정에 맞춤 출장</div>
                  </div>
                </div>
              </div>

              {/* Trust Testimonial Snippet */}
              <div className="mt-4 bg-white p-3.5 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-stone-800">고객 만족도 99.4%</span>
                </div>
                <span className="text-stone-500 text-[11px]">누적 시공 및 집수리 3,800+ 건 돌파</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
