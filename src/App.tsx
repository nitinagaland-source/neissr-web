import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import MessagesPage from './pages/MessagesPage';
import VisionPage from './pages/VisionPage';
import UniquenessPage from './pages/UniquenessPage';
import CoreValuesPage from './pages/CoreValuesPage';
import AcademicsPage from './pages/AcademicsPage';
import BSWPage from './pages/BSWPage';
import MSWPage from './pages/MSWPage';
import SpecialisationPage from './pages/SpecialisationPage';
import FacultyPage from './pages/FacultyPage';
import FacultyProfilePage from './pages/FacultyProfilePage';
import AdmissionsPage from './pages/AdmissionsPage';
import PlacementPage from './pages/PlacementPage';
import StudentLifePage from './pages/StudentLifePage';
import ClubsPage from './pages/ClubsPage';
import ClubDetailPage from './pages/ClubDetailPage';
import ForumsPage from './pages/ForumsPage';
import ForumDetailPage from './pages/ForumDetailPage';
import InfrastructurePage from './pages/InfrastructurePage';
import AchievementsPage from './pages/AchievementsPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import GalleryPage from './pages/GalleryPage';
import MagazinePage from './pages/MagazinePage';
import DocumentsPage from './pages/DocumentsPage';
import NIRFPage from './pages/NIRFPage';
import NAACPage from './pages/NAACPage';
import MandatoryDisclosuresPage from './pages/MandatoryDisclosuresPage';
import IQACPage from './pages/IQACPage';
import StudentServicesPage from './pages/StudentServicesPage';
import ContactPage from './pages/ContactPage';

// Admin Infrastructure & Pages
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './admin/layout/AdminLayout';
import AdminLoginPage from './admin/pages/AdminLoginPage';
import DashboardPage from './admin/pages/DashboardPage';
import FacultyListPage from './admin/pages/FacultyListPage';
import FacultyEditPage from './admin/pages/FacultyEditPage';
import DocumentsListPage from './admin/pages/DocumentsListPage';
import DocumentEditPage from './admin/pages/DocumentEditPage';
import NewsListPage from './admin/pages/NewsListPage';
import NewsEditPage from './admin/pages/NewsEditPage';
import EventsListPage from './admin/pages/EventsListPage';
import EventEditPage from './admin/pages/EventEditPage';
import AchievementsListPage from './admin/pages/AchievementsListPage';
import AchievementEditPage from './admin/pages/AchievementEditPage';
import ClubsListPage from './admin/pages/ClubsListPage';
import ClubEditPage from './admin/pages/ClubEditPage';
import EnquiriesListPage from './admin/pages/EnquiriesListPage';
import SiteSettingsPage from './admin/pages/SiteSettingsPage';
import ContentEditorPage from './admin/pages/ContentEditorPage';
import GalleryAdminPage from './admin/pages/GalleryAdminPage';
import PlaceholderAdminPage from './admin/pages/PlaceholderAdminPage';
import PlacementsListPage from './admin/pages/PlacementsListPage';
import PlacementEditPage from './admin/pages/PlacementEditPage';
import ForumsListPage from './admin/pages/ForumsListPage';
import ForumEditPage from './admin/pages/ForumEditPage';
import IQACAdminPage from './admin/pages/IQACAdminPage';
import StudentServicesAdminPage from './admin/pages/StudentServicesAdminPage';
import { seedFirestoreIfEmpty } from './lib/seedFirestore';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FAF9F7] text-neutral-900 antialiased">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    seedFirestoreIfEmpty();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Admin Login Page */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin Console Routes */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />

            {/* Faculty Management */}
            <Route path="faculty" element={<FacultyListPage />} />
            <Route path="faculty/new" element={<FacultyEditPage />} />
            <Route path="faculty/:id" element={<FacultyEditPage />} />

            {/* Documents Management */}
            <Route path="documents" element={<DocumentsListPage />} />
            <Route path="documents/new" element={<DocumentEditPage />} />
            <Route path="documents/:id" element={<DocumentEditPage />} />

            {/* News Articles Management */}
            <Route path="news" element={<NewsListPage />} />
            <Route path="news/new" element={<NewsEditPage />} />
            <Route path="news/:id" element={<NewsEditPage />} />

            {/* Events Management */}
            <Route path="events" element={<EventsListPage />} />
            <Route path="events/new" element={<EventEditPage />} />
            <Route path="events/:id" element={<EventEditPage />} />

            {/* Achievements Management */}
            <Route path="achievements" element={<AchievementsListPage />} />
            <Route path="achievements/new" element={<AchievementEditPage />} />
            <Route path="achievements/:id" element={<AchievementEditPage />} />

            {/* Clubs Management */}
            <Route path="clubs" element={<ClubsListPage />} />
            <Route path="clubs/new" element={<ClubEditPage />} />
            <Route path="clubs/:id" element={<ClubEditPage />} />

            {/* Page Content Editors & Other Modules */}
            <Route path="content/*" element={<ContentEditorPage />} />
            <Route path="gallery" element={<GalleryAdminPage />} />
            <Route path="enquiries" element={<EnquiriesListPage />} />
            <Route path="settings" element={<SiteSettingsPage />} />

            {/* Placements Management */}
            <Route path="placements" element={<PlacementsListPage />} />
            <Route path="placements/new" element={<PlacementEditPage />} />
            <Route path="placements/:id" element={<PlacementEditPage />} />

            {/* Forums Management */}
            <Route path="forums" element={<ForumsListPage />} />
            <Route path="forums/new" element={<ForumEditPage />} />
            <Route path="forums/:id" element={<ForumEditPage />} />

            <Route path="iqac" element={<IQACAdminPage />} />
            <Route path="student-services" element={<StudentServicesAdminPage />} />
            <Route path="magazines" element={<PlaceholderAdminPage title="Magazines & Publications" />} />
            <Route path="students-council" element={<PlaceholderAdminPage title="Students Council" />} />
            <Route path="users" element={<PlaceholderAdminPage title="User Access Management" />} />
          </Route>
        </Route>

        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about/messages" element={<MessagesPage />} />
          <Route path="/about/vision" element={<VisionPage />} />
          <Route path="/about/uniqueness" element={<UniquenessPage />} />
          <Route path="/about/core-values" element={<CoreValuesPage />} />

          <Route path="/academics" element={<AcademicsPage />} />
          <Route path="/academics/bsw" element={<BSWPage />} />
          <Route path="/academics/msw" element={<MSWPage />} />
          <Route path="/academics/msw/:slug" element={<SpecialisationPage />} />

          <Route path="/faculty" element={<FacultyPage />} />
          <Route path="/faculty/:slug" element={<FacultyProfilePage />} />

          <Route path="/admissions" element={<AdmissionsPage />} />
          <Route path="/placements" element={<PlacementPage />} />
          <Route path="/placement" element={<PlacementPage />} />

          <Route path="/student-life" element={<StudentLifePage />} />
          <Route path="/student-life/clubs" element={<ClubsPage />} />
          <Route path="/student-life/clubs/:slug" element={<ClubDetailPage />} />
          <Route path="/student-life/forums" element={<ForumsPage />} />
          <Route path="/student-life/forums/:slug" element={<ForumDetailPage />} />

          <Route path="/infrastructure" element={<InfrastructurePage />} />
          <Route path="/achievements" element={<AchievementsPage />} />

          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:slug" element={<NewsDetailPage />} />

          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:slug" element={<EventDetailPage />} />

          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/magazine" element={<MagazinePage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/nirf" element={<NIRFPage />} />
          <Route path="/naac" element={<NAACPage />} />
          <Route path="/mandatory-disclosures" element={<MandatoryDisclosuresPage />} />

          <Route path="/iqac" element={<IQACPage />} />
          <Route path="/iqac/:section" element={<IQACPage />} />
          <Route path="/student-services" element={<StudentServicesPage />} />
          <Route path="/student-services/:slug" element={<StudentServicesPage />} />

          <Route path="/contact" element={<ContactPage />} />

          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

