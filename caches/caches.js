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
var CacheTypes;
(function (CacheTypes) {
    CacheTypes[CacheTypes["DirectMapped"] = 0] = "DirectMapped";
    CacheTypes[CacheTypes["DirectMappedSimple"] = 1] = "DirectMappedSimple";
    CacheTypes[CacheTypes["FullyAssociative"] = 2] = "FullyAssociative";
    CacheTypes[CacheTypes["SetAssociative"] = 3] = "SetAssociative";
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
            indexFieldBits: this.createInputElement({
                label: 'Index (line #) field bits: ',
                title: 'This changes index bits required',
                type: 'number',
                classes: ['indexBits'],
                parent: this._containers.inputContainer1,
                onInput: this.setIndexFieldBits,
            }),
            offsetFieldBits: this.createInputElement({
                label: 'Offset field bits: ',
                classes: ['offsetBits'],
                title: 'This changes offset bits required',
                type: 'number',
                parent: this._containers.inputContainer1,
                onInput: this.setOffsetFieldBits,
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
        this._data = this.loadValues();
        this._inputData = [];
        var title = document.createElement('h2');
        title.style.marginBottom = '0';
        title.innerText = 'Cache Emulator';
        this._container.appendChild(title);
        var subtitle = document.createElement('a');
        subtitle.style.marginTop = '0';
        subtitle.style.display = 'inline-block';
        subtitle.href = 'https://github.com/NachoToast';
        subtitle.rel = 'noreferrer';
        subtitle.target = '_blank';
        subtitle.style.marginBottom = '1em';
        subtitle.innerHTML = '<i>By NachoToast</i>';
        this._container.appendChild(subtitle);
        Object.values(this._containers).forEach(function (e) {
            _this._container.appendChild(e);
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
    CacheEmulator.prototype.setAddressBusSize = function () {
        var _a;
        this._data.addressBusSize = (_a = Number(this._inputElements.addressBusSize.value)) !== null && _a !== void 0 ? _a : this._data.addressBusSize;
        this._inputElements.addressBusSize.value = this._data.addressBusSize.toString();
        this.showIntermediateOutput();
    };
    CacheEmulator.prototype.setIndexFieldBits = function () {
        var _a;
        this._data.indexFieldBits = (_a = Number(this._inputElements.indexFieldBits.value)) !== null && _a !== void 0 ? _a : this._data.indexFieldBits;
        this._inputElements.indexFieldBits.value = this._data.indexFieldBits.toString();
        this.setAddressBusSize();
    };
    CacheEmulator.prototype.setOffsetFieldBits = function () {
        var _a;
        this._data.offsetFieldBits = (_a = Number(this._inputElements.offsetFieldBits.value)) !== null && _a !== void 0 ? _a : this._data.offsetFieldBits;
        this._inputElements.offsetFieldBits.value = this._data.offsetFieldBits.toString();
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
                            case CacheTypes.DirectMappedSimple: return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 9];
                    case 1: return [4 /*yield*/, this.doDirectMapped(inputTable)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 3: return [4 /*yield*/, this.doFullyAssociative(inputTable)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 5: return [4 /*yield*/, this.doSetAssociative(inputTable)];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 7: return [4 /*yield*/, this.doDirectMappedSimple(inputTable)];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 9: throw new Error("Unexpected cache type: ".concat(this._data.cacheType));
                    case 10:
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
            var tableData, cacheTable, cache, globalCounter, _loop_1, this_1, i, len;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tableData = new Array(Math.pow(2, this._data.indexFieldBits)).fill([]).map(function (_, i) {
                            var row = new Array(3);
                            row[0] = i.toString();
                            return row;
                        });
                        cacheTable = new Table(tableData, ['Line #', 'Address', 'Local Counter']);
                        this._containers.outputTableContainer.appendChild(cacheTable.element);
                        cache = new DummyCache(Math.pow(2, this._data.indexFieldBits));
                        globalCounter = 0;
                        _loop_1 = function (i, len) {
                            var output, tableColumn, cellsModified, index, addedIndex, allLocalCounters, indexOfLowest, removedItem;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        globalCounter++;
                                        output = [
                                            "Sequence <b>#".concat(i + 1, "</b>: ").concat(this_1.parseString(this_1._inputData[i])),
                                            "Global Counter: <b>".concat(globalCounter, "</b>"),
                                            "Searching all lines for ".concat(this_1.parseString(this_1._inputData[i])),
                                        ];
                                        tableColumn = inputTable.getColumn(i);
                                        tableColumn.forEach(function (_a) {
                                            var classList = _a.element.classList;
                                            return classList.add('selected');
                                        });
                                        this_1._containers.outputDetailsContainer.innerHTML = output.join('<br />');
                                        return [4 /*yield*/, this_1.wait()];
                                    case 1:
                                        _b.sent();
                                        output.pop();
                                        cellsModified = void 0;
                                        index = cache.data.findIndex(function (e) { return (e === null || e === void 0 ? void 0 : e.address) === _this._inputData[i]; });
                                        if (index !== -1) {
                                            // hit
                                            inputTable.getCellAt(2, i).setValue('H');
                                            cache.setItemAt(index, { address: this_1._inputData[i], localCounter: globalCounter });
                                            cacheTable
                                                .getRow(index)
                                                .cells.forEach(function (_a) {
                                                var classList = _a.element.classList;
                                                return classList.add('selected', 'good');
                                            });
                                            cellsModified = cacheTable.getRow(index).cells;
                                            cacheTable.getRow(index).element.scrollIntoView({ behavior: 'smooth' });
                                            cacheTable.getCellAt(index, 2).setValue(globalCounter.toString());
                                            output.push('<i>Hit, updated local counter</i>');
                                        }
                                        else if (!cache.isFull()) {
                                            // compulsory miss
                                            inputTable.getCellAt(2, i).setValue('M');
                                            addedIndex = cache.getFirstFreeSlot();
                                            cache.setItemAt(addedIndex, { address: this_1._inputData[i], localCounter: globalCounter });
                                            cacheTable.getCellAt(addedIndex, 1).setValue(this_1.parseString(this_1._inputData[i]));
                                            cacheTable.getCellAt(addedIndex, 2).setValue(globalCounter.toString());
                                            cacheTable
                                                .getRow(addedIndex)
                                                .cells.forEach(function (_a) {
                                                var classList = _a.element.classList;
                                                return classList.add('selected', 'neutral');
                                            });
                                            cellsModified = cacheTable.getRow(addedIndex).cells;
                                            cacheTable.getRow(addedIndex).element.scrollIntoView({ behavior: 'smooth' });
                                            output.push("<i>Compulsory miss, added new address to line ".concat(addedIndex, "</i>"));
                                        }
                                        else {
                                            // capacity miss
                                            // we don't get conflicy misses on fully-associative caches
                                            inputTable.getCellAt(2, i).setValue('M');
                                            allLocalCounters = cache.data.map(function (e) { var _a; return (_a = e === null || e === void 0 ? void 0 : e.localCounter) !== null && _a !== void 0 ? _a : Infinity; });
                                            indexOfLowest = allLocalCounters.indexOf(Math.min.apply(Math, allLocalCounters));
                                            removedItem = cache.getItemAt(indexOfLowest);
                                            cache.setItemAt(indexOfLowest, { address: this_1._inputData[i], localCounter: globalCounter });
                                            cacheTable.getCellAt(indexOfLowest, 1).setValue(this_1.parseString(this_1._inputData[i]));
                                            cacheTable.getRow(indexOfLowest).element.scrollIntoView({ behavior: 'smooth' });
                                            cacheTable
                                                .getRow(indexOfLowest)
                                                .cells.forEach(function (_a) {
                                                var classList = _a.element.classList;
                                                return classList.add('selected', 'bad');
                                            });
                                            cellsModified = cacheTable.getRow(indexOfLowest).cells;
                                            cacheTable.getCellAt(indexOfLowest, 2).setValue(globalCounter.toString());
                                            output.push("<i>Capacity miss, removed ".concat(this_1.parseString(removedItem.address), " (had lowest local counter, ").concat(removedItem.localCounter, ")</i>"));
                                        }
                                        // displaying output information for this step
                                        this_1._containers.outputDetailsContainer.innerHTML = output.join('<br />');
                                        return [4 /*yield*/, this_1.wait()];
                                    case 2:
                                        _b.sent();
                                        // unhighlighting
                                        tableColumn.forEach(function (_a) {
                                            var classList = _a.element.classList;
                                            return classList.remove('selected');
                                        });
                                        cellsModified.forEach(function (_a) {
                                            var classList = _a.element.classList;
                                            return classList.remove('selected', 'bad', 'neutral', 'good');
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
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CacheEmulator.prototype.doDirectMapped = function (inputTable) {
        return __awaiter(this, void 0, void 0, function () {
            var index, offset, tag, tableData, cacheTable, cache, i, len, output, tableColumn, queriedAddress, lowestAddress, highestAddress, tagNumber, lineNumber, actualLineNumber, offsetValue, searchRow, existingItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        index = this._data.indexFieldBits;
                        offset = this._data.offsetFieldBits;
                        tag = this._data.addressBusSize - index - offset;
                        tableData = new Array(Math.pow(2, this._data.indexFieldBits)).fill([]).map(function (_, i) {
                            var row = new Array(3);
                            row[0] = i.toString();
                            return row;
                        });
                        cacheTable = new Table(tableData, ['Line #', 'Address Range', 'Tag']);
                        this._containers.outputTableContainer.appendChild(cacheTable.element);
                        cache = new Array(Math.pow(2, this._data.indexFieldBits));
                        i = 0, len = this._inputData.length;
                        _a.label = 1;
                    case 1:
                        if (!(i < len)) return [3 /*break*/, 5];
                        output = ["Sequence <b>#".concat(i + 1, "</b>: ").concat(this.parseString(this._inputData[i]))];
                        tableColumn = inputTable.getColumn(i);
                        tableColumn.forEach(function (_a) {
                            var classList = _a.element.classList;
                            return classList.add('selected');
                        });
                        queriedAddress = this._inputData[i];
                        lowestAddress = (this._inputData[i] >> offset) << offset;
                        highestAddress = this._inputData[i] | (Math.pow(2, offset) - 1);
                        output.push("<div class='addressInfoContainer'>\n                    <div><span class=\"addressInfo\">Queried address</span> = ".concat(this.parseString(queriedAddress), " = ").concat(this.parseToBinary(queriedAddress), "</div>\n                    <div><span class=\"addressInfo\">Lowest address</span> = ").concat(this.parseString(lowestAddress), " = ").concat(this.parseToBinary(lowestAddress), "</div>\n                    <div><span class=\"addressInfo\">Highest address</span> = ").concat(this.parseString(highestAddress), " = ").concat(this.parseToBinary(highestAddress), "</div>\n                    </div>"));
                        tagNumber = queriedAddress >> (this._data.addressBusSize - tag);
                        lineNumber = (queriedAddress >> offset) & (Math.pow(2, index) - 1);
                        actualLineNumber = lineNumber % Math.pow(2, this._data.indexFieldBits);
                        offsetValue = queriedAddress & (Math.pow(2, offset) - 1);
                        output.push("Tag = <span class=\"tagBits\">".concat(tagNumber.toString(2).padStart(tag, '0'), "</span> = <b>").concat(tagNumber, "</b>"), "Index (Line) = <span class=\"indexBits\">".concat(lineNumber
                            .toString(2)
                            .padStart(index, '0'), "</span> = <span class=\"indexBits\">").concat(lineNumber, "</span> % ").concat(Math.pow(2, this._data.indexFieldBits), " = <b>").concat(actualLineNumber, "</b>"), "Offset (Column) = <span class=\"offsetBits\">".concat(offsetValue
                            .toString(2)
                            .padStart(offset, '0'), "</span> = <b>").concat(offsetValue, "</b>"));
                        searchRow = cacheTable.getRow(lineNumber);
                        searchRow.cells.forEach(function (_a) {
                            var classList = _a.element.classList;
                            return classList.add('selected');
                        });
                        output.push("<i>Checking line number ".concat(lineNumber, " for items with tag ").concat(tag, "</i>"));
                        searchRow.element.scrollIntoView({ behavior: 'smooth' });
                        this._containers.outputDetailsContainer.innerHTML = output.join('<br />');
                        return [4 /*yield*/, this.wait()];
                    case 2:
                        _a.sent();
                        output.pop();
                        existingItem = cache[lineNumber];
                        if (existingItem === undefined) {
                            // compulsory miss
                            inputTable.getCellAt(2, i).setValue('M');
                            output.push("<i>Compulsory miss, populated line ".concat(lineNumber, "</i>"));
                            searchRow.cells.forEach(function (_a) {
                                var classList = _a.element.classList;
                                return classList.add('neutral');
                            });
                            cache[lineNumber] = { lowest: lowestAddress, highest: highestAddress, tag: tagNumber };
                            searchRow.cells[1].setValue("".concat(this.parseString(lowestAddress), " .. ").concat(this.parseString(highestAddress)));
                            searchRow.cells[2].setValue(tagNumber.toString());
                        }
                        else if (existingItem.tag === tagNumber) {
                            // hit
                            inputTable.getCellAt(2, i).setValue('H');
                            output.push('<i>Hit, tag number matches</i>');
                            searchRow.cells.forEach(function (_a) {
                                var classList = _a.element.classList;
                                return classList.add('good');
                            });
                        }
                        else {
                            // conflict miss
                            // we don't get capacity misses on direct-mapped caches
                            inputTable.getCellAt(2, i).setValue('M');
                            output.push("<i>Conflict miss (tag at line ".concat(lineNumber, " is ").concat(existingItem.tag, ", expected ").concat(tagNumber, "), repopulated line ").concat(lineNumber, "</i>"));
                            searchRow.cells.forEach(function (_a) {
                                var classList = _a.element.classList;
                                return classList.add('bad');
                            });
                            cache[lineNumber] = { lowest: lowestAddress, highest: highestAddress, tag: tagNumber };
                            searchRow.cells[1].setValue("".concat(this.parseString(lowestAddress), " .. ").concat(this.parseString(highestAddress)));
                            searchRow.cells[2].setValue(tagNumber.toString());
                        }
                        // displaying output information for this step
                        this._containers.outputDetailsContainer.innerHTML = output.join('<br />');
                        return [4 /*yield*/, this.wait()];
                    case 3:
                        _a.sent();
                        // unhighlighting
                        tableColumn.forEach(function (_a) {
                            var classList = _a.element.classList;
                            return classList.remove('selected');
                        });
                        searchRow.cells.forEach(function (_a) {
                            var classList = _a.element.classList;
                            return classList.remove('selected', 'bad', 'neutral', 'good');
                        });
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CacheEmulator.prototype.doDirectMappedSimple = function (inputTable) {
        return __awaiter(this, void 0, void 0, function () {
            var tableData, cacheTable, cache, i, len, slotNumber, output, tableColumn, cellsModified, existing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tableData = new Array(Math.pow(2, this._data.indexFieldBits)).fill([]).map(function (_, i) {
                            var row = new Array(2);
                            row[0] = i.toString();
                            return row;
                        });
                        cacheTable = new Table(tableData, ['Line #', 'Address']);
                        this._containers.outputTableContainer.appendChild(cacheTable.element);
                        cache = new DummyCache(Math.pow(2, this._data.indexFieldBits));
                        i = 0, len = this._inputData.length;
                        _a.label = 1;
                    case 1:
                        if (!(i < len)) return [3 /*break*/, 5];
                        slotNumber = this._inputData[i] % Math.pow(2, this._data.indexFieldBits);
                        output = [
                            "Sequence <b>#".concat(i + 1, "</b>: ").concat(this.parseString(this._inputData[i])),
                            "Slot # = ".concat(this.parseString(this._inputData[i]), " % ").concat(Math.pow(2, this._data.indexFieldBits), " = <b>").concat(this.parseString(slotNumber), "</b>"),
                        ];
                        tableColumn = inputTable.getColumn(i);
                        tableColumn.forEach(function (_a) {
                            var classList = _a.element.classList;
                            return classList.add('selected');
                        });
                        this._containers.outputDetailsContainer.innerHTML = output.join('<br />');
                        return [4 /*yield*/, this.wait()];
                    case 2:
                        _a.sent();
                        output.pop();
                        cellsModified = void 0;
                        existing = cache.getItemAt(slotNumber);
                        if (existing !== null && existing === this._inputData[i]) {
                            // hit
                            inputTable.getCellAt(2, i).setValue('H');
                            cacheTable
                                .getRow(slotNumber)
                                .cells.forEach(function (_a) {
                                var classList = _a.element.classList;
                                return classList.add('selected', 'good');
                            });
                            cellsModified = cacheTable.getRow(slotNumber).cells;
                            cacheTable.getRow(slotNumber).element.scrollIntoView({ behavior: 'smooth' });
                            output.push('<i>Hit</i>');
                        }
                        else if (existing === null) {
                            // compulsory miss, able to put in left cache
                            inputTable.getCellAt(2, i).setValue('M');
                            cache.setItemAt(slotNumber, this._inputData[i]);
                            cacheTable.getCellAt(slotNumber, 1).setValue(this.parseString(this._inputData[i]));
                            cacheTable
                                .getRow(slotNumber)
                                .cells.forEach(function (_a) {
                                var classList = _a.element.classList;
                                return classList.add('selected', 'neutral');
                            });
                            cellsModified = cacheTable.getRow(slotNumber).cells;
                            cacheTable.getRow(slotNumber).element.scrollIntoView({ behavior: 'smooth' });
                            output.push("<i>Compulsory miss, added new address to line ".concat(slotNumber, "</i>"));
                        }
                        else {
                            // conflict miss
                            // we don't get capacity misses on direct-mapped caches
                            inputTable.getCellAt(2, i).setValue('M');
                            cache.setItemAt(slotNumber, this._inputData[i]);
                            cacheTable.getCellAt(slotNumber, 1).setValue(this.parseString(this._inputData[i]));
                            output.push("<i>Conflict miss, replaced ".concat(this.parseString(existing), " on line ").concat(slotNumber, "</i>"));
                            cacheTable
                                .getRow(slotNumber)
                                .cells.forEach(function (_a) {
                                var classList = _a.element.classList;
                                return classList.add('selected', 'bad');
                            });
                            cellsModified = cacheTable.getRow(slotNumber).cells;
                        }
                        // displaying output information for this step
                        this._containers.outputDetailsContainer.innerHTML = output.join('<br />');
                        return [4 /*yield*/, this.wait()];
                    case 3:
                        _a.sent();
                        // unhighlighting
                        tableColumn.forEach(function (_a) {
                            var classList = _a.element.classList;
                            return classList.remove('selected');
                        });
                        cellsModified.forEach(function (_a) {
                            var classList = _a.element.classList;
                            return classList.remove('selected', 'bad', 'neutral', 'good');
                        });
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CacheEmulator.prototype.doSetAssociative = function (inputTable) {
        return __awaiter(this, void 0, void 0, function () {
            var leftTableData, rightTableData, leftTable, rightTable, blockContainer, leftCache, rightCache, globalCounter, i, len, slotNumber, output, tableColumn, existingLeft, existingRight, cellsModified;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        leftTableData = new Array(Math.pow(2, this._data.indexFieldBits) / 2)
                            .fill([])
                            .map(function (_, i) {
                            var row = new Array(3);
                            row[0] = i.toString();
                            return row;
                        });
                        rightTableData = new Array(Math.pow(2, this._data.indexFieldBits) / 2)
                            .fill([])
                            .map(function (_, i) {
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
                        this._containers.outputTableContainer.appendChild(blockContainer);
                        leftCache = new DummyCache(Math.pow(2, this._data.indexFieldBits) / 2);
                        rightCache = new DummyCache(Math.pow(2, this._data.indexFieldBits) / 2);
                        globalCounter = 0;
                        i = 0, len = this._inputData.length;
                        _a.label = 1;
                    case 1:
                        if (!(i < len)) return [3 /*break*/, 5];
                        globalCounter++;
                        slotNumber = this._inputData[i] % (Math.pow(2, this._data.indexFieldBits) / 2);
                        output = [
                            "Sequence <b>#".concat(i + 1, "</b>: ").concat(this.parseString(this._inputData[i])),
                            "Global Counter: <b>".concat(globalCounter, "</b>"),
                            "Slot # = ".concat(this.parseString(this._inputData[i]), " % ").concat(Math.pow(2, this._data.indexFieldBits) / 2, " = ").concat(this.parseString(slotNumber)),
                        ];
                        tableColumn = inputTable.getColumn(i);
                        tableColumn.forEach(function (_a) {
                            var classList = _a.element.classList;
                            return classList.add('selected');
                        });
                        this._containers.outputDetailsContainer.innerHTML = output.join('<br />');
                        return [4 /*yield*/, this.wait()];
                    case 2:
                        _a.sent();
                        output.pop();
                        existingLeft = leftCache.getItemAt(slotNumber);
                        existingRight = rightCache.getItemAt(slotNumber);
                        cellsModified = void 0;
                        if ((existingLeft === null || existingLeft === void 0 ? void 0 : existingLeft.address) === this._inputData[i]) {
                            // hit left cache
                            inputTable.getCellAt(2, i).setValue('H');
                            leftCache.setItemAt(slotNumber, { address: this._inputData[i], localCounter: globalCounter });
                            leftTable
                                .getRow(slotNumber)
                                .cells.forEach(function (_a) {
                                var classList = _a.element.classList;
                                return classList.add('selected', 'good');
                            });
                            cellsModified = leftTable.getRow(slotNumber).cells;
                            leftTable.getRow(slotNumber).element.scrollIntoView({ behavior: 'smooth' });
                            leftTable.getCellAt(slotNumber, 2).setValue(globalCounter.toString());
                            output.push('<i>Hit left table (set 0), updated local counter</i>');
                        }
                        else if ((existingRight === null || existingRight === void 0 ? void 0 : existingRight.address) === this._inputData[i]) {
                            // hit right cache
                            inputTable.getCellAt(2, i).setValue('H');
                            rightCache.setItemAt(slotNumber, { address: this._inputData[i], localCounter: globalCounter });
                            rightTable
                                .getRow(slotNumber)
                                .cells.forEach(function (_a) {
                                var classList = _a.element.classList;
                                return classList.add('selected', 'good');
                            });
                            cellsModified = rightTable.getRow(slotNumber).cells;
                            rightTable.getRow(slotNumber).element.scrollIntoView({ behavior: 'smooth' });
                            rightTable.getCellAt(slotNumber, 2).setValue(globalCounter.toString());
                            output.push('<i>Hit right table (set 1), updated local counter</i>');
                        }
                        else if (existingLeft === null) {
                            // compulsory miss, able to put in left cache
                            inputTable.getCellAt(2, i).setValue('M');
                            leftCache.setItemAt(slotNumber, { address: this._inputData[i], localCounter: globalCounter });
                            leftTable.getCellAt(slotNumber, 1).setValue(this.parseString(this._inputData[i]));
                            leftTable.getCellAt(slotNumber, 2).setValue(globalCounter.toString());
                            leftTable
                                .getRow(slotNumber)
                                .cells.forEach(function (_a) {
                                var classList = _a.element.classList;
                                return classList.add('selected', 'neutral');
                            });
                            cellsModified = leftTable.getRow(slotNumber).cells;
                            leftTable.getRow(slotNumber).element.scrollIntoView({ behavior: 'smooth' });
                            output.push("<i>Compulsory miss, added new address to line ".concat(slotNumber, " (set 0)</i>"));
                        }
                        else if (existingRight === null) {
                            // compulsory miss, able to put in right cache
                            inputTable.getCellAt(2, i).setValue('M');
                            rightCache.setItemAt(slotNumber, { address: this._inputData[i], localCounter: globalCounter });
                            rightTable.getCellAt(slotNumber, 1).setValue(this.parseString(this._inputData[i]));
                            rightTable.getCellAt(slotNumber, 2).setValue(globalCounter.toString());
                            rightTable
                                .getRow(slotNumber)
                                .cells.forEach(function (_a) {
                                var classList = _a.element.classList;
                                return classList.add('selected', 'neutral');
                            });
                            cellsModified = rightTable.getRow(slotNumber).cells;
                            rightTable.getRow(slotNumber).element.scrollIntoView({ behavior: 'smooth' });
                            output.push("<i>Compulsory miss, added new address to line ".concat(slotNumber, " (set 1)</i>"));
                        }
                        else {
                            // conflict miss
                            // we don't get capacity misses on set associative caches
                            inputTable.getCellAt(2, i).setValue('M');
                            if (existingLeft.localCounter < existingRight.localCounter) {
                                // remove left item
                                leftCache.setItemAt(slotNumber, { address: this._inputData[i], localCounter: globalCounter });
                                leftTable.getCellAt(slotNumber, 1).setValue(this.parseString(this._inputData[i]));
                                leftTable.getCellAt(slotNumber, 2).setValue(globalCounter.toString());
                                output.push("<i>Conflict miss, replaced ".concat(this.parseString(existingLeft.address), " (had lower local counter, ").concat(existingLeft.localCounter, " vs ").concat(existingRight.localCounter, ") on line ").concat(slotNumber, "</i>"));
                                leftTable
                                    .getRow(slotNumber)
                                    .cells.forEach(function (_a) {
                                    var classList = _a.element.classList;
                                    return classList.add('selected', 'bad');
                                });
                                cellsModified = leftTable.getRow(slotNumber).cells;
                            }
                            else {
                                // remove right item
                                rightCache.setItemAt(slotNumber, { address: this._inputData[i], localCounter: globalCounter });
                                rightTable.getCellAt(slotNumber, 1).setValue(this.parseString(this._inputData[i]));
                                rightTable.getCellAt(slotNumber, 2).setValue(globalCounter.toString());
                                output.push("<i>Conflict miss, replaced ".concat(this.parseString(existingRight.address), " (had lower local counter, ").concat(existingRight.localCounter, " vs ").concat(existingRight.localCounter, ") on line ").concat(slotNumber, "</i>"));
                                rightTable
                                    .getRow(slotNumber)
                                    .cells.forEach(function (_a) {
                                    var classList = _a.element.classList;
                                    return classList.add('selected', 'bad');
                                });
                                cellsModified = rightTable.getRow(slotNumber).cells;
                            }
                        }
                        // displaying output information for this step
                        this._containers.outputDetailsContainer.innerHTML = output.join('<br />');
                        return [4 /*yield*/, this.wait()];
                    case 3:
                        _a.sent();
                        // unhighlighting
                        tableColumn.forEach(function (_a) {
                            var classList = _a.element.classList;
                            return classList.remove('selected');
                        });
                        cellsModified.forEach(function (_a) {
                            var classList = _a.element.classList;
                            return classList.remove('selected', 'bad', 'neutral', 'good');
                        });
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CacheEmulator.prototype.wait = function (ms) {
        var _this = this;
        if (ms === void 0) { ms = CacheEmulator._autoTimePeriod; }
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
    CacheEmulator.prototype.showIntermediateOutput = function () {
        var index = this._data.indexFieldBits;
        var offset = this._data.offsetFieldBits;
        var tag = this._data.addressBusSize - index - offset;
        var numLines = Math.pow(2, index);
        var bytesPerLine = Math.pow(2, offset);
        var wordsPerLine = bytesPerLine / this._data.bytesPerWord;
        var totalBytes = numLines * bytesPerLine;
        var totalAsLog = Math.log2(totalBytes);
        var extraSizeInfo = Number.isInteger(totalAsLog) ? " (2<sup>".concat(totalAsLog, "</sup>)") : '';
        var output = [
            "Addresses to this cache have <b><span class=\"tagBits\">".concat(tag, "</span></b> bits for tag, <b><span class=\"indexBits\">").concat(index, "</span></b> bits for index, and <b><span class=\"offsetBits\">").concat(offset, "</span></b> bits for offset."),
            "This means the cache has <b><span class=\"offsetBits\">".concat(bytesPerLine, "</span></b> offset values, <b><span class=\"indexBits\">").concat(numLines, "</span></b> index values, and <span class=\"offsetBits\"><b>").concat(wordsPerLine, "</b></span> words per line."),
            "This cache can store a total of <b>".concat(totalBytes, "</b>").concat(extraSizeInfo, " bytes."),
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
    CacheEmulator.prototype.parseToBinary = function (n) {
        var index = this._data.indexFieldBits;
        var offset = this._data.offsetFieldBits;
        var output = '<span class="tagBits">';
        var endOffset = this._data.addressBusSize - offset - 1;
        var endTag = endOffset - index;
        var rawString = n.toString(2).padStart(this._data.addressBusSize, '0');
        for (var i = 0; i < this._data.addressBusSize; i++) {
            output += rawString.substring(i, i + 1);
            if (i % 4 === 3) {
                // space between nibbles
                output += '&emsp;';
            }
            if (i === endOffset) {
                output += '</span><span class="offsetBits">';
            }
            else if (i === endTag) {
                output += '</span><span class="indexBits">';
            }
        }
        output += '</span>';
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
        var _a, _b;
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
            if (props.classes)
                (_a = label.classList).add.apply(_a, props.classes);
            var container = document.createElement('div');
            container.appendChild(label);
            container.appendChild(input);
            props.parent.appendChild(container);
        }
        else {
            if (props === null || props === void 0 ? void 0 : props.classes)
                (_b = input.classList).add.apply(_b, props.classes);
            if (props === null || props === void 0 ? void 0 : props.parent)
                props.parent.appendChild(input);
        }
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
    Object.defineProperty(CacheEmulator, "timePeriod", {
        set: function (n) {
            if (n < 0)
                return;
            this._autoTimePeriod = n;
        },
        enumerable: false,
        configurable: true
    });
    CacheEmulator._autoTimePeriod = 1000;
    CacheEmulator.Defaults = {
        addressBusSize: 20,
        indexFieldBits: 5,
        offsetFieldBits: 6,
        bytesPerWord: 4,
        hexMode: true,
        autoMode: false,
        inputData: '1273E 12719 12819 1173E 1273F 12839 12710 12800',
        cacheType: CacheTypes.DirectMapped,
    };
    return CacheEmulator;
}());
new CacheEmulator();
//# sourceMappingURL=caches.js.map