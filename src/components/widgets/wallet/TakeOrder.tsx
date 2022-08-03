import { useEffect, useState } from 'react'
import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { PhantomProvider, PROGRAM_ID, accountChainlinkPriceFeed, accountChainlinkProgramOwner } from "./Types";
import * as borsh from "@project-serum/borsh";
import { serialize } from "borsh";

// Structure for User Instruction
class TakeIx {
  tag: number; direction: number;
  constructor(tag: number, direction: number) {
    this.tag = tag;
    this.direction = direction;
  }
}

type Args = {
  tradeData: any;
  userAccount: PublicKey;
  walletPubKey: String;
  connection: Connection;
  provider: any;
}

export async function takeTrade({tradeData, walletPubKey, connection, provider}: Args) {
  if (tradeData && walletPubKey) {

    // Get wallet and accounts
    const wallet = new PublicKey(walletPubKey);
    const tradeAccount = new PublicKey(tradeData.trade_account);

    // Generate PDA - User
    const [userAccount] = await PublicKey.findProgramAddress(
      [Buffer.from("user"), wallet.toBuffer()],
      PROGRAM_ID
    );

    // Build Instruction for Blog with Post]
    const tradeIx = new TakeIx(3, 0); // Take, remaining is for rest
    const schema = new Map([[TakeIx, { kind: 'struct', fields: [['tag', 'u8'], ['direction', 'u8']]}]]);
    const instruction_data = serialize(schema, tradeIx);

    // System Program (Needed for PDA Creation in Program)
    const systemProgramId = SystemProgram.programId;

    // Determine Instruction Accounts
    let ixAccounts = [
      {pubkey: wallet, isSigner: true, isWritable: true},
      {pubkey: userAccount, isSigner: false, isWritable: true},
      {pubkey: tradeAccount, isSigner: false, isWritable: true},
      {pubkey: systemProgramId, isSigner: false, isWritable: false}, // Needed as PDA balance will change
      {pubkey: accountChainlinkPriceFeed, isSigner: false, isWritable: false},
      {pubkey: accountChainlinkProgramOwner, isSigner: false, isWritable: false},
    ];

    // Call Transaction
    const tx_ix = new TransactionInstruction({
      keys: ixAccounts,
      programId: PROGRAM_ID,
      data: Buffer.from(instruction_data),
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
