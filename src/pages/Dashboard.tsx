
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, FilePlus, Calendar, User, FileCheck, Activity, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchCertificates } from '@/services/api';
import { Certificate } from '@/types';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [certificates, setCertificates] = React.useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadCertificates = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const certs = await fetchCertificates(user.id);
        setCertificates(certs);
      } catch (error) {
        console.error('Failed to load certificates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCertificates();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-500';
      case 'pending': return 'text-amber-500';
      case 'rejected': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome, {user?.full_name || 'User'}</h1>
          <p className="text-muted-foreground">Manage and create tokenized certificates</p>
        </div>
        <Button 
          className="bg-cert-gradient hover:shadow-neon-hover"
          onClick={() => navigate('/certificates/create')}
        >
          <FilePlus className="mr-2 h-4 w-4" />
          New Certificate
        </Button>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center">
              <Award className="mr-2 text-certify-purple-light" />
              {isLoading ? '...' : certificates.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center">
              <FileCheck className="mr-2 text-green-500" />
              {isLoading ? '...' : certificates.filter(c => c.verification_status === 'verified').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center">
              <Activity className="mr-2 text-amber-500" />
              {isLoading ? '...' : certificates.filter(c => c.verification_status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Minted NFTs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center">
              <FileText className="mr-2 text-certify-blue-light" />
              {isLoading ? '...' : certificates.filter(c => c.nft_mint_address).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Certificates */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Certificates</h2>
        {isLoading ? (
          <div className="flex justify-center p-6">
            <div className="animate-pulse-subtle">Loading certificates...</div>
          </div>
        ) : certificates.length === 0 ? (
          <Card className="text-center p-6">
            <CardContent className="py-10">
              <Award className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No certificates yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by creating your first certificate
              </p>
              <Button
                onClick={() => navigate('/certificates/create')}
                className="bg-cert-gradient hover:shadow-neon-hover"
              >
                <FilePlus className="mr-2 h-4 w-4" />
                Create Certificate
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.slice(0, 3).map((cert) => (
              <Card key={cert.id} className="overflow-hidden hover:shadow-neon hover:scale-[1.01] transition-all cursor-pointer"
                   onClick={() => navigate(`/certificates/${cert.id}`)}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">{cert.title}</CardTitle>
                    <div className={`text-sm font-medium ${getStatusColor(cert.verification_status)}`}>
                      {cert.verification_status.charAt(0).toUpperCase() + cert.verification_status.slice(1)}
                    </div>
                  </div>
                  <CardDescription>{cert.institution_name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center mb-1">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>{cert.program_name}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Issued: {cert.issue_date}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/50 px-6 py-3">
                  <div className="text-xs flex items-center justify-between w-full">
                    <span>ID: {cert.id}</span>
                    {cert.nft_mint_address && (
                      <span className="text-certify-purple">
                        Minted
                      </span>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        {certificates.length > 0 && (
          <div className="flex justify-center mt-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/certificates')}
            >
              View All Certificates
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
