import { GoogleGenAI } from '@google/genai';
import { readDb, writeDb } from './db.js';
import { BulkEnquiryLead, LeadPriority, Product } from '../src/types.js';

// Detect language from text
export function detectLanguage(text: string): 'en' | 'bn' | 'hi' {
  const bengaliRegex = /[\u0980-\u09FF]/;
  const hindiRegex = /[\u0900-\u097F]/;
  const lower = text.toLowerCase();

  if (bengaliRegex.test(text)) {
    return 'bn';
  }
  if (hindiRegex.test(text)) {
    return 'hi';
  }
  // Detect common Banglish / Bengali transliterations
  if (
    lower.includes('apnader') || 
    lower.includes('amader') || 
    lower.includes('koto') || 
    lower.includes('dam') || 
    lower.includes('kothay') || 
    lower.includes('thikana') || 
    lower.includes('gohona') || 
    lower.includes('shilpa') || 
    lower.includes('ache') || 
    lower.includes('ki ki') || 
    lower.includes('parbo') ||
    lower.includes('deben') ||
    lower.includes('khobor')
  ) {
    return 'bn';
  }
  return 'en';
}

// Lead scoring logic: ONLY mark HIGH/VERY HIGH for genuine order/quote intent
export function calculateIntentScore(message: string): LeadPriority {
  const lower = message.toLowerCase();
  
  // Very high: specific numbers, countries, deadlines, export, quotation
  if (
    /\b(\d{3,}|\d+\s*(pcs|pieces|sets|units|boxes|cartons))\b/i.test(lower) ||
    ((lower.includes('export') || lower.includes('import') || lower.includes('shipping')) && (lower.includes('uk') || lower.includes('usa') || lower.includes('dubai') || lower.includes('uae') || lower.includes('canada') || lower.includes('container'))) ||
    (lower.includes('tender') && (lower.includes('quotation') || lower.includes('bid') || lower.includes('rfp'))) ||
    (lower.includes('purchase order') || lower.includes('want to order 100') || lower.includes('want to order 500'))
  ) {
    return 'VERY HIGH';
  }

  // High: explicit bulk purchase requests, formal quotation requests
  if (
    lower.includes('request a quote') ||
    lower.includes('send me quote') ||
    lower.includes('send quotation') ||
    lower.includes('need a quotation') ||
    lower.includes('give me a quote') ||
    lower.includes('want to place order') ||
    lower.includes('place a bulk order') ||
    lower.includes('wholesale supplier for my shop') ||
    lower.includes('resell your products')
  ) {
    return 'HIGH';
  }

  // Medium: pricing, custom orders, general bulk curiosity
  if (
    lower.includes('bulk') ||
    lower.includes('wholesale') ||
    lower.includes('moq') ||
    lower.includes('minimum order') ||
    lower.includes('price') ||
    lower.includes('rate') ||
    lower.includes('cost') ||
    lower.includes('dam') ||
    lower.includes('custom') ||
    lower.includes('sample')
  ) {
    return 'MEDIUM';
  }

  return 'LOW';
}

// Extract contact details if provided
export function extractLeadDetails(message: string): { phone?: string; email?: string } {
  const phoneMatch = message.match(/(?:\+91[\s-]?)?[6789]\d{9}/);
  const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return {
    phone: phoneMatch ? phoneMatch[0] : undefined,
    email: emailMatch ? emailMatch[0] : undefined
  };
}

export async function generateChatResponse(
  userMessage: string, 
  preferredLanguage?: 'en' | 'bn' | 'hi', 
  conversationHistory?: { sender: 'user' | 'bot'; text: string }[]
) {
  const db = readDb();
  const lang = preferredLanguage || detectLanguage(userMessage);
  const intentScore = calculateIntentScore(userMessage);
  const contact = extractLeadDetails(userMessage);

  // Auto-record lead if contact details provided with intent
  if (contact.phone || contact.email) {
    const newLead: BulkEnquiryLead = {
      id: `lead-chat-${Date.now()}`,
      name: 'Customer (via AI Assistant)',
      companyName: 'Direct Chat Inquiry',
      country: 'India',
      whatsapp: contact.phone || '',
      email: contact.email || '',
      productOrCategory: 'Inquired in Chat Assistant',
      quantity: intentScore === 'VERY HIGH' ? 'High Volume (500+)' : '100+',
      message: `Captured from AI Chat inquiry: "${userMessage}"`,
      source: 'AI Chatbot',
      priority: intentScore,
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.leads.unshift(newLead);
    writeDb(db);
  }

  // Find matched products based on user query
  const lowerQuery = userMessage.toLowerCase();
  const matchedProducts = db.products.filter(p => {
    if (p.hidden) return false;
    const searchString = `${p.name} ${p.category} ${p.subcategory || ''} ${(p.materials || []).join(' ')} ${(p.tags || []).join(' ')} ${p.shortDescription} ${p.sku}`.toLowerCase();
    
    // Check specific terms
    if (lowerQuery.includes('jewel') && searchString.includes('jewel')) return true;
    if (lowerQuery.includes('earring') && searchString.includes('earring')) return true;
    if (lowerQuery.includes('necklace') && (searchString.includes('necklace') || searchString.includes('jewel'))) return true;
    if ((lowerQuery.includes('terracotta') || lowerQuery.includes('clay')) && (searchString.includes('terracotta') || searchString.includes('clay'))) return true;
    if ((lowerQuery.includes('kantha') || lowerQuery.includes('pouch') || lowerQuery.includes('textile')) && (searchString.includes('kantha') || searchString.includes('pouch') || searchString.includes('textile'))) return true;
    if ((lowerQuery.includes('dokra') || lowerQuery.includes('brass') || lowerQuery.includes('memento')) && (searchString.includes('dokra') || searchString.includes('brass') || searchString.includes('memento'))) return true;
    if (lowerQuery.includes('diya') && searchString.includes('diya')) return true;
    if (lowerQuery.includes('puja') && (searchString.includes('puja') || searchString.includes('terracotta') || searchString.includes('diya'))) return true;
    if (lowerQuery.includes('plaque') && searchString.includes('plaque')) return true;
    if (p.sku && lowerQuery.includes(p.sku.toLowerCase())) return true;
    return false;
  }).slice(0, 3);

  // Prepare full product inventory overview for Gemini context
  const productSummaries = db.products.filter(p => !p.hidden).map(p => 
    `- Product: "${p.name}" | SKU: ${p.sku} | Category: ${p.category} | Materials: ${(p.materials || []).join(', ')} | MOQ: ${p.moq} pcs | Wholesale Rate: ${p.bulkPrice ? '₹' + p.bulkPrice : 'Price on Request'} | Retail: ₹${p.retailPrice || 'N/A'} | Production: ${p.productionStatus} | Lead Time: ${p.estimatedProductionTime || (p as any).leadTime || '7-14 days'} | Desc: ${p.shortDescription}`
  ).join('\n');

  const settings = db.settings;

  const systemPrompt = `You are "Jit Prime Assistant", the professional Virtual Sales and Customer Assistant for JIT PRIME MPC COMPANY.
Owner & Proprietor: ${settings.ownerName || 'MONOJIT DEY'}
Company Motto / Tagline: "${(settings as any).visitingCardTagline || settings.tagline || 'Your Trust Our Priority'}"
Official Phone / WhatsApp Hotline: ${settings.whatsappNumber || '+91 82405 85219'}
Official Email: ${settings.email || 'monojitdey189@gmail.com'}
Official Address: ${settings.fullAddress || 'Belghoria, Nimta, Khudiram Pally, Near 42 Pally Club, Landmark - Harijon School, Kolkata - 700049, West Bengal, India.'}

ESSENTIAL BUSINESS RULES & INTEGRITY DIRECTIVES:
1. WHAT WE DO: We are an authentic Indian Hasta Shilpa (handicrafts), handmade jewellery, terracotta art, Dokra brass, textiles, and Government Tender & Institutional supply enterprise based in Kolkata, West Bengal.
2. MISSION & ARTISANS: We connect authentic handcrafted products created by skilled local and rural women artisans with bulk, institutional, and international buyers while generating meaningful production and income opportunities.
   - TRUTHFUL STATEMENT: We provide "market-linked production opportunities through genuine client orders". We DO NOT guarantee fixed government jobs, fixed public salaries, or unconditional employment.
3. ABSOLUTELY NO FAKE CLAIMS: Do NOT invent fake government certifications, tender award numbers, export country numbers, or fabricated revenue figures.
4. INTERNATIONAL BUYERS: Always state clearly: "International shipping, customs clearance, import documentation, and delivery timelines are confirmed according to the product type, volume, destination country, and agreed quotation."
5. FESTIVAL & PUJA: We have an active Durga Puja bulk collection (terracotta jewellery, Maa Durga wall plaques, festive diya sets). Encourage early booking for festive production schedules.
6. ADVANCE PAYMENT POLICY: Standard bulk orders require an agreed advance deposit (typically 50%) for raw material procurement and artisan scheduling, as confirmed in formal proforma invoices.
7. ANSWER ACCURATELY & DIRECTLY:
   - If the user asks about materials, state the specific authentic materials (natural terracotta clay, lead-free pigments, bell metal / Dokra brass, handloom textiles).
   - If the user asks for price, give the wholesale and retail rate from the database.
   - If the user asks about location, provide the full Kolkata address in Belghoria/Nimta near Harijon School and 42 Pally Club.
   - If the user asks who owns the company, mention proprietor Monojit Dey.
   - If the user asks how women can join or about training, explain our workshop training in Belghoria-Nimta and how they can apply via the website or WhatsApp.
8. CUSTOMER SERVICE TONE:
   - Always give a helpful, informative, and tailored answer to the user's specific question.
   - DO NOT repeat the same generic canned response.
   - If an inquiry involves custom bulk orders or special discounts, provide the basic catalogue details first and mention they can connect with owner Monojit Dey on WhatsApp (${settings.whatsappNumber || '+91 82405 85219'}).
9. LANGUAGE RESPONSE RULE:
   - If the user asks in Bengali (or Banglish), respond completely in natural, polite Bengali (বাংলা).
   - If the user asks in English, respond completely in professional, fluent English.
   - If the user asks in Hindi, respond completely in Hindi.
   - Your response language target for this turn: ${lang === 'bn' ? 'Bengali (বাংলা)' : lang === 'hi' ? 'Hindi (हिन्दी)' : 'English'}.
10. BULK QUOTE PROMPT: Do NOT spam the user with lead forms on simple questions. Only invite the user to request a bulk quote or WhatsApp when they show genuine interest in ordering or buying in quantity.

CURRENT REAL PRODUCTS IN DATABASE:
${productSummaries}`;

  let responseText = '';

  // 1. Try Gemini API first with gemini-3.8-flash (or gemini-3.6-flash)
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      // Prepare conversation history for Gemini
      const formattedHistory = (conversationHistory || []).slice(-4).map(h => ({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      }));

      const contents = [
        ...formattedHistory,
        { role: 'user', parts: [{ text: userMessage }] }
      ];

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: systemPrompt
          }
        });
      } catch (modelErr) {
        // Fallback to gemini-3.6-flash if gemini-3.8-flash is unavailable in the environment
        response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents,
          config: {
            systemInstruction: systemPrompt
          }
        });
      }

      responseText = response.text || '';
    } catch (err) {
      console.warn('Gemini API call failed, falling back to intelligent knowledge engine:', err);
    }
  }

  // 2. Comprehensive Fallback Engine: Answers ANY question cleanly without robotic repetition
  if (!responseText) {
    responseText = getComprehensiveFallbackResponse(userMessage, lang, intentScore, matchedProducts, db);
  }

  const quickActions = getContextualQuickActions(userMessage, lang);

  return {
    text: responseText,
    language: lang,
    intentScore,
    matchedProducts: matchedProducts.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      moq: p.moq,
      bulkPrice: p.bulkPrice,
      retailPrice: p.retailPrice,
      primaryImage: p.primaryImage,
      slug: p.slug
    })),
    quickActions
  };
}

function getComprehensiveFallbackResponse(
  message: string, 
  lang: 'en' | 'bn' | 'hi', 
  intentScore: LeadPriority, 
  matchedProducts: Product[], 
  db: any
): string {
  const lower = message.toLowerCase();
  const settings = db.settings;
  const owner = settings.ownerName || 'MONOJIT DEY';
  const phone = settings.whatsappNumber || '+91 82405 85219';
  const email = settings.email || 'monojitdey189@gmail.com';
  const address = settings.fullAddress || 'Belghoria, Nimta, Khudiram Pally, Near 42 Pally Club, Kolkata - 700049, West Bengal, India.';

  // 1. Specific product matches from query
  if (matchedProducts.length > 0) {
    const p = matchedProducts[0];
    const priceText = p.bulkPrice ? `₹${p.bulkPrice}/pc (Bulk)` : 'Price on request for bulk volume';
    const matText = (p.materials && p.materials.length > 0) ? p.materials.join(', ') : 'Natural handcrafted materials';

    if (lower.includes('material') || lower.includes('made of') || lower.includes('kiser toiri')) {
      if (lang === 'bn') {
        return `${p.name} মূলত তৈরি হয় ${matText}-এর সাহায্যে। এটি সম্পূর্ণ প্রাকৃতিক ও শিল্পসম্মত হস্তশিল্প।`;
      }
      if (lang === 'hi') {
        return `${p.name} मुख्य रूप से ${matText} से तैयार किया जाता है। यह पूरी तरह से प्रामाणिक हस्तशिल्प है।`;
      }
      return `${p.name} (SKU: ${p.sku}) is handcrafted using ${matText}. Each piece is crafted by skilled Bengal artisans with organic, durable finishes.`;
    }

    if (lower.includes('price') || lower.includes('cost') || lower.includes('rate') || lower.includes('dam') || lower.includes('koto')) {
      if (lang === 'bn') {
        return `${p.name}-এর পাইকারি রেট: ${priceText}, সর্বনিম্ন অর্ডার (MOQ): ${p.moq} পিস। বিস্তারিত কোটেশনের জন্য আপনি সরাসরি আমাদের অনুরোধ করতে পারেন।`;
      }
      if (lang === 'hi') {
        return `${p.name} का थोक मूल्य: ${priceText}, न्यूनतम ऑर्डर (MOQ): ${p.moq} पीस है। बड़े ऑर्डर के लिए कोटेशन उपलब्ध है।`;
      }
      return `${p.name} (SKU: ${p.sku}) is available at wholesale rate: ${priceText}, with a Minimum Order Quantity (MOQ) of ${p.moq} pcs. Estimated production/dispatch time is ${p.estimatedProductionTime || (p as any).leadTime || '7-12 business days'}.`;
    }

    if (lower.includes('moq') || lower.includes('minimum quantity') || lower.includes('kom koto')) {
      if (lang === 'bn') {
        return `${p.name}-এর জন্য সর্বনিম্ন অর্ডার পরিমাণ (MOQ) হলো ${p.moq} পিস। ট্রায়াল বা মিক্সড ক্যাটাগরি অর্ডারের ক্ষেত্রেও আমরা বিশেষ সুবিধা দিয়ে থাকি।`;
      }
      if (lang === 'hi') {
        return `${p.name} के लिए न्यूनतम ऑर्डर मात्रा (MOQ) ${p.moq} पीस है। प्रारंभिक ऑर्डर के लिए फ्लेक्सिबल बैच भी उपलब्ध हैं।`;
      }
      return `The Minimum Order Quantity (MOQ) for ${p.name} is ${p.moq} pieces. For custom color variations or mixed initial batches, we work closely with you.`;
    }
  }

  // 2. Jewellery inquiries
  if (lower.includes('jewel') || lower.includes('earring') || lower.includes('necklace') || lower.includes('choker') || lower.includes('jhumka') || lower.includes('gohona')) {
    if (lang === 'bn') {
      return `আমাদের কাছে হস্তশিল্পের টেরাকোটা জুয়েলারি, হ্যান্ড-পেইন্টেড নেকলেস সেট, ঝুমকো ও কানের দুল রয়েছে। সব গহনা প্রাকৃতিক মাটি ও অর্গানিক রঙ দিয়ে হাতে তৈরি করা হয়। পাইকারি MOQ সাধারণত ২৫ থেকে ৫০ পিস।`;
    }
    if (lang === 'hi') {
      return `हमारे पास हस्तनिर्मित टेराकोटा ज्वेलरी, चोकर सेट, झुमके और इयररिंग्स का बड़ा संग्रह है। यह सब प्राकृतिक मिट्टी और जैविक रंगों से महिलाओं द्वारा हाथ से बनाया जाता है। थोक MOQ 25-50 पीस से शुरू होता है।`;
    }
    return `We specialize in authentic handcrafted Terracotta Jewellery, including terracotta choker necklaces, matching hand-painted earrings, jhumkas, and ethnic pendant sets. They are made with kiln-cured natural clay, lead-free non-toxic colors, and durable cotton dori. Wholesale MOQ starts from 25–50 sets.`;
  }

  // 3. Materials used
  if (lower.includes('material') || lower.includes('clay') || lower.includes('terracotta') || lower.includes('fabric') || lower.includes('dokra') || lower.includes('brass')) {
    if (lang === 'bn') {
      return `আমরা ১০০% খাঁটি ও পরিবেশবান্ধব কাঁচামাল ব্যবহার করি: প্রাকৃতিক বেলে-এঁটেল মাটি (টেরাকোটা), ঐতিহ্যবাহী ডোকরা ব্রাস (বেল মেটাল), সুতির কাঁথা ফেব্রিক, প্রাকৃতিক রঙ ও পাটের সুতো। কোনো ক্ষতিকর কেমিক্যাল ব্যবহার করা হয় না।`;
    }
    if (lang === 'hi') {
      return `हम 100% प्रामाणिक और पर्यावरण-अनुकूल सामग्री का उपयोग करते हैं: प्राकृतिक टेराकोटा मिट्टी, 4000 साल पुरानी तकनीक से ढला डोकरा पीतल, सूती कांथा स्टिच कपड़ा और प्राकृतिक रंग।`;
    }
    return `Jit Prime MPC Company uses 100% authentic, eco-friendly materials: purified riverbed terracotta clay, kiln-cured ceramics, lead-free non-toxic mineral paints, traditional lost-wax cast Dokra brass (bell metal), cotton fabric with hand Kantha embroidery, and biodegradable craft packaging.`;
  }

  // 4. Contact / Location / Owner details
  if (lower.includes('where') || lower.includes('location') || lower.includes('address') || lower.includes('thikana') || lower.includes('kothay') || lower.includes('kolkata') || lower.includes('belghoria') || lower.includes('nimta')) {
    if (lang === 'bn') {
      return `আমাদের রেজিস্টার্ড অফিস ও ওয়ার্কশপ হাবের ঠিকানা:\n📍 ${address}\nল্যান্ডমার্ক: হরিজন স্কুল ও ৪২ পল্লী ক্লাব, নিমতা-বেলঘড়িয়া, কলকাতা - ৭০০০৪৯। সরাসরি দেখা করতে বা কথা বলতে যোগাযোগ করুন: ${phone}।`;
    }
    if (lang === 'hi') {
      return `हमारा रजिस्टर्ड कार्यालय और वर्कशॉप कोलकाता में स्थित है:\n📍 ${address}\nलैंडमार्क: हरिजन स्कूल, बेलघोरिया/निमता, कोलकाता - 700049।\nसंपर्क: ${phone}।`;
    }
    return `Our registered office and production workshop hub is located at:\n📍 ${address}\nLandmark: Harijon School, Near 42 Pally Club, Belghoria, Nimta, Kolkata - 700049, West Bengal, India.\nYou are welcome to schedule a workshop visit or meeting with owner Monojit Dey via WhatsApp: ${phone}.`;
  }

  if (lower.includes('owner') || lower.includes('who owns') || lower.includes('founder') || lower.includes('monojit') || lower.includes('proprietor')) {
    if (lang === 'bn') {
      return `জিত প্রাইম এমপিসি কোম্পানির কর্ণধার ও প্রোপাইটার হলেন শ্রী মনোজিত দে (Monojit Dey)।\nট্যাগলাইন: "${settings.visitingCardTagline || 'Your Trust Our Priority'}"\n📞 ফোন / WhatsApp: ${phone}\n✉️ ইমেল: ${email}`;
    }
    if (lang === 'hi') {
      return `जित प्राइम एमपीसी कंपनी के संस्थापक और प्रोपराइटर श्री मनोजित दे (Monojit Dey) हैं।\nटैगलाइन: "Your Trust Our Priority"\n📞 WhatsApp: ${phone}\n✉️ ईमेल: ${email}`;
    }
    return `Jit Prime MPC Company is founded and led by Proprietor Mr. Monojit Dey.\nCompany Motto: "${settings.visitingCardTagline || 'Your Trust Our Priority'}"\n📞 Direct WhatsApp: ${phone}\n✉️ Email: ${email}\nHe personally oversees artisan production quality and B2B client satisfaction.`;
  }

  if (lower.includes('contact') || lower.includes('phone') || lower.includes('whatsapp') || lower.includes('email') || lower.includes('number') || lower.includes('call')) {
    if (lang === 'bn') {
      return `আমাদের যোগাযোগের বিবরণ:\n📞 ফোন / WhatsApp: ${phone} (মনোজিত দে)\n✉️ ইমেল: ${email}\n📍 ঠিকানা: ${address}\nআমরা সকাল ৯:৩০ থেকে সন্ধ্যা ৭:৩০ পর্যন্ত সক্রিয় থাকি।`;
    }
    if (lang === 'hi') {
      return `हमसे संपर्क करने की जानकारी:\n📞 फोन / WhatsApp: ${phone} (श्री मनोजित दे)\n✉️ ईमेल: ${email}\n📍 पता: ${address}`;
    }
    return `Here are our official contact details:\n📞 Direct Phone / WhatsApp: ${phone} (Mr. Monojit Dey)\n✉️ Email: ${email}\n📍 Office: ${address}\nBusiness Hours: Monday – Saturday: 9:30 AM – 7:30 PM (IST).`;
  }

  // 5. Women Artisans & Training Program
  if (lower.includes('artisan') || lower.includes('women') || lower.includes('join') || lower.includes('training') || lower.includes('livelihood') || lower.includes('moila') || lower.includes('shilpa')) {
    if (lang === 'bn') {
      return `জিত প্রাইম এমপিসি কোম্পানি স্থানীয় ও গ্রামীণ মহিলা কারিগরদের ঐতিহ্যবাহী হস্তশিল্প তৈরির প্রশিক্ষণ ও বাজার সংযোগ তৈরি করে। আমাদের ট্রেনিং সেন্টার বেলঘড়িয়া-নিমতাতে অবস্থিত। এটি বাজারভিত্তিক উৎপাদন ও আয়ের সুযোগ তৈরি করে (কোনো মিথ্যা সরকারি চাকরির দাবি করা হয় না)। যোগ দিতে ওয়েবসাইট থেকে আবেদন করুন বা মনোজিত বাবুর সঙ্গে যোগাযোগ করুন: ${phone}।`;
    }
    if (lang === 'hi') {
      return `जित प्राइम एमपीसी कंपनी महिला कारीगरों को पारंपरिक हस्तशिल्प में कौशल प्रशिक्षण और बाजार-आधारित उत्पादन से जोड़ती है। हमारा प्रशिक्षण हब बेलघोरिया/निमता में स्थित है। जुड़ने के लिए हमारी वेबसाइट के Training & Livelihood पेज से आवेदन करें या ${phone} पर संपर्क करें।`;
    }
    return `Jit Prime MPC Company connects talented local and rural women artisans with structured training workshops and market-linked production opportunities. Our training hub is based in Belghoria-Nimta, Kolkata. Women learn heritage terracotta sculpting, jewelry fabrication, and Dokra finishing, earning fair production wages tied to genuine confirmed orders. To join, visit the "Training & Livelihood" page or WhatsApp ${phone}.`;
  }

  // 6. International Shipping & Export
  if (lower.includes('international') || lower.includes('export') || lower.includes('dubai') || lower.includes('usa') || lower.includes('uk') || lower.includes('abroad') || lower.includes('ship to') || lower.includes('foreign')) {
    if (lang === 'bn') {
      return `হ্যাঁ, আমরা আন্তর্জাতিক ও বিদেশে বাল্ক অর্ডারের সামগ্রী সরবরাহ করি। আন্তর্জাতিক শিপিং চার্জ, কাস্টমস ক্লিয়ারেন্স ও ডেলিভারির সময় গন্তব্য দেশ, পণ্যের ধরণ ও কোটেশনের ওপর নির্ভর করে আনুষ্ঠানিকভাবে নিশ্চিত করা হয়। আমরা এক্সপোর্ট গ্রেড প্যাকিং ও সম্পূর্ণ ডকুমেন্টেশন (Commercial Invoice, Packing List) প্রদান করি।`;
    }
    if (lang === 'hi') {
      return `हाँ, हम अंतरराष्ट्रीय व निर्यात खरीदारों के लिए थोक आपूर्ति करते हैं। अंतरराष्ट्रीय शिपिंग, सीमा शुल्क (customs), और डिलीवरी समय देश और ऑर्डर वॉल्यूम के अनुसार औपचारिक कोटेशन में तय किया जाता है। हम एक्सपोर्ट-क्वालिटी सुरक्षित पैकेजिंग प्रदान करते हैं।`;
    }
    return `Yes, we supply authentic Indian Hasta Shilpa to international boutique owners, cultural retailers, and distributors globally. Important note: International shipping costs, customs clearance protocols, import duties, and transit timelines are confirmed based on the destination country, shipment weight/volume, and agreed formal quotation. We provide export-grade shock-absorbing packaging and full commercial documentation.`;
  }

  // 7. Government Tender & Institutional Supply
  if (lower.includes('tender') || lower.includes('gem') || lower.includes('government') || lower.includes('institutional') || lower.includes('sorkari') || lower.includes('memento') || lower.includes('trophy')) {
    if (lang === 'bn') {
      return `জিত প্রাইম এমপিসি কোম্পানি সরকারি দপ্তর, অ্যাকাডেমিক প্রতিষ্ঠান এবং কর্পোরেট সেমিনারের জন্য মেমেন্টো, ডোকরা ব্রাস ট্রফি এবং টেক্সটাইল ফোল্ডার সরবরাহ করে। আমরা সম্পূর্ণ জিএসটি (GST) চালানের মাধ্যমে কাজ করি এবং প্রি-প্রোডাকশন স্যাম্পল অনুমোদন দিয়ে থাকি।`;
    }
    if (lang === 'hi') {
      return `हम सरकारी विभागों, संस्थानों और कॉर्पोरेट आयोजनों के लिए प्रामाणिक डोकरा ट्रॉफी, स्मृति चिन्ह (mementos), और हस्तशिल्प उपहारों की थोक आपूर्ति करते हैं। हम पूर्ण GST अनुपालन और औपचारिक नमूना अनुमोदन के साथ काम करते हैं।`;
    }
    return `Jit Prime MPC Company is fully equipped for Government Tenders, GeM institutional procurement, and corporate felicitations. We supply custom-engraved brass Dokra trophies, handcrafted Hasta Shilpa plaques, jute conference folios, and festival mementos with full GST billing and pre-production sample sign-offs.`;
  }

  // 8. Durga Puja Festival Collection
  if (lower.includes('puja') || lower.includes('durga') || lower.includes('festive') || lower.includes('festival') || lower.includes('utsav')) {
    if (lang === 'bn') {
      return `আমাদের পুজো স্পেশাল কালেকশন লাইভ রয়েছে! এতে রয়েছে টেরাকোটা মা দুর্গার দেওয়াল ফলক, উৎসবের টেরাকোটা গহনা সেট এবং সুসজ্জিত মাটির প্রদীপ। পুজোর সময়ে যথাসময়ে সরবরাহের জন্য এখনই বাল্ক অর্ডার বুকিং করার পরামর্শ দেওয়া হচ্ছে।`;
    }
    if (lang === 'hi') {
      return `हमारा दुर्गा पूजा फेस्टिव कलेक्शन तैयार है! इसमें हस्तनिर्मित टेराकोटा ज्वेलरी, माँ दुर्गा वॉल हैंगिंग और दीया गिफ्ट सेट शामिल हैं। उत्सव के समय समय पर डिलीवरी के लिए कृपया पहले से थोक ऑर्डर बुक करें।`;
    }
    return `Our Durga Puja Bulk Festive Collection is active! We feature hand-painted terracotta jewellery sets, Maa Durga wall plaques, Dokra decorative idols, and festive gift diya sets. For festival season delivery, we encourage retail partners and community committees to finalize production schedules early.`;
  }

  // 9. Advance Payment & Ordering Process
  if (lower.includes('advance') || lower.includes('payment') || lower.includes('terms') || lower.includes('how to order') || lower.includes('order process') || lower.includes('deposit')) {
    if (lang === 'bn') {
      return `অর্ডারের সাধারণ নিয়মাবলী:\n১. আপনি যে পণ্য চান তা সিলেক্ট করে কোটেশনের অনুরোধ পাঠান।\n২. বাল্ক ও কাস্টম অর্ডারে কাঁচামাল সংগ্রহ ও কারিগর বুকিংয়ের জন্য ৫০% অগ্রিম (Advance) প্রযোজ্য।\n৩. উৎপাদন শেষ হলে কোয়ালিটি চেকের পর অবশিষ্ট পেমেন্টে পণ্য প্রেরিত হয়।`;
    }
    if (lang === 'hi') {
      return `ऑर्डर प्रक्रिया:\n1. उत्पाद और मात्रा का चयन करें और कोटेशन का अनुरोध करें।\n2. सामग्री खरीद और कारीगर आवंटन के लिए मानक थोक ऑर्डर में 50% अग्रिम जमा आवश्यक होता है।\n3. गुणवत्ता निरीक्षण के बाद सुरक्षित पैकिंग और प्रेषण किया जाता है।`;
    }
    return `Here is our standard ordering process:\n1. Select products & required quantities to receive a formal wholesale quotation.\n2. For custom and bulk production, a standard advance deposit (typically 50%) is required to initiate raw material procurement and artisan scheduling.\n3. Upon 100% quality inspection, the consignment is securely packed and dispatched.`;
  }

  // 10. Bulk / Quotation request intent
  if (intentScore === 'VERY HIGH' || intentScore === 'HIGH' || lower.includes('bulk quote') || lower.includes('quotation') || lower.includes('order 500')) {
    if (lang === 'bn') {
      return `আপনার বাল্ক রিকোয়ারমেন্টের জন্য ধন্যবাদ! জিত প্রাইম এমপিসি কোম্পানিতে আমরা ১০০ থেকে ১০,০০০+ পিস পর্যন্ত সরবরাহ করতে সক্ষম। আপনার জন্য সঠিক কোটেশন ও ক্যাটালগ পাঠাতে আপনি ওয়েবসাইটের "Request Bulk Quote" ফর্মটি ব্যবহার করতে পারেন অথবা সরাসরি মনোজিত বাবুর সঙ্গে WhatsApp-এ যোগাযোগ করতে পারেন: ${phone}।`;
    }
    if (lang === 'hi') {
      return `थोक आवश्यकता के लिए धन्यवाद! जित प्राइम एमपीसी कंपनी 50 से 10,000+ पीस तक निर्माण करने में सक्षम है। सबसे सटीक कोटेशन और कैटलॉग के लिए आप "Request Bulk Quote" फॉर्म भर सकते हैं या सीधे मनोजित दे से WhatsApp (${phone}) पर बात कर सकते हैं।`;
    }
    return `Thank you for your bulk inquiry! Jit Prime MPC Company supports high-volume manufacturing from 50 to 10,000+ pieces with strict quality control. To receive a formal customized quotation and the latest catalog, you can click "Request Bulk Quote" or reach owner Monojit Dey directly on WhatsApp: ${phone}.`;
  }

  // 11. General polite & helpful greeting / assistance
  if (lang === 'bn') {
    return `নমস্কার! আমি জিত প্রাইম অ্যাসিস্ট্যান্ট। জিত প্রাইম এমপিসি কোম্পানির হস্তশিল্প (হস্ত শিল্প), মাটির গহনা, ডোকরা ব্রাস আর্ট, টেক্সটাইল এবং সরকারি টেন্ডার সাপ্লাই সংক্রান্ত যে কোনো তথ্যের জন্য আমি আপনাকে সাহায্য করতে পারি। আপনি কি কোনো নির্দিষ্ট পণ্য, উপাদান, বা বাল্ক রেট জানতে চান?`;
  }
  if (lang === 'hi') {
    return `नमस्ते! मैं जित प्राइम असिस्टेंट हूँ। जित प्राइम एमपीसी कंपनी के हस्तशिल्प, टेराकोटा ज्वेलरी, डोकरा ब्रास और थोक सप्लाई से जुड़ी किसी भी जानकारी के लिए मैं आपकी सहायता कर सकता हूँ। क्या आप किसी विशिष्ट उत्पाद, सामग्री या थोक मूल्य के बारे में जानना चाहते हैं?`;
  }
  return `Hello! I am Jit Prime Assistant for Jit Prime MPC Company. I can help you with product information, terracotta jewellery, Dokra brass art, materials, wholesale pricing, MOQs, workshop training, and bulk orders. What would you like to know today?`;
}

function getContextualQuickActions(message: string, lang: 'en' | 'bn' | 'hi'): string[] {
  if (lang === 'bn') {
    return [
      'পণ্যগুলি দেখান',
      'টেরাকোটার গহনা',
      'হস্ত শিল্প ও উপাদান',
      'মনোজিত বাবুর সঙ্গে যোগাযোগ',
      'মহিলা কারিগর ট্রেনিং'
    ];
  }
  if (lang === 'hi') {
    return [
      'उत्पाद दिखाएं',
      'टेराकोटा ज्वेलरी',
      'सामग्री और शिल्प',
      'मनोजित दे से संपर्क',
      'कारीगर प्रशिक्षण'
    ];
  }
  return [
    'Show Products',
    'Handmade Jewellery',
    'Materials Used',
    'Contact Monojit Dey',
    'How Women Can Join'
  ];
}
