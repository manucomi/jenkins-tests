export default function (arr, finalSeparator = 'and') {
    if (arr.length <= 1) {
        return arr[0] || '';
    }
    if (arr.length === 2) {
        return `${arr[0]} ${finalSeparator} ${arr[1]}`;
    }

    return `${arr.slice(0, -1).join(', ')}, ${finalSeparator} ${
        arr[arr.length - 1]
    }`;
}
