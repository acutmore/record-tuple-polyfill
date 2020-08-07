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

import { declare } from "@babel/helper-plugin-utils";
import syntaxRecordAndTuple from "@babel/plugin-syntax-record-and-tuple";
import { types as t } from "@babel/core";
import { addNamed, isModule } from "@babel/helper-module-imports";

export default declare((api, options) => {
    api.assertVersion(7);

    const {
        importPolyfill: shouldImportPolyfill = !!options.polyfillModuleName,
        polyfillModuleName = "@bloomberg/record-tuple-polyfill",
    } = options;

    // program -> cacheKey -> localBindingName
    const importCaches = new WeakMap();

    function getOr(map, key, getDefault) {
        let value = map.get(key);
        if (!value) map.set(key, (value = getDefault()));
        return value;
    }

    function getBuiltIn(name, path) {
        if (!shouldImportPolyfill) return t.identifier(name);

        const programPath = path.find(p => p.isProgram());
        if (!programPath) {
            throw new Error("Internal error: unable to find the Program node.");
        }

        const cacheKey = `${name}:${isModule(programPath)}`;

        const cache = getOr(importCaches, programPath.node, () => new Map());
        const localBindingName = getOr(cache, cacheKey, () => {
            return addNamed(programPath, name, polyfillModuleName, {
                importedInterop: "uncompiled",
            }).name;
        });

        return t.identifier(localBindingName);
    }

    return {
        name: "@bloomberg/babel-plugin-proposal-record-tuple",
        inherits: syntaxRecordAndTuple,
        visitor: {
            RecordExpression(path) {
                const record = getBuiltIn("Record", path);

                const object = t.objectExpression(path.node.properties);
                const wrapped = t.callExpression(record, [object]);
                path.replaceWith(wrapped);
            },
            TupleExpression(path) {
                const tuple = getBuiltIn("Tuple", path);

                const wrapped = t.callExpression(tuple, path.node.elements);
                path.replaceWith(wrapped);
            },
        },
    };
});
