
import { Web3Storage } from 'web3.storage';
import type { PutOptions } from 'web3.storage';

let client: Web3Storage;

export const initializeWeb3Storage = (did: string) => {
  // The Web3Storage constructor accepts either a token or a DID
  client = new Web3Storage({ token: did });
};

export const uploadToIPFS = async (files: File[], options?: PutOptions) => {
  if (!client) {
    throw new Error('Web3Storage client not initialized');
  }

  const cid = await client.put(files, options);
  return {
    cid,
    urls: files.map(file => `https://${cid}.ipfs.w3s.link/${file.name}`),
  };
};
