import { GenericChannel, TransportMessage } from 'ts-event-bus'
import { default as axios } from 'axios'

export default class HTTPClientChannel extends GenericChannel {

    constructor() {
        super()
        axios.get('/handshake')
            .then(response => {
                this._connected()
                response.data.forEach(msg => this._messageReceived(msg))
            })
            .catch(error => {
                throw new Error(`Could not setup HTTPClientChanel: ${error}`)
            })
    }

    public send(message: TransportMessage) {
        switch (message.type) {
            case 'error':
            case 'handler_registered':
            case 'response':
                this._error(`Cannot send ${message.type} from client`)
            case 'request':
                axios.post('/message')
                    .then(response => this._messageReceived(response.data))
                    .catch(error => this._error(error))
        }
    }
}