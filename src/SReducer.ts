import SModel from "./SModel";

export default abstract class SReducer {
    model: SModel<any, any>
    constructor(_model) {
        this.model = _model;
    }
    initialState(extra = {}): any {
        return {
            service: this.model.info.service,
            component: this.model.info.component,
            version: this.model.info.version,
            ...extra
        }
    }
    // getAll(state, action) {
    //     if (action.estado == "exito") {
    //         state.data = action.data;
    //     }
    // }

    // Actualice el 8 de julio de 2023, ricky paz d.
    getAll(state: any, action: any): void {
        if (action.estado == "exito") {
            if (action.data && typeof action.data == "object") {
                if (Array.isArray(action.data)) {
                    state.data = {};
                    action.data.map((o) => state.data[o[this.model.pk]] = o);
                    return;
                }
            }
            state.data = action.data;
        }
    }
    registro(state, action) {
        if (action.estado == "exito") {
            if (state.data) {
                state.data[action.data[this.model.pk]] = action.data;
            }
        }
    }
    editar(state, action) {
        if (action.estado == "exito") {
            if (state.data) {
                state.data[action.data[this.model.pk]] = action.data;
            }
        }
    }
    extra(state, action) {

    }
}