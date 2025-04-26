
import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export function NotificationBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Alert
      variant="destructive"
      className="relative border-none rounded-none"
    >
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Development Version</AlertTitle>
      <AlertDescription>
        This is v0.0.1 demo version. Features might be unstable or incomplete.
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 hover:bg-destructive/10"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
}
