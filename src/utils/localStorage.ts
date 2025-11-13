// localStorage helper functions for managing visitor requests, faculty data, and chats

export interface Faculty {
  id: number;
  name: string;
  dept: string;
}

export interface VisitorRequest {
  id: string;
  visitorName: string;
  mobile: string;
  facultyName: string;
  dept: string;
  reason: string;
  status: 'pending' | 'approved' | 'hold' | 'declined';
  createdAt: string;
}

export interface ChatMessage {
  sender: string;
  text: string;
  time: string;
}

export interface Chat {
  facultyName: string;
  visitorName: string;
  requestId: string;
  messages: ChatMessage[];
}

// Initialize dummy faculty data
const dummyFaculty: Faculty[] = [
  { id: 1, name: "Prof. Shital Ghule", dept: "IT" },
  { id: 2, name: "Dr. Jyoti Surve", dept: "IT" },
  { id: 3, name: "Prof. Kimi Ramteke", dept: "CS" },
  { id: 4, name: "Dr. Shital Wadgavane", dept: "CS" },
  { id: 5, name: "Prof. V. Jadhav", dept: "ENTC" },
  { id: 6, name: "Dr. N. Shinde", dept: "ENTC" },
];

export const initializeData = () => {
  if (!localStorage.getItem('faculty')) {
    localStorage.setItem('faculty', JSON.stringify(dummyFaculty));
  }
  if (!localStorage.getItem('visitorRequests')) {
    localStorage.setItem('visitorRequests', JSON.stringify([]));
  }
  if (!localStorage.getItem('chats')) {
    localStorage.setItem('chats', JSON.stringify([]));
  }
};

export const getFaculty = (): Faculty[] => {
  const data = localStorage.getItem('faculty');
  return data ? JSON.parse(data) : dummyFaculty;
};

export const getFacultyByDept = (dept: string): Faculty[] => {
  return getFaculty().filter(f => f.dept === dept);
};

export const getVisitorRequests = (): VisitorRequest[] => {
  const data = localStorage.getItem('visitorRequests');
  return data ? JSON.parse(data) : [];
};

export const addVisitorRequest = (request: Omit<VisitorRequest, 'id' | 'createdAt'>): VisitorRequest => {
  const requests = getVisitorRequests();
  const newRequest: VisitorRequest = {
    ...request,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  requests.push(newRequest);
  localStorage.setItem('visitorRequests', JSON.stringify(requests));
  return newRequest;
};

export const updateRequestStatus = (requestId: string, status: VisitorRequest['status']) => {
  const requests = getVisitorRequests();
  const updatedRequests = requests.map(req => 
    req.id === requestId ? { ...req, status } : req
  );
  localStorage.setItem('visitorRequests', JSON.stringify(updatedRequests));
  
  // If approved, initialize chat
  if (status === 'approved') {
    const request = requests.find(r => r.id === requestId);
    if (request) {
      initializeChat(request.facultyName, request.visitorName, requestId);
    }
  }
};

export const getRequestsByFaculty = (facultyName: string): VisitorRequest[] => {
  return getVisitorRequests().filter(req => req.facultyName === facultyName);
};

export const getChats = (): Chat[] => {
  const data = localStorage.getItem('chats');
  return data ? JSON.parse(data) : [];
};

export const getChat = (requestId: string): Chat | undefined => {
  return getChats().find(chat => chat.requestId === requestId);
};

export const initializeChat = (facultyName: string, visitorName: string, requestId: string) => {
  const chats = getChats();
  const existingChat = chats.find(c => c.requestId === requestId);
  
  if (!existingChat) {
    const newChat: Chat = {
      facultyName,
      visitorName,
      requestId,
      messages: [],
    };
    chats.push(newChat);
    localStorage.setItem('chats', JSON.stringify(chats));
  }
};

export const addChatMessage = (requestId: string, sender: string, text: string) => {
  const chats = getChats();
  const chatIndex = chats.findIndex(c => c.requestId === requestId);
  
  if (chatIndex !== -1) {
    const message: ChatMessage = {
      sender,
      text,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    chats[chatIndex].messages.push(message);
    localStorage.setItem('chats', JSON.stringify(chats));
  }
};
