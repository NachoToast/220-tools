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
var CollisionHandling;
(function (CollisionHandling) {
    CollisionHandling["Linear"] = "linear";
})(CollisionHandling || (CollisionHandling = {}));
var CollisionCounter = /** @class */ (function () {
    function CollisionCounter() {
    }
    CollisionCounter.toggleAutoStep = function (newValue) {
        this._autoStep = newValue;
    };
    CollisionCounter.handleTableSizeChange = function (e) {
        var value = Number(e.target.value);
        if (value < 0)
            return;
        this._tableSize = value;
    };
    CollisionCounter.handleInputData = function (e) {
        var value = e.target.value;
        var data = value
            .split(' ')
            .map(function (e) { return Number(e); })
            .filter(function (e) { return !Number.isNaN(e); });
        this._inputData = data;
    };
    CollisionCounter.handleFunctionChange = function (e) {
        var value = e.target.value;
        try {
            this._hashFunction = eval(value);
        }
        catch (error) {
            //
        }
    };
    CollisionCounter.clearTable = function () {
        this._tableElement.style.visibility = 'hidden';
        this._outputContainer.style.visibility = 'hidden';
        this._indexesRow.innerHTML = '';
        this._valuesRow.innerHTML = '';
        this._mainOutput.innerHTML = '';
        this._warnOutput.innerHTML = '';
        this._totalOutput.innerHTML = '';
    };
    CollisionCounter.displayTable = function (b) {
        return __awaiter(this, void 0, void 0, function () {
            var i, index, value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.clearTable();
                        if (!this._inputData.length || this._tableSize < 1 || !this._hashFunction)
                            return [2 /*return*/];
                        b.disabled = true;
                        this._tableElement.style.visibility = 'visible';
                        this._outputContainer.style.visibility = 'visible';
                        for (i = 0; i < this._tableSize; i++) {
                            index = document.createElement('td');
                            index.innerText = "".concat(i);
                            value = document.createElement('td');
                            value.innerHTML = '&nbsp;';
                            this._indexesRow.appendChild(index);
                            this._valuesRow.appendChild(value);
                        }
                        return [4 /*yield*/, this.insertAll()];
                    case 1:
                        _a.sent();
                        b.disabled = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    CollisionCounter.wait = function (isAuto, ms) {
        var _this = this;
        if (isAuto === void 0) { isAuto = true; }
        if (ms === void 0) { ms = 1000; }
        if (isAuto) {
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
    CollisionCounter.insertAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isAuto, inputData, hashMap, globalCollisions, i, len, data, attemptedPosition, localCollisions, i_1, len_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isAuto = this._autoStep;
                        if (isAuto)
                            this._nextButton.style.visibility = 'hidden';
                        else
                            this._nextButton.style.visibility = 'visible';
                        inputData = this._inputData;
                        hashMap = new Array(this._tableSize).fill(null);
                        globalCollisions = 0;
                        this._totalOutput.innerText = 'Total Collisions: 0';
                        i = 0, len = inputData.length;
                        _a.label = 1;
                    case 1:
                        if (!(i < len)) return [3 /*break*/, 8];
                        data = inputData[i];
                        attemptedPosition = this._hashFunction(data);
                        localCollisions = 0;
                        this._mainOutput.innerText = "Attempting to insert ".concat(data, " at index ").concat(attemptedPosition);
                        this._indexesRow.children[attemptedPosition].classList.add('collisionCounter_maybe');
                        return [4 /*yield*/, this.wait(isAuto)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!(hashMap[attemptedPosition] !== null)) return [3 /*break*/, 5];
                        localCollisions++;
                        globalCollisions++;
                        this._mainOutput.innerText = "Attempting to insert ".concat(data, " at index ").concat(attemptedPosition, " (").concat(localCollisions, " collision").concat(localCollisions !== 1 ? 's' : '', ")");
                        this._indexesRow.children[attemptedPosition].classList.remove('collisionCounter_maybe');
                        this._indexesRow.children[attemptedPosition].classList.add('collisionCounter_no');
                        this._warnOutput.innerText = "Index ".concat(attemptedPosition, " is taken by ").concat(hashMap[attemptedPosition]);
                        this._totalOutput.innerText = "Total Collisions: ".concat(globalCollisions);
                        attemptedPosition = (attemptedPosition + 1) % this._tableSize;
                        return [4 /*yield*/, this.wait(isAuto)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 5:
                        this._indexesRow.children[attemptedPosition].classList.add('collisionCounter_yes');
                        this._mainOutput.innerText = "Inserted ".concat(data, " at index ").concat(attemptedPosition, " (").concat(localCollisions, " collision").concat(localCollisions !== 1 ? 's' : '', ")");
                        this._warnOutput.innerText = '';
                        hashMap[attemptedPosition] = data;
                        this._valuesRow.children[attemptedPosition].innerHTML = data.toString();
                        return [4 /*yield*/, this.wait(isAuto)];
                    case 6:
                        _a.sent();
                        for (i_1 = 0, len_1 = this._indexesRow.children.length; i_1 < len_1; i_1++) {
                            this._indexesRow.children[i_1].classList.remove('collisionCounter_no');
                            this._indexesRow.children[i_1].classList.remove('collisionCounter_maybe');
                            this._indexesRow.children[i_1].classList.remove('collisionCounter_yes');
                        }
                        _a.label = 7;
                    case 7:
                        i++;
                        return [3 /*break*/, 1];
                    case 8:
                        this._mainOutput.innerText = "Inserted all ".concat(inputData.length, " numbers");
                        return [2 /*return*/];
                }
            });
        });
    };
    CollisionCounter.initialize = function () {
        var _this = this;
        this._tableSizeElement.oninput = function (e) { return _this.handleTableSizeChange(e); };
        this._inputDataElement.oninput = function (e) { return _this.handleInputData(e); };
        this._hashFunctionElement.oninput = function (e) { return _this.handleFunctionChange(e); };
        // fake values
        this._tableSizeElement.innerText = '20';
        this._tableSize = 20;
        this._inputDataElement.innerText = '6 7 8 12 13 20 34 50 17 16 31 32 4 44 52 36';
        this._inputData = '6 7 8 12 13 20 34 50 17 16 31 32 4 44 52 36'.split(' ').map(function (e) { return Number(e); });
        this._hashFunctionElement.innerText = '(x) => x % 20';
        this._hashFunction = function (x) { return x % 20; };
    };
    CollisionCounter._tableSizeElement = document.getElementById('collisionCounterTableSize');
    CollisionCounter._inputDataElement = document.getElementById('collisionCounterData');
    CollisionCounter._hashFunctionElement = document.getElementById('collisionCounterHashFunction');
    CollisionCounter._tableElement = document.getElementById('collisionCounterTable');
    CollisionCounter._indexesRow = document.getElementById('collisionCounterTable_indexes');
    CollisionCounter._valuesRow = document.getElementById('collisionCounterTable_values');
    CollisionCounter._outputContainer = document.getElementById('collisionCounterOutput');
    CollisionCounter._mainOutput = document.getElementById('collisionCounterOutput_main');
    CollisionCounter._warnOutput = document.getElementById('collisionCounterOutput_warn');
    CollisionCounter._totalOutput = document.getElementById('collisionCounterOutput_total');
    CollisionCounter._tableSize = 0;
    CollisionCounter._inputData = [];
    // TODO: other collision handling methods (quadratic, double hashing, etc...)
    CollisionCounter._collisionHandling = CollisionHandling.Linear;
    CollisionCounter._autoStep = true;
    CollisionCounter._nextButton = document.getElementById('collisionCounterNext');
    return CollisionCounter;
}());
CollisionCounter.initialize();
//# sourceMappingURL=hash-tables.js.map