import algosdk from "algosdk";

import { Asset, fetchAssetByIndex } from "./asset";
import {
  ApiListPoolsResponse,
  FetchPoolOptions,
  ListPoolsOptions,
  Pool,
  fetchPool,
  listPools,
} from "./pool";

type AllClientOptions = {
  pactApiUrl?: string;
};

export type ClientOptions = Partial<AllClientOptions>;

const DEFAULT_CLIENT_OPTIONS: ClientOptions = {
  pactApiUrl: "https://api.pact.fi",
};

export class PactClient {
  pactApiUrl?: string;

  constructor(public algod: algosdk.Algodv2, options: ClientOptions = {}) {
    options = { ...DEFAULT_CLIENT_OPTIONS, ...options };
    Object.assign(this, options);
  }

  fetchAsset(assetIndex: number): Promise<Asset> {
    return fetchAssetByIndex(this.algod, assetIndex);
  }

  listPools(options: ListPoolsOptions = {}): Promise<ApiListPoolsResponse> {
    if (!this.pactApiUrl) {
      throw Error("No pactApiUrl provided.");
    }
    return listPools(this.pactApiUrl, options);
  }

  async fetchPool(
    primaryAsset: Asset,
    secondaryAsset: Asset,
    options: FetchPoolOptions = {},
  ): Promise<Pool> {
    return fetchPool(this.algod, primaryAsset, secondaryAsset, {
      pactApiUrl: this.pactApiUrl,
      ...options,
    });
  }
}
