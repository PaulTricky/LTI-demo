import { TaskController } from '@/components/TaskController';
import { Task } from '@/models/task';
import { remultNextApp } from 'remult/remult-next';
import { createPostgresDataProvider } from 'remult/postgres';
import { getUserOnServer } from '@/app/lib/nextAuth';

const DATABASE_URL = process.env['DATABASE_URL'];

const api = remultNextApp({
  entities: [Task],
  controllers: [TaskController],
  dataProvider: createPostgresDataProvider({ connectionString: DATABASE_URL }),
  getUser: getUserOnServer,
});

export const { GET, PUT, DELETE, POST } = api;
