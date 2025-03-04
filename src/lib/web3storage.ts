
import { Web3Storage } from 'web3.storage';

let client: Web3Storage;

// Initialize the Web3Storage client with the token
export const initializeWeb3Storage = (token: string) => {
  if (!token) {
    throw new Error('Token is required to initialize Web3Storage');
  }
  
  client = new Web3Storage({ token });
};

// Upload files to IPFS
export const uploadToIPFS = async (files: File[]) => {
  if (!client) {
    throw new Error('Web3Storage client not initialized');
  }

  try {
    console.log(`Uploading ${files.length} files to Web3.storage...`);
    
    // Upload files to Web3.Storage
    const cid = await client.put(files, {
      maxRetries: 3,
      wrapWithDirectory: true,
    });
    
    console.log(`Upload successful! CID: ${cid}`);
    
    // Create gateway URLs for each file
    // Using both IPFS gateway options for redundancy
    const ipfsGateway = `https://${cid}.ipfs.dweb.link/`;
    const w3sGateway = `https://${cid}.ipfs.w3s.link/`;
    
    const urls = files.map(file => ({
      filename: file.name,
      ipfs: `${ipfsGateway}${encodeURIComponent(file.name)}`,
      w3s: `${w3sGateway}${encodeURIComponent(file.name)}`
    }));
    
    return {
      cid,
      urls: urls.map(url => url.w3s), // Use the w3s gateway URLs by default
      allUrls: urls, // Provide all URL options
    };
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error(`Failed to upload to IPFS: ${error.message}`);
  }
};
