import detectEthereumProvider from '@metamask/detect-provider';
import { ethers, Contract } from 'ethers';
import SimpleStorage from '../contracts/SimpleStorage.json';
let provider = null;
let  address, balance;

const getBlockchain = () =>
  new Promise( async (resolve, reject) => {
    provider = await detectEthereumProvider();
    if(provider) {
      const ethAccounts = await provider.request({ method: 'eth_requestAccounts' });
      const networkId = await provider.request({ method: 'net_version' })
      provider = new ethers.providers.Web3Provider(provider);
      const signer = provider.getSigner();
      address = ethAccounts[0];
      
      console.log(ethAccounts);
      console.log('networkId:'+networkId);
      console.log(signer);
      console.log(await signer.getBalance());
      console.log(await provider.getBlockNumber()); 
      
      const balance1 = await provider.getBalance(ethAccounts[0]);
      balance = ethers.utils.formatEther(balance1);
      console.log(balance);
      // { BigNumber: "2337132817842795605" }

      const simpleStorage = new Contract(
        SimpleStorage.networks[networkId].address,
        SimpleStorage.abi,
        signer
      );
      resolve({simpleStorage});
      return;
    }
    reject('Install Metamask');
  });

export {address, balance};
export default getBlockchain;