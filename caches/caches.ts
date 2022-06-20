class Table {
    public readonly element: HTMLTableElement = document.createElement('table');

    private readonly _data: string[][] = [];

    private readonly _rows: Row[] = [];

    public readonly _header?: Row;

    public get numRows(): number {
        return this._data.length;
    }

    public get numColumns(): number {
        return this._data.at(0)?.length ?? 0;
    }

    public constructor(data?: string[][], headerRow?: string[], verticalHeaderRow?: boolean) {
        if (data) this._data = data;

        if (headerRow !== undefined && !verticalHeaderRow) {
            this._header = new Row(this, headerRow);
        }

        const columnHeader =
            headerRow !== undefined && verticalHeaderRow ? (i: number) => headerRow[i] : () => undefined;

        if (data) {
            for (let i = 0; i < data.length; i++) {
                this._rows.push(new Row(this, data[i], columnHeader(i)));
            }
        }
    }

    public getCellAt(row: number, column: number): Cell {
        return this._rows[row].cells[column];
    }

    public getColumn(column: number): Cell[] {
        return this._rows.map(({ cells }) => cells[column]);
    }

    public getRow(row: number): Row {
        return this._rows[row];
    }
}

class Row {
    public readonly element: HTMLTableRowElement = document.createElement('tr');
    public readonly cells: Cell[] = [];

    public constructor({ element, numColumns }: Table, initialValues?: string[], headerData?: string) {
        if (headerData !== undefined) {
            this.element.appendChild(new Cell(this, headerData).element);
        }

        element.appendChild(this.element);
        for (let i = 0; i < numColumns; i++) {
            this.addCell(initialValues?.at(i));
        }
    }

    public addCell(initialValue?: string): number {
        return this.cells.push(new Cell(this, initialValue));
    }
}

class Cell {
    public readonly element: HTMLTableCellElement = document.createElement('td');

    public constructor({ element }: Row, initialValue?: string) {
        element.appendChild(this.element);
        if (initialValue !== undefined) {
            this.setValue(initialValue);
        }
    }

    public setValue(v: string): void {
        this.element.innerText = v;
    }
}

interface CacheItem {
    address: number;
    localCounter: number;
}

class DummyCache<T> {
    public readonly data: Array<T | null>;

    public constructor(size: number) {
        this.data = new Array<T | null>(size).fill(null);
    }

    public getItemAt(index: number): T | null {
        return this.data[index];
    }

    public setItemAt(index: number, payload: T | null) {
        this.data[index] = payload;
    }

    /**
     * Returns the index of the first empty slot, -1 if none.
     *
     * Fully-associative only.
     */
    public getFirstFreeSlot(): number {
        return this.data.findIndex((e) => e === null);
    }

    /** Fully-associative only. */
    public isFull(): boolean {
        return this.data.every((e) => e !== null);
    }
}

interface EmulatorData {
    addressBusSize: number;
    cacheLines: number;
    wordsPerLine: number;
    bytesPerWord: number;
    hexMode: boolean;
    autoMode: boolean;
    inputData: string;
    cacheType: CacheTypes;
}

enum CacheTypes {
    DirectMapped,
    DirectMappedSimple,
    FullyAssociative,
    SetAssociative,
}

class CacheEmulator {
    private static _autoTimePeriod = 1000;

    public static readonly Defaults: EmulatorData = {
        addressBusSize: 20,
        cacheLines: 32,
        wordsPerLine: 16,
        bytesPerWord: 4,
        hexMode: true,
        autoMode: false,
        inputData: '1273E 12719 12819 1173E 1273F 12839 12710 12800',
        cacheType: CacheTypes.DirectMapped,
    };

    private readonly _container = document.getElementById('cacheEmulation')! as HTMLDivElement;

    private readonly _containers = {
        /** Container for size/parameter inputs, like bus size and bytes per word. */
        inputContainer1: document.createElement('div'),

        /** Container for mode toggles, like hex and auto. */
        inputContainer2: document.createElement('div'),

        /** Container for data input. */
        inputContainer3: document.createElement('div'),

        /** Output for pre-emulation info, like bits for tag and total bytes. */
        preOutput: document.createElement('div'),

        /** Container for showing input data status. */
        inputTableContainer: document.createElement('div'),

        /** Also functions as the 'next' button if auto mode is enabled. */
        goButton: document.createElement('button'),

        /** Container for showing information about cache, like hits and misses. */
        outputDetailsContainer: document.createElement('div'),

        /** Container for displaying cache table(s). */
        outputTableContainer: document.createElement('div'),
    };

    private readonly _inputElements: Record<keyof EmulatorData, HTMLInputElement | HTMLSelectElement> = {
        addressBusSize: this.createInputElement({
            label: 'Address bus size (bits): ',
            type: 'number',
            parent: this._containers.inputContainer1,
            onInput: this.setAddressBusSize,
        }),
        cacheLines: this.createInputElement({
            label: 'Number of cache lines: ',
            title: 'This changes index bits required',
            type: 'number',
            classes: ['indexBits'],
            parent: this._containers.inputContainer1,
            onInput: this.setCacheLines,
        }),
        wordsPerLine: this.createInputElement({
            label: 'Words per line: ',
            classes: ['offsetBits'],
            title: 'This changes offset bits required',
            type: 'number',
            parent: this._containers.inputContainer1,
            onInput: this.setWordsPerLine,
        }),
        bytesPerWord: this.createInputElement({
            label: 'Bytes per word: ',
            classes: ['offsetBits'],
            title: 'This changes offset bits required',
            type: 'number',
            parent: this._containers.inputContainer1,
            onInput: this.setBytesPerWord,
        }),
        hexMode: this.createInputElement({
            label: 'Hex mode',
            type: 'checkbox',
            parent: this._containers.inputContainer2,
            title: 'Will read all inputs as hexadecimal',
            onInput: this.setHexMode,
        }),
        autoMode: this.createInputElement({
            label: 'Auto mode',
            type: 'checkbox',
            parent: this._containers.inputContainer2,
            title: 'Will automatically go through all insertions',
            onInput: this.setAutoMode,
        }),
        inputData: this.createInputElement({
            label: 'Input data: ',
            parent: this._containers.inputContainer3,
            onInput: this.handleInputData,
        }),
        cacheType: this.createSelectElement({
            label: 'Cache type: ',
            parent: this._containers.inputContainer2,
            onInput: this.handleCacheType,
            options: [
                { text: 'Direct Mapped', value: CacheTypes.DirectMapped },
                { text: 'Direct Mapped (No Spatial Locality)', value: CacheTypes.DirectMappedSimple },
                { text: 'Fully Associative', value: CacheTypes.FullyAssociative },
                { text: '2-Way Set Associative', value: CacheTypes.SetAssociative },
            ],
        }),
    };

    private _data: EmulatorData = this.loadValues();
    private _inputData: number[] = [];

    public constructor() {
        const title = document.createElement('h2');
        title.style.marginBottom = '0';
        title.innerText = 'Cache Emulator';
        this._container.appendChild(title);

        const subtitle = document.createElement('a');
        subtitle.style.marginTop = '0';
        subtitle.style.display = 'inline-block';
        subtitle.href = 'https://github.com/NachoToast';
        subtitle.rel = 'noreferrer';
        subtitle.target = '_blank';
        subtitle.style.marginBottom = '1em';

        subtitle.innerHTML = '<i>By NachoToast</i>';
        this._container.appendChild(subtitle);

        Object.values(this._containers).forEach((e) => {
            this._container.appendChild(e);
        });

        this._containers.inputTableContainer.classList.add('preOutput');
        this._containers.preOutput.classList.add('preOutput');

        this._containers.goButton.disabled = true;
        this._containers.goButton.style.padding = '0.2em 1em';
        this._containers.goButton.style.cursor = 'pointer';
        this._containers.goButton.innerText = 'Go';

        this._containers.outputTableContainer.classList.add('tableContainer');

        this.showIntermediateOutput();
        this.handleInputData();
    }

    public getBitsInfo(): { tag: number; index: number; offset: number; bytesPerLine: number } {
        const bytesPerLine = this._data.bytesPerWord * this._data.wordsPerLine;
        const index = Math.ceil(Math.log2(this._data.cacheLines || 1));
        const offset = Math.ceil(Math.log2(bytesPerLine || 1));
        const tag = this._data.addressBusSize - index - offset;
        return { tag, index, offset, bytesPerLine };
    }

    public setAddressBusSize() {
        const minAddressSize =
            Math.ceil(Math.log2(this._data.cacheLines)) + Math.ceil(Math.log2(this._data.wordsPerLine));

        this._data.addressBusSize = Math.max(
            Number(this._inputElements.addressBusSize.value) ?? this._data.addressBusSize,
            minAddressSize,
        );
        this._inputElements.addressBusSize.value = this._data.addressBusSize.toString();
        this.showIntermediateOutput();
    }

    public setCacheLines() {
        this._data.cacheLines = Number(this._inputElements.cacheLines.value) ?? this._data.cacheLines;
        this._inputElements.cacheLines.value = this._data.cacheLines.toString();
        this.setAddressBusSize();
    }

    public setWordsPerLine() {
        this._data.wordsPerLine = Number(this._inputElements.wordsPerLine.value) ?? this._data.wordsPerLine;
        this._inputElements.wordsPerLine.value = this._data.wordsPerLine.toString();
        this.setAddressBusSize();
    }

    public setBytesPerWord() {
        this._data.bytesPerWord = Number(this._inputElements.bytesPerWord.value) ?? this._data.bytesPerWord;
        this._inputElements.bytesPerWord.value = this._data.bytesPerWord.toString();
        this.setAddressBusSize();
        this.renderInputTable();
    }

    public setHexMode() {
        this._inputElements.hexMode = this._inputElements.hexMode as HTMLInputElement;
        this._data.hexMode = this._inputElements.hexMode.checked;
        this._inputElements.hexMode.checked = this._data.hexMode;
        this.handleInputData();
    }

    public setAutoMode() {
        this._inputElements.autoMode = this._inputElements.autoMode as HTMLInputElement;
        this._data.autoMode = this._inputElements.autoMode.checked;
        this._inputElements.autoMode.checked = this._data.autoMode;
    }

    public handleInputData() {
        this._data.inputData = this._inputElements.inputData.value;
        const rawData = this._inputElements.inputData.value.split(/,?\s+/g);
        if (this._data.hexMode) {
            this._inputData = rawData.map((e) => parseInt(e, 16)).filter((e) => !Number.isNaN(e));
        } else {
            this._inputData = rawData.map((e) => parseInt(e)).filter((e) => !Number.isNaN(e));
        }
        this.renderInputTable();
    }

    public handleCacheType() {
        this._data.cacheType = Number(this._inputElements.cacheType.value);
    }

    public renderInputTable() {
        this._containers.inputTableContainer.innerHTML = '';
        if (!this._inputData.length) {
            this._containers.goButton.disabled = true;
            return;
        }
        this._containers.goButton.disabled = false;

        const tableData = new Array<string[]>(3);
        tableData[0] = new Array<string>(this._inputData.length).fill('').map((_, i) => (i + 1).toString()); // sequence #
        tableData[1] = this._inputData.map((e) => this.parseString(e)); // address
        tableData[2] = new Array<string>(this._inputData.length); // hit/miss (i guess they never miss huh?)

        const table = new Table(tableData, ['Sequence #', 'Address', 'Hit/Miss'], true);
        this._containers.inputTableContainer.appendChild(table.element);

        this._containers.goButton.onclick = () => this.start(table);
    }

    public async start(inputTable: Table): Promise<void> {
        this._containers.goButton.onclick = null;
        this._containers.outputTableContainer.innerHTML = '';
        inputTable.getRow(2).cells.forEach((e) => e.setValue(''));
        if (this._data.autoMode) {
            this._containers.goButton.style.visibility = 'hidden';
        } else {
            this._containers.goButton.innerText = 'Next Step';
        }

        Object.values(this._inputElements).forEach((e) => (e.disabled = true));

        switch (this._data.cacheType) {
            case CacheTypes.DirectMapped:
                await this.doDirectMapped(inputTable);
                break;
            case CacheTypes.FullyAssociative:
                await this.doFullyAssociative(inputTable);
                break;
            case CacheTypes.SetAssociative:
                await this.doSetAssociative(inputTable);
                break;
            case CacheTypes.DirectMappedSimple:
                await this.doDirectMappedSimple(inputTable);
                break;
            default:
                throw new Error(`Unexpected cache type: ${this._data.cacheType}`);
        }

        if (this._data.autoMode) {
            this._containers.goButton.style.visibility = 'visible';
        } else {
            this._containers.goButton.innerText = 'Go';
            this._containers.goButton.onclick = () => this.start(inputTable);
        }

        Object.values(this._inputElements).forEach((e) => (e.disabled = false));
    }

    public async doFullyAssociative(inputTable: Table): Promise<void> {
        const tableData: string[][] = new Array<string[]>(this._data.cacheLines).fill([]).map((_, i) => {
            const row = new Array<string>(3);
            row[0] = i.toString();
            return row;
        });

        const cacheTable = new Table(tableData, ['Line #', 'Address', 'Local Counter']);

        this._containers.outputTableContainer.appendChild(cacheTable.element);

        const cache = new DummyCache<CacheItem>(this._data.cacheLines);
        let globalCounter = 0;

        for (let i = 0, len = this._inputData.length; i < len; i++) {
            globalCounter++;
            const output: string[] = [
                `Sequence <b>#${i + 1}</b>: ${this.parseString(this._inputData[i])}`,
                `Global Counter: <b>${globalCounter}</b>`,
                `Searching all lines for ${this.parseString(this._inputData[i])}`,
            ];
            const tableColumn = inputTable.getColumn(i);
            tableColumn.forEach(({ element: { classList } }) => classList.add('selected'));
            this._containers.outputDetailsContainer.innerHTML = output.join('<br />');
            await this.wait();
            output.pop();

            let cellsModified: Cell[];

            const index = cache.data.findIndex((e) => e?.address === this._inputData[i]);
            if (index !== -1) {
                // hit
                inputTable.getCellAt(2, i).setValue('H');
                cache.setItemAt(index, { address: this._inputData[i], localCounter: globalCounter });
                cacheTable
                    .getRow(index)
                    .cells.forEach(({ element: { classList } }) => classList.add('selected', 'good'));
                cellsModified = cacheTable.getRow(index).cells;
                cacheTable.getRow(index).element.scrollIntoView({ behavior: 'smooth' });
                cacheTable.getCellAt(index, 2).setValue(globalCounter.toString());
                output.push('<i>Hit, updated local counter</i>');
            } else if (!cache.isFull()) {
                // compulsory miss
                inputTable.getCellAt(2, i).setValue('M');
                const addedIndex = cache.getFirstFreeSlot();
                cache.setItemAt(addedIndex, { address: this._inputData[i], localCounter: globalCounter });
                cacheTable.getCellAt(addedIndex, 1).setValue(this.parseString(this._inputData[i]));
                cacheTable.getCellAt(addedIndex, 2).setValue(globalCounter.toString());
                cacheTable
                    .getRow(addedIndex)
                    .cells.forEach(({ element: { classList } }) => classList.add('selected', 'neutral'));
                cellsModified = cacheTable.getRow(addedIndex).cells;
                cacheTable.getRow(addedIndex).element.scrollIntoView({ behavior: 'smooth' });
                output.push(`<i>Compulsory miss, added new address to line ${addedIndex}</i>`);
            } else {
                // capacity miss
                // we don't get conflicy misses on fully-associative caches
                inputTable.getCellAt(2, i).setValue('M');
                const allLocalCounters = cache.data.map((e) => e?.localCounter ?? Infinity);
                const indexOfLowest = allLocalCounters.indexOf(Math.min(...allLocalCounters));

                const removedItem = cache.getItemAt(indexOfLowest)!;
                cache.setItemAt(indexOfLowest, { address: this._inputData[i], localCounter: globalCounter });
                cacheTable.getCellAt(indexOfLowest, 1).setValue(this.parseString(this._inputData[i]));
                cacheTable.getRow(indexOfLowest).element.scrollIntoView({ behavior: 'smooth' });
                cacheTable
                    .getRow(indexOfLowest)
                    .cells.forEach(({ element: { classList } }) => classList.add('selected', 'bad'));
                cellsModified = cacheTable.getRow(indexOfLowest).cells;
                cacheTable.getCellAt(indexOfLowest, 2).setValue(globalCounter.toString());
                output.push(
                    `<i>Capacity miss, removed ${this.parseString(removedItem.address)} (had lowest local counter, ${
                        removedItem.localCounter
                    })</i>`,
                );
            }

            // displaying output information for this step
            this._containers.outputDetailsContainer.innerHTML = output.join('<br />');
            await this.wait();

            // unhighlighting
            tableColumn.forEach(({ element: { classList } }) => classList.remove('selected'));
            cellsModified.forEach(({ element: { classList } }) =>
                classList.remove('selected', 'bad', 'neutral', 'good'),
            );
        }
    }

    public async doDirectMapped(inputTable: Table): Promise<void> {
        const { tag, index, offset } = this.getBitsInfo();

        const tableData: string[][] = new Array<string[]>(this._data.cacheLines).fill([]).map((_, i) => {
            const row = new Array<string>(3);
            row[0] = i.toString();
            return row;
        });

        const cacheTable = new Table(tableData, ['Line #', 'Address Range', 'Tag']);

        this._containers.outputTableContainer.appendChild(cacheTable.element);

        const cache = new Array<{ lowest: number; highest: number; tag: number }>(this._data.cacheLines);

        for (let i = 0, len = this._inputData.length; i < len; i++) {
            const output: string[] = [`Sequence <b>#${i + 1}</b>: ${this.parseString(this._inputData[i])}`];
            const tableColumn = inputTable.getColumn(i);
            tableColumn.forEach(({ element: { classList } }) => classList.add('selected'));

            // obtain lowest and highest address to fill in, for spatial locality info displaying
            const queriedAddress = this._inputData[i];
            const lowestAddress = (this._inputData[i] >> offset) << offset;
            const highestAddress = this._inputData[i] | (2 ** offset - 1);

            output.push(
                `<div class='addressInfoContainer'>
                    <div><span class="addressInfo">Queried address</span> = ${this.parseString(
                        queriedAddress,
                    )} = ${this.parseToBinary(queriedAddress)}</div>
                    <div><span class="addressInfo">Lowest address</span> = ${this.parseString(
                        lowestAddress,
                    )} = ${this.parseToBinary(lowestAddress)}</div>
                    <div><span class="addressInfo">Highest address</span> = ${this.parseString(
                        highestAddress,
                    )} = ${this.parseToBinary(highestAddress)}</div>
                    </div>`,
            );

            // extract tag, line number, and offset values from address
            const tagNumber = queriedAddress >> (this._data.addressBusSize - tag);
            const lineNumber = (queriedAddress >> offset) & (2 ** index - 1);
            const actualLineNumber = lineNumber % this._data.cacheLines;
            const offsetValue = queriedAddress & (2 ** offset - 1);

            output.push(
                `Tag = <span class="tagBits">${tagNumber.toString(2).padStart(tag, '0')}</span> = <b>${tagNumber}</b>`,
                `Index (Line) = <span class="indexBits">${lineNumber
                    .toString(2)
                    .padStart(index, '0')}</span> = <span class="indexBits">${lineNumber}</span> % ${
                    this._data.cacheLines
                } = <b>${actualLineNumber}</b>`,
                `Offset (Column) = <span class="offsetBits">${offsetValue
                    .toString(2)
                    .padStart(offset, '0')}</span> = <b>${offsetValue}</b>`,
            );

            // highlighting search row on the table element
            const searchRow = cacheTable.getRow(lineNumber);
            searchRow.cells.forEach(({ element: { classList } }) => classList.add('selected'));
            output.push(`<i>Checking line number ${lineNumber} for items with tag ${tag}</i>`);
            searchRow.element.scrollIntoView({ behavior: 'smooth' });
            this._containers.outputDetailsContainer.innerHTML = output.join('<br />');
            await this.wait();
            output.pop();

            const existingItem = cache[lineNumber];

            if (existingItem === undefined) {
                // compulsory miss
                inputTable.getCellAt(2, i).setValue('M');
                output.push(`<i>Compulsory miss, populated line ${lineNumber}</i>`);
                searchRow.cells.forEach(({ element: { classList } }) => classList.add('neutral'));
                cache[lineNumber] = { lowest: lowestAddress, highest: highestAddress, tag: tagNumber };
                searchRow.cells[1].setValue(
                    `${this.parseString(lowestAddress)} .. ${this.parseString(highestAddress)}`,
                );
                searchRow.cells[2].setValue(tagNumber.toString());
            } else if (existingItem.tag === tagNumber) {
                // hit
                inputTable.getCellAt(2, i).setValue('H');
                output.push('<i>Hit, tag number matches</i>');
                searchRow.cells.forEach(({ element: { classList } }) => classList.add('good'));
            } else {
                // conflict miss
                // we don't get capacity misses on direct-mapped caches
                inputTable.getCellAt(2, i).setValue('M');
                output.push(
                    `<i>Conflict miss (tag at line ${lineNumber} is ${existingItem.tag}, expected ${tagNumber}), repopulated line ${lineNumber}</i>`,
                );
                searchRow.cells.forEach(({ element: { classList } }) => classList.add('bad'));
                cache[lineNumber] = { lowest: lowestAddress, highest: highestAddress, tag: tagNumber };
                searchRow.cells[1].setValue(
                    `${this.parseString(lowestAddress)} .. ${this.parseString(highestAddress)}`,
                );
                searchRow.cells[2].setValue(tagNumber.toString());
            }

            // displaying output information for this step
            this._containers.outputDetailsContainer.innerHTML = output.join('<br />');
            await this.wait();

            // unhighlighting
            tableColumn.forEach(({ element: { classList } }) => classList.remove('selected'));
            searchRow.cells.forEach(({ element: { classList } }) =>
                classList.remove('selected', 'bad', 'neutral', 'good'),
            );
        }
    }

    public async doDirectMappedSimple(inputTable: Table): Promise<void> {
        const tableData: string[][] = new Array<string[]>(this._data.cacheLines).fill([]).map((_, i) => {
            const row = new Array<string>(2);
            row[0] = i.toString();
            return row;
        });

        const cacheTable = new Table(tableData, ['Line #', 'Address']);
        this._containers.outputTableContainer.appendChild(cacheTable.element);

        const cache = new DummyCache<number>(this._data.cacheLines);

        for (let i = 0, len = this._inputData.length; i < len; i++) {
            const slotNumber = this._inputData[i] % this._data.cacheLines;

            const output: string[] = [
                `Sequence <b>#${i + 1}</b>: ${this.parseString(this._inputData[i])}`,
                `Slot # = ${this.parseString(this._inputData[i])} % ${this._data.cacheLines} = <b>${this.parseString(
                    slotNumber,
                )}</b>`,
            ];

            const tableColumn = inputTable.getColumn(i);
            tableColumn.forEach(({ element: { classList } }) => classList.add('selected'));
            this._containers.outputDetailsContainer.innerHTML = output.join('<br />');
            await this.wait();
            output.pop();

            let cellsModified: Cell[];

            const existing = cache.getItemAt(slotNumber);
            if (existing !== null && existing === this._inputData[i]) {
                // hit
                inputTable.getCellAt(2, i).setValue('H');
                cacheTable
                    .getRow(slotNumber)
                    .cells.forEach(({ element: { classList } }) => classList.add('selected', 'good'));
                cellsModified = cacheTable.getRow(slotNumber).cells;
                cacheTable.getRow(slotNumber).element.scrollIntoView({ behavior: 'smooth' });
                output.push('<i>Hit</i>');
            } else if (existing === null) {
                // compulsory miss, able to put in left cache
                inputTable.getCellAt(2, i).setValue('M');
                cache.setItemAt(slotNumber, this._inputData[i]);
                cacheTable.getCellAt(slotNumber, 1).setValue(this.parseString(this._inputData[i]));
                cacheTable
                    .getRow(slotNumber)
                    .cells.forEach(({ element: { classList } }) => classList.add('selected', 'neutral'));
                cellsModified = cacheTable.getRow(slotNumber).cells;
                cacheTable.getRow(slotNumber).element.scrollIntoView({ behavior: 'smooth' });
                output.push(`<i>Compulsory miss, added new address to line ${slotNumber}</i>`);
            } else {
                // conflict miss
                // we don't get capacity misses on direct-mapped caches
                inputTable.getCellAt(2, i).setValue('M');
                cache.setItemAt(slotNumber, this._inputData[i]);
                cacheTable.getCellAt(slotNumber, 1).setValue(this.parseString(this._inputData[i]));
                output.push(`<i>Conflict miss, replaced ${this.parseString(existing)} on line ${slotNumber}</i>`);
                cacheTable
                    .getRow(slotNumber)
                    .cells.forEach(({ element: { classList } }) => classList.add('selected', 'bad'));
                cellsModified = cacheTable.getRow(slotNumber).cells;
            }

            // displaying output information for this step
            this._containers.outputDetailsContainer.innerHTML = output.join('<br />');
            await this.wait();

            // unhighlighting
            tableColumn.forEach(({ element: { classList } }) => classList.remove('selected'));
            cellsModified.forEach(({ element: { classList } }) =>
                classList.remove('selected', 'bad', 'neutral', 'good'),
            );
        }
    }

    public async doSetAssociative(inputTable: Table): Promise<void> {
        if (this._data.cacheLines % 2 !== 0) {
            this._containers.outputDetailsContainer.innerHTML =
                '<span style="color: red">Cache size (number of lines) must be even for 2-way set associative caching</span>';
            return;
        }

        const leftTableData: string[][] = new Array<string[]>(this._data.cacheLines / 2).fill([]).map((_, i) => {
            const row = new Array<string>(3);
            row[0] = i.toString();
            return row;
        });

        const rightTableData: string[][] = new Array<string[]>(this._data.cacheLines / 2).fill([]).map((_, i) => {
            const row = new Array<string>(3);
            row[0] = i.toString();
            return row;
        });

        const leftTable = new Table(leftTableData, ['Line #', 'Address', 'Local Counter']);
        const rightTable = new Table(rightTableData, ['Line #', 'Address', 'Local Counter']);

        leftTable.element.style.width = '40%';
        rightTable.element.style.width = '40%';

        const blockContainer = document.createElement('div');
        blockContainer.style.display = 'flex';
        blockContainer.style.justifyContent = 'space-evenly';
        blockContainer.appendChild(leftTable.element);
        blockContainer.appendChild(rightTable.element);
        this._containers.outputTableContainer.appendChild(blockContainer);

        const leftCache = new DummyCache<CacheItem>(this._data.cacheLines / 2);
        const rightCache = new DummyCache<CacheItem>(this._data.cacheLines / 2);
        let globalCounter = 0;

        for (let i = 0, len = this._inputData.length; i < len; i++) {
            globalCounter++;
            const slotNumber = this._inputData[i] % (this._data.cacheLines / 2);

            const output: string[] = [
                `Sequence <b>#${i + 1}</b>: ${this.parseString(this._inputData[i])}`,
                `Global Counter: <b>${globalCounter}</b>`,
                `Slot # = ${this.parseString(this._inputData[i])} % ${this._data.cacheLines / 2} = ${this.parseString(
                    slotNumber,
                )}`,
            ];

            const tableColumn = inputTable.getColumn(i);
            tableColumn.forEach(({ element: { classList } }) => classList.add('selected'));
            this._containers.outputDetailsContainer.innerHTML = output.join('<br />');
            await this.wait();
            output.pop();

            const existingLeft = leftCache.getItemAt(slotNumber);
            const existingRight = rightCache.getItemAt(slotNumber);
            let cellsModified: Cell[];

            if (existingLeft?.address === this._inputData[i]) {
                // hit left cache
                inputTable.getCellAt(2, i).setValue('H');
                leftCache.setItemAt(slotNumber, { address: this._inputData[i], localCounter: globalCounter });
                leftTable
                    .getRow(slotNumber)
                    .cells.forEach(({ element: { classList } }) => classList.add('selected', 'good'));
                cellsModified = leftTable.getRow(slotNumber).cells;
                leftTable.getRow(slotNumber).element.scrollIntoView({ behavior: 'smooth' });
                leftTable.getCellAt(slotNumber, 2).setValue(globalCounter.toString());
                output.push('<i>Hit left table (set 0), updated local counter</i>');
            } else if (existingRight?.address === this._inputData[i]) {
                // hit right cache
                inputTable.getCellAt(2, i).setValue('H');
                rightCache.setItemAt(slotNumber, { address: this._inputData[i], localCounter: globalCounter });
                rightTable
                    .getRow(slotNumber)
                    .cells.forEach(({ element: { classList } }) => classList.add('selected', 'good'));
                cellsModified = rightTable.getRow(slotNumber).cells;
                rightTable.getRow(slotNumber).element.scrollIntoView({ behavior: 'smooth' });
                rightTable.getCellAt(slotNumber, 2).setValue(globalCounter.toString());
                output.push('<i>Hit right table (set 1), updated local counter</i>');
            } else if (existingLeft === null) {
                // compulsory miss, able to put in left cache
                inputTable.getCellAt(2, i).setValue('M');
                leftCache.setItemAt(slotNumber, { address: this._inputData[i], localCounter: globalCounter });
                leftTable.getCellAt(slotNumber, 1).setValue(this.parseString(this._inputData[i]));
                leftTable.getCellAt(slotNumber, 2).setValue(globalCounter.toString());
                leftTable
                    .getRow(slotNumber)
                    .cells.forEach(({ element: { classList } }) => classList.add('selected', 'neutral'));
                cellsModified = leftTable.getRow(slotNumber).cells;
                leftTable.getRow(slotNumber).element.scrollIntoView({ behavior: 'smooth' });
                output.push(`<i>Compulsory miss, added new address to line ${slotNumber} (set 0)</i>`);
            } else if (existingRight === null) {
                // compulsory miss, able to put in right cache
                inputTable.getCellAt(2, i).setValue('M');
                rightCache.setItemAt(slotNumber, { address: this._inputData[i], localCounter: globalCounter });
                rightTable.getCellAt(slotNumber, 1).setValue(this.parseString(this._inputData[i]));
                rightTable.getCellAt(slotNumber, 2).setValue(globalCounter.toString());
                rightTable
                    .getRow(slotNumber)
                    .cells.forEach(({ element: { classList } }) => classList.add('selected', 'neutral'));
                cellsModified = rightTable.getRow(slotNumber).cells;
                rightTable.getRow(slotNumber).element.scrollIntoView({ behavior: 'smooth' });
                output.push(`<i>Compulsory miss, added new address to line ${slotNumber} (set 1)</i>`);
            } else {
                // conflict miss
                // we don't get capacity misses on set associative caches
                inputTable.getCellAt(2, i).setValue('M');

                if (existingLeft.localCounter < existingRight.localCounter) {
                    // remove left item
                    leftCache.setItemAt(slotNumber, { address: this._inputData[i], localCounter: globalCounter });
                    leftTable.getCellAt(slotNumber, 1).setValue(this.parseString(this._inputData[i]));
                    leftTable.getCellAt(slotNumber, 2).setValue(globalCounter.toString());
                    output.push(
                        `<i>Conflict miss, replaced ${this.parseString(
                            existingLeft.address,
                        )} (had lower local counter, ${existingLeft.localCounter} vs ${
                            existingRight.localCounter
                        }) on line ${slotNumber}</i>`,
                    );
                    leftTable
                        .getRow(slotNumber)
                        .cells.forEach(({ element: { classList } }) => classList.add('selected', 'bad'));
                    cellsModified = leftTable.getRow(slotNumber).cells;
                } else {
                    // remove right item
                    rightCache.setItemAt(slotNumber, { address: this._inputData[i], localCounter: globalCounter });
                    rightTable.getCellAt(slotNumber, 1).setValue(this.parseString(this._inputData[i]));
                    rightTable.getCellAt(slotNumber, 2).setValue(globalCounter.toString());
                    output.push(
                        `<i>Conflict miss, replaced ${this.parseString(
                            existingRight.address,
                        )} (had lower local counter, ${existingRight.localCounter} vs ${
                            existingRight.localCounter
                        }) on line ${slotNumber}</i>`,
                    );
                    rightTable
                        .getRow(slotNumber)
                        .cells.forEach(({ element: { classList } }) => classList.add('selected', 'bad'));
                    cellsModified = rightTable.getRow(slotNumber).cells;
                }
            }

            // displaying output information for this step
            this._containers.outputDetailsContainer.innerHTML = output.join('<br />');
            await this.wait();

            // unhighlighting
            tableColumn.forEach(({ element: { classList } }) => classList.remove('selected'));
            cellsModified.forEach(({ element: { classList } }) =>
                classList.remove('selected', 'bad', 'neutral', 'good'),
            );
        }
    }

    public wait(ms: number = CacheEmulator._autoTimePeriod): Promise<void> {
        if (this._data.autoMode) {
            return new Promise<void>((resolve) => setTimeout(resolve, ms));
        }

        return new Promise<void>((resolve) => {
            this._containers.goButton.onclick = () => {
                this._containers.goButton.onclick = null;
                resolve();
            };
        });
    }

    public showIntermediateOutput(): void {
        const { tag, index, offset } = this.getBitsInfo();

        const totalBytes = this._data.cacheLines * this._data.wordsPerLine * this._data.bytesPerWord;
        const totalAsLog = Math.log2(totalBytes);
        const extraSizeInfo = Number.isInteger(totalAsLog) ? ` (2<sup>${totalAsLog}</sup>)` : '';

        const output: string[] = [
            `Addresses to this cache have <b><span class="tagBits">${tag}</span></b> bits for tag, <b><span class="indexBits">${index}</span></b> bits for index, and <b><span class="offsetBits">${offset}</span></b> bits for offset.`,
            `This cache can store a total of <b>${totalBytes}</b>${extraSizeInfo} bytes.`,
        ];

        this._containers.preOutput.innerHTML = output.join('<br />');
    }

    /** Parse a decimal or hexadecimal address depending on whether hex mode is enabled. */
    public parseString(n: number): string {
        if (this._data.hexMode) {
            return `0x${n.toString(16).toUpperCase().padStart(this._data.bytesPerWord, '0')}`;
        }
        return n.toString();
    }

    /** Parse a number into a binary string, spacing out nibbles. */
    public parseToBinary(n: number): string {
        const { offset, index } = this.getBitsInfo();
        let output = '<span class="tagBits">';

        const endOffset = this._data.addressBusSize - offset - 1;
        const endTag = endOffset - index;
        const rawString = n.toString(2).padStart(this._data.addressBusSize, '0');
        for (let i = 0; i < this._data.addressBusSize; i++) {
            output += rawString.substring(i, i + 1);

            if (i % 4 === 3) {
                // space between nibbles
                output += '&emsp;';
            }

            if (i === endOffset) {
                output += '</span><span class="offsetBits">';
            } else if (i === endTag) {
                output += '</span><span class="indexBits">';
            }
        }
        output += '</span>';

        return output;
    }

    public createSelectElement(props: {
        parent?: HTMLElement;
        title?: string;
        options: { value: string | number; text: string }[];
        label?: string;
        onInput?: () => void;
    }): HTMLSelectElement {
        const select = document.createElement('select');

        for (const { value, text } of props.options) {
            const option = document.createElement('option');
            option.value = value.toString();
            option.innerText = text;
            select.appendChild(option);
        }

        if (props?.title) select.title = props.title;
        let onInput = props?.onInput;
        if (onInput) {
            onInput = onInput.bind(this);
            select.oninput = () => onInput!();
        }
        const lbl = props?.label;
        if (lbl) {
            const id = lbl;
            select.id = id;
            const label = document.createElement('label');
            label.innerText = lbl;
            label.htmlFor = id;
            if (props?.parent === undefined) throw new Error('Cannot create a label without a parent');
            if (props.title) {
                label.title = props.title;
                label.style.cursor = 'help';
            }

            const container = document.createElement('div');
            container.appendChild(label);
            container.appendChild(select);
            props.parent.appendChild(container);
        } else if (props?.parent) props.parent.appendChild(select);

        return select;
    }

    public createInputElement(props?: {
        type?: 'string' | 'number' | 'checkbox';
        parent?: HTMLElement;
        title?: string;
        label?: string;
        classes?: string[];
        onInput?: () => void;
    }): HTMLInputElement {
        const input = document.createElement('input');

        if (props?.title) input.title = props.title;
        let onInput = props?.onInput;
        if (onInput) {
            onInput = onInput.bind(this);
            input.oninput = () => onInput!();
        }
        if (props?.type) input.type = props.type;
        if (props?.type === 'number') {
            input.min = '0';
        }

        const lbl = props?.label;
        if (lbl) {
            const id = lbl;
            input.id = id;
            const label = document.createElement('label');
            label.innerText = lbl;
            label.htmlFor = id;
            if (props?.parent === undefined) throw new Error('Cannot create a label without a parent');
            if (props.title) {
                label.title = props.title;
                label.style.cursor = 'help';
            }

            if (props.classes) label.classList.add(...props.classes);

            const container = document.createElement('div');
            container.appendChild(label);
            container.appendChild(input);
            props.parent.appendChild(container);
        } else {
            if (props?.classes) input.classList.add(...props.classes);
            if (props?.parent) props.parent.appendChild(input);
        }

        return input;
    }

    public saveValues(): void {
        localStorage.setItem('CacheEmulatorValues', JSON.stringify(this._data));
    }

    public loadValues(): EmulatorData {
        const source = localStorage.getItem('CacheEmulatorValues');
        if (source !== null) {
            Object.assign(CacheEmulator.Defaults, JSON.parse(source));
        }

        for (const k in CacheEmulator.Defaults) {
            const key = k as keyof Omit<EmulatorData, 'cacheType'>;
            if (this._inputElements[key] instanceof HTMLInputElement && this._inputElements[key].type === 'checkbox') {
                (this._inputElements[key] as HTMLInputElement).checked = !!CacheEmulator.Defaults[key];
            } else {
                this._inputElements[key].value = CacheEmulator.Defaults[key].toString();
            }
        }

        return CacheEmulator.Defaults;
    }

    public static set timePeriod(n: number) {
        if (n < 0) return;
        this._autoTimePeriod = n;
    }
}

new CacheEmulator();
