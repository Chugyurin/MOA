# 부모님을 위한 스마트 복약 케어

React / Express / tRPC / Drizzle 기반 랜딩페이지입니다.

## 페이지 구성

- `/`: 서비스의 핵심 가치, 기기 콘셉트, 한 컵 준비·남은 약 알림과 출시 알림
- `/how`: 보호자가 준비할 일과 사용 시 유의 사항
- `/care`: 제공 검토 중인 선택형 돌봄 서비스
- `/price`: 예정 요금, 확정 전 조건과 FAQ
- `/about`: 중복 소개 페이지를 제거하고 메인으로 연결

메인과 세부 페이지의 출시 알림 버튼은 화면 하단의 고정 버튼 하나로 통합했습니다. 버튼은 스크롤 중에도 표시되며 이메일 팝업을 엽니다. 모바일 안전 영역과 페이지 끝 여백을 확보했습니다. 필수 동의, 입력 검증, 전송 중 상태, 실패 재시도, 성공 안내를 제공하며 Escape와 초점 복원을 지원합니다.

## 실행과 검증

`pnpm install --frozen-lockfile` 후 `pnpm check`, `pnpm test`, `pnpm build`를 실행합니다. 빌드 결과는 `dist/index.js`와 `dist/public/`에 생성됩니다. 서버 기본 포트는 3000이며 `PORT`로 변경할 수 있습니다.

Windows PowerShell에서는 다음과 같이 실행할 수 있습니다.

```powershell
$env:NODE_ENV = 'development'
node --import tsx server/_core/index.ts
```

프로덕션 빌드 후에는 `node dist/index.js`로 실행합니다.

## 출시 알림 저장

신청은 기존 `launch.signup` API와 MySQL `launchSignups` 테이블에 저장됩니다. 운영 서버에 `DATABASE_URL`을 설정하고 `pnpm db:migrate`로 마이그레이션을 적용해야 합니다. 정적 파일만 배포하면 신청을 저장할 수 없습니다. 데이터베이스 미설정이나 저장 실패를 성공으로 표시하지 않습니다.

이메일 발송 작업은 이 저장 API에 포함되어 있지 않습니다. 실제 출시 메일 발송은 별도로 연결해야 합니다. 폼의 수집 목적·보관 기간은 기존 정책을 유지했습니다.

## 디자인과 자산

프리텐다드 Variable 1.3.9를 자체 호스팅합니다. 라이선스는 `client/public/fonts/OFL.txt`에 있습니다. 기존 ZIP에 포함되지 않은 외부 제품 이미지는 제거했으며, 기기와 약봉지·스마트컵 일러스트는 개발 방향을 설명하는 콘셉트로 표시했습니다. 실제 제품 사진이나 검증된 성능으로 표현하지 않습니다.

디자인 참고: [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/), [Google Material Design](https://m3.material.io/foundations/), [토스](https://toss.im/).

## 확인한 범위

- TypeScript 검사, 프런트엔드·서버 빌드, 기존 테스트 6개 통과
- Chrome 320 / 390 / 768 / 1440px에서 메인·세부 페이지 가로 넘침 검사
- 이메일 팝업, 실제 저장 실패 안내, 모의 API 성공 안내, Escape와 버튼 초점 복원
- FAQ 열기, `/about` 연결, 사용자 화면의 브랜드 텍스트 제거

운영 데이터베이스가 제공되지 않아 실제 이메일 저장과 발송은 검증하지 않았습니다.
