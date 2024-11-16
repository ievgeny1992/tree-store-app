export default interface Item {
  id: number | string;
  parent: number | string | null;
  [key: string]: any;
}
