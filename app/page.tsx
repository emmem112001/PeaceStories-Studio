'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Video, Music, MessageSquare, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">PeaceStories</h1>
          <div className="flex gap-4">
            <Link
              href="/auth/login"
              className="text-slate-300 hover:text-white transition"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 bg-indigo-600/20 border border-indigo-600 px-4 py-2 rounded-full">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-indigo-300">AI-Powered Creative Platform</span>
          </div>
        </div>

        <h2 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Create Professional <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">Videos & Content</span>
        </h2>

        <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
          Generate stunning images, videos, music, voiceovers, and scripts with cutting-edge AI. All in one platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/auth/signup"
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 px-8 rounded-lg transition flex items-center justify-center gap-2"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/auth/login"
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-8 rounded-lg transition"
          >
            Login
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-8 text-left hover:border-indigo-500 transition">
            <Video className="w-12 h-12 text-indigo-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">AI Video Generation</h3>
            <p className="text-slate-400">
              Generate videos from text prompts, images, or scripts. Support for camera movements and animations.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-8 text-left hover:border-indigo-500 transition">
            <Music className="w-12 h-12 text-pink-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">AI Music & Voice</h3>
            <p className="text-slate-400">
              Create background music and realistic voiceovers in multiple languages and voices.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-8 text-left hover:border-indigo-500 transition">
            <MessageSquare className="w-12 h-12 text-amber-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">AI Scripts & Stories</h3>
            <p className="text-slate-400">
              Generate professional scripts, stories, and character descriptions powered by LLMs.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-indigo-600 to-pink-600 rounded-2xl p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Create?</h3>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Join thousands of creators using PeaceStories to produce professional content with AI.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-white text-indigo-600 font-semibold py-3 px-8 rounded-lg hover:bg-slate-100 transition"
          >
            Start Creating Now
          </Link>
        </div>
      </section>
    </div>
  );
}
