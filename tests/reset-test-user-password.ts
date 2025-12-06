/**
 * Reset Test User Password
 * Run: npx ts-node tests/reset-test-user-password.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function resetPassword() {
  const email = 'abdularhamkhanzada@gmail.com';
  const newPassword = 'StrongPassword123!';
  
  console.log(`🔧 Resetting password for: ${email}\n`);

  try {
    // Get user
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

    // Reset password using admin API
    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (error) {
      throw error;
    }

    console.log(`\n✅ Password reset successfully!`);
    
    // Test login
    console.log(`\n🔐 Testing login with new password...`);
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password: newPassword,
    });

    if (loginError) {
      console.error(`❌ Login test failed:`, loginError.message);
      console.log(`\nTrying via backend API...`);
    } else {
      console.log(`✅ Supabase login successful!`);
      console.log(`  Token: ${loginData.session?.access_token?.substring(0, 30)}...`);
    }
    
    console.log(`\n✅ Password reset complete!`);
    console.log(`\nTest Credentials:`);
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${newPassword}`);
    console.log(`\nNow run: npm test`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetPassword();
