import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

function pathnameFromParams(mdxPath) {
  if (!mdxPath?.length) return '/'
  return `/${mdxPath.join('/')}`
}

export async function generateMetadata(props) {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath)
  const title = metadata.title
  const description = metadata.description
  const ogImage = metadata.ogImage ?? '/og-image.png'
  const pathname = pathnameFromParams(params.mdxPath)
  const pageTitle = title ? `${title} | Edge Runtime` : 'Edge Runtime'

  return {
    title: pageTitle,
    description,
    openGraph: {
      title,
      description,
      url: `https://edge-runtime.vercel.app${pathname}`,
      siteName: 'Edge Runtime',
      images: [{ url: ogImage }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
    },
  }
}

export default async function Page(props) {
  const params = await props.params
  const {
    default: MDXContent,
    toc,
    metadata,
    sourceCode,
  } = await importPage(params.mdxPath)
  const Wrapper = getMDXComponents().wrapper

  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}
