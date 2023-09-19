export interface CreateSnapInstanceDto {
  snapShapeId: number;
  users: Array<{
    id: number;
    position: string;
  }>;
}
