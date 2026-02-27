'use client';

import { useState } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, X, Copy } from 'lucide-react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Badge } from '../ui/badge';

const MAX_GUESTS = 5;

export function GuestAccessCard() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData, isLoading: isUserDocLoading } = useDoc(userDocRef);

  const guests = userData?.guests || [];

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDocRef || !newGuestEmail || guests.length >= MAX_GUESTS) return;

    setIsSubmitting(true);
    try {
      await updateDoc(userDocRef, {
        guests: arrayUnion(newGuestEmail)
      });
      toast({ title: 'Guest Added', description: `${newGuestEmail} can now view your dashboard.` });
      setNewGuestEmail('');
    } catch (error) {
      console.error("Error adding guest:", error);
      toast({ title: 'Error', description: 'Could not add guest.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveGuest = async (emailToRemove: string) => {
    if (!userDocRef) return;
    try {
      await updateDoc(userDocRef, {
        guests: arrayRemove(emailToRemove)
      });
      toast({ title: 'Guest Removed', description: `${emailToRemove} no longer has access.` });
    } catch (error) {
      console.error("Error removing guest:", error);
      toast({ title: 'Error', description: 'Could not remove guest.', variant: 'destructive' });
    }
  };

  const handleCopyLink = () => {
    if (!user) return;
    const shareableLink = `${window.location.origin}/guest/${user.uid}`;
    navigator.clipboard.writeText(shareableLink);
    toast({ title: 'Link Copied!', description: 'You can now share this link with your guests.' });
  }

  return (
    <Card className="bg-black/20 border-primary/20 backdrop-blur-xl shadow-2xl shadow-primary/20 flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <UserPlus size={22} /> Guest Access
        </CardTitle>
        <CardDescription>
          Grant read-only access to your dashboard for up to {MAX_GUESTS} guests.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
           <Label className="text-sm font-medium">Shareable Link</Label>
           <div className="flex items-center gap-2 mt-2">
            <Input 
                readOnly 
                value={user ? `${window.location.origin}/guest/${user.uid}` : 'Loading...'} 
                className="bg-black/20 border-border/50 text-muted-foreground"
            />
            <Button variant="ghost" size="icon" onClick={handleCopyLink}><Copy size={16} /></Button>
           </div>
        </div>
        <form onSubmit={handleAddGuest} className="space-y-2">
          <Label htmlFor="guest-email">Add Guest Email</Label>
          <div className="flex items-center gap-2">
            <Input
              id="guest-email"
              type="email"
              placeholder="guest@example.com"
              value={newGuestEmail}
              onChange={(e) => setNewGuestEmail(e.target.value)}
              disabled={guests.length >= MAX_GUESTS || isSubmitting}
              className="bg-black/20 border-border/50"
            />
            <Button type="submit" size="icon" disabled={guests.length >= MAX_GUESTS || isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : <UserPlus />}
            </Button>
          </div>
          {guests.length >= MAX_GUESTS && <p className="text-xs text-amber-500">You have reached the maximum of {MAX_GUESTS} guests.</p>}
        </form>

        <div className='space-y-2'>
            <Label>Current Guests ({guests.length}/{MAX_GUESTS})</Label>
            {isUserDocLoading ? <Loader2 className='animate-spin' /> : guests.length > 0 ? (
                <div className="space-y-2">
                    {guests.map((email: string) => (
                        <div key={email} className="flex items-center justify-between p-2 rounded-md bg-black/20">
                            <span className="text-sm text-muted-foreground truncate">{email}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveGuest(email)}>
                                <X size={14} />
                            </Button>
                        </div>
                    ))}
                </div>
            ) : <p className="text-sm text-muted-foreground text-center py-2">No guests have been added.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
