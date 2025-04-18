
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Calendar, 
  Building, 
  GraduationCap, 
  Save, 
  Loader2, 
  Check,
  X 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CertificateFormData } from '@/types';
import { createCertificate, uploadFile, convertImageToPdf, verifyCertificate } from '@/services/api';

const CertificateCreate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CertificateFormData>({
    title: '',
    institution_name: '',
    program_name: '',
    issue_date: new Date().toISOString().split('T')[0],
    certificate_file: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'converting' | 'success' | 'error'>('idle');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, certificate_file: file }));
      
      // Create preview URL
      const fileUrl = URL.createObjectURL(file);
      setFilePreview(fileUrl);
      
      // Clear file error if it exists
      if (errors.certificate_file) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.certificate_file;
          return newErrors;
        });
      }
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.institution_name.trim()) {
      newErrors.institution_name = 'Institution name is required';
    }
    
    if (!formData.program_name.trim()) {
      newErrors.program_name = 'Program name is required';
    }
    
    if (!formData.issue_date) {
      newErrors.issue_date = 'Issue date is required';
    }
    
    if (!formData.certificate_file) {
      newErrors.certificate_file = 'Certificate file is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 200);
    
    return () => clearInterval(interval);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // 1. Process the file (convert to PDF if needed)
      setUploadState('converting');
      simulateProgress();
      
      let pdfFile = formData.certificate_file;
      if (pdfFile && !pdfFile.type.includes('pdf')) {
        pdfFile = await convertImageToPdf(pdfFile);
      }
      
      // 2. Upload the PDF file
      setUploadState('uploading');
      setUploadProgress(50);
      
      let certificateUrl = '';
      if (pdfFile) {
        certificateUrl = await uploadFile(pdfFile, 'certificate');
      }
      
      // 3. Create the certificate record
      setUploadProgress(75);
      
      const newCertificate = await createCertificate(user.id, {
        title: formData.title,
        institution_name: formData.institution_name,
        program_name: formData.program_name,
        issue_date: formData.issue_date,
        verification_url: `${window.location.origin}/verify/${user.id}`,
        certificate_url: certificateUrl,
      });
      
      // 4. Start the verification process
      setUploadProgress(90);
      await verifyCertificate(user.id, newCertificate.id);
      
      // 5. Complete and navigate to the new certificate
      setUploadProgress(100);
      setUploadState('success');
      
      toast({
        title: "Certificate Created",
        description: "Your certificate has been successfully created and verification has started",
      });
      
      // Pause briefly to show success state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate(`/certificates/${newCertificate.id}`);
      
    } catch (error) {
      console.error('Failed to create certificate:', error);
      setUploadState('error');
      toast({
        title: "Certificate Creation Failed",
        description: "Failed to create certificate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getUploadStateIcon = () => {
    switch (uploadState) {
      case 'converting':
        return <FileText className="animate-pulse" />;
      case 'uploading':
        return <Upload className="animate-pulse" />;
      case 'success':
        return <Check className="text-green-500" />;
      case 'error':
        return <X className="text-red-500" />;
      default:
        return <Upload />;
    }
  };
  
  const getUploadStateText = () => {
    switch (uploadState) {
      case 'converting':
        return 'Converting file...';
      case 'uploading':
        return 'Uploading certificate...';
      case 'success':
        return 'Upload successful!';
      case 'error':
        return 'Upload failed';
      default:
        return 'Drag & drop or click to upload';
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate('/certificates')} size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Create Certificate</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Form */}
        <Card className="md:col-span-3">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Certificate Details</CardTitle>
              <CardDescription>
                Enter the information for your new certificate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Certificate Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Blockchain Developer Certification"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="institution_name" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Institution Name
                </Label>
                <Input
                  id="institution_name"
                  name="institution_name"
                  placeholder="e.g. Solana Academy"
                  value={formData.institution_name}
                  onChange={handleInputChange}
                  className={errors.institution_name ? 'border-red-500' : ''}
                />
                {errors.institution_name && (
                  <p className="text-sm text-red-500">{errors.institution_name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="program_name" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Program Name
                </Label>
                <Input
                  id="program_name"
                  name="program_name"
                  placeholder="e.g. Web3 Development"
                  value={formData.program_name}
                  onChange={handleInputChange}
                  className={errors.program_name ? 'border-red-500' : ''}
                />
                {errors.program_name && (
                  <p className="text-sm text-red-500">{errors.program_name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="issue_date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Issue Date
                </Label>
                <Input
                  id="issue_date"
                  name="issue_date"
                  type="date"
                  value={formData.issue_date}
                  onChange={handleInputChange}
                  className={errors.issue_date ? 'border-red-500' : ''}
                />
                {errors.issue_date && (
                  <p className="text-sm text-red-500">{errors.issue_date}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/certificates')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-cert-gradient hover:shadow-neon-hover"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Certificate
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        {/* File Upload */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Certificate File</CardTitle>
            <CardDescription>
              Upload your certificate (PDF or image)
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div 
              className={`border-2 border-dashed rounded-lg w-full min-h-[200px] flex flex-col items-center justify-center p-6 transition-all cursor-pointer ${filePreview ? 'border-certify-purple' : 'border-border hover:border-primary'} ${errors.certificate_file ? 'border-red-500' : ''}`}
              onClick={() => document.getElementById('certificate_file')?.click()}
            >
              {filePreview ? (
                <div className="w-full">
                  <div className="mb-4 text-center font-medium">File Selected</div>
                  <img 
                    src={filePreview} 
                    alt="Certificate preview" 
                    className="max-h-[150px] max-w-full mx-auto object-contain"
                  />
                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    {formData.certificate_file?.name}
                    <br />
                    ({Math.round((formData.certificate_file?.size || 0) / 1024)} KB)
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-certify-purple/10 flex items-center justify-center mx-auto mb-4">
                    {getUploadStateIcon()}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {getUploadStateText()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Support PDF, JPG, PNG and other image formats
                  </p>
                </div>
              )}
              
              <input
                id="certificate_file"
                name="certificate_file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            
            {errors.certificate_file && (
              <p className="text-sm text-red-500 mt-2">{errors.certificate_file}</p>
            )}
            
            {isSubmitting && (
              <div className="w-full mt-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>{uploadState !== 'error' ? `${uploadProgress}%` : 'Error'}</span>
                  <span>{uploadState}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${uploadState === 'error' ? 'bg-red-500' : uploadState === 'success' ? 'bg-green-500' : 'bg-cert-gradient'}`}
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col border-t pt-6">
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <strong>Note:</strong> Image files will be automatically converted to PDF format.
              </p>
              <p>
                All certificates must be verified before they can be minted as NFTs.
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CertificateCreate;
