import abi from "./abi.json";
import {ethers} from "ethers";

export const getContract = () => {
    const contractAddress = "0x244DD71dBaB2dA713B7CD43400eADb461793B5e3"; // replace with your contract address
    const contractABI = abi.abi; // replace with your contract ABI
    // const providerUrl = "https://rpc-mumbai.maticvigil.com/";

    // const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Getting the signer
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
    );
    return contract;


    // // Now you can call functions on your contract as follows:
    // // const testCreateCluster = await contract.createCluster('cluster 1')
    // const getClusters = await contract.getClusters()
    // // console.log(testCreateCluster)
    // console.log(getClusters)
};
