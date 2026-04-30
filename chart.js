(function () {
  const labels = [
    "T4 2021", "T1 2022", "T2 2022", "T3 2022", "T4 2022", "T1 2023",
    "T2 2023", "T3 2023", "T4 2023", "T1 2024", "T2 2024", "T3 2024",
    "T4 2024", "T1 2025", "T2 2025", "T3 2025", "T4 2025", "T1 2026"
  ];

  const series = [
    {
      name: "Inflation perçue",
      color: "#0070d1",
      dash: "",
      values: [2.6, 3.5, 5.0, 6.0, 6.5, 6.0, 6.0, 5.0, 5.0, 4.0, 3.0, 2.5, 2.0, 2.0, 2.0, 2.0, 1.6, 1.5]
    },
    {
      name: "Inflation anticipée à 1 an",
      color: "#003da5",
      dash: "8 6",
      values: [3.0, 4.0, 5.0, 5.0, 6.0, 5.0, 4.0, 4.0, 3.5, 3.0, 2.5, 2.1, 2.0, 2.0, 2.0, 2.0, 1.8, 2.0]
    },
    {
      name: "Inflation anticipée à 3-5 ans",
      color: "#001489",
      dash: "8 4 2 4",
      values: [2.0, 2.5, 3.0, 3.0, 3.0, 3.0, 3.0, 2.5, 2.5, 2.5, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0]
    }
  ];

  const svg = document.getElementById("inflation-chart");
  const tooltip = document.getElementById("chart-tooltip");
  if (!svg || !tooltip) return;

  const width = 760;
  const height = 420;
  const margin = { top: 28, right: 28, bottom: 82, left: 46 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const yMax = 7;
  const yMin = 0;

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

  const x = (index) => margin.left + (index / (labels.length - 1)) * plotWidth;
  const y = (value) => margin.top + ((yMax - value) / (yMax - yMin)) * plotHeight;
  const format = (value) => value.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  function createSvgElement(name, attributes = {}) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  }

  for (let tick = 0; tick <= yMax; tick += 1) {
    const lineY = y(tick);
    svg.appendChild(createSvgElement("line", {
      x1: margin.left,
      x2: width - margin.right,
      y1: lineY,
      y2: lineY,
      class: "chart-grid"
    }));
    svg.appendChild(createSvgElement("text", {
      x: margin.left - 12,
      y: lineY + 4,
      "text-anchor": "end",
      class: "chart-axis-label"
    })).textContent = tick;
  }

  labels.forEach((label, index) => {
    if (index % 2 !== 0 && index !== labels.length - 1) return;
    const text = createSvgElement("text", {
      x: x(index),
      y: height - 34,
      "text-anchor": "end",
      transform: `rotate(-35 ${x(index)} ${height - 34})`,
      class: "chart-axis-label"
    });
    text.textContent = label;
    svg.appendChild(text);
  });

  series.forEach((item) => {
    const points = item.values.map((value, index) => `${x(index)},${y(value)}`).join(" ");
    svg.appendChild(createSvgElement("polyline", {
      points,
      fill: "none",
      stroke: item.color,
      "stroke-width": 3,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-dasharray": item.dash,
      class: "chart-line"
    }));
  });

  const legend = createSvgElement("g", { class: "chart-legend" });
  series.forEach((item, index) => {
    const group = createSvgElement("g", { transform: `translate(${margin.left + index * 214}, ${height - 14})` });
    group.appendChild(createSvgElement("line", {
      x1: 0,
      x2: 28,
      y1: 0,
      y2: 0,
      stroke: item.color,
      "stroke-width": 3,
      "stroke-dasharray": item.dash
    }));
    const label = createSvgElement("text", { x: 36, y: 4, class: "chart-legend-label" });
    label.textContent = item.name;
    group.appendChild(label);
    legend.appendChild(group);
  });
  svg.appendChild(legend);

  labels.forEach((label, index) => {
    const target = createSvgElement("rect", {
      x: x(index) - plotWidth / labels.length / 2,
      y: margin.top,
      width: plotWidth / labels.length,
      height: plotHeight,
      fill: "transparent",
      tabindex: "0"
    });

    const showTooltip = (event) => {
      const rows = series.map((item) => `<span style="color:${item.color}">${item.name}: ${format(item.values[index])}%</span>`).join("");
      tooltip.innerHTML = `<strong>${label}</strong>${rows}`;
      tooltip.setAttribute("aria-hidden", "false");
      const bounds = svg.getBoundingClientRect();
      tooltip.style.left = `${Math.min(bounds.width - 210, Math.max(12, event.offsetX + 14))}px`;
      tooltip.style.top = `${Math.max(12, event.offsetY - 30)}px`;
    };

    target.addEventListener("mousemove", showTooltip);
    target.addEventListener("focus", (event) => showTooltip({ offsetX: x(index) * (svg.clientWidth / width), offsetY: y(series[0].values[index]) * (svg.clientHeight / height) }));
    target.addEventListener("mouseleave", () => tooltip.setAttribute("aria-hidden", "true"));
    target.addEventListener("blur", () => tooltip.setAttribute("aria-hidden", "true"));
    svg.appendChild(target);
  });
})();
