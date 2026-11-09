# Supabase 출시 알림 연결

1. Supabase 프로젝트의 SQL Editor에서 `migrations/202611070001_launch_signups.sql`을 실행한 뒤 `migrations/202611080001_launch_signup_count.sql`을 실행합니다.
2. 프로젝트 URL과 **publishable key**를 프로젝트 루트 `.env.local`에 설정합니다. `.env.example`을 참고하세요. secret/service_role 키는 사용하지 않습니다.
3. 개발 서버를 다시 실행하거나 정적 사이트를 다시 빌드합니다. GitHub Actions 빌드에는 `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`를 환경변수로 전달해야 합니다.
4. 실제 폼에서 테스트 연락처을 제출한 다음 Supabase Table Editor → `public.launch_signups`에서 저장을 확인합니다.

브라우저는 Supabase의 HTTPS API를 통해 저장 함수를 호출합니다. 따라서 별도의 Express/MySQL 서버 없이 정적 배포에서도 신청이 저장됩니다. 테이블은 RLS를 켜고 방문자의 직접 읽기·수정·삭제·삽입 권한을 제거했습니다. 공개된 함수는 동의/연락처을 검증한 뒤 삽입만 수행하며, 중복 연락처도 같은 성공 응답을 돌려줍니다.

수집 데이터: `email` 또는 `phone`, `consent`, `created_at`. 목록 확인·CSV 내보내기는 로그인한 Supabase 대시보드에서 할 수 있습니다. 기존 MySQL 데이터의 이전과 출시 메일 발송은 이 연결에 포함되지 않습니다.

참고: [Supabase API](https://supabase.com/docs/guides/api), [공개 키](https://supabase.com/docs/guides/getting-started/api-keys), [함수 권한](https://supabase.com/docs/guides/database/functions).

전환 이벤트와 QA 테스트 기준은 [`../docs/launch-funnel.md`](../docs/launch-funnel.md)를 참고하세요.
