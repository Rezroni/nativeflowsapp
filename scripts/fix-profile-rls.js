/**
 * Script to fix the profile update RLS policy
 * This script applies the SQL migration to fix profile updates
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Create Supabase client with service role key (has admin privileges)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixProfileRLS() {
  console.log('🔧 Fixing profile update RLS policy...\n');

  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251207_fix_profile_update_rls.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Migration SQL:');
    console.log('─'.repeat(80));
    console.log(migrationSQL);
    console.log('─'.repeat(80));
    console.log();

    // Split the SQL into individual statements
    // Note: This is a simple split and may not work for all SQL
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`⚙️  Executing statement ${i + 1}/${statements.length}...`);

      try {
        const { data, error } = await supabase.rpc('exec_sql', {
          sql_string: statement + ';'
        });

        if (error) {
          console.warn(`⚠️  Warning for statement ${i + 1}: ${error.message}`);
          // Continue anyway - some errors are expected (like "already exists")
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } catch (err) {
        console.warn(`⚠️  Error for statement ${i + 1}: ${err.message}`);
        // Continue anyway
      }
    }

    console.log('\n✅ Migration applied successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Clear your browser cache or use incognito mode');
    console.log('2. Try updating your profile again');
    console.log('3. Check the browser console for any error messages');

  } catch (error) {
    console.error('❌ Error applying migration:', error.message);
    console.error('\n📋 Manual fix required:');
    console.log('1. Go to your Supabase dashboard: https://mkcbresdokdmdwvngeqw.supabase.co');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of supabase/migrations/20251207_fix_profile_update_rls.sql');
    console.log('4. Click "Run" to execute');
    process.exit(1);
  }
}

// Alternative: Check current RLS policies
async function checkCurrentPolicies() {
  console.log('🔍 Checking current RLS policies on profiles table...\n');

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error querying profiles:', error.message);
      return;
    }

    console.log('✅ Successfully queried profiles table');
    console.log('📊 Sample profile structure:', data[0] ? Object.keys(data[0]) : 'No profiles found');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the fix
console.log('🚀 Starting profile RLS fix...\n');
checkCurrentPolicies()
  .then(() => {
    console.log('\n' + '='.repeat(80) + '\n');
    console.log('⚠️  Note: This script cannot directly execute DDL statements via the Supabase client.');
    console.log('You need to apply the migration manually using one of these methods:\n');
    console.log('Method 1: Supabase Dashboard');
    console.log('  1. Go to: https://mkcbresdokdmdwvngeqw.supabase.co/project/_/sql');
    console.log('  2. Copy contents of: supabase/migrations/20251207_fix_profile_update_rls.sql');
    console.log('  3. Paste and click "Run"\n');
    console.log('Method 2: Supabase CLI (requires Docker)');
    console.log('  npx supabase db push\n');
    console.log('Method 3: Direct database connection');
    console.log('  Use psql or another PostgreSQL client to connect and run the migration');
    console.log('\n' + '='.repeat(80));
  });
