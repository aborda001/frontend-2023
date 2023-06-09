document.addEventListener("DOMContentLoaded", () => {
  const votantes = document.getElementById("votantes");
  const mesas = document.getElementById("mesas");
  const efectividad = document.getElementById("efectividad");
  const tablaBody = document.getElementById("tablaBody");
  const reloadCiudades = document.getElementById("reloadCiudades");
  const printButton = document.querySelectorAll("#printButton");

  printButton.forEach((button) => {
    button.addEventListener("click", (e) => {
      console.log("print");
      e.preventDefault();
      window.print();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "p") {
      const navRemove = document.getElementById("navRemove");
      navRemove.style.display = "none";
    }
  });

  const fillChart = () => {
    fetch(`${API_HOST}/votantes/general/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${infoData.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        votantes.innerHTML = data.votantes;
        mesas.innerHTML = data.votantes_us;
        efectividad.innerHTML = data.efectividad + "%";
        createChart(data);
      });
  };

  fillChart();

  const fillTableCiudades = () => {
    fetch(`${API_HOST}/votantes/general/departamento`, {
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
  };

  fillTableCiudades();

  var chartColors = {
    default: {
      primary: "#00D1B2",
      info: "#209CEE",
      danger: "#FF3860",
    },
  };

  const createChart = (data) => {
    const { votantes_us, votantes } = data;
    const [votantes_resto, votantes_anr] = [
      votantes - votantes_us,
      votantes_us,
    ];
    var ctx = document.getElementById("big-line-chart").getContext("2d");
    new Chart(ctx, {
      type: "pie",
      data: {
        datasets: [
          {
            backgroundColor: [
              chartColors["default"].info,
              chartColors["default"].danger,
            ],
            data: [votantes_resto, votantes_anr],
          },
        ],
        labels: [`Resto ${votantes_resto}`, `ANR ${votantes_anr}`],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        tooltips: {
          backgroundColor: "#f5f5f5",
          titleFontColor: "#333",
          bodyFontColor: "#666",
          bodySpacing: 4,
          xPadding: 12,
          mode: "nearest",
          intersect: 0,
          position: "nearest",
        },
        legend: {
          display: true,
          labels: {
            fontColor: "#9a9a9a",
          },
        },
      },
    });
  };

  const fillTable = (data) => {
    tablaBody.innerHTML = "";
    data.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
      <tr>
        <td></td>
        <td data-label="Ciudad">${item.ciudad}</td>
        <td data-label="Departamento">Misiones</td>
        <td data-label="Efectividad" class="is-progress-cell">
          <progress
            max="100"
            class="progress is-small is-primary"
            value="${item.efectividad}"
          >
            ${item.efectividad}
          </progress>
        </td>
        <td data-label="Efectividad">${item.efectividad} %</td>
        <td data-label="Votantes">${item.votantes}</td>
      </tr>
      `;

      tablaBody.appendChild(row);
    });
  };

  reloadCiudades.addEventListener("click", (e) => {
    e.preventDefault();
    fillTableCiudades();
  });
});
