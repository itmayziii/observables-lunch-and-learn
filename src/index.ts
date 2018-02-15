import { TypeAhead } from "./type-ahead";
import { CityService } from "./city-service";
import { dataManipulation } from "./data-manipulation";

document.addEventListener("DOMContentLoaded", function (event) {
    const cityService = new CityService();
    new TypeAhead(cityService).initialize();
    dataManipulation();
});