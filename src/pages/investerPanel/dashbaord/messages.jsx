import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  HomeIcon,
  InvitesIcon,
  PortfolioIcon,
  TaxesIcon,
  MessagesIcon,
  SettingsIcon,
  ShareIcon as ShareIconComponent,
  SendIcon as SendIconComponent,
  AlertsIcon
} from "./icon.jsx";

const ShareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 10.8333C15.9205 10.8333 16.6667 10.0872 16.6667 9.16667C16.6667 8.24619 15.9205 7.5 15 7.5C14.0795 7.5 13.3333 8.24619 13.3333 9.16667C13.3333 10.0872 14.0795 10.8333 15 10.8333Z" stroke="#748A91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 7.5C5.92047 7.5 6.66667 6.75381 6.66667 5.83333C6.66667 4.91286 5.92047 4.16667 5 4.16667C4.07953 4.16667 3.33333 4.91286 3.33333 5.83333C3.33333 6.75381 4.07953 7.5 5 7.5Z" stroke="#748A91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 15.8333C5.92047 15.8333 6.66667 15.0871 6.66667 14.1667C6.66667 13.2462 5.92047 12.5 5 12.5C4.07953 12.5 3.33333 13.2462 3.33333 14.1667C3.33333 15.0871 4.07953 15.8333 5 15.8333Z" stroke="#748A91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.08333 6.04167L12.9167 8.125M7.08333 13.4583L12.9167 11.375" stroke="#748A91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SendIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="#00F0C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Helper function to format time
const formatTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};

// Helper function to get initials
const getInitials = (name) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const Messages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const investDropdownRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageDraft, setMessageDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMessageView, setShowMessageView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [messageSearchQuery, setMessageSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const hasInitialLoadRef = useRef(false);
  const hasScrolledInitialRef = useRef(false);
  const wsRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);

  // Get API URL
  const getApiUrl = () => {
    const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
    return `${API_URL.replace(/\/$/, "")}`;
  };

  // Get WebSocket URL
  const getWebSocketUrl = (conversationId) => {
    const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
    const baseUrl = API_URL.replace(/\/$/, "");
    // Convert http to ws or https to wss
    const wsProtocol = baseUrl.startsWith("https") ? "wss" : "ws";
    const wsBase = baseUrl.replace(/^https?:/, wsProtocol);
    const token = getAccessToken();
    return `${wsBase}/ws/chat/${conversationId}/?token=${token}`;
  };

  // Get access token
  const getAccessToken = () => {
    return localStorage.getItem("accessToken");
  };

  // Get current user info
  const getCurrentUserInfo = () => {
    try {
      const userData = localStorage.getItem("userData");
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
    return null;
  };

  const currentUser = getCurrentUserInfo();

  // Function to scroll to bottom
  const scrollToBottom = (instant = false) => {
    if (messagesContainerRef.current) {
      // Direct scroll to bottom of container
      const container = messagesContainerRef.current;
      if (instant) {
        // Force immediate scroll without animation
        container.scrollTop = container.scrollHeight;
      } else {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth"
        });
      }
    } else if (messagesEndRef.current) {
      // Fallback to scrollIntoView
      messagesEndRef.current.scrollIntoView({ behavior: instant ? "auto" : "smooth" });
    }
  };

  // Force scroll to bottom - more aggressive approach
  const forceScrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      // Temporarily disable smooth scroll
      const originalScrollBehavior = container.style.scrollBehavior;
      container.style.scrollBehavior = 'auto';

      // Force scroll multiple times
      container.scrollTop = container.scrollHeight;

      // Use multiple methods to ensure scroll
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 0);

      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight;
          // Restore smooth scroll behavior
          container.style.scrollBehavior = originalScrollBehavior || 'smooth';
        });
      });
    }
  };

  // Fetch conversations
  const fetchConversations = async (search = "", skipAutoSelect = false) => {
    try {
      setLoading(true);
      setError("");
      const token = getAccessToken();
      if (!token) {
        setError("Not authenticated. Please login again.");
        return;
      }

      const API_BASE = getApiUrl();
      const url = search
        ? `${API_BASE}/conversations/?search=${encodeURIComponent(search)}`
        : `${API_BASE}/conversations/`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const conversationsData = Array.isArray(response.data) ? response.data : response.data.results || [];
      setConversations(conversationsData);

      // DON'T auto-select here - it causes infinite loops
      // Auto-selection is handled separately in useEffect
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError(err.response?.data?.error || err.response?.data?.detail || "Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId, isPolling = false) => {
    try {
      if (!isPolling) {
        setLoadingMessages(true);
      }
      setError("");
      const token = getAccessToken();
      if (!token) {
        setError("Not authenticated. Please login again.");
        return;
      }

      const API_BASE = getApiUrl();
      const response = await axios.get(`${API_BASE}/conversations/${conversationId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const messagesData = response.data.messages || [];
      setMessages(messagesData);

      // Mark as read only when not polling (to avoid loops)
      if (!isPolling) {
        await markConversationAsRead(conversationId, true);
        // DON'T refresh conversations here - it causes infinite loops
        // Only refresh unread count
        fetchUnreadCount();
      }

      // Scroll to bottom only on first load (not during polling)
      if (!isPolling) {
        // Reset scroll flag to allow scroll on this fetch
        hasScrolledInitialRef.current = false;
        // Force instant scroll on initial load (no animation)
        setTimeout(() => {
          const container = messagesContainerRef.current;
          if (container) {
            container.style.scrollBehavior = 'auto';
            container.scrollTop = container.scrollHeight;
          }
        }, 0);
        setTimeout(() => {
          const container = messagesContainerRef.current;
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        }, 100);
        setTimeout(() => {
          const container = messagesContainerRef.current;
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        }, 300);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      if (!isPolling) {
        setError(err.response?.data?.error || err.response?.data?.detail || "Failed to load messages");
      }
    } finally {
      if (!isPolling) {
        setLoadingMessages(false);
      }
    }
  };

  // Mark conversation as read
  const markConversationAsRead = async (conversationId, skipRefresh = false) => {
    try {
      const token = getAccessToken();
      if (!token) return;

      const API_BASE = getApiUrl();
      await axios.post(`${API_BASE}/conversations/${conversationId}/mark_as_read/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      // Only refresh if explicitly requested (not during polling)
      if (!skipRefresh) {
        fetchUnreadCount();
      }
    } catch (err) {
      console.error("Error marking conversation as read:", err);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const token = getAccessToken();
      if (!token) return;

      const API_BASE = getApiUrl();
      const response = await axios.get(`${API_BASE}/conversations/unread_count/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      setUnreadCount(response.data.unread_count || 0);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
    // Reset input to allow selecting same file again
    e.target.value = '';
  };

  // Remove selected file
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Send message via WebSocket or HTTP fallback
  const sendMessage = async () => {
    if ((!messageDraft.trim() && selectedFiles.length === 0) || !selectedConversation || sending) return;

    const messageContent = messageDraft.trim() || "";
    const conversationId = selectedConversation.id;

    // If files are selected, always use HTTP (multipart/form-data)
    if (selectedFiles.length > 0) {
      try {
        setSending(true);
        setError("");
        const token = getAccessToken();
        if (!token) {
          setError("Not authenticated. Please login again.");
          return;
        }

        const API_BASE = getApiUrl();
        const formData = new FormData();
        formData.append("conversation", conversationId);
        if (messageContent) {
          formData.append("content", messageContent);
        }
        if (replyingTo?.id) {
          formData.append("parent_message", replyingTo.id);
        }

        // Append all files
        selectedFiles.forEach((file) => {
          formData.append("attachment_files", file);
        });

        const response = await axios.post(
          `${API_BASE}/messages/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Add message to local state
        setMessages((prev) => {
          const filtered = prev.filter(msg => !msg.is_temp);
          return [...filtered, response.data];
        });
        setMessageDraft("");
        setSelectedFiles([]);

        // Update local conversation's last message
        fetchUnreadCount();

        setConversations(prev => prev.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              last_message: {
                content: messageContent || "Sent an attachment",
                time_ago: "just now"
              }
            };
          }
          return conv;
        }));

        // Scroll to bottom
        setTimeout(() => {
          scrollToBottom();
        }, 100);

        // Focus back on input after sending
        setTimeout(() => {
          messageInputRef.current?.focus();
        }, 100);

        // Clear reply
        if (replyingTo) {
          setReplyingTo(null);
        }
      } catch (err) {
        console.error("Error sending message with files:", err);
        setError(err.response?.data?.error || err.response?.data?.detail || "Failed to send message");
      } finally {
        setSending(false);
      }
      return;
    }

    // Try WebSocket first if connected (only for text messages without files)
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && isConnected) {
      try {
        setSending(true);
        setError("");

        // Send via WebSocket
        wsRef.current.send(JSON.stringify({
          type: "chat_message",
          content: messageContent,
          parent_message_id: replyingTo?.id || null
        }));

        // Stop typing indicator
        sendTypingIndicator(false);

        // Optimistically update UI (message will be updated when server confirms)
        const tempMessage = {
          id: Date.now(), // Temporary ID
          content: messageContent,
          sender: {
            id: currentUser?.user_id || currentUser?.id,
            first_name: currentUser?.first_name || "",
            last_name: currentUser?.last_name || ""
          },
          created_at: new Date().toISOString(),
          time_ago: "just now",
          is_temp: true // Mark as temporary
        };

        setMessages((prev) => [...prev, tempMessage]);
        setMessageDraft("");

        // Update conversation list
        setConversations(prev => prev.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              last_message: {
                content: messageContent,
                time_ago: "just now"
              }
            };
          }
          return conv;
        }));

        // Scroll to bottom
        setTimeout(() => {
          scrollToBottom();
        }, 100);

        // Focus back on input after sending
        setTimeout(() => {
          messageInputRef.current?.focus();
        }, 100);

        // Clear reply
        if (replyingTo) {
          setReplyingTo(null);
        }
      } catch (err) {
        console.error("Error sending message via WebSocket:", err);
        setError("Failed to send message. Trying HTTP fallback...");
        // Fall through to HTTP fallback
      } finally {
        setSending(false);
      }
    } else {
      // HTTP fallback
      try {
        setSending(true);
        setError("");
        const token = getAccessToken();
        if (!token) {
          setError("Not authenticated. Please login again.");
          return;
        }

        const API_BASE = getApiUrl();
        const response = await axios.post(
          `${API_BASE}/messages/`,
          {
            conversation: conversationId,
            content: messageContent,
            parent_message: replyingTo?.id || null,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        // Add message to local state
        setMessages((prev) => {
          // Remove temp message if exists
          const filtered = prev.filter(msg => !msg.is_temp || msg.content !== messageContent);
          return [...filtered, response.data];
        });
        setMessageDraft("");

        // Update local conversation's last message
        fetchUnreadCount();

        setConversations(prev => prev.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              last_message: {
                content: messageContent,
                time_ago: "just now"
              }
            };
          }
          return conv;
        }));

        // Scroll to bottom
        setTimeout(() => {
          scrollToBottom();
        }, 100);

        // Focus back on input after sending
        setTimeout(() => {
          messageInputRef.current?.focus();
        }, 100);

        // Clear reply
        if (replyingTo) {
          setReplyingTo(null);
        }
      } catch (err) {
        console.error("Error sending message:", err);
        setError(err.response?.data?.error || err.response?.data?.detail || "Failed to send message");
      } finally {
        setSending(false);
      }
    }
  };

  // Send typing indicator
  const sendTypingIndicator = (isTyping) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "typing_indicator",
        is_typing: isTyping
      }));
    }
  };

  // Handle typing in input
  const handleTyping = () => {
    if (!selectedConversation) return;

    sendTypingIndicator(true);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing indicator after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(false);
    }, 3000);
  };

  // Add reaction to message
  const addReaction = async (messageId, emoji) => {
    try {
      const token = getAccessToken();
      if (!token) return;

      const API_BASE = getApiUrl();
      await axios.post(`${API_BASE}/messages/${messageId}/react/`, { emoji }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Refresh messages to get updated reactions
      if (selectedConversation?.id) {
        fetchMessages(selectedConversation.id, true);
      }
    } catch (err) {
      console.error("Error adding reaction:", err);
    }
  };

  // Remove reaction from message
  const removeReaction = async (messageId, emoji) => {
    try {
      const token = getAccessToken();
      if (!token) return;

      const API_BASE = getApiUrl();
      await axios.delete(`${API_BASE}/messages/${messageId}/react/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { emoji },
      });

      // Refresh messages to get updated reactions
      if (selectedConversation?.id) {
        fetchMessages(selectedConversation.id, true);
      }
    } catch (err) {
      console.error("Error removing reaction:", err);
    }
  };

  // Edit message
  const editMessage = async (messageId, newContent) => {
    try {
      const token = getAccessToken();
      if (!token) return;

      const API_BASE = getApiUrl();
      await axios.patch(`${API_BASE}/messages/${messageId}/`, { content: newContent }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Refresh messages
      if (selectedConversation?.id) {
        fetchMessages(selectedConversation.id, true);
      }
      setEditingMessage(null);
    } catch (err) {
      console.error("Error editing message:", err);
      setError(err.response?.data?.error || "Failed to edit message");
    }
  };

  // Delete message
  const deleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      const token = getAccessToken();
      if (!token) return;

      const API_BASE = getApiUrl();
      await axios.delete(`${API_BASE}/messages/${messageId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh messages
      if (selectedConversation?.id) {
        fetchMessages(selectedConversation.id, true);
      }
    } catch (err) {
      console.error("Error deleting message:", err);
      setError(err.response?.data?.error || "Failed to delete message");
    }
  };

  // Search messages
  const searchMessages = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const token = getAccessToken();
      if (!token) return;

      const API_BASE = getApiUrl();
      const response = await axios.post(
        `${API_BASE}/messages/search/`,
        {
          query: query.trim(),
          conversation_id: selectedConversation?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSearchResults(response.data.results || []);
    } catch (err) {
      console.error("Error searching messages:", err);
    }
  };

  // Handle conversation selection
  const handleConversationSelect = (conversation) => {
    // The conversation ID is at conversation.id (top level property)
    const conversationId = conversation.id;
    if (!conversationId) {
      console.error("Cannot select conversation without ID:", conversation);
      setError("Invalid conversation. Please try again.");
      return;
    }

    setSelectedConversation(conversation);
    setShowMessageView(true);
    // Fetch messages without polling flag (initial load)
    fetchMessages(conversationId, false);

    // Focus on input after a short delay to allow UI to update
    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 300);
  };

  // Handle search with debouncing
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search to avoid too many API calls
    // Skip auto-select when searching
    searchTimeoutRef.current = setTimeout(() => {
      fetchConversations(query, true); // skipAutoSelect = true
    }, 500);
  };

  // WebSocket connection management
  useEffect(() => {
    if (!selectedConversation?.id) {
      // Close WebSocket if no conversation selected
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
      setMessages([]);
      return;
    }

    const conversationId = selectedConversation.id;
    const token = getAccessToken();

    if (!token) {
      console.error("No access token found for WebSocket connection");
      return;
    }

    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    // Reset reconnect attempts
    reconnectAttempts.current = 0;

    // Initial load - fetch messages via HTTP first
    fetchMessages(conversationId, false);

    // Connect WebSocket
    try {
      const wsUrl = getWebSocketUrl(conversationId);
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log("WebSocket connected for conversation", conversationId);
        setIsConnected(true);
        reconnectAttempts.current = 0;
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);

        // Attempt to reconnect (max 5 attempts)
        if (reconnectAttempts.current < 5 && selectedConversation?.id === conversationId) {
          reconnectAttempts.current += 1;
          reconnectTimeoutRef.current = setTimeout(() => {
            // Reconnect by triggering effect again
            if (selectedConversation?.id === conversationId) {
              // Reconnect logic
              const wsUrl = getWebSocketUrl(conversationId);
              wsRef.current = new WebSocket(wsUrl);
            }
          }, 3000 * reconnectAttempts.current); // Exponential backoff
        }
      };
    } catch (err) {
      console.error("Error creating WebSocket connection:", err);
      setIsConnected(false);
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
    };
  }, [selectedConversation?.id]);

  // Handle WebSocket messages
  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case "chat_message":
        // Replace temp message or add new message
        setMessages((prev) => {
          // Remove temp messages
          const filtered = prev.filter(msg => !msg.is_temp);
          // Check if message already exists
          const exists = filtered.some(msg => msg.id === data.message?.id);
          if (!exists) {
            return [...filtered, data.message];
          }
          return filtered;
        });

        // Update conversations list
        setConversations(prev => prev.map(conv => {
          if (conv.id === selectedConversation?.id) {
            return {
              ...conv,
              last_message: {
                content: data.message?.content || "",
                time_ago: "just now"
              }
            };
          }
          return conv;
        }));

        // Scroll to bottom when new message arrives (smooth scroll for new messages)
        setTimeout(() => scrollToBottom(false), 200);
        break;

      case "typing_indicator":
        if (data.is_typing && data.user_id !== (currentUser?.user_id || currentUser?.id)) {
          setTypingUsers(prev => ({
            ...prev,
            [data.user_id]: data.user_name || "Someone"
          }));

          // Clear typing after 3 seconds
          setTimeout(() => {
            setTypingUsers(prev => {
              const newTyping = { ...prev };
              delete newTyping[data.user_id];
              return newTyping;
            });
          }, 3000);
        } else {
          setTypingUsers(prev => {
            const newTyping = { ...prev };
            delete newTyping[data.user_id];
            return newTyping;
          });
        }
        break;

      case "message_edit":
        setMessages(prev => prev.map(msg =>
          msg.id === data.message_id
            ? { ...msg, content: data.content, is_edited: true, edited_at: data.edited_at }
            : msg
        ));
        break;

      case "message_delete":
        setMessages(prev => prev.map(msg =>
          msg.id === data.message_id
            ? { ...msg, is_deleted: true, display_content: "This message has been deleted" }
            : msg
        ));
        break;

      case "message_reaction":
        // Refresh messages to get updated reactions summary
        if (selectedConversation?.id) {
          fetchMessages(selectedConversation.id, true);
        }
        break;

      case "user_status":
        // Update online status if needed
        break;

      default:
        console.log("Unknown WebSocket message type:", data.type);
    }
  };

  // Fallback polling when WebSocket is not connected (reduced frequency)
  useEffect(() => {
    if (!selectedConversation?.id || isConnected) {
      // Don't poll if WebSocket is connected
      return;
    }

    // Only poll if WebSocket is not connected
    const interval = setInterval(() => {
      fetchMessages(selectedConversation.id, true);
    }, 10000); // Poll every 10 seconds when WebSocket is down

    return () => clearInterval(interval);
  }, [selectedConversation?.id, isConnected]);

  // Auto-select first conversation (only once when conversations first load)
  useEffect(() => {
    if (!hasInitialLoadRef.current && conversations.length > 0 && !selectedConversation) {
      hasInitialLoadRef.current = true;
      const firstConv = conversations[0];
      if (firstConv?.id) {
        setSelectedConversation(firstConv);
        setShowMessageView(true);
        fetchMessages(firstConv.id, false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations.length]); // Only run when conversations array length changes (first load)

  // Initial load - only once
  useEffect(() => {
    fetchConversations("", true); // Skip auto-select - handled by separate useEffect
    fetchUnreadCount();
  }, []); // Only run once on mount

  // Poll for unread count (separate from message polling)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000); // Poll every 30 seconds to reduce calls

    return () => clearInterval(interval);
  }, []); // Only run once on mount

  // Scroll to bottom when messages load initially (on refresh/page load)
  // Use useLayoutEffect to scroll BEFORE browser paint for instant scroll
  useLayoutEffect(() => {
    if (messages.length > 0 && selectedConversation && !loadingMessages && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      // Force instant scroll to bottom on initial load/refresh (no animation)
      // Temporarily disable smooth scroll
      container.style.scrollBehavior = 'auto';
      container.scrollTop = container.scrollHeight;
      hasScrolledInitialRef.current = true;
    }
  }, [selectedConversation?.id, loadingMessages]); // Scroll when conversation changes or loading finishes

  // Additional useEffect as backup - runs after render
  useEffect(() => {
    if (messages.length > 0 && selectedConversation && !loadingMessages && messagesContainerRef.current) {
      const container = messagesContainerRef.current;

      // Reset the flag when conversation changes
      if (!hasScrolledInitialRef.current) {
        container.style.scrollBehavior = 'auto';
        container.scrollTop = container.scrollHeight;
        hasScrolledInitialRef.current = true;
      }

      // Force scroll multiple times with increasing delays
      const scrollAttempts = [0, 50, 100, 200, 300, 500];
      const timeouts = scrollAttempts.map(delay =>
        setTimeout(() => {
          if (container) {
            container.style.scrollBehavior = 'auto';
            container.scrollTop = container.scrollHeight;
            // Restore smooth scroll after a moment
            if (delay === scrollAttempts[scrollAttempts.length - 1]) {
              setTimeout(() => {
                if (container) {
                  container.style.scrollBehavior = '';
                }
              }, 100);
            }
          }
        }, delay)
      );

      return () => {
        timeouts.forEach(clearTimeout);
      };
    }
  }, [selectedConversation?.id, loadingMessages, messages.length]); // Scroll when conversation changes, loading finishes, or messages change

  // Reset scroll flag when conversation changes
  useEffect(() => {
    hasScrolledInitialRef.current = false;
  }, [selectedConversation?.id]);

  // Scroll to bottom when new messages arrive (via WebSocket or polling)
  useEffect(() => {
    if (messages.length > 0 && selectedConversation && !loadingMessages && messagesContainerRef.current) {
      // Always scroll to bottom when new messages arrive (user expects to see new messages)
      // Use requestAnimationFrame for better timing
      requestAnimationFrame(() => {
        setTimeout(() => {
          scrollToBottom(false); // Smooth scroll for new messages
        }, 100);
      });
    }
  }, [messages.length]); // Scroll when new messages arrive

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (investDropdownRef.current && !investDropdownRef.current.contains(event.target)) {
        // Handle if needed
      }
      // Close reaction picker when clicking outside
      if (showReactionPicker && !event.target.closest('.reaction-picker-container')) {
        setShowReactionPicker(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showReactionPicker]);

  return (
    <div className="min-h-screen bg-[#F4F6F5] overflow-x-hidden">
      <main className="w-full px-4 sm:px-6 py-8">
        <div className="mb-6 sm:mb-8 mt-5">
          <h1 className="text-2xl sm:text-3xl font-medium text-[#0A2A2E] font-poppins-custom">Messages</h1>
          <p className="text-sm text-[#748A91] font-poppins-custom">
            Communicate with syndicate leads and support team
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-poppins-custom">{error}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Conversations List - Hidden on mobile when message view is shown */}
          <aside className={`bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-6 w-full lg:w-1/3 ${showMessageView ? "hidden lg:block" : "block"}`}>
            <div className="mb-4">
              <p className="text-md font-medium text-[#001D21] font-poppins-custom">
                Conversations
              </p>
            </div>
            <div className="mb-4 space-y-2">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full bg-[#F4F6F5] border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              {selectedConversation && (
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={messageSearchQuery}
                  onChange={(e) => {
                    setMessageSearchQuery(e.target.value);
                    searchMessages(e.target.value);
                  }}
                  className="w-full bg-[#F4F6F5] border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-[#748A91] font-poppins-custom">Loading conversations...</div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-[#748A91] font-poppins-custom">No conversations found</div>
              </div>
            ) : (
              <div className="space-y-3">
                {conversations.map((conversation) => {
                  // The conversation ID is at the top level: conversation.id
                  const conversationId = conversation.id;
                  if (!conversationId) {
                    console.error("Conversation missing ID:", conversation);
                  }

                  const isActive = selectedConversation?.id === conversationId;
                  const participantInfo = conversation.participant_info || conversation.other_participant || {};
                  const name = participantInfo.name || participantInfo.first_name || "Unknown";
                  const lastMessage = conversation.last_message || {};
                  const initials = participantInfo.initials || getInitials(name);

                  return (
                    <button
                      key={conversationId || `conv-${Math.random()}`}
                      onClick={() => handleConversationSelect(conversation)}
                      className={`w-full text-left border rounded-2xl px-4 py-3 transition-colors ${isActive ? "border-[#00F0C3] bg-[#F4FFFB]" : "border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]"
                        }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 flex-shrink-0 rounded-full bg-[#E5F1F0] flex items-center justify-center text-sm font-medium text-[#0A2A2E]">
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom truncate">{name}</p>
                            {conversation.unread_count > 0 && (
                              <span className="flex-shrink-0 bg-[#00F0C3] text-[#0A2A2E] text-xs font-semibold rounded-full px-2 py-0.5">
                                {conversation.unread_count}
                              </span>
                            )}
                            {!conversation.unread_count && lastMessage.time_ago && (
                              <span className="text-xs text-[#748A91] font-poppins-custom flex-shrink-0 whitespace-nowrap">
                                {lastMessage.time_ago}
                              </span>
                            )}
                          </div>
                          {lastMessage.content && (
                            <p className="text-xs text-[#748A91] font-poppins-custom mt-1 truncate">
                              {lastMessage.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </aside>

          {/* Message View - Hidden on mobile when conversations list is shown */}
          <section className={`bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-6 flex-1 flex flex-col min-h-[70vh] ${showMessageView ? "flex" : "hidden lg:flex"}`}>
            {!selectedConversation ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-[#748A91] font-poppins-custom">Select a conversation to start messaging</p>
              </div>
            ) : (
              <>
                {/* Mobile Back Button */}
                <button
                  onClick={() => setShowMessageView(false)}
                  className="lg:hidden flex items-center gap-2 mb-4 text-sm text-[#0A2A2E] font-poppins-custom hover:text-[#01373D]"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Back to Conversations
                </button>

                {/* Header */}
                <header className="flex items-center justify-between border-b border-[#E5E7EB] pb-4 mb-4 gap-4">
                  <div className="flex-1 min-w-0">
                    {(() => {
                      const participantInfo = selectedConversation.participant_info || selectedConversation.other_participant || {};
                      const name = participantInfo.name || participantInfo.first_name || "Unknown";
                      const role = participantInfo.role || selectedConversation.other_participant?.role || "User";
                      return (
                        <>
                          <h2 className="text-base sm:text-lg font-medium text-[#0A2A2E] font-poppins-custom truncate">{name}</h2>
                          <p className="text-xs text-[#748A91] font-poppins-custom truncate">
                            {role.charAt(0).toUpperCase() + role.slice(1)} · {selectedConversation.status || (isConnected ? "Online" : "Offline")}
                            {isConnected && (
                              <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                            )}
                          </p>
                        </>
                      );
                    })()}
                  </div>
                </header>

                {/* Messages */}
                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[calc(70vh-200px)] min-h-0" style={{ overflowX: 'hidden' }}>
                  {loadingMessages ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-sm text-[#748A91] font-poppins-custom">Loading messages...</div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-sm text-[#748A91] font-poppins-custom">No messages yet. Start the conversation!</div>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isOwn = message.sender?.id === currentUser?.user_id ||
                        (message.sender && currentUser && message.sender.id === currentUser.id);
                      const senderName = message.sender_name || message.sender?.name ||
                        `${message.sender?.first_name || ""} ${message.sender?.last_name || ""}`.trim() || "Unknown";
                      const displayContent = message.is_deleted ? "This message has been deleted" : (message.display_content || message.content);
                      const isEditing = editingMessage?.id === message.id;

                      return (
                        <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"} group`}>
                          <div
                            className={`relative max-w-[85%] sm:max-w-lg rounded-2xl px-4 py-3 text-sm font-poppins-custom shadow-sm break-words ${isOwn ? "bg-[#D7F8F0] text-[#0A2A2E]" : "bg-[#F4F6F5] text-[#0A2A2E]"
                              } ${message.is_deleted ? "opacity-60 italic" : ""}`}
                            onMouseEnter={() => setSelectedMessage(message.id)}
                            onMouseLeave={() => setSelectedMessage(null)}
                          >
                            {/* Reply Preview */}
                            {message.parent_message_preview && (
                              <div className="mb-2 pl-3 border-l-2 border-[#00F0C3] text-xs text-[#748A91]">
                                <div className="font-semibold text-[#0A2A2E]">
                                  Replying to {message.parent_message_preview.sender_name || "Message"}
                                </div>
                                <div className="truncate">{message.parent_message_preview.content}</div>
                              </div>
                            )}

                            {!isOwn && (
                              <p className="text-xs font-semibold mb-1 text-[#0A2A2E]">{senderName}</p>
                            )}

                            {/* Message Content */}
                            {isEditing ? (
                              <div className="space-y-2">
                                <textarea
                                  data-edit-id={message.id}
                                  defaultValue={message.content}
                                  className="w-full p-2 border border-[#00F0C3] rounded-lg text-sm"
                                  rows={3}
                                  ref={(el) => {
                                    if (el) {
                                      el.focus();
                                      el.select();
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && e.ctrlKey) {
                                      editMessage(message.id, e.target.value);
                                    }
                                    if (e.key === "Escape") {
                                      setEditingMessage(null);
                                    }
                                  }}
                                />
                                <div className="flex gap-2 text-xs">
                                  <button
                                    onClick={(e) => {
                                      const textarea = e.target.closest('div').previousElementSibling;
                                      if (textarea) editMessage(message.id, textarea.value);
                                    }}
                                    className="px-3 py-1 bg-[#00F0C3] text-[#0A2A2E] rounded-lg"
                                  >
                                    Save (Ctrl+Enter)
                                  </button>
                                  <button
                                    onClick={() => setEditingMessage(null)}
                                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg"
                                  >
                                    Cancel (Esc)
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="mb-2 break-words overflow-wrap-anywhere">
                                {displayContent}
                                {message.is_edited && !message.is_deleted && (
                                  <span className="ml-2 text-xs text-[#748A91] italic">(edited)</span>
                                )}
                              </p>
                            )}

                            {/* Attachments */}
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {message.attachments.map((attachment) => (
                                  <a
                                    key={attachment.id}
                                    href={attachment.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-2 bg-white/50 rounded-lg hover:bg-white/80 transition-colors"
                                  >
                                    {attachment.file_type === "image" && attachment.thumbnail_url ? (
                                      <img
                                        src={attachment.thumbnail_url}
                                        alt={attachment.file_name}
                                        className="w-16 h-16 object-cover rounded"
                                      />
                                    ) : (
                                      <div className="w-10 h-10 bg-[#E5F1F0] rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-[#0A2A2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium text-[#0A2A2E] truncate">{attachment.file_name}</p>
                                      <p className="text-xs text-[#748A91]">{attachment.file_type_display || attachment.file_type}</p>
                                    </div>
                                  </a>
                                ))}
                              </div>
                            )}

                            {/* Reactions */}
                            {message.reactions_summary && message.reactions_summary.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {message.reactions_summary.map((reaction, idx) => {
                                  const hasReacted = reaction.users?.some(u => u.id === (currentUser?.user_id || currentUser?.id));
                                  return (
                                    <button
                                      key={idx}
                                      onClick={() => hasReacted ? removeReaction(message.id, reaction.emoji) : addReaction(message.id, reaction.emoji)}
                                      className={`px-2 py-1 rounded-full text-xs border ${hasReacted
                                          ? "bg-[#00F0C3] border-[#00F0C3]"
                                          : "bg-white/50 border-gray-300 hover:bg-white"
                                        }`}
                                    >
                                      <span className="mr-1">{reaction.emoji}</span>
                                      <span>{reaction.count}</span>
                                    </button>
                                  );
                                })}
                                <button
                                  onClick={() => setShowReactionPicker(showReactionPicker === message.id ? null : message.id)}
                                  className="px-2 py-1 rounded-full text-xs border bg-white/50 border-gray-300 hover:bg-white"
                                >
                                  +
                                </button>
                              </div>
                            )}

                            {/* Reaction Picker */}
                            {showReactionPicker === message.id && (
                              <div className="reaction-picker-container absolute bottom-full left-0 mb-2 bg-white border border-gray-300 rounded-lg p-2 shadow-lg z-10 flex gap-1">
                                {["👍", "❤️", "😂", "😮", "😢", "🙏"].map((emoji) => (
                                  <button
                                    key={emoji}
                                    onClick={() => {
                                      addReaction(message.id, emoji);
                                      setShowReactionPicker(null);
                                    }}
                                    className="text-xl hover:scale-125 transition-transform p-1"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Message Actions (Edit, Delete, Reply) */}
                            {selectedMessage === message.id && !message.is_deleted && (
                              <div className="absolute top-2 right-2 flex gap-1 bg-white/90 rounded-lg p-1 shadow-md">
                                {isOwn && (
                                  <>
                                    <button
                                      onClick={() => setEditingMessage(message)}
                                      className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                                      title="Edit"
                                    >
                                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => deleteMessage(message.id)}
                                      className="p-1.5 hover:bg-red-50 rounded transition-colors"
                                      title="Delete"
                                    >
                                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => setReplyingTo(message)}
                                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                                  title="Reply"
                                >
                                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                  </svg>
                                </button>
                              </div>
                            )}

                            {/* Time and Read Receipts */}
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-[#748A91] whitespace-nowrap">
                                {message.time_ago || formatTime(message.created_at)}
                              </span>
                              {isOwn && message.read_by && message.read_by.length > 0 && (
                                <span className="text-xs text-[#748A91]">
                                  Read by {message.read_by.map(r => r.name).join(", ")}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Typing Indicator */}
                {Object.keys(typingUsers).length > 0 && (
                  <div className="text-xs text-[#748A91] font-poppins-custom py-2 px-2 italic">
                    {Object.values(typingUsers).join(", ")} {Object.keys(typingUsers).length === 1 ? "is" : "are"} typing...
                  </div>
                )}

                {/* Reply Indicator */}
                {replyingTo && (
                  <div className="mt-2 p-3 bg-[#F4FFFB] border border-[#00F0C3] rounded-lg flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#0A2A2E] mb-1">
                        Replying to {replyingTo.sender?.name || replyingTo.sender_name || "Message"}
                      </p>
                      <p className="text-xs text-[#748A91] truncate">{replyingTo.content}</p>
                    </div>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="ml-2 text-[#748A91] hover:text-[#0A2A2E]"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Selected Files Preview */}
                {selectedFiles.length > 0 && (
                  <div className="mt-2 p-3 bg-[#F4FFFB] border border-[#00F0C3] rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-[#0A2A2E]">
                        {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
                      </p>
                      <button
                        onClick={() => setSelectedFiles([])}
                        className="text-xs text-[#748A91] hover:text-[#0A2A2E]"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="space-y-1">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <svg className="w-5 h-5 text-[#0A2A2E] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-[#0A2A2E] truncate">{file.name}</p>
                              <p className="text-xs text-[#748A91]">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Input */}
                <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      multiple
                      className="hidden"
                      accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
                    />

                    <div className="relative flex-1">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-[#748A91] hover:text-[#0A2A2E] transition-colors"
                          title="Attach file"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.5" y="0.5" width="23" height="23" rx="6.5" fill="#00F0C3" />
                            <rect x="0.5" y="0.5" width="23" height="23" rx="6.5" stroke="#00F0C3" />
                            <path d="M16.7201 11.5268L12.1251 16.1218C11.5622 16.6847 10.7987 17.001 10.0026 17.001C9.20655 17.001 8.44307 16.6847 7.88014 16.1218C7.31722 15.5589 7.00098 14.7954 7.00098 13.9993C7.00098 13.2032 7.31722 12.4397 7.88014 11.8768L12.1651 7.59179C12.5404 7.21584 13.0497 7.00438 13.5809 7.00391C14.1121 7.00344 14.6217 7.21401 14.9976 7.58929C15.3736 7.96457 15.5851 8.47382 15.5855 9.00502C15.586 9.53622 15.3754 10.0458 15.0001 10.4218L10.7051 14.7068C10.5175 14.8944 10.263 14.9998 9.99764 14.9998C9.73228 14.9998 9.47779 14.8944 9.29014 14.7068C9.1025 14.5191 8.99709 14.2647 8.99709 13.9993C8.99709 13.7339 9.1025 13.4794 9.29014 13.2918L13.5351 9.05179" stroke="#001D21" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                      <textarea
                        ref={messageInputRef}
                        rows={2}
                        value={messageDraft}
                        onChange={(e) => {
                          setMessageDraft(e.target.value);
                          handleTyping();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        placeholder={replyingTo ? "Write a reply..." : "Write your message here..."}
                        disabled={sending}
                        className="w-full bg-[#F4F6F5] border border-gray-300 rounded-2xl pl-12 pr-4 pt-4  text-sm font-poppins-custom focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none disabled:opacity-50"
                        style={{ minHeight: '20px' }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={sendMessage}
                      disabled={sending || (!messageDraft.trim() && selectedFiles.length === 0)}
                      className="disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <SendIcon />
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Messages;
