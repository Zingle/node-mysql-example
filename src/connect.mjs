import mysql from "mysql";

/**
 * Connect to database and return select function to query DB.
 * @param {URL} url
 * @returns {function}
 */
export default async function connect(url) {
    if (!/^mysql:/.test(url)) {
        throw new Error("expected URL in mysql scheme");
    }

    const connection = mysql.createConnection(url);
    select.close = close;
    return select;

    function close() {
        connection.destroy();
    }

    async function *select(query) {
        const stream = connection.query(query).stream({highWaterMark: 5});
        yield* iterate(stream);
    }
}

/**
 * Iterate over a readable stream.
 * @param {Readable} stream
 * @returns {function}
 */
async function *iterate(stream) {
    const readable = sync();        // gets released when stream is readable
    const data = sync();            // gets released when stream emits chunk
    const chunks = [];              // buffer of emitted chunks
    let end = false;                // gets set when stream ends

    stream.on("readable", () => readable.resolve());
    stream.on("error", err => { readable.reject(err); data.reject(err); });

    await readable.wait();

    stream.on("data", chunk => { chunks.push(chunk); data.resolve(); });
    stream.on("end", () => end = true);

    while (!end) {                  // terminates when stream ends
        await data.wait();          // multiple chunks may only resolve once
        while (chunks.length) {     // so iterate over chunks buffer
            yield chunks.shift();   // and yield chunks
        }
    }
}

/**
 * Create synchronization primitive.
 * @param {boolean} [queue]
 * @returns {object}
 */
function sync() {
    let promise, resolve, reject;

    return {
        async wait() {
            promise = promise || new Promise((a, b) => [resolve, reject] = [a, b]);
            const result = await promise;
            return result;
        },
        resolve(result) {
            if (resolve) resolve(result);
            promise = resolve = reject = undefined;
        },
        reject(err) {
            if (reject) reject(err);
            promise = resolve = reject = undefined;
        }
    }
}
