import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/let';
import { debounceTime } from 'rxjs/operators';
import { ISubscription } from 'rxjs/Subscription';
import { CityService } from "./city-service";

export class TypeAhead {
    private typeAheadEl: HTMLInputElement;
    private typeAheadOptionEl: HTMLElement;
    private typeAheadSubscription: ISubscription;

    public constructor(private cityService: CityService) {
    }

    public initialize(): void {
        this._findTypeAheadEl();
        this._listenToTypeAheadChange();
    }

    private _findTypeAheadEl() {
        const typeAheadEl: HTMLElement = document.querySelector('[data-type-ahead]');
        if (!typeAheadEl) {
            throw new Error('TypeAhead could not find input field elemtn');
        }
        this.typeAheadEl = <HTMLInputElement> typeAheadEl;

        const typeAheadElOptionsName: string = this.typeAheadEl.getAttribute('data-type-ahead');
        const typeAheadOptionsEl: HTMLElement = document.querySelector(`[data-type-ahead-options="${typeAheadElOptionsName}"]`);
        if (!typeAheadOptionsEl) {
            throw new Error('TypeAhead could not find options element');
        }
        this.typeAheadOptionEl = typeAheadOptionsEl;
    }

    private _addClickEventToButtons() {
        const buttons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('button');
        buttons.forEach((button) => {
            button.addEventListener('click', (event: any) => {
                this.typeAheadEl.value = event.currentTarget.innerHTML;
                this.typeAheadOptionEl.innerHTML = '';
            });
        });
    }

    private _listenToTypeAheadChange() {
        const typeAhead$: Observable<KeyboardEvent> = Observable.fromEvent(this.typeAheadEl, 'keyup');
        const debounce = debounceTime(300);

        this.typeAheadSubscription = typeAhead$
            .let(debounce)
            .subscribe((keyboardEvent: KeyboardEvent) => {
                this._searchForCities(keyboardEvent);
            });
    };

    private _searchForCities(keyboardEvent: KeyboardEvent) {
        const citySearch$: Observable<string[]> = this.cityService.searchForCities(this.typeAheadEl.value);
        citySearch$.subscribe((citiesFoundInSearch: string[]) => {
            this._addOptions(citiesFoundInSearch);
        });
    }

    private _addOptions(cities: string[]) {
        this.typeAheadOptionEl.innerHTML = '';

        cities.forEach((city) => {
            const button = document.createElement('button');
            button.classList.add('list-group-item');
            button.classList.add('list-group-item-action');
            button.innerText = city;

            this.typeAheadOptionEl.appendChild(button);
        });

        this._addClickEventToButtons();
    }
}