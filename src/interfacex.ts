export interface IData {
  stages: IStage[];
}
export interface IStage {
  time?: number;
  id: string;
  name: string;
  steps: IStep[];
}
export interface IStep {
  time?: number;
  id: string;
  name: string;
  elements: IElement[];
}
export interface IElement {
  time: number;
  id: string;
  name: string;
  assigned: string;
}
