# Ulam Spiral Simulator with Sieve of Erathostenes

This is the fastest simulator of Ulam Spiral because it use the Sieve of Eratosthenes to calculate the primes and because all calculus are done without manipulating the DOM tree. After all calculus are finished, the points are printed in a canvas element.

You can set the size of the dots, the distance between them, their colors and set the spiral will fill the window.

See a demo here: https://glauber.ml/static/ulam-spiral/

## Features

* React 16
* Webpack 4
* Babel
* Hot Module Replacement

## Installation

* `git clone git@github.com:glaubermagal/UlamSpiralSimulator.git`
* cd UlamSpiralSimulator
* npm install
* npm dev (for development)
* npm build (for production)
* visit `http://localhost:8080/`

## Warning!

If you insert very low values in the `Point Size`, your browser may freeze because it'll use more memory to process the prime numbers. So, decrease this number carefully.