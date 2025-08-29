import { supabase } from '../config/database.js';
import bcrypt from 'bcryptjs';

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create admin users
    const adminPassword = await bcrypt.hash('admin123', 12);
    const managerPassword = await bcrypt.hash('manager123', 12);
    const customerPassword = await bcrypt.hash('password123', 12);

    const { error: usersError } = await supabase
      .from('users')
      .upsert([
        {
          email: 'admin@himalayankitchen.de',
          password_hash: adminPassword,
          full_name: 'Admin User',
          phone: '+49 89 1234 5678',
          role: 'admin'
        },
        {
          email: 'manager@himalayankitchen.de',
          password_hash: managerPassword,
          full_name: 'Manager User',
          phone: '+49 89 1234 5679',
          role: 'manager'
        },
        {
          email: 'customer@example.com',
          password_hash: customerPassword,
          full_name: 'John Doe',
          phone: '+49 89 1234 5680',
          role: 'customer'
        }
      ], { onConflict: 'email' });

    if (usersError) throw usersError;

    // Create categories
    const { error: categoriesError } = await supabase
      .from('categories')
      .upsert([
        {
          name: 'Appetizers',
          description: 'Start your meal with traditional Nepalese appetizers',
          display_order: 1,
          is_active: true
        },
        {
          name: 'Main Courses',
          description: 'Hearty traditional dishes from the Himalayas',
          display_order: 2,
          is_active: true
        },
        {
          name: 'Momos',
          description: 'Traditional Nepalese dumplings',
          display_order: 3,
          is_active: true
        },
        {
          name: 'Beverages',
          description: 'Traditional teas and refreshing drinks',
          display_order: 4,
          is_active: true
        },
        {
          name: 'Desserts',
          description: 'Sweet endings to your meal',
          display_order: 5,
          is_active: true
        }
      ], { onConflict: 'name' });

    if (categoriesError) throw categoriesError;

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();