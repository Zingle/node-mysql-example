/**
 * Wrap and execute async function and exit on error.
 * @param {function} fn
 */
export default function run(fn) {
    fn().catch(err => {
        console.error(err.message);
        if (process.env.DEBUG) console.error(err.stack);
        process.exit(1);
    });
}
