import React from "react";
import GenericDocAdminPage from "../components/GenericDocAdminPage";
export default function LessonPlanAdminPage() {
  return <GenericDocAdminPage title="Lesson Plans" subtitle="Upload semester-wise lesson plans. Supports Google Drive links, PDFs, and images." collectionName="lesson_plans" />;
}