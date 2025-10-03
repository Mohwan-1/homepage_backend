# Vercel 환경 변수 설정 가이드

## 문제 상황
- 로컬에서는 정상 작동
- Vercel 배포 후 Firebase 인증 오류 발생
- 원인: 환경 변수 미설정 또는 잘못된 값

## 해결 방법

### 1. Vercel Dashboard에서 직접 설정 (권장)

1. **Vercel Dashboard 접속**: https://vercel.com/sdisdi001/youtube-content-school/settings/environment-variables

2. **기존 변수 모두 삭제** (잘못된 값 제거)
   - NEXT_PUBLIC_FIREBASE_API_KEY
   - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   - NEXT_PUBLIC_FIREBASE_PROJECT_ID
   - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   - NEXT_PUBLIC_FIREBASE_APP_ID
   - NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

3. **새로 추가** (아래 값 복사하여 붙여넣기)

#### Firebase 환경 변수

**NEXT_PUBLIC_FIREBASE_API_KEY**
```
AIzaSyDa9274pjOegiOXtlgDYMcu7LBe72wEG1Y
```
- Environments: ✅ Production ✅ Preview ✅ Development

**NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN**
```
sidondding-homepage.firebaseapp.com
```
- Environments: ✅ Production ✅ Preview ✅ Development

**NEXT_PUBLIC_FIREBASE_PROJECT_ID**
```
sidondding-homepage
```
- Environments: ✅ Production ✅ Preview ✅ Development

**NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET**
```
sidondding-homepage.firebasestorage.app
```
- Environments: ✅ Production ✅ Preview ✅ Development

**NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID**
```
948064095251
```
- Environments: ✅ Production ✅ Preview ✅ Development

**NEXT_PUBLIC_FIREBASE_APP_ID**
```
1:948064095251:web:963a9d16cad35feafb03e6
```
- Environments: ✅ Production ✅ Preview ✅ Development

**NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID**
```
G-3XMNN350JE
```
- Environments: ✅ Production ✅ Preview ✅ Development

#### TossPayments 환경 변수

**NEXT_PUBLIC_TOSS_CLIENT_KEY**
```
test_ck_Poxy1XQL8RxKKvvGpxJ4V7nO5Wml
```
- Environments: ✅ Production ✅ Preview ✅ Development

**TOSS_SECRET_KEY**
```
test_sk_BX7zk2yd8y5aMaPZWpaq8x9POLqK
```
- Environments: ✅ Production ✅ Preview ✅ Development

**TOSS_SECURITY_KEY**
```
8123257ccf5e70a9089f5f042c8747d4ce1c8997262fbc7830b2e07d23cd561b
```
- Environments: ✅ Production ✅ Preview ✅ Development

### 2. 재배포

환경 변수 설정 후 **반드시 재배포** 필요:

```bash
vercel --prod
```

또는 Vercel Dashboard:
1. **Deployments** 탭
2. 최신 배포 [...] 메뉴
3. **Redeploy** 클릭

### 3. 검증

배포 완료 후:
1. https://youtube-content-school.vercel.app/api/check-env 접속
2. 모든 validation이 `true`인지 확인
3. Google 로그인 테스트

## 주의사항

### ❌ 하지 말아야 할 것
1. 환경 변수에 따옴표 추가 (예: `"AIza..."` ❌)
2. 공백 포함 (앞/뒤 공백 제거)
3. 줄바꿈 포함
4. Environment 선택 누락

### ✅ 올바른 방법
1. 값만 복사 (따옴표 없이)
2. 공백 제거 확인
3. 모든 Environment 체크
4. 저장 후 재배포

## Firebase Authorized Domains

환경 변수 설정 후 Firebase에서도 도메인 승인 필요:

1. https://console.firebase.google.com
2. **sidondding-homepage** 프로젝트 선택
3. **Authentication > Settings > Authorized domains**
4. 다음 도메인 추가:
   - `youtube-content-school.vercel.app`
   - `*.youtube-content-school.vercel.app` (서브도메인)

## 트러블슈팅

### 여전히 오류가 발생한다면

1. **브라우저 캐시 삭제**
   - Ctrl + Shift + R (하드 리프레시)
   - 시크릿 모드에서 테스트

2. **Vercel 로그 확인**
   ```bash
   vercel logs youtube-content-school.vercel.app
   ```

3. **환경 변수 재확인**
   - 대소문자 정확히 일치
   - 오타 없는지 확인
   - 모든 Environment 선택했는지

4. **완전 재배포**
   ```bash
   git commit --allow-empty -m "force redeploy"
   git push
   vercel --prod
   ```
