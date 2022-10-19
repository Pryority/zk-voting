import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import IDRegistrar from "./IDRegistrar";
const Home: NextPage = () => {
  const [_identity, _Setidentity] = useState();

  return (
    <>
      <div>
        <div>
          <IDRegistrar/>
        </div>
      </div>
    </>
  );
};

export default Home;
