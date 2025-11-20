[
  "import"
  "typedef"
  "intdef"
  "class"
  "return"
  "if"
  "else"
  "while"
] @keyword

[
  "void"
  "bool"
  "char"
  "uchar"
  "short"
  "ushort"
  "int"
  "uint"
  "long"
  "ulong"
  "half"
  "float"
  "double"
  "quad"
  "ptr"
] @type.builtin

(function_declaration
  name: (identifier) @function)

(method_declaration
  name: (identifier) @function.method)

(function_call
  function: (identifier) @function.call)

(class_declaration
  name: (identifier) @type)

(class_reference) @type

(function_pointer_type) @type

(typedef_declaration
  alias: (identifier) @type.definition)

(intdef_declaration
  alias: (identifier) @type.definition)

(parameter
  name: (identifier) @variable.parameter)

(field_declaration
  name: (identifier) @variable.member)

(struct_access
  field: (identifier) @variable.member)

(variable_declaration
  name: (identifier) @variable)

(variable_reference
  name: (identifier) @variable)

(hex_literal) @number.hex
(decimal_literal) @number
(float_literal) @number.float
(string_literal) @string
(nullptr_literal) @constant.builtin

[
  "="
  "+"
  "-"
  "*"
  "/"
  "%"
  "<"
  ">"
  "$"
  "&"
] @operator

[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket

[
  ";"
  ","
  "."
] @punctuation.delimiter

(comment) @comment

