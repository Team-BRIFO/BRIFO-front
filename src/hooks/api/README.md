# 공통 API hook (`useApi`)

화면·도메인 hook을 만들 때는 axios를 직접 호출하지 말고 이 공통 hook을 사용합니다.  
Orval이 생성한 요청 함수와 Zod Schema만 연결하면 인증·timeout·AbortSignal·오류 정규화·응답 검증은 공통 계층이 알아서 처리합니다.

---

## 한눈에 보기

| 구분            | 팀이 작성                                      | 공통 hook이 처리                        |
| --------------- | ---------------------------------------------- | --------------------------------------- |
| 무엇을 호출할지 | generated `operation` + `args` / `getArgs`     | Axios 호출, token, timeout, AbortSignal |
| 응답 검증       | generated `responseSchema`                     | Zod parse, `ApiError` 정규화            |
| 화면 모델       | `map` (Mapper)                                 | Query Cache에는 `map` 결과만 저장       |
| 캐시 정책       | `queryKey`, `staleTime`, `enabled`, invalidate | Query/Mutation 기본 retry 정책          |

---

## 파일은 어디서 가져오나

OpenAPI → Orval 생성물 기준입니다. **generated 파일은 직접 수정하지 마세요.**

```text
src/api/generated/
├── endpoints/{tag}-controller/{tag}-controller.ts   ← 요청 함수 (operation)
└── schemas/
    ├── {tag}-controller/*.zod.ts                    ← 요청/응답 Zod Schema
    └── index.ts                                     ← 스키마 re-export

src/hooks/api/useApi.ts                              ← useApiQuery / useApiMutation / …
src/hooks/queries/{domain}/…QueryKeys.ts             ← query key
src/mappers/{domain}Mapper.ts                        ← DTO → Domain/UI 모델
```

### 1) 요청 함수 (`operation`)

예: Diary

- 경로: `src/api/generated/endpoints/diary-controller/diary-controller.ts`
- export 예: `getDiaryDetail`, `getDiaries`, `createDiaryShareImage`, …

```ts
import { getDiaryDetail } from '@/api/generated/endpoints/diary-controller/diary-controller'
```

함수 시그니처의 **맨 뒤 `options?(AxiosRequestConfig)`는 넘기지 않습니다.**  
`signal`·`timeout`은 공통 hook이 내부에서 붙여 주므로, `args`·`getArgs`에는 path·query·body 인자만 넣으면 됩니다.

### 2) 응답 Zod Schema (`responseSchema`)

해당 operation의 **성공 wrapper** Schema를 씁니다. 보통 이름이 `ApiResponse…`로 시작합니다.

- 경로: `src/api/generated/schemas/diary-controller/`
- 또는 barrel: `@/api/generated/schemas` / `@/api/generated/schemas/diary-controller`

| operation               | responseSchema                             |
| ----------------------- | ------------------------------------------ |
| `getDiaryDetail`        | `ApiResponseGetDiaryDetailResponse`        |
| `createDiaryShareImage` | `ApiResponseCreateDiaryShareImageResponse` |

```ts
import { ApiResponseGetDiaryDetailResponse } from '@/api/generated/schemas/diary-controller'
```

Orval `axios-functions`는 응답 body만 돌려줄 뿐 Zod `.parse()`를 자동으로 넣어 주지 않습니다.  
그래서 **공통 hook에 Schema를 반드시 함께 넘겨야 합니다.**

### 3) `endpoint` (OpenAPI operationId)

오류 로그와 관측(observability)에 쓰는 라벨입니다. **generated 함수 이름(= operationId)을 문자열 그대로** 적습니다.

```ts
endpoint: 'getDiaryDetail' // ✅
endpoint: operation.name // ❌ production minify 후 깨질 수 있음
```

Swagger/OpenAPI의 `operationId`와 동일한 값입니다.

### 4) query key / mapper

- query key: `src/hooks/queries/{domain}/`
- mapper: `src/mappers/{domain}Mapper.ts`  
  Page·Component는 generated DTO나 성공 wrapper를 직접 다루지 않고 Domain/UI 모델만 받습니다.

---

## 도메인 hook 작성 순서

1. `endpoints/…-controller.ts`에서 호출할 함수를 고릅니다.
2. `schemas/…`에서 짝이 되는 `ApiResponse…` Schema를 찾습니다.
3. `endpoint`에 operationId 문자열을 적습니다.
4. 조회·목록이면 `useApiQuery`·`useApiInfiniteQuery`, 쓰기면 `useApiMutation`을 씁니다.
5. 응답 데이터가 필요하면 `response: 'requiredResult'`에 `map`을 더합니다.
6. `queryKey`와 invalidate는 도메인 hook이 직접 관리합니다.

---

## 옵션 빠른 참고

| 옵션                          | 설명                                                                      |
| ----------------------------- | ------------------------------------------------------------------------- |
| `operation`                   | generated 요청 함수                                                       |
| `endpoint`                    | operationId 문자열 (필수)                                                 |
| `args`                        | Query용. generated 함수 인자 tuple (Axios config 제외)                    |
| `getArgs`                     | Mutation/Infinite용. variables 또는 pageParam → 인자 tuple                |
| `responseSchema`              | 성공 응답 Zod Schema                                                      |
| `response`                    | `'body'`(기본, wrapper 전체) / `'requiredResult'`(`result` 필수 unpack)   |
| `map`                         | Domain/UI 변환. `queryFn`/`mutationFn` 안에서 실행 → 캐시에는 변환 결과만 |
| `queryKey`                    | Query only. 도메인 query key factory 사용                                 |
| `requestConfig` / `timeoutMs` | 필요 시만. 기본 timeout은 Axios instance(15s)                             |

`map`에서 발생한 예외는 `MAPPING_ERROR` contract `ApiError`로 감싸집니다.  
그러니 Mapper는 부수효과 없이, 같은 입력이면 같은 결과가 나오도록 작성하세요.

---

## 예시 1 — Diary GET (`getDiaryDetail`)

`GET /api/diaries/{diaryId}`

필요한 것:

- operation: `getDiaryDetail`
- schema: `ApiResponseGetDiaryDetailResponse`
- endpoint: `'getDiaryDetail'`
- args: `[diaryId]`

```ts
import { getDiaryDetail } from '@/api/generated/endpoints/diary-controller/diary-controller'
import { ApiResponseGetDiaryDetailResponse } from '@/api/generated/schemas/diary-controller'
import { useApiQuery } from '@/hooks/api'
import { diaryQueryKeys } from '@/hooks/queries/diary/diaryQueryKeys'
import { mapDiaryDetail } from '@/mappers/diaryMapper'

export function useDiaryDetailQuery(diaryId: string | null) {
  return useApiQuery({
    queryKey: diaryQueryKeys.detail(diaryId ?? ''),
    operation: getDiaryDetail,
    endpoint: 'getDiaryDetail',
    args: [diaryId ?? ''],
    responseSchema: ApiResponseGetDiaryDetailResponse,
    response: 'requiredResult',
    map: (result) => mapDiaryDetail(result),
    enabled: Boolean(diaryId),
    staleTime: 0,
  })
}
```

- `response: 'requiredResult'`이므로 wrapper에 `result`가 없으면 contract 오류가 납니다.
- `map`을 거친 뒤 캐시에 저장되는 타입은 Domain `DiaryDetail`입니다.

---

## 예시 2 — Diary POST (`createDiaryShareImage`)

`POST /api/diaries/{diaryId}/share-images`

필요한 것:

- operation: `createDiaryShareImage`
- schema: `ApiResponseCreateDiaryShareImageResponse`
- endpoint: `'createDiaryShareImage'`
- getArgs: `(diaryId) => [diaryId]`

```ts
import { useQueryClient } from '@tanstack/react-query'

import { createDiaryShareImage } from '@/api/generated/endpoints/diary-controller/diary-controller'
import { ApiResponseCreateDiaryShareImageResponse } from '@/api/generated/schemas/diary-controller'
import { useApiMutation } from '@/hooks/api'
import { diaryQueryKeys } from '@/hooks/queries/diary/diaryQueryKeys'
import { mapDiaryShareImage } from '@/mappers/diaryMapper'
import type { DiaryDetail } from '@/types/domain/diary'

export function useCreateDiaryShareImageMutation() {
  const queryClient = useQueryClient()

  return useApiMutation({
    operation: createDiaryShareImage,
    endpoint: 'createDiaryShareImage',
    responseSchema: ApiResponseCreateDiaryShareImageResponse,
    response: 'requiredResult',
    getArgs: (diaryId: string) => [diaryId],
    map: (result) => mapDiaryShareImage(result),
    onSuccess: (shareImage, diaryId) => {
      queryClient.setQueryData<DiaryDetail>(diaryQueryKeys.detail(diaryId), (previous) =>
        previous ? { ...previous, shareImageUrl: shareImage.shareImageUrl } : previous,
      )
    },
  })
}
```

Mutation은 공통 기본값에 따라 **자동으로 retry하지 않습니다.**  
캐시 갱신·무효화(`invalidateQueries`·`setQueryData`)는 도메인 hook의 `onSuccess` 등에서 처리합니다.

---

## Infinite Query (참고)

Cursor 기반 목록은 `useApiInfiniteQuery`를 쓰고, `getArgs(context)`에서 `pageParam`을 request DTO로 바꿔 줍니다.

```ts
getArgs: ({ pageParam }) => [{ request: { cursor: pageParam ?? undefined, size } }],
```

`getDiaries`처럼 query DTO가 `params.request`로 감싸여 있으면, 인자를 generated `GetDiariesParams` 형태에 그대로 맞춰 줍니다.

---

## 하지 말 것

- 컴포넌트·페이지에서 axios나 generated 함수를 직접 호출하기
- generated 파일을 수동으로 고치기
- `endpoint`에 임의의 문자열이나 `operation.name`을 넣기
- Query Cache에 raw wrapper·DTO를 그대로 넣고 화면에서 unpack하기
- Mapper 안에서 API를 다시 호출하거나 토큰을 조작하는 등의 부수효과

generated 파일을 새로 만들어야 하면:

```bash
pnpm api:generate
pnpm api:generate:check
```
