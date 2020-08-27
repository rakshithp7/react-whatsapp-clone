import React from "react";
import "./Home.css";
import { useStateValue } from "../StateProvider";

const Home = () => {
  const [{ user }] = useStateValue();

  return (
    <div className="home">
      <h1>Welcome {user?.displayName}!</h1>
      <p>
        This is a simple WhatsApp clone built with React. Please click on a chat
        on the sidebar to start chatting!
      </p>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/rakshithp7"
      >
        Checkout my GitHub profile!
      </a>
    </div>
  );
};

export default Home;
