/**
 * Script to test profile update functionality
 * This helps identify the exact error when updating profiles
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testProfileUpdate() {
  console.log('🧪 Testing profile update functionality...\n');

  try {
    // Get the first profile to test with
    const { data: profiles, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email, full_name, username')
      .limit(1);

    if (fetchError) {
      console.error('❌ Error fetching profile:', fetchError);
      return;
    }

    if (!profiles || profiles.length === 0) {
      console.error('❌ No profiles found in database');
      return;
    }

    const profile = profiles[0];
    console.log('📋 Test profile:');
    console.log(`   ID: ${profile.id}`);
    console.log(`   Email: ${profile.email}`);
    console.log(`   Full Name: ${profile.full_name}`);
    console.log(`   Username: ${profile.username}`);
    console.log();

    // Test 1: Update using service role (should always work)
    console.log('Test 1: Update with service role key...');
    const testUsername = `test_${Date.now()}`;
    const { data: updateData1, error: updateError1 } = await supabase
      .from('profiles')
      .update({
        full_name: 'Test User',
        username: testUsername,
        updated_at: new Date().toISOString()
      })
      .eq('id', profile.id)
      .select();

    if (updateError1) {
      console.error('❌ Service role update failed:', updateError1);
      console.log('   Code:', updateError1.code);
      console.log('   Message:', updateError1.message);
      console.log('   Details:', updateError1.details);
      console.log('   Hint:', updateError1.hint);
    } else {
      console.log('✅ Service role update succeeded!');
      console.log('   Updated data:', updateData1);

      // Revert the change
      console.log('\n🔄 Reverting changes...');
      await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          username: profile.username,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);
      console.log('✅ Changes reverted');
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n📋 Summary:');
    if (!updateError1) {
      console.log('✅ Profile updates are working with service role key');
      console.log('\nThe issue is likely with:');
      console.log('1. RLS policy blocking regular authenticated users');
      console.log('2. The client not sending proper authentication');
      console.log('3. Session token expired or invalid\n');
      console.log('Next steps:');
      console.log('1. Apply the RLS fix migration (see PROFILE_UPDATE_FIX.md)');
      console.log('2. Check browser console for authentication errors');
      console.log('3. Try logging out and logging back in');
    } else {
      console.log('❌ Profile updates are failing even with service role');
      console.log('This indicates a database-level issue');
      console.log('\nPossible causes:');
      console.log('1. Missing username column');
      console.log('2. Constraint violations');
      console.log('3. Database permissions issue');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Check RLS policies
async function checkRLSPolicies() {
  console.log('\n🔍 Checking RLS policies...\n');

  try {
    const { data, error } = await supabase
      .rpc('exec_sql', {
        sql_string: `
          SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
          FROM pg_policies
          WHERE tablename = 'profiles'
          ORDER BY policyname;
        `
      });

    if (error) {
      console.log('⚠️  Cannot query RLS policies directly');
      console.log('   You can check them in Supabase Dashboard → Database → Tables → profiles → Policies');
    } else if (data) {
      console.log('📊 RLS Policies on profiles table:');
      console.log(data);
    }
  } catch (err) {
    console.log('⚠️  Cannot query RLS policies:', err.message);
  }
}

// Run tests
testProfileUpdate().then(() => checkRLSPolicies());
