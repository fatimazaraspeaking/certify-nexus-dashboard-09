
export interface User {
  id: string;
  email?: string;
  full_name: string;
  wallet_address: string;
  created_at: string;
  updated_at: string;
  profile_image_url?: string; // Custom field for storing profile image
}

export interface Certificate {
  id: string;
  user_id: string;
  title: string;
  institution_name: string;
  program_name: string;
  issue_date: string;
  verification_url: string;
  certificate_url: string; // R2 storage URL (PDF FORMAT)
  verification_url_pdf?: string;
  arweave_url?: string; // Permanent storage URL
  nft_mint_address?: string; // Solana NFT address
  verification_status: 'pending' | 'verified' | 'rejected';
  verification_details?: string; // JSON containing verification details
  created_at: string;
  updated_at: string;
}

export interface VerificationLog {
  id: string;
  certificate_id: string;
  verification_step: string;
  status: string;
  details?: string;
  created_at: string;
}

export interface CertificateFormData {
  title: string;
  institution_name: string;
  program_name: string;
  issue_date: string;
  certificate_file: File | null;
}

export interface ProfileFormData {
  full_name: string;
  email?: string;
  profile_image?: File | null;
}

export interface WalletContextState {
  wallet: string | null;
  connecting: boolean;
  connected: boolean;
  disconnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  select: (address: string) => void;
}
