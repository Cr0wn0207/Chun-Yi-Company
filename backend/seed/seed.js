import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import News from '../models/News.js';
import Service from '../models/Service.js';
import Company from '../models/Company.js';

const services = [
  {
    title: 'DIGITAL TRANSFORMATION',
    slug: 'digital-transformation',
    subtitle: '기업의 지속 가능한 성장을 지원하는 디지털 혁신',
    description:
      '클라우드 네이티브 아키텍처, 레거시 시스템 현대화, 업무 프로세스 자동화를 통해 기업의 디지털 전환을 가속화합니다.',
    icon: 'digital',
    order: 1,
  },
  {
    title: 'AI & DATA',
    slug: 'ai-data',
    subtitle: '데이터 기반 의사결정과 AI 솔루션',
    description:
      '머신러닝, 생성형 AI, 데이터 분석 플랫폼을 활용하여 비즈니스 인사이트를 제공하고 업무 효율을 극대화합니다.',
    icon: 'ai',
    order: 2,
  },
  {
    title: 'CLOUD INFRASTRUCTURE',
    slug: 'cloud-infrastructure',
    subtitle: '안정적이고 확장 가능한 클라우드 인프라',
    description:
      'AWS, Azure, GCP 기반의 클라우드 설계·구축·운영 서비스로 안정적인 IT 인프라를 제공합니다.',
    icon: 'cloud',
    order: 3,
  },
  {
    title: 'SYSTEM DEVELOPMENT',
    slug: 'system-development',
    subtitle: '맞춤형 시스템 개발 및 통합',
    description:
      '웹·모바일·엔터프라이즈 시스템 개발부터 API 통합, 마이크로서비스 아키텍처까지 풀스택 개발을 제공합니다.',
    icon: 'dev',
    order: 4,
  },
  {
    title: 'IT CONSULTING',
    slug: 'it-consulting',
    subtitle: '전략 수립부터 실행까지 IT 컨설팅',
    description:
      'IT 전략 수립, 아키텍처 설계, 프로젝트 관리, 품질 보증 등 종합적인 IT 컨설팅 서비스를 제공합니다.',
    icon: 'consulting',
    order: 5,
  },
  {
    title: 'CUSTOMER EXPERIENCE',
    slug: 'customer-experience',
    subtitle: '고객 경험 혁신을 위한 CX 서비스',
    description:
      'UX/UI 설계, 고객 여정 분석, 디지털 채널 최적화를 통해 탁월한 고객 경험을 설계합니다.',
    icon: 'cx',
    order: 6,
  },
];

const news = [
  {
    seedKey: 'news-1',
    title: 'Chun Yi Technologies, 클라우드 네이티브 솔루션 사업 확대',
    category: 'press',
    summary: 'AI·클라우드 중심의 디지털 전환 서비스를 강화합니다.',
    publishedAt: new Date('2026-06-28'),
    featured: true,
  },
  {
    seedKey: 'news-2',
    title: '신규 파트너십 체결 — 글로벌 클라우드 프로바이더와 협력',
    category: 'notice',
    summary: '엔터프라이즈 고객을 위한 하이브리드 클라우드 서비스를 제공합니다.',
    publishedAt: new Date('2026-06-25'),
    featured: true,
  },
  {
    seedKey: 'news-3',
    title: '2026 디지털 트랜스포메이션 세미나 개최 안내',
    category: 'event',
    summary: '기업 IT 리더를 위한 무료 세미나를 7월에 개최합니다.',
    publishedAt: new Date('2026-06-20'),
    featured: false,
  },
  {
    seedKey: 'news-4',
    title: '자사 개발 DevOps 플랫폼 v2.0 출시',
    category: 'press',
    summary: 'CI/CD 자동화와 보안 스캔 기능이 대폭 강화되었습니다.',
    publishedAt: new Date('2026-06-15'),
    featured: false,
  },
  {
    seedKey: 'news-5',
    title: '정보보안 인증 ISO 27001 갱신 완료',
    category: 'notice',
    summary: '고객 데이터 보호를 위한 보안 체계를 지속적으로 강화합니다.',
    publishedAt: new Date('2026-06-10'),
    featured: false,
  },
];

const company = {
  name: 'Chun Yi Technologies',
  tagline: '미래를 함께 만들어가는 IT 파트너',
  vision:
    '고객과의 신뢰를 기반으로 새로운 가치를 창조하고, 기술 혁신을 통해 더 나은 미래를 열어갑니다.',
  mission:
    '비즈니스에 필요한 모든 IT 서비스를 원스톱으로 제공하며, 고객의 과제 해결과 새로운 가치 창출에 기여합니다.',
  founded: '2020',
  address: '埼玉県志木市本町六丁目8-12',
  phone: '02-1234-5678',
  email: 'contact@chunyi-tech.com',
  ceoMessage:
    '저희 Chun Yi Technologies는 고객의 비즈니스 성공을 최우선으로 생각합니다. 최신 기술과 풍부한 경험을 바탕으로, 고객과 함께 성장하는 진정한 파트너가 되겠습니다.',
  values: ['고객 중심', '기술 혁신', '신뢰와 투명성', '지속 가능한 성장'],
  history: [
    { year: '2020', event: 'Chun Yi Technologies 설립' },
    { year: '2021', event: '클라우드 사업부 신설, 첫 엔터프라이즈 고객 확보' },
    { year: '2023', event: 'AI·데이터 사업 확대, ISO 27001 인증 취득' },
    { year: '2025', event: '글로벌 파트너십 체결, 직원 50명 돌파' },
    { year: '2026', event: '디지털 트랜스포메이션 통합 솔루션 출시' },
  ],
};

async function seed() {
  await connectDB();

  await Promise.all([
    News.deleteMany({}),
    Service.deleteMany({}),
    Company.deleteMany({}),
  ]);

  await Service.insertMany(services);
  await News.insertMany(news);
  await Company.create(company);

  console.log('Database seeded successfully');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
