import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { Inter } from 'next/font/google'
import '../styles.css'

const inter = Inter({ subsets: ['latin'], display: 'optional' })

export const metadata = {
  metadataBase: new URL('https://edge-runtime.vercel.app'),
}

export default async function RootLayout({ children }) {
  const pageMap = await getPageMap()

  return (
    <html
      lang='en'
      dir='ltr'
      suppressHydrationWarning
      className={inter.className}
    >
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link rel='icon' href='/logo.svg' type='image/svg+xml' />
      </Head>
      <body>
        <Layout
          navbar={
            <Navbar
              projectLink='https://github.com/vercel/edge-runtime'
              logo={
                <>
                  <img
                    width={24}
                    height={24}
                    src='/logo.svg'
                    alt='Edge Runtime logo'
                    className='dark:hidden'
                  />
                  <img
                    width={24}
                    height={24}
                    src='/logo-dark.svg'
                    alt=''
                    className='hidden dark:block'
                  />
                  <span className='w-full font-bold pl-2'>Edge Runtime</span>
                </>
              }
            />
          }
          pageMap={pageMap}
          docsRepositoryBase='https://github.com/vercel/edge-runtime/blob/main/docs'
          editLink='Edit this page on GitHub'
          feedback={{ content: 'Question? Give us feedback →' }}
          toc={{ float: true }}
          footer={<Footer />}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
