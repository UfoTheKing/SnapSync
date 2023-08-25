export interface Device {
  id: number;
  uuid: string;
  brand: string | null;
  osName: string | null;
  osVersion: string | null;
  modelName: string | null;
  platformOs: string | null;
  latitude: string | null;
  longitude: string | null;
}
