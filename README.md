
# metrics
**This is a work in progress.**

It's an experiment about lightweight & composable metrics lib meant to be used in microservices.

*Warning !! It is not completed yet and everything is subject to change*

## Install

    yarn add @geekagency/metrics


## Principles

Each metrics use its own store.
Sometimes you just want to benchmark something, sometimes you just want to send it to another microservices for archiving and/or monitoring.

The idea is to compose your own metrics architecture.

## Example

    const averageMetric = require('@geekagency/metrics/averageMetric').default;
	const {store} = require('@geekagency/metrics/store')

	let averageMetricStore = store();
	let average = averageMetric().average;

	function function_that_is_called_repeatidly ( ) {
		average(averageMetricStore)
	}


## Todo
* combineMetrics
* rename combineActionTypes to something else.
