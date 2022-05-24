class Table {
    public readonly element: HTMLTableElement = document.createElement('table');

    private readonly _data: string[][] = [];

    private readonly _rows: Row[] = [];

    public get numRows(): number {
        return this._data.length;
    }
    public get numColumns(): number {
        return this._data.at(0)?.length ?? 0;
    }

    public constructor(data?: string[][], headerRow?: string[], verticalHeaderRow?: boolean) {
        if (data) this._data = data;

        if (headerRow !== undefined && !verticalHeaderRow) {
            new Row(this, headerRow);
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

interface DummyCacheItem {
    address: number;
    localCounter: number;
}

class DummyCache<T> {
    private readonly _size: number;
    public readonly data: Array<T | null>;

    public constructor(size: number) {
        this._size = size;
        this.data = new Array<T | null>(size).fill(null);
    }

    public getItemAt(index: number): T | null {
        return this.data[index];
    }

    public setItemAt(index: number, payload: T | null) {
        this.data[index] = payload;
    }

    /** Returns the index of the first empty slot, -1 if none. */
    public getFirstFreeSlot(): number {
        return this.data.findIndex((e) => e === null);
    }

    public isFull(): boolean {
        return this.data.every((e) => e !== null);
    }
}

enum CacheTypes {
    FulllyAssociative = 'fullyAssociative',
    DirectMapped = 'directMapped',
    SetAssociative = 'setAssociative',
}

abstract class LRUReplacement {
    private static _cacheSize: number = 4;
    private static _inputData: number[] = [];

    private static _hexMode: boolean = false;
    private static _autoMode: boolean = true;
    private static _cacheType: CacheTypes = CacheTypes.FulllyAssociative;

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

    public static setCacheType(m: CacheTypes) {
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
        this._inputTableContainer.innerHTML = ``;
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
            case CacheTypes.FulllyAssociative:
                await this.startFullyAssociative();
                break;
            case CacheTypes.DirectMapped:
                await this.startDirectMapped();
                break;
            case CacheTypes.SetAssociative:
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

        const cache = new DummyCache<DummyCacheItem>(this._cacheSize);

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
                this._table.getCellAt(2, i).setValue(`H`);
                cacheTable.getCellAt(index, 2).setValue(globalCounter.toString());
                statusElement.innerText += `\nCache hit, incremented local counter.`;
            } else if (!cache.isFull()) {
                // compulsory miss
                const addedIndex = cache.getFirstFreeSlot();
                cache.setItemAt(addedIndex, { address: this._inputData[i], localCounter: globalCounter });
                this._table.getCellAt(2, i).setValue(`M`);
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
                this._table.getCellAt(2, i).setValue(`M`);
                cacheTable.getCellAt(indexOfLowest, 1).setValue(this.dataToString(this._inputData[i]));
                cacheTable.getCellAt(indexOfLowest, 2).setValue(globalCounter.toString());
                statusElement.innerText = `\nCapacity miss, removed ${this.dataToString(
                    removedItem.address,
                )} from line 0 (had lowest local counter, ${removedItem.localCounter}).`;
            }

            await this.wait();
            tableColumn.forEach(({ element: { classList } }) => classList.remove('selected'));
        }

        statusElement.innerText = `Done!`;
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
                this._table.getCellAt(2, i).setValue(`H`);
                statusElement.innerText += `\nCache hit.`;
            } else if (existing === null) {
                // compulsory miss
                cache.setItemAt(slotNumber, this._inputData[i]);
                this._table.getCellAt(2, i).setValue(`M`);
                cacheTable.getCellAt(slotNumber, 1).setValue(this.dataToString(this._inputData[i]));
                statusElement.innerText += `\nCompulsory miss, added new address to line ${slotNumber}.`;
            } else {
                // conflict miss
                // we don't get capacity misses on direct-mapped caches
                cache.setItemAt(slotNumber, this._inputData[i]);
                this._table.getCellAt(2, i).setValue(`M`);
                cacheTable.getCellAt(slotNumber, 1).setValue(this.dataToString(this._inputData[i]));
                statusElement.innerText = `\nConflict miss, replaced ${this.dataToString(
                    existing,
                )} with ${this.dataToString(this._inputData[i])} (line ${slotNumber}).`;
            }

            await this.wait();
            tableColumn.forEach(({ element: { classList } }) => classList.remove('selected'));
        }

        statusElement.innerText = `Done!`;
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

        const leftCache = new DummyCache<DummyCacheItem>(this._cacheSize / 2);
        const rightCache = new DummyCache<DummyCacheItem>(this._cacheSize / 2);

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
                statusElement.innerText += `\nCache hit (set 0), incremented local counter`;
            } else if (existingB?.address === this._inputData[i]) {
                // hit B
                rightCache.setItemAt(slotNumber, { address: this._inputData[i], localCounter: globalCounter });
                this._table.getCellAt(2, i).setValue('H');
                rightTable.getCellAt(slotNumber, 2).setValue(globalCounter.toString());
                statusElement.innerText += `\nCache hit (set 1), incremented local counter`;
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

        LRUReplacement.setCacheType(CacheTypes.FulllyAssociative);
    }

    public static loadDirectSampleData(): void {
        if (this._inProgress) return;

        const inputData = '8 8 7 3 7 3 7 3';

        (document.getElementById('LRUReplacementCacheSize')! as HTMLInputElement).value = '4';
        LRUReplacement.cacheSize = 4;

        (document.getElementById('LRUReplacementInputData')! as HTMLInputElement).value = inputData;
        LRUReplacement.inputData(inputData);

        LRUReplacement.setHexMode(false);

        LRUReplacement.setCacheType(CacheTypes.DirectMapped);
    }

    public static loadSetAssociativeSampleData1(): void {
        if (this._inProgress) return;

        const inputData = '3 7 5 9 3 7 5 9';
        (document.getElementById('LRUReplacementCacheSize')! as HTMLInputElement).value = '4';
        LRUReplacement.cacheSize = 4;

        (document.getElementById('LRUReplacementInputData')! as HTMLInputElement).value = inputData;
        LRUReplacement.inputData(inputData);

        LRUReplacement.setHexMode(false);

        LRUReplacement.setCacheType(CacheTypes.SetAssociative);
    }

    public static loadSetAssociativeSampleData2(): void {
        if (this._inProgress) return;

        const inputData = '8 8 7 3 7 3 7 3';
        (document.getElementById('LRUReplacementCacheSize')! as HTMLInputElement).value = '4';
        LRUReplacement.cacheSize = 4;

        (document.getElementById('LRUReplacementInputData')! as HTMLInputElement).value = inputData;
        LRUReplacement.inputData(inputData);

        LRUReplacement.setHexMode(false);

        LRUReplacement.setCacheType(CacheTypes.SetAssociative);
    }

    private static __inProgress: boolean = false;
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
