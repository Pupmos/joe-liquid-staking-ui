import { Keplr as WindowLeap } from "@keplr-wallet/types";
import {
  SigningCosmWasmClient,
  SigningCosmWasmClientOptions,
} from "@cosmjs/cosmwasm-stargate";
import {
  WalletName,
  scopePollingDetectionStrategy,
  WalletReadyState,
  BaseWalletAdapter,
  WalletAccountError,
  WalletConnectionError,
  WalletDisconnectedError,
  WalletDisconnectionError,
  WalletNotReadyError,
  WalletPublicKeyError,
} from "@wizard-ui/core";

interface LeapWallet extends SigningCosmWasmClient {
  address?: any;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

interface LeapWindow extends Window {
  leap?: WindowLeap;
}

declare const window: LeapWindow;

export interface LeapWalletAdapterConfig {
  endpoint: string;
  chainId: string;
  options?: SigningCosmWasmClientOptions;
}

export const LeapWalletName = "Leap Wallet" as WalletName;

export class LeapWalletAdapter extends BaseWalletAdapter {
  name = LeapWalletName;
  url =
    "https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap";
  icon =
    "data:image/svg+xml,%3csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3e %3cpath d='M0 12C0 5.37258 5.37258 0 12 0H28C34.6274 0 40 5.37258 40 12V28C40 34.6274 34.6274 40 28 40H12C5.37258 40 0 34.6274 0 28V12Z' fill='%23212121'/%3e %3cg clip-path='url(%23clip0_3738_54319)'%3e %3cpath d='M29.6211 22.9963C29.6211 26.4474 25.4319 27.8505 20.2263 27.8505C15.0207 27.8505 10.7705 26.4474 10.7705 22.9963C10.7705 19.5452 14.9902 16.7476 20.1958 16.7476C25.4014 16.7476 29.6211 19.5452 29.6211 22.9963Z' fill='%2329A874'/%3e %3cpath d='M28.6602 15.4663C28.6599 14.788 28.4502 14.1263 28.0597 13.5717C27.6693 13.017 27.1171 12.5964 26.4787 12.3673C25.8403 12.1382 25.1467 12.1117 24.4927 12.2916C23.8386 12.4714 23.2561 12.8487 22.8245 13.372C21.1039 12.9921 19.3212 12.9921 17.6006 13.372C17.0763 12.7331 16.3311 12.3146 15.5127 12.1996C14.6943 12.0845 13.8625 12.2813 13.1824 12.7508C12.5023 13.2204 12.0235 13.9284 11.8411 14.7345C11.6586 15.5406 11.7858 16.3858 12.1974 17.1024C11.9328 17.6587 11.7945 18.2666 11.7923 18.8826C11.7923 22.0835 15.5618 24.678 20.211 24.678C24.8602 24.678 28.6297 22.0835 28.6297 18.8826C28.6278 18.2666 28.4895 17.6586 28.2247 17.1024C28.5109 16.6047 28.6611 16.0404 28.6602 15.4663Z' fill='%2363D9A9'/%3e %3cpath d='M14.7969 17.2964C15.9087 17.2964 16.81 16.395 16.81 15.2832C16.81 14.1713 15.9087 13.27 14.7969 13.27C13.685 13.27 12.7837 14.1713 12.7837 15.2832C12.7837 16.395 13.685 17.2964 14.7969 17.2964Z' fill='white'/%3e %3cpath d='M25.5337 17.2964C26.6455 17.2964 27.5468 16.395 27.5468 15.2832C27.5468 14.1713 26.6455 13.27 25.5337 13.27C24.4218 13.27 23.5205 14.1713 23.5205 15.2832C23.5205 16.395 24.4218 17.2964 25.5337 17.2964Z' fill='white'/%3e %3cpath d='M13.72 27.6061C13.8221 27.6062 13.9232 27.5848 14.0165 27.5432C14.1098 27.5016 14.1933 27.4408 14.2615 27.3647C14.3297 27.2887 14.3811 27.1991 14.4124 27.1018C14.4436 27.0046 14.454 26.9018 14.4429 26.8002C14.2733 25.2879 13.5211 22.0119 10.2213 20.0415C5.82896 17.4183 9.30625 26.447 9.30625 26.447L8.39788 26.9704C8.3328 27.0078 8.28188 27.0656 8.25303 27.1348C8.22419 27.2041 8.21903 27.281 8.23838 27.3535C8.25772 27.426 8.30047 27.49 8.35998 27.5357C8.4195 27.5814 8.49244 27.6062 8.56747 27.6061H13.72Z' fill='%2363D9A9'/%3e %3cpath d='M26.8305 27.6061C26.4389 27.6061 26.1326 27.2303 26.1766 26.8002C26.3303 25.2879 27.0099 22.0119 29.9924 20.0415C33.9626 17.4183 30.8197 26.447 30.8197 26.447L31.6408 26.9704C31.9141 27.1443 31.8024 27.6061 31.4871 27.6061H26.8305Z' fill='%2363D9A9'/%3e %3cpath d='M14.7967 15.6491C14.9988 15.6491 15.1627 15.4852 15.1627 15.283C15.1627 15.0809 14.9988 14.917 14.7967 14.917C14.5945 14.917 14.4307 15.0809 14.4307 15.283C14.4307 15.4852 14.5945 15.6491 14.7967 15.6491Z' fill='black'/%3e %3cpath d='M25.5335 15.6491C25.7357 15.6491 25.8995 15.4852 25.8995 15.283C25.8995 15.0809 25.7357 14.917 25.5335 14.917C25.3314 14.917 25.1675 15.0809 25.1675 15.283C25.1675 15.4852 25.3314 15.6491 25.5335 15.6491Z' fill='black'/%3e %3c/g%3e %3cdefs%3e %3cclipPath id='clip0_3738_54319'%3e %3crect width='24' height='15.6783' fill='white' transform='translate(8 12.1719)'/%3e %3c/clipPath%3e %3c/defs%3e %3c/svg%3e";

  private _connecting: boolean;
  private _wallet: LeapWallet | null;
  private _options: SigningCosmWasmClientOptions | undefined;
  private _chainId: string;
  private _endpoint: string;
  private _address: any | null;
  private _readyState: WalletReadyState =
    typeof window === "undefined" || typeof document === "undefined"
      ? WalletReadyState.Unsupported
      : WalletReadyState.NotDetected;

  constructor(config: LeapWalletAdapterConfig) {
    super();
    this._connecting = false;
    this._wallet = null;
    this._address = null;
    this._chainId = config.chainId;
    this._endpoint = config.endpoint;
    this._options = config.options;

    if (this._readyState !== WalletReadyState.Unsupported) {
      scopePollingDetectionStrategy(() => {
        if (window?.leap) {
          this._readyState = WalletReadyState.Installed;
          this.emit("readyStateChange", this._readyState);
          return true;
        }
        return false;
      });

      window?.addEventListener("keplr_keystorechange", this._updateWallet);
    }
  }

  get address(): any | null {
    return this._address;
  }

  get connecting(): boolean {
    return this._connecting;
  }

  get connected(): boolean {
    return !!this._address;
  }

  get readyState(): WalletReadyState {
    return this._readyState;
  }

  get signingClient(): SigningCosmWasmClient | null {
    return this._wallet;
  }

  private _updateWallet = async (event: Event) => {
    event.preventDefault();

    this._connecting = true;

    let wallet = null;
    let accounts = null;

    try {
      // await window.leap!.enable(this._chainId);

      const offlineSigner = await window.leap!.getOfflineSignerAuto(
        this._chainId,
      );

      accounts = await offlineSigner.getAccounts();

      // Initialize the gaia api with the offline signer that is injected by Leap extension.
      wallet = await SigningCosmWasmClient.connectWithSigner(
        this._endpoint,
        offlineSigner,
        this._options,
      );
    } catch (error: any) {
      throw new WalletConnectionError(error?.message, error);
    }
    if (accounts.length == 0) throw new WalletAccountError();

    let address: any;
    try {
      address = accounts[0].address;
    } catch (error: any) {
      throw new WalletPublicKeyError(error?.message, error);
    }

    this._wallet = wallet as LeapWallet;
    this._address = address;

    this.emit("connect", address);
    this._connecting = false;
  };

  async connect(): Promise<void> {
    try {
      if (this.connected || this.connecting) return;
      if (this._readyState !== WalletReadyState.Installed)
        throw new WalletNotReadyError();

      this._connecting = true;

      let wallet = null;
      let accounts = null;

      try {
        const name = "Just Joe";
        const CHAIN_ID = "joe-1"; // test_node.sh
        const RPC_ENDPOINT = "http://95.217.113.126:26657";
        const REST_ENDPOINT = "http://95.217.113.126:1317";

        const STARGAZE_REST =
          "https://api-stargaze.pupmos.network/cosmos/bank/v1beta1/balances/stars1q3scuwfpapydfzrkfssxuwccspewlp6sgnel53"; // prize pool of NFT
        // {
        //     "balances": [
        //     {
        //     "denom": "ustars",
        //     "amount": "37017020682"
        //     }
        //     ],
        //     "pagination": {
        //     "next_key": null,
        //     "total": "1"
        //     }
        //     }

        const bondDenom = "ujoe";
        const tokenDenom = "ujoe";
        await window.leap?.experimentalSuggestChain({
          // Chain-id of the Osmosis chain.
          chainId: CHAIN_ID,
          // The name of the chain to be displayed to the user.
          chainName: name,
          // RPC endpoint of the chain. In this case we are using blockapsis, as it's accepts connections from any host currently. No Cors limitations.
          rpc: RPC_ENDPOINT,
          // REST endpoint of the chain.
          rest: REST_ENDPOINT,
          // Staking coin information
          stakeCurrency: {
            // Coin denomination to be displayed to the user.
            coinDenom: "JOE",
            // Actual denom (i.e. uatom, uscrt) used by the blockchain.
            coinMinimalDenom: bondDenom,
            // # of decimal points to convert minimal denomination to user-facing denomination.
            coinDecimals: 6,
            // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
            // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
            // coinGeckoId: ""
          },
          bip44: {
            // You can only set the coin type of BIP44.
            // 'Purpose' is fixed to 44.
            coinType: 118,
          },
          // Bech32 configuration to show the address to user.
          // This field is the interface of
          bech32Config: {
            bech32PrefixAccAddr: "joe",
            bech32PrefixAccPub: "joepub",
            bech32PrefixValAddr: "joevaloper",
            bech32PrefixValPub: "joevaloperpub",
            bech32PrefixConsAddr: "joevalcons",
            bech32PrefixConsPub: "joevalconspub",
          },
          // List of all coin/tokens used in this chain.
          currencies: [
            {
              // Coin denomination to be displayed to the user.
              coinDenom: "JOE",
              // Actual denom (i.e. uatom, uscrt) used by the blockchain.
              coinMinimalDenom: tokenDenom,
              // # of decimal points to convert minimal denomination to user-facing denomination.
              coinDecimals: 6,
              // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
              // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
              coinGeckoId: "terra-luna-2",
            },
          ],
          // List of coin/tokens used as a fee token in this chain.
          feeCurrencies: [
            {
              // Coin denomination to be displayed to the user.
              coinDenom: "JOE",
              // Actual denom (i.e. uosmo, uscrt) used by the blockchain.
              coinMinimalDenom: tokenDenom,
              // # of decimal points to convert minimal denomination to user-facing denomination.
              coinDecimals: 6,
              // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
              // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
              coinGeckoId: "terra-luna-2",
            },
          ],
          coinType: 118,
          // Make sure that the gas prices are higher than the minimum gas prices accepted by chain validators and RPC/REST endpoint.
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.03,
          },
        });
        await window.leap!.enable(this._chainId);

        const offlineSigner = await window.leap!.getOfflineSignerAuto(
          this._chainId,
        );

        accounts = await offlineSigner.getAccounts();

        // Initialize the gaia api with the offline signer that is injected by Leap extension.
        wallet = await SigningCosmWasmClient.connectWithSigner(
          this._endpoint,
          offlineSigner,
          this._options,
        );
      } catch (error: any) {
        throw new WalletConnectionError(error?.message, error);
      }
      if (accounts.length == 0) throw new WalletAccountError();

      let address: any;
      try {
        address = accounts[0].address;
      } catch (error: any) {
        throw new WalletPublicKeyError(error?.message, error);
      }

      this._wallet = wallet as LeapWallet;
      this._address = address;

      this.emit("connect", address);
    } catch (error: any) {
      this.emit("error", error);
      throw error;
    } finally {
      this._connecting = false;
    }
  }

  async disconnect(): Promise<void> {
    const wallet = this._wallet;
    if (wallet) {
      // wallet.off("disconnect", this._disconnected);

      this._wallet = null;
      this._address = null;

      try {
        await wallet.disconnect();
      } catch (error: any) {
        this.emit("error", new WalletDisconnectionError(error?.message, error));
      }
    }

    this.emit("disconnect");
  }

  private _disconnected = () => {
    const wallet = this._wallet;
    if (wallet) {
      // wallet.off("disconnect", this._disconnected);

      this._wallet = null;
      this._address = null;

      this.emit("error", new WalletDisconnectedError());
      this.emit("disconnect");
    }
  };
}
