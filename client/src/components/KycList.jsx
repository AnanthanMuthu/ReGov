import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@mui/styles";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import axios from "axios";
import Skeleton from "@material-ui/lab/Skeleton";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

const useStyles = makeStyles({
  root: {
    margin: "60px 0",
  },
  link: {
    textDecoration: "none",
    color: "#fff",
  },
  navigation: {
    flex:1,
    flexDirection:"row"
    // float: "right",
  },
  button: {
    // marginLeft: 10,
  },
  top: {
    margin: " 0  0  15px 0",
  },
  pagination: {
    marginTop: 10,
    float: "right",
  },
});

const KycList = () => {
  const classes = useStyles();
  const [kyc, setKyc] = useState([]);
  const [loading, setLoading] = useState(false);

  const getKyc = async () => {
    setLoading(true);
    let response = await axios({
      url: "/kycdocuments/",
      method: "get",
    });
    // axios.get('/kycdocuments/').then((response) => {
    //   setKyc(response.data.data);
    // })
    console.log("data", response.data.data);
    setKyc(response.data.data);
    setLoading(false);
  };

  useEffect(() => {
    getKyc();
  }, []);

  return (
    <Container maxWidth="lg">
      <Grid container className={classes.root}>
        <Grid item md={12}>
          <div className={classes.top}>
            <div className={classes.navigation}>
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
                <Link to="/home" className={classes.link}>
                  Back to Home
                </Link>
              </Button>
            </div>
            <Typography variant="h4">KYC list</Typography>
          </div>

          <table className={classes.table}>
            <thead>
              <tr>
                <th>selfie</th>
                <th>document</th>
                <th>document type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {kyc.map((tr) => (
                <tr key={tr.id}>
                  <td>
                    <img src={tr.selfie} width="100" alt="" />
                  </td>
                  <td>
                    {" "}
                    <img src={tr.document} width="100" alt="" />{" "}
                  </td>
                  <td>{tr.document_type}</td>
                  <td>
                    {tr.is_verified ? (
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<CheckCircleIcon />}>
                        Varified
                      </Button>
                    ) : (
                      <Link to={`/verify-kyc/${tr.id}`}>
                        <Button
                          variant="outlined"
                          size="small"
                          color="secondary">
                          Varify now
                        </Button>
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={classes.pagination}></div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default KycList;
