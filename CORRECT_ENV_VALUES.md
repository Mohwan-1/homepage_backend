# 올바른 Firebase 환경 변수 값

## Vercel 환경 변수 설정

https://vercel.com/sdisdi001/youtube-content-school/settings/environment-variables

### 설정해야 할 값들

**중요: 복사할 때 앞뒤 공백이 없는지 확인!**

```
NEXT_PUBLIC_FIREBASE_API_KEY
값: AIzaSyDa9274pjOegiOXtlgDYMcu7LBe72wEG1Y
환경: Production, Preview, Development 모두 체크

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
값: sidondding-homepage.firebaseapp.com
환경: Production, Preview, Development 모두 체크

NEXT_PUBLIC_FIREBASE_PROJECT_ID
값: sidondding-homepage
환경: Production, Preview, Development 모두 체크

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
값: sidondding-homepage.firebasestorage.app
환경: Production, Preview, Development 모두 체크

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
값: 948064095251
환경: Production, Preview, Development 모두 체크

NEXT_PUBLIC_FIREBASE_APP_ID
값: 1:948064095251:web:963a9d16cad35feafb03e6
환경: Production, Preview, Development 모두 체크

NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
값: G-3XMNN350JE
환경: Production, Preview, Development 모두 체크
```

## API 키 검증

올바른 Firebase API 키 형식:
- 시작: `AIza`
- 길이: 39자
- 예시: `AIzaSyDa9274pjOegiOXtlgDYMcu7LBe72wEG1Y`

## 일반적인 실수

1. ❌ 복사 시 앞뒤 공백 포함
2. ❌ 따옴표 포함 (예: "AIza..." 또는 'AIza...')
3. ❌ 줄바꿈 문자 포함
4. ❌ Environment 선택 누락 (Production만 체크)
5. ❌ 변수명 오타 (NEXT_PUBLIC_ 접두사 누락)

## 올바른 설정 방법

1. Vercel Dashboard에서 **Add New** 클릭
2. **Name** 입력 (예: `NEXT_PUBLIC_FIREBASE_API_KEY`)
3. **Value** 붙여넣기 (공백 없이!)
4. **Environments** 선택:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. **Save** 클릭
6. 모든 변수 추가 완료 후 **Redeploy**

## 검증 방법

배포 후 다음 URL 접속:
https://youtube-content-school.vercel.app/api/check-env

응답 예시:
```json
{
  "environment": "production",
  "vercel": true,
  "config": {
    "apiKey": "AIzaSyDa92...G1Y",
    "apiKeyLength": 39,
    "authDomain": "sidondding-homepage.firebaseapp.com",
    ...
  },
  "validation": {
    "apiKeyValid": true,
    "authDomainValid": true,
    "projectIdValid": true,
    "appIdValid": true
  }
}
```

모든 validation이 `true`여야 정상입니다!
