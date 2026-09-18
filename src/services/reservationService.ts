import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Reservation, ReservationStatus } from '../types';

const COLLECTION_NAME = 'reservations';
const LOCAL_STORAGE_KEY = 'barun_reservations_cache';

const INITIAL_SAMPLE_RESERVATIONS: Reservation[] = [
  {
    id: 'res-sample-101',
    serviceCategory: 'bathroom',
    serviceType: '욕실 리모델링',
    subOptions: ['노후 타일 보수 및 부분 덧방 시공', '고급 해바라기 수전 & 세면 수전 교체'],
    date: '2026-09-20',
    timeSlot: '오전 09:00 - 12:00',
    customerName: '김민준',
    phone: '010-3456-7890',
    address: '서울특별시 마포구 독막로 123',
    addressDetail: '102동 804호',
    notes: '욕실 타일 줄눈에 곰팡이가 심하고 샤워기 수전 연결부에서 물이 미세하게 샙니다. 견적 후 바로 교체 희망합니다.',
    photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    status: 'PENDING',
    assignedEngineer: '김바른 수석팀장',
    createdAt: '2026-09-18T09:30:00.000Z',
    updatedAt: '2026-09-18T09:30:00.000Z'
  },
  {
    id: 'res-sample-102',
    serviceCategory: 'kitchen',
    serviceType: '주방/배관',
    subOptions: ['싱크대 하부장 노후 주름관 전면 교체', '올스텐 위생 배수통 및 역류 방지 트랩'],
    date: '2026-09-19',
    timeSlot: '오후 13:00 - 15:00',
    customerName: '이지은',
    phone: '010-8877-6655',
    address: '경기도 성남시 분당구 불정로 45',
    addressDetail: '현대아파트 301동 1202호',
    notes: '싱크대 하부장에서 며칠 전부터 썩은 냄새가 올라오고 설거지 후 물이 바닥으로 조금씩 스며나옵니다. 빠른 방문 부탁드려요.',
    photoUrl: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80',
    status: 'CONFIRMED',
    assignedEngineer: '박정밀 엔지니어',
    createdAt: '2026-09-17T14:15:00.000Z',
    updatedAt: '2026-09-18T08:00:00.000Z'
  },
  {
    id: 'res-sample-103',
    serviceCategory: 'general',
    serviceType: '종합 집수리',
    subOptions: ['디지털 지문인식 푸시풀 도어락 설치', '미세 먼지/날벌레 100% 차단 롤방충망'],
    date: '2026-09-16',
    timeSlot: '오전 10:00 - 12:00',
    customerName: '박서연',
    phone: '010-5544-3322',
    address: '인천광역시 연수구 컨벤시아대로 88',
    addressDetail: '센트럴파크 푸르지오 205호',
    notes: '기존 현관 번호키가 자꾸 방전되고 문이 뻑뻑해서 최신 지문인식 푸시풀로 교체하고 베란다 방충망도 1개 교체 원합니다.',
    photoUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
    status: 'COMPLETED',
    assignedEngineer: '이성실 기술기사',
    createdAt: '2026-09-15T11:00:00.000Z',
    updatedAt: '2026-09-16T12:30:00.000Z'
  }
];

function getLocalCache(): Reservation[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error reading localStorage reservations', e);
  }
  return INITIAL_SAMPLE_RESERVATIONS;
}

function setLocalCache(items: Reservation[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error writing localStorage reservations', e);
  }
}

export async function createReservation(data: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Reservation> {
  const newReservation: Reservation = {
    ...data,
    id: 'res-' + Date.now().toString().slice(-6),
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Try Firestore first
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...newReservation,
      createdAt: newReservation.createdAt,
      updatedAt: newReservation.updatedAt
    });
    newReservation.id = docRef.id;
  } catch (err) {
    console.warn('Firestore write fallback to local storage:', err);
  }

  // Update local cache
  const cache = getLocalCache();
  const updated = [newReservation, ...cache];
  setLocalCache(updated);

  return newReservation;
}

export function subscribeToReservations(callback: (items: Reservation[]) => void): () => void {
  // Return immediate local cache
  callback(getLocalCache());

  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const firestoreList = snapshot.docs.map(d => ({
          ...d.data(),
          id: d.id
        } as Reservation));
        setLocalCache(firestoreList);
        callback(firestoreList);
      } else {
        // If Firestore is empty, seed samples or use local cache
        const cache = getLocalCache();
        callback(cache);
      }
    }, (error) => {
      console.warn('Firestore subscription fallback to local cache:', error);
      callback(getLocalCache());
    });
    return unsubscribe;
  } catch (err) {
    console.warn('Firestore subscribe error, using local storage', err);
    return () => {};
  }
}

export async function updateReservationStatus(
  id: string, 
  status: ReservationStatus, 
  assignedEngineer?: string
): Promise<void> {
  const now = new Date().toISOString();
  
  // Try Firestore
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData: Record<string, unknown> = {
      status,
      updatedAt: now
    };
    if (assignedEngineer !== undefined) {
      updateData.assignedEngineer = assignedEngineer;
    }
    await updateDoc(docRef, updateData);
  } catch (err) {
    console.warn('Firestore update fallback to local cache:', err);
  }

  // Update local cache
  const cache = getLocalCache();
  const updated = cache.map(item => {
    if (item.id === id) {
      return {
        ...item,
        status,
        ...(assignedEngineer !== undefined ? { assignedEngineer } : {}),
        updatedAt: now
      };
    }
    return item;
  });
  setLocalCache(updated);
}

export async function fetchReservationsByPhone(phoneQuery: string): Promise<Reservation[]> {
  const cleanQuery = phoneQuery.replace(/[^0-9]/g, '');
  const all = getLocalCache();
  return all.filter(r => r.phone.replace(/[^0-9]/g, '').includes(cleanQuery));
}
