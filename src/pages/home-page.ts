export class HomePage {
    private template = `
<div class="row justify-content-center">

    <div class="col-6 text-center">
        <h1>Observables Lunch and Learn</h1>
    </div>

</div>
`;

    public initialize() {
        const innerHtml = document.querySelector('[data-root]').innerHTML = this.template;
    }
}