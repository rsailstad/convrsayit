require('dotenv').config();
const { supabase } = require('../config/supabase');

const activities = [
  { name: 'Going to the grocery store', category: 'Shopping' },
  { name: 'Getting a haircut', category: 'Services' },
  { name: 'Asking for directions', category: 'Travel' },
  { name: 'Ordering a coffee', category: 'Dining' },
  { name: 'Talking to the landlord', category: 'Housing' },
  { name: 'Calling a service company', category: 'Services' },
  { name: 'Riding the subway', category: 'Travel' },
  { name: 'Going to the mall', category: 'Shopping' },
  { name: 'Answering the phone', category: 'Communication' },
  { name: 'Greeting a person', category: 'Social' },
  { name: 'Checking into a hotel', category: 'Travel' },
  { name: 'Visiting a doctor', category: 'Health' },
  { name: 'Discussing work with a colleague', category: 'Work' },
  { name: 'Making a restaurant reservation', category: 'Dining' }
];

async function seedActivities() {
  const { data, error } = await supabase.from('activities').insert(activities).select();
  if (error) {
    console.error('Error seeding activities:', error.message);
    process.exit(1);
  }
  console.log('Seeded activities:', data);
  process.exit(0);
}

seedActivities(); 