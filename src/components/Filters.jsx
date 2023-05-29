import React from "react";
import {
  ButtonGroup,
  Col,
  Dropdown,
  DropdownButton,
  Form,
  FormCheck
} from "react-bootstrap";

export default function Filters({ filters, selectedFilters }) {
  return (
    <DropdownButton
      as={ButtonGroup}
      sm={3}
      size="sm"
      drop={"down"}
      variant="secondary"
      title={`Filtering by year`}
    >
      {filters &&
        !!filters.length &&
        filters.map((field, index) => (
          <Dropdown.Item eventKey={index} key={index}>
            <Form.Check
              type={"checkbox"}
              id={field}
              key={index}
              label={field}
              checked={selectedFilters.includes(field)}
            />
          </Dropdown.Item>
          // <option value={field} key={index}>
          //
          // </option>
        ))}
    </DropdownButton>
  );
}
