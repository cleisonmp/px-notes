import { useRouter } from 'next/router'
import Head from 'next/head'

type ogType =
  | 'activity'
  | 'actor'
  | 'album'
  | 'article'
  | 'athlete'
  | 'author'
  | 'band'
  | 'bar'
  | 'blog'
  | 'book'
  | 'cafe'
  | 'cause'
  | 'city'
  | 'company'
  | 'country'
  | 'director'
  | 'drink'
  | 'food'
  | 'game'
  | 'government'
  | 'hotel'
  | 'landmark'
  | 'movie'
  | 'musician'
  | 'non_profit'
  | 'politician'
  | 'product'
  | 'public_figure'
  | 'restaurant'
  | 'school'
  | 'song'
  | 'sport'
  | 'sports_league'
  | 'sports_team'
  | 'state_province'
  | 'tv_show'
  | 'university'
  | 'website'

interface SeoProps {
  title?: string
  description?: string
  image?: string
  type?: ogType
  date?: string
  urlBasePath?: string
  customRobots?: string
  ogSiteName?: string

  twitterCardType?: 'summary' | 'summary_large_image' | 'app' | 'player'
  twitterUsername?: string
  twitterImage?: string

  isCanonical?: boolean
  faviconHref?: string
}

const Seo = ({
  // TODO: EDIT DEFAULTS BEFORE PUBLISHING
  title = 'Project Default SEO Title',
  description = 'Project default seo description',
  image = 'default-seo-image',
  type = 'website',
  date,
  urlBasePath = 'https://projectdefaulturl.com',
  customRobots = 'follow,index',
  ogSiteName = 'Project Name',

  twitterCardType = 'summary',
  twitterImage,
  twitterUsername,

  isCanonical = true,
  faviconHref = '/favicon.ico',
}: SeoProps) => {
  const router = useRouter()

  return (
    <Head>
      <title>{title}</title>
      <link rel='icon' href={faviconHref} />

      <meta name='robots' content={customRobots} />
      <meta name='description' content={description} />
      {isCanonical && (
        <link rel='canonical' href={`${urlBasePath}${router.asPath}`} />
      )}

      <meta property='og:url' content={`${urlBasePath}${router.asPath}`} />
      <meta property='og:type' content={type} />
      <meta property='og:site_name' content={ogSiteName} />
      <meta property='og:description' content={description} />
      <meta property='og:title' content={title} />
      <meta property='og:image' content={image} />

      <meta property='twitter:url' content={`${urlBasePath}${router.asPath}`} />
      <meta property='twitter:title' content={title} />
      <meta property='twitter:description' content={description} />
      <meta property='twitter:image' content={twitterImage ?? image} />
      <meta property='twitter:card' content={twitterCardType} />

      {twitterUsername && (
        <meta property='twitter:site' content={twitterUsername} />
      )}

      {date && <meta property='article:published_time' content={date} />}
    </Head>
  )
}

export { Seo }
