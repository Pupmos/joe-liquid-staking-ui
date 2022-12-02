/* tslint:disable */
/* eslint-disable */
/**
* @param {string} miner_entropy
* @param {string} miner_address
* @param {bigint} difficulty
* @param {bigint} start_nonce
* @param {bigint} max_tries
* @returns {MinedProof}
*/
export function mine(miner_entropy: string, miner_address: string, difficulty: bigint, start_nonce: bigint, max_tries: bigint): MinedProof;
/**
*/
export class MinedProof {
  free(): void;
/**
* @param {bigint} nonce
* @param {string} hash
* @param {boolean} success
*/
  constructor(nonce: bigint, hash: string, success: boolean);
/**
*/
  readonly hash: string;
/**
*/
  nonce: bigint;
/**
*/
  success: boolean;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_minedproof_free: (a: number) => void;
  readonly __wbg_get_minedproof_nonce: (a: number) => number;
  readonly __wbg_set_minedproof_nonce: (a: number, b: number) => void;
  readonly __wbg_get_minedproof_success: (a: number) => number;
  readonly __wbg_set_minedproof_success: (a: number, b: number) => void;
  readonly minedproof_new: (a: number, b: number, c: number, d: number) => number;
  readonly minedproof_hash: (a: number, b: number) => void;
  readonly mine: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
