require('dotenv').config();
const { supabase } = require('../config/supabase');

const testConnection = async () => {
  try {
    // Test the connection
    const { data, error } = await supabase.from('users').select('count');
    if (error) throw error;
    console.log('Database connection successful!');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
};

const insertSampleData = async () => {
  try {
    // Insert sample users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .insert([
        {
          email: 'john@example.com',
          native_language: 'English',
          learning_level: 'Beginner'
        },
        {
          email: 'maria@example.com',
          native_language: 'Spanish',
          learning_level: 'Intermediate'
        }
      ])
      .select();

    if (usersError) throw usersError;
    console.log('Sample users created:', users);

    // Insert sample phrase packs
    const { data: packs, error: packsError } = await supabase
      .from('phrasepacks')
      .insert([
        {
          pack_name: 'Basic Greetings',
          description: 'Essential Romanian greetings for beginners',
          target_level: 'Beginner',
          category: 'Greetings'
        },
        {
          pack_name: 'Restaurant Phrases',
          description: 'Useful phrases for dining out in Romania',
          target_level: 'Intermediate',
          category: 'Food & Dining'
        }
      ])
      .select();

    if (packsError) throw packsError;
    console.log('Sample packs created:', packs);

    // Insert sample phrases
    const { data: phrases, error: phrasesError } = await supabase
      .from('phrasecards')
      .insert([
        {
          pack_id: packs[0].id,
          romanian_phrase: 'Bună ziua',
          english_translation: 'Good day',
          category: 'Greetings',
          difficulty_level: 'Beginner'
        },
        {
          pack_id: packs[0].id,
          romanian_phrase: 'La revedere',
          english_translation: 'Goodbye',
          category: 'Greetings',
          difficulty_level: 'Beginner'
        },
        {
          pack_id: packs[1].id,
          romanian_phrase: 'O masă pentru două persoane, vă rog',
          english_translation: 'A table for two, please',
          category: 'Food & Dining',
          difficulty_level: 'Intermediate'
        },
        {
          pack_id: packs[1].id,
          romanian_phrase: 'Pot să văd meniul?',
          english_translation: 'Can I see the menu?',
          category: 'Food & Dining',
          difficulty_level: 'Intermediate'
        }
      ])
      .select();

    if (phrasesError) throw phrasesError;
    console.log('Sample phrases created:', phrases);

    // Insert sample user progress
    const { data: progress, error: progressError } = await supabase
      .from('userprogress')
      .insert([
        {
          user_id: users[0].id,
          card_id: phrases[0].id,
          mastery_level: 2,
          review_count: 3,
          last_reviewed: new Date().toISOString()
        },
        {
          user_id: users[0].id,
          card_id: phrases[1].id,
          mastery_level: 1,
          review_count: 1,
          last_reviewed: new Date().toISOString()
        }
      ])
      .select();

    if (progressError) throw progressError;
    console.log('Sample user progress created:', progress);

    // Insert sample daily challenges
    const { data: challenges, error: challengesError } = await supabase
      .from('dailychallenges')
      .insert([
        {
          user_id: users[0].id,
          card_id: phrases[2].id,
          assigned_date: new Date().toISOString().split('T')[0],
          completed: false
        },
        {
          user_id: users[1].id,
          card_id: phrases[3].id,
          assigned_date: new Date().toISOString().split('T')[0],
          completed: true
        }
      ])
      .select();

    if (challengesError) throw challengesError;
    console.log('Sample daily challenges created:', challenges);

    return { users, packs, phrases, progress, challenges };
  } catch (error) {
    console.error('Error inserting sample data:', error.message);
    throw error;
  }
};

// Run the tests
const runTests = async () => {
  try {
    console.log('Testing database connection...');
    const connected = await testConnection();
    if (connected) {
      console.log('Connection successful! Inserting sample data...');
      await insertSampleData();
      console.log('All tests completed successfully!');
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
};

// Execute the tests
runTests();

// Export the functions
module.exports = {
  testConnection,
  insertSampleData
}; 