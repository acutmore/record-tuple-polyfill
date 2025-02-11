/*
 ** Copyright 2020 Bloomberg Finance L.P.
 **
 ** Licensed under the Apache License, Version 2.0 (the "License");
 ** you may not use this file except in compliance with the License.
 ** You may obtain a copy of the License at
 **
 **     http://www.apache.org/licenses/LICENSE-2.0
 **
 ** Unless required by applicable law or agreed to in writing, software
 ** distributed under the License is distributed on an "AS IS" BASIS,
 ** WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ** See the License for the specific language governing permissions and
 ** limitations under the License.
 */

export function isObject(v) {
    return typeof v === "object" && v !== null;
}
export function isFunction(v) {
    return typeof v === "function";
}

export function isIterableObject(v) {
    return isObject(v) && typeof v[Symbol.iterator] === "function";
}

export function objectFromEntries(iterable) {
    return [...iterable].reduce((obj, [key, val]) => {
        obj[key] = val;
        return obj;
    }, {});
}

const RECORD_WEAKSET = new WeakSet();
const TUPLE_WEAKMAP = new WeakMap(); // tuple -> length
export function isRecord(value) {
    return RECORD_WEAKSET.has(value);
}
export function isTuple(value) {
    return TUPLE_WEAKMAP.has(value);
}
export function markRecord(value) {
    RECORD_WEAKSET.add(value);
}
export function markTuple(value, length) {
    TUPLE_WEAKMAP.set(value, length);
}
export function getTupleLength(value) {
    return TUPLE_WEAKMAP.get(value);
}

const BOX_TO_VALUE = new WeakMap();
const VALUE_TO_BOX = new WeakMap();
export function isBox(arg) {
    return BOX_TO_VALUE.has(arg);
}
export function unboxBox(box) {
    if (!isBox(box)) {
        throw new Error("unboxBox: invalid argument");
    }
    return BOX_TO_VALUE.get(box);
}
export function findBox(value) {
    return VALUE_TO_BOX.get(value);
}
export function markBox(box, value) {
    BOX_TO_VALUE.set(box, value);
    VALUE_TO_BOX.set(value, box);
}

function isRecordOrTuple(value) {
    return isRecord(value) || isTuple(value);
}
export function validateProperty(value) {
    if (isObject(value) && !isRecordOrTuple(value) && !isBox(value)) {
        throw new Error(
            "TypeError: cannot use an object as a value in a record",
        );
    } else if (isFunction(value)) {
        throw new Error(
            "TypeError: cannot use a function as a value in a record",
        );
    }
    return value;
}

export function define(obj, props) {
    for (const key of Reflect.ownKeys(props)) {
        const { get, set, value } = Object.getOwnPropertyDescriptor(props, key);
        let desc =
            get || set
                ? { get, set, configurable: true }
                : { value, writable: true, configurable: true };
        Object.defineProperty(obj, key, desc);
    }
}

const _WeakMap = globalThis["WeakMap"];
const _WeakRef = globalThis["WeakRef"];
const _FinalizationRegistry =
    globalThis["FinalizationRegistry"] || globalThis["FinalizationGroup"];
export function assertFeatures() {
    if (!_WeakMap || !_WeakRef || !_FinalizationRegistry) {
        throw new Error(
            "WeakMap, WeakRef, and FinalizationRegistry are required for @bloomberg/record-tuple-polyfill",
        );
    }
}
