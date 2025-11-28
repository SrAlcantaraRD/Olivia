import Svg, { Ellipse, Path } from 'react-native-svg';

export function AtomLogoSVG({
  width = 40,
  height = 50,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Svg viewBox="0 0 200 250" width={width} height={height}>
      {/* Stem */}
      <Path
        d="M103,85 C105,75, 115,60, 130,58"
        fill="none"
        stroke="#1D1D1B"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Leaf fill */}
      <Path
        d="M130,58 C130,58, 150,30, 125,15 C100,0, 75,20, 75,20 C75,20, 70,35, 95,42 C115,48, 130,58, 130,58 Z"
        fill="#7D917A"
      />
      {/* Leaf outline */}
      <Path
        d="M130,58 C130,58, 150,30, 125,15 C100,0, 75,20, 75,20 C75,20, 70,35, 95,42 C115,48, 130,58, 130,58 Z"
        fill="none"
        stroke="#1D1D1B"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Olive body fill */}
      <Ellipse
        cx="100"
        cy="135"
        rx="38"
        ry="50"
        fill="#A6C4A0"
        transform="rotate(-15, 100, 135)"
      />
      {/* Highlight */}
      <Path
        d="M 85,105 Q 90,95 100,92"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
        transform="rotate(-15, 100, 135)"
      />
      {/* Olive body outline */}
      <Ellipse
        cx="100"
        cy="135"
        rx="38"
        ry="50"
        fill="none"
        stroke="#1D1D1B"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="rotate(-15, 100, 135)"
      />
    </Svg>
  );
}
