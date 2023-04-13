document.addEventListener("DOMContentLoaded", () => {
  const formUsuario = document.getElementById("formUsuario");
  const departamentoIdSelect = document.getElementById("departamentoIdSelect");
  const tableUsuarios = document.getElementById("tableUsuarios");

  formUsuario.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(formUsuario);
    const data = Object.fromEntries(formData);
    fetch(`${API_HOST}/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${infoData.token}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.id) {
          alert("Usuario creado correctamente");
          formUsuario.reset();
          fillTable();
        } else {
          alert("El usuario ya existe cree otro");
        }
      });
  });

  const fillTable = () => {
    tableUsuarios.innerHTML = "";
    fetch(`${API_HOST}/usuarios`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${infoData.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.length > 0) {
          data.forEach((item) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td data-label="Usuario">${item.username}</td>
              <td data-label="Departamento">${item.departamento.name}</td>
              <td data-label="Role">${item.role}</td>
            `;
            tableUsuarios.appendChild(tr);
          });
        }
      });
  };

  fillTable();
});
