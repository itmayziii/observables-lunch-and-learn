import { cities } from './cities';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/empty';

export class CityService {
    public searchForCities(searchText: string): Observable<string[]> {
        return Observable.create((observer: Observer<string[]>) => {

            // simulate an XHR request
            setTimeout(() => {
                if (searchText === '') {
                    observer.next([]);
                    return;
                }

                const cityWithCapitalLetter = searchText.charAt(0).toUpperCase() + searchText.slice(1);
                const citiesFoundInSearch = cities.filter((city) => city.startsWith(cityWithCapitalLetter));
                observer.next(citiesFoundInSearch);
            }, 100);

        });
    }
}