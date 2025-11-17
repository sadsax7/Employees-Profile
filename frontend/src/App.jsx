import { Outlet } from "react-router-dom";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <main
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "2rem 1rem",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default App;
