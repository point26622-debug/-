import { BeforeAfterCase } from '../types';

export const BEFORE_AFTER_CASES: BeforeAfterCase[] = [
  {
    id: 'case-bathroom',
    category: '욕실 리모델링',
    title: '노후 욕실 타일 및 수전 리모델링',
    location: '서울 마포구 공덕동 32평형 아파트',
    period: '시공 소요: 1일 (철거 및 정밀 시공)',
    before: {
      description: '오래되어 누렇게 변색된 타일, 녹슨 수전, 곰팡이가 심한 줄눈 상태로 위생 문제 및 누수 불안이 심각했던 상태',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
      issues: [
        '누렇게 변색된 20년 된 타일',
        '백화 현상 및 녹슨 노후 수전',
        '줄눈 사이 검은 곰팡이 및 악취'
      ]
    },
    after: {
      description: '모던한 샌드톤 타일 시공, 친환경 방수 줄눈 작업, 고급 해바라기 수전 교체로 모던하고 깨끗한 호텔 스타일 욕실 완성',
      image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1000&q=80',
      highlights: [
        '따뜻하고 모던한 샌드톤 대형 포세린 타일',
        '친환경 항균 방수 에폭시 줄눈 마감',
        'SUS304 프리미엄 무광 해바라기 수전 세트'
      ]
    }
  },
  {
    id: 'case-kitchen',
    category: '주방/배관',
    title: '주방 하부장 배관 누수 및 냄새 차단 공사',
    location: '경기 성남시 분당구 45평형 빌라',
    period: '시공 소요: 2시간 (원데이 해결)',
    before: {
      description: '싱크대 하부 배관 노후로 인한 물 스며듦 및 하수구 악취 발생으로 하부장 목재 부식 및 날파리 유발 상태',
      image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=1000&q=80',
      issues: [
        '주름관 경화로 인한 미세 누수',
        '하수관 역류 및 심한 음식물 악취',
        '하부장 바닥 합판 침수 손상 위험'
      ]
    },
    after: {
      description: '고강도 PVC 냄새 방지 배관 교체 및 스텐 배수구 설치로 누수 완벽 해결 및 쾌적한 주방 환경 조성',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
      highlights: [
        '특수 이중 실리콘 악취 역류 방지 트랩',
        '올스텐 위생 배수구 & 고탄성 방수 호스',
        '하부장 방수 코팅 점검 및 통수 수압 테스트 완료'
      ]
    }
  },
  {
    id: 'case-waterproof',
    category: '방수/설비',
    title: '베란다 결로 방수 및 바이오 세라믹 탄성코트',
    location: '인천 연수구 송도동 아파트',
    period: '시공 소요: 1일',
    before: {
      description: '겨울철 심한 결로 현상으로 베란다 외벽 페인트 들뜸 및 검은 곰팡이가 넓게 번식해 호흡기 건강을 위협하던 상태',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      issues: [
        '벽체 페인트 박리 및 분진 발생',
        '습기로 인한 외벽 곰팡이 군집',
        '베란다 바닥 모서리 틈새 누수'
      ]
    },
    after: {
      description: '정밀 곰팡이 뿌리 박멸 항균 처리 및 최고급 바이오 세라믹 단열 탄성코트 시공으로 보송보송하고 쾌적한 베란다 복원',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      highlights: [
        '친환경 곰팡이 방지 하도 도포',
        '단열 성능 우수 바이오 세라믹 마감',
        '창호 실리콘 코킹 전면 재시공'
      ]
    }
  },
  {
    id: 'case-general',
    category: '종합 집수리',
    title: '현관 스마트 디지털 도어락 & 미세 방충망 올인원 교체',
    location: '서울 영등포구 당산동 주상복합',
    period: '시공 소요: 1시간 30분',
    before: {
      description: '오래된 기계식 보조키와 낡아 찢어지고 구멍 난 알루미늄 방충망으로 벌레 유입 및 보안 불안',
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1000&q=80',
      issues: [
        '헐거워진 알루미늄 망 부식 및 찢어짐',
        '잦은 오작동 구형 번호키',
        '문틀 틀어짐으로 인한 도어락 걸림'
      ]
    },
    after: {
      description: '블랙 고강도 스테인리스 미세 방충망과 원터치 지문인식 푸시풀 도어락으로 완벽한 안전과 편리함 선사',
      image: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1000&q=80',
      highlights: [
        '초미세 날벌레 100% 차단 스텐 방충망',
        '0.3초 초고속 지문인식 푸시풀 스마트락',
        '문틀 유격 교정 및 도어클로저 댐퍼 조절'
      ]
    }
  }
];

export const SERVICE_ITEMS = [
  {
    id: 'bathroom',
    category: '욕실 리모델링',
    title: '욕실 리모델링 & 타일/수전',
    subtitle: '호텔식 욕실 분위기부터 부분 타일·수전 교체까지',
    icon: 'Bath',
    priceGuide: '타일 보수 15만원~ / 부분 수전 8만원~ / 전체 리모델링 상담',
    items: [
      '노후 타일 보수 및 부분 덧방 시공',
      '친환경 에폭시 방수 줄눈 재시공',
      '고급 해바라기 수전 & 세면 수전 교체',
      '양변기 / 세면대 / 욕실 거울장 교체',
      '호텔식 모던 샌드톤 맞춤 리모델링'
    ],
    popular: true
  },
  {
    id: 'kitchen',
    category: '주방/배관',
    title: '주방 싱크대 & 배관 악취/누수 차단',
    subtitle: '하부장 물샘 완벽 차단 & 특수 트랩 냄새 원천 봉쇄',
    icon: 'Pipette',
    priceGuide: '배수통/호스 교체 7만원~ / 배관 역류 트랩 5만원~',
    items: [
      '싱크대 하부장 노후 주름관 전면 교체',
      '올스텐 위생 배수통 및 역류 방지 트랩',
      '하수구 고약한 악취 및 날파리 원천 차단',
      '주방 거위목 수전 / 싱크 원홀 수전 교체',
      '누수 정밀 점검 및 수압 통수 테스트'
    ],
    popular: true
  },
  {
    id: 'waterproof',
    category: '방수/설비',
    title: '방수 & 결로/누수 정밀 설비',
    subtitle: '아파트·빌라 베란다 누수 및 곰팡이 결로 완전 해결',
    icon: 'Droplets',
    priceGuide: '외벽/창호 실리콘 코킹 12만원~ / 탄성코트 상담',
    items: [
      '창호 실리콘 코킹 방수 재시공',
      '베란다 결로 방지 바이오 세라믹 탄성코트',
      '욕실 바닥 침투형 비파괴 방수 공사',
      '보일러 분배기 및 온수 배관 점검',
      '벽면 곰팡이 뿌리 박멸 항균 처리'
    ],
    popular: false
  },
  {
    id: 'general',
    category: '종합 집수리',
    title: '가정 토탈 종합 집수리',
    subtitle: '문짝, 도어락, 방충망, 조명 등 사소한 고장도 즉시 출장',
    icon: 'Wrench',
    priceGuide: '방충망 4만원~ / 도어락 설치 5만원~ / 조명 교체 3만원~',
    items: [
      '미세 먼지/날벌레 100% 차단 롤방충망',
      '디지털 지문인식 푸시풀 도어락 설치',
      '문짝 삐걱거림·처짐 교정 및 경첩 교체',
      'LED 조명 교체 및 노후 스위치/콘센트',
      '욕조, 싱크대 실리콘 코킹 깔끔 마감'
    ],
    popular: false
  }
];
