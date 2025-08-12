import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Fab, Paper, TextField, Typography, IconButton,
  Zoom, Slide, Avatar, Divider, Badge, InputAdornment, 
  useTheme
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Minimize as MinimizeIcon
} from '@mui/icons-material';
// Use wasm-pack generated loader which initializes wasm internally
import { init, run_inference } from '../wasm/pkg/chat';
// Define interface for message objects
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
  isError?: boolean;
}

// Define interface for API response
interface ApiResponse {
  choices?: Array<{
    message: {
      content: string;
    };
  }>;
}

const ChatInterface: React.FC = () => {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const [minimized, setMinimized] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  // TODO: Provide API key securely (e.g., from server or env). For now, read from env or window
  const apiKey = (process.env.REACT_APP_OPENAI_API_KEY as string | undefined)
    || (window as any)?.ENV?.OPENAI_API_KEY
    || '';
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [hasNewMessages, setHasNewMessages] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize WASM module when component mounts
  useEffect(() => {
    const initWasm = async () => {
      try {
        await init();
        console.log('WASM module initialized');
      } catch (err) {
        console.error('Failed to initialize WASM module:', err);
      }
    };
    initWasm();
  }, []);

  // Focus input field when chat is opened
  useEffect(() => {
    if (open && !minimized) {
      inputRef.current?.focus();
    }
  }, [open, minimized]);

  // Initialize WebAssembly module
  useEffect(() => {
    // The wasm module is loaded automatically when imported
    console.log('WASM module loaded');
  }, []);

  const toggleChat = (): void => {
    setOpen(!open);
    if (!open) {
      setMinimized(false);
      setHasNewMessages(false);
    }
  };

  const toggleMinimize = (): void => {
    setMinimized(!minimized);
    if (!minimized) {
      setHasNewMessages(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent): Promise<void> => {
    if (e) e.preventDefault();
    if (message.trim() === '') return;

    // Add user message
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    const userInput = message;
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setMessage('');

    try {
      // Add a temporary "thinking" message
      const thinkingMessage: Message = {
        id: messages.length + 2,
        text: '...',
        sender: 'bot',
        timestamp: new Date(),
        isTyping: true
      };
      
      setMessages(prevMessages => [...prevMessages, thinkingMessage]);
      
      // Call the WebAssembly function
      const response = await run_inference(userInput, apiKey);
      let responseText = '';
      
      // Parse the JSON response from the API
      if (typeof response === 'object') {
        try {
          const typedResponse = response as ApiResponse;
          if (typedResponse.choices && typedResponse.choices.length > 0) {
            responseText = typedResponse.choices[0].message.content;
          } else {
            responseText = 'No response content received';
          }
        } catch (error) {
          console.error('Error parsing response:', error);
          responseText = 'Error processing response';
        }
      } else {
        responseText = String(response);
      }
      
      // Replace the thinking message with the actual response
      const botResponse: Message = {
        id: messages.length + 2,
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => prevMessages.map(msg => 
        msg.isTyping ? botResponse : msg
      ));
      
      if (minimized) setHasNewMessages(true);
    } catch (error) {
      console.error('Error calling WASM function:', error);
      
      // Show error message
      const errorMessage: Message = {
        id: messages.length + 2,
        text: 'Sorry, there was an error processing your request.',
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prevMessages => prevMessages.map(msg => 
        msg.isTyping ? errorMessage : msg
      ));
    }

    if (minimized) setHasNewMessages(true);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Button */}
      <Zoom in={!open} style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
        <Fab
          color="primary"
          onClick={toggleChat}
          sx={{
            width: 60,
            height: 60,
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.2)'
          }}
        >
          <Badge color="error" variant="dot" invisible={!hasNewMessages}>
            <ChatIcon />
          </Badge>
        </Fab>
      </Zoom>

      {/* Chat Window */}
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Paper
          elevation={6}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 340,
            height: minimized ? 'auto' : 480,
            borderRadius: 2,
            overflow: 'hidden',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              bgcolor: theme.palette.primary.main,
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ChatIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Support Chat</Typography>
            </Box>
            <Box>
              <IconButton size="small" onClick={toggleMinimize} sx={{ color: 'white', mr: 0.5 }}>
                <MinimizeIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={toggleChat} sx={{ color: 'white' }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Chat Body - only shown when not minimized */}
          {!minimized && (
            <>
              {/* Messages Area */}
              <Box
                sx={{
                  p: 2,
                  flexGrow: 1,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  bgcolor: theme.palette.background.default
                }}
              >
                {messages.map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      display: 'flex',
                      flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                      alignItems: 'flex-end',
                      gap: 1
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: msg.sender === 'bot' ? theme.palette.primary.main : theme.palette.secondary.main
                      }}
                    >
                      {msg.sender === 'bot' ? 'PR' : 'U'}
                    </Avatar>
                    <Box
                      sx={{
                        maxWidth: '70%',
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: msg.sender === 'user' ? theme.palette.primary.light : theme.palette.grey[100],
                        color: msg.sender === 'user' ? 'white' : 'inherit',
                        position: 'relative',
                        '&::after': msg.sender === 'user' ? {
                          content: '""',
                          position: 'absolute',
                          right: -8,
                          bottom: 8,
                          width: 0,
                          height: 0,
                          borderTop: '8px solid transparent',
                          borderLeft: `8px solid ${theme.palette.primary.light}`,
                          borderBottom: '8px solid transparent'
                        } : {
                          content: '""',
                          position: 'absolute',
                          left: -8,
                          bottom: 8,
                          width: 0,
                          height: 0,
                          borderTop: '8px solid transparent',
                          borderRight: `8px solid ${theme.palette.grey[100]}`,
                          borderBottom: '8px solid transparent'
                        }
                      }}
                    >
                      <Typography variant="body1">{msg.text}</Typography>
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5, textAlign: 'right', opacity: 0.7 }}>
                        {formatTime(msg.timestamp)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </Box>
              
              <Divider />
              
              {/* Message Input */}
              <Box
                component="form"
                onSubmit={handleSendMessage}
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: theme.palette.background.paper
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                  inputRef={inputRef}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          type="submit"
                          color="primary"
                          disabled={!message.trim()}
                        >
                          <SendIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 4
                    }
                  }}
                />
              </Box>
            </>
          )}
        </Paper>
      </Slide>
    </>
  );
};

export default ChatInterface;
