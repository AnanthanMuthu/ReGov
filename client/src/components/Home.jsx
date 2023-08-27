import React from "react";
import { Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {
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
  const classes = useStyles();
  const handleLogout = async () => {
    await localStorage.removeItem("user");

    window.location.reload();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        alignItems: "center",
      }}>
      <div>
        <h1
          style={{
            padding: "10px",
            margin: "10px",
          }}>
          ReGov Technologies
        </h1>
      </div>
      <div className="">
        <Typography variant="h3" className={classes.header}>
          Welcome {JSON.parse(localStorage.getItem("user")).fullname}
        </Typography>
        <div className={classes.action}>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            className={classes.button}>
            <Link to="/kyc-list" className={classes.link}>
              KYC List
            </Link>
          </Button>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            className={classes.button}>
            <Link to="/create-kyc" className={classes.link}>
              New KYC
            </Link>
          </Button>
        </div>
      </div>
      <div>
        <div
          onClick={handleLogout}
          className="toggle-button"
          style={{ fontSize: "25px" }}>
          Logout
        </div>
      </div>
    </div>
  );
};

export default Home;
