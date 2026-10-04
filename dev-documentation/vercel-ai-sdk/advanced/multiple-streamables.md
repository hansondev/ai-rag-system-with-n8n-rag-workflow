---
title: "Multiple Streams"
source_url: https://ai-sdk.dev/docs/advanced/multiple-streamables
section: advanced
crawled: 2026-09-20
---

# Multiple Streams

> Source: https://ai-sdk.dev/docs/advanced/multiple-streamables

[Advanced](/docs/advanced)Multiple Streamables


[Multiple Streams](#multiple-streams)
=====================================

[Multiple Streamable UIs](#multiple-streamable-uis)
---------------------------------------------------

The AI SDK RSC APIs allow you to compose and return any number of streamable UIs, along with other data, in a single request. This can be useful when you want to decouple the UI into smaller components and stream them separately.

```
1

'use server';



2



3

import { createStreamableUI } from '@ai-sdk/rsc';



4



5

export async function getWeather() {



6

const weatherUI = createStreamableUI();



7

const forecastUI = createStreamableUI();



8



9

weatherUI.update(<div>Loading weather...</div>);



10

forecastUI.update(<div>Loading forecast...</div>);



11



12

getWeatherData().then(weatherData => {



13

weatherUI.done(<div>{weatherData}</div>);



14

});



15



16

getForecastData().then(forecastData => {



17

forecastUI.done(<div>{forecastData}</div>);



18

});



19



20

// Return both streamable UIs and other data fields.



21

return {



22

requestedAt: Date.now(),



23

weather: weatherUI.value,



24

forecast: forecastUI.value,



25

};



26

}
```

The client side code is similar to the previous example, but the [tool call](/docs/ai-sdk-core/tools-and-tool-calling) will return the new data structure with the weather and forecast UIs. Depending on the speed of getting weather and forecast data, these two components might be updated independently.

[Nested Streamable UIs](#nested-streamable-uis)
-----------------------------------------------

You can stream UI components within other UI components. This allows you to create complex UIs that are built up from smaller, reusable components. In the example below, we pass a `historyChart` streamable as a prop to a `StockCard` component. The StockCard can render the `historyChart` streamable, and it will automatically update as the server responds with new data.

```
1

async function getStockHistoryChart({ symbol: string }) {



2

'use server';



3



4

const ui = createStreamableUI(<Spinner />);



5



6

// We need to wrap this in an async IIFE to avoid blocking.



7

(async () => {



8

const price = await getStockPrice({ symbol });



9



10

// Show a spinner as the history chart for now.



11

const historyChart = createStreamableUI(<Spinner />);



12

ui.done(<StockCard historyChart={historyChart.value} price={price} />);



13



14

// Getting the history data and then update that part of the UI.



15

const historyData = await fetch('https://my-stock-data-api.com');



16

historyChart.done(<HistoryChart data={historyData} />);



17

})();



18



19

return ui;



20

}
```

[Previous

Caching](/docs/advanced/caching)[Next

Rate Limiting](/docs/advanced/rate-limiting)
