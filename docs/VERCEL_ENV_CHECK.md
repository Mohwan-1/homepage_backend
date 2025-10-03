# Vercel 환경 변수 확인 가이드

## 현재 오류 상황
Firebase 도메인을 추가했는데도 인증 오류가 발생하는 경우

## 체크리스트

### 1. Vercel 환경 변수 확인
Vercel > 프로젝트 > Settings > Environment Variables

**필수 환경 변수:**
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDa9274pjOegiOXtlgDYMcu7LBe72wEG1Y
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sidondding-homepage.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sidondding-homepage
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sidondding-homepage.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=948064095251
NEXT_PUBLIC_FIREBASE_APP_ID=1:948064095251:web:963a9d16cad35feafb03e6
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-3XMNN350JE
```

**중요:**
- 모든 환경 변수가 `Production`, `Preview`, `Development` 세 환경 모두에 설정되어 있는지 확인
- `NEXT_PUBLIC_` 접두사가 정확한지 확인 (클라이언트에서 접근하려면 필수)

### 2. Firebase Authorized Domains 확인
Firebase Console > Authentication > Settings > Authorized domains

**추가해야 할 도메인:**
- `youtube-content-school.vercel.app` ✅
- `youtube-content-school-m4t88jdfz-sdisdi001.vercel.app` (최신 프리뷰)
- `*.vercel.app` (와일드카드는 지원 안 됨 - 각각 추가해야 함)

### 3. Firebase OAuth 제공업체 설정
Firebase Console > Authentication > Sign-in method > Google

**설정 확인:**
1. Google 제공업체가 **활성화**되어 있는지 확인
2. **승인된 도메인** 목록에 Vercel 도메인이 있는지 확인
3. Web SDK 구성에서 **Web client ID**와 **Web client secret**이 설정되어 있는지 확인

### 4. 브라우저 콘솔 에러 확인
배포된 사이트에서 F12 개발자 도구 > Console 탭

**확인할 로그:**
```
🔥 Firebase Config: { ... }
🌐 현재 도메인: youtube-content-school.vercel.app
🔵 Google 로그인 시작...
```

**에러 코드별 해결 방법:**
- `auth/unauthorized-domain`: Firebase Authorized domains에 도메인 추가
- `auth/popup-blocked`: 브라우저 팝업 차단 해제
- `auth/configuration-not-found`: Firebase 환경 변수 재확인
- `auth/network-request-failed`: 네트워크 연결 확인

### 5. Vercel 재배포
환경 변수 변경 후 반드시 **재배포** 필요:
```bash
vercel --prod
```

또는 Vercel Dashboard에서:
1. Deployments 탭
2. 최신 배포의 [...] 메뉴
3. "Redeploy" 클릭

### 6. 캐시 문제 해결
브라우저 캐시 때문에 문제가 발생할 수 있음:
- Hard Reload: Ctrl + Shift + R (Windows) / Cmd + Shift + R (Mac)
- 시크릿 모드에서 테스트
- 브라우저 캐시 및 쿠키 삭제

## 디버깅 팁

### Vercel 로그 확인
```bash
vercel logs youtube-content-school.vercel.app
```

### Firebase 설정 직접 확인
브라우저 콘솔에서:
```javascript
// Firebase 설정 출력
console.log(window.location.hostname);
```

### 일반적인 실수
1. ❌ 환경 변수에 `NEXT_PUBLIC_` 접두사 빠뜨림
2. ❌ Vercel에서 환경 변수 변경 후 재배포 안 함
3. ❌ Firebase에서 도메인 추가 후 시간 지연 (5-10분 대기)
4. ❌ Production 환경에만 환경 변수 설정 (Preview도 필요)
5. ❌ 브라우저 캐시 문제

## 빠른 해결 방법

### 방법 1: Vercel 환경 변수 재설정
1. Vercel Dashboard > Settings > Environment Variables
2. 모든 Firebase 변수 삭제
3. 다시 추가 (Production, Preview, Development 모두 체크)
4. 재배포

### 방법 2: Firebase 프로젝트 새로고침
1. Firebase Console에서 로그아웃
2. 다시 로그인
3. Authorized domains 재확인
4. 5분 대기 후 재시도

### 방법 3: 완전 재배포
```bash
# 로컬에서
git commit --allow-empty -m "trigger redeploy"
git push
vercel --prod
```

## 현재 설정값
- **프로젝트 ID**: sidondding-homepage
- **Auth Domain**: sidondding-homepage.firebaseapp.com
- **Production URL**: youtube-content-school.vercel.app
- **Latest Preview**: youtube-content-school-m4t88jdfz-sdisdi001.vercel.app
