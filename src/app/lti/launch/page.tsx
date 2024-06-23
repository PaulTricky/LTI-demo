const Launch = async () => {

  const getToken = async () => {
    try {
      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/idtoken`);
      return res.json();
    } catch(e) {}
  }

  const token = await getToken();

  console.log("token", token);

  return (
    <div>{JSON.stringify(token)}</div>
  )
}

export default Launch;