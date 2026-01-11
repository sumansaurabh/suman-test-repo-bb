'use client';

import { useState, useEffect, Suspense } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import getStripe from '@/lib/get-stripejs';
import CheckoutForm from '@/components/checkout-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function TopUpContent() {
  const [amount, setAmount] = useState<number>(10);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingSecret, setLoadingSecret] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const successAmount = searchParams.get('amount');

  useEffect(() => {
    fetch('/api/user/balance')
      .then(res => res.json())
      .then(data => setBalance(data.balance))
      .catch(err => console.error('Failed to fetch balance', err));
  }, [success]);

  if (success === 'true') {
     return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
           <Card className="w-full max-w-md">
             <CardHeader>
               <CardTitle className="text-green-600">Payment Successful!</CardTitle>
               <CardDescription>
                 Your account has been topped up with ${successAmount}.
               </CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="text-center">
                    <p className="text-gray-600">Current Balance</p>
                    <p className="text-3xl font-bold">${balance !== null ? balance.toFixed(2) : '...'}</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => window.location.href = '/top-up'} className="flex-1">Top Up Again</Button>
                    <Link href="/" className="flex-1">
                        <Button variant="outline" className="w-full">Go to Dashboard</Button>
                    </Link>
                </div>
             </CardContent>
           </Card>
        </div>
     )
  }

  const handleCreatePaymentIntent = async () => {
    if (amount <= 0) return;
    setLoadingSecret(true);
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        console.error('Failed to get client secret', data);
        alert('Failed to initialize payment: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    } finally {
        setLoadingSecret(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
              <CardTitle>Top Up Wallet</CardTitle>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Balance</p>
                <p className="font-bold">${balance !== null ? balance.toFixed(2) : '...'}</p>
              </div>
          </div>
          <CardDescription>Enter amount to add to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!clientSecret ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount ($)</label>
                <Input
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>
              <Button onClick={handleCreatePaymentIntent} disabled={loadingSecret || amount <= 0} className="w-full">
                {loadingSecret ? 'Initializing...' : 'Proceed to Payment'}
              </Button>
              <Link href="/">
                 <Button variant="ghost" className="w-full mt-2">Back to Dashboard</Button>
              </Link>
            </>
          ) : (
            <Elements stripe={getStripe()} options={{ clientSecret }}>
               <div className="mb-4 flex justify-between items-center">
                    <span className="font-semibold">Pay ${amount}</span>
                    <Button variant="ghost" size="sm" onClick={() => setClientSecret(null)}>Change</Button>
               </div>
               <CheckoutForm amount={amount} />
            </Elements>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function TopUpPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <TopUpContent />
        </Suspense>
    );
}
