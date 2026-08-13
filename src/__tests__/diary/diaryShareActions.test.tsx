/** @vitest-environment jsdom */

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/assets/icons/loader-1.svg?react', () => ({ default: () => <svg /> }))
vi.mock('@/assets/icons/share/download.svg?react', () => ({ default: () => <svg /> }))
vi.mock('@/assets/icons/share/kakao.svg?react', () => ({ default: () => <svg /> }))

import { DiaryDetailShare } from '@/components/feature/diary/DiaryDetailShare'
import { useDiaryShareActions } from '@/pages/DiaryPage/hooks/useDiaryShareActions'
import {
  createKakaoDiaryShareTemplate,
  loadKakaoJavascriptSdk,
  sendKakaoDefaultShare,
} from '@/services/share/kakao'

const diaryId = '019fd537-93a1-7bbb-8850-af72451ba9ad'
const shareImageUrl = 'https://images.example.com/decision-card.png'
const generatedShareImage = new Blob(['png'], { type: 'image/png' })

function ShareActionHarness() {
  const { actionStates, onShare } = useDiaryShareActions({
    diaryId,
    shareImage: generatedShareImage,
    stockName: '삼성전자',
    direction: 'up',
    isCorrect: true,
    accuracyRate: 73,
    imageState: 'ready',
  })

  return (
    <DiaryDetailShare card={<div>공유 카드</div>} onShare={onShare} actionStates={actionStates} />
  )
}

function getButton(label: string) {
  const button = document.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)
  if (!button) throw new Error(`${label} 버튼을 찾을 수 없습니다.`)
  return button
}

describe('Diary share actions', () => {
  let root: Root
  let container: HTMLDivElement

  beforeEach(() => {
    ;(
      globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    window.Kakao = {
      init: vi.fn(),
      isInitialized: () => true,
      Share: { sendDefault: vi.fn(), uploadImage: vi.fn() },
    }
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: vi.fn(() => 'blob:share'),
    })
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: vi.fn() })
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    delete window.Kakao
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  const renderHarness = () => {
    act(() => {
      root.render(<ShareActionHarness />)
    })
  }

  it('downloads a predictable PNG and releases the Object URL', async () => {
    vi.useFakeTimers()
    let downloadedFilename = ''
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function click(
      this: HTMLAnchorElement,
    ) {
      downloadedFilename = this.download
    })
    renderHarness()

    try {
      await act(async () => {
        getButton('이미지 저장').click()
        await Promise.resolve()
      })

      expect(downloadedFilename).toBe('brifo-decision-card-삼성전자.png')
      expect(URL.createObjectURL).toHaveBeenCalledOnce()
      expect(URL.revokeObjectURL).not.toHaveBeenCalled()
      act(() => vi.advanceTimersByTime(1_000))
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:share')
    } finally {
      vi.useRealTimers()
    }
  })

  it('uploads the generated PNG once and sends its Kakao URL through KakaoTalk', async () => {
    vi.stubEnv('VITE_KAKAO_JAVASCRIPT_KEY', 'javascript-key')
    vi.stubEnv('VITE_KAKAO_SHARE_WEB_URL', 'https://brifo.example.com')
    const sendDefault = vi.fn<() => Promise<void>>().mockResolvedValue()
    const uploadImage = vi.fn().mockResolvedValue({
      infos: { original: { url: 'https://k.kakaocdn.net/decision-card.png' } },
    })
    window.Kakao = {
      init: vi.fn(),
      isInitialized: () => true,
      Share: { sendDefault, uploadImage },
    }
    renderHarness()

    await vi.waitFor(() => expect(uploadImage).toHaveBeenCalledOnce())
    expect(getButton('카카오톡으로 공유').disabled).toBe(false)

    await act(async () => {
      getButton('카카오톡으로 공유').click()
    })

    const diaryUrl = 'https://brifo.example.com/'
    expect(sendDefault).toHaveBeenCalledWith(
      createKakaoDiaryShareTemplate({
        stockName: '삼성전자',
        direction: 'up',
        isCorrect: true,
        accuracyRate: 73,
        shareImageUrl: 'https://k.kakaocdn.net/decision-card.png',
        diaryUrl,
      }),
    )
    expect(uploadImage).toHaveBeenCalledOnce()
  })

  it('enables Kakao share after a delayed image upload finishes', async () => {
    vi.stubEnv('VITE_KAKAO_JAVASCRIPT_KEY', 'javascript-key')
    vi.stubEnv('VITE_KAKAO_SHARE_WEB_URL', 'https://brifo.example.com')
    let resolveUpload: (value: { infos: { original: { url: string } } }) => void = () => undefined
    const uploadImage = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveUpload = resolve
        }),
    )
    window.Kakao = {
      init: vi.fn(),
      isInitialized: () => true,
      Share: { sendDefault: vi.fn(), uploadImage },
    }
    renderHarness()

    await vi.waitFor(() => expect(uploadImage).toHaveBeenCalledOnce())
    expect(getButton('카카오톡으로 공유').disabled).toBe(true)

    await act(async () => {
      resolveUpload({ infos: { original: { url: 'https://k.kakaocdn.net/decision-card.png' } } })
    })

    await vi.waitFor(() => expect(getButton('카카오톡으로 공유').disabled).toBe(false))
  })
})

describe('Kakao JavaScript SDK setup', () => {
  afterEach(() => {
    document.getElementById('kakao-javascript-sdk')?.remove()
    delete window.Kakao
  })

  it('initializes an already loaded SDK with a JavaScript key', async () => {
    let initialized = false
    const init = vi.fn(() => {
      initialized = true
    })
    const sendDefault = vi.fn<() => Promise<void>>().mockResolvedValue()
    window.Kakao = {
      init,
      isInitialized: () => initialized,
      Share: { sendDefault },
    }

    await expect(loadKakaoJavascriptSdk('javascript-key')).resolves.toBe(window.Kakao)
    expect(init).toHaveBeenCalledWith('javascript-key')

    const template = { objectType: 'text', text: 'test' }
    await sendKakaoDefaultShare(template, 'javascript-key')
    expect(sendDefault).toHaveBeenCalledWith(template)
  })

  it('replaces a non-script element with a new SDK script', async () => {
    const staleElement = document.createElement('div')
    staleElement.id = 'kakao-javascript-sdk'
    document.head.append(staleElement)

    const sdkLoad = loadKakaoJavascriptSdk('javascript-key')
    const script = document.getElementById('kakao-javascript-sdk')
    expect(script).toBeInstanceOf(HTMLScriptElement)
    expect(staleElement.isConnected).toBe(false)

    let initialized = false
    window.Kakao = {
      init: () => {
        initialized = true
      },
      isInitialized: () => initialized,
      Share: { sendDefault: vi.fn() },
    }
    script?.dispatchEvent(new Event('load'))

    await expect(sdkLoad).resolves.toBe(window.Kakao)
  })

  it('invokes KakaoTalk sharing synchronously while the click is still active', () => {
    const sendDefault = vi.fn()
    window.Kakao = {
      init: vi.fn(),
      isInitialized: () => true,
      Share: { sendDefault },
    }

    sendKakaoDefaultShare({ objectType: 'feed' }, 'javascript-key')

    expect(sendDefault).toHaveBeenCalledOnce()
  })

  it('creates a winning feed template with the decision-card image and a BRIFO landing link', () => {
    const template = createKakaoDiaryShareTemplate({
      stockName: '삼성전자',
      direction: 'up',
      isCorrect: true,
      accuracyRate: 73,
      shareImageUrl,
      diaryUrl: 'https://brifo.example.com/',
    })

    expect(template).toEqual({
      objectType: 'feed',
      content: {
        title: '나 어쩌면 주식 고수일지도?',
        description: '삼성전자 UP 찍고 73% 적중! 나보다 적중률 높을 자신 있으면 들어와',
        imageUrl: shareImageUrl,
        link: {
          mobileWebUrl: 'https://brifo.example.com/',
          webUrl: 'https://brifo.example.com/',
        },
      },
      buttons: [
        {
          title: '적중률 대결',
          link: {
            mobileWebUrl: 'https://brifo.example.com/',
            webUrl: 'https://brifo.example.com/',
          },
        },
      ],
    })
  })

  it.each([
    {
      direction: 'down' as const,
      isCorrect: false,
      expected: {
        title: '영차영차... 개미는 오늘도 힘들다',
        description: '삼성전자 DOWN 찍었는데 64%네 내일은 잘해보자 아자스!',
        buttonTitle: '너도 해볼래?',
      },
    },
    {
      direction: 'neutral' as const,
      isCorrect: false,
      expected: {
        title: '오늘은 순방했다^^',
        description: '삼성전자 관망 찍었다 이게 바로 리스크 관리다',
        buttonTitle: '나도 해보기',
      },
    },
  ])('creates the configured message for $direction', ({ direction, isCorrect, expected }) => {
    const template = createKakaoDiaryShareTemplate({
      stockName: '삼성전자',
      direction,
      isCorrect,
      accuracyRate: 64,
      shareImageUrl,
      diaryUrl: 'https://brifo.example.com/',
    })

    const { buttonTitle, ...content } = expected
    expect(template.content).toMatchObject(content)
    expect(template.buttons[0]).toMatchObject({ title: buttonTitle })
  })

  it('reports a missing JavaScript key instead of using the OAuth client ID', async () => {
    await expect(loadKakaoJavascriptSdk('')).rejects.toMatchObject({
      code: 'MISSING_JAVASCRIPT_KEY',
    })
  })

  it('reports an SDK script loading failure', async () => {
    const loading = loadKakaoJavascriptSdk('javascript-key')
    const script = document.getElementById('kakao-javascript-sdk')
    if (!(script instanceof HTMLScriptElement))
      throw new Error('Kakao SDK script was not appended.')

    script.dispatchEvent(new Event('error'))

    await expect(loading).rejects.toMatchObject({ code: 'LOAD_FAILED' })
  })
})
