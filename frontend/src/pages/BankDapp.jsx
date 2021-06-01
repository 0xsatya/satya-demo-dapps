import React, { useEffect, useState } from "react";
import { ethers, Contract, utils } from "ethers";
import BankDapp from "../contracts/BankDapp.json";
import "./BankDapp.css";
import ShowDataComponent from "../components/ShowDataComponent";
import ShowLogs from "../components/ShowLogs";
let isNewLog = false;

function BankDappContractComponent({
  provider,
  networkId,
  useraddress,
  accountBalance,
  addressScanUrl,
  popUpHandler,
  ethProvider,
}) {
  // const [signer, setSigner] = useState(undefined);
  const [bankContract, setBankContract] = useState(undefined);
  const [contractBalance, setContractBalance] = useState(0);
  const [bankDappBalance, setBankDappBalance] = useState(0);
  const [contractAddress, setContractAddress] = useState(undefined);
  const [contractName, setContractName] = useState(undefined);

  const [currencyUnit, setCurrencyUnit] = useState("BNB");
  const [myBankBalance, setMyBankBalance] = useState(0);
  const [myAddressBalance, setMyAddressBalance] = useState(0);

  // let myBalance = 0;
  let isPageReady = true;
  let message = "loading...";
  const [sendAmount_Input, setSendAmount_Input] = useState("");
  const [receiveAmount_Input, setReceiveAmount_Input] = useState("");
  const [takeLoanAmount_Input, setTakeLoanAmout_Input] = useState("");
  const [repayLoanAmount_Input, setRepayLoanAmount_Input] = useState("");
  const [creatorAddress, setCreatorAddress] = useState("0x00");

  const [myUpdates, setMyUpdates] = useState([]); //[{name: 'no recent activity',address: null, value: null}]
  const [allUpdates, setAllUpdates] = useState([]); //[{name: 'no recent activity',address: null, value: null}]
  const [allPastLogs, setAllPastLogs] = useState([]); //[{name: 'no recent activity',address: null, value: null}]

  const subscribeToLogEvents = async (provider, bankDapp, latestBlockNumber) => {
    try {
      if (provider) provider.removeAllListeners();
      if (bankDapp) bankDapp.removeAllListeners();
      console.log("Subscribing to LOg Events...");
      
      let latestBlockNumber = await provider.getBlockNumber();
      console.log("latestBlockNumber:", latestBlockNumber);

      let filterAllLogs = {
        address: contractAddress,
        topics: null,
      };
      bankDapp.on(filterAllLogs, async (log) => {
        console.log("----------------------------------------------------");
        let ename = log.event;
        let add = log.args[0];
        let value = log.args[1];
        let id = (await log.getBlock()).timestamp;

        console.log(
          "**Must show - FilterAllLogs on this contract...",
          ename,
          utils.getAddress(add),
          value,
          utils.getAddress(useraddress),
          log,
          id
        );
        console.log("----------------------------------------------------");

        if (utils.getAddress(useraddress) === utils.getAddress(add)) {
          setMyUpdates([
            {
              id: id,
              name: ename + ":",
              address: add,
              value: utils.formatEther(value),
            },
            ...myUpdates,
          ]);
        }
        setAllUpdates([
          {
            id: id,
            name: ename + ": ",
            contAddress: log.address,
            address: add,
            value: utils.formatEther(value),
          },
          ...allUpdates,
        ]);
        setContractBalance("");
        isNewLog = true;
      });

      //---all previous logs...
      let filterPastLogs = {
        address: contractAddress,
        fromBlock: latestBlockNumber-50000,
        toBlock: "latest",
        topics: null,
      };

      provider
        .getLogs(filterPastLogs)
        .then((logs) => {
          console.log("----------------------------------------------------");

          console.log("filterPastLogs", logs);
          let logsObj = [];
          logs.forEach((log, index) => {
            const data = bankDapp.interface.parseLog(log);
            // console.log("Past Log:", data);
            logsObj.push({
              id: index,
              name: data.name,
              contAddress: contractAddress,
              address: data.args[0],
              value: utils.formatEther(data.args[1]),
            });
          });

          setAllPastLogs(logsObj);
        })
        .catch((err) => console.log("Error in fetching filterPastLogs:", err));
      //----------------------------------------------------------
      //-------------- Event Listeners -------------------//
      // let filterMyLogs = {
      //   address: contractAddress,
      //   topics: [
      //     utils.id("LogDepositMade(address,uint256)"),
      //     utils.hexZeroPad(useraddress, 32),
      //     null,
      //   ],
      // };
      // bankDapp.on(filterMyLogs, (add, value) => {
      //   console.log(
      //     "LogDepositMade filter for this address...",
      //     add,
      //     value
      //   );
      // });

      // bankDapp.on("LogDepositMade", (add, value) => {
      //   console.log("LogDepositMade on...", add, value);
      // });

      // let filterMyWithdrawn = {
      //   address: contractAddress,
      //   topics: [
      //     utils.id("LogWithdrawMade(address,uint256)"),
      //     utils.hexZeroPad(useraddress, 32),
      //   ],
      // };
      // bankDapp.on(filterMyWithdrawn, (address, value) => {
      //   console.log(
      //     "LogWithdraw filter for this address...",
      //     address,
      //     value
      //   );

      // });
      // bankDapp.on("LogWithdrawMade", (address, value) => {
      //   console.log("LogWithdrawMade on...");
      // });

      //--------------------------------------------------------------

      // bankDapp.on("Received", (add, value) => {
      //   console.log("Received on...", add, value);
      // });
    } catch (err) {
      console.log("Error occured in subscribeToLogEvents:", err);
    }
  };
  const showMessage = (message) => {
    popUpHandler(`<h6>${message}</h6>`);
  };
  
  useEffect(() => {
    let bankDapp = null;
    const init = async () => {
      console.log("BankDapp useEffect called with provider...", provider);
      if (provider !== undefined) {
        try {
          // let ethProvider = await detectEthereumProvider();

          let signer = provider.getSigner();
          bankDapp = new Contract(
            BankDapp.networks[networkId].address,
            BankDapp.abi,
            signer
          );

          console.log("1----------------------");

          subscribeToLogEvents(provider, bankDapp); // (latestBlockNumber - 1000));

          setContractName(BankDapp.contractName);
          console.log("2----------------------");

          const bankAddress = BankDapp.networks[networkId].address;
          setContractAddress(bankAddress);

          let contBal = ethers.utils.formatEther(
            await provider.getBalance(bankAddress)
          );
          setContractBalance(contBal);
          // console.log("contBalance:", contBal);
          console.log("3----------------------");

          let bankDappBalance1 = ethers.utils.formatEther(
            await bankDapp.totalBankDappBalance()
          );
          console.log("Total Bank Contract Balance:", bankDappBalance1);
          setBankDappBalance(bankDappBalance1);

          let myAdBal = ethers.utils.formatEther(
            await provider.getBalance(useraddress)
          );
          setMyAddressBalance(myAdBal);
          // console.log("MyAddressBalance", myAdBal);

          let myBankBal = ethers.utils.formatEther(
            await bankDapp.userBankAccountBalance()
          );
          setMyBankBalance(myBankBal);
          // console.log("MyBankBalance-useEffect:", myBankBal);

          // console.log("Resolver---------------", bankDapp.resolvedAddress);
          setCreatorAddress(await bankDapp.owner());
          // console.log("Creator address -----", creatorAddress);
          setBankContract(bankDapp);
        } catch (err) {
          console.log("Error:", err);
          // showMessage("Error:" + err);
        }
      } else {
        console.log("Waiting for the provider...");
      }
    };
    init();

    return () => {
      console.log("BankDapp useEffect cleanup called...");
      if (bankContract !== undefined) {
        console.log("removing all bankContract listeners");
        bankContract.removeAllListeners();
      }
      if (bankDapp !== undefined && bankDapp !== null) {
        console.log("removing all bankDapp listeners");
        bankDapp.removeAllListeners();
      }
    };
  }, [networkId, useraddress, accountBalance, myAddressBalance]);

  

  const sendMoneytoContract = async (e) => {
    let inputValue = sendAmount_Input.trim();
    let sendAmount = ethers.utils.parseEther(
      !inputValue ? "0.0001" : inputValue
    );

    console.log("sendMoneytoContract called...", Number(sendAmount));
    try {
      const tx = await bankContract.deposit({
        value: sendAmount,
      });
      console.log("SUCCESS transfer:", tx);
  
      if (tx.wait !== undefined) {
        await tx.wait().then((receipt) => {
          console.log("sendMoneytoContract transaction receipt:", receipt);
        });
      }
    } catch (err) {
      console.log('Error while sendMOneytocontract:', err.message);
      showMessage(err.message);
    }
    setMyAddressBalance("");
    setSendAmount_Input("");
  };


  const withdrawMoneytoSelfAccount = async (e) => {
    // console.log(e.target);
    let inputValue = receiveAmount_Input.trim();
    let amount = ethers.utils.parseEther(!inputValue ? "0.0001" : inputValue);

    if (isNaN(Number(amount))) {
      showMessage(
        "Input value is not a number. Please input in correct format..." +
          receiveAmount_Input
      );
      return false;
    }

    console.log("withdrawMoneytoSelfAccount called...", Number(amount));

    // e.target.setAttribute("disable" , "disabled");

    const tx = await bankContract.withdrawMoney(useraddress, amount).then(
      function (value) {
        console.log("SUCCESS -- Withdraw money: ", value);
        return value;
      },
      function (error) {
        /* code if some error */
        console.log("ERROR -- Withdraw money: ");
        console.log(error.data.message);
        showMessage(`${error.message}<br/>${error.data.message}</span>`);
        setReceiveAmount_Input("");
        return error;
      }
    );

    if (tx.wait !== undefined) {
      await tx.wait().then((receipt) => {
        console.log("withdrawMoneytoSelfAccount transaction receipt:", receipt);
      });
    }
    setMyAddressBalance("");
    setReceiveAmount_Input("");
    e.target.removeAttribute("disabled");
  };
  const takeLoanFromBank = () => {
    console.log("takeLoanFromBank called...");
  };
  const repayLoanToBank = () => {
    console.log("repayLoanToBank called...");
  };

  // console.log(`All bank data fetched to render-
  // BankContract address, ${contractAddress}
  // Bank contract balance, ${contractBalance}
  // My address, ${useraddress}
  // My address balance, ${myAddressBalance}
  // My Bank Balance, ${myBankBalance}`);

  // console.log("-----------My activities...", myUpdates);

  if (typeof bankContract === "undefined") {
    message = `Please wait while BankDapp is loaded ....`;
    isPageReady = false;
    console.log(
      "Please wait while data is loaded from BankDapp SmartContract...."
    );
  }

  return (
    <div className="contractAppdiv">
      <div className="contractAppHeader">
        <span>My Bank Dapp</span>
      </div>
      {isPageReady !== true ? (
        <h4>{message}</h4>
      ) : (
        <div className="contractMainContainer">
          <div className="contractDataContainer">
            <div className="contractDataInfoBlock">
              <h6>Bank Data Information</h6>

              <div className="contractDataInfo">
                <ShowDataComponent
                  dataName="Bank Name"
                  dataType="text"
                  dataValue={contractName}
                />
                <ShowDataComponent
                  dataName="Contract Owner"
                  dataType="address"
                  dataValue={creatorAddress}
                  addressScanUrl={addressScanUrl}
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
                  dataName="Bank Balance value"
                  dataType="money"
                  dataValue={bankDappBalance}
                  currencyUnit={currencyUnit}
                />
                <ShowDataComponent
                  dataName="Account Balance"
                  dataType="money"
                  dataValue={myAddressBalance}
                  currencyUnit={currencyUnit}
                />
                <ShowDataComponent
                  dataName="My Bank Balance"
                  dataType="money"
                  dataValue={myBankBalance}
                  currencyUnit={currencyUnit}
                />
              </div>
            </div>

            <div className="transactContractContainer">
              <h6>Bank Transactions</h6>
              <div className="showInputDiv">
                <input
                  type="text"
                  name="sendMoney"
                  placeholder="send currency to Bank (default 0.0001)"
                  value={sendAmount_Input}
                  autoComplete="off"
                  onChange={(e) => setSendAmount_Input(e.target.value)}
                />
                {/* <div className="buttonInput"> */}
                <button type="button" onClick={sendMoneytoContract}>
                  Send {currencyUnit}
                </button>
                {/* <div className="btnClickStatus">

                </div> */}
                {/* </div> */}
              </div>
              <div className="showInputDiv">
                <input
                  type="text"
                  name="receiveMoney"
                  placeholder="receive currency from Bank (default 0.0001)"
                  value={receiveAmount_Input}
                  autoComplete="off"
                  onChange={(e) => setReceiveAmount_Input(e.target.value)}
                />
                <button type="button" onClick={withdrawMoneytoSelfAccount}>
                  Get {currencyUnit}
                </button>
              </div>
              <div className="showInputDiv">
                <input
                  type="text"
                  name="takeLoan"
                  placeholder="take loan from Bank"
                  value={takeLoanAmount_Input}
                  autoComplete="off"
                  onChange={(e) => setTakeLoanAmout_Input(e.target.value)}
                />
                <button type="button" onClick={takeLoanFromBank}>
                  Take Loan
                </button>
              </div>
              <div className="showInputDiv">
                <input
                  type="text"
                  name="repayLoan"
                  placeholder="repay toal Loan to Bank"
                  value={repayLoanAmount_Input}
                  autoComplete="off"
                  onChange={(e) => setRepayLoanAmount_Input(e.target.value)}
                />
                <button type="button" onClick={repayLoanToBank}>
                  Repay Loan
                </button>
              </div>
            </div>
          </div>

          <div className="contractInfoContainer">
            <div className="contractInfo">
              <h6>My recent Activities </h6>
              <div className="contractInfoData">
                {myUpdates.length > 0 ? (
                  myUpdates.map(({ id, name, address, value }, index) => (
                    <ShowLogs
                      eventName={name}
                      from={address}
                      to={""}
                      value={value}
                      addressScanUrl={addressScanUrl}
                      key={id}
                      isNewLog={true}
                    />
                  ))
                ) : (
                  <ShowLogs
                    eventName="no recent events..."
                    from={null}
                    to={null}
                    isNewLog={isNewLog}
                    key={"0"}
                  />
                )}
              </div>
            </div>
            <div className="contractInfo">
              <h6>All Recent Activities </h6>
              <div className="contractInfoData">
                {allUpdates.length > 0 ? (
                  allUpdates.map(({ id, name, address, value }, index) => (
                    <ShowLogs
                      eventName={name}
                      from={address}
                      to={""}
                      value={value}
                      addressScanUrl={addressScanUrl}
                      key={id}
                      isNewLog={true}
                    />
                  ))
                ) : (
                  <ShowLogs
                    eventName="no recent events..."
                    from={null}
                    to={null}
                    key="0"
                    isNewLog={isNewLog}
                  />
                )}
              </div>
            </div>
            <div className="contractInfo">
              <h6>All Past Activities </h6>
              <div className="contractInfoData">
                {allPastLogs.length > 0 ? (
                  allPastLogs.map(({ name, address, value }, index) => (
                    <ShowLogs
                      eventName={name}
                      from={address}
                      to={""}
                      value={value}
                      addressScanUrl={addressScanUrl}
                      key={index}
                      isNewLog={false}
                    />
                  ))
                ) : (
                  <ShowLogs
                    eventName="no recent events..."
                    from={null}
                    to={null}
                    key="0"
                    isNewLog={isNewLog}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BankDappContractComponent;
