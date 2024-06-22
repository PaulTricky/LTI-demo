import { NextAuthProvider } from "@/components/NextAuthProvider";
import Todo from "../components/todo";

export default function Home() {
  return (
    <NextAuthProvider>
      <Todo />
    </NextAuthProvider>
  )
}
