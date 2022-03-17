import React, { useEffect, useState } from "react";
import ComInfoTable from "@components/ComInfoTable";
import ComInfoGraph from "@components/ComInfoGraph";
import ComInfoDailyPrice from "@components/DailyPrice";
import { RouteWrapper, PriceWrapper } from "./style";
import { sampleJson } from "@utils/api";
import { useParams } from "react-router-dom";
import { HashLoader } from "react-spinners";

const DoComInfo = () => {
  const [comInfoData, setComInfoData] = useState({});
  const crno = useParams();

  useEffect(() => {
    (async () => {
      sampleJson(crno.stockId, "balance")
        .then((res) => res.data)
        .then((data) => setComInfoData(data));
    })();
  }, [crno]);

  return (
    <RouteWrapper>
      <PriceWrapper>
        <ComInfoGraph />
        <ComInfoDailyPrice />
      </PriceWrapper>
      {Object.keys(comInfoData).length ? (
        <ComInfoTable
          yearly={comInfoData.yearly}
          quarters={comInfoData.quarters}
        />
      ) : (
        <HashLoader color={"#48a185"} size={50} />
      )}
    </RouteWrapper>
  );
};

export default DoComInfo;
