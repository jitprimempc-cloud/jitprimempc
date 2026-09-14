import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings, NavigationItem, PujaCampaign, Category, Product } from '../types';
import { api } from '../services/api';
import { staticDatabase } from '../data/staticDb';
import { TranslationDict, getTranslation, Language } from '../utils/translations';

interface AppContextType {
  settings: SiteSettings | null;
  navigation: NavigationItem[];
  campaign: PujaCampaign | null;
  categories: Category[];
  currentLanguage: 'en' | 'bn' | 'hi';
  setLanguage: (lang: 'en' | 'bn' | 'hi') => void;
  dict: TranslationDict;
  isAdmin: boolean;
  isAdminLoggedIn: boolean;
  adminUser: any | null;
  authUser?: any | null;
  adminToken: string | null;
  login: (token: string, user: any) => void;
  logout: () => void;
  refreshData: () => Promise<void>;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  chatPrefill: string;
  selectedProductForChat: Partial<Product> | null;
  openChatWithContext: (message?: string, product?: Partial<Product>) => void;
  isBulkModalOpen: boolean;
  bulkModalProduct: Product | null;
  bulkModalInitialQuantity?: number;
  bulkModalCouponCode?: string;
  bulkModalDiscountAmount?: number;
  openBulkModal: (product?: Product, initialQuantity?: number, couponCode?: string, discountAmount?: number) => void;
  closeBulkModal: () => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Simple localized labels
const translations: Record<string, Record<'en' | 'bn' | 'hi', string>> = {
  requestBulkQuote: {
    en: "Request Bulk Quote",
    bn: "বাল্ক কোটেশনের অনুরোধ",
    hi: "बल्क कोटेशन का अनुरोध"
  },
  exploreProducts: {
    en: "Explore Products",
    bn: "পণ্য সম্ভার দেখুন",
    hi: "उत्पाद देखें"
  },
  joinArtisanNetwork: {
    en: "Join Artisan Network",
    bn: "কারিগর নেটওয়ার্কে যোগ দিন",
    hi: "कारीगर नेटवर्क से जुड़ें"
  },
  askAssistant: {
    en: "Ask Jit Prime Assistant",
    bn: "জিত প্রাইম অ্যাসিস্ট্যান্টকে জিজ্ঞাসা করুন",
    hi: "जित प्राइम असिस्टेंट से पूछें"
  },
  contactWhatsapp: {
    en: "WhatsApp Monojit",
    bn: "মনোজিত বাবুকে WhatsApp করুন",
    hi: "मनोजित दे को WhatsApp करें"
  },
  moqLabel: {
    en: "Minimum Order Quantity (MOQ)",
    bn: "সর্বনিম্ন অর্ডার পরিমাণ (MOQ)",
    hi: "न्यूनतम ऑर्डर मात्रा (MOQ)"
  },
  bulkPriceLabel: {
    en: "Bulk Price",
    bn: "পাইকারি দাম",
    hi: "थोक मूल्य"
  },
  priceOnRequest: {
    en: "Price on Request",
    bn: "অনুরোধে মূল্য",
    hi: "अनुरोध पर मूल्य"
  },
  handmadeIndia: {
    en: "Handmade in India",
    bn: "ভারতে হাতে তৈরি",
    hi: "भारत में हस्तनिर्मित"
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(() => staticDatabase.settings || null);
  const [navigation, setNavigation] = useState<NavigationItem[]>(() => staticDatabase.navigation || []);
  const [campaign, setCampaign] = useState<PujaCampaign | null>(() => {
    const camps = staticDatabase.campaigns || [];
    return camps.find((c: any) => c.enabled) || camps[0] || null;
  });
  const [categories, setCategories] = useState<Category[]>(() => staticDatabase.categories || []);
  const [currentLanguage, setCurrentLanguageState] = useState<'en' | 'bn' | 'hi'>(() => {
    const saved = localStorage.getItem('jit_language');
    if (saved === 'bn' || saved === 'en' || saved === 'hi') return saved;
    return 'en';
  });

  const setLanguage = (lang: 'en' | 'bn' | 'hi') => {
    localStorage.setItem('jit_language', lang);
    setCurrentLanguageState(lang);
  };

  // Admin Auth
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('jit_admin_token'));
  const [adminUser, setAdminUser] = useState<any | null>(() => {
    const saved = localStorage.getItem('jit_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatPrefill, setChatPrefill] = useState('');
  const [selectedProductForChat, setSelectedProductForChat] = useState<Partial<Product> | null>(null);

  // Bulk Modal state
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkModalProduct, setBulkModalProduct] = useState<Product | null>(null);
  const [bulkModalInitialQuantity, setBulkModalInitialQuantity] = useState<number | undefined>(undefined);
  const [bulkModalCouponCode, setBulkModalCouponCode] = useState<string | undefined>(undefined);
  const [bulkModalDiscountAmount, setBulkModalDiscountAmount] = useState<number | undefined>(undefined);

  const refreshData = async () => {
    try {
      const [s, n, camps, cats] = await Promise.all([
        api.getSettings(),
        api.getNavigation(),
        api.getCampaigns(),
        api.getCategories()
      ]);
      setSettings(s);
      setNavigation(n);
      setCategories(cats);
      const activeCamp = camps.find(c => c.enabled);
      setCampaign(activeCamp || camps[0] || null);
    } catch (err) {
      console.error('Failed to load initial site data:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const login = (token: string, user: any) => {
    localStorage.setItem('jit_admin_token', token);
    localStorage.setItem('jit_admin_user', JSON.stringify(user));
    setAdminToken(token);
    setAdminUser(user);
  };

  const logout = () => {
    localStorage.removeItem('jit_admin_token');
    localStorage.removeItem('jit_admin_user');
    setAdminToken(null);
    setAdminUser(null);
  };

  const openChatWithContext = (message?: string, product?: Partial<Product>) => {
    if (message) setChatPrefill(message);
    if (product) setSelectedProductForChat(product);
    setChatOpen(true);
  };

  const openBulkModal = (
    product?: Product, 
    initialQuantity?: number, 
    couponCode?: string, 
    discountAmount?: number
  ) => {
    setBulkModalProduct(product || null);
    setBulkModalInitialQuantity(initialQuantity);
    setBulkModalCouponCode(couponCode);
    setBulkModalDiscountAmount(discountAmount);
    setIsBulkModalOpen(true);
  };

  const closeBulkModal = () => {
    setIsBulkModalOpen(false);
    setBulkModalProduct(null);
    setBulkModalInitialQuantity(undefined);
    setBulkModalCouponCode(undefined);
    setBulkModalDiscountAmount(undefined);
  };

  const dict = getTranslation(currentLanguage);

  const t = (key: string): string => {
    if ((dict as any)[key]) {
      return (dict as any)[key];
    }
    if (translations[key] && translations[key][currentLanguage]) {
      return translations[key][currentLanguage];
    }
    return key;
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        navigation,
        campaign,
        categories,
        currentLanguage,
        setLanguage,
        dict,
        isAdmin: !!adminToken,
        isAdminLoggedIn: !!adminToken,
        adminUser,
        authUser: adminUser,
        adminToken,
        login,
        logout,
        refreshData,
        chatOpen,
        setChatOpen,
        chatPrefill,
        selectedProductForChat,
        openChatWithContext,
        isBulkModalOpen,
        bulkModalProduct,
        bulkModalInitialQuantity,
        bulkModalCouponCode,
        bulkModalDiscountAmount,
        openBulkModal,
        closeBulkModal,
        t
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
