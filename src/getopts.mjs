/**
 * Read options from environment and CLI args.
 * @param {object} env
 * @param {string[]} argv
 */
export default function getopts(env, argv) {
    const args = argv.slice(2);

    switch (args.length) {
        case 0: throw new Error("missing database URL");
        case 1: throw new Error("missing query");
        case 2: break;
        default: throw new Error(`unexpected argument: ${args[2]}`);
    }

    const [url, query] = args;
    return {url, query};
}
