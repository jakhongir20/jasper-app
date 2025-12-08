import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MoldingAddPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to main moldings page since we use modals now
    navigate("/admin/moldings");
  }, [navigate]);

  return null;
}
