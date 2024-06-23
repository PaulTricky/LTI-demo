import axios from "axios";
import LaunchForm from "./components/LaunchForm";

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

  if (!token) return null;
  console.log("token", token);

  return (
    <div>
      <LaunchForm />
    </div>
  )
}

export default Launch;