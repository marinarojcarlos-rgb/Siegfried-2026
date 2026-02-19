import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine, Area, AreaChart, ComposedChart, Bar
} from "recharts";

const mats = ["MAT Ene 2022", "MAT Ene 2023", "MAT Ene 2024", "MAT Ene 2025", "MAT Ene 2026"];

const rawData = {
  SIEGFRIED:   [1087806, 1031930, 1054693, 962668, 879635],
  BALIARDA:    [2081602, 2418333, 2771781, 2905356, 3173502],
  ADIUM:       [2403942, 2579814, 2571784, 2437360, 2521492],
  MONTPELLIER: [984481,  1059449, 1139948, 1212222, 1358267],
  ROEMMERS:    [788147,  774458,  836827,  1017702, 1278960],
  CASASCO:     [872018,  862585,  976853,  1017907, 1053788],
};

const totalByMat = mats.map((_, i) =>
  Object.values(rawData).reduce((s, arr) => s + (arr[i] || 0), 0)
);

const data = mats.map((mat, i) => {
  const total = totalByMat[i];
  return {
    period: mat,
    "DIOVAN (SIE)": rawData.SIEGFRIED[i],
    "Mercado Total": total,
    "MS (%)": parseFloat(((rawData.SIEGFRIED[i] / total) * 100).toFixed(1)),
    BALIARDA: rawData.BALIARDA[i],
    ADIUM: rawData.ADIUM[i],
    MONTPELLIER: rawData.MONTPELLIER[i],
  };
});

const formatUnit = (v) => {
  if (v >= 1000000) return (v / 1000000).toFixed(2) + "M";
  if (v >= 1000) return (v / 1000).toFixed(0) + "K";
  return v;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div style={{
      background: "#0f1923", border: "1px solid #1e3a5f",
      padding: "12px 16px", borderRadius: "8px", fontSize: "12px"
    }}>
      <p style={{ color: "#7dd3fc", fontWeight: "700", marginBottom: 8, fontSize: 13 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 24, color: "#e2e8f0", marginBottom: 4 }}>
          <span style={{ color: p.color }}>{p.name}</span>
          <span style={{ fontWeight: "600" }}>
            {p.name === "MS (%)" ? p.value + "%" : formatUnit(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function DiovanChart() {
  const [view, setView] = useState("units"); // units | share | competitors

  const pctChange = ((rawData.SIEGFRIED[4] - rawData.SIEGFRIED[0]) / rawData.SIEGFRIED[0] * 100).toFixed(1);
  const msFirst = ((rawData.SIEGFRIED[0] / totalByMat[0]) * 100).toFixed(1);
  const msLast  = ((rawData.SIEGFRIED[4] / totalByMat[4]) * 100).toFixed(1);
  const msDiff  = (msLast - msFirst).toFixed(1);

  const tabs = [
    { id: "units", label: "Unidades SIE" },
    { id: "share", label: "Market Share" },
    { id: "competitors", label: "vs Competencia" },
  ];

  return (
    <div style={{
      background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 50%, #091018 100%)",
      minHeight: "100vh", padding: "32px 24px", fontFamily: "'Segoe UI', system-ui, sans-serif",
      color: "#e2e8f0"
    }}>
      {/* Header */}
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
          <div>
            <p style={{ color: "#38bdf8", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>
              SIEGFRIED · Valsartan · PM IQVIA
            </p>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: "6px 0 4px", color: "#f0f9ff", letterSpacing: "-0.5px" }}>
              DIOVAN — Evolución MAT
            </h1>
            <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>
              MAT Enero 2022 → MAT Enero 2026
            </p>
          </div>
          <div style={{
            background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)",
            borderRadius: 10, padding: "10px 18px", textAlign: "center"
          }}>
            <p style={{ fontSize: 11, color: "#f87171", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Var. 2022→2026</p>
            <p style={{ fontSize: 26, fontWeight: 800, color: "#ef4444", margin: 0 }}>{pctChange}%</p>
          </div>
        </div>

        {/* KPI chips */}
        <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
          {[
            { label: "Unidades 2022", val: formatUnit(rawData.SIEGFRIED[0]), color: "#38bdf8" },
            { label: "Unidades 2026", val: formatUnit(rawData.SIEGFRIED[4]), color: "#ef4444" },
            { label: "MS 2022", val: msFirst + "%", color: "#a78bfa" },
            { label: "MS 2026", val: msLast + "%", color: "#f97316" },
            { label: "Δ Market Share", val: msDiff + " pp", color: "#ef4444" },
          ].map((k) => (
            <div key={k.label} style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8, padding: "8px 14px"
            }}>
              <p style={{ fontSize: 10, color: "#64748b", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.1em" }}>{k.label}</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: k.color, margin: 0 }}>{k.val}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setView(t.id)} style={{
              padding: "7px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
              background: view === t.id ? "#1d4ed8" : "rgba(255,255,255,0.05)",
              color: view === t.id ? "#fff" : "#94a3b8",
              transition: "all 0.2s"
            }}>{t.label}</button>
          ))}
        </div>

        {/* Chart */}
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14, padding: "24px 16px 16px"
        }}>
          {view === "units" && (
            <>
              <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 16px 8px" }}>
                Unidades vendidas por Siegfried (DIOVAN) en el mercado de Valsartan
              </p>
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={data}>
                  <defs>
                    <linearGradient id="siegGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="period" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={formatUnit} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="DIOVAN (SIE)" stroke="#ef4444" strokeWidth={3}
                    fill="url(#siegGrad)" dot={{ fill: "#ef4444", r: 5, strokeWidth: 0 }}
                    activeDot={{ r: 7 }} />
                </ComposedChart>
              </ResponsiveContainer>
              {/* annotations */}
              <div style={{ display: "flex", gap: 8, marginTop: 16, padding: "0 8px" }}>
                {data.map((d, i) => (
                  <div key={i} style={{
                    flex: 1, textAlign: "center", padding: "8px 4px",
                    background: i === data.length - 1 ? "rgba(239,68,68,0.1)" : "transparent",
                    borderRadius: 6
                  }}>
                    <p style={{ fontSize: 10, color: "#64748b", margin: "0 0 2px" }}>{d.period.replace("MAT ", "")}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: i === data.length - 1 ? "#ef4444" : "#e2e8f0", margin: 0 }}>
                      {formatUnit(d["DIOVAN (SIE)"])}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {view === "share" && (
            <>
              <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 16px 8px" }}>
                Participación de mercado (Market Share %) de DIOVAN sobre el total de Valsartan
              </p>
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={data}>
                  <defs>
                    <linearGradient id="msGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="period" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 25]} tickFormatter={v => v + "%"} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="MS (%)" stroke="#a78bfa" strokeWidth={3}
                    fill="url(#msGrad)" dot={{ fill: "#a78bfa", r: 5, strokeWidth: 0 }}
                    activeDot={{ r: 7 }} />
                </ComposedChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", gap: 8, marginTop: 16, padding: "0 8px" }}>
                {data.map((d, i) => (
                  <div key={i} style={{
                    flex: 1, textAlign: "center", padding: "8px 4px",
                    background: i === data.length - 1 ? "rgba(167,139,250,0.1)" : "transparent",
                    borderRadius: 6
                  }}>
                    <p style={{ fontSize: 10, color: "#64748b", margin: "0 0 2px" }}>{d.period.replace("MAT ", "")}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: i === data.length - 1 ? "#a78bfa" : "#e2e8f0", margin: 0 }}>
                      {d["MS (%)"]}%
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {view === "competitors" && (
            <>
              <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 16px 8px" }}>
                DIOVAN vs principales competidores en unidades (MAT Valsartan)
              </p>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="period" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={formatUnit} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
                  <Line type="monotone" dataKey="DIOVAN (SIE)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="BALIARDA" stroke="#38bdf8" strokeWidth={2} strokeDasharray="4 2" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="ADIUM" stroke="#34d399" strokeWidth={2} strokeDasharray="4 2" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="MONTPELLIER" stroke="#fbbf24" strokeWidth={2} strokeDasharray="4 2" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
              <div style={{
                marginTop: 16, padding: "12px 16px",
                background: "rgba(239,68,68,0.06)", borderLeft: "3px solid #ef4444", borderRadius: "0 8px 8px 0"
              }}>
                <p style={{ fontSize: 12, color: "#fca5a5", margin: 0 }}>
                  Mientras BALIARDA y MONTPELLIER crecieron +52% y +38% respectivamente, DIOVAN cayó <strong style={{ color: "#ef4444" }}>{pctChange}%</strong> en el mismo período.
                </p>
              </div>
            </>
          )}
        </div>

        <p style={{ textAlign: "right", fontSize: 10, color: "#334155", marginTop: 12 }}>
          Fuente: PM IQVIA · Febrero 2026
        </p>
      </div>
    </div>
  );
}
