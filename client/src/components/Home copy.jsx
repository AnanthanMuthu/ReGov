import React from "react";
import { Typography, makeStyles, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import bg from "../assets/images/bg.jpg";

const useStyle = makeStyles({
  root: {
    background: `url(${bg})`,
    backgroundSize: "cover",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  action: {
    display: "flex",
    justifyContent: "center",
  },
  button: {
    margin: 10,
  },
  wrapper: {
    padding: 60,
    display: "flex",
    background: "rgba(44, 62, 80,0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
  },
  header: {
    marginBottom: 30,
  },
  link: {
    textDecoration: "none",
    color: "#fff",
  },
});

const Home = () => {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <div className="">
          <Typography variant="h3" className={classes.header}>
            Welcome to EKYC
          </Typography>
          <div className={classes.action}>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              className={classes.button}
            >
              <Link to="/kyc-list" className={classes.link}>
                KYC List
              </Link>
            </Button>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              className={classes.button}
            >
               <Link to="/create-kyc" className={classes.link}>
               Create New KYC
              </Link>
              
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
