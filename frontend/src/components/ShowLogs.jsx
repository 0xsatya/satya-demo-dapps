import React, { useEffect, useState } from "react";
import * as Utils from "../utilities/utils";
import "./ShowLogs.css";

function ShowLogs({
  eventName,
  from,
  to,
  value,
  addressScanUrl,
  isNewLog,
}) {
  const [logClassName, setLogClassName] = useState("showLogs");
  useEffect(() => {
    console.log('isNewLog:'+isNewLog);
    if (isNewLog) {
      setLogClassName("showLogs newLog");
      setTimeout(() => {
        setLogClassName("showLogs");
      }, 3000);
    } else {
      setLogClassName("showLogs");
    }

    return () => {};
  }, [isNewLog]);

  return (
    <div className={logClassName} >
      <span className="logName">{!eventName ? "" : '~'+eventName}</span>
      <span className="logAddress">
        {!from ? (
          "..."
        ) : (
          <a href={addressScanUrl + from} target="_blank" rel="noreferrer">
            {" from " + Utils.getShortAddress(from)}
          </a>
        )}
      </span>
      <span className="logAddress">
        {!to ? (
          "..."
        ) : (
          <a href={addressScanUrl + to} target="_blank" rel="noreferrer">
            {" from " + Utils.getShortAddress(to)}
          </a>
        )}
      </span>
      {!value ? (
        ""
      ) : (
        <span className="logValue">
          <span>{" $" + value}</span>
        </span>
      )}
    </div>
  );
}

export default ShowLogs;
