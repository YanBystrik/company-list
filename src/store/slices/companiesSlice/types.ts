export type CompanyEntity = {
  id: number;
  name: string;
  address: string;
};

export type CompaniesState = {
  companies: CompanyEntity[];
};
