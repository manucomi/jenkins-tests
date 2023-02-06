/**
 * This was copied from an NPM package and modified. Object.hasOwn was replaced
 * because it doesn't appear to be compatible in Chromatic or with node < 16.9.0.
 *
 * GitHub: https://github.com/prantlf/storybook-multilevel-sort
 */

const hasKey = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
const compareAlphabetical = (a, b) => a.localeCompare(b, { numeric: true });

const compareStoryPaths = (order, path1, path2) => {
    /* c8 ignore next 9 */
    if (path1.length === 0 && path2.length === 0) {
        return 0;
    }
    if (path1.length === 0 && path2.length > 0) {
        // Path1 must be an ancestor of path2
        return -1;
    }
    if (path1.length > 0 && path2.length === 0) {
        // Path2 must be an ancestor of path1
        return 1;
    }

    const [path1Head, ...path1Tail] = path1;
    const [path2Head, ...path2Tail] = path2;

    if (!order) {
        // No reference order, so just sort alphabetically
        const comp = compareAlphabetical(path1Head, path2Head);
        if (comp === 0) {
            return compareStoryPaths(null, path1Tail, path2Tail);
        }
        return comp;
    }

    if (path1Head === path2Head) {
        // The two paths share the same head; try either the key for the head, or the
        // wildcard key, otherwise pass `undefined` to sort without an explicit order
        return compareStoryPaths(
            order[path1Head] || order['*'],
            path1Tail,
            path2Tail
        );
    }

    if (hasKey(order, path1Head) && hasKey(order, path2Head)) {
        // If both heads are in the reference order, use the ordering of the keys in the reference order
        const orderKeys = Object.keys(order);

        return orderKeys.indexOf(path1Head) < orderKeys.indexOf(path2Head)
            ? -1
            : 1;
    }
    if (hasKey(order, path1Head) && !hasKey(order, path2Head)) {
        return -1; // Give preference to path1, since it is included in the reference order
    }
    if (!hasKey(order, path1Head) && hasKey(order, path2Head)) {
        return 1; // Give preference to path2, since it is included in the reference order
    }
    // No explicit order for the path heads was found, try the wildcard key,
    // otherwise pass `undefined` to sort without an explicit order
    return compareStoryPaths(order['*'], path1, path2);
};

export default (order, [, story1], [, story2]) => {
    const story1Path = [...story1.kind.split('/'), story1.name].map((key) =>
        key.toLowerCase()
    );
    const story2Path = [...story2.kind.split('/'), story2.name].map((key) =>
        key.toLowerCase()
    );

    return compareStoryPaths(order, story1Path, story2Path);
};
