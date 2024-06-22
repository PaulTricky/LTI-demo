import NextAuth, { getServerSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { UserInfo } from 'remult';

const handler = NextAuth({
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
});

const validUsers: UserInfo[] = [
  { id: '1', name: 'Joe', roles: ['admin'] },
  { id: '2', name: 'Paul' },
];

const findValidUser = (name?: string | null) =>
  validUsers?.find((u) => u.name === name);

export const getUserOnServer = async () => {
  const u = await getServerSession();
  return findValidUser(u?.user?.name);
};

export { handler as GET, handler as POST };
