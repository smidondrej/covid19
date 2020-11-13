export class Country {
    name: String;
    newConfirmed: number;
    totalConfirmed: number;
    newDeaths: number;
    totalDeaths: number;
    newRecovered: number;
    totalRecovered: number;
    lastUpdate: Date;

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
    }
}