import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FrameworkDetailsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to main frameworks page since we use modals now
    navigate("/admin/frameworks");
  }, [navigate]);

  return null;
}
