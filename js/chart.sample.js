fetch("http://localhost:3000/api/votantes/general/", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${infoData.token}`,
  },
})
  .then((res) => res.json())
  .then((data) => {
    
  });
