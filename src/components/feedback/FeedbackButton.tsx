
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import FeedbackForm from './FeedbackForm';
import { useIsMobile } from '@/hooks/use-mobile';

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-certify-purple hover:bg-certify-purple/90 group"
          >
            <MessageCircle className="mr-2 animate-pulse group-hover:animate-none" />
            <span className={isMobile ? "hidden" : "inline"}>Send Feedback</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-full sm:max-w-md focus:outline-none"
        >
          <SheetHeader>
            <SheetTitle>Send Feedback</SheetTitle>
          </SheetHeader>
          <FeedbackForm onClose={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
