import React, { useEffect, useState } from "react";
import { ethers, Contract } from "ethers";
import SimpleStorage from "../contracts/SimpleStorage.json";
import "./SimpleStorageDapp.css";
import ShowDataComponent from "../components/ShowDataComponent";

function SimpleStorageDapp({
  provider,
  networkId,
  useraddress,
  accountBalance,
  addressScanUrl,
  currencyUnit,
}) {
  const [newData, setNewData] = useState(undefined);
  const [transferBNB, setTransferBNB] = useState(undefined);
  const [contractBalance, setContractBalance] = useState(undefined);
  const [contractAddress, setContractAddress] = useState(undefined);
  const [simpleStorage, setSimpleStorage] = useState(undefined);
  const [contractName, setContractName] = useState(undefined);
  const [data, setData] = useState(undefined);
  // const [currencyUnit, setCurrencyUnit] = useState(undefined);
  let message = "loading...";
  let isPageReadytoLoad = true;

  useEffect(() => {
    const init = async () => {
      try{
      if (provider !== undefined) {
        const signer = provider.getSigner();
        const simpleStorage = new Contract(
          SimpleStorage.networks[networkId].address,
          SimpleStorage.abi,
          signer
        );

        const contractName = SimpleStorage.contractName;
        const contractAddress = SimpleStorage.networks[networkId].address;

        let contBalance = Number(
          ethers.utils.formatEther(await provider.getBalance(contractAddress))
        );

        setContractBalance(contBalance);
        console.log("Contract Balance:", contBalance, typeof contBalance);
        setSimpleStorage(simpleStorage);
        const data = await simpleStorage.readData();
        setData(data);

        console.log(
          "---------------",
          contractName,
          contractAddress,
          contBalance,
          "---------------"
        );

        setContractAddress(contractAddress);
        setContractName(contractName);
        
      } else {
        console.log("Waiting for the provider...");
      }
    }catch(err) {
      console.log("error in SimpleStorageInit:", err);
    }
    };
    init();

    return () => {
      console.log("SimpleStorage Contract Clean up called...");
    };
  }, [contractBalance, networkId, provider]);

  const updateData = async (e) => {
    const gas = await simpleStorage.estimateGas.updateData(newData);
    console.log("Gas to be used:", ethers.utils.formatEther(gas));
    const tx = await simpleStorage.updateData(newData);
    await tx.wait();
    const newData1 = await simpleStorage.readData();
    setData(newData1);
    setNewData("");
  };

  const transferBNBtoContract = async (e) => {
    console.log("TransferBNB called", transferBNB, newData);
    if (accountBalance >= transferBNB) {
      const tx = await simpleStorage.deposit({
        value: ethers.utils.parseEther(transferBNB),
      });
      await tx.wait().then((receipt) => {
        console.log(receipt);
      });

      let contractBalance = ethers.utils.formatEther(
        await simpleStorage.totalContractBalance()
      );
      let ctrBalance = ethers.utils.formatEther(
        await simpleStorage.totalBalance()
      );
      console.log(contractBalance);
      console.log(ctrBalance);
      setContractBalance(contractBalance);
      setTransferBNB("");
    }
  };
  const transferBNBtoSelfAccount = () => {
    console.log("Transfer BNB to self called...");
  };

  if (typeof simpleStorage === "undefined" || typeof data === "undefined") {
    message = `Please wait while data is loaded from SimpleStorage
                SmartContract....`;
    isPageReadytoLoad = false;
    console.log(
      simpleStorage,
      data,
      "Please wait while data is loaded from SimpleStorage SmartContract...."
    );
  }

  return (
    <div className="contractAppdiv">
      <div className="contractAppHeader">
        <span>SimpleStorage Contract</span>
      </div>
      {isPageReadytoLoad !== true ? (
        <h4>{message}</h4>
      ) : (
        <div className="contractMainContainer">
          <div className="contractDataContainer">
            <div className="contractDataInfoBlock">
              <h6>Contract Information</h6>
              <div className="contractDataInfo">
                <ShowDataComponent
                  dataName="Contract Name"
                  dataType="text"
                  dataValue={contractName}
                />
                <ShowDataComponent
                  dataName="Contract Address"
                  dataType="address"
                  dataValue={contractAddress}
                  addressScanUrl={addressScanUrl}
                />
                <ShowDataComponent
                  dataName="Contract Balance"
                  dataType="money"
                  dataValue={contractBalance}
                  currencyUnit={currencyUnit}
                />
                <ShowDataComponent
                  dataName="Data "
                  dataType="number"
                  dataValue={data}
                  currencyUnit={""}
                />
              </div>
            </div>
          </div>
          <div className="contractInfoContainer">
            <div className="transactContractContainer">
              <h6>Update Contract</h6>
              <div className="showInputDiv">
                <input
                  type="text"
                  name="data"
                  placeholder="new data"
                  value={newData}
                  autoComplete="off"
                  onChange={(e) => setNewData(e.target.value)}
                />
                <button type="button" onClick={updateData}>
                  Update Data
                </button>
              </div>
              <div className="showInputDiv">
                <input
                  type="text"
                  name="transferbnb"
                  placeholder="transfer BNB to contract"
                  value={transferBNB}
                  autoComplete="off"
                  onChange={(e) => setTransferBNB(e.target.value)}
                />
                <button type="button" onClick={transferBNBtoContract}>
                  Send BNB
                </button>
              </div>
              <div className="showInputDiv">
                <input
                  type="text"
                  name="transferbnb"
                  placeholder="transfer BNB to self"
                  value={transferBNB}
                  autoComplete="off"
                  onChange={(e) => setTransferBNB(e.target.value)}
                />
                <button type="button" onClick={transferBNBtoSelfAccount}>
                  Get BNB
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SimpleStorageDapp;
