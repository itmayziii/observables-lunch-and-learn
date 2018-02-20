import { Router } from "./router";

export class Nav {
    public constructor(private router: Router) {
    }

    public initialize() {
        this._handleCurrentRoute();
        this._listenToRouteChanges();
    }

    private _handleCurrentRoute() {
        const currentRoute = location.pathname;
        document.querySelector(`[data-link="${currentRoute}"]`).classList.add('active');
    }

    private _listenToRouteChanges() {
        this.router.routeChanges().subscribe((routeChange) => {
            const {oldUrl, newUrl} = routeChange;
            document.querySelector(`[data-link="${oldUrl}"]`).classList.remove('active');
            document.querySelector(`[data-link="${newUrl}"]`).classList.add('active');
        });
    }
}