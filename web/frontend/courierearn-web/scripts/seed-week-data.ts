import { createClient } from '@supabase/supabase-js' 
import * as dotenv from 'dotenv' 
import path from 'path' 

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') }) 

const supabase = createClient( 
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! 
) 

async function getUserId(email: string) { 
  const { data: user, error } = await supabase 
    .from('users') 
    .select('id') 
    .eq('email', email) 
    .single() 
  
  if (error || !user) { 
    console.error('User not found. Please login first.') 
    return null 
  } 
  return user.id 
} 

function randomInt(min: number, max: number) { 
  return Math.floor(Math.random() * (max - min + 1)) + min 
} 

async function seedWeekData() { 
  const email = 'ppatheroyalexpress@gmail.com' 
  const userId = await getUserId(email) 
  if (!userId) return 

  const today = new Date() 
  const oneWeekAgo = new Date(today) 
  oneWeekAgo.setDate(today.getDate() - 7) 

  // Generate 5-8 transactions per day for the past week 
  for (let i = 0; i < 7; i++) { 
    const date = new Date(oneWeekAgo) 
    date.setDate(oneWeekAgo.getDate() + i) 
    const dateStr = date.toISOString().split('T')[0] 
    
    // Number of transactions for this day (3-8) 
    const numTransactions = randomInt(3, 8) 
    
    for (let j = 0; j < numTransactions; j++) { 
      // Random time within the day 
      const txDate = new Date(date) 
      txDate.setHours(randomInt(8, 20), randomInt(0, 59), 0, 0) 
      
      // Random transaction type 
      const type = randomInt(1, 4) 
      let cashCollect = 0 
      let notCashCollect = 0 
      let ec = 0 
      let amount = 0 
      
      switch(type) { 
        case 1: // Cash Collect 
          cashCollect = randomInt(1, 5) 
          amount = cashCollect * 200 
          break 
        case 2: // Not Cash Collect 
          notCashCollect = randomInt(1, 3) 
          amount = notCashCollect * 100 
          break 
        case 3: // Mixed 
          cashCollect = randomInt(1, 3) 
          notCashCollect = randomInt(1, 2) 
          amount = (cashCollect * 200) + (notCashCollect * 100) 
          break 
        case 4: // EC 
          ec = randomInt(1, 2) 
          amount = ec * 600 
          break 
      } 
      
      // Insert transaction 
      const { error } = await supabase 
        .from('transactions') 
        .insert({ 
          user_id: userId, 
          created_at: txDate.toISOString(), 
          pickup_location: 'daily-delivery', 
          dropoff_location: dateStr, 
          // cash_collect: cashCollect, 
          // not_cash_collect: notCashCollect, 
          // ec: ec, 
          amount: amount 
        }) 
      
      if (error) { 
        console.error(`Error inserting transaction for ${dateStr}:`, error) 
      } 
    } 
    
    // Add 2-5 pickup records per day 
    const numPickups = randomInt(2, 5) 
    for (let k = 0; k < numPickups; k++) { 
      const pickupDate = new Date(date) 
      pickupDate.setHours(randomInt(9, 18), randomInt(0, 59), 0, 0) 
      
      const houses = randomInt(1, 4) 
      const parcels = randomInt(2, 8) 
      
      const { error } = await supabase 
        .from('pickups') 
        .insert({ 
          user_id: userId, 
          created_at: pickupDate.toISOString(), 
          location: 'daily-pickup', 
          scheduled_at: pickupDate.toISOString(), 
          notes: `houses=${houses};parcels=${parcels}` 
        }) 
      
      if (error) { 
        console.error(`Error inserting pickup for ${dateStr}:`, error) 
      } 
    } 
  } 
  
  console.log('✅ One week of test data inserted successfully!') 
} 

seedWeekData().catch(console.error)
