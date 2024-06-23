import axios from "axios";

const Launch = async () => {

  const getToken = async () => {
    try {
      const res = await axios(`${process.env.NEXTAUTH_URL}/api/idtoken`, {
        method: 'GET',
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