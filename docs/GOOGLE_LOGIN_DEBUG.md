# Google 로그인 디버깅 가이드

## 문제: Google 로그인 후 사용자 상태가 반영되지 않음

### 1단계: Firebase Console 설정 확인

#### 1.1 Firebase Console 접속
1. https://console.firebase.google.com/ 접속
2. 프로젝트 선택: `sidondding-homepage`

#### 1.2 Authentication 설정 확인
1. 좌측 메뉴 → **Build** → **Authentication** 클릭
2. **Sign-in method** 탭 클릭
3. **Google** 제공업체 확인
   - ✅ 상태가 "사용 설정됨"이어야 함
   - ❌ "사용 중지됨"이면 클릭하여 활성화

#### 1.3 승인된 도메인 확인
1. Authentication → **Settings** 탭
2. **승인된 도메인** 섹션 확인
3. 다음 도메인이 포함되어야 함:
   - `localhost` (개발 환경)
   - `sidondding-homepage.firebaseapp.com` (Firebase 호스팅)
   - 프로덕션 도메인 (있다면)

### 2단계: 브라우저 콘솔 로그 확인

#### 2.1 개발자 도구 열기
- Windows/Linux: `F12` 또는 `Ctrl + Shift + I`
- Mac: `Cmd + Option + I`

#### 2.2 콘솔 탭에서 확인할 로그

**Firebase 초기화:**
```
🔥 Firebase Config: {apiKey: "✅ 설정됨", authDomain: "...", ...}
✅ Firebase 초기화 성공
```

**Auth 초기화:**
```
🔔 Auth state changed: 로그아웃 상태
ℹ️ 리다이렉트 결과 없음 (일반 페이지 로드)
```

**Google 로그인 클릭 시:**
```
🔵 Google 로그인 시작...
🔵 Auth 객체: {...}
🔵 Auth Domain: sidondding-homepage.firebaseapp.com
🔵 Provider 설정 완료, 리다이렉트 시작...
🔵 리다이렉트 요청 완료 (페이지 이동 중...)
```

**Google 인증 후 돌아왔을 때:**
```
🔔 Auth state changed: your-email@gmail.com
👤 Firebase Auth 사용자: abc123...
✅ Firestore 사용자 데이터 로드: {...}
🔄 Google 리다이렉트 결과 확인 중...
✅ Google 로그인 리다이렉트 성공: your-email@gmail.com
```

#### 2.3 에러 확인

**만약 이런 에러가 뜬다면:**

**에러 1: auth/unauthorized-domain**
```
❌ Error code: auth/unauthorized-domain
```
👉 해결: Firebase Console → Authentication → Settings → 승인된 도메인에 `localhost` 추가

**에러 2: auth/popup-blocked**
```
❌ Error code: auth/popup-blocked
```
👉 해결: 리다이렉트 방식으로 이미 변경됨 (정상)

**에러 3: Firebase 설정 오류**
```
🔥 Firebase Config: {apiKey: "❌ 없음", ...}
```
👉 해결: `.env.local` 파일 확인 및 서버 재시작

### 3단계: 환경 변수 확인

#### 3.1 .env.local 파일 확인
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDa9274pjOegiOXtlgDYMcu7LBe72wEG1Y
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sidondding-homepage.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sidondding-homepage
```

#### 3.2 환경 변수가 올바른지 확인
- ✅ 모든 값이 실제 Firebase 프로젝트 값과 일치
- ✅ `NEXT_PUBLIC_` 접두사 확인 (필수!)
- ✅ 따옴표 없이 값만 입력

#### 3.3 서버 재시작
환경 변수 수정 후 반드시:
```bash
# 기존 서버 중지 (Ctrl + C)
# 서버 재시작
npm run dev
```

### 4단계: Firebase Console에서 사용자 확인

#### 4.1 Authentication 사용자 목록
1. Firebase Console → Authentication → **Users** 탭
2. Google 로그인 성공 시 여기에 사용자가 추가되어야 함

#### 4.2 Firestore 데이터 확인
1. Firebase Console → **Firestore Database**
2. `users` 컬렉션 확인
3. Google 로그인한 사용자의 문서가 있어야 함:
   ```json
   {
     "uid": "abc123...",
     "email": "user@gmail.com",
     "name": "User Name",
     "role": "user",
     "createdAt": "2025-10-03T..."
   }
   ```

### 5단계: 일반적인 해결 방법

#### 방법 1: 브라우저 캐시 삭제
1. `Ctrl + Shift + Delete` (또는 `Cmd + Shift + Delete`)
2. 쿠키 및 캐시 삭제
3. 브라우저 재시작

#### 방법 2: 시크릿 모드에서 테스트
- Chrome: `Ctrl + Shift + N`
- 확장 프로그램 영향 없이 순수 테스트 가능

#### 방법 3: Firebase 규칙 확인
Firestore 규칙이 읽기/쓰기를 허용하는지 확인:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 6단계: 체크리스트

로그인 테스트 전 확인:
- [ ] Firebase Console에서 Google 로그인 활성화됨
- [ ] 승인된 도메인에 `localhost` 포함됨
- [ ] `.env.local` 파일에 모든 환경 변수 설정됨
- [ ] 개발 서버가 실행 중 (`npm run dev`)
- [ ] 브라우저 콘솔이 열려 있음 (F12)

로그인 테스트:
1. [ ] "로그인" 버튼 클릭
2. [ ] "Google로 로그인" 버튼 클릭
3. [ ] 콘솔에 "🔵 Google 로그인 시작..." 로그 확인
4. [ ] Google 인증 페이지로 이동됨
5. [ ] Google 계정 선택
6. [ ] 홈페이지로 돌아옴
7. [ ] 콘솔에 "✅ Google 로그인 리다이렉트 성공" 로그 확인
8. [ ] 헤더에 사용자 이름 표시됨
9. [ ] Firebase Console → Authentication → Users에 사용자 추가됨
10. [ ] Firebase Console → Firestore → users 컬렉션에 문서 생성됨

### 디버깅 연락처

문제가 계속되면 다음 정보를 제공해주세요:
1. 브라우저 콘솔의 전체 로그 (스크린샷)
2. Firebase Console → Authentication 스크린샷
3. 에러 메시지 (있다면)
