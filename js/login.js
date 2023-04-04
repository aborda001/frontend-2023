document.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("infoData", JSON.stringify({}));
  const form = document.getElementById("form");
  const errorCard = document.getElementById("errorCard");

  errorCard.style.display = "none";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          localStorage.setItem("infoData", JSON.stringify(data));
          window.location.replace("/index.html");
        } else {
          errorCard.style.display = "flex";
        }
      });
  });
});
