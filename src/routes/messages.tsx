// ==============================================================================
// EKA MESSAGES — RESPECTFUL CONNECTION & DIRECT CONVERSATION LAYER
// ==============================================================================
// Contemplative one-to-one communication between seekers, creators & elders.
// Supports: Active Conversations · Message Requests · Trust Controls · Blocking/Reporting
// ==============================================================================

import { useState } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import {
  MessageSquare,
  Send,
  ShieldCheck,
  User,
  Search,
  MoreVertical,
  Flag,
  Ban,
  Check,
  X,
  Sparkles,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfile } from "@/hooks/useProfile";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/messages")({
  validateSearch: (search: Record<string, unknown>): { recipient?: string; context?: string } => ({
    recipient: (search["recipient"] as string) ?? "",
    context: (search["context"] as string) ?? "",
  }),
  head: () => ({
    meta: [
      { title: "Messages — Respectful Connections & Inquiries | EKA" },
      {
        name: "description",
        content:
          "Connect directly with master artisans, elders, scholars, and fellow practitioners on EKA through thoughtful, respectful communication.",
      },
    ],
  }),
  component: MessagesPage,
});

interface ConversationThread {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerHandle: string;
  partnerAvatar: string;
  partnerRole: string;
  verified: boolean;
  isRequest?: boolean;
  contextBanner?: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount?: number;
  messages: Array<{
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
  }>;
}

const INITIAL_CONVERSATIONS: ConversationThread[] = [
  {
    id: "conv-1",
    partnerId: "creator-ramakrishna",
    partnerName: "Pt. Ramakrishna Shastry",
    partnerHandle: "kashi_lineage",
    partnerAvatar: "/brand/eka-logo.png",
    partnerRole: "Eighth-Generation Archaka",
    verified: true,
    contextBanner: "Inquiry regarding Varanasi Twilight Aarti Traditions",
    lastMessage: "The lamps will be lighted at 6:45 PM during autumn. All are welcome.",
    lastTimestamp: "10:30 AM",
    messages: [
      {
        id: "m-1",
        senderId: "me",
        text: "Namaste Panditji. I watched your story on Dashashwamedh Ghat. Are guests welcome to observe quietly from the steps?",
        timestamp: "10:15 AM",
      },
      {
        id: "m-2",
        senderId: "creator-ramakrishna",
        text: "Namaste. The lamps will be lighted at 6:45 PM during autumn. All are welcome to sit in silence. No fee or special pass is required.",
        timestamp: "10:30 AM",
      },
    ],
  },
  {
    id: "conv-2",
    partnerId: "creator-sudhakaran",
    partnerName: "K. Sudhakaran Achari",
    partnerHandle: "aranmula_guild",
    partnerAvatar: "/brand/eka-logo.png",
    partnerRole: "Master Metal Artisan",
    verified: true,
    contextBanner: "Inquiry regarding Aranmula Kannadi Craft Lineage",
    lastMessage: "Each sacred mirror takes fourteen days of mud mold annealing.",
    lastTimestamp: "Yesterday",
    messages: [
      {
        id: "m-3",
        senderId: "me",
        text: "Greetings Master Achari. Does your family guild accept apprentice observers?",
        timestamp: "Yesterday",
      },
      {
        id: "m-4",
        senderId: "creator-sudhakaran",
        text: "Each sacred mirror takes fourteen days of mud mold annealing. We hold public demonstrations on the second Saturday of each month.",
        timestamp: "Yesterday",
      },
    ],
  },
  {
    id: "conv-req-1",
    partnerId: "user-maya",
    partnerName: "Maya Ramanathan",
    partnerHandle: "maya_sadhaka",
    partnerAvatar: "/content/monastery-corridor.jpg",
    partnerRole: "Contemplative Seeker",
    verified: false,
    isRequest: true,
    contextBanner: "Message Request via Contemplation Sangha",
    lastMessage: "Hello! I saw your reflection on quiet morning practices and wanted to connect.",
    lastTimestamp: "2 days ago",
    messages: [
      {
        id: "m-5",
        senderId: "user-maya",
        text: "Hello! I saw your reflection on quiet morning practices in the Sangha and wanted to connect.",
        timestamp: "2 days ago",
      },
    ],
  },
];

function MessagesPage() {
  const { recipient, context } = useSearch({ from: "/messages" });
  const { data: profile } = useProfile();

  const [activeTab, setActiveTab] = useState<"active" | "requests">("active");
  const [conversations, setConversations] = useState<ConversationThread[]>(INITIAL_CONVERSATIONS);
  const [selectedConvId, setSelectedConvId] = useState<string>("conv-1");
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const activeThreads = conversations.filter((c) => !c.isRequest);
  const requestThreads = conversations.filter((c) => c.isRequest);

  const currentThread =
    conversations.find((c) => c.id === selectedConvId) || activeThreads[0] || null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !currentThread) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      senderId: "me",
      text: messageText.trim(),
      timestamp: "Just now",
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === currentThread.id
          ? {
              ...c,
              lastMessage: newMsg.text,
              lastTimestamp: "Just now",
              messages: [...c.messages, newMsg],
            }
          : c
      )
    );

    setMessageText("");
    track("message_started", { partnerId: currentThread.partnerId });
    toast.success("Message sent");
  };

  const handleAcceptRequest = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, isRequest: false } : c))
    );
    toast.success("Connection request accepted");
    setActiveTab("active");
  };

  const handleDeclineRequest = (convId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== convId));
    toast.info("Connection request declined");
  };

  const handleBlockUser = (partnerName: string) => {
    toast.success(`${partnerName} has been blocked`);
  };

  const handleReportUser = (partnerName: string) => {
    toast.success(`Report submitted for review`);
  };

  return (
    <div className="min-h-screen bg-sand/20 dark:bg-stone-950 text-foreground flex flex-col selection:bg-terracotta/20">
      <SiteHeader />

      <main id="main-content" className="flex-1 container-eka py-6 sm:py-10 max-w-6xl">
        {/* Messages Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare className="size-5 text-primary" />
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Messages & Connections
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground font-light mt-1">
              Thoughtful, respectful communication between seekers, master artisans, and elders.
            </p>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-1.5 flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="size-3.5 text-primary" />
            <span>End-to-end respectful discourse · DPDP Compliant</span>
          </div>
        </div>

        {/* 2-Pane Split Messaging Console */}
        <div className="grid grid-cols-1 md:grid-cols-12 rounded-3xl border border-border/80 bg-card overflow-hidden shadow-calm min-h-[580px]">
          {/* Left Column: Conversations List */}
          <div className="md:col-span-4 border-r border-border/70 flex flex-col bg-background/50">
            {/* Tabs: Active vs Requests */}
            <div className="flex items-center border-b border-border/70 p-2 gap-1 bg-accent/20">
              <button
                onClick={() => setActiveTab("active")}
                className={`flex-1 py-2 text-xs font-medium rounded-xl transition-colors ${
                  activeTab === "active"
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Conversations ({activeThreads.length})
              </button>
              <button
                onClick={() => setActiveTab("requests")}
                className={`flex-1 py-2 text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === "requests"
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>Requests</span>
                {requestThreads.length > 0 && (
                  <span className="size-4 rounded-full bg-terracotta text-white text-[10px] flex items-center justify-center font-mono">
                    {requestThreads.length}
                  </span>
                )}
              </button>
            </div>

            {/* Conversation Thread List */}
            <div className="flex-1 overflow-y-auto divide-y divide-border/40">
              {(activeTab === "active" ? activeThreads : requestThreads).map((thread) => {
                const isSelected = thread.id === selectedConvId;
                return (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedConvId(thread.id)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                      isSelected
                        ? "bg-accent/60"
                        : "hover:bg-accent/30"
                    }`}
                  >
                    <img
                      src={thread.partnerAvatar}
                      alt={thread.partnerName}
                      className="size-10 rounded-full border border-border object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-foreground truncate flex items-center gap-1">
                          {thread.partnerName}
                          {thread.verified && (
                            <ShieldCheck className="size-3 text-saffron shrink-0" />
                          )}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {thread.lastTimestamp}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-mono truncate">
                        {thread.partnerRole}
                      </p>
                      <p className="text-xs text-muted-foreground/90 truncate mt-1">
                        {thread.lastMessage}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Chat View */}
          <div className="md:col-span-8 flex flex-col justify-between bg-card">
            {currentThread ? (
              <>
                {/* Chat Top Bar */}
                <div className="flex items-center justify-between p-4 border-b border-border/70 bg-background/40">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentThread.partnerAvatar}
                      alt={currentThread.partnerName}
                      className="size-9 rounded-full border border-border object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h2 className="font-semibold text-sm text-foreground">
                          {currentThread.partnerName}
                        </h2>
                        {currentThread.verified && (
                          <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                            Verified Lineage
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">
                        {currentThread.partnerRole} · @{currentThread.partnerHandle}
                      </p>
                    </div>
                  </div>

                  {/* Safety / Trust Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-xl size-8">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 text-xs">
                      <DropdownMenuItem
                        onClick={() => handleReportUser(currentThread.partnerName)}
                        className="gap-2 cursor-pointer"
                      >
                        <Flag className="size-3.5 text-muted-foreground" />
                        <span>Report Conversation</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleBlockUser(currentThread.partnerName)}
                        className="gap-2 text-destructive cursor-pointer"
                      >
                        <Ban className="size-3.5" />
                        <span>Block User</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Contextual Thread Origin Banner */}
                {currentThread.contextBanner && (
                  <div className="bg-sand/30 dark:bg-stone-900/50 border-b border-border/40 px-4 py-2 text-xs text-muted-foreground flex items-center gap-2">
                    <Sparkles className="size-3.5 text-terracotta" />
                    <span>{currentThread.contextBanner}</span>
                  </div>
                )}

                {/* Message Request Approval Bar */}
                {currentThread.isRequest && (
                  <div className="bg-amber-500/10 border-b border-amber-500/20 p-3.5 flex items-center justify-between text-xs">
                    <span className="text-amber-700 dark:text-amber-400">
                      This user would like to connect. Accept to start direct communication.
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAcceptRequest(currentThread.id)}
                        className="rounded-xl text-xs h-7 bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Check className="size-3 mr-1" /> Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeclineRequest(currentThread.id)}
                        className="rounded-xl text-xs h-7"
                      >
                        <X className="size-3 mr-1" /> Decline
                      </Button>
                    </div>
                  </div>
                )}

                {/* Messages Stream */}
                <div className="flex-1 p-5 overflow-y-auto space-y-3.5">
                  {currentThread.messages.map((m) => {
                    const isMe = m.senderId === "me";
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-md rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                            isMe
                              ? "bg-primary text-primary-foreground rounded-tr-xs"
                              : "bg-accent/70 text-foreground border border-border/60 rounded-tl-xs"
                          }`}
                        >
                          <p>{m.text}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono mt-1 px-1">
                          {m.timestamp}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Message Send Bar */}
                {!currentThread.isRequest ? (
                  <form
                    onSubmit={handleSendMessage}
                    className="p-3.5 border-t border-border/70 bg-background/50 flex items-center gap-2"
                  >
                    <Input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Write a thoughtful message…"
                      className="rounded-xl bg-card border-border/80 text-sm"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="rounded-xl bg-gradient-to-r from-terracotta to-saffron text-white h-9 px-4 shrink-0"
                    >
                      <Send className="size-3.5" />
                    </Button>
                  </form>
                ) : (
                  <div className="p-3 border-t border-border/70 text-center text-xs text-muted-foreground">
                    Accept request to reply
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground space-y-2">
                <MessageSquare className="size-8 opacity-40" />
                <p className="text-sm">Select a conversation or inquiry</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
