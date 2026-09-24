import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Toast, ToastMessage } from './components/common/Toast';

// Modals
import { GivingModal } from './components/modals/GivingModal';
import { EventRegistrationModal } from './components/modals/EventRegistrationModal';
import { SermonPlayerModal } from './components/modals/SermonPlayerModal';
import { PlanVisitModal } from './components/modals/PlanVisitModal';

// Public Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Pastor } from './pages/Pastor';
import { Beliefs } from './pages/Beliefs';
import { Ministries } from './pages/Ministries';
import { MensMinistry } from './pages/MensMinistry';
import { WomensMinistry } from './pages/WomensMinistry';
import { YouthMinistry } from './pages/YouthMinistry';
import { ChildrenMinistry } from './pages/ChildrenMinistry';
import { OutreachMinistry } from './pages/OutreachMinistry';
import { Sermons } from './pages/Sermons';
import { Events } from './pages/Events';
import { Give } from './pages/Give';
import { Contact } from './pages/Contact';
import { PrayerRequest } from './pages/PrayerRequest';
import { PlanVisit } from './pages/PlanVisit';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { NewsDetail } from './pages/NewsDetail';
import { TestimonyDetail } from './pages/TestimonyDetail';
import { NotFound } from './pages/NotFound';

// Admin Hub
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminSermons } from './pages/admin/AdminSermons';
import { AdminEvents } from './pages/admin/AdminEvents';
import { AdminGiving } from './pages/admin/AdminGiving';
import { AdminInbox } from './pages/admin/AdminInbox';
import { AdminContent } from './pages/admin/AdminContent';
import { AdminNews } from './pages/admin/AdminNews';
import { AdminTestimonies } from './pages/admin/AdminTestimonies';
import { AdminUsers } from './pages/admin/AdminUsers';

import { ChurchEvent, Sermon } from './types';

const MainLayout: React.FC<{ children: React.ReactNode; onOpenGive: () => void }> = ({ children, onOpenGive }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onOpenGiveModal={onOpenGive} />
      <main className="flex-1">{children}</main>
      <Footer onOpenGiveModal={onOpenGive} />
    </div>
  );
};

export const App: React.FC = () => {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Modal States
  const [isGiveOpen, setIsGiveOpen] = useState(false);
  const [isPlanVisitOpen, setIsPlanVisitOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ChurchEvent | null>(null);
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ id: Date.now().toString(), type, title, message });
  };

  return (
    <Router>
      <MainLayout onOpenGive={() => setIsGiveOpen(true)}>
        <Routes>
          {/* Public 20 Pages */}
          <Route
            path="/"
            element={
              <Home
                onOpenGiveModal={() => setIsGiveOpen(true)}
                onOpenPlanVisitModal={() => setIsPlanVisitOpen(true)}
                onSelectSermon={(s) => setSelectedSermon(s)}
                onSelectEvent={(ev) => setSelectedEvent(ev)}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/pastor" element={<Pastor />} />
          <Route path="/beliefs" element={<Beliefs />} />
          <Route path="/ministries" element={<Ministries />} />
          <Route path="/ministries/mens" element={<MensMinistry />} />
          <Route path="/ministries/womens" element={<WomensMinistry />} />
          <Route path="/ministries/youth" element={<YouthMinistry />} />
          <Route path="/ministries/children" element={<ChildrenMinistry />} />
          <Route path="/ministries/outreach" element={<OutreachMinistry />} />
          <Route path="/sermons" element={<Sermons onSelectSermon={(s) => setSelectedSermon(s)} />} />
          <Route path="/events" element={<Events onSelectEvent={(ev) => setSelectedEvent(ev)} />} />
          <Route path="/give" element={<Give onOpenGiveModal={() => setIsGiveOpen(true)} />} />
          <Route path="/contact" element={<Contact onSuccess={(msg) => showToast('Message Received', msg)} />} />
          <Route path="/prayer" element={<PrayerRequest onSuccess={(msg) => showToast('Prayer Received', msg)} />} />
          <Route path="/plan-a-visit" element={<PlanVisit onOpenPlanVisitModal={() => setIsPlanVisitOpen(true)} />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/testimonies/:id" element={<TestimonyDetail />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/sermons" element={<AdminLayout><AdminSermons /></AdminLayout>} />
          <Route path="/admin/events" element={<AdminLayout><AdminEvents /></AdminLayout>} />
          <Route path="/admin/giving" element={<AdminLayout><AdminGiving /></AdminLayout>} />
          <Route path="/admin/inbox" element={<AdminLayout><AdminInbox /></AdminLayout>} />
          <Route path="/admin/content" element={<AdminLayout><AdminContent /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
          <Route path="/admin/news" element={<AdminLayout><AdminNews /></AdminLayout>} />
          <Route path="/admin/testimonies" element={<AdminLayout><AdminTestimonies /></AdminLayout>} />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>

      {/* Global Interactive Modals */}
      <GivingModal
        isOpen={isGiveOpen}
        onClose={() => setIsGiveOpen(false)}
        onSuccess={(msg) => showToast('Giving Receipt', msg)}
      />

      <EventRegistrationModal
        event={selectedEvent}
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        onSuccess={(msg) => showToast('Event RSVP Confirmed', msg)}
      />

      <SermonPlayerModal
        sermon={selectedSermon}
        isOpen={Boolean(selectedSermon)}
        onClose={() => setSelectedSermon(null)}
      />

      <PlanVisitModal
        isOpen={isPlanVisitOpen}
        onClose={() => setIsPlanVisitOpen(false)}
        onSuccess={(msg) => showToast('VIP Visit Confirmed', msg)}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </Router>
  );
};
