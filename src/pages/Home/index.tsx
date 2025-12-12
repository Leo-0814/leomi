import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.debug("Home");
    navigate("/charge-list");
  }, []);

  return <div>Home</div>;
};

export default Home;
