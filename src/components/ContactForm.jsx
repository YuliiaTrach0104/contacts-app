import React, { useRef } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import { Button, Col, Row } from "react-bootstrap";
import { PatternFormat } from "react-number-format";
import { db } from "../config/firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

const phoneRegExp = /^[(]?[0-9]{2}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{2}[ .-]?[0-9]{2}$/;

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup
    .string()
    .email("Not a proper email")
    .required(),
  phoneNumber: yup
    .string()
    .matches(phoneRegExp, "Phone number format should be +380 (XX) XXX-XX-XX")
    .required(),
  birthday: yup.string().required()
});

export default function ContactForm({ contact, edit, onEditChange }) {
  const inputPhoneRef = useRef();
  return (
    <Formik
      validationSchema={schema}
      onSubmit={async (values) => {
        const docRef = edit
          ? doc(db, "contacts", contact.id)
          : collection(db, "contacts");
        const inputPhone = inputPhoneRef.current.value;
        if (edit) {
          await updateDoc(docRef, {
            ...values,
            phoneNumber: inputPhone
          }).then(() => {
            onEditChange();
          });
        } else {
          const { id } = await addDoc(docRef, {
            ...values,
            phoneNumber: inputPhone
          });
          id && window.location.reload();
        }
      }}
      enableReinitialize
      initialValues={
        edit
          ? {
              firstName: contact.firstName,
              lastName: contact.lastName,
              email: contact.email,
              phoneNumber: contact.phoneNumber
                .split(" ")
                .slice(1)
                .join("")
                .replace(/[^0-9]/gi, ""),
              birthday: contact.birthday
            }
          : {
              firstName: "",
              lastName: "",
              email: "",
              phoneNumber: "",
              birthday: ""
            }
      }
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        isValid,
        errors
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-1">
            <Form.Group as={Col} controlId="formGridSurname">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                isValid={touched.firstName && !errors.firstName}
                isInvalid={!!errors.firstName}
                placeholder="Please, enter your name"
              />
              <Form.Control.Feedback type="valid">
                Looks good!
              </Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                {errors.firstName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridSurname">
              <Form.Label>Surname</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                isValid={touched.lastName && !errors.lastName}
                isInvalid={!!errors.lastName}
                placeholder="Please, enter your surname"
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                {errors.lastName}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-1">
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                onChange={handleChange}
                name="email"
                type="email"
                value={values.email}
                placeholder="Enter email"
                isValid={touched.email && !errors.email}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <PatternFormat
              format="+380 (##) ###-##-##"
              mask="_"
              name="phoneNumber"
              value={values.phoneNumber}
              onBlur={handleBlur}
              onValueChange={(e) => {
                values.phoneNumber = e.value;
              }}
              valueIsNumericString={true}
              allowEmptyFormatting={true}
              customInput={(props) => {
                return (
                  <Form.Group as={Col} controlId="ind_phone">
                    <Form.Label>Phone number</Form.Label>
                    <Form.Control
                      ref={inputPhoneRef}
                      name="phoneNumber"
                      isValid={touched.phoneNumber && !errors.phoneNumber}
                      isInvalid={!!errors.phoneNumber}
                      {...props}
                    />
                    <Form.Control.Feedback type="valid">
                      Looks good!
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                      {errors.phoneNumber}
                    </Form.Control.Feedback>
                  </Form.Group>
                );
              }}
            />
          </Row>
          <Row className="mb-1">
            <Form.Group as={Col} xs={6} controlId="formGridBirthday">
              <Form.Label>City</Form.Label>
              <Form.Control
                onChange={handleChange}
                name="birthday"
                type="date"
                value={values.birthday}
                isValid={touched.birthday && !errors.birthday}
                isInvalid={!!errors.birthday}
              />
              <Form.Control.Feedback type="valid">
                Looks good!
              </Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                {errors.birthday}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          {edit ? (
            <Button variant="primary" type="submit">
              Update contact
            </Button>
          ) : (
            <Button variant="primary" type="submit">
              Add to contacts
            </Button>
          )}
        </Form>
      )}
    </Formik>
  );
}
