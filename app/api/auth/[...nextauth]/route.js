import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Hardcoded admin from environment variables
        const adminUser = process.env.ADMIN_USERNAME || "admin";
        const adminPass = process.env.ADMIN_PASSWORD || "password";

        if (credentials?.username === adminUser && credentials?.password === adminPass) {
          return { id: "1", name: "Admin", email: "admin@portfolio.local" }
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login',
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
