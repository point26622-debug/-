import React, { useState } from 'react';
import { BEFORE_AFTER_CASES } from '../data/mockCases';
import { BeforeAfterCase } from '../types';
import { CheckCircle2, AlertTriangle, Sparkles, Sliders, Calendar, ArrowRight } from 'lucide-react';

interface BeforeAfterGalleryProps {
  onBookWithService: (serviceName: string) => void;
}

export const BeforeAfterGallery: React.FC<BeforeAfterGalleryProps> = ({ onBookWithService }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(BEFORE_AFTER_CASES[0].id);
  const [sliderPositions, setSliderPositions] = useState<Record<string, number>>({
    'case-bathroom': 50,
    'case-kitchen': 50,
    'case-waterproof': 50,
    'case-general': 50
  });
  const [viewMode, setViewMode] = useState<'slider' | 'split'>('slider');

  const activeCase = BEFORE_AFTER_CASES.find(c => c.id === selectedCaseId) || BEFORE_AFTER_CASES[0];
  const currentSliderPos = sliderPositions[activeCase.id] ?? 50;

  const handleSliderChange = (val: number) => {
    setSliderPositions(prev => ({
      ...prev,
      [activeCase.id]: val
    }));
  };

  return (
    <section id="before-after" className="py-16 sm:py-20 bg-stone-100/70 border-b border-stone-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 border border-amber-300 font-bold px-3 py-1 rounded-full text-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>실제 현장 시공 포트폴리오</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
            눈으로 확인하는 <span className="text-amber-600">시공 전후 (Before &amp; After)</span> 비교
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
            바른집인테리어 집수리의 손길을 거쳐 쾌적하고 안전하게 재탄생한 실제 가정집 시공 사례입니다.
            직접 슬라이더를 밀어 전후 차이를 비교해 보세요.
          </p>
        </div>

        {/* Case Navigation Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {BEFORE_AFTER_CASES.map((c) => {
            const isSelected = c.id === selectedCaseId;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20 scale-102'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50 hover:border-stone-400'
                }`}
              >
                <span>[{c.category}] {c.title.split(' ')[0]} {c.title.split(' ')[1]}</span>
              </button>
            );
          })}
        </div>

        {/* Featured Case Display Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200/90 overflow-hidden">
          {/* Case Header Info */}
          <div className="p-6 sm:p-8 bg-stone-900 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="bg-amber-500 text-stone-950 text-xs font-black px-2.5 py-1 rounded">
                  {activeCase.category}
                </span>
                <span className="text-xs text-stone-400">{activeCase.location}</span>
                <span className="text-xs text-stone-400">| {activeCase.period}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black mt-2 tracking-tight">
                {activeCase.title}
              </h3>
            </div>

            {/* View Mode Toggle & Book button */}
            <div className="flex items-center gap-3">
              <div className="bg-stone-800 p-1 rounded-xl flex items-center border border-stone-700">
                <button
                  onClick={() => setViewMode('slider')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    viewMode === 'slider' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 inline mr-1" /> 슬라이더 비교
                </button>
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    viewMode === 'split' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  나란히 보기
                </button>
              </div>

              <button
                onClick={() => onBookWithService(activeCase.category)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors flex items-center gap-1.5 shadow"
              >
                <Calendar className="w-4 h-4" />
                <span>이 시공 문의하기</span>
              </button>
            </div>
          </div>

          {/* Visual Comparison Area */}
          <div className="p-6 sm:p-8">
            {viewMode === 'slider' ? (
              <div className="space-y-4">
                {/* Interactive Slider Container */}
                <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-[480px] rounded-xl overflow-hidden select-none shadow-md border border-stone-300">
                  {/* After Image (Background) */}
                  <img
                    src={activeCase.after.image}
                    alt={`${activeCase.title} 시공 후`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-emerald-600/90 text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-md backdrop-blur-sm">
                    시공 후 (After) ✨
                  </div>

                  {/* Before Image (Foreground with Clip Path) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `polygon(0 0, ${currentSliderPos}% 0, ${currentSliderPos}% 100%, 0 100%)` }}
                  >
                    <img
                      src={activeCase.before.image}
                      alt={`${activeCase.title} 시공 전`}
                      className="absolute inset-0 w-full h-full object-cover filter brightness-90 contrast-95"
                    />
                    <div className="absolute top-4 left-4 bg-rose-600/90 text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-md backdrop-blur-sm">
                      시공 전 (Before) ⚠️
                    </div>
                  </div>

                  {/* Slider Divider Line & Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize flex items-center justify-center"
                    style={{ left: `${currentSliderPos}%`, transform: 'translateX(-50%)' }}
                  >
                    <div className="w-8 h-8 rounded-full bg-white text-stone-900 shadow-xl flex items-center justify-center font-bold text-xs border-2 border-amber-600">
                      ↔
                    </div>
                  </div>

                  {/* Transparent Range Input Overlay for Dragging */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentSliderPos}
                    onChange={(e) => handleSliderChange(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                    aria-label="비포 애프터 슬라이더 조절"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500 px-1">
                  <span>← 좌측으로 밀면 &lsquo;시공 후&rsquo; 전체 확인</span>
                  <span className="font-semibold text-amber-700">마우스 또는 터치로 좌우 드래그하세요</span>
                  <span>우측으로 밀면 &lsquo;시공 전&rsquo; 전체 확인 →</span>
                </div>
              </div>
            ) : (
              /* Side-by-side Split View */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden border-2 border-rose-200 shadow-sm">
                    <img
                      src={activeCase.before.image}
                      alt="시공 전"
                      className="w-full h-full object-cover filter brightness-95"
                    />
                    <div className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded shadow">
                      시공 전 (Before)
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden border-2 border-emerald-300 shadow-sm">
                    <img
                      src={activeCase.after.image}
                      alt="시공 후"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded shadow">
                      시공 후 (After) ✨
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Description Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Before Card */}
              <div className="p-5 rounded-xl bg-rose-50/70 border border-rose-200">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-sm mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>시공 전 (Before) 문제 상황</span>
                </div>
                <p className="text-stone-800 text-sm leading-relaxed mb-3">
                  {activeCase.before.description}
                </p>
                <div className="space-y-1.5 pt-2 border-t border-rose-200/60">
                  {activeCase.before.issues.map((issue, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-rose-900">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* After Card */}
              <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>시공 후 (After) 개선 결과</span>
                </div>
                <p className="text-stone-800 text-sm leading-relaxed mb-3">
                  {activeCase.after.description}
                </p>
                <div className="space-y-1.5 pt-2 border-t border-emerald-200/60">
                  {activeCase.after.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-emerald-950 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Case CTA Banner */}
            <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-amber-950">
                  우리 집도 이와 비슷한 고장/노후 증상이 있나요?
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  현장 사진 한 장만 등록해 주시면 숙련 기사님이 정밀 점검 및 정찰제 견적을 안내해 드립니다.
                </p>
              </div>
              <button
                onClick={() => onBookWithService(activeCase.category)}
                className="px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/25 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <span>이 서비스 바로 예약하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
