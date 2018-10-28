/* generated by Svelte vX.Y.Z */
import { assign, createElement, detachNode, init, insert, proto, setStyle } from "svelte/shared.js";

function create_main_fragment(component, ctx) {
	var div;

	return {
		c() {
			div = createElement("div");
			setStyle(div, "color", ctx.color);
			setStyle(div, "transform", "translate(" + ctx.x + "px," + ctx.y + "px)");
		},

		m(target, anchor) {
			insert(target, div, anchor);
		},

		p(changed, ctx) {
			if (changed.color) {
				setStyle(div, "color", ctx.color);
			}

			if (changed.x || changed.y) {
				setStyle(div, "transform", "translate(" + ctx.x + "px," + ctx.y + "px)");
			}
		},

		d(detach) {
			if (detach) {
				detachNode(div);
			}
		}
	};
}

function SvelteComponent(options) {
	init(this, options);
	this._state = assign({}, options.data);
	this._intro = true;

	this._fragment = create_main_fragment(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(SvelteComponent.prototype, proto);
export default SvelteComponent;