import React from "react";
import ShowDataComponent from "../components/ShowDataComponent";

import "./Home.css";

function Home({
  networkId,
  networkName,
  useraddress,
  accountBalance,
  currencyUnit,
  addressScanUrl,
  latestBlockNumber,
  latestTransaction
}) {
  return (
    <div className="homeComponent">
      <div className="homeComponentHeader">
        <span>Details from Wallet (Metamask)</span>
      </div>
      <div className="homedatadiv">
        <div className="dataCard">
          <div className="dataCardHeader">
            <span>Network Details</span>
          </div>
          <ShowDataComponent
            dataName="Name"
            dataType="text"
            dataValue={networkName}
          />
          <ShowDataComponent
            dataName="Id"
            dataType="text"
            dataValue={networkId}
          />
        </div>

        <div className="dataCard">
          <div className="dataCardHeader">
            <span>Account Details </span>
          </div>
          <ShowDataComponent
            dataName="Address"
            dataType="address"
            dataValue={useraddress}
            addressScanUrl={addressScanUrl}
          />
          <ShowDataComponent
            dataName="Balance"
            dataType="money"
            dataValue={accountBalance}
            currencyUnit={currencyUnit}
          />
        </div>
        <div className="dataCard">
          <div className="dataCardHeader">
            <span>Recent Network Events</span>
          </div>
          <ShowDataComponent
            dataName="Latest Block:"
            dataType="number"
            dataValue={latestBlockNumber}
          />
          <ShowDataComponent
            dataName="Latest Txn:"
            dataType="address"
            dataValue={latestTransaction}
            addressScanUrl={addressScanUrl ? addressScanUrl.replace('address', 'tx') : addressScanUrl}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
