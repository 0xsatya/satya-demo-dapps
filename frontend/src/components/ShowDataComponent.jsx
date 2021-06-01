import React, { useState } from "react";
import * as Utils from "../utilities/utils";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import CountUpComponent from "./CountUpComponent";
import "./ShowDataComponent.css";
import { Tooltip } from "@material-ui/core";

function ShowDataComponent({
  dataName,
  dataType,
  dataValue,
  addressScanUrl,
  currencyUnit,
}) {
  //dataType = "text" or "address" or "money"
  let returnData;
  const [toolTipValue, setToolTipValue] = useState("copy to clipboard");
  const copyToClipboardHandler = () => {
    console.log("copytoclipboard called");
    navigator.clipboard.writeText(dataValue);
    setToolTipValue("copied!");
    setTimeout(() => {
      setToolTipValue("copy to clipboard");
    }, 1000);
  };

  const toolTip = (
    <Tooltip title={toolTipValue}>
      {toolTipValue === "copied!" ? (
        <FileCopyIcon
          onClick={copyToClipboardHandler}
          style={{ fontSize: "medium", cursor: "pointer" }}
        />
      ) : (
        <FileCopyOutlinedIcon
          onClick={copyToClipboardHandler}
          style={{ fontSize: "medium", cursor: "pointer" }}
        />
      )}
    </Tooltip>
  );

  if (dataType === "address") {
    returnData = (
      <div className="addressDataShow">
        <div>
          <a href={addressScanUrl + dataValue} target="_blank" rel="noreferrer">
            {Utils.getShortAddress(dataValue)}
          </a>
        </div>
        <div className="copyClipboardIcon">{toolTip}</div>
      </div>
    );
  } else if (dataType === "money") {
    returnData = (
      <div className="balanceShowData">
        <CountUpComponent endNumber={dataValue} currencyUnit={currencyUnit} />
        <div className="copyClipboardIcon">{toolTip}</div>
      </div>

    );
  } else if (dataType === "text") {
    returnData = (
      <div className="normalText">
        <div>{dataValue}</div>
      </div>
    );
  }else if (dataType === "number") {
    returnData = (
      <div className="balanceShowData">
      <CountUpComponent endNumber={dataValue} prefix={'# '} />
      <div className="copyClipboardIcon">{toolTip}</div>
    </div>
    );
  } else {
    returnData = <div>{dataValue}</div>;
  }

  return (
    <div className="showData">
      <div className="showDataName"> {dataName} </div>
      {returnData}
    </div>
  );
}

export default ShowDataComponent;
