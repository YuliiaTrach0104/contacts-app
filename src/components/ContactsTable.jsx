import React from "react";
import { Table } from "react-bootstrap";
import { TABLE_HEADERS } from "../constants/table";
import Filters from "./Filters";

export default function ContactsTable({ onSelect, contactsData, page }) {
  return (
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
              { firstName, lastName, email, phoneNumber, birthday, id },
              index
            ) => (
              <tr key={index} onClick={() => onSelect(id)}>
                <td>{index + 1 + 5 * (page - 1)}</td>
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
  );
}
