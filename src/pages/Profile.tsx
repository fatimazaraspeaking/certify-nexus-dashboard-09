
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { User, Mail, Upload, Save, Wallet, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { fetchUserProfile, updateUserProfile, uploadFile } from '@/services/api';
import { ProfileFormData } from '@/types';

const Profile = () => {
  const { user, updateUserProfile: updateAuthUser } = useAuth();
  const { wallet } = useWallet();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    email: '',
    profile_image: null,
  });
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!wallet) return;
      
      try {
        setIsLoading(true);
        
        // Fetch user profile from API
        const userProfile = await fetchUserProfile(wallet);
        
        // Update form data
        setFormData({
          full_name: userProfile.full_name,
          email: userProfile.email || '',
          profile_image: null,
        });
        
        // Set profile image preview if available
        if (userProfile.profile_image_url) {
          setProfileImagePreview(userProfile.profile_image_url);
        }
        
      } catch (error) {
        console.error('Failed to load user profile:', error);
        toast({
          title: "Error",
          description: "Failed to load your profile information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserProfile();
  }, [wallet]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Set the file to form data
      setFormData(prev => ({ ...prev, profile_image: file }));
      
      // Create a preview URL
      const imageUrl = URL.createObjectURL(file);
      setProfileImagePreview(imageUrl);
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Upload profile image if a new one was selected
      let profileImageUrl = user.profile_image_url;
      if (formData.profile_image) {
        profileImageUrl = await uploadFile(formData.profile_image, 'profile');
      }
      
      // Update user profile
      const updatedUser = await updateUserProfile({
        id: user.id,
        full_name: formData.full_name,
        email: formData.email,
        profile_image_url: profileImageUrl,
        wallet_address: user.wallet_address,
        created_at: user.created_at,
        updated_at: new Date().toISOString(),
      });
      
      // Update the user in the auth context
      updateAuthUser(updatedUser);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      });
      
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update your profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold mb-1">Your Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and wallet</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <Card className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      placeholder="Enter your full name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className={errors.full_name ? 'border-red-500' : ''}
                    />
                    {errors.full_name && (
                      <p className="text-sm text-red-500">{errors.full_name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address (Optional)
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      Wallet Address
                    </Label>
                    <div className="flex items-center">
                      <Input
                        value={wallet || ''}
                        readOnly
                        className="bg-muted font-mono text-sm"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This is your connected Solana wallet address
                    </p>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-end">
              <Button 
                type="submit" 
                className="bg-cert-gradient hover:shadow-neon-hover"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        {/* Profile Photo */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
            <CardDescription>
              Upload or update your profile picture
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="mb-6">
              <Avatar className="w-32 h-32">
                <AvatarImage src={profileImagePreview || ''} alt={user?.full_name || 'User'} />
                <AvatarFallback className="text-2xl bg-certify-purple text-white">
                  {user ? getInitials(user.full_name) : 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div 
              className="border-2 border-dashed border-border hover:border-primary rounded-lg w-full p-8 flex flex-col items-center justify-center transition-all cursor-pointer"
              onClick={() => document.getElementById('profile_image')?.click()}
            >
              <div className="w-12 h-12 rounded-full bg-certify-purple/10 flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-certify-purple" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                Click to upload a new photo
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, or GIF. Max size 2MB.
              </p>
              
              <input
                id="profile_image"
                name="profile_image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <div className="text-sm text-muted-foreground">
              Your profile photo will be visible to others when you share your certificates.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
