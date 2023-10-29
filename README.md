# canvas-test

A utility for visually testing HTML canvas applications. Note, this is not intended to be a replacement for other canvas testing utilities, but rather a tool to help you manage and build test cases and maintain known good states.


## How to write tests

1. Install the package: `npm install @blparker/canvas-test`.
2. Create a folder in the root of your workspace named `test-cases`.
3. Create a class in `test-cases` that extends from `TestSuite` (see below).
4. Start the UI: `canvas-test`.

## Writing a test suite

Create a file under the `test-cases` directory. For example:

```javascript
class MyTests extends TestSuite {
   testDrawALine(canvas, done) {
      const ctx = canvas.getContext('2d');
      ctx.moveTo(100, 100);
      ctx.lineTo(200, 200);

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.stroke();
   }
}
```

**Note**: for tests to be rendered in the tool, they must be prefixed with `test`.

## Using the tool

Test cases get rendered in a UI which is served from the package directory, running on port `8000`:


