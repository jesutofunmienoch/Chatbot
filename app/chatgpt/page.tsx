"use client"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import {
  MessageSquareText,
  ArrowUp,
  Square,
  Plus,
  Settings,
  Mic,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Volume2,
} from "lucide-react"

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"

const FormSchema = z.object({
  bio: z
    .string()
    .min(1, { message: "Please type your question." })
    .max(2000, { message: "Message must not be longer than 2000 characters." }),
})

export default function TextareaForm() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string; timestamp: string }[]>([])
  const [typing, setTyping] = useState("")
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [typingDone, setTypingDone] = useState(true)
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const messageContainerRef = useRef<HTMLDivElement | null>(null)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { bio: "" },
  })

  const stopTyping = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current)
      typingIntervalRef.current = null
      if (typing.trim()) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: typing,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ])
      }
      setTyping("")
      setTypingDone(true)
    }
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const userMessage = data.bio.trim()
    if (!userMessage) return

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages((prev) => [...prev, { role: "user", content: userMessage, timestamp }])
    form.reset()
    setTypingDone(false)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      })

      const result = await res.json()
      const reply = result.reply?.trim()

      if (!reply) {
        toast.error("Empty response from AI.")
        setTypingDone(true)
        return
      }

      let index = 0
      let current = ""
      typingIntervalRef.current = setInterval(() => {
        if (index >= reply.length) {
          clearInterval(typingIntervalRef.current!)
          typingIntervalRef.current = null
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: current.trim(),
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ])
          setTyping("")
          setTypingDone(true)
          return
        }
        current += reply[index]
        setTyping(current)
        index++
      }, 15)
    } catch {
      toast.error("Failed to get AI response.")
      setTypingDone(true)
    }
  }

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopiedId(idx)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const renderMessage = (msg: { role: "user" | "assistant"; content: string; timestamp: string }, idx: number) => {
    const isUser = msg.role === "user"
    const codeBlockRegex = /```(?:\w*\n)?([\s\S]*?)```/g
    const parts = msg.content.split(codeBlockRegex)
    const matches = [...msg.content.matchAll(codeBlockRegex)]

    return (
      <div key={idx} className="w-full flex justify-center">
        <div className="w-full md:w-[80%] max-w-[650px]">
          <div className={`text-sm whitespace-pre-wrap leading-relaxed relative ${
            isUser
              ? "bg-muted dark:bg-gray-700 text-white px-4 py-2 rounded-xl ml-auto max-w-[45%]"
              : "text-white w-full"
          }`}>
            <div className="text-xs text-muted-foreground mb-1">
              {isUser ? "You" : "ChatGPT"} • {msg.timestamp}
            </div>
            {parts.map((part, i) => (
              <div key={i}>
                {part && <p>{part}</p>}
                {matches[i] && (
                  <div className="mt-2 rounded-lg overflow-x-auto">
                    <SyntaxHighlighter
                      language="javascript"
                      style={vscDarkPlus}
                      customStyle={{
                        borderRadius: "10px",
                        padding: "16px",
                        fontSize: "0.875rem",
                      }}
                    >
                      {matches[i][1].trim()}
                    </SyntaxHighlighter>
                  </div>
                )}
              </div>
            ))}
          </div>
          {msg.role === "assistant" && (
            <div className="flex justify-start gap-4 mt-2 text-muted-foreground ml-0 w-[55%]">
              <div className="relative">
                <Copy className="w-4 h-4 cursor-pointer" onClick={() => copyToClipboard(msg.content, idx)} />
                {copiedId === idx && (
                  <span className="absolute -top-6 left-0 text-xs bg-gray-800 text-white px-2 py-1 rounded shadow">Copied</span>
                )}
              </div>
              <ThumbsUp className="w-4 h-4 cursor-pointer" />
              <ThumbsDown className="w-4 h-4 cursor-pointer" />
              <Volume2 className="w-4 h-4 cursor-pointer" />
            </div>
          )}
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight
    }
  }, [messages, typing])

  return (
    <>
      {/* Chat Area */}
      <div className="w-full px-0 md:px-0 flex justify-center">
        <div
          className="w-full md:w-[80%] max-w-[650px] max-h-[70vh] pb-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent dark:scrollbar-thumb-gray-500"
          ref={messageContainerRef}
        >
          <div className="flex flex-col gap-4 pt-6">
            {messages.map(renderMessage)}
            {typing.trim() && (
              <div className={`text-left text-white whitespace-pre-wrap transition-all duration-300 ${typingDone ? "mr-auto max-w-[80%]" : "ml-2 max-w-[76%]"}`}>
                <div className="text-xs text-muted-foreground mb-1">ChatGPT • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                {typing}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div
        className="fixed bottom-0 right-0 w-full px-0 md:px-0 md:w-[80%] flex justify-center bg-background pb-6"
        style={{ zIndex: 50 }}
      >
        <div className="w-full max-w-[650px]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 p-6 rounded-4xl bg-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  form.handleSubmit(onSubmit)()
                }
              }}
            >
              <FormField
                control={form.control}
                name="bio"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <MessageSquareText className="absolute top-4 left-5 text-muted-foreground h-5 w-5" />
                        <button
                          type="button"
                          onClick={typing && !typingDone ? stopTyping : form.handleSubmit(onSubmit)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 bg-black text-white p-1 rounded-full hover:bg-gray-800 transition"
                        >
                          {typing && !typingDone ? <Square className="h-5 w-5" /> : <ArrowUp className="h-5 w-5" />}
                        </button>
                        <Textarea
                          placeholder="  Hello, how can I help you today?"
                          className="max-h-[200px] h-32 resize-y overflow-y-auto pl-3 pr-3 pt-3 pb-12 sm:pl-10 sm:pr-12 rounded-[35px]"
                          {...form.register("bio")}
                        />
                        <div className="absolute bottom-4 left-5 flex gap-3">
                          <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-lg text-sm text-muted-foreground hover:bg-muted-foreground hover:text-background cursor-pointer transition">
                            <Plus className="w-5 h-4" />
                            <span>Import</span>
                          </div>
                          <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-lg text-sm text-muted-foreground hover:bg-muted-foreground hover:text-background cursor-pointer transition">
                            <Settings className="w-5 h-4" />
                            <span>Tools</span>
                          </div>
                          <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-lg text-sm text-muted-foreground hover:bg-muted-foreground hover:text-background cursor-pointer transition">
                            <Mic className="w-5 h-4" />
                            <span>Mic</span>
                          </div>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}
