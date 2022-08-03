import { PublicKey, Transaction } from "@solana/web3.js";
// import { Signature } from "typescript";

// Connections

export const RPC_URL = "https://api.devnet.solana.com";

export const PROGRAM_ID = new PublicKey("Hp519DFatkWkf1dVVYum8xQZwY6Qzr8PaKzKQU5of6KK");

// Chainlink Price Feed - Devnet
const CHAINLINK_PRICE_FEED = "HgTtcbcmp5BeThax5AU8vg4VwK79qAvAKKFMs8txMLW6"; // Devnet
export const accountChainlinkPriceFeed = new PublicKey(CHAINLINK_PRICE_FEED);

// Chainlink Program Owner - Devnet
const CHAINLINK_ONCHAIN_PROGRAM_OWNER = "HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny";
export const accountChainlinkProgramOwner = new PublicKey(CHAINLINK_ONCHAIN_PROGRAM_OWNER);

// Phantom Types and Interfaces

type DisplayEncoding = "utf8" | "hex";
type PhantomEvent = "disconnect" | "connect" | "accountChanged";
type PhantomRequestMethod =
  | "connect"
  | "disconnect"
  | "signTransaction"
  | "signAllTransactions"
  | "signMessage";

interface ConnectOpts {
  onlyIfTrusted: boolean;
}

export interface PhantomProvider {
  publicKey: PublicKey | null;
  isConnected: boolean | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding
  ) => Promise<any>;
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

export async function copyClipboard(value: string) {
  console.log(value);
  await navigator.clipboard.writeText(value);
  alert("Address copied");
}