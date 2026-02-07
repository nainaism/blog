import type { APIContext, GetStaticPaths } from 'astro'

import { getBlogCollection, sortMDByDate } from 'astro-pure/server'

import { generateOgImage } from '@/lib/og-image'

export const prerender = true

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = sortMDByDate(await getBlogCollection())
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { title: post.data.title },
  }))
}

export async function GET({ props }: APIContext) {
  const png = await generateOgImage(props.title, 'Nainaism')
  return new Response(png as BodyInit, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
