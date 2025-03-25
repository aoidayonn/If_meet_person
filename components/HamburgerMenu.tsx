'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // 外側クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <div className="fixed fixed top-4 left-4 sm:left-24 md:left-56 lg:left-102 z-50" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 text-4xl bg-pink-300 hover:bg-pink-400 text-white  shadow-md transition cursor-pointer"
        aria-label="メニューを開く"
      >
        ☰
      </button>

      {open && (
        <div className="absolute mt-3 w-56 bg-pink-100 shadow-lg rounded-2xl border border-pink-200 overflow-hidden animate-fade-in">
          <Link
            href="/"
            className="block px-5 py-4 hover:bg-pink-200 text-pink-900 font-medium"
            onClick={() => setOpen(false)}
          >
            🏠 ホーム
          </Link>
          <Link
            href="/chat-history"
            className="block px-5 py-4 hover:bg-pink-200 text-pink-900 font-medium"
            onClick={() => setOpen(false)}
          >
            💬 会話履歴
          </Link>
          <Link
            href="/profile"
            className="block px-5 py-4 hover:bg-pink-200 text-pink-900 font-medium"
            onClick={() => setOpen(false)}
          >
            👤 “あの人”を作成
          </Link>
        </div>
      )}
    </div>
  )
}
