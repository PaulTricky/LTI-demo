import { TaskController } from '@/components/TaskController';
import { Task } from '@/models/task';
import { remultNextApp } from 'remult/remult-next';
import { createPostgresDataProvider } from 'remult/postgres';
import { getUserOnServer } from '@/app/lib/nextAuth';
import { Question } from '@/models/question';
import { Section } from '@/models/section';
import { Resource } from '@/models/resource';
import { ResourceController } from '@/app/lti/launch/controller/resourceController';

const DATABASE_URL = process.env['DATABASE_URL'];

export const api = remultNextApp({
  entities: [Resource, Question, Section],
  controllers: [ResourceController],
  dataProvider: createPostgresDataProvider({ connectionString: DATABASE_URL }),
  getUser: getUserOnServer,
  admin: true,
});

export const { GET, PUT, DELETE, POST } = api;
