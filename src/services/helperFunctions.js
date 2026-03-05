async function fetchData(url, options = null) {
  // If options used, include in fetch.
  let resp = "";
  if (options) {
    resp = await fetch(url, options);
  } else {
    resp = await fetch(url);
  }

  // If response is not okay, raise error
  if (!resp.ok) {
    throw new Error(resp.message);
  }

  // Return retrieved data as parsed json object
  return resp.json();
}

// Creates options parameter for fetching from airtable (e.g. do you want to get data, post it, etc.)
const makeOptions = (methodUsed, token, payload = null) => {
  const options = {
    method: methodUsed,
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  };

  // If payload is specified, add it to options
  if (payload) {
    options.body = JSON.stringify(payload);
  }

  // Return options!
  return options;
};

export { fetchData, makeOptions };
