export interface Shape {
  id: number;
  name: string;
  numberOfUsers: number;
  iconUrl: string;
  focusedIconUrl: string;
  positions: Array<{
    id: number;
    snapInstanceShapeId: number;
    name: string;
    ownerPosition: boolean;
  }>;
}
