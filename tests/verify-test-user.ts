/**
 * Verify Test User - Bypass OTP
 * Run: npx ts-node tests/verify-test-user.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function verifyUser() {
  const email = 'abdularhamkhanzada@gmail.com';
  
  console.log(`🔧 Verifying user: ${email}\n`);

  try {
    // Get user by email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      throw listError;
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      console.error(`❌ User not found: ${email}`);
      process.exit(1);
    }

    console.log(`✓ Found user: ${user.id}`);
    console.log(`  Email confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);

    // Update user to confirm email
    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { 
        email_confirm: true,
        user_metadata: {
          ...user.user_metadata,
          email_verified: true
        }
      }
    );

    if (updateError) {
      throw updateError;
    }

    console.log(`\n✅ User verified successfully!`);
    console.log(`  User ID: ${updatedUser.user.id}`);
    console.log(`  Email: ${updatedUser.user.email}`);
    console.log(`  Confirmed: ${updatedUser.user.email_confirmed_at ? 'Yes' : 'No'}`);
    
    // Test login
    console.log(`\n🔐 Testing login...`);
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password: 'StrongPassword123!',
    });

    if (loginError) {
      console.error(`❌ Login failed:`, loginError.message);
    } else {
      console.log(`✅ Login successful!`);
      console.log(`  Token: ${loginData.session?.access_token?.substring(0, 30)}...`);
    }

    console.log(`\n✅ Test user is ready for tests!`);
    console.log(`\nTest Credentials:`);
    console.log(`  Email: ${email}`);
    console.log(`  Password: StrongPassword123!`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyUser();
