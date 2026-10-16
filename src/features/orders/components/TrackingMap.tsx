import { useTheme } from "@/core/theme/ThemeProvider";
import { useWindowDimensions, View } from "react-native";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";

type TrackingMapProps = {
  height: number;
};

// Placeholder map drawn with SVG. Swap for a real map (such as react-native-maps) later
export function TrackingMap({ height }: TrackingMapProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  const x = (fraction: number) => fraction * width;
  const y = (fraction: number) => fraction * height;

  const traveled = `M ${x(0.14)} ${y(0.2)} L ${x(0.14)} ${y(0.4)} L ${x(0.42)} ${y(0.4)} L ${x(0.42)} ${y(0.58)} L ${x(0.66)} ${y(0.58)}`;
  const remaining = `M ${x(0.66)} ${y(0.58)} L ${x(0.66)} ${y(0.74)} L ${x(0.86)} ${y(0.74)}`;

  const roadsH = [0.12, 0.3, 0.5, 0.68, 0.86];
  const roadsV = [0.08, 0.28, 0.55, 0.78, 0.94];

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Rect width={width} height={height} fill={colors.surfaceMuted} />

        {/* Parks */}
        <Rect
          x={x(0.62)}
          y={y(0.08)}
          width={x(0.3)}
          height={y(0.22)}
          rx={14}
          fill={colors.success + "30"}
        />
        <Rect
          x={x(0.05)}
          y={y(0.7)}
          width={x(0.2)}
          height={y(0.18)}
          rx={14}
          fill={colors.success + "30"}
        />

        {/* Roads */}
        {roadsH.map((f) => (
          <Line
            key={`h${f}`}
            x1={0}
            x2={width}
            y1={y(f)}
            y2={y(f)}
            stroke={colors.border}
            strokeWidth={2}
          />
        ))}
        {roadsV.map((f) => (
          <Line
            key={`v${f}`}
            x1={x(f)}
            x2={x(f)}
            y1={0}
            y2={height}
            stroke={colors.border}
            strokeWidth={2}
          />
        ))}
        <Line
          x1={0}
          y1={y(0.9)}
          x2={x(0.6)}
          y2={0}
          stroke={colors.border}
          strokeWidth={3}
        />

        {/* Remaining route */}
        <Path
          d={remaining}
          stroke={colors.borderStrong}
          strokeWidth={4}
          strokeDasharray="8 8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Traveled route */}
        <Path
          d={traveled}
          stroke={colors.primary}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Start */}
        <Circle
          cx={x(0.14)}
          cy={y(0.2)}
          r={11}
          fill={colors.background}
          stroke={colors.primary}
          strokeWidth={4}
        />

        {/* Destination */}
        <Circle
          cx={x(0.86)}
          cy={y(0.74)}
          r={9}
          fill={colors.background}
          stroke={colors.borderStrong}
          strokeWidth={3}
        />

        {/* Courier */}
        <Circle cx={x(0.66)} cy={y(0.58)} r={22} fill={colors.primary + "30"} />
        <Circle cx={x(0.66)} cy={y(0.58)} r={14} fill={colors.primary} />
        <Rect
          x={x(0.66) - 5}
          y={y(0.58) - 5}
          width={10}
          height={10}
          rx={2}
          fill={colors.onPrimary}
        />
      </Svg>
    </View>
  );
}
