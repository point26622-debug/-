import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, User, Phone, CheckCircle2, AlertCircle, RefreshCw, XCircle } from 'lucide-react';
import { Reservation, ReservationStatus } from '../types';
import { subscribeToReservations, updateReservationStatus } from '../services/reservationService';
import { useAuth } from '../services/authContext';

interface MyReservationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewBooking: () => void;
}

export const MyReservationsModal: React.FC<MyReservationsModalProps> = ({
  isOpen,
  onClose,
  onOpenNewBooking
}) => {
  const { user } = useAuth();
  const [allReservations, setAllReservations] = useState<Reservation[]>([]);
  const [phoneSearch, setPhoneSearch] = useState<string>(user?.phoneNumber || '');
  const [activeTab, setActiveTab] = useState<'my' | 'search'>('my');

  useEffect(() => {
    if (isOpen) {
      const unsub = subscribeToReservations((items) => {
        setAllReservations(items);
      });
      return () => unsub();
    }
  }, [isOpen]);

  useEffect(() => {
    if (user?.phoneNumber && !phoneSearch) {
      setPhoneSearch(user.phoneNumber);
    }
  }, [user]);

  if (!isOpen) return null;

  // Filter reservations for current user
  const userReservations = allReservations.filter(r => {
    if (user?.uid && r.userId === user.uid) return true;
    if (user?.phoneNumber && r.phone.replace(/[^0-9]/g, '') === user.phoneNumber.replace(/[^0-9]/g, '')) return true;
    if (phoneSearch.trim()) {
      return r.phone.replace(/[^0-9]/g, '').includes(phoneSearch.replace(/[^0-9]/g, ''));
    }
    return false;
  });

  const handleCancelBooking = async (resId: string) => {
    if (window.confirm('정말 예약을 취소하시겠습니까? (취소 후 재예약 가능)')) {
      await updateReservationStatus(resId, 'CANCELLED');
    }
  };

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">접수 진행 중</span>;
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">방문 확정됨</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">시공 완료 (A/S보증)</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-600 border border-stone-300">예약 취소됨</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div>
            <div className="text-xs text-amber-500 font-bold uppercase tracking-wider">
              MY VISIT APPOINTMENTS
            </div>
            <h3 className="text-lg sm:text-xl font-bold mt-0.5">
              방문 예약 내역 및 진행 상태 조회
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search / Filter Bar if not signed in */}
        {!user && (
          <div className="p-4 bg-stone-100 border-b border-stone-200 flex flex-col sm:flex-row items-center gap-3">
            <div className="text-xs font-bold text-stone-700 whitespace-nowrap">
              휴대폰 번호 검색:
            </div>
            <input
              type="text"
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
              placeholder="예약 시 입력한 번호 (예: 010-1234-5678)"
              className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {phoneSearch && (
              <button
                onClick={() => setPhoneSearch('')}
                className="text-xs text-stone-500 hover:text-stone-800"
              >
                초기화
              </button>
            )}
          </div>
        )}

        {/* Reservations List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {userReservations.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-stone-800">
                조회된 예약 내역이 없습니다
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                휴대폰 번호로 예약하셨다면 상단 검색창에 번호를 입력하시거나, 새로운 방문 수리를 예약해 보세요.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenNewBooking();
                }}
                className="mt-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white transition-colors"
              >
                지금 방문 예약 신청하기
              </button>
            </div>
          ) : (
            userReservations.map((res) => (
              <div
                key={res.id}
                className="bg-stone-50 rounded-2xl p-5 border border-stone-200 hover:border-amber-300 transition-all space-y-3"
              >
                {/* Card Top */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm sm:text-base">
                      {res.serviceType}
                    </span>
                    <span className="text-xs text-stone-500 font-mono">
                      #{res.id}
                    </span>
                  </div>
                  {getStatusBadge(res.status)}
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                    <span><strong>방문 일자:</strong> {res.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span><strong>시간대:</strong> {res.timeSlot}</span>
                  </div>
                  <div className="flex items-start gap-2 sm:col-span-2">
                    <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>방문 주소:</strong> {res.address} {res.addressDetail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-600 shrink-0" />
                    <span><strong>담당 엔지니어:</strong> {res.assignedEngineer || '출장 기사 배정 중'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                    <span><strong>신청자 연락처:</strong> {res.phone} ({res.customerName})</span>
                  </div>
                </div>

                {/* Sub items if any */}
                {res.subOptions && res.subOptions.length > 0 && (
                  <div className="text-[11px] text-stone-600 bg-white p-2.5 rounded-lg border border-stone-200">
                    <strong>선택 상세 항목:</strong> {res.subOptions.join(', ')}
                  </div>
                )}

                {/* Notes if any */}
                {res.notes && (
                  <div className="text-[11px] text-stone-600 bg-white p-2.5 rounded-lg border border-stone-200">
                    <strong>요청 사항:</strong> {res.notes}
                  </div>
                )}

                {/* Photo if any */}
                {res.photoUrl && (
                  <div className="pt-1">
                    <div className="text-[11px] font-semibold text-stone-500 mb-1">첨부된 현장 사진:</div>
                    <img
                      src={res.photoUrl}
                      alt="현장 사진"
                      className="w-24 h-24 object-cover rounded-xl border border-stone-300"
                    />
                  </div>
                )}

                {/* Actions bottom */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-200/80">
                  <a
                    href="tel:010-2752-2662"
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>일정 변경 문의 (010-2752-2662)</span>
                  </a>

                  {res.status !== 'CANCELLED' && res.status !== 'COMPLETED' && (
                    <button
                      onClick={() => handleCancelBooking(res.id)}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2.5 py-1 rounded border border-rose-200 hover:bg-rose-50 transition-colors"
                    >
                      예약 취소
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenNewBooking();
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors"
          >
            새 방문 예약 신청
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-200 rounded-xl transition-colors"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
