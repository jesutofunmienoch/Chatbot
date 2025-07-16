"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

import { Loader2, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { useUser, SignInButton } from "@clerk/nextjs"

export function Navigation() {
  const [loading, setLoading] = useState(false)
  const { theme, setTheme } = useTheme()
  const { isSignedIn } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleLinkClick = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[100] bg-white/80 dark:bg-black/80 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-black dark:text-white" />
        </div>
      )}

<div
  className="
    w-full
    max-w-full
    px-[2px] sm:px-[5px] md:px-[30px] py-1
    md:w-[890px]
    mx-auto
    flex flex-wrap items-center justify-between
    gap-y-2 sm:gap-y-0
  "
>




        {/* Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList className="flex flex-wrap gap-4">
            <NavigationMenuItem>
              {isSignedIn ? (
                <>
                  <NavigationMenuTrigger>AI Models</NavigationMenuTrigger>
                  <NavigationMenuContent className="p-4 w-64">
                    <ul className="flex flex-col gap-2">
                      {[
                        { name: "Home", href: "/" },
                        { name: "ChatGPT", href: "/chatgpt" },
                        { name: "Grok AI", href: "/grok" },
                        { name: "DeepSeek", href: "/deepseek" },
                        { name: "Gemini", href: "/gemini" },
                      ].map((item) => (
                        <li key={item.name}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={item.href}
                              className="flex items-center gap-2"
                              onClick={handleLinkClick}
                            >
                              {item.name}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <SignInButton mode="modal">
                  <NavigationMenuTrigger
                    disabled
                    className="opacity-50 cursor-not-allowed"
                  >
                    AI Models (Sign in required)
                  </NavigationMenuTrigger>
                </SignInButton>
              )}
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/preview">Preview</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/code">Code</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>

          <NavigationMenuIndicator />
          <NavigationMenuViewport />
        </NavigationMenu>

        {/* Theme Toggle Button */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md border border-border bg-muted text-foreground transition"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </>
  )
}
