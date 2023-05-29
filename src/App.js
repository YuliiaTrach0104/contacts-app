import React, { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ContactsTable from "./components/ContactsTable";
import ContactForm from "./components/ContactForm";
import { db } from "./config/firebase";
import {
  collection,
  doc,
  endBefore,
  getDoc,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  startAt
} from "firebase/firestore";
import PaginationComponent from "./components/Pagination";
import Filters from "./components/Filters";

function App() {
  const [contactsData, setContactsData] = useState([]);
  const [allContacts, setAllContacts] = useState([]);

  const [page, setPage] = useState(1);
  const [contactsCount, setContactsCount] = useState(0);

  const [selectedContact, setSelectedContact] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const [allYears, setAllYears] = useState();
  const [filters, setFilters] = useState();

  useEffect(() => {
    fetchContacts();
    fetchAllContacts();
  }, [isEdit]);

  const fetchContacts = async () => {
    await getDocs(
      query(collection(db, "contacts"), orderBy("birthday", "desc"), limit(5))
    ).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }));
      setContactsData(newData);
    });
  };

  const fetchAllContacts = async () => {
    await getDocs(
      query(collection(db, "contacts"), orderBy("birthday", "desc"))
    ).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }));
      const years = [
        ...new Set(newData.map(({ birthday }) => birthday.split("-")[0]))
      ];
      setAllYears(years);
      setAllContacts(newData);
      setContactsCount(newData.length);
    });
  };

  const showNext = ({ item }) => {
    if (contactsData.length === 0) {
      alert("Thats all we have for now !");
    } else {
      const fetchNextData = async () => {
        await getDocs(
          query(
            collection(db, "contacts"),
            orderBy("birthday", "desc"),
            limit(5),
            startAfter(item.birthday)
          )
        ).then((querySnapshot) => {
          const newData = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
          }));
          setContactsData(newData);
          setPage(page + 1);
        });
      };
      fetchNextData();
    }
  };

  const showPage = ({ currentPage }) => {
    const fetchPageData = async () => {
      await getDocs(
        query(
          collection(db, "contacts"),
          orderBy("birthday", "desc"),
          limit(5),
          startAt(allContacts[0 + 5 * (currentPage - 1)].birthday)
        )
      ).then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id
        }));
        setContactsData(newData);
        setPage(currentPage);
      });
    };
    fetchPageData();
  };
  const showPrevious = ({ item }) => {
    const fetchPreviousData = async () => {
      await getDocs(
        query(
          collection(db, "contacts"),
          orderBy("birthday", "desc"),
          endBefore(item.birthday),
          limitToLast(5)
        )
      ).then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id
        }));
        setContactsData(newData);
        setPage(page - 1);
      });
    };
    fetchPreviousData();
  };

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

  const handleCheckFilters = (id) => {
    setFilters(id);
  };

  return (
    <div className="App">
      <ContactForm
        contact={selectedContact}
        onEditChange={handleEditState}
        edit={isEdit}
      />
      <div className="App-table">
        <h1>Contacts list</h1>
        <Filters filters={allYears} />
        <ContactsTable
          onSelect={handleSelectContact}
          contactsData={contactsData}
          page={page}
        />
      </div>
      <div className="App-pagination">
        <PaginationComponent
          next={showNext}
          previous={showPrevious}
          currentPage={showPage}
          page={page}
          contacts={contactsData}
          allContacts={allContacts}
          count={contactsCount}
        />
      </div>
    </div>
  );
}

export default App;
