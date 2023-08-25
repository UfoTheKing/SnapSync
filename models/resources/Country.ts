export interface Country {
  id: number;
  iso: string;
  name: string;
  nicename: string;
  iso3: string | null;
  numCode: number | null;
  phoneCode: number;

  flag: CountryFlag;
}

export interface CountryFlag {
  dynamicUrl: string;
  default: {
    url: string;
    width: number;
    height: number;
  };
}
