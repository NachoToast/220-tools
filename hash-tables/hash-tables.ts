function doSomething() {
    console.log('hello world2!');
}

enum CollisionHandling {
    Linear = 'linear',
}

abstract class CollisionCounter {
    private static _tableSizeElement = document.getElementById('collisionCounterTableSize')! as HTMLInputElement;
    private static _inputDataElement = document.getElementById('collisionCounterData')! as HTMLInputElement;
    private static _hashFunctionElement = document.getElementById(
        'collisionCounterHashFunction',
    )! as HTMLTextAreaElement;
    private static _tableElement = document.getElementById('collisionCounterTable')!;
    private static _indexesRow = document.getElementById('collisionCounterTable_indexes')!;
    private static _valuesRow = document.getElementById('collisionCounterTable_values')!;

    private static _outputContainer = document.getElementById('collisionCounterOutput')!;
    private static _mainOutput = document.getElementById('collisionCounterOutput_main')!;
    private static _warnOutput = document.getElementById('collisionCounterOutput_warn')!;
    private static _totalOutput = document.getElementById('collisionCounterOutput_total')!;

    private static _tableSize = 0;
    private static _inputData: number[] = [];

    private static _collisionHandling: CollisionHandling = CollisionHandling.Linear;
    private static _hashFunction: (x: number) => number;

    private static autoStep: boolean = true;
    private static _nextButton = document.getElementById('collisionCounterNext')!;

    public static toggleAutoStep(newValue: boolean): void {
        this.autoStep = newValue;
    }

    private static handleTableSizeChange(e: Event): void {
        const value = Number((e.target as HTMLInputElement).value);
        if (value < 0) return;
        this._tableSize = value;
    }

    private static handleInputData(e: Event): void {
        const { value } = e.target as HTMLInputElement;

        const data = value
            .split(' ')
            .map((e) => Number(e))
            .filter((e) => !Number.isNaN(e));

        this._inputData = data;
    }

    private static handleFunctionChange(e: Event): void {
        const { value } = e.target as HTMLInputElement;
        try {
            this._hashFunction = eval(value);
        } catch (error) {
            //
        }
    }

    private static clearTable(): void {
        this._tableElement.style.visibility = 'hidden';
        this._outputContainer.style.visibility = 'hidden';

        this._indexesRow.innerHTML = ``;
        this._valuesRow.innerHTML = ``;

        this._mainOutput.innerHTML = ``;
        this._warnOutput.innerHTML = ``;
        this._totalOutput.innerHTML = ``;
    }

    public static async displayTable(b: HTMLButtonElement): Promise<void> {
        this.clearTable();
        if (!this._inputData.length || this._tableSize < 1 || !this._hashFunction) return;
        b.disabled = true;

        this._tableElement.style.visibility = 'visible';
        this._outputContainer.style.visibility = 'visible';

        for (let i = 0; i < this._tableSize; i++) {
            const index = document.createElement('td');
            index.innerText = `${i}`;

            const value = document.createElement('td');
            value.innerHTML = `&nbsp;`;

            this._indexesRow.appendChild(index);
            this._valuesRow.appendChild(value);
        }

        await this.insertAll();
        b.disabled = false;
    }

    private static wait(isAuto: boolean = true, ms: number = 1000): Promise<void> {
        if (isAuto) {
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

    private static async insertAll(): Promise<void> {
        const isAuto = this.autoStep;
        if (isAuto) this._nextButton.style.visibility = 'hidden';
        else this._nextButton.style.visibility = 'visible';

        const inputData = this._inputData;
        const hashMap: (number | null)[] = new Array(this._tableSize).fill(null);
        let globalCollisions = 0;

        this._totalOutput.innerText = `Total Collisions: 0`;

        for (let i = 0, len = inputData.length; i < len; i++) {
            const data = inputData[i];
            let attemptedPosition = this._hashFunction(data);
            let localCollisions = 0;
            this._mainOutput.innerText = `Attempting to insert ${data} at index ${attemptedPosition}`;
            this._indexesRow.children[attemptedPosition].classList.add('collisionCounter_maybe');
            await this.wait(isAuto);
            while (hashMap[attemptedPosition] !== null) {
                localCollisions++;
                globalCollisions++;
                this._mainOutput.innerText = `Attempting to insert ${data} at index ${attemptedPosition} (${localCollisions} collision${
                    localCollisions !== 1 ? 's' : ''
                })`;
                this._indexesRow.children[attemptedPosition].classList.remove('collisionCounter_maybe');
                this._indexesRow.children[attemptedPosition].classList.add('collisionCounter_no');
                this._warnOutput.innerText = `Index ${attemptedPosition} is taken by ${hashMap[attemptedPosition]}`;
                this._totalOutput.innerText = `Total Collisions: ${globalCollisions}`;
                attemptedPosition = (attemptedPosition + 1) % this._tableSize;
                await this.wait(isAuto);
            }
            this._indexesRow.children[attemptedPosition].classList.add('collisionCounter_yes');
            this._mainOutput.innerText = `Inserted ${data} at index ${attemptedPosition} (${localCollisions} collision${
                localCollisions !== 1 ? 's' : ''
            })`;
            this._warnOutput.innerText = ``;
            hashMap[attemptedPosition] = data;
            this._valuesRow.children[attemptedPosition].innerHTML = data.toString();
            await this.wait(isAuto);

            for (let i = 0, len = this._indexesRow.children.length; i < len; i++) {
                this._indexesRow.children[i].classList.remove('collisionCounter_no');
                this._indexesRow.children[i].classList.remove('collisionCounter_maybe');
                this._indexesRow.children[i].classList.remove('collisionCounter_yes');
            }
        }

        this._mainOutput.innerText = `Inserted all ${inputData.length} numbers`;
    }

    public static initialize(): void {
        this._tableSizeElement.oninput = (e) => this.handleTableSizeChange(e);
        this._inputDataElement.oninput = (e) => this.handleInputData(e);
        this._hashFunctionElement.oninput = (e) => this.handleFunctionChange(e);

        // fake values
        this._tableSizeElement.innerText = `20`;
        this._tableSize = 20;

        this._inputDataElement.innerText = `6 7 8 12 13 20 34 50 17 16 31 32 4 44 52 36`;
        this._inputData = `6 7 8 12 13 20 34 50 17 16 31 32 4 44 52 36`.split(' ').map((e) => Number(e));

        this._hashFunctionElement.innerText = `(x) => x % 20`;
        this._hashFunction = (x) => x % 20;
    }
}

CollisionCounter.initialize();
