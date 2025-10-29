import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import SuperAntCharacter from '@/components/SuperAntCharacter';

const FloatingAnt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Skilly, your friendly superhero friend to help you! 🐜 Ready to march towards your perfect job match?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Handle scroll to show/hide bee
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Show bee after scrolling 200px, hide when near bottom
      if (scrollY > 200 && scrollY < document.body.scrollHeight - windowHeight - 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-responses for the chatbot
  const getBotResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('job') || message.includes('career') || message.includes('position')) {
      return "🚀 Let's march towards your dream job! I specialize in 16 tech sectors including AI/ML, Web Development, Data Science, Cybersecurity, and more. What type of role gets your antennae twitching? I can guide you to our careers page!";
    } else if (message.includes('hire') || message.includes('recruit') || message.includes('talent')) {
      return "💼 Ready to build your dream team? Our AI-powered colony reduces time-to-hire by 47% while improving candidate quality! We offer:\n• AI-powered candidate matching\n• Automated screening\n• 16 tech specializations\n• CRM for recruitment teams\n\nWant to see our ant-farm in action with a demo?";
    } else if (message.includes('cv') || message.includes('resume')) {
      return "📄 Upload your CV and watch me work my ant-magic! Our system will:\n• Analyze your skills with precision\n• Match you with perfect opportunities\n• Notify you of new positions\n• Optimize your profile visibility\n\nShall I march you to the upload page?";
    } else if (message.includes('contact') || message.includes('phone') || message.includes('email') || message.includes('address')) {
      return "📍 Here's our ant-hill location:\n\n📧 Email: hr@skilltude.com\n📞 Phone: +91 9986704400\n🏢 Address: HD-193, WeWork, Embassy TechVillage, Bellandur, Bengaluru, Karnataka 560103\n\nOur colony is ready to help you succeed!";
    } else if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('good')) {
      return "👋 Hey there! I'm Skilly, your friendly superhero friend to help you! I'm here to assist you with:\n• Finding your dream job\n• Hiring top talent\n• Learning about our services\n• Answering any questions\n\nWhat adventure shall we embark on today?";
    } else if (message.includes('services') || message.includes('what do you do') || message.includes('about')) {
      return "🎯 SkillTude is your AI-powered recruitment colony! We offer:\n\n🔹 For Job Seekers:\n• Smart job matching\n• CV optimization\n• Career guidance\n\n🔹 For Employers:\n• AI candidate screening\n• Recruitment automation\n• CRM platform\n• 16 tech specializations\n\nWhich path interests you most?";
    } else if (message.includes('ai') || message.includes('artificial intelligence') || message.includes('technology')) {
      return "🤖 Our AI technology is what makes our colony special! We use advanced algorithms for:\n• Intelligent candidate-job matching\n• Automated resume screening\n• Predictive hiring analytics\n• Bias-free recruitment\n\nWant to see how our AI can transform your hiring process?";
    } else if (message.includes('price') || message.includes('cost') || message.includes('pricing')) {
      return "💰 We offer flexible pricing plans for different colony sizes! Our solutions provide excellent ROI by reducing hiring time and improving candidate quality. Contact our team at hr@skilltude.com for a personalized quote and demo!";
    } else if (message.includes('demo') || message.includes('trial')) {
      return "🎬 I'd love to show you our ant-farm in action! We offer free demos where you can see:\n• Live AI matching\n• Platform walkthrough\n• Custom setup for your needs\n• ROI calculations\n\nShall I connect you with our demo team?";
    } else if (message.includes('thank') || message.includes('thanks')) {
      return "🐜 You're ant-solutely welcome! I'm always here to help. Feel free to ask me anything about jobs, hiring, or SkillTude's services. Have an ant-astic day! ✨";
    } else {
      return "🤔 That's interesting! I'm here to help with all things recruitment - whether you're marching towards your next career move or building your dream team. Try asking me about:\n• Job opportunities\n• Our AI technology\n• Hiring services\n• Contact information\n\nWhat would you like to explore? 🐜";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user' as const,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        sender: 'bot' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Bee Character */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
      >
        {/* Chat Window */}
        {isChatOpen && (
          <div className="absolute bottom-32 right-0 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col animate-in slide-in-from-bottom-5 duration-300">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
                  <img 
                    src="/images/hello1.svg"
                    alt="Skilly" 
                    className="w-16 h-16 object-cover scale-125"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Skilly</h3>
                  <p className="text-sm opacity-90">Your AI Recruitment Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-bl-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <div className="text-xs text-gray-500 mb-2">Quick actions:</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setInputMessage("I'm looking for a job")}
                    className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs hover:bg-teal-100 transition-colors"
                  >
                    🔍 Find Jobs
                  </button>
                  <button
                    onClick={() => setInputMessage("I want to hire talent")}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs hover:bg-blue-100 transition-colors"
                  >
                    💼 Hire Talent
                  </button>
                  <button
                    onClick={() => setInputMessage("Tell me about your services")}
                    className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs hover:bg-purple-100 transition-colors"
                  >
                    ℹ️ Our Services
                  </button>
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about jobs or hiring..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white p-2 rounded-xl transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ant Character Button - Much Larger */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="relative group"
        >
          {/* Static - no bouncing */}
          <div className="hover:scale-105 transition-transform duration-300">
            <div className="w-28 h-28 bg-gradient-to-br from-teal-400 via-teal-500 to-orange-500 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center relative overflow-hidden border-4 border-white">
              {/* Perfect size for chatbot circle */}
              <div className="w-32 h-32 scale-110">
                <img 
                  src="/images/hello1.svg"
                  alt="Skilly" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Notification dot */}
              {!isChatOpen && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center animate-pulse">
                  <MessageCircle size={14} className="text-white" />
                </div>
              )}
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400/30 to-orange-400/30 animate-pulse"></div>
            </div>
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-4 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white text-base rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg transform group-hover:scale-105">
            <div className="flex items-center gap-3">
              <span>Chat with Skilly!</span>
              <span className="text-xl">🐜</span>
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-teal-600"></div>
          </div>
        </button>
      </div>
    </>
  );
};

export default FloatingAnt;