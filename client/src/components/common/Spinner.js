import React from "react";
import Gif from "./spinner.gif";

export default function Spinner() {
  return (
    <div>
      <img
        src={Gif}
        style={{ width: "200px", margin: "auto", display: "block" }}
        alt="loading..."
      />
    </div>
  );
}
