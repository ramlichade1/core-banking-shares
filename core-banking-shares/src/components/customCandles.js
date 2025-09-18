import React from "react";

function CustomCandles({ xAxisMap, yAxisMap, offset, data }) {
  if (!data || !xAxisMap || !yAxisMap) return null;

  const xAxis = Object.values(xAxisMap)[0];
  const yAxis = Object.values(yAxisMap)[0];

  if (!xAxis || !yAxis) return null;

  const candleWidth = Math.min(20, xAxis.bandwidth ? xAxis.bandwidth() * 0.6 : 20);

  return (
    <g>
      {data.map((d, index) => {
        const x = xAxis.scale(index) + (xAxis.bandwidth ? xAxis.bandwidth() / 2 : 0);
        const color = d.close >= d.open ? "#4caf50" : "#f44336";

        return (
          <g key={index}>
            {/* Wick */}
            <line
              x1={x}
              x2={x}
              y1={yAxis.scale(d.low)}
              y2={yAxis.scale(d.high)}
              stroke={color}
              strokeWidth={2}
            />
            {/* Body */}
            <rect
              x={x - candleWidth / 2}
              y={yAxis.scale(Math.max(d.open, d.close))}
              width={candleWidth}
              height={Math.max(1, Math.abs(yAxis.scale(d.open) - yAxis.scale(d.close)))}
              fill={color}
            />
          </g>
        );
      })}
    </g>
  );
}

export default CustomCandles;
