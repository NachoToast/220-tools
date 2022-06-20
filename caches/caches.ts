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

enum OldCacheTypes {
    FulllyAssociative = 'fullyAssociative',
    DirectMapped = 'directMapped',
    SetAssociative = 'setAssociative',
}

class LRUReplacement {
    private static _cacheSize = 4;
    private static _inputData: number[] = [];

    private static _hexMode = false;
    private static _autoMode = true;
    private static _cacheType: OldCacheTypes = OldCacheTypes.FulllyAssociative;

    // table containers
    private static _inputTableContainer = document.getElementById(
        'LRUReplacementInputTableContainer',
    )! as HTMLDivElement;

    // mode togglers
    private static _hexModeToggler = document.getElementById('LRUReplacementShowHexNumbers')! as HTMLInputElement;
    private static _autoModeToggler = document.getElementById('LRUReplacementAutoMode')! as HTMLInputElement;

    // other IO
    private static _goButton = document.getElementById('LRUReplacementGoButton')! as HTMLButtonElement;
    private static _outputContainer = document.getElementById('LRUReplacementOutputContainer')! as HTMLDivElement;
    private static _nextButton = document.getElementById('LRUReplacementNextButton')! as HTMLButtonElement;
    private static _cacheTypeSelect = document.getElementById('LRUReplacementCacheTypeSelect')! as HTMLSelectElement;

    private static _inputElements: HTMLInputElement[] = [
        document.getElementById('LRUReplacementCacheSize')! as HTMLInputElement,
        document.getElementById('LRUReplacementInputData')! as HTMLInputElement,
    ];

    public static set cacheSize(n: number) {
        if (this._inProgress) return;
        this._cacheSize = n;
    }

    public static setHexMode(m: boolean) {
        if (this._inProgress) return;
        this._hexMode = m;
        this._hexModeToggler.checked = m;

        this.reDrawInputTable();
    }

    public static setAutoMode(m: boolean) {
        if (this._inProgress) return;
        this._autoMode = m;
        this._autoModeToggler.checked = m;
    }

    public static setCacheType(m: OldCacheTypes) {
        if (this._inProgress) return;
        this._cacheType = m;
        this._cacheTypeSelect.value = m;
    }

    public static inputData(d: string): void {
        if (this._inProgress) return;
        this._inputData = d
            .split(/\s|,/g)
            .filter((e) => !!e)
            .map((e) => Number(e))
            .filter((e) => !Number.isNaN(e));
        this.reDrawInputTable();
    }

    private static _table?: Table;
    private static reDrawInputTable(): void {
        this._inputTableContainer.innerHTML = '';
        if (!this._inputData.length) return;

        const tableData = new Array<string[]>(3);
        tableData[0] = new Array<string>(this._inputData.length).fill('').map((_, i) => (i + 1).toString()); // sequence id
        tableData[1] = this._inputData.map((e) => this.dataToString(e)); // address
        tableData[2] = new Array<string>(this._inputData.length); // hit/miss (i guess they never miss huh?)

        this._table = new Table(tableData, ['Sequence #', 'Address', 'Hit/Miss'], true);
        this._inputTableContainer.appendChild(this._table.element);
    }

    public static dataToString(d: number): string {
        if (this._hexMode) return `0x${d.toString(16).padStart(2, '0').toUpperCase()}`;
        return d.toString();
    }

    private static wait(ms: number = 1000): Promise<void> {
        if (this._autoMode) {
            return new Promise<void>((resolve) => {
                setTimeout(resolve, ms);
            });
        }

        return new Promise<void>((resolve) => {
            this._nextButton.onclick = () => {
                this._nextButton.onclick = null;
                resolve();
            };
        });
    }

    public static async start(): Promise<void> {
        if (!this._table || !this._inputData.length || !this._table || this._inProgress) return;
        this._inProgress = true;

        switch (this._cacheType) {
            case OldCacheTypes.FulllyAssociative:
                await this.startFullyAssociative();
                break;
            case OldCacheTypes.DirectMapped:
                await this.startDirectMapped();
                break;
            case OldCacheTypes.SetAssociative:
                await this.startSetAssociative();
                break;
        }
        this._inProgress = false;
    }

    private static async startFullyAssociative(): Promise<void> {
        this._table = this._table!;
        const tableData: string[][] = new Array<string[]>(this._cacheSize).fill([]).map((_, i) => {
            const row = new Array<string>(3);
            row[0] = i.toString();
            return row;
        });

        const cacheTable = new Table(tableData, ['Line #', 'Address', 'Local Counter']);
        cacheTable.element.style.width = '50%';
        this._outputContainer.appendChild(cacheTable.element);
        let globalCounter = 0;

        const globalCounterElement = document.createElement('p');
        this._outputContainer.appendChild(globalCounterElement);

        const statusElement = document.createElement('p');
        this._outputContainer.appendChild(statusElement);

        const cache = new DummyCache<CacheItem>(this._cacheSize);

        for (let i = 0, len = this._inputData.length; i < len; i++) {
            statusElement.innerText = `Sequence #${i + 1}`;
            globalCounter++;
            globalCounterElement.innerText = `Global Counter: ${globalCounter.toString()}`;
            const tableColumn = this._table.getColumn(i);
            tableColumn.forEach(({ element: { classList } }) => classList.add('selected'));

            const index = cache.data.findIndex((e) => e?.address === this._inputData[i]);
            if (index !== -1) {
                // hit
                cache.setItemAt(index, { address: this._inputData[i], localCounter: globalCounter });
                this._table.getCellAt(2, i).setValue('H');
                cacheTable.getCellAt(index, 2).setValue(globalCounter.toString());
                statusElement.innerText += '\nCache hit, incremented local counter.';
            } else if (!cache.isFull()) {
                // compulsory miss
                const addedIndex = cache.getFirstFreeSlot();
                cache.setItemAt(addedIndex, { address: this._inputData[i], localCounter: globalCounter });
                this._table.getCellAt(2, i).setValue('M');
                cacheTable.getCellAt(addedIndex, 1).setValue(this.dataToString(this._inputData[i]));
                cacheTable.getCellAt(addedIndex, 2).setValue(globalCounter.toString());
                statusElement.innerText += `\nCompulsory miss, added new address to line ${addedIndex}.`;
            } else {
                // capacity miss
                // we don't get conflict misses on fully-associative caches
                // const { index, item } = cache.evict();
                const localCounters = cache.data.map((e) => e!.localCounter);
                const indexOfLowest = localCounters.indexOf(Math.min(...localCounters));

                const removedItem = cache.getItemAt(indexOfLowest)!;
                cache.setItemAt(indexOfLowest, { address: this._inputData[i], localCounter: globalCounter });
                this._table.getCellAt(2, i).setValue('M');
                cacheTable.getCellAt(indexOfLowest, 1).setValue(this.dataToString(this._inputData[i]));
                cacheTable.getCellAt(indexOfLowest, 2).setValue(globalCounter.toString());
                statusElement.innerText = `\nCapacity miss, removed ${this.dataToString(
                    removedItem.address,
                )} from line 0 (had lowest local counter, ${removedItem.localCounter}).`;
            }

            await this.wait();
            tableColumn.forEach(({ element: { classList } }) => classList.remove('selected'));
        }

        statusElement.innerText = 'Done!';
    }

    private static async startDirectMapped(): Promise<void> {
        this._table = this._table!;
        const tableData: string[][] = new Array<string[]>(this._cacheSize).fill([]).map((_, i) => {
            const row = new Array<string>(2);
            row[0] = i.toString();
            return row;
        });

        const cacheTable = new Table(tableData, ['Line #', 'Address']);
        cacheTable.element.style.width = '50%';
        this._outputContainer.appendChild(cacheTable.element);

        const statusElement = document.createElement('p');
        this._outputContainer.appendChild(statusElement);

        const cache = new DummyCache<number>(this._cacheSize);

        const slotFunction = (address: number) => address % this._cacheSize;

        for (let i = 0, len = this._inputData.length; i < len; i++) {
            statusElement.innerText = `Sequence #${i + 1}`;
            const tableColumn = this._table.getColumn(i);
            tableColumn.forEach(({ element: { classList } }) => classList.add('selected'));

            const slotNumber = slotFunction(this._inputData[i]);
            const existing = cache.getItemAt(slotNumber);
            if (existing !== null && existing === this._inputData[i]) {
                // hit
                this._table.getCellAt(2, i).setValue('H');
                statusElement.innerText += '\nCache hit.';
            } else if (existing === null) {
                // compulsory miss
                cache.setItemAt(slotNumber, this._inputData[i]);
                this._table.getCellAt(2, i).setValue('M');
                cacheTable.getCellAt(slotNumber, 1).setValue(this.dataToString(this._inputData[i]));
                statusElement.innerText += `\nCompulsory miss, added new address to line ${slotNumber}.`;
            } else {
                // conflict miss
                // we don't get capacity misses on direct-mapped caches
                cache.setItemAt(slotNumber, this._inputData[i]);
                this._table.getCellAt(2, i).setValue('M');
                cacheTable.getCellAt(slotNumber, 1).setValue(this.dataToString(this._inputData[i]));
                statusElement.innerText = `\nConflict miss, replaced ${this.dataToString(
                    existing,
                )} with ${this.dataToString(this._inputData[i])} (line ${slotNumber}).`;
            }

            await this.wait();
            tableColumn.forEach(({ element: { classList } }) => classList.remove('selected'));
        }

        statusElement.innerText = 'Done!';
    }

    private static async startSetAssociative(): Promise<void> {
        if (this._cacheSize % 2 !== 0) {
            window.alert('Cache size must be even for 2-way set associative caching.');
            return;
        }
        this._table = this._table!;

        const leftTableData: string[][] = new Array<string[]>(this._cacheSize / 2).fill([]).map((_, i) => {
            const row = new Array<string>(3);
            row[0] = i.toString();
            return row;
        });
        const rightTableData: string[][] = new Array<string[]>(this._cacheSize / 2).fill([]).map((_, i) => {
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
        this._outputContainer.appendChild(blockContainer);

        let globalCounter = 0;
        const globalCounterElement = document.createElement('p');
        this._outputContainer.appendChild(globalCounterElement);

        const statusElement = document.createElement('p');
        this._outputContainer.appendChild(statusElement);

        const leftCache = new DummyCache<CacheItem>(this._cacheSize / 2);
        const rightCache = new DummyCache<CacheItem>(this._cacheSize / 2);

        const slotFunction = (address: number) => address % (this._cacheSize / 2);

        for (let i = 0, len = this._inputData.length; i < len; i++) {
            statusElement.innerText = `Sequence #${i + 1}`;
            globalCounter++;

            const tableColumn = this._table.getColumn(i);
            tableColumn.forEach(({ element: { classList } }) => classList.add('selected'));

            const slotNumber = slotFunction(this._inputData[i]);

            const existingA = leftCache.getItemAt(slotNumber);
            const existingB = rightCache.getItemAt(slotNumber);

            if (existingA?.address === this._inputData[i]) {
                // hit A
                leftCache.setItemAt(slotNumber, { address: this._inputData[i], localCounter: globalCounter });
                this._table.getCellAt(2, i).setValue('H');
                leftTable.getCellAt(slotNumber, 2).setValue(globalCounter.toString());
                statusElement.innerText += '\nCache hit (set 0), incremented local counter';
            } else if (existingB?.address === this._inputData[i]) {
                // hit B
                rightCache.setItemAt(slotNumber, { address: this._inputData[i], localCounter: globalCounter });
                this._table.getCellAt(2, i).setValue('H');
                rightTable.getCellAt(slotNumber, 2).setValue(globalCounter.toString());
                statusElement.innerText += '\nCache hit (set 1), incremented local counter';
            } else if (existingA === null) {
                // compulsory miss primary
                leftCache.setItemAt(slotNumber, { address: this._inputData[i], localCounter: globalCounter });
                this._table.getCellAt(2, i).setValue('M');
                leftTable.getCellAt(slotNumber, 1).setValue(this.dataToString(this._inputData[i]));
                leftTable.getCellAt(slotNumber, 2).setValue(globalCounter.toString());
                statusElement.innerText += `\nCompulsory miss, added new address to line ${slotNumber} (set 0).`;
            } else if (existingB === null) {
                // compulsory miss fallback
                rightCache.setItemAt(slotNumber, { address: this._inputData[i], localCounter: globalCounter });
                this._table.getCellAt(2, i).setValue('M');
                rightTable.getCellAt(slotNumber, 1).setValue(this.dataToString(this._inputData[i]));
                rightTable.getCellAt(slotNumber, 2).setValue(globalCounter.toString());
                statusElement.innerText += `\nCompulsory miss, added new address to line ${slotNumber} (set 1).`;
            } else {
                // conflict miss
                // we don't get capacity misses on set associative caches
                this._table.getCellAt(2, i).setValue('M');

                if (existingA.localCounter < existingB.localCounter) {
                    // remove A
                    leftCache.setItemAt(slotNumber, { address: this._inputData[i], localCounter: globalCounter });
                    leftTable.getCellAt(slotNumber, 1).setValue(this.dataToString(this._inputData[i]));
                    leftTable.getCellAt(slotNumber, 2).setValue(globalCounter.toString());
                    statusElement.innerText += `\nConflict miss, replaced ${this.dataToString(
                        existingA.address,
                    )} with ${this.dataToString(this._inputData[i])} (set 0, line ${slotNumber})`;
                } else {
                    // remove B
                    rightCache.setItemAt(slotNumber, { address: this._inputData[i], localCounter: globalCounter });
                    rightTable.getCellAt(slotNumber, 1).setValue(this.dataToString(this._inputData[i]));
                    rightTable.getCellAt(slotNumber, 2).setValue(globalCounter.toString());
                    statusElement.innerText += `\nConflict miss, replaced ${this.dataToString(
                        existingB.address,
                    )} with ${this.dataToString(this._inputData[i])} (set 1, line ${slotNumber})`;
                }
            }

            await this.wait();
            tableColumn.forEach(({ element: { classList } }) => classList.remove('selected'));
        }
    }

    public static loadSampleData(): void {
        if (this._inProgress) return;

        const inputData = '0x23  0x13  0x17  0x13  0x1F  0x23  0x19  0x13  0x17  0x1F  0x23  0x13';

        (document.getElementById('LRUReplacementCacheSize')! as HTMLInputElement).value = '4';
        LRUReplacement.cacheSize = 4;

        (document.getElementById('LRUReplacementInputData')! as HTMLInputElement).value = inputData;
        LRUReplacement.inputData(inputData);

        LRUReplacement.setHexMode(true);

        LRUReplacement.setCacheType(OldCacheTypes.FulllyAssociative);
    }

    public static loadDirectSampleData(): void {
        if (this._inProgress) return;

        const inputData = '8 8 7 3 7 3 7 3';

        (document.getElementById('LRUReplacementCacheSize')! as HTMLInputElement).value = '4';
        LRUReplacement.cacheSize = 4;

        (document.getElementById('LRUReplacementInputData')! as HTMLInputElement).value = inputData;
        LRUReplacement.inputData(inputData);

        LRUReplacement.setHexMode(false);

        LRUReplacement.setCacheType(OldCacheTypes.DirectMapped);
    }

    public static loadSetAssociativeSampleData1(): void {
        if (this._inProgress) return;

        const inputData = '3 7 5 9 3 7 5 9';
        (document.getElementById('LRUReplacementCacheSize')! as HTMLInputElement).value = '4';
        LRUReplacement.cacheSize = 4;

        (document.getElementById('LRUReplacementInputData')! as HTMLInputElement).value = inputData;
        LRUReplacement.inputData(inputData);

        LRUReplacement.setHexMode(false);

        LRUReplacement.setCacheType(OldCacheTypes.SetAssociative);
    }

    public static loadSetAssociativeSampleData2(): void {
        if (this._inProgress) return;

        const inputData = '8 8 7 3 7 3 7 3';
        (document.getElementById('LRUReplacementCacheSize')! as HTMLInputElement).value = '4';
        LRUReplacement.cacheSize = 4;

        (document.getElementById('LRUReplacementInputData')! as HTMLInputElement).value = inputData;
        LRUReplacement.inputData(inputData);

        LRUReplacement.setHexMode(false);

        LRUReplacement.setCacheType(OldCacheTypes.SetAssociative);
    }

    private static __inProgress = false;

    private static set _inProgress(b: boolean) {
        this.__inProgress = b;

        if (b) this._outputContainer.innerHTML = '';
        if (!this._autoMode) this._nextButton.style.visibility = b ? 'visible' : 'hidden';

        this._goButton.disabled = b;
        this._hexModeToggler.disabled = b;
        this._autoModeToggler.disabled = b;
        this._cacheTypeSelect.disabled = b;

        this._inputElements.forEach((e) => (e.disabled = b));

        if (b && this._table) {
            this._table.getRow(2).cells.forEach((cell) => cell.setValue(''));
        }
    }

    private static get _inProgress(): boolean {
        return this.__inProgress;
    }
}

new LRUReplacement();

interface EmulatorData {
    addressBusSize: number;
    cacheLines: number;
    wordsPerLine: number;
    bytesPerWord: number;
    hexMode: boolean;
    autoMode: boolean;
    disableSpatialLocality: boolean;
    inputData: string;
    cacheType: CacheTypes;
}

enum CacheTypes {
    DirectMapped,
    FullyAssociative,
    SetAssociative,
}

class CacheEmulator {
    public static readonly Defaults: EmulatorData = {
        addressBusSize: 20,
        cacheLines: 32,
        wordsPerLine: 16,
        bytesPerWord: 4,
        hexMode: true,
        autoMode: false,
        disableSpatialLocality: false,
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
            type: 'number',
            parent: this._containers.inputContainer1,
            onInput: this.setCacheLines,
        }),
        wordsPerLine: this.createInputElement({
            label: 'Words per line: ',
            type: 'number',
            parent: this._containers.inputContainer1,
            onInput: this.setWordsPerLine,
        }),
        bytesPerWord: this.createInputElement({
            label: 'Bytes per word: ',
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
        disableSpatialLocality: this.createInputElement({
            label: 'Disable spatial locality',
            type: 'checkbox',
            parent: this._containers.inputContainer2,
            onInput: this.setDisableSpatialLocality,
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
                { text: 'Fully Associative', value: CacheTypes.FullyAssociative },
                { text: 'Set Associative', value: CacheTypes.SetAssociative },
            ],
        }),
    };

    private _data: EmulatorData = this.loadValues();
    private _inputData: number[] = [];

    public constructor() {
        const title = document.createElement('h2');
        title.innerText = 'Cache Emulation';

        this._container.appendChild(title);
        Object.values(this._containers).forEach((e) => {
            this._container.appendChild(e);
        });

        this._containers.inputTableContainer.classList.add('preOutput');
        this._containers.preOutput.classList.add('preOutput');

        this._containers.goButton.disabled = true;
        this._containers.goButton.style.padding = '0.2em 1em';
        this._containers.goButton.style.cursor = 'pointer';
        this._containers.goButton.innerText = 'Go';

        this.showIntermediateOutput();
        this.handleInputData();
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

    public setDisableSpatialLocality() {
        this._inputElements.disableSpatialLocality = this._inputElements.disableSpatialLocality as HTMLInputElement;
        this._data.disableSpatialLocality = this._inputElements.disableSpatialLocality.checked;
        this._inputElements.disableSpatialLocality.checked = this._data.disableSpatialLocality;
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
        console.log('doing FullyAssociative');
        await new Promise((res) => setTimeout(res, 1000));
        console.log('done');
        //
    }

    public async doDirectMapped(inputTable: Table): Promise<void> {
        const bytesPerLine = this._data.bytesPerWord * this._data.wordsPerLine;
        const bitsForOffset = Math.ceil(Math.log2(bytesPerLine));
        this._containers.outputDetailsContainer.innerText = `Bits for offset: ${bitsForOffset}`;

        const tableData: string[][] = new Array<string[]>(this._data.cacheLines).fill([]).map((_, i) => {
            const row = new Array<string>(bytesPerLine + 1);
            row[0] = i.toString();
            return row;
        });

        const cacheTable = new Table(tableData, [
            'Line #',
            ...new Array<string>(bytesPerLine).fill('').map((_, i) => i.toString()),
        ]);

        this._containers.outputTableContainer.appendChild(cacheTable.element);

        const cache = new Array<number[]>(this._data.cacheLines).fill([]).map(() => new Array<number>(bytesPerLine));

        for (let i = 0, len = this._inputData.length; i < len; i++) {
            const output: string[] = [`Sequence #${i + 1}`];
            const tableColumn = inputTable.getColumn(i);
            tableColumn.forEach(({ element: { classList } }) => classList.add('selected'));

            // obtain lowest and highest address to fill in, in-case of a miss
            const queriedAddress = this._inputData[i];
            const lowestAddress = (this._inputData[i] >> bitsForOffset) << bitsForOffset;
            const highestAddress = this._inputData[i] | (2 ** bitsForOffset - 1);

            output.push(
                `Queried address = ${this.parseString(queriedAddress)}, in binary = ${this.parseToBinary(
                    queriedAddress,
                    bitsForOffset,
                )}`,
                `Lowest offset address = ${this.parseString(lowestAddress)}, in binary = ${this.parseToBinary(
                    lowestAddress,
                    bitsForOffset,
                )}`,
                `Highest offset address = ${this.parseString(highestAddress)}, in binary = ${this.parseToBinary(
                    highestAddress,
                    bitsForOffset,
                )}`,
            );

            // note down row and column number
            const rowNumber = queriedAddress % this._data.cacheLines;
            const columnNumber = queriedAddress & (2 ** bitsForOffset - 1);
            output.push(
                `Row number = ${this.parseString(queriedAddress)} % ${
                    this._data.cacheLines
                } = ${rowNumber}<br />Column number = Last <b>${bitsForOffset}</b> bits of address = ${columnNumber
                    .toString(2)
                    .padStart(4, '0')} = ${columnNumber}`,
            );

            // highlighting search row and column on the table element
            const searchRow = cacheTable.getRow(rowNumber);
            const searchColumn = cacheTable.getColumn(columnNumber + 1);
            const cell = cacheTable.getCellAt(rowNumber, columnNumber + 1);
            cacheTable._header?.cells[columnNumber + 1]?.element.classList.add('selected');
            searchRow.cells.forEach(({ element: { classList } }) => classList.add('selected'));
            searchColumn.forEach(({ element: { classList } }) => classList.add('selected'));
            cell.element.classList.add('doubleSelected');

            const existingItem = cache[rowNumber][columnNumber];
            if (existingItem === undefined) {
                // compulsory miss
                inputTable.getCellAt(2, i).setValue('M');
                output.push(`Compulsory miss, filling in line ${rowNumber}`);
                this._containers.outputDetailsContainer.innerHTML = output.join('<br />');
                await this.wait();
                output.pop();
                for (let i = 0; i < bytesPerLine; i++) {
                    cache[rowNumber][i + 1] = lowestAddress + i;
                    searchRow.cells[i + 1].setValue(this.parseString(lowestAddress + i));
                }
                output.push('<span style="color: green">Inserted all addresses</span>');
            } else if (existingItem === queriedAddress) {
                // hit
                inputTable.getCellAt(2, i).setValue('H');
                output.push('Cache hit');
            } else {
                // conflict miss
                // we don't get capacity misses on direct-mapped caches
                inputTable.getCellAt(2, i).setValue('?');
                output.push(`Conflict miss, filling in line ${rowNumber}`);
                this._containers.outputDetailsContainer.innerHTML = output.join('<br />');
                await this.wait();
                output.pop();
                for (let i = 0; i < bytesPerLine; i++) {
                    cache[rowNumber][i + 1] = lowestAddress + i;
                    searchRow.cells[i + 1].setValue(this.parseString(lowestAddress + i));
                }
                output.push('<span style="color: green">Replaced all addresses</span>');
            }

            // displaying output information for this step
            this._containers.outputDetailsContainer.innerHTML = output.join('<br />');
            await this.wait();

            // unhighlighting
            cacheTable._header?.cells[columnNumber + 1]?.element.classList.remove('selected');
            tableColumn.forEach(({ element: { classList } }) => classList.remove('selected'));
            searchRow.cells.forEach(({ element: { classList } }) => classList.remove('selected'));
            searchColumn.forEach(({ element: { classList } }) => classList.remove('selected'));
            cell.element.classList.remove('doubleSelected');
        }
    }

    public wait(ms: number = 1000): Promise<void> {
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

    public async doSetAssociative(inputTable: Table): Promise<void> {
        console.log('doing SetAssociative');
        await new Promise((res) => setTimeout(res, 1000));
        console.log('done');
        //
    }

    public showIntermediateOutput(): void {
        const rawBitsForIndex = Math.log2(this._data.cacheLines || 1);
        const bitsForIndex = Math.ceil(rawBitsForIndex);

        const rawBitsForOffset = Math.log2(this._data.wordsPerLine * this._data.bytesPerWord || 1);
        const bitsForOffset = Math.ceil(rawBitsForOffset);

        const bitsForTag = this._data.addressBusSize - bitsForIndex - bitsForOffset;

        const totalBytes = this._data.cacheLines * this._data.wordsPerLine * this._data.bytesPerWord;
        const totalAsLog = Math.log2(totalBytes);
        const extraSizeInfo = Number.isInteger(totalAsLog) ? ` (2<sup>${totalAsLog}</sup>)` : '';

        const output: string[] = [
            `This cache has <b title="${rawBitsForIndex}">${bitsForIndex}</b> bits for index, <b title="${rawBitsForOffset}">${bitsForOffset}</b> bits for offset, and <b>${bitsForTag}</b> bits for tag.`,
            `It can store a total of <b>${totalBytes}</b>${extraSizeInfo} bytes.`,
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
    public parseToBinary(n: number, offsetBits: number): string {
        let output = '';

        const lowestBitBeforePaint = 16 - offsetBits - 1;
        const rawString = n.toString(2).padStart(16, '0');
        for (let i = 0; i < 16; i++) {
            output += rawString.substring(i, i + 1);
            if (i % 4 === 3) {
                output += ' ';
            }
            if (i === lowestBitBeforePaint) {
                output += `<b style="cursor: help" title="Last ${offsetBits} bits">`;
            }
        }
        output += '</b>';

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

            const container = document.createElement('div');
            container.appendChild(label);
            container.appendChild(input);
            props.parent.appendChild(container);
        } else if (props?.parent) props.parent.appendChild(input);

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
}

new CacheEmulator();
