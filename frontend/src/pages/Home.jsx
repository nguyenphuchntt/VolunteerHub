import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Welcome to the Home Page</h1>
      <div style={{ marginTop: "24px" }}>
        <Link
          to="/feed"
          style={{
            padding: "12px 24px",
            backgroundColor: "#036B30",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "500",
          }}
        >
          Go to Social Feed
        </Link>
      </div>
    </div>
  );
}

export default Home;
