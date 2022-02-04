const { default: algosdk } = require('algosdk');
const pact = require('../dist/pactsdk.cjs');

const account = algosdk.mnemonicToSecretKey('<mnemonic>');

(async function() {
  const algod = new algosdk.Algodv2();  // provide options
  const client = new pact.Client(algod);

  const algo = await client.fetchAsset(0);
  const jamnik = await client.fetchAsset(41409282);

  const pool = await client.fetchPool(algo, jamnik);

  // Opt-in for liquidity token.
  const optInTxn = await pool.liquidityAsset.prepareOptInTx(account.addr);
  sentOptInTxn = await client.algod.sendRawTransaction(optInTxn.signTxn(account.sk)).do();
  console.log(`OptIn transaction ${sentOptInTxn.txId}`);
  await algosdk.waitForConfirmation(client.algod, sentOptInTxn.txId, 2);

  const addLiqTx = await pool.prepareAddLiquidityTx({
    address: account.addr,
    primaryAssetAmount: 1_000_000,
    secondaryAssetAmount: 500_000,
  });
  const signedTx = addLiqTx.signTxn(account.sk)
  const sentTx = await client.algod.sendRawTransaction(signedTx).do();

  console.log(`Transaction ${sentTx.txId}`);
})();
