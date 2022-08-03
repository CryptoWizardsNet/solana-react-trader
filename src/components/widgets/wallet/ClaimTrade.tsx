import { useEffect, useState } from 'react'
import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { PhantomProvider, PROGRAM_ID, accountChainlinkPriceFeed, accountChainlinkProgramOwner } from "./Types";
import * as borsh from "@project-serum/borsh";
import { serialize } from "borsh";

type Args = {
  tradeData: any;
  userAccount: PublicKey;
  walletPubKey: String;
  connection: Connection;
  provider: any;
}

export async function claimTrade({tradeData, walletPubKey, connection, provider}: Args) {
  if (tradeData && walletPubKey) {

    // Get wallet and accounts
    const wallet = new PublicKey(walletPubKey);
    const tradeAccount = new PublicKey(tradeData.trade_account);

    // Generate PDA - User
    const [userAccount] = await PublicKey.findProgramAddress(
      [Buffer.from("user"), wallet.toBuffer()],
      PROGRAM_ID
    );

    // System Program (Needed for PDA Creation in Program)
    const systemProgramId = SystemProgram.programId;
    
    // Get Maker and Taker
    const maker = await getAccountDetails(connection, tradeAccount, "maker");
    const taker = await getAccountDetails(connection, tradeAccount, "taker");

  // Determine Instruction Accounts
  let ixAccounts = [
    {pubkey: wallet, isSigner: true, isWritable: false},
    {pubkey: tradeAccount, isSigner: false, isWritable: true},
    {pubkey: maker, isSigner: false, isWritable: true}, // All Accounts being used have to be passed in
    {pubkey: taker, isSigner: false, isWritable: true}, // All Accounts being used have to be passed in
    {pubkey: systemProgramId, isSigner: false, isWritable: false}, // Needed as PDA balance will change
    {pubkey: accountChainlinkPriceFeed, isSigner: false, isWritable: false},
    {pubkey: accountChainlinkProgramOwner, isSigner: false, isWritable: false},
  ];
    // Call Transaction
    const tx_ix = new TransactionInstruction({
      keys: ixAccounts,
      programId: PROGRAM_ID,
      data: Buffer.from(new Uint8Array([4, 0])), // 4 = Claim, 0 provided to supply 'rest' expectation after tag
    });

    // Create Transaction
    const blockhash = await connection.getLatestBlockhash('finalized');
    const createAccountTransaction = new Transaction({
      feePayer: provider.publicKey,
      recentBlockhash: blockhash.blockhash
    }).add(tx_ix);

    // Sign Transaction
    const signature = await provider.signTransaction(createAccountTransaction);
    console.log("Signature: \n", signature);

    // Send Transaction
    const id = await connection.sendRawTransaction(createAccountTransaction.serialize());
    console.log("Id: \n", signature);

    // Confirm Transaction
    const confirmation = await connection.confirmTransaction(id);
    console.log("Confirmation: \n", confirmation);

    // Show Error
    if (!confirmation?.context?.slot) {
      return false;
    } else {
      return true;
    }
  }
}


async function getAccountDetails(connection: Connection, account: PublicKey, retrieve: string) {

  // Define Post Account Structure
  const TRADE_ACCOUNT_DATA_LAYOUT = borsh.struct([
    borsh.publicKey("maker"),
    borsh.publicKey("taker"),
    borsh.publicKey("trade_account"),
    borsh.u8("bump"),
    borsh.str("slug"),
    borsh.str("symbol"),
    borsh.u8("content"),
    borsh.u8("direction"),
    borsh.u8("duration"),
    borsh.u32("unix_created"),
    borsh.u32("unix_start"),
    borsh.u32("unix_end"),
    borsh.i128("benchmark_price"),
    borsh.i128("closing_price"),
    borsh.u8("order_status"),
  ]);

  // Get Account Info
  const tradeAccountInfo = await connection.getAccountInfo(account);
  if (tradeAccountInfo) {

    // Decode Data
    const tradeAccountData = TRADE_ACCOUNT_DATA_LAYOUT.decode(tradeAccountInfo.data);

    // Return Lamports
    if (retrieve == "lamports") {
      return tradeAccountInfo.lamports / LAMPORTS_PER_SOL;
    }

    // Return Maker
    if (retrieve == "maker") {
      return tradeAccountData.maker;
    }

    // Return Taker
    if (retrieve == "taker") {
      return tradeAccountData.taker;
    }

    // Return Order Status
    if (retrieve == "orderStatus") {
      return tradeAccountData.order_status;
    }
  }
};
