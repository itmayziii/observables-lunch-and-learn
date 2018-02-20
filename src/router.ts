import { TypeAheadPage } from "./pages/type-ahead-page";
import { HomePage } from "./pages/home-page";
import { CityService } from "./city-service";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { FunWithDataPage } from "./pages/fun-with-data-page";

export class Router {
    private _rootEl: HTMLElement;
    private pages: any = {
        '/': HomePage,
        '/type-ahead': TypeAheadPage,
        '/fun-with-data': FunWithDataPage
    };
    private _routeChangesSubject$: Subject<any>;
    private _routeChanges$: Observable<any>;

    public constructor() {

    }

    public initialize() {
        this._findRootEl();
        this._listenToLinks();

        this._initializePage(location.pathname);

        this._routeChangesSubject$ = new Subject();
        this._routeChanges$ = this._routeChangesSubject$.asObservable();
    }

    public navigate(url: string) {
        const currentUrl = location.pathname;

        this._rootEl.innerHTML = '';
        window.history.pushState('', '', url);

        this._initializePage(url);

        this._routeChangesSubject$.next({
            oldUrl: currentUrl,
            newUrl: url
        });
    }

    public routeChanges(): Observable<any> {
        return this._routeChanges$;
    }

    private _findRootEl() {
        const rootEl = <HTMLElement> document.querySelector('[data-root]');
        if (!rootEl) {
            throw new Error('Router could not find element with selector data-root');
        }

        this._rootEl = rootEl;
    }

    private _listenToLinks() {
        const links = document.querySelectorAll('[data-link]');
        links.forEach((link: HTMLElement) => {
            link.addEventListener('click', (event: Event) => {
                event.preventDefault();
                const target: HTMLElement = <HTMLElement> event.currentTarget;
                this.navigate(target.getAttribute('data-link'));
            });
        });
    }

    private _initializePage(url: string) {
        const page = this.pages[url];

        let pageInstance;
        switch (url) {
            case '/type-ahead':
                const cityService = new CityService();
                pageInstance = new page(cityService);
                break;
            default:
                pageInstance = new page();
        }

        pageInstance.initialize();
    }
}