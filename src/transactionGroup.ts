import algosdk, { Transaction } from "algosdk";

export class TransactionGroup {
  transactions: algosdk.Transaction[];

  constructor(transactions: Transaction[]) {
    this.transactions = algosdk.assignGroupID(transactions);
  }

  signTxn(privateKey: Uint8Array): Uint8Array[] {
    return this.transactions.map((tx) => tx.signTxn(privateKey));
  }
}
