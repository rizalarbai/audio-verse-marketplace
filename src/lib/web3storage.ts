
// Client for storing files on IPFS through Storacha Network
import { Web3Storage } from 'web3.storage';

let client: Web3Storage;

// Initialize the client with the Storacha account token 
export const initializeWeb3Storage = (token: string) => {
  if (!token) {
    throw new Error('Storacha Network token is required');
  }
  
  // Storacha Network now uses the standard Web3Storage client
  // but with their own authentication token
  client = new Web3Storage({ token });
  
  console.log('Storacha Network storage client initialized');
};

// Upload files to IPFS via Storacha Network
export const uploadToIPFS = async (files: File[]) => {
  if (!client) {
    throw new Error('Storage client not initialized');
  }

  try {
    console.log(`Uploading ${files.length} files to Storacha Network...`);
    
    // Use the standard Web3Storage upload method 
    // Storacha Network is compatible with this interface
    const cid = await client.put(files, {
      maxRetries: 3,
      wrapWithDirectory: true,
    });
    
    console.log(`Upload successful! CID: ${cid}`);
    
    // Use Storacha Network's gateway for accessing the files
    const storachaGateway = `https://gateway.storacha.network/ipfs/${cid}/`;
    
    const urls = files.map(file => ({
      filename: file.name,
      url: `${storachaGateway}${encodeURIComponent(file.name)}`,
    }));
    
    return {
      cid,
      urls: urls.map(url => url.url),
      allUrls: urls,
    };
  } catch (error) {
    console.error('Error uploading to Storacha Network:', error);
    throw new Error(`Failed to upload to Storacha Network: ${error.message}`);
  }
};
