import { IAccountData } from "./accountData.interface";

export interface IPet {
  id: number;
  name: string;
  age: number;
  size: string;
  description: string;
  picture: string;
  adoptionDate: string;
  adopted: number;
  Donor?:IAccountData
}

export interface IPetPagination {
  count: number;
  rows: IPet[];
}
