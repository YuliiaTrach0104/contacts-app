import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { TABLE_HEADERS } from "../constants/table";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

export default function ContactsTable() {
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
  }, []);
  return (
    <div className="App-table">
      <h1>Contacts list</h1>
      <Table striped hover>
        <thead>
          <tr>
            {TABLE_HEADERS.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contactsData &&
            !!contactsData.length &&
            contactsData.map(
              (
                { firstName, lastName, email, phoneNumber, birthday },
                index
              ) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{firstName}</td>
                  <td>{lastName}</td>
                  <td>{email}</td>
                  <td>{phoneNumber}</td>
                  <td>{birthday}</td>
                </tr>
              )
            )}
        </tbody>
      </Table>
    </div>
  );
}
