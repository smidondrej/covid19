export class SummaryData {  
    Global: GlobalData;  
    Countries: Array<CountryData>;  
    Date: Date;  
}  
  
export class GlobalData {  
    NewConfirmed: number;  
    NewDeaths: number;  
    NewRecovered: number;  
    TotalConfirmed: number;  
    TotalDeaths: number;  
    TotalRecovered: number  
}  
  
export class CountryData extends GlobalData {  
    Country: string;  
    CountryCode: string;  
    Date: Date;  
    Slug: string  
}

export class CountryByDayData {
    Country: string;
    CountryCode: string;
    Province: string;
    City: string;
    CityCode: string;
    Lat: string;
    Lon: string;
    Confirmed: number;
    Deaths: number;
    Recovered: number;
    Active: number;
    Date: Date;
}