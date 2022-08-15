import SAction from "./SAction";
import Action from "./SAction";
import SReducer from "./SReducer";

interface infoInterface {
    service?: String;
    component: String;
    version?: String;
}
type typeColumnValue = "text" | "timestamp" | "time" | "date" | "integer" | "double" | "boolean"
interface ColumnInterface {
    type: typeColumnValue;
    pk?: boolean;
    fk?: string;
    notNull?: boolean;
    editable?: boolean;
    label?: string;
}
interface ModelInterface<E, F> {
    info: infoInterface;
    pk?: string;
    Columns?: { [index: string]: ColumnInterface };
    image?: { api?: string, name?: string };
    Action: E;
    Reducer: F;
}
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
const getParamNames = (func) => {
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null) {
        result = [];
    } else {
        var final = [];
        result.map(name => {
            if (name.indexOf("_ref") > -1) {
                console.log("Es ref")
                console.log(fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES))
            }
            final.push(name);
        })
    }
    return result;
}
export default class SModel<T extends SAction, U extends SReducer> implements ModelInterface<T, U> {

    static _models;
    static declare(Model: { [index: string]: SModel<any, any> }) {
        this._models = Model;
        const TEST = () => {
            Object.values(Model).map((obj) => {
                obj.Action.TEST();
            })
        }
        const CLEAR = () => {
            Object.values(Model).map((obj) => {
                obj.Action.CLEAR();
            })
        }
        const setStore = (store) => {
            Object.values(Model).map((obj) => {
                obj.store = store;
            })
        }
        const combineReducers = (reducers) => {
            Object.keys(Model).map((className) => {
                reducers[className + "Reducer"] = Model[className]._Reducer;
            })
            return reducers;
        }
        return {
            _events: {
                setStore,
                combineReducers,
                CLEAR,
                TEST,
            }
        }
    }
    name;
    info: infoInterface;
    Action: T;
    Reducer: U;
    store;
    pk;
    image;
    Columns: { [index: string]: ColumnInterface };
    constructor(props: ModelInterface<any, any>) {
        this.name = props.info.component;
        this.info = {
            version: "1.0",
            ...props.info
        };
        this.image = props.image;
        this.pk = props.pk ?? "key";

        this.Columns = props.Columns;
        if (this.Columns) {
            var pks = Object.keys(this.Columns).filter(k => this.Columns[k].pk);
            if (pks.length > 0) {
                this.pk = pks[0];
            } else {
                console.warn("SModel name " + this.name + " no select pk in Columns ");
            }
        }
        // this.component = props.component;
        // this.version = props.version;
        this.Action = new props.Action(this);
        this.Reducer = new props.Reducer(this);


    }

    _get_image_download_path(apis, key) {
        if (!this.image) return null;
        var api = apis[this.image.api];
        var src = api + this.image.name + "/" + key;
        return src;
    }
    _get_image_upload_path(apis, key) {
        if (!this.image) return null;
        var api = apis[this.image.api];
        var src = api + "upload/" + this.image.name + "/" + key;
        return src;
    }

    _Reducer = (state, action) => {
        if (!state) return this.Reducer.initialState();

        if (action.component == this.info.component) {
            if (action.type == "CLEAR") {
                return this.Reducer.initialState();
            }
            if (action.type == "TEST") {
                return this._test(state, action);
            }
            state.estado = action?.estado;
            state.error = action?.error;
            state.type = action?.type;
            var _function = this._getFunction(action.type);
            if (_function) {
                var result = this.Reducer[_function](state, action);
                if (!result) return { ...state }
                return result;
            }
            return { ...state };
        }
        return state;
    }
    _getFunction(type) {
        var superNames = Object.getOwnPropertyNames(SReducer.prototype);
        var types = Object.getPrototypeOf(this.Reducer);
        var typeNames = Object.getOwnPropertyNames(types);
        var select;
        superNames.map((name_function) => {
            if (name_function == type) {
                select = name_function;
            }
        })
        typeNames.map((name_function) => {
            if (name_function == type) {
                select = name_function;
            }
        })
        return select;
    }
    _getFunctions() {
        var obj = this;
        var pt = Object.getPrototypeOf(obj.Action)
        var ptc = Object.getPrototypeOf(pt)
        var list = []
        list = list.concat(...Object.getOwnPropertyNames(pt), ...Object.getOwnPropertyNames(ptc))
        list = list.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t == value
            ))
        )
        list = list.filter(elm => [
            "constructor",
            "_getState",
            "_dispatch"
        ].indexOf(elm) <= -1)


        var arr = list.map(nameFunc => {
            console.log(nameFunc, getParamNames(obj.Action[nameFunc]))
            // console.log(obj.Action[nameFunc].toString())
            return {
                nameFunc,
            }
        })
        return list;
    }
    _test(state, action) {
        state.test = {
            time: new Date().getTime(),
            passed: true
        }
        return { ...state }
    }
}