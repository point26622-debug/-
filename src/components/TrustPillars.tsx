import React from 'react';
import { UserCheck, Calculator, ShieldCheck, Sparkles, Clock, CheckCircle, HelpCircle, Phone } from 'lucide-react';

export const TrustPillars: React.FC = () => {
  const pillars = [
    {
      icon: <UserCheck className="w-7 h-7 text-amber-600" />,
      title: '100% 숙련 한국인 기사 직접 방문',
      desc: '외주 하청이나 검증되지 않은 인력 없이, 다년간의 인테리어 및 설비 노하우를 갖춘 베테랑 한국인 정직원이 직접 댁에 방문합니다.'
    },
    {
      icon: <Calculator className="w-7 h-7 text-amber-600" />,
      title: '거품 없는 정찰제 & 사전 견적',
      desc: '현장 방문 후 임의로 비용을 부풀리지 않습니다. 표준 정찰 기준표에 의거하여 작업 전 상세 내역과 최종 비용을 명확히 안내합니다.'
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-amber-600" />,
      title: '철저한 사후 관리 1년 무상 A/S',
      desc: '시공 후 동일 부위에서 재발하거나 하자가 발생할 경우 1년간 무상으로 끝까지 책임지고 보수해 드립니다.'
    },
    {
      icon: <Sparkles className="w-7 h-7 text-amber-600" />,
      title: '정밀 점검 및 깔끔한 뒷정리',
      desc: '작업 중 발생한 폐자재, 먼지, 보양재를 엔지니어가 직접 전량 수거 및 청소하여 시공 직후 바로 생활하실 수 있게 마감합니다.'
    }
  ];

  const steps = [
    {
      step: '01',
      title: '온라인 방문 예약 접수',
      desc: '원하시는 서비스, 방문 희망 날짜 및 시간대, 현장 사진을 첨부하여 간편 신청'
    },
    {
      step: '02',
      title: '담당 기사 배정 & 사전 유선 안내',
      desc: '배정된 전문 기사님이 출발 전 사전 증상 확인 및 준비 공구 점검 통화'
    },
    {
      step: '03',
      title: '정밀 점검 & 정찰 견적 시공',
      desc: '약속된 시간에 정확히 방문하여 현장 정밀 진단 후 꼼꼼하고 확실한 작업 진행'
    },
    {
      step: '04',
      title: '마감 청소 및 A/S 보증서 발급',
      desc: '현장 깔끔 정리정돈 및 작업 결과 고객 검수 완료, 모바일 보증 내역 등록'
    }
  ];

  const faqs = [
    {
      q: '출장 방문 가능 지역은 어디인가요?',
      a: '서울 전 지역, 경기 주요 시/군(성남, 수원, 고양, 용인, 부천, 안양, 남양주 등), 인천 전 지역 모두 출장 방문이 가능합니다. 이외 인접 지역은 대표전화(010-2752-2662)로 문의 주시면 일정 협의가 가능합니다.'
    },
    {
      q: '주말이나 야간에도 방문 수리가 가능한가요?',
      a: '네, 가능합니다! 직장인 고객님들을 위해 평일 저녁(18:00~20:00) 및 토요일/일요일 주말 출장 예약도 운영하고 있습니다. 예약 신청 시 원하시는 시간대를 선택해 주시면 됩니다.'
    },
    {
      q: '방문 견적 후 수리를 진행하지 않아도 되나요?',
      a: '네, 점검 후 수리 방법과 투명한 정찰제 견적을 먼저 안내해 드리며, 고객님이 동의하실 때만 작업을 시작합니다. (단, 단순 단순 점검 후 미진행 시 기본 기본 출장 점검비 소액 발생할 수 있습니다.)'
    },
    {
      q: '카카오톡이나 문자로도 예약 알림이 오나요?',
      a: '네! 예약 접수 즉시 예약 번호와 배정 기사님 정보가 담긴 알림 문자가 발송되며, 관리자 페이지를 통해 스케줄 확정 상태를 실시간 확인하실 수 있습니다.'
    }
  ];

  return (
    <section id="trust" className="py-16 sm:py-24 bg-stone-50 border-b border-stone-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section 1: 4 Pillars */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full">
            BARUN HOME GUARANTEE
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight mt-3">
            고객님이 안심하고 문을 열어주시는 이유, <br className="hidden sm:inline" />
            <span className="text-amber-600">‘바른집인테리어’의 4대 안심 약속</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-13 h-13 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
                {p.icon}
              </div>
              <h3 className="font-bold text-base text-stone-900 mb-2">
                {p.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Section 2: Process Steps */}
        <div className="bg-stone-900 rounded-3xl p-8 sm:p-12 text-white mb-20 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">
              EASY 4-STEP PROCESS
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
              바른집인테리어 출장 방문 진행 절차
            </h3>
            <p className="text-stone-400 text-xs sm:text-sm mt-2">
              복잡한 절차 없이 원하는 시간만 정해주시면 숙련 엔지니어가 직접 찾아갑니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {steps.map((s, idx) => (
              <div key={idx} className="relative bg-stone-800/80 p-6 rounded-2xl border border-stone-700 flex flex-col">
                <div className="text-3xl font-black text-amber-500 font-mono mb-3">
                  {s.step}
                </div>
                <h4 className="font-bold text-base text-white mb-2">
                  {s.title}
                </h4>
                <p className="text-xs text-stone-400 leading-relaxed flex-1">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: FAQ */}
        <div id="faq" className="max-w-3xl mx-auto scroll-mt-24">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 text-stone-600 text-xs font-bold mb-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>자주 묻는 질문 (FAQ)</span>
            </div>
            <h3 className="text-2xl font-bold text-stone-900">
              궁금하신 점을 미리 확인해 보세요
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    Q
                  </span>
                  <div className="space-y-2 flex-1">
                    <h4 className="font-bold text-sm sm:text-base text-stone-900">
                      {faq.q}
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Call Box */}
          <div className="mt-8 text-center p-6 bg-amber-50 rounded-2xl border border-amber-200">
            <p className="text-xs font-semibold text-amber-900 mb-2">
              더 자세한 문의나 당일 긴급 수리 상담이 필요하신가요?
            </p>
            <a
              href="tel:010-2752-2662"
              className="inline-flex items-center gap-2 text-base sm:text-lg font-black text-amber-700 hover:text-amber-800"
            >
              <Phone className="w-5 h-5 animate-bounce" />
              <span>대표전화: 010-2752-2662 (터치 시 통화 연결)</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
