import connect from "./connect.mjs";
import getopts from "./getopts.mjs";
import run from "./run.mjs";

run(async () => {
    const {url, query} = getopts(process.env, process.argv);
    const select = await connect(url);

    for await (const result of select(query)) {
        console.log(JSON.stringify(result));
    }

    select.close();
});
