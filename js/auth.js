const infoData = JSON.parse(localStorage.getItem("infoData"));
// var API_HOST = "http://localhost:3000/api";
var API_HOST = "http://backend.padronmisiones.com/api";
if (!infoData.id) {
  window.location.replace("/login.html");
} else {
  fetch(`${API_HOST}/login`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${infoData.token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.code != 200) {
        window.location.replace("/login.html");
      }
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const usernameText = document.getElementById("usernameText");
  usernameText.innerHTML = infoData.username;

  if (infoData.role != "administrador") {
    const admin = document.querySelectorAll("#admin");
    admin.forEach((item) => {
      item.remove();
    });

    if (
      window.location.pathname == "/index.html" ||
      window.location.pathname == "/admin.html"
    ) {
      window.location.replace("/consulta.html");
    }
  }
});
