import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Camera, 
  Upload, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Phone, 
  Sparkles, 
  AlertCircle,
  MessageSquare,
  Copy,
  Check
} from 'lucide-react';
import { ServiceCategory, Reservation } from '../types';
import { createReservation } from '../services/reservationService';
import { useAuth } from '../services/authContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
  onViewMyReservations: () => void;
}

const SERVICE_OPTIONS: { id: ServiceCategory; title: string; desc: string; icon: string; sub: string[] }[] = [
  {
    id: 'bathroom',
    title: '욕실 리모델링',
    desc: '타일 보수, 친환경 방수 줄눈, 고급 해바라기 수전, 세면대/양변기 교체',
    icon: '🚿',
    sub: ['노후 타일 보수/덧방', '에폭시 방수 줄눈', '해바라기 샤워 수전 교체', '도기류(양변기/세면대) 교체', '호텔식 전체 리모델링']
  },
  {
    id: 'kitchen',
    title: '주방/배관',
    desc: '싱크대 하부장 누수 수리, 악취 차단 역류 트랩, 올스텐 배수구 교체',
    icon: '🍳',
    sub: ['싱크대 하부 배관 누수', '하수구 냄새 차단 트랩', '올스텐 배수구 세트 교체', '주방 수전(원홀/벽붙이) 교체', '배관 통수/수압 점검']
  },
  {
    id: 'waterproof',
    title: '방수/설비',
    desc: '베란다 결로 방지 탄성코트, 창호 실리콘 코킹, 곰팡이 방수 처리',
    icon: '💧',
    sub: ['창호 실리콘 코킹 방수', '베란다 세라믹 탄성코트', '욕실 바닥 침투 방수', '보일러 분배기 점검', '곰팡이 박멸 항균 처리']
  },
  {
    id: 'general',
    title: '종합 집수리',
    desc: '디지털 도어락, 미세 롤방충망, 문짝 경첩 교정, LED 조명 및 콘센트',
    icon: '🔧',
    sub: ['초미세 방충망 교체', '지문인식 푸시풀 도어락', '문짝 처짐/경첩 수리', 'LED 조명 및 스위치 교체', '실리콘 코킹 마감']
  }
];

const TIME_SLOTS = [
  { id: 'morning-1', label: '오전 09:00 - 11:00', note: '첫 타임 추천' },
  { id: 'morning-2', label: '오전 11:00 - 13:00', note: '점심 전 방문' },
  { id: 'afternoon-1', label: '오후 13:00 - 15:00', note: '가장 인기 시간' },
  { id: 'afternoon-2', label: '오후 15:00 - 17:00', note: '오후 집중 시간' },
  { id: 'afternoon-3', label: '오후 17:00 - 19:00', note: '퇴근 시간 전후' },
  { id: 'evening', label: '저녁 19:00 이후 (협의)', note: '야간 긴급 조율' }
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialCategory,
  onViewMyReservations
}) => {
  const { user } = useAuth();

  // Current Step: 1, 2, 3, 4
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Form State
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>('bathroom');
  const [selectedSubOptions, setSelectedSubOptions] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('오후 13:00 - 15:00');
  
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [notes, setNotes] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Created Reservation (for Step 4 confirmation)
  const [createdReservation, setCreatedReservation] = useState<Reservation | null>(null);

  // Initialize defaults
  useEffect(() => {
    if (initialCategory) {
      const match = SERVICE_OPTIONS.find(s => 
        s.title.includes(initialCategory) || s.id === initialCategory || initialCategory.includes(s.id)
      );
      if (match) {
        setServiceCategory(match.id);
      }
    }
  }, [initialCategory]);

  useEffect(() => {
    if (user) {
      if (user.displayName && !customerName) setCustomerName(user.displayName);
      if (user.phoneNumber && !phone) setPhone(user.phoneNumber);
    }
  }, [user]);

  // Set default date to tomorrow if empty
  useEffect(() => {
    if (!selectedDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [selectedDate]);

  if (!isOpen) return null;

  // Handle phone format
  const handlePhoneChange = (val: string) => {
    const numbers = val.replace(/[^0-9]/g, '').slice(0, 11);
    if (numbers.length <= 3) {
      setPhone(numbers);
    } else if (numbers.length <= 7) {
      setPhone(`${numbers.slice(0, 3)}-${numbers.slice(3)}`);
    } else {
      setPhone(`${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`);
    }
  };

  const handleSubOptionToggle = (option: string) => {
    setSelectedSubOptions(prev => 
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      alert('성함, 연락처, 주소는 필수 입력 항목입니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedCategoryObj = SERVICE_OPTIONS.find(s => s.id === serviceCategory);
      const res = await createReservation({
        serviceCategory,
        serviceType: selectedCategoryObj?.title || '종합 집수리',
        subOptions: selectedSubOptions,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        addressDetail: addressDetail.trim(),
        notes: notes.trim(),
        photoUrl: photoPreview || undefined,
        assignedEngineer: '김바른 수석팀장',
        userId: user?.uid || undefined,
        userEmail: user?.email || undefined
      });

      setCreatedReservation(res);
      setStep(4); // Move to Confirmation Step
    } catch (err) {
      console.error('Reservation error:', err);
      alert('예약 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주시거나 010-2752-2662로 전화 주십시오.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPhoneToClipboard = () => {
    navigator.clipboard.writeText('010-2752-2662');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  // Generate date choices for next 14 days
  const dateChoices = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = dayNames[d.getDay()];
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    return { dateStr, month: `${d.getMonth() + 1}월`, day: `${d.getDate()}일`, dayName, isWeekend };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Modal Header */}
        <div className="bg-stone-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-500 font-extrabold text-xs tracking-wider uppercase">
                BARUN VISIT BOOKING
              </span>
              <span className="bg-stone-800 text-stone-300 text-[11px] px-2 py-0.5 rounded font-mono">
                {step}/4 단계
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold mt-1 tracking-tight">
              {step === 1 && '1단계: 원하시는 수리 서비스를 선택하세요'}
              {step === 2 && '2단계: 방문 희망 날짜 & 시간대를 선택하세요'}
              {step === 3 && '3단계: 방문지 주소 및 현장 사진을 입력하세요'}
              {step === 4 && '예약이 성공적으로 완료되었습니다!'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-stone-100 px-6 py-3 border-b border-stone-200 flex items-center justify-between text-xs font-semibold">
          {[
            { s: 1, label: '서비스 선택' },
            { s: 2, label: '일정 선택' },
            { s: 3, label: '정보 입력' },
            { s: 4, label: '예약 완료' }
          ].map((item, idx) => (
            <div key={item.s} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === item.s
                    ? 'bg-amber-600 text-white shadow'
                    : step > item.s
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-300 text-stone-600'
                }`}
              >
                {step > item.s ? '✓' : item.s}
              </div>
              <span className={`hidden sm:inline ${step === item.s ? 'text-stone-900 font-bold' : 'text-stone-500'}`}>
                {item.label}
              </span>
              {idx < 3 && <span className="text-stone-300 sm:mx-1">›</span>}
            </div>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1">
          
          {/* STEP 1: SERVICE SELECTION */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {SERVICE_OPTIONS.map(opt => {
                  const isSelected = serviceCategory === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => {
                        setServiceCategory(opt.id);
                        setSelectedSubOptions([]);
                      }}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all text-left relative ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50/60 shadow-md ring-2 ring-amber-600/20'
                          : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-2xl mb-2">{opt.icon}</span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">
                            ✓
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-stone-900 text-base">{opt.title}</h4>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">{opt.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Sub-options for the active category */}
              <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-bold text-stone-800 uppercase">
                    상세 수리 희망 항목 (복수 선택 가능)
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SERVICE_OPTIONS.find(s => s.id === serviceCategory)?.sub.map(subItem => {
                    const isChecked = selectedSubOptions.includes(subItem);
                    return (
                      <button
                        type="button"
                        key={subItem}
                        onClick={() => handleSubOptionToggle(subItem)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          isChecked
                            ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                            : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        {isChecked ? '✓ ' : '+ '} {subItem}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notice */}
              <div className="flex items-center gap-2 p-3 bg-stone-100 rounded-xl text-xs text-stone-600">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>원하시는 항목이 없으시면 3단계 상세 요청사항에 자유롭게 적어주세요.</span>
              </div>
            </div>
          )}

          {/* STEP 2: DATE & TIME SELECTION */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Date selection grid */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-2 flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-amber-600" />
                  <span>방문 희망 날짜 선택 (내일부터 예약 가능)</span>
                </label>
                
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {dateChoices.map((choice) => {
                    const isSelected = selectedDate === choice.dateStr;
                    return (
                      <button
                        type="button"
                        key={choice.dateStr}
                        onClick={() => setSelectedDate(choice.dateStr)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-amber-600 text-white border-amber-600 shadow-md font-bold'
                            : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                        }`}
                      >
                        <div className={`text-[10px] uppercase ${isSelected ? 'text-amber-100' : choice.isWeekend ? 'text-rose-500 font-bold' : 'text-stone-500'}`}>
                          {choice.dayName}요일
                        </div>
                        <div className="text-sm font-extrabold mt-0.5">
                          {choice.day}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Direct date picker fallback */}
                <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
                  <span>선택 날짜: <strong className="text-amber-700 font-bold">{selectedDate}</strong></span>
                  <div className="flex items-center gap-1">
                    <span>직접 지정:</span>
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="text-xs p-1 border border-stone-300 rounded bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Time slot selection */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>방문 희망 시간대 (엔지니어가 맞춤 출장)</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = selectedTimeSlot === slot.label;
                    return (
                      <button
                        type="button"
                        key={slot.id}
                        onClick={() => setSelectedTimeSlot(slot.label)}
                        className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-50 border-amber-600 text-stone-900 ring-2 ring-amber-600/20 shadow-sm'
                            : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-sm">{slot.label}</div>
                          <div className="text-[11px] text-stone-500">{slot.note}</div>
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Punctuality Guarantee Note */}
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <span className="font-bold">⏱ 시간 약속 100% 보장:</span> 배정된 한국인 기사님이 출발 30분 전 유선으로 사전 안내를 드립니다.
              </div>
            </div>
          )}

          {/* STEP 3: INFORMATION ENTRY */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    예약자 성함 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="홍길동"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    휴대폰 번호 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="010-1234-5678"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-700">
                    방문 주소 <span className="text-rose-500">*</span>
                  </label>
                  <div className="text-[11px] text-stone-500">서울, 경기, 인천 전 지역 출장</div>
                </div>

                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="도로명 주소 또는 동/구 입력 (예: 서울시 마포구 공덕동 123)"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                {/* Quick Fill Address Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[11px] text-stone-500 self-center">추천 예시:</span>
                  {[
                    '서울 마포구 공덕동',
                    '경기 성남시 분당구',
                    '인천 연수구 송도동',
                    '서울 영등포구 당산동'
                  ].map(ex => (
                    <button
                      type="button"
                      key={ex}
                      onClick={() => setAddress(ex)}
                      className="text-[11px] px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200"
                    >
                      {ex}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  placeholder="상세 주소 (아파트 동/호수, 층수 등)"
                  className="w-full mt-2 px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                  <span>현장 증상 사진 첨부 (선택 사항)</span>
                  <span className="text-[11px] text-amber-700 font-normal">정확한 사전 자재 준비 및 견적에 큰 도움이 됩니다</span>
                </label>

                {photoPreview ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500 max-h-48 bg-stone-100">
                    <img src={photoPreview} alt="현장 사진 미리보기" className="w-full h-44 object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="absolute top-2 right-2 bg-stone-900/80 hover:bg-stone-900 text-white px-2.5 py-1 rounded-lg text-xs font-bold"
                    >
                      사진 변경/삭제
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-2xl p-4 text-center bg-stone-50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      id="photo-upload-input"
                      className="hidden"
                    />
                    <label htmlFor="photo-upload-input" className="cursor-pointer flex flex-col items-center gap-1.5">
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-amber-600">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-stone-700">고장 부위 사진 등록 (클릭 또는 파일 첨부)</span>
                      <span className="text-[11px] text-stone-400">JPG, PNG 스마트폰 촬영 사진 가능</span>
                    </label>

                    {/* Quick Demo Sample Photos */}
                    <div className="mt-3 pt-3 border-t border-stone-200 flex items-center justify-center gap-2">
                      <span className="text-[11px] text-stone-500">샘플 사진 테스트:</span>
                      <button
                        type="button"
                        onClick={() => setPhotoPreview('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80')}
                        className="text-[11px] px-2 py-0.5 rounded bg-white border border-stone-300 text-stone-600 hover:bg-stone-100"
                      >
                        욕실 타일 샘플
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhotoPreview('https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80')}
                        className="text-[11px] px-2 py-0.5 rounded bg-white border border-stone-300 text-stone-600 hover:bg-stone-100"
                      >
                        주방 싱크 배관 샘플
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  고장 상태 및 상세 요청 사항
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="예: 싱크대 밑에서 물이 조금씩 스며나와요, 욕실 타일이 깨져서 위험해요 등"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                />
              </div>

              {/* Summary Pill */}
              <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200 text-xs text-stone-800 space-y-1">
                <div>
                  <span className="text-amber-800 font-bold">선택 서비스: </span>
                  {SERVICE_OPTIONS.find(s => s.id === serviceCategory)?.title}
                  {selectedSubOptions.length > 0 && ` (${selectedSubOptions.join(', ')})`}
                </div>
                <div>
                  <span className="text-amber-800 font-bold">방문 일정: </span>
                  {selectedDate} / {selectedTimeSlot}
                </div>
              </div>
            </form>
          )}

          {/* STEP 4: CONFIRMATION NOTIFICATION & SUMMARY */}
          {step === 4 && createdReservation && (
            <div className="space-y-6">
              
              {/* Top Success Badge */}
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-stone-900">
                  방문 예약 접수가 정상 완료되었습니다!
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  입력하신 연락처로 <strong className="text-amber-700">카카오 알림톡 및 문자 안내</strong>가 발송되었습니다.
                </p>
              </div>

              {/* Simulated Kakao/SMS Notification Card (as explicitly requested) */}
              <div className="bg-stone-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-stone-800 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#FEE500] text-stone-950 font-black text-xs flex items-center justify-center">
                      TALK
                    </div>
                    <span className="text-xs font-bold text-stone-200">
                      [바른집인테리어 집수리] 알림톡 발송 완료
                    </span>
                  </div>
                  <span className="text-[11px] text-amber-400 font-mono font-bold">
                    예약번호 #{createdReservation.id}
                  </span>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                  <p className="text-white font-bold">
                    안녕하세요, {createdReservation.customerName} 고객님!
                  </p>
                  <p>
                    바른집인테리어 집수리에 신청해주신 가정방문 출장 예약이 신속히 접수되었습니다.
                  </p>
                  
                  <div className="my-3 p-3 bg-stone-800/80 rounded-xl border border-stone-700 space-y-1 text-xs">
                    <div>• <strong>신청 서비스:</strong> {createdReservation.serviceType}</div>
                    <div>• <strong>방문 희망일:</strong> {createdReservation.date} ({createdReservation.timeSlot})</div>
                    <div>• <strong>방문지:</strong> {createdReservation.address} {createdReservation.addressDetail}</div>
                    <div>• <strong>배정 기사:</strong> {createdReservation.assignedEngineer || '한국인 베테랑 기사 배정 중'}</div>
                    <div className="text-amber-400 font-semibold">• <strong>대표전화:</strong> 010-2752-2662</div>
                  </div>

                  <p className="text-[12px] text-stone-400">
                    ※ 배정된 기사님이 출발 30분 전 사전 전화로 도착 예정 시간을 다시 한번 안내해 드립니다.
                  </p>
                </div>
              </div>

              {/* Phone Consultation Banner */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">당일 긴급 방문 또는 일정 변경 문의</div>
                    <div className="text-sm font-black text-amber-800">대표전화: 010-2752-2662</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="tel:010-2752-2662"
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                  >
                    통화 연결
                  </a>
                  <button
                    onClick={copyPhoneToClipboard}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors flex items-center gap-1"
                  >
                    {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPhone ? '복사됨' : '번호복사'}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Action Footer */}
        <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex items-center justify-between">
          {step > 1 && step < 4 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 transition-colors flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>이전 단계</span>
            </button>
          )}

          {step === 1 && (
            <div className="text-xs text-stone-500 font-medium">
              1단계 완료 후 일정 선택으로 이동합니다
            </div>
          )}

          {step < 3 && (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="ml-auto px-6 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm text-white bg-amber-600 hover:bg-amber-700 transition-colors flex items-center gap-1.5 shadow-md shadow-amber-600/20"
            >
              <span>다음 단계</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="ml-auto px-7 py-3 rounded-xl font-extrabold text-xs sm:text-sm text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:bg-stone-400 transition-all flex items-center gap-2 shadow-lg shadow-amber-600/30"
            >
              {isSubmitting ? (
                <span>예약 처리 중...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>예약하기 (알림톡 즉시 발송)</span>
                </>
              )}
            </button>
          )}

          {step === 4 && (
            <div className="w-full flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onViewMyReservations();
                }}
                className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-stone-800 bg-white border border-stone-300 hover:bg-stone-100 transition-colors"
              >
                내 예약 내역 확인하기
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm text-white bg-stone-900 hover:bg-stone-800 transition-colors"
              >
                닫기
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
