"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

type MediumItem = {
  title: string
  link: string
  pubDate: string
  description: string
  thumbnail?: string
}

type MediumResponse = {
  items: MediumItem[]
}

type BlogPost = {
  title: string
  link: string
  pubDate: string
  contentSnippet: string
  thumbnail?: string
}

export default function BlogContent() {
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    async function fetchMediumFeed() {
      try {
        const res = await fetch(
          "https://api.rss2json.com/v1/api.json?rss_url=https://blog.pkdiv.com/rss.xml"
        )

        const data: MediumResponse = await res.json()

        const items: BlogPost[] = data.items.map((item) => ({
          title: item.title,
          link: item.link,
          pubDate: new Date(item.pubDate).toDateString(),
          contentSnippet:
            item.description.replace(/<[^>]+>/g, "").slice(0, 180) + "...",
          thumbnail: item.thumbnail
        }))

        setPosts(items)
      } catch (err) {
        console.error("Error fetching Medium feed:", err)
      }
    }

    fetchMediumFeed()
  }, [])

  return (
    <div className="relative min-h-screen px-8 py-12 bg-white overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full 
                      bg-gradient-to-br from-pink-500 via-purple-500 to-fuchsia-400 
                      opacity-40 blur-[180px]"></div>


      <div className="absolute -top-20 -right-40 w-[450px] h-[450px] rounded-full 
                      bg-gradient-to-bl from-cyan-400 via-sky-500 to-blue-500 
                      opacity-40 blur-[180px]"></div>


      <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full 
                      bg-gradient-to-tr from-yellow-400 via-orange-500 to-amber-400 
                      opacity-40 blur-[200px]"></div>


      <div className="absolute -bottom-40 -right-40 w-[550px] h-[550px] rounded-full 
                      bg-gradient-to-tl from-green-400 via-emerald-500 to-cyan-400 
                      opacity-35 blur-[220px]"></div>


      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full 
                      bg-gradient-to-r from-pink-300 via-purple-300 to-yellow-300 
                      opacity-20 blur-[200px]"></div>


      <div className="w-full flex justify-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800">Blog</h2>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length > 0 ? (
          posts.map((post, idx) => (
            <article
              key={idx}
              className="bg-white/90 backdrop-blur-sm shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition"
            >
              {post.thumbnail && (
                <div className="relative w-full h-40 mb-4">
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover rounded-md"
                    unoptimized
                  />
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500 mb-2">{post.pubDate}</p>
              <p className="text-gray-700">{post.contentSnippet}</p>
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-blue-600 font-medium hover:underline"
              >
                Read More →
              </a>
            </article>
          ))
        ) : (
          <p className="text-gray-500">Loading articles...</p>
        )}
      </div>
    </div>
  )
}
