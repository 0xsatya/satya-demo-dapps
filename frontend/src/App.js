import React, { useState, useEffect } from "react";
// import getBlockchain, { address, balance } from "./ethereum.js";
import "./App.css";

import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import MenuItems from "./components/MenuItems";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import SimpleStorageDapp from "./pages/SimpleStorageDapp";
import BankDapp from "./pages/BankDapp";
import * as Utils from "./utilities/utils";
import Footer from "./components/Footer";
import MessageModal from "./components/MessageModal";

function App() {
  const [useraddress, setUserAddress] = useState(undefined);

  const [accountBalance, setAccountBalance] = useState(undefined);
  let [ethprovider1, setEthprovider] = useState(undefined);
  const [networkId, setNetworkId] = useState(undefined);
  let [provider, setProvider] = useState(undefined);
  const [networkName, setNetworkName] = useState(undefined);
  const [currencyUnit, setCurrencyUnit] = useState(undefined);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  let [addressScanUrl, setAddressScanUrl] = useState(undefined);
  const [latestBlockNumber, setLatestBlockNumber] = useState(0);
  const [latestTransaction, setLatestTransaction] = useState(undefined);

  let message = "";
  let isAllDataReceived = true;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const updateNetworkInfo = async (ethProvider) => {
    // setEthprovider(await detectEthereumProvider());
    try {
      if (ethProvider) {
        const networkId = await ethProvider.request({ method: "net_version" });
        console.log("networkId:", networkId);
        setNetworkId(networkId);
        let netname = await Utils.getChainName(networkId);
        console.log("NetworkName:", netname);
        setNetworkName(netname);
        setAddressScanUrl(await Utils.getAddressScanUrl(networkId));
        console.log("performNetworkReboot.....", networkId, networkName);

        if (provider) {
          provider.removeAllListeners();
        }

        let new_provider = getCorrectProvider(ethProvider, networkId);
        setProvider(new_provider);

        const ethAccounts = await ethProvider.request({
          method: "eth_requestAccounts",
        });
        console.log("ethAccounts", ethAccounts);
        setUserAddress(ethAccounts[0]);

        let accountBalance = ethers.utils.formatEther(
          await new_provider.getBalance(ethAccounts[0])
        );
        setAccountBalance(accountBalance);
        console.log("Account balance: ", accountBalance, typeof accountBalance);
        // provider = new ethers.getDefaultProvider();
        setIsUserLoggedIn(true);
        //Subscribe to Network Logs
        subscribeToNetworkEvents(new_provider);

        if (Number(networkId) === 97) {
          setCurrencyUnit("BNB");
        } else {
          setCurrencyUnit("ETH");
        }
        return new_provider;
      } else {
        let ethProv = await detectEthereumProvider();
        console.log("ethPRov reset::", ethProv);
        setEthprovider(ethProv);
      }
    } catch (err) {
      console.log("error occured inupdate Network:", err);
    }
  };
  const shortAddress = (address) => {
    return (
      address.substring(0, 6) +
      "..." +
      address.substring(address.length - 6, address.length)
    );
  };

  const subscribeToNetworkEvents = (provider) => {
    console.log("----------------------------------------------------");
    // console.log("Latest Block Number:", await provider.getBlockNumber());
    // console.log("Latest Block Number:", await provider.getNetwork());
    // console.log("Latest Block Number:", await provider.getBlockNumber());
    provider.on("block", async (blockNumber) => {
      // Emitted on every block change
      // console.log("Latest Block Number:", blockNumber);
      setLatestBlockNumber(blockNumber);
      // console.log("blockNumber1:" + blockNumber);
      let block = await provider.getBlock(blockNumber);
      // console.log('block:', block);
      // console.log('blockTxn:', block.transactions);
      if (block.transactions.length > 0) {
        // console.log('blockTxnNo:', block.transactions[0]);
        setLatestTransaction(block.transactions[0]);
      }
      // if (block) {
      //   let tx = block.transactions.length > 0? block.transactions[0] : '0x0000';
      //   setLatestTransaction(tx);
      // }
    });

    // let filterBlockchain = {
    //   address: null,
    //   topics: null,
    // };
    // provider.on(filterBlockchain, (log, event) => {
    //   // Emitted whenever a DAI token transfer occurs
    //   console.log("filterBlockchain -- log:", log, "-----event:", event);
    // });
  };

  const getCorrectProvider = (ethprovider1, networkId) => {
    let pv = null;
    // if(Number(networkId) === 97){
    pv = new ethers.providers.Web3Provider(ethprovider1);
    // }
    // else {
    // pv = new ethers.getDefaultProvider(ethprovider1);
    // provider = new EtherscanProvider("rinkeby");
    // }
    console.log("New Provider ", pv);
    return pv;
  };

  // const performNetworkReboot = async (ethprovider1, ethAccount) => {
  //   console.log("performNetworkReboot.....", networkId, networkName);

  //   let new_provider = getCorrectProvider(ethprovider1, networkId);
  //   setProvider(new_provider);

  //   let accountBalance = ethers.utils.formatEther(
  //     await new_provider.getBalance(ethAccount)
  //   );
  //   setAccountBalance(accountBalance);
  //   console.log("Account balance: ", accountBalance, typeof accountBalance);
  //   // provider = new ethers.getDefaultProvider();
  //   setIsUserLoggedIn(true);
  //   //Subscribe to Network Logs
  //   subscribeToNetworkEvents(new_provider);

  //   return new_provider;
  // };

  const onLogin = async (e) => {
    e.preventDefault();
    console.log("OnLoginClicked...", e.target);

    if (e.target.innerHTML === "Login") {
      if (ethprovider1) {
        const ethAccounts = await ethprovider1.request({
          method: "eth_requestAccounts",
        });
        console.log("ethAccounts", ethAccounts);
        setUserAddress(ethAccounts[0]);

        let new_provider = await updateNetworkInfo(ethprovider1);
        if (new_provider)
          console.log("Network reboot success...new provider..", new_provider);

        e.target.innerHTML =
          "Logout<span class='tooltiptext' onclick='return false;'>" +
          shortAddress(ethAccounts[0]) +
          "</span>";
      } else {
        console.log("Please install metamask", ethprovider1);
      }
    } else {
      setUserAddress(undefined);

      e.target.innerHTML = "Login";
      setIsUserLoggedIn(false);
      if (provider) {
        provider.removeAllListeners();
      }
    }
  };

  const popUpHandler = (message) => {
    console.log("pophandler called...");
    setModalIsOpen(true);
    setModalMessage(message);
  };
  const closeModalBoxHandler = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    const accountsChangedHandler = async (accounts) => {
      
     try {
        console.log("Account changed");
        console.log(`Accounts:\n${accounts.join("\n")}`);
        setUserAddress(accounts[0]);
        console.log("provider:", provider);
        if (provider !== undefined) {
          setAccountBalance(
            Number(
              ethers.utils.formatEther(await provider.getBalance(accounts[0]))
            )
          );
        }
     } catch (err) {
       console.log('Error in App.js accountsChangedHandler', err);
     }
    };
    const chainChangedHandler = async (chainId) => {
      if (provider) {
        provider.removeAllListeners();
      }
      // let ethProv = await detectEthereumProvider();
      // console.log("ethPRov::", ethProv);
      // setEthprovider(ethProv);

      console.log("Network chain changed", parseInt(chainId));
      setNetworkId(parseInt(chainId));
      console.log(
        "network updated status:",
        await updateNetworkInfo(ethprovider1)
      );
      // setProvider(await performNetworkReboot(ethprovider1, useraddress));
      // console.log("Network rebooted");
    };

    const disconnectHandler = (code, reason) => {
      console.log(
        `Ethereum Provider connection closed: ${reason}. Code: ${code.message}`
      );
    };

    const connectHandler = (connectInfo) => {
      console.log(
        `Ethereum Provider connection successfull with connectInfo:`,
        connectInfo
      );
    };

    const init = async () => {
      console.log("App.js useeffect init called...");
      let ethProv = await detectEthereumProvider();
      console.log("ethPRov::", ethProv);
      setEthprovider(ethProv);
      // let new_provider = await updateNetworkInfo(ethProv);
      // if(new_provider) console.log("Network reboot success...new provider..", new_provider);

      if (ethProv !== undefined && ethProv !== null) {
        ethProv.on("accountsChanged", accountsChangedHandler);
        ethProv.on("chainChanged", chainChangedHandler);
        ethProv.on("disconnect", disconnectHandler);
        ethProv.on("connect", connectHandler);
      } else {
        console.log("No ethprovider found in the browser");
      }
    };
    init();

    // performNetworkReboot(ethprovider1, useraddress);

    return function cleanup() {
      if (ethprovider1 !== undefined && ethprovider1 !== null) {
        console.log("Remove all listeners...");
        ethprovider1.removeListener("accountsChanged", accountsChangedHandler);
        ethprovider1.removeListener("chainChanged", chainChangedHandler);
        ethprovider1.removeListener("disconnect", disconnectHandler);
        ethprovider1.removeListener("connect", connectHandler);
      }
      if (provider) {
        provider.removeAllListeners();
      }

      // ethprovider.removeAllListeners(['accountsChanged', 'chainChanged', 'connect', 'disconnect']);
    };
  }, [networkId, useraddress]);

  if (typeof ethprovider1 === "undefined" || ethprovider1 === null) {
    message = "Please install metamask....";
    isAllDataReceived = false;
  } else if (typeof useraddress === "undefined" || networkId === "") {
    if (isUserLoggedIn === true) {
      message = `You are not logged in to any wallet. Please Login to Metamask..`;
    } else {
      message = "Please Login & connect your Metamask Wallet to continue...";
    }
    isAllDataReceived = false;
  } else if (
    typeof networkId === "undefined" ||
    (Number(networkId) !== 97 &&
      Number(networkId) !== 4 &&
      Number(networkId) !== 3)
  ) {
    message =
      "Please switch to Binance Smart Chain Test or Rinkeyby Testnet or Ropsten Testnet .... ";
    isAllDataReceived = false;
  } else isAllDataReceived = true;

  return (
    <Router>
      <div className="app">
        <div className="app_body1">
          <MenuItems onLogin={onLogin} />
          {isAllDataReceived !== true ? (
            <div className="app_body">
              <div className="datadiv1">
                <h4>{message}</h4>
              </div>
            </div>
          ) : (
            <div className="app_body">
              {modalIsOpen === true ? (
                <MessageModal
                  modalIsOpen={modalIsOpen}
                  modalMessage={modalMessage}
                  closeModalBoxHandler={closeModalBoxHandler}
                />
              ) : (
                ""
              )}

              <Home
                networkId={networkId}
                networkName={networkName}
                useraddress={useraddress}
                accountBalance={accountBalance}
                currencyUnit={currencyUnit}
                addressScanUrl={addressScanUrl}
                latestBlockNumber={latestBlockNumber}
                latestTransaction={latestTransaction}
              />
              <Switch>
                <Route path="/SimpleStorageDapp">
                  <SimpleStorageDapp
                    provider={provider}
                    networkId={networkId}
                    accountBalance={accountBalance}
                    useraddress={useraddress}
                    addressScanUrl={addressScanUrl}
                    currencyUnit={currencyUnit}
                  />
                </Route>
                <Route path="/BankDapp">
                  <BankDapp
                    provider={provider}
                    networkId={networkId}
                    accountBalance={accountBalance}
                    useraddress={useraddress}
                    addressScanUrl={addressScanUrl}
                    currencyUnit={currencyUnit}
                    popUpHandler={popUpHandler}
                    ethProvider={ethprovider1}
                  />
                </Route>
                {/* <Route path="/Test">
                  <Test />
                </Route> */}
              </Switch>
            </div>
          )}
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
