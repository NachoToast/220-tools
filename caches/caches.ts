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

class DummyCache {
    private readonly _size: number;
    public readonly data: Array<DummyCacheItem | null>;

    public constructor(size: number) {
        this._size = size;
        this.data = new Array<DummyCacheItem | null>(size).fill(null);
    }

    /** Returns index of an address in the cache, -1 if not found. */
    public getItem(address: number): number {
        return this.data.findIndex((e) => e?.address === address);
    }

    /** Updates an items local counter. */
    public updateItem(index: number, globalCounter: number): void {
        this.data[index]!.localCounter = globalCounter;
    }

    /** Adds an item at the next available line, throws an error if no line is empty. */
    public addItem(address: number, globalCounter: number): number {
        for (let i = 0; i < this._size; i++) {
            if (this.data[i] === null) {
                this.data[i] = { address, localCounter: globalCounter };
                return i;
            }
        }
        throw new Error(`Trying to add item but no lines free`);
    }

    /** Removes the item with the lowest local counter. */
    public evict(): { index: number; item: DummyCacheItem } {
        const locals = (this.data as DummyCacheItem[]).map(({ localCounter }) => localCounter);
        const lowestItemIndex = locals.indexOf(Math.min(...locals));
        const output = { index: lowestItemIndex, item: this.data[lowestItemIndex]! };
        this.data[lowestItemIndex] = null;
        return output;
    }

    public isFull(): boolean {
        return this.data.every((e) => e !== null);
    }
}

abstract class LRUReplacement {
    private static _cacheSize: number = 4;
    private static _inputData: number[] = [];
    private static _hexMode: boolean = false;
    private static _autoMode: boolean = true;
    private static _inProgress = false;

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

    public static inputData(d: string): void {
        if (this._inProgress) return;
        this._inputData = d
            .split(/\s/g)
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
        if (!this._autoMode) this._nextButton.style.visibility = 'visible';
        this._inProgress = true;
        this._goButton.disabled = true;
        this._outputContainer.innerHTML = '';

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

        const cache = new DummyCache(this._cacheSize);

        for (let i = 0, len = this._inputData.length; i < len; i++) {
            statusElement.innerText = `Sequence #${i + 1}`;
            globalCounter++;
            globalCounterElement.innerText = `Global Counter: ${globalCounter.toString()}`;
            const tableColumn = this._table.getColumn(i);
            tableColumn.forEach(({ element: { classList } }) => classList.add('selected'));

            const index = cache.getItem(this._inputData[i]);
            if (index !== -1) {
                // hit
                cache.updateItem(index, globalCounter);
                this._table.getCellAt(2, i).setValue(`H`);
                cacheTable.getCellAt(index, 2).setValue(globalCounter.toString());
                statusElement.innerText += `\nCache hit, incremented local counter.`;
            } else if (!cache.isFull()) {
                // compulsory miss
                const addedAt = cache.addItem(this._inputData[i], globalCounter);
                this._table.getCellAt(2, i).setValue(`M`);
                cacheTable.getCellAt(addedAt, 1).setValue(this.dataToString(this._inputData[i]));
                cacheTable.getCellAt(addedAt, 2).setValue(globalCounter.toString());
                statusElement.innerText += `\nCompulsory miss, added new address to line ${addedAt}.`;
            } else {
                // capacity miss
                // we don't get conflict misses on fully-associative caches
                const { index, item } = cache.evict();
                const addedIndex = cache.addItem(this._inputData[i], globalCounter);
                this._table.getCellAt(2, i).setValue(`M`);
                cacheTable.getCellAt(addedIndex, 1).setValue(this.dataToString(this._inputData[i]));
                cacheTable.getCellAt(addedIndex, 2).setValue(globalCounter.toString());
                statusElement.innerText = `\nCapacity miss, removed ${this.dataToString(
                    item.address,
                )} from line 0 (had lowest local counter, ${item.localCounter}).`;
            }

            await this.wait();
            tableColumn.forEach(({ element: { classList } }) => classList.remove('selected'));
        }

        statusElement.innerText = `Done!`;

        if (!this._autoMode) this._nextButton.style.visibility = 'hidden';
        this._inProgress = false;
        this._goButton.disabled = false;
    }
}

// test data
// LRUReplacement.setAutoMode(false);
// LRUReplacement.setHexMode(true);
// LRUReplacement.cacheSize = 4;
// LRUReplacement.inputData('0x23  0x13  0x17  0x13  0x1F  0x23  0x19  0x13  0x17  0x1F  0x23  0x13');
// LRUReplacement.start();
