import React from 'react';
import { SERVICE_ITEMS } from '../data/mockCases';
import { Bath, Pipette, Droplets, Wrench, CheckCircle2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

interface ServiceCategoriesProps {
  onSelectService: (serviceName: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Bath: <Bath className="w-6 h-6 text-amber-600" />,
  Pipette: <Pipette className="w-6 h-6 text-amber-600" />,
  Droplets: <Droplets className="w-6 h-6 text-amber-600" />,
  Wrench: <Wrench className="w-6 h-6 text-amber-600" />
};

export const ServiceCategories: React.FC<ServiceCategoriesProps> = ({ onSelectService }) => {
  return (
    <section id="services" className="py-16 sm:py-24 bg-white border-b border-stone-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-stone-100 text-stone-800 border border-stone-200 font-bold px-3 py-1 rounded-full text-xs mb-3">
            <Tag className="w-3.5 h-3.5 text-amber-600" />
            <span>거품 없는 정찰제 서비스 항목</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
            전문 엔지니어가 직접 출장 방문하는 <span className="text-amber-600">4대 핵심 서비스</span>
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
            사소한 수전 누수부터 전체 욕실 리모델링까지, 숙련된 한국인 기사님이 정확한 원인 진단과 꼼꼼한 마감을 약속합니다.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICE_ITEMS.map((service) => (
            <div
              key={service.id}
              className="relative flex flex-col bg-stone-50 rounded-2xl border border-stone-200 p-6 hover:border-amber-400 hover:shadow-xl transition-all duration-300 group"
            >
              {service.popular && (
                <div className="absolute -top-3 right-5 bg-amber-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                  인기 출장 항목 🔥
                </div>
              )}

              {/* Icon & Category */}
              <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 group-hover:border-amber-400 transition-all">
                {iconMap[service.icon]}
              </div>

              <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                {service.category}
              </div>

              <h3 className="text-lg font-bold text-stone-900 mb-2 leading-snug">
                {service.title}
              </h3>

              <p className="text-xs text-stone-600 leading-relaxed mb-4 min-h-[36px]">
                {service.subtitle}
              </p>

              {/* Checklist items */}
              <div className="space-y-2 mb-6 flex-1 border-t border-stone-200/80 pt-4">
                {service.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Price guide tag */}
              <div className="bg-white rounded-xl p-3 border border-stone-200 text-xs mb-4">
                <div className="text-[11px] font-semibold text-stone-500">투명 정찰 가이드:</div>
                <div className="font-bold text-stone-800 text-xs mt-0.5 truncate" title={service.priceGuide}>
                  {service.priceGuide}
                </div>
              </div>

              {/* Booking CTA Button */}
              <button
                onClick={() => onSelectService(service.category)}
                className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm bg-stone-900 group-hover:bg-amber-600 text-white transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>방문 예약하기</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

            </div>
          ))}
        </div>

        {/* Assurance bar */}
        <div className="mt-12 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-stone-950 shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold">
                정확한 수리 항목을 모르셔도 걱정하지 마세요!
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 mt-1">
                증상 사진 한 장과 요청사항을 남겨주시면, 담당 기사님이 방문 전 정확한 예상 견적과 공정 절차를 미리 안내해 드립니다.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectService('종합 집수리')}
            className="w-full md:w-auto px-6 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors whitespace-nowrap shadow-md"
          >
            사진 첨부하고 방문 견적 신청
          </button>
        </div>

      </div>
    </section>
  );
};
