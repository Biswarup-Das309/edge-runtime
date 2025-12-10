import { BookHeartIcon } from 'lucide-react'

export const Logo = () => (
  <div className='flex items-center gap-2'>
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 172 158'
      width={20}
      height={20}
      fill='none'
    >
      <path d='m96.71 0 43.999 120-50-80-50 10 56-50Z' fill='currentColor' />
      <path
        d='M171.083 148.881 40.209 120h100.5l14-40 16.374 68.881Z'
        fill='currentColor'
      />
      <path
        d='M0 129.54 90.71 40l-50 80 26.868 37.112L0 129.54Z'
        fill='currentColor'
      />
    </svg>
    <p className='font-semibold text-xl tracking-tight'>Edge Runtime</p>
  </div>
)

export const github = {
  owner: 'vercel',
  repo: 'edge-runtime',
}

export const nav = []

export const suggestions = [
  'What is Edge Runtime?',
  'What are the available APIs?',
  'What packages are available?',
  'How do I use the Edge Runtime?',
]

export const title = 'Edge Runtime Documentation'

export const prompt =
  'You are a helpful assistant specializing in answering questions about Edge Runtime, which is designed to help framework authors adopt edge computing and provide open-source tooling built on Web standards. It’s designed to be integrated into frameworks (like Next.js) and not for usage in application code.'

export const translations = {
  en: {
    displayName: 'English',
  },
}

export const basePath: string | undefined = undefined
