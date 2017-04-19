import deindent from '../../../../utils/deindent.js';
import flattenReference from '../../../../utils/flattenReference.js';
import getSetter from '../shared/binding/getSetter.js';

export default function visitBinding ( generator, block, state, node, attribute, local ) {
	const { name } = flattenReference( attribute.value );
	const { snippet, contexts, dependencies } = block.contextualise( attribute.value );

	if ( dependencies.length > 1 ) throw new Error( 'An unexpected situation arose. Please raise an issue at https://github.com/sveltejs/svelte/issues — thanks!' );

	contexts.forEach( context => {
		if ( !~local.allUsedContexts.indexOf( context ) ) local.allUsedContexts.push( context );
	});

	const contextual = block.contexts.has( name );

	let obj;
	let prop;

	if ( contextual ) {
		obj = block.listNames.get( name );
		prop = block.indexNames.get( name );
	} else if ( attribute.value.type === 'MemberExpression' ) {
		prop = `'[✂${attribute.value.property.start}-${attribute.value.property.end}✂]'`;
		obj = `[✂${attribute.value.object.start}-${attribute.value.object.end}✂]`;
	} else {
		obj = 'root';
		prop = `'${name}'`;
	}

	local.bindings.push({
		name: attribute.name,
		value: snippet,
		obj,
		prop
	});

	const setter = getSetter({ block, name, context: '_context', attribute, dependencies, value: 'value' });

	generator.hasComplexBindings = true;

	const updating = block.getUniqueName( `${local.name}_updating` );
	block.addVariable( updating, 'false' );

	local.create.addBlock( deindent`
		${block.component}._bindings.push( function () {
			if ( ${local.name}._torndown ) return;
			${local.name}.observe( '${attribute.name}', function ( value ) {
				if ( ${updating} ) return;
				${updating} = true;
				${setter}
				${updating} = false;
			}, { init: ${generator.helper( 'differs' )}( ${local.name}.get( '${attribute.name}' ), ${snippet} ) });
		});
	` );

	local.update.addBlock( deindent`
		if ( !${updating} && ${dependencies.map( dependency => `'${dependency}' in changed` ).join( '||' )} ) {
			${updating} = true;
			${local.name}._set({ ${attribute.name}: ${snippet} });
			${updating} = false;
		}
	` );
}