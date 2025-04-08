# Short answer questions

## 1. How does the new language handle variable memory allocation, and what impact does this have on performance and memory safety?
### How It Works
JavaScript handles variable memory allocation automatically through **garbage collection**. Memory is allocated dynamically when variables are declared (e.g., `let`, `const`, `var`), and the JavaScript engine (e.g., V8 in Node.js) manages it using a mark-and-sweep algorithm. Objects, arrays, and functions are allocated on the heap, while primitives (numbers, strings, etc.) may be stored on the stack or heap depending on context (e.g., as part of an object).

### Management Type
- **Garbage Collection**: No manual memory management or ownership models like Rust. The garbage collector periodically identifies unreachable objects (those without references) and frees their memory.

### Impact on Performance and Safety
- **Performance**: Garbage collection introduces runtime overhead, as it pauses execution to reclaim memory. In my sentiment analysis program, this didn’t noticeably affect performance due to the small dataset, but in high-performance applications (e.g., real-time systems), these pauses could be a bottleneck.
- **Memory Safety**: Automatic management prevents dangling pointers (since there are no raw pointers) but can lead to **memory leaks** if references persist unintentionally (e.g., forgotten event listeners or global variables like `SSS`). In my code, the global `SSS` object remains in memory until the program exits, which is fine for a short-lived script but risky in long-running applications.
- **Efficiency**: No manual deallocation speeds up development but sacrifices fine-grained control over memory usage.

### Example: 
1. Automatic Memory Allocation
```
function createUser() {
  let user = {
    name: "Alice",
    age: 30,
  };
  return user;
}

let newUser = createUser();

```

2. Potential Memory Leak
```
let cache = {};

function remember(key, value) {
  cache[key] = value;
}

function forget(key) {
  delete cache[key];
}

// If you forget to call `forget`, memory stays in cache indefinitely
remember("user1", { name: "Bob" });
// Memory leak if the object isn't explicitly removed

```
## 2. Describe the language’s approach to type systems and type binding time. Is the language statically or dynamically typed, and how does that affect error detection and program flexibility?
JavaScript is **dynamically typed**, meaning type binding occurs at runtime. Variables can hold any type without prior declaration (e.g., `let x = 5; x = "hello";` is valid).

### Static vs. Dynamic Typing
- **Dynamic Typing**: Types are checked and resolved during execution, not compilation. This enhances flexibility—my program could process strings and numbers interchangeably without type constraints—but delays error detection to runtime.
- **Type Checking**: JavaScript performs **run-time type checking**. For example, `parseFloat(parts[1])` in `buildSocialSentimentTable` checks if a score is numeric at runtime, returning `NaN` if invalid, which I handled with a condition.

### Impact on Error Detection and Flexibility
- **Error Detection**: Errors like passing a string to a numeric operation (e.g., `SSS[word] + "not_a_number"`) surface only when executed, not during a compile phase. In my code, I added checks (e.g., `!isNaN(score)`) to mitigate this, but it’s less safe than static typing.
- **Flexibility**: Dynamic typing allowed quick prototyping of `SSS` as an object without defining a schema, which was helpful for the assignment’s exploratory nature.

'''
### Example
```javascript
let score = "0.03"; // String from CSV
score = parseFloat(score); // Becomes number at runtime
if (isNaN(score)) console.log("Invalid score");
// Helps: Easily converts types; Hinders: No compile-time guarantee of type correctness
```
- **Helps**: Flexibility in handling CSV data without strict type definitions.
- **Hinders**: Potential runtime errors if `socialsent.csv` has unexpected formats, reducing reliability without extra validation.

## 3. What are the subprogram calling conventions in the language? How are parameters passed (by value, by reference, etc.), and how does the return mechanism work?
### Parameter Passing
- **By Value**: Primitives (e.g., numbers, booleans) are passed by value. Changes inside a function don’t affect the caller’s variable.
- **By Reference (Sort Of)**: Objects and arrays are passed by sharing a reference. The reference itself is passed by value, but modifications to the object’s properties are visible outside. In my code, `SSS` is modified within `buildSocialSentimentTable` because it’s a global object.

### Return Mechanism
- Functions return a single value (or `undefined` if no `return` is specified) via the `return` statement. The caller receives this value immediately after the function completes. In `getSocialSentimentScore`, I return `totalScore` explicitly.

### Structure
- **Stack Frames**: Each function call creates a stack frame with its own scope, parameters, and local variables. When `getSocialSentimentScore` calls `console.log` for each word, the stack manages these nested calls.
- **Scope**: Lexical scoping applies—variables are accessible based on where the function is defined, not called. `SSS` is global, so all functions access it directly.
- **Features**: JavaScript supports:
  - **Default Arguments**: E.g., `function foo(x = 1) {}`.
  - **Variadic Functions**: Using the rest parameter (`...args`).
  - **First-Class Functions**: Functions can be passed as arguments or returned, though not used in my program.

### Example from Code
```javascript
function getSocialSentimentScore(reviewFilename) {
    let totalScore = 0.0;
    // totalScore is local, SSS is global; reviewFilename passed by value
    return totalScore;
}
```
- Parameters are simple values; `SSS` modifications persist due to its global scope.

## 4. How does the language manage variable scope and lifetime—particularly for local, global, and any other static variables, if any?
- **Local Variables**: Declared with `let` or `const` inside functions, they’re scoped to the block and destroyed when the block exits. In `getSocialSentimentScore`, `totalScore` is local and freed after the function returns.
- **Global Variables**: Declared outside functions or with `var` in global scope, they persist until the program ends. `SSS` is global and lives throughout execution.
- **Static Variables**: JavaScript doesn’t have true static variables, but variables in a module’s top-level scope (with `const`) mimic this behavior in Node.js.

### Accessibility and Destruction
- **Scope**: Block-scoped (`let`, `const`) or function-scoped (`var`). `SSS` is globally accessible because it’s defined outside any function.
- **Lifetime**: Local variables are garbage-collected when their scope ends and no references remain. Global variables like `SSS` last until the process exits.

### Example with Closure
```javascript
function createCounter() {
    let count = 0; // Captured in closure
    return function() {
        return ++count;
    };
}
const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
```
- `count` persists beyond its block due to the closure, showing how scope extends lifetime. In my program, I didn’t use closures, but `SSS`’s global nature avoids destruction until the end.

## 5. Identify one unique or innovative feature of the language and explain how it affects the way programmers write and structure code.
### Description
JavaScript treats functions as **first-class citizens**, meaning they can be assigned to variables, passed as arguments, and returned from other functions. This enables functional programming patterns like callbacks and higher-order functions.

### Impact on Coding
- **Structure**: Programmers can write concise, reusable code. For example, I could refactor `getSocialSentimentScore` to use a callback for logging:
  ```javascript
  function getSocialSentimentScore(reviewFilename, logCallback) {
      let totalScore = 0.0;
      const words = fs.readFileSync(reviewFilename, 'utf8').toLowerCase().match(/\b\w+\b/g) || [];
      words.forEach(word => {
          const score = SSS[word] || 0.0;
          totalScore += score;
          logCallback(word, score, totalScore);
      });
      return totalScore;
  }
  ```
- **Difference**: Unlike C’s function pointers, JavaScript’s first-class functions are more flexible and integrated with closures.

### Advantages and Trade-offs
- **Advantages**: Simplifies event-driven code (common in Node.js) and supports libraries like `Array.map`. Could’ve made my output logic more modular.
- **Trade-offs**: Overuse can obscure control flow, and performance may suffer with excessive function creation (though negligible in my small program).





# Social Sentiment Score Programming Assignment Report

## Abstract
For this assignment, I implemented a social sentiment analysis program in JavaScript, leveraging Node.js for file handling and command-line capabilities. JavaScript, typically known as a browser-based language, proved versatile for this task with its object-based data structures and built-in regular expression support, making it suitable for processing text files and calculating sentiment scores.

## Approach
The program is structured to meet all requirements with a modular design:
- **Data Structure**: A global object (`SSS`) serves as a dictionary to store word-score pairs from `socialsent.csv`.
- **Subprograms**:
  1. `buildSocialSentimentTable(filename)`: Reads `socialsent.csv` synchronously using `fs.readFileSync`, splits each line on commas, and populates `SSS` with the first two elements (word and score), ignoring extras to handle malformed data.
  2. `getSocialSentimentScore(reviewFilename)`: Reads the review file, tokenizes text using a regex (`/\b\w+\b/g`), looks up scores in `SSS`, and accumulates the total while printing intermediate results.
  3. `getStarRating(score)`: Uses a multi-way if-else structure to convert the final score into a 1-5 star rating based on the specified scale.
- **File Handling**: Utilizes Node.js’s `fs` module for synchronous file reading, wrapped in try-catch blocks for error handling.
- **Command-Line Support**: Accepts a review file name via `process.argv[2]`, defaulting to `review.txt`.
- **Output**: Formats each word’s score and running total as `[word: current_score, accumulated_score]`, followed by the final score and star rating.

The algorithm processes `socialsent.csv` once to build the sentiment table, then analyzes the review file word-by-word, summing scores and mapping the total to stars.

## New Learnings
- **Node.js File I/O**: I learned to use `fs.readFileSync` for synchronous file reading, which simplified the flow compared to async alternatives like promises or callbacks.
- **Regex in JS**: The `match(/\b\w+\b/g)` method for tokenization was new to me, offering a clean way to split text across multiple delimiters.
- **Error Handling**: Using try-catch with `process.exit(1)` for fatal errors (e.g., file not found) was a practical approach I hadn’t used much before.

## Unique Features of JavaScript
- **Object as Dictionary**: JavaScript objects natively support key-value pairs, making `SSS` an intuitive choice without needing external libraries.
- **Dynamic Typing**: No need to declare types for variables, which sped up coding but required careful validation (e.g., `parseFloat` checks).
- **No Built-in Switch Fallthrough**: Unlike C, JS switch statements don’t fall through by default, so I used if-else for `getStarRating`, which was more readable here.

## Features I Liked
- **Simplicity of Node.js**: The `fs` module made file handling straightforward, and `process.argv` was easy for command-line args.
- **Regex Support**: Built-in regex with `match()` was powerful for tokenizing text without extra dependencies.
- **Flexibility**: JavaScript’s loose typing allowed quick prototyping of the solution.

## Features I Did Not Like
- **Synchronous I/O**: Using `fs.readFileSync` felt less “JavaScript-like” compared to async patterns, though it fit the assignment’s needs.
- **Global Object**: The global `SSS` object works but feels less encapsulated; a module or class might be cleaner in a larger project.
- **No Native Decimal Formatting**: Relying on `toFixed(2)` for two-decimal output is less elegant than Python’s `:.2f`.

## Special Notes
I used ChatGPT, an AI assistant to help develop this solution. I used to structuring the initial code and ensuring all requirements were met. The tool accelerated my work, but I manually refined the output formatting and tested with sample files (`review.txt`, `good.txt`, `bad.txt`) to match the expected output. 





# Print seperate output command in terminal:- node socialsentscore.js bad.txt