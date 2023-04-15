document.addEventListener("DOMContentLoaded", () => {
  const table = document.getElementById("table");
  const mesa = document.querySelectorAll("#mesa");
  const tableSection = document.getElementById("tableSec");
  const tableSecContainer = document.getElementById("tableSecContainer");

  let count = 0;

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  const mesaNumber = params.mesa; // "some_value"

  const url = new URL(`${API_HOST}/votantes/mesaorden/${params.local}`);
  url.search = new URLSearchParams({ mesa: mesaNumber, ciudad: params.ciudad });
  fetch(url.href, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${infoData.token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const mesaHtml = `Mesa: ${mesaNumber} -------- Local: ${data.local}`;
      mesa.forEach((mesa) => (mesa.innerHTML = mesaHtml));
      fillTable(data);
    });

  const fillTable = (data) => {
    for (let index = 1; index <= 16; index++) {
      const tr = document.createElement("tr");
      let html = "";
      for (let column = 1; column <= 25; column++) {
        count++;
        const votantes = data.votantes.find(
          (votante) => votante.orden == `${count}`
        );
        if (votantes) {
          if (votantes.voto) {
            html += `<td style="background-color: #de5349;">${votantes.orden}</td>`;
          } else {
            html += `<td>${votantes.orden}</td>`;
          }
        } else {
          if (data.votantes.length < count) {
            break;
          } else {
            html += `<td>${count}</td>`;
          }
        }
      }
      tr.innerHTML = html;
      table.appendChild(tr);
    }

    if (data.votantes.length > 400) {
      tableSecContainer.classList.remove("oculto");
      for (let index = 1; index <= 16; index++) {
        const tr = document.createElement("tr");
        let html = "";
        for (let column = 1; column <= 25; column++) {
          count++;
          const votantes = data.votantes.find(
            (votante) => votante.orden == `${count}`
          );
          if (votantes) {
            if (votantes.voto) {
              html += `<td style="background-color: #de5349;">${votantes.orden}</td>`;
            } else {
              html += `<td>${votantes.orden}</td>`;
            }
          } else {
            if (data.votantes.length < count) {
              break;
            } else {
              html += `<td>${count}</td>`;
            }
          }
        }
        tr.innerHTML = html;
        tableSection.appendChild(tr);
      }
    }
    window.print();
  };
});
