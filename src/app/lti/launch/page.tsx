const Launch = async () => {

  const getToken = async () => {
    try {
      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/idtoken`);
      return res.json();
    } catch(e) {
      console.log("eeeee", e)
    }
  }

  const token = await getToken();

  console.log("token", token);

  if (!token) return null;

  return (
    <div>{JSON.stringify(token)}</div>
  )
}

export default Launch;