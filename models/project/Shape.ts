import { SnapShapePosition } from "../resources/SnapShapePosition";

export interface Shape {
  id: number;
  grid: string[][];
  name: string;
  numberOfUsers: number;
  iconUrl: string;
  rows: number;
  columns: number;
  spacing: number;
  width: number;
  height: number;
  focusedIconUrl: string;
  positions: Array<SnapShapePosition>;
}
