import axios from "axios";
import { headers } from "next/headers";
import { useSearchParams } from "next/navigation";

const Launch = async ({ searchParams }: any) => {

  const getToken = async () => {
    const ltik = searchParams?.ltik;
    console.log("ltik **", ltik, searchParams);
    try {
      const res = await axios(`${process.env.NEXTAUTH_URL}/api/idtoken`, {
        method: 'GET',
        headers: {
          'x_ltik': ltik
        }
      });
      return res.data.data
    } catch(e) {
      console.log("eeeee", e)
      return null;
    }
  }

  const token = await getToken();

  console.log("token", token);

  if (!token) return null;

  return (
    <div>{token.status}</div>
  )
}

export default Launch;