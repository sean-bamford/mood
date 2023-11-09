import { useNavigate } from "react-router-dom";
const Pattern = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/");
  }
  return (
    <div className="header">
      <h1 className="title">Patterns</h1>
      <p>View your lifestyle patterns and how they affect your wellbeing.</p>
      <button className="back" onClick={handleBack} title="Back to Home">
        ←
      </button>
    </div>

  )
}
export default Pattern;