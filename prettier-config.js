module.exports = {
    singleQuote: true,
    printWidth: 120,
    tabWidth: 2,
    bracketSpacing: true,
    /*
      Print trailing commas wherever possible in multi-line comma-separated syntactic structures.
      (A single-line array, for example, never gets trailing commas.)
      Set to all, it is Very usefull for git diffs.
    */
    trailingComma: "all",
    /*
      Prints semicolons at the ends of statements.
      
      When JavaScript encounters a line break without a semicolon, it uses a set of rules called
      Automatic Semicolon Insertion to determine whether it should regard that line break as the end of a statement,
      and (as the name implies) place a semicolon into your code before the line break if it thinks so.
      ASI contains a few eccentric behaviors, though, and your code will break if JavaScript misinterprets your line break.
      These rules will become more complicated as new features become a part of JavaScript.
      Explicitly terminating your statements and configuring your linter to catch missing semicolons will help prevent you from encountering issues.
    */
    semi: true,
    /*
      Line Feed only (\n), common on Linux and macOS as well as inside git repos
    */
    endOfLine: "lf",
    /*
      Enforce single attribute per line in HTML, Vue and JSX.
    */
    singleAttributePerLine: true,
    /*
      Put the > of a multi-line HTML (HTML, JSX, Vue, Angular)
      element at the end of the last line instead of being alone on the next line.
    */
    bracketSameLine: true
  }