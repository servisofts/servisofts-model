
declare module "\*.json" {
    const content: any;
    export default content;
}

declare module 'servisofts-socket' {
    import SSocket from 'servisofts-socket';
    export default SSocket;
}
