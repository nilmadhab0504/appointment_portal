import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import Doctor from "../../../models/Doctor";
import Admin from "../../../models/Admin";
import connectDB from "../../../lib/connectDB";

interface Credentials {
  email: string;
  password: string;
  role: string;
}

export const authOptions: any = {
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials: Credentials | undefined) {
        if (!credentials) {
          throw new Error("Missing credentials");
        }

        await connectDB();
        const { email, password, role } = credentials;

        if (!["doctor", "admin"].includes(role)) {
          throw new Error("Invalid role. Accepted values are 'doctor' or 'admin'.");
        }

        let user:any;
        if (role === "doctor") {
          user = await Doctor.findOne({ email });
        } else if (role === "admin") {
          user = await Admin.findOne({ email });
        }

        if (!user) {
          throw new Error(`${role.charAt(0).toUpperCase() + role.slice(1)} not found with the provided email.`);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return { id: user._id.toString(), email: user.email, name: user.name, role };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
     if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        role: token.role,
      };
      return session;
    },
  },

  pages: {
    signIn: "/login", 
    error: "/login?error=true", 
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET || "default_secret_key",
};
