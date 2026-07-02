# Chun Yi Technologies — 기업 웹사이트

[SCSK](https://www.scsk.jp/) 스타일을 참고한 개인/소규모 기업용 코퍼레이트 웹사이트입니다.  
**MERN 스택** (MongoDB, Express, React, Node.js)으로 구축되었습니다.

## 주요 기능

| 영역 | 설명 |
|------|------|
| **홈** | 히어로 슬라이더, 비전, 토픽, 서비스 카드, 뉴스 목록 |
| **기업정보** | 대표 메시지, 경영 이념, 회사 개요, 연혁 |
| **제품·서비스** | 6개 핵심 사업 영역 (SCSK 스타일 카드 레이아웃) |
| **뉴스** | 보도자료 / 공지 / 이벤트 필터 |
| **문의하기** | MongoDB에 저장되는 문의 폼 |

## 프로젝트 구조

```
├── backend/          # Express API + MongoDB
│   ├── models/       # News, Service, Company, Contact
│   ├── routes/       # REST API 엔드포인트
│   └── seed/         # 초기 데이터
├── frontend/         # React (Vite)
│   └── src/
│       ├── components/  # Header, Footer, Hero 등
│       └── pages/       # Home, About, Services, News, Contact
└── package.json      # 루트 스크립트 (concurrently)
```

## 시작하기

### 사전 요구사항

- Node.js 18+
- [MongoDB Atlas](https://www.mongodb.com/atlas) 무료 M0 클러스터 (권장)

### MongoDB Atlas 무료 클러스터 설정

1. [MongoDB Atlas](https://cloud.mongodb.com/) 접속 → **Sign Up** (Google/GitHub 또는 이메일)
2. **Build a Database** → **M0 FREE** 선택 → 리전 선택(가까운 AWS/GCP) → **Create**
3. **Database Access** → **Add New Database User**
   - Username / Password 생성 후 저장 (비밀번호는 반드시 기록)
4. **Network Access** → **Add IP Address**
   - 개발용: **Allow Access from Anywhere** (`0.0.0.0/0`)
   - 운영 전에는 본인 IP만 허용 권장
5. 클러스터 **Connect** → **Drivers** → **Node.js** 선택
6. 연결 문자열 복사 후 `backend/.env` 수정:

```env
MONGODB_URI=mongodb+srv://사용자명:비밀번호@cluster0.xxxxx.mongodb.net/chunyi-corp?retryWrites=true&w=majority
```

> 비밀번호에 `@`, `#`, `%` 등 특수문자가 있으면 URL 인코딩 필요 (`@` → `%40`)

### 설치 및 실행

```bash
# 1. 의존성 설치
npm run install:all

# 2. 환경 변수 설정 (Atlas 연결 문자열 입력)
cp backend/.env.example backend/.env
# backend/.env 의 MONGODB_URI 를 Atlas 연결 문자열로 수정

# 3. MongoDB 시드 데이터 입력
npm run seed

# 4. 개발 서버 실행 (백엔드 :5000 + 프론트엔드 :3000)
npm run dev
```

브라우저에서 http://localhost:3000 을 열어 확인하세요.

## API 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/company` | 회사 정보 |
| GET | `/api/services` | 서비스 목록 |
| GET | `/api/services/:slug` | 서비스 상세 |
| GET | `/api/news` | 뉴스 목록 (`?category=press&limit=10`) |
| GET | `/api/news/:id` | 뉴스 상세 |
| POST | `/api/contact` | 문의 접수 |

## 커스터마이징

- **회사명/로고**: `frontend/src/components/Header.jsx`, `Footer.jsx`
- **시드 데이터**: `backend/seed/seed.js` (회사 정보, 서비스, 뉴스)
- **디자인 색상**: `frontend/src/styles/global.css` (`--color-primary` 등)

## 프로덕션 빌드

```bash
npm run build
NODE_ENV=production npm start --prefix backend
```

Express가 `frontend/dist`를 정적 파일로 서빙합니다.
