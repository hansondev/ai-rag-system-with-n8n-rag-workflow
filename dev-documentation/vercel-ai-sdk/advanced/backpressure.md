---
title: "Stream Back-pressure and Cancellation"
source_url: https://ai-sdk.dev/docs/advanced/backpressure
section: advanced
crawled: 2026-09-20
---

# Stream Back-pressure and Cancellation

> Source: https://ai-sdk.dev/docs/advanced/backpressure

[Advanced](/docs/advanced)Backpressure


[Stream Back-pressure and Cancellation](#stream-back-pressure-and-cancellation)
===============================================================================

This page focuses on understanding back-pressure and cancellation when working with streams. You do not need to know this information to use the AI SDK, but for those interested, it offers a deeper dive on why and how the SDK optimally streams responses.

In the following sections, we'll explore back-pressure and cancellation in the context of a simple example program. We'll discuss the issues that can arise from an eager approach and demonstrate how a lazy approach can resolve them.

[Back-pressure and Cancellation with Streams](#back-pressure-and-cancellation-with-streams)
-------------------------------------------------------------------------------------------

Let's begin by setting up a simple example program:

```
1

// A generator that will yield positive integers



2

async function* integers() {



3

let i = 1;



4

while (true) {



5

console.log(`yielding ${i}`);



6

yield i++;



7



8

await sleep(100);



9

}



10

}



11

function sleep(ms) {



12

return new Promise(resolve => setTimeout(resolve, ms));



13

}



14



15

// Wraps a generator into a ReadableStream



16

function createStream(iterator) {



17

return new ReadableStream({



18

async start(controller) {



19

for await (const v of iterator) {



20

controller.enqueue(v);



21

}



22

controller.close();



23

},



24

});



25

}



26



27

// Collect data from stream



28

async function run() {



29

// Set up a stream of integers



30

const stream = createStream(integers());



31



32

// Read values from our stream



33

const reader = stream.getReader();



34

for (let i = 0; i < 10_000; i++) {



35

// we know our stream is infinite, so there's no need to check `done`.



36

const { value } = await reader.read();



37

console.log(`read ${value}`);



38



39

await sleep(1_000);



40

}



41

}



42

run();
```

In this example, we create an async-generator that yields positive integers, a `ReadableStream` that wraps our integer generator, and a reader which will read values out of our stream. Notice, too, that our integer generator logs out `"yielding ${i}"`, and our reader logs out `"read ${value}"`. Both take an arbitrary amount of time to process data, represented with a 100ms sleep in our generator, and a 1sec sleep in our reader.

[Back-pressure](#back-pressure)
-------------------------------

If you were to run this program, you'd notice something funny. We'll see roughly 10 "yield" logs for every "read" log. This might seem obvious, the generator can push values 10x faster than the reader can pull them out. But it represents a problem, our `stream` has to maintain an ever expanding queue of items that have been pushed in but not pulled out.

The problem stems from the way we wrap our generator into a stream. Notice the use of `for await (…)` inside our `start` handler. This is an **eager** for-loop, and it is constantly running to get the next value from our generator to be enqueued in our stream. This means our stream does not respect back-pressure, the signal from the consumer to the producer that more values aren't needed *yet*. We've essentially spawned a thread that will perpetually push more data into the stream, one that runs as fast as possible to push new data immediately. Worse, there's no way to signal to this thread to stop running when we don't need additional data.

To fix this, `ReadableStream` allows a `pull` handler. `pull` is called every time the consumer attempts to read more data from our stream (if there's no data already queued internally). But it's not enough to just move the `for await(…)` into `pull`, we also need to convert from an eager enqueuing to a **lazy** one. By making these 2 changes, we'll be able to react to the consumer. If they need more data, we can easily produce it, and if they don't, then we don't need to spend any time doing unnecessary work.

```
1

function createStream(iterator) {



2

return new ReadableStream({



3

async pull(controller) {



4

const { value, done } = await iterator.next();



5



6

if (done) {



7

controller.close();



8

} else {



9

controller.enqueue(value);



10

}



11

},



12

});



13

}
```

Our `createStream` is a little more verbose now, but the new code is important. First, we need to manually call our `iterator.next()` method. This returns a `Promise` for an object with the type signature `{ done: boolean, value: T }`. If `done` is `true`, then we know that our iterator won't yield any more values and we must `close` the stream (this allows the consumer to know that the stream is also finished producing values). Else, we need to `enqueue` our newly produced value.

When we run this program, we see that our "yield" and "read" logs are now paired. We're no longer yielding 10x integers for every read! And, our stream now only needs to maintain 1 item in its internal buffer. We've essentially given control to the consumer, so that it's responsible for producing new values as it needs it. Neato!

[Cancellation](#cancellation)
-----------------------------

Let's go back to our initial eager example, with 1 small edit. Now instead of reading 10,000 integers, we're only going to read 3:

```
1

// A generator that will yield positive integers



2

async function* integers() {



3

let i = 1;



4

while (true) {



5

console.log(`yielding ${i}`);



6

yield i++;



7



8

await sleep(100);



9

}



10

}



11

function sleep(ms) {



12

return new Promise(resolve => setTimeout(resolve, ms));



13

}



14



15

// Wraps a generator into a ReadableStream



16

function createStream(iterator) {



17

return new ReadableStream({



18

async start(controller) {



19

for await (const v of iterator) {



20

controller.enqueue(v);



21

}



22

controller.close();



23

},



24

});



25

}



26

// Collect data from stream



27

async function run() {



28

// Set up a stream that of integers



29

const stream = createStream(integers());



30



31

// Read values from our stream



32

const reader = stream.getReader();



33

// We're only reading 3 items this time:



34

for (let i = 0; i < 3; i++) {



35

// we know our stream is infinite, so there's no need to check `done`.



36

const { value } = await reader.read();



37

console.log(`read ${value}`);



38



39

await sleep(1000);



40

}



41

}



42

run();
```

We're back to yielding 10x the number of values read. But notice now, after we've read 3 values, we're continuing to yield new values. We know that our reader will never read another value, but our stream doesn't! The eager `for await (…)` will continue forever, loudly enqueuing new values into our stream's buffer and increasing our memory usage until it consumes all available program memory.

The fix to this is exactly the same: use `pull` and manual iteration. By producing values ***lazily***, we tie the lifetime of our integer generator to the lifetime of the reader. Once the reads stop, the yields will stop too:

```
1

// Wraps a generator into a ReadableStream



2

function createStream(iterator) {



3

return new ReadableStream({



4

async pull(controller) {



5

const { value, done } = await iterator.next();



6



7

if (done) {



8

controller.close();



9

} else {



10

controller.enqueue(value);



11

}



12

},



13

});



14

}
```

Since the solution is the same as implementing back-pressure, it shows that they're just 2 facets of the same problem: Pushing values into a stream should be done **lazily**, and doing it eagerly results in expected problems.

[Tying Stream Laziness to AI Responses](#tying-stream-laziness-to-ai-responses)
-------------------------------------------------------------------------------

Now let's imagine you're integrating AIBot service into your product. Users will be able to prompt "count from 1 to infinity", the browser will fetch your AI API endpoint, and your servers connect to AIBot to get a response. But "infinity" is, well, infinite. The response will never end!

After a few seconds, the user gets bored and navigates away. Or maybe you're doing local development and a hot-module reload refreshes your page. The browser will have ended its connection to the API endpoint, but will your server end its connection with AIBot?

If you used the eager `for await (...)` approach, then the connection is still running and your server is asking for more and more data from AIBot. Our server spawned a "thread" and there's no signal when we can end the eager pulls. Eventually, the server is going to run out of memory (remember, there's no active fetch connection to read the buffering responses and free them).

With the lazy approach, this is taken care of for you. Because the stream will only request new data from AIBot when the consumer requests it, navigating away from the page naturally frees all resources. The fetch connection aborts and the server can clean up the response. The `ReadableStream` tied to that response can now be garbage collected. When that happens, the connection it holds to AIBot can then be freed.

[Previous

Stopping Streams](/docs/advanced/stopping-streams)[Next

Caching](/docs/advanced/caching)
