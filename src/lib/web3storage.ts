
import { Web3Storage } from 'web3.storage';

let client: Web3Storage;

export const initializeWeb3Storage = (token: string) => {
  client = new Web3Storage({ token });
};

export const uploadToIPFS = async (files: File[]) => {
  if (!client) {
    throw new Error('Web3Storage client not initialized');
  }

  const cid = await client.put(files);
  return {
    cid,
    urls: files.map(file => `https://${cid}.ipfs.w3s.link/${file.name}`),
  };
};
