# 공통 API hook

팀의 도메인 hook은 Orval generated 함수, generated Zod Schema, 인자만 전달합니다.
Axios 인스턴스 주입, timeout, AbortSignal 전달, HTTP/네트워크/계약 오류 정규화는
공통 hook이 처리합니다.

데이터가 필요한 Query는 `requiredResult`로 성공 wrapper의 `result`를 확인하고,
`map`에서 Domain/UI 모델로 변환합니다. `map`은 `queryFn` 안에서 실행되므로 캐시에는
변환된 모델만 저장됩니다.

```ts
export function useAgentListQuery() {
  return useApiQuery({
    queryKey: agentQueryKeys.list(),
    operation: getAgents,
    endpoint: 'getAgents',
    args: [],
    responseSchema: ApiResponseGetAgentsResponse,
    response: 'requiredResult',
    map: (result) => result.items.map(mapAgentListItem),
  })
}
```

Mutation은 variables를 generated 함수의 인자 tuple로 바꾸는 `getArgs`를 사용합니다.
공통 기본값에 따라 자동 retry는 하지 않습니다.

```ts
export function useUpdateProfileMutation() {
  return useApiMutation({
    operation: updateUserProfile,
    endpoint: 'updateUserProfile',
    responseSchema: ApiResponse,
    getArgs: (input: UpdateUserProfileRequest) => [input],
  })
}
```

`responseSchema`는 같은 operation의 generated Zod Schema를 사용합니다. Orval의
`axios-functions` client는 응답 body를 반환하지만 Zod parse를 자동 삽입하지 않으므로,
공통 hook 경계가 이 Schema로 성공 응답을 검증합니다.

`endpoint`에는 OpenAPI operationId를 명시합니다. 함수의 `name`은 production minify 후
보장되지 않으므로 오류와 관측성 라벨에 사용하지 않습니다. `map`에서 발생한 예외는
`MAPPING_ERROR` contract `ApiError`로 정규화되지만, Mapper는 부수효과 없이 결정적으로
동작하도록 작성합니다.

Cursor 기반 목록은 `useApiInfiniteQuery`의 `getArgs`에서 `pageParam`을 request DTO로
변환합니다. Query key, mapper, stale time, enabled, 캐시 무효화는 각 도메인 hook이
소유합니다.
