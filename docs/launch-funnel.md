# 연락처 신청 및 전환 이벤트

신청 목록: Supabase → Table Editor → `launch_signups`. 이메일은 `email`, 전화번호는 국제 형식의 `phone`에 저장됩니다. 기존 신청은 그대로 보존됩니다. 같은 연락처는 중복 저장하지 않으며 실제 메시지 발송은 별도입니다.

행동 원본: `launch_events`. 일별 통계: `launch_event_counts` 뷰. 통계의 날짜는 한국 시간이며 테스트(`is_test=true`)는 제외합니다.

| 이벤트 | 기록 시점 |
|---|---|
| page_view | 페이지를 연 시점 |
| cta_view | CTA가 화면에 처음 나타난 시점, 페이지당 1회 |
| cta_click | 메인 CTA 클릭마다 |
| dialog_open | 신청 팝업이 실제로 열릴 때 |
| contact_focus | 연락처 칸에 초점이 갈 때. 자동 초점도 포함하므로 입력 시작과 다름 |
| contact_input_started | 팝업을 연 뒤 처음으로 빈 칸이 아닌 값을 입력할 때, 팝업당 1회 |
| contact_valid | 유효한 이메일/전화번호 형태에 처음 도달할 때, 종류별 팝업당 1회 |
| contact_blur | 연락처 입력 칸에서 초점이 벗어날 때 |
| consent_changed | 동의를 체크/해제할 때 |
| submit_attempt | 팝업 제출 시도마다. Enter 제출 포함 |
| validation_error | 연락처 형식/미입력 또는 동의 누락으로 제출할 수 없을 때 |
| submit_started | 유효성 검사 통과 후 실제 저장 요청을 보낼 때 |
| submit_retry | 저장 실패 이후 다시 유효한 제출을 시도할 때 |
| submit_failed | 저장 요청 오류/시간 초과. 사유 코드만 저장 |
| submit_success | DB가 연락처를 저장/중복 처리할 때. 저장 작업과 같은 트랜잭션에서 기록 |
| dialog_closed | 닫기 버튼/바깥 영역/Escape/완료 후 닫기. 같은 flow의 성공 여부로 이탈 구분 |
| dialog_interrupted | 팝업이 열린 채 화면이 숨겨지거나 페이지에서 나갈 때. 숨김은 확정 이탈로 해석하지 않음 |

`event_count`는 행동 횟수, `session_count`는 탭 세션 수, `flow_count`는 팝업 흐름 수입니다. `session_id`는 같은 탭에서 유지되는 무작위 ID이며 실제 사람 수를 의미하지 않습니다. `page_id`는 페이지 로드, `flow_id`는 팝업을 새로 열 때마다 바뀝니다. CTA 클릭·입력 시작·저장 성공을 같은 `flow_id`로 연결할 수 있습니다. 같은 연락처의 중복 제출도 성공 행동에는 포함되므로 신규 연락처 수는 `launch_signups`에서 확인하세요.

연락처 원문·키 입력·URL 쿼리·사용자 에이전트·정밀 위치는 이벤트에 보내지 않습니다. 이벤트 필드를 서버에서도 제한하며 신청자/이벤트 원본과 집계 뷰는 방문자가 조회할 수 없습니다. 기존 Meta PageView/Lead 동작은 유지합니다.

전송은 작은 배치로 수행하고 실패한 이벤트는 같은 ID로 재시도합니다. 종료 시 keepalive로 전송하며 탭 세션 저장소에 대기열을 보관합니다. 브라우저 강제 종료·광고차단·오프라인·저장소 차단으로 이벤트가 누락될 수 있으므로 100% 포착이나 실제 인원 수를 보장하지 않습니다. 연락처는 대기열에 넣지 않습니다.

QA: 페이지 주소 끝에 `?qa=1`을 붙여 테스트합니다. 이 모드의 이벤트와 신청은 `is_test=true`로 기록되고 일반 집계/신청자 수 증가에서 제외됩니다.

확인용 SQL:
```sql
select * from public.launch_event_counts order by day_kst desc, event_name;
select event_name,count(*) from public.launch_events where is_test=false group by event_name;
select flow_id,event_name,reason,attempt,elapsed_ms from public.launch_events order by received_at desc limit 100;
```
