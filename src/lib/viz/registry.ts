// Interactive algorithm visualizations, addressed by id from Section.viz.
// Add a component here and reference it as `viz: '<id>'` in content.
import GraphTraversal from './GraphTraversal.svelte';
import GraphTypes from './GraphTypes.svelte';
import DijkstraShortestPath from './DijkstraShortestPath.svelte';
import ActivitySelectionTimeline from './ActivitySelectionTimeline.svelte';
import FractionalKnapsackFill from './FractionalKnapsackFill.svelte';
import HuffmanTreeBuild from './HuffmanTreeBuild.svelte';
import KnapsackDpTable from './KnapsackDpTable.svelte';
import LevenshteinTable from './LevenshteinTable.svelte';
import DynamicArrayDoubling from './DynamicArrayDoubling.svelte';
import BinaryCounterIncrement from './BinaryCounterIncrement.svelte';
import UnionFindForest from './UnionFindForest.svelte';
import KruskalMst from './KruskalMst.svelte';
import PrimMstCut from './PrimMstCut.svelte';
import BstInsertDegenerate from './BstInsertDegenerate.svelte';
import RbInsertFixup from './RbInsertFixup.svelte';
import KdtreeBuildQuery from './KdtreeBuildQuery.svelte';
import FordFulkersonResidual from './FordFulkersonResidual.svelte';
import AdjacencyListVsMatrix from './AdjacencyListVsMatrix.svelte';
import TopologicalSortDfs from './TopologicalSortDfs.svelte';
import BellmanFordWaves from './BellmanFordWaves.svelte';
import AstarVsDijkstra from './AstarVsDijkstra.svelte';
import FibRecursionMemo from './FibRecursionMemo.svelte';
import MemoVsTabulation from './MemoVsTabulation.svelte';
import GridPathsDp from './GridPathsDp.svelte';
import LcsTable from './LcsTable.svelte';
import LisBuild from './LisBuild.svelte';
import PerfectSquaresDp from './PerfectSquaresDp.svelte';
import AmortizationMethodsCompare from './AmortizationMethodsCompare.svelte';
import UnionByRank from './UnionByRank.svelte';
import TreeTraversals from './TreeTraversals.svelte';
import BstDeleteCases from './BstDeleteCases.svelte';
import TreeRotation from './TreeRotation.svelte';
import BtreeSplitInsert from './BtreeSplitInsert.svelte';
import OrderStatisticsTree from './OrderStatisticsTree.svelte';
import CosineVsEuclid from './CosineVsEuclid.svelte';
import MaxflowMincut from './MaxflowMincut.svelte';
import DinicLayered from './DinicLayered.svelte';
import HeapKinds from './HeapKinds.svelte';
import FibonacciHeap from './FibonacciHeap.svelte';
import PqComparison from './PqComparison.svelte';
import BinaryHeapArray from './BinaryHeapArray.svelte';
import SegmentTree from './SegmentTree.svelte';
import VebTree from './VebTree.svelte';
import NumpyVectorization from './NumpyVectorization.svelte';
import NumpyListVsNdarray from './NumpyListVsNdarray.svelte';
import NumpyDtypeTable from './NumpyDtypeTable.svelte';
import LpFeasibleRegion from './LpFeasibleRegion.svelte';
import CrossProductOrientation from './CrossProductOrientation.svelte';
import SegmentIntersection from './SegmentIntersection.svelte';
import ConvexHull from './ConvexHull.svelte';
import RbDeleteFixup from './RbDeleteFixup.svelte';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const vizRegistry: Record<string, any> = {
	'graph-traversal': GraphTraversal,
	'graph-types-gallery': GraphTypes,
	'dijkstra-shortest-path': DijkstraShortestPath,
	'activity-selection-timeline': ActivitySelectionTimeline,
	'fractional-knapsack-fill': FractionalKnapsackFill,
	'huffman-tree-build': HuffmanTreeBuild,
	'knapsack-dp-table': KnapsackDpTable,
	'levenshtein-table': LevenshteinTable,
	'dynamic-array-doubling': DynamicArrayDoubling,
	'binary-counter-increment': BinaryCounterIncrement,
	'union-find-forest': UnionFindForest,
	'kruskal-mst': KruskalMst,
	'prim-mst-cut': PrimMstCut,
	'bst-insert-degenerate': BstInsertDegenerate,
	'rb-insert-fixup': RbInsertFixup,
	'kdtree-build-query': KdtreeBuildQuery,
	'fordfulkerson-residual': FordFulkersonResidual,
	'adjacency-list-vs-matrix': AdjacencyListVsMatrix,
	'topological-sort-dfs': TopologicalSortDfs,
	'bellman-ford-waves': BellmanFordWaves,
	'astar-vs-dijkstra': AstarVsDijkstra,
	'fib-recursion-memo': FibRecursionMemo,
	'memo-vs-tabulation': MemoVsTabulation,
	'grid-paths-dp': GridPathsDp,
	'lcs-table': LcsTable,
	'lis-build': LisBuild,
	'perfect-squares-dp': PerfectSquaresDp,
	'amortization-methods-compare': AmortizationMethodsCompare,
	'union-by-rank': UnionByRank,
	'tree-traversals': TreeTraversals,
	'bst-delete-cases': BstDeleteCases,
	'tree-rotation': TreeRotation,
	'btree-split-insert': BtreeSplitInsert,
	'order-statistics-tree': OrderStatisticsTree,
	'cosine-vs-euclid': CosineVsEuclid,
	'maxflow-mincut': MaxflowMincut,
	'dinic-layered': DinicLayered,
	'heap-kinds': HeapKinds,
	'fibonacci-heap': FibonacciHeap,
	'pq-comparison': PqComparison,
	'binary-heap-array': BinaryHeapArray,
	'segment-tree': SegmentTree,
	'veb-tree': VebTree,
	'numpy-vectorization': NumpyVectorization,
	'numpy-list-vs-ndarray': NumpyListVsNdarray,
	'numpy-dtype-table': NumpyDtypeTable,
	'lp-feasible-region': LpFeasibleRegion,
	'cross-product-orientation': CrossProductOrientation,
	'segment-intersection': SegmentIntersection,
	'convex-hull': ConvexHull,
	'rb-delete-fixup': RbDeleteFixup
};
