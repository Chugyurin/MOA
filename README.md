# 부모님을 위한 스마트 복약 케어

React / Express / tRPC / Drizzle 기반 랜딩페이지입니다.

## 페이지 구성

- `/`: 서비스의 핵심 가치, 기기 콘셉트, 한 컵 준비·남은 약 알림과 출시 알림
- `/how`: 보호자가 준비할 일과 사용 시 유의 사항
- `/care`: 제공 검토 중인 선택형 돌봄 서비스
- `/price`: 예정 요금, 확정 전 조건과 FAQ
- `/about`: 중복 소개 페이지를 제거하고 메인으로 연결

메인과 세부 페이지의 출시 알림 버튼은 화면 하단의 고정 버튼 하나로 통합했습니다. 버튼은 스크롤 중에도 표시되며 연락처 팝업을 엽니다. 모바일 안전 영역과 페이지 끝 여백을 확보했습니다. 필수 동의, 입력 검증, 전송 중 상태, 실패 재시도, 성공 안내를 제공하며 Escape와 초점 복원을 지원합니다.

## 실행과 검증

`pnpm install --frozen-lockfile` 후 `pnpm check`, `pnpm test`, `pnpm build`를 실행합니다. 빌드 결과는 `dist/index.js`와 `dist/public/`에 생성됩니다. 서버 기본 포트는 3000이며 `PORT`로 변경할 수 있습니다.

Windows PowerShell에서는 다음과 같이 실행할 수 있습니다.

```powershell
$env:NODE_ENV = 'development'
node --import tsx server/_core/index.ts
```

프로덕션 빌드 후에는 `node dist/index.js`로 실행합니다.

## 출시 알림 저장

신청 폼은 Supabase의 삽입 전용 함수 `submit_launch_contact`를 호출합니다. GitHub Pages처럼 정적 파일만 배포해도 Supabase에 이메일 또는 전화번호를 저장할 수 있습니다. 설정 방법과 권한 구성은 [`supabase/SETUP.md`](supabase/SETUP.md)를 참고하세요. Supabase 프로젝트에 SQL 마이그레이션을 적용하고 빌드 환경에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`를 설정해야 합니다. 저장 실패를 성공으로 표시하지 않습니다.

신청 목록은 Supabase Table Editor의 `public.launch_signups`에서 확인합니다. 브라우저 방문자는 목록을 읽거나 수정·삭제할 수 없습니다. 기존 Express/MySQL `launch.signup` API는 호환성을 위해 남아 있으나 현재 폼에서는 호출하지 않습니다.

이메일 발송 작업은 이 저장 API에 포함되어 있지 않습니다. 실제 출시 메일 발송은 별도로 연결해야 합니다. 폼의 수집 목적·보관 기간은 기존 정책을 유지했습니다.

## 디자인과 자산

프리텐다드 Variable 1.3.9를 자체 호스팅합니다. 라이선스는 `client/public/fonts/OFL.txt`에 있습니다. 기존 ZIP에 포함되지 않은 외부 제품 이미지는 제거했으며, 기기와 약봉지·스마트컵 일러스트는 개발 방향을 설명하는 콘셉트로 표시했습니다. 실제 제품 사진이나 검증된 성능으로 표현하지 않습니다.

디자인 참고: [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/), [Google Material Design](https://m3.material.io/foundations/), [토스](https://toss.im/).

## 확인한 범위

- TypeScript 검사, 프런트엔드·서버 빌드, 기존 테스트 6개 통과
- Chrome 320 / 390 / 768 / 1440px에서 메인·세부 페이지 가로 넘침 검사
- 연락처 팝업, 실제 저장 실패 안내, 모의 API 성공 안내, Escape와 버튼 초점 복원
- FAQ 열기, `/about` 연결, 사용자 화면의 브랜드 텍스트 제거

Supabase `MOA` 프로젝트에 저장 테이블과 함수를 적용했습니다. 실제 API 저장, 중복 처리, 미동의 거절, 방문자의 목록 조회 차단과 로컬 폼의 실제 저장을 확인했습니다. 자동 테스트 40개와 TypeScript 검사, 정적 빌드가 통과했습니다. 공개 사이트는 GitHub Actions로 배포하며, 이메일/SMS 발송은 연결하지 않았습니다.

`.env.production`에는 브라우저용 공개 URL과 publishable key만 포함됩니다. secret/service_role 키와 데이터베이스 비밀번호는 포함하지 않습니다.

## 기간 한정 알림 혜택과 신청자 수

한국시간 2026-11-09 18:00까지 남은 시간을 하단 고정 영역과 신청 팝업에 표시합니다. 마감되면 할인 문구가 일반 출시 알림 신청으로 바뀝니다.

화면의 시작 숫자 1,168명은 캠페인 기준값입니다. `supabase/migrations/202611080001_launch_signup_count.sql`을 기존 출시 알림 마이그레이션 다음에 실행하면, 기존 행은 기준값에 포함되고 이후 새로 저장되는 고유 연락처만 1명씩 추가됩니다. 방문자에게는 총 숫자만 공개되고 연락처 목록은 계속 비공개입니다. 이 마이그레이션을 운영 Supabase에 적용해야 숫자 자동 갱신이 작동합니다.

## 연락처와 전환 이벤트

이메일 또는 전화번호로 신청할 수 있습니다. 이벤트 정의, 입력 시작/중복 처리 기준, 일별 통계 확인 방법은 [`docs/launch-funnel.md`](docs/launch-funnel.md)를 참고하세요. `supabase/migrations/202611090001_launch_funnel_contacts.sql`은 기존 이메일을 유지하면서 전화번호와 전환 이벤트 저장을 추가합니다. 행동 기록은 `launch_events`, 실제 집계는 `launch_event_counts`, 연락처는 `launch_signups`에 분리됩니다. QA 기록은 실제 통계에서 제외합니다.
