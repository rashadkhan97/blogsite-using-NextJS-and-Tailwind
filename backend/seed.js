// ─────────────────────────────────────────────────────────────
// seed.js — Creates the initial admin user in the database
//
// Run once after setting up:
//   npm run seed
//
// Safe to run multiple times — findOrCreate() skips insertion
// if admin@test.com already exists.
//
// Login credentials after seeding:
//   Email:    admin@test.com
//   Password: admin123
//
// These are DEMO credentials for local use only. Change the password
// (Dashboard → Change Password) before deploying anywhere real.
// ─────────────────────────────────────────────────────────────

require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('./config/db');
const User = require('./models/User');

async function seed() {
  try {
    // Make sure the users table exists before inserting
    await sequelize.sync();

    // Hash the password before storing (even seed data should be hashed)
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // findOrCreate:
    //   - Finds a user where email = 'admin@test.com'
    //   - If found → do nothing, return [user, false]
    //   - If not found → create with 'defaults', return [user, true]
    const [user, created] = await User.findOrCreate({
      where: { email: 'admin@test.com' },
      defaults: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin',
      },
    });

    if (created) {
      console.log('Seed complete! Login: admin@test.com / admin123');
    } else if (user.role !== 'admin') {
      console.log('admin@test.com already exists but is NOT an admin. Skipped.');
    } else {
      console.log('Admin user already exists. Skipped.');
    }

    process.exit(0);

  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
