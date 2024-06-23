import axios from "axios";
import { headers } from "next/headers";
import { useSearchParams } from "next/navigation";

const Launch = async () => {

  const getToken = async () => {
    const headersQuery = headers()
    const url = new URL(headersQuery.get("referer") as string);
    const ltik = url.searchParams.get("ltik");
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