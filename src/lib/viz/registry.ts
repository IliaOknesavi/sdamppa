// Interactive algorithm visualizations, addressed by id from Section.viz.
// Add a component here and reference it as `viz: '<id>'` in content.
import GraphTraversal from './GraphTraversal.svelte';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const vizRegistry: Record<string, any> = {
	'graph-traversal': GraphTraversal
};
