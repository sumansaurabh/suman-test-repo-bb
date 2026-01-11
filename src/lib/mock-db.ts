// src/lib/mock-db.ts

// Simple in-memory store for demonstration purposes.
// In a real application, you would use a real database (Postgres, MongoDB, etc.).

// We'll simulate a user with ID 'user_123' having an initial balance.
// Note: In a serverless environment like Vercel, this in-memory object 
// might reset between requests if the lambda is recycled.
// For persistent storage, connect to a database.
const balances: Record<string, number> = {
  'user_123': 0,
};

export async function getUserBalance(userId: string): Promise<number> {
  // Simulate DB delay
  await new Promise(resolve => setTimeout(resolve, 50));
  return balances[userId] || 0;
}

export async function updateUserBalance(userId: string, amountToAdd: number): Promise<number> {
  await new Promise(resolve => setTimeout(resolve, 50));
  if (typeof balances[userId] === 'undefined') {
    balances[userId] = 0;
  }
  balances[userId] += amountToAdd;
  console.log(`[MockDB] User ${userId} balance updated. Added: ${amountToAdd}, New Balance: ${balances[userId]}`);
  return balances[userId];
}
