
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function to_number(value) {
        return value === '' ? undefined : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_options(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            option.selected = ~value.indexOf(option.__value);
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function select_multiple_value(select) {
        return [].map.call(select.querySelectorAll(':checked'), option => option.__value);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                info.blocks[i] = null;
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.23.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe,
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function regexparam (str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules\svelte-spa-router\Router.svelte generated by Svelte v3.23.0 */

    const { Error: Error_1, Object: Object_1, console: console_1 } = globals;

    // (209:0) {:else}
    function create_else_block(ctx) {
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[10]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[10]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(209:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (207:0) {#if componentParams}
    function create_if_block(ctx) {
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		return {
    			props: { params: /*componentParams*/ ctx[1] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[9]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*componentParams*/ 2) switch_instance_changes.params = /*componentParams*/ ctx[1];

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[9]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(207:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(route, userData, ...conditions) {
    	// Check if we don't have userData
    	if (userData && typeof userData == "function") {
    		conditions = conditions && conditions.length ? conditions : [];
    		conditions.unshift(userData);
    		userData = undefined;
    	}

    	// Parameter route and each item of conditions must be functions
    	if (!route || typeof route != "function") {
    		throw Error("Invalid parameter route");
    	}

    	if (conditions && conditions.length) {
    		for (let i = 0; i < conditions.length; i++) {
    			if (!conditions[i] || typeof conditions[i] != "function") {
    				throw Error("Invalid parameter conditions[" + i + "]");
    			}
    		}
    	}

    	// Returns an object that contains all the functions to execute too
    	const obj = { route, userData };

    	if (conditions && conditions.length) {
    		obj.conditions = conditions;
    	}

    	// The _sveltesparouter flag is to confirm the object was created by this router
    	Object.defineProperty(obj, "_sveltesparouter", { value: true });

    	return obj;
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf("#/");

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: "/";

    	// Check if there's a querystring
    	const qsPosition = location.indexOf("?");

    	let querystring = "";

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(getLocation(), // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener("hashchange", update, false);

    	return function stop() {
    		window.removeEventListener("hashchange", update, false);
    	};
    });

    const location$1 = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);

    function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	return nextTickPromise(() => {
    		window.location.hash = (location.charAt(0) == "#" ? "" : "#") + location;
    	});
    }

    function pop() {
    	// Execute this code when the current call stack is complete
    	return nextTickPromise(() => {
    		window.history.back();
    	});
    }

    function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	return nextTickPromise(() => {
    		const dest = (location.charAt(0) == "#" ? "" : "#") + location;

    		try {
    			window.history.replaceState(undefined, undefined, dest);
    		} catch(e) {
    			// eslint-disable-next-line no-console
    			console.warn("Caught exception while replacing the current page. If you're running this in the Svelte REPL, please note that the `replace` method might not work in this environment.");
    		}

    		// The method above doesn't trigger the hashchange event, so let's do that manually
    		window.dispatchEvent(new Event("hashchange"));
    	});
    }

    function link(node) {
    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != "a") {
    		throw Error("Action \"link\" can only be used with <a> tags");
    	}

    	// Destination must start with '/'
    	const href = node.getAttribute("href");

    	if (!href || href.length < 1 || href.charAt(0) != "/") {
    		throw Error("Invalid value for \"href\" attribute");
    	}

    	// Add # to every href attribute
    	node.setAttribute("href", "#" + href);
    }

    function nextTickPromise(cb) {
    	return new Promise(resolve => {
    			setTimeout(
    				() => {
    					resolve(cb());
    				},
    				0
    			);
    		});
    }

    function instance($$self, $$props, $$invalidate) {
    	let $loc,
    		$$unsubscribe_loc = noop;

    	validate_store(loc, "loc");
    	component_subscribe($$self, loc, $$value => $$invalidate(4, $loc = $$value));
    	$$self.$$.on_destroy.push(() => $$unsubscribe_loc());
    	let { routes = {} } = $$props;
    	let { prefix = "" } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent} component - Svelte component for the route
     */
    		constructor(path, component) {
    			if (!component || typeof component != "function" && (typeof component != "object" || component._sveltesparouter !== true)) {
    				throw Error("Invalid component object");
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == "string" && (path.length < 1 || path.charAt(0) != "/" && path.charAt(0) != "*") || typeof path == "object" && !(path instanceof RegExp)) {
    				throw Error("Invalid value for \"path\" argument");
    			}

    			const { pattern, keys } = regexparam(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == "object" && component._sveltesparouter === true) {
    				this.component = component.route;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    			} else {
    				this.component = component;
    				this.conditions = [];
    				this.userData = undefined;
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, remove it before we run the matching
    			if (prefix && path.startsWith(prefix)) {
    				path = path.substr(prefix.length) || "/";
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				out[this._keys[i]] = matches[++i] || null;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {SvelteComponent} component - Svelte component
     * @property {string} name - Name of the Svelte component
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {Object} [userData] - Custom data passed by the user
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {bool} Returns true if all the conditions succeeded
     */
    		checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	const dispatchNextTick = (name, detail) => {
    		// Execute this code when the current call stack is complete
    		setTimeout(
    			() => {
    				dispatch(name, detail);
    			},
    			0
    		);
    	};

    	const writable_props = ["routes", "prefix"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Router", $$slots, []);

    	function routeEvent_handler(event) {
    		bubble($$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("routes" in $$props) $$invalidate(2, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(3, prefix = $$props.prefix);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		derived,
    		wrap,
    		getLocation,
    		loc,
    		location: location$1,
    		querystring,
    		push,
    		pop,
    		replace,
    		link,
    		nextTickPromise,
    		createEventDispatcher,
    		regexparam,
    		routes,
    		prefix,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		dispatch,
    		dispatchNextTick,
    		$loc
    	});

    	$$self.$inject_state = $$props => {
    		if ("routes" in $$props) $$invalidate(2, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(3, prefix = $$props.prefix);
    		if ("component" in $$props) $$invalidate(0, component = $$props.component);
    		if ("componentParams" in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*component, $loc*/ 17) {
    			// Handle hash change events
    			// Listen to changes in the $loc store and update the page
    			 {
    				// Find a route matching the location
    				$$invalidate(0, component = null);

    				let i = 0;

    				while (!component && i < routesList.length) {
    					const match = routesList[i].match($loc.location);

    					if (match) {
    						const detail = {
    							component: routesList[i].component,
    							name: routesList[i].component.name,
    							location: $loc.location,
    							querystring: $loc.querystring,
    							userData: routesList[i].userData
    						};

    						// Check if the route can be loaded - if all conditions succeed
    						if (!routesList[i].checkConditions(detail)) {
    							// Trigger an event to notify the user
    							dispatchNextTick("conditionsFailed", detail);

    							break;
    						}

    						$$invalidate(0, component = routesList[i].component);

    						// Set componentParams onloy if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    						// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    						if (match && typeof match == "object" && Object.keys(match).length) {
    							$$invalidate(1, componentParams = match);
    						} else {
    							$$invalidate(1, componentParams = null);
    						}

    						dispatchNextTick("routeLoaded", detail);
    					}

    					i++;
    				}
    			}
    		}
    	};

    	return [
    		component,
    		componentParams,
    		routes,
    		prefix,
    		$loc,
    		RouteItem,
    		routesList,
    		dispatch,
    		dispatchNextTick,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { routes: 2, prefix: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function toVal(mix) {
    	var k, y, str='';
    	if (mix) {
    		if (typeof mix === 'object') {
    			if (Array.isArray(mix)) {
    				for (k=0; k < mix.length; k++) {
    					if (mix[k] && (y = toVal(mix[k]))) {
    						str && (str += ' ');
    						str += y;
    					}
    				}
    			} else {
    				for (k in mix) {
    					if (mix[k] && (y = toVal(k))) {
    						str && (str += ' ');
    						str += y;
    					}
    				}
    			}
    		} else if (typeof mix !== 'boolean' && !mix.call) {
    			str && (str += ' ');
    			str += mix;
    		}
    	}
    	return str;
    }

    function clsx () {
    	var i=0, x, str='';
    	while (i < arguments.length) {
    		if (x = toVal(arguments[i++])) {
    			str && (str += ' ');
    			str += x;
    		}
    	}
    	return str;
    }

    function isObject(value) {
      const type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    function getColumnSizeClass(isXs, colWidth, colSize) {
      if (colSize === true || colSize === '') {
        return isXs ? 'col' : `col-${colWidth}`;
      } else if (colSize === 'auto') {
        return isXs ? 'col-auto' : `col-${colWidth}-auto`;
      }

      return isXs ? `col-${colSize}` : `col-${colWidth}-${colSize}`;
    }

    function clean($$props) {
      const rest = {};
      for (const key of Object.keys($$props)) {
        if (key !== "children" && key !== "$$scope" && key !== "$$slots") {
          rest[key] = $$props[key];
        }
      }
      return rest;
    }

    /* node_modules\sveltestrap\src\Button.svelte generated by Svelte v3.23.0 */
    const file = "node_modules\\sveltestrap\\src\\Button.svelte";

    // (53:0) {:else}
    function create_else_block_1(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	let button_levels = [
    		/*props*/ ctx[10],
    		{ id: /*id*/ ctx[4] },
    		{ class: /*classes*/ ctx[8] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ value: /*value*/ ctx[6] },
    		{
    			"aria-label": /*ariaLabel*/ ctx[7] || /*defaultAriaLabel*/ ctx[9]
    		},
    		{ style: /*style*/ ctx[5] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(button, button_data);
    			add_location(button, file, 53, 2, 1061);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[21], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 262144) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[18], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*close, children, $$scope*/ 262147) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				dirty & /*props*/ 1024 && /*props*/ ctx[10],
    				dirty & /*id*/ 16 && { id: /*id*/ ctx[4] },
    				dirty & /*classes*/ 256 && { class: /*classes*/ ctx[8] },
    				dirty & /*disabled*/ 4 && { disabled: /*disabled*/ ctx[2] },
    				dirty & /*value*/ 64 && { value: /*value*/ ctx[6] },
    				dirty & /*ariaLabel, defaultAriaLabel*/ 640 && {
    					"aria-label": /*ariaLabel*/ ctx[7] || /*defaultAriaLabel*/ ctx[9]
    				},
    				dirty & /*style*/ 32 && { style: /*style*/ ctx[5] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(53:0) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (37:0) {#if href}
    function create_if_block$1(ctx) {
    	let a;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*children*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let a_levels = [
    		/*props*/ ctx[10],
    		{ id: /*id*/ ctx[4] },
    		{ class: /*classes*/ ctx[8] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ href: /*href*/ ctx[3] },
    		{
    			"aria-label": /*ariaLabel*/ ctx[7] || /*defaultAriaLabel*/ ctx[9]
    		},
    		{ style: /*style*/ ctx[5] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			a = element("a");
    			if_block.c();
    			set_attributes(a, a_data);
    			add_location(a, file, 37, 2, 825);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			if_blocks[current_block_type_index].m(a, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[20], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(a, null);
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*props*/ 1024 && /*props*/ ctx[10],
    				dirty & /*id*/ 16 && { id: /*id*/ ctx[4] },
    				dirty & /*classes*/ 256 && { class: /*classes*/ ctx[8] },
    				dirty & /*disabled*/ 4 && { disabled: /*disabled*/ ctx[2] },
    				dirty & /*href*/ 8 && { href: /*href*/ ctx[3] },
    				dirty & /*ariaLabel, defaultAriaLabel*/ 640 && {
    					"aria-label": /*ariaLabel*/ ctx[7] || /*defaultAriaLabel*/ ctx[9]
    				},
    				dirty & /*style*/ 32 && { style: /*style*/ ctx[5] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(37:0) {#if href}",
    		ctx
    	});

    	return block_1;
    }

    // (68:6) {:else}
    function create_else_block_2(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 262144) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[18], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(68:6) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (66:25) 
    function create_if_block_3(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(66:25) ",
    		ctx
    	});

    	return block_1;
    }

    // (64:6) {#if close}
    function create_if_block_2(ctx) {
    	let span;

    	const block_1 = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "×";
    			attr_dev(span, "aria-hidden", "true");
    			add_location(span, file, 64, 8, 1250);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(64:6) {#if close}",
    		ctx
    	});

    	return block_1;
    }

    // (63:10)        
    function fallback_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2, create_if_block_3, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*close*/ ctx[1]) return 0;
    		if (/*children*/ ctx[0]) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(63:10)        ",
    		ctx
    	});

    	return block_1;
    }

    // (49:4) {:else}
    function create_else_block$1(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 262144) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[18], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(49:4) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (47:4) {#if children}
    function create_if_block_1(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(47:4) {#if children}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { active = false } = $$props;
    	let { block = false } = $$props;
    	let { children = undefined } = $$props;
    	let { close = false } = $$props;
    	let { color = "secondary" } = $$props;
    	let { disabled = false } = $$props;
    	let { href = "" } = $$props;
    	let { id = "" } = $$props;
    	let { outline = false } = $$props;
    	let { size = "" } = $$props;
    	let { style = "" } = $$props;
    	let { value = "" } = $$props;
    	const props = clean($$props);
    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Button", $$slots, ['default']);

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function click_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$new_props => {
    		$$invalidate(17, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(11, className = $$new_props.class);
    		if ("active" in $$new_props) $$invalidate(12, active = $$new_props.active);
    		if ("block" in $$new_props) $$invalidate(13, block = $$new_props.block);
    		if ("children" in $$new_props) $$invalidate(0, children = $$new_props.children);
    		if ("close" in $$new_props) $$invalidate(1, close = $$new_props.close);
    		if ("color" in $$new_props) $$invalidate(14, color = $$new_props.color);
    		if ("disabled" in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ("href" in $$new_props) $$invalidate(3, href = $$new_props.href);
    		if ("id" in $$new_props) $$invalidate(4, id = $$new_props.id);
    		if ("outline" in $$new_props) $$invalidate(15, outline = $$new_props.outline);
    		if ("size" in $$new_props) $$invalidate(16, size = $$new_props.size);
    		if ("style" in $$new_props) $$invalidate(5, style = $$new_props.style);
    		if ("value" in $$new_props) $$invalidate(6, value = $$new_props.value);
    		if ("$$scope" in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		clsx,
    		clean,
    		className,
    		active,
    		block,
    		children,
    		close,
    		color,
    		disabled,
    		href,
    		id,
    		outline,
    		size,
    		style,
    		value,
    		props,
    		ariaLabel,
    		classes,
    		defaultAriaLabel
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(17, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(11, className = $$new_props.className);
    		if ("active" in $$props) $$invalidate(12, active = $$new_props.active);
    		if ("block" in $$props) $$invalidate(13, block = $$new_props.block);
    		if ("children" in $$props) $$invalidate(0, children = $$new_props.children);
    		if ("close" in $$props) $$invalidate(1, close = $$new_props.close);
    		if ("color" in $$props) $$invalidate(14, color = $$new_props.color);
    		if ("disabled" in $$props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ("href" in $$props) $$invalidate(3, href = $$new_props.href);
    		if ("id" in $$props) $$invalidate(4, id = $$new_props.id);
    		if ("outline" in $$props) $$invalidate(15, outline = $$new_props.outline);
    		if ("size" in $$props) $$invalidate(16, size = $$new_props.size);
    		if ("style" in $$props) $$invalidate(5, style = $$new_props.style);
    		if ("value" in $$props) $$invalidate(6, value = $$new_props.value);
    		if ("ariaLabel" in $$props) $$invalidate(7, ariaLabel = $$new_props.ariaLabel);
    		if ("classes" in $$props) $$invalidate(8, classes = $$new_props.classes);
    		if ("defaultAriaLabel" in $$props) $$invalidate(9, defaultAriaLabel = $$new_props.defaultAriaLabel);
    	};

    	let ariaLabel;
    	let classes;
    	let defaultAriaLabel;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		 $$invalidate(7, ariaLabel = $$props["aria-label"]);

    		if ($$self.$$.dirty & /*className, close, outline, color, size, block, active*/ 129026) {
    			 $$invalidate(8, classes = clsx(className, { close }, close || "btn", close || `btn${outline ? "-outline" : ""}-${color}`, size ? `btn-${size}` : false, block ? "btn-block" : false, { active }));
    		}

    		if ($$self.$$.dirty & /*close*/ 2) {
    			 $$invalidate(9, defaultAriaLabel = close ? "Close" : null);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		children,
    		close,
    		disabled,
    		href,
    		id,
    		style,
    		value,
    		ariaLabel,
    		classes,
    		defaultAriaLabel,
    		props,
    		className,
    		active,
    		block,
    		color,
    		outline,
    		size,
    		$$props,
    		$$scope,
    		$$slots,
    		click_handler,
    		click_handler_1
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			class: 11,
    			active: 12,
    			block: 13,
    			children: 0,
    			close: 1,
    			color: 14,
    			disabled: 2,
    			href: 3,
    			id: 4,
    			outline: 15,
    			size: 16,
    			style: 5,
    			value: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get class() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get close() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set close(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outline() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outline(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Table.svelte generated by Svelte v3.23.0 */
    const file$1 = "node_modules\\sveltestrap\\src\\Table.svelte";

    // (38:0) {:else}
    function create_else_block$2(ctx) {
    	let table;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	let table_levels = [/*props*/ ctx[3], { class: /*classes*/ ctx[1] }];
    	let table_data = {};

    	for (let i = 0; i < table_levels.length; i += 1) {
    		table_data = assign(table_data, table_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			if (default_slot) default_slot.c();
    			set_attributes(table, table_data);
    			add_location(table, file$1, 38, 2, 908);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);

    			if (default_slot) {
    				default_slot.m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4096) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[12], dirty, null, null);
    				}
    			}

    			set_attributes(table, table_data = get_spread_update(table_levels, [
    				dirty & /*props*/ 8 && /*props*/ ctx[3],
    				dirty & /*classes*/ 2 && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(38:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (32:0) {#if responsive}
    function create_if_block$2(ctx) {
    	let div;
    	let table;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	let table_levels = [/*props*/ ctx[3], { class: /*classes*/ ctx[1] }];
    	let table_data = {};

    	for (let i = 0; i < table_levels.length; i += 1) {
    		table_data = assign(table_data, table_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			if (default_slot) default_slot.c();
    			set_attributes(table, table_data);
    			add_location(table, file$1, 33, 4, 826);
    			attr_dev(div, "class", /*responsiveClassName*/ ctx[2]);
    			add_location(div, file$1, 32, 2, 788);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);

    			if (default_slot) {
    				default_slot.m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4096) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[12], dirty, null, null);
    				}
    			}

    			set_attributes(table, table_data = get_spread_update(table_levels, [
    				dirty & /*props*/ 8 && /*props*/ ctx[3],
    				dirty & /*classes*/ 2 && { class: /*classes*/ ctx[1] }
    			]));

    			if (!current || dirty & /*responsiveClassName*/ 4) {
    				attr_dev(div, "class", /*responsiveClassName*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(32:0) {#if responsive}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*responsive*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { size = "" } = $$props;
    	let { bordered = false } = $$props;
    	let { borderless = false } = $$props;
    	let { striped = false } = $$props;
    	let { dark = false } = $$props;
    	let { hover = false } = $$props;
    	let { responsive = false } = $$props;
    	const props = clean($$props);
    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Table", $$slots, ['default']);

    	$$self.$set = $$new_props => {
    		$$invalidate(11, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ("size" in $$new_props) $$invalidate(5, size = $$new_props.size);
    		if ("bordered" in $$new_props) $$invalidate(6, bordered = $$new_props.bordered);
    		if ("borderless" in $$new_props) $$invalidate(7, borderless = $$new_props.borderless);
    		if ("striped" in $$new_props) $$invalidate(8, striped = $$new_props.striped);
    		if ("dark" in $$new_props) $$invalidate(9, dark = $$new_props.dark);
    		if ("hover" in $$new_props) $$invalidate(10, hover = $$new_props.hover);
    		if ("responsive" in $$new_props) $$invalidate(0, responsive = $$new_props.responsive);
    		if ("$$scope" in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		clsx,
    		clean,
    		className,
    		size,
    		bordered,
    		borderless,
    		striped,
    		dark,
    		hover,
    		responsive,
    		props,
    		classes,
    		responsiveClassName
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(11, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
    		if ("size" in $$props) $$invalidate(5, size = $$new_props.size);
    		if ("bordered" in $$props) $$invalidate(6, bordered = $$new_props.bordered);
    		if ("borderless" in $$props) $$invalidate(7, borderless = $$new_props.borderless);
    		if ("striped" in $$props) $$invalidate(8, striped = $$new_props.striped);
    		if ("dark" in $$props) $$invalidate(9, dark = $$new_props.dark);
    		if ("hover" in $$props) $$invalidate(10, hover = $$new_props.hover);
    		if ("responsive" in $$props) $$invalidate(0, responsive = $$new_props.responsive);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    		if ("responsiveClassName" in $$props) $$invalidate(2, responsiveClassName = $$new_props.responsiveClassName);
    	};

    	let classes;
    	let responsiveClassName;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, size, bordered, borderless, striped, dark, hover*/ 2032) {
    			 $$invalidate(1, classes = clsx(className, "table", size ? "table-" + size : false, bordered ? "table-bordered" : false, borderless ? "table-borderless" : false, striped ? "table-striped" : false, dark ? "table-dark" : false, hover ? "table-hover" : false));
    		}

    		if ($$self.$$.dirty & /*responsive*/ 1) {
    			 $$invalidate(2, responsiveClassName = responsive === true
    			? "table-responsive"
    			: `table-responsive-${responsive}`);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		responsive,
    		classes,
    		responsiveClassName,
    		props,
    		className,
    		size,
    		bordered,
    		borderless,
    		striped,
    		dark,
    		hover,
    		$$props,
    		$$scope,
    		$$slots
    	];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			class: 4,
    			size: 5,
    			bordered: 6,
    			borderless: 7,
    			striped: 8,
    			dark: 9,
    			hover: 10,
    			responsive: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get class() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bordered() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bordered(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get borderless() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set borderless(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get striped() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set striped(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dark() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dark(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hover() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get responsive() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set responsive(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const createContext = () => writable({});

    /* node_modules\sveltestrap\src\Dropdown.svelte generated by Svelte v3.23.0 */

    const { Error: Error_1$1 } = globals;
    const file$2 = "node_modules\\sveltestrap\\src\\Dropdown.svelte";

    // (103:0) {:else}
    function create_else_block$3(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[21].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[20], null);
    	let div_levels = [{ class: /*classes*/ ctx[2] }, /*props*/ ctx[3]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$2, 103, 2, 2448);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[23](div);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1048576) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[20], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*classes*/ 4 && { class: /*classes*/ ctx[2] },
    				dirty & /*props*/ 8 && /*props*/ ctx[3]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[23](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(103:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (99:0) {#if nav}
    function create_if_block$3(ctx) {
    	let li;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[21].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[20], null);
    	let li_levels = [{ class: /*classes*/ ctx[2] }, /*props*/ ctx[3]];
    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (default_slot) default_slot.c();
    			set_attributes(li, li_data);
    			add_location(li, file$2, 99, 2, 2363);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (default_slot) {
    				default_slot.m(li, null);
    			}

    			/*li_binding*/ ctx[22](li);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1048576) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[20], dirty, null, null);
    				}
    			}

    			set_attributes(li, li_data = get_spread_update(li_levels, [
    				dirty & /*classes*/ 4 && { class: /*classes*/ ctx[2] },
    				dirty & /*props*/ 8 && /*props*/ ctx[3]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (default_slot) default_slot.d(detaching);
    			/*li_binding*/ ctx[22](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(99:0) {#if nav}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*nav*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1$1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let context = createContext();
    	setContext("dropdownContext", context);
    	let { class: className = "" } = $$props;
    	let { direction = "down" } = $$props;
    	let { group = false } = $$props;
    	let { isOpen = false } = $$props;
    	let { nav = false } = $$props;
    	let { active = false } = $$props;
    	let { addonType = false } = $$props;
    	let { size = "" } = $$props;
    	let { toggle = undefined } = $$props;
    	let { inNavbar = false } = $$props;
    	let { setActiveFromChild = false } = $$props;
    	let { dropup = false } = $$props;
    	const props = clean($$props);
    	const validDirections = ["up", "down", "left", "right"];

    	if (validDirections.indexOf(direction) === -1) {
    		throw new Error(`Invalid direction sent: '${direction}' is not one of 'up', 'down', 'left', 'right'`);
    	}

    	let component;

    	function handleDocumentClick(e) {
    		if (e && (e.which === 3 || e.type === "keyup" && e.which !== 9)) return;

    		if (component.contains(e.target) && component !== e.target && (e.type !== "keyup" || e.which === 9)) {
    			return;
    		}

    		toggle(e);
    	}

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Dropdown", $$slots, ['default']);

    	function li_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(1, component = $$value);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(1, component = $$value);
    		});
    	}

    	$$self.$set = $$new_props => {
    		$$invalidate(19, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ("direction" in $$new_props) $$invalidate(5, direction = $$new_props.direction);
    		if ("group" in $$new_props) $$invalidate(6, group = $$new_props.group);
    		if ("isOpen" in $$new_props) $$invalidate(7, isOpen = $$new_props.isOpen);
    		if ("nav" in $$new_props) $$invalidate(0, nav = $$new_props.nav);
    		if ("active" in $$new_props) $$invalidate(8, active = $$new_props.active);
    		if ("addonType" in $$new_props) $$invalidate(9, addonType = $$new_props.addonType);
    		if ("size" in $$new_props) $$invalidate(10, size = $$new_props.size);
    		if ("toggle" in $$new_props) $$invalidate(11, toggle = $$new_props.toggle);
    		if ("inNavbar" in $$new_props) $$invalidate(12, inNavbar = $$new_props.inNavbar);
    		if ("setActiveFromChild" in $$new_props) $$invalidate(13, setActiveFromChild = $$new_props.setActiveFromChild);
    		if ("dropup" in $$new_props) $$invalidate(14, dropup = $$new_props.dropup);
    		if ("$$scope" in $$new_props) $$invalidate(20, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		clsx,
    		clean,
    		createContext,
    		context,
    		className,
    		direction,
    		group,
    		isOpen,
    		nav,
    		active,
    		addonType,
    		size,
    		toggle,
    		inNavbar,
    		setActiveFromChild,
    		dropup,
    		props,
    		validDirections,
    		component,
    		handleDocumentClick,
    		subItemIsActive,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(19, $$props = assign(assign({}, $$props), $$new_props));
    		if ("context" in $$props) $$invalidate(16, context = $$new_props.context);
    		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
    		if ("direction" in $$props) $$invalidate(5, direction = $$new_props.direction);
    		if ("group" in $$props) $$invalidate(6, group = $$new_props.group);
    		if ("isOpen" in $$props) $$invalidate(7, isOpen = $$new_props.isOpen);
    		if ("nav" in $$props) $$invalidate(0, nav = $$new_props.nav);
    		if ("active" in $$props) $$invalidate(8, active = $$new_props.active);
    		if ("addonType" in $$props) $$invalidate(9, addonType = $$new_props.addonType);
    		if ("size" in $$props) $$invalidate(10, size = $$new_props.size);
    		if ("toggle" in $$props) $$invalidate(11, toggle = $$new_props.toggle);
    		if ("inNavbar" in $$props) $$invalidate(12, inNavbar = $$new_props.inNavbar);
    		if ("setActiveFromChild" in $$props) $$invalidate(13, setActiveFromChild = $$new_props.setActiveFromChild);
    		if ("dropup" in $$props) $$invalidate(14, dropup = $$new_props.dropup);
    		if ("component" in $$props) $$invalidate(1, component = $$new_props.component);
    		if ("subItemIsActive" in $$props) $$invalidate(15, subItemIsActive = $$new_props.subItemIsActive);
    		if ("classes" in $$props) $$invalidate(2, classes = $$new_props.classes);
    	};

    	let subItemIsActive;
    	let classes;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*setActiveFromChild, component*/ 8194) {
    			 $$invalidate(15, subItemIsActive = !!(setActiveFromChild && component && typeof component.querySelector === "function" && component.querySelector(".active")));
    		}

    		if ($$self.$$.dirty & /*className, direction, nav, active, setActiveFromChild, subItemIsActive, addonType, group, size, isOpen*/ 42993) {
    			 $$invalidate(2, classes = clsx(className, direction !== "down" && `drop${direction}`, nav && active ? "active" : false, setActiveFromChild && subItemIsActive ? "active" : false, {
    				[`input-group-${addonType}`]: addonType,
    				"btn-group": group,
    				[`btn-group-${size}`]: !!size,
    				dropdown: !group && !addonType,
    				show: isOpen,
    				"nav-item": nav
    			}));
    		}

    		if ($$self.$$.dirty & /*isOpen*/ 128) {
    			 {
    				if (typeof document !== "undefined") {
    					if (isOpen) {
    						["click", "touchstart", "keyup"].forEach(event => document.addEventListener(event, handleDocumentClick, true));
    					} else {
    						["click", "touchstart", "keyup"].forEach(event => document.removeEventListener(event, handleDocumentClick, true));
    					}
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*toggle, isOpen, direction, dropup, inNavbar*/ 22688) {
    			 {
    				context.update(() => {
    					return {
    						toggle,
    						isOpen,
    						direction: direction === "down" && dropup ? "up" : direction,
    						inNavbar
    					};
    				});
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		nav,
    		component,
    		classes,
    		props,
    		className,
    		direction,
    		group,
    		isOpen,
    		active,
    		addonType,
    		size,
    		toggle,
    		inNavbar,
    		setActiveFromChild,
    		dropup,
    		subItemIsActive,
    		context,
    		validDirections,
    		handleDocumentClick,
    		$$props,
    		$$scope,
    		$$slots,
    		li_binding,
    		div_binding
    	];
    }

    class Dropdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			class: 4,
    			direction: 5,
    			group: 6,
    			isOpen: 7,
    			nav: 0,
    			active: 8,
    			addonType: 9,
    			size: 10,
    			toggle: 11,
    			inNavbar: 12,
    			setActiveFromChild: 13,
    			dropup: 14
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dropdown",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get class() {
    		throw new Error_1$1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error_1$1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get direction() {
    		throw new Error_1$1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set direction(value) {
    		throw new Error_1$1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group() {
    		throw new Error_1$1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error_1$1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error_1$1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error_1$1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nav() {
    		throw new Error_1$1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nav(value) {
    		throw new Error_1$1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error_1$1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error_1$1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get addonType() {
    		throw new Error_1$1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set addonType(value) {
    		throw new Error_1$1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error_1$1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error_1$1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggle() {
    		throw new Error_1$1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggle(value) {
    		throw new Error_1$1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inNavbar() {
    		throw new Error_1$1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inNavbar(value) {
    		throw new Error_1$1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setActiveFromChild() {
    		throw new Error_1$1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setActiveFromChild(value) {
    		throw new Error_1$1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dropup() {
    		throw new Error_1$1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dropup(value) {
    		throw new Error_1$1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\DropdownItem.svelte generated by Svelte v3.23.0 */
    const file$3 = "node_modules\\sveltestrap\\src\\DropdownItem.svelte";

    // (53:0) {:else}
    function create_else_block$4(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);
    	let button_levels = [/*props*/ ctx[5], { class: /*classes*/ ctx[3] }];
    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			set_attributes(button, button_data);
    			add_location(button, file$3, 53, 2, 1125);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler_2*/ ctx[18], false, false, false),
    					listen_dev(button, "click", /*handleItemClick*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8192) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[13], dirty, null, null);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				dirty & /*props*/ 32 && /*props*/ ctx[5],
    				dirty & /*classes*/ 8 && { class: /*classes*/ ctx[3] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(53:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (49:15) 
    function create_if_block_2$1(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			attr_dev(a, "click", "");
    			attr_dev(a, "href", /*href*/ ctx[2]);
    			attr_dev(a, "class", /*classes*/ ctx[3]);
    			add_location(a, file$3, 49, 2, 1021);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "{...props}", /*props_handler*/ ctx[17], false, false, false),
    					listen_dev(a, "click", /*handleItemClick*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8192) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[13], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*href*/ 4) {
    				attr_dev(a, "href", /*href*/ ctx[2]);
    			}

    			if (!current || dirty & /*classes*/ 8) {
    				attr_dev(a, "class", /*classes*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(49:15) ",
    		ctx
    	});

    	return block;
    }

    // (45:18) 
    function create_if_block_1$1(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);
    	let div_levels = [/*props*/ ctx[5], { class: /*classes*/ ctx[3] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$3, 45, 2, 912);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", /*click_handler_1*/ ctx[16], false, false, false),
    					listen_dev(div, "click", /*handleItemClick*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8192) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[13], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*props*/ 32 && /*props*/ ctx[5],
    				dirty & /*classes*/ 8 && { class: /*classes*/ ctx[3] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(45:18) ",
    		ctx
    	});

    	return block;
    }

    // (40:0) {#if header}
    function create_if_block$4(ctx) {
    	let h6;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);
    	let h6_levels = [/*props*/ ctx[5], { class: /*classes*/ ctx[3] }];
    	let h6_data = {};

    	for (let i = 0; i < h6_levels.length; i += 1) {
    		h6_data = assign(h6_data, h6_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			if (default_slot) default_slot.c();
    			set_attributes(h6, h6_data);
    			add_location(h6, file$3, 40, 2, 801);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);

    			if (default_slot) {
    				default_slot.m(h6, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(h6, "click", /*click_handler*/ ctx[15], false, false, false),
    					listen_dev(h6, "click", /*handleItemClick*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8192) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[13], dirty, null, null);
    				}
    			}

    			set_attributes(h6, h6_data = get_spread_update(h6_levels, [
    				dirty & /*props*/ 32 && /*props*/ ctx[5],
    				dirty & /*classes*/ 8 && { class: /*classes*/ ctx[3] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(40:0) {#if header}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$4, create_if_block_1$1, create_if_block_2$1, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*header*/ ctx[1]) return 0;
    		if (/*divider*/ ctx[0]) return 1;
    		if (/*href*/ ctx[2]) return 2;
    		return 3;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $context;
    	const context = getContext("dropdownContext");
    	validate_store(context, "context");
    	component_subscribe($$self, context, value => $$invalidate(11, $context = value));
    	let { class: className = "" } = $$props;
    	let { active = false } = $$props;
    	let { disabled = false } = $$props;
    	let { divider = false } = $$props;
    	let { header = false } = $$props;
    	let { toggle = true } = $$props;
    	let { href = "" } = $$props;
    	const props = clean($$props);

    	function handleItemClick(e) {
    		if (disabled || header || divider) {
    			e.preventDefault();
    			return;
    		}

    		if (toggle) {
    			$context.toggle(e);
    		}
    	}

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("DropdownItem", $$slots, ['default']);

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function click_handler_1(event) {
    		bubble($$self, event);
    	}

    	function props_handler(event) {
    		bubble($$self, event);
    	}

    	function click_handler_2(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$new_props => {
    		$$invalidate(12, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(7, className = $$new_props.class);
    		if ("active" in $$new_props) $$invalidate(8, active = $$new_props.active);
    		if ("disabled" in $$new_props) $$invalidate(9, disabled = $$new_props.disabled);
    		if ("divider" in $$new_props) $$invalidate(0, divider = $$new_props.divider);
    		if ("header" in $$new_props) $$invalidate(1, header = $$new_props.header);
    		if ("toggle" in $$new_props) $$invalidate(10, toggle = $$new_props.toggle);
    		if ("href" in $$new_props) $$invalidate(2, href = $$new_props.href);
    		if ("$$scope" in $$new_props) $$invalidate(13, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		clsx,
    		clean,
    		context,
    		className,
    		active,
    		disabled,
    		divider,
    		header,
    		toggle,
    		href,
    		props,
    		handleItemClick,
    		classes,
    		$context
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(12, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(7, className = $$new_props.className);
    		if ("active" in $$props) $$invalidate(8, active = $$new_props.active);
    		if ("disabled" in $$props) $$invalidate(9, disabled = $$new_props.disabled);
    		if ("divider" in $$props) $$invalidate(0, divider = $$new_props.divider);
    		if ("header" in $$props) $$invalidate(1, header = $$new_props.header);
    		if ("toggle" in $$props) $$invalidate(10, toggle = $$new_props.toggle);
    		if ("href" in $$props) $$invalidate(2, href = $$new_props.href);
    		if ("classes" in $$props) $$invalidate(3, classes = $$new_props.classes);
    	};

    	let classes;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, disabled, divider, header, active*/ 899) {
    			 $$invalidate(3, classes = clsx(className, {
    				disabled,
    				"dropdown-item": !divider && !header,
    				active,
    				"dropdown-header": header,
    				"dropdown-divider": divider
    			}));
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		divider,
    		header,
    		href,
    		classes,
    		context,
    		props,
    		handleItemClick,
    		className,
    		active,
    		disabled,
    		toggle,
    		$context,
    		$$props,
    		$$scope,
    		$$slots,
    		click_handler,
    		click_handler_1,
    		props_handler,
    		click_handler_2
    	];
    }

    class DropdownItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			class: 7,
    			active: 8,
    			disabled: 9,
    			divider: 0,
    			header: 1,
    			toggle: 10,
    			href: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DropdownItem",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get class() {
    		throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get divider() {
    		throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set divider(value) {
    		throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get header() {
    		throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set header(value) {
    		throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggle() {
    		throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggle(value) {
    		throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\DropdownMenu.svelte generated by Svelte v3.23.0 */
    const file$4 = "node_modules\\sveltestrap\\src\\DropdownMenu.svelte";

    function create_fragment$5(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);
    	let div_levels = [/*props*/ ctx[2], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$4, 19, 0, 405);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 128) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[7], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*props*/ 4 && /*props*/ ctx[2],
    				dirty & /*classes*/ 1 && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $context;
    	const context = getContext("dropdownContext");
    	validate_store(context, "context");
    	component_subscribe($$self, context, value => $$invalidate(5, $context = value));
    	let { class: className = "" } = $$props;
    	let { right = false } = $$props;
    	const props = clean($$props);
    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("DropdownMenu", $$slots, ['default']);

    	$$self.$set = $$new_props => {
    		$$invalidate(6, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ("right" in $$new_props) $$invalidate(4, right = $$new_props.right);
    		if ("$$scope" in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		clsx,
    		clean,
    		context,
    		className,
    		right,
    		props,
    		classes,
    		$context
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(6, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(3, className = $$new_props.className);
    		if ("right" in $$props) $$invalidate(4, right = $$new_props.right);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	let classes;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, right, $context*/ 56) {
    			 $$invalidate(0, classes = clsx(className, "dropdown-menu", {
    				"dropdown-menu-right": right,
    				show: $context.isOpen
    			}));
    		}
    	};

    	$$props = exclude_internal_props($$props);
    	return [classes, context, props, className, right, $context, $$props, $$scope, $$slots];
    }

    class DropdownMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { class: 3, right: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DropdownMenu",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get class() {
    		throw new Error("<DropdownMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<DropdownMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get right() {
    		throw new Error("<DropdownMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set right(value) {
    		throw new Error("<DropdownMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\DropdownToggle.svelte generated by Svelte v3.23.0 */
    const file$5 = "node_modules\\sveltestrap\\src\\DropdownToggle.svelte";

    // (70:0) {:else}
    function create_else_block$5(ctx) {
    	let current;

    	const button_spread_levels = [
    		/*props*/ ctx[9],
    		{ ariaHaspopup: /*ariaHaspopup*/ ctx[1] },
    		{ class: /*classes*/ ctx[7] },
    		{ color: /*color*/ ctx[0] },
    		{ size: /*size*/ ctx[4] },
    		{ outline: /*outline*/ ctx[6] }
    	];

    	let button_props = {
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < button_spread_levels.length; i += 1) {
    		button_props = assign(button_props, button_spread_levels[i]);
    	}

    	const button = new Button({ props: button_props, $$inline: true });
    	button.$on("click", /*click_handler_2*/ ctx[20]);
    	button.$on("click", /*toggleButton*/ ctx[10]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = (dirty & /*props, ariaHaspopup, classes, color, size, outline*/ 723)
    			? get_spread_update(button_spread_levels, [
    					dirty & /*props*/ 512 && get_spread_object(/*props*/ ctx[9]),
    					dirty & /*ariaHaspopup*/ 2 && { ariaHaspopup: /*ariaHaspopup*/ ctx[1] },
    					dirty & /*classes*/ 128 && { class: /*classes*/ ctx[7] },
    					dirty & /*color*/ 1 && { color: /*color*/ ctx[0] },
    					dirty & /*size*/ 16 && { size: /*size*/ ctx[4] },
    					dirty & /*outline*/ 64 && { outline: /*outline*/ ctx[6] }
    				])
    			: {};

    			if (dirty & /*$$scope, ariaLabel*/ 2097156) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(70:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (57:25) 
    function create_if_block_1$2(ctx) {
    	let span;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[21], null);
    	const default_slot_or_fallback = default_slot || fallback_block_1(ctx);

    	let span_levels = [
    		/*props*/ ctx[9],
    		{ ariahaspopup: /*ariaHaspopup*/ ctx[1] },
    		{ class: /*classes*/ ctx[7] },
    		{ color: /*color*/ ctx[0] },
    		{ size: /*size*/ ctx[4] }
    	];

    	let span_data = {};

    	for (let i = 0; i < span_levels.length; i += 1) {
    		span_data = assign(span_data, span_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(span, span_data);
    			add_location(span, file$5, 57, 2, 1145);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(span, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span, "click", /*click_handler_1*/ ctx[19], false, false, false),
    					listen_dev(span, "click", /*toggleButton*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2097152) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[21], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*ariaLabel*/ 4) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			set_attributes(span, span_data = get_spread_update(span_levels, [
    				dirty & /*props*/ 512 && /*props*/ ctx[9],
    				dirty & /*ariaHaspopup*/ 2 && { ariahaspopup: /*ariaHaspopup*/ ctx[1] },
    				dirty & /*classes*/ 128 && { class: /*classes*/ ctx[7] },
    				dirty & /*color*/ 1 && { color: /*color*/ ctx[0] },
    				dirty & /*size*/ 16 && { size: /*size*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(57:25) ",
    		ctx
    	});

    	return block;
    }

    // (45:0) {#if nav}
    function create_if_block$5(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[21], null);
    	const default_slot_or_fallback = default_slot || fallback_block$1(ctx);

    	let a_levels = [
    		/*props*/ ctx[9],
    		{ href: "#nav" },
    		{ ariahaspopup: /*ariaHaspopup*/ ctx[1] },
    		{ class: /*classes*/ ctx[7] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(a, a_data);
    			add_location(a, file$5, 45, 2, 925);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler*/ ctx[18], false, false, false),
    					listen_dev(a, "click", /*toggleButton*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2097152) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[21], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*ariaLabel*/ 4) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*props*/ 512 && /*props*/ ctx[9],
    				{ href: "#nav" },
    				dirty & /*ariaHaspopup*/ 2 && { ariahaspopup: /*ariaHaspopup*/ ctx[1] },
    				dirty & /*classes*/ 128 && { class: /*classes*/ ctx[7] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(45:0) {#if nav}",
    		ctx
    	});

    	return block;
    }

    // (80:10)        
    function fallback_block_2(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*ariaLabel*/ ctx[2]);
    			attr_dev(span, "class", "sr-only");
    			add_location(span, file$5, 80, 6, 1518);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ariaLabel*/ 4) set_data_dev(t, /*ariaLabel*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_2.name,
    		type: "fallback",
    		source: "(80:10)        ",
    		ctx
    	});

    	return block;
    }

    // (71:2) <Button     {...props}     on:click     on:click={toggleButton}     {ariaHaspopup}     class={classes}     {color}     {size}     {outline}>
    function create_default_slot(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[21], null);
    	const default_slot_or_fallback = default_slot || fallback_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2097152) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[21], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*ariaLabel*/ 4) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(71:2) <Button     {...props}     on:click     on:click={toggleButton}     {ariaHaspopup}     class={classes}     {color}     {size}     {outline}>",
    		ctx
    	});

    	return block;
    }

    // (66:10)        
    function fallback_block_1(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*ariaLabel*/ ctx[2]);
    			attr_dev(span, "class", "sr-only");
    			add_location(span, file$5, 66, 6, 1287);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ariaLabel*/ 4) set_data_dev(t, /*ariaLabel*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(66:10)        ",
    		ctx
    	});

    	return block;
    }

    // (53:10)        
    function fallback_block$1(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*ariaLabel*/ ctx[2]);
    			attr_dev(span, "class", "sr-only");
    			add_location(span, file$5, 53, 6, 1057);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ariaLabel*/ 4) set_data_dev(t, /*ariaLabel*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(53:10)        ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$5, create_if_block_1$2, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*nav*/ ctx[3]) return 0;
    		if (/*tag*/ ctx[5] === "span") return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $context;
    	const context = getContext("dropdownContext");
    	validate_store(context, "context");
    	component_subscribe($$self, context, value => $$invalidate(15, $context = value));
    	let { class: className = "" } = $$props;
    	let { caret = false } = $$props;
    	let { color = "secondary" } = $$props;
    	let { disabled = false } = $$props;
    	let { ariaHaspopup = true } = $$props;
    	let { ariaLabel = "Toggle Dropdown" } = $$props;
    	let { split = false } = $$props;
    	let { nav = false } = $$props;
    	let { size = "" } = $$props;
    	let { tag = null } = $$props;
    	let { outline = false } = $$props;
    	const props = clean($$props);

    	function toggleButton(e) {
    		if (disabled) {
    			e.preventDefault();
    			return;
    		}

    		if (nav) {
    			e.preventDefault();
    		}

    		$context.toggle(e);
    	}

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("DropdownToggle", $$slots, ['default']);

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function click_handler_1(event) {
    		bubble($$self, event);
    	}

    	function click_handler_2(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$new_props => {
    		$$invalidate(16, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(11, className = $$new_props.class);
    		if ("caret" in $$new_props) $$invalidate(12, caret = $$new_props.caret);
    		if ("color" in $$new_props) $$invalidate(0, color = $$new_props.color);
    		if ("disabled" in $$new_props) $$invalidate(13, disabled = $$new_props.disabled);
    		if ("ariaHaspopup" in $$new_props) $$invalidate(1, ariaHaspopup = $$new_props.ariaHaspopup);
    		if ("ariaLabel" in $$new_props) $$invalidate(2, ariaLabel = $$new_props.ariaLabel);
    		if ("split" in $$new_props) $$invalidate(14, split = $$new_props.split);
    		if ("nav" in $$new_props) $$invalidate(3, nav = $$new_props.nav);
    		if ("size" in $$new_props) $$invalidate(4, size = $$new_props.size);
    		if ("tag" in $$new_props) $$invalidate(5, tag = $$new_props.tag);
    		if ("outline" in $$new_props) $$invalidate(6, outline = $$new_props.outline);
    		if ("$$scope" in $$new_props) $$invalidate(21, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		clsx,
    		clean,
    		Button,
    		context,
    		className,
    		caret,
    		color,
    		disabled,
    		ariaHaspopup,
    		ariaLabel,
    		split,
    		nav,
    		size,
    		tag,
    		outline,
    		props,
    		toggleButton,
    		classes,
    		$context
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(16, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(11, className = $$new_props.className);
    		if ("caret" in $$props) $$invalidate(12, caret = $$new_props.caret);
    		if ("color" in $$props) $$invalidate(0, color = $$new_props.color);
    		if ("disabled" in $$props) $$invalidate(13, disabled = $$new_props.disabled);
    		if ("ariaHaspopup" in $$props) $$invalidate(1, ariaHaspopup = $$new_props.ariaHaspopup);
    		if ("ariaLabel" in $$props) $$invalidate(2, ariaLabel = $$new_props.ariaLabel);
    		if ("split" in $$props) $$invalidate(14, split = $$new_props.split);
    		if ("nav" in $$props) $$invalidate(3, nav = $$new_props.nav);
    		if ("size" in $$props) $$invalidate(4, size = $$new_props.size);
    		if ("tag" in $$props) $$invalidate(5, tag = $$new_props.tag);
    		if ("outline" in $$props) $$invalidate(6, outline = $$new_props.outline);
    		if ("classes" in $$props) $$invalidate(7, classes = $$new_props.classes);
    	};

    	let classes;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, caret, split, nav*/ 22536) {
    			 $$invalidate(7, classes = clsx(className, {
    				"dropdown-toggle": caret || split,
    				"dropdown-toggle-split": split,
    				"nav-link": nav
    			}));
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		color,
    		ariaHaspopup,
    		ariaLabel,
    		nav,
    		size,
    		tag,
    		outline,
    		classes,
    		context,
    		props,
    		toggleButton,
    		className,
    		caret,
    		disabled,
    		split,
    		$context,
    		$$props,
    		$$slots,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		$$scope
    	];
    }

    class DropdownToggle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			class: 11,
    			caret: 12,
    			color: 0,
    			disabled: 13,
    			ariaHaspopup: 1,
    			ariaLabel: 2,
    			split: 14,
    			nav: 3,
    			size: 4,
    			tag: 5,
    			outline: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DropdownToggle",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get class() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get caret() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set caret(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaHaspopup() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaHaspopup(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get split() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set split(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nav() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nav(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tag() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tag(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outline() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outline(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\FormGroup.svelte generated by Svelte v3.23.0 */
    const file$6 = "node_modules\\sveltestrap\\src\\FormGroup.svelte";

    // (29:0) {:else}
    function create_else_block$6(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	let div_levels = [/*props*/ ctx[3], { id: /*id*/ ctx[0] }, { class: /*classes*/ ctx[2] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$6, 29, 2, 648);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1024) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[10], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*props*/ 8 && /*props*/ ctx[3],
    				dirty & /*id*/ 1 && { id: /*id*/ ctx[0] },
    				dirty & /*classes*/ 4 && { class: /*classes*/ ctx[2] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(29:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (25:0) {#if tag === 'fieldset'}
    function create_if_block$6(ctx) {
    	let fieldset;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	let fieldset_levels = [/*props*/ ctx[3], { id: /*id*/ ctx[0] }, { class: /*classes*/ ctx[2] }];
    	let fieldset_data = {};

    	for (let i = 0; i < fieldset_levels.length; i += 1) {
    		fieldset_data = assign(fieldset_data, fieldset_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			fieldset = element("fieldset");
    			if (default_slot) default_slot.c();
    			set_attributes(fieldset, fieldset_data);
    			add_location(fieldset, file$6, 25, 2, 568);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, fieldset, anchor);

    			if (default_slot) {
    				default_slot.m(fieldset, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1024) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[10], dirty, null, null);
    				}
    			}

    			set_attributes(fieldset, fieldset_data = get_spread_update(fieldset_levels, [
    				dirty & /*props*/ 8 && /*props*/ ctx[3],
    				dirty & /*id*/ 1 && { id: /*id*/ ctx[0] },
    				dirty & /*classes*/ 4 && { class: /*classes*/ ctx[2] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(fieldset);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(25:0) {#if tag === 'fieldset'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$6, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tag*/ ctx[1] === "fieldset") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { row = false } = $$props;
    	let { check = false } = $$props;
    	let { inline = false } = $$props;
    	let { disabled = false } = $$props;
    	let { id = "" } = $$props;
    	let { tag = null } = $$props;
    	const props = clean($$props);
    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("FormGroup", $$slots, ['default']);

    	$$self.$set = $$new_props => {
    		$$invalidate(9, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ("row" in $$new_props) $$invalidate(5, row = $$new_props.row);
    		if ("check" in $$new_props) $$invalidate(6, check = $$new_props.check);
    		if ("inline" in $$new_props) $$invalidate(7, inline = $$new_props.inline);
    		if ("disabled" in $$new_props) $$invalidate(8, disabled = $$new_props.disabled);
    		if ("id" in $$new_props) $$invalidate(0, id = $$new_props.id);
    		if ("tag" in $$new_props) $$invalidate(1, tag = $$new_props.tag);
    		if ("$$scope" in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		clsx,
    		clean,
    		className,
    		row,
    		check,
    		inline,
    		disabled,
    		id,
    		tag,
    		props,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(9, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
    		if ("row" in $$props) $$invalidate(5, row = $$new_props.row);
    		if ("check" in $$props) $$invalidate(6, check = $$new_props.check);
    		if ("inline" in $$props) $$invalidate(7, inline = $$new_props.inline);
    		if ("disabled" in $$props) $$invalidate(8, disabled = $$new_props.disabled);
    		if ("id" in $$props) $$invalidate(0, id = $$new_props.id);
    		if ("tag" in $$props) $$invalidate(1, tag = $$new_props.tag);
    		if ("classes" in $$props) $$invalidate(2, classes = $$new_props.classes);
    	};

    	let classes;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, row, check, inline, disabled*/ 496) {
    			 $$invalidate(2, classes = clsx(className, row ? "row" : false, check ? "form-check" : "form-group", check && inline ? "form-check-inline" : false, check && disabled ? "disabled" : false));
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		id,
    		tag,
    		classes,
    		props,
    		className,
    		row,
    		check,
    		inline,
    		disabled,
    		$$props,
    		$$scope,
    		$$slots
    	];
    }

    class FormGroup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			class: 4,
    			row: 5,
    			check: 6,
    			inline: 7,
    			disabled: 8,
    			id: 0,
    			tag: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormGroup",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get class() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get row() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set row(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get check() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set check(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inline() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inline(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tag() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tag(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Input.svelte generated by Svelte v3.23.0 */

    const { console: console_1$1 } = globals;
    const file$7 = "node_modules\\sveltestrap\\src\\Input.svelte";

    // (391:39) 
    function create_if_block_17(ctx) {
    	let select;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[26].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[25], null);

    	let select_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ multiple: true },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] }
    	];

    	let select_data = {};

    	for (let i = 0; i < select_levels.length; i += 1) {
    		select_data = assign(select_data, select_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			select = element("select");
    			if (default_slot) default_slot.c();
    			set_attributes(select, select_data);
    			if (/*value*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler_1*/ ctx[161].call(select));
    			add_location(select, file$7, 391, 2, 7495);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);

    			if (default_slot) {
    				default_slot.m(select, null);
    			}

    			if (select_data.multiple) select_options(select, select_data.value);
    			select_options(select, /*value*/ ctx[1]);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "blur", /*blur_handler_17*/ ctx[141], false, false, false),
    					listen_dev(select, "focus", /*focus_handler_17*/ ctx[142], false, false, false),
    					listen_dev(select, "change", /*change_handler_16*/ ctx[143], false, false, false),
    					listen_dev(select, "input", /*input_handler_16*/ ctx[144], false, false, false),
    					listen_dev(select, "change", /*select_change_handler_1*/ ctx[161])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope*/ 33554432) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[25], dirty, null, null);
    				}
    			}

    			set_attributes(select, select_data = get_spread_update(select_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ multiple: true },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] }
    			]));

    			if (dirty[0] & /*props, id, classes, name, disabled*/ 5824 && select_data.multiple) select_options(select, select_data.value);

    			if (dirty[0] & /*value*/ 2) {
    				select_options(select, /*value*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_17.name,
    		type: "if",
    		source: "(391:39) ",
    		ctx
    	});

    	return block;
    }

    // (376:40) 
    function create_if_block_16(ctx) {
    	let select;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[26].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[25], null);

    	let select_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] }
    	];

    	let select_data = {};

    	for (let i = 0; i < select_levels.length; i += 1) {
    		select_data = assign(select_data, select_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			select = element("select");
    			if (default_slot) default_slot.c();
    			set_attributes(select, select_data);
    			if (/*value*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[160].call(select));
    			add_location(select, file$7, 376, 2, 7281);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);

    			if (default_slot) {
    				default_slot.m(select, null);
    			}

    			if (select_data.multiple) select_options(select, select_data.value);
    			select_option(select, /*value*/ ctx[1]);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "blur", /*blur_handler_16*/ ctx[137], false, false, false),
    					listen_dev(select, "focus", /*focus_handler_16*/ ctx[138], false, false, false),
    					listen_dev(select, "change", /*change_handler_15*/ ctx[139], false, false, false),
    					listen_dev(select, "input", /*input_handler_15*/ ctx[140], false, false, false),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[160])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope*/ 33554432) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[25], dirty, null, null);
    				}
    			}

    			set_attributes(select, select_data = get_spread_update(select_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] }
    			]));

    			if (dirty[0] & /*props, id, classes, name, disabled*/ 5824 && select_data.multiple) select_options(select, select_data.value);

    			if (dirty[0] & /*value*/ 2) {
    				select_option(select, /*value*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_16.name,
    		type: "if",
    		source: "(376:40) ",
    		ctx
    	});

    	return block;
    }

    // (360:29) 
    function create_if_block_15(ctx) {
    	let textarea;
    	let mounted;
    	let dispose;

    	let textarea_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] }
    	];

    	let textarea_data = {};

    	for (let i = 0; i < textarea_levels.length; i += 1) {
    		textarea_data = assign(textarea_data, textarea_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			set_attributes(textarea, textarea_data);
    			add_location(textarea, file$7, 360, 2, 7043);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    			set_input_value(textarea, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea, "blur", /*blur_handler_15*/ ctx[130], false, false, false),
    					listen_dev(textarea, "focus", /*focus_handler_15*/ ctx[131], false, false, false),
    					listen_dev(textarea, "keydown", /*keydown_handler_15*/ ctx[132], false, false, false),
    					listen_dev(textarea, "keypress", /*keypress_handler_15*/ ctx[133], false, false, false),
    					listen_dev(textarea, "keyup", /*keyup_handler_15*/ ctx[134], false, false, false),
    					listen_dev(textarea, "change", /*change_handler_14*/ ctx[135], false, false, false),
    					listen_dev(textarea, "input", /*input_handler_14*/ ctx[136], false, false, false),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[159])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(textarea, textarea_data = get_spread_update(textarea_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(textarea, /*value*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(360:29) ",
    		ctx
    	});

    	return block;
    }

    // (86:0) {#if tag === 'input'}
    function create_if_block$7(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*type*/ ctx[3] === "text") return create_if_block_1$3;
    		if (/*type*/ ctx[3] === "password") return create_if_block_2$2;
    		if (/*type*/ ctx[3] === "email") return create_if_block_3$1;
    		if (/*type*/ ctx[3] === "file") return create_if_block_4;
    		if (/*type*/ ctx[3] === "checkbox") return create_if_block_5;
    		if (/*type*/ ctx[3] === "radio") return create_if_block_6;
    		if (/*type*/ ctx[3] === "url") return create_if_block_7;
    		if (/*type*/ ctx[3] === "number") return create_if_block_8;
    		if (/*type*/ ctx[3] === "date") return create_if_block_9;
    		if (/*type*/ ctx[3] === "time") return create_if_block_10;
    		if (/*type*/ ctx[3] === "datetime") return create_if_block_11;
    		if (/*type*/ ctx[3] === "color") return create_if_block_12;
    		if (/*type*/ ctx[3] === "range") return create_if_block_13;
    		if (/*type*/ ctx[3] === "search") return create_if_block_14;
    		return create_else_block$7;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(86:0) {#if tag === 'input'}",
    		ctx
    	});

    	return block;
    }

    // (340:2) {:else}
    function create_else_block$7(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: /*type*/ ctx[3] },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] },
    		{ value: /*value*/ ctx[1] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$7, 340, 4, 6710);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_14*/ ctx[125], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_14*/ ctx[126], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_14*/ ctx[127], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_14*/ ctx[128], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_14*/ ctx[129], false, false, false),
    					listen_dev(input, "input", /*handleInput*/ ctx[13], false, false, false),
    					listen_dev(input, "change", /*handleInput*/ ctx[13], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				dirty[0] & /*type*/ 8 && { type: /*type*/ ctx[3] },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] },
    				dirty[0] & /*value*/ 2 && { value: /*value*/ ctx[1] }
    			]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(340:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (322:30) 
    function create_if_block_14(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "search" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$7, 322, 4, 6422);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_13*/ ctx[118], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_13*/ ctx[119], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_13*/ ctx[120], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_13*/ ctx[121], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_13*/ ctx[122], false, false, false),
    					listen_dev(input, "change", /*change_handler_13*/ ctx[123], false, false, false),
    					listen_dev(input, "input", /*input_handler_13*/ ctx[124], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_9*/ ctx[158])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "search" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(322:30) ",
    		ctx
    	});

    	return block;
    }

    // (304:29) 
    function create_if_block_13(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "range" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$7, 304, 4, 6114);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_12*/ ctx[111], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_12*/ ctx[112], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_12*/ ctx[113], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_12*/ ctx[114], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_12*/ ctx[115], false, false, false),
    					listen_dev(input, "change", /*change_handler_12*/ ctx[116], false, false, false),
    					listen_dev(input, "input", /*input_handler_12*/ ctx[117], false, false, false),
    					listen_dev(input, "change", /*input_change_input_handler*/ ctx[157]),
    					listen_dev(input, "input", /*input_change_input_handler*/ ctx[157])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "range" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(304:29) ",
    		ctx
    	});

    	return block;
    }

    // (286:29) 
    function create_if_block_12(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "color" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$7, 286, 4, 5807);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_11*/ ctx[104], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_11*/ ctx[105], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_11*/ ctx[106], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_11*/ ctx[107], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_11*/ ctx[108], false, false, false),
    					listen_dev(input, "change", /*change_handler_11*/ ctx[109], false, false, false),
    					listen_dev(input, "input", /*input_handler_11*/ ctx[110], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_8*/ ctx[156])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "color" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(286:29) ",
    		ctx
    	});

    	return block;
    }

    // (268:32) 
    function create_if_block_11(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "datetime" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$7, 268, 4, 5497);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_10*/ ctx[97], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_10*/ ctx[98], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_10*/ ctx[99], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_10*/ ctx[100], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_10*/ ctx[101], false, false, false),
    					listen_dev(input, "change", /*change_handler_10*/ ctx[102], false, false, false),
    					listen_dev(input, "input", /*input_handler_10*/ ctx[103], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_7*/ ctx[155])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "datetime" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(268:32) ",
    		ctx
    	});

    	return block;
    }

    // (250:28) 
    function create_if_block_10(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "time" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$7, 250, 4, 5188);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_9*/ ctx[90], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_9*/ ctx[91], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_9*/ ctx[92], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_9*/ ctx[93], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_9*/ ctx[94], false, false, false),
    					listen_dev(input, "change", /*change_handler_9*/ ctx[95], false, false, false),
    					listen_dev(input, "input", /*input_handler_9*/ ctx[96], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_6*/ ctx[154])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "time" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(250:28) ",
    		ctx
    	});

    	return block;
    }

    // (232:28) 
    function create_if_block_9(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "date" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$7, 232, 4, 4883);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_8*/ ctx[83], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_8*/ ctx[84], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_8*/ ctx[85], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_8*/ ctx[86], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_8*/ ctx[87], false, false, false),
    					listen_dev(input, "change", /*change_handler_8*/ ctx[88], false, false, false),
    					listen_dev(input, "input", /*input_handler_8*/ ctx[89], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_5*/ ctx[153])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "date" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(232:28) ",
    		ctx
    	});

    	return block;
    }

    // (214:30) 
    function create_if_block_8(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "number" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$7, 214, 4, 4576);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_7*/ ctx[76], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_7*/ ctx[77], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_7*/ ctx[78], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_7*/ ctx[79], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_7*/ ctx[80], false, false, false),
    					listen_dev(input, "change", /*change_handler_7*/ ctx[81], false, false, false),
    					listen_dev(input, "input", /*input_handler_7*/ ctx[82], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_4*/ ctx[152])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "number" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2 && to_number(input.value) !== /*value*/ ctx[1]) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(214:30) ",
    		ctx
    	});

    	return block;
    }

    // (196:27) 
    function create_if_block_7(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "url" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$7, 196, 4, 4270);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_6*/ ctx[69], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_6*/ ctx[70], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_6*/ ctx[71], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_6*/ ctx[72], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_6*/ ctx[73], false, false, false),
    					listen_dev(input, "change", /*change_handler_6*/ ctx[74], false, false, false),
    					listen_dev(input, "input", /*input_handler_6*/ ctx[75], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_3*/ ctx[151])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "url" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(196:27) ",
    		ctx
    	});

    	return block;
    }

    // (178:29) 
    function create_if_block_6(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "radio" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$7, 178, 4, 3965);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_5*/ ctx[62], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_5*/ ctx[63], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_5*/ ctx[64], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_5*/ ctx[65], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_5*/ ctx[66], false, false, false),
    					listen_dev(input, "change", /*change_handler_5*/ ctx[67], false, false, false),
    					listen_dev(input, "input", /*input_handler_5*/ ctx[68], false, false, false),
    					listen_dev(input, "change", /*input_change_handler_2*/ ctx[150])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "radio" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(178:29) ",
    		ctx
    	});

    	return block;
    }

    // (159:32) 
    function create_if_block_5(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "checkbox" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$7, 159, 4, 3636);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			input.checked = /*checked*/ ctx[0];
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_4*/ ctx[55], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_4*/ ctx[56], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_4*/ ctx[57], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_4*/ ctx[58], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_4*/ ctx[59], false, false, false),
    					listen_dev(input, "change", /*change_handler_4*/ ctx[60], false, false, false),
    					listen_dev(input, "input", /*input_handler_4*/ ctx[61], false, false, false),
    					listen_dev(input, "change", /*input_change_handler_1*/ ctx[149])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "checkbox" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*checked*/ 1) {
    				input.checked = /*checked*/ ctx[0];
    			}

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(159:32) ",
    		ctx
    	});

    	return block;
    }

    // (141:28) 
    function create_if_block_4(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "file" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$7, 141, 4, 3327);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_3*/ ctx[48], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_3*/ ctx[49], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_3*/ ctx[50], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_3*/ ctx[51], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_3*/ ctx[52], false, false, false),
    					listen_dev(input, "change", /*change_handler_3*/ ctx[53], false, false, false),
    					listen_dev(input, "input", /*input_handler_3*/ ctx[54], false, false, false),
    					listen_dev(input, "change", /*input_change_handler*/ ctx[148])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "file" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(141:28) ",
    		ctx
    	});

    	return block;
    }

    // (123:29) 
    function create_if_block_3$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "email" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$7, 123, 4, 3021);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_2*/ ctx[41], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_2*/ ctx[42], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_2*/ ctx[43], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_2*/ ctx[44], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_2*/ ctx[45], false, false, false),
    					listen_dev(input, "change", /*change_handler_2*/ ctx[46], false, false, false),
    					listen_dev(input, "input", /*input_handler_2*/ ctx[47], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_2*/ ctx[147])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "email" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(123:29) ",
    		ctx
    	});

    	return block;
    }

    // (105:32) 
    function create_if_block_2$2(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "password" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$7, 105, 4, 2711);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_1*/ ctx[34], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_1*/ ctx[35], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_1*/ ctx[36], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_1*/ ctx[37], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_1*/ ctx[38], false, false, false),
    					listen_dev(input, "change", /*change_handler_1*/ ctx[39], false, false, false),
    					listen_dev(input, "input", /*input_handler_1*/ ctx[40], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_1*/ ctx[146])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "password" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(105:32) ",
    		ctx
    	});

    	return block;
    }

    // (87:2) {#if type === 'text'}
    function create_if_block_1$3(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "text" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$7, 87, 4, 2402);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler*/ ctx[27], false, false, false),
    					listen_dev(input, "focus", /*focus_handler*/ ctx[28], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler*/ ctx[29], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler*/ ctx[30], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler*/ ctx[31], false, false, false),
    					listen_dev(input, "change", /*change_handler*/ ctx[32], false, false, false),
    					listen_dev(input, "input", /*input_handler*/ ctx[33], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[145])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "text" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(87:2) {#if type === 'text'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$7, create_if_block_15, create_if_block_16, create_if_block_17];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tag*/ ctx[11] === "input") return 0;
    		if (/*tag*/ ctx[11] === "textarea") return 1;
    		if (/*tag*/ ctx[11] === "select" && !/*multiple*/ ctx[5]) return 2;
    		if (/*tag*/ ctx[11] === "select" && /*multiple*/ ctx[5]) return 3;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { type = "text" } = $$props;
    	let { size = undefined } = $$props;
    	let { bsSize = undefined } = $$props;
    	let { color = undefined } = $$props;
    	let { checked = false } = $$props;
    	let { valid = false } = $$props;
    	let { invalid = false } = $$props;
    	let { plaintext = false } = $$props;
    	let { addon = false } = $$props;
    	let { value = "" } = $$props;
    	let { files = "" } = $$props;
    	let { readonly } = $$props;
    	let { multiple = false } = $$props;
    	let { id = "" } = $$props;
    	let { name = "" } = $$props;
    	let { placeholder = "" } = $$props;
    	let { disabled = false } = $$props;

    	// eslint-disable-next-line no-unused-vars
    	const { type: _omitType, color: _omitColor, ...props } = clean($$props);

    	let classes;
    	let tag;

    	const handleInput = event => {
    		$$invalidate(1, value = event.target.value);
    	};

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Input", $$slots, ['default']);

    	function blur_handler(event) {
    		bubble($$self, event);
    	}

    	function focus_handler(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler(event) {
    		bubble($$self, event);
    	}

    	function change_handler(event) {
    		bubble($$self, event);
    	}

    	function input_handler(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_1(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_1(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_1(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_1(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_1(event) {
    		bubble($$self, event);
    	}

    	function change_handler_1(event) {
    		bubble($$self, event);
    	}

    	function input_handler_1(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_2(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_2(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_2(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_2(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_2(event) {
    		bubble($$self, event);
    	}

    	function change_handler_2(event) {
    		bubble($$self, event);
    	}

    	function input_handler_2(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_3(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_3(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_3(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_3(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_3(event) {
    		bubble($$self, event);
    	}

    	function change_handler_3(event) {
    		bubble($$self, event);
    	}

    	function input_handler_3(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_4(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_4(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_4(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_4(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_4(event) {
    		bubble($$self, event);
    	}

    	function change_handler_4(event) {
    		bubble($$self, event);
    	}

    	function input_handler_4(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_5(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_5(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_5(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_5(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_5(event) {
    		bubble($$self, event);
    	}

    	function change_handler_5(event) {
    		bubble($$self, event);
    	}

    	function input_handler_5(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_6(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_6(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_6(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_6(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_6(event) {
    		bubble($$self, event);
    	}

    	function change_handler_6(event) {
    		bubble($$self, event);
    	}

    	function input_handler_6(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_7(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_7(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_7(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_7(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_7(event) {
    		bubble($$self, event);
    	}

    	function change_handler_7(event) {
    		bubble($$self, event);
    	}

    	function input_handler_7(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_8(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_8(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_8(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_8(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_8(event) {
    		bubble($$self, event);
    	}

    	function change_handler_8(event) {
    		bubble($$self, event);
    	}

    	function input_handler_8(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_9(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_9(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_9(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_9(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_9(event) {
    		bubble($$self, event);
    	}

    	function change_handler_9(event) {
    		bubble($$self, event);
    	}

    	function input_handler_9(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_10(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_10(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_10(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_10(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_10(event) {
    		bubble($$self, event);
    	}

    	function change_handler_10(event) {
    		bubble($$self, event);
    	}

    	function input_handler_10(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_11(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_11(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_11(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_11(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_11(event) {
    		bubble($$self, event);
    	}

    	function change_handler_11(event) {
    		bubble($$self, event);
    	}

    	function input_handler_11(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_12(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_12(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_12(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_12(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_12(event) {
    		bubble($$self, event);
    	}

    	function change_handler_12(event) {
    		bubble($$self, event);
    	}

    	function input_handler_12(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_13(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_13(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_13(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_13(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_13(event) {
    		bubble($$self, event);
    	}

    	function change_handler_13(event) {
    		bubble($$self, event);
    	}

    	function input_handler_13(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_14(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_14(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_14(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_14(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_14(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_15(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_15(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_15(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_15(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_15(event) {
    		bubble($$self, event);
    	}

    	function change_handler_14(event) {
    		bubble($$self, event);
    	}

    	function input_handler_14(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_16(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_16(event) {
    		bubble($$self, event);
    	}

    	function change_handler_15(event) {
    		bubble($$self, event);
    	}

    	function input_handler_15(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_17(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_17(event) {
    		bubble($$self, event);
    	}

    	function change_handler_16(event) {
    		bubble($$self, event);
    	}

    	function input_handler_16(event) {
    		bubble($$self, event);
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_1() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_2() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_change_handler() {
    		files = this.files;
    		$$invalidate(2, files);
    	}

    	function input_change_handler_1() {
    		checked = this.checked;
    		value = this.value;
    		$$invalidate(0, checked);
    		$$invalidate(1, value);
    	}

    	function input_change_handler_2() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_3() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_4() {
    		value = to_number(this.value);
    		$$invalidate(1, value);
    	}

    	function input_input_handler_5() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_6() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_7() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_8() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_change_input_handler() {
    		value = to_number(this.value);
    		$$invalidate(1, value);
    	}

    	function input_input_handler_9() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function textarea_input_handler() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function select_change_handler() {
    		value = select_value(this);
    		$$invalidate(1, value);
    	}

    	function select_change_handler_1() {
    		value = select_multiple_value(this);
    		$$invalidate(1, value);
    	}

    	$$self.$set = $$new_props => {
    		$$invalidate(24, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(16, className = $$new_props.class);
    		if ("type" in $$new_props) $$invalidate(3, type = $$new_props.type);
    		if ("size" in $$new_props) $$invalidate(14, size = $$new_props.size);
    		if ("bsSize" in $$new_props) $$invalidate(15, bsSize = $$new_props.bsSize);
    		if ("color" in $$new_props) $$invalidate(17, color = $$new_props.color);
    		if ("checked" in $$new_props) $$invalidate(0, checked = $$new_props.checked);
    		if ("valid" in $$new_props) $$invalidate(18, valid = $$new_props.valid);
    		if ("invalid" in $$new_props) $$invalidate(19, invalid = $$new_props.invalid);
    		if ("plaintext" in $$new_props) $$invalidate(20, plaintext = $$new_props.plaintext);
    		if ("addon" in $$new_props) $$invalidate(21, addon = $$new_props.addon);
    		if ("value" in $$new_props) $$invalidate(1, value = $$new_props.value);
    		if ("files" in $$new_props) $$invalidate(2, files = $$new_props.files);
    		if ("readonly" in $$new_props) $$invalidate(4, readonly = $$new_props.readonly);
    		if ("multiple" in $$new_props) $$invalidate(5, multiple = $$new_props.multiple);
    		if ("id" in $$new_props) $$invalidate(6, id = $$new_props.id);
    		if ("name" in $$new_props) $$invalidate(7, name = $$new_props.name);
    		if ("placeholder" in $$new_props) $$invalidate(8, placeholder = $$new_props.placeholder);
    		if ("disabled" in $$new_props) $$invalidate(9, disabled = $$new_props.disabled);
    		if ("$$scope" in $$new_props) $$invalidate(25, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		clsx,
    		clean,
    		className,
    		type,
    		size,
    		bsSize,
    		color,
    		checked,
    		valid,
    		invalid,
    		plaintext,
    		addon,
    		value,
    		files,
    		readonly,
    		multiple,
    		id,
    		name,
    		placeholder,
    		disabled,
    		_omitType,
    		_omitColor,
    		props,
    		classes,
    		tag,
    		handleInput
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(24, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(16, className = $$new_props.className);
    		if ("type" in $$props) $$invalidate(3, type = $$new_props.type);
    		if ("size" in $$props) $$invalidate(14, size = $$new_props.size);
    		if ("bsSize" in $$props) $$invalidate(15, bsSize = $$new_props.bsSize);
    		if ("color" in $$props) $$invalidate(17, color = $$new_props.color);
    		if ("checked" in $$props) $$invalidate(0, checked = $$new_props.checked);
    		if ("valid" in $$props) $$invalidate(18, valid = $$new_props.valid);
    		if ("invalid" in $$props) $$invalidate(19, invalid = $$new_props.invalid);
    		if ("plaintext" in $$props) $$invalidate(20, plaintext = $$new_props.plaintext);
    		if ("addon" in $$props) $$invalidate(21, addon = $$new_props.addon);
    		if ("value" in $$props) $$invalidate(1, value = $$new_props.value);
    		if ("files" in $$props) $$invalidate(2, files = $$new_props.files);
    		if ("readonly" in $$props) $$invalidate(4, readonly = $$new_props.readonly);
    		if ("multiple" in $$props) $$invalidate(5, multiple = $$new_props.multiple);
    		if ("id" in $$props) $$invalidate(6, id = $$new_props.id);
    		if ("name" in $$props) $$invalidate(7, name = $$new_props.name);
    		if ("placeholder" in $$props) $$invalidate(8, placeholder = $$new_props.placeholder);
    		if ("disabled" in $$props) $$invalidate(9, disabled = $$new_props.disabled);
    		if ("classes" in $$props) $$invalidate(10, classes = $$new_props.classes);
    		if ("tag" in $$props) $$invalidate(11, tag = $$new_props.tag);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*type, plaintext, addon, color, size, className, invalid, valid, bsSize*/ 4177928) {
    			 {
    				const checkInput = ["radio", "checkbox"].indexOf(type) > -1;
    				const isNotaNumber = new RegExp("\\D", "g");
    				const fileInput = type === "file";
    				const textareaInput = type === "textarea";
    				const rangeInput = type === "range";
    				const selectInput = type === "select";
    				const buttonInput = type === "button" || type === "reset" || type === "submit";
    				const unsupportedInput = type === "hidden" || type === "image";
    				$$invalidate(11, tag = selectInput || textareaInput ? type : "input");
    				let formControlClass = "form-control";

    				if (plaintext) {
    					formControlClass = `${formControlClass}-plaintext`;
    					$$invalidate(11, tag = "input");
    				} else if (fileInput) {
    					formControlClass = `${formControlClass}-file`;
    				} else if (checkInput) {
    					if (addon) {
    						formControlClass = null;
    					} else {
    						formControlClass = "form-check-input";
    					}
    				} else if (buttonInput) {
    					formControlClass = `btn btn-${color || "secondary"}`;
    				} else if (rangeInput) {
    					formControlClass = "form-control-range";
    				} else if (unsupportedInput) {
    					formControlClass = "";
    				}

    				if (size && isNotaNumber.test(size)) {
    					console.warn("Please use the prop \"bsSize\" instead of the \"size\" to bootstrap's input sizing.");
    					$$invalidate(15, bsSize = size);
    					$$invalidate(14, size = undefined);
    				}

    				$$invalidate(10, classes = clsx(className, invalid && "is-invalid", valid && "is-valid", bsSize ? `form-control-${bsSize}` : false, formControlClass));
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		checked,
    		value,
    		files,
    		type,
    		readonly,
    		multiple,
    		id,
    		name,
    		placeholder,
    		disabled,
    		classes,
    		tag,
    		props,
    		handleInput,
    		size,
    		bsSize,
    		className,
    		color,
    		valid,
    		invalid,
    		plaintext,
    		addon,
    		_omitType,
    		_omitColor,
    		$$props,
    		$$scope,
    		$$slots,
    		blur_handler,
    		focus_handler,
    		keydown_handler,
    		keypress_handler,
    		keyup_handler,
    		change_handler,
    		input_handler,
    		blur_handler_1,
    		focus_handler_1,
    		keydown_handler_1,
    		keypress_handler_1,
    		keyup_handler_1,
    		change_handler_1,
    		input_handler_1,
    		blur_handler_2,
    		focus_handler_2,
    		keydown_handler_2,
    		keypress_handler_2,
    		keyup_handler_2,
    		change_handler_2,
    		input_handler_2,
    		blur_handler_3,
    		focus_handler_3,
    		keydown_handler_3,
    		keypress_handler_3,
    		keyup_handler_3,
    		change_handler_3,
    		input_handler_3,
    		blur_handler_4,
    		focus_handler_4,
    		keydown_handler_4,
    		keypress_handler_4,
    		keyup_handler_4,
    		change_handler_4,
    		input_handler_4,
    		blur_handler_5,
    		focus_handler_5,
    		keydown_handler_5,
    		keypress_handler_5,
    		keyup_handler_5,
    		change_handler_5,
    		input_handler_5,
    		blur_handler_6,
    		focus_handler_6,
    		keydown_handler_6,
    		keypress_handler_6,
    		keyup_handler_6,
    		change_handler_6,
    		input_handler_6,
    		blur_handler_7,
    		focus_handler_7,
    		keydown_handler_7,
    		keypress_handler_7,
    		keyup_handler_7,
    		change_handler_7,
    		input_handler_7,
    		blur_handler_8,
    		focus_handler_8,
    		keydown_handler_8,
    		keypress_handler_8,
    		keyup_handler_8,
    		change_handler_8,
    		input_handler_8,
    		blur_handler_9,
    		focus_handler_9,
    		keydown_handler_9,
    		keypress_handler_9,
    		keyup_handler_9,
    		change_handler_9,
    		input_handler_9,
    		blur_handler_10,
    		focus_handler_10,
    		keydown_handler_10,
    		keypress_handler_10,
    		keyup_handler_10,
    		change_handler_10,
    		input_handler_10,
    		blur_handler_11,
    		focus_handler_11,
    		keydown_handler_11,
    		keypress_handler_11,
    		keyup_handler_11,
    		change_handler_11,
    		input_handler_11,
    		blur_handler_12,
    		focus_handler_12,
    		keydown_handler_12,
    		keypress_handler_12,
    		keyup_handler_12,
    		change_handler_12,
    		input_handler_12,
    		blur_handler_13,
    		focus_handler_13,
    		keydown_handler_13,
    		keypress_handler_13,
    		keyup_handler_13,
    		change_handler_13,
    		input_handler_13,
    		blur_handler_14,
    		focus_handler_14,
    		keydown_handler_14,
    		keypress_handler_14,
    		keyup_handler_14,
    		blur_handler_15,
    		focus_handler_15,
    		keydown_handler_15,
    		keypress_handler_15,
    		keyup_handler_15,
    		change_handler_14,
    		input_handler_14,
    		blur_handler_16,
    		focus_handler_16,
    		change_handler_15,
    		input_handler_15,
    		blur_handler_17,
    		focus_handler_17,
    		change_handler_16,
    		input_handler_16,
    		input_input_handler,
    		input_input_handler_1,
    		input_input_handler_2,
    		input_change_handler,
    		input_change_handler_1,
    		input_change_handler_2,
    		input_input_handler_3,
    		input_input_handler_4,
    		input_input_handler_5,
    		input_input_handler_6,
    		input_input_handler_7,
    		input_input_handler_8,
    		input_change_input_handler,
    		input_input_handler_9,
    		textarea_input_handler,
    		select_change_handler,
    		select_change_handler_1
    	];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$8,
    			create_fragment$8,
    			safe_not_equal,
    			{
    				class: 16,
    				type: 3,
    				size: 14,
    				bsSize: 15,
    				color: 17,
    				checked: 0,
    				valid: 18,
    				invalid: 19,
    				plaintext: 20,
    				addon: 21,
    				value: 1,
    				files: 2,
    				readonly: 4,
    				multiple: 5,
    				id: 6,
    				name: 7,
    				placeholder: 8,
    				disabled: 9
    			},
    			[-1, -1, -1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*readonly*/ ctx[4] === undefined && !("readonly" in props)) {
    			console_1$1.warn("<Input> was created without expected prop 'readonly'");
    		}
    	}

    	get class() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bsSize() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bsSize(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checked() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valid() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valid(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get plaintext() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set plaintext(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get addon() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set addon(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get files() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set files(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readonly() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readonly(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiple() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiple(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Label.svelte generated by Svelte v3.23.0 */
    const file$8 = "node_modules\\sveltestrap\\src\\Label.svelte";

    function create_fragment$9(ctx) {
    	let label;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);

    	let label_levels = [
    		/*props*/ ctx[3],
    		{ id: /*id*/ ctx[1] },
    		{ class: /*classes*/ ctx[2] },
    		{ for: /*fore*/ ctx[0] }
    	];

    	let label_data = {};

    	for (let i = 0; i < label_levels.length; i += 1) {
    		label_data = assign(label_data, label_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			label = element("label");
    			if (default_slot) default_slot.c();
    			set_attributes(label, label_data);
    			add_location(label, file$8, 73, 0, 1685);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);

    			if (default_slot) {
    				default_slot.m(label, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 131072) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[17], dirty, null, null);
    				}
    			}

    			set_attributes(label, label_data = get_spread_update(label_levels, [
    				dirty & /*props*/ 8 && /*props*/ ctx[3],
    				dirty & /*id*/ 2 && { id: /*id*/ ctx[1] },
    				dirty & /*classes*/ 4 && { class: /*classes*/ ctx[2] },
    				dirty & /*fore*/ 1 && { for: /*fore*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	const props = clean($$props);
    	let { hidden = false } = $$props;
    	let { check = false } = $$props;
    	let { size = "" } = $$props;
    	let { for: fore } = $$props;
    	let { id = "" } = $$props;
    	let { xs = "" } = $$props;
    	let { sm = "" } = $$props;
    	let { md = "" } = $$props;
    	let { lg = "" } = $$props;
    	let { xl = "" } = $$props;
    	const colWidths = { xs, sm, md, lg, xl };
    	let { widths = Object.keys(colWidths) } = $$props;
    	const colClasses = [];

    	widths.forEach(colWidth => {
    		let columnProp = $$props[colWidth];

    		if (!columnProp && columnProp !== "") {
    			return;
    		}

    		const isXs = colWidth === "xs";
    		let colClass;

    		if (isObject(columnProp)) {
    			const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
    			colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);

    			colClasses.push(clsx({
    				[colClass]: columnProp.size || columnProp.size === "",
    				[`order${colSizeInterfix}${columnProp.order}`]: columnProp.order || columnProp.order === 0,
    				[`offset${colSizeInterfix}${columnProp.offset}`]: columnProp.offset || columnProp.offset === 0
    			}));
    		} else {
    			colClass = getColumnSizeClass(isXs, colWidth, columnProp);
    			colClasses.push(colClass);
    		}
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Label", $$slots, ['default']);

    	$$self.$set = $$new_props => {
    		$$invalidate(16, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ("hidden" in $$new_props) $$invalidate(5, hidden = $$new_props.hidden);
    		if ("check" in $$new_props) $$invalidate(6, check = $$new_props.check);
    		if ("size" in $$new_props) $$invalidate(7, size = $$new_props.size);
    		if ("for" in $$new_props) $$invalidate(0, fore = $$new_props.for);
    		if ("id" in $$new_props) $$invalidate(1, id = $$new_props.id);
    		if ("xs" in $$new_props) $$invalidate(8, xs = $$new_props.xs);
    		if ("sm" in $$new_props) $$invalidate(9, sm = $$new_props.sm);
    		if ("md" in $$new_props) $$invalidate(10, md = $$new_props.md);
    		if ("lg" in $$new_props) $$invalidate(11, lg = $$new_props.lg);
    		if ("xl" in $$new_props) $$invalidate(12, xl = $$new_props.xl);
    		if ("widths" in $$new_props) $$invalidate(13, widths = $$new_props.widths);
    		if ("$$scope" in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		clsx,
    		clean,
    		getColumnSizeClass,
    		isObject,
    		className,
    		props,
    		hidden,
    		check,
    		size,
    		fore,
    		id,
    		xs,
    		sm,
    		md,
    		lg,
    		xl,
    		colWidths,
    		widths,
    		colClasses,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(16, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
    		if ("hidden" in $$props) $$invalidate(5, hidden = $$new_props.hidden);
    		if ("check" in $$props) $$invalidate(6, check = $$new_props.check);
    		if ("size" in $$props) $$invalidate(7, size = $$new_props.size);
    		if ("fore" in $$props) $$invalidate(0, fore = $$new_props.fore);
    		if ("id" in $$props) $$invalidate(1, id = $$new_props.id);
    		if ("xs" in $$props) $$invalidate(8, xs = $$new_props.xs);
    		if ("sm" in $$props) $$invalidate(9, sm = $$new_props.sm);
    		if ("md" in $$props) $$invalidate(10, md = $$new_props.md);
    		if ("lg" in $$props) $$invalidate(11, lg = $$new_props.lg);
    		if ("xl" in $$props) $$invalidate(12, xl = $$new_props.xl);
    		if ("widths" in $$props) $$invalidate(13, widths = $$new_props.widths);
    		if ("classes" in $$props) $$invalidate(2, classes = $$new_props.classes);
    	};

    	let classes;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, hidden, check, size*/ 240) {
    			 $$invalidate(2, classes = clsx(className, hidden ? "sr-only" : false, check ? "form-check-label" : false, size ? `col-form-label-${size}` : false, colClasses, colClasses.length ? "col-form-label" : false));
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		fore,
    		id,
    		classes,
    		props,
    		className,
    		hidden,
    		check,
    		size,
    		xs,
    		sm,
    		md,
    		lg,
    		xl,
    		widths,
    		colWidths,
    		colClasses,
    		$$props,
    		$$scope,
    		$$slots
    	];
    }

    class Label extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			class: 4,
    			hidden: 5,
    			check: 6,
    			size: 7,
    			for: 0,
    			id: 1,
    			xs: 8,
    			sm: 9,
    			md: 10,
    			lg: 11,
    			xl: 12,
    			widths: 13
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Label",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*fore*/ ctx[0] === undefined && !("for" in props)) {
    			console.warn("<Label> was created without expected prop 'for'");
    		}
    	}

    	get class() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hidden() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hidden(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get check() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set check(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get for() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set for(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xs() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xs(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sm() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sm(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get md() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set md(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lg() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lg(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xl() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xl(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get widths() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set widths(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Pagination.svelte generated by Svelte v3.23.0 */
    const file$9 = "node_modules\\sveltestrap\\src\\Pagination.svelte";

    function create_fragment$a(ctx) {
    	let nav;
    	let ul;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let nav_levels = [
    		/*props*/ ctx[3],
    		{ class: /*classes*/ ctx[1] },
    		{ "aria-label": /*ariaLabel*/ ctx[0] }
    	];

    	let nav_data = {};

    	for (let i = 0; i < nav_levels.length; i += 1) {
    		nav_data = assign(nav_data, nav_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			attr_dev(ul, "class", /*listClasses*/ ctx[2]);
    			add_location(ul, file$9, 20, 2, 455);
    			set_attributes(nav, nav_data);
    			add_location(nav, file$9, 19, 0, 397);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, ul);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 256) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*listClasses*/ 4) {
    				attr_dev(ul, "class", /*listClasses*/ ctx[2]);
    			}

    			set_attributes(nav, nav_data = get_spread_update(nav_levels, [
    				dirty & /*props*/ 8 && /*props*/ ctx[3],
    				dirty & /*classes*/ 2 && { class: /*classes*/ ctx[1] },
    				dirty & /*ariaLabel*/ 1 && { "aria-label": /*ariaLabel*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { listClassName = "" } = $$props;
    	let { size = "" } = $$props;
    	let { ariaLabel = "pagination" } = $$props;
    	const props = clean($$props);
    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Pagination", $$slots, ['default']);

    	$$self.$set = $$new_props => {
    		$$invalidate(7, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ("listClassName" in $$new_props) $$invalidate(5, listClassName = $$new_props.listClassName);
    		if ("size" in $$new_props) $$invalidate(6, size = $$new_props.size);
    		if ("ariaLabel" in $$new_props) $$invalidate(0, ariaLabel = $$new_props.ariaLabel);
    		if ("$$scope" in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		clsx,
    		clean,
    		className,
    		listClassName,
    		size,
    		ariaLabel,
    		props,
    		classes,
    		listClasses
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(7, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
    		if ("listClassName" in $$props) $$invalidate(5, listClassName = $$new_props.listClassName);
    		if ("size" in $$props) $$invalidate(6, size = $$new_props.size);
    		if ("ariaLabel" in $$props) $$invalidate(0, ariaLabel = $$new_props.ariaLabel);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    		if ("listClasses" in $$props) $$invalidate(2, listClasses = $$new_props.listClasses);
    	};

    	let classes;
    	let listClasses;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 16) {
    			 $$invalidate(1, classes = clsx(className));
    		}

    		if ($$self.$$.dirty & /*listClassName, size*/ 96) {
    			 $$invalidate(2, listClasses = clsx(listClassName, "pagination", { [`pagination-${size}`]: !!size }));
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		ariaLabel,
    		classes,
    		listClasses,
    		props,
    		className,
    		listClassName,
    		size,
    		$$props,
    		$$scope,
    		$$slots
    	];
    }

    class Pagination extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			class: 4,
    			listClassName: 5,
    			size: 6,
    			ariaLabel: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pagination",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get class() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listClassName() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listClassName(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\PaginationItem.svelte generated by Svelte v3.23.0 */
    const file$a = "node_modules\\sveltestrap\\src\\PaginationItem.svelte";

    function create_fragment$b(ctx) {
    	let li;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
    	let li_levels = [/*props*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (default_slot) default_slot.c();
    			set_attributes(li, li_data);
    			add_location(li, file$a, 17, 0, 309);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (default_slot) {
    				default_slot.m(li, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 64) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[6], dirty, null, null);
    				}
    			}

    			set_attributes(li, li_data = get_spread_update(li_levels, [
    				dirty & /*props*/ 2 && /*props*/ ctx[1],
    				dirty & /*classes*/ 1 && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { active = false } = $$props;
    	let { disabled = false } = $$props;
    	const props = clean($$props);
    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("PaginationItem", $$slots, ['default']);

    	$$self.$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("active" in $$new_props) $$invalidate(3, active = $$new_props.active);
    		if ("disabled" in $$new_props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ("$$scope" in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		clsx,
    		clean,
    		className,
    		active,
    		disabled,
    		props,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("active" in $$props) $$invalidate(3, active = $$new_props.active);
    		if ("disabled" in $$props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	let classes;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, active, disabled*/ 28) {
    			 $$invalidate(0, classes = clsx(className, "page-item", { active, disabled }));
    		}
    	};

    	$$props = exclude_internal_props($$props);
    	return [classes, props, className, active, disabled, $$props, $$scope, $$slots];
    }

    class PaginationItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { class: 2, active: 3, disabled: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaginationItem",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get class() {
    		throw new Error("<PaginationItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<PaginationItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<PaginationItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<PaginationItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<PaginationItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<PaginationItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\PaginationLink.svelte generated by Svelte v3.23.0 */
    const file$b = "node_modules\\sveltestrap\\src\\PaginationLink.svelte";

    // (50:2) {:else}
    function create_else_block$8(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8192) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[13], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(50:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (45:2) {#if previous || next || first || last}
    function create_if_block$8(ctx) {
    	let span0;
    	let t0;
    	let span1;
    	let t1;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);
    	const default_slot_or_fallback = default_slot || fallback_block$2(ctx);

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			t0 = space();
    			span1 = element("span");
    			t1 = text(/*realLabel*/ ctx[7]);
    			attr_dev(span0, "aria-hidden", "true");
    			add_location(span0, file$b, 45, 4, 995);
    			attr_dev(span1, "class", "sr-only");
    			add_location(span1, file$b, 48, 4, 1073);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(span0, null);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, span1, anchor);
    			append_dev(span1, t1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8192) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[13], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*defaultCaret*/ 32) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			if (!current || dirty & /*realLabel*/ 128) set_data_dev(t1, /*realLabel*/ ctx[7]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span0);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(span1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(45:2) {#if previous || next || first || last}",
    		ctx
    	});

    	return block;
    }

    // (47:12)  
    function fallback_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*defaultCaret*/ ctx[5]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*defaultCaret*/ 32) set_data_dev(t, /*defaultCaret*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$2.name,
    		type: "fallback",
    		source: "(47:12)  ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let a;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$8, create_else_block$8];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*previous*/ ctx[1] || /*next*/ ctx[0] || /*first*/ ctx[2] || /*last*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let a_levels = [/*props*/ ctx[8], { class: /*classes*/ ctx[6] }, { href: /*href*/ ctx[4] }];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if_block.c();
    			set_attributes(a, a_data);
    			add_location(a, file$b, 43, 0, 902);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			if_blocks[current_block_type_index].m(a, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[15], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(a, null);
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*props*/ 256 && /*props*/ ctx[8],
    				dirty & /*classes*/ 64 && { class: /*classes*/ ctx[6] },
    				dirty & /*href*/ 16 && { href: /*href*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { next = false } = $$props;
    	let { previous = false } = $$props;
    	let { first = false } = $$props;
    	let { last = false } = $$props;
    	let { ariaLabel = "" } = $$props;
    	let { href = "" } = $$props;
    	const props = clean($$props);
    	let defaultAriaLabel;
    	let defaultCaret;
    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("PaginationLink", $$slots, ['default']);

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$new_props => {
    		$$invalidate(12, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(9, className = $$new_props.class);
    		if ("next" in $$new_props) $$invalidate(0, next = $$new_props.next);
    		if ("previous" in $$new_props) $$invalidate(1, previous = $$new_props.previous);
    		if ("first" in $$new_props) $$invalidate(2, first = $$new_props.first);
    		if ("last" in $$new_props) $$invalidate(3, last = $$new_props.last);
    		if ("ariaLabel" in $$new_props) $$invalidate(10, ariaLabel = $$new_props.ariaLabel);
    		if ("href" in $$new_props) $$invalidate(4, href = $$new_props.href);
    		if ("$$scope" in $$new_props) $$invalidate(13, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		clsx,
    		clean,
    		className,
    		next,
    		previous,
    		first,
    		last,
    		ariaLabel,
    		href,
    		props,
    		defaultAriaLabel,
    		defaultCaret,
    		classes,
    		realLabel
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(12, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(9, className = $$new_props.className);
    		if ("next" in $$props) $$invalidate(0, next = $$new_props.next);
    		if ("previous" in $$props) $$invalidate(1, previous = $$new_props.previous);
    		if ("first" in $$props) $$invalidate(2, first = $$new_props.first);
    		if ("last" in $$props) $$invalidate(3, last = $$new_props.last);
    		if ("ariaLabel" in $$props) $$invalidate(10, ariaLabel = $$new_props.ariaLabel);
    		if ("href" in $$props) $$invalidate(4, href = $$new_props.href);
    		if ("defaultAriaLabel" in $$props) $$invalidate(11, defaultAriaLabel = $$new_props.defaultAriaLabel);
    		if ("defaultCaret" in $$props) $$invalidate(5, defaultCaret = $$new_props.defaultCaret);
    		if ("classes" in $$props) $$invalidate(6, classes = $$new_props.classes);
    		if ("realLabel" in $$props) $$invalidate(7, realLabel = $$new_props.realLabel);
    	};

    	let classes;
    	let realLabel;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 512) {
    			 $$invalidate(6, classes = clsx(className, "page-link"));
    		}

    		if ($$self.$$.dirty & /*previous, next, first, last*/ 15) {
    			 if (previous) {
    				$$invalidate(11, defaultAriaLabel = "Previous");
    			} else if (next) {
    				$$invalidate(11, defaultAriaLabel = "Next");
    			} else if (first) {
    				$$invalidate(11, defaultAriaLabel = "First");
    			} else if (last) {
    				$$invalidate(11, defaultAriaLabel = "Last");
    			}
    		}

    		if ($$self.$$.dirty & /*ariaLabel, defaultAriaLabel*/ 3072) {
    			 $$invalidate(7, realLabel = ariaLabel || defaultAriaLabel);
    		}

    		if ($$self.$$.dirty & /*previous, next, first, last*/ 15) {
    			 if (previous) {
    				$$invalidate(5, defaultCaret = "‹");
    			} else if (next) {
    				$$invalidate(5, defaultCaret = "›");
    			} else if (first) {
    				$$invalidate(5, defaultCaret = "«");
    			} else if (last) {
    				$$invalidate(5, defaultCaret = "»");
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		next,
    		previous,
    		first,
    		last,
    		href,
    		defaultCaret,
    		classes,
    		realLabel,
    		props,
    		className,
    		ariaLabel,
    		defaultAriaLabel,
    		$$props,
    		$$scope,
    		$$slots,
    		click_handler
    	];
    }

    class PaginationLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			class: 9,
    			next: 0,
    			previous: 1,
    			first: 2,
    			last: 3,
    			ariaLabel: 10,
    			href: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaginationLink",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get class() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get next() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set next(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get previous() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set previous(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get first() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set first(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get last() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set last(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\Home.svelte generated by Svelte v3.23.0 */
    const file$c = "src\\front\\Home.svelte";

    // (16:3) <Button type="button" color="info" onclick="window.location.href='#/fires-stats'">
    function create_default_slot_12(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("API de estadísticas de incendios en España");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(16:3) <Button type=\\\"button\\\" color=\\\"info\\\" onclick=\\\"window.location.href='#/fires-stats'\\\">",
    		ctx
    	});

    	return block;
    }

    // (18:3) <Button type="button" color="info" onclick="window.location.href='#/cigarretes-sales'">
    function create_default_slot_11(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("API de estadísticas de venta de tabaco en España");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(18:3) <Button type=\\\"button\\\" color=\\\"info\\\" onclick=\\\"window.location.href='#/cigarretes-sales'\\\">",
    		ctx
    	});

    	return block;
    }

    // (20:3) <Button type="button" color="info" onclick="window.location.href='#/offworks-stats'">
    function create_default_slot_10(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("API de bajas laborales en España");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(20:3) <Button type=\\\"button\\\" color=\\\"info\\\" onclick=\\\"window.location.href='#/offworks-stats'\\\">",
    		ctx
    	});

    	return block;
    }

    // (25:6) <DropdownToggle color="primary" outline caret>
    function create_default_slot_9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Incendios Forestales en España");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(25:6) <DropdownToggle color=\\\"primary\\\" outline caret>",
    		ctx
    	});

    	return block;
    }

    // (27:7) <DropdownItem href="#/graph-highchart">
    function create_default_slot_8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("HighChart");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(27:7) <DropdownItem href=\\\"#/graph-highchart\\\">",
    		ctx
    	});

    	return block;
    }

    // (28:7) <DropdownItem href="#/graph-chartjs">
    function create_default_slot_7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Chart.js");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(28:7) <DropdownItem href=\\\"#/graph-chartjs\\\">",
    		ctx
    	});

    	return block;
    }

    // (26:6) <DropdownMenu>
    function create_default_slot_6(ctx) {
    	let t;
    	let current;

    	const dropdownitem0 = new DropdownItem({
    			props: {
    				href: "#/graph-highchart",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const dropdownitem1 = new DropdownItem({
    			props: {
    				href: "#/graph-chartjs",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dropdownitem0.$$.fragment);
    			t = space();
    			create_component(dropdownitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				dropdownitem1_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem1.$set(dropdownitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdownitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(dropdownitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(26:6) <DropdownMenu>",
    		ctx
    	});

    	return block;
    }

    // (24:5) <Dropdown {isOpen} toggle={() => (isOpen = !isOpen)}>
    function create_default_slot_5(ctx) {
    	let t;
    	let current;

    	const dropdowntoggle = new DropdownToggle({
    			props: {
    				color: "primary",
    				outline: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const dropdownmenu = new DropdownMenu({
    			props: {
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dropdowntoggle.$$.fragment);
    			t = space();
    			create_component(dropdownmenu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				dropdownmenu_changes.$$scope = { dirty, ctx };
    			}

    			dropdownmenu.$set(dropdownmenu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdowntoggle.$$.fragment, local);
    			transition_in(dropdownmenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdowntoggle.$$.fragment, local);
    			transition_out(dropdownmenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdowntoggle, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(dropdownmenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(24:5) <Dropdown {isOpen} toggle={() => (isOpen = !isOpen)}>",
    		ctx
    	});

    	return block;
    }

    // (34:3) <Button type="button" color="white" style="color:rgb(40, 83, 53);border-color:brown;margin-top: 5%;" onclick="window.location.href='#/graph-offworks-stats'">
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Grafica HighChart de bajas laborales en España");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(34:3) <Button type=\\\"button\\\" color=\\\"white\\\" style=\\\"color:rgb(40, 83, 53);border-color:brown;margin-top: 5%;\\\" onclick=\\\"window.location.href='#/graph-offworks-stats'\\\">",
    		ctx
    	});

    	return block;
    }

    // (35:3) <Button type="button" color="white" style="color:rgb(40, 83, 53);border-color:brown;" onclick="window.location.href='#/Rgraph-offworks-stats'">
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Grafica Rgraph de bajas laborales en España");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(35:3) <Button type=\\\"button\\\" color=\\\"white\\\" style=\\\"color:rgb(40, 83, 53);border-color:brown;\\\" onclick=\\\"window.location.href='#/Rgraph-offworks-stats'\\\">",
    		ctx
    	});

    	return block;
    }

    // (42:3) <Button type="button" color="info" onclick="window.location.href='#/fires-stats-integrations/integrations'">
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Integraciones Fires Stats");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(42:3) <Button type=\\\"button\\\" color=\\\"info\\\" onclick=\\\"window.location.href='#/fires-stats-integrations/integrations'\\\">",
    		ctx
    	});

    	return block;
    }

    // (43:3) <Button type="button" color="info" onclick="window.location.href='#/offworks-stats-integrations/integrations'">
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Integraciones Offworks Stats");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(43:3) <Button type=\\\"button\\\" color=\\\"info\\\" onclick=\\\"window.location.href='#/offworks-stats-integrations/integrations'\\\">",
    		ctx
    	});

    	return block;
    }

    // (47:3) <Button type="button" color="warning" onclick="window.location.href='#/analytics'">
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Estadística Grupal");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(47:3) <Button type=\\\"button\\\" color=\\\"warning\\\" onclick=\\\"window.location.href='#/analytics'\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let h40;
    	let t1;
    	let p0;
    	let t2;
    	let p1;
    	let t3;
    	let p2;
    	let t4;
    	let h41;
    	let t6;
    	let td;
    	let t7;
    	let p3;
    	let t8;
    	let p4;
    	let t9;
    	let h42;
    	let t11;
    	let p5;
    	let t12;
    	let p6;
    	let t13;
    	let h43;
    	let t15;
    	let p7;
    	let current;

    	const button0 = new Button({
    			props: {
    				type: "button",
    				color: "info",
    				onclick: "window.location.href='#/fires-stats'",
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button1 = new Button({
    			props: {
    				type: "button",
    				color: "info",
    				onclick: "window.location.href='#/cigarretes-sales'",
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button2 = new Button({
    			props: {
    				type: "button",
    				color: "info",
    				onclick: "window.location.href='#/offworks-stats'",
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const dropdown = new Dropdown({
    			props: {
    				isOpen: /*isOpen*/ ctx[0],
    				toggle: /*func*/ ctx[1],
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button3 = new Button({
    			props: {
    				type: "button",
    				color: "white",
    				style: "color:rgb(40, 83, 53);border-color:brown;margin-top: 5%;",
    				onclick: "window.location.href='#/graph-offworks-stats'",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button4 = new Button({
    			props: {
    				type: "button",
    				color: "white",
    				style: "color:rgb(40, 83, 53);border-color:brown;",
    				onclick: "window.location.href='#/Rgraph-offworks-stats'",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button5 = new Button({
    			props: {
    				type: "button",
    				color: "info",
    				onclick: "window.location.href='#/fires-stats-integrations/integrations'",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button6 = new Button({
    			props: {
    				type: "button",
    				color: "info",
    				onclick: "window.location.href='#/offworks-stats-integrations/integrations'",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button7 = new Button({
    			props: {
    				type: "button",
    				color: "warning",
    				onclick: "window.location.href='#/analytics'",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h40 = element("h4");
    			h40.textContent = "Tablas de Estadísticas:";
    			t1 = space();
    			p0 = element("p");
    			create_component(button0.$$.fragment);
    			t2 = space();
    			p1 = element("p");
    			create_component(button1.$$.fragment);
    			t3 = space();
    			p2 = element("p");
    			create_component(button2.$$.fragment);
    			t4 = space();
    			h41 = element("h4");
    			h41.textContent = "Gráficos Estadísticos:";
    			t6 = space();
    			td = element("td");
    			create_component(dropdown.$$.fragment);
    			t7 = space();
    			p3 = element("p");
    			create_component(button3.$$.fragment);
    			t8 = space();
    			p4 = element("p");
    			create_component(button4.$$.fragment);
    			t9 = space();
    			h42 = element("h4");
    			h42.textContent = "Integraciones:";
    			t11 = space();
    			p5 = element("p");
    			create_component(button5.$$.fragment);
    			t12 = space();
    			p6 = element("p");
    			create_component(button6.$$.fragment);
    			t13 = space();
    			h43 = element("h4");
    			h43.textContent = "Gráfica Grupal:";
    			t15 = space();
    			p7 = element("p");
    			create_component(button7.$$.fragment);
    			add_location(h40, file$c, 13, 0, 264);
    			add_location(p0, file$c, 15, 0, 300);
    			add_location(p1, file$c, 17, 0, 447);
    			add_location(p2, file$c, 19, 0, 603);
    			add_location(h41, file$c, 21, 0, 742);
    			add_location(td, file$c, 22, 0, 775);
    			add_location(p3, file$c, 33, 0, 1172);
    			add_location(p4, file$c, 34, 0, 1395);
    			add_location(h42, file$c, 39, 0, 1610);
    			add_location(p5, file$c, 41, 0, 1637);
    			add_location(p6, file$c, 42, 0, 1790);
    			add_location(h43, file$c, 44, 0, 1951);
    			add_location(p7, file$c, 46, 0, 1979);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h40, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			mount_component(button0, p0, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p1, anchor);
    			mount_component(button1, p1, null);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, p2, anchor);
    			mount_component(button2, p2, null);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, h41, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, td, anchor);
    			mount_component(dropdown, td, null);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, p3, anchor);
    			mount_component(button3, p3, null);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, p4, anchor);
    			mount_component(button4, p4, null);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, h42, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, p5, anchor);
    			mount_component(button5, p5, null);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, p6, anchor);
    			mount_component(button6, p6, null);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, h43, anchor);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, p7, anchor);
    			mount_component(button7, p7, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    			const dropdown_changes = {};
    			if (dirty & /*isOpen*/ 1) dropdown_changes.isOpen = /*isOpen*/ ctx[0];
    			if (dirty & /*isOpen*/ 1) dropdown_changes.toggle = /*func*/ ctx[1];

    			if (dirty & /*$$scope*/ 4) {
    				dropdown_changes.$$scope = { dirty, ctx };
    			}

    			dropdown.$set(dropdown_changes);
    			const button3_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);
    			const button4_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				button4_changes.$$scope = { dirty, ctx };
    			}

    			button4.$set(button4_changes);
    			const button5_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				button5_changes.$$scope = { dirty, ctx };
    			}

    			button5.$set(button5_changes);
    			const button6_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				button6_changes.$$scope = { dirty, ctx };
    			}

    			button6.$set(button6_changes);
    			const button7_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				button7_changes.$$scope = { dirty, ctx };
    			}

    			button7.$set(button7_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			transition_in(dropdown.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);
    			transition_in(button4.$$.fragment, local);
    			transition_in(button5.$$.fragment, local);
    			transition_in(button6.$$.fragment, local);
    			transition_in(button7.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			transition_out(dropdown.$$.fragment, local);
    			transition_out(button3.$$.fragment, local);
    			transition_out(button4.$$.fragment, local);
    			transition_out(button5.$$.fragment, local);
    			transition_out(button6.$$.fragment, local);
    			transition_out(button7.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h40);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			destroy_component(button0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p1);
    			destroy_component(button1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(p2);
    			destroy_component(button2);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(h41);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(td);
    			destroy_component(dropdown);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(p3);
    			destroy_component(button3);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(p4);
    			destroy_component(button4);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(h42);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(p5);
    			destroy_component(button5);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(p6);
    			destroy_component(button6);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(h43);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(p7);
    			destroy_component(button7);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let isOpen = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Home", $$slots, []);
    	const func = () => $$invalidate(0, isOpen = !isOpen);

    	$$self.$capture_state = () => ({
    		Button,
    		Table,
    		Dropdown,
    		DropdownItem,
    		DropdownMenu,
    		DropdownToggle,
    		isOpen
    	});

    	$$self.$inject_state = $$props => {
    		if ("isOpen" in $$props) $$invalidate(0, isOpen = $$props.isOpen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isOpen, func];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\front\NotFound.svelte generated by Svelte v3.23.0 */

    const file$d = "src\\front\\NotFound.svelte";

    function create_fragment$e(ctx) {
    	let main;

    	const block = {
    		c: function create() {
    			main = element("main");
    			main.textContent = "La página no existe.";
    			add_location(main, file$d, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NotFound> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("NotFound", $$slots, []);
    	return [];
    }

    class NotFound extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotFound",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\front\Fires_Stats_API\FiresStatsTable.svelte generated by Svelte v3.23.0 */

    const { console: console_1$2 } = globals;

    const file$e = "src\\front\\Fires_Stats_API\\FiresStatsTable.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[33] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>   import { onMount }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>   import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (235:2) {:then fires}
    function create_then_block(ctx) {
    	let h3;
    	let t1;
    	let p;
    	let t2;
    	let t3;
    	let t4;
    	let current;

    	const table = new Table({
    			props: {
    				$$slots: { default: [create_default_slot_9$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "API de estadísticas de incendios en España";
    			t1 = space();
    			p = element("p");
    			t2 = text("Página ");
    			t3 = text(/*pagActual*/ ctx[2]);
    			t4 = space();
    			create_component(table.$$.fragment);
    			set_style(h3, "display", "block");
    			set_style(h3, "text-align", "center");
    			add_location(h3, file$e, 235, 2, 5773);
    			add_location(p, file$e, 237, 2, 5871);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			insert_dev(target, t4, anchor);
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*pagActual*/ 4) set_data_dev(t3, /*pagActual*/ ctx[2]);
    			const table_changes = {};

    			if (dirty[0] & /*fires, newFire, isOpen, msgExito, msgError, comunidad, anyo*/ 995 | dirty[1] & /*$$scope*/ 32) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t4);
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(235:2) {:then fires}",
    		ctx
    	});

    	return block;
    }

    // (249:9) <Button color="secondary" outline on:click={busqueda(comunidad,anyo)}>
    function create_default_slot_19(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Buscar ⌕");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19.name,
    		type: "slot",
    		source: "(249:9) <Button color=\\\"secondary\\\" outline on:click={busqueda(comunidad,anyo)}>",
    		ctx
    	});

    	return block;
    }

    // (250:9) {#if msgError}
    function create_if_block_3$2(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Error: ");
    			t1 = text(/*msgError*/ ctx[7]);
    			set_style(p, "color", "red");
    			set_style(p, "border", "solid");
    			set_style(p, "text-align", "center");
    			set_style(p, "width", "50%");
    			set_style(p, "margin", "0 0");
    			add_location(p, file$e, 249, 23, 6286);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*msgError*/ 128) set_data_dev(t1, /*msgError*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(250:9) {#if msgError}",
    		ctx
    	});

    	return block;
    }

    // (251:6) {#if msgExito}
    function create_if_block_2$3(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Exito: ");
    			t1 = text(/*msgExito*/ ctx[8]);
    			set_style(p, "color", "green");
    			set_style(p, "border", "solid");
    			set_style(p, "text-align", "center");
    			add_location(p, file$e, 250, 20, 6418);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*msgExito*/ 256) set_data_dev(t1, /*msgExito*/ ctx[8]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(251:6) {#if msgExito}",
    		ctx
    	});

    	return block;
    }

    // (255:6) <DropdownToggle outline caret>
    function create_default_slot_18(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gráficas");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18.name,
    		type: "slot",
    		source: "(255:6) <DropdownToggle outline caret>",
    		ctx
    	});

    	return block;
    }

    // (257:7) <DropdownItem href="#/graph-highchart">
    function create_default_slot_17(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("HighChart");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17.name,
    		type: "slot",
    		source: "(257:7) <DropdownItem href=\\\"#/graph-highchart\\\">",
    		ctx
    	});

    	return block;
    }

    // (258:7) <DropdownItem href="#/graph-chartjs">
    function create_default_slot_16(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Chart.js");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16.name,
    		type: "slot",
    		source: "(258:7) <DropdownItem href=\\\"#/graph-chartjs\\\">",
    		ctx
    	});

    	return block;
    }

    // (256:6) <DropdownMenu>
    function create_default_slot_15(ctx) {
    	let t;
    	let current;

    	const dropdownitem0 = new DropdownItem({
    			props: {
    				href: "#/graph-highchart",
    				$$slots: { default: [create_default_slot_17] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const dropdownitem1 = new DropdownItem({
    			props: {
    				href: "#/graph-chartjs",
    				$$slots: { default: [create_default_slot_16] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dropdownitem0.$$.fragment);
    			t = space();
    			create_component(dropdownitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty[1] & /*$$scope*/ 32) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem1_changes = {};

    			if (dirty[1] & /*$$scope*/ 32) {
    				dropdownitem1_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem1.$set(dropdownitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdownitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(dropdownitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(256:6) <DropdownMenu>",
    		ctx
    	});

    	return block;
    }

    // (254:5) <Dropdown {isOpen} toggle={() => (isOpen = !isOpen)}>
    function create_default_slot_14(ctx) {
    	let t;
    	let current;

    	const dropdowntoggle = new DropdownToggle({
    			props: {
    				outline: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_18] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const dropdownmenu = new DropdownMenu({
    			props: {
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dropdowntoggle.$$.fragment);
    			t = space();
    			create_component(dropdownmenu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty[1] & /*$$scope*/ 32) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty[1] & /*$$scope*/ 32) {
    				dropdownmenu_changes.$$scope = { dirty, ctx };
    			}

    			dropdownmenu.$set(dropdownmenu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdowntoggle.$$.fragment, local);
    			transition_in(dropdownmenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdowntoggle.$$.fragment, local);
    			transition_out(dropdownmenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdowntoggle, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(dropdownmenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(254:5) <Dropdown {isOpen} toggle={() => (isOpen = !isOpen)}>",
    		ctx
    	});

    	return block;
    }

    // (287:9) <Button color="primary" outline on:click={insertFire}>
    function create_default_slot_13(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Insertar ✚");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(287:9) <Button color=\\\"primary\\\" outline on:click={insertFire}>",
    		ctx
    	});

    	return block;
    }

    // (304:9) <Button color="danger" outline on:click="{deleteFire(fire.community)}">
    function create_default_slot_12$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar 🗑");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12$1.name,
    		type: "slot",
    		source: "(304:9) <Button color=\\\"danger\\\" outline on:click=\\\"{deleteFire(fire.community)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (293:4) {#each fires as fire}
    function create_each_block(ctx) {
    	let tr;
    	let td0;
    	let a;
    	let t0_value = /*fire*/ ctx[33].community.replace("-", " ") + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let td1;
    	let t2_value = /*fire*/ ctx[33].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*fire*/ ctx[33].total_fire + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*fire*/ ctx[33].forest_area + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*fire*/ ctx[33].non_forest_area + "";
    	let t8;
    	let t9;
    	let td5;
    	let current;

    	const button = new Button({
    			props: {
    				color: "danger",
    				outline: true,
    				$$slots: { default: [create_default_slot_12$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*deleteFire*/ ctx[13](/*fire*/ ctx[33].community))) /*deleteFire*/ ctx[13](/*fire*/ ctx[33].community).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			attr_dev(a, "href", a_href_value = "#/fires-stats/" + /*fire*/ ctx[33].community + "/" + /*fire*/ ctx[33].year);
    			add_location(a, file$e, 297, 6, 7781);
    			add_location(td0, file$e, 296, 5, 7769);
    			add_location(td1, file$e, 299, 5, 7887);
    			add_location(td2, file$e, 300, 5, 7914);
    			add_location(td3, file$e, 301, 5, 7947);
    			add_location(td4, file$e, 302, 5, 7981);
    			add_location(td5, file$e, 303, 5, 8019);
    			add_location(tr, file$e, 294, 4, 7756);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, a);
    			append_dev(a, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			mount_component(button, td5, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*fires*/ 512) && t0_value !== (t0_value = /*fire*/ ctx[33].community.replace("-", " ") + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty[0] & /*fires*/ 512 && a_href_value !== (a_href_value = "#/fires-stats/" + /*fire*/ ctx[33].community + "/" + /*fire*/ ctx[33].year)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if ((!current || dirty[0] & /*fires*/ 512) && t2_value !== (t2_value = /*fire*/ ctx[33].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*fires*/ 512) && t4_value !== (t4_value = /*fire*/ ctx[33].total_fire + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*fires*/ 512) && t6_value !== (t6_value = /*fire*/ ctx[33].forest_area + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*fires*/ 512) && t8_value !== (t8_value = /*fire*/ ctx[33].non_forest_area + "")) set_data_dev(t8, t8_value);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 32) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(293:4) {#each fires as fire}",
    		ctx
    	});

    	return block;
    }

    // (308:9) <Button color="danger"  onClick="location.reload()" on:click={deleteAllResources}>
    function create_default_slot_11$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Eliminar Todos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11$1.name,
    		type: "slot",
    		source: "(308:9) <Button color=\\\"danger\\\"  onClick=\\\"location.reload()\\\" on:click={deleteAllResources}>",
    		ctx
    	});

    	return block;
    }

    // (309:9) <Button color="secondary" onClick="location.reload()" on:click={loadInitialData}>
    function create_default_slot_10$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar elementos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$1.name,
    		type: "slot",
    		source: "(309:9) <Button color=\\\"secondary\\\" onClick=\\\"location.reload()\\\" on:click={loadInitialData}>",
    		ctx
    	});

    	return block;
    }

    // (242:2) <Table>
    function create_default_slot_9$1(ctx) {
    	let thead;
    	let tr0;
    	let td0;
    	let t1;
    	let td1;
    	let updating_value;
    	let t2;
    	let td2;
    	let updating_value_1;
    	let t3;
    	let td3;
    	let t4;
    	let td4;
    	let t5;
    	let t6;
    	let td5;
    	let t7;
    	let tr1;
    	let th0;
    	let t9;
    	let th1;
    	let t11;
    	let th2;
    	let t13;
    	let th3;
    	let t15;
    	let th4;
    	let t17;
    	let th5;
    	let t19;
    	let tbody;
    	let tr2;
    	let td6;
    	let input2;
    	let t20;
    	let td7;
    	let input3;
    	let t21;
    	let td8;
    	let input4;
    	let t22;
    	let td9;
    	let input5;
    	let t23;
    	let td10;
    	let input6;
    	let t24;
    	let td11;
    	let t25;
    	let t26;
    	let tr3;
    	let td12;
    	let t27;
    	let td13;
    	let t28;
    	let td14;
    	let t29;
    	let td15;
    	let t30;
    	let td16;
    	let t31;
    	let td17;
    	let current;
    	let mounted;
    	let dispose;

    	function input0_value_binding(value) {
    		/*input0_value_binding*/ ctx[21].call(null, value);
    	}

    	let input0_props = { placeholder: "Introduce Comunidad" };

    	if (/*comunidad*/ ctx[6] !== void 0) {
    		input0_props.value = /*comunidad*/ ctx[6];
    	}

    	const input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, "value", input0_value_binding));

    	function input1_value_binding(value) {
    		/*input1_value_binding*/ ctx[22].call(null, value);
    	}

    	let input1_props = {
    		type: "number",
    		placeholder: "Introduce Año"
    	};

    	if (/*anyo*/ ctx[5] !== void 0) {
    		input1_props.value = /*anyo*/ ctx[5];
    	}

    	const input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, "value", input1_value_binding));

    	const button0 = new Button({
    			props: {
    				color: "secondary",
    				outline: true,
    				$$slots: { default: [create_default_slot_19] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", function () {
    		if (is_function(/*busqueda*/ ctx[11](/*comunidad*/ ctx[6], /*anyo*/ ctx[5]))) /*busqueda*/ ctx[11](/*comunidad*/ ctx[6], /*anyo*/ ctx[5]).apply(this, arguments);
    	});

    	let if_block0 = /*msgError*/ ctx[7] && create_if_block_3$2(ctx);
    	let if_block1 = /*msgExito*/ ctx[8] && create_if_block_2$3(ctx);

    	const dropdown = new Dropdown({
    			props: {
    				isOpen: /*isOpen*/ ctx[0],
    				toggle: /*func*/ ctx[23],
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button1 = new Button({
    			props: {
    				color: "primary",
    				outline: true,
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*insertFire*/ ctx[12]);
    	let each_value = /*fires*/ ctx[9];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const button2 = new Button({
    			props: {
    				color: "danger",
    				onClick: "location.reload()",
    				$$slots: { default: [create_default_slot_11$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*deleteAllResources*/ ctx[14]);

    	const button3 = new Button({
    			props: {
    				color: "secondary",
    				onClick: "location.reload()",
    				$$slots: { default: [create_default_slot_10$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button3.$on("click", /*loadInitialData*/ ctx[15]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			td0 = element("td");
    			td0.textContent = "Búsqueda de elementos";
    			t1 = space();
    			td1 = element("td");
    			create_component(input0.$$.fragment);
    			t2 = space();
    			td2 = element("td");
    			create_component(input1.$$.fragment);
    			t3 = space();
    			td3 = element("td");
    			create_component(button0.$$.fragment);
    			t4 = space();
    			td4 = element("td");
    			if (if_block0) if_block0.c();
    			t5 = space();
    			if (if_block1) if_block1.c();
    			t6 = space();
    			td5 = element("td");
    			create_component(dropdown.$$.fragment);
    			t7 = space();
    			tr1 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Comunidad";
    			t9 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t11 = space();
    			th2 = element("th");
    			th2.textContent = "Incendios Totales";
    			t13 = space();
    			th3 = element("th");
    			th3.textContent = "Área Forestal";
    			t15 = space();
    			th4 = element("th");
    			th4.textContent = "Área no Forestal";
    			t17 = space();
    			th5 = element("th");
    			th5.textContent = "Acciones";
    			t19 = space();
    			tbody = element("tbody");
    			tr2 = element("tr");
    			td6 = element("td");
    			input2 = element("input");
    			t20 = space();
    			td7 = element("td");
    			input3 = element("input");
    			t21 = space();
    			td8 = element("td");
    			input4 = element("input");
    			t22 = space();
    			td9 = element("td");
    			input5 = element("input");
    			t23 = space();
    			td10 = element("td");
    			input6 = element("input");
    			t24 = space();
    			td11 = element("td");
    			create_component(button1.$$.fragment);
    			t25 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t26 = space();
    			tr3 = element("tr");
    			td12 = element("td");
    			create_component(button2.$$.fragment);
    			t27 = space();
    			td13 = element("td");
    			create_component(button3.$$.fragment);
    			t28 = space();
    			td14 = element("td");
    			t29 = space();
    			td15 = element("td");
    			t30 = space();
    			td16 = element("td");
    			t31 = space();
    			td17 = element("td");
    			add_location(td0, file$e, 245, 5, 5952);
    			add_location(td1, file$e, 246, 5, 5989);
    			add_location(td2, file$e, 247, 5, 6072);
    			add_location(td3, file$e, 248, 5, 6158);
    			add_location(td4, file$e, 249, 5, 6268);
    			add_location(td5, file$e, 252, 5, 6616);
    			add_location(tr0, file$e, 244, 4, 5941);
    			add_location(th0, file$e, 266, 5, 7013);
    			add_location(th1, file$e, 267, 5, 7038);
    			add_location(th2, file$e, 268, 5, 7057);
    			add_location(th3, file$e, 269, 5, 7090);
    			add_location(th4, file$e, 270, 5, 7119);
    			add_location(th5, file$e, 271, 5, 7151);
    			add_location(tr1, file$e, 264, 4, 6995);
    			add_location(thead, file$e, 243, 3, 5928);
    			attr_dev(input2, "type", "text");
    			add_location(input2, file$e, 281, 9, 7249);
    			add_location(td6, file$e, 281, 5, 7245);
    			attr_dev(input3, "type", "number");
    			add_location(input3, file$e, 282, 9, 7319);
    			add_location(td7, file$e, 282, 5, 7315);
    			attr_dev(input4, "type", "number");
    			add_location(input4, file$e, 283, 9, 7384);
    			add_location(td8, file$e, 283, 5, 7380);
    			attr_dev(input5, "type", "number");
    			add_location(input5, file$e, 284, 9, 7455);
    			add_location(td9, file$e, 284, 5, 7451);
    			attr_dev(input6, "type", "number");
    			add_location(input6, file$e, 285, 9, 7527);
    			add_location(td10, file$e, 285, 5, 7523);
    			add_location(td11, file$e, 286, 5, 7599);
    			add_location(tr2, file$e, 279, 4, 7232);
    			add_location(td12, file$e, 307, 5, 8165);
    			add_location(td13, file$e, 308, 5, 8286);
    			add_location(td14, file$e, 309, 5, 8408);
    			add_location(td15, file$e, 310, 5, 8424);
    			add_location(td16, file$e, 311, 5, 8440);
    			add_location(td17, file$e, 312, 5, 8456);
    			add_location(tr3, file$e, 306, 4, 8154);
    			add_location(tbody, file$e, 277, 3, 7213);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, td0);
    			append_dev(tr0, t1);
    			append_dev(tr0, td1);
    			mount_component(input0, td1, null);
    			append_dev(tr0, t2);
    			append_dev(tr0, td2);
    			mount_component(input1, td2, null);
    			append_dev(tr0, t3);
    			append_dev(tr0, td3);
    			mount_component(button0, td3, null);
    			append_dev(tr0, t4);
    			append_dev(tr0, td4);
    			if (if_block0) if_block0.m(td4, null);
    			append_dev(td4, t5);
    			if (if_block1) if_block1.m(td4, null);
    			append_dev(tr0, t6);
    			append_dev(tr0, td5);
    			mount_component(dropdown, td5, null);
    			append_dev(thead, t7);
    			append_dev(thead, tr1);
    			append_dev(tr1, th0);
    			append_dev(tr1, t9);
    			append_dev(tr1, th1);
    			append_dev(tr1, t11);
    			append_dev(tr1, th2);
    			append_dev(tr1, t13);
    			append_dev(tr1, th3);
    			append_dev(tr1, t15);
    			append_dev(tr1, th4);
    			append_dev(tr1, t17);
    			append_dev(tr1, th5);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td6);
    			append_dev(td6, input2);
    			set_input_value(input2, /*newFire*/ ctx[1].community);
    			append_dev(tr2, t20);
    			append_dev(tr2, td7);
    			append_dev(td7, input3);
    			set_input_value(input3, /*newFire*/ ctx[1].year);
    			append_dev(tr2, t21);
    			append_dev(tr2, td8);
    			append_dev(td8, input4);
    			set_input_value(input4, /*newFire*/ ctx[1].total_fire);
    			append_dev(tr2, t22);
    			append_dev(tr2, td9);
    			append_dev(td9, input5);
    			set_input_value(input5, /*newFire*/ ctx[1].forest_area);
    			append_dev(tr2, t23);
    			append_dev(tr2, td10);
    			append_dev(td10, input6);
    			set_input_value(input6, /*newFire*/ ctx[1].non_forest_area);
    			append_dev(tr2, t24);
    			append_dev(tr2, td11);
    			mount_component(button1, td11, null);
    			append_dev(tbody, t25);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			append_dev(tbody, t26);
    			append_dev(tbody, tr3);
    			append_dev(tr3, td12);
    			mount_component(button2, td12, null);
    			append_dev(tr3, t27);
    			append_dev(tr3, td13);
    			mount_component(button3, td13, null);
    			append_dev(tr3, t28);
    			append_dev(tr3, td14);
    			append_dev(tr3, t29);
    			append_dev(tr3, td15);
    			append_dev(tr3, t30);
    			append_dev(tr3, td16);
    			append_dev(tr3, t31);
    			append_dev(tr3, td17);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[24]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[25]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[26]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[27]),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[28])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const input0_changes = {};

    			if (!updating_value && dirty[0] & /*comunidad*/ 64) {
    				updating_value = true;
    				input0_changes.value = /*comunidad*/ ctx[6];
    				add_flush_callback(() => updating_value = false);
    			}

    			input0.$set(input0_changes);
    			const input1_changes = {};

    			if (!updating_value_1 && dirty[0] & /*anyo*/ 32) {
    				updating_value_1 = true;
    				input1_changes.value = /*anyo*/ ctx[5];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			input1.$set(input1_changes);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 32) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);

    			if (/*msgError*/ ctx[7]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3$2(ctx);
    					if_block0.c();
    					if_block0.m(td4, t5);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*msgExito*/ ctx[8]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2$3(ctx);
    					if_block1.c();
    					if_block1.m(td4, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			const dropdown_changes = {};
    			if (dirty[0] & /*isOpen*/ 1) dropdown_changes.isOpen = /*isOpen*/ ctx[0];
    			if (dirty[0] & /*isOpen*/ 1) dropdown_changes.toggle = /*func*/ ctx[23];

    			if (dirty[1] & /*$$scope*/ 32) {
    				dropdown_changes.$$scope = { dirty, ctx };
    			}

    			dropdown.$set(dropdown_changes);

    			if (dirty[0] & /*newFire*/ 2 && input2.value !== /*newFire*/ ctx[1].community) {
    				set_input_value(input2, /*newFire*/ ctx[1].community);
    			}

    			if (dirty[0] & /*newFire*/ 2 && to_number(input3.value) !== /*newFire*/ ctx[1].year) {
    				set_input_value(input3, /*newFire*/ ctx[1].year);
    			}

    			if (dirty[0] & /*newFire*/ 2 && to_number(input4.value) !== /*newFire*/ ctx[1].total_fire) {
    				set_input_value(input4, /*newFire*/ ctx[1].total_fire);
    			}

    			if (dirty[0] & /*newFire*/ 2 && to_number(input5.value) !== /*newFire*/ ctx[1].forest_area) {
    				set_input_value(input5, /*newFire*/ ctx[1].forest_area);
    			}

    			if (dirty[0] & /*newFire*/ 2 && to_number(input6.value) !== /*newFire*/ ctx[1].non_forest_area) {
    				set_input_value(input6, /*newFire*/ ctx[1].non_forest_area);
    			}

    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 32) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);

    			if (dirty[0] & /*deleteFire, fires*/ 8704) {
    				each_value = /*fires*/ ctx[9];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, t26);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const button2_changes = {};

    			if (dirty[1] & /*$$scope*/ 32) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    			const button3_changes = {};

    			if (dirty[1] & /*$$scope*/ 32) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(dropdown.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(button2.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(dropdown.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(button2.$$.fragment, local);
    			transition_out(button3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			destroy_component(input0);
    			destroy_component(input1);
    			destroy_component(button0);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(dropdown);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button1);
    			destroy_each(each_blocks, detaching);
    			destroy_component(button2);
    			destroy_component(button3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$1.name,
    		type: "slot",
    		source: "(242:2) <Table>",
    		ctx
    	});

    	return block;
    }

    // (233:16)       Loading fires ...    {:then fires}
    function create_pending_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading fires ...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(233:16)       Loading fires ...    {:then fires}",
    		ctx
    	});

    	return block;
    }

    // (325:2) {#if pagActual !=1}
    function create_if_block_1$4(ctx) {
    	let t;
    	let current;

    	const paginationitem0 = new PaginationItem({
    			props: {
    				class: /*pagActual*/ ctx[2] === 1 ? "disabled" : "",
    				$$slots: { default: [create_default_slot_8$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const paginationitem1 = new PaginationItem({
    			props: {
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem0.$$.fragment);
    			t = space();
    			create_component(paginationitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(paginationitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem0_changes = {};
    			if (dirty[0] & /*pagActual*/ 4) paginationitem0_changes.class = /*pagActual*/ ctx[2] === 1 ? "disabled" : "";

    			if (dirty[1] & /*$$scope*/ 32) {
    				paginationitem0_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem0.$set(paginationitem0_changes);
    			const paginationitem1_changes = {};

    			if (dirty[0] & /*pagActual*/ 4 | dirty[1] & /*$$scope*/ 32) {
    				paginationitem1_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem1.$set(paginationitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem0.$$.fragment, local);
    			transition_in(paginationitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem0.$$.fragment, local);
    			transition_out(paginationitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(paginationitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(325:2) {#if pagActual !=1}",
    		ctx
    	});

    	return block;
    }

    // (326:2) <PaginationItem class="{pagActual === 1 ? 'disabled' : ''}">
    function create_default_slot_8$1(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: { previous: true, href: "#/fires-stats" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler*/ ctx[29]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(326:2) <PaginationItem class=\\\"{pagActual === 1 ? 'disabled' : ''}\\\">",
    		ctx
    	});

    	return block;
    }

    // (333:3) <PaginationLink href ="#/fires-stats" on:click="{() => incOffset(-1)}">
    function create_default_slot_7$1(ctx) {
    	let t_value = /*pagActual*/ ctx[2] - 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*pagActual*/ 4 && t_value !== (t_value = /*pagActual*/ ctx[2] - 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(333:3) <PaginationLink href =\\\"#/fires-stats\\\" on:click=\\\"{() => incOffset(-1)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (332:2) <PaginationItem>
    function create_default_slot_6$1(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				href: "#/fires-stats",
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_1*/ ctx[30]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*pagActual*/ 4 | dirty[1] & /*$$scope*/ 32) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(332:2) <PaginationItem>",
    		ctx
    	});

    	return block;
    }

    // (338:3) <PaginationLink href="#/fires-stats">
    function create_default_slot_5$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*pagActual*/ ctx[2]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*pagActual*/ 4) set_data_dev(t, /*pagActual*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(338:3) <PaginationLink href=\\\"#/fires-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (337:2) <PaginationItem active>
    function create_default_slot_4$1(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				href: "#/fires-stats",
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*pagActual*/ 4 | dirty[1] & /*$$scope*/ 32) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(337:2) <PaginationItem active>",
    		ctx
    	});

    	return block;
    }

    // (341:2) {#if pagSiguiente && numJson >= 10}
    function create_if_block$9(ctx) {
    	let t;
    	let current;

    	const paginationitem0 = new PaginationItem({
    			props: {
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const paginationitem1 = new PaginationItem({
    			props: {
    				class: /*pagSiguiente*/ ctx[3] ? "" : "disabled",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem0.$$.fragment);
    			t = space();
    			create_component(paginationitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(paginationitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem0_changes = {};

    			if (dirty[0] & /*pagActual*/ 4 | dirty[1] & /*$$scope*/ 32) {
    				paginationitem0_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem0.$set(paginationitem0_changes);
    			const paginationitem1_changes = {};
    			if (dirty[0] & /*pagSiguiente*/ 8) paginationitem1_changes.class = /*pagSiguiente*/ ctx[3] ? "" : "disabled";

    			if (dirty[1] & /*$$scope*/ 32) {
    				paginationitem1_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem1.$set(paginationitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem0.$$.fragment, local);
    			transition_in(paginationitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem0.$$.fragment, local);
    			transition_out(paginationitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(paginationitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(341:2) {#if pagSiguiente && numJson >= 10}",
    		ctx
    	});

    	return block;
    }

    // (344:3) <PaginationLink href="#/fires-stats" on:click="{() => incOffset(1)}">
    function create_default_slot_3$1(ctx) {
    	let t_value = /*pagActual*/ ctx[2] + 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*pagActual*/ 4 && t_value !== (t_value = /*pagActual*/ ctx[2] + 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(344:3) <PaginationLink href=\\\"#/fires-stats\\\" on:click=\\\"{() => incOffset(1)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (342:2) <PaginationItem>
    function create_default_slot_2$1(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				href: "#/fires-stats",
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_2*/ ctx[31]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*pagActual*/ 4 | dirty[1] & /*$$scope*/ 32) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(342:2) <PaginationItem>",
    		ctx
    	});

    	return block;
    }

    // (348:2) <PaginationItem class="{pagSiguiente ? '' : 'disabled'}">
    function create_default_slot_1$1(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: { next: true, href: "#/fires-stats" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_3*/ ctx[32]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(348:2) <PaginationItem class=\\\"{pagSiguiente ? '' : 'disabled'}\\\">",
    		ctx
    	});

    	return block;
    }

    // (324:1) <Pagination style="padding-left:40%;">
    function create_default_slot$2(ctx) {
    	let t0;
    	let t1;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*pagActual*/ ctx[2] != 1 && create_if_block_1$4(ctx);

    	const paginationitem = new PaginationItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block1 = /*pagSiguiente*/ ctx[3] && /*numJson*/ ctx[4] >= 10 && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			create_component(paginationitem.$$.fragment);
    			t1 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(paginationitem, target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*pagActual*/ ctx[2] != 1) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*pagActual*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$4(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const paginationitem_changes = {};

    			if (dirty[0] & /*pagActual*/ 4 | dirty[1] & /*$$scope*/ 32) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);

    			if (/*pagSiguiente*/ ctx[3] && /*numJson*/ ctx[4] >= 10) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*pagSiguiente, numJson*/ 24) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$9(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(paginationitem.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(paginationitem.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(paginationitem, detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(324:1) <Pagination style=\\\"padding-left:40%;\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let main;
    	let promise;
    	let t;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 9,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*fires*/ ctx[9], info);

    	const pagination = new Pagination({
    			props: {
    				style: "padding-left:40%;",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			info.block.c();
    			t = space();
    			create_component(pagination.$$.fragment);
    			add_location(main, file$e, 230, 0, 5703);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t;
    			append_dev(main, t);
    			mount_component(pagination, main, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty[0] & /*fires*/ 512 && promise !== (promise = /*fires*/ ctx[9]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[9] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}

    			const pagination_changes = {};

    			if (dirty[0] & /*pagSiguiente, pagActual, numJson*/ 28 | dirty[1] & /*$$scope*/ 32) {
    				pagination_changes.$$scope = { dirty, ctx };
    			}

    			pagination.$set(pagination_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			transition_in(pagination.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_component(pagination);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let isOpen = false;

    	/*-----------------------------------------------*/
    	let fires = [];

    	let newFire = {
    		community: "",
    		year: "",
    		total_fire: "",
    		forest_area: "",
    		non_forest_area: ""
    	};

    	//Elementos para la paginación
    	let limit = 10; //Por defecto que muestre 10

    	let offset = 0;
    	let pagActual = 1; //Que por defecto muestre la primera página 
    	let pagSiguiente = true;
    	let conjCommunity = [];
    	let conjYears = [];
    	let numJson = 0;

    	//Elementos para búsqueda
    	let anyo = "";

    	let comunidad = "";

    	//Variables mensajes de error
    	let msgError = "";

    	let msgExito = "";
    	onMount(paginationFires);

    	async function paginationFires() {
    		console.log("Getting Fires...");
    		const res = await fetch("api/v2/fires-stats?offset=" + limit * offset + "&limit=" + limit);

    		if (res.ok) {
    			console.log("OK");
    			const json = await res.json();
    			$$invalidate(9, fires = json);
    			$$invalidate(4, numJson = json.length);

    			if (json.length == 0) ;

    			console.log("Received " + fires.length + " fires.");
    		} else if (res.status == 404) {
    			console.log("Error al obtener la página");
    			$$invalidate(3, pagSiguiente = false);

    			//Mensaje para cuando se borra todo
    			$$invalidate(8, msgExito = "Todos los elementos eliminados");
    		}
    	}

    	function incOffset(value) {
    		offset += value;
    		$$invalidate(2, pagActual += value);
    		paginationFires();
    	}

    	//Implementada para comunidad y año
    	async function busqueda(comunidad, anyo) {
    		console.log("Searching an specific Item...");

    		if (typeof comunidad == "undefined") {
    			comunidad = "";
    		}

    		if (typeof anyo == "undefined") {
    			anyo = "";
    		}

    		if (comunidad != "") {
    			//si busca por comunidad
    			const res = await fetch("/api/v2/fires-stats?community=" + comunidad);

    			if (res.ok) {
    				$$invalidate(8, msgExito = "Búsqueda realizada");
    				console.log("Mostrando la búsqueda...");
    				const json = await res.json();
    				$$invalidate(9, fires = json);
    				console.log("Found " + fires.length + " fires-stats");
    			} else {
    				$$invalidate(7, msgError = "No se ha podido encontrar el elemento " + "'" + comunidad + "'" + ", tal vez haya olvidado el guión para los nombres compuestos");
    				console.log("Error!");
    			}
    		}

    		if (anyo != "") {
    			//si busca por año
    			const res = await fetch("/api/v2/fires-stats?year=" + anyo);

    			if (res.ok) {
    				$$invalidate(8, msgExito = "Búsqueda realizada");
    				console.log("Mostrando la búsqueda...");
    				const json = await res.json();
    				$$invalidate(9, fires = json);
    				console.log("Found " + fires.length + " fires-stats");
    			} else {
    				$$invalidate(7, msgError = "No se ha podido encontrar el elemento " + "'" + anyo + "'");
    				console.log("Error!");
    			}
    		}

    		if (comunidad != "" && anyo != "") {
    			//si busca por comunidad y por año
    			const res = await fetch("/api/v2/fires-stats?community=" + comunidad + "&year=" + anyo);

    			if (res.ok) {
    				$$invalidate(8, msgExito = "Búsqueda realizada");
    				console.log("Mostrando la búsqueda...");
    				const json = await res.json();
    				$$invalidate(9, fires = json);
    				console.log("Found " + fires.length + " fires-stats");
    			} else {
    				$$invalidate(7, msgError = "No se ha podido encontrar el elemento " + "'" + comunidad + "'" + " " + "'" + anyo + "'" + ", tal vez haya olvidado el guión para los nombres compuestos");
    				console.log("Error!");
    			}
    		}
    	}

    	//Funcion para insertar un elemento
    	async function insertFire() {
    		console.log("Inserting fires...");

    		const res = await fetch("/api/v2/fires-stats", {
    			method: "POST",
    			body: JSON.stringify(newFire),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			paginationFires();

    			if (res.ok) {
    				$$invalidate(8, msgExito = "Elemento añadido con éxito");
    			} else if (res.status == 400) {
    				window.alert("Debe completar todos los campos");
    			} else if (res.status == 409) {
    				window.alert("El elemento que desea añadir ya existe");
    			}
    		});
    	}

    	//Funcion para eliminar un elemento concreto
    	async function deleteFire(community, year) {
    		console.log("Deleting specific resource...");

    		const res = await fetch("/api/v2/fires-stats/" + community + "/" + year, { method: "DELETE" }).then(function (res) {
    			paginationFires();
    			$$invalidate(8, msgExito = "Recurso eliminado");
    		});
    	}

    	//Funcion para eliminar todos los elementos existentes
    	async function deleteAllResources() {
    		console.log("Deleting all resources...");

    		const res = await fetch("/api/v2/fires-stats", { method: "DELETE" }).then(function (res) {
    			if (res.ok) {
    				paginationFires();
    				window.alert("Pulse aceptar para continuar");
    			} else if (res.status == 404) {
    				window.alert("No hay elementos para elimiar");
    			}
    		});
    	}

    	//Funcion para cargar elementos iniciales
    	async function loadInitialData() {
    		console.log("Loading initial fires...");

    		const res = await fetch("/api/v2/fires-stats/loadInitialData", { method: "GET" }).then(function (res) {
    			paginationFires();
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<FiresStatsTable> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("FiresStatsTable", $$slots, []);

    	function input0_value_binding(value) {
    		comunidad = value;
    		$$invalidate(6, comunidad);
    	}

    	function input1_value_binding(value) {
    		anyo = value;
    		$$invalidate(5, anyo);
    	}

    	const func = () => $$invalidate(0, isOpen = !isOpen);

    	function input2_input_handler() {
    		newFire.community = this.value;
    		$$invalidate(1, newFire);
    	}

    	function input3_input_handler() {
    		newFire.year = to_number(this.value);
    		$$invalidate(1, newFire);
    	}

    	function input4_input_handler() {
    		newFire.total_fire = to_number(this.value);
    		$$invalidate(1, newFire);
    	}

    	function input5_input_handler() {
    		newFire.forest_area = to_number(this.value);
    		$$invalidate(1, newFire);
    	}

    	function input6_input_handler() {
    		newFire.non_forest_area = to_number(this.value);
    		$$invalidate(1, newFire);
    	}

    	const click_handler = () => incOffset(-1);
    	const click_handler_1 = () => incOffset(-1);
    	const click_handler_2 = () => incOffset(1);
    	const click_handler_3 = () => incOffset(1);

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		Pagination,
    		PaginationItem,
    		PaginationLink,
    		FormGroup,
    		Input,
    		Dropdown,
    		DropdownItem,
    		DropdownMenu,
    		DropdownToggle,
    		isOpen,
    		fires,
    		newFire,
    		limit,
    		offset,
    		pagActual,
    		pagSiguiente,
    		conjCommunity,
    		conjYears,
    		numJson,
    		anyo,
    		comunidad,
    		msgError,
    		msgExito,
    		paginationFires,
    		incOffset,
    		busqueda,
    		insertFire,
    		deleteFire,
    		deleteAllResources,
    		loadInitialData
    	});

    	$$self.$inject_state = $$props => {
    		if ("isOpen" in $$props) $$invalidate(0, isOpen = $$props.isOpen);
    		if ("fires" in $$props) $$invalidate(9, fires = $$props.fires);
    		if ("newFire" in $$props) $$invalidate(1, newFire = $$props.newFire);
    		if ("limit" in $$props) limit = $$props.limit;
    		if ("offset" in $$props) offset = $$props.offset;
    		if ("pagActual" in $$props) $$invalidate(2, pagActual = $$props.pagActual);
    		if ("pagSiguiente" in $$props) $$invalidate(3, pagSiguiente = $$props.pagSiguiente);
    		if ("conjCommunity" in $$props) conjCommunity = $$props.conjCommunity;
    		if ("conjYears" in $$props) conjYears = $$props.conjYears;
    		if ("numJson" in $$props) $$invalidate(4, numJson = $$props.numJson);
    		if ("anyo" in $$props) $$invalidate(5, anyo = $$props.anyo);
    		if ("comunidad" in $$props) $$invalidate(6, comunidad = $$props.comunidad);
    		if ("msgError" in $$props) $$invalidate(7, msgError = $$props.msgError);
    		if ("msgExito" in $$props) $$invalidate(8, msgExito = $$props.msgExito);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isOpen,
    		newFire,
    		pagActual,
    		pagSiguiente,
    		numJson,
    		anyo,
    		comunidad,
    		msgError,
    		msgExito,
    		fires,
    		incOffset,
    		busqueda,
    		insertFire,
    		deleteFire,
    		deleteAllResources,
    		loadInitialData,
    		offset,
    		limit,
    		conjCommunity,
    		conjYears,
    		paginationFires,
    		input0_value_binding,
    		input1_value_binding,
    		func,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler,
    		input6_input_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class FiresStatsTable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FiresStatsTable",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\front\Fires_Stats_API\EditFiresStats.svelte generated by Svelte v3.23.0 */

    const { console: console_1$3 } = globals;
    const file$f = "src\\front\\Fires_Stats_API\\EditFiresStats.svelte";

    // (1:0) <script>      import Table from "sveltestrap/src/Table.svelte";      import Button from  "sveltestrap/src/Button.svelte";              import { pop }
    function create_catch_block$1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(1:0) <script>      import Table from \\\"sveltestrap/src/Table.svelte\\\";      import Button from  \\\"sveltestrap/src/Button.svelte\\\";              import { pop }",
    		ctx
    	});

    	return block;
    }

    // (103:0) {:then fire}
    function create_then_block$1(ctx) {
    	let current;

    	const table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, updatednon_forest_area, updatedforest_area, updatedtotal_fire, updatedYear, updatedCommunity*/ 16446) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(103:0) {:then fire}",
    		ctx
    	});

    	return block;
    }

    // (127:9) <Button color="primary" outline  on:click={updateFire}>
    function create_default_slot_2$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Actualizar ✔");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(127:9) <Button color=\\\"primary\\\" outline  on:click={updateFire}>",
    		ctx
    	});

    	return block;
    }

    // (105:2) <Table bordered>
    function create_default_slot_1$2(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let t12_value = /*updatedCommunity*/ ctx[1].replace("-", " ") + "";
    	let t12;
    	let t13;
    	let td1;
    	let t14;
    	let t15;
    	let td2;
    	let input0;
    	let t16;
    	let td3;
    	let input1;
    	let t17;
    	let td4;
    	let input2;
    	let t18;
    	let td5;
    	let current;
    	let mounted;
    	let dispose;

    	const button = new Button({
    			props: {
    				color: "primary",
    				outline: true,
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*updateFire*/ ctx[9]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Comunidad";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Incendios Totales";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Área Forestal";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Área no Forestal";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acción";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			t12 = text(t12_value);
    			t13 = space();
    			td1 = element("td");
    			t14 = text(/*updatedYear*/ ctx[2]);
    			t15 = space();
    			td2 = element("td");
    			input0 = element("input");
    			t16 = space();
    			td3 = element("td");
    			input1 = element("input");
    			t17 = space();
    			td4 = element("td");
    			input2 = element("input");
    			t18 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			add_location(th0, file$f, 108, 5, 2784);
    			add_location(th1, file$f, 109, 5, 2809);
    			add_location(th2, file$f, 110, 5, 2828);
    			add_location(th3, file$f, 111, 5, 2861);
    			add_location(th4, file$f, 112, 5, 2890);
    			add_location(th5, file$f, 113, 5, 2922);
    			add_location(tr0, file$f, 106, 4, 2771);
    			add_location(thead, file$f, 105, 3, 2758);
    			add_location(td0, file$f, 121, 5, 2996);
    			add_location(td1, file$f, 122, 5, 3048);
    			attr_dev(input0, "id", "editaIncendio");
    			attr_dev(input0, "type", "number");
    			add_location(input0, file$f, 123, 20, 3092);
    			add_location(td2, file$f, 123, 16, 3088);
    			attr_dev(input1, "type", "number");
    			add_location(input1, file$f, 124, 9, 3182);
    			add_location(td3, file$f, 124, 5, 3178);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$f, 125, 9, 3254);
    			add_location(td4, file$f, 125, 5, 3250);
    			add_location(td5, file$f, 126, 5, 3326);
    			add_location(tr1, file$f, 119, 4, 2983);
    			add_location(tbody, file$f, 117, 3, 2968);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, t12);
    			append_dev(tr1, t13);
    			append_dev(tr1, td1);
    			append_dev(td1, t14);
    			append_dev(tr1, t15);
    			append_dev(tr1, td2);
    			append_dev(td2, input0);
    			set_input_value(input0, /*updatedtotal_fire*/ ctx[3]);
    			append_dev(tr1, t16);
    			append_dev(tr1, td3);
    			append_dev(td3, input1);
    			set_input_value(input1, /*updatedforest_area*/ ctx[4]);
    			append_dev(tr1, t17);
    			append_dev(tr1, td4);
    			append_dev(td4, input2);
    			set_input_value(input2, /*updatednon_forest_area*/ ctx[5]);
    			append_dev(tr1, t18);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[11]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[12]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[13])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*updatedCommunity*/ 2) && t12_value !== (t12_value = /*updatedCommunity*/ ctx[1].replace("-", " ") + "")) set_data_dev(t12, t12_value);
    			if (!current || dirty & /*updatedYear*/ 4) set_data_dev(t14, /*updatedYear*/ ctx[2]);

    			if (dirty & /*updatedtotal_fire*/ 8 && to_number(input0.value) !== /*updatedtotal_fire*/ ctx[3]) {
    				set_input_value(input0, /*updatedtotal_fire*/ ctx[3]);
    			}

    			if (dirty & /*updatedforest_area*/ 16 && to_number(input1.value) !== /*updatedforest_area*/ ctx[4]) {
    				set_input_value(input1, /*updatedforest_area*/ ctx[4]);
    			}

    			if (dirty & /*updatednon_forest_area*/ 32 && to_number(input2.value) !== /*updatednon_forest_area*/ ctx[5]) {
    				set_input_value(input2, /*updatednon_forest_area*/ ctx[5]);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(105:2) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (101:13)      Loading fire ...  {:then fire}
    function create_pending_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading fire ...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(101:13)      Loading fire ...  {:then fire}",
    		ctx
    	});

    	return block;
    }

    // (141:9) {#if msgExito}
    function create_if_block_1$5(ctx) {
    	let h5;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			h5.textContent = `Exito: ${/*msgExito*/ ctx[8]}`;
    			set_style(h5, "color", "green");
    			set_style(h5, "text-align", "center");
    			add_location(h5, file$f, 140, 23, 3645);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(141:9) {#if msgExito}",
    		ctx
    	});

    	return block;
    }

    // (141:99) {#if msgError}
    function create_if_block$a(ctx) {
    	let h5;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			t0 = text("Error: ");
    			t1 = text(/*msgError*/ ctx[6]);
    			set_style(h5, "color", "red");
    			set_style(h5, "text-align", "center");
    			add_location(h5, file$f, 140, 113, 3735);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    			append_dev(h5, t0);
    			append_dev(h5, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*msgError*/ 64) set_data_dev(t1, /*msgError*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(141:99) {#if msgError}",
    		ctx
    	});

    	return block;
    }

    // (142:8) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Atrás ↩");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(142:8) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let main;
    	let h3;
    	let t0;
    	let strong0;
    	let t1_value = /*params*/ ctx[0].community.replace("-", " ") + "";
    	let t1;
    	let t2;
    	let strong1;
    	let t3_value = /*params*/ ctx[0].year + "";
    	let t3;
    	let t4;
    	let promise;
    	let t5;
    	let div;
    	let t6;
    	let t7;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 7,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*fire*/ ctx[7], info);
    	let if_block0 = /*msgExito*/ ctx[8] && create_if_block_1$5(ctx);
    	let if_block1 = /*msgError*/ ctx[6] && create_if_block$a(ctx);

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h3 = element("h3");
    			t0 = text("Editando datos de la comunidad ");
    			strong0 = element("strong");
    			t1 = text(t1_value);
    			t2 = text(" en el año ");
    			strong1 = element("strong");
    			t3 = text(t3_value);
    			t4 = space();
    			info.block.c();
    			t5 = space();
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t6 = space();
    			if (if_block1) if_block1.c();
    			t7 = space();
    			create_component(button.$$.fragment);
    			add_location(strong0, file$f, 98, 39, 2580);
    			add_location(strong1, file$f, 98, 103, 2644);
    			add_location(h3, file$f, 98, 4, 2545);
    			add_location(div, file$f, 140, 4, 3626);
    			add_location(main, file$f, 97, 0, 2532);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h3);
    			append_dev(h3, t0);
    			append_dev(h3, strong0);
    			append_dev(strong0, t1);
    			append_dev(h3, t2);
    			append_dev(h3, strong1);
    			append_dev(strong1, t3);
    			append_dev(main, t4);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t5;
    			append_dev(main, t5);
    			append_dev(main, div);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t6);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(main, t7);
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*params*/ 1) && t1_value !== (t1_value = /*params*/ ctx[0].community.replace("-", " ") + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*params*/ 1) && t3_value !== (t3_value = /*params*/ ctx[0].year + "")) set_data_dev(t3, t3_value);
    			info.ctx = ctx;

    			if (dirty & /*fire*/ 128 && promise !== (promise = /*fire*/ ctx[7]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[7] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}

    			if (/*msgExito*/ ctx[8]) if_block0.p(ctx, dirty);

    			if (/*msgError*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$a(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { params = {} } = $$props; //Para los parametro en la url de cada recurso
    	let fire = {};
    	let updatedCommunity = "";
    	let updatedYear = 0;
    	let updatedtotal_fire = 0;
    	let updatedforest_area = 0;
    	let updatednon_forest_area = 0;
    	let msgExito = "";
    	let msgError = "";
    	onMount(getFire);

    	async function getFire() {
    		console.log("Fetching fire");
    		const res = await fetch("/api/v2/fires-stats/" + params.community + "/" + params.year);

    		//Await bloquea la instruccion, hasta que res tenga un valor
    		if (res.ok) {
    			console.log("OK");
    			const json = await res.json();
    			$$invalidate(7, fire = json);
    			$$invalidate(1, updatedCommunity = fire.community);
    			$$invalidate(2, updatedYear = fire.year);
    			$$invalidate(3, updatedtotal_fire = fire.total_fire);
    			$$invalidate(4, updatedforest_area = fire.forest_area);
    			$$invalidate(5, updatednon_forest_area = fire.non_forest_area);
    			console.log("Received fire.");
    		} else if (res.status == 404) {
    			$$invalidate(6, msgError = "Elemento no encontrado");
    			console.log("ERROR!" + msgError);
    		} else if (res.status == 400) {
    			$$invalidate(6, msgError = "Revise los campos");
    			console.log(msgError);
    		}
    	}

    	async function updateFire() {
    		console.log("Updating fire..." + JSON.stringify(params.community));

    		const res = await fetch("/api/v2/fires-stats/" + params.community + "/" + params.year, {
    			method: "PUT",
    			body: JSON.stringify({
    				community: params.community,
    				year: parseInt(params.year),
    				total_fire: updatedtotal_fire,
    				forest_area: updatedforest_area,
    				non_forest_area: updatednon_forest_area
    			}),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			getFire();

    			if (res.status == 200) {
    				window.alert("Recurso actualizado");
    			} else if (res.status == 400) {
    				$$invalidate(6, msgError = "Revise los campos");
    				console.log(msgError);
    			}
    		});
    	}

    	
    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$3.warn(`<EditFiresStats> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("EditFiresStats", $$slots, []);

    	function input0_input_handler() {
    		updatedtotal_fire = to_number(this.value);
    		$$invalidate(3, updatedtotal_fire);
    	}

    	function input1_input_handler() {
    		updatedforest_area = to_number(this.value);
    		$$invalidate(4, updatedforest_area);
    	}

    	function input2_input_handler() {
    		updatednon_forest_area = to_number(this.value);
    		$$invalidate(5, updatednon_forest_area);
    	}

    	$$self.$set = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		Table,
    		Button,
    		pop,
    		onMount,
    		params,
    		fire,
    		updatedCommunity,
    		updatedYear,
    		updatedtotal_fire,
    		updatedforest_area,
    		updatednon_forest_area,
    		msgExito,
    		msgError,
    		getFire,
    		updateFire
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    		if ("fire" in $$props) $$invalidate(7, fire = $$props.fire);
    		if ("updatedCommunity" in $$props) $$invalidate(1, updatedCommunity = $$props.updatedCommunity);
    		if ("updatedYear" in $$props) $$invalidate(2, updatedYear = $$props.updatedYear);
    		if ("updatedtotal_fire" in $$props) $$invalidate(3, updatedtotal_fire = $$props.updatedtotal_fire);
    		if ("updatedforest_area" in $$props) $$invalidate(4, updatedforest_area = $$props.updatedforest_area);
    		if ("updatednon_forest_area" in $$props) $$invalidate(5, updatednon_forest_area = $$props.updatednon_forest_area);
    		if ("msgExito" in $$props) $$invalidate(8, msgExito = $$props.msgExito);
    		if ("msgError" in $$props) $$invalidate(6, msgError = $$props.msgError);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		updatedCommunity,
    		updatedYear,
    		updatedtotal_fire,
    		updatedforest_area,
    		updatednon_forest_area,
    		msgError,
    		fire,
    		msgExito,
    		updateFire,
    		getFire,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class EditFiresStats extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditFiresStats",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get params() {
    		throw new Error("<EditFiresStats>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<EditFiresStats>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\Fires_Stats_API\analytics\HighChart.svelte generated by Svelte v3.23.0 */
    const file$g = "src\\front\\Fires_Stats_API\\analytics\\HighChart.svelte";

    // (143:8) <Button  on:click={forest_areas}>
    function create_default_slot_2$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Ver Área Forestal");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(143:8) <Button  on:click={forest_areas}>",
    		ctx
    	});

    	return block;
    }

    // (147:8) <Button on:click={loadGraph}>
    function create_default_slot_1$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Ver incendios");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(147:8) <Button on:click={loadGraph}>",
    		ctx
    	});

    	return block;
    }

    // (151:8) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Atrás ↩");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(151:8) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let script4;
    	let script4_src_value;
    	let t0;
    	let main;
    	let figure;
    	let div;
    	let t1;
    	let p;
    	let t3;
    	let h50;
    	let t4;
    	let t5;
    	let h51;
    	let t6;
    	let t7;
    	let h8;
    	let current;
    	let mounted;
    	let dispose;

    	const button0 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", forest_areas);

    	const button1 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", loadGraph);

    	const button2 = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", pop);

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			script4 = element("script");
    			t0 = space();
    			main = element("main");
    			figure = element("figure");
    			div = element("div");
    			t1 = space();
    			p = element("p");
    			p.textContent = "Gráfica que muestra el número de incendios forestales en el territorio español durante el año 2007\r\n        por comunidad autónoma";
    			t3 = space();
    			h50 = element("h5");
    			t4 = text("Comprueba las zonas forestales y no forestales por comunidad autónoma en ese año: \r\n        ");
    			create_component(button0.$$.fragment);
    			t5 = space();
    			h51 = element("h5");
    			t6 = text("Ver número de incendios totales\r\n        ");
    			create_component(button1.$$.fragment);
    			t7 = space();
    			h8 = element("h8");
    			create_component(button2.$$.fragment);
    			if (script0.src !== (script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$g, 127, 4, 3540);
    			if (script1.src !== (script1_src_value = "https://code.highcharts.com/modules/series-label.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$g, 128, 4, 3611);
    			if (script2.src !== (script2_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$g, 129, 4, 3692);
    			if (script3.src !== (script3_src_value = "https://code.highcharts.com/modules/export-data.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$g, 130, 4, 3770);
    			if (script4.src !== (script4_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script4, "src", script4_src_value);
    			add_location(script4, file$g, 131, 4, 3850);
    			attr_dev(div, "id", "container");
    			add_location(div, file$g, 136, 4, 4020);
    			attr_dev(p, "class", "highcharts-description");
    			add_location(p, file$g, 137, 4, 4052);
    			attr_dev(h50, "class", "highcharts-description");
    			add_location(h50, file$g, 141, 4, 4242);
    			attr_dev(h51, "class", "highcharts-description");
    			add_location(h51, file$g, 145, 4, 4447);
    			attr_dev(h8, "class", "highcharts-description");
    			add_location(h8, file$g, 149, 4, 4593);
    			attr_dev(figure, "class", "highcharts-figure");
    			add_location(figure, file$g, 135, 4, 3980);
    			add_location(main, file$g, 134, 0, 3968);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			append_dev(document.head, script4);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, div);
    			append_dev(figure, t1);
    			append_dev(figure, p);
    			append_dev(figure, t3);
    			append_dev(figure, h50);
    			append_dev(h50, t4);
    			mount_component(button0, h50, null);
    			append_dev(figure, t5);
    			append_dev(figure, h51);
    			append_dev(h51, t6);
    			mount_component(button1, h51, null);
    			append_dev(figure, t7);
    			append_dev(figure, h8);
    			mount_component(button2, h8, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(script4, "load", loadGraph, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			detach_dev(script4);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button0);
    			destroy_component(button1);
    			destroy_component(button2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function loadGraph() {
    	let Datos = [];
    	const res = await fetch("api/v2/fires-stats");
    	Datos = await res.json();
    	let comunidad = Datos.filter(Datos => Datos.year === 2007).map(Datos => Datos.community);
    	let incendio = Datos.filter(Datos => Datos.year === 2007).map(Datos => Datos.total_fire);

    	Highcharts.chart("container", {
    		chart: { type: "column" },
    		title: {
    			text: "Incendios forestales en España 2007"
    		},
    		subtitle: {
    			text: "Fuente: <a href=\"https://www.mapa.gob.es/es/desarrollo-rural/estadisticas/incendios-decenio-2006-2015_tcm30-511095.pdf\">gob.es</a>"
    		},
    		xAxis: {
    			categories: comunidad,
    			crosshair: true,
    			type: "category",
    			labels: {
    				rotation: -45,
    				style: {
    					fontSize: "13px",
    					fontFamily: "Verdana, sans-serif"
    				}
    			}
    		},
    		yAxis: {
    			min: 0,
    			title: { text: "Número de incendios" }
    		},
    		legend: { enabled: false },
    		tooltip: { shared: true },
    		series: [
    			{
    				name: "Nº Incendios",
    				type: "column",
    				data: incendio
    			}
    		]
    	});
    }

    async function forest_areas() {
    	let Datos = [];
    	const res = await fetch("api/v2/fires-stats");
    	Datos = await res.json();
    	let comunidad = Datos.filter(Datos => Datos.year === 2007).map(Datos => Datos.community);
    	let forest = Datos.filter(Datos => Datos.year === 2007).map(Datos => Datos.forest_area);
    	let noForest = Datos.filter(Datos => Datos.year === 2007).map(Datos => Datos.non_forest_area);

    	Highcharts.chart("container", {
    		chart: { type: "column" },
    		title: {
    			text: "Área forestal y no forestal por ccaa"
    		},
    		subtitle: {
    			text: "Fuente: <a href=\"https://www.mapa.gob.es/es/desarrollo-rural/estadisticas/incendios-decenio-2006-2015_tcm30-511095.pdf\">gob.es</a>"
    		},
    		xAxis: { categories: comunidad, crosshair: true },
    		yAxis: {
    			min: 0,
    			title: {
    				text: "Área forestal y no forestal por ccaa"
    			}
    		},
    		tooltip: {
    			headerFormat: "<span style=\"font-size:10px\">{point.key}</span><table>",
    			pointFormat: "<tr><td style=\"color:{series.color};padding:0\">{series.name}: </td>" + "<td style=\"padding:0\"><b>{point.y:.1f} hectáreas</b></td></tr>",
    			footerFormat: "</table>",
    			shared: true,
    			useHTML: true
    		},
    		plotOptions: {
    			column: { pointPadding: 0.2, borderWidth: 0 }
    		},
    		series: [
    			{
    				name: "Área forestal",
    				type: "column",
    				data: forest
    			},
    			{
    				name: "Área no forestal",
    				type: "column",
    				data: noForest
    			}
    		]
    	});
    }

    function instance$h($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<HighChart> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("HighChart", $$slots, []);
    	$$self.$capture_state = () => ({ Button, pop, loadGraph, forest_areas });
    	return [];
    }

    class HighChart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HighChart",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src\front\Fires_Stats_API\analytics\Chartjs.svelte generated by Svelte v3.23.0 */

    const { document: document_1 } = globals;
    const file$h = "src\\front\\Fires_Stats_API\\analytics\\Chartjs.svelte";

    // (60:8) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Atrás ↩");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(60:8) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let h5;
    	let t1;
    	let script;
    	let script_src_value;
    	let t2;
    	let canvas;
    	let t3;
    	let h8;
    	let current;
    	let mounted;
    	let dispose;

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			h5.textContent = "Gráfica que muestra los incendios forestales en España en el año 2006, junto con el área forestal y no forestal de cada comunidad autónoma";
    			t1 = space();
    			script = element("script");
    			t2 = space();
    			canvas = element("canvas");
    			t3 = space();
    			h8 = element("h8");
    			create_component(button.$$.fragment);
    			attr_dev(h5, "class", "titulo svelte-3gul9n");
    			add_location(h5, file$h, 51, 0, 1619);
    			if (script.src !== (script_src_value = "https://cdn.jsdelivr.net/npm/chart.js@2.8.0")) attr_dev(script, "src", script_src_value);
    			add_location(script, file$h, 53, 4, 1802);
    			attr_dev(canvas, "id", "myChart");
    			add_location(canvas, file$h, 56, 0, 1911);
    			add_location(h8, file$h, 58, 0, 1945);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    			insert_dev(target, t1, anchor);
    			append_dev(document_1.head, script);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, canvas, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, h8, anchor);
    			mount_component(button, h8, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(script, "load", loadGraph$1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    			if (detaching) detach_dev(t1);
    			detach_dev(script);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(canvas);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(h8);
    			destroy_component(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function loadGraph$1() {
    	let Datos = [];
    	const res = await fetch("api/v2/fires-stats");
    	Datos = await res.json();
    	let comunidad = Datos.filter(Datos => Datos.year === 2007).map(Datos => Datos.community);
    	let incendio = Datos.filter(Datos => Datos.year === 2007).map(Datos => Datos.total_fire);
    	let forest = Datos.filter(Datos => Datos.year === 2007).map(Datos => Datos.forest_area);
    	let noForest = Datos.filter(Datos => Datos.year === 2007).map(Datos => Datos.non_forest_area);
    	var ctx = document.getElementById("myChart").getContext("2d");

    	var chart = new Chart(ctx,
    	{
    			type: "bar",
    			data: {
    				labels: comunidad,
    				datasets: [
    					{
    						label: "Nº Incendios 2007",
    						backgroundColor: "rgb(230, 126, 34)",
    						borderColor: "rgb(23, 32, 42)",
    						data: incendio
    					},
    					{
    						label: "Área Forestal(htras)",
    						backgroundColor: "rgb(120, 126, 4)",
    						borderColor: "rgb(23, 32, 42)",
    						data: forest
    					},
    					{
    						label: "Área no Forestal(htras)",
    						backgroundColor: "rgb(20, 90, 50)",
    						borderColor: "rgb(23, 32, 42)",
    						data: noForest
    					}
    				]
    			},
    			options: {}
    		});
    }

    function instance$i($$self, $$props, $$invalidate) {
    	onMount(async () => {
    		
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Chartjs> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Chartjs", $$slots, []);
    	$$self.$capture_state = () => ({ onMount, Button, pop, loadGraph: loadGraph$1 });
    	return [];
    }

    class Chartjs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chartjs",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src\front\Fires_Stats_API\integrations\integrations.svelte generated by Svelte v3.23.0 */
    const file$i = "src\\front\\Fires_Stats_API\\integrations\\integrations.svelte";

    // (11:7) <Button type="button" color="success" onclick="window.location.href='#/fires-stats'">
    function create_default_slot_9$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Api 1 Externa");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$2.name,
    		type: "slot",
    		source: "(11:7) <Button type=\\\"button\\\" color=\\\"success\\\" onclick=\\\"window.location.href='#/fires-stats'\\\">",
    		ctx
    	});

    	return block;
    }

    // (13:7) <Button type="button" color="success" onclick="window.location.href='#/cigarretes-sales'">
    function create_default_slot_8$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("API 2 Externa");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$2.name,
    		type: "slot",
    		source: "(13:7) <Button type=\\\"button\\\" color=\\\"success\\\" onclick=\\\"window.location.href='#/cigarretes-sales'\\\">",
    		ctx
    	});

    	return block;
    }

    // (16:7) <Button type="button" color="success" onclick="window.location.href='#/fires-stats/integrations/#'">
    function create_default_slot_7$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Estadísticas Emigración");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$2.name,
    		type: "slot",
    		source: "(16:7) <Button type=\\\"button\\\" color=\\\"success\\\" onclick=\\\"window.location.href='#/fires-stats/integrations/#'\\\">",
    		ctx
    	});

    	return block;
    }

    // (17:7) <Button type="button" color="success" onclick="window.location.href='#/fires-stats-integrations/integrations/plugin-vehicles-stats'">
    function create_default_slot_6$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Ventas Coches Eléctricos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$2.name,
    		type: "slot",
    		source: "(17:7) <Button type=\\\"button\\\" color=\\\"success\\\" onclick=\\\"window.location.href='#/fires-stats-integrations/integrations/plugin-vehicles-stats'\\\">",
    		ctx
    	});

    	return block;
    }

    // (18:7) <Button type="button" color="success" onclick="window.location.href='#/fires-stats/integrations/#'">
    function create_default_slot_5$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Importaciones EEUU");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$2.name,
    		type: "slot",
    		source: "(18:7) <Button type=\\\"button\\\" color=\\\"success\\\" onclick=\\\"window.location.href='#/fires-stats/integrations/#'\\\">",
    		ctx
    	});

    	return block;
    }

    // (19:7) <Button type="button" color="success" onclick="window.location.href='#/fires-stats/integrations/#'">
    function create_default_slot_4$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Hospitalized Stats");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(19:7) <Button type=\\\"button\\\" color=\\\"success\\\" onclick=\\\"window.location.href='#/fires-stats/integrations/#'\\\">",
    		ctx
    	});

    	return block;
    }

    // (20:7) <Button type="button" color="success" onclick="window.location.href='#/fires-stats/integrations/#'">
    function create_default_slot_3$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Exportación de Libros");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(20:7) <Button type=\\\"button\\\" color=\\\"success\\\" onclick=\\\"window.location.href='#/fires-stats/integrations/#'\\\">",
    		ctx
    	});

    	return block;
    }

    // (21:7) <Button type="button" color="success" onclick="window.location.href='#/fires-stats/integrations/#'">
    function create_default_slot_2$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Consumo de Azúcar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$4.name,
    		type: "slot",
    		source: "(21:7) <Button type=\\\"button\\\" color=\\\"success\\\" onclick=\\\"window.location.href='#/fires-stats/integrations/#'\\\">",
    		ctx
    	});

    	return block;
    }

    // (22:7) <Button type="button" color="success" onclick="window.location.href='#/fires-stats/integrations/#'">
    function create_default_slot_1$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Delitos de Drogas");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(22:7) <Button type=\\\"button\\\" color=\\\"success\\\" onclick=\\\"window.location.href='#/fires-stats/integrations/#'\\\">",
    		ctx
    	});

    	return block;
    }

    // (24:8) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Atrás ↩");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(24:8) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let h3;
    	let t1;
    	let h40;
    	let t3;
    	let p0;
    	let t4;
    	let p1;
    	let t5;
    	let h41;
    	let t7;
    	let p2;
    	let t8;
    	let p3;
    	let t9;
    	let p4;
    	let t10;
    	let p5;
    	let t11;
    	let p6;
    	let t12;
    	let p7;
    	let t13;
    	let p8;
    	let t14;
    	let current;

    	const button0 = new Button({
    			props: {
    				type: "button",
    				color: "success",
    				onclick: "window.location.href='#/fires-stats'",
    				$$slots: { default: [create_default_slot_9$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button1 = new Button({
    			props: {
    				type: "button",
    				color: "success",
    				onclick: "window.location.href='#/cigarretes-sales'",
    				$$slots: { default: [create_default_slot_8$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button2 = new Button({
    			props: {
    				type: "button",
    				color: "success",
    				onclick: "window.location.href='#/fires-stats/integrations/#'",
    				$$slots: { default: [create_default_slot_7$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button3 = new Button({
    			props: {
    				type: "button",
    				color: "success",
    				onclick: "window.location.href='#/fires-stats-integrations/integrations/plugin-vehicles-stats'",
    				$$slots: { default: [create_default_slot_6$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button4 = new Button({
    			props: {
    				type: "button",
    				color: "success",
    				onclick: "window.location.href='#/fires-stats/integrations/#'",
    				$$slots: { default: [create_default_slot_5$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button5 = new Button({
    			props: {
    				type: "button",
    				color: "success",
    				onclick: "window.location.href='#/fires-stats/integrations/#'",
    				$$slots: { default: [create_default_slot_4$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button6 = new Button({
    			props: {
    				type: "button",
    				color: "success",
    				onclick: "window.location.href='#/fires-stats/integrations/#'",
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button7 = new Button({
    			props: {
    				type: "button",
    				color: "success",
    				onclick: "window.location.href='#/fires-stats/integrations/#'",
    				$$slots: { default: [create_default_slot_2$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button8 = new Button({
    			props: {
    				type: "button",
    				color: "success",
    				onclick: "window.location.href='#/fires-stats/integrations/#'",
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button9 = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button9.$on("click", pop);

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "Integraciones";
    			t1 = space();
    			h40 = element("h4");
    			h40.textContent = "Apis Externas:";
    			t3 = space();
    			p0 = element("p");
    			create_component(button0.$$.fragment);
    			t4 = space();
    			p1 = element("p");
    			create_component(button1.$$.fragment);
    			t5 = space();
    			h41 = element("h4");
    			h41.textContent = "Apis de Compañeros:";
    			t7 = space();
    			p2 = element("p");
    			create_component(button2.$$.fragment);
    			t8 = space();
    			p3 = element("p");
    			create_component(button3.$$.fragment);
    			t9 = space();
    			p4 = element("p");
    			create_component(button4.$$.fragment);
    			t10 = space();
    			p5 = element("p");
    			create_component(button5.$$.fragment);
    			t11 = space();
    			p6 = element("p");
    			create_component(button6.$$.fragment);
    			t12 = space();
    			p7 = element("p");
    			create_component(button7.$$.fragment);
    			t13 = space();
    			p8 = element("p");
    			create_component(button8.$$.fragment);
    			t14 = space();
    			create_component(button9.$$.fragment);
    			add_location(h3, file$i, 8, 0, 142);
    			add_location(h40, file$i, 9, 0, 167);
    			add_location(p0, file$i, 10, 4, 197);
    			add_location(p1, file$i, 12, 4, 321);
    			add_location(h41, file$i, 13, 0, 443);
    			add_location(p2, file$i, 15, 4, 480);
    			add_location(p3, file$i, 16, 4, 625);
    			add_location(p4, file$i, 17, 4, 804);
    			add_location(p5, file$i, 18, 4, 944);
    			add_location(p6, file$i, 19, 4, 1084);
    			add_location(p7, file$i, 20, 4, 1227);
    			add_location(p8, file$i, 21, 4, 1366);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h40, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, p0, anchor);
    			mount_component(button0, p0, null);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p1, anchor);
    			mount_component(button1, p1, null);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, h41, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, p2, anchor);
    			mount_component(button2, p2, null);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, p3, anchor);
    			mount_component(button3, p3, null);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, p4, anchor);
    			mount_component(button4, p4, null);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, p5, anchor);
    			mount_component(button5, p5, null);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, p6, anchor);
    			mount_component(button6, p6, null);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, p7, anchor);
    			mount_component(button7, p7, null);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, p8, anchor);
    			mount_component(button8, p8, null);
    			insert_dev(target, t14, anchor);
    			mount_component(button9, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    			const button3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);
    			const button4_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button4_changes.$$scope = { dirty, ctx };
    			}

    			button4.$set(button4_changes);
    			const button5_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button5_changes.$$scope = { dirty, ctx };
    			}

    			button5.$set(button5_changes);
    			const button6_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button6_changes.$$scope = { dirty, ctx };
    			}

    			button6.$set(button6_changes);
    			const button7_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button7_changes.$$scope = { dirty, ctx };
    			}

    			button7.$set(button7_changes);
    			const button8_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button8_changes.$$scope = { dirty, ctx };
    			}

    			button8.$set(button8_changes);
    			const button9_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button9_changes.$$scope = { dirty, ctx };
    			}

    			button9.$set(button9_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);
    			transition_in(button4.$$.fragment, local);
    			transition_in(button5.$$.fragment, local);
    			transition_in(button6.$$.fragment, local);
    			transition_in(button7.$$.fragment, local);
    			transition_in(button8.$$.fragment, local);
    			transition_in(button9.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			transition_out(button3.$$.fragment, local);
    			transition_out(button4.$$.fragment, local);
    			transition_out(button5.$$.fragment, local);
    			transition_out(button6.$$.fragment, local);
    			transition_out(button7.$$.fragment, local);
    			transition_out(button8.$$.fragment, local);
    			transition_out(button9.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h40);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(p0);
    			destroy_component(button0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p1);
    			destroy_component(button1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(h41);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(p2);
    			destroy_component(button2);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(p3);
    			destroy_component(button3);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(p4);
    			destroy_component(button4);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(p5);
    			destroy_component(button5);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(p6);
    			destroy_component(button6);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(p7);
    			destroy_component(button7);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(p8);
    			destroy_component(button8);
    			if (detaching) detach_dev(t14);
    			destroy_component(button9, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Integrations> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Integrations", $$slots, []);
    	$$self.$capture_state = () => ({ pop, Button });
    	return [];
    }

    class Integrations extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Integrations",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src\front\Fires_Stats_API\integrations\pluginVehiclesStats.svelte generated by Svelte v3.23.0 */

    const { console: console_1$4 } = globals;
    const file$j = "src\\front\\Fires_Stats_API\\integrations\\pluginVehiclesStats.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import  { onMount }
    function create_catch_block$2(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$2.name,
    		type: "catch",
    		source: "(1:0) <script>      import  { onMount }",
    		ctx
    	});

    	return block;
    }

    // (121:1) {:then getPluginVehicles}
    function create_then_block$2(ctx) {
    	let figure;
    	let div;
    	let t0;
    	let p;
    	let t2;
    	let current;

    	const table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			figure = element("figure");
    			div = element("div");
    			t0 = space();
    			p = element("p");
    			p.textContent = "Esta API muestra información acerca de las ventas acumuladas por países y ventas anuales de coches eléctricos a nivel internacional";
    			t2 = space();
    			create_component(table.$$.fragment);
    			attr_dev(div, "id", "container");
    			add_location(div, file$j, 122, 12, 3647);
    			attr_dev(p, "class", "highcharts-description");
    			add_location(p, file$j, 123, 16, 3691);
    			attr_dev(figure, "class", "highcharts-figure");
    			add_location(figure, file$j, 121, 2, 3599);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, figure, anchor);
    			append_dev(figure, div);
    			append_dev(figure, t0);
    			append_dev(figure, p);
    			insert_dev(target, t2, anchor);
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, plugins*/ 513) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(figure);
    			if (detaching) detach_dev(t2);
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$2.name,
    		type: "then",
    		source: "(121:1) {:then getPluginVehicles}",
    		ctx
    	});

    	return block;
    }

    // (139:4) {#each plugins as plugin}
    function create_each_block$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*plugin*/ ctx[6].country + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*plugin*/ ctx[6].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*plugin*/ ctx[6]["pev-stock"] + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*plugin*/ ctx[6]["annual-sale"] + "";
    	let t6;
    	let t7;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			add_location(td0, file$j, 140, 20, 4169);
    			add_location(td1, file$j, 141, 20, 4216);
    			add_location(td2, file$j, 142, 20, 4260);
    			add_location(td3, file$j, 143, 20, 4312);
    			add_location(tr, file$j, 139, 4, 4143);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*plugins*/ 1 && t0_value !== (t0_value = /*plugin*/ ctx[6].country + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*plugins*/ 1 && t2_value !== (t2_value = /*plugin*/ ctx[6].year + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*plugins*/ 1 && t4_value !== (t4_value = /*plugin*/ ctx[6]["pev-stock"] + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*plugins*/ 1 && t6_value !== (t6_value = /*plugin*/ ctx[6]["annual-sale"] + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(139:4) {#each plugins as plugin}",
    		ctx
    	});

    	return block;
    }

    // (128:2) <Table bordered>
    function create_default_slot_1$5(ctx) {
    	let thead;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let tbody;
    	let each_value = /*plugins*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Pais";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Ventas Acumuladas";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Ventas anuales";
    			t7 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$j, 130, 5, 3973);
    			add_location(th1, file$j, 131, 5, 3993);
    			add_location(th2, file$j, 132, 5, 4012);
    			add_location(th3, file$j, 133, 5, 4045);
    			add_location(tr, file$j, 129, 4, 3962);
    			add_location(thead, file$j, 128, 3, 3949);
    			add_location(tbody, file$j, 137, 3, 4099);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*plugins*/ 1) {
    				each_value = /*plugins*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(128:2) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (119:27)     Loading plugin-vehicles-stats ...   {:then getPluginVehicles}
    function create_pending_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading plugin-vehicles-stats ...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$2.name,
    		type: "pending",
    		source: "(119:27)     Loading plugin-vehicles-stats ...   {:then getPluginVehicles}",
    		ctx
    	});

    	return block;
    }

    // (154:1) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Atrás ↩");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(154:1) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let script4;
    	let script4_src_value;
    	let t0;
    	let main;
    	let promise;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block$2,
    		then: create_then_block$2,
    		catch: create_catch_block$2,
    		value: 2,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*getPluginVehicles*/ ctx[2], info);

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			script4 = element("script");
    			t0 = space();
    			main = element("main");
    			info.block.c();
    			t1 = space();
    			create_component(button.$$.fragment);
    			if (script0.src !== (script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$j, 110, 4, 3067);
    			if (script1.src !== (script1_src_value = "https://code.highcharts.com/modules/series-label.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$j, 111, 4, 3138);
    			if (script2.src !== (script2_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$j, 112, 4, 3219);
    			if (script3.src !== (script3_src_value = "https://code.highcharts.com/modules/export-data.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$j, 113, 4, 3297);
    			if (script4.src !== (script4_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script4, "src", script4_src_value);
    			add_location(script4, file$j, 114, 4, 3377);
    			add_location(main, file$j, 116, 0, 3493);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			append_dev(document.head, script4);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			insert_dev(target, t1, anchor);
    			mount_component(button, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(script4, "load", /*loadGraph*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			{
    				const child_ctx = ctx.slice();
    				child_ctx[2] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			detach_dev(script4);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    			if (detaching) detach_dev(t1);
    			destroy_component(button, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const url = "https://sos1920-09.herokuapp.com/api/v3/plugin-vehicles-stats/";

    function instance$k($$self, $$props, $$invalidate) {
    	onMount(getPluginVehicles);
    	let plugins = [];
    	let countries = [];
    	let pevStock = [];
    	let annualSale = [];

    	async function getPluginVehicles() {
    		console.log("Fetching plugin vehicles..");
    		const res = await fetch(url);

    		if (res.ok) {
    			console.log("ok");
    			const json = await res.json();
    			$$invalidate(0, plugins = json);
    			console.log("Received " + plugins.length + " plugin vehicles");
    		} else {
    			console.log("Error");
    		}
    	}

    	async function loadGraph() {
    		let Datos = [];
    		const res = await fetch(url);
    		Datos = await res.json();
    		console.log("Loading Chart...");

    		Datos.forEach(data => {
    			let country = data.country;
    			let p = data["pev-stock"];
    			let a = data["annual-sale"];

    			if (data.year == 2018) {
    				countries.push(country);
    				pevStock.push(p);
    				annualSale.push(a);
    			}
    		});

    		let country = Datos.map(Datos => Datos.country);
    		let pev_stock = Datos.map(Datos => Datos.stock);
    		let annual_sale = Datos.map(Datos => Datos.sale);

    		Highcharts.chart("container", {
    			chart: { type: "column" },
    			title: {
    				text: "Ventas anuales y cumulo de ventas de coches eléctricos"
    			},
    			xAxis: { categories: countries, crosshair: true },
    			yAxis: {
    				min: 0,
    				title: { text: "Unidades vendidas" }
    			},
    			tooltip: {
    				headerFormat: "<span style=\"font-size:10px\">{point.key}</span><table>",
    				pointFormat: "<tr><td style=\"color:{series.color};padding:0\">{series.name}: </td>" + "<td style=\"padding:0\"><b>{point.y:.1f} unidades</b></td></tr>",
    				footerFormat: "</table>",
    				shared: true,
    				useHTML: true
    			},
    			plotOptions: {
    				column: { pointPadding: 0.2, borderWidth: 0 }
    			},
    			series: [
    				{
    					name: "Ventas Acumuladas",
    					type: "column",
    					data: pevStock
    				},
    				{
    					name: "Ventas Anuales",
    					type: "column",
    					data: annualSale
    				}
    			]
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$4.warn(`<PluginVehiclesStats> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("PluginVehiclesStats", $$slots, []);

    	$$self.$capture_state = () => ({
    		onMount,
    		pop,
    		Table,
    		Button,
    		url,
    		plugins,
    		countries,
    		pevStock,
    		annualSale,
    		getPluginVehicles,
    		loadGraph
    	});

    	$$self.$inject_state = $$props => {
    		if ("plugins" in $$props) $$invalidate(0, plugins = $$props.plugins);
    		if ("countries" in $$props) countries = $$props.countries;
    		if ("pevStock" in $$props) pevStock = $$props.pevStock;
    		if ("annualSale" in $$props) annualSale = $$props.annualSale;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [plugins, loadGraph, getPluginVehicles];
    }

    class PluginVehiclesStats extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PluginVehiclesStats",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src\front\offworks_stats_API\OffworksStatsTable.svelte generated by Svelte v3.23.0 */

    const { console: console_1$5 } = globals;
    const file$k = "src\\front\\offworks_stats_API\\OffworksStatsTable.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[38] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[41] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[44] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import Table from "sveltestrap/src/Table.svelte";      import Button from  "sveltestrap/src/Button.svelte";      import { Pagination, PaginationItem, PaginationLink }
    function create_catch_block$3(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$3.name,
    		type: "catch",
    		source: "(1:0) <script>      import Table from \\\"sveltestrap/src/Table.svelte\\\";      import Button from  \\\"sveltestrap/src/Button.svelte\\\";      import { Pagination, PaginationItem, PaginationLink }",
    		ctx
    	});

    	return block;
    }

    // (196:1) {:then offworks}
    function create_then_block$3(ctx) {
    	let h4;
    	let t1;
    	let div0;
    	let t2;
    	let div1;
    	let t3;
    	let div2;
    	let t4;
    	let t5;
    	let t6;
    	let current;

    	const formgroup0 = new FormGroup({
    			props: {
    				style: "width:100%;",
    				$$slots: { default: [create_default_slot_19$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const formgroup1 = new FormGroup({
    			props: {
    				style: "width:100%;",
    				$$slots: { default: [create_default_slot_16$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot_15$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*searchComAndYear*/ ctx[17](/*c*/ ctx[11], /*y*/ ctx[10]))) /*searchComAndYear*/ ctx[17](/*c*/ ctx[11], /*y*/ ctx[10]).apply(this, arguments);
    	});

    	let if_block0 = /*msgErrBusq*/ ctx[7] && create_if_block_5$1(ctx);
    	let if_block1 = /*msgOkBusq*/ ctx[6] && create_if_block_4$1(ctx);

    	const table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_12$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			h4.textContent = "Busqueda por comunidad y/o año";
    			t1 = space();
    			div0 = element("div");
    			create_component(formgroup0.$$.fragment);
    			t2 = space();
    			div1 = element("div");
    			create_component(formgroup1.$$.fragment);
    			t3 = space();
    			div2 = element("div");
    			create_component(button.$$.fragment);
    			t4 = space();
    			if (if_block0) if_block0.c();
    			t5 = space();
    			if (if_block1) if_block1.c();
    			t6 = space();
    			create_component(table.$$.fragment);
    			add_location(h4, file$k, 197, 1, 5096);
    			set_style(div0, "display", "inline-block");
    			set_style(div0, "width", "10%");
    			add_location(div0, file$k, 198, 1, 5138);
    			set_style(div1, "margin", "2px 10px");
    			set_style(div1, "display", "inline-block");
    			set_style(div1, "width", "10%");
    			add_location(div1, file$k, 209, 1, 5515);
    			set_style(div2, "margin", "2px 10px");
    			set_style(div2, "display", "inline-block");
    			add_location(div2, file$k, 220, 1, 5872);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div0, anchor);
    			mount_component(formgroup0, div0, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(formgroup1, div1, null);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div2, anchor);
    			mount_component(button, div2, null);
    			insert_dev(target, t4, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t5, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const formgroup0_changes = {};

    			if (dirty[0] & /*c, conjCommunity*/ 2304 | dirty[1] & /*$$scope*/ 65536) {
    				formgroup0_changes.$$scope = { dirty, ctx };
    			}

    			formgroup0.$set(formgroup0_changes);
    			const formgroup1_changes = {};

    			if (dirty[0] & /*y, conjYears*/ 1536 | dirty[1] & /*$$scope*/ 65536) {
    				formgroup1_changes.$$scope = { dirty, ctx };
    			}

    			formgroup1.$set(formgroup1_changes);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 65536) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (/*msgErrBusq*/ ctx[7]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_5$1(ctx);
    					if_block0.c();
    					if_block0.m(t5.parentNode, t5);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*msgOkBusq*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_4$1(ctx);
    					if_block1.c();
    					if_block1.m(t6.parentNode, t6);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			const table_changes = {};

    			if (dirty[0] & /*offwork, offworks*/ 4097 | dirty[1] & /*$$scope*/ 65536) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formgroup0.$$.fragment, local);
    			transition_in(formgroup1.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formgroup0.$$.fragment, local);
    			transition_out(formgroup1.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div0);
    			destroy_component(formgroup0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			destroy_component(formgroup1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div2);
    			destroy_component(button);
    			if (detaching) detach_dev(t4);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t5);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$3.name,
    		type: "then",
    		source: "(196:1) {:then offworks}",
    		ctx
    	});

    	return block;
    }

    // (201:3) <Label for="selectComunnity">
    function create_default_slot_21(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Comunidad");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_21.name,
    		type: "slot",
    		source: "(201:3) <Label for=\\\"selectComunnity\\\">",
    		ctx
    	});

    	return block;
    }

    // (203:4) {#each conjCommunity as community}
    function create_each_block_2(ctx) {
    	let option;
    	let t_value = /*community*/ ctx[44] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*community*/ ctx[44];
    			option.value = option.__value;
    			add_location(option, file$k, 203, 4, 5408);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*conjCommunity*/ 256 && t_value !== (t_value = /*community*/ ctx[44] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*conjCommunity*/ 256 && option_value_value !== (option_value_value = /*community*/ ctx[44])) {
    				prop_dev(option, "__value", option_value_value);
    			}

    			option.value = option.__value;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(203:4) {#each conjCommunity as community}",
    		ctx
    	});

    	return block;
    }

    // (202:3) <Input type="select" name="selectComunnity" id="selectComunnity" bind:value="{c}">
    function create_default_slot_20(ctx) {
    	let t0;
    	let option;
    	let each_value_2 = /*conjCommunity*/ ctx[8];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			option = element("option");
    			option.textContent = "-";
    			option.__value = "-";
    			option.value = option.__value;
    			add_location(option, file$k, 205, 4, 5455);
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, option, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*conjCommunity*/ 256) {
    				each_value_2 = /*conjCommunity*/ ctx[8];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t0.parentNode, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20.name,
    		type: "slot",
    		source: "(202:3) <Input type=\\\"select\\\" name=\\\"selectComunnity\\\" id=\\\"selectComunnity\\\" bind:value=\\\"{c}\\\">",
    		ctx
    	});

    	return block;
    }

    // (200:2) <FormGroup style="width:100%;">
    function create_default_slot_19$1(ctx) {
    	let t;
    	let updating_value;
    	let current;

    	const label = new Label({
    			props: {
    				for: "selectComunnity",
    				$$slots: { default: [create_default_slot_21] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function input_value_binding(value) {
    		/*input_value_binding*/ ctx[27].call(null, value);
    	}

    	let input_props = {
    		type: "select",
    		name: "selectComunnity",
    		id: "selectComunnity",
    		$$slots: { default: [create_default_slot_20] },
    		$$scope: { ctx }
    	};

    	if (/*c*/ ctx[11] !== void 0) {
    		input_props.value = /*c*/ ctx[11];
    	}

    	const input = new Input({ props: input_props, $$inline: true });
    	binding_callbacks.push(() => bind(input, "value", input_value_binding));

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    			t = space();
    			create_component(input.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label_changes = {};

    			if (dirty[1] & /*$$scope*/ 65536) {
    				label_changes.$$scope = { dirty, ctx };
    			}

    			label.$set(label_changes);
    			const input_changes = {};

    			if (dirty[0] & /*conjCommunity*/ 256 | dirty[1] & /*$$scope*/ 65536) {
    				input_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty[0] & /*c*/ 2048) {
    				updating_value = true;
    				input_changes.value = /*c*/ ctx[11];
    				add_flush_callback(() => updating_value = false);
    			}

    			input.$set(input_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19$1.name,
    		type: "slot",
    		source: "(200:2) <FormGroup style=\\\"width:100%;\\\">",
    		ctx
    	});

    	return block;
    }

    // (212:3) <Label for="selectYear">
    function create_default_slot_18$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Año");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18$1.name,
    		type: "slot",
    		source: "(212:3) <Label for=\\\"selectYear\\\">",
    		ctx
    	});

    	return block;
    }

    // (214:4) {#each conjYears as year}
    function create_each_block_1(ctx) {
    	let option;
    	let t_value = /*year*/ ctx[41] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*year*/ ctx[41];
    			option.value = option.__value;
    			add_location(option, file$k, 214, 4, 5771);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*conjYears*/ 512 && t_value !== (t_value = /*year*/ ctx[41] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*conjYears*/ 512 && option_value_value !== (option_value_value = /*year*/ ctx[41])) {
    				prop_dev(option, "__value", option_value_value);
    			}

    			option.value = option.__value;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(214:4) {#each conjYears as year}",
    		ctx
    	});

    	return block;
    }

    // (213:3) <Input type="select"  name="selectYear" id="selectYear" bind:value="{y}">
    function create_default_slot_17$1(ctx) {
    	let t0;
    	let option;
    	let each_value_1 = /*conjYears*/ ctx[9];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			option = element("option");
    			option.textContent = "-";
    			option.__value = "-";
    			option.value = option.__value;
    			add_location(option, file$k, 216, 4, 5813);
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, option, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*conjYears*/ 512) {
    				each_value_1 = /*conjYears*/ ctx[9];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t0.parentNode, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17$1.name,
    		type: "slot",
    		source: "(213:3) <Input type=\\\"select\\\"  name=\\\"selectYear\\\" id=\\\"selectYear\\\" bind:value=\\\"{y}\\\">",
    		ctx
    	});

    	return block;
    }

    // (211:2) <FormGroup style="width:100%;">
    function create_default_slot_16$1(ctx) {
    	let t;
    	let updating_value;
    	let current;

    	const label = new Label({
    			props: {
    				for: "selectYear",
    				$$slots: { default: [create_default_slot_18$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function input_value_binding_1(value) {
    		/*input_value_binding_1*/ ctx[28].call(null, value);
    	}

    	let input_props = {
    		type: "select",
    		name: "selectYear",
    		id: "selectYear",
    		$$slots: { default: [create_default_slot_17$1] },
    		$$scope: { ctx }
    	};

    	if (/*y*/ ctx[10] !== void 0) {
    		input_props.value = /*y*/ ctx[10];
    	}

    	const input = new Input({ props: input_props, $$inline: true });
    	binding_callbacks.push(() => bind(input, "value", input_value_binding_1));

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    			t = space();
    			create_component(input.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label_changes = {};

    			if (dirty[1] & /*$$scope*/ 65536) {
    				label_changes.$$scope = { dirty, ctx };
    			}

    			label.$set(label_changes);
    			const input_changes = {};

    			if (dirty[0] & /*conjYears*/ 512 | dirty[1] & /*$$scope*/ 65536) {
    				input_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty[0] & /*y*/ 1024) {
    				updating_value = true;
    				input_changes.value = /*y*/ ctx[10];
    				add_flush_callback(() => updating_value = false);
    			}

    			input.$set(input_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16$1.name,
    		type: "slot",
    		source: "(211:2) <FormGroup style=\\\"width:100%;\\\">",
    		ctx
    	});

    	return block;
    }

    // (222:2) <Button color="info" on:click="{searchComAndYear(c,y)}">
    function create_default_slot_15$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Buscar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15$1.name,
    		type: "slot",
    		source: "(222:2) <Button color=\\\"info\\\" on:click=\\\"{searchComAndYear(c,y)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (224:1) {#if msgErrBusq}
    function create_if_block_5$1(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("ERROR: ");
    			t1 = text(/*msgErrBusq*/ ctx[7]);
    			set_style(p, "color", "red");
    			add_location(p, file$k, 224, 8, 6039);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*msgErrBusq*/ 128) set_data_dev(t1, /*msgErrBusq*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(224:1) {#if msgErrBusq}",
    		ctx
    	});

    	return block;
    }

    // (227:1) {#if msgOkBusq}
    function create_if_block_4$1(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("EXITO: ");
    			t1 = text(/*msgOkBusq*/ ctx[6]);
    			set_style(p, "color", "green");
    			add_location(p, file$k, 227, 8, 6120);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*msgOkBusq*/ 64) set_data_dev(t1, /*msgOkBusq*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(227:1) {#if msgOkBusq}",
    		ctx
    	});

    	return block;
    }

    // (249:11) <Button outline color="danger" on:click="{deleteOffwors(off.community, off.year)}">
    function create_default_slot_14$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14$1.name,
    		type: "slot",
    		source: "(249:11) <Button outline color=\\\"danger\\\" on:click=\\\"{deleteOffwors(off.community, off.year)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (242:4) {#each offworks as off}
    function create_each_block$2(ctx) {
    	let tr;
    	let td0;
    	let a;
    	let t0_value = /*off*/ ctx[38].community + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let td1;
    	let t2_value = /*off*/ ctx[38].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*off*/ ctx[38].accident + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*off*/ ctx[38].sick + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*off*/ ctx[38].numberzone + "";
    	let t8;
    	let t9;
    	let td5;
    	let current;

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_14$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*deleteOffwors*/ ctx[15](/*off*/ ctx[38].community, /*off*/ ctx[38].year))) /*deleteOffwors*/ ctx[15](/*off*/ ctx[38].community, /*off*/ ctx[38].year).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			set_style(a, "text-align", "center");
    			attr_dev(a, "href", a_href_value = "#/offworks-stats/" + /*off*/ ctx[38].community + "/" + /*off*/ ctx[38].year);
    			add_location(a, file$k, 243, 10, 6459);
    			attr_dev(td0, "class", "svelte-j0ee2g");
    			add_location(td0, file$k, 243, 6, 6455);
    			attr_dev(td1, "class", "svelte-j0ee2g");
    			add_location(td1, file$k, 244, 6, 6573);
    			attr_dev(td2, "class", "svelte-j0ee2g");
    			add_location(td2, file$k, 245, 6, 6600);
    			attr_dev(td3, "class", "svelte-j0ee2g");
    			add_location(td3, file$k, 246, 6, 6631);
    			attr_dev(td4, "class", "svelte-j0ee2g");
    			add_location(td4, file$k, 247, 6, 6658);
    			attr_dev(td5, "class", "svelte-j0ee2g");
    			add_location(td5, file$k, 248, 6, 6691);
    			add_location(tr, file$k, 242, 5, 6443);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, a);
    			append_dev(a, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			mount_component(button, td5, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*offworks*/ 4096) && t0_value !== (t0_value = /*off*/ ctx[38].community + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty[0] & /*offworks*/ 4096 && a_href_value !== (a_href_value = "#/offworks-stats/" + /*off*/ ctx[38].community + "/" + /*off*/ ctx[38].year)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if ((!current || dirty[0] & /*offworks*/ 4096) && t2_value !== (t2_value = /*off*/ ctx[38].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*offworks*/ 4096) && t4_value !== (t4_value = /*off*/ ctx[38].accident + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*offworks*/ 4096) && t6_value !== (t6_value = /*off*/ ctx[38].sick + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*offworks*/ 4096) && t8_value !== (t8_value = /*off*/ ctx[38].numberzone + "")) set_data_dev(t8, t8_value);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 65536) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(242:4) {#each offworks as off}",
    		ctx
    	});

    	return block;
    }

    // (260:10) <Button  color="primary" on:click={insertOffworks}>
    function create_default_slot_13$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Añadir");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13$1.name,
    		type: "slot",
    		source: "(260:10) <Button  color=\\\"primary\\\" on:click={insertOffworks}>",
    		ctx
    	});

    	return block;
    }

    // (230:2) <Table bordered >
    function create_default_slot_12$2(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let t12;
    	let tr1;
    	let td0;
    	let updating_value;
    	let t13;
    	let td1;
    	let updating_value_1;
    	let t14;
    	let td2;
    	let updating_value_2;
    	let t15;
    	let td3;
    	let updating_value_3;
    	let t16;
    	let td4;
    	let updating_value_4;
    	let t17;
    	let td5;
    	let current;
    	let each_value = /*offworks*/ ctx[12];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	function input0_value_binding(value) {
    		/*input0_value_binding*/ ctx[29].call(null, value);
    	}

    	let input0_props = { type: "text" };

    	if (/*offwork*/ ctx[0].community !== void 0) {
    		input0_props.value = /*offwork*/ ctx[0].community;
    	}

    	const input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, "value", input0_value_binding));

    	function input1_value_binding(value) {
    		/*input1_value_binding*/ ctx[30].call(null, value);
    	}

    	let input1_props = { type: "number" };

    	if (/*offwork*/ ctx[0].year !== void 0) {
    		input1_props.value = /*offwork*/ ctx[0].year;
    	}

    	const input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, "value", input1_value_binding));

    	function input2_value_binding(value) {
    		/*input2_value_binding*/ ctx[31].call(null, value);
    	}

    	let input2_props = { type: "number" };

    	if (/*offwork*/ ctx[0].accident !== void 0) {
    		input2_props.value = /*offwork*/ ctx[0].accident;
    	}

    	const input2 = new Input({ props: input2_props, $$inline: true });
    	binding_callbacks.push(() => bind(input2, "value", input2_value_binding));

    	function input3_value_binding(value) {
    		/*input3_value_binding*/ ctx[32].call(null, value);
    	}

    	let input3_props = { type: "number" };

    	if (/*offwork*/ ctx[0].sick !== void 0) {
    		input3_props.value = /*offwork*/ ctx[0].sick;
    	}

    	const input3 = new Input({ props: input3_props, $$inline: true });
    	binding_callbacks.push(() => bind(input3, "value", input3_value_binding));

    	function input4_value_binding(value) {
    		/*input4_value_binding*/ ctx[33].call(null, value);
    	}

    	let input4_props = { type: "number" };

    	if (/*offwork*/ ctx[0].numberzone !== void 0) {
    		input4_props.value = /*offwork*/ ctx[0].numberzone;
    	}

    	const input4 = new Input({ props: input4_props, $$inline: true });
    	binding_callbacks.push(() => bind(input4, "value", input4_value_binding));

    	const button = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_13$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*insertOffworks*/ ctx[14]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Comunidad";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Accidentes";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Enfermedades";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Numero de zonas";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acciones";
    			t11 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t12 = space();
    			tr1 = element("tr");
    			td0 = element("td");
    			create_component(input0.$$.fragment);
    			t13 = space();
    			td1 = element("td");
    			create_component(input1.$$.fragment);
    			t14 = space();
    			td2 = element("td");
    			create_component(input2.$$.fragment);
    			t15 = space();
    			td3 = element("td");
    			create_component(input3.$$.fragment);
    			t16 = space();
    			td4 = element("td");
    			create_component(input4.$$.fragment);
    			t17 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			attr_dev(th0, "class", "svelte-j0ee2g");
    			add_location(th0, file$k, 232, 5, 6225);
    			attr_dev(th1, "class", "svelte-j0ee2g");
    			add_location(th1, file$k, 233, 5, 6250);
    			attr_dev(th2, "class", "svelte-j0ee2g");
    			add_location(th2, file$k, 234, 5, 6269);
    			attr_dev(th3, "class", "svelte-j0ee2g");
    			add_location(th3, file$k, 235, 5, 6295);
    			attr_dev(th4, "class", "svelte-j0ee2g");
    			add_location(th4, file$k, 236, 5, 6323);
    			attr_dev(th5, "class", "svelte-j0ee2g");
    			add_location(th5, file$k, 237, 5, 6354);
    			add_location(tr0, file$k, 231, 4, 6214);
    			add_location(thead, file$k, 230, 3, 6200);
    			attr_dev(td0, "class", "svelte-j0ee2g");
    			add_location(td0, file$k, 254, 5, 6939);
    			attr_dev(td1, "class", "svelte-j0ee2g");
    			add_location(td1, file$k, 255, 5, 7008);
    			attr_dev(td2, "class", "svelte-j0ee2g");
    			add_location(td2, file$k, 256, 5, 7074);
    			attr_dev(td3, "class", "svelte-j0ee2g");
    			add_location(td3, file$k, 257, 5, 7144);
    			attr_dev(td4, "class", "svelte-j0ee2g");
    			add_location(td4, file$k, 258, 5, 7210);
    			attr_dev(td5, "class", "svelte-j0ee2g");
    			add_location(td5, file$k, 259, 5, 7282);
    			set_style(tr1, "background-color", "rgba(217, 219, 255, 0.945)");
    			add_location(tr1, file$k, 253, 4, 6875);
    			add_location(tbody, file$k, 240, 3, 6400);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			append_dev(tbody, t12);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			mount_component(input0, td0, null);
    			append_dev(tr1, t13);
    			append_dev(tr1, td1);
    			mount_component(input1, td1, null);
    			append_dev(tr1, t14);
    			append_dev(tr1, td2);
    			mount_component(input2, td2, null);
    			append_dev(tr1, t15);
    			append_dev(tr1, td3);
    			mount_component(input3, td3, null);
    			append_dev(tr1, t16);
    			append_dev(tr1, td4);
    			mount_component(input4, td4, null);
    			append_dev(tr1, t17);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*deleteOffwors, offworks*/ 36864) {
    				each_value = /*offworks*/ ctx[12];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, t12);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const input0_changes = {};

    			if (!updating_value && dirty[0] & /*offwork*/ 1) {
    				updating_value = true;
    				input0_changes.value = /*offwork*/ ctx[0].community;
    				add_flush_callback(() => updating_value = false);
    			}

    			input0.$set(input0_changes);
    			const input1_changes = {};

    			if (!updating_value_1 && dirty[0] & /*offwork*/ 1) {
    				updating_value_1 = true;
    				input1_changes.value = /*offwork*/ ctx[0].year;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			input1.$set(input1_changes);
    			const input2_changes = {};

    			if (!updating_value_2 && dirty[0] & /*offwork*/ 1) {
    				updating_value_2 = true;
    				input2_changes.value = /*offwork*/ ctx[0].accident;
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			input2.$set(input2_changes);
    			const input3_changes = {};

    			if (!updating_value_3 && dirty[0] & /*offwork*/ 1) {
    				updating_value_3 = true;
    				input3_changes.value = /*offwork*/ ctx[0].sick;
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			input3.$set(input3_changes);
    			const input4_changes = {};

    			if (!updating_value_4 && dirty[0] & /*offwork*/ 1) {
    				updating_value_4 = true;
    				input4_changes.value = /*offwork*/ ctx[0].numberzone;
    				add_flush_callback(() => updating_value_4 = false);
    			}

    			input4.$set(input4_changes);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 65536) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(input2.$$.fragment, local);
    			transition_in(input3.$$.fragment, local);
    			transition_in(input4.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(input2.$$.fragment, local);
    			transition_out(input3.$$.fragment, local);
    			transition_out(input4.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    			destroy_component(input0);
    			destroy_component(input1);
    			destroy_component(input2);
    			destroy_component(input3);
    			destroy_component(input4);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12$2.name,
    		type: "slot",
    		source: "(230:2) <Table bordered >",
    		ctx
    	});

    	return block;
    }

    // (194:18)     Loading offworks...   {:then offworks}
    function create_pending_block$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading offworks...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$3.name,
    		type: "pending",
    		source: "(194:18)     Loading offworks...   {:then offworks}",
    		ctx
    	});

    	return block;
    }

    // (266:1) {#if msgErr}
    function create_if_block_3$3(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("ERROR: ");
    			t1 = text(/*msgErr*/ ctx[2]);
    			set_style(p, "color", "red");
    			add_location(p, file$k, 266, 8, 7435);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*msgErr*/ 4) set_data_dev(t1, /*msgErr*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(266:1) {#if msgErr}",
    		ctx
    	});

    	return block;
    }

    // (269:1) {#if msgOk}
    function create_if_block_2$4(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("EXITO: ");
    			t1 = text(/*msgOk*/ ctx[1]);
    			set_style(p, "color", "green");
    			add_location(p, file$k, 269, 8, 7508);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*msgOk*/ 2) set_data_dev(t1, /*msgOk*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(269:1) {#if msgOk}",
    		ctx
    	});

    	return block;
    }

    // (274:2) {#if actualPag != 1}
    function create_if_block_1$6(ctx) {
    	let t;
    	let current;

    	const paginationitem0 = new PaginationItem({
    			props: {
    				class: /*actualPag*/ ctx[3] === 1 ? "disabled" : "",
    				$$slots: { default: [create_default_slot_11$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const paginationitem1 = new PaginationItem({
    			props: {
    				$$slots: { default: [create_default_slot_9$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem0.$$.fragment);
    			t = space();
    			create_component(paginationitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(paginationitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem0_changes = {};
    			if (dirty[0] & /*actualPag*/ 8) paginationitem0_changes.class = /*actualPag*/ ctx[3] === 1 ? "disabled" : "";

    			if (dirty[1] & /*$$scope*/ 65536) {
    				paginationitem0_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem0.$set(paginationitem0_changes);
    			const paginationitem1_changes = {};

    			if (dirty[0] & /*actualPag*/ 8 | dirty[1] & /*$$scope*/ 65536) {
    				paginationitem1_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem1.$set(paginationitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem0.$$.fragment, local);
    			transition_in(paginationitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem0.$$.fragment, local);
    			transition_out(paginationitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(paginationitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(274:2) {#if actualPag != 1}",
    		ctx
    	});

    	return block;
    }

    // (275:2) <PaginationItem class="{actualPag === 1 ? 'disabled' : ''}">
    function create_default_slot_11$2(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: { previous: true, href: "#/offworks-stats" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler*/ ctx[34]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11$2.name,
    		type: "slot",
    		source: "(275:2) <PaginationItem class=\\\"{actualPag === 1 ? 'disabled' : ''}\\\">",
    		ctx
    	});

    	return block;
    }

    // (280:3) <PaginationLink href="#/offworks-stats" on:click="{() => sumOffset(-1)}" >
    function create_default_slot_10$2(ctx) {
    	let t_value = /*actualPag*/ ctx[3] - 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*actualPag*/ 8 && t_value !== (t_value = /*actualPag*/ ctx[3] - 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$2.name,
    		type: "slot",
    		source: "(280:3) <PaginationLink href=\\\"#/offworks-stats\\\" on:click=\\\"{() => sumOffset(-1)}\\\" >",
    		ctx
    	});

    	return block;
    }

    // (279:2) <PaginationItem>
    function create_default_slot_9$3(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				href: "#/offworks-stats",
    				$$slots: { default: [create_default_slot_10$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_1*/ ctx[35]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*actualPag*/ 8 | dirty[1] & /*$$scope*/ 65536) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$3.name,
    		type: "slot",
    		source: "(279:2) <PaginationItem>",
    		ctx
    	});

    	return block;
    }

    // (284:3) <PaginationLink href="#/offworks-stats" >
    function create_default_slot_8$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*actualPag*/ ctx[3]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*actualPag*/ 8) set_data_dev(t, /*actualPag*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$3.name,
    		type: "slot",
    		source: "(284:3) <PaginationLink href=\\\"#/offworks-stats\\\" >",
    		ctx
    	});

    	return block;
    }

    // (283:2) <PaginationItem active>
    function create_default_slot_7$3(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				href: "#/offworks-stats",
    				$$slots: { default: [create_default_slot_8$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*actualPag*/ 8 | dirty[1] & /*$$scope*/ 65536) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$3.name,
    		type: "slot",
    		source: "(283:2) <PaginationItem active>",
    		ctx
    	});

    	return block;
    }

    // (287:2) {#if Pagsig && njson>=9}
    function create_if_block$b(ctx) {
    	let t;
    	let current;

    	const paginationitem0 = new PaginationItem({
    			props: {
    				$$slots: { default: [create_default_slot_5$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const paginationitem1 = new PaginationItem({
    			props: {
    				class: /*Pagsig*/ ctx[4] ? "" : "disabled",
    				$$slots: { default: [create_default_slot_4$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem0.$$.fragment);
    			t = space();
    			create_component(paginationitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(paginationitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem0_changes = {};

    			if (dirty[0] & /*actualPag*/ 8 | dirty[1] & /*$$scope*/ 65536) {
    				paginationitem0_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem0.$set(paginationitem0_changes);
    			const paginationitem1_changes = {};
    			if (dirty[0] & /*Pagsig*/ 16) paginationitem1_changes.class = /*Pagsig*/ ctx[4] ? "" : "disabled";

    			if (dirty[1] & /*$$scope*/ 65536) {
    				paginationitem1_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem1.$set(paginationitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem0.$$.fragment, local);
    			transition_in(paginationitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem0.$$.fragment, local);
    			transition_out(paginationitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(paginationitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(287:2) {#if Pagsig && njson>=9}",
    		ctx
    	});

    	return block;
    }

    // (289:3) <PaginationLink href="#/offworks-stats" on:click="{() => sumOffset(1)}">
    function create_default_slot_6$3(ctx) {
    	let t_value = /*actualPag*/ ctx[3] + 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*actualPag*/ 8 && t_value !== (t_value = /*actualPag*/ ctx[3] + 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$3.name,
    		type: "slot",
    		source: "(289:3) <PaginationLink href=\\\"#/offworks-stats\\\" on:click=\\\"{() => sumOffset(1)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (288:2) <PaginationItem >
    function create_default_slot_5$3(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				href: "#/offworks-stats",
    				$$slots: { default: [create_default_slot_6$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_2*/ ctx[36]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*actualPag*/ 8 | dirty[1] & /*$$scope*/ 65536) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$3.name,
    		type: "slot",
    		source: "(288:2) <PaginationItem >",
    		ctx
    	});

    	return block;
    }

    // (293:2) <PaginationItem class="{Pagsig ? '' : 'disabled'}">
    function create_default_slot_4$3(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: { next: true, href: "#/offworks-stats" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_3*/ ctx[37]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$3.name,
    		type: "slot",
    		source: "(293:2) <PaginationItem class=\\\"{Pagsig ? '' : 'disabled'}\\\">",
    		ctx
    	});

    	return block;
    }

    // (273:1) <Pagination style="padding-left: 40%" ariaLabel="Cambio de página">
    function create_default_slot_3$3(ctx) {
    	let t0;
    	let t1;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*actualPag*/ ctx[3] != 1 && create_if_block_1$6(ctx);

    	const paginationitem = new PaginationItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_7$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block1 = /*Pagsig*/ ctx[4] && /*njson*/ ctx[5] >= 9 && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			create_component(paginationitem.$$.fragment);
    			t1 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(paginationitem, target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*actualPag*/ ctx[3] != 1) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*actualPag*/ 8) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$6(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const paginationitem_changes = {};

    			if (dirty[0] & /*actualPag*/ 8 | dirty[1] & /*$$scope*/ 65536) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);

    			if (/*Pagsig*/ ctx[4] && /*njson*/ ctx[5] >= 9) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*Pagsig, njson*/ 48) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$b(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(paginationitem.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(paginationitem.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(paginationitem, detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$3.name,
    		type: "slot",
    		source: "(273:1) <Pagination style=\\\"padding-left: 40%\\\" ariaLabel=\\\"Cambio de página\\\">",
    		ctx
    	});

    	return block;
    }

    // (301:0) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot_2$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$5.name,
    		type: "slot",
    		source: "(301:0) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    // (302:0) <Button outline on:click={deleteAllOffworks} color="danger">
    function create_default_slot_1$6(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text("Borrar todo");
    			attr_dev(i, "class", "fa fa-trash");
    			attr_dev(i, "aria-hidden", "true");
    			add_location(i, file$k, 301, 61, 8629);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(302:0) <Button outline on:click={deleteAllOffworks} color=\\\"danger\\\">",
    		ctx
    	});

    	return block;
    }

    // (303:0) <Button outline on:click={loadInitialData} color="primary">
    function create_default_slot$8(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Cargar Datos Iniciales");
    			attr_dev(i, "class", "fas fa-download");
    			add_location(i, file$k, 302, 60, 8787);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(303:0) <Button outline on:click={loadInitialData} color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let main;
    	let promise;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block$3,
    		then: create_then_block$3,
    		catch: create_catch_block$3,
    		value: 12,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*offworks*/ ctx[12], info);
    	let if_block0 = /*msgErr*/ ctx[2] && create_if_block_3$3(ctx);
    	let if_block1 = /*msgOk*/ ctx[1] && create_if_block_2$4(ctx);

    	const pagination = new Pagination({
    			props: {
    				style: "padding-left: 40%",
    				ariaLabel: "Cambio de página",
    				$$slots: { default: [create_default_slot_3$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button0 = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot_2$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", pop);

    	const button1 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_1$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*deleteAllOffworks*/ ctx[16]);

    	const button2 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*loadInitialData*/ ctx[13]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			info.block.c();
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			create_component(pagination.$$.fragment);
    			t3 = space();
    			create_component(button0.$$.fragment);
    			t4 = space();
    			create_component(button1.$$.fragment);
    			t5 = space();
    			create_component(button2.$$.fragment);
    			add_location(main, file$k, 191, 0, 5019);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t0;
    			append_dev(main, t0);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t1);
    			if (if_block1) if_block1.m(main, null);
    			append_dev(main, t2);
    			mount_component(pagination, main, null);
    			append_dev(main, t3);
    			mount_component(button0, main, null);
    			append_dev(main, t4);
    			mount_component(button1, main, null);
    			append_dev(main, t5);
    			mount_component(button2, main, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty[0] & /*offworks*/ 4096 && promise !== (promise = /*offworks*/ ctx[12]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[12] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}

    			if (/*msgErr*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3$3(ctx);
    					if_block0.c();
    					if_block0.m(main, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*msgOk*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2$4(ctx);
    					if_block1.c();
    					if_block1.m(main, t2);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			const pagination_changes = {};

    			if (dirty[0] & /*Pagsig, actualPag, njson*/ 56 | dirty[1] & /*$$scope*/ 65536) {
    				pagination_changes.$$scope = { dirty, ctx };
    			}

    			pagination.$set(pagination_changes);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 65536) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 65536) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty[1] & /*$$scope*/ 65536) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			transition_in(pagination.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(pagination.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(pagination);
    			destroy_component(button0);
    			destroy_component(button1);
    			destroy_component(button2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let offworks = [];

    	let offwork = {
    		community: "",
    		year: "",
    		accident: "",
    		sick: "",
    		numberzone: ""
    	};

    	let searchOff = {
    		community: "",
    		year: "",
    		accident: "",
    		sick: "",
    		numberzone: ""
    	};

    	let limit = 10;
    	let offset = 0;
    	let msgOk = false;
    	let msgErr = false;
    	let actualPag = 1;
    	let Pagsig = true;
    	let njson = 0;

    	//let njsonbusqueda=0;
    	let msgOkBusq = false;

    	let msgErrBusq = false;
    	let campo = "";
    	let value = "";
    	let conjCommunity = [];
    	let conjYears = [];
    	let y = "-";
    	let c = "-";
    	let communityOn = false;
    	let yearOn = false;

    	//let accidentOn = false;
    	//let sickOn = false;
    	//let numberZoneOn = false;
    	onMount(getOffworksPag);

    	async function loadInitialData() {
    		const res = await fetch("/api/v2/offworks-stats/loadInitialData", { method: "GET" }).then(function (res) {
    			getOffworksPag();

    			if (res.status == 200) {
    				$$invalidate(1, msgOk = "Datos iniciales cargados correctamente ");
    				$$invalidate(2, msgErr = false);
    			}
    		});
    	}

    	async function getOffworksPag() {
    		console.log("Fetching Offworks..." + offset + " " + (offset + 1));
    		const res = await fetch("/api/v2/offworks-stats?offset=" + limit * offset + "&limit=" + limit);
    		const resConj = await fetch("/api/v2/offworks-stats");

    		if (res.ok) {
    			console.log("Ok");
    			const json = await res.json();
    			$$invalidate(12, offworks = json);
    			$$invalidate(5, njson = json.length);

    			//console.log(json.length);
    			const json2 = await resConj.json();

    			$$invalidate(8, conjCommunity = json2.map(c => {
    				return c.community;
    			}));

    			$$invalidate(8, conjCommunity = Array.from(new Set(conjCommunity)));

    			$$invalidate(9, conjYears = json2.map(y => {
    				return y.year;
    			}));

    			$$invalidate(9, conjYears = Array.from(new Set(conjYears)));

    			if (json.length == 0) {
    				$$invalidate(4, Pagsig = false);
    			} else {
    				$$invalidate(4, Pagsig = true);
    			}

    			console.log("Received " + offworks.length + " offworks");
    		} else if (res.status == 404) {
    			console.log("Error");
    			$$invalidate(4, Pagsig = false);
    		}
    	}

    	async function insertOffworks() {
    		console.log("Inserting offworks-stats..." + JSON.stringify(offwork));

    		const res = await fetch("/api/v2/offworks-stats", {
    			method: "POST",
    			body: JSON.stringify(offwork),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			getOffworksPag();

    			if (res.status == 201) {
    				$$invalidate(1, msgOk = "Se ha añadido correctamente");
    				$$invalidate(2, msgErr = false);
    			} else if (res.status == 400) {
    				$$invalidate(1, msgOk = false);
    				$$invalidate(2, msgErr = "No puede estar ningun campo vacio");
    			} else {
    				$$invalidate(1, msgOk = false);
    				$$invalidate(2, msgErr = "Ya existe");
    			}
    		});
    	}

    	async function deleteOffwors(community, year) {
    		console.log("Deleting Offworks...");

    		const res = await fetch("/api/v2/offworks-stats/" + community + "/" + year, { method: "DELETE" }).then(function (res) {
    			getOffworksPag();

    			if (res.status == 200) {
    				$$invalidate(1, msgOk = "Dato borrado correctamente");
    				$$invalidate(2, msgErr = false);
    			}
    		});
    	}

    	async function deleteAllOffworks() {
    		console.log("Deleting All Offworks...");

    		const res = await fetch("/api/v2/offworks-stats", { method: "DELETE" }).then(function (res) {
    			getOffworksPag();

    			if (res.status == 200) {
    				$$invalidate(1, msgOk = "Dato borrado correctamente");
    				$$invalidate(2, msgErr = false);
    				location.reload();
    			} else {
    				$$invalidate(1, msgOk = false);
    				$$invalidate(2, msgErr = "Error");
    			} //location.reload();
    		});
    	}

    	async function searchComAndYear(community, year) {
    		offset = 0;
    		$$invalidate(3, actualPag = 1);
    		$$invalidate(4, Pagsig = false);
    		console.log("Searching data: " + community + " and " + year);
    		var url = "/api/v2/offworks-stats";

    		if (community != "-" && year != "-") {
    			url = url + "?community=" + community + "&year=" + year;
    		} else if (community != "-" && year == "-") {
    			url = url + "?community=" + community;
    		} else if (community == "-" && year != "-") {
    			url = url + "?year=" + year;
    		}

    		console.log("url: " + url);
    		const res = await fetch(url);

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(12, offworks = json);
    			console.log("Found " + offworks.length + " offworks.");
    			$$invalidate(6, msgOkBusq = "Busqueda realizada");
    			$$invalidate(7, msgErrBusq = false);
    		} else {
    			$$invalidate(6, msgOkBusq = false);
    			$$invalidate(7, msgErrBusq = "No hay resultados");
    			console.log("ERROR!");
    		}
    	}

    	async function sumOffset(value) {
    		offset += value;
    		$$invalidate(3, actualPag += value);
    		getOffworksPag();
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$5.warn(`<OffworksStatsTable> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("OffworksStatsTable", $$slots, []);

    	function input_value_binding(value) {
    		c = value;
    		$$invalidate(11, c);
    	}

    	function input_value_binding_1(value) {
    		y = value;
    		$$invalidate(10, y);
    	}

    	function input0_value_binding(value) {
    		offwork.community = value;
    		$$invalidate(0, offwork);
    	}

    	function input1_value_binding(value) {
    		offwork.year = value;
    		$$invalidate(0, offwork);
    	}

    	function input2_value_binding(value) {
    		offwork.accident = value;
    		$$invalidate(0, offwork);
    	}

    	function input3_value_binding(value) {
    		offwork.sick = value;
    		$$invalidate(0, offwork);
    	}

    	function input4_value_binding(value) {
    		offwork.numberzone = value;
    		$$invalidate(0, offwork);
    	}

    	const click_handler = () => sumOffset(-1);
    	const click_handler_1 = () => sumOffset(-1);
    	const click_handler_2 = () => sumOffset(1);
    	const click_handler_3 = () => sumOffset(1);

    	$$self.$capture_state = () => ({
    		Table,
    		Button,
    		Pagination,
    		PaginationItem,
    		PaginationLink,
    		Input,
    		Label,
    		FormGroup,
    		pop,
    		onMount,
    		offworks,
    		offwork,
    		searchOff,
    		limit,
    		offset,
    		msgOk,
    		msgErr,
    		actualPag,
    		Pagsig,
    		njson,
    		msgOkBusq,
    		msgErrBusq,
    		campo,
    		value,
    		conjCommunity,
    		conjYears,
    		y,
    		c,
    		communityOn,
    		yearOn,
    		loadInitialData,
    		getOffworksPag,
    		insertOffworks,
    		deleteOffwors,
    		deleteAllOffworks,
    		searchComAndYear,
    		sumOffset
    	});

    	$$self.$inject_state = $$props => {
    		if ("offworks" in $$props) $$invalidate(12, offworks = $$props.offworks);
    		if ("offwork" in $$props) $$invalidate(0, offwork = $$props.offwork);
    		if ("searchOff" in $$props) searchOff = $$props.searchOff;
    		if ("limit" in $$props) limit = $$props.limit;
    		if ("offset" in $$props) offset = $$props.offset;
    		if ("msgOk" in $$props) $$invalidate(1, msgOk = $$props.msgOk);
    		if ("msgErr" in $$props) $$invalidate(2, msgErr = $$props.msgErr);
    		if ("actualPag" in $$props) $$invalidate(3, actualPag = $$props.actualPag);
    		if ("Pagsig" in $$props) $$invalidate(4, Pagsig = $$props.Pagsig);
    		if ("njson" in $$props) $$invalidate(5, njson = $$props.njson);
    		if ("msgOkBusq" in $$props) $$invalidate(6, msgOkBusq = $$props.msgOkBusq);
    		if ("msgErrBusq" in $$props) $$invalidate(7, msgErrBusq = $$props.msgErrBusq);
    		if ("campo" in $$props) campo = $$props.campo;
    		if ("value" in $$props) value = $$props.value;
    		if ("conjCommunity" in $$props) $$invalidate(8, conjCommunity = $$props.conjCommunity);
    		if ("conjYears" in $$props) $$invalidate(9, conjYears = $$props.conjYears);
    		if ("y" in $$props) $$invalidate(10, y = $$props.y);
    		if ("c" in $$props) $$invalidate(11, c = $$props.c);
    		if ("communityOn" in $$props) communityOn = $$props.communityOn;
    		if ("yearOn" in $$props) yearOn = $$props.yearOn;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		offwork,
    		msgOk,
    		msgErr,
    		actualPag,
    		Pagsig,
    		njson,
    		msgOkBusq,
    		msgErrBusq,
    		conjCommunity,
    		conjYears,
    		y,
    		c,
    		offworks,
    		loadInitialData,
    		insertOffworks,
    		deleteOffwors,
    		deleteAllOffworks,
    		searchComAndYear,
    		sumOffset,
    		offset,
    		searchOff,
    		limit,
    		campo,
    		value,
    		communityOn,
    		yearOn,
    		getOffworksPag,
    		input_value_binding,
    		input_value_binding_1,
    		input0_value_binding,
    		input1_value_binding,
    		input2_value_binding,
    		input3_value_binding,
    		input4_value_binding,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class OffworksStatsTable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OffworksStatsTable",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src\front\offworks_stats_API\EditOffworksStats.svelte generated by Svelte v3.23.0 */

    const { console: console_1$6 } = globals;
    const file$l = "src\\front\\offworks_stats_API\\EditOffworksStats.svelte";

    // (1:0) <script>  import {onMount}
    function create_catch_block$4(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$4.name,
    		type: "catch",
    		source: "(1:0) <script>  import {onMount}",
    		ctx
    	});

    	return block;
    }

    // (70:1) {:then offwork}
    function create_then_block$4(ctx) {
    	let current;

    	const table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, updatedNumberZone, updatedSick, updatedAccident, updatedYear, updatedCommunity*/ 16446) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$4.name,
    		type: "then",
    		source: "(70:1) {:then offwork}",
    		ctx
    	});

    	return block;
    }

    // (89:11) <Button outline color="primary" on:click={updateOffwork}>
    function create_default_slot_2$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Actualizar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$6.name,
    		type: "slot",
    		source: "(89:11) <Button outline color=\\\"primary\\\" on:click={updateOffwork}>",
    		ctx
    	});

    	return block;
    }

    // (71:3) <Table bordered>
    function create_default_slot_1$7(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let t12_value = /*updatedCommunity*/ ctx[1].replace("-", " ") + "";
    	let t12;
    	let t13;
    	let td1;
    	let t14;
    	let t15;
    	let td2;
    	let updating_value;
    	let t16;
    	let td3;
    	let updating_value_1;
    	let t17;
    	let td4;
    	let updating_value_2;
    	let t18;
    	let td5;
    	let current;

    	function input0_value_binding(value) {
    		/*input0_value_binding*/ ctx[11].call(null, value);
    	}

    	let input0_props = { type: "number" };

    	if (/*updatedAccident*/ ctx[3] !== void 0) {
    		input0_props.value = /*updatedAccident*/ ctx[3];
    	}

    	const input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, "value", input0_value_binding));

    	function input1_value_binding(value) {
    		/*input1_value_binding*/ ctx[12].call(null, value);
    	}

    	let input1_props = { type: "number" };

    	if (/*updatedSick*/ ctx[4] !== void 0) {
    		input1_props.value = /*updatedSick*/ ctx[4];
    	}

    	const input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, "value", input1_value_binding));

    	function input2_value_binding(value) {
    		/*input2_value_binding*/ ctx[13].call(null, value);
    	}

    	let input2_props = { type: "number" };

    	if (/*updatedNumberZone*/ ctx[5] !== void 0) {
    		input2_props.value = /*updatedNumberZone*/ ctx[5];
    	}

    	const input2 = new Input({ props: input2_props, $$inline: true });
    	binding_callbacks.push(() => bind(input2, "value", input2_value_binding));

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_2$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*updateOffwork*/ ctx[9]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Provincia";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Metropolitano";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Urbano";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Resto";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acciones";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			t12 = text(t12_value);
    			t13 = space();
    			td1 = element("td");
    			t14 = text(/*updatedYear*/ ctx[2]);
    			t15 = space();
    			td2 = element("td");
    			create_component(input0.$$.fragment);
    			t16 = space();
    			td3 = element("td");
    			create_component(input1.$$.fragment);
    			t17 = space();
    			td4 = element("td");
    			create_component(input2.$$.fragment);
    			t18 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			add_location(th0, file$l, 73, 6, 2047);
    			add_location(th1, file$l, 74, 6, 2073);
    			add_location(th2, file$l, 75, 6, 2093);
    			add_location(th3, file$l, 76, 6, 2123);
    			add_location(th4, file$l, 77, 6, 2146);
    			add_location(th5, file$l, 78, 6, 2168);
    			add_location(tr0, file$l, 72, 5, 2035);
    			add_location(thead, file$l, 71, 4, 2021);
    			add_location(td0, file$l, 83, 6, 2243);
    			add_location(td1, file$l, 84, 6, 2296);
    			add_location(td2, file$l, 85, 6, 2346);
    			add_location(td3, file$l, 86, 6, 2416);
    			add_location(td4, file$l, 87, 6, 2482);
    			add_location(td5, file$l, 88, 6, 2554);
    			add_location(tr1, file$l, 82, 5, 2231);
    			add_location(tbody, file$l, 81, 4, 2217);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, t12);
    			append_dev(tr1, t13);
    			append_dev(tr1, td1);
    			append_dev(td1, t14);
    			append_dev(tr1, t15);
    			append_dev(tr1, td2);
    			mount_component(input0, td2, null);
    			append_dev(tr1, t16);
    			append_dev(tr1, td3);
    			mount_component(input1, td3, null);
    			append_dev(tr1, t17);
    			append_dev(tr1, td4);
    			mount_component(input2, td4, null);
    			append_dev(tr1, t18);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*updatedCommunity*/ 2) && t12_value !== (t12_value = /*updatedCommunity*/ ctx[1].replace("-", " ") + "")) set_data_dev(t12, t12_value);
    			if (!current || dirty & /*updatedYear*/ 4) set_data_dev(t14, /*updatedYear*/ ctx[2]);
    			const input0_changes = {};

    			if (!updating_value && dirty & /*updatedAccident*/ 8) {
    				updating_value = true;
    				input0_changes.value = /*updatedAccident*/ ctx[3];
    				add_flush_callback(() => updating_value = false);
    			}

    			input0.$set(input0_changes);
    			const input1_changes = {};

    			if (!updating_value_1 && dirty & /*updatedSick*/ 16) {
    				updating_value_1 = true;
    				input1_changes.value = /*updatedSick*/ ctx[4];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			input1.$set(input1_changes);
    			const input2_changes = {};

    			if (!updating_value_2 && dirty & /*updatedNumberZone*/ 32) {
    				updating_value_2 = true;
    				input2_changes.value = /*updatedNumberZone*/ ctx[5];
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			input2.$set(input2_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(input2.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(input2.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(input0);
    			destroy_component(input1);
    			destroy_component(input2);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$7.name,
    		type: "slot",
    		source: "(71:3) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (68:17)     Loading offworks...   {:then offwork}
    function create_pending_block$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading offworks...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$4.name,
    		type: "pending",
    		source: "(68:17)     Loading offworks...   {:then offwork}",
    		ctx
    	});

    	return block;
    }

    // (95:1) {#if msgBad}
    function create_if_block_1$7(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("ERROR: ");
    			t1 = text(/*msgBad*/ ctx[7]);
    			set_style(p, "color", "red");
    			add_location(p, file$l, 95, 1, 2714);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*msgBad*/ 128) set_data_dev(t1, /*msgBad*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(95:1) {#if msgBad}",
    		ctx
    	});

    	return block;
    }

    // (98:1) {#if msgOk}
    function create_if_block$c(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("EXITO: ");
    			t1 = text(/*msgOk*/ ctx[6]);
    			set_style(p, "color", "green");
    			add_location(p, file$l, 98, 1, 2780);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*msgOk*/ 64) set_data_dev(t1, /*msgOk*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(98:1) {#if msgOk}",
    		ctx
    	});

    	return block;
    }

    // (101:2) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Atrás");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(101:2) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let main;
    	let h3;
    	let t0;
    	let strong;
    	let t1_value = /*params*/ ctx[0].community.replace("-", " ") + "";
    	let t1;
    	let t2;
    	let t3_value = /*params*/ ctx[0].year + "";
    	let t3;
    	let t4;
    	let promise;
    	let t5;
    	let t6;
    	let t7;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block$4,
    		then: create_then_block$4,
    		catch: create_catch_block$4,
    		value: 8,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*offwork*/ ctx[8], info);
    	let if_block0 = /*msgBad*/ ctx[7] && create_if_block_1$7(ctx);
    	let if_block1 = /*msgOk*/ ctx[6] && create_if_block$c(ctx);

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h3 = element("h3");
    			t0 = text("Editar: ");
    			strong = element("strong");
    			t1 = text(t1_value);
    			t2 = text(" - ");
    			t3 = text(t3_value);
    			t4 = space();
    			info.block.c();
    			t5 = space();
    			if (if_block0) if_block0.c();
    			t6 = space();
    			if (if_block1) if_block1.c();
    			t7 = space();
    			create_component(button.$$.fragment);
    			add_location(strong, file$l, 66, 42, 1860);
    			set_style(h3, "text-align", "center");
    			add_location(h3, file$l, 66, 2, 1820);
    			add_location(main, file$l, 65, 1, 1810);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h3);
    			append_dev(h3, t0);
    			append_dev(h3, strong);
    			append_dev(strong, t1);
    			append_dev(strong, t2);
    			append_dev(strong, t3);
    			append_dev(main, t4);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t5;
    			append_dev(main, t5);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t6);
    			if (if_block1) if_block1.m(main, null);
    			append_dev(main, t7);
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*params*/ 1) && t1_value !== (t1_value = /*params*/ ctx[0].community.replace("-", " ") + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*params*/ 1) && t3_value !== (t3_value = /*params*/ ctx[0].year + "")) set_data_dev(t3, t3_value);
    			info.ctx = ctx;

    			if (dirty & /*offwork*/ 256 && promise !== (promise = /*offwork*/ ctx[8]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[8] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}

    			if (/*msgBad*/ ctx[7]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$7(ctx);
    					if_block0.c();
    					if_block0.m(main, t6);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*msgOk*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$c(ctx);
    					if_block1.c();
    					if_block1.m(main, t7);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { params = {} } = $$props;
    	let offwork = {};
    	let updatedCommunity = "";
    	let updatedYear = 0;
    	let updatedAccident = 0;
    	let updatedSick = 0;
    	let updatedNumberZone = 0;
    	let msgOk = false;
    	let msgBad = false;
    	onMount(getOffwork);

    	async function getOffwork() {
    		console.log("Fetching offworks...");
    		const res = await fetch("/api/v2/offworks-stats/" + params.community + "/" + params.year);

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(8, offwork = json);
    			$$invalidate(1, updatedCommunity = offwork.community);
    			$$invalidate(2, updatedYear = offwork.year);
    			$$invalidate(3, updatedAccident = offwork.accident);
    			$$invalidate(4, updatedSick = offwork.sick);
    			$$invalidate(5, updatedNumberZone = offwork.numberzone);
    			console.log("Data loaded");
    		} else {
    			console.log("ERROR!");
    			msgError = "Elemento no encontrado";
    		}
    	}

    	async function updateOffwork() {
    		console.log("Updating offworks...");

    		const res = await fetch("/api/v2/offworks-stats/" + params.community + "/" + params.year, {
    			method: "PUT",
    			body: JSON.stringify({
    				community: params.community,
    				year: parseInt(params.year),
    				"accident": updatedAccident,
    				"sick": updatedSick,
    				"numberzone": updatedNumberZone
    			}),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			getOffwork();

    			if (res.status == 200) {
    				$$invalidate(6, msgOk = "Actualizado correctamente");
    				$$invalidate(7, msgBad = false);
    			} else {
    				$$invalidate(6, msgOk = false);
    				$$invalidate(7, msgBad = "No puede haber campos vacios");
    			}
    		});
    	}

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$6.warn(`<EditOffworksStats> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("EditOffworksStats", $$slots, []);

    	function input0_value_binding(value) {
    		updatedAccident = value;
    		$$invalidate(3, updatedAccident);
    	}

    	function input1_value_binding(value) {
    		updatedSick = value;
    		$$invalidate(4, updatedSick);
    	}

    	function input2_value_binding(value) {
    		updatedNumberZone = value;
    		$$invalidate(5, updatedNumberZone);
    	}

    	$$self.$set = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		pop,
    		Table,
    		Button,
    		Input,
    		params,
    		offwork,
    		updatedCommunity,
    		updatedYear,
    		updatedAccident,
    		updatedSick,
    		updatedNumberZone,
    		msgOk,
    		msgBad,
    		getOffwork,
    		updateOffwork
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    		if ("offwork" in $$props) $$invalidate(8, offwork = $$props.offwork);
    		if ("updatedCommunity" in $$props) $$invalidate(1, updatedCommunity = $$props.updatedCommunity);
    		if ("updatedYear" in $$props) $$invalidate(2, updatedYear = $$props.updatedYear);
    		if ("updatedAccident" in $$props) $$invalidate(3, updatedAccident = $$props.updatedAccident);
    		if ("updatedSick" in $$props) $$invalidate(4, updatedSick = $$props.updatedSick);
    		if ("updatedNumberZone" in $$props) $$invalidate(5, updatedNumberZone = $$props.updatedNumberZone);
    		if ("msgOk" in $$props) $$invalidate(6, msgOk = $$props.msgOk);
    		if ("msgBad" in $$props) $$invalidate(7, msgBad = $$props.msgBad);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		updatedCommunity,
    		updatedYear,
    		updatedAccident,
    		updatedSick,
    		updatedNumberZone,
    		msgOk,
    		msgBad,
    		offwork,
    		updateOffwork,
    		getOffwork,
    		input0_value_binding,
    		input1_value_binding,
    		input2_value_binding
    	];
    }

    class EditOffworksStats extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditOffworksStats",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get params() {
    		throw new Error("<EditOffworksStats>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<EditOffworksStats>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\offworks_stats_API\analytics\GraphOffworksStats.svelte generated by Svelte v3.23.0 */
    const file$m = "src\\front\\offworks_stats_API\\analytics\\GraphOffworksStats.svelte";

    // (119:4) <Button outline color = "secondary" on:click="{pop}">
    function create_default_slot$a(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(119:4) <Button outline color = \\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let script4;
    	let script4_src_value;
    	let t0;
    	let main;
    	let figure;
    	let div;
    	let t1;
    	let p;
    	let t3;
    	let current;
    	let mounted;
    	let dispose;

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			script4 = element("script");
    			t0 = space();
    			main = element("main");
    			figure = element("figure");
    			div = element("div");
    			t1 = space();
    			p = element("p");
    			p.textContent = "Relación de las Comunidades en el año 2007 entre accidentes laborales,\r\n          enfermedades laborales y numero de zonas de esa Comunidad Autonoma.";
    			t3 = space();
    			create_component(button.$$.fragment);
    			if (script0.src !== (script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$m, 101, 4, 2107);
    			if (script1.src !== (script1_src_value = "https://code.highcharts.com/modules/series-label.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$m, 102, 4, 2178);
    			if (script2.src !== (script2_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$m, 103, 4, 2259);
    			if (script3.src !== (script3_src_value = "https://code.highcharts.com/modules/export-data.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$m, 104, 4, 2337);
    			if (script4.src !== (script4_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script4, "src", script4_src_value);
    			add_location(script4, file$m, 105, 4, 2417);
    			attr_dev(div, "id", "container");
    			add_location(div, file$m, 110, 8, 2591);
    			attr_dev(p, "class", "highcharts-description");
    			add_location(p, file$m, 111, 8, 2627);
    			attr_dev(figure, "class", "highcharts-figure");
    			add_location(figure, file$m, 109, 4, 2547);
    			add_location(main, file$m, 108, 0, 2535);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			append_dev(document.head, script4);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, div);
    			append_dev(figure, t1);
    			append_dev(figure, p);
    			append_dev(main, t3);
    			mount_component(button, main, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(script4, "load", loadGraph$2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			detach_dev(script4);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function loadGraph$2() {
    	let MyData = [];
    	let comunidades = [];
    	let accidentes = [];
    	let enfermos = [];
    	let numZonas = [];
    	const resData = await fetch("api/v2/offworks-stats");
    	MyData = await resData.json();

    	MyData.forEach(data => {
    		let comunidad = data.community;
    		let year = data.year;
    		let accidente = data["accident"];
    		let enfermo = data["sick"];
    		let num = data["numberzone"];

    		if (data.year == 2007) {
    			comunidades.push(comunidad);
    			accidentes.push(accidente);
    			enfermos.push(enfermo);
    			numZonas.push(num);
    		}
    	});

    	Highcharts.chart("container", {
    		chart: { type: "line" },
    		title: { text: "Comunidades-Accidentes" },
    		subtitle: {
    			text: "Comunidades",
    			align: "right",
    			verticalAlign: "bottom"
    		},
    		yAxis: {
    			title: { text: "Numero de accidentes y zonas" }
    		},
    		xAxis: { categories: comunidades },
    		legend: {
    			layout: "vertical",
    			align: "right",
    			verticalAlign: "middle"
    		},
    		plotOptions: {
    			series: {
    				label: { connectorAllowed: false },
    				enableMouseTracking: false
    			}
    		},
    		series: [
    			{ name: "numero de zonas", data: numZonas },
    			{
    				name: "baja por accidente",
    				data: accidentes
    			},
    			{
    				name: "baja por enfermedad",
    				data: enfermos
    			}
    		],
    		responsive: {
    			rules: [
    				{
    					condition: { maxWidth: 500 },
    					chartOptions: {
    						legend: {
    							layout: "horizontal",
    							align: "center",
    							verticalAlign: "bottom"
    						}
    					}
    				}
    			]
    		}
    	});
    }

    function instance$n($$self, $$props, $$invalidate) {
    	
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<GraphOffworksStats> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GraphOffworksStats", $$slots, []);
    	$$self.$capture_state = () => ({ Button, pop, loadGraph: loadGraph$2 });
    	return [];
    }

    class GraphOffworksStats extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GraphOffworksStats",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* src\front\offworks_stats_API\analytics\RGraphOffworksStats.svelte generated by Svelte v3.23.0 */
    const file$n = "src\\front\\offworks_stats_API\\analytics\\RGraphOffworksStats.svelte";

    // (71:4) <Button style="margin-top:17%;margin-left: -39%;" outline color="secondary" on:click="{pop}">
    function create_default_slot$b(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Atrás");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$b.name,
    		type: "slot",
    		source: "(71:4) <Button style=\\\"margin-top:17%;margin-left: -39%;\\\" outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let t0;
    	let main;
    	let p;
    	let t2;
    	let div;
    	let t3;
    	let current;
    	let mounted;
    	let dispose;

    	const button = new Button({
    			props: {
    				style: "margin-top:17%;margin-left: -39%;",
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			t0 = space();
    			main = element("main");
    			p = element("p");
    			p.textContent = "Relación de las Comunidades en el año 2007 por enfermedades laborales y Comunidad Autonoma.";
    			t2 = space();
    			div = element("div");
    			t3 = space();
    			create_component(button.$$.fragment);
    			if (script0.src !== (script0_src_value = "lib/RGraph.svg.common.core.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$n, 61, 4, 2142);
    			if (script1.src !== (script1_src_value = "lib/RGraph.svg.line.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$n, 62, 4, 2221);
    			set_style(p, "z-index", "0");
    			add_location(p, file$n, 67, 4, 2321);
    			set_style(div, "z-index", "1");
    			set_style(div, "width", "950px");
    			set_style(div, "height", "400px");
    			set_style(div, "background-color", "black");
    			set_style(div, "box-shadow", "3px 3px 3px #ccc");
    			attr_dev(div, "id", "chart-container");
    			add_location(div, file$n, 68, 4, 2445);
    			add_location(main, file$n, 66, 0, 2309);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, p);
    			append_dev(main, t2);
    			append_dev(main, div);
    			append_dev(main, t3);
    			mount_component(button, main, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(script0, "load", loadGraph$3, false, false, false),
    					listen_dev(script1, "load", loadGraph$3, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function loadGraph$3() {
    	let MyData = [];
    	let comunidades = [];
    	let enfermos = [];
    	const resData = await fetch("api/v2/offworks-stats");
    	MyData = await resData.json();

    	MyData.forEach(data => {
    		let comunidad = data.community;
    		let year = data.year;
    		let accidente = data["accident"];
    		let enfermo = data["sick"];
    		let num = data["numberzone"];

    		if (data.year == 2007) {
    			comunidades.push(comunidad);
    			enfermos.push(enfermo);
    		}
    	});

    	new RGraph.SVG.Line({
    			id: "chart-container",
    			data: enfermos,
    			options: {
    				backgroundGridVlinesCount: 11,
    				marginInner: 0,
    				textColor: "white",
    				textFont: "Verdana",
    				filled: true,
    				filledColors: ["rgba(25,51,74,0.75)"],
    				colors: ["#5AF"],
    				marginRight: 50,
    				marginBottom: 50,
    				marginTop: 20,
    				xaxis: false,
    				yaxis: false,
    				yaxisScaleUnitsPost: "",
    				yaxisScaleUnitsPre: "",
    				tickmarksFill: "black",
    				tickmarksLinewidth: 2,
    				linewidth: 4,
    				spline: true
    			}
    		}).trace().responsive([
    		{
    			maxWidth: 800,
    			width: 400,
    			height: 200,
    			options: {
    				xaxisLabels: comunidades,
    				marginLeft: 80,
    				textSize: 5,
    				tickmarksStyle: "",
    				tickmarksSize: 3,
    				linewidth: 2
    			},
    			css: { "float": "none" }
    		},
    		{
    			maxWidth: null,
    			width: 750,
    			height: 300,
    			options: {
    				xaxisLabels: comunidades,
    				marginLeft: 65,
    				textSize: 7,
    				tickmarksStyle: "circle",
    				tickmarksSize: 5,
    				linewidth: 3
    			},
    			css: { "float": "left" }
    		}
    	]);
    }

    function instance$o($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<RGraphOffworksStats> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("RGraphOffworksStats", $$slots, []);
    	$$self.$capture_state = () => ({ Button, pop, loadGraph: loadGraph$3 });
    	return [];
    }

    class RGraphOffworksStats extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RGraphOffworksStats",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    /* src\front\offworks_stats_API\integrations\integrations.svelte generated by Svelte v3.23.0 */
    const file$o = "src\\front\\offworks_stats_API\\integrations\\integrations.svelte";

    // (11:7) <Button type="button" color="success" onclick="window.location.href='#/offworks-stats'">
    function create_default_slot_4$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Api 1 Externa");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$4.name,
    		type: "slot",
    		source: "(11:7) <Button type=\\\"button\\\" color=\\\"success\\\" onclick=\\\"window.location.href='#/offworks-stats'\\\">",
    		ctx
    	});

    	return block;
    }

    // (13:7) <Button type="button" color="success" onclick="window.location.href='#/offworks-stats'">
    function create_default_slot_3$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("API 2 Externa");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$4.name,
    		type: "slot",
    		source: "(13:7) <Button type=\\\"button\\\" color=\\\"success\\\" onclick=\\\"window.location.href='#/offworks-stats'\\\">",
    		ctx
    	});

    	return block;
    }

    // (16:7) <Button type="button" color="success" onclick="window.location.href='#/offworks-stats-integrations/integrations/basketIntegration'">
    function create_default_slot_2$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Estadísticas baloncesto");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$7.name,
    		type: "slot",
    		source: "(16:7) <Button type=\\\"button\\\" color=\\\"success\\\" onclick=\\\"window.location.href='#/offworks-stats-integrations/integrations/basketIntegration'\\\">",
    		ctx
    	});

    	return block;
    }

    // (17:7) <Button type="button" color="success" onclick="window.location.href='#/offworks-stats-integrations/integrations/drivingLicensesIntegration'">
    function create_default_slot_1$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Estadisticas licencias de conducir");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$8.name,
    		type: "slot",
    		source: "(17:7) <Button type=\\\"button\\\" color=\\\"success\\\" onclick=\\\"window.location.href='#/offworks-stats-integrations/integrations/drivingLicensesIntegration'\\\">",
    		ctx
    	});

    	return block;
    }

    // (24:4) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$c(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Atrás ↩");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$c.name,
    		type: "slot",
    		source: "(24:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let h3;
    	let t1;
    	let h40;
    	let t3;
    	let p0;
    	let t4;
    	let p1;
    	let t5;
    	let h41;
    	let t7;
    	let p2;
    	let t8;
    	let p3;
    	let t9;
    	let current;

    	const button0 = new Button({
    			props: {
    				type: "button",
    				color: "success",
    				onclick: "window.location.href='#/offworks-stats'",
    				$$slots: { default: [create_default_slot_4$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button1 = new Button({
    			props: {
    				type: "button",
    				color: "success",
    				onclick: "window.location.href='#/offworks-stats'",
    				$$slots: { default: [create_default_slot_3$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button2 = new Button({
    			props: {
    				type: "button",
    				color: "success",
    				onclick: "window.location.href='#/offworks-stats-integrations/integrations/basketIntegration'",
    				$$slots: { default: [create_default_slot_2$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button3 = new Button({
    			props: {
    				type: "button",
    				color: "success",
    				onclick: "window.location.href='#/offworks-stats-integrations/integrations/drivingLicensesIntegration'",
    				$$slots: { default: [create_default_slot_1$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button4 = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$c] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button4.$on("click", pop);

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "Integraciones";
    			t1 = space();
    			h40 = element("h4");
    			h40.textContent = "Apis Externas:";
    			t3 = space();
    			p0 = element("p");
    			create_component(button0.$$.fragment);
    			t4 = space();
    			p1 = element("p");
    			create_component(button1.$$.fragment);
    			t5 = space();
    			h41 = element("h4");
    			h41.textContent = "Apis de Compañeros:";
    			t7 = space();
    			p2 = element("p");
    			create_component(button2.$$.fragment);
    			t8 = space();
    			p3 = element("p");
    			create_component(button3.$$.fragment);
    			t9 = space();
    			create_component(button4.$$.fragment);
    			add_location(h3, file$o, 8, 0, 142);
    			add_location(h40, file$o, 9, 0, 167);
    			add_location(p0, file$o, 10, 4, 197);
    			add_location(p1, file$o, 12, 4, 324);
    			add_location(h41, file$o, 13, 0, 444);
    			add_location(p2, file$o, 15, 4, 481);
    			add_location(p3, file$o, 16, 4, 658);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h40, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, p0, anchor);
    			mount_component(button0, p0, null);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p1, anchor);
    			mount_component(button1, p1, null);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, h41, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, p2, anchor);
    			mount_component(button2, p2, null);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, p3, anchor);
    			mount_component(button3, p3, null);
    			insert_dev(target, t9, anchor);
    			mount_component(button4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    			const button3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);
    			const button4_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button4_changes.$$scope = { dirty, ctx };
    			}

    			button4.$set(button4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);
    			transition_in(button4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			transition_out(button3.$$.fragment, local);
    			transition_out(button4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h40);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(p0);
    			destroy_component(button0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p1);
    			destroy_component(button1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(h41);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(p2);
    			destroy_component(button2);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(p3);
    			destroy_component(button3);
    			if (detaching) detach_dev(t9);
    			destroy_component(button4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Integrations> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Integrations", $$slots, []);
    	$$self.$capture_state = () => ({ pop, Button });
    	return [];
    }

    class Integrations$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Integrations",
    			options,
    			id: create_fragment$p.name
    		});
    	}
    }

    /* src\front\offworks_stats_API\integrations\basketIntegration.svelte generated by Svelte v3.23.0 */

    const { console: console_1$7 } = globals;
    const file$p = "src\\front\\offworks_stats_API\\integrations\\basketIntegration.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import Button from "sveltestrap/src/Button.svelte";      import { pop }
    function create_catch_block$5(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$5.name,
    		type: "catch",
    		source: "(1:0) <script>      import Button from \\\"sveltestrap/src/Button.svelte\\\";      import { pop }",
    		ctx
    	});

    	return block;
    }

    // (172:1) {:then getApi}
    function create_then_block$5(ctx) {
    	let current;

    	const table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, datosApi*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$5.name,
    		type: "then",
    		source: "(172:1) {:then getApi}",
    		ctx
    	});

    	return block;
    }

    // (184:12) {#each datosApi as datoApi}
    function create_each_block$3(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*datoApi*/ ctx[2].country + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*datoApi*/ ctx[2].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*datoApi*/ ctx[2]["points"] + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*datoApi*/ ctx[2]["threepoints"] + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*datoApi*/ ctx[2]["rebounds"] + "";
    	let t8;
    	let t9;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			add_location(td0, file$p, 185, 20, 5634);
    			add_location(td1, file$p, 186, 20, 5682);
    			add_location(td2, file$p, 187, 20, 5727);
    			add_location(td3, file$p, 188, 20, 5777);
    			add_location(td4, file$p, 189, 20, 5832);
    			add_location(tr, file$p, 184, 4, 5608);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*datosApi*/ 1 && t0_value !== (t0_value = /*datoApi*/ ctx[2].country + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*datosApi*/ 1 && t2_value !== (t2_value = /*datoApi*/ ctx[2].year + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*datosApi*/ 1 && t4_value !== (t4_value = /*datoApi*/ ctx[2]["points"] + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*datosApi*/ 1 && t6_value !== (t6_value = /*datoApi*/ ctx[2]["threepoints"] + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*datosApi*/ 1 && t8_value !== (t8_value = /*datoApi*/ ctx[2]["rebounds"] + "")) set_data_dev(t8, t8_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(184:12) {#each datosApi as datoApi}",
    		ctx
    	});

    	return block;
    }

    // (173:4) <Table bordered>
    function create_default_slot_1$9(ctx) {
    	let thead;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let tbody;
    	let each_value = /*datosApi*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Pais";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Puntos";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "triples";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "rebotes";
    			t9 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$p, 175, 16, 5363);
    			add_location(th1, file$p, 176, 16, 5394);
    			add_location(th2, file$p, 177, 16, 5424);
    			add_location(th3, file$p, 178, 16, 5457);
    			add_location(th4, file$p, 179, 16, 5491);
    			add_location(tr, file$p, 174, 12, 5341);
    			add_location(thead, file$p, 173, 8, 5320);
    			add_location(tbody, file$p, 182, 8, 5554);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(tr, t7);
    			append_dev(tr, th4);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*datosApi*/ 1) {
    				each_value = /*datosApi*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$9.name,
    		type: "slot",
    		source: "(173:4) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (170:19)     Loading basket-stats ...   {:then getApi}
    function create_pending_block$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading basket-stats ...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$5.name,
    		type: "pending",
    		source: "(170:19)     Loading basket-stats ...   {:then getApi}",
    		ctx
    	});

    	return block;
    }

    // (196:4) <Button outline color = "secondary" on:click="{pop}">
    function create_default_slot$d(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$d.name,
    		type: "slot",
    		source: "(196:4) <Button outline color = \\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let script4;
    	let script4_src_value;
    	let t0;
    	let main;
    	let figure;
    	let div;
    	let t1;
    	let p;
    	let t3;
    	let promise;
    	let t4;
    	let current;
    	let mounted;
    	let dispose;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block$5,
    		then: create_then_block$5,
    		catch: create_catch_block$5,
    		value: 1,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*getApi*/ ctx[1], info);

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$d] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			script4 = element("script");
    			t0 = space();
    			main = element("main");
    			figure = element("figure");
    			div = element("div");
    			t1 = space();
    			p = element("p");
    			p.textContent = "Relación de las Comunidades en el año 2007 entre enfermedades laborales y\r\n            puntos,triples y rebotes en Comunidades Autonomas.";
    			t3 = space();
    			info.block.c();
    			t4 = space();
    			create_component(button.$$.fragment);
    			if (script0.src !== (script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$p, 154, 4, 4488);
    			if (script1.src !== (script1_src_value = "https://code.highcharts.com/modules/series-label.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$p, 155, 4, 4559);
    			if (script2.src !== (script2_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$p, 156, 4, 4640);
    			if (script3.src !== (script3_src_value = "https://code.highcharts.com/modules/export-data.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$p, 157, 4, 4718);
    			if (script4.src !== (script4_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script4, "src", script4_src_value);
    			add_location(script4, file$p, 158, 4, 4798);
    			attr_dev(div, "id", "container");
    			add_location(div, file$p, 163, 8, 4972);
    			attr_dev(p, "class", "highcharts-description");
    			add_location(p, file$p, 164, 8, 5008);
    			attr_dev(figure, "class", "highcharts-figure");
    			add_location(figure, file$p, 162, 4, 4928);
    			add_location(main, file$p, 161, 0, 4916);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			append_dev(document.head, script4);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, div);
    			append_dev(figure, t1);
    			append_dev(figure, p);
    			append_dev(main, t3);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t4;
    			append_dev(main, t4);
    			mount_component(button, main, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(script4, "load", loadGraph$4, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			{
    				const child_ctx = ctx.slice();
    				child_ctx[1] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			detach_dev(script4);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_component(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function loadGraph$4() {
    	let MyData = [];
    	let comunidades = [];
    	let enfermos = [];
    	let cont = 0;
    	const resData = await fetch("api/v2/offworks-stats");
    	MyData = await resData.json();

    	MyData.forEach(data => {
    		let comunidad = data.community;
    		let year = data.year;
    		let accidente = data["accident"];
    		let enfermo = data["sick"];
    		let num = data["numberzone"];

    		if (data.year == 2007 && cont < 5) {
    			comunidades.push(comunidad);
    			enfermos.push(enfermo);
    			cont++;
    		}
    	});

    	let dataExt = [];
    	let countries = [];
    	let years = [];
    	let points = [];
    	let threepoints = [];
    	let rebounds = [];
    	const resDataExt = await fetch("https://sos1920-22.herokuapp.com/api/v1/og-basket-stats");
    	dataExt = await resDataExt.json();

    	dataExt.forEach(data => {
    		/*let comunidad = data.community;
    let year = data.year;
    let accidente = data["accident"];
    let enfermo = data["sick"];
    let num = data["numberzone"];

    if (data.year == 2007) {
        comunidades.push(comunidad);
        accidentes.push(accidente);
        enfermos.push(enfermo);
        numZonas.push(num);
    }*/
    		countries.push(data.country);

    		years.push(data.year);
    		points.push(data["points"]);
    		threepoints.push(data["threepoints"]);
    		rebounds.push(data["rebounds"]);
    	});

    	Highcharts.chart("container", {
    		chart: { type: "line" },
    		title: {
    			text: "Comunidades-Enfermedades-Puntos-Triples-Rebotes"
    		},
    		subtitle: {
    			text: "Integracion offworksApi y BasketApi",
    			align: "right",
    			verticalAlign: "bottom"
    		},
    		yAxis: {
    			title: { text: "Numero de accidentes y zonas" }
    		},
    		xAxis: { categories: comunidades },
    		legend: {
    			layout: "vertical",
    			align: "right",
    			verticalAlign: "middle"
    		},
    		plotOptions: {
    			series: {
    				label: { connectorAllowed: false },
    				enableMouseTracking: false
    			}
    		},
    		series: [
    			{ name: "puntos", data: points },
    			{ name: "triples", data: threepoints },
    			{ name: "rebotes", data: rebounds },
    			{
    				name: "baja por enfermedad",
    				data: enfermos
    			}
    		],
    		responsive: {
    			rules: [
    				{
    					condition: { maxWidth: 500 },
    					chartOptions: {
    						legend: {
    							layout: "horizontal",
    							align: "center",
    							verticalAlign: "bottom"
    						}
    					}
    				}
    			]
    		}
    	});
    }

    function instance$q($$self, $$props, $$invalidate) {
    	onMount(getApi);
    	
    	let datosApi = [];

    	async function getApi() {
    		//console.log("Fetching plugin vehicles..");
    		const res = await fetch("https://sos1920-22.herokuapp.com/api/v1/og-basket-stats");

    		if (res.ok) {
    			console.log("ok");
    			const json = await res.json();
    			$$invalidate(0, datosApi = json);
    		} else {
    			console.log("Error"); //console.log("Received "+ plugins.length + " plugin vehicles");
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$7.warn(`<BasketIntegration> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("BasketIntegration", $$slots, []);

    	$$self.$capture_state = () => ({
    		Button,
    		pop,
    		onMount,
    		Table,
    		loadGraph: loadGraph$4,
    		datosApi,
    		getApi
    	});

    	$$self.$inject_state = $$props => {
    		if ("datosApi" in $$props) $$invalidate(0, datosApi = $$props.datosApi);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [datosApi, getApi];
    }

    class BasketIntegration extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BasketIntegration",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    }

    /* src\front\offworks_stats_API\integrations\drivingLicensesIntegration.svelte generated by Svelte v3.23.0 */

    const { console: console_1$8 } = globals;
    const file$q = "src\\front\\offworks_stats_API\\integrations\\drivingLicensesIntegration.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (166:4) <Button outline color = "secondary" on:click="{pop}">
    function create_default_slot_2$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$8.name,
    		type: "slot",
    		source: "(166:4) <Button outline color = \\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>      import Button from "sveltestrap/src/Button.svelte";      import { pop }
    function create_catch_block$6(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$6.name,
    		type: "catch",
    		source: "(1:0) <script>      import Button from \\\"sveltestrap/src/Button.svelte\\\";      import { pop }",
    		ctx
    	});

    	return block;
    }

    // (169:1) {:then getApi}
    function create_then_block$6(ctx) {
    	let current;

    	const table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, datosApi*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$6.name,
    		type: "then",
    		source: "(169:1) {:then getApi}",
    		ctx
    	});

    	return block;
    }

    // (186:12) {#each datosApi as datoApi}
    function create_each_block$4(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*datoApi*/ ctx[2].aut_com + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*datoApi*/ ctx[2].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*datoApi*/ ctx[2]["cars_men"] + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*datoApi*/ ctx[2]["cars_women"] + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*datoApi*/ ctx[2]["mot_men"] + "";
    	let t8;
    	let t9;
    	let td5;
    	let t10_value = /*datoApi*/ ctx[2]["mot_women"] + "";
    	let t10;
    	let t11;
    	let td6;
    	let t12_value = /*datoApi*/ ctx[2]["total_cars"] + "";
    	let t12;
    	let t13;
    	let td7;
    	let t14_value = /*datoApi*/ ctx[2]["total_mot"] + "";
    	let t14;
    	let t15;
    	let td8;
    	let t16_value = /*datoApi*/ ctx[2]["rel_cars"] + "";
    	let t16;
    	let t17;
    	let td9;
    	let t18_value = /*datoApi*/ ctx[2]["rel_mot"] + "";
    	let t18;
    	let t19;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			t10 = text(t10_value);
    			t11 = space();
    			td6 = element("td");
    			t12 = text(t12_value);
    			t13 = space();
    			td7 = element("td");
    			t14 = text(t14_value);
    			t15 = space();
    			td8 = element("td");
    			t16 = text(t16_value);
    			t17 = space();
    			td9 = element("td");
    			t18 = text(t18_value);
    			t19 = space();
    			add_location(td0, file$q, 187, 20, 5787);
    			add_location(td1, file$q, 188, 20, 5835);
    			add_location(td2, file$q, 189, 20, 5880);
    			add_location(td3, file$q, 190, 20, 5932);
    			add_location(td4, file$q, 191, 20, 5986);
    			add_location(td5, file$q, 192, 20, 6037);
    			add_location(td6, file$q, 193, 20, 6090);
    			add_location(td7, file$q, 194, 20, 6144);
    			add_location(td8, file$q, 195, 20, 6197);
    			add_location(td9, file$q, 196, 20, 6249);
    			add_location(tr, file$q, 186, 4, 5761);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, t10);
    			append_dev(tr, t11);
    			append_dev(tr, td6);
    			append_dev(td6, t12);
    			append_dev(tr, t13);
    			append_dev(tr, td7);
    			append_dev(td7, t14);
    			append_dev(tr, t15);
    			append_dev(tr, td8);
    			append_dev(td8, t16);
    			append_dev(tr, t17);
    			append_dev(tr, td9);
    			append_dev(td9, t18);
    			append_dev(tr, t19);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*datosApi*/ 1 && t0_value !== (t0_value = /*datoApi*/ ctx[2].aut_com + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*datosApi*/ 1 && t2_value !== (t2_value = /*datoApi*/ ctx[2].year + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*datosApi*/ 1 && t4_value !== (t4_value = /*datoApi*/ ctx[2]["cars_men"] + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*datosApi*/ 1 && t6_value !== (t6_value = /*datoApi*/ ctx[2]["cars_women"] + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*datosApi*/ 1 && t8_value !== (t8_value = /*datoApi*/ ctx[2]["mot_men"] + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*datosApi*/ 1 && t10_value !== (t10_value = /*datoApi*/ ctx[2]["mot_women"] + "")) set_data_dev(t10, t10_value);
    			if (dirty & /*datosApi*/ 1 && t12_value !== (t12_value = /*datoApi*/ ctx[2]["total_cars"] + "")) set_data_dev(t12, t12_value);
    			if (dirty & /*datosApi*/ 1 && t14_value !== (t14_value = /*datoApi*/ ctx[2]["total_mot"] + "")) set_data_dev(t14, t14_value);
    			if (dirty & /*datosApi*/ 1 && t16_value !== (t16_value = /*datoApi*/ ctx[2]["rel_cars"] + "")) set_data_dev(t16, t16_value);
    			if (dirty & /*datosApi*/ 1 && t18_value !== (t18_value = /*datoApi*/ ctx[2]["rel_mot"] + "")) set_data_dev(t18, t18_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(186:12) {#each datosApi as datoApi}",
    		ctx
    	});

    	return block;
    }

    // (170:4) <Table bordered>
    function create_default_slot_1$a(ctx) {
    	let thead;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let th6;
    	let t13;
    	let th7;
    	let t15;
    	let th8;
    	let t17;
    	let th9;
    	let t19;
    	let tbody;
    	let each_value = /*datosApi*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Comunidad";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Coches hombres";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Coches mujeres";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Motos hombres";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Motos mujeres";
    			t11 = space();
    			th6 = element("th");
    			th6.textContent = "Total de coches";
    			t13 = space();
    			th7 = element("th");
    			th7.textContent = "Total de motos";
    			t15 = space();
    			th8 = element("th");
    			th8.textContent = "Relacion coches";
    			t17 = space();
    			th9 = element("th");
    			th9.textContent = "Relacion motos";
    			t19 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$q, 172, 16, 5284);
    			add_location(th1, file$q, 173, 16, 5320);
    			add_location(th2, file$q, 174, 16, 5350);
    			add_location(th3, file$q, 175, 16, 5391);
    			add_location(th4, file$q, 176, 16, 5432);
    			add_location(th5, file$q, 177, 16, 5472);
    			add_location(th6, file$q, 178, 16, 5512);
    			add_location(th7, file$q, 179, 16, 5554);
    			add_location(th8, file$q, 180, 16, 5595);
    			add_location(th9, file$q, 181, 16, 5637);
    			add_location(tr, file$q, 171, 12, 5262);
    			add_location(thead, file$q, 170, 8, 5241);
    			add_location(tbody, file$q, 184, 8, 5707);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(tr, t7);
    			append_dev(tr, th4);
    			append_dev(tr, t9);
    			append_dev(tr, th5);
    			append_dev(tr, t11);
    			append_dev(tr, th6);
    			append_dev(tr, t13);
    			append_dev(tr, th7);
    			append_dev(tr, t15);
    			append_dev(tr, th8);
    			append_dev(tr, t17);
    			append_dev(tr, th9);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*datosApi*/ 1) {
    				each_value = /*datosApi*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$a.name,
    		type: "slot",
    		source: "(170:4) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (167:19)     Loading driving-licenses ...   {:then getApi}
    function create_pending_block$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading driving-licenses ...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$6.name,
    		type: "pending",
    		source: "(167:19)     Loading driving-licenses ...   {:then getApi}",
    		ctx
    	});

    	return block;
    }

    // (203:4) <Button outline color = "secondary" on:click="{pop}">
    function create_default_slot$e(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$e.name,
    		type: "slot",
    		source: "(203:4) <Button outline color = \\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let script4;
    	let script4_src_value;
    	let t0;
    	let main;
    	let figure;
    	let div;
    	let t1;
    	let p;
    	let t3;
    	let t4;
    	let promise;
    	let t5;
    	let current;
    	let mounted;
    	let dispose;

    	const button0 = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot_2$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", pop);

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block$6,
    		then: create_then_block$6,
    		catch: create_catch_block$6,
    		value: 1,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*getApi*/ ctx[1], info);

    	const button1 = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$e] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", pop);

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			script4 = element("script");
    			t0 = space();
    			main = element("main");
    			figure = element("figure");
    			div = element("div");
    			t1 = space();
    			p = element("p");
    			p.textContent = "Relación de las Comunidades en el año 2007 entre enfermedades laborales y\r\n            puntos,triples y rebotes en Comunidades Autonomas.";
    			t3 = space();
    			create_component(button0.$$.fragment);
    			t4 = space();
    			info.block.c();
    			t5 = space();
    			create_component(button1.$$.fragment);
    			if (script0.src !== (script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$q, 150, 4, 4331);
    			if (script1.src !== (script1_src_value = "https://code.highcharts.com/modules/series-label.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$q, 151, 4, 4402);
    			if (script2.src !== (script2_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$q, 152, 4, 4483);
    			if (script3.src !== (script3_src_value = "https://code.highcharts.com/modules/export-data.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$q, 153, 4, 4561);
    			if (script4.src !== (script4_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script4, "src", script4_src_value);
    			add_location(script4, file$q, 154, 4, 4641);
    			attr_dev(div, "id", "container");
    			add_location(div, file$q, 159, 8, 4815);
    			attr_dev(p, "class", "highcharts-description");
    			add_location(p, file$q, 160, 8, 4851);
    			attr_dev(figure, "class", "highcharts-figure");
    			add_location(figure, file$q, 158, 4, 4771);
    			add_location(main, file$q, 157, 0, 4759);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			append_dev(document.head, script4);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, div);
    			append_dev(figure, t1);
    			append_dev(figure, p);
    			append_dev(main, t3);
    			mount_component(button0, main, null);
    			append_dev(main, t4);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t5;
    			append_dev(main, t5);
    			mount_component(button1, main, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(script4, "load", loadGraph$5, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);

    			{
    				const child_ctx = ctx.slice();
    				child_ctx[1] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}

    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(info.block);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			detach_dev(script4);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button0);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_component(button1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function loadGraph$5() {
    	let MyData = [];
    	let comunidades = [];
    	let accidentes = [];
    	const resData = await fetch("api/v2/offworks-stats");
    	MyData = await resData.json();

    	MyData.forEach(data => {
    		let comunidad = data.community;
    		let year = data.year;
    		let accidente = data["accident"];
    		let enfermo = data["sick"];
    		let num = data["numberzone"];

    		if (data.year == 2007) {
    			comunidades.push(comunidad);
    			accidentes.push(accidente);
    		}
    	});

    	let dataExt = [];

    	//let years = [];
    	let mot_mens = [];

    	let mot_womens = [];
    	let total_mots = [];
    	let cont = 0;
    	const resDataExt = await fetch("/api/v2/driving-licenses");
    	dataExt = await resDataExt.json();

    	dataExt.forEach(data => {
    		let comu = data.aut_com;
    		let year = data.year;
    		let mot_men = data["mot_men"];
    		let mot_women = data["mot_women"];
    		let total_mot = data["total_mot"];

    		if (data.year == 2018 && cont <= 7) {

    			mot_mens.push(mot_men);
    			mot_womens.push(mot_women);
    			total_mots.push(total_mot);
    			cont++;
    		}
    	});

    	//console.log(mot_mens+" "+mot_mens.length);
    	Highcharts.chart("container", {
    		chart: { type: "line" },
    		title: {
    			text: "Comunidades-Accidentes-Hombres y Mujeres en moto"
    		},
    		subtitle: {
    			text: "Integracion offworksApi y DrivingLicenseApi",
    			align: "right",
    			verticalAlign: "bottom"
    		},
    		yAxis: {
    			title: { text: "Numero de accidentes y zonas" }
    		},
    		xAxis: { categories: comunidades },
    		legend: {
    			layout: "vertical",
    			align: "right",
    			verticalAlign: "middle"
    		},
    		plotOptions: {
    			series: {
    				label: { connectorAllowed: false },
    				enableMouseTracking: false
    			}
    		},
    		series: [
    			{ name: "Hombres en moto", data: mot_mens },
    			{
    				name: "Mujeres en moto",
    				data: mot_womens
    			},
    			{ name: "Total de motos", data: total_mots },
    			{
    				name: "baja por accidente",
    				data: accidentes
    			}
    		],
    		responsive: {
    			rules: [
    				{
    					condition: { maxWidth: 500 },
    					chartOptions: {
    						legend: {
    							layout: "horizontal",
    							align: "center",
    							verticalAlign: "bottom"
    						}
    					}
    				}
    			]
    		}
    	});
    }

    function instance$r($$self, $$props, $$invalidate) {
    	onMount(getApi);
    	
    	let datosApi = [];

    	async function getApi() {
    		//console.log("Fetching plugin vehicles..");
    		const res = await fetch("/api/v2/driving-licenses");

    		if (res.ok) {
    			console.log("ok");
    			const json = await res.json();
    			$$invalidate(0, datosApi = json);
    		} else {
    			console.log("Error"); //console.log("Received "+ plugins.length + " plugin vehicles");
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$8.warn(`<DrivingLicensesIntegration> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("DrivingLicensesIntegration", $$slots, []);

    	$$self.$capture_state = () => ({
    		Button,
    		pop,
    		onMount,
    		Table,
    		loadGraph: loadGraph$5,
    		datosApi,
    		getApi
    	});

    	$$self.$inject_state = $$props => {
    		if ("datosApi" in $$props) $$invalidate(0, datosApi = $$props.datosApi);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [datosApi, getApi];
    }

    class DrivingLicensesIntegration extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DrivingLicensesIntegration",
    			options,
    			id: create_fragment$r.name
    		});
    	}
    }

    /* src\front\CigarretesAPI\CigarretesTable.svelte generated by Svelte v3.23.0 */

    const { console: console_1$9 } = globals;
    const file$r = "src\\front\\CigarretesAPI\\CigarretesTable.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[35] = list[i];
    	return child_ctx;
    }

    // (200:2) {#if errorMsg}
    function create_if_block_3$4(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Error: ");
    			t1 = text(/*errorMsg*/ ctx[0]);
    			set_style(p, "color", "red");
    			add_location(p, file$r, 200, 2, 5115);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*errorMsg*/ 1) set_data_dev(t1, /*errorMsg*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$4.name,
    		type: "if",
    		source: "(200:2) {#if errorMsg}",
    		ctx
    	});

    	return block;
    }

    // (203:2) {#if exitoMsg}
    function create_if_block_2$5(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Éxito: ");
    			t1 = text(/*exitoMsg*/ ctx[1]);
    			set_style(p, "color", "blue");
    			add_location(p, file$r, 203, 2, 5190);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*exitoMsg*/ 2) set_data_dev(t1, /*exitoMsg*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(203:2) {#if exitoMsg}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>   import { onMount }
    function create_catch_block$7(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$7.name,
    		type: "catch",
    		source: "(1:0) <script>   import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (209:2) {:then cigarretes}
    function create_then_block$7(ctx) {
    	let p;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let current;

    	const formgroup0 = new FormGroup({
    			props: {
    				style: "width: 15%;",
    				$$slots: { default: [create_default_slot_22] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const formgroup1 = new FormGroup({
    			props: {
    				style: "width: 15%;",
    				$$slots: { default: [create_default_slot_20$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				class: "button-search",
    				$$slots: { default: [create_default_slot_19$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*searchCigarretes*/ ctx[15](/*searchCommunity*/ ctx[3], /*searchYear*/ ctx[4]))) /*searchCigarretes*/ ctx[15](/*searchCommunity*/ ctx[3], /*searchYear*/ ctx[4]).apply(this, arguments);
    	});

    	const table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_9$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Estás en la página: ");
    			t1 = text(/*paginaActual*/ ctx[5]);
    			t2 = space();
    			create_component(formgroup0.$$.fragment);
    			t3 = space();
    			create_component(formgroup1.$$.fragment);
    			t4 = space();
    			create_component(button.$$.fragment);
    			t5 = space();
    			create_component(table.$$.fragment);
    			add_location(p, file$r, 209, 2, 5329);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			insert_dev(target, t2, anchor);
    			mount_component(formgroup0, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(formgroup1, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(button, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (!current || dirty[0] & /*paginaActual*/ 32) set_data_dev(t1, /*paginaActual*/ ctx[5]);
    			const formgroup0_changes = {};

    			if (dirty[0] & /*searchCommunity*/ 8 | dirty[1] & /*$$scope*/ 128) {
    				formgroup0_changes.$$scope = { dirty, ctx };
    			}

    			formgroup0.$set(formgroup0_changes);
    			const formgroup1_changes = {};

    			if (dirty[0] & /*searchYear*/ 16 | dirty[1] & /*$$scope*/ 128) {
    				formgroup1_changes.$$scope = { dirty, ctx };
    			}

    			formgroup1.$set(formgroup1_changes);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 128) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			const table_changes = {};

    			if (dirty[0] & /*cigarretes, newCigarrete, isOpen*/ 772 | dirty[1] & /*$$scope*/ 128) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formgroup0.$$.fragment, local);
    			transition_in(formgroup1.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formgroup0.$$.fragment, local);
    			transition_out(formgroup1.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t2);
    			destroy_component(formgroup0, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(formgroup1, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(button, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$7.name,
    		type: "then",
    		source: "(209:2) {:then cigarretes}",
    		ctx
    	});

    	return block;
    }

    // (214:2) <FormGroup style="width: 15%;">
    function create_default_slot_22(ctx) {
    	let updating_value;
    	let current;

    	function input_value_binding(value) {
    		/*input_value_binding*/ ctx[23].call(null, value);
    	}

    	let input_props = {
    		placeholder: "Introduce la comunidad",
    		name: "community",
    		id: "community"
    	};

    	if (/*searchCommunity*/ ctx[3] !== void 0) {
    		input_props.value = /*searchCommunity*/ ctx[3];
    	}

    	const input = new Input({ props: input_props, $$inline: true });
    	binding_callbacks.push(() => bind(input, "value", input_value_binding));

    	const block = {
    		c: function create() {
    			create_component(input.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const input_changes = {};

    			if (dirty[1] & /*$$scope*/ 128) {
    				input_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty[0] & /*searchCommunity*/ 8) {
    				updating_value = true;
    				input_changes.value = /*searchCommunity*/ ctx[3];
    				add_flush_callback(() => updating_value = false);
    			}

    			input.$set(input_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_22.name,
    		type: "slot",
    		source: "(214:2) <FormGroup style=\\\"width: 15%;\\\">",
    		ctx
    	});

    	return block;
    }

    // (219:2) <FormGroup style="width: 15%;">
    function create_default_slot_20$1(ctx) {
    	let updating_value;
    	let current;

    	function input_value_binding_1(value) {
    		/*input_value_binding_1*/ ctx[24].call(null, value);
    	}

    	let input_props = {
    		placeholder: "Introduce el año",
    		name: "year",
    		id: "year"
    	};

    	if (/*searchYear*/ ctx[4] !== void 0) {
    		input_props.value = /*searchYear*/ ctx[4];
    	}

    	const input = new Input({ props: input_props, $$inline: true });
    	binding_callbacks.push(() => bind(input, "value", input_value_binding_1));

    	const block = {
    		c: function create() {
    			create_component(input.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const input_changes = {};

    			if (dirty[1] & /*$$scope*/ 128) {
    				input_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty[0] & /*searchYear*/ 16) {
    				updating_value = true;
    				input_changes.value = /*searchYear*/ ctx[4];
    				add_flush_callback(() => updating_value = false);
    			}

    			input.$set(input_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20$1.name,
    		type: "slot",
    		source: "(219:2) <FormGroup style=\\\"width: 15%;\\\">",
    		ctx
    	});

    	return block;
    }

    // (224:2) <Button outline color="primary" on:click="{searchCigarretes(searchCommunity, searchYear)}" class="button-search">
    function create_default_slot_19$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Buscar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19$2.name,
    		type: "slot",
    		source: "(224:2) <Button outline color=\\\"primary\\\" on:click=\\\"{searchCigarretes(searchCommunity, searchYear)}\\\" class=\\\"button-search\\\">",
    		ctx
    	});

    	return block;
    }

    // (237:7) <DropdownToggle outline caret>
    function create_default_slot_18$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gráficas");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18$2.name,
    		type: "slot",
    		source: "(237:7) <DropdownToggle outline caret>",
    		ctx
    	});

    	return block;
    }

    // (239:8) <DropdownItem href="#/graph-cigarretes-sales">
    function create_default_slot_17$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("HighChart");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17$2.name,
    		type: "slot",
    		source: "(239:8) <DropdownItem href=\\\"#/graph-cigarretes-sales\\\">",
    		ctx
    	});

    	return block;
    }

    // (240:8) <DropdownItem href="#/graph-chartjs">
    function create_default_slot_16$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Chart.js");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16$2.name,
    		type: "slot",
    		source: "(240:8) <DropdownItem href=\\\"#/graph-chartjs\\\">",
    		ctx
    	});

    	return block;
    }

    // (238:7) <DropdownMenu>
    function create_default_slot_15$2(ctx) {
    	let t;
    	let current;

    	const dropdownitem0 = new DropdownItem({
    			props: {
    				href: "#/graph-cigarretes-sales",
    				$$slots: { default: [create_default_slot_17$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const dropdownitem1 = new DropdownItem({
    			props: {
    				href: "#/graph-chartjs",
    				$$slots: { default: [create_default_slot_16$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dropdownitem0.$$.fragment);
    			t = space();
    			create_component(dropdownitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty[1] & /*$$scope*/ 128) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem1_changes = {};

    			if (dirty[1] & /*$$scope*/ 128) {
    				dropdownitem1_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem1.$set(dropdownitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdownitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(dropdownitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15$2.name,
    		type: "slot",
    		source: "(238:7) <DropdownMenu>",
    		ctx
    	});

    	return block;
    }

    // (236:6) <Dropdown {isOpen} toggle={() => (isOpen = !isOpen)}>
    function create_default_slot_14$2(ctx) {
    	let t;
    	let current;

    	const dropdowntoggle = new DropdownToggle({
    			props: {
    				outline: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_18$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const dropdownmenu = new DropdownMenu({
    			props: {
    				$$slots: { default: [create_default_slot_15$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dropdowntoggle.$$.fragment);
    			t = space();
    			create_component(dropdownmenu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty[1] & /*$$scope*/ 128) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty[1] & /*$$scope*/ 128) {
    				dropdownmenu_changes.$$scope = { dirty, ctx };
    			}

    			dropdownmenu.$set(dropdownmenu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdowntoggle.$$.fragment, local);
    			transition_in(dropdownmenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdowntoggle.$$.fragment, local);
    			transition_out(dropdownmenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdowntoggle, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(dropdownmenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14$2.name,
    		type: "slot",
    		source: "(236:6) <Dropdown {isOpen} toggle={() => (isOpen = !isOpen)}>",
    		ctx
    	});

    	return block;
    }

    // (259:9) <Button outline color="primary"  on:click={insertCigarretes}>
    function create_default_slot_13$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Insertar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13$2.name,
    		type: "slot",
    		source: "(259:9) <Button outline color=\\\"primary\\\"  on:click={insertCigarretes}>",
    		ctx
    	});

    	return block;
    }

    // (275:9) <Button outline color="danger" on:click="{deleteCigarretes(cigarrete.community,cigarrete.year)}">
    function create_default_slot_12$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12$3.name,
    		type: "slot",
    		source: "(275:9) <Button outline color=\\\"danger\\\" on:click=\\\"{deleteCigarretes(cigarrete.community,cigarrete.year)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (262:4) {#each cigarretes as cigarrete}
    function create_each_block$5(ctx) {
    	let tr;
    	let td0;
    	let a;
    	let t0_value = /*cigarrete*/ ctx[35].community + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let td1;
    	let t2_value = /*cigarrete*/ ctx[35].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*cigarrete*/ ctx[35].cigarrete_sale + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*cigarrete*/ ctx[35].first_variation + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*cigarrete*/ ctx[35].second_variation + "";
    	let t8;
    	let t9;
    	let td5;
    	let current;

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_12$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*deleteCigarretes*/ ctx[11](/*cigarrete*/ ctx[35].community, /*cigarrete*/ ctx[35].year))) /*deleteCigarretes*/ ctx[11](/*cigarrete*/ ctx[35].community, /*cigarrete*/ ctx[35].year).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			attr_dev(a, "href", a_href_value = "#/cigarretes-sales/" + /*cigarrete*/ ctx[35].community + "/" + /*cigarrete*/ ctx[35].year);
    			add_location(a, file$r, 268, 6, 7083);
    			add_location(td0, file$r, 267, 5, 7071);
    			add_location(td1, file$r, 270, 5, 7195);
    			add_location(td2, file$r, 271, 5, 7227);
    			add_location(td3, file$r, 272, 5, 7269);
    			add_location(td4, file$r, 273, 5, 7312);
    			add_location(td5, file$r, 274, 5, 7356);
    			add_location(tr, file$r, 264, 4, 7051);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, a);
    			append_dev(a, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			mount_component(button, td5, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*cigarretes*/ 512) && t0_value !== (t0_value = /*cigarrete*/ ctx[35].community + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty[0] & /*cigarretes*/ 512 && a_href_value !== (a_href_value = "#/cigarretes-sales/" + /*cigarrete*/ ctx[35].community + "/" + /*cigarrete*/ ctx[35].year)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if ((!current || dirty[0] & /*cigarretes*/ 512) && t2_value !== (t2_value = /*cigarrete*/ ctx[35].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*cigarretes*/ 512) && t4_value !== (t4_value = /*cigarrete*/ ctx[35].cigarrete_sale + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*cigarretes*/ 512) && t6_value !== (t6_value = /*cigarrete*/ ctx[35].first_variation + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*cigarretes*/ 512) && t8_value !== (t8_value = /*cigarrete*/ ctx[35].second_variation + "")) set_data_dev(t8, t8_value);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 128) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(262:4) {#each cigarretes as cigarrete}",
    		ctx
    	});

    	return block;
    }

    // (282:9) <Button outline color="primary" onclick="location.reload()" on:click={loadInitialData}>
    function create_default_slot_11$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Inicializar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11$3.name,
    		type: "slot",
    		source: "(282:9) <Button outline color=\\\"primary\\\" onclick=\\\"location.reload()\\\" on:click={loadInitialData}>",
    		ctx
    	});

    	return block;
    }

    // (287:9) <Button  outline color = "danger" onclick="location.reload()" on:click="{deleteAllCigarretes}">
    function create_default_slot_10$3(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text("Borrar todo");
    			attr_dev(i, "class", "fa fa-trash");
    			attr_dev(i, "aria-hidden", "true");
    			add_location(i, file$r, 286, 104, 7976);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$3.name,
    		type: "slot",
    		source: "(287:9) <Button  outline color = \\\"danger\\\" onclick=\\\"location.reload()\\\" on:click=\\\"{deleteAllCigarretes}\\\">",
    		ctx
    	});

    	return block;
    }

    // (226:2) <Table  bordered>
    function create_default_slot_9$4(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t10;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let input0_pattern_value;
    	let t11;
    	let td1;
    	let input1;
    	let t12;
    	let td2;
    	let input2;
    	let t13;
    	let td3;
    	let input3;
    	let t14;
    	let td4;
    	let input4;
    	let t15;
    	let td5;
    	let t16;
    	let t17;
    	let tr2;
    	let td6;
    	let button1;
    	let t19;
    	let tr3;
    	let td7;
    	let t20;
    	let td8;
    	let t21;
    	let td9;
    	let t22;
    	let td10;
    	let t23;
    	let td11;
    	let t24;
    	let td12;
    	let current;
    	let mounted;
    	let dispose;

    	const dropdown = new Dropdown({
    			props: {
    				isOpen: /*isOpen*/ ctx[8],
    				toggle: /*func*/ ctx[25],
    				$$slots: { default: [create_default_slot_14$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button0 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_13$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*insertCigarretes*/ ctx[10]);
    	let each_value = /*cigarretes*/ ctx[9];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const button2 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				onclick: "location.reload()",
    				$$slots: { default: [create_default_slot_11$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*loadInitialData*/ ctx[13]);

    	const button3 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				onclick: "location.reload()",
    				$$slots: { default: [create_default_slot_10$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button3.$on("click", /*deleteAllCigarretes*/ ctx[12]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Comunidad";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Venta de paquetes";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Primera variacion";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Segunda variacion";
    			t9 = space();
    			th5 = element("th");
    			create_component(dropdown.$$.fragment);
    			t10 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t11 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t12 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t13 = space();
    			td3 = element("td");
    			input3 = element("input");
    			t14 = space();
    			td4 = element("td");
    			input4 = element("input");
    			t15 = space();
    			td5 = element("td");
    			create_component(button0.$$.fragment);
    			t16 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t17 = space();
    			tr2 = element("tr");
    			td6 = element("td");
    			button1 = element("button");
    			button1.textContent = "Pulse para ver la gráfica";
    			t19 = space();
    			tr3 = element("tr");
    			td7 = element("td");
    			create_component(button2.$$.fragment);
    			t20 = space();
    			td8 = element("td");
    			t21 = space();
    			td9 = element("td");
    			t22 = space();
    			td10 = element("td");
    			t23 = space();
    			td11 = element("td");
    			t24 = space();
    			td12 = element("td");
    			create_component(button3.$$.fragment);
    			add_location(th0, file$r, 229, 5, 5914);
    			add_location(th1, file$r, 230, 5, 5939);
    			add_location(th2, file$r, 231, 5, 5958);
    			add_location(th3, file$r, 232, 5, 5991);
    			add_location(th4, file$r, 233, 5, 6024);
    			add_location(th5, file$r, 234, 5, 6057);
    			add_location(tr0, file$r, 227, 4, 5901);
    			add_location(thead, file$r, 226, 3, 5888);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "pattern", input0_pattern_value = "[A-Za-z]" + (2 - 60));
    			add_location(input0, file$r, 253, 9, 6496);
    			add_location(td0, file$r, 253, 5, 6492);
    			attr_dev(input1, "type", "number");
    			add_location(input1, file$r, 254, 9, 6595);
    			add_location(td1, file$r, 254, 5, 6591);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$r, 255, 9, 6665);
    			add_location(td2, file$r, 255, 5, 6661);
    			attr_dev(input3, "type", "number");
    			add_location(input3, file$r, 256, 9, 6745);
    			add_location(td3, file$r, 256, 5, 6741);
    			attr_dev(input4, "type", "number");
    			add_location(input4, file$r, 257, 9, 6826);
    			add_location(td4, file$r, 257, 5, 6822);
    			add_location(td5, file$r, 258, 5, 6904);
    			add_location(tr1, file$r, 251, 4, 6479);
    			attr_dev(button1, "outline", "");
    			attr_dev(button1, "color", "primary");
    			attr_dev(button1, "href", "");
    			add_location(button1, file$r, 278, 9, 7522);
    			add_location(td6, file$r, 278, 5, 7518);
    			add_location(tr2, file$r, 277, 4, 7507);
    			add_location(td7, file$r, 281, 5, 7630);
    			add_location(td8, file$r, 282, 20, 7768);
    			add_location(td9, file$r, 283, 20, 7799);
    			add_location(td10, file$r, 284, 20, 7830);
    			add_location(td11, file$r, 285, 20, 7861);
    			add_location(td12, file$r, 286, 5, 7877);
    			add_location(tr3, file$r, 280, 4, 7619);
    			add_location(tbody, file$r, 249, 3, 6464);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			mount_component(dropdown, th5, null);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*newCigarrete*/ ctx[2].community);
    			append_dev(tr1, t11);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*newCigarrete*/ ctx[2].year);
    			append_dev(tr1, t12);
    			append_dev(tr1, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*newCigarrete*/ ctx[2].cigarrete_sale);
    			append_dev(tr1, t13);
    			append_dev(tr1, td3);
    			append_dev(td3, input3);
    			set_input_value(input3, /*newCigarrete*/ ctx[2].first_variation);
    			append_dev(tr1, t14);
    			append_dev(tr1, td4);
    			append_dev(td4, input4);
    			set_input_value(input4, /*newCigarrete*/ ctx[2].second_variation);
    			append_dev(tr1, t15);
    			append_dev(tr1, td5);
    			mount_component(button0, td5, null);
    			append_dev(tbody, t16);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			append_dev(tbody, t17);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td6);
    			append_dev(td6, button1);
    			append_dev(tbody, t19);
    			append_dev(tbody, tr3);
    			append_dev(tr3, td7);
    			mount_component(button2, td7, null);
    			append_dev(tr3, t20);
    			append_dev(tr3, td8);
    			append_dev(tr3, t21);
    			append_dev(tr3, td9);
    			append_dev(tr3, t22);
    			append_dev(tr3, td10);
    			append_dev(tr3, t23);
    			append_dev(tr3, td11);
    			append_dev(tr3, t24);
    			append_dev(tr3, td12);
    			mount_component(button3, td12, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[26]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[27]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[28]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[29]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[30])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const dropdown_changes = {};
    			if (dirty[0] & /*isOpen*/ 256) dropdown_changes.isOpen = /*isOpen*/ ctx[8];
    			if (dirty[0] & /*isOpen*/ 256) dropdown_changes.toggle = /*func*/ ctx[25];

    			if (dirty[1] & /*$$scope*/ 128) {
    				dropdown_changes.$$scope = { dirty, ctx };
    			}

    			dropdown.$set(dropdown_changes);

    			if (dirty[0] & /*newCigarrete*/ 4 && input0.value !== /*newCigarrete*/ ctx[2].community) {
    				set_input_value(input0, /*newCigarrete*/ ctx[2].community);
    			}

    			if (dirty[0] & /*newCigarrete*/ 4 && to_number(input1.value) !== /*newCigarrete*/ ctx[2].year) {
    				set_input_value(input1, /*newCigarrete*/ ctx[2].year);
    			}

    			if (dirty[0] & /*newCigarrete*/ 4 && to_number(input2.value) !== /*newCigarrete*/ ctx[2].cigarrete_sale) {
    				set_input_value(input2, /*newCigarrete*/ ctx[2].cigarrete_sale);
    			}

    			if (dirty[0] & /*newCigarrete*/ 4 && to_number(input3.value) !== /*newCigarrete*/ ctx[2].first_variation) {
    				set_input_value(input3, /*newCigarrete*/ ctx[2].first_variation);
    			}

    			if (dirty[0] & /*newCigarrete*/ 4 && to_number(input4.value) !== /*newCigarrete*/ ctx[2].second_variation) {
    				set_input_value(input4, /*newCigarrete*/ ctx[2].second_variation);
    			}

    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 128) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);

    			if (dirty[0] & /*deleteCigarretes, cigarretes*/ 2560) {
    				each_value = /*cigarretes*/ ctx[9];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, t17);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const button2_changes = {};

    			if (dirty[1] & /*$$scope*/ 128) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    			const button3_changes = {};

    			if (dirty[1] & /*$$scope*/ 128) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdown.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(button2.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdown.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(button2.$$.fragment, local);
    			transition_out(button3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			destroy_component(dropdown);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button0);
    			destroy_each(each_blocks, detaching);
    			destroy_component(button2);
    			destroy_component(button3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$4.name,
    		type: "slot",
    		source: "(226:2) <Table  bordered>",
    		ctx
    	});

    	return block;
    }

    // (207:21)       Loading cigarretes-sales ...    {:then cigarretes}
    function create_pending_block$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading cigarretes-sales ...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$7.name,
    		type: "pending",
    		source: "(207:21)       Loading cigarretes-sales ...    {:then cigarretes}",
    		ctx
    	});

    	return block;
    }

    // (299:2) {#if paginaActual !=1}
    function create_if_block_1$8(ctx) {
    	let t;
    	let current;

    	const paginationitem0 = new PaginationItem({
    			props: {
    				class: /*paginaActual*/ ctx[5] == 1 ? "disabled" : "",
    				$$slots: { default: [create_default_slot_8$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const paginationitem1 = new PaginationItem({
    			props: {
    				$$slots: { default: [create_default_slot_6$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem0.$$.fragment);
    			t = space();
    			create_component(paginationitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(paginationitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem0_changes = {};
    			if (dirty[0] & /*paginaActual*/ 32) paginationitem0_changes.class = /*paginaActual*/ ctx[5] == 1 ? "disabled" : "";

    			if (dirty[1] & /*$$scope*/ 128) {
    				paginationitem0_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem0.$set(paginationitem0_changes);
    			const paginationitem1_changes = {};

    			if (dirty[0] & /*paginaActual*/ 32 | dirty[1] & /*$$scope*/ 128) {
    				paginationitem1_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem1.$set(paginationitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem0.$$.fragment, local);
    			transition_in(paginationitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem0.$$.fragment, local);
    			transition_out(paginationitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(paginationitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(299:2) {#if paginaActual !=1}",
    		ctx
    	});

    	return block;
    }

    // (300:2) <PaginationItem class="{paginaActual == 1 ? 'disabled' : ''}">
    function create_default_slot_8$4(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				previous: true,
    				href: "#/cigarretes-sales"
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler*/ ctx[31]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$4.name,
    		type: "slot",
    		source: "(300:2) <PaginationItem class=\\\"{paginaActual == 1 ? 'disabled' : ''}\\\">",
    		ctx
    	});

    	return block;
    }

    // (306:3) <PaginationLink href ="#/cigarretes-sales" on:click="{() => incOffset(-1)}">
    function create_default_slot_7$4(ctx) {
    	let t_value = /*paginaActual*/ ctx[5] - 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*paginaActual*/ 32 && t_value !== (t_value = /*paginaActual*/ ctx[5] - 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$4.name,
    		type: "slot",
    		source: "(306:3) <PaginationLink href =\\\"#/cigarretes-sales\\\" on:click=\\\"{() => incOffset(-1)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (305:2) <PaginationItem>
    function create_default_slot_6$4(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				href: "#/cigarretes-sales",
    				$$slots: { default: [create_default_slot_7$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_1*/ ctx[32]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*paginaActual*/ 32 | dirty[1] & /*$$scope*/ 128) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$4.name,
    		type: "slot",
    		source: "(305:2) <PaginationItem>",
    		ctx
    	});

    	return block;
    }

    // (311:3) <PaginationLink href="#/cigarretes-sales">
    function create_default_slot_5$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*paginaActual*/ ctx[5]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*paginaActual*/ 32) set_data_dev(t, /*paginaActual*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$4.name,
    		type: "slot",
    		source: "(311:3) <PaginationLink href=\\\"#/cigarretes-sales\\\">",
    		ctx
    	});

    	return block;
    }

    // (310:2) <PaginationItem active>
    function create_default_slot_4$5(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				href: "#/cigarretes-sales",
    				$$slots: { default: [create_default_slot_5$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*paginaActual*/ 32 | dirty[1] & /*$$scope*/ 128) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$5.name,
    		type: "slot",
    		source: "(310:2) <PaginationItem active>",
    		ctx
    	});

    	return block;
    }

    // (314:2) {#if paginaSiguiente && siguienteJson>= 9 }
    function create_if_block$d(ctx) {
    	let t;
    	let current;

    	const paginationitem0 = new PaginationItem({
    			props: {
    				$$slots: { default: [create_default_slot_2$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const paginationitem1 = new PaginationItem({
    			props: {
    				class: /*paginaSiguiente*/ ctx[6] ? "" : "disabled",
    				$$slots: { default: [create_default_slot_1$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem0.$$.fragment);
    			t = space();
    			create_component(paginationitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(paginationitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem0_changes = {};

    			if (dirty[0] & /*paginaActual*/ 32 | dirty[1] & /*$$scope*/ 128) {
    				paginationitem0_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem0.$set(paginationitem0_changes);
    			const paginationitem1_changes = {};
    			if (dirty[0] & /*paginaSiguiente*/ 64) paginationitem1_changes.class = /*paginaSiguiente*/ ctx[6] ? "" : "disabled";

    			if (dirty[1] & /*$$scope*/ 128) {
    				paginationitem1_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem1.$set(paginationitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem0.$$.fragment, local);
    			transition_in(paginationitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem0.$$.fragment, local);
    			transition_out(paginationitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(paginationitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(314:2) {#if paginaSiguiente && siguienteJson>= 9 }",
    		ctx
    	});

    	return block;
    }

    // (316:3) <PaginationLink href="#/cigarretes-sales" on:click="{() => incOffset(1)}">
    function create_default_slot_3$5(ctx) {
    	let t_value = /*paginaActual*/ ctx[5] + 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*paginaActual*/ 32 && t_value !== (t_value = /*paginaActual*/ ctx[5] + 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$5.name,
    		type: "slot",
    		source: "(316:3) <PaginationLink href=\\\"#/cigarretes-sales\\\" on:click=\\\"{() => incOffset(1)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (315:2) <PaginationItem>
    function create_default_slot_2$9(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				href: "#/cigarretes-sales",
    				$$slots: { default: [create_default_slot_3$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_2*/ ctx[33]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*paginaActual*/ 32 | dirty[1] & /*$$scope*/ 128) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$9.name,
    		type: "slot",
    		source: "(315:2) <PaginationItem>",
    		ctx
    	});

    	return block;
    }

    // (320:2) <PaginationItem class="{paginaSiguiente ? '' : 'disabled'}">
    function create_default_slot_1$b(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: { next: true, href: "#/cigarretes-sales" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_3*/ ctx[34]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$b.name,
    		type: "slot",
    		source: "(320:2) <PaginationItem class=\\\"{paginaSiguiente ? '' : 'disabled'}\\\">",
    		ctx
    	});

    	return block;
    }

    // (298:1) <Pagination float="center">
    function create_default_slot$f(ctx) {
    	let t0;
    	let t1;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*paginaActual*/ ctx[5] != 1 && create_if_block_1$8(ctx);

    	const paginationitem = new PaginationItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_4$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block1 = /*paginaSiguiente*/ ctx[6] && /*siguienteJson*/ ctx[7] >= 9 && create_if_block$d(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			create_component(paginationitem.$$.fragment);
    			t1 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(paginationitem, target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*paginaActual*/ ctx[5] != 1) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*paginaActual*/ 32) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$8(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const paginationitem_changes = {};

    			if (dirty[0] & /*paginaActual*/ 32 | dirty[1] & /*$$scope*/ 128) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);

    			if (/*paginaSiguiente*/ ctx[6] && /*siguienteJson*/ ctx[7] >= 9) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*paginaSiguiente, siguienteJson*/ 192) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$d(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(paginationitem.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(paginationitem.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(paginationitem, detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$f.name,
    		type: "slot",
    		source: "(298:1) <Pagination float=\\\"center\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let main;
    	let t0;
    	let t1;
    	let promise;
    	let t2;
    	let current;
    	let if_block0 = /*errorMsg*/ ctx[0] && create_if_block_3$4(ctx);
    	let if_block1 = /*exitoMsg*/ ctx[1] && create_if_block_2$5(ctx);

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block$7,
    		then: create_then_block$7,
    		catch: create_catch_block$7,
    		value: 9,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*cigarretes*/ ctx[9], info);

    	const pagination = new Pagination({
    			props: {
    				float: "center",
    				$$slots: { default: [create_default_slot$f] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			info.block.c();
    			t2 = space();
    			create_component(pagination.$$.fragment);
    			add_location(main, file$r, 198, 0, 5086);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t0);
    			if (if_block1) if_block1.m(main, null);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t2;
    			append_dev(main, t2);
    			mount_component(pagination, main, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*errorMsg*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3$4(ctx);
    					if_block0.c();
    					if_block0.m(main, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*exitoMsg*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2$5(ctx);
    					if_block1.c();
    					if_block1.m(main, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			info.ctx = ctx;

    			if (dirty[0] & /*cigarretes*/ 512 && promise !== (promise = /*cigarretes*/ ctx[9]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[9] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}

    			const pagination_changes = {};

    			if (dirty[0] & /*paginaSiguiente, paginaActual, siguienteJson*/ 224 | dirty[1] & /*$$scope*/ 128) {
    				pagination_changes.$$scope = { dirty, ctx };
    			}

    			pagination.$set(pagination_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			transition_in(pagination.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_component(pagination);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let errorMsg = "";
    	let exitoMsg = "";
    	let cigarretes = [];

    	let newCigarrete = {
    		community: "",
    		year: "",
    		cigarrete_sale: "",
    		first_variation: "",
    		second_variation: ""
    	};

    	//Para la búsqueda:
    	let communitys = [];

    	let years = [];
    	let community2 = "";
    	let year2 = "";
    	let searchCommunity = "";
    	let searchYear = "";

    	//Para la paginación:
    	let offset = 0;

    	let limit = 10;
    	let paginaActual = 1;
    	let paginaSiguiente = true;
    	let siguienteJson = 0;
    	onMount(paginationCigarretes);
    	let isOpen = false;

    	async function paginationCigarretes() {
    		console.log("Fetching cigarretes sales...");
    		const res = await fetch("/api/v2/cigarretes-sales?offset=" + limit * offset + "&limit=" + limit);
    		const siguiente = await fetch("/api/v2/cigarretes-sales");

    		//Await bloquea la instruccion, hasta que res tenga un valor
    		if (res.status == 200) {
    			console.log("OK:");
    			const json = await res.json();
    			$$invalidate(7, siguienteJson = json.length);
    			$$invalidate(9, cigarretes = json);
    			console.log("Received " + cigarretes.length + " cigarretes-sales.");

    			if (siguienteJson.length == 0) ;

    			console.log("Received " + cigarretes.length + " cigarretes.");
    		} else if (res.status == 404) {
    			$$invalidate(6, paginaSiguiente = false);
    			$$invalidate(1, exitoMsg = "Todos los elementos han sido borrados");
    		} else {
    			console.log("ERROR!");
    		}
    	}

    	async function insertCigarretes() {
    		const res = await fetch("/api/v2/cigarretes-sales", {
    			method: "POST",
    			body: JSON.stringify(newCigarrete),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			$$invalidate(1, exitoMsg = "Insertado correctamente");
    			paginationCigarretes();

    			if (res.status == 400) {
    				$$invalidate(0, errorMsg = "Revise los campos");
    			}

    			if (res.status == 409) {
    				$$invalidate(0, errorMsg = "Ya hay una comunidad con esos datos");
    			}
    		}); //cuando es res ok
    	}

    	async function deleteCigarretes(community, year) {
    		//si no ponemos la función asíncrona no podemos hacer el await.
    		console.log("Deleting cigarrete sale..");

    		const res = await fetch("/api/v2/cigarretes-sales/" + community + "/" + year, { method: "DELETE" }).then(function (res) {
    			paginationCigarretes();
    			$$invalidate(1, exitoMsg = "Elemento borrado correctamente");
    		});
    	}

    	async function deleteAllCigarretes() {
    		console.log("Deleting all cigarretes sales..");

    		const res = await fetch("/api/v2/cigarretes-sales", { method: "DELETE" }).then(function (res) {
    			paginationCigarretes();
    		});
    	}

    	async function loadInitialData() {
    		const res = await fetch("/api/v2/loadInitialData", { method: "GET" }).then(function (res) {
    			paginationCigarretes();
    		});
    	}

    	function incOffset(value) {
    		offset += value;
    		$$invalidate(5, paginaActual += value);
    		paginationCigarretes();
    	}

    	async function searchCigarretes(community2, year2) {
    		var url = "/api/v2/cigarretes-sales";

    		if (community2 != "" && year2 != "") {
    			url = url + "?community=" + community2 + "&year=" + year2;
    			const res = await fetch(url);

    			if (res.ok) {
    				$$invalidate(1, exitoMsg = "Búsqueda realizada correctamente");
    				console.log("OK");
    				const json = await res.json();
    				$$invalidate(9, cigarretes = json);
    			} else {
    				$$invalidate(0, errorMsg = "No existen datos para la comunidad de " + " " + community2 + " en el año " + " " + year2);
    				console.log("Error,compruebe los campos asignados a la búsqueda");
    			}
    		} else if (community2 != "" && year2 == "") {
    			url = url + "?community=" + community2;
    			const res = await fetch(url);

    			if (res.ok) {
    				$$invalidate(1, exitoMsg = "Búsqueda realizada correctamente");
    				console.log("OK");
    				const json = await res.json();
    				$$invalidate(9, cigarretes = json);
    			} else {
    				$$invalidate(0, errorMsg = "No existen datos para la comunidad de " + " " + community2);
    				console.log("Error,compruebe los campos asignados a la búsqueda");
    			}
    		} else if (community2 == "" && year2 != "") {
    			url = url + "?year=" + year2;
    			const res = await fetch(url);

    			if (res.ok) {
    				$$invalidate(1, exitoMsg = "Búsqueda realizada correctamente");
    				console.log("OK");
    				const json = await res.json();
    				$$invalidate(9, cigarretes = json);
    			} else {
    				$$invalidate(0, errorMsg = "No existen datos para el año" + " " + year2);
    				console.log("Error,compruebe los campos asignados a la búsqueda");
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$9.warn(`<CigarretesTable> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("CigarretesTable", $$slots, []);

    	function input_value_binding(value) {
    		searchCommunity = value;
    		$$invalidate(3, searchCommunity);
    	}

    	function input_value_binding_1(value) {
    		searchYear = value;
    		$$invalidate(4, searchYear);
    	}

    	const func = () => $$invalidate(8, isOpen = !isOpen);

    	function input0_input_handler() {
    		newCigarrete.community = this.value;
    		$$invalidate(2, newCigarrete);
    	}

    	function input1_input_handler() {
    		newCigarrete.year = to_number(this.value);
    		$$invalidate(2, newCigarrete);
    	}

    	function input2_input_handler() {
    		newCigarrete.cigarrete_sale = to_number(this.value);
    		$$invalidate(2, newCigarrete);
    	}

    	function input3_input_handler() {
    		newCigarrete.first_variation = to_number(this.value);
    		$$invalidate(2, newCigarrete);
    	}

    	function input4_input_handler() {
    		newCigarrete.second_variation = to_number(this.value);
    		$$invalidate(2, newCigarrete);
    	}

    	const click_handler = () => incOffset(-1);
    	const click_handler_1 = () => incOffset(-1);
    	const click_handler_2 = () => incOffset(1);
    	const click_handler_3 = () => incOffset(1);

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		Input,
    		FormGroup,
    		Pagination,
    		PaginationItem,
    		PaginationLink,
    		errorMsg,
    		exitoMsg,
    		cigarretes,
    		newCigarrete,
    		communitys,
    		years,
    		community2,
    		year2,
    		searchCommunity,
    		searchYear,
    		offset,
    		limit,
    		paginaActual,
    		paginaSiguiente,
    		siguienteJson,
    		Dropdown,
    		DropdownItem,
    		DropdownMenu,
    		DropdownToggle,
    		isOpen,
    		paginationCigarretes,
    		insertCigarretes,
    		deleteCigarretes,
    		deleteAllCigarretes,
    		loadInitialData,
    		incOffset,
    		searchCigarretes
    	});

    	$$self.$inject_state = $$props => {
    		if ("errorMsg" in $$props) $$invalidate(0, errorMsg = $$props.errorMsg);
    		if ("exitoMsg" in $$props) $$invalidate(1, exitoMsg = $$props.exitoMsg);
    		if ("cigarretes" in $$props) $$invalidate(9, cigarretes = $$props.cigarretes);
    		if ("newCigarrete" in $$props) $$invalidate(2, newCigarrete = $$props.newCigarrete);
    		if ("communitys" in $$props) communitys = $$props.communitys;
    		if ("years" in $$props) years = $$props.years;
    		if ("community2" in $$props) community2 = $$props.community2;
    		if ("year2" in $$props) year2 = $$props.year2;
    		if ("searchCommunity" in $$props) $$invalidate(3, searchCommunity = $$props.searchCommunity);
    		if ("searchYear" in $$props) $$invalidate(4, searchYear = $$props.searchYear);
    		if ("offset" in $$props) offset = $$props.offset;
    		if ("limit" in $$props) limit = $$props.limit;
    		if ("paginaActual" in $$props) $$invalidate(5, paginaActual = $$props.paginaActual);
    		if ("paginaSiguiente" in $$props) $$invalidate(6, paginaSiguiente = $$props.paginaSiguiente);
    		if ("siguienteJson" in $$props) $$invalidate(7, siguienteJson = $$props.siguienteJson);
    		if ("isOpen" in $$props) $$invalidate(8, isOpen = $$props.isOpen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		errorMsg,
    		exitoMsg,
    		newCigarrete,
    		searchCommunity,
    		searchYear,
    		paginaActual,
    		paginaSiguiente,
    		siguienteJson,
    		isOpen,
    		cigarretes,
    		insertCigarretes,
    		deleteCigarretes,
    		deleteAllCigarretes,
    		loadInitialData,
    		incOffset,
    		searchCigarretes,
    		offset,
    		communitys,
    		years,
    		community2,
    		year2,
    		limit,
    		paginationCigarretes,
    		input_value_binding,
    		input_value_binding_1,
    		func,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class CigarretesTable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CigarretesTable",
    			options,
    			id: create_fragment$s.name
    		});
    	}
    }

    /* src\front\CigarretesAPI\analytics\GraphCigarretesSales.svelte generated by Svelte v3.23.0 */

    const { console: console_1$a } = globals;
    const file$s = "src\\front\\CigarretesAPI\\analytics\\GraphCigarretesSales.svelte";

    function create_fragment$t(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let script4;
    	let script4_src_value;
    	let t0;
    	let main;
    	let figure;
    	let div;
    	let t1;
    	let p;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			script4 = element("script");
    			t0 = space();
    			main = element("main");
    			figure = element("figure");
    			div = element("div");
    			t1 = space();
    			p = element("p");
    			p.textContent = "El gráfico de barras muestra un estudio de millones de paquetes de tabaco comprados en el año 2007 , comparando este año con 2003 (primera variacion) \r\n            y con 2012 (segunda variacion).";
    			if (script0.src !== (script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			script0.defer = true;
    			add_location(script0, file$s, 38, 4, 1114);
    			if (script1.src !== (script1_src_value = "https://code.highcharts.com/modules/series-label.js")) attr_dev(script1, "src", script1_src_value);
    			script1.defer = true;
    			add_location(script1, file$s, 39, 4, 1211);
    			if (script2.src !== (script2_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script2, "src", script2_src_value);
    			script2.defer = true;
    			add_location(script2, file$s, 40, 4, 1318);
    			if (script3.src !== (script3_src_value = "https://code.highcharts.com/modules/export-data.js")) attr_dev(script3, "src", script3_src_value);
    			script3.defer = true;
    			add_location(script3, file$s, 41, 4, 1422);
    			if (script4.src !== (script4_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script4, "src", script4_src_value);
    			script4.defer = true;
    			add_location(script4, file$s, 42, 4, 1528);
    			attr_dev(div, "id", "container");
    			attr_dev(div, "class", "svelte-1i4g1d8");
    			add_location(div, file$s, 49, 8, 1719);
    			attr_dev(p, "class", "highcharts-description");
    			add_location(p, file$s, 50, 8, 1755);
    			attr_dev(figure, "class", "highcharts-figure svelte-1i4g1d8");
    			add_location(figure, file$s, 48, 4, 1675);
    			add_location(main, file$s, 45, 0, 1652);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			append_dev(document.head, script4);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, div);
    			append_dev(figure, t1);
    			append_dev(figure, p);

    			if (!mounted) {
    				dispose = [
    					listen_dev(script0, "load", loadGraph$6, false, false, false),
    					listen_dev(script1, "load", loadGraph$6, false, false, false),
    					listen_dev(script2, "load", loadGraph$6, false, false, false),
    					listen_dev(script3, "load", loadGraph$6, false, false, false),
    					listen_dev(script4, "load", loadGraph$6, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			detach_dev(script4);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function loadGraph$6() {
    	const res = await fetch("api/v2/cigarretes-sales");
    	let datos = await res.json();
    	let comunidad = datos.filter(datos => datos.year === 2007).map(datos => datos.community);
    	let venta_de_cigarros = datos.filter(datos => datos.year === 2007).map(datos => datos.cigarrete_sale);
    	let primera_variacion = datos.filter(datos => datos.year === 2007).map(datos => datos.first_variation);
    	let segunda_variacion = datos.filter(datos => datos.year === 2007).map(datos => datos.second_variation);
    	console.log("Graph_NONO");

    	Highcharts.chart("container", {
    		title: {
    			text: "Venta de paquetes de tabaco en 2007"
    		},
    		xAxis: { categories: comunidad },
    		series: [
    			{
    				type: "column",
    				name: "Ventas de paquetes de tabaco",
    				data: venta_de_cigarros
    			},
    			{
    				type: "column",
    				name: "Primera variacion",
    				data: primera_variacion
    			},
    			{
    				type: "column",
    				name: "Segunda variacion",
    				data: segunda_variacion
    			}
    		]
    	});
    }

    function instance$t($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$a.warn(`<GraphCigarretesSales> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GraphCigarretesSales", $$slots, []);
    	$$self.$capture_state = () => ({ loadGraph: loadGraph$6 });
    	return [];
    }

    class GraphCigarretesSales extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GraphCigarretesSales",
    			options,
    			id: create_fragment$t.name
    		});
    	}
    }

    /* src\front\CigarretesAPI\EditCigarretesSales.svelte generated by Svelte v3.23.0 */

    const { console: console_1$b } = globals;
    const file$t = "src\\front\\CigarretesAPI\\EditCigarretesSales.svelte";

    // (1:0) <script>      import Table from "sveltestrap/src/Table.svelte";      import Button from  "sveltestrap/src/Button.svelte";        import { pop }
    function create_catch_block$8(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$8.name,
    		type: "catch",
    		source: "(1:0) <script>      import Table from \\\"sveltestrap/src/Table.svelte\\\";      import Button from  \\\"sveltestrap/src/Button.svelte\\\";        import { pop }",
    		ctx
    	});

    	return block;
    }

    // (89:0) {:then cigarrete}
    function create_then_block$8(ctx) {
    	let current;

    	const table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1$c] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, updatedsecond_variation, updatedfirst_variation, updatedcigarrete_sale, updatedYear, updatedCommunity*/ 16446) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$8.name,
    		type: "then",
    		source: "(89:0) {:then cigarrete}",
    		ctx
    	});

    	return block;
    }

    // (111:9) <Button color="primary" outline on:click={updateCigarretes}>
    function create_default_slot_2$a(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Actualizar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$a.name,
    		type: "slot",
    		source: "(111:9) <Button color=\\\"primary\\\" outline on:click={updateCigarretes}>",
    		ctx
    	});

    	return block;
    }

    // (90:2) <Table bordered>
    function create_default_slot_1$c(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let tbody;
    	let tr1;
    	let td0;
    	let t10;
    	let t11;
    	let td1;
    	let t12;
    	let t13;
    	let td2;
    	let input0;
    	let t14;
    	let td3;
    	let input1;
    	let t15;
    	let td4;
    	let input2;
    	let t16;
    	let td5;
    	let current;
    	let mounted;
    	let dispose;

    	const button = new Button({
    			props: {
    				color: "primary",
    				outline: true,
    				$$slots: { default: [create_default_slot_2$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*updateCigarretes*/ ctx[9]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Comunidad";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Venta de paquetes";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Primera variacion";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Segunda variacion";
    			t9 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			t10 = text(/*updatedCommunity*/ ctx[1]);
    			t11 = space();
    			td1 = element("td");
    			t12 = text(/*updatedYear*/ ctx[2]);
    			t13 = space();
    			td2 = element("td");
    			input0 = element("input");
    			t14 = space();
    			td3 = element("td");
    			input1 = element("input");
    			t15 = space();
    			td4 = element("td");
    			input2 = element("input");
    			t16 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			add_location(th0, file$t, 93, 5, 2636);
    			add_location(th1, file$t, 94, 5, 2661);
    			add_location(th2, file$t, 95, 5, 2680);
    			add_location(th3, file$t, 96, 5, 2713);
    			add_location(th4, file$t, 97, 5, 2746);
    			add_location(tr0, file$t, 91, 4, 2623);
    			add_location(thead, file$t, 90, 3, 2610);
    			add_location(td0, file$t, 105, 5, 2831);
    			add_location(td1, file$t, 106, 5, 2865);
    			attr_dev(input0, "type", "number");
    			add_location(input0, file$t, 107, 9, 2898);
    			add_location(td2, file$t, 107, 5, 2894);
    			attr_dev(input1, "type", "number");
    			add_location(input1, file$t, 108, 9, 2972);
    			add_location(td3, file$t, 108, 5, 2968);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$t, 109, 9, 3047);
    			add_location(td4, file$t, 109, 5, 3043);
    			add_location(td5, file$t, 110, 5, 3119);
    			add_location(tr1, file$t, 103, 4, 2818);
    			add_location(tbody, file$t, 101, 3, 2803);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, t10);
    			append_dev(tr1, t11);
    			append_dev(tr1, td1);
    			append_dev(td1, t12);
    			append_dev(tr1, t13);
    			append_dev(tr1, td2);
    			append_dev(td2, input0);
    			set_input_value(input0, /*updatedcigarrete_sale*/ ctx[3]);
    			append_dev(tr1, t14);
    			append_dev(tr1, td3);
    			append_dev(td3, input1);
    			set_input_value(input1, /*updatedfirst_variation*/ ctx[4]);
    			append_dev(tr1, t15);
    			append_dev(tr1, td4);
    			append_dev(td4, input2);
    			set_input_value(input2, /*updatedsecond_variation*/ ctx[5]);
    			append_dev(tr1, t16);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[11]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[12]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[13])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*updatedCommunity*/ 2) set_data_dev(t10, /*updatedCommunity*/ ctx[1]);
    			if (!current || dirty & /*updatedYear*/ 4) set_data_dev(t12, /*updatedYear*/ ctx[2]);

    			if (dirty & /*updatedcigarrete_sale*/ 8 && to_number(input0.value) !== /*updatedcigarrete_sale*/ ctx[3]) {
    				set_input_value(input0, /*updatedcigarrete_sale*/ ctx[3]);
    			}

    			if (dirty & /*updatedfirst_variation*/ 16 && to_number(input1.value) !== /*updatedfirst_variation*/ ctx[4]) {
    				set_input_value(input1, /*updatedfirst_variation*/ ctx[4]);
    			}

    			if (dirty & /*updatedsecond_variation*/ 32 && to_number(input2.value) !== /*updatedsecond_variation*/ ctx[5]) {
    				set_input_value(input2, /*updatedsecond_variation*/ ctx[5]);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$c.name,
    		type: "slot",
    		source: "(90:2) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (87:18)      Loading cigarrete ...  {:then cigarrete}
    function create_pending_block$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading cigarrete ...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$8.name,
    		type: "pending",
    		source: "(87:18)      Loading cigarrete ...  {:then cigarrete}",
    		ctx
    	});

    	return block;
    }

    // (120:4) {#if errorMsg}
    function create_if_block_1$9(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Error: ");
    			t1 = text(/*errorMsg*/ ctx[6]);
    			set_style(p, "color", "red");
    			add_location(p, file$t, 120, 4, 3301);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*errorMsg*/ 64) set_data_dev(t1, /*errorMsg*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$9.name,
    		type: "if",
    		source: "(120:4) {#if errorMsg}",
    		ctx
    	});

    	return block;
    }

    // (123:4) {#if exitoMsg}
    function create_if_block$e(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Éxito: ");
    			t1 = text(/*exitoMsg*/ ctx[7]);
    			set_style(p, "color", "blue");
    			add_location(p, file$t, 123, 4, 3382);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*exitoMsg*/ 128) set_data_dev(t1, /*exitoMsg*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(123:4) {#if exitoMsg}",
    		ctx
    	});

    	return block;
    }

    // (126:8) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$g(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Atrás");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$g.name,
    		type: "slot",
    		source: "(126:8) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let main;
    	let h3;
    	let t0;
    	let strong0;
    	let t1_value = /*params*/ ctx[0].community + "";
    	let t1;
    	let t2;
    	let strong1;
    	let t3_value = /*params*/ ctx[0].year + "";
    	let t3;
    	let t4;
    	let promise;
    	let t5;
    	let t6;
    	let t7;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block$8,
    		then: create_then_block$8,
    		catch: create_catch_block$8,
    		value: 8,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*cigarrete*/ ctx[8], info);
    	let if_block0 = /*errorMsg*/ ctx[6] && create_if_block_1$9(ctx);
    	let if_block1 = /*exitoMsg*/ ctx[7] && create_if_block$e(ctx);

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$g] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h3 = element("h3");
    			t0 = text("Editando datos de la comunidad ");
    			strong0 = element("strong");
    			t1 = text(t1_value);
    			t2 = text(" en el año ");
    			strong1 = element("strong");
    			t3 = text(t3_value);
    			t4 = space();
    			info.block.c();
    			t5 = space();
    			if (if_block0) if_block0.c();
    			t6 = space();
    			if (if_block1) if_block1.c();
    			t7 = space();
    			create_component(button.$$.fragment);
    			add_location(strong0, file$t, 84, 39, 2437);
    			add_location(strong1, file$t, 84, 85, 2483);
    			add_location(h3, file$t, 84, 4, 2402);
    			add_location(main, file$t, 83, 0, 2389);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h3);
    			append_dev(h3, t0);
    			append_dev(h3, strong0);
    			append_dev(strong0, t1);
    			append_dev(h3, t2);
    			append_dev(h3, strong1);
    			append_dev(strong1, t3);
    			append_dev(main, t4);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t5;
    			append_dev(main, t5);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t6);
    			if (if_block1) if_block1.m(main, null);
    			append_dev(main, t7);
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*params*/ 1) && t1_value !== (t1_value = /*params*/ ctx[0].community + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*params*/ 1) && t3_value !== (t3_value = /*params*/ ctx[0].year + "")) set_data_dev(t3, t3_value);
    			info.ctx = ctx;

    			if (dirty & /*cigarrete*/ 256 && promise !== (promise = /*cigarrete*/ ctx[8]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[8] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}

    			if (/*errorMsg*/ ctx[6]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$9(ctx);
    					if_block0.c();
    					if_block0.m(main, t6);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*exitoMsg*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$e(ctx);
    					if_block1.c();
    					if_block1.m(main, t7);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let { params = {} } = $$props; //Para los parametro en la url de cada recurso
    	let cigarrete = {};
    	let updatedCommunity = "";
    	let updatedYear = 0;
    	let updatedcigarrete_sale = 0;
    	let updatedfirst_variation = 0;
    	let updatedsecond_variation = 0;
    	let errorMsg = "";
    	let exitoMsg = "";
    	onMount(getCigarretes);

    	async function getCigarretes() {
    		console.log("Fetching cigarrete sales");
    		const res = await fetch("/api/v2/cigarretes-sales/" + params.community + "/" + params.year);

    		//Await bloquea la instruccion, hasta que res tenga un valor
    		if (res.ok) {
    			console.log("OK");
    			const json = await res.json();
    			$$invalidate(8, cigarrete = json);
    			$$invalidate(1, updatedCommunity = cigarrete.community);
    			$$invalidate(2, updatedYear = cigarrete.year);
    			$$invalidate(3, updatedcigarrete_sale = cigarrete.cigarrete_sale);
    			$$invalidate(4, updatedfirst_variation = cigarrete.first_variation);
    			$$invalidate(5, updatedsecond_variation = cigarrete.second_variation);
    			console.log("Received cigarretes sales.");
    		} else {
    			$$invalidate(6, errorMsg = res.status + ": " + res.statusText);
    			console.log("ERROR!" + errorMsg);
    		}
    	}

    	async function updateCigarretes() {
    		console.log("Updating cigarrete..." + JSON.stringify(params.community));

    		const res = await fetch("/api/v2/cigarretes-sales/" + params.community + "/" + params.year, {
    			method: "PUT",
    			body: JSON.stringify({
    				community: params.community,
    				year: parseInt(params.year),
    				cigarrete_sale: updatedcigarrete_sale,
    				first_variation: updatedfirst_variation,
    				second_variation: updatedsecond_variation
    			}),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			getCigarretes();

    			if (res.status == 400) {
    				$$invalidate(6, errorMsg = "Error al introducir los datos");
    			} else {
    				$$invalidate(7, exitoMsg = "Se ha actualizado correctamente");
    			}
    		});
    	}

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$b.warn(`<EditCigarretesSales> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("EditCigarretesSales", $$slots, []);

    	function input0_input_handler() {
    		updatedcigarrete_sale = to_number(this.value);
    		$$invalidate(3, updatedcigarrete_sale);
    	}

    	function input1_input_handler() {
    		updatedfirst_variation = to_number(this.value);
    		$$invalidate(4, updatedfirst_variation);
    	}

    	function input2_input_handler() {
    		updatedsecond_variation = to_number(this.value);
    		$$invalidate(5, updatedsecond_variation);
    	}

    	$$self.$set = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		Table,
    		Button,
    		pop,
    		onMount,
    		params,
    		cigarrete,
    		updatedCommunity,
    		updatedYear,
    		updatedcigarrete_sale,
    		updatedfirst_variation,
    		updatedsecond_variation,
    		errorMsg,
    		exitoMsg,
    		getCigarretes,
    		updateCigarretes
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    		if ("cigarrete" in $$props) $$invalidate(8, cigarrete = $$props.cigarrete);
    		if ("updatedCommunity" in $$props) $$invalidate(1, updatedCommunity = $$props.updatedCommunity);
    		if ("updatedYear" in $$props) $$invalidate(2, updatedYear = $$props.updatedYear);
    		if ("updatedcigarrete_sale" in $$props) $$invalidate(3, updatedcigarrete_sale = $$props.updatedcigarrete_sale);
    		if ("updatedfirst_variation" in $$props) $$invalidate(4, updatedfirst_variation = $$props.updatedfirst_variation);
    		if ("updatedsecond_variation" in $$props) $$invalidate(5, updatedsecond_variation = $$props.updatedsecond_variation);
    		if ("errorMsg" in $$props) $$invalidate(6, errorMsg = $$props.errorMsg);
    		if ("exitoMsg" in $$props) $$invalidate(7, exitoMsg = $$props.exitoMsg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		updatedCommunity,
    		updatedYear,
    		updatedcigarrete_sale,
    		updatedfirst_variation,
    		updatedsecond_variation,
    		errorMsg,
    		exitoMsg,
    		cigarrete,
    		updateCigarretes,
    		getCigarretes,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class EditCigarretesSales extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditCigarretesSales",
    			options,
    			id: create_fragment$u.name
    		});
    	}

    	get params() {
    		throw new Error("<EditCigarretesSales>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<EditCigarretesSales>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\CigarretesAPI\analytics\ChartCigarretesSales.svelte generated by Svelte v3.23.0 */

    const file$u = "src\\front\\CigarretesAPI\\analytics\\ChartCigarretesSales.svelte";

    function create_fragment$v(ctx) {
    	let div;
    	let t;
    	let script;
    	let script_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			script = element("script");
    			attr_dev(div, "id", "chartContainer");
    			set_style(div, "height", "370px");
    			set_style(div, "width", "100%");
    			add_location(div, file$u, 78, 4, 2694);
    			if (script.src !== (script_src_value = "https://canvasjs.com/assets/script/canvasjs.min.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file$u, 80, 4, 2786);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t, anchor);
    			append_dev(document.head, script);

    			if (!mounted) {
    				dispose = listen_dev(script, "load", loadGraph$7, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t);
    			detach_dev(script);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function loadGraph$7() {
    	const res = await fetch("api/v2/cigarretes-sales");
    	let datos = await res.json();
    	let comunidad = datos.filter(datos => datos.year === 2007).map(datos => datos.community);
    	let venta_de_cigarros = datos.filter(datos => datos.year === 2007).map(datos => datos.cigarrete_sale);
    	let primera_variacion = datos.filter(datos => datos.year === 2007).map(datos => datos.first_variation);
    	let segunda_variacion = datos.filter(datos => datos.year === 2007).map(datos => datos.second_variation);

    	window.onload = function () {
    		var chart = new CanvasJS.Chart("chartContainer",
    		{
    				animationEnabled: true,
    				title: {
    					text: "Crude Oil Reserves vs Production, 2016"
    				},
    				axisY: {
    					title: "Billions of Barrels",
    					titleFontColor: "#4F81BC",
    					lineColor: "#4F81BC",
    					labelFontColor: "#4F81BC",
    					tickColor: "#4F81BC"
    				},
    				axisY2: {
    					title: "Millions of Barrels/day",
    					titleFontColor: "#C0504E",
    					lineColor: "#C0504E",
    					labelFontColor: "#C0504E",
    					tickColor: "#C0504E"
    				},
    				toolTip: { shared: true },
    				legend: {
    					cursor: "pointer",
    					itemclick: toggleDataSeries
    				},
    				data: [
    					{
    						type: "column",
    						name: "Proven Oil Reserves (bn)",
    						legendText: "Proven Oil Reserves",
    						showInLegend: true,
    						dataPoints: [{ label: comunidad, y: venta_de_cigarros }]
    					},
    					{
    						type: "column",
    						name: "Oil Production (million/day)",
    						legendText: "Oil Production",
    						axisYType: "secondary",
    						showInLegend: true,
    						dataPoints: [{ label: comunidad, y: venta_de_cigarros }]
    					}
    				]
    			});

    		chart.render();
    	};
    }

    function toggleDataSeries(e) {
    	if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
    		e.dataSeries.visible = false;
    	} else {
    		e.dataSeries.visible = true;
    	}

    	chart.render();
    }

    function instance$v($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ChartCigarretesSales> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ChartCigarretesSales", $$slots, []);
    	$$self.$capture_state = () => ({ loadGraph: loadGraph$7, toggleDataSeries });
    	return [];
    }

    class ChartCigarretesSales extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChartCigarretesSales",
    			options,
    			id: create_fragment$v.name
    		});
    	}
    }

    /* src\front\App.svelte generated by Svelte v3.23.0 */
    const file$v = "src\\front\\App.svelte";

    function create_fragment$w(ctx) {
    	let main;
    	let current;

    	const router = new Router({
    			props: { routes: /*routes*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(router.$$.fragment);
    			add_location(main, file$v, 59, 0, 2760);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(router, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	const routes = {
    		"/": Home,
    		"/fires-stats": FiresStatsTable,
    		"/graph-highchart": HighChart,
    		"/graph-chartjs": Chartjs,
    		"/fires-stats/:community/:year": EditFiresStats,
    		"/fires-stats-integrations/integrations": Integrations,
    		"/fires-stats-integrations/integrations/plugin-vehicles-stats": PluginVehiclesStats,
    		"/offworks-stats": OffworksStatsTable,
    		"/offworks-stats/:community/:year": EditOffworksStats,
    		"/graph-offworks-stats": GraphOffworksStats,
    		"/Rgraph-offworks-stats": RGraphOffworksStats,
    		"/offworks-stats-integrations/integrations": Integrations$1,
    		"/offworks-stats-integrations/integrations/basketIntegration": BasketIntegration,
    		"/offworks-stats-integrations/integrations/drivingLicensesIntegration": DrivingLicensesIntegration,
    		"/cigarretes-sales": CigarretesTable,
    		"/cigarretes-sales/:community/:year": EditCigarretesSales,
    		"/graph-cigarretes-sales": GraphCigarretesSales,
    		"/chart-cigarretes-sales": ChartCigarretesSales,
    		"*": NotFound
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	$$self.$capture_state = () => ({
    		Router,
    		Home,
    		NotFound,
    		FiresStatsTable,
    		EditFiresStats,
    		GraphHighchart: HighChart,
    		Chartjs,
    		integrations: Integrations,
    		pluginVehiclesStats: PluginVehiclesStats,
    		OffworksStatsTable,
    		EditOffworksStats,
    		GraphOffworksStats,
    		RGraphOffworksStats,
    		integrationsA: Integrations$1,
    		basketIntegration: BasketIntegration,
    		drivingLicensesIntegration: DrivingLicensesIntegration,
    		CigarretesTable,
    		GraphCigarretesSales,
    		EditCigarretesSales,
    		ChartCigarretesSales,
    		routes
    	});

    	return [routes];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$w.name
    		});
    	}
    }

    const app = new App({
    	target: document.querySelector('#SvelteApp')
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
