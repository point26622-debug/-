import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './services/authContext';
import { testFirebaseConnection } from './firebase/config';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BeforeAfterGallery } from './components/BeforeAfterGallery';
import { ServiceCategories } from './components/ServiceCategories';
import { TrustPillars } from './components/TrustPillars';
import { BookingModal } from './components/BookingModal';
import { MyReservationsModal } from './components/MyReservationsModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { Phone, Calendar, ArrowUp } from 'lucide-react';

function MainApp() {
  const { user, isAdmin } = useAuth();

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingCategory, setBookingCategory] = useState<string>('');
  const [isMyReservationsOpen, setIsMyReservationsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Initialize Firebase connection test on boot as required by Firebase skill
  useEffect(() => {
    testFirebaseConnection();
  }, []);

  // Track scroll position for floating action
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenBooking = (category?: string) => {
    if (category) setBookingCategory(category);
    setIsBookingOpen(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isAdminView) {
    return <AdminDashboard onBackToHome={() => setIsAdminView(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-amber-600 selection:text-white">
      
      {/* Header */}
      <Header
        onOpenBooking={() => handleOpenBooking()}
        onOpenMyReservations={() => setIsMyReservationsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onToggleAdminView={() => setIsAdminView(!isAdminView)}
        isAdminView={isAdminView}
      />

      {/* Main Sections */}
      <main className="flex-1">
        {/* Hero with core copy & engineer photo */}
        <Hero
          onOpenBooking={() => handleOpenBooking()}
          onSelectCategory={(cat) => handleOpenBooking(cat)}
        />

        {/* 4 Core Services Grid */}
        <ServiceCategories
          onSelectService={(service) => handleOpenBooking(service)}
        />

        {/* Before & After Interactive Comparison */}
        <BeforeAfterGallery
          onBookWithService={(service) => handleOpenBooking(service)}
        />

        {/* 4 Trust Pillars & FAQs */}
        <TrustPillars />
      </main>

      {/* Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Mobile Sticky Bottom CTA Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 px-4 flex items-center gap-2 shadow-2xl">
        <a
          href="tel:010-2752-2662"
          className="flex-1 py-3 px-2 rounded-xl bg-stone-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Phone className="w-4 h-4 text-amber-400" />
          <span>전화 010-2752-2662</span>
        </a>

        <button
          onClick={() => handleOpenBooking()}
          className="flex-1 py-3 px-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-600/30"
        >
          <Calendar className="w-4 h-4" />
          <span>방문 예약하기</span>
        </button>
      </div>

      {/* Floating Scroll to Top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="hidden md:flex fixed bottom-8 right-8 z-30 w-12 h-12 rounded-full bg-stone-900/90 text-white hover:bg-amber-600 items-center justify-center shadow-xl transition-all hover:scale-110"
          title="맨 위로 가기"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* 4-Step Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialCategory={bookingCategory}
        onViewMyReservations={() => setIsMyReservationsOpen(true)}
      />

      {/* Customer Reservations Lookup Modal */}
      <MyReservationsModal
        isOpen={isMyReservationsOpen}
        onClose={() => setIsMyReservationsOpen(false)}
        onOpenNewBooking={() => setIsBookingOpen(true)}
      />

      {/* Auth & Admin Login Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccessRedirectToAdmin={() => setIsAdminView(true)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
