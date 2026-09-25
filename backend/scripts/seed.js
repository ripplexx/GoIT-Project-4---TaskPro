import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { connectMongo } from '../src/db/connectMongo.js';
import { UsersCollection } from '../src/db/models/user.js';
import { BoardsCollection } from '../src/db/models/board.js';

const DEMO_EMAIL = 'demo@taskpro.com';
const DEMO_PASSWORD = 'Demo1234';

async function seed() {
  await connectMongo();

  let user = await UsersCollection.findOne({ email: DEMO_EMAIL });

  if (!user) {
    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
    user = await UsersCollection.create({
      name: 'Demo User',
      email: DEMO_EMAIL,
      password: hashedPassword,
    });
    console.log(`Created demo user: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  } else {
    console.log(`Demo user already exists: ${DEMO_EMAIL}`);
  }

  const existingBoard = await BoardsCollection.findOne({ owner: user._id });

  if (!existingBoard) {
    await BoardsCollection.create({
      owner: user._id,
      title: 'Project Office',
      icon: 'icon-project',
      background: '',
      columns: [
        {
          title: 'To Do',
          cards: [
            {
              title: 'Research competitor features',
              description: 'Analyze top 5 competitors and document key findings.',
              priority: 'low',
            },
            {
              title: 'Set up CI/CD pipeline',
              description: 'Configure automated build and deploy pipeline.',
              priority: 'medium',
            },
          ],
        },
        {
          title: 'In Progress',
          cards: [
            {
              title: 'Design and prototyping',
              description: 'Create visually appealing and functional design prototypes.',
              priority: 'high',
            },
          ],
        },
        {
          title: 'Done',
          cards: [
            {
              title: 'Folder structure',
              description: 'Organized src/ layout for team collaboration.',
              priority: 'without',
            },
          ],
        },
      ],
    });
    console.log('Created demo board: Project Office');
  } else {
    console.log('Demo board already exists, skipping.');
  }

  await mongoose.disconnect();
  console.log('Seed complete.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
