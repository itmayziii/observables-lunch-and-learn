import { TypeAhead } from "./type-ahead";
import { CityService } from "./city-service";

document.addEventListener("DOMContentLoaded", function (event) {
    const cityService = new CityService();
    new TypeAhead(cityService).initialize();
});