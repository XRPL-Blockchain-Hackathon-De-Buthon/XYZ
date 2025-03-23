# XRPFI - XRPL 스테이킹 플랫폼

XRPL 사용자를 위한 멀티체인 스테이킹 수익 미러링 플랫폼

## 프로젝트 설명

XRP를 예치하면 Axelar를 통해 PoS 체인으로 자산이 브릿징되고, 스테이킹 수익이 XRPL 상에서 RLUSD 등으로 지급되는 Web3 서비스입니다.

## 기술 스택

- **Frontend**: Next.js, TypeScript, Tailwind CSS v4
- **UI 라이브러리**: shadcn/ui, lucide-react
- **지갑 연동**: xrpl.js, Xaman SDK
- **상태 관리**: Zustand
- **데이터 통신**: TanStack Query

## 시작하기

### 필수 조건

- Node.js 18.x 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install
```

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```
# Xaman API 키 (필수)
NEXT_PUBLIC_XAMAN_API_KEY=your-api-key-here
```

Xaman API 키는 [Xaman 개발자 포털](https://apps.xumm.dev/)에서 얻을 수 있습니다.

### 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 애플리케이션을 확인할 수 있습니다.

## Vercel 배포 설정

### 환경 변수 설정

1. Vercel 프로젝트 대시보드에 로그인합니다
2. 프로젝트 설정 -> 환경 변수로 이동합니다
3. 다음 환경 변수를 추가합니다:
   - `NEXT_PUBLIC_XAMAN_API_KEY`: Xaman 개발자 포털에서 얻은 API 키

## 문제 해결

### Vercel 배포 시 500 오류

- 환경 변수 `NEXT_PUBLIC_XAMAN_API_KEY`가 설정되었는지 확인하세요
- 빌드 로그에서 오류 메시지를 확인하세요
- 서버 사이드 렌더링 환경에서 브라우저 전용 API 사용 여부를 확인하세요
