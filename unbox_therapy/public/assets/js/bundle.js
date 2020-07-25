
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
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
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
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = value;
        }
        else {
            attr(node, prop, value);
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
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    class HtmlTag {
        constructor(anchor = null) {
            this.a = anchor;
            this.e = this.n = null;
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.h(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
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
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
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
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
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

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.24.0' }, detail)));
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
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
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

    /* node_modules\svelte-spa-router\Router.svelte generated by Svelte v3.24.0 */

    const { Error: Error_1, Object: Object_1, console: console_1 } = globals;

    // (219:0) {:else}
    function create_else_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[5]);
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
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[5]);
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
    		source: "(219:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (217:0) {#if componentParams}
    function create_if_block(ctx) {
    	let switch_instance;
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
    		switch_instance = new switch_value(switch_props(ctx));
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[4]);
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
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[4]);
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
    		source: "(217:0) {#if componentParams}",
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

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener("hashchange", update, false);

    	return function stop() {
    		window.removeEventListener("hashchange", update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);

    function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	return tick().then(() => {
    		window.location.hash = (location.charAt(0) == "#" ? "" : "#") + location;
    	});
    }

    function pop() {
    	// Execute this code when the current call stack is complete
    	return tick().then(() => {
    		window.history.back();
    	});
    }

    function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	return tick().then(() => {
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

    function link(node, hrefVar) {
    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != "a") {
    		throw Error("Action \"link\" can only be used with <a> tags");
    	}

    	updateLink(node, hrefVar || node.getAttribute("href"));

    	return {
    		update(updated) {
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, href) {
    	// Destination must start with '/'
    	if (!href || href.length < 1 || href.charAt(0) != "/") {
    		throw Error("Invalid value for \"href\" attribute");
    	}

    	// Add # to the href attribute
    	node.setAttribute("href", "#" + href);
    }

    function nextTickPromise(cb) {
    	// eslint-disable-next-line no-console
    	console.warn("nextTickPromise from 'svelte-spa-router' is deprecated and will be removed in version 3; use the 'tick' method from the Svelte runtime instead");

    	return tick().then(cb);
    }

    function instance($$self, $$props, $$invalidate) {
    	let $loc,
    		$$unsubscribe_loc = noop;

    	validate_store(loc, "loc");
    	component_subscribe($$self, loc, $$value => $$invalidate(6, $loc = $$value));
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
    		tick().then(() => {
    			dispatch(name, detail);
    		});
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
    		tick,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
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
    		if ($$self.$$.dirty & /*component, $loc*/ 65) {
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

    /* src\views\Knn.svelte generated by Svelte v3.24.0 */

    const { Object: Object_1$1 } = globals;
    const file = "src\\views\\Knn.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	child_ctx[32] = i;
    	return child_ctx;
    }

    // (480:16) {#each labels as label, i}
    function create_each_block(ctx) {
    	let p;
    	let t0_value = /*label*/ ctx[30] + "";
    	let t0;
    	let t1;
    	let t2_value = /*counts*/ ctx[0][/*label*/ ctx[30]] + "";
    	let t2;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = text(" : ");
    			t2 = text(t2_value);
    			set_style(p, "font-style", "italic");
    			set_style(p, "fill", "gray");
    			add_location(p, file, 480, 20, 15236);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*counts*/ 1 && t2_value !== (t2_value = /*counts*/ ctx[0][/*label*/ ctx[30]] + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(480:16) {#each labels as label, i}",
    		ctx
    	});

    	return block;
    }

    // (478:18)                   
    function fallback_block(ctx) {
    	let p;
    	let t0;
    	let t1;
    	let each_1_anchor;
    	let each_value = /*labels*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(/*testlabel*/ ctx[1]);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			set_style(p, "font-size", "25px");
    			set_style(p, "font-style", "italic");
    			set_style(p, "color", "steelblue");
    			add_location(p, file, 478, 16, 15088);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*testlabel*/ 2) set_data_dev(t0, /*testlabel*/ ctx[1]);

    			if (dirty[0] & /*counts, labels*/ 9) {
    				each_value = /*labels*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(478:18)                   ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let article;
    	let div0;
    	let h1;
    	let t1;
    	let p0;
    	let strong0;
    	let t2;
    	let br0;
    	let t3;
    	let br1;
    	let t4;
    	let t5;
    	let div1;
    	let h20;
    	let t7;
    	let p1;
    	let t9;
    	let div2;
    	let h21;
    	let t11;
    	let p2;
    	let t13;
    	let p3;
    	let t15;
    	let div3;
    	let h22;
    	let t17;
    	let p4;
    	let strong1;
    	let t19;
    	let p5;
    	let strong2;
    	let t21;
    	let div11;
    	let div6;
    	let div5;
    	let div4;
    	let button0;
    	let i0;
    	let t23;
    	let button1;
    	let i1;
    	let t25;
    	let span;
    	let t26;
    	let html_tag;
    	let t27;
    	let div9;
    	let div7;
    	let svg_1;
    	let t28;
    	let div8;
    	let t29;
    	let div10;
    	let p6;
    	let t31;
    	let p7;
    	let t33;
    	let footer;
    	let div12;
    	let h3;
    	let t35;
    	let p8;
    	let t37;
    	let p9;
    	let t39;
    	let div13;
    	let p10;
    	let br2;
    	let t40;
    	let t41;
    	let a;
    	let ion_icon;
    	let link_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			article = element("article");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Section: KNN";
    			t1 = space();
    			p0 = element("p");
    			strong0 = element("strong");
    			t2 = text("你在网上查找有关鸢尾花的资料的时候，看见了一个表格里面记录了这三类花各50条的关于它们花萼的长、花萼的宽、花瓣的长和花瓣的宽的数据（我们称之为“数据集”）。\r\n            但你并不能从这些数据发现一些规律。");
    			br0 = element("br");
    			t3 = text("于是你想到了如果将花瓣的长度表示为x1，花萼的长度为x2，那就可以在坐标轴上用（x1,\r\n\t\t\tx2）表示出来。你发现了通过这样取他们的一些属性或者称之为“特征”表示出来的这个二维的坐标平面上有一些规律，似乎大致可以看出分成了三块，左上角集中的那一块它们拥有差不多\r\n            的花瓣长度和花萼长度，它们属于同一类鸢尾花。");
    			br1 = element("br");
    			t4 = text("现在你想通过这个特征坐标系来判断你面前的这朵鸢尾花属于哪一类，你同样测量了它的花瓣和花萼的长度，要怎么判断呢？");
    			t5 = space();
    			div1 = element("div");
    			h20 = element("h2");
    			h20.textContent = "什么是KNN?";
    			t7 = space();
    			p1 = element("p");
    			p1.textContent = "KNN的基本思想有点类似“物以类聚，人以群分”，打个通俗的比方就是“如果你要了解一个人，可以从他最亲近的几个朋友去推测他是什么样的人”。\r\n      在分类领域，对于一个未知点，选取K个距离（可以是欧氏距离，也可以是其他相似度度量指标）最近的点，然后统计这K个点，在这K个点中频数最多的那一类就作为分类结果。";
    			t9 = space();
    			div2 = element("div");
    			h21 = element("h2");
    			h21.textContent = "KNN算法的可视化";
    			t11 = space();
    			p2 = element("p");
    			p2.textContent = "将鸢尾花数据根据花萼长度及花瓣长度绘制在坐标轴中，其中每一点都代表一个已知的样本，且图像中两点之间的距离便代表了它们之间的相似度。";
    			t13 = space();
    			p3 = element("p");
    			p3.textContent = "当有一个未知品种的鸢尾花时，根据它的两个特征将之绘制在图中，便可以找到它的K个最近邻。";
    			t15 = space();
    			div3 = element("div");
    			h22 = element("h2");
    			h22.textContent = "尝试一下";
    			t17 = space();
    			p4 = element("p");
    			strong1 = element("strong");
    			strong1.textContent = "你将这朵未知品种的鸢尾花以黄点标注在了图中。";
    			t19 = space();
    			p5 = element("p");
    			strong2 = element("strong");
    			strong2.textContent = "拖动黄点试试吧，右上角会显示此时样本的预测类别，以及距离最近的K个样本的种类数目。";
    			t21 = space();
    			div11 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			button0 = element("button");
    			i0 = element("i");
    			i0.textContent = "add";
    			t23 = space();
    			button1 = element("button");
    			i1 = element("i");
    			i1.textContent = "remove";
    			t25 = space();
    			span = element("span");
    			t26 = space();
    			t27 = space();
    			div9 = element("div");
    			div7 = element("div");
    			svg_1 = svg_element("svg");
    			t28 = space();
    			div8 = element("div");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			t29 = space();
    			div10 = element("div");
    			p6 = element("p");
    			p6.textContent = "黄点为未知的鸢尾花样本它的预测类别以及它邻近样本的类别会在上方显示";
    			t31 = space();
    			p7 = element("p");
    			p7.textContent = "接着再拖动它试试吧 !";
    			t33 = space();
    			footer = element("footer");
    			div12 = element("div");
    			h3 = element("h3");
    			h3.textContent = "扩展与补充";
    			t35 = space();
    			p8 = element("p");
    			p8.textContent = "KNN方法思路简单，易于理解，易于实现，无需估计参数，无需训练, 是一个理论上比较成熟的方法，也是最简单的机器学习算法之一，比较适用于比较大的类域的自动分类。但KNN也有自己的不足之处，它的计算量比较大，同时在不同类别的样本数量差距较大时，结果容易受到大样本的影响。";
    			t37 = space();
    			p9 = element("p");
    			p9.textContent = "目前针对KNN也有着许多的改进方法，值得你的进一步的探索了解。";
    			t39 = space();
    			div13 = element("div");
    			p10 = element("p");
    			br2 = element("br");
    			t40 = text("尝试过KNN的你发现虽然这个方法简单直观，但效果并没有想象中那么好，同时k值的设定也是一个难题，因此你开始寻找有没有更好的方法来识别鸢尾花的品种。");
    			t41 = space();
    			a = element("a");
    			ion_icon = element("ion-icon");
    			add_location(h1, file, 426, 18, 12992);
    			attr_dev(div0, "id", "One");
    			add_location(div0, file, 426, 4, 12978);
    			add_location(br0, file, 430, 29, 13169);
    			add_location(br1, file, 432, 34, 13342);
    			add_location(strong0, file, 428, 8, 13038);
    			attr_dev(p0, "class", "svelte-yydznf");
    			add_location(p0, file, 427, 4, 13025);
    			attr_dev(h20, "class", "title svelte-yydznf");
    			add_location(h20, file, 437, 6, 13468);
    			attr_dev(p1, "class", "svelte-yydznf");
    			add_location(p1, file, 438, 6, 13506);
    			attr_dev(div1, "class", "l--body");
    			add_location(div1, file, 436, 4, 13439);
    			attr_dev(h21, "class", "title svelte-yydznf");
    			add_location(h21, file, 443, 6, 13717);
    			attr_dev(p2, "class", "svelte-yydznf");
    			add_location(p2, file, 444, 6, 13757);
    			attr_dev(p3, "class", "svelte-yydznf");
    			add_location(p3, file, 445, 6, 13837);
    			attr_dev(div2, "class", "l--body");
    			add_location(div2, file, 442, 4, 13688);
    			attr_dev(h22, "class", "title svelte-yydznf");
    			add_location(h22, file, 449, 6, 13936);
    			add_location(strong1, file, 450, 9, 13974);
    			attr_dev(p4, "class", "svelte-yydznf");
    			add_location(p4, file, 450, 6, 13971);
    			add_location(strong2, file, 451, 9, 14028);
    			attr_dev(p5, "class", "svelte-yydznf");
    			add_location(p5, file, 451, 6, 14025);
    			attr_dev(div3, "class", "l--body");
    			add_location(div3, file, 448, 4, 13907);
    			attr_dev(article, "id", "knnarticle");
    			attr_dev(article, "class", "svelte-yydznf");
    			add_location(article, file, 425, 0, 12947);
    			attr_dev(i0, "class", "material-icons");
    			add_location(i0, file, 461, 20, 14455);
    			attr_dev(button0, "id", "add-layers");
    			attr_dev(button0, "class", "mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab");
    			add_location(button0, file, 460, 16, 14339);
    			attr_dev(i1, "class", "material-icons");
    			add_location(i1, file, 464, 20, 14652);
    			attr_dev(button1, "id", "remove-layers");
    			attr_dev(button1, "class", "mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab");
    			add_location(button1, file, 463, 16, 14533);
    			attr_dev(div4, "class", "ui-numHiddenLayers");
    			set_style(div4, "float", "left");
    			set_style(div4, "margin-right", "15px");
    			add_location(div4, file, 459, 12, 14248);
    			attr_dev(span, "id", "num-k");
    			set_style(span, "float", "left");
    			set_style(span, "margin-right", "5px");
    			set_style(span, "font-size", "25px");
    			attr_dev(span, "class", "svelte-yydznf");
    			add_location(span, file, 467, 12, 14749);
    			set_style(div5, "float", "left");
    			set_style(div5, "margin-right", "5px");
    			add_location(div5, file, 458, 8, 14189);
    			html_tag = new HtmlTag(null);
    			attr_dev(div6, "id", "top-legends");
    			attr_dev(div6, "class", "clearfix svelte-yydznf");
    			add_location(div6, file, 457, 4, 14140);
    			attr_dev(svg_1, "id", "knn-svg");
    			add_location(svg_1, file, 474, 12, 14955);
    			attr_dev(div7, "class", "box1 svelte-yydznf");
    			add_location(div7, file, 473, 8, 14922);
    			attr_dev(div8, "class", "box svelte-yydznf");
    			set_style(div8, "position", "relative");
    			add_location(div8, file, 476, 8, 15005);
    			attr_dev(div9, "id", "knn-graph");
    			add_location(div9, file, 472, 4, 14892);
    			attr_dev(p6, "class", "svelte-yydznf");
    			add_location(p6, file, 486, 8, 15415);
    			attr_dev(p7, "class", "svelte-yydznf");
    			add_location(p7, file, 487, 8, 15465);
    			attr_dev(div10, "id", "explain");
    			attr_dev(div10, "class", "svelte-yydznf");
    			add_location(div10, file, 485, 4, 15387);
    			attr_dev(div11, "id", "knn");
    			attr_dev(div11, "class", "svelte-yydznf");
    			add_location(div11, file, 456, 0, 14120);
    			attr_dev(h3, "class", "title svelte-yydznf");
    			add_location(h3, file, 493, 6, 15561);
    			attr_dev(p8, "class", "svelte-yydznf");
    			add_location(p8, file, 494, 6, 15597);
    			attr_dev(p9, "class", "svelte-yydznf");
    			add_location(p9, file, 495, 6, 15745);
    			attr_dev(div12, "class", "footbody svelte-yydznf");
    			add_location(div12, file, 492, 4, 15531);
    			add_location(br2, file, 498, 9, 15834);
    			add_location(p10, file, 498, 6, 15831);
    			attr_dev(div13, "class", "lasttext svelte-yydznf");
    			add_location(div13, file, 497, 4, 15801);
    			set_custom_element_data(ion_icon, "class", "return svelte-yydznf");
    			set_custom_element_data(ion_icon, "name", "arrow-back-circle-outline");
    			set_custom_element_data(ion_icon, "size", "large");
    			add_location(ion_icon, file, 502, 8, 15990);
    			attr_dev(a, "href", "/home");
    			attr_dev(a, "rel", "prefetch");
    			add_location(a, file, 501, 4, 15940);
    			attr_dev(footer, "id", "foot");
    			attr_dev(footer, "class", "svelte-yydznf");
    			add_location(footer, file, 491, 0, 15507);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, div0);
    			append_dev(div0, h1);
    			append_dev(article, t1);
    			append_dev(article, p0);
    			append_dev(p0, strong0);
    			append_dev(strong0, t2);
    			append_dev(strong0, br0);
    			append_dev(strong0, t3);
    			append_dev(strong0, br1);
    			append_dev(strong0, t4);
    			append_dev(article, t5);
    			append_dev(article, div1);
    			append_dev(div1, h20);
    			append_dev(div1, t7);
    			append_dev(div1, p1);
    			append_dev(article, t9);
    			append_dev(article, div2);
    			append_dev(div2, h21);
    			append_dev(div2, t11);
    			append_dev(div2, p2);
    			append_dev(div2, t13);
    			append_dev(div2, p3);
    			append_dev(article, t15);
    			append_dev(article, div3);
    			append_dev(div3, h22);
    			append_dev(div3, t17);
    			append_dev(div3, p4);
    			append_dev(p4, strong1);
    			append_dev(div3, t19);
    			append_dev(div3, p5);
    			append_dev(p5, strong2);
    			insert_dev(target, t21, anchor);
    			insert_dev(target, div11, anchor);
    			append_dev(div11, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, button0);
    			append_dev(button0, i0);
    			append_dev(div4, t23);
    			append_dev(div4, button1);
    			append_dev(button1, i1);
    			append_dev(div5, t25);
    			append_dev(div5, span);
    			append_dev(div6, t26);
    			html_tag.m(/*strlegend*/ ctx[2], div6);
    			append_dev(div11, t27);
    			append_dev(div11, div9);
    			append_dev(div9, div7);
    			append_dev(div7, svg_1);
    			append_dev(div9, t28);
    			append_dev(div9, div8);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(div8, null);
    			}

    			append_dev(div11, t29);
    			append_dev(div11, div10);
    			append_dev(div10, p6);
    			append_dev(div10, t31);
    			append_dev(div10, p7);
    			insert_dev(target, t33, anchor);
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div12);
    			append_dev(div12, h3);
    			append_dev(div12, t35);
    			append_dev(div12, p8);
    			append_dev(div12, t37);
    			append_dev(div12, p9);
    			append_dev(footer, t39);
    			append_dev(footer, div13);
    			append_dev(div13, p10);
    			append_dev(p10, br2);
    			append_dev(p10, t40);
    			append_dev(footer, t41);
    			append_dev(footer, a);
    			append_dev(a, ion_icon);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(link_action = link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*strlegend*/ 4) html_tag.p(/*strlegend*/ ctx[2]);

    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope*/ 16) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty[0] & /*counts, testlabel*/ 3) {
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
    			if (detaching) detach_dev(article);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(div11);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			if (detaching) detach_dev(t33);
    			if (detaching) detach_dev(footer);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const height = 280;
    const width = 500;
    const r = 3.5;

    function swatches(
    	{ color, format = x => x, swatchSize = 20, swatchWidth = swatchSize, swatchHeight = swatchSize, marginLeft = 0 }
    ) {
    	const id = "color-legend2";

    	return `<div style="display: flex; align-items: center; min-height: 33px; margin-left: ${+marginLeft}px; font: 12px sans-serif; float: right">
        <style>

        .${id} {
        pointer-events: none;
        display: inline-flex;
        align-items: flex-end;
        margin-right: 2em;
        font-style: italic;
        fill: gray;
        }

        .${id}::before {
        content: "";
        width: ${+swatchWidth}px;
        height: ${+swatchHeight}px;
        margin-right: 0.5em;
        margin-top: 10px;
        background: var(--color);
        }

        </style>
        <div>${color.domain().map(value => `<span class="${id}" style="--color: ${color(value)}">${value}</span>`).join("")}</div>`;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let outdata;
    	let sortdata;
    	var kdata;

    	const color = {
    		"山鸢尾": "red",
    		"杂色鸢尾": "steelblue",
    		"维吉尼亚鸢尾": "green"
    	};

    	const en2ch = {
    		"Iris-setosa": "山鸢尾",
    		"Iris-versicolor": "杂色鸢尾",
    		"Iris-virginica": "维吉尼亚鸢尾"
    	};

    	const arrcolor = ["red", "steelblue", "green"];
    	const labels = ["山鸢尾", "杂色鸢尾", "维吉尼亚鸢尾"];
    	const margin = { top: 20, right: 10, bottom: 10, left: 40 };
    	let counts = { "山鸢尾": 0, "杂色鸢尾": 0, "维吉尼亚鸢尾": 0 };
    	let testlabel = "";
    	let k = 15;
    	let svg;
    	let gtext, plusText;
    	let xAxis;
    	let yAxis;
    	let y, ry;
    	let x, rx;
    	let point = {};
    	let svglink;
    	let strlegend;

    	onMount(async () => {
    		// window.location.hash = "#article";
    		window.scrollTo(0, 0);

    		$$invalidate(2, strlegend = swatches({ color: d3.scaleOrdinal(labels, arrcolor) }));
    		const data = await d3.csv("/assets/data/Iris.csv");

    		// const data = d3.csvParse(await FileAttachment("/assets/data/us-population-state-age.csv").text(), d3.autoType);
    		// const ages = data.columns.slice(1);
    		// for (const d of data) d.total = d3.sum(ages, age => d[age]);
    		// outdata = ages.flatMap(age => data.map(d => ({name: d.name, age, value: d[age] / d.total})));
    		const newlabels = data.columns.slice(1);

    		outdata = data.map(d => ({
    			x: d.SepalLengthCm * 10,
    			y: d.PetalLengthCm * 10,
    			label: en2ch[d.Species]
    		}));

    		y = d3.scaleLinear().domain(d3.extent(outdata, d => d.y)).range([margin.top, height - margin.bottom]);
    		ry = d3.scaleLinear().domain([margin.top, height - margin.bottom]).range(d3.extent(outdata, d => d.y));
    		x = d3.scaleLinear().domain(d3.extent(outdata, d => d.x)).range([margin.left + 10, width - margin.right]);
    		rx = d3.scaleLinear().domain([margin.left + 10, width - margin.right]).range(d3.extent(outdata, d => d.x));
    		yAxis = g => g.attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y).ticks(10)).call(g => g.selectAll(".tick line").clone().attr("stroke-opacity", 0.1).attr("x2", width - margin.right - margin.left)).call(g => g.selectAll(".domain").remove());
    		xAxis = g => g.attr("transform", `translate(0,${margin.top})`).call(d3.axisTop(x).ticks(20)).call(g => g.selectAll(".tick line").clone().attr("stroke-opacity", 0.1).attr("y2", height - margin.bottom - margin.top)).call(g => g.selectAll(".domain").remove());
    		svg = d3.select("#knn-svg").attr("viewBox", [0, 0, width, height]);
    		svg.append("g").style("pointer-events", "none").call(xAxis);
    		svg.append("text").attr("transform", `translate(${5},${height - 10})`).style("font-size", "10px").attr("class", "annotation-text").text("花瓣长度（mm)");
    		svg.append("g").style("pointer-events", "none").call(yAxis);
    		svg.append("text").attr("transform", `translate(${width - 80},${margin.top + 10})`).attr("class", "annotation-text").style("font-size", "10px").text("花萼长度（mm)");
    		svg.append("g").attr("class", "tcircles").attr("fill", "none").attr("pointer-events", "all").selectAll("circle").data(outdata).join("circle").attr("stroke", d => color[d.label]).attr("r", r).attr("cx", d => x(d.x)).attr("cy", d => y(d.y)).append("title").text(d => `品种: ${d.label}  位置:(${d.x},  ${d.y})`);
    		const circles = d3.range(1).map(i => ({ x: 56, y: 25 }));
    		point.x = 56;
    		point.y = 25;
    		svg.append("g").selectAll("circle").data(circles).join("circle").attr("fill", "yellow").attr("stroke", "#C4C400").attr("r", r).attr("cx", d => x(d.x)).attr("cy", d => y(d.y)).style("cursor", "move").call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));
    		sortdata = outdata;

    		sortdata.sort((a, b) => {
    			let distance1 = (a.x - point.x) ** 2 + (a.y - point.y) ** 2;
    			let distance2 = (b.x - point.x) ** 2 + (b.y - point.y) ** 2;
    			return distance1 - distance2;
    		});

    		kdata = sortdata.slice(0, k);
    		svglink = svg.insert("g", ".tcircles").attr("id", "lines").selectAll("line").data(kdata).join("line").attr("stroke", d => color[d.label]).style("opacity", 0.5).attr("x1", x(point.x)).attr("y1", y(point.y)).attr("x2", d => x(d.x)).attr("y2", d => y(d.y));
    		d3.select("#num-k").text("k = " + k);

    		d3.select("#add-layers").on("click", () => {
    			k++;
    			let diff = 1;

    			if (k > 30) {
    				k = 30;
    				diff = 0;
    			}

    			d3.select("#num-k").text("k = " + k);
    			drawklines(diff);
    		});

    		d3.select("#remove-layers").on("click", () => {
    			k--;
    			let diff = -1;

    			if (k <= 0) {
    				k = 1;
    				diff = 0;
    			}

    			d3.select("#num-k").text("k = " + k);
    			drawklines(diff);
    		});

    		countlabelnums();
    	});

    	function drawklines(diff) {
    		sortdata.sort((a, b) => {
    			let distance1 = (a.x - point.x) ** 2 + (a.y - point.y) ** 2;
    			let distance2 = (b.x - point.x) ** 2 + (b.y - point.y) ** 2;
    			return distance1 - distance2;
    		});

    		kdata = sortdata.slice(0, k);

    		if (diff > 0) {
    			svglink = d3.select("#lines").selectAll("line");
    			svglink.data(kdata).enter().append("line").transition().duration(1000).attr("stroke", d => color[d.label]).style("opacity", 0.5).attr("x1", x(point.x)).attr("y1", y(point.y)).attr("x2", d => x(d.x)).attr("y2", d => y(d.y));
    		} else if (diff < 0) {
    			svglink = d3.select("#lines").selectAll("line");
    			svglink.data(kdata).exit().transition().duration(100).remove().attr("stroke", d => color[d.label]).style("opacity", 0.5).attr("x1", x(point.x)).attr("y1", y(point.y)).attr("x2", d => x(d.x)).attr("y2", d => y(d.y));
    		} else {
    			svglink.data(kdata).transition().duration(1000).attr("x1", x(point.x)).attr("y1", y(point.y)).attr("x2", d => x(d.x)).attr("y2", d => y(d.y)).attr("stroke", d => color[d.label]).style("opacity", 0.5);
    		}
    	}

    	function dragstarted(d) {
    		svglink = d3.select("#lines").selectAll("line");
    		d3.select(this).attr("stroke", "black");
    	}

    	function dragged(d) {
    		d3.select(this).raise().attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
    		point.x = rx(d3.event.x);
    		point.y = ry(d3.event.y);
    		svglink.data(kdata).attr("x1", x(point.x)).attr("y1", y(point.y)).attr("x2", d => x(d.x)).attr("y2", d => y(d.y));
    	}

    	function dragended(d) {
    		d3.select(this).attr("stroke", "#C4C400");

    		if (d3.event.x > width - margin.right || d3.event.x < margin.left + 10) {
    			d3.select(this).attr("cx", d.x = x(50));
    			point.x = 50;
    		} else if (d3.event.y > height - margin.bottom || d3.event.y < margin.top) {
    			d3.select(this).attr("cy", d.y = y(50));
    			point.y = 50;
    		} else {
    			point.x = rx(d3.event.x);
    			point.y = ry(d3.event.y);
    		}

    		drawklines(0);
    		countlabelnums();
    	}

    	function countlabelnums() {
    		$$invalidate(0, counts = { "山鸢尾": 0, "杂色鸢尾": 0, "维吉尼亚鸢尾": 0 });

    		for (let i = 0; i < k; ++i) {
    			$$invalidate(0, counts[kdata[i].label] += 1, counts);
    		}

    		let max_num = 0;
    		let keys = Object.keys(counts);

    		for (let i = 0; i < keys.length; ++i) {
    			if (counts[keys[i]] > max_num) {
    				max_num = counts[keys[i]];
    				$$invalidate(1, testlabel = keys[i]);
    			}
    		}
    	}

    	const writable_props = [];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Knn> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Knn", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		link,
    		outdata,
    		sortdata,
    		kdata,
    		color,
    		en2ch,
    		arrcolor,
    		labels,
    		margin,
    		height,
    		width,
    		r,
    		counts,
    		testlabel,
    		k,
    		svg,
    		gtext,
    		plusText,
    		xAxis,
    		yAxis,
    		y,
    		ry,
    		x,
    		rx,
    		point,
    		svglink,
    		strlegend,
    		drawklines,
    		dragstarted,
    		dragged,
    		dragended,
    		countlabelnums,
    		swatches
    	});

    	$$self.$inject_state = $$props => {
    		if ("outdata" in $$props) outdata = $$props.outdata;
    		if ("sortdata" in $$props) sortdata = $$props.sortdata;
    		if ("kdata" in $$props) kdata = $$props.kdata;
    		if ("counts" in $$props) $$invalidate(0, counts = $$props.counts);
    		if ("testlabel" in $$props) $$invalidate(1, testlabel = $$props.testlabel);
    		if ("k" in $$props) k = $$props.k;
    		if ("svg" in $$props) svg = $$props.svg;
    		if ("gtext" in $$props) gtext = $$props.gtext;
    		if ("plusText" in $$props) plusText = $$props.plusText;
    		if ("xAxis" in $$props) xAxis = $$props.xAxis;
    		if ("yAxis" in $$props) yAxis = $$props.yAxis;
    		if ("y" in $$props) y = $$props.y;
    		if ("ry" in $$props) ry = $$props.ry;
    		if ("x" in $$props) x = $$props.x;
    		if ("rx" in $$props) rx = $$props.rx;
    		if ("point" in $$props) point = $$props.point;
    		if ("svglink" in $$props) svglink = $$props.svglink;
    		if ("strlegend" in $$props) $$invalidate(2, strlegend = $$props.strlegend);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [counts, testlabel, strlegend, labels, $$scope, $$slots];
    }

    class Knn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Knn",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\views\Graph1_Dataview.svelte generated by Svelte v3.24.0 */
    const file$1 = "src\\views\\Graph1_Dataview.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let svg;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			attr_dev(svg, "id", "two_layer_network");
    			attr_dev(svg, "width", "100%");
    			attr_dev(svg, "height", "100%");
    			add_location(svg, file$1, 51, 2, 1168);
    			set_style(div, "display", "inline-block");
    			set_style(div, "vertical-align", "middle");
    			add_location(div, file$1, 50, 0, 1104);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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
    	let simple_network;

    	const redraw = () => {
    		var tlw = d3.select("#two_layer_network").attr("width", 200).attr("height", 200);
    		tlw.append("circle").attr("cx", 50).attr("cy", 50).attr("r", 15);
    		tlw.append("circle").attr("cx", 50).attr("cy", 150).attr("r", 15);
    		tlw.append("circle").attr("cx", 150).attr("cy", 100).attr("r", 15);
    		tlw.append("line").attr("x1", 50).attr("y1", 50).attr("x2", 150).attr("y2", 100).attr("stroke", "black").attr("stroke-width", "1px");
    		tlw.append("line").attr("x1", 50).attr("y1", 150).attr("x2", 150).attr("y2", 100).attr("stroke", "black").attr("stroke-width", "1px");
    	};

    	onMount(async () => {
    		redraw();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Graph1_Dataview> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Graph1_Dataview", $$slots, []);

    	$$self.$capture_state = () => ({
    		onMount,
    		afterUpdate,
    		createEventDispatcher,
    		simple_network,
    		redraw
    	});

    	$$self.$inject_state = $$props => {
    		if ("simple_network" in $$props) simple_network = $$props.simple_network;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class Graph1_Dataview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Graph1_Dataview",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\views\Graph1_Animator.svelte generated by Svelte v3.24.0 */
    const file$2 = "src\\views\\Graph1_Animator.svelte";

    function create_fragment$3(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let t0;
    	let br;
    	let t1;
    	let graph1dataview;
    	let t2;
    	let p;
    	let t3;
    	let t4;
    	let t5;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	graph1dataview = new Graph1_Dataview({
    			props: {
    				input1: /*input1*/ ctx[0],
    				input2: /*input2*/ ctx[1],
    				weight1: /*weight1*/ ctx[2],
    				weight2: /*weight2*/ ctx[3],
    				output: /*output*/ ctx[4]
    			},
    			$$inline: true
    		});

    	graph1dataview.$on("message", /*handleMouseover*/ ctx[6]);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text("2 inputs and 1 output");
    			br = element("br");
    			t1 = space();
    			create_component(graph1dataview.$$.fragment);
    			t2 = space();
    			p = element("p");
    			t3 = text("output:");
    			t4 = text(/*output*/ ctx[4]);
    			t5 = space();
    			button = element("button");
    			button.textContent = "new output";
    			add_location(br, file$2, 48, 27, 1320);
    			attr_dev(div0, "class", "header-text svelte-t8y74c");
    			add_location(div0, file$2, 47, 4, 1266);
    			add_location(p, file$2, 52, 4, 1493);
    			add_location(button, file$2, 53, 4, 1521);
    			attr_dev(div1, "class", "column has-text-centered svelte-t8y74c");
    			add_location(div1, file$2, 46, 2, 1222);
    			attr_dev(div2, "class", "wrapper svelte-t8y74c");
    			add_location(div2, file$2, 45, 0, 1197);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div0, br);
    			append_dev(div1, t1);
    			mount_component(graph1dataview, div1, null);
    			append_dev(div1, t2);
    			append_dev(div1, p);
    			append_dev(p, t3);
    			append_dev(p, t4);
    			append_dev(div1, t5);
    			append_dev(div1, button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*calculate*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const graph1dataview_changes = {};
    			if (dirty & /*input1*/ 1) graph1dataview_changes.input1 = /*input1*/ ctx[0];
    			if (dirty & /*input2*/ 2) graph1dataview_changes.input2 = /*input2*/ ctx[1];
    			if (dirty & /*weight1*/ 4) graph1dataview_changes.weight1 = /*weight1*/ ctx[2];
    			if (dirty & /*weight2*/ 8) graph1dataview_changes.weight2 = /*weight2*/ ctx[3];
    			if (dirty & /*output*/ 16) graph1dataview_changes.output = /*output*/ ctx[4];
    			graph1dataview.$set(graph1dataview_changes);
    			if (!current || dirty & /*output*/ 16) set_data_dev(t4, /*output*/ ctx[4]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(graph1dataview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(graph1dataview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(graph1dataview);
    			mounted = false;
    			dispose();
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
    	let { input1 } = $$props;
    	let { input2 } = $$props;
    	let { weight1 } = $$props;
    	let { weight2 } = $$props;
    	let output;
    	const dispatch = createEventDispatcher();

    	function calculate() {
    		$$invalidate(4, output = input1 * weight1 + input2 * weight2);
    	}

    	function handleMouseover(event) {
    		let outputMappings = generateOutputMappings(stride, output, kernel.length, image.length, dilation);
    		outputHighlights = array1d(output.length * output.length, i => false);
    		const animatedH = event.detail.hoverH;
    		const animatedW = event.detail.hoverW;
    		outputHighlights[animatedH * output.length + animatedW] = true;
    		inputHighlights = compute_input_multiplies_with_weight(animatedH, animatedW, image.length, kernel.length, outputMappings, kernel.length);
    		isPaused = true;
    		dispatch("message", { text: isPaused });
    	}

    	const writable_props = ["input1", "input2", "weight1", "weight2"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Graph1_Animator> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Graph1_Animator", $$slots, []);

    	$$self.$set = $$props => {
    		if ("input1" in $$props) $$invalidate(0, input1 = $$props.input1);
    		if ("input2" in $$props) $$invalidate(1, input2 = $$props.input2);
    		if ("weight1" in $$props) $$invalidate(2, weight1 = $$props.weight1);
    		if ("weight2" in $$props) $$invalidate(3, weight2 = $$props.weight2);
    	};

    	$$self.$capture_state = () => ({
    		input1,
    		input2,
    		weight1,
    		weight2,
    		output,
    		createEventDispatcher,
    		Graph1Dataview: Graph1_Dataview,
    		dispatch,
    		calculate,
    		handleMouseover
    	});

    	$$self.$inject_state = $$props => {
    		if ("input1" in $$props) $$invalidate(0, input1 = $$props.input1);
    		if ("input2" in $$props) $$invalidate(1, input2 = $$props.input2);
    		if ("weight1" in $$props) $$invalidate(2, weight1 = $$props.weight1);
    		if ("weight2" in $$props) $$invalidate(3, weight2 = $$props.weight2);
    		if ("output" in $$props) $$invalidate(4, output = $$props.output);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [input1, input2, weight1, weight2, output, calculate, handleMouseover];
    }

    class Graph1_Animator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			input1: 0,
    			input2: 1,
    			weight1: 2,
    			weight2: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Graph1_Animator",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*input1*/ ctx[0] === undefined && !("input1" in props)) {
    			console.warn("<Graph1_Animator> was created without expected prop 'input1'");
    		}

    		if (/*input2*/ ctx[1] === undefined && !("input2" in props)) {
    			console.warn("<Graph1_Animator> was created without expected prop 'input2'");
    		}

    		if (/*weight1*/ ctx[2] === undefined && !("weight1" in props)) {
    			console.warn("<Graph1_Animator> was created without expected prop 'weight1'");
    		}

    		if (/*weight2*/ ctx[3] === undefined && !("weight2" in props)) {
    			console.warn("<Graph1_Animator> was created without expected prop 'weight2'");
    		}
    	}

    	get input1() {
    		throw new Error("<Graph1_Animator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input1(value) {
    		throw new Error("<Graph1_Animator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get input2() {
    		throw new Error("<Graph1_Animator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input2(value) {
    		throw new Error("<Graph1_Animator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get weight1() {
    		throw new Error("<Graph1_Animator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set weight1(value) {
    		throw new Error("<Graph1_Animator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get weight2() {
    		throw new Error("<Graph1_Animator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set weight2(value) {
    		throw new Error("<Graph1_Animator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\views\Graph1_view.svelte generated by Svelte v3.24.0 */
    const file$3 = "src\\views\\Graph1_view.svelte";

    function create_fragment$4(ctx) {
    	let div16;
    	let div15;
    	let div14;
    	let div12;
    	let div2;
    	let div1;
    	let div0;
    	let label0;
    	let t1;
    	let input0;
    	let t2;
    	let div5;
    	let div4;
    	let div3;
    	let label1;
    	let t4;
    	let input1;
    	let t5;
    	let div8;
    	let div7;
    	let div6;
    	let label2;
    	let t7;
    	let input2;
    	let t8;
    	let div11;
    	let div10;
    	let div9;
    	let label3;
    	let t10;
    	let input3;
    	let t11;
    	let div13;
    	let graph1animator;
    	let current;
    	let mounted;
    	let dispose;

    	graph1animator = new Graph1_Animator({
    			props: {
    				input1: /*inputNode1*/ ctx[0],
    				input2: /*inputNode2*/ ctx[1],
    				weight1: /*weight_1*/ ctx[2],
    				weight2: /*weight_2*/ ctx[3]
    			},
    			$$inline: true
    		});

    	graph1animator.$on("message", handlePauseFromInteraction);

    	const block = {
    		c: function create() {
    			div16 = element("div");
    			div15 = element("div");
    			div14 = element("div");
    			div12 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Input Node1:";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			label1 = element("label");
    			label1.textContent = "Input Node2:";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			div8 = element("div");
    			div7 = element("div");
    			div6 = element("div");
    			label2 = element("label");
    			label2.textContent = "Weight1:";
    			t7 = space();
    			input2 = element("input");
    			t8 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div9 = element("div");
    			label3 = element("label");
    			label3.textContent = "Weight2:";
    			t10 = space();
    			input3 = element("input");
    			t11 = space();
    			div13 = element("div");
    			create_component(graph1animator.$$.fragment);
    			attr_dev(label0, "class", "label svelte-159efdy");
    			add_location(label0, file$3, 116, 14, 1979);
    			attr_dev(div0, "class", "field-label is-normal svelte-159efdy");
    			add_location(div0, file$3, 115, 12, 1928);
    			attr_dev(input0, "class", "input is-very-small svelte-159efdy");
    			attr_dev(input0, "type", "number");
    			add_location(input0, file$3, 118, 12, 2054);
    			attr_dev(div1, "class", "field is-horizontal svelte-159efdy");
    			add_location(div1, file$3, 114, 10, 1881);
    			attr_dev(div2, "class", "input-row");
    			add_location(div2, file$3, 113, 8, 1846);
    			attr_dev(label1, "class", "label svelte-159efdy");
    			add_location(label1, file$3, 125, 14, 2304);
    			attr_dev(div3, "class", "field-label is-normal svelte-159efdy");
    			add_location(div3, file$3, 124, 12, 2253);
    			attr_dev(input1, "class", "input is-very-small svelte-159efdy");
    			attr_dev(input1, "type", "number");
    			add_location(input1, file$3, 127, 12, 2379);
    			attr_dev(div4, "class", "field is-horizontal svelte-159efdy");
    			add_location(div4, file$3, 123, 10, 2206);
    			attr_dev(div5, "class", "input-row");
    			add_location(div5, file$3, 122, 6, 2171);
    			attr_dev(label2, "class", "label svelte-159efdy");
    			add_location(label2, file$3, 134, 14, 2631);
    			attr_dev(div6, "class", "field-label is-normal svelte-159efdy");
    			add_location(div6, file$3, 133, 12, 2580);
    			attr_dev(input2, "class", "input is-very-small svelte-159efdy");
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$3, 136, 12, 2702);
    			attr_dev(div7, "class", "field is-horizontal svelte-159efdy");
    			add_location(div7, file$3, 132, 10, 2533);
    			attr_dev(div8, "class", "input-row");
    			add_location(div8, file$3, 131, 8, 2498);
    			attr_dev(label3, "class", "label svelte-159efdy");
    			add_location(label3, file$3, 143, 14, 2952);
    			attr_dev(div9, "class", "field-label is-normal svelte-159efdy");
    			add_location(div9, file$3, 142, 12, 2901);
    			attr_dev(input3, "class", "input is-very-small svelte-159efdy");
    			attr_dev(input3, "type", "number");
    			add_location(input3, file$3, 145, 12, 3023);
    			attr_dev(div10, "class", "field is-horizontal svelte-159efdy");
    			add_location(div10, file$3, 141, 10, 2854);
    			attr_dev(div11, "class", "input-row");
    			add_location(div11, file$3, 140, 8, 2819);
    			attr_dev(div12, "class", "left-part svelte-159efdy");
    			add_location(div12, file$3, 112, 6, 1813);
    			attr_dev(div13, "class", "right-part svelte-159efdy");
    			add_location(div13, file$3, 151, 8, 3156);
    			attr_dev(div14, "class", "content-container svelte-159efdy");
    			add_location(div14, file$3, 111, 4, 1774);
    			attr_dev(div15, "class", "box svelte-159efdy");
    			add_location(div15, file$3, 109, 2, 1749);
    			attr_dev(div16, "class", "container has-text-centered");
    			attr_dev(div16, "id", "detailview-container");
    			add_location(div16, file$3, 108, 0, 1678);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div16, anchor);
    			append_dev(div16, div15);
    			append_dev(div15, div14);
    			append_dev(div14, div12);
    			append_dev(div12, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, label0);
    			append_dev(div1, t1);
    			append_dev(div1, input0);
    			set_input_value(input0, /*inputNode1*/ ctx[0]);
    			append_dev(div12, t2);
    			append_dev(div12, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, label1);
    			append_dev(div4, t4);
    			append_dev(div4, input1);
    			set_input_value(input1, /*inputNode2*/ ctx[1]);
    			append_dev(div12, t5);
    			append_dev(div12, div8);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, label2);
    			append_dev(div7, t7);
    			append_dev(div7, input2);
    			set_input_value(input2, /*weight_1*/ ctx[2]);
    			append_dev(div12, t8);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, label3);
    			append_dev(div10, t10);
    			append_dev(div10, input3);
    			set_input_value(input3, /*weight_2*/ ctx[3]);
    			append_dev(div14, t11);
    			append_dev(div14, div13);
    			mount_component(graph1animator, div13, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[4]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[5]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[6]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[7])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*inputNode1*/ 1 && to_number(input0.value) !== /*inputNode1*/ ctx[0]) {
    				set_input_value(input0, /*inputNode1*/ ctx[0]);
    			}

    			if (dirty & /*inputNode2*/ 2 && to_number(input1.value) !== /*inputNode2*/ ctx[1]) {
    				set_input_value(input1, /*inputNode2*/ ctx[1]);
    			}

    			if (dirty & /*weight_1*/ 4 && to_number(input2.value) !== /*weight_1*/ ctx[2]) {
    				set_input_value(input2, /*weight_1*/ ctx[2]);
    			}

    			if (dirty & /*weight_2*/ 8 && to_number(input3.value) !== /*weight_2*/ ctx[3]) {
    				set_input_value(input3, /*weight_2*/ ctx[3]);
    			}

    			const graph1animator_changes = {};
    			if (dirty & /*inputNode1*/ 1) graph1animator_changes.input1 = /*inputNode1*/ ctx[0];
    			if (dirty & /*inputNode2*/ 2) graph1animator_changes.input2 = /*inputNode2*/ ctx[1];
    			if (dirty & /*weight_1*/ 4) graph1animator_changes.weight1 = /*weight_1*/ ctx[2];
    			if (dirty & /*weight_2*/ 8) graph1animator_changes.weight2 = /*weight_2*/ ctx[3];
    			graph1animator.$set(graph1animator_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(graph1animator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(graph1animator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div16);
    			destroy_component(graph1animator);
    			mounted = false;
    			run_all(dispose);
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

    function handleClickPause() {
    	isPaused = !isPaused;
    }

    function handlePauseFromInteraction(event) {
    	isPaused = event.detail.text;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let inputNode1;
    	let inputNode2;
    	let weight_1;
    	let weight_2;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Graph1_view> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Graph1_view", $$slots, []);

    	function input0_input_handler() {
    		inputNode1 = to_number(this.value);
    		$$invalidate(0, inputNode1);
    	}

    	function input1_input_handler() {
    		inputNode2 = to_number(this.value);
    		$$invalidate(1, inputNode2);
    	}

    	function input2_input_handler() {
    		weight_1 = to_number(this.value);
    		$$invalidate(2, weight_1);
    	}

    	function input3_input_handler() {
    		weight_2 = to_number(this.value);
    		$$invalidate(3, weight_2);
    	}

    	$$self.$capture_state = () => ({
    		Graph1Animator: Graph1_Animator,
    		inputNode1,
    		inputNode2,
    		weight_1,
    		weight_2,
    		handleClickPause,
    		handlePauseFromInteraction
    	});

    	$$self.$inject_state = $$props => {
    		if ("inputNode1" in $$props) $$invalidate(0, inputNode1 = $$props.inputNode1);
    		if ("inputNode2" in $$props) $$invalidate(1, inputNode2 = $$props.inputNode2);
    		if ("weight_1" in $$props) $$invalidate(2, weight_1 = $$props.weight_1);
    		if ("weight_2" in $$props) $$invalidate(3, weight_2 = $$props.weight_2);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		inputNode1,
    		inputNode2,
    		weight_1,
    		weight_2,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler
    	];
    }

    class Graph1_view extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Graph1_view",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\views\home.svelte generated by Svelte v3.24.0 */
    const file$4 = "src\\views\\home.svelte";

    function create_fragment$5(ctx) {
    	let div21;
    	let div0;
    	let t0;
    	let div2;
    	let h20;
    	let t2;
    	let br;
    	let t3;
    	let div1;
    	let t4;
    	let h50;
    	let t6;
    	let div3;
    	let button0;
    	let i0;
    	let t8;
    	let div4;
    	let h21;
    	let t10;
    	let div5;
    	let h51;
    	let t12;
    	let h52;
    	let t14;
    	let div6;
    	let button1;
    	let i1;
    	let t16;
    	let div7;
    	let h22;
    	let t18;
    	let h53;
    	let t20;
    	let div8;
    	let a0;
    	let t22;
    	let div9;
    	let button2;
    	let i2;
    	let t24;
    	let div10;
    	let h23;
    	let t26;
    	let div11;
    	let h54;
    	let t28;
    	let h55;
    	let t30;
    	let nn1;
    	let t31;
    	let h56;
    	let t33;
    	let li0;
    	let a1;
    	let t35;
    	let div12;
    	let button3;
    	let i3;
    	let t37;
    	let div13;
    	let h24;
    	let t39;
    	let div14;
    	let h57;
    	let t41;
    	let li1;
    	let a2;
    	let t43;
    	let div15;
    	let knn;
    	let t44;
    	let div16;
    	let h25;
    	let t46;
    	let div17;
    	let h58;
    	let t48;
    	let li2;
    	let a3;
    	let t50;
    	let div18;
    	let button4;
    	let i4;
    	let t52;
    	let div19;
    	let h26;
    	let t54;
    	let div20;
    	let h59;
    	let current;
    	nn1 = new Graph1_view({ $$inline: true });
    	knn = new Knn({ $$inline: true });

    	const block = {
    		c: function create() {
    			div21 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div2 = element("div");
    			h20 = element("h2");
    			h20.textContent = "1.决策树——“分而治之”";
    			t2 = space();
    			br = element("br");
    			t3 = space();
    			div1 = element("div");
    			t4 = space();
    			h50 = element("h5");
    			h50.textContent = "你想起之前有一个学园艺的哥哥，你问他：“这是哪一类的鸢尾花？”他向你询问更多的细节：你先看“它的花萼长吗？”，如果是“长花萼”，我们再看“它的花瓣是怎样的形态？”，是“窄花瓣”，那我们得到最终决策：这是山鸢尾花。";
    			t6 = space();
    			div3 = element("div");
    			button0 = element("button");
    			i0 = element("i");
    			i0.textContent = "keyboard_arrow_down";
    			t8 = space();
    			div4 = element("div");
    			h21 = element("h2");
    			h21.textContent = "1. 遇到分类问题";
    			t10 = space();
    			div5 = element("div");
    			h51 = element("h5");
    			h51.textContent = "你观察到有一块集中的部分的鸢尾有较大的花瓣，而它旁边的一块的花瓣却很小。你想搞清楚他们究竟属于哪一类鸢尾花，于是你上网搜索，发现网上说可以根据一些特征值来刻画事物的某些方面的特点，比如通过花萼的长、花萼的宽、花瓣的长和花瓣的宽来辨别他们。于是你测量了一些花的长和宽。";
    			t12 = space();
    			h52 = element("h5");
    			h52.textContent = "***********************一些鸢尾花图片***********************";
    			t14 = space();
    			div6 = element("div");
    			button1 = element("button");
    			i1 = element("i");
    			i1.textContent = "keyboard_arrow_down";
    			t16 = space();
    			div7 = element("div");
    			h22 = element("h2");
    			h22.textContent = "2.决策树-简单分析";
    			t18 = space();
    			h53 = element("h5");
    			h53.textContent = "网上说宽大于2cm，长大于5cm的可能是山鸢尾。而小于的可能是变色鸢尾，你发现了很多这样的判断，\r\n    你想把他们整理一下，于是你借鉴树的结构将他们分成了这种判断：";
    			t20 = space();
    			div8 = element("div");
    			a0 = element("a");
    			a0.textContent = "尝试下决策树吧";
    			t22 = space();
    			div9 = element("div");
    			button2 = element("button");
    			i2 = element("i");
    			i2.textContent = "keyboard_arrow_down";
    			t24 = space();
    			div10 = element("div");
    			h23 = element("h2");
    			h23.textContent = "3.初步构造分类器";
    			t26 = space();
    			div11 = element("div");
    			h54 = element("h5");
    			h54.textContent = "然后你又换了一种思路\r\n      你将花瓣的长作为x轴，花瓣的宽作为y轴，在坐标轴上画出了他们的分布。";
    			t28 = space();
    			h55 = element("h5");
    			h55.textContent = "***************一些样简单交互*********************";
    			t30 = space();
    			create_component(nn1.$$.fragment);
    			t31 = space();
    			h56 = element("h5");
    			h56.textContent = "这就是人工智能中的分类问题。\r\n那么我们要怎么分开他们呢 你想到了用一条直线来分开他们。在直线上方的属于山鸢尾，在直线下方的属于变色鸢尾。这样的方式叫作分类器\r\n但是你也发现了，这里有无数直线都可以的可能来讲他们分开。你想到现在大家都在谈用计算机来帮我们完成一些任务，那么要怎么才能让分类器自己学习得到分类直线呢。\r\n试一试：";
    			t33 = space();
    			li0 = element("li");
    			a1 = element("a");
    			a1.textContent = "尝试下神经网络吧";
    			t35 = space();
    			div12 = element("div");
    			button3 = element("button");
    			i3 = element("i");
    			i3.textContent = "keyboard_arrow_down";
    			t37 = space();
    			div13 = element("div");
    			h24 = element("h2");
    			h24.textContent = "4. KNN";
    			t39 = space();
    			div14 = element("div");
    			h57 = element("h5");
    			h57.textContent = "你觉得这样好像还不错。于是你在更远处的一块地，发现那里的鸢尾花好像和前面两种也有不同之处，它们长得更高，更细长。\r\n      于是你认为植物园的工作人员们可能将某一类鸢尾花集中地种在了某一块地方，于是你测量更多的数据重新绘制了一张坐标图。\r\n      但是新的问题来了，要怎么判断中间一些点的种类到底是什么呢。\r\n      于是你想到了一句谚语：“近朱者赤近墨者黑。”\r\n      试一试：";
    			t41 = space();
    			li1 = element("li");
    			a2 = element("a");
    			a2.textContent = "尝试下KNN吧";
    			t43 = space();
    			div15 = element("div");
    			create_component(knn.$$.fragment);
    			t44 = space();
    			div16 = element("div");
    			h25 = element("h2");
    			h25.textContent = "5.CNN-一气呵成";
    			t46 = space();
    			div17 = element("div");
    			h58 = element("h5");
    			h58.textContent = "然后你发现这几种方法各有好坏，也有不足。\r\n而且测量起来特别麻烦。\r\n你想到了我们都在用的一些识别植物的APP，于是你打开了一个软件，拍了一张照片，立马就将它分为了山鸢尾花。这是怎么一回事呢。\r\n这个又用的哪些特征呢。\r\n这个和上面的方法有什么不同之处呢。\r\n试一试：";
    			t48 = space();
    			li2 = element("li");
    			a3 = element("a");
    			a3.textContent = "尝试下CNN吧";
    			t50 = space();
    			div18 = element("div");
    			button4 = element("button");
    			i4 = element("i");
    			i4.textContent = "keyboard_arrow_down";
    			t52 = space();
    			div19 = element("div");
    			h26 = element("h2");
    			h26.textContent = "6.不同模型比较";
    			t54 = space();
    			div20 = element("div");
    			h59 = element("h5");
    			h59.textContent = "*****************一些交互***********************";
    			attr_dev(div0, "class", "name_md extra svelte-julytb");
    			attr_dev(div0, "id", "Zero");
    			add_location(div0, file$4, 109, 2, 2302);
    			attr_dev(h20, "class", "Content-module--content__title--2nRHa  svelte-julytb");
    			add_location(h20, file$4, 111, 4, 2360);
    			add_location(br, file$4, 114, 4, 2449);
    			attr_dev(div1, "class", "Content-module--content__spacer--2kN9Y svelte-julytb");
    			add_location(div1, file$4, 115, 4, 2460);
    			attr_dev(h50, "class", "svelte-julytb");
    			add_location(h50, file$4, 116, 4, 2520);
    			add_location(div2, file$4, 110, 2, 2349);
    			attr_dev(i0, "class", "material-icons");
    			add_location(i0, file$4, 125, 6, 2902);
    			attr_dev(button0, "class", "mdl-button mdl-js-button mdl-button--fab");
    			add_location(button0, file$4, 124, 4, 2837);
    			attr_dev(div3, "class", "more");
    			add_location(div3, file$4, 122, 2, 2682);
    			attr_dev(h21, "class", "svelte-julytb");
    			add_location(h21, file$4, 128, 38, 3016);
    			attr_dev(div4, "class", "name_md extra svelte-julytb");
    			attr_dev(div4, "id", "One");
    			add_location(div4, file$4, 128, 2, 2980);
    			attr_dev(h51, "class", "svelte-julytb");
    			add_location(h51, file$4, 130, 4, 3055);
    			attr_dev(h52, "class", "svelte-julytb");
    			add_location(h52, file$4, 134, 4, 3222);
    			add_location(div5, file$4, 129, 2, 3044);
    			attr_dev(i1, "class", "material-icons");
    			add_location(i1, file$4, 141, 6, 3539);
    			attr_dev(button1, "class", "mdl-button mdl-js-button mdl-button--fab");
    			add_location(button1, file$4, 140, 4, 3474);
    			attr_dev(div6, "class", "more");
    			add_location(div6, file$4, 138, 2, 3319);
    			attr_dev(h22, "class", "svelte-julytb");
    			add_location(h22, file$4, 145, 38, 3655);
    			attr_dev(div7, "class", "name_md extra svelte-julytb");
    			attr_dev(div7, "id", "One");
    			add_location(div7, file$4, 145, 2, 3619);
    			attr_dev(h53, "class", "svelte-julytb");
    			add_location(h53, file$4, 146, 2, 3684);
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "href", "/dt/index.html");
    			add_location(a0, file$4, 151, 4, 3802);
    			add_location(div8, file$4, 150, 2, 3791);
    			attr_dev(i2, "class", "material-icons");
    			add_location(i2, file$4, 158, 6, 4107);
    			attr_dev(button2, "class", "mdl-button mdl-js-button mdl-button--fab");
    			add_location(button2, file$4, 157, 4, 4042);
    			attr_dev(div9, "class", "more");
    			add_location(div9, file$4, 155, 2, 3887);
    			attr_dev(h23, "class", "svelte-julytb");
    			add_location(h23, file$4, 162, 38, 4223);
    			attr_dev(div10, "class", "name_md extra svelte-julytb");
    			attr_dev(div10, "id", "One");
    			add_location(div10, file$4, 162, 2, 4187);
    			attr_dev(h54, "class", "svelte-julytb");
    			add_location(h54, file$4, 164, 2, 4260);
    			attr_dev(h55, "class", "svelte-julytb");
    			add_location(h55, file$4, 169, 4, 4343);
    			attr_dev(h56, "class", "svelte-julytb");
    			add_location(h56, file$4, 171, 4, 4414);
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "href", "/dist/indexnn.html");
    			attr_dev(a1, "class", "svelte-julytb");
    			add_location(a1, file$4, 178, 8, 4620);
    			attr_dev(li0, "class", "svelte-julytb");
    			add_location(li0, file$4, 177, 4, 4606);
    			add_location(div11, file$4, 163, 2, 4251);
    			attr_dev(i3, "class", "material-icons");
    			add_location(i3, file$4, 186, 6, 4943);
    			attr_dev(button3, "class", "mdl-button mdl-js-button mdl-button--fab");
    			add_location(button3, file$4, 185, 4, 4878);
    			attr_dev(div12, "class", "more");
    			add_location(div12, file$4, 183, 2, 4723);
    			attr_dev(h24, "class", "svelte-julytb");
    			add_location(h24, file$4, 190, 38, 5059);
    			attr_dev(div13, "class", "name_md extra svelte-julytb");
    			attr_dev(div13, "id", "One");
    			add_location(div13, file$4, 190, 2, 5023);
    			attr_dev(h57, "class", "svelte-julytb");
    			add_location(h57, file$4, 192, 4, 5095);
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "href", "/dt/index.html");
    			attr_dev(a2, "class", "svelte-julytb");
    			add_location(a2, file$4, 200, 8, 5337);
    			attr_dev(li1, "class", "svelte-julytb");
    			add_location(li1, file$4, 199, 4, 5323);
    			add_location(div14, file$4, 191, 2, 5084);
    			attr_dev(div15, "id", "knnss");
    			add_location(div15, file$4, 204, 2, 5416);
    			attr_dev(h25, "class", "svelte-julytb");
    			add_location(h25, file$4, 208, 36, 5495);
    			attr_dev(div16, "class", "name_md extra svelte-julytb");
    			attr_dev(div16, "id", "One");
    			add_location(div16, file$4, 208, 0, 5459);
    			attr_dev(h58, "class", "svelte-julytb");
    			add_location(h58, file$4, 210, 4, 5535);
    			attr_dev(a3, "target", "_blank");
    			attr_dev(a3, "href", "/cnn");
    			attr_dev(a3, "class", "svelte-julytb");
    			add_location(a3, file$4, 220, 8, 5714);
    			attr_dev(li2, "class", "svelte-julytb");
    			add_location(li2, file$4, 219, 4, 5700);
    			add_location(div17, file$4, 209, 2, 5524);
    			attr_dev(i4, "class", "material-icons");
    			add_location(i4, file$4, 228, 6, 6020);
    			attr_dev(button4, "class", "mdl-button mdl-js-button mdl-button--fab");
    			add_location(button4, file$4, 227, 4, 5955);
    			attr_dev(div18, "class", "more");
    			add_location(div18, file$4, 225, 2, 5800);
    			attr_dev(h26, "class", "svelte-julytb");
    			add_location(h26, file$4, 232, 38, 6136);
    			attr_dev(div19, "class", "name_md extra svelte-julytb");
    			attr_dev(div19, "id", "One");
    			add_location(div19, file$4, 232, 2, 6100);
    			attr_dev(h59, "class", "svelte-julytb");
    			add_location(h59, file$4, 234, 4, 6174);
    			add_location(div20, file$4, 233, 2, 6163);
    			attr_dev(div21, "class", "right_content svelte-julytb");
    			add_location(div21, file$4, 108, 0, 2271);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div21, anchor);
    			append_dev(div21, div0);
    			append_dev(div21, t0);
    			append_dev(div21, div2);
    			append_dev(div2, h20);
    			append_dev(div2, t2);
    			append_dev(div2, br);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div2, t4);
    			append_dev(div2, h50);
    			append_dev(div21, t6);
    			append_dev(div21, div3);
    			append_dev(div3, button0);
    			append_dev(button0, i0);
    			append_dev(div21, t8);
    			append_dev(div21, div4);
    			append_dev(div4, h21);
    			append_dev(div21, t10);
    			append_dev(div21, div5);
    			append_dev(div5, h51);
    			append_dev(div5, t12);
    			append_dev(div5, h52);
    			append_dev(div21, t14);
    			append_dev(div21, div6);
    			append_dev(div6, button1);
    			append_dev(button1, i1);
    			append_dev(div21, t16);
    			append_dev(div21, div7);
    			append_dev(div7, h22);
    			append_dev(div21, t18);
    			append_dev(div21, h53);
    			append_dev(div21, t20);
    			append_dev(div21, div8);
    			append_dev(div8, a0);
    			append_dev(div21, t22);
    			append_dev(div21, div9);
    			append_dev(div9, button2);
    			append_dev(button2, i2);
    			append_dev(div21, t24);
    			append_dev(div21, div10);
    			append_dev(div10, h23);
    			append_dev(div21, t26);
    			append_dev(div21, div11);
    			append_dev(div11, h54);
    			append_dev(div11, t28);
    			append_dev(div11, h55);
    			append_dev(div11, t30);
    			mount_component(nn1, div11, null);
    			append_dev(div11, t31);
    			append_dev(div11, h56);
    			append_dev(div11, t33);
    			append_dev(div11, li0);
    			append_dev(li0, a1);
    			append_dev(div21, t35);
    			append_dev(div21, div12);
    			append_dev(div12, button3);
    			append_dev(button3, i3);
    			append_dev(div21, t37);
    			append_dev(div21, div13);
    			append_dev(div13, h24);
    			append_dev(div21, t39);
    			append_dev(div21, div14);
    			append_dev(div14, h57);
    			append_dev(div14, t41);
    			append_dev(div14, li1);
    			append_dev(li1, a2);
    			append_dev(div21, t43);
    			append_dev(div21, div15);
    			mount_component(knn, div15, null);
    			append_dev(div21, t44);
    			append_dev(div21, div16);
    			append_dev(div16, h25);
    			append_dev(div21, t46);
    			append_dev(div21, div17);
    			append_dev(div17, h58);
    			append_dev(div17, t48);
    			append_dev(div17, li2);
    			append_dev(li2, a3);
    			append_dev(div21, t50);
    			append_dev(div21, div18);
    			append_dev(div18, button4);
    			append_dev(button4, i4);
    			append_dev(div21, t52);
    			append_dev(div21, div19);
    			append_dev(div19, h26);
    			append_dev(div21, t54);
    			append_dev(div21, div20);
    			append_dev(div20, h59);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nn1.$$.fragment, local);
    			transition_in(knn.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nn1.$$.fragment, local);
    			transition_out(knn.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div21);
    			destroy_component(nn1);
    			destroy_component(knn);
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
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Home", $$slots, []);
    	$$self.$capture_state = () => ({ Knn, NN1: Graph1_view });
    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\views\Tree.svelte generated by Svelte v3.24.0 */
    const file$5 = "src\\views\\Tree.svelte";

    function create_fragment$6(ctx) {
    	let div5;
    	let div0;
    	let h1;
    	let t1;
    	let p0;
    	let strong0;
    	let t3;
    	let div1;
    	let h20;
    	let t5;
    	let ul;
    	let li0;
    	let t7;
    	let li1;
    	let t9;
    	let li2;
    	let t11;
    	let p1;
    	let t13;
    	let div2;
    	let h21;
    	let t15;
    	let p2;
    	let t17;
    	let p3;
    	let t19;
    	let p4;
    	let t21;
    	let div3;
    	let h22;
    	let t23;
    	let p5;
    	let t25;
    	let p6;
    	let t27;
    	let div4;
    	let h23;
    	let t29;
    	let p7;
    	let strong1;
    	let t31;
    	let div6;
    	let svg;
    	let t32;
    	let footer;
    	let div7;
    	let h3;
    	let t34;
    	let p8;
    	let t36;
    	let div8;
    	let p9;
    	let t38;
    	let a;
    	let ion_icon;
    	let link_action;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Section: 决策树";
    			t1 = space();
    			p0 = element("p");
    			strong0 = element("strong");
    			strong0.textContent = "第二天，你在网上看到了一个叫做决策树的分类模型，看到了决策树的基本原理之时，你想起了之前询问一个学园艺的哥哥的经历，你问他：“这是哪一类的鸢尾花？”他向你询问更多的细节：“你先看它的花萼长吗？，如果是长花萼，我们再看看它的花瓣是怎样的形态？哦，是窄花瓣，那这应该是山鸢尾花。” \r\n            结合之前的经历，你于是明白了这就是一个决策的过程。在理解了什么是决策的过程之后，你对决策树是如何进行具体决策的过程愈发感兴趣，于是你开始了进一步的学习。";
    			t3 = space();
    			div1 = element("div");
    			h20 = element("h2");
    			h20.textContent = "决策树模型";
    			t5 = space();
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "每个“非叶结点”对应于某属性上的一次决策";
    			t7 = space();
    			li1 = element("li");
    			li1.textContent = "每个结点之后分支对应于该决策的一种可能结果";
    			t9 = space();
    			li2 = element("li");
    			li2.textContent = "每个“叶结点”对应于一个预测结果";
    			t11 = space();
    			p1 = element("p");
    			p1.textContent = "决策树的学习过程即通过对训练样本的分析来确定“划分属性”（即内部结点所对应的属性），而预测过程就是将测试示例从根结点开始，沿着划分属性所构成的“判定测试序列”下行，直到叶结点";
    			t13 = space();
    			div2 = element("div");
    			h21 = element("h2");
    			h21.textContent = "再来看看这棵树";
    			t15 = space();
    			p2 = element("p");
    			p2.textContent = "当你在选取判断的时候，你可能像之前那样判断鸢尾花花瓣的长宽。花瓣的长度和宽度是两个不同的“特征”。";
    			t17 = space();
    			p3 = element("p");
    			p3.textContent = "这个特征能否很好的区分鸢尾花的类型呢？你要如何衡量这个判断指标呢？";
    			t19 = space();
    			p4 = element("p");
    			p4.textContent = "统计学里有几种算法可以帮助我们寻找好的切分点，通过划分算法来找到当前最佳的结点划分方式。简单来讲，每一个特征针对训练数据集的前后信息变化的影响是不一样的，当这些衡量参数在划分前后变化越大，即代表这种影响越大。而影响越大，就表明该特征更加重要。";
    			t21 = space();
    			div3 = element("div");
    			h22 = element("h2");
    			h22.textContent = "决策树生长";
    			t23 = space();
    			p5 = element("p");
    			p5.textContent = "当你点开各个分节点，更多的分支会给决策树增加新的信息，从而增强决策树的预测准确性。加多一层，决策树的准确性增加到84%。再加几层，准确性增加到96%。我们甚至可以继续加分支直到决策树的分类正确率达到100%，这所有决策树末梢的分类结果会是纯粹山鸢尾花或者变色鸢尾，即将两类鸢尾花完全分开。";
    			t25 = space();
    			p6 = element("p");
    			p6.textContent = "决策树的末节通常又叫做叶节点(leaf nodes)。决策树的预测取决于叶节点内哪一类的样本相对较多。";
    			t27 = space();
    			div4 = element("div");
    			h23 = element("h2");
    			h23.textContent = "尝试一下";
    			t29 = space();
    			p7 = element("p");
    			strong1 = element("strong");
    			strong1.textContent = "在经过一番研究之后，你终于利用现有的数据训练好了一个决策树的分类模型了。这时候如果你得到了一个新的鸢尾花的数据，决策树会如何做出决策呢？根据下方的决策树模型，来看看它是如何做出决策的吧！";
    			t31 = space();
    			div6 = element("div");
    			svg = svg_element("svg");
    			t32 = space();
    			footer = element("footer");
    			div7 = element("div");
    			h3 = element("h3");
    			h3.textContent = "扩展与补充";
    			t34 = space();
    			p8 = element("p");
    			p8.textContent = "决策树算法广泛应用于：语音识别、医疗诊断、客户关系管理、模式识别、专家系统等，在实际工作中，必须根据数据类型的特点及数据集的大小，选择合适的算法。想了解更多的相关知识，可以在机器学习相关的书籍中更详细的决策树原理。";
    			t36 = space();
    			div8 = element("div");
    			p9 = element("p");
    			p9.textContent = "决策树是模仿一个人进行决策的过程，这让你想起了查阅资料过程中无意中看到的一个叫神经网络的模型，它好像是根据模仿人脑神经结构所提出来的一种模型，那么这种更加深入的模仿人脑神经运作的网络是不是能够更为有效的识别出鸢尾花的品种呢？你又带着更大的好奇心开始了新一轮的探索。。。";
    			t38 = space();
    			a = element("a");
    			ion_icon = element("ion-icon");
    			add_location(h1, file$5, 408, 18, 11923);
    			attr_dev(div0, "id", "One");
    			add_location(div0, file$5, 408, 4, 11909);
    			add_location(strong0, file$5, 410, 8, 11969);
    			attr_dev(p0, "class", "svelte-wuycpk");
    			add_location(p0, file$5, 409, 4, 11956);
    			attr_dev(h20, "class", "title svelte-wuycpk");
    			add_location(h20, file$5, 417, 6, 12286);
    			add_location(li0, file$5, 419, 12, 12343);
    			add_location(li1, file$5, 420, 12, 12387);
    			add_location(li2, file$5, 421, 12, 12431);
    			add_location(ul, file$5, 418, 8, 12324);
    			attr_dev(p1, "class", "svelte-wuycpk");
    			add_location(p1, file$5, 423, 6, 12480);
    			attr_dev(div1, "class", "l--body");
    			add_location(div1, file$5, 416, 4, 12257);
    			attr_dev(h21, "class", "title svelte-wuycpk");
    			add_location(h21, file$5, 427, 6, 12623);
    			attr_dev(p2, "class", "svelte-wuycpk");
    			add_location(p2, file$5, 428, 8, 12663);
    			attr_dev(p3, "class", "svelte-wuycpk");
    			add_location(p3, file$5, 429, 8, 12729);
    			attr_dev(p4, "class", "svelte-wuycpk");
    			add_location(p4, file$5, 430, 8, 12779);
    			attr_dev(div2, "class", "l--body");
    			add_location(div2, file$5, 426, 4, 12594);
    			attr_dev(h22, "class", "title svelte-wuycpk");
    			add_location(h22, file$5, 434, 6, 12956);
    			attr_dev(p5, "class", "svelte-wuycpk");
    			add_location(p5, file$5, 435, 6, 12992);
    			attr_dev(p6, "class", "svelte-wuycpk");
    			add_location(p6, file$5, 436, 6, 13151);
    			attr_dev(div3, "class", "l--body");
    			add_location(div3, file$5, 433, 4, 12927);
    			attr_dev(h23, "class", "title svelte-wuycpk");
    			add_location(h23, file$5, 439, 6, 13256);
    			add_location(strong1, file$5, 440, 9, 13294);
    			attr_dev(p7, "class", "svelte-wuycpk");
    			add_location(p7, file$5, 440, 6, 13291);
    			attr_dev(div4, "class", "l--body");
    			add_location(div4, file$5, 438, 4, 13227);
    			attr_dev(div5, "id", "article");
    			attr_dev(div5, "class", "svelte-wuycpk");
    			add_location(div5, file$5, 407, 0, 11885);
    			attr_dev(svg, "id", "tree-svg");
    			add_location(svg, file$5, 444, 4, 13455);
    			attr_dev(div6, "id", "treebody");
    			attr_dev(div6, "class", "svelte-wuycpk");
    			add_location(div6, file$5, 443, 0, 13430);
    			attr_dev(h3, "class", "title svelte-wuycpk");
    			add_location(h3, file$5, 449, 6, 13546);
    			attr_dev(p8, "class", "svelte-wuycpk");
    			add_location(p8, file$5, 450, 6, 13582);
    			attr_dev(div7, "class", "footbody svelte-wuycpk");
    			add_location(div7, file$5, 448, 4, 13516);
    			add_location(p9, file$5, 453, 6, 13744);
    			attr_dev(div8, "class", "lasttext svelte-wuycpk");
    			add_location(div8, file$5, 452, 4, 13714);
    			set_custom_element_data(ion_icon, "class", "return svelte-wuycpk");
    			set_custom_element_data(ion_icon, "name", "arrow-back-circle-outline");
    			set_custom_element_data(ion_icon, "size", "large");
    			add_location(ion_icon, file$5, 456, 8, 13953);
    			attr_dev(a, "href", "/home");
    			attr_dev(a, "rel", "prefetch");
    			add_location(a, file$5, 455, 4, 13903);
    			attr_dev(footer, "id", "foot");
    			attr_dev(footer, "class", "svelte-wuycpk");
    			add_location(footer, file$5, 447, 0, 13492);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			append_dev(div0, h1);
    			append_dev(div5, t1);
    			append_dev(div5, p0);
    			append_dev(p0, strong0);
    			append_dev(div5, t3);
    			append_dev(div5, div1);
    			append_dev(div1, h20);
    			append_dev(div1, t5);
    			append_dev(div1, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t7);
    			append_dev(ul, li1);
    			append_dev(ul, t9);
    			append_dev(ul, li2);
    			append_dev(div1, t11);
    			append_dev(div1, p1);
    			append_dev(div5, t13);
    			append_dev(div5, div2);
    			append_dev(div2, h21);
    			append_dev(div2, t15);
    			append_dev(div2, p2);
    			append_dev(div2, t17);
    			append_dev(div2, p3);
    			append_dev(div2, t19);
    			append_dev(div2, p4);
    			append_dev(div5, t21);
    			append_dev(div5, div3);
    			append_dev(div3, h22);
    			append_dev(div3, t23);
    			append_dev(div3, p5);
    			append_dev(div3, t25);
    			append_dev(div3, p6);
    			append_dev(div5, t27);
    			append_dev(div5, div4);
    			append_dev(div4, h23);
    			append_dev(div4, t29);
    			append_dev(div4, p7);
    			append_dev(p7, strong1);
    			insert_dev(target, t31, anchor);
    			insert_dev(target, div6, anchor);
    			append_dev(div6, svg);
    			insert_dev(target, t32, anchor);
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div7);
    			append_dev(div7, h3);
    			append_dev(div7, t34);
    			append_dev(div7, p8);
    			append_dev(footer, t36);
    			append_dev(footer, div8);
    			append_dev(div8, p9);
    			append_dev(footer, t38);
    			append_dev(footer, a);
    			append_dev(a, ion_icon);

    			if (!mounted) {
    				dispose = action_destroyer(link_action = link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if (detaching) detach_dev(t31);
    			if (detaching) detach_dev(div6);
    			if (detaching) detach_dev(t32);
    			if (detaching) detach_dev(footer);
    			mounted = false;
    			dispose();
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

    function mean_interpolation(root) {
    	var max = 1e-9, min = 1000000000;

    	function recurse(node) {
    		if (node.value[0] > max) {
    			max = node.value[0];
    		}

    		if (node.value[0] < min) {
    			min = node.value[0];
    		}

    		if (node.children) {
    			node.children.forEach(recurse);
    		}
    	}

    	recurse(root);
    	var scale = d3.scale.linear().domain([min, max]).range(["#2166AC", "#B2182B"]);

    	function interpolator(d) {
    		return scale(d.target.data.value[0]);
    	}

    	return interpolator;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	var m = [20, 120, 20, 120],
    		w = 1500,
    		h = 500,
    		i = 0,
    		rect_width = 100,
    		rect_height = 20,
    		max_link_width = 20,
    		min_link_width = 1.5,
    		char_to_pxl = 8,
    		root;

    	const irislabel = ["花萼长度", "花萼宽度", "花瓣长度", "花瓣宽度"];
    	const iristype = ["山鸢尾", "杂色鸢尾", "维吉尼亚鸢尾"];
    	var tree;
    	var diagonal;
    	var vis;
    	var gLink;
    	var gNode;
    	var gtext, plusText;
    	var link_stoke_scale;
    	var color_map;
    	var stroke_callback = "#ccc";

    	onMount(async () => {
    		window.scrollTo(0, 0);
    		const jdata = await d3.json("/assets/data/iris.json");
    		tree = d3.tree().size([1000, 1500]);
    		diagonal = d3.linkHorizontal().x(d => d.x).y(d => d.y);
    		vis = d3.select("#tree-svg").attr("viewBox", [-200, -20, w, h]);
    		gLink = vis.append("g").attr("fill", "none").attr("stroke", "#555").attr("stroke-opacity", 0.4);
    		gNode = vis.append("g").attr("pointer-events", "all");
    		gtext = vis.append("g").attr("class", "root-text");
    		plusText = gtext.append("text").attr("x", 350).attr("y", 0).attr("class", "annotation-text").style("dominant-baseline", "hanging").style("text-anchor", "middle");
    		plusText.append("tspan").style("dominant-baseline", "hanging").text("点击结点展开");
    		plusText.append("tspan").attr("x", 350).attr("dy", "1.5em").style("dominant-baseline", "hanging").text("决策树");
    		plusText.append("tspan").attr("x", 350).attr("dy", "1.5em").style("dominant-baseline", "hanging").text("当满足结点条件时");
    		plusText.append("tspan").attr("x", 350).attr("dy", "1.5em").style("dominant-baseline", "hanging").text("决策前往");
    		plusText.append("tspan").attr("fill", "green").style("dominant-baseline", "hanging").text("左分支");

    		drawArrow({
    			group: gtext,
    			sx: 380,
    			sy: 15,
    			tx: 440,
    			ty: 0,
    			dr: 50,
    			hFlip: 0
    		});

    		color_map = d3.scaleOrdinal(d3.schemeCategory10);
    		load_dataset(jdata);
    	});

    	function load_dataset(json) {
    		root = d3.hierarchy(json);
    		root.x0 = 500;
    		root.y0 = 1000;
    		var n_samples = json.samples;
    		var n_labels = json.value.length;

    		if (n_labels >= 2) {
    			stroke_callback = mix_colors;
    		} else if (n_labels === 1) {
    			stroke_callback = mean_interpolation(root);
    		}

    		link_stoke_scale = d3.scaleLinear().domain([0, n_samples]).rangeRound([min_link_width, max_link_width]);

    		root.descendants().forEach((d, i) => {
    			d.id = i;
    			d._children = d.children;
    			d.children = null;
    			if (d.data.type === "leaf") d.children = null;
    		});

    		update(root);
    	}

    	function update(source) {
    		var duration = d3.event && d3.event.altKey ? 5000 : 500;
    		const nodes = root.descendants().reverse();
    		const links = root.links();

    		// d3计算树的结构
    		tree(root);

    		// 设置固定深度
    		let ntop = root;

    		let nbottom = root;

    		nodes.forEach(function (d) {
    			d.y = d.depth * 180;
    			if (d.y < ntop.y) ntop = d;
    			if (d.y > nbottom.y) nbottom = d;
    		});

    		const transition = vis.transition().duration(duration).attr("viewBox", [-200, -20, w, Math.max(300, nbottom.y - ntop.y + 100)]).tween("resize", window.ResizeObserver
    		? null
    		: () => () => vis.dispatch("toggle"));

    		const node = gNode.selectAll("g").data(nodes, d => d.id);

    		const nodeEnter = node.enter().append("g").attr("class", "node").attr("transform", d => `translate(${source.y0},${source.x0})`).attr("fill-opacity", 0).attr("stroke-opacity", 0).on("click", d => {
    			d.children = d.children ? null : d._children;
    			update(d);
    			d3.select(".root-text").transition().duration(200).attr("transform", d => `translate(-150, 0)`);
    		});

    		nodeEnter.append("rect").attr("class", d => {
    			return d.data.type === "split" ? "cursor" : "no";
    		}).attr("x", function (d) {
    			var label = node_label(d);
    			var text_len = label.length * char_to_pxl;
    			var width = d3.max([rect_width, text_len]);
    			return -width / 2;
    		}).attr("rx", function (d) {
    			return d.data.type === "split" ? 2 : 0;
    		}).attr("ry", function (d) {
    			return d.data.type === "split" ? 2 : 0;
    		}).style("stroke", function (d) {
    			return d.data.type === "split" ? "steelblue" : "olivedrab";
    		}).style("fill", function (d) {
    			return d._children ? "#f7f7f8" : "#fff";
    		});

    		nodeEnter.append("text").attr("class", d => {
    			return d._children ? "cursor" : "no";
    		}).attr("dy", "14px").attr("font-size", "12px").attr("text-anchor", "middle").append("tspan").style("fill", d => {
    			return d._children ? "red" : "steelblue";
    		}).text(node_label);

    		// 更新结点位置
    		const nodeUpdate = node.merge(nodeEnter).transition().duration(duration).attr("transform", d => `translate(${d.x},${d.y - 5})`).attr("fill-opacity", 1).attr("stroke-opacity", 1);

    		nodeUpdate.selectAll("rect").attr("width", rect_width).attr("height", rect_height).attr("fill", function (d) {
    			return d._children ? "#fff" : "#fff";
    		}).style("stroke-width", "1.5px");

    		d3.selectAll(".cursor").style("cursor", "pointer");
    		nodeUpdate.select("text").style("fill-opacity", 1);
    		const nodeExit = node.exit().transition().remove().attr("transform", d => `translate(${source.x},${source.y})`).attr("fill-opacity", 0).attr("stroke-opacity", 0);

    		// 更新连线
    		let link = gLink.selectAll("path").data(links, d => d.target.id);

    		const linkEnter = link.enter().append("path").attr("class", "link").attr("d", d => {
    			const o = { x: source.x0, y: source.y0 };
    			return diagonal({ source: o, target: o });
    		});

    		link.merge(linkEnter).transition().attr("d", diagonal).style("stroke", stroke_callback).style("stroke-width", "5");

    		link.exit().transition().attr("d", d => {
    			const o = { x: source.x, y: source.y };
    			return diagonal({ source: o, target: o });
    		}).remove();

    		nodes.forEach(function (d) {
    			d.x0 = d.x;
    			d.y0 = d.y;
    		});
    	}

    	// 结点标签
    	function node_label(d) {
    		d = d.data;

    		if (d.type === "leaf") {
    			// 叶子
    			var formatter = d3.format(".2f");

    			var vals = [];

    			d.value.forEach(function (v) {
    				vals.push(v);
    			});

    			var maxvalue = Math.max(...vals);
    			var index = vals.indexOf(maxvalue);
    			return iristype[vals.indexOf(Math.max(...vals))];
    		} else {
    			// 非叶结点
    			var label = d.label;

    			label = label.replace("X[0]", irislabel[0]);
    			label = label.replace("X[1]", irislabel[1]);
    			label = label.replace("X[2]", irislabel[2]);
    			label = label.replace("X[3]", irislabel[3]);
    			return label;
    		}
    	}

    	function mix_colors(d) {
    		var value = d.target.data.value;
    		var sum = d3.sum(value);
    		var col = d3.rgb(0, 0, 0);

    		value.forEach(function (val, i) {
    			var label_color = d3.rgb(color_map(i));
    			var mix_coef = val / sum;
    			col.r += mix_coef * label_color.r;
    			col.g += mix_coef * label_color.g;
    			col.b += mix_coef * label_color.b;
    		});

    		return col;
    	}

    	const drawArrow = arg => {
    		let group = arg.group,
    			sx = arg.sx,
    			sy = arg.sy,
    			tx = arg.tx,
    			ty = arg.ty,
    			dr = arg.dr,
    			hFlip = arg.hFlip,
    			marker = arg.marker === undefined ? "marker" : arg.marker;

    		let arrow = group.append("g").attr("class", "arrow-group");
    		arrow.append("path").attr("d", `M${sx},${sy}A${dr},${dr} 0 0,${hFlip ? 0 : 1} ${tx},${ty}`).attr("marker-end", "url(#markerArrow)").style("stroke", "gray").style("fill", "none");
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tree> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Tree", $$slots, []);

    	$$self.$capture_state = () => ({
    		onMount,
    		link,
    		m,
    		w,
    		h,
    		i,
    		rect_width,
    		rect_height,
    		max_link_width,
    		min_link_width,
    		char_to_pxl,
    		root,
    		irislabel,
    		iristype,
    		tree,
    		diagonal,
    		vis,
    		gLink,
    		gNode,
    		gtext,
    		plusText,
    		link_stoke_scale,
    		color_map,
    		stroke_callback,
    		load_dataset,
    		update,
    		node_label,
    		mix_colors,
    		mean_interpolation,
    		drawArrow
    	});

    	$$self.$inject_state = $$props => {
    		if ("m" in $$props) m = $$props.m;
    		if ("w" in $$props) w = $$props.w;
    		if ("h" in $$props) h = $$props.h;
    		if ("i" in $$props) i = $$props.i;
    		if ("rect_width" in $$props) rect_width = $$props.rect_width;
    		if ("rect_height" in $$props) rect_height = $$props.rect_height;
    		if ("max_link_width" in $$props) max_link_width = $$props.max_link_width;
    		if ("min_link_width" in $$props) min_link_width = $$props.min_link_width;
    		if ("char_to_pxl" in $$props) char_to_pxl = $$props.char_to_pxl;
    		if ("root" in $$props) root = $$props.root;
    		if ("tree" in $$props) tree = $$props.tree;
    		if ("diagonal" in $$props) diagonal = $$props.diagonal;
    		if ("vis" in $$props) vis = $$props.vis;
    		if ("gLink" in $$props) gLink = $$props.gLink;
    		if ("gNode" in $$props) gNode = $$props.gNode;
    		if ("gtext" in $$props) gtext = $$props.gtext;
    		if ("plusText" in $$props) plusText = $$props.plusText;
    		if ("link_stoke_scale" in $$props) link_stoke_scale = $$props.link_stoke_scale;
    		if ("color_map" in $$props) color_map = $$props.color_map;
    		if ("stroke_callback" in $$props) stroke_callback = $$props.stroke_callback;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class Tree extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tree",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\views\home2.svelte generated by Svelte v3.24.0 */
    const file$6 = "src\\views\\home2.svelte";

    function create_fragment$7(ctx) {
    	let div2;
    	let p0;
    	let t1;
    	let br0;
    	let t2;
    	let h10;
    	let t4;
    	let br1;
    	let t5;
    	let br2;
    	let t6;
    	let div0;
    	let h11;
    	let t8;
    	let div1;
    	let p1;
    	let t10;
    	let p2;
    	let t11;
    	let b0;
    	let t13;
    	let b1;
    	let t15;
    	let b2;
    	let t17;
    	let t18;
    	let p3;
    	let t20;
    	let p4;
    	let t22;
    	let p5;
    	let b3;
    	let t24;
    	let div64;
    	let div63;
    	let div14;
    	let div9;
    	let div8;
    	let div3;
    	let t25;
    	let div4;
    	let h20;
    	let t27;
    	let div7;
    	let a0;
    	let div5;
    	let link_action;
    	let t29;
    	let div6;
    	let t30;
    	let div13;
    	let div10;
    	let t32;
    	let div12;
    	let div11;
    	let div14_class_value;
    	let t34;
    	let div26;
    	let div21;
    	let div20;
    	let div15;
    	let t35;
    	let div16;
    	let h21;
    	let t37;
    	let div19;
    	let a1;
    	let div17;
    	let link_action_1;
    	let t39;
    	let div18;
    	let t40;
    	let div25;
    	let div22;
    	let t42;
    	let div24;
    	let div23;
    	let div26_class_value;
    	let t44;
    	let div38;
    	let div33;
    	let div32;
    	let div27;
    	let t45;
    	let div28;
    	let h22;
    	let t47;
    	let div31;
    	let a2;
    	let div29;
    	let t49;
    	let div30;
    	let t50;
    	let div37;
    	let div34;
    	let t52;
    	let div36;
    	let div35;
    	let div38_class_value;
    	let t54;
    	let div50;
    	let div45;
    	let div44;
    	let div39;
    	let t55;
    	let div40;
    	let h23;
    	let t57;
    	let div43;
    	let a3;
    	let div41;
    	let link_action_2;
    	let t59;
    	let div42;
    	let t60;
    	let div49;
    	let div46;
    	let t62;
    	let div48;
    	let div47;
    	let div50_class_value;
    	let t64;
    	let div62;
    	let div57;
    	let div56;
    	let div51;
    	let t65;
    	let div52;
    	let h24;
    	let t67;
    	let div55;
    	let a4;
    	let div53;
    	let link_action_3;
    	let t69;
    	let div54;
    	let t70;
    	let div61;
    	let div58;
    	let t72;
    	let div60;
    	let div59;
    	let div62_class_value;
    	let div64_class_value;
    	let t74;
    	let footer;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			p0 = element("p");
    			p0.textContent = "“UnboxAI打造了一个全套的教学生态系统来辅助智慧校园中开设的人工智能的课程，可以脱离纸质书籍教学，所有的内容均在电脑或者平板上完成。UnboxAI以第一人称的角色，通过算法可视化，用户可交互性带给同学们更强的体验感，有助于更好地理解人工智能算法背后的原理并激发同学们继续深入学习机器学习、深度学习的相关数学、编程知识。”";
    			t1 = space();
    			br0 = element("br");
    			t2 = space();
    			h10 = element("h1");
    			h10.textContent = "欢迎来到UnboxAI，在这里我们将以情节的方式，在不同的故事线中，由浅入深地带你学习人工智能的相关知识。";
    			t4 = space();
    			br1 = element("br");
    			t5 = space();
    			br2 = element("br");
    			t6 = space();
    			div0 = element("div");
    			h11 = element("h1");
    			h11.textContent = "故事线——植物园（分类任务）";
    			t8 = space();
    			div1 = element("div");
    			p1 = element("p");
    			p1.textContent = "学校组织去植物园春游，一片特别好看的蓝紫色的花海映入你眼帘，像一只只穿梭在绿草中的美丽蝴蝶。";
    			t10 = space();
    			p2 = element("p");
    			t11 = text("你看到牌上的介绍说：这是鸢尾花，常见的有三大类:\r\n      ");
    			b0 = element("b");
    			b0.textContent = "山鸢尾";
    			t13 = text("\r\n      (Iris-setosa)，\r\n      ");
    			b1 = element("b");
    			b1.textContent = "变色鸢尾";
    			t15 = text("\r\n      (Iris-versicolor)和\r\n      ");
    			b2 = element("b");
    			b2.textContent = "维吉尼亚鸢尾";
    			t17 = text("\r\n      (Iris-virginica)。");
    			t18 = space();
    			p3 = element("p");
    			p3.textContent = "它们有着形状与色彩相似的花瓣和萼片。你观察到有一块集中的部分的鸢尾有较大的花瓣，而它旁边的一块的花瓣却很小。你想搞清楚它们究竟属于哪一类鸢尾花。";
    			t20 = space();
    			p4 = element("p");
    			p4.textContent = "于是你上网搜索，发现网上说可以根据一些特征值来刻画事物的某些方面的特点，比如通过花萼的长、花萼的宽、花瓣的长和花瓣的宽来辨别他们。";
    			t22 = space();
    			p5 = element("p");
    			b3 = element("b");
    			b3.textContent = "让我们从section1开始吧！";
    			t24 = space();
    			div64 = element("div");
    			div63 = element("div");
    			div14 = element("div");
    			div9 = element("div");
    			div8 = element("div");
    			div3 = element("div");
    			t25 = space();
    			div4 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Section 1";
    			t27 = space();
    			div7 = element("div");
    			a0 = element("a");
    			div5 = element("div");
    			div5.textContent = "Enter Section 1";
    			t29 = space();
    			div6 = element("div");
    			t30 = space();
    			div13 = element("div");
    			div10 = element("div");
    			div10.textContent = "1";
    			t32 = space();
    			div12 = element("div");
    			div11 = element("div");
    			div11.textContent = "1";
    			t34 = space();
    			div26 = element("div");
    			div21 = element("div");
    			div20 = element("div");
    			div15 = element("div");
    			t35 = space();
    			div16 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Section 2";
    			t37 = space();
    			div19 = element("div");
    			a1 = element("a");
    			div17 = element("div");
    			div17.textContent = "Enter Section 2";
    			t39 = space();
    			div18 = element("div");
    			t40 = space();
    			div25 = element("div");
    			div22 = element("div");
    			div22.textContent = "2";
    			t42 = space();
    			div24 = element("div");
    			div23 = element("div");
    			div23.textContent = "2";
    			t44 = space();
    			div38 = element("div");
    			div33 = element("div");
    			div32 = element("div");
    			div27 = element("div");
    			t45 = space();
    			div28 = element("div");
    			h22 = element("h2");
    			h22.textContent = "Section 3";
    			t47 = space();
    			div31 = element("div");
    			a2 = element("a");
    			div29 = element("div");
    			div29.textContent = "Enter Section 3";
    			t49 = space();
    			div30 = element("div");
    			t50 = space();
    			div37 = element("div");
    			div34 = element("div");
    			div34.textContent = "3";
    			t52 = space();
    			div36 = element("div");
    			div35 = element("div");
    			div35.textContent = "3";
    			t54 = space();
    			div50 = element("div");
    			div45 = element("div");
    			div44 = element("div");
    			div39 = element("div");
    			t55 = space();
    			div40 = element("div");
    			h23 = element("h2");
    			h23.textContent = "Section 4";
    			t57 = space();
    			div43 = element("div");
    			a3 = element("a");
    			div41 = element("div");
    			div41.textContent = "Enter Section 4";
    			t59 = space();
    			div42 = element("div");
    			t60 = space();
    			div49 = element("div");
    			div46 = element("div");
    			div46.textContent = "4";
    			t62 = space();
    			div48 = element("div");
    			div47 = element("div");
    			div47.textContent = "4";
    			t64 = space();
    			div62 = element("div");
    			div57 = element("div");
    			div56 = element("div");
    			div51 = element("div");
    			t65 = space();
    			div52 = element("div");
    			h24 = element("h2");
    			h24.textContent = "Section 5";
    			t67 = space();
    			div55 = element("div");
    			a4 = element("a");
    			div53 = element("div");
    			div53.textContent = "Continue...";
    			t69 = space();
    			div54 = element("div");
    			t70 = space();
    			div61 = element("div");
    			div58 = element("div");
    			div58.textContent = "5";
    			t72 = space();
    			div60 = element("div");
    			div59 = element("div");
    			div59.textContent = "5";
    			t74 = space();
    			footer = element("footer");
    			span = element("span");
    			span.textContent = "Deecamp2020 4-2 UnboxTherapy";
    			add_location(p0, file$6, 70, 2, 1690);
    			add_location(br0, file$6, 73, 2, 1874);
    			set_style(h10, "color", "peru");
    			add_location(h10, file$6, 74, 2, 1883);
    			add_location(br1, file$6, 75, 2, 1970);
    			add_location(br2, file$6, 76, 2, 1979);
    			set_style(h11, "font-weight", "500 ");
    			add_location(h11, file$6, 78, 4, 2008);
    			attr_dev(div0, "id", "one");
    			add_location(div0, file$6, 77, 2, 1988);
    			attr_dev(p1, "class", "t svelte-tfryk");
    			add_location(p1, file$6, 81, 4, 2094);
    			attr_dev(b0, "class", "flower svelte-tfryk");
    			add_location(b0, file$6, 86, 6, 2230);
    			attr_dev(b1, "class", "flower svelte-tfryk");
    			add_location(b1, file$6, 88, 6, 2285);
    			attr_dev(b2, "class", "flower svelte-tfryk");
    			add_location(b2, file$6, 90, 6, 2345);
    			attr_dev(p2, "class", "t svelte-tfryk");
    			add_location(p2, file$6, 84, 4, 2177);
    			attr_dev(p3, "class", "t svelte-tfryk");
    			add_location(p3, file$6, 93, 4, 2414);
    			attr_dev(p4, "class", "t svelte-tfryk");
    			add_location(p4, file$6, 96, 4, 2523);
    			add_location(b3, file$6, 100, 6, 2646);
    			attr_dev(p5, "class", "t svelte-tfryk");
    			add_location(p5, file$6, 99, 4, 2625);
    			attr_dev(div1, "id", "article");
    			add_location(div1, file$6, 80, 2, 2070);
    			attr_dev(div2, "id", "begin");
    			attr_dev(div2, "class", "svelte-tfryk");
    			add_location(div2, file$6, 69, 0, 1670);
    			attr_dev(div3, "class", "el__bg");
    			add_location(div3, file$6, 112, 10, 2980);
    			attr_dev(h20, "class", "el__heading");
    			set_style(h20, "color", "#f6f6f6");
    			add_location(h20, file$6, 114, 12, 3058);
    			attr_dev(div4, "class", "el__preview-cont");
    			add_location(div4, file$6, 113, 10, 3014);
    			attr_dev(div5, "class", "el__text");
    			add_location(div5, file$6, 118, 14, 3242);
    			attr_dev(a0, "href", "/knn");
    			attr_dev(a0, "rel", "prefetch");
    			add_location(a0, file$6, 117, 12, 3187);
    			attr_dev(div6, "class", "el__close-btn");
    			add_location(div6, file$6, 120, 12, 3317);
    			attr_dev(div7, "class", "el__content");
    			add_location(div7, file$6, 116, 10, 3148);
    			attr_dev(div8, "class", "el__inner");
    			add_location(div8, file$6, 111, 8, 2945);
    			attr_dev(div9, "class", "el__overflow");
    			add_location(div9, file$6, 110, 6, 2909);
    			attr_dev(div10, "class", "el__index-back");
    			add_location(div10, file$6, 125, 8, 3435);
    			attr_dev(div11, "class", "el__index-overlay");
    			attr_dev(div11, "data-index", "1");
    			add_location(div11, file$6, 127, 10, 3521);
    			attr_dev(div12, "class", "el__index-front");
    			add_location(div12, file$6, 126, 8, 3480);
    			attr_dev(div13, "class", "el__index");
    			add_location(div13, file$6, 124, 6, 3402);
    			attr_dev(div14, "class", div14_class_value = /*selected*/ ctx[0] === 1 ? "el s--active" : "el");
    			add_location(div14, file$6, 109, 4, 2849);
    			attr_dev(div15, "class", "el__bg");
    			add_location(div15, file$6, 136, 10, 3797);
    			attr_dev(h21, "class", "el__heading");
    			set_style(h21, "color", "#f6f6f6");
    			add_location(h21, file$6, 138, 12, 3875);
    			attr_dev(div16, "class", "el__preview-cont");
    			add_location(div16, file$6, 137, 10, 3831);
    			attr_dev(div17, "class", "el__text");
    			add_location(div17, file$6, 142, 14, 4060);
    			attr_dev(a1, "href", "/tree");
    			attr_dev(a1, "rel", "prefetch");
    			add_location(a1, file$6, 141, 12, 4004);
    			attr_dev(div18, "class", "el__close-btn");
    			add_location(div18, file$6, 144, 12, 4135);
    			attr_dev(div19, "class", "el__content");
    			add_location(div19, file$6, 140, 10, 3965);
    			attr_dev(div20, "class", "el__inner");
    			add_location(div20, file$6, 135, 8, 3762);
    			attr_dev(div21, "class", "el__overflow");
    			add_location(div21, file$6, 134, 6, 3726);
    			attr_dev(div22, "class", "el__index-back");
    			add_location(div22, file$6, 149, 8, 4253);
    			attr_dev(div23, "class", "el__index-overlay");
    			attr_dev(div23, "data-index", "2");
    			add_location(div23, file$6, 151, 10, 4339);
    			attr_dev(div24, "class", "el__index-front");
    			add_location(div24, file$6, 150, 8, 4298);
    			attr_dev(div25, "class", "el__index");
    			add_location(div25, file$6, 148, 6, 4220);
    			attr_dev(div26, "class", div26_class_value = /*selected*/ ctx[0] === 2 ? "el s--active" : "el");
    			add_location(div26, file$6, 133, 4, 3666);
    			attr_dev(div27, "class", "el__bg");
    			add_location(div27, file$6, 160, 10, 4615);
    			attr_dev(h22, "class", "el__heading");
    			set_style(h22, "color", "#f6f6f6");
    			add_location(h22, file$6, 162, 12, 4693);
    			attr_dev(div28, "class", "el__preview-cont");
    			add_location(div28, file$6, 161, 10, 4649);
    			attr_dev(div29, "class", "el__text");
    			add_location(div29, file$6, 166, 14, 4882);
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "href", "/dist/index.html");
    			add_location(a2, file$6, 165, 12, 4822);
    			attr_dev(div30, "class", "el__close-btn");
    			add_location(div30, file$6, 168, 12, 4957);
    			attr_dev(div31, "class", "el__content");
    			add_location(div31, file$6, 164, 10, 4783);
    			attr_dev(div32, "class", "el__inner");
    			add_location(div32, file$6, 159, 8, 4580);
    			attr_dev(div33, "class", "el__overflow");
    			add_location(div33, file$6, 158, 6, 4544);
    			attr_dev(div34, "class", "el__index-back");
    			add_location(div34, file$6, 173, 8, 5075);
    			attr_dev(div35, "class", "el__index-overlay");
    			attr_dev(div35, "data-index", "3");
    			add_location(div35, file$6, 175, 10, 5161);
    			attr_dev(div36, "class", "el__index-front");
    			add_location(div36, file$6, 174, 8, 5120);
    			attr_dev(div37, "class", "el__index");
    			add_location(div37, file$6, 172, 6, 5042);
    			attr_dev(div38, "class", div38_class_value = /*selected*/ ctx[0] === 3 ? "el s--active" : "el");
    			add_location(div38, file$6, 157, 4, 4484);
    			attr_dev(div39, "class", "el__bg");
    			add_location(div39, file$6, 184, 10, 5437);
    			attr_dev(h23, "class", "el__heading");
    			set_style(h23, "color", "#f6f6f6");
    			add_location(h23, file$6, 186, 12, 5515);
    			attr_dev(div40, "class", "el__preview-cont");
    			add_location(div40, file$6, 185, 10, 5471);
    			attr_dev(div41, "class", "el__text");
    			add_location(div41, file$6, 190, 14, 5699);
    			attr_dev(a3, "href", "/cnn");
    			attr_dev(a3, "rel", "prefetch");
    			add_location(a3, file$6, 189, 12, 5644);
    			attr_dev(div42, "class", "el__close-btn");
    			add_location(div42, file$6, 192, 12, 5774);
    			attr_dev(div43, "class", "el__content");
    			add_location(div43, file$6, 188, 10, 5605);
    			attr_dev(div44, "class", "el__inner");
    			add_location(div44, file$6, 183, 8, 5402);
    			attr_dev(div45, "class", "el__overflow");
    			add_location(div45, file$6, 182, 6, 5366);
    			attr_dev(div46, "class", "el__index-back");
    			add_location(div46, file$6, 197, 8, 5892);
    			attr_dev(div47, "class", "el__index-overlay");
    			attr_dev(div47, "data-index", "4");
    			add_location(div47, file$6, 199, 10, 5978);
    			attr_dev(div48, "class", "el__index-front");
    			add_location(div48, file$6, 198, 8, 5937);
    			attr_dev(div49, "class", "el__index");
    			add_location(div49, file$6, 196, 6, 5859);
    			attr_dev(div50, "class", div50_class_value = /*selected*/ ctx[0] === 4 ? "el s--active" : "el");
    			add_location(div50, file$6, 181, 4, 5306);
    			attr_dev(div51, "class", "el__bg");
    			add_location(div51, file$6, 208, 10, 6254);
    			attr_dev(h24, "class", "el__heading");
    			set_style(h24, "color", "#f6f6f6");
    			add_location(h24, file$6, 210, 12, 6332);
    			attr_dev(div52, "class", "el__preview-cont");
    			add_location(div52, file$6, 209, 10, 6288);
    			attr_dev(div53, "class", "el__text");
    			add_location(div53, file$6, 214, 14, 6517);
    			attr_dev(a4, "href", "/home");
    			attr_dev(a4, "rel", "prefetch");
    			add_location(a4, file$6, 213, 12, 6461);
    			attr_dev(div54, "class", "el__close-btn");
    			add_location(div54, file$6, 216, 12, 6588);
    			attr_dev(div55, "class", "el__content");
    			add_location(div55, file$6, 212, 10, 6422);
    			attr_dev(div56, "class", "el__inner");
    			add_location(div56, file$6, 207, 8, 6219);
    			attr_dev(div57, "class", "el__overflow");
    			add_location(div57, file$6, 206, 6, 6183);
    			attr_dev(div58, "class", "el__index-back");
    			add_location(div58, file$6, 221, 8, 6706);
    			attr_dev(div59, "class", "el__index-overlay");
    			attr_dev(div59, "data-index", "5");
    			add_location(div59, file$6, 223, 10, 6792);
    			attr_dev(div60, "class", "el__index-front");
    			add_location(div60, file$6, 222, 8, 6751);
    			attr_dev(div61, "class", "el__index");
    			add_location(div61, file$6, 220, 6, 6673);
    			attr_dev(div62, "class", div62_class_value = /*selected*/ ctx[0] === 5 ? "el s--active" : "el");
    			add_location(div62, file$6, 205, 4, 6123);
    			attr_dev(div63, "class", "cont__inner");
    			add_location(div63, file$6, 107, 2, 2795);

    			attr_dev(div64, "class", div64_class_value = "" + (null_to_empty(/*selected*/ ctx[0] > 0
    			? "cont s--el-active"
    			: /*dynamiccss*/ ctx[1]) + " svelte-tfryk"));

    			add_location(div64, file$6, 105, 0, 2701);
    			set_style(span, "text-align", "right");
    			set_style(span, "color", "#f6f6f6");
    			set_style(span, "font-weight", "300");
    			set_style(span, "font-size", "13px");
    			add_location(span, file$6, 232, 2, 7001);
    			set_style(footer, "background-color", "#37474f");
    			add_location(footer, file$6, 231, 0, 6955);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, p0);
    			append_dev(div2, t1);
    			append_dev(div2, br0);
    			append_dev(div2, t2);
    			append_dev(div2, h10);
    			append_dev(div2, t4);
    			append_dev(div2, br1);
    			append_dev(div2, t5);
    			append_dev(div2, br2);
    			append_dev(div2, t6);
    			append_dev(div2, div0);
    			append_dev(div0, h11);
    			append_dev(div2, t8);
    			append_dev(div2, div1);
    			append_dev(div1, p1);
    			append_dev(div1, t10);
    			append_dev(div1, p2);
    			append_dev(p2, t11);
    			append_dev(p2, b0);
    			append_dev(p2, t13);
    			append_dev(p2, b1);
    			append_dev(p2, t15);
    			append_dev(p2, b2);
    			append_dev(p2, t17);
    			append_dev(div1, t18);
    			append_dev(div1, p3);
    			append_dev(div1, t20);
    			append_dev(div1, p4);
    			append_dev(div1, t22);
    			append_dev(div1, p5);
    			append_dev(p5, b3);
    			insert_dev(target, t24, anchor);
    			insert_dev(target, div64, anchor);
    			append_dev(div64, div63);
    			append_dev(div63, div14);
    			append_dev(div14, div9);
    			append_dev(div9, div8);
    			append_dev(div8, div3);
    			append_dev(div8, t25);
    			append_dev(div8, div4);
    			append_dev(div4, h20);
    			append_dev(div8, t27);
    			append_dev(div8, div7);
    			append_dev(div7, a0);
    			append_dev(a0, div5);
    			append_dev(div7, t29);
    			append_dev(div7, div6);
    			append_dev(div14, t30);
    			append_dev(div14, div13);
    			append_dev(div13, div10);
    			append_dev(div13, t32);
    			append_dev(div13, div12);
    			append_dev(div12, div11);
    			append_dev(div63, t34);
    			append_dev(div63, div26);
    			append_dev(div26, div21);
    			append_dev(div21, div20);
    			append_dev(div20, div15);
    			append_dev(div20, t35);
    			append_dev(div20, div16);
    			append_dev(div16, h21);
    			append_dev(div20, t37);
    			append_dev(div20, div19);
    			append_dev(div19, a1);
    			append_dev(a1, div17);
    			append_dev(div19, t39);
    			append_dev(div19, div18);
    			append_dev(div26, t40);
    			append_dev(div26, div25);
    			append_dev(div25, div22);
    			append_dev(div25, t42);
    			append_dev(div25, div24);
    			append_dev(div24, div23);
    			append_dev(div63, t44);
    			append_dev(div63, div38);
    			append_dev(div38, div33);
    			append_dev(div33, div32);
    			append_dev(div32, div27);
    			append_dev(div32, t45);
    			append_dev(div32, div28);
    			append_dev(div28, h22);
    			append_dev(div32, t47);
    			append_dev(div32, div31);
    			append_dev(div31, a2);
    			append_dev(a2, div29);
    			append_dev(div31, t49);
    			append_dev(div31, div30);
    			append_dev(div38, t50);
    			append_dev(div38, div37);
    			append_dev(div37, div34);
    			append_dev(div37, t52);
    			append_dev(div37, div36);
    			append_dev(div36, div35);
    			append_dev(div63, t54);
    			append_dev(div63, div50);
    			append_dev(div50, div45);
    			append_dev(div45, div44);
    			append_dev(div44, div39);
    			append_dev(div44, t55);
    			append_dev(div44, div40);
    			append_dev(div40, h23);
    			append_dev(div44, t57);
    			append_dev(div44, div43);
    			append_dev(div43, a3);
    			append_dev(a3, div41);
    			append_dev(div43, t59);
    			append_dev(div43, div42);
    			append_dev(div50, t60);
    			append_dev(div50, div49);
    			append_dev(div49, div46);
    			append_dev(div49, t62);
    			append_dev(div49, div48);
    			append_dev(div48, div47);
    			append_dev(div63, t64);
    			append_dev(div63, div62);
    			append_dev(div62, div57);
    			append_dev(div57, div56);
    			append_dev(div56, div51);
    			append_dev(div56, t65);
    			append_dev(div56, div52);
    			append_dev(div52, h24);
    			append_dev(div56, t67);
    			append_dev(div56, div55);
    			append_dev(div55, a4);
    			append_dev(a4, div53);
    			append_dev(div55, t69);
    			append_dev(div55, div54);
    			append_dev(div62, t70);
    			append_dev(div62, div61);
    			append_dev(div61, div58);
    			append_dev(div61, t72);
    			append_dev(div61, div60);
    			append_dev(div60, div59);
    			insert_dev(target, t74, anchor);
    			insert_dev(target, footer, anchor);
    			append_dev(footer, span);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(link_action = link.call(null, a0)),
    					action_destroyer(link_action_1 = link.call(null, a1)),
    					action_destroyer(link_action_2 = link.call(null, a3)),
    					action_destroyer(link_action_3 = link.call(null, a4))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*selected*/ 1 && div14_class_value !== (div14_class_value = /*selected*/ ctx[0] === 1 ? "el s--active" : "el")) {
    				attr_dev(div14, "class", div14_class_value);
    			}

    			if (dirty & /*selected*/ 1 && div26_class_value !== (div26_class_value = /*selected*/ ctx[0] === 2 ? "el s--active" : "el")) {
    				attr_dev(div26, "class", div26_class_value);
    			}

    			if (dirty & /*selected*/ 1 && div38_class_value !== (div38_class_value = /*selected*/ ctx[0] === 3 ? "el s--active" : "el")) {
    				attr_dev(div38, "class", div38_class_value);
    			}

    			if (dirty & /*selected*/ 1 && div50_class_value !== (div50_class_value = /*selected*/ ctx[0] === 4 ? "el s--active" : "el")) {
    				attr_dev(div50, "class", div50_class_value);
    			}

    			if (dirty & /*selected*/ 1 && div62_class_value !== (div62_class_value = /*selected*/ ctx[0] === 5 ? "el s--active" : "el")) {
    				attr_dev(div62, "class", div62_class_value);
    			}

    			if (dirty & /*selected, dynamiccss*/ 3 && div64_class_value !== (div64_class_value = "" + (null_to_empty(/*selected*/ ctx[0] > 0
    			? "cont s--el-active"
    			: /*dynamiccss*/ ctx[1]) + " svelte-tfryk"))) {
    				attr_dev(div64, "class", div64_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t24);
    			if (detaching) detach_dev(div64);
    			if (detaching) detach_dev(t74);
    			if (detaching) detach_dev(footer);
    			mounted = false;
    			run_all(dispose);
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
    	var cont;
    	var elsArr;
    	var closeBtnsArr;
    	var dcont;
    	var selected = 0;
    	var dynamiccss = "cont s--inactive";

    	// 不加onMount  cont取不到值
    	onMount(async () => {
    		window.scrollTo(0, 0);
    		cont = document.querySelector(".cont");
    		elsArr = [].slice.call(document.querySelectorAll(".el"));
    		closeBtnsArr = [].slice.call(document.querySelectorAll(".el__close-btn"));

    		setTimeout(
    			function () {
    				// cont.classList.remove('s--inactive');
    				$$invalidate(1, dynamiccss = "cont");
    			},
    			200
    		);

    		elsArr.forEach(function (el, index) {
    			el.addEventListener(
    				"click",
    				function () {
    					$$invalidate(0, selected = index + 1); // if (this.classList.contains('s--active')) return;
    					// cont.classList.add('s--el-active');
    				},
    				// this.classList.add('s--active');
    				true
    			); // if (this.classList.contains('s--active')) return;
    			// cont.classList.add('s--el-active');
    		});

    		closeBtnsArr.forEach(function (btn) {
    			btn.addEventListener(
    				"click",
    				function (e) {
    					e.stopPropagation(); // cont.classList.remove('s--el-active');
    					// document.querySelector('.el.s--active').classList.remove('s--active');

    					$$invalidate(0, selected = 0);
    				},
    				true
    			); // cont.classList.remove('s--el-active');
    			// document.querySelector('.el.s--active').classList.remove('s--active');
    		});
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home2> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Home2", $$slots, []);

    	$$self.$capture_state = () => ({
    		Knn,
    		Tree,
    		onMount,
    		tick,
    		link,
    		cont,
    		elsArr,
    		closeBtnsArr,
    		dcont,
    		selected,
    		dynamiccss
    	});

    	$$self.$inject_state = $$props => {
    		if ("cont" in $$props) cont = $$props.cont;
    		if ("elsArr" in $$props) elsArr = $$props.elsArr;
    		if ("closeBtnsArr" in $$props) closeBtnsArr = $$props.closeBtnsArr;
    		if ("dcont" in $$props) dcont = $$props.dcont;
    		if ("selected" in $$props) $$invalidate(0, selected = $$props.selected);
    		if ("dynamiccss" in $$props) $$invalidate(1, dynamiccss = $$props.dynamiccss);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selected, dynamiccss];
    }

    class Home2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home2",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    const cnnStore = writable([]);
    const svgStore = writable(undefined);

    const vSpaceAroundGapStore = writable(undefined);
    const hSpaceAroundGapStore = writable(undefined);

    const nodeCoordinateStore = writable([]);
    const selectedScaleLevelStore = writable(undefined);

    const cnnLayerRangesStore = writable({});
    const cnnLayerMinMaxStore = writable([]);

    const needRedrawStore = writable([undefined, undefined]);

    const detailedModeStore = writable(true);

    const shouldIntermediateAnimateStore = writable(false);

    const isInSoftmaxStore = writable(false);
    const softmaxDetailViewStore = writable({});
    const allowsSoftmaxAnimationStore = writable(false);

    const hoverInfoStore = writable({});

    const modalStore = writable({});

    const intermediateLayerPositionStore = writable({});

    // Enum of node types

    // Helper functions

    /**
     * Create a 2D array (matrix) with given size and default value.
     * 
     * @param {int} height Height (number of rows) for the matrix
     * @param {int} width Width (number of columns) for the matrix
     * @param {int} fill Default value to fill this matrix
     */
    const init2DArray = (height, width, fill) => {
      let array = [];
      // Itereate through rows
      for (let r = 0; r < height; r++) {
        let row = new Array(width).fill(fill);
        array.push(row);
      }
      return array;
    };

    /**
     * Dot product of two matrices.
     * @param {[[number]]} mat1 Matrix 1
     * @param {[[number]]} mat2 Matrix 2
     */
    const matrixDot = (mat1, mat2) => {
      console.assert(mat1.length === mat2.length, 'Dimension not matching');
      console.assert(mat1[0].length === mat2[0].length, 'Dimension not matching');

      let result = 0;
      for (let i = 0; i < mat1.length; i++){
        for (let j = 0; j < mat1[0].length; j++){
          result += mat1[i][j] * mat2[i][j];
        }
      }
      
      return result;
    };

    /**
     * 2D slice on a matrix.
     * @param {[[number]]} mat Matrix
     * @param {int} xs First dimension (row) starting index
     * @param {int} xe First dimension (row) ending index
     * @param {int} ys Second dimension (column) starting index
     * @param {int} ye Second dimension (column) ending index
     */
    const matrixSlice = (mat, xs, xe, ys, ye) => {
      return mat.slice(xs, xe).map(s => s.slice(ys, ye));
    };

    /**
     * Compute the maximum of a matrix.
     * @param {[[number]]} mat Matrix
     */
    const matrixMax = (mat) => {
      let curMax = -Infinity;
      for (let i = 0; i < mat.length; i++) {
        for (let j = 0; j < mat[0].length; j++) {
          if (mat[i][j] > curMax) {
            curMax = mat[i][j];
          }
        }
      }
      return curMax;
    };

    /**
     * Compute convolutions of one kernel on one matrix (one slice of a tensor).
     * @param {[[number]]} input Input, square matrix
     * @param {[[number]]} kernel Kernel weights, square matrix
     * @param {int} stride Stride size
     * @param {int} padding Padding size
     */
    const singleConv = (input, kernel, stride=1, padding=0) => {
      // TODO: implement padding

      // Only support square input and kernel
      console.assert(input.length === input[0].length,
         'Conv input is not square');
      console.assert(kernel.length === kernel[0].length,
        'Conv kernel is not square');

      let stepSize = (input.length - kernel.length) / stride + 1;

      let result = init2DArray(stepSize, stepSize, 0);

      // Window sliding
      for (let r = 0; r < stepSize; r++) {
        for (let c = 0; c < stepSize; c++) {
          let curWindow = matrixSlice(input, r * stride, r * stride + kernel.length,
            c * stride, c * stride + kernel.length);
          let dot = matrixDot(curWindow, kernel);
          result[r][c] = dot;
        }
      }
      return result;
    };

    /**
     * Max pool one matrix.
     * @param {[[number]]} mat Matrix
     * @param {int} kernelWidth Pooling kernel length (only supports 2)
     * @param {int} stride Pooling sliding stride (only supports 2)
     * @param {string} padding Pading method when encountering odd number mat,
     * currently this function only supports 'VALID'
     */
    const singleMaxPooling = (mat, kernelWidth=2, stride=2, padding='VALID') => {
      console.assert(kernelWidth === 2, 'Only supports kernen = [2,2]');
      console.assert(stride === 2, 'Only supports stride = 2');
      console.assert(padding === 'VALID', 'Only support valid padding');

      // Handle odd length mat
      // 'VALID': ignore edge rows and columns
      // 'SAME': add zero padding to make the mat have even length
      if (mat.length % 2 === 1 && padding === 'VALID') {
        mat = matrixSlice(mat, 0, mat.length - 1, 0, mat.length - 1);
      }

      let stepSize = (mat.length - kernelWidth) / stride + 1;
      let result = init2DArray(stepSize, stepSize, 0);

      for (let r = 0; r < stepSize; r++) {
        for (let c = 0; c < stepSize; c++) {
          let curWindow = matrixSlice(mat, r * stride, r * stride + kernelWidth,
            c * stride, c * stride + kernelWidth);
          result[r][c] = matrixMax(curWindow);
        }
     }
     return result;
    };

    function array1d$1(length, f) {
      return Array.from({length: length}, f ? ((v, i) => f(i)) : undefined);
    }

    function array2d(height, width, f) {
      return Array.from({length: height}, (v, i) => Array.from({length: width}, f ? ((w, j) => f(i, j)) : undefined));
    }

    function generateOutputMappings$1(stride, output, kernelLength, padded_input_size, dilation) {
      const outputMapping = array2d(output.length, output.length, (i, j) => array2d(kernelLength, kernelLength));
      for (let h_out = 0; h_out < output.length; h_out++) {
        for (let w_out = 0; w_out < output.length; w_out++) {
          for (let h_kern = 0; h_kern < kernelLength; h_kern++) {
            for (let w_kern = 0; w_kern < kernelLength; w_kern++) {
              const h_im = h_out * stride + h_kern * dilation;
              const w_im = w_out * stride + w_kern * dilation;
              outputMapping[h_out][w_out][h_kern][w_kern] = h_im * padded_input_size + w_im;
            }
          }
        }
      }
      return outputMapping;
    }

    function compute_input_multiplies_with_weight$1(hoverH, hoverW, 
                                                  padded_input_size, weight_dims, outputMappings, kernelLength) {
      const input_multiplies_with_weight = array1d$1(padded_input_size * padded_input_size);
      for (let h_weight = 0; h_weight < kernelLength; h_weight++) {
        for (let w_weight = 0; w_weight < kernelLength; w_weight++) {
          const flat_input = outputMappings[hoverH][hoverW][h_weight][w_weight];
          if (typeof flat_input === "undefined") continue;
          input_multiplies_with_weight[flat_input] = [h_weight, w_weight];
        }
      }
      return input_multiplies_with_weight;
    }

    function getMatrixSliceFromInputHighlights(matrix, highlights, kernelLength) {
      var indices = highlights.reduce((total, value, index) => {
      if (value != undefined) total.push(index);
        return total;
      }, []);
      return matrixSlice(matrix, Math.floor(indices[0] / matrix.length), Math.floor(indices[0] / matrix.length) + kernelLength, indices[0] % matrix.length, indices[0] % matrix.length + kernelLength);
    }

    function getMatrixSliceFromOutputHighlights(matrix, highlights) {
      var indices = highlights.reduce((total, value, index) => {
      if (value != false) total.push(index);
        return total;
      }, []);
      return matrixSlice(matrix, Math.floor(indices[0] / matrix.length), Math.floor(indices[0] / matrix.length) + 1, indices[0] % matrix.length, indices[0] % matrix.length + 1);
    }

    // Edit these values to change size of low-level conv visualization.
    function getVisualizationSizeConstraint(imageLength) {
      let sizeOfGrid = 150;
      let maxSizeOfGridCell = 20;
      return sizeOfGrid / imageLength > maxSizeOfGridCell ? maxSizeOfGridCell : sizeOfGrid / imageLength;
    }

    function getDataRange(image) {
      let maxRow = image.map(function(row){ return Math.max.apply(Math, row); });
      let max = Math.max.apply(null, maxRow);
      let minRow = image.map(function(row){ return Math.min.apply(Math, row); });
      let min = Math.min.apply(null, minRow);
      let range = {
        range: 2 * Math.max(Math.abs(min), Math.abs(max)),
        min: min,
        max: max
      };
      return range;
    }

    function gridData(image, constraint=getVisualizationSizeConstraint(image.length)) {
      // Constrain grids based on input image size.
      var data = new Array();
      var xpos = 1;
      var ypos = 1;
      var width = constraint;
      var height = constraint;
      for (var row = 0; row < image.length; row++) {
        data.push( new Array() );
        for (var column = 0; column < image[0].length; column++) {
          data[row].push({
            text: Math.round(image[row][column] * 100) / 100,
            row: row,
            col: column,
            x: xpos,
            y: ypos,
            width: width,
            height: height
          });
          xpos += width;
        }
        xpos = 1;
        ypos += height; 
      }
      return data;
    }

    /* src\detail-view\Dataview.svelte generated by Svelte v3.24.0 */
    const file$7 = "src\\detail-view\\Dataview.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let svg;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			attr_dev(svg, "id", "grid");
    			attr_dev(svg, "width", "100%");
    			attr_dev(svg, "height", "100%");
    			add_location(svg, file$7, 118, 2, 3947);
    			set_style(div, "display", "inline-block");
    			set_style(div, "vertical-align", "middle");
    			attr_dev(div, "class", "grid");
    			add_location(div, file$7, 116, 0, 3844);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			/*div_binding*/ ctx[10](div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[10](null);
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

    const textConstraintDivisor = 2.6;
    const standardCellColor = "ddd";

    function instance$8($$self, $$props, $$invalidate) {
    	let { data } = $$props;
    	let { highlights } = $$props;
    	let { isKernelMath } = $$props;
    	let { constraint } = $$props;
    	let { dataRange } = $$props;
    	let { outputLength = undefined } = $$props;
    	let { stride = undefined } = $$props;
    	let { colorScale = d3.interpolateRdBu } = $$props;
    	let { isInputLayer = false } = $$props;
    	let grid_final;
    	const dispatch = createEventDispatcher();
    	let oldHighlight = highlights;
    	let oldData = data;

    	const redraw = () => {
    		d3.select(grid_final).selectAll("#grid > *").remove();
    		const constrainedSvgSize = data.length * constraint + 2;
    		var grid = d3.select(grid_final).select("#grid").attr("width", constrainedSvgSize + "px").attr("height", constrainedSvgSize + "px").append("svg").attr("width", constrainedSvgSize + "px").attr("height", constrainedSvgSize + "px");
    		var row = grid.selectAll(".row").data(data).enter().append("g").attr("class", "row");

    		var column = row.selectAll(".square").data(function (d) {
    			return d;
    		}).enter().append("rect").attr("class", "square").attr("x", function (d) {
    			return d.x;
    		}).attr("y", function (d) {
    			return d.y;
    		}).attr("width", function (d) {
    			return d.width;
    		}).attr("height", function (d) {
    			return d.height;
    		}).style("opacity", 0.8).style("fill", function (d) {
    			let normalizedValue = d.text;

    			if (isInputLayer) {
    				normalizedValue = 1 - d.text;
    			} else {
    				normalizedValue = (d.text + dataRange / 2) / dataRange;
    			}

    			return colorScale(normalizedValue);
    		}).on("mouseover", function (d) {
    			if (data.length != outputLength) {
    				dispatch("message", {
    					hoverH: Math.min(Math.floor(d.row / stride), outputLength - 1),
    					hoverW: Math.min(Math.floor(d.col / stride), outputLength - 1)
    				});
    			} else {
    				dispatch("message", {
    					hoverH: Math.min(Math.floor(d.row / 1), outputLength - 1),
    					hoverW: Math.min(Math.floor(d.col / 1), outputLength - 1)
    				});
    			}
    		});

    		if (isKernelMath) {
    			var text = row.selectAll(".text").data(function (d) {
    				return d;
    			}).enter().append("text").attr("class", "text").style("font-size", Math.floor(constraint / textConstraintDivisor) + "px").attr("x", function (d) {
    				return d.x + d.width / 2;
    			}).attr("y", function (d) {
    				return d.y + d.height / 2;
    			}).style("fill", function (d) {
    				let normalizedValue = d.text;

    				if (isInputLayer) {
    					normalizedValue = 1 - d.text;
    				} else {
    					normalizedValue = (d.text + dataRange / 2) / dataRange;
    				}

    				if (normalizedValue < 0.2 || normalizedValue > 0.8) {
    					return "white";
    				} else {
    					return "black";
    				}
    			}).style("text-anchor", "middle").style("dominant-baseline", "middle").text(function (d) {
    				return d.text;
    			});
    		}
    	};

    	afterUpdate(() => {
    		if (data != oldData) {
    			redraw();
    			oldData = data;
    		}

    		if (highlights != oldHighlight) {
    			var grid = d3.select(grid_final).select("#grid").select("svg");

    			grid.selectAll(".square").style("stroke", d => isKernelMath || highlights.length && highlights[d.row * data.length + d.col]
    			? "black"
    			: null);

    			oldHighlight = highlights;
    		}
    	});

    	onMount(() => {
    		redraw();
    	});

    	const writable_props = [
    		"data",
    		"highlights",
    		"isKernelMath",
    		"constraint",
    		"dataRange",
    		"outputLength",
    		"stride",
    		"colorScale",
    		"isInputLayer"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Dataview> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Dataview", $$slots, []);

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			grid_final = $$value;
    			$$invalidate(0, grid_final);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    		if ("highlights" in $$props) $$invalidate(2, highlights = $$props.highlights);
    		if ("isKernelMath" in $$props) $$invalidate(3, isKernelMath = $$props.isKernelMath);
    		if ("constraint" in $$props) $$invalidate(4, constraint = $$props.constraint);
    		if ("dataRange" in $$props) $$invalidate(5, dataRange = $$props.dataRange);
    		if ("outputLength" in $$props) $$invalidate(6, outputLength = $$props.outputLength);
    		if ("stride" in $$props) $$invalidate(7, stride = $$props.stride);
    		if ("colorScale" in $$props) $$invalidate(8, colorScale = $$props.colorScale);
    		if ("isInputLayer" in $$props) $$invalidate(9, isInputLayer = $$props.isInputLayer);
    	};

    	$$self.$capture_state = () => ({
    		data,
    		highlights,
    		isKernelMath,
    		constraint,
    		dataRange,
    		outputLength,
    		stride,
    		colorScale,
    		isInputLayer,
    		onMount,
    		onDestroy,
    		beforeUpdate,
    		afterUpdate,
    		createEventDispatcher,
    		grid_final,
    		textConstraintDivisor,
    		standardCellColor,
    		dispatch,
    		oldHighlight,
    		oldData,
    		redraw
    	});

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    		if ("highlights" in $$props) $$invalidate(2, highlights = $$props.highlights);
    		if ("isKernelMath" in $$props) $$invalidate(3, isKernelMath = $$props.isKernelMath);
    		if ("constraint" in $$props) $$invalidate(4, constraint = $$props.constraint);
    		if ("dataRange" in $$props) $$invalidate(5, dataRange = $$props.dataRange);
    		if ("outputLength" in $$props) $$invalidate(6, outputLength = $$props.outputLength);
    		if ("stride" in $$props) $$invalidate(7, stride = $$props.stride);
    		if ("colorScale" in $$props) $$invalidate(8, colorScale = $$props.colorScale);
    		if ("isInputLayer" in $$props) $$invalidate(9, isInputLayer = $$props.isInputLayer);
    		if ("grid_final" in $$props) $$invalidate(0, grid_final = $$props.grid_final);
    		if ("oldHighlight" in $$props) oldHighlight = $$props.oldHighlight;
    		if ("oldData" in $$props) oldData = $$props.oldData;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		grid_final,
    		data,
    		highlights,
    		isKernelMath,
    		constraint,
    		dataRange,
    		outputLength,
    		stride,
    		colorScale,
    		isInputLayer,
    		div_binding
    	];
    }

    class Dataview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			data: 1,
    			highlights: 2,
    			isKernelMath: 3,
    			constraint: 4,
    			dataRange: 5,
    			outputLength: 6,
    			stride: 7,
    			colorScale: 8,
    			isInputLayer: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dataview",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[1] === undefined && !("data" in props)) {
    			console.warn("<Dataview> was created without expected prop 'data'");
    		}

    		if (/*highlights*/ ctx[2] === undefined && !("highlights" in props)) {
    			console.warn("<Dataview> was created without expected prop 'highlights'");
    		}

    		if (/*isKernelMath*/ ctx[3] === undefined && !("isKernelMath" in props)) {
    			console.warn("<Dataview> was created without expected prop 'isKernelMath'");
    		}

    		if (/*constraint*/ ctx[4] === undefined && !("constraint" in props)) {
    			console.warn("<Dataview> was created without expected prop 'constraint'");
    		}

    		if (/*dataRange*/ ctx[5] === undefined && !("dataRange" in props)) {
    			console.warn("<Dataview> was created without expected prop 'dataRange'");
    		}
    	}

    	get data() {
    		throw new Error("<Dataview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Dataview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get highlights() {
    		throw new Error("<Dataview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set highlights(value) {
    		throw new Error("<Dataview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isKernelMath() {
    		throw new Error("<Dataview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isKernelMath(value) {
    		throw new Error("<Dataview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get constraint() {
    		throw new Error("<Dataview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set constraint(value) {
    		throw new Error("<Dataview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataRange() {
    		throw new Error("<Dataview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataRange(value) {
    		throw new Error("<Dataview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outputLength() {
    		throw new Error("<Dataview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outputLength(value) {
    		throw new Error("<Dataview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stride() {
    		throw new Error("<Dataview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stride(value) {
    		throw new Error("<Dataview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colorScale() {
    		throw new Error("<Dataview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colorScale(value) {
    		throw new Error("<Dataview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isInputLayer() {
    		throw new Error("<Dataview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isInputLayer(value) {
    		throw new Error("<Dataview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\detail-view\KernelMathView.svelte generated by Svelte v3.24.0 */
    const file$8 = "src\\detail-view\\KernelMathView.svelte";

    function create_fragment$9(ctx) {
    	let div0;
    	let t;
    	let div1;
    	let svg_1;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			svg_1 = svg_element("svg");
    			attr_dev(div0, "class", "legend");
    			add_location(div0, file$8, 282, 0, 10824);
    			attr_dev(svg_1, "id", "grid");
    			attr_dev(svg_1, "width", "100%");
    			attr_dev(svg_1, "height", "100%");
    			add_location(svg_1, file$8, 289, 2, 10989);
    			attr_dev(div1, "class", "grid");
    			add_location(div1, file$8, 287, 0, 10942);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			/*div0_binding*/ ctx[10](div0);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, svg_1);
    			/*div1_binding*/ ctx[11](div1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			/*div0_binding*/ ctx[10](null);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    			/*div1_binding*/ ctx[11](null);
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

    const textConstraintDivisor$1 = 2.6;

    function instance$9($$self, $$props, $$invalidate) {
    	let { data } = $$props;
    	let { kernel } = $$props;
    	let { constraint } = $$props;
    	let { dataRange } = $$props;
    	let { kernelRange } = $$props;
    	let { colorScale = d3.interpolateRdBu } = $$props;
    	let { kernelColorScale = d3.interpolateBrBG } = $$props;
    	let { isInputLayer = false } = $$props;
    	let gridFinal;
    	let legendFinal;
    	const multiplicationSymbolPadding = Math.floor(constraint / 3);
    	let oldData = data;
    	let oldKernel = kernel;

    	// Legend drawn similarly to legends in overview/intermediate-view.
    	const addOverlayGradient = (gradientID, stops, group) => {
    		if (group === undefined) {
    			group = svg;
    		}

    		// Create a gradient
    		let defs = group.append("defs").attr("class", "overlay-gradient");

    		let gradient = defs.append("linearGradient").attr("id", gradientID).attr("x1", "0%").attr("x2", "100%").attr("y1", "100%").attr("y2", "100%");

    		stops.forEach(s => {
    			gradient.append("stop").attr("offset", s.offset).attr("stop-color", s.color).attr("stop-opacity", s.opacity);
    		});
    	};

    	// Draw the legend for intermediate layer
    	const redrawDetailedConvViewLegend = arg => {
    		let legendHeight = arg.legendHeight,
    			range = arg.range,
    			minMax = arg.minMax,
    			width = arg.width,
    			colorScale = arg.colorScale,
    			gradientGap = arg.gradientGap;

    		d3.select(legendFinal).selectAll("#legend > *").remove();
    		let legend = d3.select(legendFinal).select("#legend").attr("width", 150 + "px").attr("height", 25 + "px").attr("align", "center").style("dominant-baseline", "middle");
    		let detailedViewKernel = legend.append("g").attr("transform", `translate(10, 0)`);

    		if (colorScale === undefined) {
    			colorScale = layerColorScales.conv;
    		}

    		if (gradientGap === undefined) {
    			gradientGap = 0;
    		}

    		// Add a legend color gradient
    		let gradientName = `url(#detailed-kernel-gradient)`;

    		let normalizedColor = v => colorScale(v * (1 - 2 * gradientGap) + gradientGap);

    		let leftValue = (minMax.min + range / 2) / range,
    			zeroValue = (0 + range / 2) / range,
    			rightValue = (minMax.max + range / 2) / range,
    			totalRange = minMax.max - minMax.min,
    			zeroLocation = (0 - minMax.min) / totalRange,
    			leftMidValue = leftValue + (zeroValue - leftValue) / 2,
    			rightMidValue = zeroValue + (rightValue - zeroValue) / 2;

    		let stops = [
    			{
    				offset: 0,
    				color: normalizedColor(leftValue),
    				opacity: 1
    			},
    			{
    				offset: zeroLocation / 2,
    				color: normalizedColor(leftMidValue),
    				opacity: 1
    			},
    			{
    				offset: zeroLocation,
    				color: normalizedColor(zeroValue),
    				opacity: 1
    			},
    			{
    				offset: zeroLocation + (1 - zeroValue) / 2,
    				color: normalizedColor(rightMidValue),
    				opacity: 1
    			},
    			{
    				offset: 1,
    				color: normalizedColor(rightValue),
    				opacity: 1
    			}
    		];

    		addOverlayGradient(`detailed-kernel-gradient`, stops, detailedViewKernel);
    		let legendScale = d3.scaleLinear().range([0, width - 1.2]).domain([minMax.min, minMax.max]);
    		let legendAxis = d3.axisBottom().scale(legendScale).tickFormat(d3.format(".2f")).tickValues([minMax.min, 0, minMax.max]);
    		let detailedLegend = detailedViewKernel.append("g").attr("id", `detailed-legend-0`);
    		let legendGroup = detailedLegend.append("g").attr("transform", `translate(0, ${legendHeight - 3})`).call(legendAxis);
    		legendGroup.selectAll("text").style("font-size", "9px").style("fill", "black");
    		legendGroup.selectAll("path, line").style("stroke", "black");
    		detailedLegend.append("rect").attr("width", width).attr("height", legendHeight).style("fill", gradientName);
    	};

    	// Draw the elementwise dot-product math.
    	const redraw = () => {
    		d3.select(gridFinal).selectAll("#grid > *").remove();

    		const constrainedSvgSize = kernel
    		? 2 * (data.length * constraint) + 2
    		: data.length * constraint + 2;

    		var grid = d3.select(gridFinal).select("#grid").attr("width", constrainedSvgSize + "px").attr("height", constrainedSvgSize + "px").append("svg").attr("width", constrainedSvgSize + "px").attr("height", constrainedSvgSize + "px");
    		var row = grid.selectAll(".row").data(data).enter().append("g").attr("class", "row");

    		var columns = row.selectAll(".square").data(function (d) {
    			return d;
    		}).enter();

    		// Draw cells for slice from input matrix.
    		columns.append("rect").attr("class", "square").attr("x", function (d) {
    			return d.x === 1
    			? d.x + multiplicationSymbolPadding
    			: d.x * 2 + multiplicationSymbolPadding;
    		}).attr("y", function (d) {
    			return d.y === 1 ? d.y : d.y * 2;
    		}).attr("width", function (d) {
    			return d.width;
    		}).attr("height", function (d) {
    			return d.height;
    		}).style("opacity", 0.5).style("fill", function (d) {
    			let normalizedValue = d.text;

    			if (isInputLayer) {
    				normalizedValue = 1 - d.text;
    			} else {
    				normalizedValue = (d.text + dataRange / 2) / dataRange;
    			}

    			return colorScale(normalizedValue);
    		}).style("stroke", "black");

    		// Draw cells for the kernel.
    		columns.append("rect").attr("class", "square").attr("x", function (d) {
    			return d.x === 1
    			? d.x + multiplicationSymbolPadding
    			: d.x * 2 + multiplicationSymbolPadding;
    		}).attr("y", function (d) {
    			return d.y === 1 ? d.y + d.height : d.y * 2 + d.height;
    		}).attr("width", function (d) {
    			return d.width;
    		}).attr("height", function (d) {
    			return d.height / 2;
    		}).style("opacity", 0.5).// Same colorscale as is used for the flatten layers.
    		style("fill", function (d) {
    			let normalizedValue = (kernel[d.row][d.col].text + kernelRange.range / 2) / kernelRange.range;
    			const gap = 0.2;
    			let normalizedValueWithGap = normalizedValue * (1 - 2 * gap) + gap;
    			return kernelColorScale(normalizedValueWithGap);
    		});

    		var texts = row.selectAll(".text").data(function (d) {
    			return d;
    		}).enter();

    		// Draw numbers from input matrix slice.
    		texts.append("text").attr("class", "text").style("font-size", Math.floor(constraint / textConstraintDivisor$1) + "px").attr("x", function (d) {
    			return d.x === 1
    			? d.x + d.width / 2 + multiplicationSymbolPadding
    			: d.x * 2 + d.width / 2 + multiplicationSymbolPadding;
    		}).attr("y", function (d) {
    			return d.y === 1 ? d.y + d.height / 2 : d.y * 2 + d.height / 2;
    		}).style("fill", function (d) {
    			let normalizedValue = d.text;

    			if (isInputLayer) {
    				normalizedValue = 1 - d.text;
    			} else {
    				normalizedValue = (d.text + dataRange / 2) / dataRange;
    			}

    			if (normalizedValue < 0.2 || normalizedValue > 0.8) {
    				if (isInputLayer && normalizedValue < 0.2) {
    					return "black";
    				}

    				return "white";
    			} else {
    				return "black";
    			}
    		}).style("text-anchor", "middle").style("dominant-baseline", "middle").text(function (d) {
    			return d.text;
    		});

    		// Attempted to use FontAwesome icons for the 'x', '+', and '=', but none of these strategies work: https://github.com/FortAwesome/Font-Awesome/issues/12268
    		// Draw 'x' to signify multiplication.
    		texts.append("text").attr("class", "text").style("font-size", Math.floor(constraint / textConstraintDivisor$1) + "px").attr("font-weight", 600).attr("x", function (d) {
    			return d.x === 1
    			? d.x + multiplicationSymbolPadding / 2
    			: d.x * 2 + multiplicationSymbolPadding / 2;
    		}).attr("y", function (d) {
    			return d.y === 1
    			? d.y + d.height + d.height / 4
    			: d.y * 2 + d.height + d.height / 4;
    		}).style("fill", "black").style("text-anchor", "middle").style("dominant-baseline", "middle").text(function (d) {
    			return "×";
    		});

    		// Draw kernel values.
    		texts.append("text").attr("class", "text").style("font-size", Math.floor(constraint / textConstraintDivisor$1) + "px").attr("x", function (d) {
    			return d.x === 1
    			? d.x + d.width / 2 + multiplicationSymbolPadding
    			: d.x * 2 + d.width / 2 + multiplicationSymbolPadding;
    		}).attr("y", function (d) {
    			return d.y === 1
    			? d.y + d.height + d.height / 4
    			: d.y * 2 + d.height + d.height / 4;
    		}).style("fill", function (d) {
    			let normalizedValue = (kernel[d.row][d.col].text + kernelRange.range / 2) / kernelRange.range;
    			const gap = 0.2;
    			let normalizedValueWithGap = normalizedValue * (1 - 2 * gap) + gap;

    			if (normalizedValueWithGap < 0.2 || normalizedValueWithGap > 0.8) {
    				return "white";
    			} else {
    				return "black";
    			}
    		}).style("text-anchor", "middle").style("dominant-baseline", "middle").text(function (d) {
    			return kernel[d.row][d.col].text;
    		});

    		// Draw '+' to signify the summing of products except for the last kernel cell where '=' is drawn.
    		texts.append("text").attr("class", "text").style("font-size", Math.floor(constraint / (textConstraintDivisor$1 - 1)) + "px").attr("x", function (d) {
    			return d.x === 1
    			? d.x + d.width + d.width / 2 + multiplicationSymbolPadding
    			: d.x * 2 + d.width + d.width / 2 + multiplicationSymbolPadding;
    		}).attr("y", function (d) {
    			return d.y === 1 ? d.y + d.height / 2 : d.y * 2 + d.height / 2;
    		}).style("text-anchor", "middle").style("dominant-baseline", "middle").text(function (d) {
    			return d.row == kernel.length - 1 && d.col == kernel.length - 1
    			? "="
    			: "+";
    		});
    	};

    	afterUpdate(() => {
    		if (data != oldData) {
    			redraw();
    			oldData = data;
    		}

    		if (kernel != oldKernel) {
    			/*
    redrawDetailedConvViewLegend({
        legendHeight: 5,
        range: kernelRange.range,
        minMax: {min: kernelRange.min, max: kernelRange.max},
        width: 130,
        colorScale: kernelColorScale,
        gradientGap: 0.35,
    });
    */
    			oldKernel = kernel;
    		}
    	});

    	onMount(() => {
    		redraw();
    	}); /*
    redrawDetailedConvViewLegend({
          legendHeight: 5,
          range: kernelRange.range,
          minMax: {min: kernelRange.min, max: kernelRange.max},
          width: 130,
          colorScale: kernelColorScale,
          gradientGap: 0.35,
    });
    */

    	const writable_props = [
    		"data",
    		"kernel",
    		"constraint",
    		"dataRange",
    		"kernelRange",
    		"colorScale",
    		"kernelColorScale",
    		"isInputLayer"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<KernelMathView> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("KernelMathView", $$slots, []);

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			legendFinal = $$value;
    			$$invalidate(1, legendFinal);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			gridFinal = $$value;
    			$$invalidate(0, gridFinal);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("data" in $$props) $$invalidate(2, data = $$props.data);
    		if ("kernel" in $$props) $$invalidate(3, kernel = $$props.kernel);
    		if ("constraint" in $$props) $$invalidate(4, constraint = $$props.constraint);
    		if ("dataRange" in $$props) $$invalidate(5, dataRange = $$props.dataRange);
    		if ("kernelRange" in $$props) $$invalidate(6, kernelRange = $$props.kernelRange);
    		if ("colorScale" in $$props) $$invalidate(7, colorScale = $$props.colorScale);
    		if ("kernelColorScale" in $$props) $$invalidate(8, kernelColorScale = $$props.kernelColorScale);
    		if ("isInputLayer" in $$props) $$invalidate(9, isInputLayer = $$props.isInputLayer);
    	};

    	$$self.$capture_state = () => ({
    		data,
    		kernel,
    		constraint,
    		dataRange,
    		kernelRange,
    		colorScale,
    		kernelColorScale,
    		isInputLayer,
    		onMount,
    		afterUpdate,
    		gridFinal,
    		legendFinal,
    		textConstraintDivisor: textConstraintDivisor$1,
    		multiplicationSymbolPadding,
    		oldData,
    		oldKernel,
    		addOverlayGradient,
    		redrawDetailedConvViewLegend,
    		redraw
    	});

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(2, data = $$props.data);
    		if ("kernel" in $$props) $$invalidate(3, kernel = $$props.kernel);
    		if ("constraint" in $$props) $$invalidate(4, constraint = $$props.constraint);
    		if ("dataRange" in $$props) $$invalidate(5, dataRange = $$props.dataRange);
    		if ("kernelRange" in $$props) $$invalidate(6, kernelRange = $$props.kernelRange);
    		if ("colorScale" in $$props) $$invalidate(7, colorScale = $$props.colorScale);
    		if ("kernelColorScale" in $$props) $$invalidate(8, kernelColorScale = $$props.kernelColorScale);
    		if ("isInputLayer" in $$props) $$invalidate(9, isInputLayer = $$props.isInputLayer);
    		if ("gridFinal" in $$props) $$invalidate(0, gridFinal = $$props.gridFinal);
    		if ("legendFinal" in $$props) $$invalidate(1, legendFinal = $$props.legendFinal);
    		if ("oldData" in $$props) oldData = $$props.oldData;
    		if ("oldKernel" in $$props) oldKernel = $$props.oldKernel;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		gridFinal,
    		legendFinal,
    		data,
    		kernel,
    		constraint,
    		dataRange,
    		kernelRange,
    		colorScale,
    		kernelColorScale,
    		isInputLayer,
    		div0_binding,
    		div1_binding
    	];
    }

    class KernelMathView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			data: 2,
    			kernel: 3,
    			constraint: 4,
    			dataRange: 5,
    			kernelRange: 6,
    			colorScale: 7,
    			kernelColorScale: 8,
    			isInputLayer: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "KernelMathView",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[2] === undefined && !("data" in props)) {
    			console.warn("<KernelMathView> was created without expected prop 'data'");
    		}

    		if (/*kernel*/ ctx[3] === undefined && !("kernel" in props)) {
    			console.warn("<KernelMathView> was created without expected prop 'kernel'");
    		}

    		if (/*constraint*/ ctx[4] === undefined && !("constraint" in props)) {
    			console.warn("<KernelMathView> was created without expected prop 'constraint'");
    		}

    		if (/*dataRange*/ ctx[5] === undefined && !("dataRange" in props)) {
    			console.warn("<KernelMathView> was created without expected prop 'dataRange'");
    		}

    		if (/*kernelRange*/ ctx[6] === undefined && !("kernelRange" in props)) {
    			console.warn("<KernelMathView> was created without expected prop 'kernelRange'");
    		}
    	}

    	get data() {
    		throw new Error("<KernelMathView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<KernelMathView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get kernel() {
    		throw new Error("<KernelMathView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kernel(value) {
    		throw new Error("<KernelMathView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get constraint() {
    		throw new Error("<KernelMathView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set constraint(value) {
    		throw new Error("<KernelMathView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataRange() {
    		throw new Error("<KernelMathView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataRange(value) {
    		throw new Error("<KernelMathView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get kernelRange() {
    		throw new Error("<KernelMathView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kernelRange(value) {
    		throw new Error("<KernelMathView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colorScale() {
    		throw new Error("<KernelMathView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colorScale(value) {
    		throw new Error("<KernelMathView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get kernelColorScale() {
    		throw new Error("<KernelMathView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kernelColorScale(value) {
    		throw new Error("<KernelMathView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isInputLayer() {
    		throw new Error("<KernelMathView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isInputLayer(value) {
    		throw new Error("<KernelMathView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\detail-view\ConvolutionAnimator.svelte generated by Svelte v3.24.0 */
    const file$9 = "src\\detail-view\\ConvolutionAnimator.svelte";

    function create_fragment$a(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1_value = /*image*/ ctx[2].length + "";
    	let t1;
    	let t2;
    	let t3_value = /*image*/ ctx[2][0].length + "";
    	let t3;
    	let t4;
    	let t5;
    	let dataview0;
    	let t6;
    	let div2;
    	let kernelmathview;
    	let t7;
    	let dataview1;
    	let t8;
    	let div4;
    	let div3;
    	let t9;
    	let t10_value = /*output*/ ctx[3].length + "";
    	let t10;
    	let t11;
    	let t12_value = /*output*/ ctx[3][0].length + "";
    	let t12;
    	let t13;
    	let t14;
    	let dataview2;
    	let current;

    	dataview0 = new Dataview({
    			props: {
    				data: /*testImage*/ ctx[11],
    				highlights: /*inputHighlights*/ ctx[9],
    				outputLength: /*output*/ ctx[3].length,
    				isKernelMath: false,
    				constraint: getVisualizationSizeConstraint(/*image*/ ctx[2].length),
    				dataRange: /*dataRange*/ ctx[4],
    				stride: /*stride*/ ctx[0],
    				colorScale: /*colorScale*/ ctx[5],
    				isInputLayer: /*isInputInputLayer*/ ctx[6]
    			},
    			$$inline: true
    		});

    	dataview0.$on("message", /*handleMouseover*/ ctx[14]);

    	kernelmathview = new KernelMathView({
    			props: {
    				data: /*testInputMatrixSlice*/ ctx[7],
    				kernel: /*testKernel*/ ctx[13],
    				constraint: getVisualizationSizeConstraint(/*kernel*/ ctx[1].length),
    				dataRange: /*dataRange*/ ctx[4],
    				kernelRange: getDataRange(/*kernel*/ ctx[1]),
    				colorScale: /*colorScale*/ ctx[5],
    				isInputLayer: /*isInputInputLayer*/ ctx[6]
    			},
    			$$inline: true
    		});

    	dataview1 = new Dataview({
    			props: {
    				data: /*testOutputMatrixSlice*/ ctx[8],
    				highlights: /*outputHighlights*/ ctx[10],
    				isKernelMath: true,
    				constraint: getVisualizationSizeConstraint(/*kernel*/ ctx[1].length),
    				dataRange: /*dataRange*/ ctx[4]
    			},
    			$$inline: true
    		});

    	dataview2 = new Dataview({
    			props: {
    				data: /*testOutput*/ ctx[12],
    				highlights: /*outputHighlights*/ ctx[10],
    				isKernelMath: false,
    				outputLength: /*output*/ ctx[3].length,
    				constraint: getVisualizationSizeConstraint(/*output*/ ctx[3].length),
    				dataRange: /*dataRange*/ ctx[4],
    				stride: /*stride*/ ctx[0]
    			},
    			$$inline: true
    		});

    	dataview2.$on("message", /*handleMouseover*/ ctx[14]);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text("输入 (");
    			t1 = text(t1_value);
    			t2 = text(", ");
    			t3 = text(t3_value);
    			t4 = text(")");
    			t5 = space();
    			create_component(dataview0.$$.fragment);
    			t6 = space();
    			div2 = element("div");
    			create_component(kernelmathview.$$.fragment);
    			t7 = space();
    			create_component(dataview1.$$.fragment);
    			t8 = space();
    			div4 = element("div");
    			div3 = element("div");
    			t9 = text("输出 (");
    			t10 = text(t10_value);
    			t11 = text(", ");
    			t12 = text(t12_value);
    			t13 = text(")");
    			t14 = space();
    			create_component(dataview2.$$.fragment);
    			attr_dev(div0, "class", "header-text");
    			add_location(div0, file$9, 106, 2, 4124);
    			attr_dev(div1, "class", "column has-text-centered svelte-gz7a6i");
    			add_location(div1, file$9, 105, 0, 4082);
    			attr_dev(div2, "class", "column has-text-centered svelte-gz7a6i");
    			add_location(div2, file$9, 114, 0, 4527);
    			attr_dev(div3, "class", "header-text");
    			add_location(div3, file$9, 122, 2, 5080);
    			attr_dev(div4, "class", "column has-text-centered svelte-gz7a6i");
    			add_location(div4, file$9, 121, 0, 5038);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, t4);
    			append_dev(div1, t5);
    			mount_component(dataview0, div1, null);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div2, anchor);
    			mount_component(kernelmathview, div2, null);
    			append_dev(div2, t7);
    			mount_component(dataview1, div2, null);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, t9);
    			append_dev(div3, t10);
    			append_dev(div3, t11);
    			append_dev(div3, t12);
    			append_dev(div3, t13);
    			append_dev(div4, t14);
    			mount_component(dataview2, div4, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*image*/ 4) && t1_value !== (t1_value = /*image*/ ctx[2].length + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*image*/ 4) && t3_value !== (t3_value = /*image*/ ctx[2][0].length + "")) set_data_dev(t3, t3_value);
    			const dataview0_changes = {};
    			if (dirty & /*testImage*/ 2048) dataview0_changes.data = /*testImage*/ ctx[11];
    			if (dirty & /*inputHighlights*/ 512) dataview0_changes.highlights = /*inputHighlights*/ ctx[9];
    			if (dirty & /*output*/ 8) dataview0_changes.outputLength = /*output*/ ctx[3].length;
    			if (dirty & /*image*/ 4) dataview0_changes.constraint = getVisualizationSizeConstraint(/*image*/ ctx[2].length);
    			if (dirty & /*dataRange*/ 16) dataview0_changes.dataRange = /*dataRange*/ ctx[4];
    			if (dirty & /*stride*/ 1) dataview0_changes.stride = /*stride*/ ctx[0];
    			if (dirty & /*colorScale*/ 32) dataview0_changes.colorScale = /*colorScale*/ ctx[5];
    			if (dirty & /*isInputInputLayer*/ 64) dataview0_changes.isInputLayer = /*isInputInputLayer*/ ctx[6];
    			dataview0.$set(dataview0_changes);
    			const kernelmathview_changes = {};
    			if (dirty & /*testInputMatrixSlice*/ 128) kernelmathview_changes.data = /*testInputMatrixSlice*/ ctx[7];
    			if (dirty & /*testKernel*/ 8192) kernelmathview_changes.kernel = /*testKernel*/ ctx[13];
    			if (dirty & /*kernel*/ 2) kernelmathview_changes.constraint = getVisualizationSizeConstraint(/*kernel*/ ctx[1].length);
    			if (dirty & /*dataRange*/ 16) kernelmathview_changes.dataRange = /*dataRange*/ ctx[4];
    			if (dirty & /*kernel*/ 2) kernelmathview_changes.kernelRange = getDataRange(/*kernel*/ ctx[1]);
    			if (dirty & /*colorScale*/ 32) kernelmathview_changes.colorScale = /*colorScale*/ ctx[5];
    			if (dirty & /*isInputInputLayer*/ 64) kernelmathview_changes.isInputLayer = /*isInputInputLayer*/ ctx[6];
    			kernelmathview.$set(kernelmathview_changes);
    			const dataview1_changes = {};
    			if (dirty & /*testOutputMatrixSlice*/ 256) dataview1_changes.data = /*testOutputMatrixSlice*/ ctx[8];
    			if (dirty & /*outputHighlights*/ 1024) dataview1_changes.highlights = /*outputHighlights*/ ctx[10];
    			if (dirty & /*kernel*/ 2) dataview1_changes.constraint = getVisualizationSizeConstraint(/*kernel*/ ctx[1].length);
    			if (dirty & /*dataRange*/ 16) dataview1_changes.dataRange = /*dataRange*/ ctx[4];
    			dataview1.$set(dataview1_changes);
    			if ((!current || dirty & /*output*/ 8) && t10_value !== (t10_value = /*output*/ ctx[3].length + "")) set_data_dev(t10, t10_value);
    			if ((!current || dirty & /*output*/ 8) && t12_value !== (t12_value = /*output*/ ctx[3][0].length + "")) set_data_dev(t12, t12_value);
    			const dataview2_changes = {};
    			if (dirty & /*testOutput*/ 4096) dataview2_changes.data = /*testOutput*/ ctx[12];
    			if (dirty & /*outputHighlights*/ 1024) dataview2_changes.highlights = /*outputHighlights*/ ctx[10];
    			if (dirty & /*output*/ 8) dataview2_changes.outputLength = /*output*/ ctx[3].length;
    			if (dirty & /*output*/ 8) dataview2_changes.constraint = getVisualizationSizeConstraint(/*output*/ ctx[3].length);
    			if (dirty & /*dataRange*/ 16) dataview2_changes.dataRange = /*dataRange*/ ctx[4];
    			if (dirty & /*stride*/ 1) dataview2_changes.stride = /*stride*/ ctx[0];
    			dataview2.$set(dataview2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dataview0.$$.fragment, local);
    			transition_in(kernelmathview.$$.fragment, local);
    			transition_in(dataview1.$$.fragment, local);
    			transition_in(dataview2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dataview0.$$.fragment, local);
    			transition_out(kernelmathview.$$.fragment, local);
    			transition_out(dataview1.$$.fragment, local);
    			transition_out(dataview2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(dataview0);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div2);
    			destroy_component(kernelmathview);
    			destroy_component(dataview1);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(div4);
    			destroy_component(dataview2);
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

    const padding = 0;

    function instance$a($$self, $$props, $$invalidate) {
    	let { stride } = $$props;
    	let { dilation } = $$props;
    	let { kernel } = $$props;
    	let { image } = $$props;
    	let { output } = $$props;
    	let { isPaused } = $$props;
    	let { dataRange } = $$props;
    	let { colorScale } = $$props;
    	let { isInputInputLayer = false } = $$props;
    	const dispatch = createEventDispatcher();
    	let padded_input_size = image.length + padding * 2;

    	// Dummy data for original state of component.
    	let testInputMatrixSlice = [];

    	for (let i = 0; i < kernel.length; i++) {
    		testInputMatrixSlice.push([]);

    		for (let j = 0; j < kernel.length; j++) {
    			testInputMatrixSlice[i].push(0);
    		}
    	}

    	testInputMatrixSlice = gridData(testInputMatrixSlice);
    	let testOutputMatrixSlice = gridData([0]);
    	let inputHighlights = [];
    	let outputHighlights = array1d$1(output.length * output.length, i => true);
    	let interval;
    	let counter;

    	// lots of replication between mouseover and start-conv. TODO: fix this.
    	function startConvolution(stride) {
    		counter = 0;
    		let outputMappings = generateOutputMappings$1(stride, output, kernel.length, padded_input_size, dilation);
    		if (stride <= 0) return;
    		if (interval) clearInterval(interval);

    		$$invalidate(18, interval = setInterval(
    			() => {
    				if (isPaused) return;
    				const flat_animated = counter % (output.length * output.length);
    				$$invalidate(10, outputHighlights = array1d$1(output.length * output.length, i => false));
    				const animatedH = Math.floor(flat_animated / output.length);
    				const animatedW = flat_animated % output.length;
    				$$invalidate(10, outputHighlights[animatedH * output.length + animatedW] = true, outputHighlights);
    				$$invalidate(9, inputHighlights = compute_input_multiplies_with_weight$1(animatedH, animatedW, padded_input_size, kernel.length, outputMappings, kernel.length));
    				const inputMatrixSlice = getMatrixSliceFromInputHighlights(image, inputHighlights, kernel.length);
    				$$invalidate(7, testInputMatrixSlice = gridData(inputMatrixSlice));
    				const outputMatrixSlice = getMatrixSliceFromOutputHighlights(output, outputHighlights);
    				$$invalidate(8, testOutputMatrixSlice = gridData(outputMatrixSlice));
    				counter++;
    			},
    			250
    		));
    	}

    	function handleMouseover(event) {
    		let outputMappings = generateOutputMappings$1(stride, output, kernel.length, padded_input_size, dilation);
    		$$invalidate(10, outputHighlights = array1d$1(output.length * output.length, i => false));
    		const animatedH = event.detail.hoverH;
    		const animatedW = event.detail.hoverW;
    		$$invalidate(10, outputHighlights[animatedH * output.length + animatedW] = true, outputHighlights);
    		$$invalidate(9, inputHighlights = compute_input_multiplies_with_weight$1(animatedH, animatedW, padded_input_size, kernel.length, outputMappings, kernel.length));
    		const inputMatrixSlice = getMatrixSliceFromInputHighlights(image, inputHighlights, kernel.length);
    		$$invalidate(7, testInputMatrixSlice = gridData(inputMatrixSlice));
    		const outputMatrixSlice = getMatrixSliceFromOutputHighlights(output, outputHighlights);
    		$$invalidate(8, testOutputMatrixSlice = gridData(outputMatrixSlice));
    		$$invalidate(15, isPaused = true);
    		dispatch("message", { text: isPaused });
    	}

    	startConvolution(stride);
    	let testImage = gridData(image);
    	let testOutput = gridData(output);
    	let testKernel = gridData(kernel);

    	const writable_props = [
    		"stride",
    		"dilation",
    		"kernel",
    		"image",
    		"output",
    		"isPaused",
    		"dataRange",
    		"colorScale",
    		"isInputInputLayer"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ConvolutionAnimator> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ConvolutionAnimator", $$slots, []);

    	$$self.$set = $$props => {
    		if ("stride" in $$props) $$invalidate(0, stride = $$props.stride);
    		if ("dilation" in $$props) $$invalidate(16, dilation = $$props.dilation);
    		if ("kernel" in $$props) $$invalidate(1, kernel = $$props.kernel);
    		if ("image" in $$props) $$invalidate(2, image = $$props.image);
    		if ("output" in $$props) $$invalidate(3, output = $$props.output);
    		if ("isPaused" in $$props) $$invalidate(15, isPaused = $$props.isPaused);
    		if ("dataRange" in $$props) $$invalidate(4, dataRange = $$props.dataRange);
    		if ("colorScale" in $$props) $$invalidate(5, colorScale = $$props.colorScale);
    		if ("isInputInputLayer" in $$props) $$invalidate(6, isInputInputLayer = $$props.isInputInputLayer);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		array1d: array1d$1,
    		getMatrixSliceFromOutputHighlights,
    		compute_input_multiplies_with_weight: compute_input_multiplies_with_weight$1,
    		getDataRange,
    		getVisualizationSizeConstraint,
    		generateOutputMappings: generateOutputMappings$1,
    		getMatrixSliceFromInputHighlights,
    		gridData,
    		Dataview,
    		KernelMathView,
    		stride,
    		dilation,
    		kernel,
    		image,
    		output,
    		isPaused,
    		dataRange,
    		colorScale,
    		isInputInputLayer,
    		dispatch,
    		padding,
    		padded_input_size,
    		testInputMatrixSlice,
    		testOutputMatrixSlice,
    		inputHighlights,
    		outputHighlights,
    		interval,
    		counter,
    		startConvolution,
    		handleMouseover,
    		testImage,
    		testOutput,
    		testKernel
    	});

    	$$self.$inject_state = $$props => {
    		if ("stride" in $$props) $$invalidate(0, stride = $$props.stride);
    		if ("dilation" in $$props) $$invalidate(16, dilation = $$props.dilation);
    		if ("kernel" in $$props) $$invalidate(1, kernel = $$props.kernel);
    		if ("image" in $$props) $$invalidate(2, image = $$props.image);
    		if ("output" in $$props) $$invalidate(3, output = $$props.output);
    		if ("isPaused" in $$props) $$invalidate(15, isPaused = $$props.isPaused);
    		if ("dataRange" in $$props) $$invalidate(4, dataRange = $$props.dataRange);
    		if ("colorScale" in $$props) $$invalidate(5, colorScale = $$props.colorScale);
    		if ("isInputInputLayer" in $$props) $$invalidate(6, isInputInputLayer = $$props.isInputInputLayer);
    		if ("padded_input_size" in $$props) padded_input_size = $$props.padded_input_size;
    		if ("testInputMatrixSlice" in $$props) $$invalidate(7, testInputMatrixSlice = $$props.testInputMatrixSlice);
    		if ("testOutputMatrixSlice" in $$props) $$invalidate(8, testOutputMatrixSlice = $$props.testOutputMatrixSlice);
    		if ("inputHighlights" in $$props) $$invalidate(9, inputHighlights = $$props.inputHighlights);
    		if ("outputHighlights" in $$props) $$invalidate(10, outputHighlights = $$props.outputHighlights);
    		if ("interval" in $$props) $$invalidate(18, interval = $$props.interval);
    		if ("counter" in $$props) counter = $$props.counter;
    		if ("testImage" in $$props) $$invalidate(11, testImage = $$props.testImage);
    		if ("testOutput" in $$props) $$invalidate(12, testOutput = $$props.testOutput);
    		if ("testKernel" in $$props) $$invalidate(13, testKernel = $$props.testKernel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*image*/ 4) {
    			 padded_input_size = image.length + padding * 2;
    		}

    		if ($$self.$$.dirty & /*output*/ 8) {
    			 {
    				let outputHighlights = array1d$1(output.length * output.length, i => true);
    			}
    		}

    		if ($$self.$$.dirty & /*stride, image, output, kernel*/ 15) {
    			 {
    				startConvolution(stride);
    				$$invalidate(11, testImage = gridData(image));
    				$$invalidate(12, testOutput = gridData(output));
    				$$invalidate(13, testKernel = gridData(kernel));
    			}
    		}
    	};

    	return [
    		stride,
    		kernel,
    		image,
    		output,
    		dataRange,
    		colorScale,
    		isInputInputLayer,
    		testInputMatrixSlice,
    		testOutputMatrixSlice,
    		inputHighlights,
    		outputHighlights,
    		testImage,
    		testOutput,
    		testKernel,
    		handleMouseover,
    		isPaused,
    		dilation
    	];
    }

    class ConvolutionAnimator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			stride: 0,
    			dilation: 16,
    			kernel: 1,
    			image: 2,
    			output: 3,
    			isPaused: 15,
    			dataRange: 4,
    			colorScale: 5,
    			isInputInputLayer: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ConvolutionAnimator",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*stride*/ ctx[0] === undefined && !("stride" in props)) {
    			console.warn("<ConvolutionAnimator> was created without expected prop 'stride'");
    		}

    		if (/*dilation*/ ctx[16] === undefined && !("dilation" in props)) {
    			console.warn("<ConvolutionAnimator> was created without expected prop 'dilation'");
    		}

    		if (/*kernel*/ ctx[1] === undefined && !("kernel" in props)) {
    			console.warn("<ConvolutionAnimator> was created without expected prop 'kernel'");
    		}

    		if (/*image*/ ctx[2] === undefined && !("image" in props)) {
    			console.warn("<ConvolutionAnimator> was created without expected prop 'image'");
    		}

    		if (/*output*/ ctx[3] === undefined && !("output" in props)) {
    			console.warn("<ConvolutionAnimator> was created without expected prop 'output'");
    		}

    		if (/*isPaused*/ ctx[15] === undefined && !("isPaused" in props)) {
    			console.warn("<ConvolutionAnimator> was created without expected prop 'isPaused'");
    		}

    		if (/*dataRange*/ ctx[4] === undefined && !("dataRange" in props)) {
    			console.warn("<ConvolutionAnimator> was created without expected prop 'dataRange'");
    		}

    		if (/*colorScale*/ ctx[5] === undefined && !("colorScale" in props)) {
    			console.warn("<ConvolutionAnimator> was created without expected prop 'colorScale'");
    		}
    	}

    	get stride() {
    		throw new Error("<ConvolutionAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stride(value) {
    		throw new Error("<ConvolutionAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dilation() {
    		throw new Error("<ConvolutionAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dilation(value) {
    		throw new Error("<ConvolutionAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get kernel() {
    		throw new Error("<ConvolutionAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kernel(value) {
    		throw new Error("<ConvolutionAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get image() {
    		throw new Error("<ConvolutionAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image(value) {
    		throw new Error("<ConvolutionAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get output() {
    		throw new Error("<ConvolutionAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set output(value) {
    		throw new Error("<ConvolutionAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isPaused() {
    		throw new Error("<ConvolutionAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isPaused(value) {
    		throw new Error("<ConvolutionAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataRange() {
    		throw new Error("<ConvolutionAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataRange(value) {
    		throw new Error("<ConvolutionAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colorScale() {
    		throw new Error("<ConvolutionAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colorScale(value) {
    		throw new Error("<ConvolutionAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isInputInputLayer() {
    		throw new Error("<ConvolutionAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isInputInputLayer(value) {
    		throw new Error("<ConvolutionAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\detail-view\Convolutionview.svelte generated by Svelte v3.24.0 */

    const { console: console_1$1 } = globals;
    const file$a = "src\\detail-view\\Convolutionview.svelte";

    // (110:0) {#if !isExited}
    function create_if_block$1(ctx) {
    	let div10;
    	let div9;
    	let div5;
    	let div0;
    	let t1;
    	let div4;
    	let div1;
    	let i0;
    	let t2;
    	let div2;

    	let raw_value = (/*isPaused*/ ctx[6]
    	? "<i class=\"fas fa-play-circle play-icon\"></i>"
    	: "<i class=\"fas fa-pause-circle\"></i>") + "";

    	let t3;
    	let div3;
    	let i1;
    	let t4;
    	let div6;
    	let convolutionanimator;
    	let t5;
    	let div8;
    	let img;
    	let img_src_value;
    	let t6;
    	let div7;
    	let span;
    	let t8;
    	let current;
    	let mounted;
    	let dispose;

    	convolutionanimator = new ConvolutionAnimator({
    			props: {
    				kernel: /*kernel*/ ctx[2],
    				image: /*input*/ ctx[1],
    				output: /*outputFinal*/ ctx[7],
    				stride: /*stride*/ ctx[8],
    				dilation: dilation$1,
    				isPaused: /*isPaused*/ ctx[6],
    				dataRange: /*dataRange*/ ctx[3],
    				colorScale: /*colorScale*/ ctx[4],
    				isInputInputLayer: /*isInputInputLayer*/ ctx[5]
    			},
    			$$inline: true
    		});

    	convolutionanimator.$on("message", /*handlePauseFromInteraction*/ ctx[10]);

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			div9 = element("div");
    			div5 = element("div");
    			div0 = element("div");
    			div0.textContent = "卷积过程";
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			i0 = element("i");
    			t2 = space();
    			div2 = element("div");
    			t3 = space();
    			div3 = element("div");
    			i1 = element("i");
    			t4 = space();
    			div6 = element("div");
    			create_component(convolutionanimator.$$.fragment);
    			t5 = space();
    			div8 = element("div");
    			img = element("img");
    			t6 = space();
    			div7 = element("div");
    			span = element("span");
    			span.textContent = "悬停鼠标";
    			t8 = text(" 在矩阵中来查看对应位置的计算过程.");
    			attr_dev(div0, "class", "title-text svelte-1j8mhv0");
    			add_location(div0, file$a, 132, 8, 2965);
    			attr_dev(i0, "class", "fas fa-info-circle");
    			add_location(i0, file$a, 138, 12, 3164);
    			attr_dev(div1, "class", "control-button svelte-1j8mhv0");
    			attr_dev(div1, "title", "Jump to article section");
    			add_location(div1, file$a, 137, 10, 3066);
    			attr_dev(div2, "class", "play-button control-button svelte-1j8mhv0");
    			attr_dev(div2, "title", "Play animation");
    			add_location(div2, file$a, 141, 10, 3230);
    			attr_dev(i1, "class", "fas control-icon fa-times-circle");
    			add_location(i1, file$a, 148, 12, 3596);
    			attr_dev(div3, "class", "delete-button control-button svelte-1j8mhv0");
    			attr_dev(div3, "title", "Close");
    			add_location(div3, file$a, 147, 10, 3502);
    			attr_dev(div4, "class", "buttons svelte-1j8mhv0");
    			add_location(div4, file$a, 136, 8, 3033);
    			attr_dev(div5, "class", "control-pannel svelte-1j8mhv0");
    			add_location(div5, file$a, 130, 6, 2925);
    			attr_dev(div6, "class", "container is-centered svelte-1j8mhv0");
    			add_location(div6, file$a, 153, 6, 3702);
    			if (img.src !== (img_src_value = "/assets/img/pointer.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "pointer icon");
    			attr_dev(img, "class", "svelte-1j8mhv0");
    			add_location(img, file$a, 162, 8, 4105);
    			set_style(span, "font-weight", "600");
    			add_location(span, file$a, 164, 10, 4220);
    			attr_dev(div7, "class", "annotation-text");
    			add_location(div7, file$a, 163, 8, 4179);
    			attr_dev(div8, "class", "annotation svelte-1j8mhv0");
    			add_location(div8, file$a, 161, 6, 4071);
    			attr_dev(div9, "class", "box svelte-1j8mhv0");
    			add_location(div9, file$a, 128, 4, 2898);
    			attr_dev(div10, "class", "container svelte-1j8mhv0");
    			attr_dev(div10, "id", "detailview-container");
    			add_location(div10, file$a, 110, 2, 2296);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div9);
    			append_dev(div9, div5);
    			append_dev(div5, div0);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, i0);
    			append_dev(div4, t2);
    			append_dev(div4, div2);
    			div2.innerHTML = raw_value;
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div3, i1);
    			append_dev(div9, t4);
    			append_dev(div9, div6);
    			mount_component(convolutionanimator, div6, null);
    			append_dev(div9, t5);
    			append_dev(div9, div8);
    			append_dev(div8, img);
    			append_dev(div8, t6);
    			append_dev(div8, div7);
    			append_dev(div7, span);
    			append_dev(div7, t8);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", handleScroll, false, false, false),
    					listen_dev(div2, "click", /*handleClickPause*/ ctx[9], false, false, false),
    					listen_dev(div3, "click", /*handleClickX*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*isPaused*/ 64) && raw_value !== (raw_value = (/*isPaused*/ ctx[6]
    			? "<i class=\"fas fa-play-circle play-icon\"></i>"
    			: "<i class=\"fas fa-pause-circle\"></i>") + "")) div2.innerHTML = raw_value;
    			const convolutionanimator_changes = {};
    			if (dirty & /*kernel*/ 4) convolutionanimator_changes.kernel = /*kernel*/ ctx[2];
    			if (dirty & /*input*/ 2) convolutionanimator_changes.image = /*input*/ ctx[1];
    			if (dirty & /*outputFinal*/ 128) convolutionanimator_changes.output = /*outputFinal*/ ctx[7];
    			if (dirty & /*isPaused*/ 64) convolutionanimator_changes.isPaused = /*isPaused*/ ctx[6];
    			if (dirty & /*dataRange*/ 8) convolutionanimator_changes.dataRange = /*dataRange*/ ctx[3];
    			if (dirty & /*colorScale*/ 16) convolutionanimator_changes.colorScale = /*colorScale*/ ctx[4];
    			if (dirty & /*isInputInputLayer*/ 32) convolutionanimator_changes.isInputInputLayer = /*isInputInputLayer*/ ctx[5];
    			convolutionanimator.$set(convolutionanimator_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(convolutionanimator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(convolutionanimator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			destroy_component(convolutionanimator);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(110:0) {#if !isExited}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = !/*isExited*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*isExited*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isExited*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
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
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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

    const dilation$1 = 1;

    function handleScroll() {
    	let svgHeight = Number(d3.select("#cnn-svg").style("height").replace("px", "")) + 150;
    	let scroll = new SmoothScroll("a[href*=\"#\"]", { offset: -svgHeight });
    	let anchor = document.querySelector(`#article-convolution`);
    	scroll.animateScroll(anchor);
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { input } = $$props;
    	let { kernel } = $$props;
    	let { dataRange } = $$props;
    	let { colorScale = d3.interpolateRdBu } = $$props;
    	let { isInputInputLayer = false } = $$props;
    	let { isExited = false } = $$props;

    	// export let output;
    	const dispatch = createEventDispatcher();

    	let stride = 1;
    	var isPaused = false;
    	var outputFinal = singleConv(input, kernel, stride);

    	function handleClickPause() {
    		$$invalidate(6, isPaused = !isPaused);
    	}

    	function handlePauseFromInteraction(event) {
    		$$invalidate(6, isPaused = event.detail.text);
    	}

    	function handleClickX() {
    		$$invalidate(0, isExited = true);
    		dispatch("message", { text: isExited });
    	}

    	const writable_props = ["input", "kernel", "dataRange", "colorScale", "isInputInputLayer", "isExited"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Convolutionview> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Convolutionview", $$slots, []);

    	$$self.$set = $$props => {
    		if ("input" in $$props) $$invalidate(1, input = $$props.input);
    		if ("kernel" in $$props) $$invalidate(2, kernel = $$props.kernel);
    		if ("dataRange" in $$props) $$invalidate(3, dataRange = $$props.dataRange);
    		if ("colorScale" in $$props) $$invalidate(4, colorScale = $$props.colorScale);
    		if ("isInputInputLayer" in $$props) $$invalidate(5, isInputInputLayer = $$props.isInputInputLayer);
    		if ("isExited" in $$props) $$invalidate(0, isExited = $$props.isExited);
    	};

    	$$self.$capture_state = () => ({
    		ConvolutionAnimator,
    		singleConv,
    		createEventDispatcher,
    		input,
    		kernel,
    		dataRange,
    		colorScale,
    		isInputInputLayer,
    		isExited,
    		dispatch,
    		stride,
    		dilation: dilation$1,
    		isPaused,
    		outputFinal,
    		handleClickPause,
    		handleScroll,
    		handlePauseFromInteraction,
    		handleClickX
    	});

    	$$self.$inject_state = $$props => {
    		if ("input" in $$props) $$invalidate(1, input = $$props.input);
    		if ("kernel" in $$props) $$invalidate(2, kernel = $$props.kernel);
    		if ("dataRange" in $$props) $$invalidate(3, dataRange = $$props.dataRange);
    		if ("colorScale" in $$props) $$invalidate(4, colorScale = $$props.colorScale);
    		if ("isInputInputLayer" in $$props) $$invalidate(5, isInputInputLayer = $$props.isInputInputLayer);
    		if ("isExited" in $$props) $$invalidate(0, isExited = $$props.isExited);
    		if ("stride" in $$props) $$invalidate(8, stride = $$props.stride);
    		if ("isPaused" in $$props) $$invalidate(6, isPaused = $$props.isPaused);
    		if ("outputFinal" in $$props) $$invalidate(7, outputFinal = $$props.outputFinal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*input, kernel*/ 6) {
    			 if (stride > 0) {
    				try {
    					$$invalidate(7, outputFinal = singleConv(input, kernel, stride));
    				} catch {
    					console.log("Cannot handle stride of " + stride);
    				}
    			}
    		}
    	};

    	return [
    		isExited,
    		input,
    		kernel,
    		dataRange,
    		colorScale,
    		isInputInputLayer,
    		isPaused,
    		outputFinal,
    		stride,
    		handleClickPause,
    		handlePauseFromInteraction,
    		handleClickX
    	];
    }

    class Convolutionview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			input: 1,
    			kernel: 2,
    			dataRange: 3,
    			colorScale: 4,
    			isInputInputLayer: 5,
    			isExited: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Convolutionview",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*input*/ ctx[1] === undefined && !("input" in props)) {
    			console_1$1.warn("<Convolutionview> was created without expected prop 'input'");
    		}

    		if (/*kernel*/ ctx[2] === undefined && !("kernel" in props)) {
    			console_1$1.warn("<Convolutionview> was created without expected prop 'kernel'");
    		}

    		if (/*dataRange*/ ctx[3] === undefined && !("dataRange" in props)) {
    			console_1$1.warn("<Convolutionview> was created without expected prop 'dataRange'");
    		}
    	}

    	get input() {
    		throw new Error("<Convolutionview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input(value) {
    		throw new Error("<Convolutionview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get kernel() {
    		throw new Error("<Convolutionview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kernel(value) {
    		throw new Error("<Convolutionview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataRange() {
    		throw new Error("<Convolutionview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataRange(value) {
    		throw new Error("<Convolutionview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colorScale() {
    		throw new Error("<Convolutionview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colorScale(value) {
    		throw new Error("<Convolutionview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isInputInputLayer() {
    		throw new Error("<Convolutionview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isInputInputLayer(value) {
    		throw new Error("<Convolutionview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isExited() {
    		throw new Error("<Convolutionview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isExited(value) {
    		throw new Error("<Convolutionview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\detail-view\ActivationAnimator.svelte generated by Svelte v3.24.0 */
    const file$b = "src\\detail-view\\ActivationAnimator.svelte";

    function create_fragment$c(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1_value = /*image*/ ctx[0].length + "";
    	let t1;
    	let t2;
    	let t3_value = /*image*/ ctx[0][0].length + "";
    	let t3;
    	let t4;
    	let t5;
    	let dataview0;
    	let t6;
    	let div2;
    	let span;
    	let t7;
    	let dataview1;
    	let t8;
    	let dataview2;
    	let t9;
    	let dataview3;
    	let t10;
    	let div4;
    	let div3;
    	let t11;
    	let t12_value = /*output*/ ctx[1].length + "";
    	let t12;
    	let t13;
    	let t14_value = /*output*/ ctx[1][0].length + "";
    	let t14;
    	let t15;
    	let t16;
    	let dataview4;
    	let current;

    	dataview0 = new Dataview({
    			props: {
    				data: /*gridImage*/ ctx[7],
    				highlights: /*inputHighlights*/ ctx[5],
    				outputLength: /*output*/ ctx[1].length,
    				isKernelMath: false,
    				constraint: getVisualizationSizeConstraint(/*image*/ ctx[0].length),
    				dataRange: /*dataRange*/ ctx[2],
    				stride: 1
    			},
    			$$inline: true
    		});

    	dataview0.$on("message", /*handleMouseover*/ ctx[9]);

    	dataview1 = new Dataview({
    			props: {
    				data: gridData([[0]]),
    				highlights: /*outputHighlights*/ ctx[6],
    				isKernelMath: true,
    				constraint: 20,
    				dataRange: /*dataRange*/ ctx[2]
    			},
    			$$inline: true
    		});

    	dataview2 = new Dataview({
    			props: {
    				data: /*gridInputMatrixSlice*/ ctx[3],
    				highlights: /*outputHighlights*/ ctx[6],
    				isKernelMath: true,
    				constraint: 20,
    				dataRange: /*dataRange*/ ctx[2]
    			},
    			$$inline: true
    		});

    	dataview3 = new Dataview({
    			props: {
    				data: /*gridOutputMatrixSlice*/ ctx[4],
    				highlights: /*outputHighlights*/ ctx[6],
    				isKernelMath: true,
    				constraint: 20,
    				dataRange: /*dataRange*/ ctx[2]
    			},
    			$$inline: true
    		});

    	dataview4 = new Dataview({
    			props: {
    				data: /*gridOutput*/ ctx[8],
    				highlights: /*outputHighlights*/ ctx[6],
    				isKernelMath: false,
    				outputLength: /*output*/ ctx[1].length,
    				constraint: getVisualizationSizeConstraint(/*output*/ ctx[1].length),
    				dataRange: /*dataRange*/ ctx[2],
    				stride: 1
    			},
    			$$inline: true
    		});

    	dataview4.$on("message", /*handleMouseover*/ ctx[9]);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text("Input (");
    			t1 = text(t1_value);
    			t2 = text(", ");
    			t3 = text(t3_value);
    			t4 = text(")");
    			t5 = space();
    			create_component(dataview0.$$.fragment);
    			t6 = space();
    			div2 = element("div");
    			span = element("span");
    			t7 = text("max(\r\n    ");
    			create_component(dataview1.$$.fragment);
    			t8 = text("\r\n    ,\r\n    ");
    			create_component(dataview2.$$.fragment);
    			t9 = text("\r\n    )\r\n    =\r\n    ");
    			create_component(dataview3.$$.fragment);
    			t10 = space();
    			div4 = element("div");
    			div3 = element("div");
    			t11 = text("Output (");
    			t12 = text(t12_value);
    			t13 = text(", ");
    			t14 = text(t14_value);
    			t15 = text(")");
    			t16 = space();
    			create_component(dataview4.$$.fragment);
    			attr_dev(div0, "class", "header-text");
    			add_location(div0, file$b, 85, 2, 3209);
    			attr_dev(div1, "class", "column has-text-centered svelte-gz7a6i");
    			add_location(div1, file$b, 84, 0, 3167);
    			add_location(span, file$b, 92, 2, 3583);
    			attr_dev(div2, "class", "column has-text-centered svelte-gz7a6i");
    			add_location(div2, file$b, 91, 0, 3541);
    			attr_dev(div3, "class", "header-text");
    			add_location(div3, file$b, 106, 2, 4099);
    			attr_dev(div4, "class", "column has-text-centered svelte-gz7a6i");
    			add_location(div4, file$b, 105, 0, 4057);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, t4);
    			append_dev(div1, t5);
    			mount_component(dataview0, div1, null);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, span);
    			append_dev(span, t7);
    			mount_component(dataview1, span, null);
    			append_dev(span, t8);
    			mount_component(dataview2, span, null);
    			append_dev(span, t9);
    			mount_component(dataview3, span, null);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, t11);
    			append_dev(div3, t12);
    			append_dev(div3, t13);
    			append_dev(div3, t14);
    			append_dev(div3, t15);
    			append_dev(div4, t16);
    			mount_component(dataview4, div4, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*image*/ 1) && t1_value !== (t1_value = /*image*/ ctx[0].length + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*image*/ 1) && t3_value !== (t3_value = /*image*/ ctx[0][0].length + "")) set_data_dev(t3, t3_value);
    			const dataview0_changes = {};
    			if (dirty & /*gridImage*/ 128) dataview0_changes.data = /*gridImage*/ ctx[7];
    			if (dirty & /*inputHighlights*/ 32) dataview0_changes.highlights = /*inputHighlights*/ ctx[5];
    			if (dirty & /*output*/ 2) dataview0_changes.outputLength = /*output*/ ctx[1].length;
    			if (dirty & /*image*/ 1) dataview0_changes.constraint = getVisualizationSizeConstraint(/*image*/ ctx[0].length);
    			if (dirty & /*dataRange*/ 4) dataview0_changes.dataRange = /*dataRange*/ ctx[2];
    			dataview0.$set(dataview0_changes);
    			const dataview1_changes = {};
    			if (dirty & /*outputHighlights*/ 64) dataview1_changes.highlights = /*outputHighlights*/ ctx[6];
    			if (dirty & /*dataRange*/ 4) dataview1_changes.dataRange = /*dataRange*/ ctx[2];
    			dataview1.$set(dataview1_changes);
    			const dataview2_changes = {};
    			if (dirty & /*gridInputMatrixSlice*/ 8) dataview2_changes.data = /*gridInputMatrixSlice*/ ctx[3];
    			if (dirty & /*outputHighlights*/ 64) dataview2_changes.highlights = /*outputHighlights*/ ctx[6];
    			if (dirty & /*dataRange*/ 4) dataview2_changes.dataRange = /*dataRange*/ ctx[2];
    			dataview2.$set(dataview2_changes);
    			const dataview3_changes = {};
    			if (dirty & /*gridOutputMatrixSlice*/ 16) dataview3_changes.data = /*gridOutputMatrixSlice*/ ctx[4];
    			if (dirty & /*outputHighlights*/ 64) dataview3_changes.highlights = /*outputHighlights*/ ctx[6];
    			if (dirty & /*dataRange*/ 4) dataview3_changes.dataRange = /*dataRange*/ ctx[2];
    			dataview3.$set(dataview3_changes);
    			if ((!current || dirty & /*output*/ 2) && t12_value !== (t12_value = /*output*/ ctx[1].length + "")) set_data_dev(t12, t12_value);
    			if ((!current || dirty & /*output*/ 2) && t14_value !== (t14_value = /*output*/ ctx[1][0].length + "")) set_data_dev(t14, t14_value);
    			const dataview4_changes = {};
    			if (dirty & /*gridOutput*/ 256) dataview4_changes.data = /*gridOutput*/ ctx[8];
    			if (dirty & /*outputHighlights*/ 64) dataview4_changes.highlights = /*outputHighlights*/ ctx[6];
    			if (dirty & /*output*/ 2) dataview4_changes.outputLength = /*output*/ ctx[1].length;
    			if (dirty & /*output*/ 2) dataview4_changes.constraint = getVisualizationSizeConstraint(/*output*/ ctx[1].length);
    			if (dirty & /*dataRange*/ 4) dataview4_changes.dataRange = /*dataRange*/ ctx[2];
    			dataview4.$set(dataview4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dataview0.$$.fragment, local);
    			transition_in(dataview1.$$.fragment, local);
    			transition_in(dataview2.$$.fragment, local);
    			transition_in(dataview3.$$.fragment, local);
    			transition_in(dataview4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dataview0.$$.fragment, local);
    			transition_out(dataview1.$$.fragment, local);
    			transition_out(dataview2.$$.fragment, local);
    			transition_out(dataview3.$$.fragment, local);
    			transition_out(dataview4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(dataview0);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div2);
    			destroy_component(dataview1);
    			destroy_component(dataview2);
    			destroy_component(dataview3);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(div4);
    			destroy_component(dataview4);
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

    const padding$1 = 0;

    function instance$c($$self, $$props, $$invalidate) {
    	let { image } = $$props;
    	let { output } = $$props;
    	let { isPaused } = $$props;
    	let { dataRange } = $$props;
    	const dispatch = createEventDispatcher();
    	let padded_input_size = image.length + padding$1 * 2;
    	let gridInputMatrixSlice = gridData([[0]]);
    	let gridOutputMatrixSlice = gridData([[0]]);
    	let inputHighlights = array1d$1(image.length * image.length, i => true);
    	let outputHighlights = array1d$1(output.length * output.length, i => true);
    	let interval;
    	let counter;

    	// lots of replication between mouseover and start-relu. TODO: fix this.
    	function startRelu() {
    		counter = 0;
    		if (interval) clearInterval(interval);

    		$$invalidate(12, interval = setInterval(
    			() => {
    				if (isPaused) return;
    				const flat_animated = counter % (output.length * output.length);
    				$$invalidate(6, outputHighlights = array1d$1(output.length * output.length, i => false));
    				$$invalidate(5, inputHighlights = array1d$1(image.length * image.length, i => undefined));
    				const animatedH = Math.floor(flat_animated / output.length);
    				const animatedW = flat_animated % output.length;
    				$$invalidate(6, outputHighlights[animatedH * output.length + animatedW] = true, outputHighlights);
    				$$invalidate(5, inputHighlights[animatedH * output.length + animatedW] = true, inputHighlights);
    				const inputMatrixSlice = getMatrixSliceFromInputHighlights(image, inputHighlights, 1);
    				$$invalidate(3, gridInputMatrixSlice = gridData(inputMatrixSlice));
    				const outputMatrixSlice = getMatrixSliceFromOutputHighlights(output, outputHighlights);
    				$$invalidate(4, gridOutputMatrixSlice = gridData(outputMatrixSlice));
    				counter++;
    			},
    			250
    		));
    	}

    	function handleMouseover(event) {
    		$$invalidate(6, outputHighlights = array1d$1(output.length * output.length, i => false));
    		const animatedH = event.detail.hoverH;
    		const animatedW = event.detail.hoverW;
    		$$invalidate(6, outputHighlights[animatedH * output.length + animatedW] = true, outputHighlights);
    		$$invalidate(5, inputHighlights = array1d$1(image.length * image.length, i => undefined));
    		$$invalidate(5, inputHighlights[animatedH * output.length + animatedW] = true, inputHighlights);
    		const inputMatrixSlice = getMatrixSliceFromInputHighlights(image, inputHighlights, 1);
    		$$invalidate(3, gridInputMatrixSlice = gridData(inputMatrixSlice));
    		const outputMatrixSlice = getMatrixSliceFromOutputHighlights(output, outputHighlights);
    		$$invalidate(4, gridOutputMatrixSlice = gridData(outputMatrixSlice));
    		$$invalidate(10, isPaused = true);
    		dispatch("message", { text: isPaused });
    	}

    	startRelu();
    	let gridImage = gridData(image);
    	let gridOutput = gridData(output);
    	const writable_props = ["image", "output", "isPaused", "dataRange"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ActivationAnimator> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ActivationAnimator", $$slots, []);

    	$$self.$set = $$props => {
    		if ("image" in $$props) $$invalidate(0, image = $$props.image);
    		if ("output" in $$props) $$invalidate(1, output = $$props.output);
    		if ("isPaused" in $$props) $$invalidate(10, isPaused = $$props.isPaused);
    		if ("dataRange" in $$props) $$invalidate(2, dataRange = $$props.dataRange);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		array1d: array1d$1,
    		getMatrixSliceFromOutputHighlights,
    		getVisualizationSizeConstraint,
    		getMatrixSliceFromInputHighlights,
    		gridData,
    		Dataview,
    		image,
    		output,
    		isPaused,
    		dataRange,
    		dispatch,
    		padding: padding$1,
    		padded_input_size,
    		gridInputMatrixSlice,
    		gridOutputMatrixSlice,
    		inputHighlights,
    		outputHighlights,
    		interval,
    		counter,
    		startRelu,
    		handleMouseover,
    		gridImage,
    		gridOutput
    	});

    	$$self.$inject_state = $$props => {
    		if ("image" in $$props) $$invalidate(0, image = $$props.image);
    		if ("output" in $$props) $$invalidate(1, output = $$props.output);
    		if ("isPaused" in $$props) $$invalidate(10, isPaused = $$props.isPaused);
    		if ("dataRange" in $$props) $$invalidate(2, dataRange = $$props.dataRange);
    		if ("padded_input_size" in $$props) padded_input_size = $$props.padded_input_size;
    		if ("gridInputMatrixSlice" in $$props) $$invalidate(3, gridInputMatrixSlice = $$props.gridInputMatrixSlice);
    		if ("gridOutputMatrixSlice" in $$props) $$invalidate(4, gridOutputMatrixSlice = $$props.gridOutputMatrixSlice);
    		if ("inputHighlights" in $$props) $$invalidate(5, inputHighlights = $$props.inputHighlights);
    		if ("outputHighlights" in $$props) $$invalidate(6, outputHighlights = $$props.outputHighlights);
    		if ("interval" in $$props) $$invalidate(12, interval = $$props.interval);
    		if ("counter" in $$props) counter = $$props.counter;
    		if ("gridImage" in $$props) $$invalidate(7, gridImage = $$props.gridImage);
    		if ("gridOutput" in $$props) $$invalidate(8, gridOutput = $$props.gridOutput);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*image*/ 1) {
    			 padded_input_size = image.length + padding$1 * 2;
    		}

    		if ($$self.$$.dirty & /*image, output*/ 3) {
    			 {
    				let inputHighlights = array1d$1(image.length * image.length, i => true);
    				let outputHighlights = array1d$1(output.length * output.length, i => true);
    			}
    		}

    		if ($$self.$$.dirty & /*image, output*/ 3) {
    			 {
    				startRelu();
    				$$invalidate(7, gridImage = gridData(image));
    				$$invalidate(8, gridOutput = gridData(output));
    			}
    		}
    	};

    	return [
    		image,
    		output,
    		dataRange,
    		gridInputMatrixSlice,
    		gridOutputMatrixSlice,
    		inputHighlights,
    		outputHighlights,
    		gridImage,
    		gridOutput,
    		handleMouseover,
    		isPaused
    	];
    }

    class ActivationAnimator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			image: 0,
    			output: 1,
    			isPaused: 10,
    			dataRange: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ActivationAnimator",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*image*/ ctx[0] === undefined && !("image" in props)) {
    			console.warn("<ActivationAnimator> was created without expected prop 'image'");
    		}

    		if (/*output*/ ctx[1] === undefined && !("output" in props)) {
    			console.warn("<ActivationAnimator> was created without expected prop 'output'");
    		}

    		if (/*isPaused*/ ctx[10] === undefined && !("isPaused" in props)) {
    			console.warn("<ActivationAnimator> was created without expected prop 'isPaused'");
    		}

    		if (/*dataRange*/ ctx[2] === undefined && !("dataRange" in props)) {
    			console.warn("<ActivationAnimator> was created without expected prop 'dataRange'");
    		}
    	}

    	get image() {
    		throw new Error("<ActivationAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image(value) {
    		throw new Error("<ActivationAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get output() {
    		throw new Error("<ActivationAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set output(value) {
    		throw new Error("<ActivationAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isPaused() {
    		throw new Error("<ActivationAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isPaused(value) {
    		throw new Error("<ActivationAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataRange() {
    		throw new Error("<ActivationAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataRange(value) {
    		throw new Error("<ActivationAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\detail-view\Activationview.svelte generated by Svelte v3.24.0 */
    const file$c = "src\\detail-view\\Activationview.svelte";

    // (95:0) {#if !isExited}
    function create_if_block$2(ctx) {
    	let div10;
    	let div9;
    	let div5;
    	let div0;
    	let t1;
    	let div4;
    	let div1;
    	let i0;
    	let t2;
    	let div2;

    	let raw_value = (/*isPaused*/ ctx[4]
    	? "<i class=\"fas fa-play-circle play-icon\"></i>"
    	: "<i class=\"fas fa-pause-circle\"></i>") + "";

    	let t3;
    	let div3;
    	let i1;
    	let t4;
    	let div6;
    	let activationanimator;
    	let t5;
    	let div8;
    	let img;
    	let img_src_value;
    	let t6;
    	let div7;
    	let span;
    	let t8;
    	let current;
    	let mounted;
    	let dispose;

    	activationanimator = new ActivationAnimator({
    			props: {
    				image: /*input*/ ctx[0],
    				output: /*output*/ ctx[1],
    				isPaused: /*isPaused*/ ctx[4],
    				dataRange: /*dataRange*/ ctx[2]
    			},
    			$$inline: true
    		});

    	activationanimator.$on("message", /*handlePauseFromInteraction*/ ctx[6]);

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			div9 = element("div");
    			div5 = element("div");
    			div0 = element("div");
    			div0.textContent = "ReLU Activation";
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			i0 = element("i");
    			t2 = space();
    			div2 = element("div");
    			t3 = space();
    			div3 = element("div");
    			i1 = element("i");
    			t4 = space();
    			div6 = element("div");
    			create_component(activationanimator.$$.fragment);
    			t5 = space();
    			div8 = element("div");
    			img = element("img");
    			t6 = space();
    			div7 = element("div");
    			span = element("span");
    			span.textContent = "Hover over";
    			t8 = text(" the matrices to change pixel.");
    			attr_dev(div0, "class", "title-text svelte-1lq7956");
    			add_location(div0, file$c, 100, 8, 1910);
    			attr_dev(i0, "class", "fas fa-info-circle");
    			add_location(i0, file$c, 107, 12, 2122);
    			attr_dev(div1, "class", "control-button svelte-1lq7956");
    			attr_dev(div1, "title", "Jump to article section");
    			add_location(div1, file$c, 106, 10, 2024);
    			attr_dev(div2, "class", "play-button control-button svelte-1lq7956");
    			attr_dev(div2, "title", "Play animation");
    			add_location(div2, file$c, 110, 10, 2188);
    			attr_dev(i1, "class", "fas control-icon fa-times-circle");
    			add_location(i1, file$c, 117, 14, 2556);
    			attr_dev(div3, "class", "delete-button control-button svelte-1lq7956");
    			attr_dev(div3, "title", "Close");
    			add_location(div3, file$c, 116, 10, 2460);
    			attr_dev(div4, "class", "buttons svelte-1lq7956");
    			add_location(div4, file$c, 104, 8, 1989);
    			attr_dev(div5, "class", "control-pannel svelte-1lq7956");
    			add_location(div5, file$c, 98, 6, 1870);
    			attr_dev(div6, "class", "container is-centered is-vcentered svelte-1lq7956");
    			add_location(div6, file$c, 123, 6, 2664);
    			if (img.src !== (img_src_value = "/assets/img/pointer.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "pointer icon");
    			attr_dev(img, "class", "svelte-1lq7956");
    			add_location(img, file$c, 130, 8, 2936);
    			set_style(span, "font-weight", "600");
    			add_location(span, file$c, 132, 10, 3051);
    			attr_dev(div7, "class", "annotation-text");
    			add_location(div7, file$c, 131, 8, 3010);
    			attr_dev(div8, "class", "annotation svelte-1lq7956");
    			add_location(div8, file$c, 129, 6, 2902);
    			attr_dev(div9, "class", "box svelte-1lq7956");
    			add_location(div9, file$c, 96, 4, 1843);
    			attr_dev(div10, "class", "container svelte-1lq7956");
    			add_location(div10, file$c, 95, 2, 1814);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div9);
    			append_dev(div9, div5);
    			append_dev(div5, div0);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, i0);
    			append_dev(div4, t2);
    			append_dev(div4, div2);
    			div2.innerHTML = raw_value;
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div3, i1);
    			append_dev(div9, t4);
    			append_dev(div9, div6);
    			mount_component(activationanimator, div6, null);
    			append_dev(div9, t5);
    			append_dev(div9, div8);
    			append_dev(div8, img);
    			append_dev(div8, t6);
    			append_dev(div8, div7);
    			append_dev(div7, span);
    			append_dev(div7, t8);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", handleScroll$1, false, false, false),
    					listen_dev(div2, "click", /*handleClickPause*/ ctx[5], false, false, false),
    					listen_dev(div3, "click", /*handleClickX*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*isPaused*/ 16) && raw_value !== (raw_value = (/*isPaused*/ ctx[4]
    			? "<i class=\"fas fa-play-circle play-icon\"></i>"
    			: "<i class=\"fas fa-pause-circle\"></i>") + "")) div2.innerHTML = raw_value;
    			const activationanimator_changes = {};
    			if (dirty & /*input*/ 1) activationanimator_changes.image = /*input*/ ctx[0];
    			if (dirty & /*output*/ 2) activationanimator_changes.output = /*output*/ ctx[1];
    			if (dirty & /*isPaused*/ 16) activationanimator_changes.isPaused = /*isPaused*/ ctx[4];
    			if (dirty & /*dataRange*/ 4) activationanimator_changes.dataRange = /*dataRange*/ ctx[2];
    			activationanimator.$set(activationanimator_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(activationanimator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(activationanimator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			destroy_component(activationanimator);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(95:0) {#if !isExited}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = !/*isExited*/ ctx[3] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*isExited*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isExited*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
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
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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

    function handleScroll$1() {
    	let svgHeight = Number(d3.select("#cnn-svg").style("height").replace("px", "")) + 150;
    	let scroll = new SmoothScroll("a[href*=\"#\"]", { offset: -svgHeight });
    	let anchor = document.querySelector(`#article-relu`);
    	scroll.animateScroll(anchor);
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { input } = $$props;
    	let { output } = $$props;
    	let { dataRange } = $$props;
    	let { isExited } = $$props;
    	const dispatch = createEventDispatcher();
    	let isPaused = false;

    	function handleClickPause() {
    		$$invalidate(4, isPaused = !isPaused);
    	}

    	function handlePauseFromInteraction(event) {
    		$$invalidate(4, isPaused = event.detail.text);
    	}

    	function handleClickX() {
    		dispatch("message", { text: true });
    	}

    	const writable_props = ["input", "output", "dataRange", "isExited"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Activationview> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Activationview", $$slots, []);

    	$$self.$set = $$props => {
    		if ("input" in $$props) $$invalidate(0, input = $$props.input);
    		if ("output" in $$props) $$invalidate(1, output = $$props.output);
    		if ("dataRange" in $$props) $$invalidate(2, dataRange = $$props.dataRange);
    		if ("isExited" in $$props) $$invalidate(3, isExited = $$props.isExited);
    	};

    	$$self.$capture_state = () => ({
    		ActivationAnimator,
    		createEventDispatcher,
    		input,
    		output,
    		dataRange,
    		isExited,
    		dispatch,
    		isPaused,
    		handleClickPause,
    		handlePauseFromInteraction,
    		handleClickX,
    		handleScroll: handleScroll$1
    	});

    	$$self.$inject_state = $$props => {
    		if ("input" in $$props) $$invalidate(0, input = $$props.input);
    		if ("output" in $$props) $$invalidate(1, output = $$props.output);
    		if ("dataRange" in $$props) $$invalidate(2, dataRange = $$props.dataRange);
    		if ("isExited" in $$props) $$invalidate(3, isExited = $$props.isExited);
    		if ("isPaused" in $$props) $$invalidate(4, isPaused = $$props.isPaused);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		input,
    		output,
    		dataRange,
    		isExited,
    		isPaused,
    		handleClickPause,
    		handlePauseFromInteraction,
    		handleClickX
    	];
    }

    class Activationview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			input: 0,
    			output: 1,
    			dataRange: 2,
    			isExited: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Activationview",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*input*/ ctx[0] === undefined && !("input" in props)) {
    			console.warn("<Activationview> was created without expected prop 'input'");
    		}

    		if (/*output*/ ctx[1] === undefined && !("output" in props)) {
    			console.warn("<Activationview> was created without expected prop 'output'");
    		}

    		if (/*dataRange*/ ctx[2] === undefined && !("dataRange" in props)) {
    			console.warn("<Activationview> was created without expected prop 'dataRange'");
    		}

    		if (/*isExited*/ ctx[3] === undefined && !("isExited" in props)) {
    			console.warn("<Activationview> was created without expected prop 'isExited'");
    		}
    	}

    	get input() {
    		throw new Error("<Activationview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input(value) {
    		throw new Error("<Activationview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get output() {
    		throw new Error("<Activationview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set output(value) {
    		throw new Error("<Activationview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataRange() {
    		throw new Error("<Activationview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataRange(value) {
    		throw new Error("<Activationview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isExited() {
    		throw new Error("<Activationview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isExited(value) {
    		throw new Error("<Activationview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\detail-view\PoolAnimator.svelte generated by Svelte v3.24.0 */
    const file$d = "src\\detail-view\\PoolAnimator.svelte";

    function create_fragment$e(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1_value = /*testImage*/ ctx[9].length + "";
    	let t1;
    	let t2;
    	let t3_value = /*testImage*/ ctx[9][0].length + "";
    	let t3;
    	let t4;
    	let t5;
    	let dataview0;
    	let t6;
    	let div2;
    	let span;
    	let t7;
    	let dataview1;
    	let t8;
    	let dataview2;
    	let t9;
    	let div4;
    	let div3;
    	let t10;
    	let t11_value = /*testOutput*/ ctx[10].length + "";
    	let t11;
    	let t12;
    	let t13_value = /*testOutput*/ ctx[10][0].length + "";
    	let t13;
    	let t14;
    	let t15;
    	let dataview3;
    	let current;

    	dataview0 = new Dataview({
    			props: {
    				data: /*testImage*/ ctx[9],
    				highlights: /*inputHighlights*/ ctx[7],
    				outputLength: /*output*/ ctx[3].length,
    				isKernelMath: false,
    				constraint: getVisualizationSizeConstraint(/*image*/ ctx[2].length),
    				dataRange: /*dataRange*/ ctx[4],
    				stride: /*stride*/ ctx[0]
    			},
    			$$inline: true
    		});

    	dataview0.$on("message", /*handleMouseover*/ ctx[11]);

    	dataview1 = new Dataview({
    			props: {
    				data: /*testInputMatrixSlice*/ ctx[5],
    				highlights: /*outputHighlights*/ ctx[8],
    				isKernelMath: true,
    				constraint: getVisualizationSizeConstraint(/*kernelLength*/ ctx[1]),
    				dataRange: /*dataRange*/ ctx[4]
    			},
    			$$inline: true
    		});

    	dataview2 = new Dataview({
    			props: {
    				data: /*testOutputMatrixSlice*/ ctx[6],
    				highlights: /*outputHighlights*/ ctx[8],
    				isKernelMath: true,
    				constraint: getVisualizationSizeConstraint(/*kernelLength*/ ctx[1]),
    				dataRange: /*dataRange*/ ctx[4]
    			},
    			$$inline: true
    		});

    	dataview3 = new Dataview({
    			props: {
    				data: /*testOutput*/ ctx[10],
    				highlights: /*outputHighlights*/ ctx[8],
    				isKernelMath: false,
    				outputLength: /*output*/ ctx[3].length,
    				constraint: getVisualizationSizeConstraint(/*output*/ ctx[3].length),
    				dataRange: /*dataRange*/ ctx[4],
    				stride: /*stride*/ ctx[0]
    			},
    			$$inline: true
    		});

    	dataview3.$on("message", /*handleMouseover*/ ctx[11]);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text("输入 (");
    			t1 = text(t1_value);
    			t2 = text(", ");
    			t3 = text(t3_value);
    			t4 = text(")");
    			t5 = space();
    			create_component(dataview0.$$.fragment);
    			t6 = space();
    			div2 = element("div");
    			span = element("span");
    			t7 = text("max(\r\n    ");
    			create_component(dataview1.$$.fragment);
    			t8 = text("\r\n    )\r\n    =\r\n    ");
    			create_component(dataview2.$$.fragment);
    			t9 = space();
    			div4 = element("div");
    			div3 = element("div");
    			t10 = text("输出 (");
    			t11 = text(t11_value);
    			t12 = text(", ");
    			t13 = text(t13_value);
    			t14 = text(")");
    			t15 = space();
    			create_component(dataview3.$$.fragment);
    			attr_dev(div0, "class", "header-text");
    			add_location(div0, file$d, 99, 2, 3821);
    			attr_dev(div1, "class", "column has-text-centered svelte-gz7a6i");
    			add_location(div1, file$d, 98, 0, 3779);
    			add_location(span, file$d, 107, 2, 4207);
    			attr_dev(div2, "class", "column has-text-centered svelte-gz7a6i");
    			add_location(div2, file$d, 106, 0, 4165);
    			attr_dev(div3, "class", "header-text");
    			add_location(div3, file$d, 118, 2, 4668);
    			attr_dev(div4, "class", "column has-text-centered svelte-gz7a6i");
    			add_location(div4, file$d, 117, 0, 4626);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, t4);
    			append_dev(div1, t5);
    			mount_component(dataview0, div1, null);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, span);
    			append_dev(span, t7);
    			mount_component(dataview1, span, null);
    			append_dev(span, t8);
    			mount_component(dataview2, span, null);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, t10);
    			append_dev(div3, t11);
    			append_dev(div3, t12);
    			append_dev(div3, t13);
    			append_dev(div3, t14);
    			append_dev(div4, t15);
    			mount_component(dataview3, div4, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*testImage*/ 512) && t1_value !== (t1_value = /*testImage*/ ctx[9].length + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*testImage*/ 512) && t3_value !== (t3_value = /*testImage*/ ctx[9][0].length + "")) set_data_dev(t3, t3_value);
    			const dataview0_changes = {};
    			if (dirty & /*testImage*/ 512) dataview0_changes.data = /*testImage*/ ctx[9];
    			if (dirty & /*inputHighlights*/ 128) dataview0_changes.highlights = /*inputHighlights*/ ctx[7];
    			if (dirty & /*output*/ 8) dataview0_changes.outputLength = /*output*/ ctx[3].length;
    			if (dirty & /*image*/ 4) dataview0_changes.constraint = getVisualizationSizeConstraint(/*image*/ ctx[2].length);
    			if (dirty & /*dataRange*/ 16) dataview0_changes.dataRange = /*dataRange*/ ctx[4];
    			if (dirty & /*stride*/ 1) dataview0_changes.stride = /*stride*/ ctx[0];
    			dataview0.$set(dataview0_changes);
    			const dataview1_changes = {};
    			if (dirty & /*testInputMatrixSlice*/ 32) dataview1_changes.data = /*testInputMatrixSlice*/ ctx[5];
    			if (dirty & /*outputHighlights*/ 256) dataview1_changes.highlights = /*outputHighlights*/ ctx[8];
    			if (dirty & /*kernelLength*/ 2) dataview1_changes.constraint = getVisualizationSizeConstraint(/*kernelLength*/ ctx[1]);
    			if (dirty & /*dataRange*/ 16) dataview1_changes.dataRange = /*dataRange*/ ctx[4];
    			dataview1.$set(dataview1_changes);
    			const dataview2_changes = {};
    			if (dirty & /*testOutputMatrixSlice*/ 64) dataview2_changes.data = /*testOutputMatrixSlice*/ ctx[6];
    			if (dirty & /*outputHighlights*/ 256) dataview2_changes.highlights = /*outputHighlights*/ ctx[8];
    			if (dirty & /*kernelLength*/ 2) dataview2_changes.constraint = getVisualizationSizeConstraint(/*kernelLength*/ ctx[1]);
    			if (dirty & /*dataRange*/ 16) dataview2_changes.dataRange = /*dataRange*/ ctx[4];
    			dataview2.$set(dataview2_changes);
    			if ((!current || dirty & /*testOutput*/ 1024) && t11_value !== (t11_value = /*testOutput*/ ctx[10].length + "")) set_data_dev(t11, t11_value);
    			if ((!current || dirty & /*testOutput*/ 1024) && t13_value !== (t13_value = /*testOutput*/ ctx[10][0].length + "")) set_data_dev(t13, t13_value);
    			const dataview3_changes = {};
    			if (dirty & /*testOutput*/ 1024) dataview3_changes.data = /*testOutput*/ ctx[10];
    			if (dirty & /*outputHighlights*/ 256) dataview3_changes.highlights = /*outputHighlights*/ ctx[8];
    			if (dirty & /*output*/ 8) dataview3_changes.outputLength = /*output*/ ctx[3].length;
    			if (dirty & /*output*/ 8) dataview3_changes.constraint = getVisualizationSizeConstraint(/*output*/ ctx[3].length);
    			if (dirty & /*dataRange*/ 16) dataview3_changes.dataRange = /*dataRange*/ ctx[4];
    			if (dirty & /*stride*/ 1) dataview3_changes.stride = /*stride*/ ctx[0];
    			dataview3.$set(dataview3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dataview0.$$.fragment, local);
    			transition_in(dataview1.$$.fragment, local);
    			transition_in(dataview2.$$.fragment, local);
    			transition_in(dataview3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dataview0.$$.fragment, local);
    			transition_out(dataview1.$$.fragment, local);
    			transition_out(dataview2.$$.fragment, local);
    			transition_out(dataview3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(dataview0);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div2);
    			destroy_component(dataview1);
    			destroy_component(dataview2);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(div4);
    			destroy_component(dataview3);
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

    const padding$2 = 0;

    function instance$e($$self, $$props, $$invalidate) {
    	let { stride } = $$props;
    	let { dilation } = $$props;
    	let { kernelLength } = $$props;
    	let { image } = $$props;
    	let { output } = $$props;
    	let { isPaused } = $$props;
    	let { dataRange } = $$props;
    	const dispatch = createEventDispatcher();
    	let padded_input_size = image.length + padding$2 * 2;

    	// Dummy data for original state of component.
    	let testInputMatrixSlice = [];

    	for (let i = 0; i < kernelLength; i++) {
    		testInputMatrixSlice.push([]);

    		for (let j = 0; j < kernelLength; j++) {
    			testInputMatrixSlice[i].push(0);
    		}
    	}

    	testInputMatrixSlice = gridData(testInputMatrixSlice);
    	let testOutputMatrixSlice = gridData([[0]]);
    	let inputHighlights = [];
    	let outputHighlights = array1d$1(output.length * output.length, i => true);
    	let interval;
    	let counter;

    	// lots of replication between mouseover and start-pool. TODO: fix this.
    	function startMaxPool(stride) {
    		counter = 0;
    		let outputMappings = generateOutputMappings$1(stride, output, kernelLength, padded_input_size, dilation);
    		if (stride <= 0) return;
    		if (interval) clearInterval(interval);

    		$$invalidate(15, interval = setInterval(
    			() => {
    				if (isPaused) return;
    				const flat_animated = counter % (output.length * output.length);
    				$$invalidate(8, outputHighlights = array1d$1(output.length * output.length, i => false));
    				const animatedH = Math.floor(flat_animated / output.length);
    				const animatedW = flat_animated % output.length;
    				$$invalidate(8, outputHighlights[animatedH * output.length + animatedW] = true, outputHighlights);
    				$$invalidate(7, inputHighlights = compute_input_multiplies_with_weight$1(animatedH, animatedW, padded_input_size, kernelLength, outputMappings, kernelLength));
    				const inputMatrixSlice = getMatrixSliceFromInputHighlights(image, inputHighlights, kernelLength);
    				$$invalidate(5, testInputMatrixSlice = gridData(inputMatrixSlice));
    				const outputMatrixSlice = getMatrixSliceFromOutputHighlights(output, outputHighlights);
    				$$invalidate(6, testOutputMatrixSlice = gridData(outputMatrixSlice));
    				counter++;
    			},
    			250
    		));
    	}

    	function handleMouseover(event) {
    		let outputMappings = generateOutputMappings$1(stride, output, kernelLength, padded_input_size, dilation);
    		$$invalidate(8, outputHighlights = array1d$1(output.length * output.length, i => false));
    		const animatedH = event.detail.hoverH;
    		const animatedW = event.detail.hoverW;
    		$$invalidate(8, outputHighlights[animatedH * output.length + animatedW] = true, outputHighlights);
    		$$invalidate(7, inputHighlights = compute_input_multiplies_with_weight$1(animatedH, animatedW, padded_input_size, kernelLength, outputMappings, kernelLength));
    		const inputMatrixSlice = getMatrixSliceFromInputHighlights(image, inputHighlights, kernelLength);
    		$$invalidate(5, testInputMatrixSlice = gridData(inputMatrixSlice));
    		const outputMatrixSlice = getMatrixSliceFromOutputHighlights(output, outputHighlights);
    		$$invalidate(6, testOutputMatrixSlice = gridData(outputMatrixSlice));
    		$$invalidate(12, isPaused = true);
    		dispatch("message", { text: isPaused });
    	}

    	startMaxPool(stride);
    	let testImage = gridData(image);
    	let testOutput = gridData(output);

    	const writable_props = [
    		"stride",
    		"dilation",
    		"kernelLength",
    		"image",
    		"output",
    		"isPaused",
    		"dataRange"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PoolAnimator> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("PoolAnimator", $$slots, []);

    	$$self.$set = $$props => {
    		if ("stride" in $$props) $$invalidate(0, stride = $$props.stride);
    		if ("dilation" in $$props) $$invalidate(13, dilation = $$props.dilation);
    		if ("kernelLength" in $$props) $$invalidate(1, kernelLength = $$props.kernelLength);
    		if ("image" in $$props) $$invalidate(2, image = $$props.image);
    		if ("output" in $$props) $$invalidate(3, output = $$props.output);
    		if ("isPaused" in $$props) $$invalidate(12, isPaused = $$props.isPaused);
    		if ("dataRange" in $$props) $$invalidate(4, dataRange = $$props.dataRange);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		array1d: array1d$1,
    		getMatrixSliceFromOutputHighlights,
    		compute_input_multiplies_with_weight: compute_input_multiplies_with_weight$1,
    		getVisualizationSizeConstraint,
    		generateOutputMappings: generateOutputMappings$1,
    		getMatrixSliceFromInputHighlights,
    		gridData,
    		Dataview,
    		stride,
    		dilation,
    		kernelLength,
    		image,
    		output,
    		isPaused,
    		dataRange,
    		dispatch,
    		padding: padding$2,
    		padded_input_size,
    		testInputMatrixSlice,
    		testOutputMatrixSlice,
    		inputHighlights,
    		outputHighlights,
    		interval,
    		counter,
    		startMaxPool,
    		handleMouseover,
    		testImage,
    		testOutput
    	});

    	$$self.$inject_state = $$props => {
    		if ("stride" in $$props) $$invalidate(0, stride = $$props.stride);
    		if ("dilation" in $$props) $$invalidate(13, dilation = $$props.dilation);
    		if ("kernelLength" in $$props) $$invalidate(1, kernelLength = $$props.kernelLength);
    		if ("image" in $$props) $$invalidate(2, image = $$props.image);
    		if ("output" in $$props) $$invalidate(3, output = $$props.output);
    		if ("isPaused" in $$props) $$invalidate(12, isPaused = $$props.isPaused);
    		if ("dataRange" in $$props) $$invalidate(4, dataRange = $$props.dataRange);
    		if ("padded_input_size" in $$props) padded_input_size = $$props.padded_input_size;
    		if ("testInputMatrixSlice" in $$props) $$invalidate(5, testInputMatrixSlice = $$props.testInputMatrixSlice);
    		if ("testOutputMatrixSlice" in $$props) $$invalidate(6, testOutputMatrixSlice = $$props.testOutputMatrixSlice);
    		if ("inputHighlights" in $$props) $$invalidate(7, inputHighlights = $$props.inputHighlights);
    		if ("outputHighlights" in $$props) $$invalidate(8, outputHighlights = $$props.outputHighlights);
    		if ("interval" in $$props) $$invalidate(15, interval = $$props.interval);
    		if ("counter" in $$props) counter = $$props.counter;
    		if ("testImage" in $$props) $$invalidate(9, testImage = $$props.testImage);
    		if ("testOutput" in $$props) $$invalidate(10, testOutput = $$props.testOutput);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*image*/ 4) {
    			 padded_input_size = image.length + padding$2 * 2;
    		}

    		if ($$self.$$.dirty & /*output*/ 8) {
    			 {
    				let outputHighlights = array1d$1(output.length * output.length, i => true);
    			}
    		}

    		if ($$self.$$.dirty & /*stride, image, output*/ 13) {
    			 {
    				startMaxPool(stride);
    				$$invalidate(9, testImage = gridData(image));
    				$$invalidate(10, testOutput = gridData(output));
    			}
    		}
    	};

    	return [
    		stride,
    		kernelLength,
    		image,
    		output,
    		dataRange,
    		testInputMatrixSlice,
    		testOutputMatrixSlice,
    		inputHighlights,
    		outputHighlights,
    		testImage,
    		testOutput,
    		handleMouseover,
    		isPaused,
    		dilation
    	];
    }

    class PoolAnimator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			stride: 0,
    			dilation: 13,
    			kernelLength: 1,
    			image: 2,
    			output: 3,
    			isPaused: 12,
    			dataRange: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PoolAnimator",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*stride*/ ctx[0] === undefined && !("stride" in props)) {
    			console.warn("<PoolAnimator> was created without expected prop 'stride'");
    		}

    		if (/*dilation*/ ctx[13] === undefined && !("dilation" in props)) {
    			console.warn("<PoolAnimator> was created without expected prop 'dilation'");
    		}

    		if (/*kernelLength*/ ctx[1] === undefined && !("kernelLength" in props)) {
    			console.warn("<PoolAnimator> was created without expected prop 'kernelLength'");
    		}

    		if (/*image*/ ctx[2] === undefined && !("image" in props)) {
    			console.warn("<PoolAnimator> was created without expected prop 'image'");
    		}

    		if (/*output*/ ctx[3] === undefined && !("output" in props)) {
    			console.warn("<PoolAnimator> was created without expected prop 'output'");
    		}

    		if (/*isPaused*/ ctx[12] === undefined && !("isPaused" in props)) {
    			console.warn("<PoolAnimator> was created without expected prop 'isPaused'");
    		}

    		if (/*dataRange*/ ctx[4] === undefined && !("dataRange" in props)) {
    			console.warn("<PoolAnimator> was created without expected prop 'dataRange'");
    		}
    	}

    	get stride() {
    		throw new Error("<PoolAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stride(value) {
    		throw new Error("<PoolAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dilation() {
    		throw new Error("<PoolAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dilation(value) {
    		throw new Error("<PoolAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get kernelLength() {
    		throw new Error("<PoolAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kernelLength(value) {
    		throw new Error("<PoolAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get image() {
    		throw new Error("<PoolAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image(value) {
    		throw new Error("<PoolAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get output() {
    		throw new Error("<PoolAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set output(value) {
    		throw new Error("<PoolAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isPaused() {
    		throw new Error("<PoolAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isPaused(value) {
    		throw new Error("<PoolAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataRange() {
    		throw new Error("<PoolAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataRange(value) {
    		throw new Error("<PoolAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\detail-view\Poolview.svelte generated by Svelte v3.24.0 */

    const { console: console_1$2 } = globals;
    const file$e = "src\\detail-view\\Poolview.svelte";

    // (139:0) {#if !isExited}
    function create_if_block$3(ctx) {
    	let div10;
    	let div9;
    	let div5;
    	let div0;
    	let t1;
    	let div4;
    	let div1;
    	let i0;
    	let t2;
    	let div2;

    	let raw_value = (/*isPaused*/ ctx[4]
    	? "<i class=\"fas fa-play-circle play-icon\"></i>"
    	: "<i class=\"fas fa-pause-circle\"></i>") + "";

    	let t3;
    	let div3;
    	let i1;
    	let t4;
    	let div6;
    	let poolanimator;
    	let t5;
    	let div8;
    	let img;
    	let img_src_value;
    	let t6;
    	let div7;
    	let span;
    	let t8;
    	let current;
    	let mounted;
    	let dispose;

    	poolanimator = new PoolAnimator({
    			props: {
    				kernelLength: /*kernelLength*/ ctx[1],
    				image: /*input*/ ctx[0],
    				output: /*outputFinal*/ ctx[5],
    				stride: /*stride*/ ctx[6],
    				dilation: dilation$2,
    				isPaused: /*isPaused*/ ctx[4],
    				dataRange: /*dataRange*/ ctx[2]
    			},
    			$$inline: true
    		});

    	poolanimator.$on("message", /*handlePauseFromInteraction*/ ctx[8]);

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			div9 = element("div");
    			div5 = element("div");
    			div0 = element("div");
    			div0.textContent = "最大值池化";
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			i0 = element("i");
    			t2 = space();
    			div2 = element("div");
    			t3 = space();
    			div3 = element("div");
    			i1 = element("i");
    			t4 = space();
    			div6 = element("div");
    			create_component(poolanimator.$$.fragment);
    			t5 = space();
    			div8 = element("div");
    			img = element("img");
    			t6 = space();
    			div7 = element("div");
    			span = element("span");
    			span.textContent = "悬停鼠标";
    			t8 = text(" 在矩阵中来查看对应位置的计算过程.");
    			attr_dev(div0, "class", "title-text svelte-kahisg");
    			add_location(div0, file$e, 160, 8, 3757);
    			attr_dev(i0, "class", "fas fa-info-circle");
    			add_location(i0, file$e, 167, 12, 3959);
    			attr_dev(div1, "class", "control-button svelte-kahisg");
    			attr_dev(div1, "title", "Jump to article section");
    			add_location(div1, file$e, 166, 10, 3861);
    			attr_dev(div2, "class", "play-button control-button svelte-kahisg");
    			attr_dev(div2, "title", "Play animation");
    			add_location(div2, file$e, 170, 10, 4025);
    			attr_dev(i1, "class", "fas control-icon fa-times-circle");
    			add_location(i1, file$e, 177, 12, 4391);
    			attr_dev(div3, "class", "delete-button control-button svelte-kahisg");
    			attr_dev(div3, "title", "Close");
    			add_location(div3, file$e, 176, 10, 4297);
    			attr_dev(div4, "class", "buttons svelte-kahisg");
    			add_location(div4, file$e, 164, 8, 3826);
    			attr_dev(div5, "class", "control-pannel svelte-kahisg");
    			add_location(div5, file$e, 158, 6, 3711);
    			attr_dev(div6, "class", "container is-centered is-vcentered svelte-kahisg");
    			add_location(div6, file$e, 183, 6, 4499);
    			if (img.src !== (img_src_value = "/assets/img/pointer.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "pointer icon");
    			attr_dev(img, "class", "svelte-kahisg");
    			add_location(img, file$e, 191, 8, 4847);
    			set_style(span, "font-weight", "600");
    			add_location(span, file$e, 193, 12, 4966);
    			attr_dev(div7, "class", "annotation-text");
    			add_location(div7, file$e, 192, 10, 4923);
    			attr_dev(div8, "class", "annotation svelte-kahisg");
    			add_location(div8, file$e, 190, 6, 4813);
    			attr_dev(div9, "class", "box svelte-kahisg");
    			add_location(div9, file$e, 156, 4, 3684);
    			attr_dev(div10, "class", "container svelte-kahisg");
    			add_location(div10, file$e, 139, 2, 3110);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div9);
    			append_dev(div9, div5);
    			append_dev(div5, div0);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, i0);
    			append_dev(div4, t2);
    			append_dev(div4, div2);
    			div2.innerHTML = raw_value;
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div3, i1);
    			append_dev(div9, t4);
    			append_dev(div9, div6);
    			mount_component(poolanimator, div6, null);
    			append_dev(div9, t5);
    			append_dev(div9, div8);
    			append_dev(div8, img);
    			append_dev(div8, t6);
    			append_dev(div8, div7);
    			append_dev(div7, span);
    			append_dev(div7, t8);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", handleScroll$2, false, false, false),
    					listen_dev(div2, "click", /*handleClickPause*/ ctx[7], false, false, false),
    					listen_dev(div3, "click", /*handleClickX*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*isPaused*/ 16) && raw_value !== (raw_value = (/*isPaused*/ ctx[4]
    			? "<i class=\"fas fa-play-circle play-icon\"></i>"
    			: "<i class=\"fas fa-pause-circle\"></i>") + "")) div2.innerHTML = raw_value;
    			const poolanimator_changes = {};
    			if (dirty & /*kernelLength*/ 2) poolanimator_changes.kernelLength = /*kernelLength*/ ctx[1];
    			if (dirty & /*input*/ 1) poolanimator_changes.image = /*input*/ ctx[0];
    			if (dirty & /*outputFinal*/ 32) poolanimator_changes.output = /*outputFinal*/ ctx[5];
    			if (dirty & /*isPaused*/ 16) poolanimator_changes.isPaused = /*isPaused*/ ctx[4];
    			if (dirty & /*dataRange*/ 4) poolanimator_changes.dataRange = /*dataRange*/ ctx[2];
    			poolanimator.$set(poolanimator_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(poolanimator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(poolanimator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			destroy_component(poolanimator);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(139:0) {#if !isExited}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = !/*isExited*/ ctx[3] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*isExited*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isExited*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
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
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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

    const dilation$2 = 1;

    function handleScroll$2() {
    	let svgHeight = Number(d3.select("#cnn-svg").style("height").replace("px", "")) + 150;
    	let scroll = new SmoothScroll("a[href*=\"#\"]", { offset: -svgHeight });
    	let anchor = document.querySelector(`#article-pooling`);
    	scroll.animateScroll(anchor);
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { input } = $$props;
    	let { kernelLength } = $$props;
    	let { dataRange } = $$props;
    	let { isExited } = $$props;
    	const dispatch = createEventDispatcher();

    	// let isExited = false;
    	let stride = 2;

    	var isPaused = false;
    	var outputFinal = singleMaxPooling(input);

    	function handleClickPause() {
    		$$invalidate(4, isPaused = !isPaused);
    		console.log(isPaused);
    	}

    	function handlePauseFromInteraction(event) {
    		$$invalidate(4, isPaused = event.detail.text);
    	}

    	function handleClickX() {
    		dispatch("message", { text: true });
    	}

    	const writable_props = ["input", "kernelLength", "dataRange", "isExited"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<Poolview> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Poolview", $$slots, []);

    	$$self.$set = $$props => {
    		if ("input" in $$props) $$invalidate(0, input = $$props.input);
    		if ("kernelLength" in $$props) $$invalidate(1, kernelLength = $$props.kernelLength);
    		if ("dataRange" in $$props) $$invalidate(2, dataRange = $$props.dataRange);
    		if ("isExited" in $$props) $$invalidate(3, isExited = $$props.isExited);
    	};

    	$$self.$capture_state = () => ({
    		PoolAnimator,
    		singleMaxPooling,
    		createEventDispatcher,
    		input,
    		kernelLength,
    		dataRange,
    		isExited,
    		dispatch,
    		stride,
    		dilation: dilation$2,
    		isPaused,
    		outputFinal,
    		handleClickPause,
    		handlePauseFromInteraction,
    		handleClickX,
    		handleScroll: handleScroll$2
    	});

    	$$self.$inject_state = $$props => {
    		if ("input" in $$props) $$invalidate(0, input = $$props.input);
    		if ("kernelLength" in $$props) $$invalidate(1, kernelLength = $$props.kernelLength);
    		if ("dataRange" in $$props) $$invalidate(2, dataRange = $$props.dataRange);
    		if ("isExited" in $$props) $$invalidate(3, isExited = $$props.isExited);
    		if ("stride" in $$props) $$invalidate(6, stride = $$props.stride);
    		if ("isPaused" in $$props) $$invalidate(4, isPaused = $$props.isPaused);
    		if ("outputFinal" in $$props) $$invalidate(5, outputFinal = $$props.outputFinal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*input*/ 1) {
    			// let dragging = false;
    			// let dragInfo = {x1: 0, x2: 0, y1: 0, y2: 0};
    			// let detailView = d3.select('#detailview').node();
    			 if (stride > 0) {
    				try {
    					$$invalidate(5, outputFinal = singleMaxPooling(input));
    				} catch {
    					console.log("Cannot handle stride of " + stride);
    				}
    			}
    		}
    	};

    	return [
    		input,
    		kernelLength,
    		dataRange,
    		isExited,
    		isPaused,
    		outputFinal,
    		stride,
    		handleClickPause,
    		handlePauseFromInteraction,
    		handleClickX
    	];
    }

    class Poolview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			input: 0,
    			kernelLength: 1,
    			dataRange: 2,
    			isExited: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Poolview",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*input*/ ctx[0] === undefined && !("input" in props)) {
    			console_1$2.warn("<Poolview> was created without expected prop 'input'");
    		}

    		if (/*kernelLength*/ ctx[1] === undefined && !("kernelLength" in props)) {
    			console_1$2.warn("<Poolview> was created without expected prop 'kernelLength'");
    		}

    		if (/*dataRange*/ ctx[2] === undefined && !("dataRange" in props)) {
    			console_1$2.warn("<Poolview> was created without expected prop 'dataRange'");
    		}

    		if (/*isExited*/ ctx[3] === undefined && !("isExited" in props)) {
    			console_1$2.warn("<Poolview> was created without expected prop 'isExited'");
    		}
    	}

    	get input() {
    		throw new Error("<Poolview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input(value) {
    		throw new Error("<Poolview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get kernelLength() {
    		throw new Error("<Poolview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kernelLength(value) {
    		throw new Error("<Poolview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataRange() {
    		throw new Error("<Poolview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataRange(value) {
    		throw new Error("<Poolview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isExited() {
    		throw new Error("<Poolview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isExited(value) {
    		throw new Error("<Poolview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\detail-view\Softmaxview.svelte generated by Svelte v3.24.0 */
    const file$f = "src\\detail-view\\Softmaxview.svelte";

    function create_fragment$g(ctx) {
    	let div7;
    	let div6;
    	let div2;
    	let div0;
    	let i0;
    	let t0;
    	let div1;
    	let i1;
    	let t1;
    	let div3;
    	let i2;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let svg_1;
    	let t7;
    	let div5;
    	let img;
    	let img_src_value;
    	let t8;
    	let div4;
    	let span;
    	let t10;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div6 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			i0 = element("i");
    			t0 = space();
    			div1 = element("div");
    			i1 = element("i");
    			t1 = space();
    			div3 = element("div");
    			i2 = element("i");
    			t2 = text("\"");
    			t3 = text(/*outputName*/ ctx[0]);
    			t4 = text("\"");
    			t5 = text(" 的Softmax概率结果");
    			t6 = space();
    			svg_1 = svg_element("svg");
    			t7 = space();
    			div5 = element("div");
    			img = element("img");
    			t8 = space();
    			div4 = element("div");
    			span = element("span");
    			span.textContent = "悬停鼠标";
    			t10 = text(" 高亮对应值的计算路径.");
    			attr_dev(i0, "class", "fas fa-info-circle");
    			add_location(i0, file$f, 261, 8, 7124);
    			attr_dev(div0, "class", "control-button svelte-1uac4ng");
    			attr_dev(div0, "title", "Jump to article section");
    			add_location(div0, file$f, 260, 6, 7030);
    			attr_dev(i1, "class", "fas control-icon fa-times-circle");
    			add_location(i1, file$f, 265, 8, 7272);
    			attr_dev(div1, "class", "delete-button control-button svelte-1uac4ng");
    			attr_dev(div1, "title", "Close");
    			add_location(div1, file$f, 264, 6, 7182);
    			attr_dev(div2, "class", "buttons svelte-1uac4ng");
    			add_location(div2, file$f, 259, 4, 7001);
    			add_location(i2, file$f, 270, 6, 7386);
    			attr_dev(div3, "class", "title-text svelte-1uac4ng");
    			add_location(div3, file$f, 269, 4, 7354);
    			attr_dev(svg_1, "id", "softmax-svg");
    			attr_dev(svg_1, "width", "470");
    			attr_dev(svg_1, "height", "105");
    			attr_dev(svg_1, "class", "svelte-1uac4ng");
    			add_location(svg_1, file$f, 273, 4, 7440);
    			if (img.src !== (img_src_value = "/assets/img/pointer.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "pointer icon");
    			attr_dev(img, "class", "svelte-1uac4ng");
    			add_location(img, file$f, 276, 6, 7528);
    			set_style(span, "font-weight", "600");
    			add_location(span, file$f, 278, 8, 7639);
    			attr_dev(div4, "class", "annotation-text");
    			add_location(div4, file$f, 277, 6, 7600);
    			attr_dev(div5, "class", "annotation svelte-1uac4ng");
    			add_location(div5, file$f, 275, 4, 7496);
    			attr_dev(div6, "class", "box svelte-1uac4ng");
    			add_location(div6, file$f, 257, 2, 6976);
    			attr_dev(div7, "class", "container");
    			add_location(div7, file$f, 256, 0, 6916);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div6);
    			append_dev(div6, div2);
    			append_dev(div2, div0);
    			append_dev(div0, i0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, i1);
    			append_dev(div6, t1);
    			append_dev(div6, div3);
    			append_dev(div3, i2);
    			append_dev(i2, t2);
    			append_dev(i2, t3);
    			append_dev(i2, t4);
    			append_dev(div3, t5);
    			append_dev(div6, t6);
    			append_dev(div6, svg_1);
    			append_dev(div6, t7);
    			append_dev(div6, div5);
    			append_dev(div5, img);
    			append_dev(div5, t8);
    			append_dev(div5, div4);
    			append_dev(div4, span);
    			append_dev(div4, t10);
    			/*div7_binding*/ ctx[9](div7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", handleScroll$3, false, false, false),
    					listen_dev(div1, "click", /*handleClickX*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*outputName*/ 1) set_data_dev(t3, /*outputName*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			/*div7_binding*/ ctx[9](null);
    			mounted = false;
    			run_all(dispose);
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

    function handleScroll$3() {
    	let svgHeight = Number(d3.select("#cnn-svg").style("height").replace("px", "")) + 150;
    	let scroll = new SmoothScroll("a[href*=\"#\"]", { offset: -svgHeight });
    	let anchor = document.querySelector(`#article-softmax`);
    	scroll.animateScroll(anchor);
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { logits } = $$props;
    	let { logitColors } = $$props;
    	let { selectedI } = $$props;
    	let { highlightI = -1 } = $$props;
    	let { outputName } = $$props;
    	let { outputValue } = $$props;
    	let { startAnimation } = $$props;
    	let softmaxViewComponent;
    	let svg = null;
    	const dispatch = createEventDispatcher();

    	const formater = (n, d) => {
    		if (d === undefined) {
    			return d3.format(".2f")(n);
    		} else {
    			return d3.format(`.${d}f`)(n);
    		}
    	};

    	const mouseOverHandler = (d, i, g, curI) => {
    		$$invalidate(3, highlightI = curI);
    		dispatch("mouseOver", { curI });
    	};

    	const mouseLeaveHandler = (d, i, g, curI) => {
    		$$invalidate(3, highlightI = -1);
    		dispatch("mouseLeave", { curI });
    	};

    	const handleClickX = () => {
    		dispatch("xClicked", {});
    	};

    	onMount(() => {
    		$$invalidate(10, svg = d3.select(softmaxViewComponent).select("#softmax-svg"));
    		let formulaRightGroup = svg.append("g").attr("class", "formula-right").attr("transform", `translate(${10}, ${0})`).style("font-size", "15px");

    		// Denominator
    		let denominatorGroup = formulaRightGroup.append("g").attr("class", "denominator").attr("transform", `translate(${0}, ${58})`);

    		// Add the left (
    		denominatorGroup.append("text").attr("x", 0).attr("y", 0).style("fill", "gray").text("(");

    		// Need to loop through the logits array instead of data-binding because
    		// we want dynamic positioning based on prior '-' occurance
    		let curX = 8;

    		let numOfRows = 4;

    		logits.forEach((d, i) => {
    			if (i / numOfRows >= 1 && i % numOfRows === 0) {
    				curX = 8;
    			}

    			let curText = denominatorGroup.append("text").attr("x", curX).attr("y", Math.floor(i / numOfRows) * 20).style("cursor", "crosshair").style("pointer-events", "all").on("mouseover", (d, n, g) => mouseOverHandler(d, n, g, i)).on("mouseleave", (d, n, g) => mouseLeaveHandler(d, n, g, i)).text(`exp(`);
    			curText.append("tspan").attr("class", `formula-term-${i} formula-term`).attr("dx", "1").style("fill", logitColors[i]).style("fill-opacity", i === selectedI || startAnimation.hasInitialized ? 1 : 0).text(formater(d));
    			curText.append("tspan").attr("dx", "1").text(")");
    			let curBBox = curText.node().getBBox();
    			curX += curBBox.width + 4;

    			if (i !== logits.length - 1) {
    				denominatorGroup.append("text").attr("x", curX).attr("y", Math.floor(i / numOfRows) * 20).text("+");
    				curX += 14;
    			} else {
    				denominatorGroup.append("text").attr("x", curX - 2).attr("y", Math.floor(i / numOfRows) * 20).style("fill", "gray").text(")");
    			}
    		});

    		denominatorGroup.selectAll("text").data(logits).enter().append("text").attr("x", (d, i) => 40 * i).attr("y", 0).text(d => formater(d));

    		// Calculate the dynamic denominator group width
    		let denominatorGroupBBox = denominatorGroup.node().getBBox();

    		// Draw the fraction line
    		formulaRightGroup.append("line").attr("class", "separation-line").attr("x1", -5).attr("x2", denominatorGroupBBox.width + 5).attr("y1", 32).attr("y2", 32).style("stroke-width", 1.2).style("stroke", "gray");

    		// Draw the numerator
    		let numeratorGroup = formulaRightGroup.append("g").attr("class", "numerator-group").attr("transform", `translate(${0}, ${20})`);

    		let numeratorText = numeratorGroup.append("text").attr("x", denominatorGroupBBox.x + denominatorGroupBBox.width / 2).attr("y", 0).on("mouseover", (d, n, g) => mouseOverHandler(d, n, g, selectedI)).on("mouseleave", (d, n, g) => mouseLeaveHandler(d, n, g, selectedI)).style("pointer-events", "all").style("cursor", "crosshair").style("text-anchor", "middle").text("exp(");
    		numeratorText.append("tspan").attr("class", `formula-term-${selectedI} formula-term`).attr("dx", 1).style("fill", logitColors[selectedI]).text(`${formater(logits[selectedI])}`);
    		numeratorText.append("tspan").attr("dx", 1).text(")");

    		// Draw the left part of the formula
    		let formulaLeftGroup = svg.append("g").attr("class", "formula-left").attr("transform", `translate(${395}, ${32})`);

    		let softmaxText = formulaLeftGroup.append("text").attr("x", 20).attr("dominant-baseline", "middle").text(`${formater(outputValue, 4)}`);
    		let softmaxTextBBox = softmaxText.node().getBBox();
    		formulaLeftGroup.append("text").attr("dominant-baseline", "middle").attr("x", 0).attr("y", 0).style("fill", "gray").style("font-weight", "bold").text("=");
    	});

    	const writable_props = [
    		"logits",
    		"logitColors",
    		"selectedI",
    		"highlightI",
    		"outputName",
    		"outputValue",
    		"startAnimation"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Softmaxview> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Softmaxview", $$slots, []);

    	function div7_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			softmaxViewComponent = $$value;
    			$$invalidate(1, softmaxViewComponent);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("logits" in $$props) $$invalidate(4, logits = $$props.logits);
    		if ("logitColors" in $$props) $$invalidate(5, logitColors = $$props.logitColors);
    		if ("selectedI" in $$props) $$invalidate(6, selectedI = $$props.selectedI);
    		if ("highlightI" in $$props) $$invalidate(3, highlightI = $$props.highlightI);
    		if ("outputName" in $$props) $$invalidate(0, outputName = $$props.outputName);
    		if ("outputValue" in $$props) $$invalidate(7, outputValue = $$props.outputValue);
    		if ("startAnimation" in $$props) $$invalidate(8, startAnimation = $$props.startAnimation);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		afterUpdate,
    		createEventDispatcher,
    		logits,
    		logitColors,
    		selectedI,
    		highlightI,
    		outputName,
    		outputValue,
    		startAnimation,
    		softmaxViewComponent,
    		svg,
    		dispatch,
    		formater,
    		mouseOverHandler,
    		mouseLeaveHandler,
    		handleClickX,
    		handleScroll: handleScroll$3
    	});

    	$$self.$inject_state = $$props => {
    		if ("logits" in $$props) $$invalidate(4, logits = $$props.logits);
    		if ("logitColors" in $$props) $$invalidate(5, logitColors = $$props.logitColors);
    		if ("selectedI" in $$props) $$invalidate(6, selectedI = $$props.selectedI);
    		if ("highlightI" in $$props) $$invalidate(3, highlightI = $$props.highlightI);
    		if ("outputName" in $$props) $$invalidate(0, outputName = $$props.outputName);
    		if ("outputValue" in $$props) $$invalidate(7, outputValue = $$props.outputValue);
    		if ("startAnimation" in $$props) $$invalidate(8, startAnimation = $$props.startAnimation);
    		if ("softmaxViewComponent" in $$props) $$invalidate(1, softmaxViewComponent = $$props.softmaxViewComponent);
    		if ("svg" in $$props) $$invalidate(10, svg = $$props.svg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*highlightI, svg*/ 1032) {
    			 ((() => {
    				if (svg !== null) {
    					svg.selectAll(`.formula-term`).style("text-decoration", "none").style("font-weight", "normal");
    					svg.selectAll(`.formula-term-${highlightI}`).style("font-weight", "bold").style("text-decoration", "underline");
    				}
    			})());
    		}

    		if ($$self.$$.dirty & /*startAnimation, svg*/ 1280) {
    			 ((() => {
    				if (svg !== null) {
    					svg.select(`.formula-term-${startAnimation.i}`).transition("softmax-edge").duration(startAnimation.duration).style("fill-opacity", 1);
    				}
    			})());
    		}
    	};

    	return [
    		outputName,
    		softmaxViewComponent,
    		handleClickX,
    		highlightI,
    		logits,
    		logitColors,
    		selectedI,
    		outputValue,
    		startAnimation,
    		div7_binding
    	];
    }

    class Softmaxview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			logits: 4,
    			logitColors: 5,
    			selectedI: 6,
    			highlightI: 3,
    			outputName: 0,
    			outputValue: 7,
    			startAnimation: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Softmaxview",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*logits*/ ctx[4] === undefined && !("logits" in props)) {
    			console.warn("<Softmaxview> was created without expected prop 'logits'");
    		}

    		if (/*logitColors*/ ctx[5] === undefined && !("logitColors" in props)) {
    			console.warn("<Softmaxview> was created without expected prop 'logitColors'");
    		}

    		if (/*selectedI*/ ctx[6] === undefined && !("selectedI" in props)) {
    			console.warn("<Softmaxview> was created without expected prop 'selectedI'");
    		}

    		if (/*outputName*/ ctx[0] === undefined && !("outputName" in props)) {
    			console.warn("<Softmaxview> was created without expected prop 'outputName'");
    		}

    		if (/*outputValue*/ ctx[7] === undefined && !("outputValue" in props)) {
    			console.warn("<Softmaxview> was created without expected prop 'outputValue'");
    		}

    		if (/*startAnimation*/ ctx[8] === undefined && !("startAnimation" in props)) {
    			console.warn("<Softmaxview> was created without expected prop 'startAnimation'");
    		}
    	}

    	get logits() {
    		throw new Error("<Softmaxview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set logits(value) {
    		throw new Error("<Softmaxview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get logitColors() {
    		throw new Error("<Softmaxview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set logitColors(value) {
    		throw new Error("<Softmaxview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedI() {
    		throw new Error("<Softmaxview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedI(value) {
    		throw new Error("<Softmaxview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get highlightI() {
    		throw new Error("<Softmaxview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set highlightI(value) {
    		throw new Error("<Softmaxview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outputName() {
    		throw new Error("<Softmaxview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outputName(value) {
    		throw new Error("<Softmaxview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outputValue() {
    		throw new Error("<Softmaxview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outputValue(value) {
    		throw new Error("<Softmaxview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get startAnimation() {
    		throw new Error("<Softmaxview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set startAnimation(value) {
    		throw new Error("<Softmaxview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\overview\Modal.svelte generated by Svelte v3.24.0 */
    const file$g = "src\\overview\\Modal.svelte";

    function create_fragment$h(ctx) {
    	let div9;
    	let div8;
    	let div0;
    	let t0;
    	let div7;
    	let header;
    	let p;
    	let t2;
    	let button0;
    	let t3;
    	let section;
    	let div4;
    	let div1;
    	let input0;
    	let t4;
    	let span0;
    	let i0;
    	let t5;
    	let div2;
    	let t7;
    	let div3;
    	let label;
    	let input1;
    	let t8;
    	let span3;
    	let span1;
    	let i1;
    	let t9;
    	let span2;
    	let t11;
    	let footer;
    	let div5;
    	let t12_value = /*errorInfo*/ ctx[5].error + "";
    	let t12;
    	let t13;
    	let div6;
    	let button1;
    	let t15;
    	let button2;
    	let t17;
    	let img;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div8 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div7 = element("div");
    			header = element("header");
    			p = element("p");
    			p.textContent = "自定义输入图片";
    			t2 = space();
    			button0 = element("button");
    			t3 = space();
    			section = element("section");
    			div4 = element("div");
    			div1 = element("div");
    			input0 = element("input");
    			t4 = space();
    			span0 = element("span");
    			i0 = element("i");
    			t5 = space();
    			div2 = element("div");
    			div2.textContent = "or";
    			t7 = space();
    			div3 = element("div");
    			label = element("label");
    			input1 = element("input");
    			t8 = space();
    			span3 = element("span");
    			span1 = element("span");
    			i1 = element("i");
    			t9 = space();
    			span2 = element("span");
    			span2.textContent = "上传图片";
    			t11 = space();
    			footer = element("footer");
    			div5 = element("div");
    			t12 = text(t12_value);
    			t13 = space();
    			div6 = element("div");
    			button1 = element("button");
    			button1.textContent = "取消";
    			t15 = space();
    			button2 = element("button");
    			button2.textContent = "确定";
    			t17 = space();
    			img = element("img");
    			attr_dev(div0, "class", "modal-background");
    			add_location(div0, file$g, 151, 4, 3439);
    			attr_dev(p, "class", "modal-card-title svelte-1o5lxfe");
    			add_location(p, file$g, 155, 8, 3581);
    			attr_dev(button0, "class", "delete");
    			attr_dev(button0, "aria-label", "close");
    			add_location(button0, file$g, 156, 8, 3630);
    			attr_dev(header, "class", "modal-card-head svelte-1o5lxfe");
    			add_location(header, file$g, 154, 6, 3539);
    			attr_dev(input0, "class", "input small-font svelte-1o5lxfe");
    			attr_dev(input0, "type", "url");
    			attr_dev(input0, "placeholder", "输入图片的网址链接...");
    			add_location(input0, file$g, 164, 12, 3902);
    			attr_dev(i0, "class", "fas fa-link");
    			add_location(i0, file$g, 169, 14, 4096);
    			attr_dev(span0, "class", "icon small-font is-left svelte-1o5lxfe");
    			add_location(span0, file$g, 168, 12, 4042);
    			attr_dev(div1, "class", "control has-icons-left svelte-1o5lxfe");
    			toggle_class(div1, "is-loading", /*showLoading*/ ctx[3]);
    			add_location(div1, file$g, 161, 10, 3806);
    			attr_dev(div2, "class", "or-label svelte-1o5lxfe");
    			add_location(div2, file$g, 174, 10, 4178);
    			attr_dev(input1, "class", "file-input");
    			attr_dev(input1, "type", "file");
    			attr_dev(input1, "name", "image");
    			attr_dev(input1, "accept", ".png,.jpeg,.tiff,.jpg,.png");
    			add_location(input1, file$g, 178, 14, 4296);
    			attr_dev(i1, "class", "fas fa-upload");
    			add_location(i1, file$g, 184, 18, 4589);
    			attr_dev(span1, "class", "file-icon");
    			add_location(span1, file$g, 183, 16, 4545);
    			attr_dev(span2, "class", "file-label");
    			add_location(span2, file$g, 186, 16, 4661);
    			attr_dev(span3, "class", "file-cta small-font svelte-1o5lxfe");
    			add_location(span3, file$g, 182, 14, 4493);
    			attr_dev(label, "class", "file-label");
    			add_location(label, file$g, 177, 12, 4254);
    			attr_dev(div3, "class", "file");
    			add_location(div3, file$g, 176, 10, 4222);
    			attr_dev(div4, "class", "field svelte-1o5lxfe");
    			add_location(div4, file$g, 160, 8, 3775);
    			attr_dev(section, "class", "modal-card-body");
    			add_location(section, file$g, 159, 6, 3732);
    			attr_dev(div5, "class", "error-message svelte-1o5lxfe");
    			toggle_class(div5, "hidden", !/*errorInfo*/ ctx[5].show);
    			add_location(div5, file$g, 199, 8, 4890);
    			attr_dev(button1, "class", "button is-smaller svelte-1o5lxfe");
    			add_location(button1, file$g, 205, 10, 5058);
    			attr_dev(button2, "class", "button is-success is-smaller svelte-1o5lxfe");
    			add_location(button2, file$g, 210, 10, 5180);
    			attr_dev(div6, "class", "button-container");
    			add_location(div6, file$g, 204, 8, 5016);
    			attr_dev(footer, "class", "modal-card-foot svelte-1o5lxfe");
    			add_location(footer, file$g, 197, 6, 4846);
    			attr_dev(div7, "class", "modal-card svelte-1o5lxfe");
    			add_location(div7, file$g, 153, 4, 3507);
    			attr_dev(div8, "class", "modal");
    			attr_dev(div8, "id", "input-modal");
    			toggle_class(div8, "is-active", /*modalInfo*/ ctx[6].show);
    			add_location(div8, file$g, 147, 2, 3352);
    			set_style(img, "display", "none");
    			attr_dev(img, "id", "vali-image");
    			attr_dev(img, "alt", "hidden image");
    			add_location(img, file$g, 223, 2, 5435);
    			attr_dev(div9, "class", "modal-component");
    			add_location(div9, file$g, 144, 0, 3287);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div8);
    			append_dev(div8, div0);
    			append_dev(div8, t0);
    			append_dev(div8, div7);
    			append_dev(div7, header);
    			append_dev(header, p);
    			append_dev(header, t2);
    			append_dev(header, button0);
    			append_dev(div7, t3);
    			append_dev(div7, section);
    			append_dev(section, div4);
    			append_dev(div4, div1);
    			append_dev(div1, input0);
    			set_input_value(input0, /*inputValue*/ ctx[2]);
    			append_dev(div1, t4);
    			append_dev(div1, span0);
    			append_dev(span0, i0);
    			append_dev(div4, t5);
    			append_dev(div4, div2);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			append_dev(div3, label);
    			append_dev(label, input1);
    			append_dev(label, t8);
    			append_dev(label, span3);
    			append_dev(span3, span1);
    			append_dev(span1, i1);
    			append_dev(span3, t9);
    			append_dev(span3, span2);
    			append_dev(div7, t11);
    			append_dev(div7, footer);
    			append_dev(footer, div5);
    			append_dev(div5, t12);
    			append_dev(footer, t13);
    			append_dev(footer, div6);
    			append_dev(div6, button1);
    			append_dev(div6, t15);
    			append_dev(div6, button2);
    			append_dev(div9, t17);
    			append_dev(div9, img);
    			/*img_binding*/ ctx[14](img);
    			/*div9_binding*/ ctx[15](div9);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*crossClicked*/ ctx[10], false, false, false),
    					listen_dev(button0, "click", /*crossClicked*/ ctx[10], false, false, false),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[12]),
    					listen_dev(input1, "change", /*imageUpload*/ ctx[9], false, false, false),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[13]),
    					listen_dev(button1, "click", /*crossClicked*/ ctx[10], false, false, false),
    					listen_dev(button2, "click", /*addClicked*/ ctx[11], false, false, false),
    					listen_dev(img, "error", /*errorCallback*/ ctx[7], false, false, false),
    					listen_dev(img, "load", /*loadCallback*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*inputValue*/ 4) {
    				set_input_value(input0, /*inputValue*/ ctx[2]);
    			}

    			if (dirty & /*showLoading*/ 8) {
    				toggle_class(div1, "is-loading", /*showLoading*/ ctx[3]);
    			}

    			if (dirty & /*errorInfo*/ 32 && t12_value !== (t12_value = /*errorInfo*/ ctx[5].error + "")) set_data_dev(t12, t12_value);

    			if (dirty & /*errorInfo*/ 32) {
    				toggle_class(div5, "hidden", !/*errorInfo*/ ctx[5].show);
    			}

    			if (dirty & /*modalInfo*/ 64) {
    				toggle_class(div8, "is-active", /*modalInfo*/ ctx[6].show);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			/*img_binding*/ ctx[14](null);
    			/*div9_binding*/ ctx[15](null);
    			mounted = false;
    			run_all(dispose);
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

    function instance$h($$self, $$props, $$invalidate) {
    	let modalComponent;
    	let valiImg;
    	let inputValue = "";
    	let showLoading = false;
    	let files;
    	let usingURL = true;
    	let errorInfo = { show: false, error: "" };
    	const dispatch = createEventDispatcher();
    	let modalInfo = { show: false };
    	modalStore.set(modalInfo);

    	modalStore.subscribe(value => {
    		$$invalidate(6, modalInfo = value);
    	});

    	const errorCallback = () => {
    		// The URL is invalid, show an error message on the UI
    		$$invalidate(3, showLoading = false);

    		$$invalidate(5, errorInfo.show = true, errorInfo);

    		$$invalidate(
    			5,
    			errorInfo.error = usingURL
    			? "We can't find the image at that URL."
    			: "Not a valid image file.",
    			errorInfo
    		);
    	};

    	const loadCallback = () => {
    		// The URL is valid, but we are not sure if loading it to canvas would be
    		// blocked by crossOrigin setting. Try it here before dispatch to parent.
    		// https://stackoverflow.com/questions/13674835/canvas-tainted-by-cross-origin-data
    		let canvas = document.createElement("canvas");

    		let context = canvas.getContext("2d");
    		canvas.width = valiImg.width;
    		canvas.height = valiImg.height;
    		context.drawImage(valiImg, 0, 0);

    		try {
    			context.getImageData(0, 0, valiImg.width, valiImg.height);

    			// If the foreign image does support CORS -> use this image
    			// dispatch to parent component to use the input image
    			$$invalidate(3, showLoading = false);

    			$$invalidate(6, modalInfo.show = false, modalInfo);
    			modalStore.set(modalInfo);
    			dispatch("urlTyped", { url: valiImg.src });
    			$$invalidate(2, inputValue = null);
    		} catch(err) {
    			// If the foreign image does not support CORS -> use this image
    			$$invalidate(3, showLoading = false);

    			$$invalidate(5, errorInfo.show = true, errorInfo);
    			$$invalidate(5, errorInfo.error = "No permission to load this image.", errorInfo);
    		}
    	};

    	const imageUpload = () => {
    		usingURL = false;
    		let reader = new FileReader();

    		reader.onload = event => {
    			$$invalidate(1, valiImg.src = event.target.result, valiImg);
    		};

    		reader.readAsDataURL(files[0]);
    	};

    	const crossClicked = () => {
    		$$invalidate(6, modalInfo.show = false, modalInfo);
    		modalStore.set(modalInfo);

    		// Dispatch the parent component
    		dispatch("xClicked", { preImage: modalInfo.preImage });
    	};

    	const addClicked = () => {
    		// Validate the input URL
    		$$invalidate(3, showLoading = true);

    		$$invalidate(5, errorInfo.show = false, errorInfo);
    		$$invalidate(1, valiImg.crossOrigin = "Anonymous", valiImg);
    		$$invalidate(1, valiImg.src = inputValue, valiImg);
    	};

    	onMount(() => {
    		let modal = d3.select(modalComponent).select("#input-modal");
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Modal", $$slots, []);

    	function input0_input_handler() {
    		inputValue = this.value;
    		$$invalidate(2, inputValue);
    	}

    	function input1_change_handler() {
    		files = this.files;
    		$$invalidate(4, files);
    	}

    	function img_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			valiImg = $$value;
    			$$invalidate(1, valiImg);
    		});
    	}

    	function div9_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			modalComponent = $$value;
    			$$invalidate(0, modalComponent);
    		});
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		createEventDispatcher,
    		modalStore,
    		modalComponent,
    		valiImg,
    		inputValue,
    		showLoading,
    		files,
    		usingURL,
    		errorInfo,
    		dispatch,
    		modalInfo,
    		errorCallback,
    		loadCallback,
    		imageUpload,
    		crossClicked,
    		addClicked
    	});

    	$$self.$inject_state = $$props => {
    		if ("modalComponent" in $$props) $$invalidate(0, modalComponent = $$props.modalComponent);
    		if ("valiImg" in $$props) $$invalidate(1, valiImg = $$props.valiImg);
    		if ("inputValue" in $$props) $$invalidate(2, inputValue = $$props.inputValue);
    		if ("showLoading" in $$props) $$invalidate(3, showLoading = $$props.showLoading);
    		if ("files" in $$props) $$invalidate(4, files = $$props.files);
    		if ("usingURL" in $$props) usingURL = $$props.usingURL;
    		if ("errorInfo" in $$props) $$invalidate(5, errorInfo = $$props.errorInfo);
    		if ("modalInfo" in $$props) $$invalidate(6, modalInfo = $$props.modalInfo);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		modalComponent,
    		valiImg,
    		inputValue,
    		showLoading,
    		files,
    		errorInfo,
    		modalInfo,
    		errorCallback,
    		loadCallback,
    		imageUpload,
    		crossClicked,
    		addClicked,
    		input0_input_handler,
    		input1_change_handler,
    		img_binding,
    		div9_binding
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src\article\Article.svelte generated by Svelte v3.24.0 */

    const file$h = "src\\article\\Article.svelte";

    function create_fragment$i(ctx) {
    	let body;
    	let div3;
    	let div0;
    	let h2;
    	let strong0;
    	let t1;
    	let p0;
    	let strong1;
    	let t3;
    	let p1;
    	let strong2;
    	let t5;
    	let h30;
    	let t7;
    	let p2;
    	let t8;
    	let em;
    	let t10;
    	let t11;
    	let p3;
    	let t13;
    	let ol;
    	let li0;
    	let strong3;
    	let t15;
    	let t16;
    	let li1;
    	let strong4;
    	let t18;
    	let t19;
    	let li2;
    	let strong5;
    	let t21;
    	let t22;
    	let li3;
    	let strong6;
    	let t24;
    	let t25;
    	let h31;
    	let t27;
    	let h40;
    	let t29;
    	let p4;
    	let t31;
    	let h41;
    	let t33;
    	let p5;
    	let t35;
    	let p6;
    	let t37;
    	let div2;
    	let img;
    	let img_src_value;
    	let t38;
    	let div1;
    	let t40;
    	let h42;
    	let t42;
    	let p7;
    	let t44;
    	let p8;
    	let t46;
    	let h43;
    	let t48;
    	let p9;
    	let t50;
    	let h44;
    	let t52;
    	let p10;
    	let t54;
    	let p11;

    	const block = {
    		c: function create() {
    			body = element("body");
    			div3 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			strong0 = element("strong");
    			strong0.textContent = "Section: 卷积神经网络";
    			t1 = space();
    			p0 = element("p");
    			strong1 = element("strong");
    			strong1.textContent = "几天之后一个周末，你的同学来你家里玩。听说你实现了一个能够自动识别鸢尾花品种的识别程序，他十分感兴趣，于是在手机中找出了一张之前在郊外拍摄到的一张鸢尾花照片，问你的软件能不能识别照片中的鸢尾花\r\n            品种。这就让你犯了难了，之前你都是通过实地测量出鸢尾花的花瓣花萼的长宽等特征来输入网络中进行分类，而现在仅仅只有一张照片，从照片中测量得到的长宽也一定与实际相差甚远，如何通过图像来识别鸢尾花\r\n            的品种，这又让你找到了一个新的挑战。";
    			t3 = space();
    			p1 = element("p");
    			strong2 = element("strong");
    			strong2.textContent = "经过网络上的一番资料查阅，你发现当今的人工智能技术已经能够识别图像中物体的种类，而这些人工智能使用的技术是一个叫做卷积神经网络的网络结构。于是你决定尝试一下使用卷积神经网络来对图片中的鸢尾花进行分类。";
    			t5 = space();
    			h30 = element("h3");
    			h30.textContent = "什么是卷积神经网络？";
    			t7 = space();
    			p2 = element("p");
    			t8 = text("在机器学习中，往往都是从输入的特征中找到不同类别之间的区别从而进行分类。而与之前用测量的鸢尾花数据作为输入不同，这次我们的输入是一张图片。这时候，使用一个 ");
    			em = element("em");
    			em.textContent = "卷积神经网络";
    			t10 = text("，或简称为CNN，是一种非常适合解决这种问题类型的分类器！");
    			t11 = space();
    			p3 = element("p");
    			p3.textContent = "与之前的神经网络相似，CNN也是从输入中找到具有代表性的特征，从而能够区分不同的图片类型，只不过它的网络会更加复杂一些，也多了一些特殊的层，总的来说它有以下几种关键构造：";
    			t13 = space();
    			ol = element("ol");
    			li0 = element("li");
    			strong3 = element("strong");
    			strong3.textContent = "输入：";
    			t15 = text(" 之前网络的输入往往是一组代表不同特征的数字，而在计算机中我们往往使用一个m×n的矩阵来代表一张图片，在CNN中便是已这个矩阵作为输入。");
    			t16 = space();
    			li1 = element("li");
    			strong4 = element("strong");
    			strong4.textContent = "神经元：";
    			t18 = text(" 与普通的神经网络相似，每个神经元都代表了前一层的输出通过一次函数计算得到的一个新的代表隐含的特征的值。");
    			t19 = space();
    			li2 = element("li");
    			strong5 = element("strong");
    			strong5.textContent = "层：";
    			t21 = text(" 每次使用相同的操作处理一组神经元，得到一组新的神经元的这个操作阶段叫做一层。");
    			t22 = space();
    			li3 = element("li");
    			strong6 = element("strong");
    			strong6.textContent = "内核权重和偏差：";
    			t24 = text("如图神经网络一样，在CNN中也是通过将输入与内核权重及偏差做函数计算来得到新的输出。");
    			t25 = space();
    			h31 = element("h3");
    			h31.textContent = "CNN中不同层的作用";
    			t27 = space();
    			h40 = element("h4");
    			h40.textContent = "输入层";
    			t29 = space();
    			p4 = element("p");
    			p4.textContent = "输入层（最左边的层）代表输入到CNN中的图像。因为我们使用RGB图像作为输入，所以输入层具有三个通道，分别对应于该层中显示的红色，绿色和蓝色通道。";
    			t31 = space();
    			h41 = element("h4");
    			h41.textContent = "卷积层";
    			t33 = space();
    			p5 = element("p");
    			p5.textContent = "卷积层是CNN的基础，因为它们包含可学习的内核（权重），这些内核提取出可将不同图像彼此区分开的特征-这就是我们想要的分类";
    			t35 = space();
    			p6 = element("p");
    			p6.textContent = "如图1所示卷积过程是将内核中的参数与输入中对应大小的参数一一对应进行相乘再求和后得到一个对应该输入位置的结果，通过滑动改变内核相对应的位置，来得到右侧的输出。";
    			t37 = space();
    			div2 = element("div");
    			img = element("img");
    			t38 = space();
    			div1 = element("div");
    			div1.textContent = "图1:卷积层的计算过程。一个3×3的卷积核，通过在左侧滑动位置，逐个计算出对应位置的结果，最终得到右侧的输出。";
    			t40 = space();
    			h42 = element("h4");
    			h42.textContent = "池化层";
    			t42 = space();
    			p7 = element("p");
    			p7.textContent = "在不同的CNN架构中，池化层的类型很多，但是它们的目的都是要逐渐减小网络的空间范围，从而减少网络的参数和总体计算。";
    			t44 = space();
    			p8 = element("p");
    			p8.textContent = "最大池操作需要在体系结构设计期间选择内核大小和步幅长度。选择后，该操作将以指定的步幅在输入上滑动内核，同时仅从输入中选择每个内核切片上的最大值以产生输出值。";
    			t46 = space();
    			h43 = element("h4");
    			h43.textContent = "Softmax函数";
    			t48 = space();
    			p9 = element("p");
    			p9.textContent = "softmax操作的主要作用是：确保CNN输出总和为1。因此，softmax操作可用于将模型输出缩放为概率。";
    			t50 = space();
    			h44 = element("h4");
    			h44.textContent = "尝试一下";
    			t52 = space();
    			p10 = element("p");
    			p10.textContent = "通过学习卷积网络的基本概念，你了解到CNN通过卷积层从图像中提取出局部特征，从而能够让网络学会“看”图。比起之前使用的网络需要提供人工选定的特征，CNN只需要输入一张图片，这无疑减少了许多的前期准备的工作量。";
    			t54 = space();
    			p11 = element("p");
    			p11.textContent = "CNN的优势及其它的独特之处使你对它的原理构造更加的感兴趣了。经过一番努力之后，你终于实现了一个简单的CNN来用于分类鸢尾花的种类。而现在有三个不同品种的鸢尾花图像测试样本，来看看CNN是如何分辨出它是哪一个品种的鸢尾花的吧！";
    			add_location(strong0, file$h, 76, 22, 1197);
    			attr_dev(h2, "class", "svelte-15r57m9");
    			add_location(h2, file$h, 76, 18, 1193);
    			attr_dev(div0, "id", "One");
    			attr_dev(div0, "class", "svelte-15r57m9");
    			add_location(div0, file$h, 76, 4, 1179);
    			add_location(strong1, file$h, 78, 8, 1259);
    			attr_dev(p0, "class", "svelte-15r57m9");
    			add_location(p0, file$h, 77, 4, 1246);
    			add_location(strong2, file$h, 85, 8, 1568);
    			attr_dev(p1, "class", "svelte-15r57m9");
    			add_location(p1, file$h, 84, 6, 1555);
    			attr_dev(h30, "class", "svelte-15r57m9");
    			add_location(h30, file$h, 89, 4, 1725);
    			add_location(em, file$h, 91, 80, 1835);
    			attr_dev(p2, "class", "svelte-15r57m9");
    			add_location(p2, file$h, 90, 4, 1750);
    			attr_dev(p3, "class", "svelte-15r57m9");
    			add_location(p3, file$h, 93, 3, 1892);
    			add_location(strong3, file$h, 97, 8, 2014);
    			attr_dev(li0, "class", "svelte-15r57m9");
    			add_location(li0, file$h, 97, 4, 2010);
    			add_location(strong4, file$h, 98, 8, 2117);
    			attr_dev(li1, "class", "svelte-15r57m9");
    			add_location(li1, file$h, 98, 4, 2113);
    			add_location(strong5, file$h, 99, 8, 2205);
    			attr_dev(li2, "class", "svelte-15r57m9");
    			add_location(li2, file$h, 99, 4, 2201);
    			add_location(strong6, file$h, 100, 8, 2278);
    			attr_dev(li3, "class", "svelte-15r57m9");
    			add_location(li3, file$h, 100, 4, 2274);
    			attr_dev(ol, "class", "svelte-15r57m9");
    			add_location(ol, file$h, 96, 3, 2000);
    			attr_dev(h31, "class", "svelte-15r57m9");
    			add_location(h31, file$h, 103, 6, 2372);
    			attr_dev(h40, "id", "article-input");
    			attr_dev(h40, "class", "svelte-15r57m9");
    			add_location(h40, file$h, 104, 6, 2399);
    			attr_dev(p4, "class", "svelte-15r57m9");
    			add_location(p4, file$h, 105, 6, 2439);
    			attr_dev(h41, "id", "article-convolution");
    			attr_dev(h41, "class", "svelte-15r57m9");
    			add_location(h41, file$h, 108, 6, 2543);
    			attr_dev(p5, "class", "svelte-15r57m9");
    			add_location(p5, file$h, 109, 6, 2589);
    			attr_dev(p6, "class", "svelte-15r57m9");
    			add_location(p6, file$h, 112, 6, 2680);
    			if (img.src !== (img_src_value = "/assets/figures/convolution.gif")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "clicking on topmost first conv. layer activation map");
    			attr_dev(img, "class", "svelte-15r57m9");
    			add_location(img, file$h, 116, 6, 2818);
    			attr_dev(div1, "class", "figure-caption svelte-15r57m9");
    			add_location(div1, file$h, 117, 6, 2940);
    			attr_dev(div2, "class", "figure svelte-15r57m9");
    			add_location(div2, file$h, 115, 4, 2790);
    			attr_dev(h42, "id", "article-pooling");
    			attr_dev(h42, "class", "svelte-15r57m9");
    			add_location(h42, file$h, 122, 4, 3067);
    			attr_dev(p7, "class", "svelte-15r57m9");
    			add_location(p7, file$h, 123, 4, 3106);
    			attr_dev(p8, "class", "svelte-15r57m9");
    			add_location(p8, file$h, 126, 4, 3190);
    			attr_dev(h43, "id", "article-softmax");
    			attr_dev(h43, "class", "svelte-15r57m9");
    			add_location(h43, file$h, 130, 4, 3298);
    			attr_dev(p9, "class", "svelte-15r57m9");
    			add_location(p9, file$h, 131, 4, 3343);
    			attr_dev(h44, "id", "try");
    			attr_dev(h44, "class", "svelte-15r57m9");
    			add_location(h44, file$h, 135, 4, 3426);
    			attr_dev(p10, "class", "svelte-15r57m9");
    			add_location(p10, file$h, 136, 4, 3454);
    			attr_dev(p11, "class", "svelte-15r57m9");
    			add_location(p11, file$h, 139, 4, 3585);
    			attr_dev(div3, "id", "description");
    			attr_dev(div3, "class", "svelte-15r57m9");
    			add_location(div3, file$h, 75, 2, 1151);
    			add_location(body, file$h, 74, 0, 1141);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h2);
    			append_dev(h2, strong0);
    			append_dev(div3, t1);
    			append_dev(div3, p0);
    			append_dev(p0, strong1);
    			append_dev(div3, t3);
    			append_dev(div3, p1);
    			append_dev(p1, strong2);
    			append_dev(div3, t5);
    			append_dev(div3, h30);
    			append_dev(div3, t7);
    			append_dev(div3, p2);
    			append_dev(p2, t8);
    			append_dev(p2, em);
    			append_dev(p2, t10);
    			append_dev(div3, t11);
    			append_dev(div3, p3);
    			append_dev(div3, t13);
    			append_dev(div3, ol);
    			append_dev(ol, li0);
    			append_dev(li0, strong3);
    			append_dev(li0, t15);
    			append_dev(ol, t16);
    			append_dev(ol, li1);
    			append_dev(li1, strong4);
    			append_dev(li1, t18);
    			append_dev(ol, t19);
    			append_dev(ol, li2);
    			append_dev(li2, strong5);
    			append_dev(li2, t21);
    			append_dev(ol, t22);
    			append_dev(ol, li3);
    			append_dev(li3, strong6);
    			append_dev(li3, t24);
    			append_dev(div3, t25);
    			append_dev(div3, h31);
    			append_dev(div3, t27);
    			append_dev(div3, h40);
    			append_dev(div3, t29);
    			append_dev(div3, p4);
    			append_dev(div3, t31);
    			append_dev(div3, h41);
    			append_dev(div3, t33);
    			append_dev(div3, p5);
    			append_dev(div3, t35);
    			append_dev(div3, p6);
    			append_dev(div3, t37);
    			append_dev(div3, div2);
    			append_dev(div2, img);
    			append_dev(div2, t38);
    			append_dev(div2, div1);
    			append_dev(div3, t40);
    			append_dev(div3, h42);
    			append_dev(div3, t42);
    			append_dev(div3, p7);
    			append_dev(div3, t44);
    			append_dev(div3, p8);
    			append_dev(div3, t46);
    			append_dev(div3, h43);
    			append_dev(div3, t48);
    			append_dev(div3, p9);
    			append_dev(div3, t50);
    			append_dev(div3, h44);
    			append_dev(div3, t52);
    			append_dev(div3, p10);
    			append_dev(div3, t54);
    			append_dev(div3, p11);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
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

    function instance$i($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Article> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Article", $$slots, []);
    	return [];
    }

    class Article extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Article",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* global tf */

    // Network input image size
    const networkInputSize = 32;

    // Enum of node types
    const nodeType = {
      INPUT: 'input',
      CONV: 'conv',
      POOL: 'pool',
      RELU: 'relu',
      FC: 'fc',
      FLATTEN: 'flatten'
    };

    class Node {
      /**
       * Class structure for each neuron node.
       * 
       * @param {string} layerName Name of the node's layer.
       * @param {int} index Index of this node in its layer.
       * @param {string} type Node type {input, conv, pool, relu, fc}. 
       * @param {number} bias The bias assocated to this node.
       * @param {number[]} output Output of this node.
       */
      constructor(layerName, index, type, bias, output) {
        this.layerName = layerName;
        this.index = index;
        this.type = type;
        this.bias = bias;
        this.output = output;

        // Weights are stored in the links
        this.inputLinks = [];
        this.outputLinks = [];
      }
    }

    class Link {
      /**
       * Class structure for each link between two nodes.
       * 
       * @param {Node} source Source node.
       * @param {Node} dest Target node.
       * @param {number} weight Weight associated to this link. It can be a number,
       *  1D array, or 2D array.
       */
      constructor(source, dest, weight) {
        this.source = source;
        this.dest = dest;
        this.weight = weight;
      }
    }

    /**
     * Construct a CNN with given extracted outputs from every layer.
     * 
     * @param {number[][]} allOutputs Array of outputs for each layer.
     *  allOutputs[i][j] is the output for layer i node j.
     * @param {Model} model Loaded tf.js model.
     * @param {Tensor} inputImageTensor Loaded input image tensor.
     */
    const constructCNNFromOutputs = (allOutputs, model, inputImageTensor) => {
      let cnn = [];

      // Add the first layer (input layer)
      let inputLayer = [];
      let inputShape = model.layers[0].batchInputShape.slice(1);
      let inputImageArray = inputImageTensor.transpose([2, 0, 1]).arraySync();

      // First layer's three nodes' outputs are the channels of inputImageArray
      for (let i = 0; i < inputShape[2]; i++) {
        let node = new Node('input', i, nodeType.INPUT, 0, inputImageArray[i]);
        inputLayer.push(node);
      }
                                                                                                                       
      cnn.push(inputLayer);
      let curLayerIndex = 1;

      for (let l = 0; l < model.layers.length; l++) {
        let layer = model.layers[l];
        // Get the current output
        let outputs = allOutputs[l].squeeze();
        outputs = outputs.arraySync();

        let curLayerNodes = [];
        let curLayerType;

        // Identify layer type based on the layer name
        if (layer.name.includes('conv')) {
          curLayerType = nodeType.CONV;
        } else if (layer.name.includes('pool')) {
          curLayerType = nodeType.POOL;
        } else if (layer.name.includes('relu')) {
          curLayerType = nodeType.RELU;
        } else if (layer.name.includes('output')) {
          curLayerType = nodeType.FC;
        } else if (layer.name.includes('flatten')) {
          curLayerType = nodeType.FLATTEN;
        } else if (layer.name.includes('dense')){
          curLayerType = nodeType.FC;
        }
        else {
          console.log('Find unknown type');
        }

        // Construct this layer based on its layer type
        switch (curLayerType) {
          case nodeType.CONV: {
            let biases = layer.bias.val.arraySync();
            // The new order is [output_depth, input_depth, height, width]
            let weights = layer.kernel.val.transpose([3, 2, 0, 1]).arraySync();

            // Add nodes into this layer
            for (let i = 0; i < outputs.length; i++) {
              let node = new Node(layer.name, i, curLayerType, biases[i],
                outputs[i]);

              // Connect this node to all previous nodes (create links)
              // CONV layers have weights in links. Links are one-to-multiple.
              for (let j = 0; j < cnn[curLayerIndex - 1].length; j++) {
                let preNode = cnn[curLayerIndex - 1][j];
                let curLink = new Link(preNode, node, weights[i][j]);
                preNode.outputLinks.push(curLink);
                node.inputLinks.push(curLink);
              }
              curLayerNodes.push(node);
            }
            break;
          }
          case nodeType.FC: {
            let biases = layer.bias.val.arraySync();
            // The new order is [output_depth, input_depth]
            let weights = layer.kernel.val.transpose([1, 0]).arraySync();

            // Add nodes into this layer
            for (let i = 0; i < outputs.length; i++) {
              let node = new Node(layer.name, i, curLayerType, biases[i],
                outputs[i]);
              if(layer.name === 'dense_23'){
                node = new Node('output', i, curLayerType, biases[i],
                  outputs[i]);
              }
              // Connect this node to all previous nodes (create links)
              // FC layers have weights in links. Links are one-to-multiple.

              // Since we are visualizing the logit values, we need to track
              // the raw value before softmax
              let curLogit = 0;
              for (let j = 0; j < cnn[curLayerIndex - 1].length; j++) {
                let preNode = cnn[curLayerIndex - 1][j];
                let curLink = new Link(preNode, node, weights[i][j]);
                preNode.outputLinks.push(curLink);
                node.inputLinks.push(curLink);
                curLogit += preNode.output * weights[i][j];
              }
              curLogit += biases[i];
              node.logit = curLogit;
              curLayerNodes.push(node);
            }

            // Sort flatten layer based on the node TF index
            cnn[curLayerIndex - 1].sort((a, b) => a.realIndex - b.realIndex);
            break;
          }
          case nodeType.RELU:
          case nodeType.POOL: {
            // RELU and POOL have no bias nor weight
            let bias = 0;
            let weight = null;

            // Add nodes into this layer
            for (let i = 0; i < outputs.length; i++) {
              let node = new Node(layer.name, i, curLayerType, bias, outputs[i]);

              // RELU and POOL layers have no weights. Links are one-to-one
              let preNode = cnn[curLayerIndex - 1][i];
              let link = new Link(preNode, node, weight);
              preNode.outputLinks.push(link);
              node.inputLinks.push(link);

              curLayerNodes.push(node);
            }
            break;
          }
          case nodeType.FLATTEN: {
            // Flatten layer has no bias nor weights.
            let bias = 0;

            for (let i = 0; i < outputs.length; i++) {
              // Flatten layer has no weights. Links are multiple-to-one.
              // Use dummy weights to store the corresponding entry in the previsou
              // node as (row, column)
              // The flatten() in tf2.keras has order: channel -> row -> column
              let preNodeWidth = cnn[curLayerIndex - 1][0].output.length,
                preNodeNum = cnn[curLayerIndex - 1].length,
                preNodeIndex = i % preNodeNum,
                preNodeRow = Math.floor(Math.floor(i / preNodeNum) / preNodeWidth),
                preNodeCol = Math.floor(i / preNodeNum) % preNodeWidth,
                // Use channel, row, colume to compute the real index with order
                // row -> column -> channel
                curNodeRealIndex = preNodeIndex * (preNodeWidth * preNodeWidth) +
                  preNodeRow * preNodeWidth + preNodeCol;
              
              let node = new Node(layer.name, i, curLayerType,
                  bias, outputs[i]);
              
              // TF uses the (i) index for computation, but the real order should
              // be (curNodeRealIndex). We will sort the nodes using the real order
              // after we compute the logits in the output layer.
              node.realIndex = curNodeRealIndex;

              let link = new Link(cnn[curLayerIndex - 1][preNodeIndex],
                  node, [preNodeRow, preNodeCol]);

              cnn[curLayerIndex - 1][preNodeIndex].outputLinks.push(link);
              node.inputLinks.push(link);

              curLayerNodes.push(node);
            }

            // Sort flatten layer based on the node TF index
            curLayerNodes.sort((a, b) => a.index - b.index);
            break;
          }
          default:
            console.error('Encounter unknown layer type');
            break;
        }

        // Add current layer to the NN
        cnn.push(curLayerNodes);
        curLayerIndex++;
      }

      return cnn;
    };

    /**
     * Construct a CNN with given model and input.
     * 
     * @param {string} inputImageFile filename of input image.
     * @param {Model} model Loaded tf.js model.
     */
    const constructCNN = async (inputImageFile, model) => {
      // Load the image file
      let inputImageTensor = await getInputImageArray(inputImageFile, true);
      //inputImageTensor = tf.fill([inputImageTensor.shape[0], inputImageTensor.shape[1], 1], 0.5);
      // Need to feed the model with a batch
      let inputImageTensorBatch = tf.stack([inputImageTensor]);
      // To get intermediate layer outputs, we will iterate through all layers in
      // the model, and sequencially apply transformations.
      let preTensor = inputImageTensorBatch;
      let outputs = [];

      // Iterate through all layers, and build one model with that layer as output
      for (let l = 0; l < model.layers.length; l++) {
        let curTensor = model.layers[l].apply(preTensor);

        // Record the output tensor
        // Because there is only one element in the batch, we use squeeze()
        // We also want to use CHW order here
        let output = curTensor.squeeze();
        if (output.shape.length === 3) {
          output = output.transpose([2, 0, 1]);
        }
        outputs.push(output);

        // Update preTensor for next nesting iteration
        preTensor = curTensor;
      }

      let cnn = constructCNNFromOutputs(outputs, model, inputImageTensor);
      return cnn;
    };

    // Helper functions

    /**
     * Crop the largest central square of size 64x64x3 of a 3d array.
     * 
     * @param {[int8]} arr array that requires cropping and padding (if a 64x64 crop
     * is not present)
     * @returns 64x64x3 array
     */
    const cropCentralSquare = (arr) => {
      let width = arr.length;
      let height = arr[0].length;
      let croppedArray;

      // Crop largest square from image if the image is smaller than 64x64 and pad the
      // cropped image.
      if (width < networkInputSize || height < networkInputSize) {
        // TODO(robert): Finish the padding logic.  Pushing now for Omar to work on when he is ready.
        let cropDimensions = Math.min(width, height);
        let startXIdx = Math.floor(width / 2) - (cropDimensions / 2);
        let startYIdx = Math.floor(height / 2) - (cropDimensions / 2);
        let unpaddedSubarray = arr.slice(startXIdx, startXIdx + cropDimensions).map(i => i.slice(startYIdx, startYIdx + cropDimensions));
      } else {
        let startXIdx = Math.floor(width / 2) - Math.floor(networkInputSize / 2);
        let startYIdx = Math.floor(height / 2) - Math.floor(networkInputSize / 2);
        croppedArray = arr.slice(startXIdx, startXIdx + networkInputSize).map(i => i.slice(startYIdx, startYIdx + networkInputSize));
      }
      return croppedArray;
    };

    /**
     * Convert canvas image data into a 3D tensor with dimension [height, width, 3].
     * Recall that tensorflow uses NHWC order (batch, height, width, channel).
     * Each pixel is in 0-255 scale.
     * 
     * @param {[int8]} imageData Canvas image data
     * @param {int} width Canvas image width
     * @param {int} height Canvas image height
     */
    const imageDataTo3DTensor = (imageData, width, height, normalize=true) => {
      // Create array placeholder for the 3d array
      let imageArray = tf.fill([width, height, 3], 0).arraySync();

      // Iterate through the data to fill out channel arrays above
      for (let i = 0; i < imageData.length; i++) {
        let pixelIndex = Math.floor(i / 4),
          channelIndex = i % 4,
          row = width === height ? Math.floor(pixelIndex / width)
                                  : pixelIndex % width,
          column = width === height ? pixelIndex % width
                                  : Math.floor(pixelIndex / width);
        
        if (channelIndex < 3) { 
          let curEntry  = imageData[i];
          // Normalize the original pixel value from [0, 255] to [0, 1]
          if (normalize) {
            curEntry /= 255;
          }
          imageArray[row][column][channelIndex] = curEntry;
        }
      }

      // If the image is not 64x64, crop and or pad the image appropriately.
      if (width != networkInputSize && height != networkInputSize) {
        imageArray = cropCentralSquare(imageArray);
      }

      let tensor = tf.tensor3d(imageArray);
      return tensor;
    };

    /**
     * Get the 3D pixel value array of the given image file.
     * 
     * @param {string} imgFile File path to the image file
     * @returns A promise with the corresponding 3D array
     */
    const getInputImageArray = (imgFile, normalize=true) => {
      let canvas = document.createElement('canvas');
      canvas.style.cssText = 'display:none;';
      document.getElementsByTagName('body')[0].appendChild(canvas);
      let context = canvas.getContext('2d');

      return new Promise((resolve, reject) => {
        let inputImage = new Image();
        inputImage.crossOrigin = "Anonymous";
        inputImage.src = imgFile;
        let canvasImage;
        inputImage.onload = () => {
          canvas.width = inputImage.width;
          canvas.height = inputImage.height;
          // Resize the input image of the network if it is too large to simply crop
          // the center 64x64 portion in order to still provide a representative
          // input image into the network.
          if (inputImage.width > networkInputSize || inputImage.height > networkInputSize) {
            // Step 1 - Resize using smaller dimension to scale the image down. 
            let resizeCanvas = document.createElement('canvas'),
                resizeContext = resizeCanvas.getContext('2d');
            let smallerDimension = Math.min(inputImage.width, inputImage.height);
            const resizeFactor = (networkInputSize + 1) / smallerDimension;
            resizeCanvas.width = inputImage.width * resizeFactor;
            resizeCanvas.height = inputImage.height * resizeFactor;
            resizeContext.drawImage(inputImage, 0, 0, resizeCanvas.width,
              resizeCanvas.height);

            // Step 2 - Flip non-square images horizontally and rotate them 90deg since
            // non-square images are not stored upright.
            if (inputImage.width != inputImage.height) {
              context.translate(resizeCanvas.width, 0);
              context.scale(-1, 1);
              context.translate(resizeCanvas.width / 2, resizeCanvas.height / 2);
              context.rotate(90 * Math.PI / 180);
            }

            // Step 3 - Draw resized image on original canvas.
            if (inputImage.width != inputImage.height) {
              context.drawImage(resizeCanvas, -resizeCanvas.width / 2, -resizeCanvas.height / 2);
            } else {
              context.drawImage(resizeCanvas, 0, 0);
            }
            canvasImage = context.getImageData(0, 0, resizeCanvas.width,
              resizeCanvas.height);

          } else {
            context.drawImage(inputImage, 0, 0);
            canvasImage = context.getImageData(0, 0, inputImage.width,
              inputImage.height);
          }
          // Get image data and convert it to a 3D array
          let imageData = canvasImage.data;
          let imageWidth = canvasImage.width;
          let imageHeight = canvasImage.height;

          // Remove this newly created canvas element
          canvas.parentNode.removeChild(canvas);

          resolve(imageDataTo3DTensor(imageData, imageWidth, imageHeight, normalize));
        };
        inputImage.onerror = reject;
      })
    };

    /**
     * Wrapper to load a model.
     * 
     * @param {string} modelFile Filename of converted (through tensorflowjs.py)
     *  model json file.
     */
    const loadTrainedModel = (modelFile) => {
      return tf.loadLayersModel(modelFile);
    };

    /* global d3 */

    const layerColorScales$1 = {
      input: [d3.interpolateGreys, d3.interpolateGreys, d3.interpolateGreys],
      conv: d3.interpolateRdBu,
      relu: d3.interpolateRdBu,
      pool: d3.interpolateRdBu,
      fc: d3.interpolateGreys,
      weight: d3.interpolateBrBG,
      logit: d3.interpolateOranges
    };

    let nodeLength = 40;

    const overviewConfig = {
      nodeLength : nodeLength,
      plusSymbolRadius : nodeLength / 5,
      numLayers : 7,
      edgeOpacity : 0.8,
      edgeInitColor : 'rgb(230, 230, 230)',
      edgeHoverColor : 'rgb(130, 130, 130)',
      edgeHoverOuting : false,
      edgeStrokeWidth : 0.7,
      intermediateColor : 'gray',
      layerColorScales: layerColorScales$1,
      svgPaddings: {top: 25, bottom: 25, left: 50, right: 50},
      kernelRectLength: 8/3,
      gapRatio: 4,
      overlayRectOffset: 12,
      // classLists: ['1', '2', '3', '4', '5',
      //   '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
      classLists: ["山鸢尾", "杂色鸢尾", "维吉尼亚鸢尾"]
    };

    // Configs
    const nodeLength$1 = overviewConfig.nodeLength;

    /**
     * Compute the [minimum, maximum] of a 1D or 2D array.
     * @param {[number]} array 
     */
    const getExtent = (array) => {
      let min = Infinity;
      let max = -Infinity;

      // Scalar
      if (array.length === undefined) {
        return [array, array];
      }

      // 1D array
      if (array[0].length === undefined) {
        for (let i = 0; i < array[0].length; i++) {
          if (array[i] < min) {
            min = array[i];
          } else if (array[i] > max) {
            max = array[i];
          }
        }
        return [min, max];
      }

      // 2D array
      for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[0].length; j++) {
          if (array[i][j] < min) {
            min = array[i][j];
          } else if (array[i][j] > max) {
            max = array[i][j];
          }
        }
      }
      return [min, max];
    };

    /**
     * Convert the svg element center coord to document absolute value
     * // Inspired by https://github.com/caged/d3-tip/blob/master/index.js#L286
     * @param {elem} elem 
     */
    const getMidCoords = (svg, elem) => {
      if (svg !== undefined) {
        let targetel = elem;
        while (targetel.getScreenCTM == null && targetel.parentNode != null) {
          targetel = targetel.parentNode;
        }
        // Get the absolute coordinate of the E point of element bbox
        let point = svg.node().ownerSVGElement.createSVGPoint();
        let matrix = targetel.getScreenCTM();
        let tbbox = targetel.getBBox();
        // let width = tbbox.width;
        let height = tbbox.height;

        point.x += 0;
        point.y -= height / 2;
        let bbox = point.matrixTransform(matrix);
        return {
          top: bbox.y,
          left: bbox.x
        };
      }
    };

    /**
     * Return the output knot (right boundary center)
     * @param {object} point {x: x, y:y}
     */
    const getOutputKnot = (point) => {
      return {
        x: point.x + nodeLength$1,
        y: point.y + nodeLength$1 / 2
      };
    };

    /**
     * Return the output knot (left boundary center)
     * @param {object} point {x: x, y:y}
     */
    const getInputKnot = (point) => {
      return {
        x: point.x,
        y: point.y + nodeLength$1 / 2
      }
    };

    /**
     * Compute edge data
     * @param {[[[number, number]]]} nodeCoordinate Constructed neuron svg locations
     * @param {[object]} cnn Constructed CNN model
     */
    const getLinkData = (nodeCoordinate, cnn) => {
      let linkData = [];
      // Create links backward (starting for the first conv layer)
      for (let l = 1; l < cnn.length; l++) {
        for (let n = 0; n < cnn[l].length; n++) {
          let isOutput = cnn[l][n].layerName === 'dense_22';
          let curTarget = getInputKnot(nodeCoordinate[l][n]);
          for (let p = 0; p < cnn[l][n].inputLinks.length; p++) {
            // Specially handle output layer (since we are ignoring the flatten)
            let inputNodeIndex = cnn[l][n].inputLinks[p].source.index;
            
            if (isOutput) {
              let flattenDimension = cnn[l-1][0].output.length *
                cnn[l-1][0].output.length;
              if (inputNodeIndex % flattenDimension !== 0){
                  continue;
              }
              inputNodeIndex = Math.floor(inputNodeIndex / flattenDimension);
            }
            let curSource = getOutputKnot(nodeCoordinate[l-1][inputNodeIndex]);
            let curWeight = cnn[l][n].inputLinks[p].weight;
            linkData.push({
              source: curSource,
              target: curTarget,
              weight: curWeight,
              targetLayerIndex: l,
              targetNodeIndex: n,
              sourceNodeIndex: inputNodeIndex
            });
          }
        }
      }
      return linkData;
    };


    /**
     * Color scale wrapper (support artificially lighter color!)
     * @param {function} colorScale D3 color scale function
     * @param {number} range Color range (max - min)
     * @param {number} value Color value
     * @param {number} gap Tail of the color scale to skip
     */
    const gappedColorScale = (colorScale, range, value, gap) => {
      if (gap === undefined) { gap = 0; }
      let normalizedValue = (value + range / 2) / range;
      return colorScale(normalizedValue * (1 - 2 * gap) + gap);
    };

    /* global d3, SmoothScroll */

    // Configs
    const layerColorScales$2 = overviewConfig.layerColorScales;
    const nodeLength$2 = overviewConfig.nodeLength;
    const numLayers = overviewConfig.numLayers;
    const edgeOpacity = overviewConfig.edgeOpacity;
    const edgeInitColor = overviewConfig.edgeInitColor;
    const edgeStrokeWidth = overviewConfig.edgeStrokeWidth;
    const svgPaddings = overviewConfig.svgPaddings;
    const gapRatio = overviewConfig.gapRatio;
    const classLists = overviewConfig.classLists;
    const formater = d3.format('.4f');
    const layernameDict = {
      'input': '输入层',
      'conv2d_22': '卷积层',
      'max_pooling2d_21': '池化层',
      'conv2d_23': '卷积层',
      'max_pooling2d_22': '池化层',
      'dense_22': '全连接层',
      'output': '输出层',
    };



    // Shared variables
    let svg$1 = undefined;
    svgStore.subscribe( value => {svg$1 = value;} );

    let vSpaceAroundGap = undefined;
    vSpaceAroundGapStore.subscribe( value => {vSpaceAroundGap = value;} );

    let hSpaceAroundGap = undefined;
    hSpaceAroundGapStore.subscribe( value => {hSpaceAroundGap = value;} );

    let cnn = undefined;
    cnnStore.subscribe( value => {cnn = value;} );

    let nodeCoordinate = undefined;
    nodeCoordinateStore.subscribe( value => {nodeCoordinate = value;} );

    let selectedScaleLevel = undefined;
    selectedScaleLevelStore.subscribe( value => {selectedScaleLevel = value;} );

    let cnnLayerRanges = undefined;
    cnnLayerRangesStore.subscribe( value => {cnnLayerRanges = value;} );

    let cnnLayerMinMax = undefined;
    cnnLayerMinMaxStore.subscribe( value => {cnnLayerMinMax = value;} );

    let detailedMode = undefined;
    detailedModeStore.subscribe( value => {detailedMode = value;} );

    /**
     * Use bounded d3 data to draw one canvas
     * @param {object} d d3 data
     * @param {index} i d3 data index
     * @param {[object]} g d3 group
     * @param {number} range color range map (max - min)
     */
    const drawOutput = (d, i, g, range) => {
      let image = g[i];
      let colorScale = layerColorScales$2[d.type];

      if (d.type === 'input') {
        colorScale = colorScale[d.index];
      }

      // Set up a second convas in order to resize image
      let imageLength = d.output.length === undefined ? 1 : d.output.length;
      let bufferCanvas = document.createElement("canvas");
      let bufferContext = bufferCanvas.getContext("2d");
      bufferCanvas.width = imageLength;
      bufferCanvas.height = imageLength;

      // Fill image pixel array
      let imageSingle = bufferContext.getImageData(0, 0, imageLength, imageLength);
      let imageSingleArray = imageSingle.data;

      if (imageLength === 1) {
        imageSingleArray[0] = d.output;
      } else {
        for (let i = 0; i < imageSingleArray.length; i+=4) {
          let pixeIndex = Math.floor(i / 4);
          let row = Math.floor(pixeIndex / imageLength);
          let column = pixeIndex % imageLength;
          let color = undefined;
          if (d.type === 'input' || d.type === 'fc' ) {
            color = d3.rgb(colorScale(1 - d.output[row][column]));
          } else {
            color = d3.rgb(colorScale((d.output[row][column] + range / 2) / range));
          }

          imageSingleArray[i] = color.r;
          imageSingleArray[i + 1] = color.g;
          imageSingleArray[i + 2] = color.b;
          imageSingleArray[i + 3] = 255;
        }
      }

      // canvas.toDataURL() only exports image in 96 DPI, so we can hack it to have
      // higher DPI by rescaling the image using canvas magic
      let largeCanvas = document.createElement('canvas');
      largeCanvas.width = nodeLength$2 * 3;
      largeCanvas.height = nodeLength$2 * 3;
      let largeCanvasContext = largeCanvas.getContext('2d');

      // Use drawImage to resize the original pixel array, and put the new image
      // (canvas) into corresponding canvas
      bufferContext.putImageData(imageSingle, 0, 0);
      largeCanvasContext.drawImage(bufferCanvas, 0, 0, imageLength, imageLength,
        0, 0, nodeLength$2 * 3, nodeLength$2 * 3);
      
      let imageDataURL = largeCanvas.toDataURL();
      d3.select(image).attr('xlink:href', imageDataURL);

      // Destory the buffer canvas
      bufferCanvas.remove();
      largeCanvas.remove();
    };

    /**
     * Draw bar chart to encode the output value
     * @param {object} d d3 data
     * @param {index} i d3 data index
     * @param {[object]} g d3 group
     * @param {function} scale map value to length
     */
    const drawOutputScore = (d, i, g, scale) => {
      let group = d3.select(g[i]);
      group.select('rect.output-rect')
        .transition('output')
        .delay(500)
        .duration(800)
        .ease(d3.easeCubicIn)
        .attr('width', scale(d.output));
    };

    const drawCustomImage = (image, inputLayer) => {

      let imageWidth = image.width;
      // Set up a second convas in order to resize image
      let imageLength = inputLayer[0].output.length;
      let bufferCanvas = document.createElement("canvas");
      let bufferContext = bufferCanvas.getContext("2d");
      bufferCanvas.width = imageLength;
      bufferCanvas.height = imageLength;

      // Fill image pixel array
      let imageSingle = bufferContext.getImageData(0, 0, imageLength, imageLength);
      let imageSingleArray = imageSingle.data;

      for (let i = 0; i < imageSingleArray.length; i+=4) {
        let pixeIndex = Math.floor(i / 4);
        let row = Math.floor(pixeIndex / imageLength);
        let column = pixeIndex % imageLength;

        let red = inputLayer[0].output[row][column];
        let green = inputLayer[1].output[row][column];
        let blue = inputLayer[2].output[row][column];

        imageSingleArray[i] = red * 255;
        imageSingleArray[i + 1] = green * 255;
        imageSingleArray[i + 2] = blue * 255;
        imageSingleArray[i + 3] = 255;
      }

      // canvas.toDataURL() only exports image in 96 DPI, so we can hack it to have
      // higher DPI by rescaling the image using canvas magic
      let largeCanvas = document.createElement('canvas');
      largeCanvas.width = imageWidth * 3;
      largeCanvas.height = imageWidth * 3;
      let largeCanvasContext = largeCanvas.getContext('2d');

      // Use drawImage to resize the original pixel array, and put the new image
      // (canvas) into corresponding canvas
      bufferContext.putImageData(imageSingle, 0, 0);
      largeCanvasContext.drawImage(bufferCanvas, 0, 0, imageLength, imageLength,
        0, 0, imageWidth * 3, imageWidth * 3);
      
      let imageDataURL = largeCanvas.toDataURL();
      // d3.select(image).attr('xlink:href', imageDataURL);
      image.src = imageDataURL;

      // Destory the buffer canvas
      bufferCanvas.remove();
      largeCanvas.remove();
    };

    /**
     * Create color gradient for the legend
     * @param {[object]} g d3 group
     * @param {function} colorScale Colormap
     * @param {string} gradientName Label for gradient def
     * @param {number} min Min of legend value
     * @param {number} max Max of legend value
     */
    const getLegendGradient = (g, colorScale, gradientName, min, max) => {
      if (min === undefined) { min = 0; }
      if (max === undefined) { max = 1; }
      let gradient = g.append('defs')
        .append('svg:linearGradient')
        .attr('id', `${gradientName}`)
        .attr('x1', '0%')
        .attr('y1', '100%')
        .attr('x2', '100%')
        .attr('y2', '100%')
        .attr('spreadMethod', 'pad');
      let interpolation = 10;
      for (let i = 0; i < interpolation; i++) {
        let curProgress = i / (interpolation - 1);
        let curColor = colorScale(curProgress * (max - min) + min);
        gradient.append('stop')
          .attr('offset', `${curProgress * 100}%`)
          .attr('stop-color', curColor)
          .attr('stop-opacity', 1);
      }
    };

    /**
     * Draw the overview
     * @param {number} width Width of the cnn group
     * @param {number} height Height of the cnn group
     * @param {object} cnnGroup Group to appen cnn elements to
     * @param {function} nodeMouseOverHandler Callback func for mouseOver
     * @param {function} nodeMouseLeaveHandler Callback func for mouseLeave
     * @param {function} nodeClickHandler Callback func for click
     */
    const drawCNN = (width, height, cnnGroup, nodeMouseOverHandler,
      nodeMouseLeaveHandler, nodeClickHandler) => {
      // Draw the CNN
      // There are 8 short gaps and 5 long gaps
      hSpaceAroundGap = (width - nodeLength$2 * numLayers) / (6 + 3 * gapRatio);
      hSpaceAroundGapStore.set(hSpaceAroundGap);
      let leftAccuumulatedSpace = 0;
      nodeCoordinate = [];
      // Iterate through the cnn to draw nodes in each layer
      for (let l = 0; l < cnn.length; l++) {
        let curLayer = cnn[l];
        let isOutput = curLayer[0].layerName === 'output';

        nodeCoordinate.push([]);

        // Compute the x coordinate of the whole layer
        // Output layer and conv layer has long gaps
        if (isOutput || curLayer[0].type === 'conv') {
          leftAccuumulatedSpace += hSpaceAroundGap * gapRatio;
        } else {
          leftAccuumulatedSpace += hSpaceAroundGap;
        }

        // All nodes share the same x coordiante (left in div style)
        let left = leftAccuumulatedSpace;

        let layerGroup = cnnGroup.append('g')
          .attr('class', 'cnn-layer-group')
          .attr('id', `cnn-layer-group-${l}`);

        vSpaceAroundGap = (height - nodeLength$2 * curLayer.length) /
          (curLayer.length + 1);
        vSpaceAroundGapStore.set(vSpaceAroundGap);

        let nodeGroups = layerGroup.selectAll('g.node-group')
          .data(curLayer, d => d.index)
          .enter()
          .append('g')
          .attr('class', 'node-group')
          .style('cursor', 'pointer')
          .style('pointer-events', 'all')
          .on('click', nodeClickHandler)
          .on('mouseover', nodeMouseOverHandler)
          .on('mouseleave', nodeMouseLeaveHandler)
          .classed('node-output', isOutput)
          .attr('id', (d, i) => {
            // Compute the coordinate
            // Not using transform on the group object because of a decade old
            // bug on webkit (safari)
            // https://bugs.webkit.org/show_bug.cgi?id=23113
            let top = i * nodeLength$2 + (i + 1) * vSpaceAroundGap;
            top += svgPaddings.top;
            nodeCoordinate[l].push({x: left, y: top});
            return `layer-${l}-node-${i}`
          });
        
        // Overwrite the mouseover and mouseleave function for output nodes to show
        // hover info in the UI
        layerGroup.selectAll('g.node-output')
          .on('mouseover', (d, i, g) => {
            nodeMouseOverHandler(d, i, g);
            hoverInfoStore.set( {show: true, text: `Output value: ${formater(d.output)}`} );
          })
          .on('mouseleave', (d, i, g) => {
            nodeMouseLeaveHandler(d, i, g);
            hoverInfoStore.set( {show: false, text: `Output value: ${formater(d.output)}`} );
          });
        
        if (curLayer[0].layerName === 'output') {
            nodeGroups.append('rect')
              .attr('class', 'output-rect')
              .attr('x', left)
              .attr('y', (d, i) => nodeCoordinate[l][i].y + nodeLength$2 / 2 + 8)
              .attr('height', nodeLength$2 / 4)
              .attr('width', 0)
              .style('fill', 'gray');
            nodeGroups.append('text')
              .attr('class', 'output-text')
              .attr('x', left)
              .attr('y', (d, i) => nodeCoordinate[l][i].y + nodeLength$2 / 2)
              .style('dominant-baseline', 'middle')
              .style('font-size', '11px')
              .style('fill', 'black')
              .style('opacity', 0.5)
              .text((d, i) => classLists[i]);
            // Add annotation text to tell readers the exact output probability
            // nodeGroups.append('text')
            //   .attr('class', 'annotation-text')
            //   .attr('id', (d, i) => `output-prob-${i}`)
            //   .attr('x', left)
            //   .attr('y', (d, i) => nodeCoordinate[l][i].y + 10)
            //   .text(d => `(${d3.format('.4f')(d.output)})`);
        } else if(curLayer[0].layerName === 'dense_22'){
            let colorScale = layerColorScales$2.conv;
            nodeGroups.append('circle')
            .attr('class', 'dense-circle')
            .attr('cx', left + nodeLength$2 / 2)
            .attr('cy', (d, i) => nodeCoordinate[l][i].y + nodeLength$2 / 2)
            .attr('r', nodeLength$2 / 2)
            .style('fill', colorScale(0.6));
            
            nodeGroups.append('circle')
            .attr('class', 'bounding')
            .attr('cx', left + nodeLength$2 / 2)
            .attr('cy', (d, i) => nodeCoordinate[l][i].y + nodeLength$2 / 2)
            .attr('r', nodeLength$2 / 2)
            .style('fill', 'none')
            .style('stroke', 'gray')
            .style('stroke-width', 1)
            .classed('hidden', true);
        }else {
            // Embed raster image in these groups
            nodeGroups.append('image')
            .attr('class', 'node-image')
            .attr('width', nodeLength$2)
            .attr('height', nodeLength$2)
            .attr('x', left)
            .attr('y', (d, i) => nodeCoordinate[l][i].y);
          
          // Add a rectangle to show the border
          nodeGroups.append('rect')
            .attr('class', 'bounding')
            .attr('width', nodeLength$2)
            .attr('height', nodeLength$2)
            .attr('x', left)
            .attr('y', (d, i) => nodeCoordinate[l][i].y)
            .style('fill', 'none')
            .style('stroke', 'gray')
            .style('stroke-width', 1)
            .classed('hidden', true);
        }
        leftAccuumulatedSpace += nodeLength$2;
      }

      // Share the nodeCoordinate
      nodeCoordinateStore.set(nodeCoordinate);

      // Compute the scale of the output score width (mapping the the node
      // width to the max output score)
      let outputRectScale = d3.scaleLinear()
            .domain(cnnLayerRanges.output)
            .range([0, nodeLength$2]);

      // Draw the canvas
      for (let l = 0; l < cnn.length; l++) {
        let range = cnnLayerRanges[selectedScaleLevel][l];
        svg$1.select(`g#cnn-layer-group-${l}`)
          .selectAll('image.node-image')
          .each((d, i, g) => drawOutput(d, i, g, range));
      }

      svg$1.selectAll('g.node-output').each(
        (d, i, g) => drawOutputScore(d, i, g, outputRectScale)
      );

      // Add layer label
      let layerNames = cnn.map(d => {
        if (d[0].layerName === 'output' || d[0].layerName === 'dense_22') {
          return {
            name: layernameDict[d[0].layerName],
            dimension: `(${d.length})`
          }
        } else {
          return {
            name: layernameDict[d[0].layerName],
            dimension: `(${d[0].output.length}, ${d[0].output.length}, ${d.length})`
          }
        }
      });

      let svgHeight = Number(d3.select('#cnn-svg').style('height').replace('px', '')) + 150;
      let scroll = new SmoothScroll('a[href*="#"]', {offset: -svgHeight});
      
      let detailedLabels = svg$1.selectAll('g.layer-detailed-label')
        .data(layerNames)
        .enter()
        .append('g')
        .attr('class', 'layer-detailed-label')
        .attr('id', (d, i) => `layer-detailed-label-${i}`)
        .classed('hidden', !detailedMode)
        .attr('transform', (d, i) => {
          let x = nodeCoordinate[i][0].x + nodeLength$2 / 2;
          let y = (svgPaddings.top) / 2;
          return `translate(${x}, ${y})`;
        })
        .style('cursor', d => d.name.includes('output') ? 'default' : 'help')
        .on('click', (d) => {
          let target = '';
          if (d.name.includes('conv')) { target = 'convolution'; }
          if (d.name.includes('relu')) { target = 'relu'; }
          if (d.name.includes('max_pool')) { target = 'pooling';}
          if (d.name.includes('input')) { target = 'input';}

          // Scroll to a article element
          let anchor = document.querySelector(`#article-${target}`);
          scroll.animateScroll(anchor);
        });
      
      detailedLabels.append('title')
        .text('Move to article section');
        
      detailedLabels.append('text')
        .style('opacity', 0.7)
        .style('dominant-baseline', 'middle')
        .append('tspan')
        .style('font-size', '12px')
        .text(d => d.name)
        .append('tspan')
        .style('font-size', '8px')
        .style('font-weight', 'normal')
        .attr('x', 0)
        .attr('dy', '1.5em')
        .text(d => d.dimension);
      
      let labels = svg$1.selectAll('g.layer-label')
        .data(layerNames)
        .enter()
        .append('g')
        .attr('class', 'layer-label')
        .attr('id', (d, i) => `layer-label-${i}`)
        .classed('hidden', detailedMode)
        .attr('transform', (d, i) => {
          let x = nodeCoordinate[i][0].x + nodeLength$2 / 2;
          let y = (svgPaddings.top + vSpaceAroundGap) / 2 + 5;
          return `translate(${x}, ${y})`;
        })
        .style('cursor', d => d.name.includes('output') ? 'default' : 'help')
        .on('click', (d) => {
          let target = '';
          if (d.name.includes('conv')) { target = 'convolution'; }
          if (d.name.includes('relu')) { target = 'relu'; }
          if (d.name.includes('max_pool')) { target = 'pooling';}
          if (d.name.includes('input')) { target = 'input';}

          // Scroll to a article element
          let anchor = document.querySelector(`#article-${target}`);
          scroll.animateScroll(anchor);
        });
      
      labels.append('title')
        .text('Move to article section');
      
      labels.append('text')
        .style('dominant-baseline', 'middle')
        .style('opacity', 0.8)
        .text(d => {
          if (d.name.includes('conv')) { return 'conv' }
          if (d.name.includes('relu')) { return 'relu' }
          if (d.name.includes('max_pool')) { return 'max_pool'}
          return d.name
        });

      // Add layer color scale legends
      getLegendGradient(svg$1, layerColorScales$2.conv, 'convGradient');
      getLegendGradient(svg$1, layerColorScales$2.input[0], 'inputGradient');
      let legends = svg$1.append('g')
          .attr('class', 'color-legend')
          .attr('transform', `translate(${0}, ${
        svgPaddings.top + vSpaceAroundGap * (10) + vSpaceAroundGap +
        nodeLength$2 * 10
      })`);
      
      // drawLegends(legends, legendHeight);

      // Add edges between nodes
      let linkGen = d3.linkHorizontal()
        .x(d => d.x)
        .y(d => d.y);
      
      let linkData = getLinkData(nodeCoordinate, cnn);

      let edgeGroup = cnnGroup.append('g')
        .attr('class', 'edge-group');
      
      edgeGroup.selectAll('path.edge')
        .data(linkData)
        .enter()
        .append('path')
        .attr('class', d =>
          `edge edge-${d.targetLayerIndex} edge-${d.targetLayerIndex}-${d.targetNodeIndex}`)
        .attr('id', d => 
          `edge-${d.targetLayerIndex}-${d.targetNodeIndex}-${d.sourceNodeIndex}`)
        .attr('d', d => linkGen({source: d.source, target: d.target}))
        .style('fill', 'none')
        .style('stroke-width', edgeStrokeWidth)
        .style('opacity', edgeOpacity)
        .style('stroke', edgeInitColor);

      // Add input channel annotations
      let inputAnnotation = cnnGroup.append('g')
        .attr('class', 'input-annotation');

      let redChannel = inputAnnotation.append('text')
        .attr('x', nodeCoordinate[0][0].x + nodeLength$2 / 2)
        .attr('y', nodeCoordinate[0][0].y + nodeLength$2 + 5)
        .attr('class', 'annotation-text')
        .style('dominant-baseline', 'hanging')
        .style('text-anchor', 'middle');
      
      redChannel.append('tspan')
        .style('dominant-baseline', 'hanging')
        .style('fill', '#C95E67')
        .text('Red');
      
      // redChannel.append('tspan')
      //   .style('dominant-baseline', 'hanging')
      //   .text(' Input');

      inputAnnotation.append('text')
        .attr('x', nodeCoordinate[0][1].x + nodeLength$2 / 2)
        .attr('y', nodeCoordinate[0][1].y + nodeLength$2 + 5)
        .attr('class', 'annotation-text')
        .style('dominant-baseline', 'hanging')
        .style('text-anchor', 'middle')
        .style('fill', '#3DB665')
        .text('Green');

      inputAnnotation.append('text')
        .attr('x', nodeCoordinate[0][2].x + nodeLength$2 / 2)
        .attr('y', nodeCoordinate[0][2].y + nodeLength$2 + 5)
        .attr('class', 'annotation-text')
        .style('dominant-baseline', 'hanging')
        .style('text-anchor', 'middle')
        .style('fill', '#3F7FBC')
        .text('Blue');
    };

    /**
     * Update canvas values when user changes input image
     */
    const updateCNN = () => {
      // Compute the scale of the output score width (mapping the the node
      // width to the max output score)
      let outputRectScale = d3.scaleLinear()
          .domain(cnnLayerRanges.output)
          .range([0, nodeLength$2]);

      // Rebind the cnn data to layer groups layer by layer
      for (let l = 0; l < cnn.length; l++) {
        let curLayer = cnn[l];
        let range = cnnLayerRanges[selectedScaleLevel][l];
        let layerGroup = svg$1.select(`g#cnn-layer-group-${l}`);

        let nodeGroups = layerGroup.selectAll('g.node-group')
          .data(curLayer);

        if (l < cnn.length - 1) {
          // Redraw the canvas and output node
          nodeGroups.transition('disappear')
            .duration(300)
            .ease(d3.easeCubicOut)
            .style('opacity', 0)
            .on('end', function() {
              d3.select(this)
                .select('image.node-image')
                .each((d, i, g) => drawOutput(d, i, g, range));
              d3.select(this).transition('appear')
                .duration(700)
                .ease(d3.easeCubicIn)
                .style('opacity', 1);
            });
        } else {
          nodeGroups.each(
            (d, i, g) => drawOutputScore(d, i, g, outputRectScale)
          );
        }
      }

      // // Update the color scale legend
      // // Local legends
      // for (let i = 0; i < 2; i++){
      //   let start = 1 + i * 5;
      //   let range1 = cnnLayerRanges.local[start];
      //   let range2 = cnnLayerRanges.local[start + 2];

      //   let localLegendScale1 = d3.scaleLinear()
      //     .range([0, 2 * nodeLength + hSpaceAroundGap])
      //     .domain([-range1, range1]);
        
      //   let localLegendScale2 = d3.scaleLinear()
      //     .range([0, 3 * nodeLength + 2 * hSpaceAroundGap])
      //     .domain([-range2, range2]);

      //   let localLegendAxis1 = d3.axisBottom()
      //     .scale(localLegendScale1)
      //     .tickFormat(d3.format('.2f'))
      //     .tickValues([-range1, 0, range1]);
        
      //   let localLegendAxis2 = d3.axisBottom()
      //     .scale(localLegendScale2)
      //     .tickFormat(d3.format('.2f'))
      //     .tickValues([-range2, 0, range2]);
        
      //   svg.select(`g#local-legend-${i}-1`).select('g').call(localLegendAxis1);
      //   svg.select(`g#local-legend-${i}-2`).select('g').call(localLegendAxis2);
      // }

      // // Module legend
      // for (let i = 0; i < 2; i++){
      //   let start = 1 + i * 5;
      //   let range = cnnLayerRanges.local[start];

      //   let moduleLegendScale = d3.scaleLinear()
      //     .range([0, 5 * nodeLength + 3 * hSpaceAroundGap +
      //       1 * hSpaceAroundGap * gapRatio - 1.2])
      //     .domain([-range, range]);

      //   let moduleLegendAxis = d3.axisBottom()
      //     .scale(moduleLegendScale)
      //     .tickFormat(d3.format('.2f'))
      //     .tickValues([-range, -(range / 2), 0, range/2, range]);
        
      //   svg.select(`g#module-legend-${i}`).select('g').call(moduleLegendAxis);
      // }

      // // Global legend
      // let start = 1;
      // let range = cnnLayerRanges.global[start];

      // let globalLegendScale = d3.scaleLinear()
      //   .range([0, 10 * nodeLength + 6 * hSpaceAroundGap +
      //     3 * hSpaceAroundGap * gapRatio - 1.2])
      //   .domain([-range, range]);

      // let globalLegendAxis = d3.axisBottom()
      //   .scale(globalLegendScale)
      //   .tickFormat(d3.format('.2f'))
      //   .tickValues([-range, -(range / 2), 0, range/2, range]);

      // svg.select(`g#global-legend`).select('g').call(globalLegendAxis);

      // // Output legend
      // let outputLegendAxis = d3.axisBottom()
      //   .scale(outputRectScale)
      //   .tickFormat(d3.format('.1f'))
      //   .tickValues([0, cnnLayerRanges.output[1]]);
      
      // svg.select('g#output-legend').select('g').call(outputLegendAxis);
    };

    /**
     * Update the ranges for current CNN layers
     */
    const updateCNNLayerRanges = () => {
      // Iterate through all nodes to find a output ranges for each layer
      let cnnLayerRangesLocal = [1];
      let curRange = undefined;

      // Also track the min/max of each layer (avoid computing during intermediate
      // layer)
      cnnLayerMinMax = [];

      for (let l = 0; l < cnn.length - 1; l++) {
        let curLayer = cnn[l];

        // Compute the min max
        let outputExtents = curLayer.map(l => getExtent(l.output));
        let aggregatedExtent = outputExtents.reduce((acc, cur) => {
          return [Math.min(acc[0], cur[0]), Math.max(acc[1], cur[1])];
        });
        cnnLayerMinMax.push({min: aggregatedExtent[0], max: aggregatedExtent[1]});

        // conv layer refreshes curRange counting
        if (curLayer[0].type === 'conv' || curLayer[0].type === 'fc') {
          aggregatedExtent = aggregatedExtent.map(Math.abs);
          // Plus 0.1 to offset the rounding error (avoid black color)
          curRange = 2 * (0.1 + 
            Math.round(Math.max(...aggregatedExtent) * 1000) / 1000);
        }

        if (curRange !== undefined){
          cnnLayerRangesLocal.push(curRange);
        }
      }

      // Finally, add the output layer range
      cnnLayerRangesLocal.push(1);
      cnnLayerMinMax.push({min: 0, max: 1});

      // Support different levels of scales (1) lcoal, (2) component, (3) global
      let cnnLayerRangesComponent = [1];
      let numOfComponent = (numLayers - 2) / 2;
      for (let i = 0; i < numOfComponent; i++) {
        let curArray = cnnLayerRangesLocal.slice(1 + 2 * i, 1 + 2 * i + 2);
        let maxRange = Math.max(...curArray);
        for (let j = 0; j < 5; j++) {
          cnnLayerRangesComponent.push(maxRange);
        }
      }
      cnnLayerRangesComponent.push(1);

      let cnnLayerRangesGlobal = [1];
      let maxRange = Math.max(...cnnLayerRangesLocal.slice(1,
        cnnLayerRangesLocal.length - 1));
      for (let i = 0; i < numLayers - 2; i++) {
        cnnLayerRangesGlobal.push(maxRange);
      }
      cnnLayerRangesGlobal.push(1);

      // Update the ranges dictionary
      cnnLayerRanges.local = cnnLayerRangesLocal;
      cnnLayerRanges.module = cnnLayerRangesComponent;
      cnnLayerRanges.global = cnnLayerRangesGlobal;
      cnnLayerRanges.output = [0, d3.max(cnn[cnn.length - 1].map(d => d.output))];

      cnnLayerRangesStore.set(cnnLayerRanges);
      cnnLayerMinMaxStore.set(cnnLayerMinMax);
    };

    /* global d3 */

    // Configs
    const layerColorScales$3 = overviewConfig.layerColorScales;
    const nodeLength$3 = overviewConfig.nodeLength;
    const intermediateColor = overviewConfig.intermediateColor;
    const svgPaddings$1 = overviewConfig.svgPaddings;

    // Shared variables
    let svg$2 = undefined;
    svgStore.subscribe( value => {svg$2 = value;} );
    vSpaceAroundGapStore.subscribe( value => {} );

    /**
     * Move one layer horizontally
     * @param {object} arg Multiple arguments {
     *   layerIndex: current layer index
     *   targetX: destination x
     *   disable: make this layer unresponsible
     *   delay: animation delay
     *   opacity: change the current layer's opacity
     *   specialIndex: avoid manipulating `specialIndex`th node
     *   onEndFunc: call this function when animation finishes
     *   transitionName: animation ID
     * }
     */
    const moveLayerX = (arg) => {
      let layerIndex = arg.layerIndex;
      let targetX = arg.targetX;
      let disable = arg.disable;
      let delay = arg.delay;
      let opacity = arg.opacity;
      let specialIndex = arg.specialIndex;
      let onEndFunc = arg.onEndFunc;
      let transitionName = arg.transitionName === undefined ? 'move' : arg.transitionName;
      let duration = arg.duration === undefined ? 500 : arg.duration;

      // Move the selected layer
      let curLayer = svg$2.select(`g#cnn-layer-group-${layerIndex}`);
      curLayer.selectAll('g.node-group').each((d, i, g) => {
        d3.select(g[i])
          .style('cursor', disable && i !== specialIndex ? 'default' : 'pointer')
          .style('pointer-events', disable && i !== specialIndex ? 'none' : 'all')
          .select('image')
          .transition(transitionName)
          .ease(d3.easeCubicInOut)
          .delay(delay)
          .duration(duration)
          .attr('x', targetX);
        
        d3.select(g[i])
          .style('cursor', disable && i !== specialIndex ? 'default' : 'pointer')
          .style('pointer-events', disable && i !== specialIndex ? 'none' : 'all')
          .select('circle.dense-circle')
          .transition(transitionName)
          .delay(delay)
          .duration(duration)
          .attr('cx', targetX + nodeLength$3 / 2);
        
        d3.select(g[i])
          .select('rect.bounding')
          .transition(transitionName)
          .ease(d3.easeCubicInOut)
          .delay(delay)
          .duration(duration)
          .attr('x', targetX);
        
        d3.select(g[i])
          .select('circle.bounding')
          .transition(transitionName)
          .delay(delay)
          .duration(duration)
          .attr('cx', targetX + nodeLength$3 / 2);  
        
        if (opacity !== undefined && i !== specialIndex) {
          d3.select(g[i])
            .select('image')
            .style('opacity', opacity);
        }
      });
      svg$2.selectAll();
      // Also move the layer labels
      svg$2.selectAll(`g#layer-label-${layerIndex}`)
        .transition(transitionName)
        .ease(d3.easeCubicInOut)
        .delay(delay)
        .duration(duration)
        .attr('transform', () => {
          let x = targetX + nodeLength$3 / 2;
          let y = (svgPaddings$1.top) / 2 + 5;
          return `translate(${x}, ${y})`;
        })
        .on('end', onEndFunc);

      svg$2.selectAll(`g#layer-detailed-label-${layerIndex}`)
        .transition(transitionName)
        .ease(d3.easeCubicInOut)
        .delay(delay)
        .duration(duration)
        .attr('transform', () => {
          let x = targetX + nodeLength$3 / 2;
          let y = (svgPaddings$1.top) / 2 + 5;
          return `translate(${x}, ${y})`;
        })
        .on('end', onEndFunc);
    };

    /**
     * Append a gradient definition to `group`
     * @param {string} gradientID CSS ID for the gradient def
     * @param {[{offset: number, color: string, opacity: number}]} stops Gradient stops
     * @param {element} group Element to append def to
     */
    const addOverlayGradient = (gradientID, stops, group) => {
      if (group === undefined) {
        group = svg$2;
      }

      // Create a gradient
      let defs = group.append("defs")
        .attr('class', 'overlay-gradient');

      let gradient = defs.append("linearGradient")
        .attr("id", gradientID)
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "100%")
        .attr("y2", "100%");
      
      stops.forEach(s => {
        gradient.append('stop')
          .attr('offset', s.offset)
          .attr('stop-color', s.color)
          .attr('stop-opacity', s.opacity);
      });
    };

    /**
     * Draw the legend for intermediate layer
     * @param {object} arg 
     * {
     *   legendHeight: height of the legend rectangle
     *   curLayerIndex: the index of selected layer
     *   range: colormap range
     *   group: group to append the legend
     *   minMax: {min: min value, max: max value}
     *   width: width of the legend
     *   x: x position of the legend
     *   y: y position of the legend
     *   isInput: if the legend is for the input layer (special handle black to
     *      white color scale)
     *   colorScale: d3 color scale
     *   gradientAppendingName: name of the appending gradient
     *   gradientGap: gap to make the color lighter
     * }
     */
    const drawIntermediateLayerLegend = (arg) => {
      let legendHeight = arg.legendHeight,
        curLayerIndex = arg.curLayerIndex,
        range = arg.range,
        group = arg.group,
        minMax = arg.minMax,
        width = arg.width,
        x = arg.x,
        y = arg.y,
        isInput = arg.isInput,
        colorScale = arg.colorScale,
        gradientAppendingName = arg.gradientAppendingName,
        gradientGap = arg.gradientGap;
      
      if (colorScale === undefined) { colorScale = layerColorScales$3.conv; }
      if (gradientGap === undefined) { gradientGap = 0; }
      
      // Add a legend color gradient
      let gradientName = 'url(#inputGradient)';
      let normalizedColor = v => colorScale(v * (1 - 2 * gradientGap) + gradientGap);

      if (!isInput) {
        let leftValue = (minMax.min + range / 2) / range,
          zeroValue = (0 + range / 2) / range,
          rightValue = (minMax.max + range / 2) / range,
          totalRange = minMax.max - minMax.min,
          zeroLocation = (0 - minMax.min) / totalRange,
          leftMidValue = leftValue + (zeroValue - leftValue)/2,
          rightMidValue = zeroValue + (rightValue - zeroValue)/2;

        let stops = [
          {offset: 0, color: normalizedColor(leftValue), opacity: 1},
          {offset: zeroLocation / 2,
            color: normalizedColor(leftMidValue),
            opacity: 1},
          {offset: zeroLocation,
            color: normalizedColor(zeroValue),
            opacity: 1},
          {offset: zeroLocation + (1 - zeroValue) / 2,
            color: normalizedColor(rightMidValue),
            opacity: 1},
          {offset: 1, color: normalizedColor(rightValue), opacity: 1}
        ];

        if (gradientAppendingName === undefined) {
          addOverlayGradient('intermediate-legend-gradient', stops, group);
          gradientName = 'url(#intermediate-legend-gradient)';
        } else {
          addOverlayGradient(`${gradientAppendingName}`, stops, group);
          gradientName = `url(#${gradientAppendingName})`;
        }
      }

      let legendScale = d3.scaleLinear()
        .range([0, width - 1.2])
        .domain(isInput ? [0, range] : [minMax.min, minMax.max]);

      let legendAxis = d3.axisBottom()
        .scale(legendScale)
        .tickFormat(d3.format(isInput ? 'd' : '.2f'))
        .tickValues(isInput ? [0, range] : [minMax.min, 0, minMax.max]);
      
      let intermediateLegend = group.append('g')
        .attr('class', `intermediate-legend-${curLayerIndex - 1}`)
        .attr('transform', `translate(${x}, ${y})`);
      
      let legendGroup = intermediateLegend.append('g')
        .attr('transform', `translate(0, ${legendHeight - 3})`)
        .call(legendAxis);
      
      legendGroup.selectAll('text')
        .style('font-size', '9px')
        .style('fill', intermediateColor);
      
      legendGroup.selectAll('path, line')
        .style('stroke', intermediateColor);

      intermediateLegend.append('rect')
        .attr('width', width)
        .attr('height', legendHeight)
        .attr('transform', `rotate(${isInput ? 180 : 0},
      ${width / 2}, ${legendHeight / 2})`)
        .style('fill', gradientName);
    };

    /**
     * Draw an very neat arrow!
     * @param {object} arg 
     * {
     *   group: element to append this arrow to
     *   sx: source x
     *   sy: source y
     *   tx: target x
     *   ty: target y
     *   dr: radius of curve (I'm using a circle)
     *   hFlip: the direction to choose the circle (there are always two ways)
     * }
     */
    const drawArrow = (arg) => {
      let group = arg.group,
        sx = arg.sx,
        sy = arg.sy,
        tx = arg.tx,
        ty = arg.ty,
        dr = arg.dr,
        hFlip = arg.hFlip,
        marker = arg.marker === undefined ? 'marker' : arg.marker;

      /* Cool graphics trick -> merge translate and scale together
      translateX = (1 - scaleX) * tx,
      translateY = (1 - scaleY) * ty;
      */
      
      let arrow = group.append('g')
        .attr('class', 'arrow-group');

      arrow.append('path')
        .attr("d", `M${sx},${sy}A${dr},${dr} 0 0,${hFlip ? 0 : 1} ${tx},${ty}`)
        .attr('marker-end', `url(#${marker})`)
        .style('stroke', 'gray')
        .style('fill', 'none');
    };

    /* global d3 */

    // Configs
    const layerColorScales$4 = overviewConfig.layerColorScales;
    const nodeLength$4 = overviewConfig.nodeLength;
    const plusSymbolRadius = overviewConfig.plusSymbolRadius;
    const numLayers$1 = overviewConfig.numLayers;
    const intermediateColor$1 = overviewConfig.intermediateColor;
    const kernelRectLength = overviewConfig.kernelRectLength;
    const svgPaddings$2 = overviewConfig.svgPaddings;
    const gapRatio$1 = overviewConfig.gapRatio;
    const overlayRectOffset = overviewConfig.overlayRectOffset;
    const formater$1 = d3.format('.4f');
    let isEndOfAnimation = false;

    // Shared variables
    let svg$3 = undefined;
    svgStore.subscribe( value => {svg$3 = value;} );

    let vSpaceAroundGap$1 = undefined;
    vSpaceAroundGapStore.subscribe( value => {vSpaceAroundGap$1 = value;} );

    let hSpaceAroundGap$1 = undefined;
    hSpaceAroundGapStore.subscribe( value => {hSpaceAroundGap$1 = value;} );

    let cnn$1 = undefined;
    cnnStore.subscribe( value => {cnn$1 = value;} );

    let nodeCoordinate$1 = undefined;
    nodeCoordinateStore.subscribe( value => {nodeCoordinate$1 = value;} );

    let selectedScaleLevel$1 = undefined;
    selectedScaleLevelStore.subscribe( value => {selectedScaleLevel$1 = value;} );

    let cnnLayerRanges$1 = undefined;
    cnnLayerRangesStore.subscribe( value => {cnnLayerRanges$1 = value;} );

    let cnnLayerMinMax$1 = undefined;
    cnnLayerMinMaxStore.subscribe( value => {cnnLayerMinMax$1 = value;} );

    let needRedraw = [undefined, undefined];
    needRedrawStore.subscribe( value => {needRedraw = value;} );

    let shouldIntermediateAnimate = undefined;
    shouldIntermediateAnimateStore.subscribe(value => {
      shouldIntermediateAnimate = value;
    });

    let detailedMode$1 = undefined;
    detailedModeStore.subscribe( value => {detailedMode$1 = value;} );

    let intermediateLayerPosition = undefined;
    intermediateLayerPositionStore.subscribe ( value => {intermediateLayerPosition = value;} );

    // let curRightX = 0;

    /**
     * Draw the intermediate layer activation heatmaps
     * @param {element} image Neuron heatmap image
     * @param {number} range Colormap range
     * @param {function} colorScale Colormap
     * @param {number} length Image length
     * @param {[[number]]} dataMatrix Heatmap matrix
     */
    const drawIntermidiateImage = (image, range, colorScale, length,
      dataMatrix) => {
      // Set up a buffer convas in order to resize image
      let imageLength = length;
      let bufferCanvas = document.createElement("canvas");
      let bufferContext = bufferCanvas.getContext("2d");
      bufferCanvas.width = imageLength;
      bufferCanvas.height = imageLength;

      // Fill image pixel array
      let imageSingle = bufferContext.getImageData(0, 0, imageLength, imageLength);
      let imageSingleArray = imageSingle.data;

      for (let i = 0; i < imageSingleArray.length; i+=4) {
        let pixeIndex = Math.floor(i / 4);
        let row = Math.floor(pixeIndex / imageLength);
        let column = pixeIndex % imageLength;
        let color = d3.rgb(colorScale((dataMatrix[row][column] + range / 2) / range));

        imageSingleArray[i] = color.r;
        imageSingleArray[i + 1] = color.g;
        imageSingleArray[i + 2] = color.b;
        imageSingleArray[i + 3] = 255;
      }

      // canvas.toDataURL() only exports image in 96 DPI, so we can hack it to have
      // higher DPI by rescaling the image using canvas magic
      let largeCanvas = document.createElement('canvas');
      largeCanvas.width = nodeLength$4 * 3;
      largeCanvas.height = nodeLength$4 * 3;
      let largeCanvasContext = largeCanvas.getContext('2d');

      // Use drawImage to resize the original pixel array, and put the new image
      // (canvas) into corresponding canvas
      bufferContext.putImageData(imageSingle, 0, 0);
      largeCanvasContext.drawImage(bufferCanvas, 0, 0, imageLength, imageLength,
        0, 0, nodeLength$4 * 3, nodeLength$4 * 3);
      
      let imageDataURL = largeCanvas.toDataURL();
      image.attr('xlink:href', imageDataURL);

      // Destory the buffer canvas
      bufferCanvas.remove();
      largeCanvas.remove();
    };

    /**
     * Create a node group for the intermediate layer
     * @param {number} curLayerIndex Intermediate layer index
     * @param {number} selectedI Clicked node index
     * @param {element} groupLayer Group element
     * @param {number} x Node's x
     * @param {number} y Node's y
     * @param {number} nodeIndex Node's index
     * @param {function} intermediateNodeMouseOverHandler Mouse over handler
     * @param {function} intermediateNodeMouseLeaveHandler Mouse leave handler
     * @param {function} intermediateNodeClicked Mouse click handler
     * @param {bool} interaction Whether support interaction
     */
    const createIntermediateNode = (curLayerIndex, selectedI, groupLayer, x, y,
      nodeIndex, stride, intermediateNodeMouseOverHandler,
      intermediateNodeMouseLeaveHandler, intermediateNodeClicked, interaction) => {
      let newNode = groupLayer.append('g')
        .datum(cnn$1[curLayerIndex - 1][nodeIndex])
        .attr('class', 'intermediate-node')
        .attr('cursor', interaction ? 'pointer': 'default')
        .attr('pointer-events', interaction ? 'all': 'none')
        .attr('node-index', nodeIndex)
        .on('mouseover', intermediateNodeMouseOverHandler)
        .on('mouseleave', intermediateNodeMouseLeaveHandler)
        .on('click', (d, g, i) => intermediateNodeClicked(d, g, i, selectedI,
          curLayerIndex));
      
      newNode.append('image')
        .attr('width', nodeLength$4)
        .attr('height', nodeLength$4)
        .attr('x', x)
        .attr('y', y);

      // Overlay the image with a mask of many small rectangles
      let strideTime = Math.floor(nodeLength$4 / stride);
      let overlayGroup = newNode.append('g')
        .attr('class', 'overlay-group')
        .attr('transform', `translate(${x}, ${y})`);
      
      for (let i = 0; i < strideTime; i++) {
        for (let j = 0; j < strideTime; j++) {
          overlayGroup.append('rect')
            .attr('class', `mask-overlay mask-${i}-${j}`)
            .attr('width', stride)
            .attr('height', stride)
            .attr('x', i * stride)
            .attr('y', j * stride)
            .style('fill', 'var(--light-gray)')
            .style('stroke', 'var(--light-gray)')
            .style('opacity', 1);
        }
      }

      // Add a rectangle to show the border
      newNode.append('rect')
        .attr('class', 'bounding')
        .attr('width', nodeLength$4)
        .attr('height', nodeLength$4)
        .attr('x', x)
        .attr('y', y)
        .style('fill', 'none')
        .style('stroke', intermediateColor$1)
        .style('stroke-width', 1);
      
      return newNode;
    };

    const startOutputAnimation = (kernelGroup, tickTime1D, stride, delay,
      curLayerIndex) => {
      const slidingAnimation = () => {
        let originX = +kernelGroup.attr('data-origin-x');
        let originY = +kernelGroup.attr('data-origin-y');
        let oldTick = +kernelGroup.attr('data-tick');
        let i = (oldTick) % tickTime1D;
        let j = Math.floor((oldTick) / tickTime1D);
        let x = originX + i * stride;
        let y = originY + j * stride;
        let newTick = (oldTick + 1) % (tickTime1D * tickTime1D);

        // Remove one mask rect at each tick
        svg$3.selectAll(`rect.mask-${i}-${j}`)
          .transition('window-sliding-mask')
          .delay(delay + 100)
          .duration(300)
          .style('opacity', 0);

          kernelGroup.attr('data-tick', newTick)
          .transition('window-sliding-input')
          .delay(delay)
          .duration(200)
          .attr('transform', `translate(${x}, ${y})`)
          .on('end', () => {
            if (newTick === 0) {
              /* Uncomment to wrap the sliding
              svg.selectAll(`rect.mask-overlay`)
                .transition('window-sliding-mask')
                .delay(delay - 200)
                .duration(300)
                .style('opacity', 1);
              */

              // Stop the animation
              // Be careful with animation racing so call this function here instead
              // of under selectALL
              if (!isEndOfAnimation) {
                animationButtonClicked(curLayerIndex);
              }
            }
            if (shouldIntermediateAnimate) {
              slidingAnimation();
            }
          });
      };
      slidingAnimation();
    };

    const startIntermediateAnimation = (kernelGroupInput, kernelGroupResult,
      tickTime1D, stride) => {
      let delay = 200;
      const slidingAnimation = () => {
        let originX = +kernelGroupInput.attr('data-origin-x');
        let originY = +kernelGroupInput.attr('data-origin-y');
        let originXResult = +kernelGroupResult.attr('data-origin-x');
        let oldTick = +kernelGroupInput.attr('data-tick');
        let i = (oldTick) % tickTime1D;
        let j = Math.floor((oldTick) / tickTime1D);
        let x = originX + i * stride;
        let y = originY + j * stride;
        let xResult = originXResult + (oldTick % tickTime1D) * stride;
        let newTick = (oldTick + 1) % (tickTime1D * tickTime1D);

        // Remove one mask rect at each tick
        svg$3.selectAll(`rect.mask-${i}-${j}`)
          .transition('window-sliding-mask')
          .delay(delay + 100)
          .duration(300)
          .style('opacity', 0);

        kernelGroupInput.attr('data-tick', newTick)
          .transition('window-sliding-input')
          .delay(delay)
          .duration(200)
          .attr('transform', `translate(${x}, ${y})`);

        kernelGroupResult.attr('data-tick', newTick)
          .transition('window-sliding-result')
          .delay(delay)
          .duration(200)
          .attr('transform', `translate(${xResult}, ${y})`)
          .on('end', () => {
            /* Uncomment to wrap the sliding
            if (newTick === 0) {
              svg.selectAll(`rect.mask-overlay`)
                .transition('window-sliding-mask')
                .delay(delay - 200)
                .duration(300)
                .style('opacity', 1);
            }
            */
            if (shouldIntermediateAnimate) {
              slidingAnimation();
            }
          });
      };
      slidingAnimation();
    };

    const animationButtonClicked = (curLayerIndex) => {
      if (d3.event !== null) {
        d3.event.stopPropagation();
      }
      
      let delay = 200;
      let tickTime1D = nodeLength$4 / (kernelRectLength * 3);
      let stride = kernelRectLength * 3; 

      if (isEndOfAnimation) {
        // Start the animation
        shouldIntermediateAnimateStore.set(true);

        // Show kernel
        svg$3.selectAll('.kernel-clone')
          .transition()
          .duration(300)
          .style('opacity', 1);

        // Restore the mask
        svg$3.selectAll(`rect.mask-overlay`)
          .transition()
          .duration(300)
          .style('opacity', 1);

        // Start the intermediate animation
        for (let i  = 0; i < nodeCoordinate$1[curLayerIndex - 1].length; i++) {
          startIntermediateAnimation(d3.select(`.kernel-input-${i}`),
            d3.select(`.kernel-result-${i}`), tickTime1D, stride);
        }

        // Start the output animation
        startOutputAnimation(d3.select('.kernel-output'),
          tickTime1D, stride, delay, curLayerIndex);
        
        // Change the flow edge style
        svg$3.selectAll('path.flow-edge')
          .attr('stroke-dasharray', '4 2')
          .attr('stroke-dashoffset', 0)
          .each((d, i, g) => animateEdge(d, i, g, 0 - 1000));

        // Change button icon
        svg$3.select('.animation-control-button')
          .attr('xlink:href', '/assets/img/fast_forward.svg');
        
        isEndOfAnimation = false;

      } else {
        // End the animation
        shouldIntermediateAnimateStore.set(false);
        
        // Show all intermediate and output results
        svg$3.selectAll(`rect.mask-overlay`)
          .transition('skip')
          .duration(600)
          .style('opacity', 0);
        
        // Move kernel to the beginning to prepare for the next animation
        let kernelClones = svg$3.selectAll('.kernel-clone');
        kernelClones.attr('data-tick', 0)
          .transition('skip')
          .duration(300)
          .style('opacity', 0)
          .on('end', (d, i, g) => {
            let element = d3.select(g[i]);
            let originX = +element.attr('data-origin-x');
            let originY = +element.attr('data-origin-y');
            element.attr('transform', `translate(${originX}, ${originY})`);
          });
        
        // Change flow edge style
        svg$3.selectAll('path.flow-edge')
          .interrupt()
          .attr('stroke-dasharray', '0 0');
        
        // Change button icon
        svg$3.select('.animation-control-button')
          .attr('xlink:href', '/assets/img/redo.svg');
        
        isEndOfAnimation = true;
      }
    };

    const animateEdge = (d, i, g, dashoffset) => {
      let curPath = d3.select(g[i]);
      curPath.transition()
        .duration(60000)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', dashoffset)
        .on('end', (d, i, g) => {
          if (shouldIntermediateAnimate) {
            animateEdge(d, i, g, dashoffset - 2000);
          }
        });
    };

    /**
     * Draw one intermediate layer
     * @param {number} curLayerIndex 
     * @param {number} leftX X value of intermediate layer left border
     * @param {number} rightX X value of intermediate layer right border
     * @param {number} rightStart X value of right component starting anchor
     * @param {number} intermediateGap The inner gap
     * @param {number} d Clicked node bounded data
     * @param {number} i Clicked node index
     * @param {function} intermediateNodeMouseOverHandler Mouse over handler
     * @param {function} intermediateNodeMouseLeaveHandler Mouse leave handler
     * @param {function} intermediateNodeClicked Mouse click handler
     */
    const drawIntermediateLayer = (curLayerIndex, leftX, rightX, rightStart,
      intermediateGap, d, i, intermediateNodeMouseOverHandler,
      intermediateNodeMouseLeaveHandler, intermediateNodeClicked) => {
      
      // curRightX = rightStart;

      // Add the intermediate layer
      let intermediateLayer = svg$3.append('g')
        .attr('class', 'intermediate-layer')
        .style('opacity', 0);
      
      // Recovert the animation counter
      isEndOfAnimation = false;
      
      // Tried to add a rectangle to block the intermediate because of webkit's
      // horrible support (decade old bug) for foreignObject. It doesnt work either.
      // https://bugs.webkit.org/show_bug.cgi?id=23113
      // (1). ForeignObject's inside position is wrong on webkit
      // (2). 'opacity' of ForeignObject doesn't work on webkit
      // (3). ForeignObject always show up at the front regardless the svg
      //      stacking order on webkit

      let intermediateX1 = leftX + nodeLength$4 + intermediateGap;
      let intermediateX2 = intermediateX1 + nodeLength$4 + intermediateGap * 1.5;

      let range = cnnLayerRanges$1[selectedScaleLevel$1][curLayerIndex];
      let colorScale = layerColorScales$4[d.type];
      let intermediateMinMax = [];
      
      // Copy the previsious layer to construct foreignObject placeholder
      // Also add edges from/to the intermediate layer in this loop
      let linkData = [];

      // Accumulate the intermediate sum
      // let itnermediateSumMatrix = init2DArray(d.output.length,
      //  d.output.length, 0);

      // Compute the min max of all kernel weights in the intermediate layer
      let kernelExtents = d.inputLinks.map(link => getExtent(link.weight));
      let kernelExtent = kernelExtents.reduce((acc, cur) => {
        return [Math.min(acc[0], cur[0]), Math.max(acc[1], cur[1])];
      });
      let kernelRange = 2 * (Math.round(
        Math.max(...kernelExtent.map(Math.abs)) * 1000) / 1000);
      let kernelColorGap = 0.2;

      // Compute stride for the kernel animation
      let stride = kernelRectLength * 3; 

      // Also add the overlay mask on the output node
      let outputY = nodeCoordinate$1[curLayerIndex][i].y;
      let curNode = svg$3.select(`#layer-${curLayerIndex}-node-${i}`);
      let outputOverlayGroup = curNode.append('g')
        .attr('class', 'overlay-group')
        .attr('transform', `translate(${rightX}, ${outputY})`);

      let strideTime = Math.floor(nodeLength$4 / stride);
      
      for (let i = 0; i < strideTime; i++) {
        for (let j = 0; j < strideTime; j++) {
          outputOverlayGroup.append('rect')
            .attr('class', `mask-overlay mask-${i}-${j}`)
            .attr('width', stride)
            .attr('height', stride)
            .attr('x', i * stride)
            .attr('y', j * stride)
            .style('fill', 'var(--light-gray)')
            .style('stroke', 'var(--light-gray)')
            .style('opacity', 1);
        }
      }

      // Make sure the bounding box is on top of other things
      curNode.select('rect.bounding').raise();

      // Add sliding kernel for the output node
      let kernelGroup = intermediateLayer.append('g')
        .attr('class', `kernel kernel-output kernel-clone`)
        .attr('transform', `translate(${rightX}, ${outputY})`);

      kernelGroup.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', kernelRectLength * 3)
        .attr('height', kernelRectLength * 3)
        .attr('fill', 'none')
        .attr('stroke', intermediateColor$1);
      
      kernelGroup.attr('data-tick', 0)
        .attr('data-origin-x', rightX)
        .attr('data-origin-y', outputY);

      let delay = 200;
      let tickTime1D = nodeLength$4 / (kernelRectLength * 3);

      startOutputAnimation(kernelGroup, tickTime1D, stride, delay, curLayerIndex);

      // First intermediate layer
      nodeCoordinate$1[curLayerIndex - 1].forEach((n, ni) => {

        // Compute the intermediate value
        let inputMatrix = cnn$1[curLayerIndex - 1][ni].output;
        let kernelMatrix = cnn$1[curLayerIndex][i].inputLinks[ni].weight;
        let interMatrix = singleConv(inputMatrix, kernelMatrix);

        // Compute the intermediate layer min max
        intermediateMinMax.push(getExtent(interMatrix));

        // Update the intermediate sum
        // itnermediateSumMatrix = matrixAdd(itnermediateSumMatrix, interMatrix);

        // Layout the canvas and rect
        let newNode = createIntermediateNode(curLayerIndex, i, intermediateLayer,
          intermediateX1, n.y, ni, stride, intermediateNodeMouseOverHandler,
          intermediateNodeMouseLeaveHandler, intermediateNodeClicked, true);
        
        // Draw the image
        let image = newNode.select('image');
        drawIntermidiateImage(image, range, colorScale, d.output.length,
          interMatrix);      

        // Edge: input -> intermediate1
        linkData.push({
          source: getOutputKnot({x: leftX, y: n.y}),
          target: getInputKnot({x: intermediateX1, y: n.y}),
          name: `input-${ni}-inter1-${ni}`
        });

        // Edge: intermediate1 -> intermediate2-1
        linkData.push({
          source: getOutputKnot({x: intermediateX1, y: n.y}),
          target: getInputKnot({x: intermediateX2,
            y: nodeCoordinate$1[curLayerIndex][i].y}),
          name: `inter1-${ni}-inter2-1`
        });

        // Create a small kernel illustration
        // Here we minus 2 because of no padding
        // let tickTime1D = nodeLength / (kernelRectLength) - 2;
        let kernelRectX = leftX - kernelRectLength * 3 * 2;
        let kernelGroup = intermediateLayer.append('g')
          .attr('class', `kernel kernel-${ni}`)
          .attr('transform', `translate(${kernelRectX}, ${n.y})`);

        let weightText = 'Kernel weights: [';
        let f2 = d3.format('.2f');
        for (let r = 0; r < kernelMatrix.length; r++) {
          for (let c = 0; c < kernelMatrix[0].length; c++) {
            kernelGroup.append('rect')
              .attr('class', 'kernel')
              .attr('x', kernelRectLength * c)
              .attr('y', kernelRectLength * r)
              .attr('width', kernelRectLength)
              .attr('height', kernelRectLength)
              .attr('fill', gappedColorScale(layerColorScales$4.weight, kernelRange,
                kernelMatrix[r][c], kernelColorGap));

            let sep = '';
            if (c === 0 && r == 0) { sep = ''; }
            else if (c === 0) { sep = '; '; }
            else { sep = ', '; }
            weightText = weightText.concat(sep, `${f2(kernelMatrix[r][c])}`);
          }
        }
        weightText = weightText.concat(']');

        kernelGroup.append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', kernelRectLength * 3)
          .attr('height', kernelRectLength * 3)
          .attr('fill', 'none')
          .attr('stroke', intermediateColor$1);
        
        kernelGroup.style('pointer-events', 'all')
          .style('cursor', 'crosshair')
          .on('mouseover', () => {
            hoverInfoStore.set( {show: true, text: weightText} );
          })
          .on('mouseleave', () => {
            hoverInfoStore.set( {show: false, text: weightText} );
          })
          .on('click', () => {d3.event.stopPropagation();});

        // Sliding the kernel on the input channel and result channel at the same
        // time
        let kernelGroupInput = kernelGroup.clone(true)
          .style('pointer-events', 'none')
          .style('cursor', 'pointer')
          .classed('kernel-clone', true)
          .classed(`kernel-input-${ni}`, true);

        kernelGroupInput.style('opacity', 0.9)
          .selectAll('rect.kernel')
          .style('opacity', 0.7);

        kernelGroupInput.attr('transform', `translate(${leftX}, ${n.y})`)
          .attr('data-tick', 0)
          .attr('data-origin-x', leftX)
          .attr('data-origin-y', n.y);

        let kernelGroupResult = kernelGroup.clone(true)
          .style('pointer-events', 'none')
          .style('cursor', 'pointer')
          .classed('kernel-clone', true)
          .classed(`kernel-result-${ni}`, true);

        kernelGroupResult.style('opacity', 0.9)
          .selectAll('rect.kernel')
          .style('fill', 'none');

        kernelGroupResult.attr('transform',
          `translate(${intermediateX1}, ${n.y})`)
          .attr('data-origin-x', intermediateX1)
          .attr('data-origin-y', n.y);
        
        startIntermediateAnimation(kernelGroupInput, kernelGroupResult, tickTime1D,
          stride);
      });

      // Aggregate the intermediate min max
      let aggregatedExtent = intermediateMinMax.reduce((acc, cur) => {
        return [Math.min(acc[0], cur[0]), Math.max(acc[1], cur[1])];
      });
      let aggregatedMinMax = {min: aggregatedExtent[0], max: aggregatedExtent[1]};

      // Draw the plus operation symbol
      let symbolY = nodeCoordinate$1[curLayerIndex][i].y + nodeLength$4 / 2;
      let symbolRectHeight = 1;
      let symbolGroup = intermediateLayer.append('g')
        .attr('class', 'plus-symbol')
        .attr('transform', `translate(${intermediateX2 + plusSymbolRadius}, ${symbolY})`);
      
      symbolGroup.append('rect')
        .attr('x', -plusSymbolRadius)
        .attr('y', -plusSymbolRadius)
        .attr('width', 2 * plusSymbolRadius)
        .attr('height', 2 * plusSymbolRadius)
        .attr('rx', 3)
        .attr('ry', 3)
        .style('fill', 'none')
        .style('stroke', intermediateColor$1);
      
      symbolGroup.append('rect')
        .attr('x', -(plusSymbolRadius - 3))
        .attr('y', -symbolRectHeight / 2)
        .attr('width', 2 * (plusSymbolRadius - 3))
        .attr('height', symbolRectHeight)
        .style('fill', intermediateColor$1);

      symbolGroup.append('rect')
        .attr('x', -symbolRectHeight / 2)
        .attr('y', -(plusSymbolRadius - 3))
        .attr('width', symbolRectHeight)
        .attr('height', 2 * (plusSymbolRadius - 3))
        .style('fill', intermediateColor$1);

      // Place the bias rectangle below the plus sign if user clicks the firrst
      // conv node
      if (i == 0) {
        // Add bias symbol to the plus symbol
        symbolGroup.append('circle')
            .attr('cx', 0)
            .attr('cy', nodeLength$4 / 2 + kernelRectLength)
            .attr('r', 4)
            .style('stroke', intermediateColor$1)
            .style('cursor', 'crosshair')
            .style('fill', gappedColorScale(layerColorScales$4.weight, kernelRange,
              d.bias, kernelColorGap))
            .on('mouseover', () => {
              hoverInfoStore.set( {show: true, text: `Bias: ${formater$1(d.bias)}`} );
            })
            .on('mouseleave', () => {
              hoverInfoStore.set( {show: false, text: `Bias: ${formater$1(d.bias)}`} );
            });

        // Link from bias to the plus symbol
        linkData.push({
          source: {x: intermediateX2 + plusSymbolRadius,
            y: nodeCoordinate$1[curLayerIndex][i].y + nodeLength$4},
          target: {x: intermediateX2 + plusSymbolRadius,
            y: nodeCoordinate$1[curLayerIndex][i].y + nodeLength$4 / 2 + plusSymbolRadius},
          name: `bias-plus`
        });
      } else {
        // Add bias symbol to the plus symbol
        symbolGroup.append('circle')
          .attr('cx', 0)
          .attr('cy', -nodeLength$4 / 2 - kernelRectLength)
          .attr('r', 4)
          .style('stroke', intermediateColor$1)
          .style('cursor', 'crosshair')
          .style('fill', gappedColorScale(layerColorScales$4.weight, kernelRange,
            d.bias, kernelColorGap))
          .on('mouseover', () => {
            hoverInfoStore.set( {show: true, text: `Bias: ${formater$1(d.bias)}`} );
          })
          .on('mouseleave', () => {
            hoverInfoStore.set( {show: false, text: `Bias: ${formater$1(d.bias)}`} );
          });
        
        // Link from bias to the plus symbol
        linkData.push({
          source: {x: intermediateX2 + plusSymbolRadius,
            y: nodeCoordinate$1[curLayerIndex][i].y},
          target: {x: intermediateX2 + plusSymbolRadius,
            y: nodeCoordinate$1[curLayerIndex][i].y + nodeLength$4 / 2 - plusSymbolRadius},
          name: `bias-plus`
        });
      }

      // Link from the plus symbol to the output
      linkData.push({
        source: getOutputKnot({x: intermediateX2 + 2 * plusSymbolRadius - nodeLength$4,
          y: nodeCoordinate$1[curLayerIndex][i].y}),
        target: getInputKnot({x: rightX,
          y: nodeCoordinate$1[curLayerIndex][i].y}),
        name: `symbol-output`
      });
      
      // Output -> next layer
      linkData.push({
        source: getOutputKnot({x: rightX,
          y: nodeCoordinate$1[curLayerIndex][i].y}),
        target: getInputKnot({x: rightStart,
          y: nodeCoordinate$1[curLayerIndex][i].y}),
        name: `output-next`
      });

      // Draw the layer label
      intermediateLayer.append('g')
        .attr('class', 'layer-intermediate-label layer-label')
        .attr('transform', () => {
          let x = intermediateX1 + nodeLength$4 / 2;
          let y = (svgPaddings$2.top) / 2 + 10;
          return `translate(${x}, ${y})`;
        })
        .classed('hidden', detailedMode$1)
        .append('text')
        .style('text-anchor', 'middle')
        .style('dominant-baseline', 'middle')
        .style('font-weight', 800)
        .style('opacity', '0.8')
        .text('临时层');
      
      intermediateLayer.append('g')
        .attr('class', 'animation-control')
        .attr('transform', () => {
          let x = intermediateX1 + nodeLength$4 / 2;
          let y = (svgPaddings$2.top) / 2 - 4;
          return `translate(${x}, ${y})`;
        })
        .on('click', () => animationButtonClicked(curLayerIndex))
        .append('image')
        .attr('class', 'animation-control-button')
        .attr('xlink:href', '/assets/img/fast_forward.svg')
        .attr('x', 50)
        .attr('y', 0)
        .attr('height', 13)
        .attr('width', 13);

      // Draw the detailed model layer label
      intermediateLayer.append('g')
        .attr('class', 'layer-intermediate-label layer-detailed-label')
        .attr('transform', () => {
          let x = intermediateX1 + nodeLength$4 / 2;
          let y = (svgPaddings$2.top) / 2 + 5 ;
          return `translate(${x}, ${y})`;
        })
        .classed('hidden', !detailedMode$1)
        .append('text')
        .style('text-anchor', 'middle')
        .style('dominant-baseline', 'middle')
        .style('opacity', '0.7')
        .style('font-weight', 800)
        .append('tspan')
        .text('临时层')
        .append('tspan')
        .style('font-size', '8px')
        .style('font-weight', 'normal')
        .attr('x', 0)
        .attr('dy', '1.5em')
        .text(`(${cnn$1[curLayerIndex][0].output.length},
      ${cnn$1[curLayerIndex][0].output[0].length},
      ${cnn$1[curLayerIndex].length})`);

      // Draw the edges
      let linkGen = d3.linkHorizontal()
        .x(d => d.x)
        .y(d => d.y);
      
      let edgeGroup = intermediateLayer.append('g')
        .attr('class', 'edge-group')
        .lower();
      
      let dashoffset = 0;

      edgeGroup.selectAll('path')
        .data(linkData)
        .enter()
        .append('path')
        .classed('flow-edge', d => d.name !== 'output-next')
        .attr('id', d => `edge-${d.name}`)
        .attr('d', d => linkGen({source: d.source, target: d.target}))
        .style('fill', 'none')
        .style('stroke-width', 1)
        .style('stroke', intermediateColor$1);

      edgeGroup.select('#edge-output-next')
        .style('opacity', 0.1);
      
      edgeGroup.selectAll('path.flow-edge')
        .attr('stroke-dasharray', '4 2')
        .attr('stroke-dashoffset', 0)
        .each((d, i, g) => animateEdge(d, i, g, dashoffset - 1000));
      
      return {intermediateLayer: intermediateLayer,
        intermediateMinMax: aggregatedMinMax,
        kernelRange: kernelRange,
        kernelMinMax: {min: kernelExtent[0], max: kernelExtent[1]}};
    };

    /**
     * Add an annotation for the kernel and the sliding
     * @param {object} arg 
     * {
     *  leftX: X value of the left border of intermedaite layer
     *  group: element group
     *  intermediateGap: the inner gap of intermediate layer
     *  isFirstConv: if this intermediate layer is after the first layer
     *  i: index of the selected node
     * }
     */
    const drawIntermediateLayerAnnotation = (arg) => {
      let leftX = arg.leftX,
        curLayerIndex = arg.curLayerIndex,
        group = arg.group,
        intermediateGap = arg.intermediateGap,
        isFirstConv = arg.isFirstConv,
        i = arg.i;

      let kernelAnnotation = group.append('g')
        .attr('class', 'kernel-annotation');
      
      kernelAnnotation.append('text')
        .text('Kernel')
        .attr('class', 'annotation-text')
        .attr('x', leftX - 5 * kernelRectLength * 3)
        .attr('y', nodeCoordinate$1[curLayerIndex - 1][0].y + kernelRectLength * 3)
        .style('dominant-baseline', 'baseline')
        .style('text-anchor', 'end');

      let sliderX, sliderY, arrowSX, arrowSY, dr;
      let sliderX2, sliderY2, arrowSX2, arrowSY2, dr2, arrowTX2, arrowTY2;
      
      if (isFirstConv) {
        sliderX = leftX;
        sliderY = nodeCoordinate$1[curLayerIndex - 1][0].y - nodeLength$4 -
          kernelRectLength * 3;
        arrowSX = leftX - 5;
        arrowSY = nodeCoordinate$1[curLayerIndex - 1][0].y - nodeLength$4 -
          kernelRectLength * 3 + 5;
        dr = 20;

        sliderX2 = leftX;
        sliderY2 = nodeCoordinate$1[curLayerIndex - 1][0].y + nodeLength$4 +
          kernelRectLength * 3;
        arrowSX2 = leftX - kernelRectLength * 3;
        arrowSY2 = nodeCoordinate$1[curLayerIndex - 1][0].y + nodeLength$4 + 15;
        arrowTX2 = leftX - 13;
        arrowTY2 =  nodeCoordinate$1[curLayerIndex - 1][0].y + 20;
        dr2 = 35;
      } else {
        sliderX = leftX - 3 * kernelRectLength * 3;
        sliderY = nodeCoordinate$1[curLayerIndex - 1][0].y + nodeLength$4 / 3;
        arrowSX = leftX - 2 * kernelRectLength * 3 - 5;
        arrowSY = nodeCoordinate$1[curLayerIndex - 1][0].y + nodeLength$4 - 10;
        dr = 50;

        sliderX2 = leftX - 3 * kernelRectLength * 3;
        sliderY2 = nodeCoordinate$1[curLayerIndex - 1][2].y - 3;
        arrowTX2 = leftX - kernelRectLength * 3 - 4;
        arrowTY2 = nodeCoordinate$1[curLayerIndex - 1][2].y + kernelRectLength * 3 + 6;
        arrowSX2 = leftX - kernelRectLength * 3 - 13;
        arrowSY2 = nodeCoordinate$1[curLayerIndex - 1][2].y + 26;
        dr2 = 20;
      }

      let slideText = kernelAnnotation.append('text')
        .attr('x', sliderX)
        .attr('y', sliderY)
        .attr('class', 'annotation-text')
        .style('dominant-baseline', 'hanging')
        .style('text-anchor', isFirstConv ? 'start' : 'end');
      
      slideText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .text('滑动kernel得到');

      slideText.append('tspan')
        .attr('x', sliderX)
        .attr('dy', '1em')
        .style('dominant-baseline', 'hanging')
        .text('对应的临时层中的结果');

      // slideText.append('tspan')
      //   .attr('x', sliderX)
      //   .attr('dy', '1em')
      //   .style('dominant-baseline', 'hanging')
      //   .text('');

      slideText.append('tspan')
        .attr('x', sliderX)
        .attr('dy', '1.2em')
        .style('dominant-baseline', 'hanging')
        .style('font-weight', 700)
        .text('点击');
      
      slideText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .style('font-weight', 400)
        .text('查看计算细节');

      drawArrow({
        group: group,
        tx: leftX - 7,
        ty: nodeCoordinate$1[curLayerIndex - 1][0].y + nodeLength$4 / 2 - 5,
        sx: arrowSX,
        sy: arrowSY,
        hFlip: isFirstConv,
        dr: dr,
        marker: 'marker'
      });

      // Add kernel annotation
      let slideText2 = kernelAnnotation.append('text')
        .attr('x', sliderX2)
        .attr('y', sliderY2)
        .attr('class', 'annotation-text')
        .style('dominant-baseline', 'hanging')
        .style('text-anchor', isFirstConv ? 'start' : 'end');

      slideText2.append('tspan')
        .style('dominant-baseline', 'hanging')
        .text('每个输入通道');

      slideText2.append('tspan')
        .attr('x', sliderX)
        .attr('dy', '1em')
        .style('dominant-baseline', 'hanging')
        .text('对应一个不同的kernel');

      slideText2.append('tspan')
        .attr('x', sliderX)
        .attr('dy', '1.3em')
        .style('font-weight', 700)
        .style('dominant-baseline', 'hanging')
        .text('将鼠标悬停在左侧kernel');

      slideText2.append('tspan')
        .style('font-weight', 400)
        .style('dominant-baseline', 'hanging')
        .text('查看kernel的值');

      drawArrow({
        group: group,
        tx: arrowTX2,
        ty: arrowTY2,
        sx: arrowSX2,
        sy: arrowSY2,
        dr: dr2,
        hFlip: !isFirstConv,
        marker: 'marker'
      });


      // Add annotation for the sum operation
      let plusAnnotation = group.append('g')
        .attr('class', 'plus-annotation');
      
      let intermediateX2 = leftX + 2 * nodeLength$4 + 2.5 * intermediateGap;
      let textX = intermediateX2;
      let textY = nodeCoordinate$1[curLayerIndex][i].y + nodeLength$4 +
          kernelRectLength * 3;
      
      // Special case 1: first node
      if (i === 0) { textX += 30; }

      // Special case 2: last node 
      if (i === 9) {
        textX = intermediateX2 + plusSymbolRadius - 10;
        textY -= 2.5 * nodeLength$4;
      }

      let plusText = plusAnnotation.append('text')
        .attr('x', textX)
        .attr('y', textY)
        .attr('class', 'annotation-text')
        .style('dominant-baseline', 'hanging')
        .style('text-anchor', 'start');
      
      plusText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .text('将所有通道的临时层对应位置的值相加');
      
      plusText.append('tspan')
        .attr('x', textX)
        .attr('dy', '1em')
        .style('dominant-baseline', 'hanging')
        .text('在加上偏移值得到对应位置的输出');
      
      if (i === 9) {
        drawArrow({
          group: group,
          sx: intermediateX2 + 50,
          sy: nodeCoordinate$1[curLayerIndex][i].y - (nodeLength$4 / 2 + kernelRectLength * 2),
          tx: intermediateX2 + 2 * plusSymbolRadius + 5,
          ty: nodeCoordinate$1[curLayerIndex][i].y + nodeLength$4 / 2 - plusSymbolRadius,
          dr: 50,
          hFlip: false,
          marker: 'marker-alt'
        });
      } else {
        drawArrow({
          group: group,
          sx: intermediateX2 + 35,
          sy: nodeCoordinate$1[curLayerIndex][i].y + nodeLength$4 + kernelRectLength * 2,
          tx: intermediateX2 + 2 * plusSymbolRadius + 5,
          ty: nodeCoordinate$1[curLayerIndex][i].y + nodeLength$4 / 2 + plusSymbolRadius,
          dr: 30,
          hFlip: true,
          marker: 'marker-alt'
        });
      }

      // Add annotation for the bias
      let biasTextY = nodeCoordinate$1[curLayerIndex][i].y;
      if (i === 0) {
        biasTextY += nodeLength$4 + 3 * kernelRectLength;
      } else {
        biasTextY -= 2 * kernelRectLength + 5;
      }
      plusAnnotation.append('text')
        .attr('class', 'annotation-text')
        .attr('x', intermediateX2 + plusSymbolRadius)
        .attr('y', biasTextY)
        .style('text-anchor', 'middle')
        .style('dominant-baseline', i === 0 ? 'hanging' : 'baseline')
        .text('Bias');
    };

    /**
     * Append a filled rectangle under a pair of nodes.
     * @param {number} curLayerIndex Index of the selected layer
     * @param {number} i Index of the selected node
     * @param {number} leftX X value of the left border of intermediate layer
     * @param {number} intermediateGap Inner gap of this intermediate layer
     * @param {number} padding Padding around the rect
     * @param {function} intermediateNodeMouseOverHandler Mouse over handler
     * @param {function} intermediateNodeMouseLeaveHandler Mouse leave handler
     * @param {function} intermediateNodeClicked Mouse click handler
     */
    const addUnderneathRect = (curLayerIndex, i, leftX,
      intermediateGap, padding, intermediateNodeMouseOverHandler,
      intermediateNodeMouseLeaveHandler, intermediateNodeClicked) => {
      // Add underneath rects
      let underGroup = svg$3.select('g.underneath');

      for (let n = 0; n < cnn$1[curLayerIndex - 1].length; n++) {
        underGroup.append('rect')
          .attr('class', 'underneath-gateway')
          .attr('id', `underneath-gateway-${n}`)
          .attr('x', leftX - padding)
          .attr('y', nodeCoordinate$1[curLayerIndex - 1][n].y - padding)
          .attr('width', (2 * nodeLength$4 + intermediateGap) + 2 * padding)
          .attr('height', nodeLength$4 + 2 * padding)
          .attr('rx', 10)
          .style('fill', 'rgba(160, 160, 160, 0.2)')
          .style('opacity', 0);
        
        // Register new events for input layer nodes
        svg$3.select(`g#layer-${curLayerIndex - 1}-node-${n}`)
          .style('pointer-events', 'all')
          .style('cursor', 'pointer')
          .on('mouseover', intermediateNodeMouseOverHandler)
          .on('mouseleave', intermediateNodeMouseLeaveHandler)
          .on('click', (d, ni, g) => intermediateNodeClicked(d, ni, g,
            i, curLayerIndex));
          // .on('click', (d, i) => {console.log(i)});
      }
      underGroup.lower();
    };

    /**
     * Add an overlaying rect
     * @param {string} gradientName Gradient name of overlay rect
     * @param {number} x X value of the overlaying rect
     * @param {number} y Y value of the overlaying rect
     * @param {number} width Rect width
     * @param {number} height Rect height
     */
    const addOverlayRect = (gradientName, x, y, width, height) => {
      if (svg$3.select('.intermediate-layer-overlay').empty()) {
        svg$3.append('g').attr('class', 'intermediate-layer-overlay');
      }

      let intermediateLayerOverlay = svg$3.select('.intermediate-layer-overlay');

      let overlayRect = intermediateLayerOverlay.append('rect')
        .attr('class', 'overlay')
        .style('fill', `url(#${gradientName})`)
        .style('stroke', 'none')
        .attr('width', width)
        .attr('height', height)
        .attr('x', x)
        .attr('y', y)
        .style('opacity', 0);
      
      overlayRect.transition('move')
        .duration(800)
        .ease(d3.easeCubicInOut)
        .style('opacity', 1);
    };

    /**
     * Redraw the layer if needed (entering the intermediate view to make sure
     * all layers have the same color scale)
     * @param {number} curLayerIndex Index of the selected layer
     * @param {number} i Index of the selected node
     */
    const redrawLayerIfNeeded = (curLayerIndex, i) => {
      // Determine the range for this layerview, and redraw the layer with
      // smaller range so all layers have the same range
      let rangePre = cnnLayerRanges$1[selectedScaleLevel$1][curLayerIndex - 1];
      let rangeCur = cnnLayerRanges$1[selectedScaleLevel$1][curLayerIndex];
      let range = Math.max(rangePre, rangeCur);

      if (rangePre > rangeCur) {
        // Redraw the current layer (selected node)
        svg$3.select(`g#layer-${curLayerIndex}-node-${i}`)
          .select('image.node-image')
          .each((d, g, i) => drawOutput(d, g, i, range));
        
        // Record the change so we will re-redraw the layer when user quits
        // the intermediate view
        needRedraw = [curLayerIndex, i];
        needRedrawStore.set(needRedraw);
        
      } else if (rangePre < rangeCur) {
        // Redraw the previous layer (whole layer)
        svg$3.select(`g#cnn-layer-group-${curLayerIndex - 1}`)
          .selectAll('image.node-image')
          .each((d, g, i) => drawOutput(d, g, i, range));

        // Record the change so we will re-redraw the layer when user quits
        // the intermediate view
        needRedraw = [curLayerIndex - 1, undefined];
        needRedrawStore.set(needRedraw);
      }

      // Compute the min, max value of all nodes in pre-layer and the selected
      // node of cur-layer
      let min = cnnLayerMinMax$1[curLayerIndex - 1].min,
        max = cnnLayerMinMax$1[curLayerIndex - 1].max;

      // Selected node
      let n = cnn$1[curLayerIndex][i];
      for (let r = 0; r < n.output.length; r++) {
        for (let c = 0; c < n.output[0].length; c++) {
          if (n.output[r][c] < min) { min = n.output[r][c]; }
          if (n.output[r][c] > max) { max = n.output[r][c]; }
        }
      }

      return {range: range, minMax: {min: min, max: max}};
    };

    /**
     * Draw the intermediate layer before conv_1_1
     * @param {number} curLayerIndex Index of the selected layer
     * @param {object} d Bounded d3 data
     * @param {number} i Index of the selected node
     * @param {number} width CNN group width
     * @param {number} height CNN group height
     * @param {function} intermediateNodeMouseOverHandler mouse over handler
     * @param {function} intermediateNodeMouseLeaveHandler mouse leave handler
     * @param {function} intermediateNodeClicked node clicking handler
     */
    const drawConv1 = (curLayerIndex, d, i, width, height,
      intermediateNodeMouseOverHandler, intermediateNodeMouseLeaveHandler,
      intermediateNodeClicked) => {
      // Compute the target location
      let targetX = nodeCoordinate$1[curLayerIndex - 1][0].x + 2 * nodeLength$4 +
        2 * hSpaceAroundGap$1 * gapRatio$1 + plusSymbolRadius * 2;
      let intermediateGap = (hSpaceAroundGap$1 * gapRatio$1 * 2) / 3;
      let leftX = nodeCoordinate$1[curLayerIndex - 1][0].x;

      // Record the left x position for dynamic detial view positioning
      intermediateLayerPosition['conv2d_22'] = targetX + nodeLength$4;
      intermediateLayerPositionStore.set(intermediateLayerPosition);

      // Hide the edges
      svg$3.select('g.edge-group')
        .style('visibility', 'hidden');

      // Move the selected layer
      moveLayerX({layerIndex: curLayerIndex, targetX: targetX, disable: true,
        delay: 0, opacity: 0.15, specialIndex: i});

      // Compute the gap in the right shrink region
      let rightStart = targetX + nodeLength$4 + hSpaceAroundGap$1 * gapRatio$1;
      let rightGap = (width - rightStart - 10 * nodeLength$4) / 10;

      // Move the right layers
      for (let i = curLayerIndex + 1; i < numLayers$1; i++) {
        let curX = rightStart + (i - (curLayerIndex + 1)) * (nodeLength$4 + rightGap);
        moveLayerX({layerIndex: i, targetX: curX, disable: true, delay: 0});
      }

      // Add an overlay gradient and rect
      let stops = [{offset: '0%', color: 'rgb(250, 250, 250)', opacity: 0.85},
      {offset: '50%', color: 'rgb(250, 250, 250)', opacity: 0.95},
      {offset: '100%', color: 'rgb(250, 250, 250)', opacity: 1}];
      addOverlayGradient('overlay-gradient', stops);

      addOverlayRect('overlay-gradient', rightStart - overlayRectOffset / 2,
      0, width - rightStart + overlayRectOffset,
      height + svgPaddings$2.top + svgPaddings$2.bottom);

      // Draw the intermediate layer
      let {intermediateLayer, intermediateMinMax, kernelRange, kernelMinMax} =
      drawIntermediateLayer(curLayerIndex, leftX, targetX, rightStart,
        intermediateGap, d, i, intermediateNodeMouseOverHandler,
        intermediateNodeMouseLeaveHandler, intermediateNodeClicked);
      addUnderneathRect(curLayerIndex, i, leftX, intermediateGap, 8,
        intermediateNodeMouseOverHandler, intermediateNodeMouseLeaveHandler,
        intermediateNodeClicked);

      // Compute the selected node's min max
      // Selected node
      let min = Infinity, max = -Infinity;
      let n = cnn$1[curLayerIndex][i];
      for (let r = 0; r < n.output.length; r++) {
      for (let c = 0; c < n.output[0].length; c++) {
        if (n.output[r][c] < min) { min = n.output[r][c]; }
        if (n.output[r][c] > max) { max = n.output[r][c]; }
      }
      }

      let finalMinMax = {
      min: Math.min(min, intermediateMinMax.min),
      max: Math.max(max, intermediateMinMax.max)
      };

      // Add annotation to the intermediate layer
      let intermediateLayerAnnotation = svg$3.append('g')
      .attr('class', 'intermediate-layer-annotation')
      .style('opacity', 0);

      drawIntermediateLayerAnnotation({
        leftX: leftX,
        curLayerIndex: curLayerIndex,
        group: intermediateLayerAnnotation,
        intermediateGap: intermediateGap,
        isFirstConv: true,
        i: i
      });

      let range = cnnLayerRanges$1.local[curLayerIndex];

      drawIntermediateLayerLegend({
        legendHeight: 5,
        curLayerIndex: curLayerIndex,
        range: 1,
        group: intermediateLayer,
        width: 2 * nodeLength$4 + intermediateGap,
        isInput: true,
        x: leftX,
        y: svgPaddings$2.top + vSpaceAroundGap$1 * (10) + vSpaceAroundGap$1 + 
          nodeLength$4 * 10 - 25
      });

      drawIntermediateLayerLegend({
        legendHeight: 5,
        curLayerIndex: curLayerIndex,
        range: range,
        minMax: finalMinMax,
        group: intermediateLayer,
        width: 2 * nodeLength$4 + intermediateGap,
        x: nodeCoordinate$1[curLayerIndex - 1][0].x,
        y: svgPaddings$2.top + vSpaceAroundGap$1 * (10) + vSpaceAroundGap$1 + 
          nodeLength$4 * 10
      });

      drawIntermediateLayerLegend({
        legendHeight: 5,
        curLayerIndex: curLayerIndex,
        range: kernelRange,
        minMax: kernelMinMax,
        group: intermediateLayer,
        width: 2 * nodeLength$4 + intermediateGap,
        x: targetX + nodeLength$4 - (2 * nodeLength$4 + intermediateGap),
        y: svgPaddings$2.top + vSpaceAroundGap$1 * (10) + vSpaceAroundGap$1 + 
          nodeLength$4 * 10,
        gradientAppendingName: 'kernelColorGradient',
        colorScale: layerColorScales$4.weight,
        gradientGap: 0.2
      });

      // Show everything
      svg$3.selectAll('g.intermediate-layer, g.intermediate-layer-annotation')
        .transition()
        .delay(500)
        .duration(500)
        .ease(d3.easeCubicInOut)
        .style('opacity', 1);
    };

    /**
     * Draw the intermediate layer before conv_1_2
     * @param {number} curLayerIndex Index of the selected layer
     * @param {object} d Bounded d3 data
     * @param {number} i Index of the selected node
     * @param {number} width CNN group width
     * @param {number} height CNN group height
     * @param {function} intermediateNodeMouseOverHandler mouse over handler
     * @param {function} intermediateNodeMouseLeaveHandler mouse leave handler
     * @param {function} intermediateNodeClicked node clicking handler
     */
    const drawConv2 = (curLayerIndex, d, i, width, height,
      intermediateNodeMouseOverHandler, intermediateNodeMouseLeaveHandler,
      intermediateNodeClicked) => {
      let targetX = nodeCoordinate$1[curLayerIndex - 1][0].x + 2 * nodeLength$4 +
        2 * hSpaceAroundGap$1 * gapRatio$1 + plusSymbolRadius * 2;
      let intermediateGap = (hSpaceAroundGap$1 * gapRatio$1 * 2) / 3;

      // Record the left x position for dynamic detial view positioning
      intermediateLayerPosition['conv_1_2'] = targetX + nodeLength$4;
      intermediateLayerPositionStore.set(intermediateLayerPosition);

      // Make sure two layers have the same range
      let {range, minMax} = redrawLayerIfNeeded(curLayerIndex, i);

      // Hide the edges
      svg$3.select('g.edge-group')
        .style('visibility', 'hidden');

      // Move the selected layer
      moveLayerX({layerIndex: curLayerIndex, targetX: targetX, disable: true,
        delay: 0, opacity: 0.15, specialIndex: i});

      // Compute the gap in the right shrink region
      let rightStart = targetX + nodeLength$4 + hSpaceAroundGap$1 * gapRatio$1;
      let rightGap = (width - rightStart - 8 * nodeLength$4) / 8;

      // Move the right layers
      for (let i = curLayerIndex + 1; i < numLayers$1; i++) {
        let curX = rightStart + (i - (curLayerIndex + 1)) * (nodeLength$4 + rightGap);
        moveLayerX({layerIndex: i, targetX: curX, disable: true, delay: 0});
      }

      // Add an overlay
      let stops = [{offset: '0%', color: 'rgb(250, 250, 250)', opacity: 0.85},
        {offset: '50%', color: 'rgb(250, 250, 250)', opacity: 0.95},
        {offset: '100%', color: 'rgb(250, 250, 250)', opacity: 1}];
      addOverlayGradient('overlay-gradient-right', stops);

      let leftRightRatio = (2 * nodeLength$4 + hSpaceAroundGap$1 * gapRatio$1) /
        (8 * nodeLength$4 + intermediateGap * 7);
      let endingGradient = 0.85 + (0.95 - 0.85) * leftRightRatio;
      stops = [{offset: '0%', color: 'rgb(250, 250, 250)', opacity: endingGradient},
        {offset: '100%', color: 'rgb(250, 250, 250)', opacity: 0.85}];
      addOverlayGradient('overlay-gradient-left', stops);

      addOverlayRect('overlay-gradient-right', rightStart - overlayRectOffset / 2,
        0, width - rightStart + overlayRectOffset,
        height + svgPaddings$2.top + svgPaddings$2.bottom);

      addOverlayRect('overlay-gradient-left', nodeCoordinate$1[0][0].x - overlayRectOffset / 2,
        0, nodeLength$4 * 2 + hSpaceAroundGap$1 * gapRatio$1 + overlayRectOffset,
        height + svgPaddings$2.top + svgPaddings$2.bottom);

      // Draw the intermediate layer
      let leftX = nodeCoordinate$1[curLayerIndex - 1][0].x;
      let {intermediateLayer, intermediateMinMax, kernelRange, kernelMinMax} =
        drawIntermediateLayer(curLayerIndex, leftX, targetX, rightStart,
          intermediateGap, d, i, intermediateNodeMouseOverHandler,
          intermediateNodeMouseLeaveHandler, intermediateNodeClicked);
      addUnderneathRect(curLayerIndex, i, leftX, intermediateGap, 5,
        intermediateNodeMouseOverHandler, intermediateNodeMouseLeaveHandler,
        intermediateNodeClicked);

      // After getting the intermediateMinMax, we can finally aggregate it with
      // the preLayer minmax, curLayer minmax
      let finalMinMax = {
        min: Math.min(minMax.min, intermediateMinMax.min),
        max: Math.max(minMax.max, intermediateMinMax.max)
      };

      // Add annotation to the intermediate layer
      let intermediateLayerAnnotation = svg$3.append('g')
        .attr('class', 'intermediate-layer-annotation')
        .style('opacity', 0);

      drawIntermediateLayerAnnotation({
        leftX: leftX,
        curLayerIndex: curLayerIndex,
        group: intermediateLayerAnnotation,
        intermediateGap: intermediateGap,
        i: i
      });

      drawIntermediateLayerLegend({
        legendHeight: 5,
        curLayerIndex: curLayerIndex,
        range: range,
        minMax: finalMinMax,
        group: intermediateLayer,
        width: 2 * nodeLength$4 + intermediateGap,
        x: leftX,
        y: svgPaddings$2.top + vSpaceAroundGap$1 * (10) + vSpaceAroundGap$1 + 
          nodeLength$4 * 10
      });

      drawIntermediateLayerLegend({
        legendHeight: 5,
        curLayerIndex: curLayerIndex,
        range: kernelRange,
        minMax: kernelMinMax,
        group: intermediateLayer,
        width: 2 * nodeLength$4 + intermediateGap,
        x: targetX + nodeLength$4 - (2 * nodeLength$4 + intermediateGap),
        y: svgPaddings$2.top + vSpaceAroundGap$1 * (10) + vSpaceAroundGap$1 + 
          nodeLength$4 * 10,
        gradientAppendingName: 'kernelColorGradient',
        colorScale: layerColorScales$4.weight,
        gradientGap: 0.2
      });

      // Show everything
      svg$3.selectAll('g.intermediate-layer, g.intermediate-layer-annotation')
        .transition()
        .delay(500)
        .duration(500)
        .ease(d3.easeCubicInOut)
        .style('opacity', 1);
    };

    /**
     * Draw the intermediate layer before conv_2_1
     * @param {number} curLayerIndex Index of the selected layer
     * @param {object} d Bounded d3 data
     * @param {number} i Index of the selected node
     * @param {number} width CNN group width
     * @param {number} height CNN group height
     * @param {function} intermediateNodeMouseOverHandler mouse over handler
     * @param {function} intermediateNodeMouseLeaveHandler mouse leave handler
     * @param {function} intermediateNodeClicked node clicking handler
     */
    const drawConv3 = (curLayerIndex, d, i, width, height,
      intermediateNodeMouseOverHandler, intermediateNodeMouseLeaveHandler,
      intermediateNodeClicked) => {

      let targetX = nodeCoordinate$1[curLayerIndex][0].x;
      let leftX = targetX - (1 * nodeLength$4 +
        2 * hSpaceAroundGap$1 * gapRatio$1 + plusSymbolRadius * 1);
      let intermediateGap = (hSpaceAroundGap$1 * gapRatio$1 * 2) / 3;

      // Record the left x position for dynamic detial view positioning
      intermediateLayerPosition['conv2d_23'] = targetX + nodeLength$4;
      intermediateLayerPositionStore.set(intermediateLayerPosition);

      // Hide the edges
      svg$3.select('g.edge-group')
        .style('visibility', 'hidden');

      // Make sure two layers have the same range
      let {range, minMax} = redrawLayerIfNeeded(curLayerIndex, i);

      // Move the previous layer
      moveLayerX({layerIndex: curLayerIndex - 1, targetX: leftX,
        disable: true, delay: 0});

      moveLayerX({layerIndex: curLayerIndex,
        targetX: targetX, disable: true,
        delay: 0, opacity: 0.15, specialIndex: i});

      // Compute the gap in the left shrink region
      let leftEnd = leftX - hSpaceAroundGap$1;
      let leftGap = (leftEnd - nodeCoordinate$1[0][0].x - 2 * nodeLength$4) / 5;
      let rightStart = nodeCoordinate$1[curLayerIndex][0].x +
        nodeLength$4 + hSpaceAroundGap$1;

      // Move the left layers
      for (let i = 0; i < curLayerIndex - 1; i++) {
        let curX = nodeCoordinate$1[0][0].x + i * (nodeLength$4 + leftGap);
        moveLayerX({layerIndex: i, targetX: curX, disable: true, delay: 0});
      }

      // Add an overlay
      let stops = [{offset: '0%', color: 'rgb(250, 250, 250)', opacity: 1},
        {offset: '50%', color: 'rgb(250, 250, 250)', opacity: 0.9},
        {offset: '100%', color: 'rgb(250, 250, 250)', opacity: 0.85}];
      addOverlayGradient('overlay-gradient-left', stops);

      stops = [{offset: '0%', color: 'rgb(250, 250, 250)', opacity: 0.85},
        {offset: '50%', color: 'rgb(250, 250, 250)', opacity: 0.95},
        {offset: '100%', color: 'rgb(250, 250, 250)', opacity: 1}];
      addOverlayGradient('overlay-gradient-right', stops);

      addOverlayRect('overlay-gradient-left', nodeCoordinate$1[0][0].x - overlayRectOffset / 2,
        0, leftEnd - nodeCoordinate$1[0][0].x + overlayRectOffset,
        height + svgPaddings$2.top + svgPaddings$2.bottom);
      
      addOverlayRect('overlay-gradient-right', rightStart - overlayRectOffset / 2,
        0, width - rightStart + overlayRectOffset,
        height + svgPaddings$2.top + svgPaddings$2.bottom);
      
      // Draw the intermediate layer
      let {intermediateLayer, intermediateMinMax, kernelRange, kernelMinMax} =
        drawIntermediateLayer(curLayerIndex, leftX,
          nodeCoordinate$1[curLayerIndex][0].x, rightStart, intermediateGap,
          d, i, intermediateNodeMouseOverHandler,
          intermediateNodeMouseLeaveHandler, intermediateNodeClicked);
      addUnderneathRect(curLayerIndex, i, leftX, intermediateGap, 5,
        intermediateNodeMouseOverHandler, intermediateNodeMouseLeaveHandler,
        intermediateNodeClicked);
              
      // After getting the intermediateMinMax, we can finally aggregate it with
      // the preLayer minmax, curLayer minmax
      let finalMinMax = {
        min: Math.min(minMax.min, intermediateMinMax.min),
        max: Math.max(minMax.max, intermediateMinMax.max)
      };

      // Add annotation to the intermediate layer
      let intermediateLayerAnnotation = svg$3.append('g')
        .attr('class', 'intermediate-layer-annotation')
        .style('opacity', 0);

      drawIntermediateLayerAnnotation({
        leftX: leftX,
        curLayerIndex: curLayerIndex,
        group: intermediateLayerAnnotation,
        intermediateGap: intermediateGap,
        i: i
      });

      drawIntermediateLayerLegend({
        legendHeight: 5,
        curLayerIndex: curLayerIndex,
        range: range,
        group: intermediateLayer,
        width: 2 * nodeLength$4 + intermediateGap,
        minMax: finalMinMax,
        x: leftX,
        y: svgPaddings$2.top + vSpaceAroundGap$1 * (10) + vSpaceAroundGap$1 + 
          nodeLength$4 * 15
      });

      drawIntermediateLayerLegend({
        legendHeight: 5,
        curLayerIndex: curLayerIndex,
        range: kernelRange,
        minMax: kernelMinMax,
        group: intermediateLayer,
        width: 2 * nodeLength$4 + intermediateGap,
        x: targetX + nodeLength$4 - (2 * nodeLength$4 + intermediateGap),
        y: svgPaddings$2.top + vSpaceAroundGap$1 * (10) + vSpaceAroundGap$1 + 
          nodeLength$4 * 15,
        gradientAppendingName: 'kernelColorGradient',
        colorScale: layerColorScales$4.weight,
        gradientGap: 0.2
      });

      // Show everything
      svg$3.selectAll('g.intermediate-layer, g.intermediate-layer-annotation')
        .transition()
        .delay(500)
        .duration(500)
        .ease(d3.easeCubicInOut)
        .style('opacity', 1);
    };

    /**
     * Draw the intermediate layer before conv_2_2
     * @param {number} curLayerIndex Index of the selected layer
     * @param {object} d Bounded d3 data
     * @param {number} i Index of the selected node
     * @param {number} width CNN group width
     * @param {number} height CNN group height
     * @param {function} intermediateNodeMouseOverHandler mouse over handler
     * @param {function} intermediateNodeMouseLeaveHandler mouse leave handler
     * @param {function} intermediateNodeClicked node clicking handler
     */
    const drawConv4 = (curLayerIndex, d, i, width, height,
      intermediateNodeMouseOverHandler, intermediateNodeMouseLeaveHandler,
      intermediateNodeClicked) => {
      let targetX = nodeCoordinate$1[curLayerIndex][0].x;
      let leftX = targetX - (2 * nodeLength$4 +
        2 * hSpaceAroundGap$1 * gapRatio$1 + plusSymbolRadius * 2);
      let intermediateGap = (hSpaceAroundGap$1 * gapRatio$1 * 2) / 3;

      // Record the left x position for dynamic detial view positioning
      intermediateLayerPosition['conv_2_2'] = leftX;
      intermediateLayerPositionStore.set(intermediateLayerPosition);

      // Hide the edges
      svg$3.select('g.edge-group')
        .style('visibility', 'hidden');

      // Make sure two layers have the same range
      let {range, minMax} = redrawLayerIfNeeded(curLayerIndex, i);

      // Move the previous layer
      moveLayerX({layerIndex: curLayerIndex - 1, targetX: leftX,
        disable: true, delay: 0});

      moveLayerX({layerIndex: curLayerIndex,
        targetX: targetX, disable: true,
        delay: 0, opacity: 0.15, specialIndex: i});

      // Compute the gap in the left shrink region
      let leftEnd = leftX - hSpaceAroundGap$1;
      let leftGap = (leftEnd - nodeCoordinate$1[0][0].x - 7 * nodeLength$4) / 7;
      let rightStart = targetX + nodeLength$4 + hSpaceAroundGap$1;

      // Move the left layers
      for (let i = 0; i < curLayerIndex - 1; i++) {
        let curX = nodeCoordinate$1[0][0].x + i * (nodeLength$4 + leftGap);
        moveLayerX({layerIndex: i, targetX: curX, disable: true, delay: 0});
      }

      // Add an overlay
      let stops = [{offset: '0%', color: 'rgb(250, 250, 250)', opacity: 1},
        {offset: '50%', color: 'rgb(250, 250, 250)', opacity: 0.95},
        {offset: '100%', color: 'rgb(250, 250, 250)', opacity: 0.85}];
      addOverlayGradient('overlay-gradient-left', stops);

      stops = [{offset: '0%', color: 'rgb(250, 250, 250)', opacity: 0.85},
        {offset: '50%', color: 'rgb(250, 250, 250)', opacity: 0.95},
        {offset: '100%', color: 'rgb(250, 250, 250)', opacity: 1}];
      addOverlayGradient('overlay-gradient-right', stops);

      addOverlayRect('overlay-gradient-left', nodeCoordinate$1[0][0].x - overlayRectOffset / 2,
        0, leftEnd - nodeCoordinate$1[0][0].x + overlayRectOffset,
        height + svgPaddings$2.top + svgPaddings$2.bottom);
      
      addOverlayRect('overlay-gradient-right', rightStart - overlayRectOffset / 2,
        0, width - rightStart + overlayRectOffset,
        height + svgPaddings$2.top + svgPaddings$2.bottom);
      
      // Draw the intermediate layer
      let {intermediateLayer, intermediateMinMax, kernelRange, kernelMinMax} =
        drawIntermediateLayer(curLayerIndex, leftX,
          nodeCoordinate$1[curLayerIndex][0].x, rightStart, intermediateGap,
          d, i, intermediateNodeMouseOverHandler,
          intermediateNodeMouseLeaveHandler, intermediateNodeClicked);
      addUnderneathRect(curLayerIndex, i, leftX, intermediateGap, 5,
        intermediateNodeMouseOverHandler, intermediateNodeMouseLeaveHandler,
        intermediateNodeClicked);
              
      // After getting the intermediateMinMax, we can finally aggregate it with
      // the preLayer minmax, curLayer minmax
      let finalMinMax = {
        min: Math.min(minMax.min, intermediateMinMax.min),
        max: Math.max(minMax.max, intermediateMinMax.max)
      };

      // Add annotation to the intermediate layer
      let intermediateLayerAnnotation = svg$3.append('g')
        .attr('class', 'intermediate-layer-annotation')
        .style('opacity', 0);

      drawIntermediateLayerAnnotation({
        leftX: leftX,
        curLayerIndex: curLayerIndex,
        group: intermediateLayerAnnotation,
        intermediateGap: intermediateGap,
        i: i
      });

      drawIntermediateLayerLegend({
        legendHeight: 5,
        curLayerIndex: curLayerIndex,
        range: range,
        group: intermediateLayer,
        minMax: finalMinMax,
        width: 2 * nodeLength$4 + intermediateGap,
        x: leftX,
        y: svgPaddings$2.top + vSpaceAroundGap$1 * (10) + vSpaceAroundGap$1 + 
          nodeLength$4 * 10
      });

      drawIntermediateLayerLegend({
        legendHeight: 5,
        curLayerIndex: curLayerIndex,
        range: kernelRange,
        minMax: kernelMinMax,
        group: intermediateLayer,
        width: 2 * nodeLength$4 + intermediateGap,
        x: targetX + nodeLength$4 - (2 * nodeLength$4 + intermediateGap),
        y: svgPaddings$2.top + vSpaceAroundGap$1 * (10) + vSpaceAroundGap$1 + 
          nodeLength$4 * 10,
        gradientAppendingName: 'kernelColorGradient',
        colorScale: layerColorScales$4.weight,
        gradientGap: 0.2
      });

      // Show everything
      svg$3.selectAll('g.intermediate-layer, g.intermediate-layer-annotation')
        .transition()
        .delay(500)
        .duration(500)
        .ease(d3.easeCubicInOut)
        .style('opacity', 1);
    };

    /* global d3, SmoothScroll */

    // Configs
    const layerColorScales$5 = overviewConfig.layerColorScales;
    const nodeLength$5 = overviewConfig.nodeLength;
    const plusSymbolRadius$1 = overviewConfig.plusSymbolRadius;
    const intermediateColor$2 = overviewConfig.intermediateColor;
    const kernelRectLength$1 = overviewConfig.kernelRectLength;
    const svgPaddings$3 = overviewConfig.svgPaddings;
    const gapRatio$2 = overviewConfig.gapRatio;
    const classList = overviewConfig.classLists;
    const formater$2 = d3.format('.4f');

    // Shared variables
    let svg$4 = undefined;
    svgStore.subscribe( value => {svg$4 = value;} );

    let vSpaceAroundGap$2 = undefined;
    vSpaceAroundGapStore.subscribe( value => {vSpaceAroundGap$2 = value;} );

    let hSpaceAroundGap$2 = undefined;
    hSpaceAroundGapStore.subscribe( value => {hSpaceAroundGap$2 = value;} );

    let cnn$2 = undefined;
    cnnStore.subscribe( value => {cnn$2 = value;} );

    let nodeCoordinate$2 = undefined;
    nodeCoordinateStore.subscribe( value => {nodeCoordinate$2 = value;} );

    let selectedScaleLevel$2 = undefined;
    selectedScaleLevelStore.subscribe( value => {selectedScaleLevel$2 = value;} );

    let cnnLayerRanges$2 = undefined;
    cnnLayerRangesStore.subscribe( value => {cnnLayerRanges$2 = value;} );

    let cnnLayerMinMax$2 = undefined;
    cnnLayerMinMaxStore.subscribe( value => {cnnLayerMinMax$2 = value;} );

    let isInSoftmax = undefined;
    isInSoftmaxStore.subscribe( value => {isInSoftmax = value;} );

    let allowsSoftmaxAnimation = undefined;
    allowsSoftmaxAnimationStore.subscribe( value => {allowsSoftmaxAnimation = value;} );

    let softmaxDetailViewInfo = undefined;
    softmaxDetailViewStore.subscribe( value => {softmaxDetailViewInfo = value;} );

    let hoverInfo = undefined;
    hoverInfoStore.subscribe( value => {hoverInfo = value;} );

    let detailedMode$2 = undefined;
    detailedModeStore.subscribe( value => {detailedMode$2 = value;} );
      // const layerIndexDict = {
      //   'input': 0,
      //   'conv2d_8': 1,
      //   'max_pooling2d_8': 2,
      //   'conv2d_9': 3,
      //   'max_pooling2d_9': 4,
      //   'dense_8': 5,
      //   'output': 6,
      // }
      const layerIndexDict = {
        'input': 0,
        'conv2d_22': 1,
        'max_pooling2d_21': 2,
        'conv2d_23': 3,
        'max_pooling2d_22': 4,
        'dense_22': 5,
        'output': 6,
      };
    let hasInitialized = false;
    let logits = [];
    let flattenFactoredFDict = {};

    const moveLegend = (d, i, g, moveX, duration, restore) => {
      let legend = d3.select(g[i]);

      if (!restore) {
        let previousTransform = legend.attr('transform');
        let previousLegendX = +previousTransform.replace(/.*\(([\d\.]+),.*/, '$1');
        let previousLegendY = +previousTransform.replace(/.*,\s([\d\.]+)\)/, '$1');
      
        legend.transition('softmax')
          .duration(duration)
          .ease(d3.easeCubicInOut)
          .attr('transform', `translate(${previousLegendX - moveX}, ${previousLegendY})`);
        
        // If not in restore mode, we register the previous location to the DOM element
        legend.attr('data-preX', previousLegendX);
        legend.attr('data-preY', previousLegendY);
      } else {
        // Restore the recorded location
        let previousLegendX = +legend.attr('data-preX');
        let previousLegendY = +legend.attr('data-preY');

        legend.transition('softmax')
          .duration(duration)
          .ease(d3.easeCubicInOut)
          .attr('transform', `translate(${previousLegendX}, ${previousLegendY})`);
      }
    };

    const logitCircleMouseOverHandler = (i) => {
      // Update the hover info UI
      hoverInfoStore.set({
        show: true,
        text: `Logit: ${formater$2(logits[i])}`
      });

      // Highlight the text in the detail view
      softmaxDetailViewInfo.highlightI = i;
      softmaxDetailViewStore.set(softmaxDetailViewInfo);

      let logitLayer = svg$4.select('.logit-layer');
      let logitLayerLower = svg$4.select('.underneath');
      let intermediateLayer = svg$4.select('.intermediate-layer');

      // Highlight the circle
      logitLayer.select(`#logit-circle-${i}`)
        .style('stroke-width', 2);

      // Highlight the associated plus symbol
      intermediateLayer.select(`#plus-symbol-clone-${i}`)
        .style('opacity', 1)
        .select('circle')
        .style('fill', d => d.fill);
      
      // Raise the associated edge group
      logitLayerLower.select(`#logit-lower-${i}`).raise();

      // Highlight the associated edges
      logitLayerLower.selectAll(`.softmax-abstract-edge-${i}`)
        .style('stroke-width', 0.8)
        .style('stroke', '#E0E0E0');

      logitLayerLower.selectAll(`.softmax-edge-${i}`)
        .style('stroke-width', 1)
        .style('stroke', '#E0E0E0');
      
      logitLayerLower.selectAll(`.logit-output-edge-${i}`)
        .style('stroke-width', 3)
        .style('stroke', '#E0E0E0');

      logitLayer.selectAll(`.logit-output-edge-${i}`)
        .style('stroke-width', 3)
        .style('stroke', '#E0E0E0');
    };

    const logitCircleMouseLeaveHandler = (i) => {
      // screenshot
      // return;

      // Update the hover info UI
      hoverInfoStore.set({
        show: false,
        text: `Logit: ${formater$2(logits[i])}`
      });

      // Dehighlight the text in the detail view
      softmaxDetailViewInfo.highlightI = -1;
      softmaxDetailViewStore.set(softmaxDetailViewInfo);

      let logitLayer = svg$4.select('.logit-layer');
      let logitLayerLower = svg$4.select('.underneath');
      let intermediateLayer = svg$4.select('.intermediate-layer');

      // Restore the circle
      logitLayer.select(`#logit-circle-${i}`)
        .style('stroke-width', 1);

      // Restore the associated plus symbol
      intermediateLayer.select(`#plus-symbol-clone-${i}`)
        .style('opacity', 0.2);

      // Restore the associated edges
      logitLayerLower.selectAll(`.softmax-abstract-edge-${i}`)
        .style('stroke-width', 0.2)
        .style('stroke', '#EDEDED');

      logitLayerLower.selectAll(`.softmax-edge-${i}`)
        .style('stroke-width', 0.2)
        .style('stroke', '#F1F1F1');

      logitLayerLower.selectAll(`.logit-output-edge-${i}`)
        .style('stroke-width', 1.2)
        .style('stroke', '#E5E5E5');
      
      logitLayer.selectAll(`.logit-output-edge-${i}`)
        .style('stroke-width', 1.2)
        .style('stroke', '#E5E5E5');
    };

    // This function is binded to the detail view in Overview.svelte
    const softmaxDetailViewMouseOverHandler = (event) => {
      logitCircleMouseOverHandler(event.detail.curI);
    };

    // This function is binded to the detail view in Overview.svelte
    const softmaxDetailViewMouseLeaveHandler = (event) => {
      logitCircleMouseLeaveHandler(event.detail.curI);
    };

    const drawLogitLayer = (arg) => {
      let curLayerIndex = arg.curLayerIndex,
        moveX = arg.moveX,
        softmaxLeftMid = arg.softmaxLeftMid,
        selectedI = arg.selectedI,
        intermediateX1 = arg.intermediateX1,
        intermediateX2 = arg.intermediateX2,
        pixelWidth = arg.pixelWidth,
        pixelHeight = arg.pixelHeight,
        topY = arg.topY,
        bottomY = arg.bottomY,
        softmaxX = arg.softmaxX,
        middleGap = arg.middleGap,
        middleRectHeight = arg.middleRectHeight,
        symbolGroup = arg.symbolGroup,
        symbolX = arg.symbolX,
        flattenRange = arg.flattenRange;

      let logitLayer = svg$4.select('.intermediate-layer')
        .append('g')
        .attr('class', 'logit-layer')
        .raise();
      
      // Minotr layer ordering change
      let tempClone = svg$4.select('.intermediate-layer')
        .select('.flatten-layer')
        .select('.plus-symbol')
        .clone(true)
        .attr('class', 'temp-clone-plus-symbol')
        .attr('transform', `translate(${symbolX - moveX},
      ${nodeCoordinate$2[curLayerIndex][selectedI].y + nodeLength$5 / 2})`)
        // Cool hack -> d3 clone doesnt clone events, make the front object pointer
        // event transparent so users can trigger the underlying object's event!
        .style('pointer-events', 'none')
        .remove();

      let tempPlusSymbol = logitLayer.append(() => tempClone.node());
      
      svg$4.select('.softmax-symbol').raise();

      let logitLayerLower = svg$4.select('.underneath')
        .append('g')
        .attr('class', 'logit-layer-lower')
        .lower();
      
      // Use circles to encode logit values
      let centerX = softmaxLeftMid - moveX * 4 / 5;

      // Get all logits
      logits = [];
      for (let i = 0; i < cnn$2[layerIndexDict['output']].length; i++) {
        logits.push(cnn$2[layerIndexDict['output']][i].logit);
      }

      // Construct a color scale for the logit values
      let logitColorScale = d3.scaleLinear()
        .domain(d3.extent(logits))
        .range([0.2, 1]);
      
      // Draw the current logit circle before animation
      let logitRadius = 8;
      logitLayer.append('circle')
        .attr('class', 'logit-circle')
        .attr('id', `logit-circle-${selectedI}`)
        .attr('cx', centerX)
        .attr('cy', nodeCoordinate$2[curLayerIndex][selectedI].y + nodeLength$5 / 2)
        .attr('r', logitRadius)
        .style('fill', layerColorScales$5.logit(logitColorScale(logits[selectedI])))
        .style('cursor', 'crosshair')
        .style('pointer-events', 'all')
        .style('stroke', intermediateColor$2)
        .on('mouseover', () => logitCircleMouseOverHandler(selectedI))
        .on('mouseleave', () => logitCircleMouseLeaveHandler(selectedI))
        .on('click', () => { d3.event.stopPropagation(); });
      
      // Show the logit circle corresponding label
      let softmaxDetailAnnotation = svg$4.select('.intermediate-layer-annotation')
        .select('.softmax-detail-annoataion');

      softmaxDetailAnnotation.select(`#logit-text-${selectedI}`)
        .style('opacity', 1);

      tempPlusSymbol.raise();

      // Draw another line from plus symbol to softmax symbol
      logitLayer.append('line')
        .attr('class', `logit-output-edge-${selectedI}`)
        .attr('x1', intermediateX2 - moveX + plusSymbolRadius$1 * 2)
        .attr('x2', softmaxX)
        .attr('y1', nodeCoordinate$2[curLayerIndex][selectedI].y + nodeLength$5 / 2)
        .attr('y2', nodeCoordinate$2[curLayerIndex][selectedI].y + nodeLength$5 / 2)
        .style('fill', 'none')
        .style('stroke', '#EAEAEA')
        .style('stroke-width', '1.2')
        .lower();

      // Add the flatten to logit links
      let linkData = [];
      let flattenLength = cnn$2.flatten.length / cnn$2[1].length;
      let underneathIs = [...Array(cnn$2[layerIndexDict['output']].length).keys()]
        .filter(d => d != selectedI);
      let curIIndex = 0;
      let linkGen = d3.linkHorizontal()
        .x(d => d.x)
        .y(d => d.y);

      const drawOneEdgeGroup = () => {
        // Only draw the new group if it is in the softmax mode
        if (!allowsSoftmaxAnimation) {
          svg$4.select('.underneath')
            .selectAll(`.logit-lower`)
            .remove();
          return;
        }

        let curI = underneathIs[curIIndex];

        let curEdgeGroup = svg$4.select('.underneath')
          .select(`#logit-lower-${curI}`);
        
        if (curEdgeGroup.empty()) {
          curEdgeGroup = svg$4.select('.underneath')
            .append('g')
            .attr('class', 'logit-lower')
            .attr('id', `logit-lower-${curI}`)
            .style('opacity', 0);

          // Hack: now show all edges, only draw 1/3 of the actual edges
          // for (let f = 0; f < flattenLength; f += 3) {
          //   let loopFactors = [0, 9];
          //   loopFactors.forEach(l => {
          //     let factoredF = f + l * flattenLength;
        
          //     // Flatten -> output
          //     linkData.push({
          //       source: {x: intermediateX1 + pixelWidth + 3 - moveX,
          //         y:  l === 0 ? topY + f * pixelHeight : bottomY + f * pixelHeight},
          //       target: {x: intermediateX2 - moveX,
          //         y: nodeCoordinate[curLayerIndex][curI].y + nodeLength / 2},
          //       index: factoredF,
          //       weight: cnn.flatten[factoredF].outputLinks[curI].weight,
          //       color: '#F1F1F1',
          //       width: 0.5,
          //       opacity: 1,
          //       class: `softmax-edge-${curI}`
          //     });
          //   });
          // }

          // Draw middle rect to logits
          for (let vi = 0; vi < cnn$2[curLayerIndex-1].length; vi++) {
            linkData.push({
              source: {x: intermediateX1 + 1.5 * nodeLength$5 - moveX,
                y: nodeCoordinate$2[curLayerIndex-1][vi].y + nodeLength$5 / 2},
              target: {x: intermediateX2 - moveX,
                y: nodeCoordinate$2[curLayerIndex][curI].y + nodeLength$5 / 2},
              index: -1,
              color: '#EDEDED',
              width: 0.5,
              opacity: 1,
              class: `softmax-abstract-edge-${curI}`
            });
          }

          // Render the edges on the underneath layer
          curEdgeGroup.selectAll(`path.softmax-edge-${curI}`)
            .data(linkData)
            .enter()
            .append('path')
            .attr('class', d => d.class)
            .attr('id', d => `edge-${d.name}`)
            .attr('d', d => linkGen({source: d.source, target: d.target}))
            .style('fill', 'none')
            .style('stroke-width', d => d.width)
            .style('stroke', d => d.color === undefined ? intermediateColor$2 : d.color)
            .style('opacity', d => d.opacity)
            .style('pointer-events', 'none');
        }
        
        let curNodeGroup = logitLayer.append('g')
          .attr('class', `logit-layer-${curI}`)
          .style('opacity', 0);
        
        // Draw the plus symbol
        let symbolClone = symbolGroup.clone(true)
          .style('opacity', 0);

        // Change the style of the clone
        symbolClone.attr('class', 'plus-symbol-clone')
          .attr('id', `plus-symbol-clone-${curI}`)
          .select('circle')
          .datum({fill: gappedColorScale(layerColorScales$5.weight,
            flattenRange, cnn$2[layerIndexDict['output']][curI].bias, 0.35)})
          .style('pointer-events', 'none')
          .style('fill', '#E5E5E5');

        symbolClone.attr('transform', `translate(${symbolX},
      ${nodeCoordinate$2[curLayerIndex][curI].y + nodeLength$5 / 2})`);
        
        // Draw the outter link using only merged path
        let outputEdgeD1 = linkGen({
          source: {
            x: intermediateX2 - moveX + plusSymbolRadius$1 * 2,
            y: nodeCoordinate$2[curLayerIndex][curI].y + nodeLength$5 / 2
          },
          target: {
            x: centerX + logitRadius,
            y: nodeCoordinate$2[curLayerIndex][curI].y + nodeLength$5 / 2
          }
        });

        let outputEdgeD2 = linkGen({
          source: {
            x: centerX + logitRadius,
            y: nodeCoordinate$2[curLayerIndex][curI].y + nodeLength$5 / 2
          },
          target: {
            x: softmaxX,
            y: nodeCoordinate$2[curLayerIndex][selectedI].y + nodeLength$5 / 2
          }
        });

        // There are ways to combine these two paths into one. However, the animation
        // for merged path is not continuous, so we use two saperate paths here.

        let outputEdge1 = logitLayerLower.append('path')
          .attr('class', `logit-output-edge-${curI}`)
          .attr('d', outputEdgeD1)
          .style('fill', 'none')
          .style('stroke', '#EAEAEA')
          .style('stroke-width', '1.2');

        let outputEdge2 = logitLayerLower.append('path')
          .attr('class', `logit-output-edge-${curI}`)
          .attr('d', outputEdgeD2)
          .style('fill', 'none')
          .style('stroke', '#EAEAEA')
          .style('stroke-width', '1.2');
        
        let outputEdgeLength1 = outputEdge1.node().getTotalLength();
        let outputEdgeLength2 = outputEdge2.node().getTotalLength();
        let totalLength = outputEdgeLength1 + outputEdgeLength2;
        let totalDuration = hasInitialized ? 500 : 800;
        let opacityDuration = hasInitialized ? 400 : 600;

        outputEdge1.attr('stroke-dasharray', outputEdgeLength1 + ' ' + outputEdgeLength1)
          .attr('stroke-dashoffset', outputEdgeLength1);
        
        outputEdge2.attr('stroke-dasharray', outputEdgeLength2 + ' ' + outputEdgeLength2)
          .attr('stroke-dashoffset', outputEdgeLength2);

        outputEdge1.transition('softmax-output-edge')
          .duration(outputEdgeLength1 / totalLength * totalDuration)
          .attr('stroke-dashoffset', 0);

        outputEdge2.transition('softmax-output-edge')
          .delay(outputEdgeLength1 / totalLength * totalDuration)
          .duration(outputEdgeLength2 / totalLength * totalDuration)
          .attr('stroke-dashoffset', 0);
        
        // Draw the logit circle
        curNodeGroup.append('circle')
          .attr('class', 'logit-circle')
          .attr('id', `logit-circle-${curI}`)
          .attr('cx', centerX)
          .attr('cy', nodeCoordinate$2[curLayerIndex][curI].y + nodeLength$5 / 2)
          .attr('r', 7)
          .style('fill', layerColorScales$5.logit(logitColorScale(logits[curI])))
          .style('stroke', intermediateColor$2)
          .style('cursor', 'crosshair')
          .on('mouseover', () => logitCircleMouseOverHandler(curI))
          .on('mouseleave', () => logitCircleMouseLeaveHandler(curI))
          .on('click', () => { d3.event.stopPropagation(); });
        
        // Show the element in the detailed view
        softmaxDetailViewInfo.startAnimation = {
          i: curI,
          duration: opacityDuration,
          // Always show the animation
          hasInitialized: false
        };
        softmaxDetailViewStore.set(softmaxDetailViewInfo);

        // Show the elements with animation    
        curNodeGroup.transition('softmax-edge')
          .duration(opacityDuration)
          .style('opacity', 1);

        if ((selectedI < 3 && curI == 14) || (selectedI >= 3 && curI == 0)) {
          // Show the hover text
          softmaxDetailAnnotation.select('.softmax-detail-hover-annotation')
            .transition('softmax-edge')
            .duration(opacityDuration)
            .style('opacity', 1);
        }

        softmaxDetailAnnotation.select(`#logit-text-${curI}`)
          .transition('softmax-edge')
          .duration(opacityDuration)
          .style('opacity', 1);
        
        curEdgeGroup.transition('softmax-edge')
          .duration(opacityDuration)
          .style('opacity', 1)
          .on('end', () => {
            // Recursive animaiton
            curIIndex ++;
            if (curIIndex < underneathIs.length) {
              linkData = [];
              drawOneEdgeGroup();
            } else {
              hasInitialized = true;
              softmaxDetailViewInfo.hasInitialized = true;
              softmaxDetailViewStore.set(softmaxDetailViewInfo);
            }
          });
        
        symbolClone.transition('softmax-edge')
          .duration(opacityDuration)
          .style('opacity', 0.2);
      };

      // Show the softmax detail view
      let anchorElement = svg$4.select('.intermediate-layer')
        .select('.layer-label').node();
      let pos = getMidCoords(svg$4, anchorElement);
      let wholeSvg = d3.select('#cnn-svg');
      let svgYMid = +wholeSvg.style('height').replace('px', '') / 2;
      let detailViewTop = 100 + svgYMid - 192 / 2;

      const detailview = document.getElementById('detailview');
      detailview.style.top = `${detailViewTop + 2300}px`;
      detailview.style.left = `${pos.left - 900 - 50}px`;
      detailview.style.position = 'absolute';

      softmaxDetailViewStore.set({
        show: true, 
        logits: logits,
        logitColors: logits.map(d => layerColorScales$5.logit(logitColorScale(d))),
        selectedI: selectedI,
        highlightI: -1,
        outputName: classList[selectedI],
        outputValue: cnn$2[layerIndexDict['output']][selectedI].output,
        startAnimation: {i: -1, duration: 0, hasInitialized: hasInitialized}
      });

      drawOneEdgeGroup();

      // Draw logit circle color scale
      drawIntermediateLayerLegend({
        legendHeight: 5,
        curLayerIndex: curLayerIndex,
        range: d3.extent(logits)[1] - d3.extent(logits)[0],
        minMax: {min: d3.extent(logits)[0], max: d3.extent(logits)[1]},
        group: logitLayer,
        width: softmaxX - (intermediateX2 + plusSymbolRadius$1 * 2 - moveX + 5),
        gradientAppendingName: 'flatten-logit-gradient',
        gradientGap: 0.1,
        colorScale: layerColorScales$5.logit,
        x: intermediateX2 + plusSymbolRadius$1 * 2 - moveX + 5,
        y: svgPaddings$3.top + vSpaceAroundGap$2 * (10) + vSpaceAroundGap$2 + 
          nodeLength$5 * 15
      });

      // Draw logit layer label
      let logitLabel = logitLayer.append('g')
        .attr('class', 'layer-label')
        .classed('hidden', detailedMode$2)
        .attr('transform', () => {
          let x = centerX;
          let y = (svgPaddings$3.top + vSpaceAroundGap$2) / 2 + 5;
          return `translate(${x}, ${y})`;
        });

      logitLabel.append('text')
        .style('text-anchor', 'middle')
        .style('dominant-baseline', 'middle')
        .style('opacity', 0.8)
        .style('font-weight', 800)
        .text('logit');
    };

    const removeLogitLayer = () => {
      svg$4.select('.logit-layer').remove();
      svg$4.select('.logit-layer-lower').remove();
      svg$4.selectAll('.plus-symbol-clone').remove();

      // Instead of removing the paths, we hide them, so it is faster to load in
      // the future
      svg$4.select('.underneath')
        .selectAll('.logit-lower')
        .style('opacity', 0);

      softmaxDetailViewStore.set({
          show: false,
          logits: []
      });
    };

    const softmaxClicked = (arg) => {
      let curLayerIndex = arg.curLayerIndex,
        moveX = arg.moveX,
        symbolX = arg.symbolX,
        symbolY = arg.symbolY,
        outputX = arg.outputX,
        outputY = arg.outputY,
        softmaxLeftMid = arg.softmaxLeftMid,
        selectedI = arg.selectedI,
        intermediateX1 = arg.intermediateX1,
        intermediateX2 = arg.intermediateX2,
        pixelWidth = arg.pixelWidth,
        pixelHeight = arg.pixelHeight,
        topY = arg.topY,
        bottomY = arg.bottomY,
        middleGap = arg.middleGap,
        middleRectHeight = arg.middleRectHeight,
        softmaxX = arg.softmaxX,
        softmaxTextY = arg.softmaxTextY,
        softmaxWidth = arg.softmaxWidth,
        symbolGroup = arg.symbolGroup,
        flattenRange = arg.flattenRange;

      let duration = 600;
      let centerX = softmaxLeftMid - moveX * 4 / 5;
      d3.event.stopPropagation();

      // Clean up the logit elemends before moving anything
      if (isInSoftmax) {
        allowsSoftmaxAnimationStore.set(false);
        removeLogitLayer();
      } else {
        allowsSoftmaxAnimationStore.set(true);
      }

      // Move the overlay gradient
      svg$4.select('.intermediate-layer-overlay')
        .select('rect.overlay')
        .transition('softmax')
        .ease(d3.easeCubicInOut)
        .duration(duration)
        .attr('transform', `translate(${isInSoftmax ? 0 : -moveX}, ${0})`);

      // Move the legends
      svg$4.selectAll(`.intermediate-legend-${curLayerIndex - 1}`)
        .each((d, i, g) => moveLegend(d, i, g, moveX, duration, isInSoftmax));

      svg$4.select('.intermediate-layer')
        .select(`.layer-label`)
        .each((d, i, g) => moveLegend(d, i, g, moveX, duration, isInSoftmax));

      svg$4.select('.intermediate-layer')
        .select(`.layer-detailed-label`)
        .each((d, i, g) => moveLegend(d, i, g, moveX, duration, isInSoftmax));

      // Also move all layers on the left
      for (let i = curLayerIndex - 1; i >= 0; i--) {
        let curLayer = svg$4.select(`g#cnn-layer-group-${i}`);
        let previousX;
        if(i === 5){
          previousX = +curLayer.select('circle.dense-circle').attr('cx') - nodeLength$5 / 2;
        }else {
          previousX = +curLayer.select('image').attr('x');
        }
        let newX = isInSoftmax ? previousX + moveX : previousX - moveX;
        moveLayerX({
          layerIndex: i,
          targetX: newX,
          disable: true,
          delay: 0,
          transitionName: 'softmax',
          duration: duration
        });
      }

      // Hide the sum up annotation
      svg$4.select('.plus-annotation')
        .transition('softmax')
        .duration(duration)
        .style('opacity', isInSoftmax ? 1 : 0)
        .style('pointer-events', isInSoftmax ? 'all' : 'none');

      // Hide the softmax annotation
      let softmaxAnnotation = svg$4.select('.softmax-annotation')
        .style('pointer-events', isInSoftmax ? 'all' : 'none');
      
      let softmaxDetailAnnotation = softmaxAnnotation.selectAll('.softmax-detail-annoataion')
        .data([0])
        .enter()
        .append('g')
        .attr('class', 'softmax-detail-annoataion');

      // Remove the detailed annoatioan when quitting the detail view
      if (isInSoftmax) {
        softmaxAnnotation.selectAll('.softmax-detail-annoataion').remove();
      }

      softmaxAnnotation.select('.arrow-group')
        .transition('softmax')
        .duration(duration)
        .style('opacity', isInSoftmax ? 1 : 0);

      softmaxAnnotation.select('.annotation-text')
        .style('cursor', 'help')
        .style('pointer-events', 'all')
        .on('click', () => {
          d3.event.stopPropagation();
          // Scroll to the article element
          document.querySelector(`#article-softmax`).scrollIntoView({ 
            behavior: 'smooth' 
          });
        })
        .transition('softmax')
        .duration(duration)
        .style('opacity', isInSoftmax ? 1 : 0)
        .on('end', () => {
          if (!isInSoftmax) {
            // Add new annotation for the softmax button
            let textX = softmaxX + softmaxWidth / 2;
            let textY = softmaxTextY - 10;

            if (selectedI === 0) {
              textY = softmaxTextY + 70;
            }

            let text = softmaxDetailAnnotation.append('text')
              .attr('x', textX)
              .attr('y', textY)
              .attr('class', 'annotation-text softmax-detail-text')
              .style('dominant-baseline', 'baseline')
              .style('text-anchor', 'middle')
              .text('SoftMax将Logit的值');
            
            text.append('tspan')
              .attr('dx', 1)
              .text(' 转化为');

            text.append('tspan')
              .attr('x', textX)
              .attr('dy', '1.1em')
              .text('类别概率');

            if (selectedI === 0) {
              drawArrow({
                group: softmaxDetailAnnotation,
                sx: softmaxX + softmaxWidth / 2 - 5,
                sy: softmaxTextY + 44,
                tx: softmaxX + softmaxWidth / 2,
                ty: textY - 12,
                dr: 50,
                hFlip: true,
                marker: 'marker-alt'
              });
            } else {
              drawArrow({
                group: softmaxDetailAnnotation,
                sx: softmaxX + softmaxWidth / 2 - 5,
                sy: softmaxTextY + 4,
                tx: softmaxX + softmaxWidth / 2,
                ty: symbolY - plusSymbolRadius$1 - 4,
                dr: 50,
                hFlip: true,
                marker: 'marker-alt'
              });
            }

            // Add annotation for the logit layer label
            textX = centerX + 45;
            textY = (svgPaddings$3.top + vSpaceAroundGap$2) / 2 + 5;
            let arrowTY = (svgPaddings$3.top + vSpaceAroundGap$2) / 2 + 5;

            softmaxDetailAnnotation.append('g')
              .attr('class', 'layer-detailed-label')
              .attr('transform', () => {
                let x = centerX;
                let y = (svgPaddings$3.top + vSpaceAroundGap$2) / 2 - 5;
                return `translate(${x}, ${y})`;
              })
              .classed('hidden', !detailedMode$2)
              .append('text')
              // .attr('x', centerX)
              // .attr('y',  (svgPaddings.top + vSpaceAroundGap) / 2 - 6)
              .style('opacity', 0.7)
              .style('dominant-baseline', 'middle')
              .style('font-size', '12px')
              .style('font-weight', '800')
              .append('tspan')
              .attr('x', 0)
              .text('logit')
              .append('tspan')
              .attr('x', 0)
              .style('font-size', '8px')
              .style('font-weight', 'normal')
              .attr('dy', '1.5em')
              .text('(10)');


            // Add annotation for the logit circle
            for (let i = 0; i < 15; i++) {
              softmaxDetailAnnotation.append('text')
                .attr('x', centerX)
                .attr('y', nodeCoordinate$2[curLayerIndex][i].y + nodeLength$5 / 2 + 8)
                .attr('class', 'annotation-text softmax-detail-text')
                .attr('id', `logit-text-${i}`)
                .style('text-anchor', 'middle')
                .style('dominant-baseline', 'hanging')
                .style('opacity', 0)
                .text(`${classList[i]}`);
            }

            let hoverTextGroup = softmaxDetailAnnotation.append('g')
              .attr('class', 'softmax-detail-hover-annotation')
              .style('opacity', 0);

            textX = centerX + 50;
            textY = nodeCoordinate$2[curLayerIndex][0].y + nodeLength$5 / 2;

            if (selectedI < 3) {
              textY = nodeCoordinate$2[curLayerIndex][14].y + nodeLength$5 / 2;
            }

            // Add annotation to prompt user to check the logit value
            let hoverText = hoverTextGroup.append('text')
              .attr('x', textX)
              .attr('y', textY)
              .attr('class', 'annotation-text softmax-detail-text softmax-hover-text')
              .style('text-anchor', 'start')
              .style('dominant-baseline', 'baseline')
              .append('tspan')
              .style('font-weight', 700)
              .style('dominant-baseline', 'baseline')
              .text(`Hover over `)
              .append('tspan')
              .style('font-weight', 400)
              .style('dominant-baseline', 'baseline')
              .text('to see');
            
            hoverText.append('tspan')
              .style('dominant-baseline', 'baseline')
              .attr('x', textX)
              .attr('dy', '1em')
              .text('its ');

            hoverText.append('tspan')
              .style('dominant-baseline', 'baseline')
              .attr('dx', 1)
              .style('fill', '#E56014')
              .text('logit');
            
            hoverText.append('tspan')
              .style('dominant-baseline', 'baseline')
              .attr('dx', 1)
              .text(' value');
            
            drawArrow({
              group: hoverTextGroup,
              tx: centerX + 15,
              ty: textY,
              sx: textX - 8,
              sy: textY + 2,
              dr: 60,
              hFlip: false
            });
          }
        });

      // Hide the annotation
      svg$4.select('.flatten-annotation')
        .transition('softmax')
        .duration(duration)
        .style('opacity', isInSoftmax ? 1 : 0)
        .style('pointer-events', isInSoftmax ? 'all' : 'none');

      // Move the left part of faltten layer elements
      let flattenLeftPart = svg$4.select('.flatten-layer-left');
      flattenLeftPart.transition('softmax')
        .duration(duration)
        .ease(d3.easeCubicInOut)
        .attr('transform', `translate(${isInSoftmax ? 0 : -moveX}, ${0})`)
        .on('end', () => {
          // Add the logit layer
          if (!isInSoftmax) {
            let logitArg = {
              curLayerIndex: curLayerIndex,
              moveX: moveX,
              softmaxLeftMid: softmaxLeftMid,
              selectedI: selectedI,
              intermediateX1: intermediateX1,
              intermediateX2: intermediateX2,
              pixelWidth: pixelWidth,
              pixelHeight: pixelHeight,
              topY: topY,
              bottomY: bottomY,
              middleGap: middleGap,
              middleRectHeight: middleRectHeight,
              softmaxX: softmaxX,
              symbolGroup: symbolGroup,
              symbolX: symbolX,
              flattenRange: flattenRange
            };
            drawLogitLayer(logitArg);
          }

          // Redraw the line from the plus symbol to the output node
          if (!isInSoftmax) {
            let newLine = flattenLeftPart.select('.edge-group')
              .append('line')
              .attr('class', 'symbol-output-line')
              .attr('x1', symbolX)
              .attr('y1', symbolY)
              .attr('x2', outputX + moveX)
              .attr('y2', outputY)
              .style('stroke-width', 1.2)
              .style('stroke', '#E5E5E5')
              .style('opacity', 0);
            
            newLine.transition('softmax')
              .delay(duration / 3)
              .duration(duration * 2 / 3)
              .style('opacity', 1);
          } else {
            flattenLeftPart.select('.symbol-output-line').remove();
          }
          
          isInSoftmax = !isInSoftmax;
          isInSoftmaxStore.set(isInSoftmax);
        });
    };

    /**
     * Draw the flatten layer before output layer
     * @param {number} curLayerIndex Index of the selected layer
     * @param {object} d Bounded d3 data
     * @param {number} i Index of the selected node
     * @param {number} width CNN group width
     * @param {number} height CNN group height
     */
    const drawOutFlatten = (curLayerIndex, d, i, width, height) => {
      // Show the output legend
      svg$4.selectAll('.output-legend')
        .classed('hidden', false);

      let pixelWidth = nodeLength$5 / 2;
      let pixelHeight = 1.1;
      let totalLength = (2 * nodeLength$5 +
        2 * hSpaceAroundGap$2 * gapRatio$2 + pixelWidth);
      let leftX = nodeCoordinate$2[curLayerIndex][0].x - totalLength;
      // let intermediateGap = (hSpaceAroundGap * gapRatio * 4) / 2;
      let intermediateGap = totalLength / 2 - 3 * nodeLength$5;
      const minimumGap = 20;
      let linkGen = d3.linkHorizontal()
        .x(d => d.x)
        .y(d => d.y);

      // Hide the edges
      svg$4.select('g.edge-group')
        .style('visibility', 'hidden');

      // Move the previous layer
      moveLayerX({layerIndex: curLayerIndex - 1, targetX: leftX,
        disable: true, delay: 0});

      // Disable the current layer (output layer)
      moveLayerX({layerIndex: curLayerIndex,
        targetX: nodeCoordinate$2[curLayerIndex][0].x, disable: true,
        delay: 0, opacity: 0.15, specialIndex: i});
      
      // Compute the gap in the left shrink region
      let leftEnd = leftX - hSpaceAroundGap$2;
      let leftGap = (leftEnd - nodeCoordinate$2[0][0].x - 10 * nodeLength$5) / 10;

      // Different from other intermediate view, we push the left part dynamically
      // 1. If there is enough space, we fix the first layer position and move all
      // other layers;
      // 2. If there is not enough space, we maintain the minimum gap and push all
      // left layers to the left (could be out-of-screen)
      if (leftGap > minimumGap) {
        // Move the left layers
        for (let i = 0; i < curLayerIndex - 1; i++) {
          let curX = nodeCoordinate$2[0][0].x + i * (nodeLength$5 + leftGap);
          moveLayerX({layerIndex: i, targetX: curX, disable: true, delay: 0});
        }
      } else {
        leftGap = minimumGap;
        let curLeftBound = leftX - leftGap * 2 - nodeLength$5;
        // Move the left layers
        for (let i = curLayerIndex - 2; i >= 0; i--) {
          moveLayerX({layerIndex: i, targetX: curLeftBound, disable: true, delay: 0});
          curLeftBound = curLeftBound - leftGap - nodeLength$5;
        }
      }

      // Add an overlay
      let stops = [{offset: '0%', color: 'rgb(250, 250, 250)', opacity: 1},
        {offset: '50%', color: 'rgb(250, 250, 250)', opacity: 0.95},
        {offset: '100%', color: 'rgb(250, 250, 250)', opacity: 0.85}];
      addOverlayGradient('overlay-gradient-left', stops);

      let intermediateLayerOverlay = svg$4.append('g')
        .attr('class', 'intermediate-layer-overlay');

      intermediateLayerOverlay.append('rect')
        .attr('class', 'overlay')
        .style('fill', 'url(#overlay-gradient-left)')
        .style('stroke', 'none')
        .attr('width', leftX + svgPaddings$3.left - (leftGap * 2) + 3)
        .attr('height', height + svgPaddings$3.top + svgPaddings$3.bottom)
        .attr('x', -svgPaddings$3.left)
        .attr('y', 0)
        .style('opacity', 0);
      
      intermediateLayerOverlay.selectAll('rect.overlay')
        .transition('move')
        .duration(800)
        .ease(d3.easeCubicInOut)
        .style('opacity', 1);

      // Add the intermediate layer
      let intermediateLayer = svg$4.append('g')
        .attr('class', 'intermediate-layer')
        .style('opacity', 0);
      
      let intermediateX1 = leftX;
      let intermediateX2 = intermediateX1 + 2 * intermediateGap + pixelWidth;
      let range = cnnLayerRanges$2[selectedScaleLevel$2][curLayerIndex - 1];
      let colorScale = layerColorScales$5.conv;
      let linkData = [];

      let flattenLayer = intermediateLayer.append('g')
        .attr('class', 'flatten-layer');
      
      let flattenLayerLeftPart = flattenLayer.append('g')
        .attr('class', 'flatten-layer-left');
      
      let topY = nodeCoordinate$2[curLayerIndex - 1][0].y;
      let bottomY = nodeCoordinate$2[curLayerIndex - 1][9].y + nodeLength$5;
      
      let Ys = [];
      for (let n = 0; n < cnn$2[curLayerIndex - 1].length; n++) {
          Ys.push(nodeCoordinate$2[curLayerIndex - 1][n].y + nodeLength$5 / 2);
      }

      // Compute the pre-layer gap
      let preLayerDimension = cnn$2[curLayerIndex - 1][0].output.length;

      // Compute the weight color scale
      let flattenExtent = d3.extent(cnn$2[curLayerIndex-1].slice(0)
        .map(d => d.outputLinks[i].weight)
        .concat(cnn$2[curLayerIndex-1].slice(9)
          .map(d => d.outputLinks[i].weight)));

      let flattenRange = 2 * (Math.round(
        Math.max(...flattenExtent.map(Math.abs)) * 1000) / 1000);

      let flattenMouseOverHandler = (d) => {
        let index = d.index;
        // Screenshot
        // console.log(index);

        // Update the hover info UI
        if (d.weight === undefined) {
          hoverInfo = {
            show: true,
            text: `Pixel value: ${formater$2(flattenFactoredFDict[index])}`
          };
        } else {
          hoverInfo = {
            show: true,
            text: `Weight: ${formater$2(d.weight)}`
          };
        }
        hoverInfoStore.set(hoverInfo);

        flattenLayerLeftPart.select(`#edge-flatten-${index}`)
          .raise()
          .style('stroke', intermediateColor$2)
          .style('stroke-width', 1);

        flattenLayerLeftPart.select(`#edge-flatten-${index}-output`)
          .raise()
          .style('stroke-width', 1)
          .style('stroke', da => gappedColorScale(layerColorScales$5.weight,
            flattenRange, da.weight, 0.1));

        flattenLayerLeftPart.select(`#bounding-${index}`)
          .raise()
          .style('opacity', 1);
      };

      let flattenMouseLeaveHandler = (d) => {
        let index = d.index;

        // screenshot
        // if (index === 70) {return;}

        // Update the hover info UI
        if (d.weight === undefined) {
          hoverInfo = {
            show: false,
            text: `Pixel value: ${formater$2(flattenFactoredFDict[index])}`
          };
        } else {
          hoverInfo = {
            show: false,
            text: `Weight: ${formater$2(d.weight)}`
          };
        }
        hoverInfoStore.set(hoverInfo);

        flattenLayerLeftPart.select(`#edge-flatten-${index}`)
          .style('stroke-width', 0.6)
          .style('stroke', '#E5E5E5');

        flattenLayerLeftPart.select(`#edge-flatten-${index}-output`)
          .style('stroke-width', 0.6)
          .style('stroke', da => gappedColorScale(layerColorScales$5.weight,
            flattenRange, da.weight, 0.35));

        flattenLayerLeftPart.select(`#bounding-${index}`)
          .raise()
          .style('opacity', 0);
      };

      flattenFactoredFDict = {};
      for (let f = 0; f < 10; f++) {
          let factoredF = f;
          flattenFactoredFDict[factoredF] = cnn$2[curLayerIndex-1][factoredF].output;
          linkData.push({
            target: {x: intermediateX2,
              //nodeCoordinate[curLayerIndex][i].x - nodeLength,
              y: nodeCoordinate$2[curLayerIndex][i].y + nodeLength$5 / 2},
            source: {x: leftX + nodeLength$5 + 3,
              y: nodeCoordinate$2[curLayerIndex - 1][f].y + nodeLength$5 / 2},
            index: factoredF,
            weight: cnn$2[curLayerIndex-1][factoredF].outputLinks[i].weight,
            name: `flatten-${factoredF}-output`,
            color: gappedColorScale(layerColorScales$5.weight,
              flattenRange, cnn$2[curLayerIndex-1][factoredF].outputLinks[i].weight, 0.35),
            width: 1,
            opacity: 1,
            class: `flatten-output`
          });

          // Add original pixel bounding box
          // let loc = cnn.flatten[factoredF].inputLinks[0].weight;
          // flattenLayerLeftPart.append('rect')
          //   .attr('id', `bounding-${factoredF}`)
          //   .attr('class', 'flatten-bounding')
          //   .attr('x', leftX + loc[1] * boundingBoxLength)
          //   .attr('y', nodeCoordinate[curLayerIndex - 1][l].y + loc[0] * boundingBoxLength)
          //   .attr('width', boundingBoxLength)
          //   .attr('height', boundingBoxLength)
          //   .style('fill', 'none')
          //   .style('stroke', intermediateColor)
          //   .style('stroke-length', '0.5')
          //   .style('pointer-events', 'all')
          //   .style('cursor', 'crosshair')
          //   .style('opacity', 0)
          //   .on('mouseover', () => flattenMouseOverHandler({index: factoredF}))
          //   .on('mouseleave', () => flattenMouseLeaveHandler({index: factoredF}))
          //   .on('click', () => {d3.event.stopPropagation()});
      }
      

      // Compute the middle gap
      let middleGap = 5;
      let middleRectHeight = (10 * nodeLength$5 + (10 - 1) * vSpaceAroundGap$2 - 5 * (8 + 1)) / 8;


      // Draw the plus operation symbol
      let symbolX = intermediateX2 + plusSymbolRadius$1;
      let symbolY = nodeCoordinate$2[curLayerIndex][i].y + nodeLength$5 / 2;
      let symbolRectHeight = 1;
      let symbolGroup = flattenLayerLeftPart.append('g')
        .attr('class', 'plus-symbol')
        .attr('transform', `translate(${symbolX}, ${symbolY})`);
      
      symbolGroup.append('rect')
        .attr('x', -plusSymbolRadius$1)
        .attr('y', -plusSymbolRadius$1)
        .attr('width', plusSymbolRadius$1 * 2)
        .attr('height', plusSymbolRadius$1 * 2)
        .attr('rx', 3)
        .attr('ry', 3)
        .style('fill', 'none')
        .style('stroke', intermediateColor$2);
      
      symbolGroup.append('rect')
        .attr('x', -(plusSymbolRadius$1 - 3))
        .attr('y', -symbolRectHeight / 2)
        .attr('width', 2 * (plusSymbolRadius$1 - 3))
        .attr('height', symbolRectHeight)
        .style('fill', intermediateColor$2);

      symbolGroup.append('rect')
        .attr('x', -symbolRectHeight / 2)
        .attr('y', -(plusSymbolRadius$1 - 3))
        .attr('width', symbolRectHeight)
        .attr('height', 2 * (plusSymbolRadius$1 - 3))
        .style('fill', intermediateColor$2);

      // Place the bias rectangle below the plus sign if user clicks the first
      // conv node (no need now, since we added annotaiton for softmax to make it
      // look better aligned)
      // Add bias symbol to the plus symbol
      symbolGroup.append('circle')
        .attr('cx', 0)
        .attr('cy', -nodeLength$5 / 2 - 0.5 * kernelRectLength$1)
        .attr('r', kernelRectLength$1 * 1.5)
        .style('stroke', intermediateColor$2)
        .style('cursor', 'crosshair')
        .style('fill', gappedColorScale(layerColorScales$5.weight,
            flattenRange, d.bias, 0.35))
        .on('mouseover', () => {
          hoverInfoStore.set( {show: true, text: `Bias: ${formater$2(d.bias)}`} );
        })
        .on('mouseleave', () => {
          hoverInfoStore.set( {show: false, text: `Bias: ${formater$2(d.bias)}`} );
        })
        .on('click', () => { d3.event.stopPropagation(); });
      
      // Link from bias to the plus symbol
      symbolGroup.append('path')
        .attr('d', linkGen({
          source: { x: 0, y: 0 },
          target: { x: 0, y: -nodeLength$5 / 2 - 0.5 * kernelRectLength$1 }
        }))
        .attr('id', 'bias-plus')
        .attr('stroke-width', 1.2)
        .attr('stroke', '#E5E5E5')
        .lower();

      // Link from the plus symbol to the output
      linkData.push({
        source: getOutputKnot({x: intermediateX2 + 2 * plusSymbolRadius$1 - nodeLength$5,
          y: nodeCoordinate$2[curLayerIndex][i].y}),
        target: getInputKnot({x: nodeCoordinate$2[curLayerIndex][i].x - 3,
          y: nodeCoordinate$2[curLayerIndex][i].y}),
        name: `symbol-output`,
        width: 1.2,
        color: '#E5E5E5'
      });

      // Draw softmax operation symbol
      let softmaxWidth = 55;
      let emptySpace = ((totalLength - 2 * nodeLength$5 - 2 * intermediateGap)
        - softmaxWidth) / 2;
      let symbolEndX = intermediateX2 + plusSymbolRadius$1 * 2;
      let softmaxX = emptySpace + symbolEndX;
      let softmaxLeftMid = emptySpace / 2 + symbolEndX;
      let softmaxTextY = nodeCoordinate$2[curLayerIndex][i].y - 2 * kernelRectLength$1 - 6;
      let moveX = (intermediateX2 - (intermediateX1 + pixelWidth + 3)) * 2 / 3;

      let softmaxArg = {
        curLayerIndex: curLayerIndex,
        moveX: moveX,
        symbolX: symbolX,
        symbolY: symbolY,
        outputX: nodeCoordinate$2[curLayerIndex][i].x,
        outputY: symbolY,
        softmaxLeftMid: softmaxLeftMid,
        selectedI: i,
        intermediateX1: intermediateX1,
        intermediateX2: intermediateX2,
        pixelWidth: pixelWidth,
        pixelHeight: pixelHeight,
        topY: topY,
        bottomY: bottomY,
        middleGap: middleGap,
        middleRectHeight: middleRectHeight,
        softmaxX: softmaxX,
        softmaxWidth: softmaxWidth,
        softmaxTextY: softmaxTextY,
        symbolGroup: symbolGroup,
        flattenRange: flattenRange
      };

      let softmaxSymbol = intermediateLayer.append('g')
        .attr('class', 'softmax-symbol')
        .attr('transform', `translate(${softmaxX}, ${symbolY})`)
        .style('pointer-event', 'all')
        .style('cursor', 'pointer')
        .on('click', () => softmaxClicked(softmaxArg));
      
      softmaxSymbol.append('rect')
        .attr('x', 0)
        .attr('y', -plusSymbolRadius$1)
        .attr('width', softmaxWidth)
        .attr('height', plusSymbolRadius$1 * 2)
        .attr('stroke', intermediateColor$2)
        .attr('rx', 2)
        .attr('ry', 2)
        .attr('fill', '#FAFAFA');
      
      softmaxSymbol.append('text')
        .attr('x', 5)
        .attr('y', 1)
        .style('dominant-baseline', 'middle')
        .style('font-size', '12px')
        .style('opacity', 0.5)
        .text('softmax');

      // Draw the layer label
      let layerLabel = intermediateLayer.append('g')
        .attr('class', 'layer-label')
        .classed('hidden', detailedMode$2)
        .attr('transform', () => {
          let x = leftX + nodeLength$5 + (4 * hSpaceAroundGap$2 * gapRatio$2 +
            pixelWidth) / 2;
          let y = (svgPaddings$3.top) / 2 + 5;
          return `translate(${x}, ${y})`;
        })
        .style('cursor', 'help')
        .on('click', () => {
          d3.event.stopPropagation();
          // Scroll to the article element
          document.querySelector(`#article-flatten`).scrollIntoView({ 
            behavior: 'smooth' 
          });
        });
      
      layerLabel.append('text')
        .style('dominant-baseline', 'middle')
        .style('opacity', 0.8)
        .style('font-weight', 800)
        .text('拉平为一维向量');

      let svgHeight = Number(d3.select('#cnn-svg').style('height').replace('px', '')) + 150;
      let scroll = new SmoothScroll('a[href*="#"]', {offset: -svgHeight});
        
      // let detailedLabelGroup = intermediateLayer.append('g')
      //   .attr('transform', () => {
      //     let x = intermediateX1 + pixelWidth / 2;
      //     let y = (svgPaddings.top + vSpaceAroundGap) / 2 - 5;
      //     return `translate(${x}, ${y})`;
      //   })
      //   .attr('class', 'layer-detailed-label')
      //   .classed('hidden', !detailedMode)
      //   .style('cursor', 'help')
      //   .on('click', () => {
      //     d3.event.stopPropagation();
      //     // Scroll to the article element
      //     let anchor = document.querySelector(`#article-flatten`);
      //     scroll.animateScroll(anchor);
      //   });
      
      // detailedLabelGroup.append('title')
      //   .text('Move to article section');

      // let detailedLabelText = detailedLabelGroup.append('text')
      //   .style('text-anchor', 'middle')
      //   .style('dominant-baseline', 'middle')
      //   .style('opacity', '0.7')
      //   .style('font-weight', 800)
      //   .append('tspan')
      //   .text('flatten');
      
      // let dimension = cnn[layerIndexDict['max_pooling2d_9']].length * 
      //   cnn[layerIndexDict['max_pooling2d_9']][0].output.length *
      //   cnn[layerIndexDict['max_pooling2d_9']][0].output[0].length;
      

      // detailedLabelText.append('tspan')
      //   .attr('x', 0)
      //   .attr('dy', '1.5em')
      //   .style('font-size', '8px')
      //   .style('font-weight', 'normal')
      //   .text(`(${dimension})`);

      // Add edges between nodes
      let edgeGroup = flattenLayerLeftPart.append('g')
        .attr('class', 'edge-group')
        .lower();
      
      edgeGroup.selectAll('path')
        .data(linkData)
        .enter()
        .append('path')
        .attr('class', d => d.class)
        .attr('id', d => `edge-${d.name}`)
        .attr('d', d => linkGen({source: d.source, target: d.target}))
        .style('fill', 'none')
        .style('stroke-width', d => d.width)
        .style('stroke', d => d.color === undefined ? intermediateColor$2 : d.color)
        .style('opacity', d => d.opacity);
      
      edgeGroup.selectAll('path.flatten-abstract-output')
        .lower();

      edgeGroup.selectAll('path.flatten,path.flatten-output')
        .style('cursor', 'crosshair')
        .style('pointer-events', 'all')
        .on('mouseover', flattenMouseOverHandler)
        .on('mouseleave', flattenMouseLeaveHandler)
        .on('click', () => { d3.event.stopPropagation(); });
      
      // Add legend
      let min_layer_index = curLayerIndex - 1;
      drawIntermediateLayerLegend({
        legendHeight: 5,
        curLayerIndex: curLayerIndex,
        range: range,
        minMax: cnnLayerMinMax$2[min_layer_index],
        group: intermediateLayer,
        width: intermediateGap + nodeLength$5 - 3,
        x: leftX,
        y: svgPaddings$3.top + vSpaceAroundGap$2 * (10) + vSpaceAroundGap$2 + 
          nodeLength$5 * 15
      });

      // drawIntermediateLayerLegend({
      //   legendHeight: 5,
      //   curLayerIndex: curLayerIndex,
      //   range: flattenRange,
      //   minMax: {min: flattenExtent[0], max: flattenExtent[1]},
      //   group: intermediateLayer,
      //   width: intermediateGap - 3 - 5,
      //   gradientAppendingName: 'flatten-weight-gradient',
      //   gradientGap: 0.1,
      //   colorScale: layerColorScales.weight,
      //   x: leftX + intermediateGap + nodeLength + pixelWidth + 3,
      //   y: svgPaddings.top + vSpaceAroundGap * (10) + vSpaceAroundGap + 
      //     nodeLength * 15
      // });

      // Add annotation to the intermediate layer
      let intermediateLayerAnnotation = svg$4.append('g')
        .attr('class', 'intermediate-layer-annotation')
        .style('opacity', 0);

      // Add annotation for the sum operation
      let plusAnnotation = intermediateLayerAnnotation.append('g')
        .attr('class', 'plus-annotation');
      
      // let textX = nodeCoordinate[curLayerIndex][i].x - 50;
      let textX = intermediateX2;
      let textY = nodeCoordinate$2[curLayerIndex][i].y + nodeLength$5 +
        kernelRectLength$1 * 3;
      let arrowSY = nodeCoordinate$2[curLayerIndex][i].y + nodeLength$5 +
        kernelRectLength$1 * 2;
      let arrowTY = nodeCoordinate$2[curLayerIndex][i].y + nodeLength$5 / 2 +
        plusSymbolRadius$1;

      if (i == 9) {
        textY -= 110;
        arrowSY -= 70;
        arrowTY -= 18;
      }

      let plusText = plusAnnotation.append('text')
        .attr('x', textX)
        .attr('y', textY)
        .attr('class', 'annotation-text')
        .style('dominant-baseline', 'hanging')
        .style('text-anchor', 'middle');
      
      plusText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .text('将所有乘积相加');
      
      plusText.append('tspan')
        .attr('x', textX)
        .attr('dy', '1em')
        .style('dominant-baseline', 'hanging')
        .text('(');

      plusText.append('tspan')
        .style('fill', '#66a3c8')
        .style('dominant-baseline', 'hanging')
        .text('输出');

      plusText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .text(' × ');

      plusText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .style('fill', '#b58946')
        .text('权重');

      plusText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .text(')');

      plusText.append('tspan')
        .attr('x', textX)
        .attr('dy', '1em')
        .style('dominant-baseline', 'hanging')
        .text('之后再加上 ');

      plusText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .style('fill', '#479d94')
        .text('偏移量');
      
      drawArrow({
        group: plusAnnotation,
        sx: intermediateX2 - 2 * plusSymbolRadius$1 - 3,
        sy: arrowSY,
        tx: intermediateX2 - 5,
        ty: arrowTY,
        dr: 30,
        hFlip: i === 9,
        marker: 'marker-alt'
      });

      // Add annotation for the bias
      let biasTextY = nodeCoordinate$2[curLayerIndex][i].y;
      biasTextY -= 2 * kernelRectLength$1 + 4;
      
      flattenLayerLeftPart.append('text')
        .attr('class', 'annotation-text')
        .attr('x', intermediateX2 + plusSymbolRadius$1)
        .attr('y', biasTextY)
        .style('text-anchor', 'middle')
        .style('dominant-baseline', 'baseline')
        .text('Bias');
      
      // Add annotation for the softmax symbol
      let softmaxAnnotation = intermediateLayerAnnotation.append('g')
        .attr('class', 'softmax-annotation');
      
      softmaxAnnotation.append('text')
        .attr('x', softmaxX + softmaxWidth / 2)
        .attr('y', softmaxTextY)
        .attr('class', 'annotation-text')
        .style('dominant-baseline', 'baseline')
        .style('text-anchor', 'middle')
        .style('font-weight', 700)
        .text('点击 ')
        .append('tspan')
        .attr('dx', 1)
        .style('font-weight', 400)
        .text('查看细节');

      drawArrow({
        group: softmaxAnnotation,
        sx: softmaxX + softmaxWidth / 2 - 5,
        sy: softmaxTextY + 4,
        tx: softmaxX + softmaxWidth / 2,
        ty: symbolY - plusSymbolRadius$1 - 4,
        dr: 50,
        hFlip: true
      });


      // Add annotation for the output neuron
      let outputAnnotation = intermediateLayerAnnotation.append('g')
        .attr('class', 'output-annotation');
      
      outputAnnotation.append('text')
        .attr('x', nodeCoordinate$2[curLayerIndex][i].x)
        .attr('y', nodeCoordinate$2[curLayerIndex][i].y + 10)
        .attr('class', 'annotation-text')
        .text(`(${d3.format('.4f')(cnn$2[curLayerIndex][i].output)})`);


      // Show everything
      svg$4.selectAll('g.intermediate-layer, g.intermediate-layer-annotation')
        .transition()
        .delay(500)
        .duration(500)
        .ease(d3.easeCubicInOut)
        .style('opacity', 1);
    };

    const drawFlatten = (curLayerIndex, d, i, width, height) => {
      // Show the output legend
      svg$4.selectAll('.output-legend')
        .classed('hidden', false);

      let pixelWidth = nodeLength$5 / 2;
      let pixelHeight = 1.1;
      let totalLength = (2 * nodeLength$5 +
        2.5 * hSpaceAroundGap$2 * gapRatio$2 + pixelWidth);
      let leftX = nodeCoordinate$2[curLayerIndex][0].x - totalLength;
      // let intermediateGap = (hSpaceAroundGap * gapRatio * 4) / 2;
      let intermediateGap = totalLength / 2 - 3 * nodeLength$5;
      const minimumGap = 20;
      let linkGen = d3.linkHorizontal()
        .x(d => d.x)
        .y(d => d.y);

      // Hide the edges
      svg$4.select('g.edge-group')
        .style('visibility', 'hidden');

      // Move the previous layer
      moveLayerX({layerIndex: curLayerIndex - 1, targetX: leftX,
        disable: true, delay: 0});

      // Disable the current layer (output layer)
      moveLayerX({layerIndex: curLayerIndex,
        targetX: nodeCoordinate$2[curLayerIndex][0].x, disable: true,
        delay: 0, opacity: 0.15, specialIndex: i});
      
      // Compute the gap in the left shrink region
      let leftEnd = leftX - hSpaceAroundGap$2;
      let leftGap = (leftEnd - nodeCoordinate$2[0][0].x - 10 * nodeLength$5) / 10;

      // Different from other intermediate view, we push the left part dynamically
      // 1. If there is enough space, we fix the first layer position and move all
      // other layers;
      // 2. If there is not enough space, we maintain the minimum gap and push all
      // left layers to the left (could be out-of-screen)
      if (leftGap > minimumGap) {
        // Move the left layers
        for (let i = 0; i < curLayerIndex - 1; i++) {
          let curX = nodeCoordinate$2[0][0].x + i * (nodeLength$5 + leftGap);
          moveLayerX({layerIndex: i, targetX: curX, disable: true, delay: 0});
        }
      } else {
        leftGap = minimumGap;
        let curLeftBound = leftX - leftGap * 2 - nodeLength$5;
        // Move the left layers
        for (let i = curLayerIndex - 2; i >= 0; i--) {
          moveLayerX({layerIndex: i, targetX: curLeftBound, disable: true, delay: 0});
          curLeftBound = curLeftBound - leftGap - nodeLength$5;
        }
      }

      // Add an overlay
      let stops = [{offset: '0%', color: 'rgb(250, 250, 250)', opacity: 1},
        {offset: '50%', color: 'rgb(250, 250, 250)', opacity: 0.95},
        {offset: '100%', color: 'rgb(250, 250, 250)', opacity: 0.85}];
      addOverlayGradient('overlay-gradient-left', stops);

      let intermediateLayerOverlay = svg$4.append('g')
        .attr('class', 'intermediate-layer-overlay');

      intermediateLayerOverlay.append('rect')
        .attr('class', 'overlay')
        .style('fill', 'url(#overlay-gradient-left)')
        .style('stroke', 'none')
        .attr('width', leftX + svgPaddings$3.left - (leftGap * 2) + 5)
        .attr('height', height + svgPaddings$3.top + svgPaddings$3.bottom)
        .attr('x', -svgPaddings$3.left)
        .attr('y', 0)
        .style('opacity', 0);
      
      intermediateLayerOverlay.append('rect')
        .attr('class', 'overlay')
        .style('fill', 'url(#overlay-gradient-left)')
        .style('stroke', 'none')
        .attr('width', totalLength)
        .attr('height', height + svgPaddings$3.top + svgPaddings$3.bottom)
        .attr('x', nodeCoordinate$2[curLayerIndex][0].x + nodeLength$5 + 5)
        .attr('y', 0)
        .style('opacity', 0);
      
      intermediateLayerOverlay.selectAll('rect.overlay')
        .transition('move')
        .duration(800)
        .ease(d3.easeCubicInOut)
        .style('opacity', 1);

      // Add the intermediate layer
      let intermediateLayer = svg$4.append('g')
        .attr('class', 'intermediate-layer')
        .style('opacity', 0);
      
      let intermediateX1 = leftX + nodeLength$5 + intermediateGap;
      let intermediateX2 = intermediateX1 + intermediateGap + pixelWidth;
      let range = cnnLayerRanges$2[selectedScaleLevel$2][curLayerIndex - 1];
      let colorScale = layerColorScales$5.conv;
      let flattenLength = cnn$2.flatten.length / cnn$2[1].length;
      console.log(flattenLength);
      let linkData = [];

      let flattenLayer = intermediateLayer.append('g')
        .attr('class', 'flatten-layer');
      
      let flattenLayerLeftPart = flattenLayer.append('g')
        .attr('class', 'flatten-layer-left');
      
      let topY = nodeCoordinate$2[curLayerIndex - 1][0].y;
      let bottomY = nodeCoordinate$2[curLayerIndex - 1][9].y + nodeLength$5 -
            flattenLength * pixelHeight;
      
      let Ys = [];
      for (let n = 0; n < cnn$2[curLayerIndex - 1].length; n++) {
        if(n < cnn$2[curLayerIndex - 1].length / 2){
          Ys.push(nodeCoordinate$2[curLayerIndex - 1][n].y);
        }else {
          Ys.push(nodeCoordinate$2[curLayerIndex - 1][n].y + nodeLength$5 - flattenLength * pixelHeight);
        }
      }

      // Compute the pre-layer gap
      let preLayerDimension = cnn$2[curLayerIndex - 1][0].output.length;
      let preLayerGap = nodeLength$5 / (2 * preLayerDimension);

      // Compute bounding box length
      let boundingBoxLength = nodeLength$5 / preLayerDimension;

      // Compute the weight color scale
      let flattenExtent = d3.extent(cnn$2.flatten.slice(flattenLength)
        .map(d => d.outputLinks[i].weight)
        .concat(cnn$2.flatten.slice(9 * flattenLength, 10 * flattenLength)
          .map(d => d.outputLinks[i].weight)));

      let flattenRange = 2 * (Math.round(
        Math.max(...flattenExtent.map(Math.abs)) * 1000) / 1000);

      let flattenMouseOverHandler = (d) => {
        let index = d.index;
        // Screenshot
        // console.log(index);

        // Update the hover info UI
        if (d.weight === undefined) {
          hoverInfo = {
            show: true,
            text: `Pixel value: ${formater$2(flattenFactoredFDict[index])}`
          };
        } else {
          hoverInfo = {
            show: true,
            text: `Weight: ${formater$2(d.weight)}`
          };
        }
        hoverInfoStore.set(hoverInfo);

        flattenLayerLeftPart.select(`#edge-flatten-${index}`)
          .raise()
          .style('stroke', intermediateColor$2)
          .style('stroke-width', 1);

        flattenLayerLeftPart.select(`#edge-flatten-${index}-output`)
          .raise()
          .style('stroke-width', 1)
          .style('stroke', da => gappedColorScale(layerColorScales$5.weight,
            flattenRange, da.weight, 0.1));

        flattenLayerLeftPart.select(`#bounding-${index}`)
          .raise()
          .style('opacity', 1);
      };

      let flattenMouseLeaveHandler = (d) => {
        let index = d.index;

        // screenshot
        // if (index === 70) {return;}

        // Update the hover info UI
        if (d.weight === undefined) {
          hoverInfo = {
            show: false,
            text: `Pixel value: ${formater$2(flattenFactoredFDict[index])}`
          };
        } else {
          hoverInfo = {
            show: false,
            text: `Weight: ${formater$2(d.weight)}`
          };
        }
        hoverInfoStore.set(hoverInfo);

        flattenLayerLeftPart.select(`#edge-flatten-${index}`)
          .style('stroke-width', 0.6)
          .style('stroke', '#E5E5E5');

        flattenLayerLeftPart.select(`#edge-flatten-${index}-output`)
          .style('stroke-width', 0.6)
          .style('stroke', da => gappedColorScale(layerColorScales$5.weight,
            flattenRange, da.weight, 0.35));

        flattenLayerLeftPart.select(`#bounding-${index}`)
          .raise()
          .style('opacity', 0);
      };

      flattenFactoredFDict = {};
      for (let f = 0; f < flattenLength; f++) {
        let loopFactors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        loopFactors.forEach(l => {
          let factoredF = f + l * flattenLength;
          flattenFactoredFDict[factoredF] = cnn$2.flatten[factoredF].output;
          flattenLayerLeftPart.append('rect')
            .attr('x', intermediateX1)
            // .attr('y', l === 0 ? topY + f * pixelHeight : bottomY + f * pixelHeight)
            .attr('y', Ys[l] + f * pixelHeight)
            .attr('width', pixelWidth)
            .attr('height', pixelHeight)
            .style('cursor', 'crosshair')
            .style('fill', colorScale((cnn$2.flatten[factoredF].output + range / 2) / range))
            .on('mouseover', () => flattenMouseOverHandler({index: factoredF}))
            .on('mouseleave', () => flattenMouseLeaveHandler({index: factoredF}))
            .on('click', () => { d3.event.stopPropagation(); });

          // Flatten -> output
          linkData.push({
            source: {x: intermediateX1 + pixelWidth + 3,
              // y:  l === 0 ? topY + f * pixelHeight : bottomY + f * pixelHeight
              y: Ys[l] + f * pixelHeight},
            target: {x: intermediateX2,
              //nodeCoordinate[curLayerIndex][i].x - nodeLength,
              y: nodeCoordinate$2[curLayerIndex][i].y + nodeLength$5 / 2},
            index: factoredF,
            weight: cnn$2.flatten[factoredF].outputLinks[i].weight,
            name: `flatten-${factoredF}-output`,
            color: gappedColorScale(layerColorScales$5.weight,
              flattenRange, cnn$2.flatten[factoredF].outputLinks[i].weight, 0.35),
            width: 0.6,
            opacity: 1,
            class: `flatten-output`
          });

          // Pre-layer -> flatten
          let row = Math.floor(f / preLayerDimension);
          linkData.push({
            target: {x: intermediateX1 - 3,
              // y:  l === 0 ? topY + f * pixelHeight : bottomY + f * pixelHeight
              y: Ys[l] + f * pixelHeight},
            source: {x: leftX + nodeLength$5 + 3,
              y: nodeCoordinate$2[curLayerIndex - 1][l].y + (2 * row + 1) * preLayerGap},
            index: factoredF,
            name: `flatten-${factoredF}`,
            color: '#E5E5E5',
            // color: gappedColorScale(layerColorScales.conv,
            //   2 * Math.max(Math.abs(cnnLayerMinMax[10].max), Math.abs(cnnLayerMinMax[10].min)),
            //   cnn.flatten[factoredF].output, 0.2),
            width: 0.6,
            opacity: 1,
            class: `flatten`
          });

          // Add original pixel bounding box
          let loc = cnn$2.flatten[factoredF].inputLinks[0].weight;
          flattenLayerLeftPart.append('rect')
            .attr('id', `bounding-${factoredF}`)
            .attr('class', 'flatten-bounding')
            .attr('x', leftX + loc[1] * boundingBoxLength)
            .attr('y', nodeCoordinate$2[curLayerIndex - 1][l].y + loc[0] * boundingBoxLength)
            .attr('width', boundingBoxLength)
            .attr('height', boundingBoxLength)
            .style('fill', 'none')
            .style('stroke', intermediateColor$2)
            .style('stroke-length', '0.5')
            .style('pointer-events', 'all')
            .style('cursor', 'crosshair')
            .style('opacity', 0)
            .on('mouseover', () => flattenMouseOverHandler({index: factoredF}))
            .on('mouseleave', () => flattenMouseLeaveHandler({index: factoredF}))
            .on('click', () => {d3.event.stopPropagation();});
        }); 
      }
      

      // Use abstract symbol to represent the flatten nodes in between (between
      // the first and the last nodes)
      // Compute the average value of input node and weights
      // 由于目前每个节点都显示了flatten值，已不需要middle nodes


      // let meanValues = [];
      // for (let n = 1; n < cnn[curLayerIndex - 1].length - 1; n++) {
      //   /*
      //   let meanOutput = d3.mean(cnn.flatten.slice(flattenLength * n,
      //     flattenLength * (n + 1)).map(d => d.output));
      //   let meanWeight= d3.mean(cnn.flatten.slice(flattenLength * n,
      //     flattenLength * (n + 1)).map(d => d.outputLinks[i].weight));
      //   meanValues.push({index: n, output: meanOutput, weight: meanWeight});
      //   */
      //   meanValues.push({index: n});
      // }

      // Compute the middle gap
      let middleGap = 5;
      let middleRectHeight = (10 * nodeLength$5 + (10 - 1) * vSpaceAroundGap$2 -
        pixelHeight * flattenLength * 2 - 5 * (8 + 1)) / 8;

      // Add middle nodes
      // meanValues.forEach((v, vi) => {
      //   // Add a small rectangle
      //   flattenLayerLeftPart.append('rect')
      //     .attr('x', intermediateX1 + pixelWidth / 4)
      //     .attr('y', topY + flattenLength * pixelHeight + middleGap * (vi + 1) +
      //       middleRectHeight * vi)
      //     .attr('width', pixelWidth / 2)
      //     .attr('height', middleRectHeight)
      //     // .style('fill', colorScale((v.output + range / 2) / range));
      //     .style('fill', '#E5E5E5');
        
      //   // Add a triangle next to the input node
      //   flattenLayerLeftPart.append('polyline')
      //     .attr('points',
      //       `${leftX + nodeLength + 3}
      //       ${nodeCoordinate[curLayerIndex - 1][v.index].y},
      //       ${leftX + nodeLength + 10}
      //       ${nodeCoordinate[curLayerIndex - 1][v.index].y + nodeLength / 2},
      //       ${leftX + nodeLength + 3}
      //       ${nodeCoordinate[curLayerIndex - 1][v.index].y + nodeLength}`)
      //     .style('fill', '#E5E5E5')
      //     .style('opacity', 1);
        
      //   // Input -> flatten
      //   linkData.push({
      //     source: {x: leftX + nodeLength + 10,
      //       y: nodeCoordinate[curLayerIndex - 1][v.index].y + nodeLength / 2},
      //     target: {x: intermediateX1 - 3,
      //       y: topY + flattenLength * pixelHeight + middleGap * (vi + 1) +
      //         middleRectHeight * (vi + 0.5)},
      //     index: -1,
      //     width: 1,
      //     opacity: 1,
      //     name: `flatten-abstract-${v.index}`,
      //     color: '#E5E5E5',
      //     class: `flatten-abstract`
      //   });

      //   // Flatten -> output
      //   linkData.push({
      //     source: {x: intermediateX1 + pixelWidth + 3,
      //     y: topY + flattenLength * pixelHeight + middleGap * (vi + 1) +
      //       middleRectHeight * (vi + 0.5)},
      //     target: {x: intermediateX2,
      //     y: nodeCoordinate[curLayerIndex][i].y + nodeLength / 2},
      //     index: -1,
      //     name: `flatten-abstract-${v.index}-output`,
      //     // color: gappedColorScale(layerColorScales.weight, flattenRange,
      //     //   v.weight, 0.35),
      //     color: '#E5E5E5',
      //     weight: v.weight,
      //     width: 1,
      //     opacity: 1,
      //     class: `flatten-abstract-output`
      //   });
      // })

      // Draw the plus operation symbol
      let symbolX = intermediateX2 + plusSymbolRadius$1;
      let symbolY = nodeCoordinate$2[curLayerIndex][i].y + nodeLength$5 / 2;
      let symbolRectHeight = 1;
      let symbolGroup = flattenLayerLeftPart.append('g')
        .attr('class', 'plus-symbol')
        .attr('transform', `translate(${symbolX}, ${symbolY})`);
      
      symbolGroup.append('rect')
        .attr('x', -plusSymbolRadius$1)
        .attr('y', -plusSymbolRadius$1)
        .attr('width', plusSymbolRadius$1 * 2)
        .attr('height', plusSymbolRadius$1 * 2)
        .attr('rx', 3)
        .attr('ry', 3)
        .style('fill', 'none')
        .style('stroke', intermediateColor$2);
      
      symbolGroup.append('rect')
        .attr('x', -(plusSymbolRadius$1 - 3))
        .attr('y', -symbolRectHeight / 2)
        .attr('width', 2 * (plusSymbolRadius$1 - 3))
        .attr('height', symbolRectHeight)
        .style('fill', intermediateColor$2);

      symbolGroup.append('rect')
        .attr('x', -symbolRectHeight / 2)
        .attr('y', -(plusSymbolRadius$1 - 3))
        .attr('width', symbolRectHeight)
        .attr('height', 2 * (plusSymbolRadius$1 - 3))
        .style('fill', intermediateColor$2);

      // Place the bias rectangle below the plus sign if user clicks the first
      // conv node (no need now, since we added annotaiton for softmax to make it
      // look better aligned)
      // Add bias symbol to the plus symbol
      symbolGroup.append('circle')
        .attr('cx', 0)
        .attr('cy', -nodeLength$5 / 2 - 0.5 * kernelRectLength$1)
        .attr('r', kernelRectLength$1 * 1.5)
        .style('stroke', intermediateColor$2)
        .style('cursor', 'crosshair')
        .style('fill', gappedColorScale(layerColorScales$5.weight,
            flattenRange, d.bias, 0.35))
        .on('mouseover', () => {
          hoverInfoStore.set( {show: true, text: `Bias: ${formater$2(d.bias)}`} );
        })
        .on('mouseleave', () => {
          hoverInfoStore.set( {show: false, text: `Bias: ${formater$2(d.bias)}`} );
        })
        .on('click', () => { d3.event.stopPropagation(); });
      
      // Link from bias to the plus symbol
      symbolGroup.append('path')
        .attr('d', linkGen({
          source: { x: 0, y: 0 },
          target: { x: 0, y: -nodeLength$5 / 2 - 0.5 * kernelRectLength$1 }
        }))
        .attr('id', 'bias-plus')
        .attr('stroke-width', 1.2)
        .attr('stroke', '#E5E5E5')
        .lower();

      // Link from the plus symbol to the output
      linkData.push({
        source: getOutputKnot({x: intermediateX2 + 2 * plusSymbolRadius$1 - nodeLength$5,
          y: nodeCoordinate$2[curLayerIndex][i].y}),
        target: getInputKnot({x: nodeCoordinate$2[curLayerIndex][i].x - 3,
          y: nodeCoordinate$2[curLayerIndex][i].y}),
        name: `symbol-output`,
        width: 1.2,
        color: '#E5E5E5'
      });

      // Draw softmax operation symbol
      let softmaxWidth = 55;
      let emptySpace = ((totalLength - 2 * nodeLength$5 - 2 * intermediateGap)
        - softmaxWidth) / 2;
      let symbolEndX = intermediateX2 + plusSymbolRadius$1 * 2;
      let softmaxX = emptySpace + symbolEndX;
      let softmaxLeftMid = emptySpace / 2 + symbolEndX;
      let softmaxTextY = nodeCoordinate$2[curLayerIndex][i].y - 2 * kernelRectLength$1 - 6;
      let moveX = (intermediateX2 - (intermediateX1 + pixelWidth + 3)) * 2 / 3;

      let softmaxArg = {
        curLayerIndex: curLayerIndex,
        moveX: moveX,
        symbolX: symbolX,
        symbolY: symbolY,
        outputX: nodeCoordinate$2[curLayerIndex][i].x,
        outputY: symbolY,
        softmaxLeftMid: softmaxLeftMid,
        selectedI: i,
        intermediateX1: intermediateX1,
        intermediateX2: intermediateX2,
        pixelWidth: pixelWidth,
        pixelHeight: pixelHeight,
        topY: topY,
        bottomY: bottomY,
        middleGap: middleGap,
        middleRectHeight: middleRectHeight,
        softmaxX: softmaxX,
        softmaxWidth: softmaxWidth,
        softmaxTextY: softmaxTextY,
        symbolGroup: symbolGroup,
        flattenRange: flattenRange
      };

      let softmaxSymbol = intermediateLayer.append('g')
        .attr('class', 'softmax-symbol')
        .attr('transform', `translate(${softmaxX}, ${symbolY})`)
        .style('pointer-event', 'all')
        .style('cursor', 'pointer');
        // .on('click', () => softmaxClicked(softmaxArg));
      
      softmaxSymbol.append('rect')
        .attr('x', 0)
        .attr('y', -plusSymbolRadius$1)
        .attr('width', softmaxWidth)
        .attr('height', plusSymbolRadius$1 * 2)
        .attr('stroke', intermediateColor$2)
        .attr('rx', 2)
        .attr('ry', 2)
        .attr('fill', '#FAFAFA');
      
      softmaxSymbol.append('text')
        .attr('x', 15)
        .attr('y', 1)
        .style('dominant-baseline', 'middle')
        .style('font-size', '14px')
        .style('opacity', 0.5)
        .text('relu');

      // Draw the layer label
      let layerLabel = intermediateLayer.append('g')
        .attr('class', 'layer-label')
        .classed('hidden', detailedMode$2)
        .attr('transform', () => {
          let x = leftX + nodeLength$5 + (4 * hSpaceAroundGap$2 * gapRatio$2 +
            pixelWidth) / 2;
          let y = (svgPaddings$3.top) / 2 + 5;
          return `translate(${x}, ${y})`;
        })
        .style('cursor', 'help')
        .on('click', () => {
          d3.event.stopPropagation();
          // Scroll to the article element
          document.querySelector(`#article-flatten`).scrollIntoView({ 
            behavior: 'smooth' 
          });
        });
      
      layerLabel.append('text')
        .style('dominant-baseline', 'middle')
        .style('opacity', 0.8)
        .style('font-weight', 800)
        .text('flatten');

      let svgHeight = Number(d3.select('#cnn-svg').style('height').replace('px', '')) + 150;
      let scroll = new SmoothScroll('a[href*="#"]', {offset: -svgHeight});
        
      let detailedLabelGroup = intermediateLayer.append('g')
        .attr('transform', () => {
          let x = intermediateX1 + pixelWidth / 2;
          let y = (svgPaddings$3.top) / 2 + 5;
          return `translate(${x}, ${y})`;
        })
        .attr('class', 'layer-detailed-label')
        .classed('hidden', !detailedMode$2)
        .style('cursor', 'help')
        .on('click', () => {
          d3.event.stopPropagation();
          // Scroll to the article element
          let anchor = document.querySelector(`#article-flatten`);
          scroll.animateScroll(anchor);
        });
      
      // detailedLabelGroup.append('title')
      //   .text('Move to article section');

      let detailedLabelText = detailedLabelGroup.append('text')
        .style('text-anchor', 'middle')
        .style('dominant-baseline', 'middle')
        .style('opacity', '0.7')
        .style('font-weight', 800)
        .append('tspan')
        .text('Flatten');
      
      let dimension = cnn$2[layerIndexDict['max_pooling2d_22']].length * 
        cnn$2[layerIndexDict['max_pooling2d_22']][0].output.length *
        cnn$2[layerIndexDict['max_pooling2d_22']][0].output[0].length;
      

      detailedLabelText.append('tspan')
        .attr('x', 0)
        .attr('dy', '1.5em')
        .style('font-size', '8px')
        .style('font-weight', 'normal')
        .text(`(${dimension})`);

      // Add edges between nodes
      let edgeGroup = flattenLayerLeftPart.append('g')
        .attr('class', 'edge-group')
        .lower();
      
      edgeGroup.selectAll('path')
        .data(linkData)
        .enter()
        .append('path')
        .attr('class', d => d.class)
        .attr('id', d => `edge-${d.name}`)
        .attr('d', d => linkGen({source: d.source, target: d.target}))
        .style('fill', 'none')
        .style('stroke-width', d => d.width)
        .style('stroke', d => d.color === undefined ? intermediateColor$2 : d.color)
        .style('opacity', d => d.opacity);
      
      edgeGroup.selectAll('path.flatten-abstract-output')
        .lower();

      edgeGroup.selectAll('path.flatten,path.flatten-output')
        .style('cursor', 'crosshair')
        .style('pointer-events', 'all')
        .on('mouseover', flattenMouseOverHandler)
        .on('mouseleave', flattenMouseLeaveHandler)
        .on('click', () => { d3.event.stopPropagation(); });
      
      // Add legend
      let min_layer_index = curLayerIndex - 1;
      drawIntermediateLayerLegend({
        legendHeight: 5,
        curLayerIndex: curLayerIndex,
        range: range,
        minMax: cnnLayerMinMax$2[min_layer_index],
        group: intermediateLayer,
        width: intermediateGap + nodeLength$5 - 3,
        x: leftX,
        y: svgPaddings$3.top + vSpaceAroundGap$2 * (10) + vSpaceAroundGap$2 + 
          nodeLength$5 * 15
      });

      drawIntermediateLayerLegend({
        legendHeight: 5,
        curLayerIndex: curLayerIndex,
        range: flattenRange,
        minMax: {min: flattenExtent[0], max: flattenExtent[1]},
        group: intermediateLayer,
        width: intermediateGap - 3 - 5,
        gradientAppendingName: 'flatten-weight-gradient',
        gradientGap: 0.1,
        colorScale: layerColorScales$5.weight,
        x: leftX + intermediateGap + nodeLength$5 + pixelWidth + 3,
        y: svgPaddings$3.top + vSpaceAroundGap$2 * (10) + vSpaceAroundGap$2 + 
          nodeLength$5 * 15
      });

      // Add annotation to the intermediate layer
      let intermediateLayerAnnotation = svg$4.append('g')
        .attr('class', 'intermediate-layer-annotation')
        .style('opacity', 0);

      // Add annotation for the sum operation
      let plusAnnotation = intermediateLayerAnnotation.append('g')
        .attr('class', 'plus-annotation');
      
      // let textX = nodeCoordinate[curLayerIndex][i].x - 50;
      let textX = intermediateX2;
      let textY = nodeCoordinate$2[curLayerIndex][i].y + nodeLength$5 +
        kernelRectLength$1 * 3;
      let arrowSY = nodeCoordinate$2[curLayerIndex][i].y + nodeLength$5 +
        kernelRectLength$1 * 2;
      let arrowTY = nodeCoordinate$2[curLayerIndex][i].y + nodeLength$5 / 2 +
        plusSymbolRadius$1;

      if (i == 9) {
        textY -= 110;
        arrowSY -= 70;
        arrowTY -= 18;
      }

      let plusText = plusAnnotation.append('text')
        .attr('x', textX)
        .attr('y', textY)
        .attr('class', 'annotation-text')
        .style('dominant-baseline', 'hanging')
        .style('text-anchor', 'middle');
      
      plusText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .text('将所有乘积相加');
      
      plusText.append('tspan')
        .attr('x', textX)
        .attr('dy', '1em')
        .style('dominant-baseline', 'hanging')
        .text('(');

      plusText.append('tspan')
        .style('fill', '#66a3c8')
        .style('dominant-baseline', 'hanging')
        .text('输出');

      plusText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .text(' × ');

      plusText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .style('fill', '#b58946')
        .text('权重');

      plusText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .text(')');

      plusText.append('tspan')
        .attr('x', textX)
        .attr('dy', '1em')
        .style('dominant-baseline', 'hanging')
        .text('之后再加上 ');

      plusText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .style('fill', '#479d94')
        .text('偏移量');
      
      drawArrow({
        group: plusAnnotation,
        sx: intermediateX2 - 2 * plusSymbolRadius$1 - 3,
        sy: arrowSY,
        tx: intermediateX2 - 5,
        ty: arrowTY,
        dr: 30,
        hFlip: i === 9,
        marker: 'marker-alt'
      });

      // Add annotation for the bias
      let biasTextY = nodeCoordinate$2[curLayerIndex][i].y;
      biasTextY -= 2 * kernelRectLength$1 + 4;
      
      flattenLayerLeftPart.append('text')
        .attr('class', 'annotation-text')
        .attr('x', intermediateX2 + plusSymbolRadius$1)
        .attr('y', biasTextY)
        .style('text-anchor', 'middle')
        .style('dominant-baseline', 'baseline')
        .text('Bias');
      
      // Add annotation for the softmax symbol
      let softmaxAnnotation = intermediateLayerAnnotation.append('g')
        .attr('class', 'softmax-annotation');
      
      // softmaxAnnotation.append('text')
      //   .attr('x', softmaxX + softmaxWidth / 2)
      //   .attr('y', softmaxTextY)
      //   .attr('class', 'annotation-text')
      //   .style('dominant-baseline', 'baseline')
      //   .style('text-anchor', 'middle')
      //   .style('font-weight', 700)
      //   .text('Click ')
      //   .append('tspan')
      //   .attr('dx', 1)
      //   .style('font-weight', 400)
      //   .text('to learn more');

      // drawArrow({
      //   group: softmaxAnnotation,
      //   sx: softmaxX + softmaxWidth / 2 - 5,
      //   sy: softmaxTextY + 4,
      //   tx: softmaxX + softmaxWidth / 2,
      //   ty: symbolY - plusSymbolRadius - 4,
      //   dr: 50,
      //   hFlip: true
      // });

      // Add annotation for the flatten layer
      let flattenAnnotation = intermediateLayerAnnotation.append('g')
        .attr('class', 'flatten-annotation');
      
      textX = leftX - 80;
      textY = nodeCoordinate$2[curLayerIndex - 1][0].y;

      let flattenText = flattenAnnotation.append('text')
        .attr('x', textX)
        .attr('y', textY)
        .attr('class', 'annotation-text')
        .style('dominant-baseline', 'hanging')
        .style('text-anchor', 'middle');

      let tempTspan = flattenText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .style('font-weight', 700)
        .text('悬停 ');
      
      tempTspan.append('tspan')
        .attr('dx', 1)
        .style('font-weight', 400)
        .style('dominant-baseline', 'hanging')
        .text('在矩阵上');
      
      flattenText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .attr('x', textX)
        .attr('dy', '1em')
        .text('可以看到在拉平为一维向量后');
      
      flattenText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .attr('x', textX)
        .attr('dy', '1em')
        .text('对应的值');

      drawArrow({
        group: flattenAnnotation,
        sx: textX + 45,
        sy: textY + nodeLength$5 * 0.4 + 12,
        tx: leftX - 10,
        ty: textY + nodeLength$5 / 2,
        dr: 80,
        hFlip: true
      });

      // Add annotation to explain the middle images
      textY = nodeCoordinate$2[curLayerIndex - 1][1].y;

      let middleText = flattenAnnotation.append('text')
        .attr('x', textX)
        .attr('y', textY)
        .attr('class', 'annotation-text')
        .style('dominant-baseline', 'hanging')
        .style('text-anchor', 'middle');

      middleText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .text('对所有的节点');
      
      middleText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .attr('x', textX)
        .attr('dy', '1em')
        .text('都重复一遍');

      middleText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .attr('x', textX)
        .attr('dy', '1em')
        .text('拉平操作');

      drawArrow({
        group: flattenAnnotation,
        sx: textX + 39,
        sy: textY + 25,
        tx: leftX - 10,
        ty: textY + nodeLength$5 / 2 - 2,
        dr: 80,
        hFlip: true,
        marker: 'marker-alt'
      });


      // Add annotation for the output neuron
      let outputAnnotation = intermediateLayerAnnotation.append('g')
        .attr('class', 'output-annotation');
      
      outputAnnotation.append('text')
        .attr('x', nodeCoordinate$2[curLayerIndex][i].x)
        .attr('y', nodeCoordinate$2[curLayerIndex][i].y - 10)
        .attr('class', 'annotation-text')
        .text(`(${d3.format('.4f')(cnn$2[curLayerIndex][i].output)})`);


      /* Prototype of using arc to represent the flatten layer (future)
      let pie = d3.pie()
        .padAngle(0)
        .sort(null)
        .value(d => d.output)
        .startAngle(0)
        .endAngle(-Math.PI);

      let radius = 490 / 2;
      let arc = d3.arc()
        .innerRadius(radius - 20)
        .outerRadius(radius);

      let arcs = pie(cnn.flatten);
      console.log(arcs);

      let test = svg.append('g')
        .attr('class', 'test')
        .attr('transform', 'translate(500, 250)');

      test.selectAll("path")
        .data(arcs)
        .join("path")
          .attr('class', 'arc')
          .attr("fill", d => colorScale((d.value + range/2) / range))
          .attr("d", arc);
      */

      // Show everything
      svg$4.selectAll('g.intermediate-layer, g.intermediate-layer-annotation')
        .transition()
        .delay(500)
        .duration(500)
        .ease(d3.easeCubicInOut)
        .style('opacity', 1);
    };

    /* src\overview\Overview.svelte generated by Svelte v3.24.0 */

    const { Object: Object_1$2, console: console_1$3 } = globals;

    const file$i = "src\\overview\\Overview.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[83] = list[i];
    	child_ctx[85] = i;
    	return child_ctx;
    }

    // (1512:6) {#each imageOptions as image, i}
    function create_each_block$1(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let img_title_value;
    	let img_data_imagename_value;
    	let t;
    	let div_data_imagename_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t = space();
    			if (img.src !== (img_src_value = "/assets/img/" + /*image*/ ctx[83].file)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "image option");
    			attr_dev(img, "title", img_title_value = /*image*/ ctx[83].class);
    			attr_dev(img, "data-imagename", img_data_imagename_value = /*image*/ ctx[83].file);
    			attr_dev(img, "class", "svelte-1t9jxuh");
    			add_location(img, file$i, 1517, 10, 50026);
    			attr_dev(div, "class", "image-container svelte-1t9jxuh");
    			attr_dev(div, "data-imagename", div_data_imagename_value = /*image*/ ctx[83].file);
    			toggle_class(div, "inactive", /*selectedImage*/ ctx[5] !== /*image*/ ctx[83].file);
    			toggle_class(div, "disabled", /*disableControl*/ ctx[4]);
    			add_location(div, file$i, 1512, 8, 49777);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(
    					div,
    					"click",
    					function () {
    						if (is_function(/*disableControl*/ ctx[4]
    						? click_handler
    						: /*imageOptionClicked*/ ctx[13])) (/*disableControl*/ ctx[4]
    						? click_handler
    						: /*imageOptionClicked*/ ctx[13]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*selectedImage, imageOptions*/ 4128) {
    				toggle_class(div, "inactive", /*selectedImage*/ ctx[5] !== /*image*/ ctx[83].file);
    			}

    			if (dirty[0] & /*disableControl*/ 16) {
    				toggle_class(div, "disabled", /*disableControl*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(1512:6) {#each imageOptions as image, i}",
    		ctx
    	});

    	return block;
    }

    // (1619:39) 
    function create_if_block_3(ctx) {
    	let softmaxview;
    	let current;

    	softmaxview = new Softmaxview({
    			props: {
    				logits: /*softmaxDetailViewInfo*/ ctx[1].logits,
    				logitColors: /*softmaxDetailViewInfo*/ ctx[1].logitColors,
    				selectedI: /*softmaxDetailViewInfo*/ ctx[1].selectedI,
    				highlightI: /*softmaxDetailViewInfo*/ ctx[1].highlightI,
    				outputName: /*softmaxDetailViewInfo*/ ctx[1].outputName,
    				outputValue: /*softmaxDetailViewInfo*/ ctx[1].outputValue,
    				startAnimation: /*softmaxDetailViewInfo*/ ctx[1].startAnimation
    			},
    			$$inline: true
    		});

    	softmaxview.$on("xClicked", /*handleExitFromDetiledSoftmaxView*/ ctx[20]);
    	softmaxview.$on("mouseOver", softmaxDetailViewMouseOverHandler);
    	softmaxview.$on("mouseLeave", softmaxDetailViewMouseLeaveHandler);

    	const block = {
    		c: function create() {
    			create_component(softmaxview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(softmaxview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const softmaxview_changes = {};
    			if (dirty[0] & /*softmaxDetailViewInfo*/ 2) softmaxview_changes.logits = /*softmaxDetailViewInfo*/ ctx[1].logits;
    			if (dirty[0] & /*softmaxDetailViewInfo*/ 2) softmaxview_changes.logitColors = /*softmaxDetailViewInfo*/ ctx[1].logitColors;
    			if (dirty[0] & /*softmaxDetailViewInfo*/ 2) softmaxview_changes.selectedI = /*softmaxDetailViewInfo*/ ctx[1].selectedI;
    			if (dirty[0] & /*softmaxDetailViewInfo*/ 2) softmaxview_changes.highlightI = /*softmaxDetailViewInfo*/ ctx[1].highlightI;
    			if (dirty[0] & /*softmaxDetailViewInfo*/ 2) softmaxview_changes.outputName = /*softmaxDetailViewInfo*/ ctx[1].outputName;
    			if (dirty[0] & /*softmaxDetailViewInfo*/ 2) softmaxview_changes.outputValue = /*softmaxDetailViewInfo*/ ctx[1].outputValue;
    			if (dirty[0] & /*softmaxDetailViewInfo*/ 2) softmaxview_changes.startAnimation = /*softmaxDetailViewInfo*/ ctx[1].startAnimation;
    			softmaxview.$set(softmaxview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(softmaxview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(softmaxview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(softmaxview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(1619:39) ",
    		ctx
    	});

    	return block;
    }

    // (1614:67) 
    function create_if_block_2(ctx) {
    	let poolview;
    	let current;

    	poolview = new Poolview({
    			props: {
    				input: /*nodeData*/ ctx[6][0].input,
    				kernelLength: 2,
    				dataRange: /*nodeData*/ ctx[6].colorRange,
    				isExited: /*isExitedFromDetailedView*/ ctx[8]
    			},
    			$$inline: true
    		});

    	poolview.$on("message", /*handleExitFromDetiledPoolView*/ ctx[18]);

    	const block = {
    		c: function create() {
    			create_component(poolview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(poolview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const poolview_changes = {};
    			if (dirty[0] & /*nodeData*/ 64) poolview_changes.input = /*nodeData*/ ctx[6][0].input;
    			if (dirty[0] & /*nodeData*/ 64) poolview_changes.dataRange = /*nodeData*/ ctx[6].colorRange;
    			if (dirty[0] & /*isExitedFromDetailedView*/ 256) poolview_changes.isExited = /*isExitedFromDetailedView*/ ctx[8];
    			poolview.$set(poolview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(poolview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(poolview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(poolview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(1614:67) ",
    		ctx
    	});

    	return block;
    }

    // (1609:67) 
    function create_if_block_1(ctx) {
    	let activationview;
    	let current;

    	activationview = new Activationview({
    			props: {
    				input: /*nodeData*/ ctx[6][0].input,
    				output: /*nodeData*/ ctx[6][0].output,
    				dataRange: /*nodeData*/ ctx[6].colorRange,
    				isExited: /*isExitedFromDetailedView*/ ctx[8]
    			},
    			$$inline: true
    		});

    	activationview.$on("message", /*handleExitFromDetiledActivationView*/ ctx[19]);

    	const block = {
    		c: function create() {
    			create_component(activationview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(activationview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const activationview_changes = {};
    			if (dirty[0] & /*nodeData*/ 64) activationview_changes.input = /*nodeData*/ ctx[6][0].input;
    			if (dirty[0] & /*nodeData*/ 64) activationview_changes.output = /*nodeData*/ ctx[6][0].output;
    			if (dirty[0] & /*nodeData*/ 64) activationview_changes.dataRange = /*nodeData*/ ctx[6].colorRange;
    			if (dirty[0] & /*isExitedFromDetailedView*/ 256) activationview_changes.isExited = /*isExitedFromDetailedView*/ ctx[8];
    			activationview.$set(activationview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(activationview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(activationview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(activationview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(1609:67) ",
    		ctx
    	});

    	return block;
    }

    // (1601:2) {#if selectedNode.data && selectedNode.data.type === 'conv' && selectedNodeIndex != -1}
    function create_if_block$4(ctx) {
    	let convolutionview;
    	let current;

    	convolutionview = new Convolutionview({
    			props: {
    				input: /*nodeData*/ ctx[6][/*selectedNodeIndex*/ ctx[7]].input,
    				kernel: /*nodeData*/ ctx[6][/*selectedNodeIndex*/ ctx[7]].kernel,
    				dataRange: /*nodeData*/ ctx[6].colorRange,
    				colorScale: /*nodeData*/ ctx[6].inputIsInputLayer
    				? /*layerColorScales*/ ctx[11].input[0]
    				: /*layerColorScales*/ ctx[11].conv,
    				isInputInputLayer: /*nodeData*/ ctx[6].inputIsInputLayer,
    				isExited: /*isExitedFromCollapse*/ ctx[9]
    			},
    			$$inline: true
    		});

    	convolutionview.$on("message", /*handleExitFromDetiledConvView*/ ctx[17]);

    	const block = {
    		c: function create() {
    			create_component(convolutionview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(convolutionview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const convolutionview_changes = {};
    			if (dirty[0] & /*nodeData, selectedNodeIndex*/ 192) convolutionview_changes.input = /*nodeData*/ ctx[6][/*selectedNodeIndex*/ ctx[7]].input;
    			if (dirty[0] & /*nodeData, selectedNodeIndex*/ 192) convolutionview_changes.kernel = /*nodeData*/ ctx[6][/*selectedNodeIndex*/ ctx[7]].kernel;
    			if (dirty[0] & /*nodeData*/ 64) convolutionview_changes.dataRange = /*nodeData*/ ctx[6].colorRange;

    			if (dirty[0] & /*nodeData*/ 64) convolutionview_changes.colorScale = /*nodeData*/ ctx[6].inputIsInputLayer
    			? /*layerColorScales*/ ctx[11].input[0]
    			: /*layerColorScales*/ ctx[11].conv;

    			if (dirty[0] & /*nodeData*/ 64) convolutionview_changes.isInputInputLayer = /*nodeData*/ ctx[6].inputIsInputLayer;
    			if (dirty[0] & /*isExitedFromCollapse*/ 512) convolutionview_changes.isExited = /*isExitedFromCollapse*/ ctx[9];
    			convolutionview.$set(convolutionview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(convolutionview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(convolutionview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(convolutionview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(1601:2) {#if selectedNode.data && selectedNode.data.type === 'conv' && selectedNodeIndex != -1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let div4;
    	let div2;
    	let div1;
    	let t0;
    	let div0;
    	let img;
    	let img_src_value;
    	let t1;
    	let span0;
    	let i0;
    	let t2;
    	let i1;
    	let div0_data_imagename_value;
    	let t3;
    	let button;
    	let span1;
    	let i2;
    	let t4;
    	let span2;
    	let t5_value = /*hoverInfo*/ ctx[2].text + "";
    	let t5;
    	let t6;
    	let div3;
    	let svg_1;
    	let t7;
    	let div5;
    	let current_block_type_index;
    	let if_block;
    	let t8;
    	let modal;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*imageOptions*/ ctx[12];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const if_block_creators = [create_if_block$4, create_if_block_1, create_if_block_2, create_if_block_3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*selectedNode*/ ctx[3].data && /*selectedNode*/ ctx[3].data.type === "conv" && /*selectedNodeIndex*/ ctx[7] != -1) return 0;
    		if (/*selectedNode*/ ctx[3].data && /*selectedNode*/ ctx[3].data.type === "relu") return 1;
    		if (/*selectedNode*/ ctx[3].data && /*selectedNode*/ ctx[3].data.type === "pool") return 2;
    		if (/*softmaxDetailViewInfo*/ ctx[1].show) return 3;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	modal = new Modal({ $$inline: true });
    	modal.$on("xClicked", /*handleModalCanceled*/ ctx[15]);
    	modal.$on("urlTyped", /*handleCustomImage*/ ctx[16]);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div2 = element("div");
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			div0 = element("div");
    			img = element("img");
    			t1 = space();
    			span0 = element("span");
    			i0 = element("i");
    			t2 = space();
    			i1 = element("i");
    			t3 = space();
    			button = element("button");
    			span1 = element("span");
    			i2 = element("i");
    			t4 = space();
    			span2 = element("span");
    			t5 = text(t5_value);
    			t6 = space();
    			div3 = element("div");
    			svg_1 = svg_element("svg");
    			t7 = space();
    			div5 = element("div");
    			if (if_block) if_block.c();
    			t8 = space();
    			create_component(modal.$$.fragment);
    			attr_dev(img, "class", "custom-image svelte-1t9jxuh");
    			if (img.src !== (img_src_value = "/assets/img/plus.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "plus button");
    			attr_dev(img, "title", "Add new input image");
    			attr_dev(img, "data-imagename", "custom");
    			add_location(img, file$i, 1531, 10, 50503);
    			attr_dev(i0, "class", "fas fa-circle fa-stack-2x");
    			add_location(i0, file$i, 1539, 12, 50802);
    			attr_dev(i1, "class", "fas fa-pen fa-stack-1x fa-inverse");
    			add_location(i1, file$i, 1540, 12, 50857);
    			attr_dev(span0, "class", "fa-stack edit-icon svelte-1t9jxuh");
    			toggle_class(span0, "hidden", /*customImageURL*/ ctx[10] === null);
    			add_location(span0, file$i, 1537, 10, 50703);
    			attr_dev(div0, "class", "image-container svelte-1t9jxuh");
    			attr_dev(div0, "data-imagename", div0_data_imagename_value = "custom");
    			toggle_class(div0, "inactive", /*selectedImage*/ ctx[5] !== "custom");
    			toggle_class(div0, "disabled", /*disableControl*/ ctx[4]);
    			add_location(div0, file$i, 1525, 8, 50256);
    			attr_dev(i2, "class", "fas fa-crosshairs ");
    			add_location(i2, file$i, 1549, 10, 51151);
    			attr_dev(span1, "class", "icon");
    			set_style(span1, "margin-right", "5px");
    			add_location(span1, file$i, 1548, 8, 51093);
    			attr_dev(span2, "id", "hover-label-text");
    			add_location(span2, file$i, 1551, 8, 51212);
    			attr_dev(button, "class", "button is-very-small is-link is-light svelte-1t9jxuh");
    			attr_dev(button, "id", "hover-label");
    			set_style(button, "opacity", /*hoverInfo*/ ctx[2].show ? 1 : 0);
    			add_location(button, file$i, 1545, 6, 50953);
    			attr_dev(div1, "class", "left-control svelte-1t9jxuh");
    			add_location(div1, file$i, 1510, 4, 49701);
    			attr_dev(div2, "class", "control-container svelte-1t9jxuh");
    			add_location(div2, file$i, 1508, 2, 49662);
    			attr_dev(svg_1, "id", "cnn-svg");
    			attr_dev(svg_1, "class", "svelte-1t9jxuh");
    			add_location(svg_1, file$i, 1593, 4, 52336);
    			attr_dev(div3, "class", "cnn svelte-1t9jxuh");
    			add_location(div3, file$i, 1592, 2, 52313);
    			attr_dev(div4, "class", "overview svelte-1t9jxuh");
    			add_location(div4, file$i, 1505, 0, 49601);
    			attr_dev(div5, "id", "detailview");
    			add_location(div5, file$i, 1599, 0, 52405);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div2);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div0, t1);
    			append_dev(div0, span0);
    			append_dev(span0, i0);
    			append_dev(span0, t2);
    			append_dev(span0, i1);
    			append_dev(div1, t3);
    			append_dev(div1, button);
    			append_dev(button, span1);
    			append_dev(span1, i2);
    			append_dev(button, t4);
    			append_dev(button, span2);
    			append_dev(span2, t5);
    			append_dev(div4, t6);
    			append_dev(div4, div3);
    			append_dev(div3, svg_1);
    			/*div4_binding*/ ctx[21](div4);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div5, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div5, null);
    			}

    			insert_dev(target, t8, anchor);
    			mount_component(modal, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					div0,
    					"click",
    					function () {
    						if (is_function(/*disableControl*/ ctx[4]
    						? click_handler_1
    						: /*customImageClicked*/ ctx[14])) (/*disableControl*/ ctx[4]
    						? click_handler_1
    						: /*customImageClicked*/ ctx[14]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*imageOptions, selectedImage, disableControl, imageOptionClicked*/ 12336) {
    				each_value = /*imageOptions*/ ctx[12];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*customImageURL*/ 1024) {
    				toggle_class(span0, "hidden", /*customImageURL*/ ctx[10] === null);
    			}

    			if (dirty[0] & /*selectedImage*/ 32) {
    				toggle_class(div0, "inactive", /*selectedImage*/ ctx[5] !== "custom");
    			}

    			if (dirty[0] & /*disableControl*/ 16) {
    				toggle_class(div0, "disabled", /*disableControl*/ ctx[4]);
    			}

    			if ((!current || dirty[0] & /*hoverInfo*/ 4) && t5_value !== (t5_value = /*hoverInfo*/ ctx[2].text + "")) set_data_dev(t5, t5_value);

    			if (!current || dirty[0] & /*hoverInfo*/ 4) {
    				set_style(button, "opacity", /*hoverInfo*/ ctx[2].show ? 1 : 0);
    			}

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
    					if_block.m(div5, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_each(each_blocks, detaching);
    			/*div4_binding*/ ctx[21](null);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div5);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			if (detaching) detach_dev(t8);
    			destroy_component(modal, detaching);
    			mounted = false;
    			dispose();
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

    const click_handler = () => {
    	
    };

    const click_handler_1 = () => {
    	
    };

    function instance$j($$self, $$props, $$invalidate) {
    	let overviewComponent;
    	let scaleLevelSet = new Set(["local", "module", "global"]);
    	let selectedScaleLevel = "local";
    	selectedScaleLevelStore.set(selectedScaleLevel);
    	let previousSelectedScaleLevel = selectedScaleLevel;
    	let wholeSvg = undefined;
    	let svg = undefined;

    	// Configs
    	const layerColorScales = overviewConfig.layerColorScales;

    	const nodeLength = overviewConfig.nodeLength;
    	const plusSymbolRadius = overviewConfig.plusSymbolRadius;
    	const numLayers = overviewConfig.numLayers;
    	const edgeOpacity = overviewConfig.edgeOpacity;
    	const edgeInitColor = overviewConfig.edgeInitColor;
    	const edgeHoverColor = overviewConfig.edgeHoverColor;
    	const edgeHoverOuting = overviewConfig.edgeHoverOuting;
    	const edgeStrokeWidth = overviewConfig.edgeStrokeWidth;
    	const intermediateColor = overviewConfig.intermediateColor;
    	const kernelRectLength = overviewConfig.kernelRectLength;
    	const svgPaddings = overviewConfig.svgPaddings;
    	const gapRatio = overviewConfig.gapRatio;
    	const overlayRectOffset = overviewConfig.overlayRectOffset;
    	const classLists = overviewConfig.classLists;

    	// Shared properties
    	let needRedraw = [undefined, undefined];

    	needRedrawStore.subscribe(value => {
    		needRedraw = value;
    	});

    	let nodeCoordinate = undefined;

    	nodeCoordinateStore.subscribe(value => {
    		nodeCoordinate = value;
    	});

    	let cnnLayerRanges = undefined;

    	cnnLayerRangesStore.subscribe(value => {
    		cnnLayerRanges = value;
    	});

    	let cnnLayerMinMax = undefined;

    	cnnLayerMinMaxStore.subscribe(value => {
    		cnnLayerMinMax = value;
    	});

    	let detailedMode = undefined;

    	detailedModeStore.subscribe(value => {
    		detailedMode = value;
    	});

    	let shouldIntermediateAnimate = undefined;

    	shouldIntermediateAnimateStore.subscribe(value => {
    		shouldIntermediateAnimate = value;
    	});

    	let vSpaceAroundGap = undefined;

    	vSpaceAroundGapStore.subscribe(value => {
    		vSpaceAroundGap = value;
    	});

    	let hSpaceAroundGap = undefined;

    	hSpaceAroundGapStore.subscribe(value => {
    		hSpaceAroundGap = value;
    	});

    	let isInSoftmax = undefined;

    	isInSoftmaxStore.subscribe(value => {
    		isInSoftmax = value;
    	});

    	let softmaxDetailViewInfo = undefined;

    	softmaxDetailViewStore.subscribe(value => {
    		$$invalidate(1, softmaxDetailViewInfo = value);
    	});

    	let modalInfo = undefined;

    	modalStore.subscribe(value => {
    		modalInfo = value;
    	});

    	let hoverInfo = undefined;

    	hoverInfoStore.subscribe(value => {
    		$$invalidate(2, hoverInfo = value);
    	});

    	let intermediateLayerPosition = undefined;

    	intermediateLayerPositionStore.subscribe(value => {
    		intermediateLayerPosition = value;
    	});

    	let width = undefined;
    	let height = undefined;
    	let model = undefined;
    	let selectedNode = { layerName: "", index: -1, data: null };
    	let isInIntermediateView = false;
    	let isInActPoolDetailView = false;
    	let actPoolDetailViewNodeIndex = -1;
    	let actPoolDetailViewLayerIndex = -1;
    	let detailedViewNum = undefined;
    	let disableControl = false;

    	// Wait to load
    	let cnn = undefined;

    	let detailedViewAbsCoords = {
    		1: [600, 270, 490, 290],
    		2: [500, 270, 490, 290],
    		3: [700, 270, 490, 290],
    		4: [600, 270, 490, 290],
    		5: [650, 270, 490, 290],
    		6: [775, 270, 490, 290],
    		7: [100, 270, 490, 290],
    		8: [60, 270, 490, 290],
    		9: [200, 270, 490, 290],
    		10: [300, 270, 490, 290]
    	};

    	const layerIndexDict1 = {
    		"input": 0,
    		"conv_1_1": 1,
    		"relu_1_1": 2,
    		"conv_1_2": 3,
    		"relu_1_2": 4,
    		"max_pool_1": 5,
    		"conv_2_1": 6,
    		"relu_2_1": 7,
    		"conv_2_2": 8,
    		"relu_2_2": 9,
    		"max_pool_2": 10,
    		"output": 11
    	};

    	const layerIndexDict = {
    		"input": 0,
    		"conv2d_22": 1,
    		"max_pooling2d_21": 2,
    		"conv2d_23": 3,
    		"max_pooling2d_22": 4,
    		"dense_22": 5,
    		"output": 6
    	};

    	const layerLegendDict = {
    		0: {
    			local: "input-legend",
    			module: "input-legend",
    			global: "input-legend"
    		},
    		1: {
    			local: "local-legend-0-1",
    			module: "module-legend-0",
    			global: "global-legend"
    		},
    		2: {
    			local: "local-legend-0-1",
    			module: "module-legend-0",
    			global: "global-legend"
    		},
    		3: {
    			local: "local-legend-0-2",
    			module: "module-legend-0",
    			global: "global-legend"
    		},
    		4: {
    			local: "local-legend-0-2",
    			module: "module-legend-0",
    			global: "global-legend"
    		},
    		5: {
    			local: "local-legend-0-2",
    			module: "module-legend-0",
    			global: "global-legend"
    		},
    		6: {
    			local: "local-legend-1-1",
    			module: "module-legend-1",
    			global: "global-legend"
    		},
    		7: {
    			local: "local-legend-1-1",
    			module: "module-legend-1",
    			global: "global-legend"
    		},
    		8: {
    			local: "local-legend-1-2",
    			module: "module-legend-1",
    			global: "global-legend"
    		},
    		9: {
    			local: "local-legend-1-2",
    			module: "module-legend-1",
    			global: "global-legend"
    		},
    		10: {
    			local: "local-legend-1-2",
    			module: "module-legend-1",
    			global: "global-legend"
    		},
    		11: {
    			local: "output-legend",
    			module: "output-legend",
    			global: "output-legend"
    		}
    	};

    	let imageOptions = [
    		{ file: "IS2.jpg", class: "山鸢尾" },
    		{ file: "IV1.jpg", class: "杂色鸢尾" },
    		{ file: "IVA5.jpg", class: "维吉尼亚鸢尾" }
    	];

    	let selectedImage = imageOptions[0].file;
    	let nodeData;
    	let selectedNodeIndex = -1;
    	let isExitedFromDetailedView = true;
    	let isExitedFromCollapse = true;
    	let customImageURL = null;

    	// Helper functions
    	const selectedScaleLevelChanged = () => {
    		if (svg !== undefined) {
    			if (!scaleLevelSet.add(selectedScaleLevel)) {
    				console.error("Encounter unknown scale level!");
    			}

    			// Update nodes and legends
    			if (selectedScaleLevel != previousSelectedScaleLevel) {
    				// We can simply redraw all nodes using the new color scale, or we can
    				// make it faster by only redraw certian nodes
    				let updatingLayerIndexDict = {
    					local: {
    						module: [1, 2, 8, 9, 10],
    						global: [1, 2, 3, 4, 5, 8, 9, 10]
    					},
    					module: {
    						local: [1, 2, 8, 9, 10],
    						global: [1, 2, 3, 4, 5, 8, 9, 10]
    					},
    					global: {
    						local: [1, 2, 3, 4, 5, 8, 9, 10],
    						module: [1, 2, 3, 4, 5]
    					}
    				};

    				let updatingLayerIndex = updatingLayerIndexDict[previousSelectedScaleLevel][selectedScaleLevel];

    				updatingLayerIndex.forEach(l => {
    					let range = cnnLayerRanges[selectedScaleLevel][l];
    					svg.select(`#cnn-layer-group-${l}`).selectAll(".node-image").each((d, i, g) => drawOutput(d, i, g, range));
    				});

    				// Hide previous legend
    				svg.selectAll(`.${previousSelectedScaleLevel}-legend`).classed("hidden", true);

    				// Show selected legends
    				svg.selectAll(`.${selectedScaleLevel}-legend`).classed("hidden", !detailedMode);
    			}

    			previousSelectedScaleLevel = selectedScaleLevel;
    			selectedScaleLevelStore.set(selectedScaleLevel);
    		}
    	};

    	const intermediateNodeMouseOverHandler = (d, i, g) => {
    		if (detailedViewNum !== undefined) {
    			return;
    		}

    		svg.select(`rect#underneath-gateway-${d.index}`).style("opacity", 1);
    	};

    	const intermediateNodeMouseLeaveHandler = (d, i, g) => {
    		// return;
    		if (detailedViewNum !== undefined) {
    			return;
    		}

    		svg.select(`rect#underneath-gateway-${d.index}`).style("opacity", 0);
    	};

    	const intermediateNodeClicked = (d, i, g, selectedI, curLayerIndex) => {
    		d3.event.stopPropagation();
    		$$invalidate(9, isExitedFromCollapse = false);

    		// Use this event to trigger the detailed view
    		if (detailedViewNum === d.index) {
    			// Setting this for testing purposes currently.
    			$$invalidate(7, selectedNodeIndex = -1);

    			// User clicks this node again -> rewind
    			detailedViewNum = undefined;

    			svg.select(`rect#underneath-gateway-${d.index}`).style("opacity", 0);
    		} else // We need to show a new detailed view (two cases: if we need to close the
    		// old detailed view or not)
    		{
    			// Setting this for testing purposes currently.
    			$$invalidate(7, selectedNodeIndex = d.index);

    			let inputMatrix = d.output;
    			let kernelMatrix = d.outputLinks[selectedI].weight;

    			// let interMatrix = singleConv(inputMatrix, kernelMatrix);
    			let colorScale = layerColorScales.conv;

    			// Compute the color range
    			let rangePre = cnnLayerRanges[selectedScaleLevel][curLayerIndex - 1];

    			let rangeCur = cnnLayerRanges[selectedScaleLevel][curLayerIndex];
    			let range = Math.max(rangePre, rangeCur);

    			// User triggers a different detailed view
    			if (detailedViewNum !== undefined) {
    				// Change the underneath highlight
    				svg.select(`rect#underneath-gateway-${detailedViewNum}`).style("opacity", 0);

    				svg.select(`rect#underneath-gateway-${d.index}`).style("opacity", 1);
    			}

    			// Dynamically position the detail view
    			let wholeSvg = d3.select("#cnn-svg");

    			let svgYMid = +wholeSvg.style("height").replace("px", "") / 2;
    			let svgWidth = +wholeSvg.style("width").replace("px", "");
    			let detailViewTop = -svgYMid - 250 / 2;
    			let positionX = intermediateLayerPosition[Object.keys(layerIndexDict)[curLayerIndex]];
    			let posX = 0;

    			if (curLayerIndex > 6) {
    				posX = (positionX - svgPaddings.left) / 2;
    				posX = svgPaddings.left + posX - 800 / 2;
    			} else {
    				posX = (svgWidth + svgPaddings.right - positionX) / 2;
    				posX = positionX + posX - 800 / 2;
    			}

    			const detailview = document.getElementById("detailview");
    			detailview.style.top = `${detailViewTop}px`;
    			detailview.style.left = `${posX}px`;
    			detailview.style.position = "relative";
    			detailedViewNum = d.index;

    			// Send the currently used color range to detailed view
    			$$invalidate(6, nodeData.colorRange = range, nodeData);

    			$$invalidate(6, nodeData.inputIsInputLayer = curLayerIndex <= 1, nodeData);
    		}
    	};

    	// The order of the if/else statements in this function is very critical
    	const emptySpaceClicked = () => {
    		// If detail view -> rewind to intermediate view
    		if (detailedViewNum !== undefined) {
    			// Setting this for testing purposes currently.
    			$$invalidate(7, selectedNodeIndex = -1);

    			// User clicks this node again -> rewind
    			svg.select(`rect#underneath-gateway-${detailedViewNum}`).style("opacity", 0);

    			detailedViewNum = undefined;
    		} else // If softmax view -> rewind to flatten layer view
    		if (isInSoftmax) {
    			svg.select(".softmax-symbol").dispatch("click");
    		} else // If intermediate view -> rewind to overview
    		if (isInIntermediateView) {
    			let curLayerIndex = layerIndexDict[selectedNode.layerName];
    			quitIntermediateView(curLayerIndex, selectedNode.domG, selectedNode.domI);
    			d3.select(selectedNode.domG[selectedNode.domI]).dispatch("mouseleave");
    		} else // If pool/act detail view -> rewind to overview
    		if (isInActPoolDetailView) {
    			quitActPoolDetailView();
    		}
    	};

    	const prepareToEnterIntermediateView = (d, g, i, curLayerIndex) => {
    		isInIntermediateView = true;

    		// Hide all legends
    		svg.selectAll(`.${selectedScaleLevel}-legend`).classed("hidden", true);

    		svg.selectAll(".input-legend").classed("hidden", true);
    		svg.selectAll(".output-legend").classed("hidden", true);

    		// Hide the input annotation
    		svg.select(".input-annotation").classed("hidden", true);

    		// Highlight the previous layer and this node
    		svg.select(`g#cnn-layer-group-${curLayerIndex - 1}`).selectAll("rect.bounding").style("stroke-width", 2);

    		d3.select(g[i]).select("rect.bounding").style("stroke-width", 2);

    		// Disable control panel UI
    		// d3.select('#level-select').property('disabled', true);
    		// d3.selectAll('.image-container')
    		//   .style('cursor', 'not-allowed')
    		//   .on('mouseclick', () => {});
    		$$invalidate(4, disableControl = true);

    		// Allow infinite animation loop
    		shouldIntermediateAnimateStore.set(true);

    		// Highlight the labels
    		svg.selectAll(`g#layer-label-${curLayerIndex - 1},
      g#layer-detailed-label-${curLayerIndex - 1},
      g#layer-label-${curLayerIndex},
      g#layer-detailed-label-${curLayerIndex}`).style("font-weight", "800");

    		// Register a handler on the svg element so user can click empty space to quit
    		// the intermediate view
    		d3.select("#cnn-svg").on("click", emptySpaceClicked);
    	};

    	const quitActPoolDetailView = () => {
    		isInActPoolDetailView = false;
    		actPoolDetailViewNodeIndex = -1;
    		let layerIndex = layerIndexDict[selectedNode.layerName];
    		let nodeIndex = selectedNode.index;
    		svg.select(`g#layer-${layerIndex}-node-${nodeIndex}`).select("rect.bounding").classed("hidden", true);

    		selectedNode.data.inputLinks.forEach(link => {
    			let layerIndex = layerIndexDict[link.source.layerName];
    			let nodeIndex = link.source.index;
    			svg.select(`g#layer-${layerIndex}-node-${nodeIndex}`).select("rect.bounding").classed("hidden", true);
    		});

    		// Clean up the underneath rects
    		svg.select("g.underneath").selectAll("rect").remove();

    		// Show all edges
    		let unimportantEdges = svg.select("g.edge-group").selectAll(".edge").filter(d => {
    			return d.targetLayerIndex !== actPoolDetailViewLayerIndex;
    		}).style("visibility", null);

    		// Recover control UI
    		$$invalidate(4, disableControl = false);

    		// Show legends if in detailed mode
    		svg.selectAll(`.${selectedScaleLevel}-legend`).classed("hidden", !detailedMode);

    		svg.selectAll(".input-legend").classed("hidden", !detailedMode);
    		svg.selectAll(".output-legend").classed("hidden", !detailedMode);

    		// Also dehighlight the edge
    		let edgeGroup = svg.select("g.cnn-group").select("g.edge-group");

    		edgeGroup.selectAll(`path.edge-${layerIndex}-${nodeIndex}`).transition().ease(d3.easeCubicOut).duration(200).style("stroke", edgeInitColor).style("stroke-width", edgeStrokeWidth).style("opacity", edgeOpacity);

    		// Remove the overlay rect
    		svg.selectAll("g.intermediate-layer-overlay, g.intermediate-layer-annotation").transition("remove").duration(500).ease(d3.easeCubicInOut).style("opacity", 0).on("end", (d, i, g) => {
    			svg.selectAll("g.intermediate-layer-overlay, g.intermediate-layer-annotation").remove();
    			svg.selectAll("defs.overlay-gradient").remove();
    			svg.select(".input-annotation").classed("hidden", false);
    		});

    		// Turn the fade out nodes back
    		svg.select(`g#cnn-layer-group-${layerIndex}`).selectAll("g.node-group").each((sd, si, sg) => {
    			d3.select(sg[si]).style("pointer-events", "all");
    		});

    		svg.select(`g#cnn-layer-group-${layerIndex - 1}`).selectAll("g.node-group").each((sd, si, sg) => {
    			// Recover the old events
    			d3.select(sg[si]).style("pointer-events", "all").on("mouseover", nodeMouseOverHandler).on("mouseleave", nodeMouseLeaveHandler).on("click", nodeClickHandler);
    		});

    		// Deselect the node
    		$$invalidate(3, selectedNode.layerName = "", selectedNode);

    		$$invalidate(3, selectedNode.index = -1, selectedNode);
    		$$invalidate(3, selectedNode.data = null, selectedNode);
    		actPoolDetailViewLayerIndex = -1;
    	};

    	const actPoolDetailViewPreNodeMouseOverHandler = (d, i, g) => {
    		// Highlight the edges
    		let layerIndex = layerIndexDict[d.layerName];

    		let nodeIndex = d.index;
    		let edgeGroup = svg.select("g.cnn-group").select("g.edge-group");
    		edgeGroup.selectAll(`path.edge-${actPoolDetailViewLayerIndex}-${nodeIndex}`).raise().transition().ease(d3.easeCubicInOut).duration(400).style("stroke", edgeHoverColor).style("stroke-width", "1").style("opacity", 1);

    		// Highlight its border
    		d3.select(g[i]).select("rect.bounding").classed("hidden", false);

    		// Highlight node's pair
    		let associatedLayerIndex = layerIndex - 1;

    		if (layerIndex === actPoolDetailViewLayerIndex - 1) {
    			associatedLayerIndex = layerIndex + 1;
    		}

    		svg.select(`g#layer-${associatedLayerIndex}-node-${nodeIndex}`).select("rect.bounding").classed("hidden", false);
    	};

    	const actPoolDetailViewPreNodeMouseLeaveHandler = (d, i, g) => {
    		// De-highlight the edges
    		let layerIndex = layerIndexDict[d.layerName];

    		let nodeIndex = d.index;
    		let edgeGroup = svg.select("g.cnn-group").select("g.edge-group");
    		edgeGroup.selectAll(`path.edge-${actPoolDetailViewLayerIndex}-${nodeIndex}`).transition().ease(d3.easeCubicOut).duration(200).style("stroke", edgeInitColor).style("stroke-width", edgeStrokeWidth).style("opacity", edgeOpacity);

    		// De-highlight its border
    		d3.select(g[i]).select("rect.bounding").classed("hidden", true);

    		// De-highlight node's pair
    		let associatedLayerIndex = layerIndex - 1;

    		if (layerIndex === actPoolDetailViewLayerIndex - 1) {
    			associatedLayerIndex = layerIndex + 1;
    		}

    		svg.select(`g#layer-${associatedLayerIndex}-node-${nodeIndex}`).select("rect.bounding").classed("hidden", true);
    	};

    	const actPoolDetailViewPreNodeClickHandler = (d, i, g) => {
    		let layerIndex = layerIndexDict[d.layerName];
    		let nodeIndex = d.index;

    		// Click the pre-layer node in detail view has the same effect as clicking
    		// the cur-layer node, which is to open a new detail view window
    		svg.select(`g#layer-${layerIndex + 1}-node-${nodeIndex}`).node().dispatchEvent(new Event("click"));
    	};

    	const enterDetailView = (curLayerIndex, i) => {
    		isInActPoolDetailView = true;
    		actPoolDetailViewNodeIndex = i;
    		actPoolDetailViewLayerIndex = curLayerIndex;

    		// Dynamically position the detail view
    		let wholeSvg = d3.select("#cnn-svg");

    		let svgYMid = +wholeSvg.style("height").replace("px", "") / 2;
    		let svgWidth = +wholeSvg.style("width").replace("px", "");
    		let detailViewTop = -svgYMid - 260 / 2;
    		let posX = 0;

    		if (curLayerIndex > 5) {
    			posX = nodeCoordinate[curLayerIndex - 1][0].x + 50;
    			posX = posX / 2 - 800 / 2;
    		} else {
    			posX = (svgWidth - nodeCoordinate[curLayerIndex][0].x - nodeLength) / 2;
    			posX = nodeCoordinate[curLayerIndex][0].x + nodeLength + posX - 800 / 2;
    		}

    		const detailview = document.getElementById("detailview");
    		detailview.style.top = `${detailViewTop}px`;
    		detailview.style.left = `${posX}px`;
    		detailview.style.position = "relative";

    		// Hide all edges
    		let unimportantEdges = svg.select("g.edge-group").selectAll(".edge").filter(d => {
    			return d.targetLayerIndex !== curLayerIndex;
    		}).style("visibility", "hidden");

    		// Disable UI
    		$$invalidate(4, disableControl = true);

    		// Hide input annotaitons
    		svg.select(".input-annotation").classed("hidden", true);

    		// Hide legends
    		svg.selectAll(`.${selectedScaleLevel}-legend`).classed("hidden", true);

    		svg.selectAll(".input-legend").classed("hidden", true);
    		svg.selectAll(".output-legend").classed("hidden", true);
    		svg.select(`#${layerLegendDict[curLayerIndex][selectedScaleLevel]}`).classed("hidden", false);

    		// Add overlay rects
    		let leftX = nodeCoordinate[curLayerIndex - 1][i].x;

    		// +5 to cover the detailed mode long label
    		let rightStart = nodeCoordinate[curLayerIndex][i].x + nodeLength + 5;

    		// Compute the left and right overlay rect width
    		let rightWidth = width - rightStart - overlayRectOffset / 2;

    		let leftWidth = leftX - nodeCoordinate[0][0].x;

    		// The overlay rects should be symmetric
    		if (rightWidth > leftWidth) {
    			let stops = [
    				{
    					offset: "0%",
    					color: "rgb(250, 250, 250)",
    					opacity: 0.85
    				},
    				{
    					offset: "50%",
    					color: "rgb(250, 250, 250)",
    					opacity: 0.9
    				},
    				{
    					offset: "100%",
    					color: "rgb(250, 250, 250)",
    					opacity: 1
    				}
    			];

    			addOverlayGradient("overlay-gradient-right", stops);
    			let leftEndOpacity = 0.85 + (0.95 - 0.85) * (leftWidth / rightWidth);

    			stops = [
    				{
    					offset: "0%",
    					color: "rgb(250, 250, 250)",
    					opacity: leftEndOpacity
    				},
    				{
    					offset: "100%",
    					color: "rgb(250, 250, 250)",
    					opacity: 0.85
    				}
    			];

    			addOverlayGradient("overlay-gradient-left", stops);
    		} else {
    			let stops = [
    				{
    					offset: "0%",
    					color: "rgb(250, 250, 250)",
    					opacity: 1
    				},
    				{
    					offset: "50%",
    					color: "rgb(250, 250, 250)",
    					opacity: 0.9
    				},
    				{
    					offset: "100%",
    					color: "rgb(250, 250, 250)",
    					opacity: 0.85
    				}
    			];

    			addOverlayGradient("overlay-gradient-left", stops);
    			let rightEndOpacity = 0.85 + (0.95 - 0.85) * (rightWidth / leftWidth);

    			stops = [
    				{
    					offset: "0%",
    					color: "rgb(250, 250, 250)",
    					opacity: 0.85
    				},
    				{
    					offset: "100%",
    					color: "rgb(250, 250, 250)",
    					opacity: rightEndOpacity
    				}
    			];

    			addOverlayGradient("overlay-gradient-right", stops);
    		}

    		addOverlayRect("overlay-gradient-right", rightStart + overlayRectOffset / 2 + 0.5, 0, rightWidth, height + svgPaddings.top);
    		addOverlayRect("overlay-gradient-left", nodeCoordinate[0][0].x - overlayRectOffset / 2, 0, leftWidth, height + svgPaddings.top);
    		svg.selectAll("rect.overlay").on("click", emptySpaceClicked);

    		// Add underneath rectangles
    		let underGroup = svg.select("g.underneath");

    		let padding = 7;

    		for (let n = 0; n < cnn[curLayerIndex - 1].length; n++) {
    			underGroup.append("rect").attr("class", "underneath-gateway").attr("id", `underneath-gateway-${n}`).attr("x", nodeCoordinate[curLayerIndex - 1][n].x - padding).attr("y", nodeCoordinate[curLayerIndex - 1][n].y - padding).attr("width", 2 * nodeLength + hSpaceAroundGap + 2 * padding).attr("height", nodeLength + 2 * padding).attr("rx", 10).style("fill", "rgba(160, 160, 160, 0.3)").style("opacity", 0);

    			// Update the event functions for these two layers
    			svg.select(`g#layer-${curLayerIndex - 1}-node-${n}`).style("pointer-events", "all").style("cursor", "pointer").on("mouseover", actPoolDetailViewPreNodeMouseOverHandler).on("mouseleave", actPoolDetailViewPreNodeMouseLeaveHandler).on("click", actPoolDetailViewPreNodeClickHandler);
    		}

    		underGroup.lower();

    		// Highlight the selcted pair
    		underGroup.select(`#underneath-gateway-${i}`).style("opacity", 1);
    	};

    	const quitIntermediateView = (curLayerIndex, g, i) => {
    		// If it is the softmax detail view, quit that view first
    		if (isInSoftmax) {
    			svg.select(".logit-layer").remove();
    			svg.select(".logit-layer-lower").remove();
    			svg.selectAll(".plus-symbol-clone").remove();

    			// Instead of removing the paths, we hide them, so it is faster to load in
    			// the future
    			svg.select(".underneath").selectAll(".logit-lower").style("opacity", 0);

    			softmaxDetailViewStore.set({ show: false, logits: [] });
    			allowsSoftmaxAnimationStore.set(false);
    		}

    		isInSoftmaxStore.set(false);
    		isInIntermediateView = false;

    		// Show the legend
    		svg.selectAll(`.${selectedScaleLevel}-legend`).classed("hidden", !detailedMode);

    		svg.selectAll(".input-legend").classed("hidden", !detailedMode);
    		svg.selectAll(".output-legend").classed("hidden", !detailedMode);

    		// Recover control panel UI
    		$$invalidate(4, disableControl = false);

    		// Recover the input layer node's event
    		for (let n = 0; n < cnn[curLayerIndex - 1].length; n++) {
    			svg.select(`g#layer-${curLayerIndex - 1}-node-${n}`).on("mouseover", nodeMouseOverHandler).on("mouseleave", nodeMouseLeaveHandler).on("click", nodeClickHandler);
    		}

    		// Clean up the underneath rects
    		svg.select("g.underneath").selectAll("rect").remove();

    		detailedViewNum = undefined;

    		// Highlight the previous layer and this node
    		svg.select(`g#cnn-layer-group-${curLayerIndex - 1}`).selectAll("rect.bounding").style("stroke-width", 1);

    		d3.select(g[i]).select("rect.bounding").style("stroke-width", 1);

    		// Highlight the labels
    		svg.selectAll(`g#layer-label-${curLayerIndex - 1},
      g#layer-detailed-label-${curLayerIndex - 1},
      g#layer-label-${curLayerIndex},
      g#layer-detailed-label-${curLayerIndex}`).style("font-weight", "normal");

    		// Also unclick the node
    		// Record the current clicked node
    		$$invalidate(3, selectedNode.layerName = "", selectedNode);

    		$$invalidate(3, selectedNode.index = -1, selectedNode);
    		$$invalidate(3, selectedNode.data = null, selectedNode);
    		$$invalidate(9, isExitedFromCollapse = true);

    		// Remove the intermediate layer
    		let intermediateLayer = svg.select("g.intermediate-layer");

    		// Kill the infinite animation loop
    		shouldIntermediateAnimateStore.set(false);

    		intermediateLayer.transition("remove").duration(500).ease(d3.easeCubicInOut).style("opacity", 0).on("end", (d, i, g) => {
    			d3.select(g[i]).remove();
    		});

    		// Remove the output node overlay mask
    		svg.selectAll(".overlay-group").remove();

    		// Remove the overlay rect
    		svg.selectAll("g.intermediate-layer-overlay, g.intermediate-layer-annotation").transition("remove").duration(500).ease(d3.easeCubicInOut).style("opacity", 0).on("end", (d, i, g) => {
    			svg.selectAll("g.intermediate-layer-overlay, g.intermediate-layer-annotation").remove();
    			svg.selectAll("defs.overlay-gradient").remove();
    		});

    		// Recover the layer if we have drdrawn it
    		if (needRedraw[0] !== undefined) {
    			let redrawRange = cnnLayerRanges[selectedScaleLevel][needRedraw[0]];

    			if (needRedraw[1] !== undefined) {
    				svg.select(`g#layer-${needRedraw[0]}-node-${needRedraw[1]}`).select("image.node-image").each((d, i, g) => drawOutput(d, i, g, redrawRange));
    			} else {
    				svg.select(`g#cnn-layer-group-${needRedraw[0]}`).selectAll("image.node-image").each((d, i, g) => drawOutput(d, i, g, redrawRange));
    			}
    		}

    		// Move all layers to their original place
    		for (let i = 0; i < numLayers; i++) {
    			moveLayerX({
    				layerIndex: i,
    				targetX: nodeCoordinate[i][0].x,
    				disable: false,
    				delay: 500,
    				opacity: 1
    			});
    		}

    		moveLayerX({
    			layerIndex: numLayers - 2,
    			targetX: nodeCoordinate[numLayers - 2][0].x,
    			opacity: 1,
    			disable: false,
    			delay: 500,
    			onEndFunc: () => {
    				// Show all edges on the last moving animation end
    				svg.select("g.edge-group").style("visibility", "visible");

    				// Recover the input annotation
    				svg.select(".input-annotation").classed("hidden", false);
    			}
    		});
    	};

    	const nodeClickHandler = (d, i, g) => {
    		d3.event.stopPropagation();
    		let nodeIndex = d.index;

    		// Record the current clicked node
    		$$invalidate(3, selectedNode.layerName = d.layerName, selectedNode);

    		$$invalidate(3, selectedNode.index = d.index, selectedNode);
    		$$invalidate(3, selectedNode.data = d, selectedNode);
    		$$invalidate(3, selectedNode.domI = i, selectedNode);
    		$$invalidate(3, selectedNode.domG = g, selectedNode);

    		// Record data for detailed view.
    		if (d.type === "conv" || d.type === "relu" || d.type === "pool") {
    			let data = [];

    			for (let j = 0; j < d.inputLinks.length; j++) {
    				data.push({
    					input: d.inputLinks[j].source.output,
    					kernel: d.inputLinks[j].weight,
    					output: d.inputLinks[j].dest.output
    				});
    			}

    			let curLayerIndex = layerIndexDict[d.layerName];
    			data.colorRange = cnnLayerRanges[selectedScaleLevel][curLayerIndex];
    			data.isInputInputLayer = curLayerIndex <= 1;
    			$$invalidate(6, nodeData = data);
    		}

    		let curLayerIndex = layerIndexDict[d.layerName];

    		if (d.type == "relu" || d.type == "pool") {
    			$$invalidate(8, isExitedFromDetailedView = false);

    			if (!isInActPoolDetailView) {
    				// Enter the act pool detail view
    				enterDetailView(curLayerIndex, d.index);
    			} else {
    				if (d.index === actPoolDetailViewNodeIndex) {
    					// Quit the act pool detail view
    					quitActPoolDetailView();
    				} else {
    					// Switch the detail view input to the new clicked pair
    					// Remove the previous selection effect
    					svg.select(`g#layer-${curLayerIndex}-node-${actPoolDetailViewNodeIndex}`).select("rect.bounding").classed("hidden", true);

    					svg.select(`g#layer-${curLayerIndex - 1}-node-${actPoolDetailViewNodeIndex}`).select("rect.bounding").classed("hidden", true);
    					let edgeGroup = svg.select("g.cnn-group").select("g.edge-group");
    					edgeGroup.selectAll(`path.edge-${curLayerIndex}-${actPoolDetailViewNodeIndex}`).transition().ease(d3.easeCubicOut).duration(200).style("stroke", edgeInitColor).style("stroke-width", edgeStrokeWidth).style("opacity", edgeOpacity);
    					let underGroup = svg.select("g.underneath");
    					underGroup.select(`#underneath-gateway-${actPoolDetailViewNodeIndex}`).style("opacity", 0);

    					// Add selection effect on the new selected pair
    					svg.select(`g#layer-${curLayerIndex}-node-${nodeIndex}`).select("rect.bounding").classed("hidden", false);

    					svg.select(`g#layer-${curLayerIndex - 1}-node-${nodeIndex}`).select("rect.bounding").classed("hidden", false);
    					edgeGroup.selectAll(`path.edge-${curLayerIndex}-${nodeIndex}`).raise().transition().ease(d3.easeCubicInOut).duration(400).style("stroke", edgeHoverColor).style("stroke-width", "1").style("opacity", 1);
    					underGroup.select(`#underneath-gateway-${nodeIndex}`).style("opacity", 1);
    					actPoolDetailViewNodeIndex = nodeIndex;
    				}
    			}
    		}

    		// Enter the second view (layer-view) when user clicks a conv node
    		if ((d.type === "conv" || d.layerName === "output" || d.type === "fc") && !isInIntermediateView) {
    			prepareToEnterIntermediateView(d, g, nodeIndex, curLayerIndex);

    			if (d.layerName === "conv2d_22") {
    				drawConv1(curLayerIndex, d, nodeIndex, width, height, intermediateNodeMouseOverHandler, intermediateNodeMouseLeaveHandler, intermediateNodeClicked);
    			} else if (d.layerName === "conv_1_2") {
    				drawConv2(curLayerIndex, d, nodeIndex, width, height, intermediateNodeMouseOverHandler, intermediateNodeMouseLeaveHandler, intermediateNodeClicked);
    			} else if (d.layerName === "conv2d_23") {
    				drawConv3(curLayerIndex, d, nodeIndex, width, height, intermediateNodeMouseOverHandler, intermediateNodeMouseLeaveHandler, intermediateNodeClicked);
    			} else if (d.layerName === "conv_2_2") {
    				drawConv4(curLayerIndex, d, nodeIndex, width, height, intermediateNodeMouseOverHandler, intermediateNodeMouseLeaveHandler, intermediateNodeClicked);
    			} else if (d.layerName === "dense_22") {
    				drawFlatten(curLayerIndex, d, nodeIndex, width, height);
    			} else if (d.layerName === "output") {
    				drawOutFlatten(curLayerIndex, d, nodeIndex, width, height);
    			}
    		} else // Quit the layerview
    		if ((d.type === "conv" || d.layerName === "output") && isInIntermediateView) {
    			quitIntermediateView(curLayerIndex, g, i);
    		}
    	};

    	const nodeMouseOverHandler = (d, i, g) => {
    		// if (isInIntermediateView || isInActPoolDetailView) { return; }
    		if (isInIntermediateView) {
    			return;
    		}

    		// Highlight the edges
    		let layerIndex = layerIndexDict[d.layerName];

    		let nodeIndex = d.index;
    		let edgeGroup = svg.select("g.cnn-group").select("g.edge-group");
    		edgeGroup.selectAll(`path.edge-${layerIndex}-${nodeIndex}`).raise().transition().ease(d3.easeCubicInOut).duration(400).style("stroke", edgeHoverColor).style("stroke-width", "1").style("opacity", 1);

    		// Highlight its border
    		d3.select(g[i]).select("rect.bounding").classed("hidden", false);

    		d3.select(g[i]).select("circle.bounding").classed("hidden", false);

    		// Highlight source's border
    		if (d.inputLinks.length === 1) {
    			let link = d.inputLinks[0];
    			let layerIndex = layerIndexDict[link.source.layerName];
    			let nodeIndex = link.source.index;
    			svg.select(`g#layer-${layerIndex}-node-${nodeIndex}`).select("rect.bounding").classed("hidden", false);
    			svg.select(`g#layer-${layerIndex}-node-${nodeIndex}`).select("circle.bounding").classed("hidden", false);
    		} else {
    			svg.select(`g#cnn-layer-group-${layerIndex - 1}`).selectAll("g.node-group").selectAll("rect.bounding").classed("hidden", false);
    			svg.select(`g#cnn-layer-group-${layerIndex - 1}`).selectAll("g.node-group").selectAll("circle.bounding").classed("hidden", false);
    		}

    		// Highlight the output text
    		if (d.layerName === "output") {
    			d3.select(g[i]).select(".output-text").style("opacity", 0.8).style("text-decoration", "underline");
    		}
    	}; /* Use the following commented code if we have non-linear model
    d.inputLinks.forEach(link => {
      let layerIndex = layerIndexDict[link.source.layerName];
      let nodeIndex = link.source.index;
      svg.select(`g#layer-${layerIndex}-node-${nodeIndex}`)
        .select('rect.bounding')
        .classed('hidden', false);
    });
    */

    	const nodeMouseLeaveHandler = (d, i, g) => {
    		// Screenshot
    		// return;
    		if (isInIntermediateView) {
    			return;
    		}

    		// Keep the highlight if user has clicked
    		if (isInActPoolDetailView || (d.layerName !== selectedNode.layerName || d.index !== selectedNode.index)) {
    			let layerIndex = layerIndexDict[d.layerName];
    			let nodeIndex = d.index;
    			let edgeGroup = svg.select("g.cnn-group").select("g.edge-group");
    			edgeGroup.selectAll(`path.edge-${layerIndex}-${nodeIndex}`).transition().ease(d3.easeCubicOut).duration(200).style("stroke", edgeInitColor).style("stroke-width", edgeStrokeWidth).style("opacity", edgeOpacity);
    			d3.select(g[i]).select("rect.bounding").classed("hidden", true);
    			d3.select(g[i]).select("circle.bounding").classed("hidden", true);

    			if (d.inputLinks.length === 1) {
    				let link = d.inputLinks[0];
    				let layerIndex = layerIndexDict[link.source.layerName];
    				let nodeIndex = link.source.index;
    				svg.select(`g#layer-${layerIndex}-node-${nodeIndex}`).select("rect.bounding").classed("hidden", true);
    				svg.select(`g#layer-${layerIndex}-node-${nodeIndex}`).select("circle.bounding").classed("hidden", true);
    			} else {
    				svg.select(`g#cnn-layer-group-${layerIndex - 1}`).selectAll("g.node-group").selectAll("rect.bounding").classed("hidden", d => d.layerName !== selectedNode.layerName || d.index !== selectedNode.index);
    				svg.select(`g#cnn-layer-group-${layerIndex - 1}`).selectAll("g.node-group").selectAll("circle.bounding").classed("hidden", d => d.layerName !== selectedNode.layerName || d.index !== selectedNode.index);
    			}

    			// Dehighlight the output text
    			if (d.layerName === "output") {
    				d3.select(g[i]).select(".output-text").style("fill", "black").style("opacity", 0.5).style("text-decoration", "none");
    			}
    		} /* Use the following commented code if we have non-linear model
    d.inputLinks.forEach(link => {
      let layerIndex = layerIndexDict[link.source.layerName];
      let nodeIndex = link.source.index;
      svg.select(`g#layer-${layerIndex}-node-${nodeIndex}`)
        .select('rect.bounding')
        .classed('hidden', true);
    });
    */
    	};

    	let logits = [-4.28, 2.96, -0.38, 5.24, -7.56, -3.43, 8.63, 2.63, 6.3, 0.68];
    	let selectedI = 4;

    	onMount(async () => {
    		window.scrollTo(0, 0);

    		// Create SVG
    		wholeSvg = d3.select(overviewComponent).select("#cnn-svg");

    		svg = wholeSvg.append("g").attr("class", "main-svg").attr("transform", `translate(${svgPaddings.left}, 0)`);
    		svgStore.set(svg);
    		width = Number(wholeSvg.style("width").replace("px", "")) - svgPaddings.left - svgPaddings.right;
    		height = Number(wholeSvg.style("height").replace("px", "")) - svgPaddings.top - svgPaddings.bottom;
    		let cnnGroup = svg.append("g").attr("class", "cnn-group");
    		let underGroup = svg.append("g").attr("class", "underneath");
    		let svgYMid = +wholeSvg.style("height").replace("px", "") / 2;

    		detailedViewAbsCoords = {
    			1: [600, 100 + svgYMid - 220 / 2, 490, 290],
    			2: [500, 100 + svgYMid - 220 / 2, 490, 290],
    			3: [700, 100 + svgYMid - 220 / 2, 490, 290],
    			4: [600, 100 + svgYMid - 220 / 2, 490, 290],
    			5: [650, 100 + svgYMid - 220 / 2, 490, 290],
    			6: [850, 100 + svgYMid - 220 / 2, 490, 290],
    			7: [100, 100 + svgYMid - 220 / 2, 490, 290],
    			8: [60, 100 + svgYMid - 220 / 2, 490, 290],
    			9: [200, 100 + svgYMid - 220 / 2, 490, 290],
    			10: [300, 100 + svgYMid - 220 / 2, 490, 290]
    		};

    		// Define global arrow marker end
    		svg.append("defs").append("marker").attr("id", "marker").attr("viewBox", "0 -5 10 10").attr("refX", 6).attr("refY", 0).attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto").append("path").style("stroke-width", 1.2).style("fill", "gray").style("stroke", "gray").attr("d", "M0,-5L10,0L0,5");

    		// Alternative arrow head style for non-interactive annotation
    		svg.append("defs").append("marker").attr("id", "marker-alt").attr("viewBox", "0 -5 10 10").attr("refX", 6).attr("refY", 0).attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto").append("path").style("fill", "none").style("stroke", "gray").style("stroke-width", 2).attr("d", "M-5,-10L10,0L-5,10");

    		console.time("Construct cnn");
    		model = await loadTrainedModel("/assets/data/model.json");
    		cnn = await constructCNN(`/assets/img/${selectedImage}`, model);
    		console.timeEnd("Construct cnn");

    		// Ignore the flatten layer for now
    		let flatten = cnn[cnn.length - 3];

    		cnn.splice(cnn.length - 3, 1);
    		cnn.flatten = flatten;
    		console.log(cnn);
    		cnnStore.set(cnn);
    		updateCNNLayerRanges();

    		// Create and draw the CNN view
    		drawCNN(width, height, cnnGroup, nodeMouseOverHandler, nodeMouseLeaveHandler, nodeClickHandler);
    	});

    	const detailedButtonClicked = () => {
    		detailedMode = !detailedMode;
    		detailedModeStore.set(detailedMode);

    		if (!isInIntermediateView) {
    			// Show the legend
    			svg.selectAll(`.${selectedScaleLevel}-legend`).classed("hidden", !detailedMode);

    			svg.selectAll(".input-legend").classed("hidden", !detailedMode);
    			svg.selectAll(".output-legend").classed("hidden", !detailedMode);
    		}

    		// Switch the layer name
    		svg.selectAll(".layer-detailed-label").classed("hidden", !detailedMode);

    		svg.selectAll(".layer-label").classed("hidden", detailedMode);
    	};

    	const imageOptionClicked = async e => {
    		let newImageName = d3.select(e.target).attr("data-imageName");

    		if (newImageName !== selectedImage) {
    			$$invalidate(5, selectedImage = newImageName);

    			// Re-compute the CNN using the new input image
    			cnn = await constructCNN(`/assets/img/${selectedImage}`, model);

    			// Ignore the flatten layer for now
    			let flatten = cnn[cnn.length - 3];

    			cnn.splice(cnn.length - 3, 1);
    			cnn.flatten = flatten;
    			cnnStore.set(cnn);

    			// Update all scales used in the CNN view
    			updateCNNLayerRanges();

    			updateCNN();
    		}
    	};

    	const customImageClicked = () => {
    		// Case 1: there is no custom image -> show the modal to get user input
    		if (customImageURL === null) {
    			modalInfo.show = true;
    			modalInfo.preImage = selectedImage;
    			modalStore.set(modalInfo);
    		} else // Case 2: there is an existing custom image, not the focus -> switch to this image
    		if (selectedImage !== "custom") {
    			let fakeEvent = { detail: { url: customImageURL } };
    			handleCustomImage(fakeEvent);
    		} else // Case 3: there is an existing custom image, and its the focus -> let user
    		// upload a new image
    		{
    			modalInfo.show = true;
    			modalInfo.preImage = selectedImage;
    			modalStore.set(modalInfo);
    		}

    		if (selectedImage !== "custom") {
    			$$invalidate(5, selectedImage = "custom");
    		}
    	};

    	const handleModalCanceled = event => {
    		// User cancels the modal without a successful image, so we restore the
    		// previous selected image as input
    		$$invalidate(5, selectedImage = event.detail.preImage);
    	};

    	const handleCustomImage = async event => {
    		// User gives a valid image URL
    		$$invalidate(10, customImageURL = event.detail.url);

    		// Re-compute the CNN using the new input image
    		cnn = await constructCNN(customImageURL, model);

    		// Ignore the flatten layer for now
    		let flatten = cnn[cnn.length - 2];

    		cnn.splice(cnn.length - 2, 1);
    		cnn.flatten = flatten;
    		cnnStore.set(cnn);

    		// Update the UI
    		let customImageSlot = d3.select(overviewComponent).select(".custom-image").node();

    		drawCustomImage(customImageSlot, cnn[0]);

    		// Update all scales used in the CNN view
    		updateCNNLayerRanges();

    		updateCNN();
    	};

    	function handleExitFromDetiledConvView(event) {
    		if (event.detail.text) {
    			detailedViewNum = undefined;
    			svg.select(`rect#underneath-gateway-${selectedNodeIndex}`).style("opacity", 0);
    			$$invalidate(7, selectedNodeIndex = -1);
    		}
    	}

    	function handleExitFromDetiledPoolView(event) {
    		if (event.detail.text) {
    			quitActPoolDetailView();
    			$$invalidate(8, isExitedFromDetailedView = true);
    		}
    	}

    	function handleExitFromDetiledActivationView(event) {
    		if (event.detail.text) {
    			quitActPoolDetailView();
    			$$invalidate(8, isExitedFromDetailedView = true);
    		}
    	}

    	function handleExitFromDetiledSoftmaxView(event) {
    		$$invalidate(1, softmaxDetailViewInfo.show = false, softmaxDetailViewInfo);
    		softmaxDetailViewStore.set(softmaxDetailViewInfo);
    	}

    	const writable_props = [];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$3.warn(`<Overview> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Overview", $$slots, []);

    	function div4_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			overviewComponent = $$value;
    			$$invalidate(0, overviewComponent);
    		});
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		cnnStore,
    		svgStore,
    		vSpaceAroundGapStore,
    		hSpaceAroundGapStore,
    		nodeCoordinateStore,
    		selectedScaleLevelStore,
    		cnnLayerRangesStore,
    		needRedrawStore,
    		cnnLayerMinMaxStore,
    		detailedModeStore,
    		shouldIntermediateAnimateStore,
    		isInSoftmaxStore,
    		softmaxDetailViewStore,
    		hoverInfoStore,
    		allowsSoftmaxAnimationStore,
    		modalStore,
    		intermediateLayerPositionStore,
    		ConvolutionView: Convolutionview,
    		ActivationView: Activationview,
    		PoolView: Poolview,
    		SoftmaxView: Softmaxview,
    		Modal,
    		Article,
    		loadTrainedModel,
    		constructCNN,
    		overviewConfig,
    		addOverlayRect,
    		drawConv1,
    		drawConv2,
    		drawConv3,
    		drawConv4,
    		moveLayerX,
    		addOverlayGradient,
    		drawFlatten,
    		softmaxDetailViewMouseOverHandler,
    		softmaxDetailViewMouseLeaveHandler,
    		drawOutFlatten,
    		drawOutput,
    		drawCNN,
    		updateCNN,
    		updateCNNLayerRanges,
    		drawCustomImage,
    		overviewComponent,
    		scaleLevelSet,
    		selectedScaleLevel,
    		previousSelectedScaleLevel,
    		wholeSvg,
    		svg,
    		layerColorScales,
    		nodeLength,
    		plusSymbolRadius,
    		numLayers,
    		edgeOpacity,
    		edgeInitColor,
    		edgeHoverColor,
    		edgeHoverOuting,
    		edgeStrokeWidth,
    		intermediateColor,
    		kernelRectLength,
    		svgPaddings,
    		gapRatio,
    		overlayRectOffset,
    		classLists,
    		needRedraw,
    		nodeCoordinate,
    		cnnLayerRanges,
    		cnnLayerMinMax,
    		detailedMode,
    		shouldIntermediateAnimate,
    		vSpaceAroundGap,
    		hSpaceAroundGap,
    		isInSoftmax,
    		softmaxDetailViewInfo,
    		modalInfo,
    		hoverInfo,
    		intermediateLayerPosition,
    		width,
    		height,
    		model,
    		selectedNode,
    		isInIntermediateView,
    		isInActPoolDetailView,
    		actPoolDetailViewNodeIndex,
    		actPoolDetailViewLayerIndex,
    		detailedViewNum,
    		disableControl,
    		cnn,
    		detailedViewAbsCoords,
    		layerIndexDict1,
    		layerIndexDict,
    		layerLegendDict,
    		imageOptions,
    		selectedImage,
    		nodeData,
    		selectedNodeIndex,
    		isExitedFromDetailedView,
    		isExitedFromCollapse,
    		customImageURL,
    		selectedScaleLevelChanged,
    		intermediateNodeMouseOverHandler,
    		intermediateNodeMouseLeaveHandler,
    		intermediateNodeClicked,
    		emptySpaceClicked,
    		prepareToEnterIntermediateView,
    		quitActPoolDetailView,
    		actPoolDetailViewPreNodeMouseOverHandler,
    		actPoolDetailViewPreNodeMouseLeaveHandler,
    		actPoolDetailViewPreNodeClickHandler,
    		enterDetailView,
    		quitIntermediateView,
    		nodeClickHandler,
    		nodeMouseOverHandler,
    		nodeMouseLeaveHandler,
    		logits,
    		selectedI,
    		detailedButtonClicked,
    		imageOptionClicked,
    		customImageClicked,
    		handleModalCanceled,
    		handleCustomImage,
    		handleExitFromDetiledConvView,
    		handleExitFromDetiledPoolView,
    		handleExitFromDetiledActivationView,
    		handleExitFromDetiledSoftmaxView
    	});

    	$$self.$inject_state = $$props => {
    		if ("overviewComponent" in $$props) $$invalidate(0, overviewComponent = $$props.overviewComponent);
    		if ("scaleLevelSet" in $$props) scaleLevelSet = $$props.scaleLevelSet;
    		if ("selectedScaleLevel" in $$props) $$invalidate(47, selectedScaleLevel = $$props.selectedScaleLevel);
    		if ("previousSelectedScaleLevel" in $$props) previousSelectedScaleLevel = $$props.previousSelectedScaleLevel;
    		if ("wholeSvg" in $$props) wholeSvg = $$props.wholeSvg;
    		if ("svg" in $$props) svg = $$props.svg;
    		if ("needRedraw" in $$props) needRedraw = $$props.needRedraw;
    		if ("nodeCoordinate" in $$props) nodeCoordinate = $$props.nodeCoordinate;
    		if ("cnnLayerRanges" in $$props) cnnLayerRanges = $$props.cnnLayerRanges;
    		if ("cnnLayerMinMax" in $$props) cnnLayerMinMax = $$props.cnnLayerMinMax;
    		if ("detailedMode" in $$props) detailedMode = $$props.detailedMode;
    		if ("shouldIntermediateAnimate" in $$props) shouldIntermediateAnimate = $$props.shouldIntermediateAnimate;
    		if ("vSpaceAroundGap" in $$props) vSpaceAroundGap = $$props.vSpaceAroundGap;
    		if ("hSpaceAroundGap" in $$props) hSpaceAroundGap = $$props.hSpaceAroundGap;
    		if ("isInSoftmax" in $$props) isInSoftmax = $$props.isInSoftmax;
    		if ("softmaxDetailViewInfo" in $$props) $$invalidate(1, softmaxDetailViewInfo = $$props.softmaxDetailViewInfo);
    		if ("modalInfo" in $$props) modalInfo = $$props.modalInfo;
    		if ("hoverInfo" in $$props) $$invalidate(2, hoverInfo = $$props.hoverInfo);
    		if ("intermediateLayerPosition" in $$props) intermediateLayerPosition = $$props.intermediateLayerPosition;
    		if ("width" in $$props) width = $$props.width;
    		if ("height" in $$props) height = $$props.height;
    		if ("model" in $$props) model = $$props.model;
    		if ("selectedNode" in $$props) $$invalidate(3, selectedNode = $$props.selectedNode);
    		if ("isInIntermediateView" in $$props) isInIntermediateView = $$props.isInIntermediateView;
    		if ("isInActPoolDetailView" in $$props) isInActPoolDetailView = $$props.isInActPoolDetailView;
    		if ("actPoolDetailViewNodeIndex" in $$props) actPoolDetailViewNodeIndex = $$props.actPoolDetailViewNodeIndex;
    		if ("actPoolDetailViewLayerIndex" in $$props) actPoolDetailViewLayerIndex = $$props.actPoolDetailViewLayerIndex;
    		if ("detailedViewNum" in $$props) detailedViewNum = $$props.detailedViewNum;
    		if ("disableControl" in $$props) $$invalidate(4, disableControl = $$props.disableControl);
    		if ("cnn" in $$props) cnn = $$props.cnn;
    		if ("detailedViewAbsCoords" in $$props) detailedViewAbsCoords = $$props.detailedViewAbsCoords;
    		if ("imageOptions" in $$props) $$invalidate(12, imageOptions = $$props.imageOptions);
    		if ("selectedImage" in $$props) $$invalidate(5, selectedImage = $$props.selectedImage);
    		if ("nodeData" in $$props) $$invalidate(6, nodeData = $$props.nodeData);
    		if ("selectedNodeIndex" in $$props) $$invalidate(7, selectedNodeIndex = $$props.selectedNodeIndex);
    		if ("isExitedFromDetailedView" in $$props) $$invalidate(8, isExitedFromDetailedView = $$props.isExitedFromDetailedView);
    		if ("isExitedFromCollapse" in $$props) $$invalidate(9, isExitedFromCollapse = $$props.isExitedFromCollapse);
    		if ("customImageURL" in $$props) $$invalidate(10, customImageURL = $$props.customImageURL);
    		if ("logits" in $$props) logits = $$props.logits;
    		if ("selectedI" in $$props) selectedI = $$props.selectedI;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	 (selectedScaleLevelChanged());

    	return [
    		overviewComponent,
    		softmaxDetailViewInfo,
    		hoverInfo,
    		selectedNode,
    		disableControl,
    		selectedImage,
    		nodeData,
    		selectedNodeIndex,
    		isExitedFromDetailedView,
    		isExitedFromCollapse,
    		customImageURL,
    		layerColorScales,
    		imageOptions,
    		imageOptionClicked,
    		customImageClicked,
    		handleModalCanceled,
    		handleCustomImage,
    		handleExitFromDetiledConvView,
    		handleExitFromDetiledPoolView,
    		handleExitFromDetiledActivationView,
    		handleExitFromDetiledSoftmaxView,
    		div4_binding
    	];
    }

    class Overview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {}, [-1, -1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Overview",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src\article\article.svelte generated by Svelte v3.24.0 */

    const file$j = "src\\article\\article.svelte";

    function create_fragment$k(ctx) {
    	let body;
    	let div3;
    	let div0;
    	let h2;
    	let strong0;
    	let t1;
    	let p0;
    	let strong1;
    	let t3;
    	let p1;
    	let strong2;
    	let t5;
    	let h30;
    	let t7;
    	let p2;
    	let t8;
    	let em;
    	let t10;
    	let t11;
    	let p3;
    	let t13;
    	let ol;
    	let li0;
    	let strong3;
    	let t15;
    	let t16;
    	let li1;
    	let strong4;
    	let t18;
    	let t19;
    	let li2;
    	let strong5;
    	let t21;
    	let t22;
    	let li3;
    	let strong6;
    	let t24;
    	let t25;
    	let h31;
    	let t27;
    	let h40;
    	let t29;
    	let p4;
    	let t31;
    	let h41;
    	let t33;
    	let p5;
    	let t35;
    	let p6;
    	let t37;
    	let div2;
    	let img;
    	let img_src_value;
    	let t38;
    	let div1;
    	let t40;
    	let h42;
    	let t42;
    	let p7;
    	let t44;
    	let p8;
    	let t46;
    	let h43;
    	let t48;
    	let p9;
    	let t50;
    	let h44;
    	let t52;
    	let p10;
    	let t54;
    	let p11;

    	const block = {
    		c: function create() {
    			body = element("body");
    			div3 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			strong0 = element("strong");
    			strong0.textContent = "Section: 卷积神经网络";
    			t1 = space();
    			p0 = element("p");
    			strong1 = element("strong");
    			strong1.textContent = "几天之后一个周末，你的同学来你家里玩。听说你实现了一个能够自动识别鸢尾花品种的识别程序，他十分感兴趣，于是在手机中找出了一张之前在郊外拍摄到的一张鸢尾花照片，问你的软件能不能识别照片中的鸢尾花\r\n            品种。这就让你犯了难了，之前你都是通过实地测量出鸢尾花的花瓣花萼的长宽等特征来输入网络中进行分类，而现在仅仅只有一张照片，从照片中测量得到的长宽也一定与实际相差甚远，如何通过图像来识别鸢尾花\r\n            的品种，这又让你找到了一个新的挑战。";
    			t3 = space();
    			p1 = element("p");
    			strong2 = element("strong");
    			strong2.textContent = "经过网络上的一番资料查阅，你发现当今的人工智能技术已经能够识别图像中物体的种类，而这些人工智能使用的技术是一个叫做卷积神经网络的网络结构。于是你决定尝试一下使用卷积神经网络来对图片中的鸢尾花进行分类。";
    			t5 = space();
    			h30 = element("h3");
    			h30.textContent = "什么是卷积神经网络？";
    			t7 = space();
    			p2 = element("p");
    			t8 = text("在机器学习中，往往都是从输入的特征中找到不同类别之间的区别从而进行分类。而与之前用测量的鸢尾花数据作为输入不同，这次我们的输入是一张图片。这时候，使用一个 ");
    			em = element("em");
    			em.textContent = "卷积神经网络";
    			t10 = text("，或简称为CNN，是一种非常适合解决这种问题类型的分类器！");
    			t11 = space();
    			p3 = element("p");
    			p3.textContent = "与之前的神经网络相似，CNN也是从输入中找到具有代表性的特征，从而能够区分不同的图片类型，只不过它的网络会更加复杂一些，也多了一些特殊的层，总的来说它有以下几种关键构造：";
    			t13 = space();
    			ol = element("ol");
    			li0 = element("li");
    			strong3 = element("strong");
    			strong3.textContent = "输入：";
    			t15 = text(" 之前网络的输入往往是一组代表不同特征的数字，而在计算机中我们往往使用一个m×n的矩阵来代表一张图片，在CNN中便是已这个矩阵作为输入。");
    			t16 = space();
    			li1 = element("li");
    			strong4 = element("strong");
    			strong4.textContent = "神经元：";
    			t18 = text(" 与普通的神经网络相似，每个神经元都代表了前一层的输出通过一次函数计算得到的一个新的代表隐含的特征的值。");
    			t19 = space();
    			li2 = element("li");
    			strong5 = element("strong");
    			strong5.textContent = "层：";
    			t21 = text(" 每次使用相同的操作处理一组神经元，得到一组新的神经元的这个操作阶段叫做一层。");
    			t22 = space();
    			li3 = element("li");
    			strong6 = element("strong");
    			strong6.textContent = "内核权重和偏差：";
    			t24 = text("如图神经网络一样，在CNN中也是通过将输入与内核权重及偏差做函数计算来得到新的输出。");
    			t25 = space();
    			h31 = element("h3");
    			h31.textContent = "CNN中不同层的作用";
    			t27 = space();
    			h40 = element("h4");
    			h40.textContent = "输入层";
    			t29 = space();
    			p4 = element("p");
    			p4.textContent = "输入层（最左边的层）代表输入到CNN中的图像。因为我们使用RGB图像作为输入，所以输入层具有三个通道，分别对应于该层中显示的红色，绿色和蓝色通道。";
    			t31 = space();
    			h41 = element("h4");
    			h41.textContent = "卷积层";
    			t33 = space();
    			p5 = element("p");
    			p5.textContent = "卷积层是CNN的基础，因为它们包含可学习的内核（权重），这些内核提取出可将不同图像彼此区分开的特征-这就是我们想要的分类";
    			t35 = space();
    			p6 = element("p");
    			p6.textContent = "如图1所示卷积过程是将内核中的参数与输入中对应大小的参数一一对应进行相乘再求和后得到一个对应该输入位置的结果，通过滑动改变内核相对应的位置，来得到右侧的输出。";
    			t37 = space();
    			div2 = element("div");
    			img = element("img");
    			t38 = space();
    			div1 = element("div");
    			div1.textContent = "图1:卷积层的计算过程。一个3×3的卷积核，通过在左侧滑动位置，逐个计算出对应位置的结果，最终得到右侧的输出。";
    			t40 = space();
    			h42 = element("h4");
    			h42.textContent = "池化层";
    			t42 = space();
    			p7 = element("p");
    			p7.textContent = "在不同的CNN架构中，池化层的类型很多，但是它们的目的都是要逐渐减小网络的空间范围，从而减少网络的参数和总体计算。";
    			t44 = space();
    			p8 = element("p");
    			p8.textContent = "最大池操作需要在体系结构设计期间选择内核大小和步幅长度。选择后，该操作将以指定的步幅在输入上滑动内核，同时仅从输入中选择每个内核切片上的最大值以产生输出值。";
    			t46 = space();
    			h43 = element("h4");
    			h43.textContent = "Softmax函数";
    			t48 = space();
    			p9 = element("p");
    			p9.textContent = "softmax操作的主要作用是：确保CNN输出总和为1。因此，softmax操作可用于将模型输出缩放为概率。";
    			t50 = space();
    			h44 = element("h4");
    			h44.textContent = "尝试一下";
    			t52 = space();
    			p10 = element("p");
    			p10.textContent = "通过学习卷积网络的基本概念，你了解到CNN通过卷积层从图像中提取出局部特征，从而能够让网络学会“看”图。比起之前使用的网络需要提供人工选定的特征，CNN只需要输入一张图片，这无疑减少了许多的前期准备的工作量。";
    			t54 = space();
    			p11 = element("p");
    			p11.textContent = "CNN的优势及其它的独特之处使你对它的原理构造更加的感兴趣了。经过一番努力之后，你终于实现了一个简单的CNN来用于分类鸢尾花的种类。而现在有三个不同品种的鸢尾花图像测试样本，来看看CNN是如何分辨出它是哪一个品种的鸢尾花的吧！";
    			add_location(strong0, file$j, 76, 22, 1197);
    			attr_dev(h2, "class", "svelte-15r57m9");
    			add_location(h2, file$j, 76, 18, 1193);
    			attr_dev(div0, "id", "One");
    			attr_dev(div0, "class", "svelte-15r57m9");
    			add_location(div0, file$j, 76, 4, 1179);
    			add_location(strong1, file$j, 78, 8, 1259);
    			attr_dev(p0, "class", "svelte-15r57m9");
    			add_location(p0, file$j, 77, 4, 1246);
    			add_location(strong2, file$j, 85, 8, 1568);
    			attr_dev(p1, "class", "svelte-15r57m9");
    			add_location(p1, file$j, 84, 6, 1555);
    			attr_dev(h30, "class", "svelte-15r57m9");
    			add_location(h30, file$j, 89, 4, 1725);
    			add_location(em, file$j, 91, 80, 1835);
    			attr_dev(p2, "class", "svelte-15r57m9");
    			add_location(p2, file$j, 90, 4, 1750);
    			attr_dev(p3, "class", "svelte-15r57m9");
    			add_location(p3, file$j, 93, 3, 1892);
    			add_location(strong3, file$j, 97, 8, 2014);
    			attr_dev(li0, "class", "svelte-15r57m9");
    			add_location(li0, file$j, 97, 4, 2010);
    			add_location(strong4, file$j, 98, 8, 2117);
    			attr_dev(li1, "class", "svelte-15r57m9");
    			add_location(li1, file$j, 98, 4, 2113);
    			add_location(strong5, file$j, 99, 8, 2205);
    			attr_dev(li2, "class", "svelte-15r57m9");
    			add_location(li2, file$j, 99, 4, 2201);
    			add_location(strong6, file$j, 100, 8, 2278);
    			attr_dev(li3, "class", "svelte-15r57m9");
    			add_location(li3, file$j, 100, 4, 2274);
    			attr_dev(ol, "class", "svelte-15r57m9");
    			add_location(ol, file$j, 96, 3, 2000);
    			attr_dev(h31, "class", "svelte-15r57m9");
    			add_location(h31, file$j, 103, 6, 2372);
    			attr_dev(h40, "id", "article-input");
    			attr_dev(h40, "class", "svelte-15r57m9");
    			add_location(h40, file$j, 104, 6, 2399);
    			attr_dev(p4, "class", "svelte-15r57m9");
    			add_location(p4, file$j, 105, 6, 2439);
    			attr_dev(h41, "id", "article-convolution");
    			attr_dev(h41, "class", "svelte-15r57m9");
    			add_location(h41, file$j, 108, 6, 2543);
    			attr_dev(p5, "class", "svelte-15r57m9");
    			add_location(p5, file$j, 109, 6, 2589);
    			attr_dev(p6, "class", "svelte-15r57m9");
    			add_location(p6, file$j, 112, 6, 2680);
    			if (img.src !== (img_src_value = "/assets/figures/convolution.gif")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "clicking on topmost first conv. layer activation map");
    			attr_dev(img, "class", "svelte-15r57m9");
    			add_location(img, file$j, 116, 6, 2818);
    			attr_dev(div1, "class", "figure-caption svelte-15r57m9");
    			add_location(div1, file$j, 117, 6, 2940);
    			attr_dev(div2, "class", "figure svelte-15r57m9");
    			add_location(div2, file$j, 115, 4, 2790);
    			attr_dev(h42, "id", "article-pooling");
    			attr_dev(h42, "class", "svelte-15r57m9");
    			add_location(h42, file$j, 122, 4, 3067);
    			attr_dev(p7, "class", "svelte-15r57m9");
    			add_location(p7, file$j, 123, 4, 3106);
    			attr_dev(p8, "class", "svelte-15r57m9");
    			add_location(p8, file$j, 126, 4, 3190);
    			attr_dev(h43, "id", "article-softmax");
    			attr_dev(h43, "class", "svelte-15r57m9");
    			add_location(h43, file$j, 130, 4, 3298);
    			attr_dev(p9, "class", "svelte-15r57m9");
    			add_location(p9, file$j, 131, 4, 3343);
    			attr_dev(h44, "id", "try");
    			attr_dev(h44, "class", "svelte-15r57m9");
    			add_location(h44, file$j, 135, 4, 3426);
    			attr_dev(p10, "class", "svelte-15r57m9");
    			add_location(p10, file$j, 136, 4, 3454);
    			attr_dev(p11, "class", "svelte-15r57m9");
    			add_location(p11, file$j, 139, 4, 3585);
    			attr_dev(div3, "id", "description");
    			attr_dev(div3, "class", "svelte-15r57m9");
    			add_location(div3, file$j, 75, 2, 1151);
    			add_location(body, file$j, 74, 0, 1141);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h2);
    			append_dev(h2, strong0);
    			append_dev(div3, t1);
    			append_dev(div3, p0);
    			append_dev(p0, strong1);
    			append_dev(div3, t3);
    			append_dev(div3, p1);
    			append_dev(p1, strong2);
    			append_dev(div3, t5);
    			append_dev(div3, h30);
    			append_dev(div3, t7);
    			append_dev(div3, p2);
    			append_dev(p2, t8);
    			append_dev(p2, em);
    			append_dev(p2, t10);
    			append_dev(div3, t11);
    			append_dev(div3, p3);
    			append_dev(div3, t13);
    			append_dev(div3, ol);
    			append_dev(ol, li0);
    			append_dev(li0, strong3);
    			append_dev(li0, t15);
    			append_dev(ol, t16);
    			append_dev(ol, li1);
    			append_dev(li1, strong4);
    			append_dev(li1, t18);
    			append_dev(ol, t19);
    			append_dev(ol, li2);
    			append_dev(li2, strong5);
    			append_dev(li2, t21);
    			append_dev(ol, t22);
    			append_dev(ol, li3);
    			append_dev(li3, strong6);
    			append_dev(li3, t24);
    			append_dev(div3, t25);
    			append_dev(div3, h31);
    			append_dev(div3, t27);
    			append_dev(div3, h40);
    			append_dev(div3, t29);
    			append_dev(div3, p4);
    			append_dev(div3, t31);
    			append_dev(div3, h41);
    			append_dev(div3, t33);
    			append_dev(div3, p5);
    			append_dev(div3, t35);
    			append_dev(div3, p6);
    			append_dev(div3, t37);
    			append_dev(div3, div2);
    			append_dev(div2, img);
    			append_dev(div2, t38);
    			append_dev(div2, div1);
    			append_dev(div3, t40);
    			append_dev(div3, h42);
    			append_dev(div3, t42);
    			append_dev(div3, p7);
    			append_dev(div3, t44);
    			append_dev(div3, p8);
    			append_dev(div3, t46);
    			append_dev(div3, h43);
    			append_dev(div3, t48);
    			append_dev(div3, p9);
    			append_dev(div3, t50);
    			append_dev(div3, h44);
    			append_dev(div3, t52);
    			append_dev(div3, p10);
    			append_dev(div3, t54);
    			append_dev(div3, p11);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
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

    function instance$k($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Article> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Article", $$slots, []);
    	return [];
    }

    class Article$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Article",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src\views\Explainer.svelte generated by Svelte v3.24.0 */
    const file$k = "src\\views\\Explainer.svelte";

    function create_fragment$l(ctx) {
    	let div0;
    	let article;
    	let t0;
    	let div1;
    	let overview;
    	let t1;
    	let footer;
    	let p0;
    	let t3;
    	let div2;
    	let p1;
    	let t5;
    	let a;
    	let ion_icon;
    	let link_action;
    	let current;
    	let mounted;
    	let dispose;
    	article = new Article$1({ $$inline: true });
    	overview = new Overview({ $$inline: true });

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(article.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			create_component(overview.$$.fragment);
    			t1 = space();
    			footer = element("footer");
    			p0 = element("p");
    			p0.textContent = "扩展与补充";
    			t3 = space();
    			div2 = element("div");
    			p1 = element("p");
    			p1.textContent = "CNN除了能够进行图像分类任务之外，还能够用于图像分割、目标检测等一些更加复杂的任务。同时，由于它的参数共享机制，使得相比于神经网络而已有着更少的网络参数量。在研究者们的努力之下，各种更新更有效的网络设计以及卷积方式得以被提出。CNN还有许多有趣的地方等待着你的探索。";
    			t5 = space();
    			a = element("a");
    			ion_icon = element("ion-icon");
    			attr_dev(div0, "id", "article");
    			attr_dev(div0, "class", "svelte-1uam8oe");
    			add_location(div0, file$k, 68, 0, 1444);
    			attr_dev(div1, "id", "explainer");
    			attr_dev(div1, "class", "svelte-1uam8oe");
    			add_location(div1, file$k, 71, 0, 1487);
    			attr_dev(p0, "class", "title svelte-1uam8oe");
    			add_location(p0, file$k, 75, 4, 1557);
    			attr_dev(p1, "class", "svelte-1uam8oe");
    			add_location(p1, file$k, 77, 6, 1619);
    			attr_dev(div2, "class", "addition");
    			add_location(div2, file$k, 76, 4, 1589);
    			set_custom_element_data(ion_icon, "class", "return svelte-1uam8oe");
    			set_custom_element_data(ion_icon, "name", "arrow-back-circle-outline");
    			set_custom_element_data(ion_icon, "size", "large");
    			add_location(ion_icon, file$k, 80, 8, 1828);
    			attr_dev(a, "href", "/home");
    			attr_dev(a, "rel", "prefetch");
    			add_location(a, file$k, 79, 4, 1778);
    			attr_dev(footer, "id", "foot");
    			attr_dev(footer, "class", "svelte-1uam8oe");
    			add_location(footer, file$k, 74, 0, 1533);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(article, div0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(overview, div1, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, footer, anchor);
    			append_dev(footer, p0);
    			append_dev(footer, t3);
    			append_dev(footer, div2);
    			append_dev(div2, p1);
    			append_dev(footer, t5);
    			append_dev(footer, a);
    			append_dev(a, ion_icon);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(link_action = link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(article.$$.fragment, local);
    			transition_in(overview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(article.$$.fragment, local);
    			transition_out(overview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(article);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			destroy_component(overview);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(footer);
    			mounted = false;
    			dispose();
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
    	const View = {
    		OVERVIEW: "overview",
    		LAYERVIEW: "layerview",
    		DETAILVIEW: "detailview"
    	};

    	let mainView = View.OVERVIEW;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Explainer> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Explainer", $$slots, []);

    	$$self.$capture_state = () => ({
    		Overview,
    		Article: Article$1,
    		cnnStore,
    		link,
    		View,
    		mainView
    	});

    	$$self.$inject_state = $$props => {
    		if ("mainView" in $$props) mainView = $$props.mainView;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class Explainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Explainer",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src\views\startpage.svelte generated by Svelte v3.24.0 */
    const file$l = "src\\views\\startpage.svelte";

    function create_fragment$m(ctx) {
    	let div1;
    	let main;
    	let div0;
    	let h1;
    	let t1;
    	let p;
    	let t3;
    	let button;
    	let a0;
    	let link_action;
    	let t5;
    	let footer;
    	let small;
    	let t7;
    	let ul;
    	let li0;
    	let a1;
    	let ion_icon0;
    	let t8;
    	let li1;
    	let a2;
    	let ion_icon1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			main = element("main");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "UnboxAI";
    			t1 = space();
    			p = element("p");
    			p.textContent = "一个可视化的人工智能算法学习平台";
    			t3 = space();
    			button = element("button");
    			a0 = element("a");
    			a0.textContent = "Get Started";
    			t5 = space();
    			footer = element("footer");
    			small = element("small");
    			small.textContent = "Deecamp 2020.";
    			t7 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a1 = element("a");
    			ion_icon0 = element("ion-icon");
    			t8 = space();
    			li1 = element("li");
    			a2 = element("a");
    			ion_icon1 = element("ion-icon");
    			attr_dev(h1, "class", "svelte-7qw2wo");
    			add_location(h1, file$l, 142, 6, 2404);
    			attr_dev(p, "class", "svelte-7qw2wo");
    			add_location(p, file$l, 143, 6, 2428);
    			attr_dev(a0, "href", "/home");
    			attr_dev(a0, "rel", "prefetch");
    			attr_dev(a0, "class", "svelte-7qw2wo");
    			add_location(a0, file$l, 144, 34, 2487);
    			attr_dev(button, "class", "cta-contact svelte-7qw2wo");
    			add_location(button, file$l, 144, 6, 2459);
    			attr_dev(div0, "class", "svelte-7qw2wo");
    			add_location(div0, file$l, 141, 4, 2391);
    			attr_dev(main, "class", "page-main svelte-7qw2wo");
    			add_location(main, file$l, 140, 2, 2361);
    			attr_dev(small, "class", "svelte-7qw2wo");
    			add_location(small, file$l, 148, 4, 2612);
    			set_custom_element_data(ion_icon0, "name", "mail-outline");
    			set_custom_element_data(ion_icon0, "class", "svelte-7qw2wo");
    			add_location(ion_icon0, file$l, 152, 10, 2712);
    			attr_dev(a1, "href", "");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "class", "svelte-7qw2wo");
    			add_location(a1, file$l, 151, 8, 2673);
    			attr_dev(li0, "class", "svelte-7qw2wo");
    			add_location(li0, file$l, 150, 6, 2659);
    			set_custom_element_data(ion_icon1, "name", "logo-github");
    			set_custom_element_data(ion_icon1, "class", "svelte-7qw2wo");
    			add_location(ion_icon1, file$l, 157, 10, 2841);
    			attr_dev(a2, "href", "");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "class", "svelte-7qw2wo");
    			add_location(a2, file$l, 156, 8, 2802);
    			attr_dev(li1, "class", "svelte-7qw2wo");
    			add_location(li1, file$l, 155, 6, 2788);
    			attr_dev(ul, "class", "svelte-7qw2wo");
    			add_location(ul, file$l, 149, 4, 2647);
    			attr_dev(footer, "class", "page-footer svelte-7qw2wo");
    			add_location(footer, file$l, 147, 2, 2578);
    			attr_dev(div1, "class", "wrapper svelte-7qw2wo");
    			add_location(div1, file$l, 139, 0, 2336);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, main);
    			append_dev(main, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(div0, t3);
    			append_dev(div0, button);
    			append_dev(button, a0);
    			append_dev(div1, t5);
    			append_dev(div1, footer);
    			append_dev(footer, small);
    			append_dev(footer, t7);
    			append_dev(footer, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a1);
    			append_dev(a1, ion_icon0);
    			append_dev(ul, t8);
    			append_dev(ul, li1);
    			append_dev(li1, a2);
    			append_dev(a2, ion_icon1);

    			if (!mounted) {
    				dispose = action_destroyer(link_action = link.call(null, a0));
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
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
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Startpage> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Startpage", $$slots, []);
    	$$self.$capture_state = () => ({ link });
    	return [];
    }

    class Startpage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Startpage",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    const routes = {
      '/': Startpage,
      '/home': Home2,
      '/cnn': Explainer,
      '/knn': Knn,
      '/tree': Tree,
      '/old': Home
    };

    /* src\App.svelte generated by Svelte v3.24.0 */
    const file$m = "src\\App.svelte";

    function create_fragment$n(ctx) {
    	let div2;
    	let div0;
    	let a;
    	let link_action;
    	let t1;
    	let div1;
    	let router;
    	let current;
    	let mounted;
    	let dispose;
    	router = new Router({ props: { routes }, $$inline: true });

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			a = element("a");
    			a.textContent = "UnboxAI";
    			t1 = space();
    			div1 = element("div");
    			create_component(router.$$.fragment);
    			attr_dev(a, "href", "/");
    			attr_dev(a, "rel", "prefetch");
    			set_style(a, "font-size", "50px");
    			attr_dev(a, "class", "svelte-1ifm5rx");
    			add_location(a, file$m, 42, 4, 945);
    			attr_dev(div0, "class", "page_header svelte-1ifm5rx");
    			add_location(div0, file$m, 41, 2, 914);
    			attr_dev(div1, "class", "content svelte-1ifm5rx");
    			add_location(div1, file$m, 60, 2, 1410);
    			attr_dev(div2, "id", "app-page");
    			attr_dev(div2, "class", "svelte-1ifm5rx");
    			add_location(div2, file$m, 40, 0, 891);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, a);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			mount_component(router, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(link_action = link.call(null, a));
    				mounted = true;
    			}
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
    			if (detaching) detach_dev(div2);
    			destroy_component(router);
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

    function instance$n($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	$$self.$capture_state = () => ({ Router, link, routes });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
      props: {}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
