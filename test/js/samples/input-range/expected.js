import {
	SvelteComponent,
	attr,
	detach,
	element,
	init,
	insert,
	listen,
	noop,
	run_all,
	safe_not_equal,
	set_input_value,
	to_number
} from "svelte/internal";

function create_fragment(ctx) {
	let input;
	let dispose;

	return {
		c() {
			input = element("input");
			attr(input, "type", "range");

			dispose = [
				listen(input, "change", ctx.input_change_input_handler),
				listen(input, "input", ctx.input_change_input_handler)
			];
		},
		m(target, anchor) {
			insert(target, input, anchor);
			set_input_value(input, ctx.value);
		},
		p(changed, ctx) {
			if (changed.value) {
				set_input_value(input, ctx.value);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(input);
			run_all(dispose);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { value } = $$props;

	function input_change_input_handler() {
		value = to_number(this.value);
		$$invalidate("value", value);
	}

	$$self.$set = $$props => {
		if ("value" in $$props) $$invalidate("value", value = $$props.value);
	};

	return { value, input_change_input_handler };
}

class Component extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { value: 0 });
	}
}

export default Component;