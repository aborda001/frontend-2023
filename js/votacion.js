document.addEventListener("DOMContentLoaded", () => {
  const ciudadesSelect = document.getElementById("ciudadesSelect");
  const localesSelect = document.getElementById("localesSelect");
  const formConsulta = document.getElementById("formConsulta");
  const formActualizar = document.getElementById("formActualizar");
  const fullnameInput = document.getElementById("fullname");
  const documentInput = document.getElementById("document");
  const votoSelect = document.getElementById("votoSelect");
  const usSelect = document.getElementById("usSelect");
  const idInput = document.getElementById("idInput");

  fetch("http://backend.padronmisiones.com/api/ciudades", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${infoData.token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      fillSelect(data);
      fillSelectLocalesFunc(data[0].id);
    });

  const fillSelect = (data) => {
    data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.innerHTML = item.name;

      ciudadesSelect.appendChild(option);
    });
  };

  ciudadesSelect.addEventListener("change", (e) => {
    const ciudad_id = e.target.value;
    fillSelectLocalesFunc(ciudad_id);
  });

  const fillSelectLocalesFunc = (ciudad_id) => {
    fetch("http://backend.padronmisiones.com/api/ciudades/locales/" + ciudad_id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${infoData.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        fillSelectLocales(data);
      });

    const fillSelectLocales = (data) => {
      localesSelect.innerHTML = "";
      data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.innerHTML = item.name;

        localesSelect.appendChild(option);
      });
    };
  };

  formConsulta.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(formConsulta);
    const data = Object.fromEntries(formData);
    data.code = data.code.toUpperCase();

    const url = new URL("http://backend.padronmisiones.com/api/votantes/mesaorden");
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
        if (data) {
          fillForm(data);
        }
      });
  });

  const fillForm = (data) => {
    const { id, fullname, document, voto, us } = data;
    idInput.value = id;
    fullnameInput.value = fullname;
    documentInput.value = document;
    votoSelect.innerHTML = `
        <option value="1" ${voto ? "selected" : ""} >SI</option>
        <option value="0" ${voto ? "" : "selected"}>No</option>
    `;
    usSelect.innerHTML = `
        <option value="1" ${us ? "selected" : ""} >SI</option>
        <option value="0" ${us ? "" : "selected"}>No</option>
    `;
  };

  formActualizar.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(formActualizar);
    const data = Object.fromEntries(formData);
    delete data.id;
    data.voto = data.voto === "1" ? true : false;
    data.us = data.us === "1" ? true : false;

    fetch("http://backend.padronmisiones.com/api/votantes/" + idInput.value, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${infoData.token}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          alert("Votante actualizado");
        }
        fullnameInput.value = "";
        documentInput.value = "";
      });
  });
});
