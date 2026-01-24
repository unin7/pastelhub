import { Routes, Route, Navigate } from "react-router-dom";
import { GuidePage } from "./GuidePage";
import { WikiGuideSection } from "./components/WikiGuideSection";
import { GuideDocumentViewer } from "./components/GuideDocumentViewer";

export function GuideRoutes() {
  return (
    <Routes>
      <Route element={<GuidePage />}>
        <Route index element={<Navigate to="basic" replace />} />
        <Route path=":slug" element={<WikiGuideSection />} />
        <Route path=":slug/:id" element={<GuideDocumentViewer />} />
      </Route>
    </Routes>
  );
}
