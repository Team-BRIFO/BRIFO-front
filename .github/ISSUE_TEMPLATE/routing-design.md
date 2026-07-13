---
name: Routing Design
about: 라우팅 구조 설계 및 페이지 경로 정의
title: '[Feat] 라우팅 설계'
labels: 'feat'
assignees: ''
---

## 🗺️ 개요

이 프로젝트의 전체 라우팅 구조를 설계하고 `React Router DOM v7`을 활용하여 SPA 라우팅 시스템을 구축합니다.

## 🎯 목적

- 화면 간 이동 경로를 명확하게 정의하여 개발 일관성을 보장합니다.
- `ROUTES` 상수를 통해 경로를 중앙 관리하고 하드코딩을 방지합니다.
- 인증 상태에 따른 Protected Route / Public Route를 분리합니다.

## 📐 라우팅 구조 (예시)

```
/                       → 홈 (로그인 여부에 따라 리다이렉트)
/login                  → 로그인 페이지
/signup                 → 회원가입 페이지

/dashboard              → 대시보드 (Protected)
/employees              → 사원 목록 (Protected)
/employees/:id          → 사원 상세 (Protected)
/system                 → 시스템 관리 (Protected)
/settings               → 설정 (Protected)
```

> ⚠️ 위 구조는 초안이며, 실제 기획에 따라 수정될 수 있습니다.

## ✅ 작업 내용

- [ ] `src/constants/routes.ts` — `ROUTES` 상수 정의
- [ ] `src/router/index.tsx` — `createBrowserRouter` 라우터 설정
- [ ] `src/router/ProtectedRoute.tsx` — 인증 보호 라우트 컴포넌트 구현
- [ ] `src/router/PublicRoute.tsx` — 비로그인 전용 라우트 컴포넌트 구현 (선택)
- [ ] `src/main.tsx` — `RouterProvider` 연결
- [ ] 각 도메인 `XxxPage.tsx` 페이지 컴포넌트 Placeholder 생성
- [ ] 404 NotFoundPage 구현

## 📁 파일 구조

```
src/
├── constants/
│   └── routes.ts          # ROUTES 경로 상수 (중앙 관리)
├── router/
│   ├── index.tsx           # createBrowserRouter 라우터 정의
│   ├── ProtectedRoute.tsx  # 로그인 필요 라우트 가드
│   └── PublicRoute.tsx     # 비로그인 전용 라우트 가드
└── pages/
    ├── {도메인}/
    │   └── XxxPage.tsx
    └── error/
        └── NotFoundPage.tsx
```

## 🔗 관련 이슈

- Related to #

## 📌 비고

- 경로 상수는 반드시 `src/constants/routes.ts`의 `ROUTES` 객체를 사용합니다. (하드코딩 금지)
- 페이지 컴포넌트는 `pages/{도메인}/XxxPage.tsx` 구조를 따릅니다.
- 인증 상태는 `Zustand` 스토어(`src/stores/authStore.ts`)에서 관리합니다.
