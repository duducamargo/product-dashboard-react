import { Route, Routes } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProductDetailsPage } from "@/pages/ProductDetailsPage";
import { appPaths } from "@/routes/paths";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path={appPaths.login} element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path={appPaths.home} element={<HomePage />} />
        <Route path={appPaths.productDetailsRoute} element={<ProductDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
