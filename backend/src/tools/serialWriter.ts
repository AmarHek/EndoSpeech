import SerialPort from 'serialport';

export class SerialWriter {

    arduinoCOMPort = "";
    arduinoSerialPort: SerialPort | undefined;
    charToIntMap = new Map<string, number>();

    constructor() {
        // connect to arduino, this is not "multiple Arduino" safe, make sure there is only one connected
        SerialPort.list().then(ports => {
            ports.forEach(port => {
                const pm = port.manufacturer;
                console.log(port);
                // workaround, if arduino is not installed it will be shown as an USB serial device rather than "Arduino"
                // therefore serialNumber, productId and vendorId of a specific Arduino Micro has been added here
                if (typeof pm !== 'undefined' && (pm.includes('Arduino') ||
                    port.serialNumber?.includes('5&8bb9919') ||
                    port.productId?.includes('8037') ||
                    port.vendorId?.includes('2341')
                )) {
                    this.arduinoCOMPort = port.path;
                }
            })

            if (this.arduinoCOMPort) {
                this.arduinoSerialPort = new SerialPort(this.arduinoCOMPort, {
                    baudRate: 5000
                });
            }
        });

        this.initMap();
    }

    /**
     * init Map character map for serial only those characters are allowed
     * To add new characters here, they need to be added in the Arduino code as well
     * @private
     */
    private initMap(): void {

        //basically ascii with a few exceptions for special characters.
        //Can mainly be done in a loop, but consider the edge case and the german keyboard layout (e.g. 'z','y')
        this.charToIntMap.set('A', 65);
        this.charToIntMap.set('B', 66);
        this.charToIntMap.set('C', 67);
        this.charToIntMap.set('D', 68);
        this.charToIntMap.set('E', 69);
        this.charToIntMap.set('F', 70);
        this.charToIntMap.set('G', 71);
        this.charToIntMap.set('H', 72);
        this.charToIntMap.set('I', 73);
        this.charToIntMap.set('J', 74);
        this.charToIntMap.set('K', 75);
        this.charToIntMap.set('L', 76);
        this.charToIntMap.set('M', 77);
        this.charToIntMap.set('N', 78);
        this.charToIntMap.set('O', 79);
        this.charToIntMap.set('P', 80);
        this.charToIntMap.set('Q', 81);
        this.charToIntMap.set('R', 82);
        this.charToIntMap.set('S', 83);
        this.charToIntMap.set('T', 84);
        this.charToIntMap.set('U', 85);
        this.charToIntMap.set('V', 86);
        this.charToIntMap.set('W', 87);
        this.charToIntMap.set('X', 88);
        this.charToIntMap.set('Y', 90);
        this.charToIntMap.set('Z', 89);

        this.charToIntMap.set('a', 97);
        this.charToIntMap.set('b', 98);
        this.charToIntMap.set('c', 99);
        this.charToIntMap.set('d', 100);
        this.charToIntMap.set('e', 101);
        this.charToIntMap.set('f', 102);
        this.charToIntMap.set('g', 103);
        this.charToIntMap.set('h', 104);
        this.charToIntMap.set('i', 105);
        this.charToIntMap.set('j', 106);
        this.charToIntMap.set('k', 107);
        this.charToIntMap.set('l', 108);
        this.charToIntMap.set('m', 109);
        this.charToIntMap.set('n', 110);
        this.charToIntMap.set('o', 111);
        this.charToIntMap.set('p', 112);
        this.charToIntMap.set('q', 113);
        this.charToIntMap.set('r', 114);
        this.charToIntMap.set('s', 115);
        this.charToIntMap.set('t', 116);
        this.charToIntMap.set('u', 117);
        this.charToIntMap.set('v', 118);
        this.charToIntMap.set('w', 119);
        this.charToIntMap.set('x', 120);
        this.charToIntMap.set('y', 122);
        this.charToIntMap.set('z', 121);

        this.charToIntMap.set(" ", 32);
        this.charToIntMap.set("ß", 45);
        this.charToIntMap.set("Ä", 34);
        this.charToIntMap.set("ä", 39);
        this.charToIntMap.set("Ö", 58);
        this.charToIntMap.set("ö", 59);

        this.charToIntMap.set("Ü", 35);
        this.charToIntMap.set("ü", 36);

        this.charToIntMap.set(",", 44);
        this.charToIntMap.set(".", 46);
        this.charToIntMap.set("-", 47);
        this.charToIntMap.set("%", 37);
        this.charToIntMap.set("=", 41);
        this.charToIntMap.set("+", 93);

        this.charToIntMap.set("0", 48);
        this.charToIntMap.set("1", 49);
        this.charToIntMap.set("2", 50);
        this.charToIntMap.set("3", 51);
        this.charToIntMap.set("4", 52);
        this.charToIntMap.set("5", 53);
        this.charToIntMap.set("6", 54);
        this.charToIntMap.set("7", 55);
        this.charToIntMap.set("8", 56);
        this.charToIntMap.set("9", 57);

    }


    /**
     * transform a string to array of integer, based on the dictionary map
     *
     * @param text
     * @private
     */
    private transform(text: string): number[] {
        const codes: number[] = [];
        const chars = text.split('');

        chars.forEach(c => {
            if (this.charToIntMap.has(c)) {
                const value = this.charToIntMap.get(c);
                if (value)
                    codes.push(value);
            }
        })

        return codes;
    }

    /**
     * Text is transformed into an array of numbers and transmitted to the arduino
     *
     * @param text to transmit to arduino
     */
    public write(text: string): void {
        const values = this.transform(text);
        if (this.arduinoSerialPort) {
            this.arduinoSerialPort.write(values);
        }
    }
}
