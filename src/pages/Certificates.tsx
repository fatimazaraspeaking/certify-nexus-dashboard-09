
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FilePlus, Calendar, Award, FileText, Search, Activity, FileCheck, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchCertificates } from '@/services/api';
import { Certificate } from '@/types';

const Certificates = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [certificates, setCertificates] = React.useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  React.useEffect(() => {
    const loadCertificates = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        console.log("Loading certificates for user ID:", user.id);
        const certs = await fetchCertificates(user.id);
        console.log("Certificates loaded:", certs);
        setCertificates(certs);
      } catch (error) {
        console.error('Failed to load certificates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCertificates();
  }, [user]);

  // Filter certificates based on search and status
  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = 
      cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.institution_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.program_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      cert.verification_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <FileCheck className="h-5 w-5 text-green-500" />;
      case 'pending': return <Activity className="h-5 w-5 text-amber-500" />;
      case 'rejected': return <X className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Certificates</h1>
          <p className="text-muted-foreground">Manage and view all your certificates</p>
        </div>
        <Button 
          className="bg-cert-gradient hover:shadow-neon-hover"
          onClick={() => navigate('/certificates/create')}
        >
          <FilePlus className="mr-2 h-4 w-4" />
          New Certificate
        </Button>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search certificates..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Certificates List */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-pulse-subtle">Loading certificates...</div>
        </div>
      ) : filteredCertificates.length === 0 ? (
        <Card className="text-center p-6">
          <CardContent className="py-10">
            <Award className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">
              {searchTerm || statusFilter !== 'all' 
                ? 'No certificates match your search' 
                : 'No certificates yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try a different search term or filter' 
                : 'Start by creating your first certificate'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button
                onClick={() => navigate('/certificates/create')}
                className="bg-cert-gradient hover:shadow-neon-hover"
              >
                <FilePlus className="mr-2 h-4 w-4" />
                Create Certificate
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((cert) => (
            <Card 
              key={cert.id} 
              className="overflow-hidden hover:shadow-neon hover:scale-[1.01] transition-all cursor-pointer"
              onClick={() => navigate(`/certificates/${cert.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold">{cert.title}</CardTitle>
                  <div className="flex items-center">
                    {getStatusIcon(cert.verification_status)}
                  </div>
                </div>
                <div className="text-muted-foreground text-sm">{cert.institution_name}</div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-2">
                  <div className="flex items-center">
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
                  <span className="text-muted-foreground">ID: {cert.id.slice(0, 10)}...</span>
                  {cert.nft_mint_address && (
                    <span className="text-certify-purple">
                      Minted ✓
                    </span>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;
