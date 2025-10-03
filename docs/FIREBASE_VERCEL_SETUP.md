# Firebase Vercel 배포 설정 가이드

## 문제: 인증 오류 발생
배포된 Vercel 사이트에서 "인증 오류가 발생했습니다" 메시지가 나타나는 경우

## 원인
Firebase Authentication은 보안을 위해 승인된 도메인에서만 인증을 허용합니다.
Vercel 배포 시 새로운 도메인이 생성되므로, Firebase Console에서 해당 도메인을 승인해야 합니다.

## 해결 방법

### 1. Firebase Console 접속
https://console.firebase.google.com 접속

### 2. 프로젝트 선택
`sidondding-homepage` 프로젝트 선택

### 3. Authentication 설정
1. 왼쪽 메뉴에서 **Authentication** 클릭
2. **Settings** 탭 클릭
3. **Authorized domains** 섹션으로 이동

### 4. 도메인 추가
다음 도메인들을 **Add domain** 버튼으로 추가:

**필수 도메인:**
- `youtube-content-school.vercel.app` (프로덕션 도메인)
- `youtube-content-school-46j1gx2j0-sdisdi001.vercel.app` (프리뷰 도메인)

**선택 도메인 (개발/테스트용):**
- `localhost` (로컬 개발)
- `127.0.0.1` (로컬 개발)

**Vercel 프리뷰 도메인 처리:**
Vercel은 각 배포마다 고유한 URL을 생성합니다 (예: `project-hash123.vercel.app`)
- 매번 수동으로 추가하거나
- 커스텀 도메인 사용 권장

### 5. Google OAuth 설정 (Google 로그인 사용 시)
1. Authentication > Sign-in method
2. Google 제공업체 클릭
3. **승인된 도메인** 섹션에서 동일한 도메인들이 추가되었는지 확인

### 6. 변경사항 저장
- **Save** 버튼 클릭
- 설정 적용까지 몇 분 소요될 수 있음

## 검증
1. 배포된 사이트 접속: https://youtube-content-school.vercel.app
2. 로그인 시도
3. 정상 작동 확인

## 추가 팁

### 커스텀 도메인 사용
Vercel에서 커스텀 도메인을 설정하면 URL 변경 없이 사용 가능:
1. Vercel 프로젝트 > Settings > Domains
2. 커스텀 도메인 추가
3. Firebase에 해당 도메인 추가

### 환경 변수 확인
Vercel > Settings > Environment Variables에서 다음 변수들이 설정되어 있는지 확인:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

## 현재 설정
- Firebase Auth Domain: `sidondding-homepage.firebaseapp.com`
- Vercel Production URL: `https://youtube-content-school.vercel.app`
- Vercel Preview URL: `https://youtube-content-school-46j1gx2j0-sdisdi001.vercel.app`
