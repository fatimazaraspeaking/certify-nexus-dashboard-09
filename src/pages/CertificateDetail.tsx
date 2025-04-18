
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Building, 
  GraduationCap, 
  Award, 
  FileCheck, 
  Download, 
  ArrowLeft,
  Activity,
  X,
  Loader2,
  Share2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchCertificate, verifyCertificate, checkVerificationStatus, mintCertificateNFT } from '@/services/api';
import { Certificate } from '@/types';

const CertificateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMinting, setIsMinting] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  useEffect(() => {
    const loadCertificate = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const cert = await fetchCertificate(id);
        setCertificate(cert);
        
        // If status is pending, start polling for status updates
        if (cert?.verification_status === 'pending') {
          startStatusPolling(cert.id);
        }
      } catch (error) {
        console.error('Failed to load certificate:', error);
        toast({
          title: "Error",
          description: "Failed to load certificate details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCertificate();

    // Clean up polling on unmount
    return () => {
      setIsPolling(false);
    };
  }, [id]);

  const startStatusPolling = (certificateId: string) => {
    setIsPolling(true);
    
    const intervalId = setInterval(async () => {
      if (!isPolling) {
        clearInterval(intervalId);
        return;
      }
      
      try {
        const status = await checkVerificationStatus(certificateId);
        
        // Update certificate status if changed
        if (certificate && status !== certificate.verification_status) {
          setCertificate(prev => prev ? { ...prev, verification_status: status as any } : null);
          
          // Show toast notification
          if (status === 'verified') {
            toast({
              title: "Certificate Verified",
              description: "Your certificate has been successfully verified",
            });
            setIsPolling(false);
            clearInterval(intervalId);
          } else if (status === 'rejected') {
            toast({
              title: "Verification Failed",
              description: "Your certificate could not be verified",
              variant: "destructive",
            });
            setIsPolling(false);
            clearInterval(intervalId);
          }
        }
      } catch (error) {
        console.error('Failed to check verification status:', error);
      }
    }, 10000); // Check every 10 seconds
    
    // Cleanup function
    return () => {
      clearInterval(intervalId);
      setIsPolling(false);
    };
  };

  const handleVerify = async () => {
    if (!certificate || !user) return;
    
    try {
      await verifyCertificate(user.id, certificate.id);
      
      // Start polling for status updates
      startStatusPolling(certificate.id);
      
      toast({
        title: "Verification Started",
        description: "Your certificate is being verified. This may take a moment.",
      });
    } catch (error) {
      console.error('Failed to verify certificate:', error);
      toast({
        title: "Verification Failed",
        description: "Failed to initiate verification process",
        variant: "destructive",
      });
    }
  };

  const handleMint = async () => {
    if (!certificate) return;
    
    try {
      setIsMinting(true);
      
      // Call the mint API
      const mintAddress = await mintCertificateNFT(certificate.id);
      
      // Update the certificate with the mint address
      setCertificate(prev => 
        prev ? { ...prev, nft_mint_address: mintAddress } : null
      );
      
      toast({
        title: "Certificate Minted",
        description: "Your certificate has been successfully minted as an NFT",
      });
    } catch (error) {
      console.error('Failed to mint certificate:', error);
      toast({
        title: "Minting Failed",
        description: "Failed to mint your certificate as an NFT",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  const handleShare = () => {
    if (!certificate) return;
    
    // Create a shareable URL
    const shareUrl = `${window.location.origin}/view/${user?.id}/${certificate.id}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast({
          title: "Link Copied",
          description: "Certificate link copied to clipboard",
        });
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
        toast({
          title: "Copy Failed",
          description: "Failed to copy the link to clipboard",
          variant: "destructive",
        });
      });
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <FileCheck className="w-8 h-8 text-green-500" />;
      case 'pending':
        return <Activity className="w-8 h-8 text-amber-500" />;
      case 'rejected':
        return <X className="w-8 h-8 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate('/certificates')} size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Certificate Details</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleShare}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.open(certificate?.certificate_url, '_blank')}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </header>

      {isLoading ? (
        <Card className="p-12 text-center">
          <CardContent>
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading certificate details...</p>
          </CardContent>
        </Card>
      ) : !certificate ? (
        <Card className="p-8 text-center">
          <CardContent>
            <X className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-semibold mb-2">Certificate Not Found</h2>
            <p className="text-muted-foreground mb-8">
              The requested certificate could not be found or you don't have access to it.
            </p>
            <Button onClick={() => navigate('/certificates')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Certificates
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Certificate PDF Preview */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden h-full">
              <CardHeader className="bg-cert-gradient text-white">
                <div className="flex justify-between items-start">
                  <CardTitle>Certificate Preview</CardTitle>
                  {getStatusBadge(certificate.verification_status)}
                </div>
              </CardHeader>
              <CardContent className="p-0 flex flex-col items-center justify-center h-[500px] bg-gray-100">
                {showPdfPreview ? (
                  <iframe 
                    src={certificate.certificate_url} 
                    className="w-full h-full"
                    title="Certificate PDF"
                  />
                ) : (
                  <div className="text-center p-8 flex flex-col items-center justify-center h-full">
                    <Award className="h-20 w-20 text-muted-foreground mb-4" />
                    <h3 className="text-2xl font-bold text-gradient mb-2">{certificate.title}</h3>
                    <p className="text-xl mb-4">{certificate.institution_name}</p>
                    <p className="text-lg mb-6">Awarded to {user?.full_name}</p>
                    <Button
                      onClick={() => setShowPdfPreview(true)}
                      className="bg-cert-gradient hover:shadow-neon-hover"
                    >
                      <FileCheck className="mr-2 h-4 w-4" />
                      View Original Certificate
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-muted/50 py-3 border-t">
                <div className="text-sm text-muted-foreground w-full flex justify-between">
                  <span>Certificate ID: {certificate.id}</span>
                  <span>Issued: {certificate.issue_date}</span>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Certificate Details and Actions */}
          <div className="space-y-6">
            {/* Certificate Info */}
            <Card>
              <CardHeader>
                <CardTitle>Certificate Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  {getStatusIcon(certificate.verification_status)}
                  <div>
                    <div className="font-semibold">
                      {certificate.verification_status.charAt(0).toUpperCase() + certificate.verification_status.slice(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {certificate.verification_status === 'pending' ? 
                        'Your certificate is being verified' : 
                        certificate.verification_status === 'verified' ?
                        'Your certificate has been verified' :
                        'Your certificate verification failed'}
                    </div>
                  </div>
                </div>

                {certificate.verification_status === 'pending' && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleVerify}
                    disabled={isPolling}
                  >
                    {isPolling ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Checking Status...
                      </>
                    ) : (
                      <>
                        <Activity className="mr-2 h-4 w-4" />
                        Check Status
                      </>
                    )}
                  </Button>
                )}

                {certificate.verification_status === 'rejected' && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleVerify}
                  >
                    <Activity className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* NFT Minting */}
            <Card>
              <CardHeader>
                <CardTitle>NFT Minting</CardTitle>
                <CardDescription>
                  Mint your certificate as an NFT on Solana
                </CardDescription>
              </CardHeader>
              <CardContent>
                {certificate.nft_mint_address ? (
                  <div className="space-y-4">
                    <div className="p-3 rounded-md bg-green-500/10 border border-green-500/20 text-green-700">
                      <div className="font-semibold flex items-center gap-2 mb-1">
                        <FileCheck className="h-4 w-4" />
                        Successfully Minted
                      </div>
                      <div className="text-sm">
                        Your certificate has been minted as an NFT on Solana
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Mint Address</div>
                      <div className="text-sm text-muted-foreground break-all font-mono">
                        {certificate.nft_mint_address}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(`https://explorer.solana.com/address/${certificate.nft_mint_address}`, '_blank')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on Solana Explorer
                    </Button>
                  </div>
                ) : (
                  <>
                    {certificate.verification_status === 'verified' ? (
                      <Button
                        className="w-full bg-cert-gradient hover:shadow-neon-hover"
                        onClick={handleMint}
                        disabled={isMinting}
                      >
                        {isMinting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Minting...
                          </>
                        ) : (
                          <>
                            <Award className="mr-2 h-4 w-4" />
                            Mint as NFT
                          </>
                        )}
                      </Button>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        Your certificate must be verified before it can be minted as an NFT.
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Permanent Storage */}
            <Card>
              <CardHeader>
                <CardTitle>Permanent Storage</CardTitle>
                <CardDescription>
                  Arweave permanent storage status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {certificate.arweave_url ? (
                  <div className="space-y-4">
                    <div className="p-3 rounded-md bg-green-500/10 border border-green-500/20 text-green-700">
                      <div className="font-semibold flex items-center gap-2 mb-1">
                        <FileCheck className="h-4 w-4" />
                        Permanently Stored
                      </div>
                      <div className="text-sm">
                        Your certificate is permanently stored on Arweave
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Arweave URL</div>
                      <div className="text-sm text-muted-foreground break-all font-mono">
                        {certificate.arweave_url}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(certificate.arweave_url, '_blank')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on Arweave
                    </Button>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Your certificate will be stored on Arweave when it's minted as an NFT.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateDetail;
