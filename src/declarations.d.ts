
declare module "\*.json" {
    const content: any;
    export default content;
}

declare module 'servisofts-socket' {
    import SSocket from 'servisofts-socket';
    export default SSocket;
}
declare module 'servisofts-component' {
    export { SButtom, SHr, SImage, SList, SLoad, SNavigation, SPage, SPopup, SText, STheme, SView } from 'servisofts-component';
}
