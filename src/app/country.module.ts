export class Country {
    name: String;
    newConfirmed: number;
    totalConfirmed: number;
    newDeaths: number;
    totalDeaths: number;
    newRecovered: number;
    totalRecovered: number;
    lastUpdate: Date;
    active: number;
    recoveryRate: number;
    mortalityRate: number;

    constructor(
            name: String,
            newConfirmed: number,
            totalConfirmed: number,
            newDeaths: number,
            totalDeaths: number,
            newRecovered: number,
            totalRecovered: number,
            lastUpdated: Date) {
        this.name = name
        this.newConfirmed = newConfirmed
        this.totalConfirmed = totalConfirmed
        this.newDeaths = newDeaths
        this.totalDeaths = totalDeaths
        this.newRecovered = newRecovered
        this.totalRecovered = totalRecovered
        this.lastUpdate = lastUpdated
        this.active = totalConfirmed - totalRecovered - totalDeaths
        // TODO: round 2 digits
        this.recoveryRate = 100 / totalConfirmed * totalRecovered
        this.mortalityRate = 100 / totalConfirmed * totalDeaths
    }
}



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