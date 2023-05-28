import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ContactsTable from "./components/ContactsTable";
import ContactForm from "./components/ContactForm";

function App() {
  return (
    <div className="App">
      <ContactForm />
      <ContactsTable />
    </div>
  );
}

export default App;
