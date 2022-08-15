import SModel from "./SModel";
import SSocket from 'servisofts-socket';
export default abstract class SAction {
    model: SModel<any, any>
    constructor(_model) {
        this.model = _model;
        // this.store = this.model.store;
    }
    _dispatch(obj) {
        this.model?.store?.dispatch(obj);
    }
    _getState() {
        return this.model?.store?.getState();
    }
    _getReducer() {
        const state = this._getState();
        if (!state) return null;
        var name: any = this.model.info.component;
        return state[name + "Reducer"];
    }
    getAll(extra = {}) {
        var reducer = this._getReducer();
        const data = reducer?.data;
        if (!data) {
            if (reducer.estado == "cargando") return null;
            const petition = {
                ...this.model.info,
                type: "getAll",
                estado: "cargando",
                ...extra
            }
            SSocket.send(petition);
            return null;
        }
        return data;

    }
    getByKey(key, extra = {}) {
        var data = this.getAll(extra);
        if (!data) return null;
        return data[key];
    }
    async registro(extra = {}) {
        return new Promise((resolve, reject) => {
            const petition = {
                ...this.model.info,
                type: "registro",
                estado: "cargando",
                ...extra
            }
            SSocket.sendPromise(petition).then((resp) => {
                this._dispatch(resp);
                resolve(resp);
            }).catch(e => {
                reject(e);
            });
        });
    }
    async editar(extra = {}) {
        return new Promise((resolve, reject) => {
            const petition = {
                ...this.model.info,
                type: "editar",
                estado: "cargando",
                ...extra
            }
            SSocket.sendPromise(petition).then((resp) => {
                this._dispatch(resp);
                resolve(resp);
            }).catch(e => {
                reject(e);
            });
        });
    }
    async eliminar(extra = {}) {
        return new Promise((resolve, reject) => {
            const petition = {
                ...this.model.info,
                type: "eliminar",
                estado: "cargando",
                ...extra
            }
            SSocket.sendPromise(petition).then((resp) => {
                this._dispatch(resp);
                resolve(resp);
            }).catch(e => {
                reject(e);
            });
        });
    }

    CLEAR() {
        this._dispatch({
            ...this.model.info,
            "type": "CLEAR",
        })
    }

    TEST() {
        this._dispatch({
            ...this.model.info,
            "type": "TEST",
        })
    }
}