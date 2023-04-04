document.addEventListener("DOMContentLoaded", () => {
  const ciudadesSelect = document.getElementById("ciudadesSelect");
  const formConsulta = document.getElementById("formConsulta");
  const tbodyVotantes = document.getElementById("tbodyVotantes");
  const detalleModal = document.getElementById("detalleModal");
  const detalleTablaBody = document.getElementById("detalleTablaBody");

  // trigger key press event ctrl + p to print
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "p") {
      const closeFooter = document.getElementById("closeFooter");
      closeFooter.style.display = "none";
    }
  });

  fetch("http://localhost:3000/api/ciudades", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${infoData.token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      fillSelect(data);
    });

  const fillSelect = (data) => {
    data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.innerHTML = item.name;

      ciudadesSelect.appendChild(option);
    });
  };

  formConsulta.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(formConsulta);
    const data = Object.fromEntries(formData);
    if (isNaN(data.votante)) {
      data.fullname = data.votante;
      delete data.votante;
    } else {
      data.document = data.votante;
      delete data.votante;
    }

    if (data.ciudad_id === "0") {
      delete data.ciudad_id;
    }

    const url = new URL("http://localhost:3000/api/votantes");
    url.search = new URLSearchParams(data);
    fetch(url.href, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${infoData.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        fillTable(data);
      });
  });

  const fillTable = (data) => {
    tbodyVotantes.innerHTML = "";
    data.forEach((item) => {
      const tr = document.createElement("tr");
      tr.setAttribute("data-id", item.id);
      tr.innerHTML = `
        <td data-label="Nombre">${item.name}</td>
        <td data-label="Apellido">${item.lastname}</td>
        <td data-label="Cedula">${item.document}</td>
        <td data-label="Afiliaciones">${item.affiliations}</td>
        <td data-label="Mesa">${item.mesa}</td>
        <td data-label="Orden">${item.order}</td>
        <td data-label="Voto">${item.voto ? "Si" : "No"}</td>
        `;

      tr.onclick = () => {
        const id = tr.getAttribute("data-id");
        fetch(`http://localhost:3000/api/votantes/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${infoData.token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            detalleTablaBody.innerHTML = `
            <tr>
              <td>Cédula</td>
              <td>${data.document}</td>
            </tr>
            <tr>
              <td>Apellidos</td>
              <td>${data.lastname}</td>
            </tr>
            <tr>
              <td>Nombres</td>
              <td>${data.name}</td>
            </tr>
            <tr>
              <td>Local</td>
              <td>${data.local.name}</td>
            </tr>
            <tr>
              <td>Ciudad</td>
              <td>${data.ciudad.name}</td>
            </tr>
            <tr>
              <td>Mesa</td>
              <td>${data.mesa}</td>
            </tr>
            <tr>
              <td>Orden</td>
              <td>${data.order}</td>
            </tr>
            <tr>
              <td>Afiliaciones</td>
              <td>${data.affiliations}</td>
            </tr>
            <tr>
              <td>Voto</td>
              <td>${data.voto ? "Si" : "No"}</td>
            </tr>
            `;
          });
        detalleModal.classList.add("is-active");
      };

      tbodyVotantes.appendChild(tr);
    });
  };
});
