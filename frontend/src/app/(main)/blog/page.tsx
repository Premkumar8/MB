"use client";

import React, { useState, useEffect } from "react";
import { Clock, Calendar, User, BookOpen } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  author: string;
  read_time: string;
  category: string;
  image_url: string;
  created_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackPosts: BlogPost[] = [
    {
      id: 1,
      title: "The Art of Backlighting Onyx in Modern Architecture",
      slug: "backlighting-onyx-modern-architecture",
      content: "Onyx has been revered since antiquity. Today, modern interior designers leverage its unique translucent molecular structure. By integrating high-rendering CRI LED light panel diffusers behind bookmatched Emerald Onyx panels, rooms are transformed with an ethereal glow. In this article, we explain the spacing, heat considerations, and color temperature controls required to achieve a flawless backlit slab install...",
      author: "Aurelia Design Studio",
      read_time: "5 min read",
      category: "Design",
      image_url: "/static/seed/blog1.jpg",
      created_at: "2026-07-08T12:00:00Z",
    },
    {
      id: 2,
      title: "Caring for Premium Marble: Myths vs. Realities",
      slug: "caring-for-premium-marble-myths-realities",
      content: "Many homeowners are deterred from installing white marbles like Calacatta or Carrara due to fear of staining and etching. However, sealing technology has advanced exponentially. Standard impregnating sealers form a molecular barrier below the stone surface. In this guide, we bust common marble care myths and detail the proper pH-neutral cleaners that preserve your marble finishes for generations.",
      author: "Alberto Aurelia",
      read_time: "3 min read",
      category: "Care",
      image_url: "/static/seed/blog2.jpg",
      created_at: "2026-07-06T10:00:00Z",
    },
  ];

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${API_URL}/api/blog`);
        if (res.ok) {
          const data = await res.json();
          // Map local paths to absolute backend URL if needed
          const processed = data.map((item: any) => ({
            ...item,
            image_url: item.image_url.startsWith("/static") ? `${API_URL}${item.image_url}` : item.image_url,
          }));
          setPosts(processed.length > 0 ? processed : fallbackPosts);
        } else {
          setPosts(fallbackPosts);
        }
      } catch (err) {
        setPosts(fallbackPosts);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 space-y-12 page-fade-in">
      {/* Header */}
      <div className="space-y-4 text-center">
        <span className="text-[10px] tracking-[0.3em] text-gold-500 uppercase font-bold">
          Stone Journal
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-wide">
          Architectural <span className="font-bold text-gold-gradient">Perspectives</span>
        </h1>
        <p className="text-xs text-black/50 dark:text-white/40 max-w-xl mx-auto leading-relaxed">
          Explore our curator essays on white-glove marble installations, backlit onyx engineering, and luxury interior design essays.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((n) => (
            <div key={n} className="h-96 shimmer-bg border border-white/5"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="border border-black/5 dark:border-white/5 bg-[#fafafa] dark:bg-[#0c0c0e] hover:border-gold-500/20 transition-all duration-300 flex flex-col group overflow-hidden"
            >
              {/* Image Frame */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#ecebeb] border-b border-black/5 dark:border-white/5">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 bg-gold-500 text-black px-2.5 py-1 text-[8px] uppercase tracking-widest font-bold">
                  {post.category}
                </span>
              </div>

              {/* Copy */}
              <div className="p-8 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-4 text-[10px] text-black/40 dark:text-white/40 uppercase tracking-wider">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.read_time}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5" />
                      <span>{post.author}</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl text-black dark:text-white leading-snug group-hover:text-gold-500 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-xs text-black/60 dark:text-white/60 leading-relaxed line-clamp-3">
                    {post.content}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => alert("Full design journal viewing is restricted in this demo.")}
                    className="text-[10px] uppercase tracking-widest font-bold text-gold-500 hover:text-white transition-colors flex items-center space-x-1 group"
                  >
                    <span>Read Journal Essay</span>
                    <BookOpen className="w-3.5 h-3.5 ml-1 text-gold-500 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
