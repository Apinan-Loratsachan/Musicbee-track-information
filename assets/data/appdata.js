const apikey = [
    '1cfc4e305f1c44b6a0807cc3de69f353',
    '94d43218fd704db69eaa3184a26b11a6'
];

let data_vgmdb, data_spotify, data_inuse, data_inuse_provider

function data_object() {
    console.log('%c[DATA]%c from ' + data_inuse_provider, 'font-weight: bold', '')
    return data_inuse
}