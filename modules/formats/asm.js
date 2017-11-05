const sizeLookup = {
    'b': 1,
    'w': 2,
    'l': 4,
};

export function asmToBin(buffer) {

    const asm = buffer.toString()
        .replace(/\$|even|(;(.*?)$)/gm, '') // remove comments / even / $ (assume no decimal)
        .replace(/(^\s*$)/gm, ''); // remove empty lines

    // split into labels/data
    // double comment char used to indicate start of line
    const sections = (asm
        .replace(/^\S/gm, (d) => `;;${d}`)
        .replace(/\n/gm, '') + ';')
        .match(/;.*?:.*?;/g)
        .map((d) => d.replace(/;/g, '').split(':'));

    // calculate pointer for each label
    let dataIndex = 0;
    const pointerMap = {};
    sections.forEach(([label, data]) => {
        pointerMap[label] = dataIndex;
        // insert newlines to split on
        const lines = data.split('dc').join('\ndc').split('\n');
        lines.forEach((line) => {
            const sizeMatch = line.match(/dc\.(b|w|l)/);
            if (sizeMatch) {
                const size = sizeLookup[sizeMatch[1]];
                const fragments = line.split(',');
                dataIndex += size * fragments.length;
            }
        });
    });

    const bytes = [];

    // now just convert the data sections
    asm.replace(/^(.*?):/gm, '')
        .split('\n')
        .forEach((line) => {
            const sizeMatch = line.match(/dc\.(b|w|l)/);
            if (sizeMatch) {
                const size = sizeLookup[sizeMatch[1]];
                const fragments = line.replace(/dc\.(b|w|l)|\s/g, '').split(',');

                // save each fragment into byte array based on size
                fragments.forEach((fragment) => {
                    if (~fragment.indexOf('-')) {
                        // if data is calculated from labels
                        const [lVal, rVal] = fragment.split('-');
                        let pointer = (pointerMap[lVal] - pointerMap[rVal]);
                        let pointerBytes = [];
                        for (let i = 0; i < size; i++) {
                            pointerBytes.unshift(pointer & 0xFF);
                            pointer = pointer >> 8;
                        }
                        bytes.push(...pointerBytes);
                    }
                    else {
                        let hex = parseInt(fragment, 16);
                        let fragmentBytes = [];
                        for (let i = 0; i < size; i++) {
                            fragmentBytes.unshift(hex & 0xFF);
                            hex = hex >> 8;
                        }
                        bytes.push(...fragmentBytes);
                    }
                });

            }
        });

    return bytes;
}

export function stuffToAsm(headers, frames, name) {
    return '';
}
