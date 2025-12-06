/**
 * Create Test User Script
 * 
 * Run this script to create the test user in your database:
 * npx ts-node tests/create-test-user.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTestUser() {
  console.log('🔧 Creating test user...\n');

  const testUser = {
    email: 'abdularhamkhan02@gmail.com',
    password: 'StrongPassword!',
    email_confirm: true,
  };

  try {
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testUser.email,
      password: testUser.password,
      email_confirm: testUser.email_confirm,
      user_metadata: {
        username: 'testuser_arham',
        firstName: 'Arham',
        lastName: 'Khan',
      }
    });

    if (authError) {
      if (authError.message.includes('already exists')) {
        console.log('✓ Test user already exists in Supabase Auth');
      } else {
        throw authError;
      }
    } else {
      console.log('✓ Test user created in Supabase Auth');
      console.log(`  User ID: ${authData.user?.id}`);
    }

    // Try to login to verify
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.password,
    });

    if (loginError) {
      console.error('❌ Could not verify login:', loginError.message);
    } else {
      console.log('\n✓ Test user can login successfully');
      console.log(`  Access Token: ${loginData.session?.access_token?.substring(0, 20)}...`);
    }

    console.log('\n✅ Test user setup complete!');
    console.log('\nTest Credentials:');
    console.log(`  Email: ${testUser.email}`);
    console.log(`  Password: ${testUser.password}`);
    console.log('\nYou can now run: npm test');

  } catch (error) {
    console.error('❌ Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();
