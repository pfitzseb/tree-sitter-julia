// ref: https://github.com/JuliaLang/julia/blob/master/src/julia-parser.scm

// operator precedence ()
const PREC = {
  ASSIGNMENT: 1,
  PAIR: 2,
  CONDITIONAL: 3,
  ARROW: 4,
  LAZY_OR: 5,
  LAZY_AND: 6,
  COMPARISON: 7,
  PIPE_LEFT: 8,
  PIPE_RIGHT: 9,
  COLON: 10,
  PLUS: 11,
  BITSHIFT: 12,
  TIMES: 13,
  RATIONAL: 14,
  UNARY: 15,
  POWER: 16,
  DECL: 17,
  DOT: 18
}

module.exports = grammar({
  name: 'julia',

  rules: {
    program: $ => repeat(choice($._statement, $._expression)),
    identifier: $ =>  /[a-zA-Z_$][a-zA-Z\d_$]*/,
    assignment: $ => seq($.identifier, '=', $.identifier),
    macro: $ => seq('@', $.identifier),

    _statement: $ => choice(
      // $.identifier,
      // $.macro,
      $.assignment,
      // $.return_statement,
    ),

    _expression: $ => choice(
      $.function_call,
  // $.unary_expression,
      $.binary_expression
    ),

    return_statement: $ => seq('return', $.identifier),

    function_call: $ => seq($.identifier, /*optional\('\.'\),*/ '(', commaSep1(repeat($._expression)), ')'),

  unary_expression: $ => choice(
  prec(PREC.UNARY, seq(/*optional\('\.'\),*/ '+', $._expression)),
  prec.left(PREC.UNARY, seq(/*optional\('\.'\),*/ '-', $._expression)),
  prec.right(PREC.UNARY, seq(/*optional\('\.'\),*/ '!', $._expression)),
  prec.right(PREC.UNARY, seq(/*optional\('\.'\),*/ '~', $._expression)),
  prec.right(PREC.UNARY, seq(/*optional\('\.'\),*/ '¬', $._expression)),
  prec.right(PREC.UNARY, seq(/*optional\('\.'\),*/ '√', $._expression)),
  prec.right(PREC.UNARY, seq(/*optional\('\.'\),*/ '∛', $._expression)),
  prec.right(PREC.UNARY, seq(/*optional\('\.'\),*/ '∜', $._expression)),
  prec.right(PREC.UNARY, seq('<:', $._expression)),
  prec.right(PREC.UNARY, seq('>:', $._expression)),
  ),

    binary_expression: $ => choice(
      ...[
        '=','+=','-=','*=','/=','//=','|\\=|','^=','÷=','%=','<<=','>>=','>>>=',
        '|\|=|','&=','⊻=','≔','⩴','≕'
      ].map((operator) =>
        prec.right(PREC.ASSIGNMENT, seq($._expression, /*optional\('\.'\),*/ operator, $._expression))
      ),
      ...[
        ':=',
        '~',
        '$=',
      ].map((operator) =>
         prec.right(PREC.ASSIGNMENT, seq($._expression, operator, $._expression))
      ),
      prec.left(PREC.PAIR, seq($._expression, '=>', $._expression)),
      prec.left(PREC.CONDITIONAL, seq($._expression, '?', $._expression)),
      ...[
        '--',
        '-->',
      ].map((operator) =>
        prec.right(PREC.ARROW, seq($._expression, operator, $._expression))
      ),
      ...[
        '←','→','↔','↚','↛','↞','↠','↢','↣','↦','↤','↮','⇎','⇍','⇏','⇐','⇒',
        '⇔','⇴','⇶','⇷','⇸','⇹','⇺','⇻','⇼','⇽','⇾','⇿','⟵','⟶','⟷','⟹',
        '⟺','⟻','⟼','⟽','⟾','⟿','⤀','⤁','⤂','⤃','⤄','⤅','⤆','⤇','⤌','⤍',
        '⤎','⤏','⤐','⤑','⤔','⤕','⤖','⤗','⤘','⤝','⤞','⤟','⤠','⥄','⥅','⥆','⥇',
        '⥈','⥊','⥋','⥎','⥐','⥒','⥓','⥖','⥗','⥚','⥛','⥞','⥟','⥢','⥤','⥦','⥧',
        '⥨','⥩','⥪','⥫','⥬','⥭','⥰','⧴','⬱','⬰','⬲','⬳','⬴','⬵','⬶','⬷','⬸','⬹',
        '⬺','⬻','⬼','⬽','⬾','⬿','⭀','⭁','⭂','⭃','⭄','⭇','⭈','⭉','⭊','⭋','⭌','￩','￫',
        '⇜','⇝','↜','↝','↩','↪','↫','↬','↼','↽','⇀','⇁','⇄','⇆','⇇','⇉','⇋',
        '⇌','⇚','⇛','⇠','⇢'
      ].map((operator) =>
        prec.right(PREC.ARROW, seq($._expression, /*optional\('\.'\),*/ operator, $._expression))
      ),
      prec.left(PREC.LAZY_OR, seq($._expression, '||', $._expression)),
      prec.right(PREC.LAZY_AND, seq($._expression, '&&', $._expression)),
      ...[
        '<:',
        ':>',
        'in',
        'isa',
      ].map((operator) =>
        prec.right(PREC.COMPARISON, seq($._expression, operator, $._expression))
      ),
      ...[
        '>','<','>=','≥','<=','≤','==','===','≡','!=','≠','!==','≢','∈','∉','∋',
        '∌','⊆','⊈','⊂','⊄','⊊','∝','∊','∍','∥','∦','∷','∺','∻','∽','∾','≁',
        '≃','≄','≅','≆','≇','≈','≉','≊','≋','≌','≍','≎','≐','≑','≒','≓','≖',
        '≗','≘','≙','≚','≛','≜','≝','≞','≟','≣','≦','≧','≨','≩','≪','≫','≬',
        '≭','≮','≯','≰','≱','≲','≳','≴','≵','≶','≷','≸','≹','≺','≻','≼','≽',
        '≾','≿','⊀','⊁','⊃','⊅','⊇','⊉','⊋','⊏','⊐','⊑','⊒','⊜','⊩','⊬','⊮',
        '⊰','⊱','⊲','⊳','⊴','⊵','⊶','⊷','⋍','⋐','⋑','⋕','⋖','⋗','⋘','⋙',
        '⋚','⋛','⋜','⋝','⋞','⋟','⋠','⋡','⋢','⋣','⋤','⋥','⋦','⋧','⋨','⋩','⋪',
        '⋫','⋬','⋭','⋲','⋳','⋴','⋵','⋶','⋷','⋸','⋹','⋺','⋻','⋼','⋽','⋾','⋿',
        '⟈','⟉','⟒','⦷','⧀','⧁','⧡','⧣','⧤','⧥','⩦','⩧','⩪','⩫','⩬','⩭','⩮','⩯','⩰'
        ,'⩱','⩲','⩳','⩵','⩶','⩷','⩸','⩹','⩺','⩻','⩼','⩽','⩾','⩿','⪀','⪁','⪂','⪃',
        '⪄','⪅','⪆','⪇','⪈','⪉','⪊','⪋','⪌','⪍','⪎','⪏','⪐','⪑','⪒','⪓','⪔',
        '⪕','⪖','⪗','⪘','⪙','⪚','⪛','⪜','⪝','⪞','⪟','⪠','⪡','⪢','⪣','⪤','⪥','⪦',
        '⪧','⪨','⪩','⪪','⪫','⪬','⪭','⪮','⪯','⪰','⪱','⪲','⪳','⪴','⪵','⪶','⪷','⪸',
        '⪹','⪺','⪻','⪼','⪽','⪾','⪿','⫀','⫁','⫂','⫃','⫄','⫅','⫆','⫇','⫈','⫉','⫊','⫋',
        '⫌','⫍','⫎','⫏','⫐','⫑','⫒','⫓','⫔','⫕','⫖','⫗','⫘','⫙','⫷','⫸','⫹','⫺',
        '⊢','⊣','⟂',
      ].map((operator) =>
    // FIXME: Should actually have no special associativity
        prec.right(PREC.COMPARISON, seq($._expression, /*optional\('\.'\),*/ operator, $._expression))
      ),
      ...[
        '.<|',
        '<|',
      ].map((operator) =>
        prec.right(PREC.PIPE_LEFT, seq($._expression, operator, $._expression))
      ),
      ...[
        '.|>',
        '|>',
      ].map((operator) =>
        prec.right(PREC.PIPE_RIGHT, seq($._expression, operator, $._expression))
      ),
      ...[
        '..',
        ':'
      ].map((operator) =>
        prec.left(PREC.COLON, seq($._expression, operator, $._expression))
      ),
      ...[
        '…',
        '⁝',
        '⋮',
        '⋱',
        '⋰',
        '⋯',
      ].map((operator) =>
        prec.left(PREC.COLON, seq($._expression, /*optional\('\.'\),*/ operator, $._expression))
      ),
      prec.left(PREC.PLUS, seq($._expression, '$', $._expression)),
      ...[
        '+','-','|','⊕','⊖','⊞','⊟','++','∪','∨','⊔','±','∓','∔','∸','≂',
        '≏','⊎','⊻','⊽','⋎','⋓','⧺','⧻','⨈','⨢','⨣','⨤','⨥','⨦','⨧','⨨','⨩','⨪',
        '⨫','⨬','⨭','⨮','⨹','⨺','⩁','⩂','⩅','⩊','⩌','⩏','⩐','⩒','⩔','⩖','⩗',
        '⩛','⩝','⩡','⩢','⩣',
      ].map((operator) =>
        prec.left(PREC.PLUS, seq($._expression, /*optional\('\.'\),*/ operator, $._expression))
      ),
      ...[
        '<<',
        '>>',
        '>>>'
      ].map((operator) =>
        prec.left(PREC.BITSHIFT, seq($._expression, operator, $._expression))
      ),
      ...[
        '*','/','÷','%','&','⋅','∘','×','|\\|','∩','∧','⊗','⊘','⊙','⊚','⊛','⊠',
        '⊡','⊓','∗','∙','∤','⅋','≀','⊼','⋄','⋆','⋇','⋉','⋊','⋋','⋌','⋏','⋒',
        '⟑','⦸','⦼','⦾','⦿','⧶','⧷','⨇','⨰','⨱','⨲','⨳','⨴','⨵','⨶','⨷','⨸','⨻',
        '⨼','⨽','⩀','⩃','⩄','⩋','⩍','⩎','⩑','⩓','⩕','⩘','⩚','⩜','⩞','⩟','⩠','⫛',
        '⊍','▷','⨝','⟕','⟖','⟗',
      ].map((operator) =>
        prec.left(PREC.TIMES, seq($._expression, /*optional\('\.'\),*/ operator, $._expression))
      ),
      prec.left(PREC.RATIONAL, seq($._expression, '//', $._expression)),
      ...[
        '^','↑','↓','⇵','⟰','⟱','⤈','⤉','⤊','⤋','⤒','⤓','⥉','⥌','⥍','⥏','⥑',
        '⥔','⥕','⥘','⥙','⥜','⥝','⥠','⥡','⥣','⥥','⥮','⥯','￪','￬',
      ].map((operator) =>
        prec.right(PREC.TIMES, seq($._expression, /*optional\('\.'\),*/ operator, $._expression))
      ),
      prec.left(PREC.DECL, seq($._expression, '::', $._expression)),
      prec.left(PREC.DOT, seq($._expression, '.', $._expression)),
    )

    // arguments: $ => seq($.identifier, ),
    //
    // typeassert: $ => seq($.identifier, $.typeassert_op, $.identifier),
    //
    // typeassert_op: $ => choice('::', '<:', '>:')
  }
});

function commaSep1 (rule) {
  return seq(rule, repeat(seq(',', rule)));
}

function commaSep (rule) {
  return optional(commaSep1(rule));
}
