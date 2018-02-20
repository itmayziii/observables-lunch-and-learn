import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/let';
import { debounceTime } from 'rxjs/operators';
import { ISubscription } from 'rxjs/Subscription';
import { CityService } from "../city-service";

export class TypeAheadPage {
    private typeAheadEl: HTMLInputElement;
    private typeAheadOptionEl: HTMLElement;
    private typeAheadSubscription: ISubscription;
    private template = `
<div class="row justify-content-center">

    <div class="col-4">

        <form novalidate>
            <div class="form-group">
                <label for="ohio-city">City in Ohio</label>
                <input type="text" class="form-control" id="ohio-city" placeholder="Start typing..." data-type-ahead="cities">
            </div>
        </form>

    </div>
</div>
    
<div class="row justify-content-center">

    <div class="col-4">
        <div class="row">
        
        <div class="list-group col-12" data-type-ahead-options="cities"></div>
        
        </div>
    </div>

</div>
`;

    public constructor(private cityService: CityService) {
    }

    public initialize(): void {
        const innerHtml = document.querySelector('[data-root]').innerHTML = this.template;
        this._findTypeAheadEl();
        this._listenToTypeAheadChange();
    }

    private _findTypeAheadEl() {
        const typeAheadEl: HTMLElement = document.querySelector('[data-type-ahead]');
        if (!typeAheadEl) {
            throw new Error('TypeAhead could not find input field element');
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
        buttons.forEach((button: HTMLButtonElement) => {
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