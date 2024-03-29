import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { urlApi } from "../helpers/Helpers";
import "./universal.css";
const Register = () => {
  const URL = urlApi();
  const history = useNavigate();
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [cpass, setCpass] = useState("");

  let regis = (e) => {
    e.preventDefault();
    axios
      .post(URL + "/user/register", {
        name: name,
        job: job,
        email: email,
        password: pass,
        confirmpass: cpass,
      })
      .then((result) => {
        //success
        history("/login", { replace: true });
      })
      .catch((error) => {
        //error
      });
  };

  return (
    <div>
      <Container fluid={true}>
        <Row className="h-100">
          <Col md={6} className="h-100">
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
              <Col md={8} xs={12}>
                <h2 className="mb-3">Register</h2>
                <Form onSubmit={regis}>
                  <Form.Group className="mb-2" controlId="formGroupEmail">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      placeholder="Enter name"
                    />
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="formGroupEmail">
                    <Form.Label>Job/Passion</Form.Label>
                    <Form.Control
                      type="text"
                      value={job}
                      onChange={(e) => {
                        setJob(e.target.value);
                      }}
                      placeholder="Enter your Job/passion"
                    />
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="formGroupEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      type="email"
                      placeholder="Enter email"
                    />
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="formGroupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      value={pass}
                      onChange={(e) => {
                        setPass(e.target.value);
                      }}
                      type="password"
                      placeholder="Password"
                    />
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="formGroupPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      value={cpass}
                      onChange={(e) => {
                        setCpass(e.target.value);
                      }}
                      type="password"
                      placeholder="Password"
                    />
                  </Form.Group>
                  <Button style={{ width: "100%" }} variant="dark" type="submit">
                    Submit
                  </Button>
                </Form>
              </Col>
            </div>
          </Col>
          <Col md={6} className="bg-dark">
            <div style={{ display: "flex", alignItems: "center", height: "100vh" }}>
              <div className="m-4">
                <h2 style={{ color: "white" }}>Quans App</h2>
                <h4 style={{ color: "white" }}>Join Now, we will help find solution for your question</h4>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
