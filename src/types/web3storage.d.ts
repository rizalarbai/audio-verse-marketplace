
declare module 'web3.storage' {
  export interface Web3StorageOptions {
    token: string;
  }

  export interface PutOptions {
    name?: string;
    maxRetries?: number;
    wrapWithDirectory?: boolean;
  }

  export class Web3Storage {
    constructor(options: Web3StorageOptions);
    put(files: File[], options?: PutOptions): Promise<string>;
    get(cid: string): Promise<any>;
    delete(cid: string): Promise<void>;
  }
}
