<script>
import Break from "./Break.vue";
import Continue from "./Continue.vue";

const BREAK_MARKER = "BREAK";
const CONTINUE_MARKER = "CONTINUE";

function recursiveVisitor(stackFrame) {
    const stack = [];
    let result = null;

    stack.push(stackFrame);

    while (stack.length) {
        const { value: currentFrame, done } =
            stack[stack.length - 1].next(result);
        if (done) {
            stack.pop();
            result = currentFrame;
        } else {
            stack.push(currentFrame);
            result = null;
        }
    }

    return result;
}
function* truncateNodesIfMarkerFound(vnodes) {
    const newChildren = [];
    let markerFound = null;
    for (let i = 0; i < vnodes.length; i++) {
        const vnode = vnodes[i];

        if (vnode) {
            if (vnode.type === Break) {
                markerFound = BREAK_MARKER;
            }
            if (vnode.type === Continue) {
                markerFound = CONTINUE_MARKER;
            }

            if (markerFound) {
                break;
            }

            newChildren.push(vnode);

            if (vnode.type === ForComponent) {
                continue;
            }

            if (Array.isArray(vnode.children)) {
                const {
                    newChildren: newGrandChildren,
                    markerFound: childrenMarkerFound,
                } = yield truncateNodesIfMarkerFound(vnode.children);

                markerFound = childrenMarkerFound;

                if (markerFound) {
                    vnode.children = newGrandChildren;
                    break;
                }
            }
        }
    }

    return {
        newChildren,
        markerFound,
    };
}

const ForComponent = {
    props: {
        of: {
            required: true,
            type: Array,
        },
    },

    provide() {
        return {
            __depth: this.loopDepth,
        };
    },

    inject: {
        depth: {
            from: "__depth",
            default: 0,
        },
    },

    render() {
        const items = this.of;
        const renderedChildren = [];

        let i = 0;
        for (const item of items) {
            const children = this.$slots.default({
                item,
                $loop: this.loop(i),
            });

            if (Array.isArray(children)) {
                const { newChildren, markerFound } = recursiveVisitor(
                    truncateNodesIfMarkerFound(children)
                );

                renderedChildren.push(newChildren);

                if (markerFound === BREAK_MARKER) {
                    break;
                }
            } else {
                renderedChildren.push(children);
            }

            i++;
        }

        if (!renderedChildren.length && this.$slots.empty) {
            return this.$slots.empty();
        }

        return renderedChildren;
    },
    methods: {
        loop(index) {
            const count = this.of.length;
            const iteration = index + 1;
            const remaining = count - iteration;
            const first = iteration === 1;
            const last = iteration === count;
            const even = iteration % 2 === 0;
            const odd = !even;
            const depth = this.loopDepth;

            return {
                index,
                iteration,
                remaining,
                count,
                first,
                last,
                even,
                odd,
                depth,
            };
        },
    },
    computed: {
        loopDepth() {
            return this.depth + 1;
        },
    },
};

export default ForComponent;
</script>
