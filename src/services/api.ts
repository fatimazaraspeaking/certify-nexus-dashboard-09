
import { Certificate, User, VerificationLog } from '@/types';

// In a real application, these would be actual API calls to your Cloudflare Workers

// Mock verification logs for testing
const MOCK_VERIFICATION_LOGS: VerificationLog[] = [
  {
    id: 'log-1',
    certificate_id: 'cert-1',
    verification_step: 'hash_verification',
    status: 'success',
    details: JSON.stringify({ message: 'Certificate hash verified' }),
    created_at: '2024-03-16T11:30:00Z',
  },
  {
    id: 'log-2',
    certificate_id: 'cert-1',
    verification_step: 'issuer_verification',
    status: 'success',
    details: JSON.stringify({ message: 'Issuer signature verified' }),
    created_at: '2024-03-16T11:31:00Z',
  },
  {
    id: 'log-3',
    certificate_id: 'cert-2',
    verification_step: 'hash_verification',
    status: 'success',
    details: JSON.stringify({ message: 'Certificate hash verified' }),
    created_at: '2024-02-20T14:25:00Z',
  },
  {
    id: 'log-4',
    certificate_id: 'cert-2',
    verification_step: 'issuer_verification',
    status: 'pending',
    details: JSON.stringify({ message: 'Waiting for issuer confirmation' }),
    created_at: '2024-02-20T14:26:00Z',
  },
  {
    id: 'log-5',
    certificate_id: 'cert-3',
    verification_step: 'hash_verification',
    status: 'success',
    details: JSON.stringify({ message: 'Certificate hash verified' }),
    created_at: '2024-01-11T10:15:00Z',
  },
  {
    id: 'log-6',
    certificate_id: 'cert-3',
    verification_step: 'issuer_verification',
    status: 'failed',
    details: JSON.stringify({ message: 'Invalid institution signature' }),
    created_at: '2024-01-11T10:16:00Z',
  },
];

// Mock data for testing
const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-1',
    user_id: 'user-1',
    title: 'Blockchain Developer',
    institution_name: 'Solana Academy',
    program_name: 'Web3 Development',
    issue_date: '2024-03-15',
    verification_url: 'https://example.com/verify/cert-1',
    certificate_url: 'https://example.com/certificates/cert-1.pdf',
    verification_status: 'verified',
    created_at: '2024-03-15T10:00:00Z',
    updated_at: '2024-03-16T15:30:00Z',
    arweave_url: 'https://arweave.net/abc123cert1',
    nft_mint_address: 'SNftxKdf8xY6vKn5DS3qBM5bpvEwQNwD5a5PJj5nAVd',
  },
  {
    id: 'cert-2',
    user_id: 'user-1',
    title: 'NFT Artist Certificate',
    institution_name: 'Digital Art School',
    program_name: 'NFT Creation',
    issue_date: '2024-02-20',
    verification_url: 'https://example.com/verify/cert-2',
    certificate_url: 'https://example.com/certificates/cert-2.pdf',
    verification_status: 'pending',
    created_at: '2024-02-20T14:20:00Z',
    updated_at: '2024-02-20T14:20:00Z',
  },
  {
    id: 'cert-3',
    user_id: 'user-1',
    title: 'Solana Programming',
    institution_name: 'Solana University',
    program_name: 'Smart Contract Development',
    issue_date: '2024-01-10',
    verification_url: 'https://example.com/verify/cert-3',
    certificate_url: 'https://example.com/certificates/cert-3.pdf',
    verification_status: 'rejected',
    verification_details: JSON.stringify({ reason: 'Invalid institution signature' }),
    created_at: '2024-01-10T09:15:00Z',
    updated_at: '2024-01-11T16:45:00Z',
  }
];

// Certificate API calls
export const fetchCertificates = async (userId: string): Promise<Certificate[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Filter certificates by user_id
  return MOCK_CERTIFICATES.filter(cert => cert.user_id === userId);
};

export const fetchCertificate = async (id: string): Promise<Certificate | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const certificate = MOCK_CERTIFICATES.find(cert => cert.id === id);
  return certificate || null;
};

export const createCertificate = async (
  userId: string,
  certificateData: Omit<Certificate, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'verification_status'>
): Promise<Certificate> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Create new certificate
  const newCertificate: Certificate = {
    id: `cert-${Date.now()}`,
    user_id: userId,
    ...certificateData,
    verification_status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  // In a real app, this would be persisted to your database
  return newCertificate;
};

export const verifyCertificate = async (userId: string, certificateId: string): Promise<void> => {
  // Simulate API call to verification endpoint
  console.log(`Making verification request for User ${userId}, Certificate ${certificateId}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would be a fetch to your worker endpoint:
  // fetch(`https://certificate-verification-worker-v3.spacewear-work.workers.dev/verify/${userId}/${certificateId}`, {
  //   headers: {
  //     "Authorization": "Bearer HzpydHqGADi77bsjb2klH6ZzJjP6emOk"
  //   }
  // });
};

export const checkVerificationStatus = async (certificateId: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Find certificate
  const certificate = MOCK_CERTIFICATES.find(cert => cert.id === certificateId);
  
  return certificate?.verification_status || 'pending';
};

export const mintCertificateNFT = async (certificateId: string): Promise<string> => {
  // Simulate API delay for minting
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Generate a fake Solana NFT address
  const mintAddress = `${Math.random().toString(36).substring(2, 10)}NFT${Math.random().toString(36).substring(2, 6)}`;
  
  // In a real app, this would be a call to mint an NFT on Solana
  
  return mintAddress;
};

// User API calls
export const fetchUserProfile = async (walletAddress: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, you would fetch user data from your database
  return {
    id: 'user-1',
    full_name: 'Alex Johnson',
    wallet_address: walletAddress,
    email: 'alex@example.com',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-04-01T00:00:00Z',
    profile_image_url: 'https://example.com/profile/alex.jpg',
  };
};

export const updateUserProfile = async (userData: Partial<User>): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // In a real app, this would update the user in your database
  return {
    id: 'user-1',
    full_name: userData.full_name || 'Alex Johnson',
    wallet_address: userData.wallet_address || '5wLhAsYwvKcDviAFHyWZB7UZLWGqABXSSqQjJXqM5eu2',
    email: userData.email || 'alex@example.com',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: new Date().toISOString(),
    profile_image_url: userData.profile_image_url || 'https://example.com/profile/alex.jpg',
  };
};

// File upload helpers (simulated)
export const uploadFile = async (
  file: File, 
  type: 'profile' | 'certificate'
): Promise<string> => {
  // Simulate API delay for file upload
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real app, this would upload to Cloudflare R2
  // For demo, generate a fake URL
  return `https://storage.example.com/${type}/${Date.now()}_${file.name}`;
};

// Simulated PDF conversion (in real app would use a library)
export const convertImageToPdf = async (imageFile: File): Promise<File> => {
  // Simulate conversion delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real app, you would use a PDF generation library
  // This is just a mock that renames the file to .pdf
  const fileName = imageFile.name.split('.')[0] + '.pdf';
  return new File([imageFile], fileName, { type: 'application/pdf' });
};

// Verification log API calls
export const fetchVerificationLogs = async (certificateId: string): Promise<VerificationLog[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Filter logs by certificate ID
  return MOCK_VERIFICATION_LOGS.filter(log => log.certificate_id === certificateId);
};
