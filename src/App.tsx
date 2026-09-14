import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PujaBanner } from './components/PujaBanner';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AIChatbot } from './components/AIChatbot';
import { BulkEnquiryModal } from './components/BulkEnquiryModal';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { GalleryPage } from './pages/GalleryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { BulkOrdersPage } from './pages/BulkOrdersPage';
import { ArtisansPage } from './pages/ArtisansPage';
import { GovernmentInstitutionalPage } from './pages/GovernmentInstitutionalPage';
import { TrainingLivelihoodPage } from './pages/TrainingLivelihoodPage';
import { InternationalBuyersPage } from './pages/InternationalBuyersPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPageViewer } from './pages/LegalPageViewer';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';

function getNormalizedPath(): string {
  // 1. Check hash routing first (e.g. #/products, #/about)
  if (window.location.hash) {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash.startsWith('/')) return hash;
  }

  let path = window.location.pathname || '/';

  // 2. If running under a GitHub Pages repository subpath like /clintdemos/ or /clintdemos
  const knownTopRoutes = [
    '/admin', '/about', '/products', '/gallery', '/bulk-orders',
    '/artisans', '/our-artisans', '/government-institutional',
    '/training-livelihood', '/international-buyers', '/contact', '/legal'
  ];

  const match = path.match(/^\/[^/]+/);
  if (match) {
    const firstSegment = match[0];
    const isKnown = knownTopRoutes.some(r => r === firstSegment || firstSegment.startsWith(r));
    if (!isKnown && firstSegment !== '/') {
      path = path.slice(firstSegment.length) || '/';
    }
  }

  return path || '/';
}

function MainAppContent() {
  const { isAdmin, isAdminLoggedIn } = useApp();
  const isAuthorizedAdmin = !!(isAdmin || isAdminLoggedIn);
  const [route, setRoute] = useState<string>(() => getNormalizedPath());

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(getNormalizedPath());
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = (to: string) => {
    // If on GitHub Pages (github.io domain or /clintdemos subpath)
    const isGitHubPages = window.location.hostname.endsWith('github.io') || window.location.pathname.startsWith('/clintdemos');
    if (isGitHubPages) {
      window.location.hash = to;
      setRoute(to);
    } else {
      window.history.pushState({}, '', to);
      setRoute(to);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route matching logic
  const renderRoute = () => {
    if (route === '/admin') {
      if (!isAuthorizedAdmin) {
        return <AdminLogin onSuccess={() => setRoute('/admin')} onCancel={() => navigate('/')} />;
      }
      return <AdminLayout onNavigate={navigate} />;
    }

    if (route === '/' || route === '') {
      return <HomePage onNavigate={navigate} />;
    }

    if (route === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }

    if (route === '/products') {
      return <ProductsPage onNavigate={navigate} />;
    }

    if (route === '/gallery') {
      return <GalleryPage onNavigate={navigate} />;
    }

    if (route.startsWith('/products/') || route.startsWith('/product/')) {
      const parts = route.split('/');
      const slugOrId = parts[parts.length - 1];
      return <ProductDetailPage productIdOrSlug={slugOrId} onNavigate={navigate} />;
    }

    if (route === '/bulk-orders') {
      return <BulkOrdersPage />;
    }

    if (route === '/artisans' || route === '/our-artisans') {
      return <ArtisansPage onNavigate={navigate} />;
    }

    if (route === '/government-institutional') {
      return <GovernmentInstitutionalPage onNavigate={navigate} />;
    }

    if (route === '/training-livelihood') {
      return <TrainingLivelihoodPage />;
    }

    if (route === '/international-buyers') {
      return <InternationalBuyersPage onNavigate={navigate} />;
    }

    if (route === '/contact') {
      return <ContactPage />;
    }

    if (route.startsWith('/legal/')) {
      const slug = route.replace('/legal/', '');
      return <LegalPageViewer slug={slug} onNavigate={navigate} />;
    }

    // Default fallback
    return <HomePage onNavigate={navigate} />;
  };

  const isAdminView = route === '/admin' && isAuthorizedAdmin;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-400 selection:text-slate-950 font-sans">
      
      {/* Top Banner & Public Navbar (hidden if inside admin workspace) */}
      {!isAdminView && (
        <>
          <PujaBanner onNavigate={navigate} />
          <Navbar currentRoute={route} onNavigate={navigate} />
        </>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {renderRoute()}
      </main>

      {/* Footer (hidden if inside admin workspace) */}
      {!isAdminView && (
        <Footer onNavigate={navigate} />
      )}

      {/* Floating Action Controls & Modals */}
      {!isAdminView && (
        <>
          <FloatingWhatsApp />
          <AIChatbot onNavigate={navigate} />
        </>
      )}

      {/* Global B2B Bulk Quotation Modal */}
      <BulkEnquiryModal />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
