// app/assistant-dashboard/page.jsx
import ProtectedRoute from "@/components/ProtectedRoutes";

export default function AssistantDashboard() {
  return (
    <ProtectedRoute allowedRoles={["assistant"]}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Welcome, Assistant!</h1>
        <p>Your dashboard content goes here...</p>
      </div>
    </ProtectedRoute>
  );
}
