import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import { getVisitorRequests, ChatMessage } from "@/utils/localStorage";
import { Send, ArrowLeft, User } from "lucide-react";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

const ChatPage = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatInfo, setChatInfo] = useState<{ facultyName: string; visitorName: string } | null>(null);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!requestId) return;

    // Fetch visitor request metadata
    fetch(`${import.meta.env.VITE_API_URL}/api/visitors/request/${requestId}`)
      .then(res => {
        if (!res.ok) throw new Error("Request not found");
        return res.json();
      })
      .then(request => {
        if (!request || request.status !== 'approved') {
          toast.error("Chat not available");
          navigate("/");
          return;
        }

        setChatInfo({ facultyName: request.facultyName, visitorName: request.visitorName });

        if (!currentUser) {
          setCurrentUser(userType === 'faculty' ? request.facultyName : request.visitorName);
        }

        // Fetch chat history from MongoDB
        return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${requestId}`);
      })
      .then(res => res ? res.json() : null)
      .then(data => {
        if (data && data.messages) {
          setMessages(data.messages);
        }
      })
      .catch(err => {
        console.error("Error fetching chat data:", err);
        toast.error("Failed to load chat details.");
        navigate("/");
      });
  }, [requestId, navigate, currentUser, userType]);

  useEffect(() => {
    if (!requestId) return;

    const newSocket = io(`${import.meta.env.VITE_API_URL}`);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      newSocket.emit("join_room", requestId);
    });

    newSocket.on("receive_message", (message: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [requestId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !requestId) return;

    const messageText = newMessage.trim();

    const messageObj: ChatMessage = {
      sender: currentUser,
      text: messageText,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    if (socket) {
      socket.emit("send_message", { ...messageObj, roomId: requestId });
    }

    // Add instantly to UI
    setMessages(prev => [...prev, messageObj]);
    setNewMessage("");
  };

  if (!chatInfo) return null;

  const otherUser = currentUser === chatInfo.visitorName ? chatInfo.facultyName : chatInfo.visitorName;

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-4 flex-1 flex flex-col max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/faculty-dashboard")}
          className="mb-4 self-start"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="flex-1 flex flex-col">
          <CardHeader className="border-b bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {otherUser.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{otherUser}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Chatting as: {currentUser}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-center">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              <>
                {messages.map((message, index) => {
                  const isCurrentUser = message.sender === currentUser;
                  return (
                    <div
                      key={index}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${isCurrentUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                          }`}
                      >
                        <p className="text-sm font-medium mb-1">{message.sender}</p>
                        <p className="break-words">{message.text}</p>
                        <p className={`text-xs mt-1 ${isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </CardContent>

          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;
