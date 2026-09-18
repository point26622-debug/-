import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  Send, 
  Eye, 
  ArrowLeft, 
  Plus, 
  ShieldCheck, 
  UserCheck, 
  Check, 
  X,
  FileText,
  Trash2,
  BellRing
} from 'lucide-react';
import { Reservation, ReservationStatus, ServiceCategory } from '../types';
import { subscribeToReservations, updateReservationStatus, createReservation } from '../services/reservationService';
import { useAuth } from '../services/authContext';

interface AdminDashboardProps {
  onBackToHome: () => void;
}

const ENGINEERS = [
  '김바른 수석팀장',
  '박정밀 수석엔지니어',
  '이성실 책임기사',
  '정완벽 설비팀장',
  '최안심 시공기사'
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToHome }) => {
  const { signOut } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterDate, setFilterDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Selected reservation for detailed modal
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);

  // SMS Re-send simulation modal
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [smsSentNotice, setSmsSentNotice] = useState(false);

  // Manual Add Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newService, setNewService] = useState('욕실 리모델링');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('오후 13:00 - 15:00');
  const [newAddr, setNewAddr] = useState('');
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    const unsub = subscribeToReservations((items) => {
      setReservations(items);
      // If modal is open, keep selected item updated
      if (selectedRes) {
        const found = items.find(i => i.id === selectedRes.id);
        if (found) setSelectedRes(found);
      }
    });
    return () => unsub();
  }, [selectedRes?.id]);

  // Filtered reservations
  const filtered = reservations.filter((r) => {
    if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
    if (filterDate && r.date !== filterDate) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.customerName.toLowerCase().includes(q);
      const matchPhone = r.phone.replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, ''));
      const matchAddr = r.address.toLowerCase().includes(q);
      const matchId = r.id.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchAddr && !matchId) return false;
    }
    return true;
  });

  // Summary counts
  const countPending = reservations.filter(r => r.status === 'PENDING').length;
  const countConfirmed = reservations.filter(r => r.status === 'CONFIRMED').length;
  const countCompleted = reservations.filter(r => r.status === 'COMPLETED').length;
  const countCancelled = reservations.filter(r => r.status === 'CANCELLED').length;

  const handleUpdateStatus = async (resId: string, status: ReservationStatus) => {
    await updateReservationStatus(resId, status);
    if (selectedRes && selectedRes.id === resId) {
      setSelectedRes({ ...selectedRes, status });
    }
  };

  const handleAssignEngineer = async (resId: string, engineer: string) => {
    await updateReservationStatus(resId, selectedRes?.status || 'CONFIRMED', engineer);
    if (selectedRes && selectedRes.id === resId) {
      setSelectedRes({ ...selectedRes, assignedEngineer: engineer, status: 'CONFIRMED' });
    }
  };

  const handleSendSms = () => {
    setSmsSentNotice(true);
    setTimeout(() => {
      setSmsSentNotice(false);
      setSmsModalOpen(false);
    }, 1800);
  };

  const handleCreateManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone || !newAddr) return;

    await createReservation({
      serviceCategory: 'bathroom',
      serviceType: newService,
      date: newDate,
      timeSlot: newTime,
      customerName: newCustName,
      phone: newCustPhone,
      address: newAddr,
      notes: newNotes,
      assignedEngineer: '김바른 수석팀장'
    });

    setIsAddModalOpen(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewAddr('');
    setNewNotes('');
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-20 font-sans">
      
      {/* Admin Top Navbar */}
      <header className="bg-stone-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToHome}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>홈페이지로</span>
            </button>
            
            <div className="h-6 w-px bg-stone-700" />

            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-white tracking-tight">
                  바른집인테리어 <span className="text-amber-500">통합 관리자</span>
                </span>
                <span className="bg-amber-600/30 text-amber-400 border border-amber-500/50 text-[11px] font-bold px-2 py-0.5 rounded">
                  Admin Dashboard
                </span>
              </div>
              <div className="text-[11px] text-stone-400">
                실시간 출장 방문 예약 및 엔지니어 스케줄 관리
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>전화문의 수동 예약</span>
            </button>

            <button
              onClick={() => signOut()}
              className="px-3 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div 
            onClick={() => setFilterStatus('ALL')}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              filterStatus === 'ALL' ? 'bg-stone-900 text-white border-stone-900 shadow-md' : 'bg-white border-stone-200 hover:border-stone-400'
            }`}
          >
            <div className="text-xs font-bold text-stone-400">전체 예약 건수</div>
            <div className="text-2xl sm:text-3xl font-black mt-1">{reservations.length} <span className="text-sm font-normal">건</span></div>
          </div>

          <div 
            onClick={() => setFilterStatus('PENDING')}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              filterStatus === 'PENDING' ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-md ring-2 ring-amber-500/30' : 'bg-white border-stone-200 hover:border-amber-400'
            }`}
          >
            <div className="text-xs font-bold text-amber-900">신규 접수 (대기)</div>
            <div className="text-2xl sm:text-3xl font-black mt-1 text-amber-950">{countPending} <span className="text-sm font-normal">건</span></div>
          </div>

          <div 
            onClick={() => setFilterStatus('CONFIRMED')}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              filterStatus === 'CONFIRMED' ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-600/30' : 'bg-white border-stone-200 hover:border-blue-400'
            }`}
          >
            <div className="text-xs font-bold text-blue-800">예약 확정 / 배정</div>
            <div className="text-2xl sm:text-3xl font-black mt-1 text-blue-900">{countConfirmed} <span className="text-sm font-normal">건</span></div>
          </div>

          <div 
            onClick={() => setFilterStatus('COMPLETED')}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              filterStatus === 'COMPLETED' ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-600/30' : 'bg-white border-stone-200 hover:border-emerald-400'
            }`}
          >
            <div className="text-xs font-bold text-emerald-800">출장 및 시공 완료</div>
            <div className="text-2xl sm:text-3xl font-black mt-1 text-emerald-900">{countCompleted} <span className="text-sm font-normal">건</span></div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { key: 'ALL', label: '전체보기' },
              { key: 'PENDING', label: '신규 접수' },
              { key: 'CONFIRMED', label: '예약 확정' },
              { key: 'COMPLETED', label: '출장 완료' },
              { key: 'CANCELLED', label: '취소' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterStatus(tab.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  filterStatus === tab.key
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Date & Keyword Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="text-xs bg-transparent focus:outline-none text-stone-700"
              />
              {filterDate && (
                <button onClick={() => setFilterDate('')} className="text-xs text-stone-400 hover:text-stone-700 ml-1">
                  ✕
                </button>
              )}
            </div>

            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="고객명, 연락처, 주소 검색"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Reservations Table / Cards */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
            <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
              <span>예약 접수 목록</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600">
                총 {filtered.length}건
              </span>
            </h3>
            <div className="text-xs text-stone-500">
              실시간 Firestore 동기화 중
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center text-stone-500 text-xs">
              조건에 일치하는 예약 내역이 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
                    <th className="p-4">예약번호 / 일시</th>
                    <th className="p-4">신청 서비스</th>
                    <th className="p-4">고객 정보</th>
                    <th className="p-4">방문지 주소</th>
                    <th className="p-4">담당 엔지니어</th>
                    <th className="p-4">상태</th>
                    <th className="p-4 text-center">관리 액션</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filtered.map((res) => (
                    <tr 
                      key={res.id} 
                      className={`hover:bg-amber-50/50 transition-colors ${
                        selectedRes?.id === res.id ? 'bg-amber-50' : ''
                      }`}
                    >
                      {/* Date / Time */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-bold text-stone-900 font-mono text-xs">
                          #{res.id}
                        </div>
                        <div className="text-stone-700 font-semibold mt-0.5">
                          {res.date}
                        </div>
                        <div className="text-stone-500 text-[11px]">
                          {res.timeSlot}
                        </div>
                      </td>

                      {/* Service */}
                      <td className="p-4">
                        <span className="font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded-lg">
                          {res.serviceType}
                        </span>
                        {res.subOptions && res.subOptions.length > 0 && (
                          <div className="text-[11px] text-stone-500 mt-1 max-w-[200px] truncate" title={res.subOptions.join(', ')}>
                            {res.subOptions.join(', ')}
                          </div>
                        )}
                      </td>

                      {/* Customer */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-bold text-stone-900">{res.customerName}</div>
                        <a href={`tel:${res.phone}`} className="text-amber-700 font-medium hover:underline">
                          {res.phone}
                        </a>
                      </td>

                      {/* Address */}
                      <td className="p-4 max-w-[220px]">
                        <div className="font-medium text-stone-800 truncate" title={`${res.address} ${res.addressDetail || ''}`}>
                          {res.address}
                        </div>
                        {res.addressDetail && (
                          <div className="text-[11px] text-stone-500 truncate">
                            {res.addressDetail}
                          </div>
                        )}
                      </td>

                      {/* Assigned Engineer */}
                      <td className="p-4 whitespace-nowrap">
                        <select
                          value={res.assignedEngineer || ''}
                          onChange={(e) => handleAssignEngineer(res.id, e.target.value)}
                          className="text-xs p-1.5 rounded-lg border border-stone-300 bg-white font-medium focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="">(미배정)</option>
                          {ENGINEERS.map(eng => (
                            <option key={eng} value={eng}>{eng}</option>
                          ))}
                        </select>
                      </td>

                      {/* Status */}
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-block ${
                          res.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                          res.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                          res.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-stone-200 text-stone-600'
                        }`}>
                          {res.status === 'PENDING' && '신규 접수'}
                          {res.status === 'CONFIRMED' && '예약 확정'}
                          {res.status === 'COMPLETED' && '출장 완료'}
                          {res.status === 'CANCELLED' && '취소됨'}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="p-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedRes(res)}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                            title="상세 정보 확인"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {res.status === 'PENDING' && (
                            <button
                              onClick={() => handleUpdateStatus(res.id, 'CONFIRMED')}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px]"
                              title="예약 승인"
                            >
                              승인
                            </button>
                          )}

                          {res.status === 'CONFIRMED' && (
                            <button
                              onClick={() => handleUpdateStatus(res.id, 'COMPLETED')}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                              title="출장 완료 처리"
                            >
                              완료
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedRes(res);
                              setSmsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800"
                            title="안내 문자/알림톡 발송"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* DETAILED RESERVATION MODAL */}
      {selectedRes && !smsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-5 bg-stone-900 text-white flex items-center justify-between">
              <div>
                <span className="text-amber-500 font-bold text-xs uppercase">
                  RESERVATION DETAIL
                </span>
                <h3 className="text-lg font-bold">
                  예약 #{selectedRes.id} 상세 정보
                </h3>
              </div>
              <button
                onClick={() => setSelectedRes(null)}
                className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
              
              {/* Quick Status Bar */}
              <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <span className="text-stone-500 text-xs">현재 진행 상태:</span>
                  <div className="font-bold text-stone-900 text-base mt-0.5">
                    {selectedRes.status === 'PENDING' && '신규 접수 (승인 대기)'}
                    {selectedRes.status === 'CONFIRMED' && '방문 예약 확정'}
                    {selectedRes.status === 'COMPLETED' && '출장 및 시공 완료'}
                    {selectedRes.status === 'CANCELLED' && '예약 취소됨'}
                  </div>
                </div>

                {/* Status change actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleUpdateStatus(selectedRes.id, 'PENDING')}
                    className="px-2 py-1 rounded bg-stone-200 text-stone-700 text-xs font-bold"
                  >
                    대기
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedRes.id, 'CONFIRMED')}
                    className="px-2 py-1 rounded bg-blue-600 text-white text-xs font-bold"
                  >
                    확정
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedRes.id, 'COMPLETED')}
                    className="px-2 py-1 rounded bg-emerald-600 text-white text-xs font-bold"
                  >
                    완료
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedRes.id, 'CANCELLED')}
                    className="px-2 py-1 rounded bg-rose-600 text-white text-xs font-bold"
                  >
                    취소
                  </button>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="text-stone-500 text-[11px]">고객 성함</div>
                  <div className="font-bold text-stone-900 text-sm mt-0.5">{selectedRes.customerName}</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="text-stone-500 text-[11px]">연락처</div>
                  <div className="font-bold text-amber-700 text-sm mt-0.5">
                    <a href={`tel:${selectedRes.phone}`}>{selectedRes.phone}</a>
                  </div>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="text-stone-500 text-[11px]">방문 희망 일자</div>
                  <div className="font-bold text-stone-900 text-sm mt-0.5">{selectedRes.date}</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="text-stone-500 text-[11px]">선택 시간대</div>
                  <div className="font-bold text-stone-900 text-sm mt-0.5">{selectedRes.timeSlot}</div>
                </div>
              </div>

              {/* Address */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <div className="text-stone-500 text-[11px]">방문지 주소</div>
                <div className="font-bold text-stone-900 mt-0.5">
                  {selectedRes.address} {selectedRes.addressDetail}
                </div>
              </div>

              {/* Engineer Assign */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <div className="text-stone-500 text-[11px] mb-1">담당 출장 엔지니어 배정</div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedRes.assignedEngineer || ''}
                    onChange={(e) => handleAssignEngineer(selectedRes.id, e.target.value)}
                    className="flex-1 p-2 rounded-xl border border-stone-300 bg-white font-bold text-xs sm:text-sm"
                  >
                    <option value="">(엔지니어 선택)</option>
                    {ENGINEERS.map(eng => (
                      <option key={eng} value={eng}>{eng}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              {selectedRes.notes && (
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="text-stone-500 text-[11px]">고객 상세 요청 사항</div>
                  <div className="mt-1 text-stone-800 leading-relaxed whitespace-pre-wrap">
                    {selectedRes.notes}
                  </div>
                </div>
              )}

              {/* Attached Photo */}
              {selectedRes.photoUrl && (
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="text-stone-500 text-[11px] mb-2">고객 첨부 현장 사진</div>
                  <img
                    src={selectedRes.photoUrl}
                    alt="현장 사진 원본"
                    className="w-full max-h-60 object-cover rounded-xl border border-stone-300 shadow-sm"
                  />
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={() => setSmsModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>안내 문자/알림톡 발송</span>
              </button>

              <button
                onClick={() => setSelectedRes(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-200"
              >
                닫기
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SMS RESEND MODAL */}
      {smsModalOpen && selectedRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-5 bg-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-amber-500" />
                <h3 className="text-base font-bold">고객 안내 알림톡/문자 발송</h3>
              </div>
              <button
                onClick={() => setSmsModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="text-xs text-stone-600">
                수신자: <strong className="text-stone-900">{selectedRes.customerName}</strong> ({selectedRes.phone})
              </div>

              {/* Message preview box */}
              <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200 text-xs font-mono leading-relaxed space-y-2 text-stone-800">
                <div className="font-bold text-stone-950">[바른집인테리어 집수리 예약 안내]</div>
                <div>안녕하세요, {selectedRes.customerName} 고객님.</div>
                <div>요청하신 {selectedRes.serviceType} 출장 방문 일정이 아래와 같이 확정되었습니다.</div>
                <div className="p-2 bg-white rounded border border-stone-200 text-[11px] space-y-0.5">
                  <div>- 일시: {selectedRes.date} {selectedRes.timeSlot}</div>
                  <div>- 방문지: {selectedRes.address}</div>
                  <div>- 담당기사: {selectedRes.assignedEngineer || '김바른 수석팀장'}</div>
                  <div>- 대표전화: 010-2752-2662</div>
                </div>
                <div>출발 30분 전 담당 기사가 사전 유선 안내를 드립니다. 감사합니다.</div>
              </div>

              {smsSentNotice ? (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-bold flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>알림톡 및 문자가 성공적으로 재발송되었습니다!</span>
                </div>
              ) : (
                <button
                  onClick={handleSendSms}
                  className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm bg-amber-600 hover:bg-amber-700 text-white transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>위 내용으로 즉시 발송하기</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MANUAL ADD BOOKING MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-5 bg-stone-900 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">전화 문의 수동 예약 접수</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualBooking} className="p-5 space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">고객 성함</label>
                  <input
                    type="text"
                    required
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    placeholder="홍길동"
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">연락처</label>
                  <input
                    type="tel"
                    required
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    placeholder="010-0000-0000"
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">서비스 항목</label>
                <select
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-xs font-bold"
                >
                  <option value="욕실 리모델링">욕실 리모델링</option>
                  <option value="주방/배관">주방/배관</option>
                  <option value="방수/설비">방수/설비</option>
                  <option value="종합 집수리">종합 집수리</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">방문 일자</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">시간대</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-xs"
                  >
                    <option value="오전 09:00 - 11:00">오전 09:00 - 11:00</option>
                    <option value="오전 11:00 - 13:00">오전 11:00 - 13:00</option>
                    <option value="오후 13:00 - 15:00">오후 13:00 - 15:00</option>
                    <option value="오후 15:00 - 17:00">오후 15:00 - 17:00</option>
                    <option value="오후 17:00 - 19:00">오후 17:00 - 19:00</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">방문 주소</label>
                <input
                  type="text"
                  required
                  value={newAddr}
                  onChange={(e) => setNewAddr(e.target.value)}
                  placeholder="서울시 마포구 공덕동 ..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">통화 내용 및 메모</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="전화 접수 시 요청 내용"
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700"
                >
                  예약 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
