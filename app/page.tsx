"use client"

import type React from "react"
import { useEffect, useRef, useCallback, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Video,
  Music,
  Code,
  Brain,
  ChevronDown,
  Palette,
  Terminal,
  X,
  ArrowRight,
  Users,
  BookOpen,
  Lightbulb,
  Target,
  Zap,
  TrendingUp,
  Stethoscope,
  Settings,
  FileText,
  Radio,
  Megaphone,
  Mic,
  MicOff,
  Send,
  ArrowLeft,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// 类型定义
interface Channel {
  id: string
  title: string
  subtitle: string
  description: string
  icon: React.ReactNode
  gradient: string
  page?: string
  type?: "creation" | "service" | "developer"
  stats?: Record<string, string>
  features?: string[]
}

interface ChatMessage {
  type: "user" | "ai"
  content: string
  timestamp: Date
}

interface AIInsight {
  type: "suggestion" | "optimization" | "insight"
  content: string
  priority: "high" | "medium" | "low"
}

// 配置数据
const BROADCAST_MESSAGES = [
  "🎉 欢迎来到言语云³！万象归元于云枢，深栈智启新纪元！",
  "✨ 【言创图文】笔墨丹青绘世界，智能创作展风华 🎨",
  "🎬 【语枢视频】光影流转述故事，剪辑艺术铸经典 📽️",
  "🎵 【YYC³ Music】天籁之音谱华章，智慧旋律动心弦 🎼",
  "💻 【YYC³ CodeX】代码如诗逻辑美，程序世界任遨游 ⚡",
  "🧠 【智能引擎】群智汇聚启新元，算力无穷创未来 🚀",
  "🏥 【云枢医疗】悬壶济世显仁心，智慧医疗护苍生 💊",
  "🛠️ 【开发者工具】API文档、SDK下载，助力开发者创新 🔧",
  "💝 温馨提示：点击屏幕任意位置即可开始AI智能对话 🤖",
]

const CREATION_CHANNELS: Channel[] = [
  {
    id: "image-creation",
    title: "言创图文",
    subtitle: "AI图像创作工作室",
    description: "笔墨丹青绘世界，智能创作展风华",
    icon: <Palette className="w-5 h-5" />,
    gradient: "from-pink-500 via-rose-500 to-red-500",
    page: "text-to-image",
    stats: { users: "12.5K", projects: "45.2K" },
    features: ["智能提示词", "多风格生成", "高清放大"],
  },
  {
    id: "video-hub",
    title: "语枢视频",
    subtitle: "智能视频编辑平台",
    description: "光影流转述故事，剪辑艺术铸经典",
    icon: <Video className="w-5 h-5" />,
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    page: "video-editor",
    stats: { users: "8.7K", projects: "23.1K" },
    features: ["AI智能剪辑", "实时预览", "语音合成"],
  },
  {
    id: "music-studio",
    title: "YYC³ Music",
    subtitle: "AI音乐创作工作室",
    description: "天籁之音谱华章，智慧旋律动心弦",
    icon: <Music className="w-5 h-5" />,
    gradient: "from-purple-500 via-violet-500 to-indigo-500",
    page: "music-studio",
    stats: { users: "6.3K", projects: "18.9K" },
    features: ["AI智能作曲", "多轨编辑", "音效库"],
  },
  {
    id: "code-studio",
    title: "YYC³ CodeX",
    subtitle: "智能编程开发平台",
    description: "代码如诗逻辑美，程序世界任遨游",
    icon: <Code className="w-5 h-5" />,
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    page: "code-studio",
    stats: { users: "15.2K", projects: "67.8K" },
    features: ["多语言支持", "智能补全", "代码审查"],
  },
  {
    id: "ai-engine",
    title: "智能引擎",
    subtitle: "AI大模型管理中心",
    description: "群智汇聚启新元，算力无穷创未来",
    icon: <Brain className="w-5 h-5" />,
    gradient: "from-orange-500 via-red-500 to-pink-500",
    page: "ai-engine",
    stats: { users: "9.8K", projects: "34.5K" },
    features: ["多模型集成", "智能路由", "性能监控"],
  },
]

const SERVICE_CHANNELS: Channel[] = [
  {
    id: "medical-center",
    title: "云枢医疗",
    subtitle: "智能医疗健康平台",
    description: "悬壶济世显仁心，智慧医疗护苍生",
    icon: <Stethoscope className="w-5 h-5" />,
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    page: "medical-center",
    stats: { patients: "50K+", accuracy: "98.5%" },
    features: ["智能诊断", "病历分析", "健康监测"],
  },
  {
    id: "community-hub",
    title: "社区广场",
    subtitle: "创作者交流平台",
    description: "百家争鸣聚英才，思想碰撞启智慧",
    icon: <Users className="w-5 h-5" />,
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    page: "community",
    stats: { members: "28.7K", posts: "156K" },
    features: ["作品展示", "技术分享", "在线协作"],
  },
  {
    id: "learning-center",
    title: "学习中心",
    subtitle: "AI技能提升平台",
    description: "学而时习知识海，温故知新智慧开",
    icon: <BookOpen className="w-5 h-5" />,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    page: "learning",
    stats: { courses: "120+", students: "45.6K" },
    features: ["系统化课程", "实战项目", "专业认证"],
  },
]

const DEVELOPER_TOOLS: Channel[] = [
  {
    id: "api-docs",
    title: "API文档",
    subtitle: "完整的API接口文档",
    description: "开发者必备，接口文档详尽全",
    icon: <FileText className="w-5 h-5" />,
    gradient: "from-slate-600 via-gray-600 to-zinc-600",
    type: "developer",
  },
  {
    id: "sdk-download",
    title: "SDK下载",
    subtitle: "多语言SDK开发包",
    description: "多语言支持，开发包齐全备",
    icon: <Terminal className="w-5 h-5" />,
    gradient: "from-slate-600 via-gray-600 to-zinc-600",
    type: "developer",
  },
  {
    id: "dev-console",
    title: "开发者控制台",
    subtitle: "在线调试和测试工具",
    description: "在线调试，测试工具功能强",
    icon: <Settings className="w-5 h-5" />,
    gradient: "from-slate-600 via-gray-600 to-zinc-600",
    type: "developer",
  },
]

export default function YanYuCloudAI() {
  // 状态管理
  const [isActive, setIsActive] = useState(false)
  const [inputText, setInputText] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [showLeftPanel, setShowLeftPanel] = useState(false)
  const [showRightPanel, setShowRightPanel] = useState(false)
  const [showNavDropdown, setShowNavDropdown] = useState(false)
  const [aiResponse, setAiResponse] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [currentPage, setCurrentPage] = useState<string>("home")
  const [currentBroadcast, setCurrentBroadcast] = useState("")
  const [broadcastIndex, setBroadcastIndex] = useState(0)
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])

  // Refs
  const mountedRef = useRef(true)
  const recognitionRef = useRef<any>(null)
  const broadcastTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 广播系统
  useEffect(() => {
    setCurrentBroadcast(BROADCAST_MESSAGES[0])
    broadcastTimerRef.current = setInterval(() => {
      if (mountedRef.current) {
        setBroadcastIndex((prev) => {
          const next = (prev + 1) % BROADCAST_MESSAGES.length
          setCurrentBroadcast(BROADCAST_MESSAGES[next])
          return next
        })
      }
    }, 8000)

    return () => {
      if (broadcastTimerRef.current) clearInterval(broadcastTimerRef.current)
    }
  }, [])

  // 语音识别初始化
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "zh-CN"

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = ""
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript
            }
          }
          if (finalTranscript) {
            setInputText((prev) => prev + finalTranscript)
          }
        }

        recognitionRef.current.onerror = () => setIsListening(false)
        recognitionRef.current.onend = () => setIsListening(false)
      }
    }
  }, [])

  // 清理函数
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (recognitionRef.current) recognitionRef.current.stop()
      if (broadcastTimerRef.current) clearInterval(broadcastTimerRef.current)
    }
  }, [])

  // 事件处理函数
  const handleScreenClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".panel, .input-area, .nav-dropdown, button, .broadcast-system")) return
    setIsActive(true)
  }, [])

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }, [isListening])

  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim()) return

    const userMessage = inputText.trim()
    setInputText("")
    setIsProcessing(true)

    setChatHistory((prev) => [...prev, { type: "user", content: userMessage, timestamp: new Date() }])

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const aiReply = `🤖 **智能助手为您服务**

我已分析您的需求："${userMessage}"

**🎯 推荐方案：**
• **创作需求** → 【言创图文】【语枢视频】【YYC³ Music】
• **开发需求** → 【YYC³ CodeX】【开发者工具】
• **医疗健康** → 【云枢医疗】【健康监测】
• **学习需求** → 【学习中心】【社区广场】

**💡 智能建议：**
• 多功能协同使用可提升整体效率300%
• 建议开启智能工作流，实现自动化处理

**🚀 下一步：**
请告诉我您的具体目标，我将为您制定详细方案！`

      setAiResponse(aiReply)
      setChatHistory((prev) => [...prev, { type: "ai", content: aiReply, timestamp: new Date() }])

      setAiInsights([
        {
          type: "suggestion",
          content: "建议详细描述需求，以获得更精准的智能建议",
          priority: "medium",
        },
      ])
    } catch (error) {
      setAiResponse("抱歉，处理您的请求时出现了问题。请稍后重试。")
    } finally {
      setIsProcessing(false)
    }
  }, [inputText])

  const handlePageNavigation = useCallback((page: string) => {
    setCurrentPage(page)
    setShowLeftPanel(false)
    setShowRightPanel(false)
    setShowNavDropdown(false)
  }, [])

  const handleBackToHome = useCallback(() => {
    setCurrentPage("home")
  }, [])

  // 键盘事件
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && inputText.trim()) handleSendMessage()
      if (e.key === "Escape") {
        setIsActive(false)
        setInputText("")
        setAiInsights([])
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [inputText, handleSendMessage])

  // 渲染频道卡片
  const renderChannelCard = (channel: Channel, index: number) => (
    <motion.div
      key={channel.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        className={`bg-gradient-to-br ${channel.gradient} border-0 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl group`}
        onClick={() => channel.page && handlePageNavigation(channel.page)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">{channel.icon}</div>
              <div>
                <h3 className="text-white font-bold text-sm">{channel.title}</h3>
                <p className="text-white/80 text-xs">{channel.subtitle}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-white/90 text-xs mb-3 leading-relaxed font-medium">{channel.description}</p>
          {channel.stats && (
            <div className="flex items-center space-x-3 mb-3">
              {Object.entries(channel.stats).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-1">
                  <Users className="w-3 h-3 text-white/70" />
                  <span className="text-white/80 text-xs">{value}</span>
                </div>
              ))}
            </div>
          )}
          {channel.features && (
            <div className="grid grid-cols-1 gap-1">
              {channel.features.slice(0, 3).map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-sm rounded-md px-2 py-1 text-white/80 text-xs text-center"
                >
                  {feature}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden cursor-pointer"
      onClick={handleScreenClick}
    >
      {/* 动态背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* 顶部导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-900/80 to-indigo-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-IEzjrf4507B176JfJTY0HFBnQ1Y2ka.png"
                alt="言语云³ Logo"
                className="h-10 w-10"
              />
              <div className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                言语云³
              </div>
            </div>

            <div className="relative">
              <Button
                onClick={() => setShowNavDropdown(!showNavDropdown)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                立即体验 <ChevronDown className="w-4 h-4 ml-2" />
              </Button>

              <AnimatePresence>
                {showNavDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="nav-dropdown absolute right-0 mt-2 w-80 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-xl max-h-96 overflow-y-auto"
                  >
                    <div className="p-4 space-y-2">
                      <div className="px-2 py-1 text-white/70 text-xs font-medium uppercase tracking-wider border-b border-white/10 mb-2">
                        🎨 创作工作室
                      </div>
                      {CREATION_CHANNELS.map((item) => (
                        <Button
                          key={item.id}
                          variant="ghost"
                          className="w-full justify-start text-white hover:bg-white/10 h-auto p-3"
                          onClick={() => {
                            item.page && handlePageNavigation(item.page)
                            setShowNavDropdown(false)
                          }}
                        >
                          <div className="flex items-center space-x-3 w-full">
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${item.gradient}`}>{item.icon}</div>
                            <div className="flex-1 text-left">
                              <div className="text-sm font-medium">{item.title}</div>
                              <div className="text-xs text-white/60">{item.description}</div>
                            </div>
                          </div>
                        </Button>
                      ))}

                      <div className="px-2 py-1 text-white/70 text-xs font-medium uppercase tracking-wider border-b border-white/10 mt-4 mb-2">
                        🛠️ 开发者工具
                      </div>
                      {DEVELOPER_TOOLS.map((item) => (
                        <Button
                          key={item.id}
                          variant="ghost"
                          className="w-full justify-start text-white hover:bg-white/10 h-auto p-3"
                          onClick={() => setShowNavDropdown(false)}
                        >
                          <div className="flex items-center space-x-3 w-full">
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${item.gradient}`}>{item.icon}</div>
                            <div className="flex-1 text-left">
                              <div className="text-sm font-medium">{item.title}</div>
                              <div className="text-xs text-white/60">{item.description}</div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* 广播系统 */}
      <div className="broadcast-system fixed top-20 left-0 right-0 z-40 pointer-events-none overflow-hidden">
        <AnimatePresence mode="wait">
          {currentBroadcast && (
            <motion.div
              key={broadcastIndex}
              initial={{ x: "100vw" }}
              animate={{ x: "-100%" }}
              exit={{ x: "-100vw" }}
              transition={{ duration: 12, ease: "linear" }}
              className="flex items-center bg-gradient-to-r from-orange-500/90 via-red-500/90 to-pink-500/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl border border-white/20 whitespace-nowrap"
              style={{ position: "absolute", top: "0", right: "0" }}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Radio className="w-5 h-5 text-yellow-300 animate-pulse" />
                  <Megaphone className="w-5 h-5 text-yellow-300" />
                </div>
                <div className="text-lg font-medium tracking-wide">{currentBroadcast}</div>
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-yellow-300 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    ></div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI智能洞察面板 */}
      <AnimatePresence>
        {aiInsights.length > 0 && isActive && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="ai-insights fixed right-4 top-32 w-80 max-h-96 overflow-y-auto z-40"
          >
            <Card className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur-md border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-white font-semibold">AI智能洞察</h3>
                  </div>
                  <Button
                    onClick={() => setAiInsights([])}
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:text-white h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {aiInsights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg border-l-4 ${
                        insight.priority === "high"
                          ? "bg-red-500/10 border-red-400"
                          : insight.priority === "medium"
                            ? "bg-yellow-500/10 border-yellow-400"
                            : "bg-blue-500/10 border-blue-400"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        <div className="flex-shrink-0 mt-0.5">
                          {insight.type === "suggestion" && <Target className="w-4 h-4 text-green-400" />}
                          {insight.type === "optimization" && <Zap className="w-4 h-4 text-yellow-400" />}
                          {insight.type === "insight" && <TrendingUp className="w-4 h-4 text-blue-400" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                insight.type === "suggestion"
                                  ? "border-green-400 text-green-400"
                                  : insight.type === "optimization"
                                    ? "border-yellow-400 text-yellow-400"
                                    : "border-blue-400 text-blue-400"
                              }`}
                            >
                              {insight.type === "suggestion"
                                ? "建议"
                                : insight.type === "optimization"
                                  ? "优化"
                                  : "洞察"}
                            </Badge>
                          </div>
                          <p className="text-white/90 text-sm leading-relaxed">{insight.content}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 左侧创作工作室面板 */}
      <AnimatePresence>
        {showLeftPanel && (
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="panel fixed left-0 top-16 bottom-0 w-80 bg-black/20 backdrop-blur-xl border-r border-white/10 z-40 overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">创作工作室</h2>
                  <p className="text-white/60 text-xs">专业AI创作工具集合</p>
                </div>
                <Button
                  onClick={() => setShowLeftPanel(false)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {CREATION_CHANNELS.map((channel, index) => renderChannelCard(channel, index))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 右侧工具与服务面板 */}
      <AnimatePresence>
        {showRightPanel && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="panel fixed right-0 top-16 bottom-0 w-80 bg-black/20 backdrop-blur-xl border-l border-white/10 z-40 overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">工具与服务</h2>
                  <p className="text-white/60 text-xs">全方位AI辅助支持</p>
                </div>
                <Button
                  onClick={() => setShowRightPanel(false)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {SERVICE_CHANNELS.map((channel, index) => renderChannelCard(channel, index))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 隐藏的侧边激活区域 */}
      <div
        className="fixed left-0 top-16 bottom-0 w-6 z-30 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-transparent transition-all cursor-pointer"
        onMouseEnter={() => setShowLeftPanel(true)}
      >
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white/30 text-xs writing-mode-vertical">
          创作工作室
        </div>
      </div>
      <div
        className="fixed right-0 top-16 bottom-0 w-6 z-30 hover:bg-gradient-to-l hover:from-purple-500/20 hover:to-transparent transition-all cursor-pointer"
        onMouseEnter={() => setShowRightPanel(true)}
      >
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/30 text-xs writing-mode-vertical">
          工具服务
        </div>
      </div>

      {/* 页面路由渲染 */}
      {currentPage !== "home" && (
        <div className="fixed inset-0 z-50">
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl">
            {currentPage === "text-to-image" && "言创图文工作室"}
            {currentPage === "video-editor" && "语枢视频工作室"}
            {currentPage === "music-studio" && "YYC³ Music工作室"}
            {currentPage === "code-studio" && "YYC³ CodeX工作室"}
            {currentPage === "ai-engine" && "智能引擎中心"}
            {currentPage === "medical-center" && "云枢医疗中心"}
            {currentPage === "community" && "社区广场"}
            {currentPage === "learning" && "学习中心"}
          </div>
          <Button
            onClick={handleBackToHome}
            className="fixed top-20 right-6 z-50 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Button>
        </div>
      )}

      {/* 主AI交互界面 */}
      {currentPage === "home" && (
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
          <AnimatePresence>
            {!isActive && (
              <motion.div
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center mb-8"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] }}
                  transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="mb-6"
                >
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-IEzjrf4507B176JfJTY0HFBnQ1Y2ka.png"
                    alt="言语云³"
                    className="w-32 h-32 mx-auto mb-4"
                  />
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
                  万象归元于
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    云枢
                  </span>
                </h1>
                <p className="text-2xl md:text-3xl text-white/80 mb-4">
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    深栈
                  </span>
                  智启新纪元
                </p>
                <p className="text-lg text-white/60 mb-8">点击屏幕任意位置开始AI对话</p>
                <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
                  {["言创图文", "语枢视频", "YYC³ Music", "YYC³ CodeX", "智能引擎"].map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Badge
                        variant="outline"
                        className="border-white/30 text-white/90 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-pointer"
                        onClick={() => setIsActive(true)}
                      >
                        {item}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-4xl mx-auto"
              >
                {chatHistory.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 max-h-60 overflow-y-auto space-y-3"
                  >
                    {chatHistory.slice(-3).map((message, index) => (
                      <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.type === "user"
                              ? "bg-blue-500 text-white"
                              : "bg-white/10 text-white backdrop-blur-sm"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {aiResponse && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                    <Card className="bg-white/10 backdrop-blur-md border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <Brain className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-white/90 leading-relaxed whitespace-pre-line">{aiResponse}</div>
                            {isProcessing && (
                              <div className="flex items-center mt-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                                <span className="text-white/60 text-sm">AI思考中...</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="input-area">
                  <Card className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 relative">
                          <input
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="说出您的需求，我来帮您实现..."
                            className="w-full bg-transparent border-0 text-white placeholder:text-white/60 text-lg focus:ring-0 focus:outline-none"
                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={toggleListening}
                            variant="ghost"
                            size="sm"
                            className={`text-white hover:bg-white/10 ${isListening ? "bg-red-500/20" : ""}`}
                          >
                            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                          </Button>
                          <Button
                            onClick={handleSendMessage}
                            disabled={!inputText.trim() || isProcessing}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                          >
                            <Send className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                      {isListening && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 flex items-center text-red-400 text-sm"
                        >
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse mr-2"></div>正在聆听您的声音...
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 底部收缩边线 */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-30"></div>
    </div>
  )
}
