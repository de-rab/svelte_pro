import {
	SvelteComponent,
	add_render_callback,
	add_resize_listener,
	detach,
	element,
	init,
	insert,
	noop,
	safe_not_equal
} from "svelte/internal";

function create_fragment(ctx) {
	let div;
	let div_resize_listener;

	return {
		c() {
			div = element("div");
			div.textContent = "some content";
			add_render_callback(() => ctx.div_resize_handler.call(div));
		},
		m(target, anchor) {
			insert(target, div, anchor);
			div_resize_listener = add_resize_listener(div, ctx.div_resize_handler.bind(div));
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			div_resize_listener.cancel();
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { w } = $$props;
	let { h } = $$props;

	function div_resize_handler() {
		w = this.offsetWidth;
		h = this.offsetHeight;
		$$invalidate("w", w);
		$$invalidate("h", h);
	}

	$$self.$set = $$props => {
		if ("w" in $$props) $$invalidate("w", w = $$props.w);
		if ("h" in $$props) $$invalidate("h", h = $$props.h);
	};

	return { w, h, div_resize_handler };
}

class Component extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { w: 0, h: 0 });
	}
}

export default Component;