'use strict';

// Crash if NGN is not found.
if (NGN === undefined || typeof NGN !== 'object') {
  throw new Error('Cannot find NGN. NGNX depends on the presenceof NGN.')
}

/**
 * @namespace NGNX
 */
Object.defineProperty(NGN.global, 'NGNX', NGN.public(Object.defineProperties({}, {
  extend: NGN.const((namespace, descriptor) => {
    if (NGNX.hasOwnProperty(namespace)) {
      throw new Error(`Cannot create NGNX.${namespace} because it already exists.`)
    }

    if ((typeof descriptor !== 'object') || (!descriptor.hasOwnProperty('value') && !descriptor.hasOwnProperty('get') && !descriptor.hasOwnProperty('set'))) {
      NGN.WARN(`No descriptor was supplied for the new NGNX namespace "${namespace}". Using NGN.public() by default.`);
      descriptor = NGN.public(descriptor);
    }

    let scopes = namespace.split('.');
    let parent = NGN.global.NGNX;

    // Prevent duplication of global namespace.
    if (scopes[0].trim().toUpperCase() === 'NGNX') {
      scopes.shift();
    }

    while (scopes.length > 0) {
      let scope = scopes.shift();

      if (!parent.hasOwnProperty(scope)) {
        Object.defineProperty(parent, scope, scopes.length > 0 ? NGN.const({}) : descriptor);
      }

      parent = parent[scope];
    }
  }),

  version: NGN.const('2.0.0')
})));
//# sourceMappingURL=ngnx.js.map
