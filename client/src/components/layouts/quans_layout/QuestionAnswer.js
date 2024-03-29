import React from "react";
import { Card, Row } from "react-bootstrap";
import { BsHandThumbsUp, BsHandThumbsUpFill } from "react-icons/bs";
import { urlImage } from "../../helpers/Helpers";
import "./../../pages/universal.css";

const Question = (props) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const date = new Date(props.date);
  let likeCheck = props.likeCheck;
  let id = props.id;
  const idUser = JSON.parse(localStorage.getItem("us_da_prv"));

  const likeAdd = () => {
    return props.addLike(id, props.index);
  };
  return (
    <div>
      {/*Answer.Component.js*/}
      <section className="my-4 pt-3">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-1 col-1 d-flex align-content-center flex-wrap">
              <div onClick={likeAdd} className="col-md-12 text-center">
                {/* <BsHandThumbsUp className="h3" /> */}
                {idUser ? (
                  likeCheck === 0 ? (
                    <BsHandThumbsUp className="h3">a</BsHandThumbsUp>
                  ) : (
                    <BsHandThumbsUpFill style={{ color: "#198754" }} className="h3">
                      b
                    </BsHandThumbsUpFill>
                  )
                ) : (
                  <BsHandThumbsUp className="h3">c</BsHandThumbsUp>
                )}
              </div>

              <div className="col-md-12 text-center">{props.count_like}</div>
            </div>
            <div className="col-md-11 col-11">{props.answer}</div>
          </div>
        </div>

        <Row>
          <div className="col-md-4 col-6 d-flex align-items-end">
            <span style={{ fontSize: "14px" }}>Posted On : {date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear()}</span>
          </div>
          <div className="col-md-8 col-6 d-flex flex-row-reverse mt-4">
            <div className="col-md-5 col-12">
              <Card>
                <Card.Body className="p-2">
                  <div className="col-md-12">
                    <Row>
                      <div className="col-md-4 col-4">
                        <img className="card-img-mini" src={urlImage() + props.image} alt="" />
                      </div>
                      <div className="col-md-8 col-8 g-0">
                        <div style={{ fontSize: "15px" }}>{props.name_creator}</div>
                        <div style={{ fontSize: "13px" }}>{props.name_job_creator}</div>
                      </div>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Row>
        <hr className="mt-2 mb-4" style={{ color: "#198754", opacity: "0.5" }} />
      </section>
      {/*Answer.Component.js*/}
    </div>
  );
};

export default Question;
