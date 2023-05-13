import {
  SafeFactory,
  SafeAccountConfig,
} from "@safe-global/protocol-kit";
import { ethers } from "ethers";
import { EthersAdapter } from "@safe-global/protocol-kit";
import { InfuraProvider, JsonRpcProvider } from "@ethersproject/providers";
import "dotenv/config";

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const WALLET_ADDRESS = process.env.WALLET_ADDRESS || "";

const main = async () => {
  try {
    const provider = new JsonRpcProvider(
      `https://polygon-mumbai.infura.io/v3/${INFURA_API_KEY}`,
      80001
    );
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    const ethAdapter = new EthersAdapter({
      ethers: ethers,
      signerOrProvider: wallet,
    });

    const safeFactory = await SafeFactory.create({ ethAdapter });

    const safeAccountConfig: SafeAccountConfig = {
      owners: [WALLET_ADDRESS],
      threshold: 1,
    };

    const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });
    const newSafeAddress = await safeSdk.getAddress()
    console.log(`New safe created at address: ${newSafeAddress}`);
  } catch (e) {
    console.error(e);
  }
};

main();
