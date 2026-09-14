import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Phone, 
  MessageCircle, 
  Shield, 
  Package,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessage, LeadPriority } from '../types';

interface AIChatbotProps {
  onNavigate: (route: string) => void;
}

export const AIChatbot: React.FC<AIChatbotProps> = () => {
  const { 
    settings, 
    chatOpen, 
    setChatOpen, 
    chatPrefill, 
    currentLanguage, 
    setLanguage, 
    openBulkModal,
    dict
  } = useApp();

  const getInitialMessage = (lang: 'en' | 'bn' | 'hi'): ChatMessage => {
    switch (lang) {
      case 'bn':
        return {
          id: 'welcome-bn',
          sender: 'bot',
          text: `নমস্কার! আমি জিত প্রাইম সহকারী। জিত প্রাইম এমপিসি কোম্পানির হস্তনির্মিত মাটির গয়না, টেরাকোটা ডেকোরেশন, পাইকারি রেট, পূজা কালেকশন এবং সরকারি টেন্ডার সরবরাহ সম্পর্কে আমি আপনাকে সাহায্য করতে পারি। আজ আপনাকে কীভাবে সাহায্য করতে পারি?`,
          language: 'bn',
          quickActions: [
            'পণ্য ক্যাটালগ দেখুন',
            'বাল্ক অর্ডারের কোটেশন চাই',
            'মাটির গহনা কালেকশন',
            'মহিলারা কীভাবে যুক্ত হবেন',
            'মনোজিত দে-র সাথে কথা বলুন'
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      case 'hi':
        return {
          id: 'welcome-hi',
          sender: 'bot',
          text: `नमस्ते! मैं जीत प्राइम सहायक हूँ। जीत प्राइम एमपीसी कंपनी के हस्तनिर्मित मिट्टी के आभूषण, टेराकोटा कला, थोक दरें, पूजा संग्रह और सरकारी टेंडर आपूर्ति के संबंध में मैं आपकी सहायता कर सकता हूँ। आज मैं आपकी क्या मदद कर सकता हूँ?`,
          language: 'hi',
          quickActions: [
            'उत्पाद कैटलॉग देखें',
            'थोक ऑर्डर कोटेशन चाहिए',
            'मिट्टी के आभूषण',
            'महिलाएं कैसे जुड़ सकती हैं',
            'मनोजित डे से बात करें'
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      case 'en':
      default:
        return {
          id: 'welcome-en',
          sender: 'bot',
          text: `Hello! I am Jit Prime Assistant for JIT PRIME MPC COMPANY. I can help you with handcrafted Hasta Shilpa products, terracotta jewellery, wholesale pricing, MOQ, Puja collections, and government tender supplies. How may I assist you today?`,
          language: 'en',
          quickActions: [
            'Show Products',
            'I Need a Bulk Order',
            'Terracotta Jewellery',
            'How Women Can Join',
            'Talk to Monojit Dey'
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([getInitialMessage(currentLanguage)]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeIntent, setActiveIntent] = useState<LeadPriority>('LOW');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const primaryPhone = settings?.phone || '+91 82405 85219';
  const ownerName = settings?.ownerName || 'Monojit Dey';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (chatOpen) {
      scrollToBottom();
    }
  }, [messages, chatOpen, loading]);

  // When language changes, update welcome message if user hasn't started typing
  useEffect(() => {
    if (messages.length === 1 && messages[0].sender === 'bot') {
      setMessages([getInitialMessage(currentLanguage)]);
    }
  }, [currentLanguage]);

  // Handle external prefill from context
  useEffect(() => {
    if (chatPrefill && chatOpen) {
      handleSend(chatPrefill);
    }
  }, [chatPrefill, chatOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      language: currentLanguage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const history = messages.map(m => ({ sender: m.sender, text: m.text }));
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language: currentLanguage,
          history
        })
      });

      if (!response.ok) {
        throw new Error('Chat service error');
      }

      const data = await response.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || (currentLanguage === 'bn' ? 'ধন্যবাদ। আপনার বার্তার জন্য মনোজিত দে বা আমাদের কর্মশালার দল শীঘ্রই আপনার সাথে যোগাযোগ করবে।' : currentLanguage === 'hi' ? 'धन्यवाद। आपकी पूछताछ के लिए हमारी टीम जल्द ही आपसे संपर्क करेगी।' : 'Thank you. For customized bulk orders, please feel free to request a quotation or contact Monojit Dey directly.'),
        products: data.products || [],
        intentScore: data.intentScore || 'MEDIUM',
        quickActions: data.quickActions || (currentLanguage === 'bn' ? ['বাল্ক কোটেশন চান?', 'অন্যান্য পণ্য দেখুন'] : currentLanguage === 'hi' ? ['थोक कोटेशन चाहिए?', 'अन्य उत्पाद देखें'] : ['Request Bulk Quote', 'View Products']),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      if (data.intentScore === 'VERY HIGH') {
        setActiveIntent('VERY HIGH');
      }

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback response
      const fallbackText = currentLanguage === 'bn'
        ? `ধন্যবাদ! আপনি সরাসরি মনোজিত দে-র সাথে হোয়াটসঅ্যাপে (+91 82405 85219) কথা বলতে পারেন অথবা ওয়েবসাইটে 'বাল্ক কোটেশন' ফর্মটি পূরণ করতে পারেন।`
        : currentLanguage === 'hi'
        ? `धन्यवाद! आप सीधे मनोजित डे से व्हाट्सएप पर (+91 82405 85219) संपर्क कर सकते हैं या थोक कोटेशन का अनुरोध कर सकते हैं।`
        : `Thank you! You can directly reach Monojit Dey on WhatsApp at +91 82405 85219 or submit a Bulk Quote Request right on this page.`;

      const botMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!chatOpen && (
        <button
          type="button"
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-3.5 bg-linear-to-r from-[#0B1A30] to-[#142C4F] text-white rounded-full shadow-2xl hover:shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-2.5 border-2 border-amber-400 group cursor-pointer"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0B1A30] animate-pulse"></span>
          </div>
          <span className="font-extrabold text-xs sm:text-sm text-amber-300">
            {dict.chatbot_title}
          </span>
        </button>
      )}

      {/* Main Chat Window */}
      {chatOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[440px] h-[92vh] sm:h-[620px] max-h-[92vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          
          {/* Header */}
          <div className="bg-linear-to-r from-[#0B1A30] to-[#142C4F] text-white p-4 border-b-2 border-amber-400 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md shrink-0">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-white font-serif-heading">
                    {dict.chatbot_title}
                  </h3>
                  {activeIntent === 'VERY HIGH' && (
                    <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded">
                      Priority
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-amber-300">
                  {currentLanguage === 'bn' ? 'হস্তশিল্প ও বাল্ক অর্ডার সহায়িকা' : currentLanguage === 'hi' ? 'हस्तशिल्प व थोक ऑर्डर सहायक' : 'Craft, Product & Bulk Assistant'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language switcher inside chat */}
              <div className="flex items-center bg-[#071324] rounded-md p-0.5 text-[10px] border border-slate-700">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${currentLanguage === 'en' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'}`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('bn')}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${currentLanguage === 'bn' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'}`}
                >
                  বাংলা
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${currentLanguage === 'hi' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'}`}
                >
                  हिन्दी
                </button>
              </div>

              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Handoff Banner */}
          <div className="bg-[#FAF5E9] border-b border-amber-200/80 px-3 py-1.5 flex items-center justify-between text-xs text-slate-700 shrink-0">
            <span className="font-semibold text-amber-900 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-amber-700" />
              {dict.direct_call}:
            </span>
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${primaryPhone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline"
              >
                <MessageCircle className="w-3 h-3" />
                <span>WhatsApp {ownerName}</span>
              </a>
              <span>&bull;</span>
              <a
                href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-800 hover:underline"
              >
                <Phone className="w-3 h-3 text-amber-600" />
                <span>Call</span>
              </a>
            </div>
          </div>

          {/* Chat Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#0B1A30] text-white rounded-tr-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Render Product Cards inside chat if any */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-3 space-y-2 border-t border-slate-100 pt-2.5">
                      <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {currentLanguage === 'bn' ? 'প্রাসঙ্গিক হস্তশিল্প পণ্য:' : currentLanguage === 'hi' ? 'प्रासंगिक हस्तशिल्प उत्पाद:' : 'Relevant Products from Catalogue:'}
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {msg.products.map(p => (
                          <div 
                            key={p.id}
                            className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center gap-2.5 hover:border-amber-400 transition-colors"
                          >
                            {p.primaryImage ? (
                              <img 
                                src={p.primaryImage} 
                                alt={p.name} 
                                className="w-12 h-12 rounded object-cover shrink-0" 
                              />
                            ) : (
                              <div className="w-12 h-12 rounded bg-amber-100 flex items-center justify-center text-amber-800 text-xs font-bold shrink-0">
                                Craft
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-xs text-slate-900 truncate">
                                {p.name}
                              </h5>
                              <div className="text-[11px] text-slate-500 flex items-center gap-2">
                                <span>MOQ: {p.moq || 50} pcs</span>
                                {p.bulkPrice && <span className="font-semibold text-emerald-700">₹{p.bulkPrice}/pc</span>}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setChatOpen(false);
                                openBulkModal(p as any);
                              }}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] rounded shrink-0 shadow-xs cursor-pointer"
                            >
                              Quote
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* High-Intent Natural Action Suggestion */}
                  {msg.sender === 'bot' && (msg.intentScore === 'VERY HIGH' || msg.text.toLowerCase().includes('quotation') || msg.text.toLowerCase().includes('কোটেশন')) && (
                    <div className="mt-3 p-2.5 bg-amber-50/90 border border-amber-300 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-950">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>
                          {currentLanguage === 'bn' 
                            ? 'আপনি কি একটি কাস্টমাইজড বাল্ক কোটেশন পেতে চান?' 
                            : currentLanguage === 'hi'
                            ? 'क्या आप थोक कोटेशन का अनुरोध करना चाहते हैं?'
                            : 'Would you like to request a customized bulk quotation?'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            setChatOpen(false);
                            openBulkModal(msg.products?.[0] as any);
                          }}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] rounded-lg shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>{dict.nav_get_quote}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                        <a
                          href={`https://wa.me/${primaryPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${ownerName}, I would like to inquire about a bulk quotation for handcrafted products.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-xs transition-colors flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp {ownerName}</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Render Quick Actions suggestions inside message */}
                  {msg.quickActions && msg.quickActions.length > 0 && (
                    <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-2">
                      <span className="text-[10px] text-slate-400 font-semibold block">
                        {currentLanguage === 'bn' ? 'প্রস্তাবিত বিষয়সমূহ:' : currentLanguage === 'hi' ? 'सुझाए गए विषय:' : 'Suggested Questions:'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.quickActions.map((action, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSend(action)}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-[#0B1A30] border border-amber-200 text-[11px] font-semibold rounded-full transition-colors cursor-pointer"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <span className="block text-[10px] text-slate-400 text-right mt-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs py-2 bg-white px-3 rounded-lg border border-slate-200 w-fit shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                <span>
                  {currentLanguage === 'bn' 
                    ? 'ক্যাটালগ এবং তথ্য পরীক্ষা করা হচ্ছে...' 
                    : currentLanguage === 'hi'
                    ? 'कैटलॉग और जानकारी जांची जा रही है...'
                    : 'Checking catalogue and product database...'}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={
                  currentLanguage === 'bn'
                    ? "আপনার প্রশ্ন এখানে লিখুন..."
                    : currentLanguage === 'hi'
                    ? "अपना प्रश्न यहाँ लिखें..."
                    : "Ask about jewellery, bulk orders, prices..."
                }
                value={inputText || ''}
                onChange={(e) => setInputText(e.target.value)}
                disabled={loading}
                className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                className="p-2.5 bg-[#0B1A30] hover:bg-[#152E54] text-amber-400 rounded-xl transition-colors disabled:opacity-40 cursor-pointer shrink-0 shadow-xs"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1">
              <span>English &bull; বাংলা &bull; हिन्दी</span>
              <span>All Govt. Tender &bull; Hasta Shilpa</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
