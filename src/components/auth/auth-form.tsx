'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  AuthError,
  updateProfile,
} from 'firebase/auth';
import { getDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Bot } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { GoogleIcon } from './google-icon';
import { cn } from '@/lib/utils';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

type AuthMode = 'login' | 'signup';

const content = {
  login: {
    title: 'Intelligent Resume Analyzer',
    description: 'Welcome back! Please sign in to continue.',
    icon: Bot,
  },
  signup: {
    title: 'Intelligent Resume Analyzer',
    description: 'Create an account to get started.',
    icon: Bot,
  },
};


export function AuthForm({ mode }: { mode: AuthMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const { title, description, icon: Icon } = content[mode];


  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleAuthError = (err: AuthError) => {
    console.error(err);
    let message = 'An unknown error occurred.';
    switch (err.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        message = 'Invalid email or password.';
        break;
      case 'auth/email-already-in-use':
        message = 'An account with this email already exists.';
        break;
      case 'auth/weak-password':
        message = 'Password should be at least 6 characters.';
        break;
      case 'auth/invalid-email':
         message = 'Please enter a valid email address.';
         break;
      case 'auth/popup-blocked':
        message = 'Authentication popup was blocked by your browser. Please allow popups for this site and try again.';
        break;
      case 'auth/popup-closed-by-user':
        message = 'The authentication window was closed. Please try again.';
        break;
      default:
        message = err.message;
    }
    setError(message);
    toast({
      title: 'Authentication Failed',
      description: message,
      variant: 'destructive',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;

        const displayName = `${firstName} ${lastName}`.trim();
        await updateProfile(user, { displayName });

        const userDocRef = doc(firestore, 'users', user.uid);
        
        const userData = {
          id: user.uid,
          email: user.email,
          firstName: firstName,
          lastName: lastName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        setDoc(userDocRef, userData).catch((error) => {
          console.error("Error creating user document:", error);
          const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'create',
            requestResourceData: userData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });
      }
      toast({
        title: mode === 'login' ? 'Signed In' : 'Account Created',
        description: "You've been successfully logged in.",
      });
      router.push('/');
    } catch (err) {
      handleAuthError(err as AuthError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const displayName = user.displayName?.split(' ') || [];
        const firstName = displayName[0] || '';
        const lastName = displayName.slice(1).join(' ') || '';

        const userData = {
          id: user.uid,
          email: user.email,
          firstName: firstName,
          lastName: lastName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        
        setDoc(userDocRef, userData).catch((error) => {
          console.error("Error creating user document on Google sign-in:", error);
          const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'create',
            requestResourceData: userData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });
      }

      toast({
        title: 'Signed In',
        description: "You've been successfully logged in with Google.",
      });
      router.push('/');
    } catch (err) {
      handleAuthError(err as AuthError);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isUserLoading || user) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <Card className="w-full max-w-md bg-card/50 backdrop-blur-2xl border-primary/20 shadow-2xl shadow-primary/10">
        <CardHeader className="text-center space-y-4">
            <Icon className="h-10 w-10 text-primary mx-auto" />
            <div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="space-y-2 flex-1">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                type="text"
                                placeholder="John"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="bg-background/50 border-border/50"
                            />
                        </div>
                        <div className="space-y-2 flex-1">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                type="text"
                                placeholder="Doe"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="bg-background/50 border-border/50"
                            />
                        </div>
                    </div>
                )}
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-background/50 border-border/50"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-background/50 border-border/50"
                        placeholder="••••••••"
                    />
                </div>
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {mode === 'login' ? 'Sign In' : 'Sign Up'}
                </Button>
            </form>
            <Separator className="my-6" />
            <Button variant="outline" onClick={handleGoogleSignIn} disabled={isLoading} className="w-full bg-transparent hover:bg-accent/50">
                <GoogleIcon />
                Sign in with Google
            </Button>
        </CardContent>
        <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <Button variant="link" asChild>
                <Link href={mode === 'login' ? '/signup' : '/login'} className={cn(isLoading && "pointer-events-none opacity-50")}>
                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                </Link>
            </Button>
            </p>
        </CardFooter>
    </Card>
  );
}
