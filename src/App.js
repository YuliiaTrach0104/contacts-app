import React, { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ContactsTable from "./components/ContactsTable";
import ContactForm from "./components/ContactForm";
import { db } from "./config/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

function App() {
  const [selectedContact, setSelectedContact] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [contactsData, setContactsData] = useState([]);

  const fetchContacts = async () => {
    await getDocs(collection(db, "contacts")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }));
      setContactsData(newData);
    });
  };
  useEffect(() => {
    fetchContacts();
  }, [isEdit]);

  const handleSelectContact = async (id) => {
    const docRef = doc(db, "contacts", `${id}`);
    const documentSnapshot = await getDoc(docRef);
    const contact = JSON.parse(
      JSON.stringify({ id: documentSnapshot.id, ...documentSnapshot.data() })
    );
    setSelectedContact(contact);
    setIsEdit(true);
  };

  const handleEditState = () => {
    setIsEdit(false);
  };

  return (
    <div className="App">
      <ContactForm
        contact={selectedContact}
        onEditChange={handleEditState}
        edit={isEdit}
      />
      <ContactsTable
        onSelect={handleSelectContact}
        contactsData={contactsData}
      />
    </div>
  );
}

export default App;
