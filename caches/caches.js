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
        this._size = size;
        this.data = new Array(size).fill(null);
    }
    DummyCache.prototype.getItemAt = function (index) {
        return this.data[index];
    };
    DummyCache.prototype.setItemAt = function (index, payload) {
        this.data[index] = payload;
    };
    /** Returns the index of the first empty slot, -1 if none. */
    DummyCache.prototype.getFirstFreeSlot = function () {
        return this.data.findIndex(function (e) { return e === null; });
    };
    DummyCache.prototype.isFull = function () {
        return this.data.every(function (e) { return e !== null; });
    };
    return DummyCache;
}());
var CacheTypes;
(function (CacheTypes) {
    CacheTypes["FulllyAssociative"] = "fullyAssociative";
    CacheTypes["DirectMapped"] = "directMapped";
    CacheTypes["SetAssociative"] = "setAssociative";
})(CacheTypes || (CacheTypes = {}));
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
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this._table || !this._inputData.length || !this._table || this._inProgress)
                            return [2 /*return*/];
                        this._inProgress = true;
                        _a = this._cacheType;
                        switch (_a) {
                            case CacheTypes.FulllyAssociative: return [3 /*break*/, 1];
                            case CacheTypes.DirectMapped: return [3 /*break*/, 3];
                            case CacheTypes.SetAssociative: return [3 /*break*/, 5];
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
                                            this_1._table.getCellAt(2, i).setValue("H");
                                            cacheTable.getCellAt(index, 2).setValue(globalCounter.toString());
                                            statusElement.innerText += "\nCache hit, incremented local counter.";
                                        }
                                        else if (!cache.isFull()) {
                                            addedIndex = cache.getFirstFreeSlot();
                                            cache.setItemAt(addedIndex, { address: this_1._inputData[i], localCounter: globalCounter });
                                            this_1._table.getCellAt(2, i).setValue("M");
                                            cacheTable.getCellAt(addedIndex, 1).setValue(this_1.dataToString(this_1._inputData[i]));
                                            cacheTable.getCellAt(addedIndex, 2).setValue(globalCounter.toString());
                                            statusElement.innerText += "\nCompulsory miss, added new address to line ".concat(addedIndex, ".");
                                        }
                                        else {
                                            localCounters = cache.data.map(function (e) { return e.localCounter; });
                                            indexOfLowest = localCounters.indexOf(Math.min.apply(Math, localCounters));
                                            removedItem = cache.getItemAt(indexOfLowest);
                                            cache.setItemAt(indexOfLowest, { address: this_1._inputData[i], localCounter: globalCounter });
                                            this_1._table.getCellAt(2, i).setValue("M");
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
                        statusElement.innerText = "Done!";
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
                            this._table.getCellAt(2, i).setValue("H");
                            statusElement.innerText += "\nCache hit.";
                        }
                        else if (existing === null) {
                            // compulsory miss
                            cache.setItemAt(slotNumber, this._inputData[i]);
                            this._table.getCellAt(2, i).setValue("M");
                            cacheTable.getCellAt(slotNumber, 1).setValue(this.dataToString(this._inputData[i]));
                            statusElement.innerText += "\nCompulsory miss, added new address to line ".concat(slotNumber, ".");
                        }
                        else {
                            // conflict miss
                            // we don't get capacity misses on direct-mapped caches
                            cache.setItemAt(slotNumber, this._inputData[i]);
                            this._table.getCellAt(2, i).setValue("M");
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
                        statusElement.innerText = "Done!";
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
                            statusElement.innerText += "\nCache hit (set 0), incremented local counter";
                        }
                        else if ((existingB === null || existingB === void 0 ? void 0 : existingB.address) === this._inputData[i]) {
                            // hit B
                            rightCache.setItemAt(slotNumber, { address: this._inputData[i], localCounter: globalCounter });
                            this._table.getCellAt(2, i).setValue('H');
                            rightTable.getCellAt(slotNumber, 2).setValue(globalCounter.toString());
                            statusElement.innerText += "\nCache hit (set 1), incremented local counter";
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
        LRUReplacement.setCacheType(CacheTypes.FulllyAssociative);
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
        LRUReplacement.setCacheType(CacheTypes.DirectMapped);
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
        LRUReplacement.setCacheType(CacheTypes.SetAssociative);
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
        LRUReplacement.setCacheType(CacheTypes.SetAssociative);
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
    LRUReplacement._cacheType = CacheTypes.FulllyAssociative;
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
//# sourceMappingURL=caches.js.map