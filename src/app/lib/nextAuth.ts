import { NextAuthOptions, getServerSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const validUsers = [
  { id: '1', name: 'Joe', roles: ['admin'] },
  { id: '2', name: 'Paul' },
];

export const findValidUser = (name?: string | null) =>
  validUsers?.find((u) => u.name === name);

export const getUserOnServer = async () => {
  const u = await getServerSession();
  return findValidUser(u?.user?.name);
};

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      credentials: {
        name: {
          placeholder: 'Sign in',
        },
      },
      authorize: (credentials) => findValidUser(credentials?.name) || null,
    }),
  ],
  callbacks: {
    session: ({ session }) => {
      return {
        ...session,
        user: { ...findValidUser(session.user?.name) },
      };
    },
  },
};
