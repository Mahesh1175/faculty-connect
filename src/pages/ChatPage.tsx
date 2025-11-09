import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import { getChat, getVisitorRequests, addChatMessage, ChatMessage } from "@/utils/localStorage";
import { Send, ArrowLeft, User } from "lucide-react";
import toast from "react-hot-toast";

const ChatPage = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatInfo, setChatInfo] = useState<{ facultyName: string; visitorName: string } | null>(null);
  const [currentUser, setCurrentUser] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!requestId) return;

    const chat = getChat(requestId);
    const request = getVisitorRequests().find(r => r.id === requestId);

    if (!chat || !request || request.status !== 'approved') {
      toast.error("Chat not available");
      navigate("/");
      return;
    }

    setChatInfo({ facultyName: chat.facultyName, visitorName: chat.visitorName });
    setMessages(chat.messages);
    // For demo, let user choose their role
    if (!currentUser) {
      setCurrentUser(chat.visitorName); // Default to visitor
    }
  }, [requestId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !requestId) return;

    addChatMessage(requestId, currentUser, newMessage.trim());
    
    // Reload messages
    const chat = getChat(requestId);
    if (chat) {
      setMessages(chat.messages);
    }
    
    setNewMessage("");
  };

  const switchUser = () => {
    if (!chatInfo) return;
    setCurrentUser(currentUser === chatInfo.visitorName ? chatInfo.facultyName : chatInfo.visitorName);
    toast.success(`Switched to ${currentUser === chatInfo.visitorName ? chatInfo.facultyName : chatInfo.visitorName}`);
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
              <Button variant="outline" size="sm" onClick={switchUser}>
                <User className="h-4 w-4 mr-2" />
                Switch User
              </Button>
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
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          isCurrentUser
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
