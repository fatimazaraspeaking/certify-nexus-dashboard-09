
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  FileCheck, 
  Search, 
  ExternalLink, 
  Award, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Building, 
  GraduationCap,
  Loader2
} from 'lucide-react';
import { fetchCertificate, fetchVerificationLogs } from '@/services/api';
import { Certificate, VerificationLog } from '@/types';

const Verification = () => {
  const [certificateId, setCertificateId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [verificationLogs, setVerificationLogs] = useState<VerificationLog[]>([]);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const handleSearch = async () => {
    if (!certificateId.trim()) return;
    
    try {
      setIsSearching(true);
      setSearchAttempted(true);
      setVerificationLogs([]);
      
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const cert = await fetchCertificate(certificateId.trim());
      setCertificate(cert);
      
      // If we found a certificate, fetch its verification logs
      if (cert) {
        const logs = await fetchVerificationLogs(cert.id);
        setVerificationLogs(logs);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setCertificate(null);
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500 hover:bg-green-600">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold mb-1">Certificate Verification</h1>
        <p className="text-muted-foreground">Verify the authenticity of any certificate</p>
      </header>

      {/* Search Card */}
      <Card>
        <CardHeader>
          <CardTitle>Verify Certificate</CardTitle>
          <CardDescription>
            Enter a certificate ID to verify its authenticity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Enter certificate ID (e.g. cert-1)"
                className="pl-10"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={isSearching || !certificateId.trim()}
              className="bg-cert-gradient hover:shadow-neon-hover"
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <FileCheck className="mr-2 h-4 w-4" />
                  Verify
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {searchAttempted && (
        <>
          {isSearching ? (
            <Card className="p-8 text-center">
              <CardContent>
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-certify-purple" />
                <h2 className="text-xl font-semibold mb-2">Verifying Certificate</h2>
                <p className="text-muted-foreground">
                  Checking authenticity on the blockchain...
                </p>
              </CardContent>
            </Card>
          ) : certificate ? (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>Certificate Found</CardTitle>
                  {getStatusBadge(certificate.verification_status)}
                </div>
                <CardDescription>
                  {certificate.verification_status === 'verified' 
                    ? 'This certificate has been verified as authentic'
                    : certificate.verification_status === 'pending'
                    ? 'This certificate is still being verified'
                    : 'This certificate verification has failed'}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="font-semibold flex items-center gap-2 mb-1">
                        <Award className="h-4 w-4" />
                        Title
                      </div>
                      <div className="text-muted-foreground">{certificate.title}</div>
                    </div>
                    <div>
                      <div className="font-semibold flex items-center gap-2 mb-1">
                        <Building className="h-4 w-4" />
                        Institution
                      </div>
                      <div className="text-muted-foreground">{certificate.institution_name}</div>
                    </div>
                    <div>
                      <div className="font-semibold flex items-center gap-2 mb-1">
                        <GraduationCap className="h-4 w-4" />
                        Program
                      </div>
                      <div className="text-muted-foreground">{certificate.program_name}</div>
                    </div>
                    <div>
                      <div className="font-semibold flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4" />
                        Issue Date
                      </div>
                      <div className="text-muted-foreground">{certificate.issue_date}</div>
                    </div>
                  </div>
                </div>

                <Separator />

                {certificate.verification_status === 'verified' && (
                  <Alert className="bg-green-500/10 text-green-700 border-green-500/30">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Verified Certificate</AlertTitle>
                    <AlertDescription>
                      This certificate has been cryptographically verified and is authentic.
                    </AlertDescription>
                  </Alert>
                )}

                {certificate.verification_status === 'pending' && (
                  <Alert className="bg-amber-500/10 text-amber-700 border-amber-500/30">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Verification In Progress</AlertTitle>
                    <AlertDescription>
                      This certificate is still being verified. Please check back later.
                    </AlertDescription>
                  </Alert>
                )}

                {certificate.verification_status === 'rejected' && (
                  <Alert className="bg-red-500/10 text-red-700 border-red-500/30">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Verification Failed</AlertTitle>
                    <AlertDescription>
                      {certificate.verification_details 
                        ? `Reason: ${JSON.parse(certificate.verification_details).reason}` 
                        : 'This certificate could not be verified.'}
                    </AlertDescription>
                  </Alert>
                )}

                {certificate.nft_mint_address && (
                  <div>
                    <div className="font-semibold mb-1">NFT Information</div>
                    <div className="text-sm font-mono text-muted-foreground break-all mb-2">
                      {certificate.nft_mint_address}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`https://explorer.solana.com/address/${certificate.nft_mint_address}`, '_blank')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on Solana Explorer
                    </Button>
                  </div>
                )}
                
                {/* Verification Logs */}
                {verificationLogs.length > 0 && (
                  <div>
                    <div className="font-semibold mb-2">Verification History</div>
                    <div className="space-y-2">
                      {verificationLogs.map((log) => (
                        <div key={log.id} className="p-2 bg-muted/50 rounded text-sm">
                          <div className="flex justify-between items-center">
                            <div className="font-medium">
                              {log.verification_step.replace('_', ' ').split(' ').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </div>
                            <Badge className={
                              log.status === 'success' ? 'bg-green-500' : 
                              log.status === 'pending' ? 'bg-amber-500' : 
                              'bg-red-500'
                            }>
                              {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                            </Badge>
                          </div>
                          {log.details && (
                            <div className="text-muted-foreground mt-1">
                              {JSON.parse(log.details).message}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="border-t pt-4 flex gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => window.open(certificate.certificate_url, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Certificate
                </Button>
                {certificate.arweave_url && (
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => window.open(certificate.arweave_url, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View on Arweave
                  </Button>
                )}
              </CardFooter>
            </Card>
          ) : (
            <Card className="p-6 text-center">
              <CardContent>
                <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Certificate Not Found</h2>
                <p className="text-muted-foreground mb-6">
                  We couldn't find a certificate with the ID you provided. Please check the ID and try again.
                </p>
                <div className="text-sm text-muted-foreground">
                  For demo purposes, try searching for IDs like: cert-1, cert-2, or cert-3
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>About Certificate Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            CertifyNexus verifies certificates through a combination of blockchain technology and digital signatures.
            When a certificate is verified, it means:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>The certificate has not been tampered with</li>
            <li>It was genuinely issued by the claimed institution</li>
            <li>The blockchain record matches the certificate data</li>
          </ul>
          <p className="text-muted-foreground">
            Verified certificates are stored permanently on Arweave and can be minted as NFTs on Solana.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Verification;
