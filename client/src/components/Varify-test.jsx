import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import img from "../assets/images/id.jpg";

const Varify = ({responseData}) => {
  const [resData, setResData] = useState([]);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [id, setId] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  const initCanvas =  () => {
    console.log("res", responseData);

    let bboxes = responseData.inferred_data.bboxes;
    let image = responseData.document;

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    var img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = image;

    const boxes =  bboxes;

    // draw circles
    boxes.forEach((box) => {
      ctx.fillRect(box.left, box.top, box.width, box.height);
      ctx.fillText(box.text, box.left, box.top, box.width, box.height);
    });

    canvas.addEventListener("click", (e) => {
      const mousePoint = {
        x: e.clientX,
        y: e.clientY,
      };
      console.log("axis", e.clientX, e.clientY);
      boxes.forEach((box) => {
        if (isIntersect(mousePoint, box)) {
          let changedValue = box.text;
          setValue(value + " " + box.text);
          console.log("pre", value, "now", box.text);
        }
      });
    });
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
  };

  // window.onload = function() {
  //   getData()
  // };

  useEffect(() => {
    // getData();
      initCanvas();
  }, [value]);

  if (loading) {
    return (
      <div className="">
        <h1>Loading...</h1>
      </div>
    );
  } else {
    return (
      <Grid container>
        <Grid item lg={12}>
          <canvas
            id="canvas"
            width="500"
            height="500"
            style={{ border: "1px solid #ddd" }}
          ></canvas>
          <br />
          <br />
          <br />
          <br />
          <input type="radio" name="type" value="name" onChange={handleType} />
          <input type="text" value={name} placeholder="name" />
          <br />
          <input type="radio" name="type" value="dob" onChange={handleType} />
          <input type="text" value={dob} placeholder="dob" />
          <br />
          <input type="radio" name="type" value="id" onChange={handleType} />
          <input type="text" value={id} placeholder="id" />
          <br />
        </Grid>
      </Grid>
    );
  }
};

export default Varify;
