import './VisionDiagram.css';

const SIZE = 400;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R_OUTER = 188;
const R_INNER = 118;
const R_TEXT = (R_OUTER + R_INNER) / 2;

function polar(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function ringSegmentPath(startDeg, endDeg) {
  const large = endDeg - startDeg > 180 ? 1 : 0;
  const p1 = polar(CX, CY, R_OUTER, startDeg);
  const p2 = polar(CX, CY, R_OUTER, endDeg);
  const p3 = polar(CX, CY, R_INNER, endDeg);
  const p4 = polar(CX, CY, R_INNER, startDeg);

  return [
    `M ${p1.x} ${p1.y}`,
    `A ${R_OUTER} ${R_OUTER} 0 ${large} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${R_INNER} ${R_INNER} 0 ${large} 0 ${p4.x} ${p4.y}`,
    'Z',
  ].join(' ');
}

function ringTextArc(startDeg, endDeg) {
  const mid = ((startDeg + endDeg) / 2 + 360) % 360;
  const flip = mid > 0 && mid < 180;
  const from = flip ? endDeg : startDeg;
  const to = flip ? startDeg : endDeg;
  const sweep = flip ? 0 : 1;
  const span = Math.abs(endDeg - startDeg);
  const large = span > 180 ? 1 : 0;
  const p1 = polar(CX, CY, R_TEXT, from);
  const p2 = polar(CX, CY, R_TEXT, to);

  return `M ${p1.x} ${p1.y} A ${R_TEXT} ${R_TEXT} 0 ${large} ${sweep} ${p2.x} ${p2.y}`;
}

export default function VisionDiagram({ centerText, segments = [] }) {
  const count = Math.max(segments.length, 1);
  const gap = 2.2;
  const slice = 360 / count;

  return (
    <div className="vision-diagram">
      <svg
        className="vision-diagram-svg"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={centerText}
      >
        <g className="vision-diagram-ring">
          <defs>
            {segments.map((seg, i) => {
              const start = i * slice - 90 + gap / 2;
              const end = (i + 1) * slice - 90 - gap / 2;
              return (
                <path
                  key={`text-arc-${i}`}
                  id={`vision-arc-${i}`}
                  d={ringTextArc(start, end)}
                  fill="none"
                />
              );
            })}
          </defs>

          {segments.map((seg, i) => {
            const start = i * slice - 90 + gap / 2;
            const end = (i + 1) * slice - 90 - gap / 2;
            return (
              <path
                key={seg.label}
                className="vision-diagram-segment"
                d={ringSegmentPath(start, end)}
              />
            );
          })}

          {segments.map((seg, i) => (
            <text key={`label-${i}`} className="vision-diagram-label">
              <textPath href={`#vision-arc-${i}`} startOffset="50%" textAnchor="middle">
                {seg.label}
              </textPath>
            </text>
          ))}
        </g>

        <circle className="vision-diagram-center-bg" cx={CX} cy={CY} r={R_INNER - 4} />

        <text className="vision-diagram-logo" x={CX} y={CY - 10} textAnchor="middle">
          CY
        </text>
        {centerText.split('\n').map((line, i) => (
          <text
            key={line}
            className="vision-diagram-center-text"
            x={CX}
            y={CY + 26 + i * 20}
            textAnchor="middle"
          >
            {line}
          </text>
        ))}
      </svg>
    </div>
  );
}
