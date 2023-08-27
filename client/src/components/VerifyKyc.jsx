import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { Typography, Button, TextField, IconButton } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import RefreshIcon from "@material-ui/icons/Refresh";
import Delete from "@material-ui/icons/Delete";
import Cancel from "@material-ui/icons/Cancel";
import Skeleton from "@material-ui/lab/Skeleton";

import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles({
  root: {
    margin: "60px 0",
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
  top: {
    margin: " 0  0  15px 0",
  },
  wrapper: {
    display: "flex",
  },
  fieldWrapper: {
    marginLeft: 20,
    flex: "1",
  },
  canvasWrapper: {
    flex: "1",
  },
  input: {
    width: "93%",
  },
  radio: {
    float: "left",
    marginRight: 20,
    marginTop: 25,
  },
  canvas: {
    border: "1px solid #ddd",
    marginTop: 7,
    // width: '100%'
  },
  cancel: {
    float: "right",
    marginTop: -40,
    height: 0,
    backgroundColor: "transparent",
  },
  submit: {
    marginTop: 20,
    float: "right",
  },
  main_wrapper: {
    margin: "30px",
  },
  none: {
    display: "none",
  },
  "@media only screen and (max-width: 1600px)": {
    wrapper: {
      display: "flex",
      flexDirection: "column",
    },
  },
});

const KycList = () => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const { kyc_id } = useParams();
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [id, setId] = useState("");
  const [value, setValue] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [kycData, setKycData] = useState([]);

  const initCanvas = async () => {
    setLoading(true);

    let response = await axios({
      url: `kycresults/${kyc_id}/`,
    });

    let responseData = response.data.data;
    setKycData(responseData);
    console.log("kyc data", responseData);
    setName(responseData.name);
    setId(responseData.doc_id);
    setDob(responseData.dob);

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    if (
      !responseData.inferred_data ||
      responseData.inferred_data.bboxes === null
    ) {
      return alert("something is wrong");
    }
    const boxes = responseData.inferred_data.bboxes;

    // draw circles
    boxes.forEach((box) => {
      ctx.fillStyle = "black";
      ctx.fillRect(box.left, box.top, box.width, box.height);
      ctx.fillText(box.text, box.left, box.top, box.width, box.height);
    });

    canvas.addEventListener("click", (e) => {
      var rect = canvas.getBoundingClientRect();
      const mousePoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      console.log("click on circle: " + mousePoint.x, mousePoint.y);
      boxes.forEach((box) => {
        if (isIntersect(mousePoint, box)) {
          let newValue = localStorage.getItem("value");
          if (newValue.length > 0) {
            let testValue = newValue + box.text + " ";
            localStorage.setItem("value", testValue);
            setValue(testValue);
          } else {
            let testValue = box.text + " ";
            localStorage.setItem("value", testValue);
            setValue(testValue);
          }
          console.log("pre", value, "now", box.text);
        }
      });
      setRefresh(!refresh);
    });
    var img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
    };
    img.src = responseData.inferred_doc;
    setLoading(false);
  };

  const isIntersect = (point, box) => {
    if (
      point.x < box.left ||
      point.x > box.left + box.width ||
      point.y < box.top ||
      point.y > box.top + box.height
    ) {
      return false;
    } else {
      return true;
    }
  };

  const handleType = (e) => {
    let fieldType = e.target.value;

    if (fieldType === "name") {
      setName(value);
    } else if (fieldType === "dob") {
      setDob(value);
    } else if (fieldType === "id") {
      setId(value);
    }

    setValue("");
    localStorage.setItem("value", "");
    setRefresh(!refresh);
  };

  const handleClearValue = () => {
    setValue("");
    localStorage.setItem("value", "");
    setRefresh(!refresh);
  };
  const handleClearAll = () => {
    setValue("");
    setName("");
    setDob("");
    setId("");
    localStorage.setItem("value", "");
    var ele = document.getElementsByName("type");
    for (var i = 0; i < ele.length; i++) ele[i].checked = false;
    setRefresh(!refresh);
  };

  const handleSingleClear = (type) => {
    if (type === "name") {
      setName("");
    } else if (type === "dob") {
      setDob("");
    } else if (type === "id") {
      setId("");
    }
    localStorage.setItem("value", "");
    var ele = document.getElementsByName("type");
    for (var i = 0; i < ele.length; i++) ele[i].checked = false;
    setRefresh(!refresh);
  };

  const handleVarify = async (e) => {
    e.preventDefault();
    console.log({ name, doc_id: id });

    setLoading(true);
    try {
      let date = moment(dob).format("YYYY-MM-DD");
      console.log("date", date);
      console.log("dddd", { name, doc_id: id, dob: date });
      let res = await axios({
        url: `/kycresults/${kyc_id}/`,
        method: "PATCH",
        data: { name, doc_id: id, dob: date },
      });
      console.log("res", res);
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Succesfully Submited",
          showConfirmButton: false,
          timer: 1500,
        });
        console.log("res", res.data.id);
        let verifyed = await axios({
          url: `/kycresults/${kyc_id}/`,
          method: "get",
        });
        console.log("response", verifyed);
        if (verifyed.data.data.is_verified) {
          Swal.fire({
            icon: "success",
            title: "Succesfully Verifyed",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate(`/`);
        } else {
          Swal.fire({
            icon: "warning",
            title: verifyed.data.data.reason,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    initCanvas();
    localStorage.setItem("value", "");
  }, []);

  return (
    <div className={classes.main_wrapper}>
      <Grid container className={classes.root}>
        <Grid item md={12}>
          <div className={classes.top}>
            <div className={classes.navigation}>
              <Button
                variant="contained"
                size="small"
                color="primary"
                className={classes.button}>
                <Link to="/kyc-list" className={classes.link}>
                  KYC list
                </Link>
              </Button>
              <Button
                variant="contained"
                size="small"
                color="primary"
                className={classes.button}>
                <Link to="/create-kyc" className={classes.link}>
                  Create KYC
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
            <Typography variant="h4">KYC Verify</Typography>
          </div>

          <div className={classes.wrapper}>
            <div className={classes.canvasWrapper}>
              {loading ? (
                <LinearProgress />
              ) : (
                <div>
                  {value ? (
                    <div style={{ float: "right", height: 0 }}>
                      <Button
                        onClick={handleClearValue}
                        variant="outlined"
                        color="secondary"
                        startIcon={<RefreshIcon />}
                        style={{ marginTop: 10, marginRight: 10 }}>
                        Clear
                      </Button>
                    </div>
                  ) : null}
                  {(name || dob || id) && !value ? (
                    <div style={{ float: "right", height: 0 }}>
                      <Button
                        onClick={handleClearAll}
                        variant="outlined"
                        color="secondary"
                        startIcon={<Delete />}
                        style={{ marginTop: 10, marginRight: 10 }}>
                        Clear All
                      </Button>
                    </div>
                  ) : null}
                  {value ? (
                    <Alert severity="success">
                      <AlertTitle>Clicked on </AlertTitle>
                      <strong>{value}</strong>
                    </Alert>
                  ) : (
                    <Alert severity="warning">
                      <AlertTitle>Please </AlertTitle>
                      Click on image where text
                    </Alert>
                  )}
                </div>
              )}

              <div className={classes.outer}>
                <canvas
                  id="canvas"
                  className={loading ? classes.none : classes.canvas}></canvas>
              </div>
            </div>
            <div className={classes.fieldWrapper}>
              <form onSubmit={handleVarify}>
                <input
                  type="radio"
                  name="type"
                  value="name"
                  onChange={handleType}
                  className={classes.radio}
                />
                <TextField
                  className={classes.input}
                  label="Name"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                />
                <div className={classes.cancel}>
                  <IconButton onClick={() => handleSingleClear("name")}>
                    <Cancel />
                  </IconButton>
                </div>
                <br />
                <input
                  type="radio"
                  name="type"
                  value="dob"
                  onChange={handleType}
                  className={classes.radio}
                />

                <TextField
                  className={classes.input}
                  placeholder="08 jan 1999"
                  label="Dob"
                  value={dob}
                  required
                  onChange={(e) => setDob(e.target.value)}
                />
                <div className={classes.cancel}>
                  <IconButton onClick={() => handleSingleClear("dob")}>
                    <Cancel />
                  </IconButton>
                </div>

                <br />
                <input
                  type="radio"
                  name="type"
                  value="id"
                  onChange={handleType}
                  className={classes.radio}
                />

                <TextField
                  className={classes.input}
                  label="ID"
                  value={id}
                  required
                  onChange={(e) => setId(e.target.value)}
                />
                <div className={classes.cancel}>
                  <IconButton onClick={() => handleSingleClear("id")}>
                    <Cancel />
                  </IconButton>
                </div>
                {!loading ? (
                  <>
                    <Button
                      variant="contained"
                      color="secondary"
                      // onClick={handleVarify}
                      className={classes.submit}
                      type="submit">
                      Varify
                    </Button>
                    <Link to={{ pathname: "/update-kyc", state: kycData }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        style={{ marginRight: 5 }}
                        className={classes.submit}>
                        Update
                      </Button>
                    </Link>
                  </>
                ) : null}
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default KycList;
