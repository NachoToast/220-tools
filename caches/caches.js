"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Table = /** @class */ (function () {
    function Table(data, headerRow, verticalHeaderRow) {
        this.element = document.createElement('table');
        this._data = [];
        this._rows = [];
        if (data)
            this._data = data;
        if (headerRow !== undefined && !verticalHeaderRow) {
            new Row(this, headerRow);
        }
        var columnHeader = headerRow !== undefined && verticalHeaderRow ? function (i) { return headerRow[i]; } : function () { return undefined; };
        if (data) {
            for (var i = 0; i < data.length; i++) {
                this._rows.push(new Row(this, data[i], columnHeader(i)));
            }
        }
    }
    Object.defineProperty(Table.prototype, "numRows", {
        get: function () {
            return this._data.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Table.prototype, "numColumns", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this._data.at(0)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
        },
        enumerable: false,
        configurable: true
    });
    Table.prototype.getCellAt = function (row, column) {
        return this._rows[row].cells[column];
    };
    Table.prototype.getColumn = function (column) {
        return this._rows.map(function (_a) {
            var cells = _a.cells;
            return cells[column];
        });
    };
    return Table;
}());
var Row = /** @class */ (function () {
    function Row(_a, initialValues, headerData) {
        var element = _a.element, numColumns = _a.numColumns;
        this.element = document.createElement('tr');
        this.cells = [];
        if (headerData !== undefined) {
            this.element.appendChild(new Cell(this, headerData).element);
        }
        element.appendChild(this.element);
        for (var i = 0; i < numColumns; i++) {
            this.addCell(initialValues === null || initialValues === void 0 ? void 0 : initialValues.at(i));
        }
    }
    Row.prototype.addCell = function (initialValue) {
        return this.cells.push(new Cell(this, initialValue));
    };
    return Row;
}());
var Cell = /** @class */ (function () {
    function Cell(_a, initialValue) {
        var element = _a.element;
        this.element = document.createElement('td');
        element.appendChild(this.element);
        if (initialValue !== undefined) {
            this.setValue(initialValue);
        }
    }
    Cell.prototype.setValue = function (v) {
        this.element.innerText = v;
    };
    return Cell;
}());
var DummyCache = /** @class */ (function () {
    function DummyCache(size) {
        this._size = size;
        this.data = new Array(size).fill(null);
    }
    /** Returns index of an address in the cache, -1 if not found. */
    DummyCache.prototype.getItem = function (address) {
        return this.data.findIndex(function (e) { return (e === null || e === void 0 ? void 0 : e.address) === address; });
    };
    /** Updates an items local counter. */
    DummyCache.prototype.updateItem = function (index, globalCounter) {
        this.data[index].localCounter = globalCounter;
    };
    /** Adds an item at the next available line, throws an error if no line is empty. */
    DummyCache.prototype.addItem = function (address, globalCounter) {
        for (var i = 0; i < this._size; i++) {
            if (this.data[i] === null) {
                this.data[i] = { address: address, localCounter: globalCounter };
                return i;
            }
        }
        throw new Error("Trying to add item but no lines free");
    };
    /** Removes the item with the lowest local counter. */
    DummyCache.prototype.evict = function () {
        var locals = this.data.map(function (_a) {
            var localCounter = _a.localCounter;
            return localCounter;
        });
        var lowestItemIndex = locals.indexOf(Math.min.apply(Math, locals));
        var output = { index: lowestItemIndex, item: this.data[lowestItemIndex] };
        this.data[lowestItemIndex] = null;
        return output;
    };
    DummyCache.prototype.isFull = function () {
        return this.data.every(function (e) { return e !== null; });
    };
    return DummyCache;
}());
var LRUReplacement = /** @class */ (function () {
    function LRUReplacement() {
    }
    Object.defineProperty(LRUReplacement, "cacheSize", {
        set: function (n) {
            if (this._inProgress)
                return;
            this._cacheSize = n;
        },
        enumerable: false,
        configurable: true
    });
    LRUReplacement.setHexMode = function (m) {
        if (this._inProgress)
            return;
        this._hexMode = m;
        this._hexModeToggler.checked = m;
        this.reDrawInputTable();
    };
    LRUReplacement.setAutoMode = function (m) {
        if (this._inProgress)
            return;
        this._autoMode = m;
        this._autoModeToggler.checked = m;
    };
    LRUReplacement.inputData = function (d) {
        if (this._inProgress)
            return;
        this._inputData = d
            .split(/\s/g)
            .filter(function (e) { return !!e; })
            .map(function (e) { return Number(e); })
            .filter(function (e) { return !Number.isNaN(e); });
        this.reDrawInputTable();
    };
    LRUReplacement.reDrawInputTable = function () {
        var _this = this;
        this._inputTableContainer.innerHTML = "";
        if (!this._inputData.length)
            return;
        var tableData = new Array(3);
        tableData[0] = new Array(this._inputData.length).fill('').map(function (_, i) { return (i + 1).toString(); }); // sequence id
        tableData[1] = this._inputData.map(function (e) { return _this.dataToString(e); }); // address
        tableData[2] = new Array(this._inputData.length); // hit/miss (i guess they never miss huh?)
        this._table = new Table(tableData, ['Sequence #', 'Address', 'Hit/Miss'], true);
        this._inputTableContainer.appendChild(this._table.element);
    };
    LRUReplacement.dataToString = function (d) {
        if (this._hexMode)
            return "0x".concat(d.toString(16).padStart(2, '0').toUpperCase());
        return d.toString();
    };
    LRUReplacement.wait = function (ms) {
        var _this = this;
        if (ms === void 0) { ms = 1000; }
        if (this._autoMode) {
            return new Promise(function (resolve) {
                setTimeout(resolve, ms);
            });
        }
        return new Promise(function (resolve) {
            _this._nextButton.onclick = function () {
                _this._nextButton.onclick = null;
                resolve();
            };
        });
    };
    LRUReplacement.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tableData, cacheTable, globalCounter, globalCounterElement, statusElement, cache, i, len, tableColumn, index, addedAt, _a, index_1, item, addedIndex;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this._table || !this._inputData.length || !this._table || this._inProgress)
                            return [2 /*return*/];
                        if (!this._autoMode)
                            this._nextButton.style.visibility = 'visible';
                        this._inProgress = true;
                        this._goButton.disabled = true;
                        this._outputContainer.innerHTML = '';
                        tableData = new Array(this._cacheSize).fill([]).map(function (_, i) {
                            var row = new Array(3);
                            row[0] = i.toString();
                            return row;
                        });
                        cacheTable = new Table(tableData, ['Line #', 'Address', 'Local Counter']);
                        cacheTable.element.style.width = '50%';
                        this._outputContainer.appendChild(cacheTable.element);
                        globalCounter = 0;
                        globalCounterElement = document.createElement('p');
                        this._outputContainer.appendChild(globalCounterElement);
                        statusElement = document.createElement('p');
                        this._outputContainer.appendChild(statusElement);
                        cache = new DummyCache(this._cacheSize);
                        i = 0, len = this._inputData.length;
                        _b.label = 1;
                    case 1:
                        if (!(i < len)) return [3 /*break*/, 4];
                        statusElement.innerText = "Sequence #".concat(i + 1);
                        globalCounter++;
                        globalCounterElement.innerText = "Global Counter: ".concat(globalCounter.toString());
                        tableColumn = this._table.getColumn(i);
                        tableColumn.forEach(function (_a) {
                            var classList = _a.element.classList;
                            return classList.add('selected');
                        });
                        index = cache.getItem(this._inputData[i]);
                        if (index !== -1) {
                            // hit
                            cache.updateItem(index, globalCounter);
                            this._table.getCellAt(2, i).setValue("H");
                            cacheTable.getCellAt(index, 2).setValue(globalCounter.toString());
                            statusElement.innerText += "\nCache hit, incremented local counter.";
                        }
                        else if (!cache.isFull()) {
                            addedAt = cache.addItem(this._inputData[i], globalCounter);
                            this._table.getCellAt(2, i).setValue("M");
                            cacheTable.getCellAt(addedAt, 1).setValue(this.dataToString(this._inputData[i]));
                            cacheTable.getCellAt(addedAt, 2).setValue(globalCounter.toString());
                            statusElement.innerText += "\nCompulsory miss, added new address to line ".concat(addedAt, ".");
                        }
                        else {
                            _a = cache.evict(), index_1 = _a.index, item = _a.item;
                            addedIndex = cache.addItem(this._inputData[i], globalCounter);
                            this._table.getCellAt(2, i).setValue("M");
                            cacheTable.getCellAt(addedIndex, 1).setValue(this.dataToString(this._inputData[i]));
                            cacheTable.getCellAt(addedIndex, 2).setValue(globalCounter.toString());
                            statusElement.innerText = "\nCapacity miss, removed ".concat(this.dataToString(item.address), " from line 0 (had lowest local counter, ").concat(item.localCounter, ").");
                        }
                        return [4 /*yield*/, this.wait()];
                    case 2:
                        _b.sent();
                        tableColumn.forEach(function (_a) {
                            var classList = _a.element.classList;
                            return classList.remove('selected');
                        });
                        _b.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        statusElement.innerText = "Done!";
                        if (!this._autoMode)
                            this._nextButton.style.visibility = 'hidden';
                        this._inProgress = false;
                        this._goButton.disabled = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    LRUReplacement._cacheSize = 4;
    LRUReplacement._inputData = [];
    LRUReplacement._hexMode = false;
    LRUReplacement._autoMode = true;
    LRUReplacement._inProgress = false;
    // table containers
    LRUReplacement._inputTableContainer = document.getElementById('LRUReplacementInputTableContainer');
    // mode togglers
    LRUReplacement._hexModeToggler = document.getElementById('LRUReplacementShowHexNumbers');
    LRUReplacement._autoModeToggler = document.getElementById('LRUReplacementAutoMode');
    // other IO
    LRUReplacement._goButton = document.getElementById('LRUReplacementGoButton');
    LRUReplacement._outputContainer = document.getElementById('LRUReplacementOutputContainer');
    LRUReplacement._nextButton = document.getElementById('LRUReplacementNextButton');
    return LRUReplacement;
}());
// test data
// LRUReplacement.setAutoMode(false);
// LRUReplacement.setHexMode(true);
// LRUReplacement.cacheSize = 4;
// LRUReplacement.inputData('0x23  0x13  0x17  0x13  0x1F  0x23  0x19  0x13  0x17  0x1F  0x23  0x13');
// LRUReplacement.start();
//# sourceMappingURL=caches.js.map