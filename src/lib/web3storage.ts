
// Using web3.storage as the library but connecting to Storacha Network
import { Web3Storage } from 'web3.storage';

let client: Web3Storage;

// Initialize the Web3Storage client with the token but pointing to Storacha Network
export const initializeWeb3Storage = (token: string) => {
  if (!token) {
    throw new Error('Token is required to initialize storage client');
  }
  
  // Create client with the token
  // Note: Storacha Network is compatible with web3.storage API
  // but requires using their token and gateways for content access
  client = new Web3Storage({ token });
  
  console.log('Storage client initialized with Storacha Network token');
};

// Upload files to IPFS via Storacha Network
export const uploadToIPFS = async (files: File[]) => {
  if (!client) {
    throw new Error('Storage client not initialized');
  }

  try {
    console.log(`Uploading ${files.length} files to Storacha Network...`);
    
    // Upload files to Storacha Network
    const cid = await client.put(files, {
      maxRetries: 5,
      wrapWithDirectory: true,
    });
    
    console.log(`Upload successful! CID: ${cid}`);
    
    // Create gateway URLs for each file
    // Using Storacha Network gateways for content delivery
    const storachaGateway = `https://gateway.storacha.network/ipfs/${cid}/`;
    
    const urls = files.map(file => ({
      filename: file.name,
      storacha: `${storachaGateway}${encodeURIComponent(file.name)}`,
    }));
    
    return {
      cid,
      urls: urls.map(url => url.storacha), // Use Storacha gateway URLs
      allUrls: urls, // Provide all URL options
    };
  } catch (error) {
    console.error('Error uploading to Storacha Network:', error);
    throw new Error(`Failed to upload to Storacha Network: ${error.message}`);
  }
};
