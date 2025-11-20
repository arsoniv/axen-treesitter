/**
 * @file Axenlang grammar for tree-sitter
 * @author Arsoniv <arsonivalt@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "axenlang",

  conflicts: $ => [
    [$.class_reference, $.variable_reference],
    [$.lvalue, $.primary_expression],
    [$.array_access, $.pointer_index_access],
  ],

  extras: $ => [
    /\s/,
    $.comment,
  ],

  rules: {
    source_file: $ => repeat(choice(
      $.import_statement,
      $.class_declaration,
      $.typedef_declaration,
      $.intdef_declaration,
      $.function_declaration,
    )),

    comment: $ => token(choice(
      seq('//', /.*/),
      seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/')
    )),

    // Import statements
    import_statement: $ => seq(
      'import',
      field('path', $.string_literal),
      ';'
    ),

    // Typedef declarations
    typedef_declaration: $ => seq(
      'typedef',
      field('alias', $.identifier),
      field('target', $.type),
      ';'
    ),

    // intdef declarations
    intdef_declaration: $ => seq(
      'intdef',
      field('alias', $.identifier),
      field('target', $.int_literal),
      ';'
    ),

    // Class declarations
    class_declaration: $ => seq(
      'class',
      field('name', $.identifier),
      '{',
      repeat($.member_declaration),
      '}'
    ),

    member_declaration: $ => choice(
      $.field_declaration,
      $.method_declaration,
    ),

    field_declaration: $ => seq(
      field('type', $.type),
      field('name', $.identifier),
      ';'
    ),

    method_declaration: $ => seq(
      field('return_type', $.type),
      field('name', $.identifier),
      '(',
      optional($.parameter_list),
      ')',
      choice(
        ';',
        field('body', $.block)
      )
    ),

    // Function declarations
    function_declaration: $ => seq(
      field('return_type', $.type),
      field('name', $.identifier),
      '(',
      optional($.parameter_list),
      ')',
      choice(
        ';',
        field('body', $.block)
      )
    ),

    parameter_list: $ => seq(
      $.parameter,
      repeat(seq(',', $.parameter))
    ),

    parameter: $ => seq(
      field('type', $.type),
      field('name', $.identifier)
    ),

    // Types
    type: $ => choice(
      $.primitive_type,
      $.pointer_type,
      $.function_pointer_type,
      $.array_type,
      $.class_reference,
    ),

    primitive_type: $ => choice(
      'void',
      'bool',
      'char',
      'uchar',
      'short',
      'ushort',
      'int',
      'uint',
      'long',
      'ulong',
      'half',
      'float',
      'double',
      'quad',
    ),

    pointer_type: $ => prec(1, seq(
      'ptr',
      field('target', $.type)
    )),

    function_pointer_type: $ => prec(3, seq(
      'ptr',
      field('return_type', $.type),
      '(',
      optional($.function_pointer_parameter_list),
      ')'
    )),

    function_pointer_parameter_list: $ => seq(
      $.type,
      repeat(seq(',', $.type))
    ),

    array_type: $ => prec(2, seq(
      field('element_type', $.type),
      '[',
      field('length', $.int_literal),
      ']'
    )),

    class_reference: $ => $.identifier,

    // Statements
    block: $ => seq(
      '{',
      repeat($.statement),
      '}'
    ),

    statement: $ => choice(
      $.variable_declaration,
      $.assignment_statement,
      $.return_statement,
      $.if_statement,
      $.while_statement,
      $.expression_statement,
      $.block,
    ),

    variable_declaration: $ => seq(
      field('type', $.type),
      field('name', $.identifier),
      optional(seq('=', field('value', $.expression))),
      ';'
    ),

    assignment_statement: $ => seq(
      field('target', $.lvalue),
      '=',
      field('value', $.expression),
      ';'
    ),

    return_statement: $ => seq(
      'return',
      optional(field('value', $.expression)),
      ';'
    ),

    if_statement: $ => seq(
      'if',
      '(',
      field('condition', $.expression),
      ')',
      field('consequence', $.block),
      optional(seq('else', field('alternative', $.block)))
    ),

    while_statement: $ => seq(
      'while',
      '(',
      field('condition', $.expression),
      ')',
      field('body', $.block)
    ),

    expression_statement: $ => seq(
      $.expression,
      ';'
    ),

    // LValues
    lvalue: $ => choice(
      $.variable_reference,
      $.struct_access,
      $.array_access,
      $.pointer_index_access,
      $.dereference,
    ),

    // Expressions
    expression: $ => choice(
      $.binary_expression,
      $.primary_expression,
    ),

    primary_expression: $ => choice(
      $.int_literal,
      $.float_literal,
      $.string_literal,
      $.nullptr_literal,
      $.variable_reference,
      $.function_call,
      $.struct_access,
      $.array_access,
      $.pointer_index_access,
      $.dereference,
      $.address_of,
      $.parenthesized_expression,
    ),

    binary_expression: $ => choice(
      prec.left(1, seq(
        field('left', $.expression),
        field('operator', '='),
        field('right', $.expression)
      )),
      prec.left(2, seq(
        field('left', $.expression),
        field('operator', '<'),
        field('right', $.expression)
      )),
      prec.left(2, seq(
        field('left', $.expression),
        field('operator', '>'),
        field('right', $.expression)
      )),
      prec.left(3, seq(
        field('left', $.expression),
        field('operator', '+'),
        field('right', $.expression)
      )),
      prec.left(3, seq(
        field('left', $.expression),
        field('operator', '-'),
        field('right', $.expression)
      )),
      prec.left(4, seq(
        field('left', $.expression),
        field('operator', '*'),
        field('right', $.expression)
      )),
      prec.left(4, seq(
        field('left', $.expression),
        field('operator', '/'),
        field('right', $.expression)
      )),
      prec.left(4, seq(
        field('left', $.expression),
        field('operator', '%'),
        field('right', $.expression)
      )),
    ),

    variable_reference: $ => field('name', $.identifier),

    function_call: $ => seq(
      field('function', $.identifier),
      '(',
      optional($.argument_list),
      ')'
    ),

    argument_list: $ => seq(
      $.expression,
      repeat(seq(',', $.expression))
    ),

    struct_access: $ => prec.left(5, seq(
      field('object', $.expression),
      '.',
      field('field', $.identifier)
    )),

    array_access: $ => prec.left(5, seq(
      field('array', $.expression),
      '[',
      field('index', $.expression),
      ']'
    )),

    pointer_index_access: $ => prec.left(5, seq(
      field('pointer', $.expression),
      '[',
      field('index', $.expression),
      ']'
    )),

    dereference: $ => prec(6, seq(
      '$',
      field('target', $.expression)
    )),

    address_of: $ => prec(6, seq(
      '&',
      field('target', $.expression)
    )),

    parenthesized_expression: $ => seq(
      '(',
      $.expression,
      ')'
    ),

    int_literal: $ => choice(
      $.hex_literal,
      $.decimal_literal,
    ),

    hex_literal: $ => token(/0[xX][0-9a-fA-F]+u?/),

    decimal_literal: $ => token(/[0-9]+u?/),

    float_literal: $ => /[0-9]+\.[0-9]+u?/,

    nullptr_literal: $ => 'nullptr',

    string_literal: $ => seq(
      '"',
      repeat(choice(
        /[^"\\]/,
        seq('\\', /./),
      )),
      '"'
    ),

    identifier: $ => /[a-zA-Z][a-zA-Z0-9]*/,
  }
});
