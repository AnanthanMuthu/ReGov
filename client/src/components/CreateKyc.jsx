import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  TextField,
  Typography,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@mui/styles";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    // background: "#ddd",
  },
  wrapper: {
    width: 600,
    background: "rgba(255,255,255,0.5)",
    padding: 30,
    overflow: "hidden",
    borderRadius: 7,
  },
  input: {
    width: "100%",
    marginBottom: 15,
  },
  link: {
    textDecoration: "none",
    color: "#fff",
  },
  navigation: {
    float: "right",
  },
  button: {
    marginLeft: 10,
  },
  fieldInput: {
    marginTop: 20,
  },
  formControl: {
    // margin: theme.spacing(1),
    display: "block",
    marginTop: 10,
    marginBottom: 20,
  },
  error: {
    paddingTop: 7,
    color: "#c0392b",
  },
}));
const CreateKyc = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [docType, setDocType] = useState("");
  const [doc, setDoc] = useState("");
  const [selfie, setSelfie] = useState("");
  const [message, setMessage] = useState({});

  const imageButton = () => {
    const actualBtn = document.getElementById("actual-btn");

    const fileChosen = document.getElementById("file-chosen");

    actualBtn.addEventListener("change", function () {
      fileChosen.textContent = this.files[0].name;
    });
  };

  const imageButton2 = () => {
    const actualBtn2 = document.getElementById("actual-btn2");

    const fileChosen2 = document.getElementById("file-chosen2");

    actualBtn2.addEventListener("change", function () {
      fileChosen2.textContent = this.files[0].name;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("row data", doc, selfie, docType);
    try {
      const data = new FormData();
      if (doc) {
        data.append("document", doc);
      }
      if (selfie) {
        data.append("selfie", selfie);
      }
      data.append("document_type", docType);

      console.log("data", data);

      let res = await axios({
        url: "/kycdocuments",
        method: "post",
        data: data,
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          type: "formData",
        },
      });

      console.log("dddd", res);
      if (res.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Succesfully Saved",
          showConfirmButton: false,
          timer: 1000,
        });
        console.log("res", res.data.id);
        navigate(`/verify-kyc/${res.data.id}/`);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data);
      }
    }
  };

  useEffect(() => {
    imageButton();
    imageButton2();
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <div className={classes.navigation}>
          <Button
            variant="contained"
            size="small"
            color="primary"
            className={classes.button}>
            <Link to="/kyc-list" className={classes.link}>
              KYC List
            </Link>
          </Button>
          <Button
            variant="contained"
            size="small"
            color="primary"
            className={classes.button}>
            <Link to="/" className={classes.link}>
              Back to Home
            </Link>
          </Button>
        </div>
        <Typography variant="h4">KYC Creation Form</Typography>
        <form onSubmit={handleSubmit}>
          <div className={classes.fieldInput}>
            <input
              type="file"
              id="actual-btn"
              hidden
              onChange={(e) => setSelfie(e.target.files[0])}
              name="selfie"
            />
            <label htmlFor="actual-btn">
              <Button
                variant="contained"
                color="primary"
                component="span"
                className={classes.buttonStyle}
                style={{ marginLeft: "-0px" }}>
                Choose Selfie
              </Button>
            </label>
            <span id="file-chosen" style={{ marginLeft: 15 }}>
              No file chosen
            </span>
          </div>
          {message && message.selfie ? (
            <div className={classes.error}>{message.selfie}</div>
          ) : null}

          <div className={classes.fieldInput}>
            <input
              type="file"
              id="actual-btn2"
              hidden
              onChange={(e) => setDoc(e.target.files[0])}
              name="doc"
            />
            <label htmlFor="actual-btn2">
              <Button
                variant="contained"
                color="primary"
                component="span"
                className={classes.buttonStyle}
                style={{ marginLeft: "-0px" }}>
                Choose Document
              </Button>
            </label>
            <span id="file-chosen2" style={{ marginLeft: 15 }}>
              No file chosen
            </span>
          </div>
          {message && message.document ? (
            <div className={classes.error}>{message.document}</div>
          ) : null}

          <FormControl className={classes.formControl}>
            <InputLabel id="type-label">Document type</InputLabel>

            <Select
              labelId="type-label"
              id="type"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              style={{ width: "100%" }}>
              <MenuItem value="nid">NID</MenuItem>
              <MenuItem value="passport">Passport</MenuItem>
              <MenuItem value="driving_license">Driving License</MenuItem>
            </Select>
            {message && message.document_type ? (
              <div className={classes.error}>{message.document_type}</div>
            ) : null}
          </FormControl>

          {/* <TextField className={classes.input} label="Selfie" />
          <TextField className={classes.input} label="Document" />
          <TextField className={classes.input} label="Document type" /> */}
          <div className="" style={{ float: "right" }}>
            <Button variant="contained" color="secondary" type="submit">
              Add New
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateKyc;
