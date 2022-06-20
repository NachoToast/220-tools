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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var Table = /** @class */ (function () {
    function Table(data, headerRow, verticalHeaderRow) {
        this.element = document.createElement('table');
        this._data = [];
        this._rows = [];
        if (data)
            this._data = data;
        if (headerRow !== undefined && !verticalHeaderRow) {
            this._header = new Row(this, headerRow);
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
    Table.prototype.getRow = function (row) {
        return this._rows[row];
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
        this.data = new Array(size).fill(null);
    }
    DummyCache.prototype.getItemAt = function (index) {
        return this.data[index];
    };
    DummyCache.prototype.setItemAt = function (index, payload) {
        this.data[index] = payload;
    };
    /**
     * Returns the index of the first empty slot, -1 if none.
     *
     * Fully-associative only.
     */
    DummyCache.prototype.getFirstFreeSlot = function () {
        return this.data.findIndex(function (e) { return e === null; });
    };
    /** Fully-associative only. */
    DummyCache.prototype.isFull = function () {
        return this.data.every(function (e) { return e !== null; });
    };
    return DummyCache;
}());
var OldCacheTypes;
(function (OldCacheTypes) {
    OldCacheTypes["FulllyAssociative"] = "fullyAssociative";
    OldCacheTypes["DirectMapped"] = "directMapped";
    OldCacheTypes["SetAssociative"] = "setAssociative";
})(OldCacheTypes || (OldCacheTypes = {}));
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
    LRUReplacement.setCacheType = function (m) {
        if (this._inProgress)
            return;
        this._cacheType = m;
        this._cacheTypeSelect.value = m;
    };
    LRUReplacement.inputData = function (d) {
        if (this._inProgress)
            return;
        this._inputData = d
            .split(/\s|,/g)
            .filter(function (e) { return !!e; })
            .map(function (e) { return Number(e); })
            .filter(function (e) { return !Number.isNaN(e); });
        this.reDrawInputTable();
    };
    LRUReplacement.reDrawInputTable = function () {
        var _this = this;
        this._inputTableContainer.innerHTML = '';
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
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this._table || !this._inputData.length || !this._table || this._inProgress)
                            return [2 /*return*/];
                        this._inProgress = true;
                        _a = this._cacheType;
                        switch (_a) {
                            case OldCacheTypes.FulllyAssociative: return [3 /*break*/, 1];
                            case OldCacheTypes.DirectMapped: return [3 /*break*/, 3];
                            case OldCacheTypes.SetAssociative: return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 7];
                    case 1: return [4 /*yield*/, this.startFullyAssociative()];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 3: return [4 /*yield*/, this.startDirectMapped()];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.startSetAssociative()];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 7:
                        this._inProgress = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    LRUReplacement.startFullyAssociative = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tableData, cacheTable, globalCounter, globalCounterElement, statusElement, cache, _loop_1, this_1, i, len;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._table = this._table;
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
                        _loop_1 = function (i, len) {
                            var tableColumn, index, addedIndex, localCounters, indexOfLowest, removedItem;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        statusElement.innerText = "Sequence #".concat(i + 1);
                                        globalCounter++;
                                        globalCounterElement.innerText = "Global Counter: ".concat(globalCounter.toString());
                                        tableColumn = this_1._table.getColumn(i);
                                        tableColumn.forEach(function (_a) {
                                            var classList = _a.element.classList;
                                            return classList.add('selected');
                                        });
                                        index = cache.data.findIndex(function (e) { return (e === null || e === void 0 ? void 0 : e.address) === _this._inputData[i]; });
                                        if (index !== -1) {
                                            // hit
                                            cache.setItemAt(index, { address: this_1._inputData[i], localCounter: globalCounter });
                                            this_1._table.getCellAt(2, i).setValue('H');
                                            cacheTable.getCellAt(index, 2).setValue(globalCounter.toString());
                                            statusElement.innerText += '\nCache hit, incremented local counter.';
                                        }
                                        else if (!cache.isFull()) {
                                            addedIndex = cache.getFirstFreeSlot();
                                            cache.setItemAt(addedIndex, { address: this_1._inputData[i], localCounter: globalCounter });
                                            this_1._table.getCellAt(2, i).setValue('M');
                                            cacheTable.getCellAt(addedIndex, 1).setValue(this_1.dataToString(this_1._inputData[i]));
                                            cacheTable.getCellAt(addedIndex, 2).setValue(globalCounter.toString());
                                            statusElement.innerText += "\nCompulsory miss, added new address to line ".concat(addedIndex, ".");
                                        }
                                        else {
                                            localCounters = cache.data.map(function (e) { return e.localCounter; });
                                            indexOfLowest = localCounters.indexOf(Math.min.apply(Math, localCounters));
                                            removedItem = cache.getItemAt(indexOfLowest);
                                            cache.setItemAt(indexOfLowest, { address: this_1._inputData[i], localCounter: globalCounter });
                                            this_1._table.getCellAt(2, i).setValue('M');
                                            cacheTable.getCellAt(indexOfLowest, 1).setValue(this_1.dataToString(this_1._inputData[i]));
                                            cacheTable.getCellAt(indexOfLowest, 2).setValue(globalCounter.toString());
                                            statusElement.innerText = "\nCapacity miss, removed ".concat(this_1.dataToString(removedItem.address), " from line 0 (had lowest local counter, ").concat(removedItem.localCounter, ").");
                                        }
                                        return [4 /*yield*/, this_1.wait()];
                                    case 1:
                                        _b.sent();
                                        tableColumn.forEach(function (_a) {
                                            var classList = _a.element.classList;
                                            return classList.remove('selected');
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        i = 0, len = this._inputData.length;
                        _a.label = 1;
                    case 1:
                        if (!(i < len)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(i, len)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        statusElement.innerText = 'Done!';
                        return [2 /*return*/];
                }
            });
        });
    };
    LRUReplacement.startDirectMapped = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tableData, cacheTable, statusElement, cache, slotFunction, i, len, tableColumn, slotNumber, existing;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._table = this._table;
                        tableData = new Array(this._cacheSize).fill([]).map(function (_, i) {
                            var row = new Array(2);
                            row[0] = i.toString();
                            return row;
                        });
                        cacheTable = new Table(tableData, ['Line #', 'Address']);
                        cacheTable.element.style.width = '50%';
                        this._outputContainer.appendChild(cacheTable.element);
                        statusElement = document.createElement('p');
                        this._outputContainer.appendChild(statusElement);
                        cache = new DummyCache(this._cacheSize);
                        slotFunction = function (address) { return address % _this._cacheSize; };
                        i = 0, len = this._inputData.length;
                        _a.label = 1;
                    case 1:
                        if (!(i < len)) return [3 /*break*/, 4];
                        statusElement.innerText = "Sequence #".concat(i + 1);
                        tableColumn = this._table.getColumn(i);
                        tableColumn.forEach(function (_a) {
                            var classList = _a.element.classList;
                            return classList.add('selected');
                        });
                        slotNumber = slotFunction(this._inputData[i]);
                        existing = cache.getItemAt(slotNumber);
                        if (existing !== null && existing === this._inputData[i]) {
                            // hit
                            this._table.getCellAt(2, i).setValue('H');
                            statusElement.innerText += '\nCache hit.';
                        }
                        else if (existing === null) {
                            // compulsory miss
                            cache.setItemAt(slotNumber, this._inputData[i]);
                            this._table.getCellAt(2, i).setValue('M');
                            cacheTable.getCellAt(slotNumber, 1).setValue(this.dataToString(this._inputData[i]));
                            statusElement.innerText += "\nCompulsory miss, added new address to line ".concat(slotNumber, ".");
                        }
                        else {
                            // conflict miss
                            // we don't get capacity misses on direct-mapped caches
                            cache.setItemAt(slotNumber, this._inputData[i]);
                            this._table.getCellAt(2, i).setValue('M');
                            cacheTable.getCellAt(slotNumber, 1).setValue(this.dataToString(this._inputData[i]));
                            statusElement.innerText = "\nConflict miss, replaced ".concat(this.dataToString(existing), " with ").concat(this.dataToString(this._inputData[i]), " (line ").concat(slotNumber, ").");
                        }
                        return [4 /*yield*/, this.wait()];
                    case 2:
                        _a.sent();
                        tableColumn.forEach(function (_a) {
                            var classList = _a.element.classList;
                            return classList.remove('selected');
                        });
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        statusElement.innerText = 'Done!';
                        return [2 /*return*/];
                }
            });
        });
    };
    LRUReplacement.startSetAssociative = function () {
        return __awaiter(this, void 0, void 0, function () {
            var leftTableData, rightTableData, leftTable, rightTable, blockContainer, globalCounter, globalCounterElement, statusElement, leftCache, rightCache, slotFunction, i, len, tableColumn, slotNumber, existingA, existingB;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._cacheSize % 2 !== 0) {
                            window.alert('Cache size must be even for 2-way set associative caching.');
                            return [2 /*return*/];
                        }
                        this._table = this._table;
                        leftTableData = new Array(this._cacheSize / 2).fill([]).map(function (_, i) {
                            var row = new Array(3);
                            row[0] = i.toString();
                            return row;
                        });
                        rightTableData = new Array(this._cacheSize / 2).fill([]).map(function (_, i) {
                            var row = new Array(3);
                            row[0] = i.toString();
                            return row;
                        });
                        leftTable = new Table(leftTableData, ['Line #', 'Address', 'Local Counter']);
                        rightTable = new Table(rightTableData, ['Line #', 'Address', 'Local Counter']);
                        leftTable.element.style.width = '40%';
                        rightTable.element.style.width = '40%';
                        blockContainer = document.createElement('div');
                        blockContainer.style.display = 'flex';
                        blockContainer.style.justifyContent = 'space-evenly';
                        blockContainer.appendChild(leftTable.element);
                        blockContainer.appendChild(rightTable.element);
                        this._outputContainer.appendChild(blockContainer);
                        globalCounter = 0;
                        globalCounterElement = document.createElement('p');
                        this._outputContainer.appendChild(globalCounterElement);
                        statusElement = document.createElement('p');
                        this._outputContainer.appendChild(statusElement);
                        leftCache = new DummyCache(this._cacheSize / 2);
                        rightCache = new DummyCache(this._cacheSize / 2);
                        slotFunction = function (address) { return address % (_this._cacheSize / 2); };
                        i = 0, len = this._inputData.length;
                        _a.label = 1;
                    case 1:
                        if (!(i < len)) return [3 /*break*/, 4];
                        statusElement.innerText = "Sequence #".concat(i + 1);
                        globalCounter++;
                        tableColumn = this._table.getColumn(i);
                        tableColumn.forEach(function (_a) {
                            var classList = _a.element.classList;
                            return classList.add('selected');
                        });
                        slotNumber = slotFunction(this._inputData[i]);
                        existingA = leftCache.getItemAt(slotNumber);
                        existingB = rightCache.getItemAt(slotNumber);
                        if ((existingA === null || existingA === void 0 ? void 0 : existingA.address) === this._inputData[i]) {
                            // hit A
                            leftCache.setItemAt(slotNumber, { address: this._inputData[i], localCounter: globalCounter });
                            this._table.getCellAt(2, i).setValue('H');
                            leftTable.getCellAt(slotNumber, 2).setValue(globalCounter.toString());
                            statusElement.innerText += '\nCache hit (set 0), incremented local counter';
                        }
                        else if ((existingB === null || existingB === void 0 ? void 0 : existingB.address) === this._inputData[i]) {
                            // hit B
                            rightCache.setItemAt(slotNumber, { address: this._inputData[i], localCounter: globalCounter });
                            this._table.getCellAt(2, i).setValue('H');
                            rightTable.getCellAt(slotNumber, 2).setValue(globalCounter.toString());
                            statusElement.innerText += '\nCache hit (set 1), incremented local counter';
                        }
                        else if (existingA === null) {
                            // compulsory miss primary
                            leftCache.setItemAt(slotNumber, { address: this._inputData[i], localCounter: globalCounter });
                            this._table.getCellAt(2, i).setValue('M');
                            leftTable.getCellAt(slotNumber, 1).setValue(this.dataToString(this._inputData[i]));
                            leftTable.getCellAt(slotNumber, 2).setValue(globalCounter.toString());
                            statusElement.innerText += "\nCompulsory miss, added new address to line ".concat(slotNumber, " (set 0).");
                        }
                        else if (existingB === null) {
                            // compulsory miss fallback
                            rightCache.setItemAt(slotNumber, { address: this._inputData[i], localCounter: globalCounter });
                            this._table.getCellAt(2, i).setValue('M');
                            rightTable.getCellAt(slotNumber, 1).setValue(this.dataToString(this._inputData[i]));
                            rightTable.getCellAt(slotNumber, 2).setValue(globalCounter.toString());
                            statusElement.innerText += "\nCompulsory miss, added new address to line ".concat(slotNumber, " (set 1).");
                        }
                        else {
                            // conflict miss
                            // we don't get capacity misses on set associative caches
                            this._table.getCellAt(2, i).setValue('M');
                            if (existingA.localCounter < existingB.localCounter) {
                                // remove A
                                leftCache.setItemAt(slotNumber, { address: this._inputData[i], localCounter: globalCounter });
                                leftTable.getCellAt(slotNumber, 1).setValue(this.dataToString(this._inputData[i]));
                                leftTable.getCellAt(slotNumber, 2).setValue(globalCounter.toString());
                                statusElement.innerText += "\nConflict miss, replaced ".concat(this.dataToString(existingA.address), " with ").concat(this.dataToString(this._inputData[i]), " (set 0, line ").concat(slotNumber, ")");
                            }
                            else {
                                // remove B
                                rightCache.setItemAt(slotNumber, { address: this._inputData[i], localCounter: globalCounter });
                                rightTable.getCellAt(slotNumber, 1).setValue(this.dataToString(this._inputData[i]));
                                rightTable.getCellAt(slotNumber, 2).setValue(globalCounter.toString());
                                statusElement.innerText += "\nConflict miss, replaced ".concat(this.dataToString(existingB.address), " with ").concat(this.dataToString(this._inputData[i]), " (set 1, line ").concat(slotNumber, ")");
                            }
                        }
                        return [4 /*yield*/, this.wait()];
                    case 2:
                        _a.sent();
                        tableColumn.forEach(function (_a) {
                            var classList = _a.element.classList;
                            return classList.remove('selected');
                        });
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LRUReplacement.loadSampleData = function () {
        if (this._inProgress)
            return;
        var inputData = '0x23  0x13  0x17  0x13  0x1F  0x23  0x19  0x13  0x17  0x1F  0x23  0x13';
        document.getElementById('LRUReplacementCacheSize').value = '4';
        LRUReplacement.cacheSize = 4;
        document.getElementById('LRUReplacementInputData').value = inputData;
        LRUReplacement.inputData(inputData);
        LRUReplacement.setHexMode(true);
        LRUReplacement.setCacheType(OldCacheTypes.FulllyAssociative);
    };
    LRUReplacement.loadDirectSampleData = function () {
        if (this._inProgress)
            return;
        var inputData = '8 8 7 3 7 3 7 3';
        document.getElementById('LRUReplacementCacheSize').value = '4';
        LRUReplacement.cacheSize = 4;
        document.getElementById('LRUReplacementInputData').value = inputData;
        LRUReplacement.inputData(inputData);
        LRUReplacement.setHexMode(false);
        LRUReplacement.setCacheType(OldCacheTypes.DirectMapped);
    };
    LRUReplacement.loadSetAssociativeSampleData1 = function () {
        if (this._inProgress)
            return;
        var inputData = '3 7 5 9 3 7 5 9';
        document.getElementById('LRUReplacementCacheSize').value = '4';
        LRUReplacement.cacheSize = 4;
        document.getElementById('LRUReplacementInputData').value = inputData;
        LRUReplacement.inputData(inputData);
        LRUReplacement.setHexMode(false);
        LRUReplacement.setCacheType(OldCacheTypes.SetAssociative);
    };
    LRUReplacement.loadSetAssociativeSampleData2 = function () {
        if (this._inProgress)
            return;
        var inputData = '8 8 7 3 7 3 7 3';
        document.getElementById('LRUReplacementCacheSize').value = '4';
        LRUReplacement.cacheSize = 4;
        document.getElementById('LRUReplacementInputData').value = inputData;
        LRUReplacement.inputData(inputData);
        LRUReplacement.setHexMode(false);
        LRUReplacement.setCacheType(OldCacheTypes.SetAssociative);
    };
    Object.defineProperty(LRUReplacement, "_inProgress", {
        get: function () {
            return this.__inProgress;
        },
        set: function (b) {
            this.__inProgress = b;
            if (b)
                this._outputContainer.innerHTML = '';
            if (!this._autoMode)
                this._nextButton.style.visibility = b ? 'visible' : 'hidden';
            this._goButton.disabled = b;
            this._hexModeToggler.disabled = b;
            this._autoModeToggler.disabled = b;
            this._cacheTypeSelect.disabled = b;
            this._inputElements.forEach(function (e) { return (e.disabled = b); });
            if (b && this._table) {
                this._table.getRow(2).cells.forEach(function (cell) { return cell.setValue(''); });
            }
        },
        enumerable: false,
        configurable: true
    });
    LRUReplacement._cacheSize = 4;
    LRUReplacement._inputData = [];
    LRUReplacement._hexMode = false;
    LRUReplacement._autoMode = true;
    LRUReplacement._cacheType = OldCacheTypes.FulllyAssociative;
    // table containers
    LRUReplacement._inputTableContainer = document.getElementById('LRUReplacementInputTableContainer');
    // mode togglers
    LRUReplacement._hexModeToggler = document.getElementById('LRUReplacementShowHexNumbers');
    LRUReplacement._autoModeToggler = document.getElementById('LRUReplacementAutoMode');
    // other IO
    LRUReplacement._goButton = document.getElementById('LRUReplacementGoButton');
    LRUReplacement._outputContainer = document.getElementById('LRUReplacementOutputContainer');
    LRUReplacement._nextButton = document.getElementById('LRUReplacementNextButton');
    LRUReplacement._cacheTypeSelect = document.getElementById('LRUReplacementCacheTypeSelect');
    LRUReplacement._inputElements = [
        document.getElementById('LRUReplacementCacheSize'),
        document.getElementById('LRUReplacementInputData'),
    ];
    LRUReplacement.__inProgress = false;
    return LRUReplacement;
}());
new LRUReplacement();
var CacheTypes;
(function (CacheTypes) {
    CacheTypes[CacheTypes["DirectMapped"] = 0] = "DirectMapped";
    CacheTypes[CacheTypes["FullyAssociative"] = 1] = "FullyAssociative";
    CacheTypes[CacheTypes["SetAssociative"] = 2] = "SetAssociative";
})(CacheTypes || (CacheTypes = {}));
var CacheEmulator = /** @class */ (function () {
    function CacheEmulator() {
        var _this = this;
        this._container = document.getElementById('cacheEmulation');
        this._containers = {
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
        this._inputElements = {
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
        this._data = this.loadValues();
        this._inputData = [];
        var title = document.createElement('h2');
        title.innerText = 'Cache Emulation';
        this._container.appendChild(title);
        Object.values(this._containers).forEach(function (e) {
            _this._container.appendChild(e);
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
    CacheEmulator.prototype.setAddressBusSize = function () {
        var _a;
        var minAddressSize = Math.ceil(Math.log2(this._data.cacheLines)) + Math.ceil(Math.log2(this._data.wordsPerLine));
        this._data.addressBusSize = Math.max((_a = Number(this._inputElements.addressBusSize.value)) !== null && _a !== void 0 ? _a : this._data.addressBusSize, minAddressSize);
        this._inputElements.addressBusSize.value = this._data.addressBusSize.toString();
        this.showIntermediateOutput();
    };
    CacheEmulator.prototype.setCacheLines = function () {
        var _a;
        this._data.cacheLines = (_a = Number(this._inputElements.cacheLines.value)) !== null && _a !== void 0 ? _a : this._data.cacheLines;
        this._inputElements.cacheLines.value = this._data.cacheLines.toString();
        this.setAddressBusSize();
    };
    CacheEmulator.prototype.setWordsPerLine = function () {
        var _a;
        this._data.wordsPerLine = (_a = Number(this._inputElements.wordsPerLine.value)) !== null && _a !== void 0 ? _a : this._data.wordsPerLine;
        this._inputElements.wordsPerLine.value = this._data.wordsPerLine.toString();
        this.setAddressBusSize();
    };
    CacheEmulator.prototype.setBytesPerWord = function () {
        var _a;
        this._data.bytesPerWord = (_a = Number(this._inputElements.bytesPerWord.value)) !== null && _a !== void 0 ? _a : this._data.bytesPerWord;
        this._inputElements.bytesPerWord.value = this._data.bytesPerWord.toString();
        this.setAddressBusSize();
        this.renderInputTable();
    };
    CacheEmulator.prototype.setHexMode = function () {
        this._inputElements.hexMode = this._inputElements.hexMode;
        this._data.hexMode = this._inputElements.hexMode.checked;
        this._inputElements.hexMode.checked = this._data.hexMode;
        this.handleInputData();
    };
    CacheEmulator.prototype.setAutoMode = function () {
        this._inputElements.autoMode = this._inputElements.autoMode;
        this._data.autoMode = this._inputElements.autoMode.checked;
        this._inputElements.autoMode.checked = this._data.autoMode;
    };
    CacheEmulator.prototype.setDisableSpatialLocality = function () {
        this._inputElements.disableSpatialLocality = this._inputElements.disableSpatialLocality;
        this._data.disableSpatialLocality = this._inputElements.disableSpatialLocality.checked;
        this._inputElements.disableSpatialLocality.checked = this._data.disableSpatialLocality;
    };
    CacheEmulator.prototype.handleInputData = function () {
        this._data.inputData = this._inputElements.inputData.value;
        var rawData = this._inputElements.inputData.value.split(/,?\s+/g);
        if (this._data.hexMode) {
            this._inputData = rawData.map(function (e) { return parseInt(e, 16); }).filter(function (e) { return !Number.isNaN(e); });
        }
        else {
            this._inputData = rawData.map(function (e) { return parseInt(e); }).filter(function (e) { return !Number.isNaN(e); });
        }
        this.renderInputTable();
    };
    CacheEmulator.prototype.handleCacheType = function () {
        this._data.cacheType = Number(this._inputElements.cacheType.value);
    };
    CacheEmulator.prototype.renderInputTable = function () {
        var _this = this;
        this._containers.inputTableContainer.innerHTML = '';
        if (!this._inputData.length) {
            this._containers.goButton.disabled = true;
            return;
        }
        this._containers.goButton.disabled = false;
        var tableData = new Array(3);
        tableData[0] = new Array(this._inputData.length).fill('').map(function (_, i) { return (i + 1).toString(); }); // sequence #
        tableData[1] = this._inputData.map(function (e) { return _this.parseString(e); }); // address
        tableData[2] = new Array(this._inputData.length); // hit/miss (i guess they never miss huh?)
        var table = new Table(tableData, ['Sequence #', 'Address', 'Hit/Miss'], true);
        this._containers.inputTableContainer.appendChild(table.element);
        this._containers.goButton.onclick = function () { return _this.start(table); };
    };
    CacheEmulator.prototype.start = function (inputTable) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this._containers.goButton.onclick = null;
                        this._containers.outputTableContainer.innerHTML = '';
                        inputTable.getRow(2).cells.forEach(function (e) { return e.setValue(''); });
                        if (this._data.autoMode) {
                            this._containers.goButton.style.visibility = 'hidden';
                        }
                        else {
                            this._containers.goButton.innerText = 'Next Step';
                        }
                        Object.values(this._inputElements).forEach(function (e) { return (e.disabled = true); });
                        _a = this._data.cacheType;
                        switch (_a) {
                            case CacheTypes.DirectMapped: return [3 /*break*/, 1];
                            case CacheTypes.FullyAssociative: return [3 /*break*/, 3];
                            case CacheTypes.SetAssociative: return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 7];
                    case 1: return [4 /*yield*/, this.doDirectMapped(inputTable)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 3: return [4 /*yield*/, this.doFullyAssociative(inputTable)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.doSetAssociative(inputTable)];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 7:
                        if (this._data.autoMode) {
                            this._containers.goButton.style.visibility = 'visible';
                        }
                        else {
                            this._containers.goButton.innerText = 'Go';
                            this._containers.goButton.onclick = function () { return _this.start(inputTable); };
                        }
                        Object.values(this._inputElements).forEach(function (e) { return (e.disabled = false); });
                        return [2 /*return*/];
                }
            });
        });
    };
    CacheEmulator.prototype.doFullyAssociative = function (inputTable) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('doing FullyAssociative');
                        return [4 /*yield*/, new Promise(function (res) { return setTimeout(res, 1000); })];
                    case 1:
                        _a.sent();
                        console.log('done');
                        return [2 /*return*/];
                }
            });
        });
    };
    CacheEmulator.prototype.doDirectMapped = function (inputTable) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var bytesPerLine, bitsForOffset, tableData, cacheTable, cache, i, len, output, tableColumn, queriedAddress, lowestAddress, highestAddress, rowNumber, columnNumber, searchRow, searchColumn, cell, existingItem, i_1, i_2;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        bytesPerLine = this._data.bytesPerWord * this._data.wordsPerLine;
                        bitsForOffset = Math.ceil(Math.log2(bytesPerLine));
                        this._containers.outputDetailsContainer.innerText = "Bits for offset: ".concat(bitsForOffset);
                        tableData = new Array(this._data.cacheLines).fill([]).map(function (_, i) {
                            var row = new Array(bytesPerLine + 1);
                            row[0] = i.toString();
                            return row;
                        });
                        cacheTable = new Table(tableData, __spreadArray([
                            'Line #'
                        ], new Array(bytesPerLine).fill('').map(function (_, i) { return i.toString(); }), true));
                        this._containers.outputTableContainer.appendChild(cacheTable.element);
                        cache = new Array(this._data.cacheLines).fill([]).map(function () { return new Array(bytesPerLine); });
                        i = 0, len = this._inputData.length;
                        _e.label = 1;
                    case 1:
                        if (!(i < len)) return [3 /*break*/, 9];
                        output = ["Sequence #".concat(i + 1)];
                        tableColumn = inputTable.getColumn(i);
                        tableColumn.forEach(function (_a) {
                            var classList = _a.element.classList;
                            return classList.add('selected');
                        });
                        queriedAddress = this._inputData[i];
                        lowestAddress = (this._inputData[i] >> bitsForOffset) << bitsForOffset;
                        highestAddress = this._inputData[i] | (Math.pow(2, bitsForOffset) - 1);
                        output.push("Queried address = ".concat(this.parseString(queriedAddress), ", in binary = ").concat(this.parseToBinary(queriedAddress, bitsForOffset)), "Lowest offset address = ".concat(this.parseString(lowestAddress), ", in binary = ").concat(this.parseToBinary(lowestAddress, bitsForOffset)), "Highest offset address = ".concat(this.parseString(highestAddress), ", in binary = ").concat(this.parseToBinary(highestAddress, bitsForOffset)));
                        rowNumber = queriedAddress % this._data.cacheLines;
                        columnNumber = queriedAddress & (Math.pow(2, bitsForOffset) - 1);
                        output.push("Row number = ".concat(this.parseString(queriedAddress), " % ").concat(this._data.cacheLines, " = ").concat(rowNumber, "<br />Column number = Last <b>").concat(bitsForOffset, "</b> bits of address = ").concat(columnNumber
                            .toString(2)
                            .padStart(4, '0'), " = ").concat(columnNumber));
                        searchRow = cacheTable.getRow(rowNumber);
                        searchColumn = cacheTable.getColumn(columnNumber + 1);
                        cell = cacheTable.getCellAt(rowNumber, columnNumber + 1);
                        (_b = (_a = cacheTable._header) === null || _a === void 0 ? void 0 : _a.cells[columnNumber + 1]) === null || _b === void 0 ? void 0 : _b.element.classList.add('selected');
                        searchRow.cells.forEach(function (_a) {
                            var classList = _a.element.classList;
                            return classList.add('selected');
                        });
                        searchColumn.forEach(function (_a) {
                            var classList = _a.element.classList;
                            return classList.add('selected');
                        });
                        cell.element.classList.add('doubleSelected');
                        existingItem = cache[rowNumber][columnNumber];
                        if (!(existingItem === undefined)) return [3 /*break*/, 3];
                        // compulsory miss
                        inputTable.getCellAt(2, i).setValue('M');
                        output.push("Compulsory miss, filling in line ".concat(rowNumber));
                        this._containers.outputDetailsContainer.innerHTML = output.join('<br />');
                        return [4 /*yield*/, this.wait()];
                    case 2:
                        _e.sent();
                        output.pop();
                        for (i_1 = 0; i_1 < bytesPerLine; i_1++) {
                            cache[rowNumber][i_1 + 1] = lowestAddress + i_1;
                            searchRow.cells[i_1 + 1].setValue(this.parseString(lowestAddress + i_1));
                        }
                        output.push('<span style="color: green">Inserted all addresses</span>');
                        return [3 /*break*/, 6];
                    case 3:
                        if (!(existingItem === queriedAddress)) return [3 /*break*/, 4];
                        // hit
                        inputTable.getCellAt(2, i).setValue('H');
                        output.push('Cache hit');
                        return [3 /*break*/, 6];
                    case 4:
                        // conflict miss
                        // we don't get capacity misses on direct-mapped caches
                        inputTable.getCellAt(2, i).setValue('H');
                        output.push("Conflict miss, filling in line ".concat(rowNumber));
                        this._containers.outputDetailsContainer.innerHTML = output.join('<br />');
                        return [4 /*yield*/, this.wait()];
                    case 5:
                        _e.sent();
                        output.pop();
                        for (i_2 = 0; i_2 < bytesPerLine; i_2++) {
                            cache[rowNumber][i_2 + 1] = lowestAddress + i_2;
                            searchRow.cells[i_2 + 1].setValue(this.parseString(lowestAddress + i_2));
                        }
                        output.push('<span style="color: green">Replaced all addresses</span>');
                        _e.label = 6;
                    case 6:
                        // displaying output information for this step
                        this._containers.outputDetailsContainer.innerHTML = output.join('<br />');
                        return [4 /*yield*/, this.wait()];
                    case 7:
                        _e.sent();
                        // unhighlighting
                        (_d = (_c = cacheTable._header) === null || _c === void 0 ? void 0 : _c.cells[columnNumber + 1]) === null || _d === void 0 ? void 0 : _d.element.classList.remove('selected');
                        tableColumn.forEach(function (_a) {
                            var classList = _a.element.classList;
                            return classList.remove('selected');
                        });
                        searchRow.cells.forEach(function (_a) {
                            var classList = _a.element.classList;
                            return classList.remove('selected');
                        });
                        searchColumn.forEach(function (_a) {
                            var classList = _a.element.classList;
                            return classList.remove('selected');
                        });
                        cell.element.classList.remove('doubleSelected');
                        _e.label = 8;
                    case 8:
                        i++;
                        return [3 /*break*/, 1];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    CacheEmulator.prototype.wait = function (ms) {
        var _this = this;
        if (ms === void 0) { ms = 1000; }
        if (this._data.autoMode) {
            return new Promise(function (resolve) { return setTimeout(resolve, ms); });
        }
        return new Promise(function (resolve) {
            _this._containers.goButton.onclick = function () {
                _this._containers.goButton.onclick = null;
                resolve();
            };
        });
    };
    CacheEmulator.prototype.doSetAssociative = function (inputTable) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('doing SetAssociative');
                        return [4 /*yield*/, new Promise(function (res) { return setTimeout(res, 1000); })];
                    case 1:
                        _a.sent();
                        console.log('done');
                        return [2 /*return*/];
                }
            });
        });
    };
    CacheEmulator.prototype.showIntermediateOutput = function () {
        var rawBitsForIndex = Math.log2(this._data.cacheLines || 1);
        var bitsForIndex = Math.ceil(rawBitsForIndex);
        var rawBitsForOffset = Math.log2(this._data.wordsPerLine * this._data.bytesPerWord || 1);
        var bitsForOffset = Math.ceil(rawBitsForOffset);
        var bitsForTag = this._data.addressBusSize - bitsForIndex - bitsForOffset;
        var totalBytes = this._data.cacheLines * this._data.wordsPerLine * this._data.bytesPerWord;
        var totalAsLog = Math.log2(totalBytes);
        var extraSizeInfo = Number.isInteger(totalAsLog) ? " (2<sup>".concat(totalAsLog, "</sup>)") : '';
        var output = [
            "This cache has <b title=\"".concat(rawBitsForIndex, "\">").concat(bitsForIndex, "</b> bits for index, <b title=\"").concat(rawBitsForOffset, "\">").concat(bitsForOffset, "</b> bits for offset, and <b>").concat(bitsForTag, "</b> bits for tag."),
            "It can store a total of <b>".concat(totalBytes, "</b>").concat(extraSizeInfo, " bytes."),
        ];
        this._containers.preOutput.innerHTML = output.join('<br />');
    };
    /** Parse a decimal or hexadecimal address depending on whether hex mode is enabled. */
    CacheEmulator.prototype.parseString = function (n) {
        if (this._data.hexMode) {
            return "0x".concat(n.toString(16).toUpperCase().padStart(this._data.bytesPerWord, '0'));
        }
        return n.toString();
    };
    /** Parse a number into a binary string, spacing out nibbles. */
    CacheEmulator.prototype.parseToBinary = function (n, offsetBits) {
        var output = '';
        var lowestBitBeforePaint = 16 - offsetBits - 1;
        var rawString = n.toString(2).padStart(16, '0');
        for (var i = 0; i < 16; i++) {
            output += rawString.substring(i, i + 1);
            if (i % 4 === 3) {
                output += ' ';
            }
            if (i === lowestBitBeforePaint) {
                output += "<b style=\"cursor: help\" title=\"Last ".concat(offsetBits, " bits\">");
            }
        }
        output += '</b>';
        return output;
    };
    CacheEmulator.prototype.createSelectElement = function (props) {
        var select = document.createElement('select');
        for (var _i = 0, _a = props.options; _i < _a.length; _i++) {
            var _b = _a[_i], value = _b.value, text = _b.text;
            var option = document.createElement('option');
            option.value = value.toString();
            option.innerText = text;
            select.appendChild(option);
        }
        if (props === null || props === void 0 ? void 0 : props.title)
            select.title = props.title;
        var onInput = props === null || props === void 0 ? void 0 : props.onInput;
        if (onInput) {
            onInput = onInput.bind(this);
            select.oninput = function () { return onInput(); };
        }
        var lbl = props === null || props === void 0 ? void 0 : props.label;
        if (lbl) {
            var id = lbl;
            select.id = id;
            var label = document.createElement('label');
            label.innerText = lbl;
            label.htmlFor = id;
            if ((props === null || props === void 0 ? void 0 : props.parent) === undefined)
                throw new Error('Cannot create a label without a parent');
            if (props.title) {
                label.title = props.title;
                label.style.cursor = 'help';
            }
            var container = document.createElement('div');
            container.appendChild(label);
            container.appendChild(select);
            props.parent.appendChild(container);
        }
        else if (props === null || props === void 0 ? void 0 : props.parent)
            props.parent.appendChild(select);
        return select;
    };
    CacheEmulator.prototype.createInputElement = function (props) {
        var input = document.createElement('input');
        if (props === null || props === void 0 ? void 0 : props.title)
            input.title = props.title;
        var onInput = props === null || props === void 0 ? void 0 : props.onInput;
        if (onInput) {
            onInput = onInput.bind(this);
            input.oninput = function () { return onInput(); };
        }
        if (props === null || props === void 0 ? void 0 : props.type)
            input.type = props.type;
        if ((props === null || props === void 0 ? void 0 : props.type) === 'number') {
            input.min = '0';
        }
        var lbl = props === null || props === void 0 ? void 0 : props.label;
        if (lbl) {
            var id = lbl;
            input.id = id;
            var label = document.createElement('label');
            label.innerText = lbl;
            label.htmlFor = id;
            if ((props === null || props === void 0 ? void 0 : props.parent) === undefined)
                throw new Error('Cannot create a label without a parent');
            if (props.title) {
                label.title = props.title;
                label.style.cursor = 'help';
            }
            var container = document.createElement('div');
            container.appendChild(label);
            container.appendChild(input);
            props.parent.appendChild(container);
        }
        else if (props === null || props === void 0 ? void 0 : props.parent)
            props.parent.appendChild(input);
        return input;
    };
    CacheEmulator.prototype.saveValues = function () {
        localStorage.setItem('CacheEmulatorValues', JSON.stringify(this._data));
    };
    CacheEmulator.prototype.loadValues = function () {
        var source = localStorage.getItem('CacheEmulatorValues');
        if (source !== null) {
            Object.assign(CacheEmulator.Defaults, JSON.parse(source));
        }
        for (var k in CacheEmulator.Defaults) {
            var key = k;
            if (this._inputElements[key] instanceof HTMLInputElement && this._inputElements[key].type === 'checkbox') {
                this._inputElements[key].checked = !!CacheEmulator.Defaults[key];
            }
            else {
                this._inputElements[key].value = CacheEmulator.Defaults[key].toString();
            }
        }
        return CacheEmulator.Defaults;
    };
    CacheEmulator.Defaults = {
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
    return CacheEmulator;
}());
new CacheEmulator();
//# sourceMappingURL=caches.js.map