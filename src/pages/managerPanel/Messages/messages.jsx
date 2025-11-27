import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ShareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 10.8333C15.9205 10.8333 16.6667 10.0872 16.6667 9.16667C16.6667 8.24619 15.9205 7.5 15 7.5C14.0795 7.5 13.3333 8.24619 13.3333 9.16667C13.3333 10.0872 14.0795 10.8333 15 10.8333Z" stroke="#748A91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 7.5C5.92047 7.5 6.66667 6.75381 6.66667 5.83333C6.66667 4.91286 5.92047 4.16667 5 4.16667C4.07953 4.16667 3.33333 4.91286 3.33333 5.83333C3.33333 6.75381 4.07953 7.5 5 7.5Z" stroke="#748A91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 15.8333C5.92047 15.8333 6.66667 15.0871 6.66667 14.1667C6.66667 13.2462 5.92047 12.5 5 12.5C4.07953 12.5 3.33333 13.2462 3.33333 14.1667C3.33333 15.0871 4.07953 15.8333 5 15.8333Z" stroke="#748A91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.08333 6.04167L12.9167 8.125M7.08333 13.4583L12.9167 11.375" stroke="#748A91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SendIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="#00F0C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
  const hasInitialLoadRef = useRef(false);
  const hasScrolledInitialRef = useRef(false);
  const wsRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);

  // Get API URL
  const getApiUrl = () => {
    const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
    return `${API_URL.replace(/\/$/, "")}`;
  };

  // Get WebSocket URL
  const getWebSocketUrl = (conversationId) => {
    const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
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

  // Send message via WebSocket or HTTP fallback
  const sendMessage = async () => {
    if (!messageDraft.trim() || !selectedConversation || sending) return;

    const messageContent = messageDraft.trim();
    const conversationId = selectedConversation.id;

    // Try WebSocket first if connected
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && isConnected) {
      try {
        setSending(true);
        setError("");
        
        // Send via WebSocket
        wsRef.current.send(JSON.stringify({
          type: "chat_message",
          content: messageContent,
          parent_message_id: null
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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F6F5] overflow-x-hidden">
      <main className="w-full px-4 sm:px-6 py-8">
        <div className="mb-6 sm:mb-8 mt-5">
          <h1 className="text-2xl sm:text-3xl font-medium text-[#0A2A2E] font-poppins-custom">Messages</h1>
          <p className="text-sm text-[#748A91] font-poppins-custom">
            Communicate with investors and support team
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
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full bg-[#F4F6F5] border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
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
                      className={`w-full text-left border rounded-2xl px-4 py-3 transition-colors ${
                        isActive ? "border-[#00F0C3] bg-[#F4FFFB]" : "border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]"
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
                      
                      return (
                        <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[85%] sm:max-w-lg rounded-2xl px-4 py-3 text-sm font-poppins-custom shadow-sm break-words ${
                              isOwn ? "bg-[#D7F8F0] text-[#0A2A2E]" : "bg-[#F4F6F5] text-[#0A2A2E]"
                            }`}
                          >
                            {!isOwn && (
                              <p className="text-xs font-semibold mb-1 text-[#0A2A2E]">{senderName}</p>
                            )}
                            <p className="mb-2 break-words overflow-wrap-anywhere">
                              {message.content}
                            </p>
                            <span className="text-xs text-[#748A91] whitespace-nowrap">
                              {message.time_ago || formatTime(message.created_at)}
                            </span>
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

                {/* Message Input */}
                <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <textarea
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
                        placeholder="Write your message here..."
                        disabled={sending}
                        className="w-full bg-[#F4F6F5] border border-gray-300 rounded-2xl pl-12 pr-4 flex-1 align-middle text-sm font-poppins-custom focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none disabled:opacity-50"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <ShareIcon />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={sendMessage}
                      disabled={sending || !messageDraft.trim()}
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
