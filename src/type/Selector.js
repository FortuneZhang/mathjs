/**
 * @constructor math.type.Selector
 * Wrap any value in a Selector, allowing to perform chained operations on
 * the value.
 *
 * All methods available in the math.js library can be called upon the selector,
 * and then will be evaluated with the value itself as first argument.
 * The selector can be closed by executing selector.done(), which will return
 * the final value.
 *
 * The Selector has a number of special functions:
 * - done()     Finalize the chained operation and return the selectors value.
 * - valueOf()  The same as done()
 * - toString() Executes math.format() onto the selectors value, returning
 *              a string representation of the value.
 * - get(...)   Get a subset of the selectors value. Useful for example for
 *              matrices and arrays.
 * - set(...)   Replace a subset of the selectors value. Useful for example for
 *              matrices and arrays.
 *
 * @param {*} [value]
 */
math.type.Selector = function Selector (value) {
    if (!(this instanceof math.type.Selector)) {
        throw new SyntaxError(
            'Selector constructor must be called with the new operator');
    }

    if (value instanceof math.type.Selector) {
        this.value = value.value;
    }
    else {
        this.value = value || undefined;
    }
};

math.type.Selector.prototype = {
    /**
     * Close the selector. Returns the final value.
     * Does the same as method valueOf()
     * @returns {*} value
     */
    done: function () {
        return this.value;
    },

    /**
     * Get a submatrix or subselection from current value.
     * Only applicable when the current value has a method get.
     */
    get: function (index) {
        var value = this.value;
        if (!value) {
            throw Error('Selector value is undefined');
        }

        return new math.type.Selector(math.subset(value, index));
    },

    /**
     * Set a submatrix or subselection on current value.
     * Only applicable when the current value has a method set.
     */
    set: function (index, replacement) {
        var value = this.value;
        if (!value) {
            throw Error('Selector value is undefined');
        }

        return new math.type.Selector(math.subset(value, index, replacement));
    },

    /**
     * Close the selector. Returns the final value.
     * Does the same as method done()
     * @returns {*} value
     */
    valueOf: function () {
        return this.value;
    },

    /**
     * Get the string representation of the value in the selector
     * @returns {String}
     */
    toString: function () {
        return math.format(this.value);
    }
};

/**
 * Create a proxy method for the selector
 * @param {String} name
 * @param {*} value       The value or function to be proxied
 */
function createSelectorProxy(name, value) {
    var Selector = math.type.Selector;
    var slice = Array.prototype.slice;
    if (typeof value === 'function') {
        // a function
        Selector.prototype[name] = function () {
            var args = [this.value].concat(slice.call(arguments, 0));
            return new Selector(value.apply(this, args));
        }
    }
    else {
        // a constant
        Selector.prototype[name] = new Selector(value);
    }
}
