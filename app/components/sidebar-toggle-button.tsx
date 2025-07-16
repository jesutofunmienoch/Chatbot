"use client"

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Menu } from "lucide-react"

export function SidebarOpenButton() {
  const { state } = useSidebar()

  if (state !== "collapsed") return null

  return (
    <>
      <SidebarTrigger asChild>
        <button className="fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition">
          <Menu className="w-6 h-6" />
        </button>
      </SidebarTrigger>
    </>
  )
}
