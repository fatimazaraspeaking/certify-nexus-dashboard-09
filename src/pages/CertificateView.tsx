
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Building, 
  GraduationCap, 
  Award, 
  FileCheck, 
  Download, 
  ArrowLeft,
  ExternalLink,
  Loader2,
  X
} from 'lucide-react';
import { fetchCertificate } from '@/services/api';
import { Certificate } from '@/types';
import Logo from '@/components/shared/Logo';

const CertificateView = () => {
  const { userId, certificateId } = useParams<{ userId: string; certificateId: string }>();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  useEffect(() => {
    const loadCertificate = async () => {
      if (!certificateId) return;
      
      try {
        setIsLoading(true);
        const cert = await fetchCertificate(certificateId);
        setCertificate(cert);
      } catch (error) {
        console.error('Failed to load certificate:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCertificate();
  }, [certificateId]);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          <Link to="/">
            <Button variant="outline" size="sm">
              Go to Homepage
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <header className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Certificate Verification</h1>
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
                  The requested certificate could not be found or does not exist.
                </p>
                <Button asChild>
                  <Link to="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to Homepage
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Certificate Preview */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-cert-gradient text-white">
                  <div className="flex justify-between items-start">
                    <CardTitle>Certificate</CardTitle>
                    {getStatusBadge(certificate.verification_status)}
                  </div>
                  {certificate.verification_status === 'verified' && (
                    <CardDescription className="text-white opacity-90">
                      This certificate has been verified as authentic
                    </CardDescription>
                  )}
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
                      <p className="text-lg mb-6">Issued on {certificate.issue_date}</p>
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

              {/* Certificate Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Certificate Information</CardTitle>
                  <CardDescription>
                    Details about this certificate
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  {certificate.verification_status === 'verified' && (
                    <div className="p-4 rounded-lg border border-green-200 bg-green-50">
                      <div className="flex items-center gap-2 text-green-700 font-medium mb-1">
                        <FileCheck className="h-5 w-5" />
                        Verification Status: Verified
                      </div>
                      <p className="text-sm text-green-600">
                        This certificate has been verified as authentic and has not been tampered with.
                      </p>
                    </div>
                  )}
                  
                  {certificate.nft_mint_address && (
                    <div>
                      <div className="font-semibold flex items-center gap-2 mb-1">
                        NFT Information
                      </div>
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
                </CardContent>
                <CardFooter className="border-t pt-6 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => window.open(certificate.certificate_url, '_blank')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Certificate
                  </Button>
                  
                  {certificate.arweave_url && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(certificate.arweave_url, '_blank')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on Arweave
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateView;
