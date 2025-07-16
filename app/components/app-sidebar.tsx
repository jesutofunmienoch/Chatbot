"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Search,
  Library,
  User,
  Settings,
  MessageSquarePlus,
  LogOut,
  MoreHorizontal,
} from "lucide-react"
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useUser,
} from "@clerk/nextjs"
import Image from "next/image"

const items = [
  { title: "New Chat", url: "#", icon: MessageSquarePlus },
  { title: "Search", url: "#", icon: Search },
  { title: "Library", url: "#", icon: Library },
]

const others = [
  { title: "Chat History", url: "#", icon: MessageSquarePlus },
  { title: "Profile", url: "#", icon: User },
  { title: "Settings", url: "#", icon: Settings },
]

const chats = [
  { title: "Who is elon musk?", url: "#", icon: MoreHorizontal  },
  { title: "What is AI? and how does it work?", url: "#", icon: MoreHorizontal  },
  { title: "How does GPT work?", url: "#", icon: MoreHorizontal  },
]

export function AppSidebar() {
  const { user } = useUser()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold">ALDRILL</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-4">
                      <item.icon className="w-4 h-4" />
                      <span className="text-base">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Others</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {others.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-4">
                      <item.icon className="w-4 h-4" />
                      <span className="text-base">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

         <SidebarGroup>
          <SidebarGroupLabel>Chats History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-4">
                      <item.icon className="w-4 h-4" />
                      <span className="text-base">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t">
          <SignedIn>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src={user?.imageUrl || "/avatar.png"}
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div className="text-sm">
                  <div className="font-semibold truncate max-w-[140px]">
                    {user?.fullName || "Unnamed User"}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-[140px]">
                    {user?.primaryEmailAddress?.emailAddress}
                  </div>
                </div>
              </div>
              <SignOutButton>
                <button title="Logout">
                  <LogOut className="w-5 h-5 text-gray-600 cursor-pointer hover:text-black" />
                </button>
              </SignOutButton>
            </div>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="w-full px-4 py-2 bg-black text-white rounded-md">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
