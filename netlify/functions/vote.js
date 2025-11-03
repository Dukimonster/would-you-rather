exports.handler = async (event) => {
  const body = JSON.parse(event.body || "{}");
  console.log("Received vote:", body);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ success: true })
  };
};
